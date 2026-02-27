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

    // Fetch user's health profile for filtering
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        physicalLimitations: true,
        healthConditions: true
      }
    });

    const params: WorkoutGenerationParams = {
      goal,
      experienceLevel,
      daysPerWeek,
      sport: sport || null,
      // Include health context if user has conditions
      healthContext: (user?.physicalLimitations?.length || user?.healthConditions?.length)
        ? {
            physicalLimitations: user.physicalLimitations || [],
            medicalConditions: user.healthConditions || []
          }
        : undefined
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

    const dbExercises = await prisma.exercise.findMany({
      select: { id: true, name: true }
    });
    const exerciseNameToId = new Map<string, string>();
    dbExercises.forEach(e => {
      exerciseNameToId.set(e.name.toLowerCase(), e.id);
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
            const matchedId = exerciseNameToId.get(ex.exerciseName.toLowerCase()) || null;
            await prisma.workoutExercise.create({
              data: {
                workoutId: workout.id,
                exerciseName: ex.exerciseName,
                exerciseId: matchedId,
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
      plan: fullPlan,
      healthModifications: workoutSplit.healthModifications || null
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

// ========== WORKOUT SESSION ENDPOINTS ==========

// POST /api/workouts/sessions - Save a completed workout session
router.post('/sessions', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId!;
    const {
      name,
      startedAt,
      completedAt,
      duration,
      notes,
      totalVolume,
      totalSets,
      totalReps,
      musclesWorked,
      exercises,
      workoutPlanId,
    } = req.body;

    if (!name || !startedAt || duration === undefined) {
      return res.status(400).json({
        error: 'name, startedAt, and duration are required'
      });
    }

    const session = await prisma.workoutSession.create({
      data: {
        userId,
        name,
        startedAt: new Date(startedAt),
        completedAt: completedAt ? new Date(completedAt) : new Date(),
        duration,
        notes: notes || null,
        totalVolume: totalVolume || 0,
        totalSets: totalSets || 0,
        totalReps: totalReps || 0,
        musclesWorked: musclesWorked || [],
        workoutPlanId: workoutPlanId || null,
        exercises: {
          create: (exercises || []).map((ex: any, index: number) => ({
            exerciseName: ex.exerciseName,
            muscleGroup: ex.muscleGroup || 'other',
            orderIndex: index,
            setsData: JSON.stringify(ex.sets || []),
            totalVolume: ex.totalVolume || 0,
            maxWeight: ex.maxWeight || 0,
            maxReps: ex.maxReps || 0,
          }))
        }
      },
      include: {
        exercises: true
      }
    });

    res.status(201).json({
      message: 'Workout session saved successfully',
      session
    });
  } catch (error) {
    console.error('Save session error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /api/workouts/sessions - Get workout session history
router.get('/sessions', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId!;
    const { limit, offset } = req.query;

    const sessions = await prisma.workoutSession.findMany({
      where: { userId },
      include: {
        exercises: {
          orderBy: { orderIndex: 'asc' }
        }
      },
      orderBy: { completedAt: 'desc' },
      take: limit ? parseInt(limit as string) : 50,
      skip: offset ? parseInt(offset as string) : 0
    });

    // Parse setsData JSON for each exercise
    const sessionsWithParsedSets = sessions.map(session => ({
      ...session,
      exercises: session.exercises.map(ex => ({
        ...ex,
        sets: typeof ex.setsData === 'string' ? JSON.parse(ex.setsData) : ex.setsData
      }))
    }));

    res.status(200).json(sessionsWithParsedSets);
  } catch (error) {
    console.error('Get sessions error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /api/workouts/sessions/recent-names - Get recent workout names for quick start
router.get('/sessions/recent-names', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId!;
    const { limit } = req.query;

    // Get unique workout names from recent sessions
    const sessions = await prisma.workoutSession.findMany({
      where: { userId },
      select: { name: true, completedAt: true },
      orderBy: { completedAt: 'desc' },
      take: 50 // Get more to find unique names
    });

    // Get unique names preserving order (most recent first)
    const seenNames = new Set<string>();
    const uniqueNames: string[] = [];

    for (const session of sessions) {
      const normalizedName = session.name.trim();
      if (!seenNames.has(normalizedName.toLowerCase())) {
        seenNames.add(normalizedName.toLowerCase());
        uniqueNames.push(normalizedName);
        if (uniqueNames.length >= (limit ? parseInt(limit as string) : 6)) {
          break;
        }
      }
    }

    res.status(200).json({ names: uniqueNames });
  } catch (error) {
    console.error('Get recent names error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /api/workouts/sessions/:id - Get single workout session
router.get('/sessions/:id', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.userId!;

    const session = await prisma.workoutSession.findFirst({
      where: { id, userId },
      include: {
        exercises: {
          orderBy: { orderIndex: 'asc' }
        }
      }
    });

    if (!session) {
      return res.status(404).json({ error: 'Workout session not found' });
    }

    // Parse setsData JSON
    const sessionWithParsedSets = {
      ...session,
      exercises: session.exercises.map(ex => ({
        ...ex,
        sets: typeof ex.setsData === 'string' ? JSON.parse(ex.setsData) : ex.setsData
      }))
    };

    res.status(200).json(sessionWithParsedSets);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
