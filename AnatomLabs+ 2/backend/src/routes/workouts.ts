import { Router, Response } from 'express';
import prisma from '../lib/prisma';
import { authenticateToken, AuthRequest } from '../middleware/auth';
import { generateWorkoutPlan, WorkoutGenerationParams } from '../services/workoutGenerator';

const router = Router();

// POST /api/workouts/generate - Generate a new workout plan
router.post('/generate', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const { goal, experienceLevel, daysPerWeek, sport } = req.body;
    const userId = req.userId!;

    if (!goal || !experienceLevel || !daysPerWeek) {
      return res.status(400).json({
        error: 'goal, experienceLevel, and daysPerWeek are required'
      });
    }

    if (daysPerWeek < 2 || daysPerWeek > 6) {
      return res.status(400).json({
        error: 'daysPerWeek must be between 2 and 6'
      });
    }

    const params: WorkoutGenerationParams = {
      goal,
      experienceLevel,
      daysPerWeek,
      sport: sport || null
    };

    const workoutSplit = generateWorkoutPlan(params);

    const workoutPlan = await prisma.workoutPlan.create({
      data: {
        userId,
        name: workoutSplit.name,
        goal,
        daysPerWeek,
        experienceLevel,
        sport,
        description: workoutSplit.description,
        rationale: workoutSplit.rationale,
      }
    });

    const workouts = await Promise.all(
      workoutSplit.workouts.map(async (day) => {
        const workout = await prisma.workout.create({
          data: {
            workoutPlanId: workoutPlan.id,
            dayName: day.dayName,
            dayOfWeek: day.dayOfWeek,
            split: day.split,
            focus: day.focus,
          }
        });

        await Promise.all(
          day.exercises.map(async (ex, index) => {
            await prisma.workoutExercise.create({
              data: {
                workoutId: workout.id,
                exerciseName: ex.exerciseName,
                sets: ex.sets,
                reps: ex.reps,
                rest: ex.rest,
                notes: ex.notes,
                targetMuscles: ex.targetMuscles,
                orderIndex: index,
              }
            });
          })
        );

        return workout;
      })
    );

    const fullPlan = await prisma.workoutPlan.findUnique({
      where: { id: workoutPlan.id },
      include: {
        workouts: {
          include: {
            exercises: {
              orderBy: { orderIndex: 'asc' }
            }
          },
          orderBy: { dayOfWeek: 'asc' }
        }
      }
    });

    res.status(201).json({
      message: 'Workout plan generated successfully',
      plan: fullPlan
    });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /api/workouts/plans - Get all workout plans for user
router.get('/plans', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId!;

    const plans = await prisma.workoutPlan.findMany({
      where: { userId },
      include: {
        workouts: {
          include: {
            exercises: {
              orderBy: { orderIndex: 'asc' }
            }
          },
          orderBy: { dayOfWeek: 'asc' }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    res.status(200).json(plans);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /api/workouts/plans/:id - Get workout plan by id
router.get('/plans/:id', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.userId!;

    const plan = await prisma.workoutPlan.findFirst({
      where: {
        id,
        userId
      },
      include: {
        workouts: {
          include: {
            exercises: {
              orderBy: { orderIndex: 'asc' }
            }
          },
          orderBy: { dayOfWeek: 'asc' }
        }
      }
    });

    if (!plan) {
      return res.status(404).json({ error: 'Workout plan not found' });
    }

    res.status(200).json(plan);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// DELETE /api/workouts/plans/:id - Delete workout plan
router.delete('/plans/:id', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.userId!;

    const plan = await prisma.workoutPlan.findFirst({
      where: {
        id,
        userId
      }
    });

    if (!plan) {
      return res.status(404).json({ error: 'Workout plan not found' });
    }

    await prisma.workoutPlan.delete({
      where: { id }
    });

    res.status(200).json({ message: 'Workout plan deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
