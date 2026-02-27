import { Router, Request, Response } from 'express';
import prisma from '../lib/prisma';

const router = Router();

router.get('/', async (req: Request, res: Response) => {
  try {
    const { category, difficulty, equipment, bodyPart, search } = req.query;

    const where: any = {};

    if (category && typeof category === 'string') {
      where.category = category;
    }

    if (difficulty && typeof difficulty === 'string') {
      where.difficulty = difficulty;
    }

    if (equipment && typeof equipment === 'string') {
      where.equipment = { has: equipment };
    }

    if (bodyPart && typeof bodyPart === 'string') {
      where.bodyParts = {
        some: {
          bodyPart: {
            id: bodyPart
          }
        }
      };
    }

    if (search && typeof search === 'string') {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } }
      ];
    }

    const exercises = await prisma.exercise.findMany({
      where,
      include: {
        bodyParts: {
          include: {
            bodyPart: {
              select: {
                id: true,
                name: true,
                category: true,
              }
            }
          },
          orderBy: {
            activationRank: 'asc'
          }
        }
      },
      orderBy: {
        name: 'asc'
      }
    });

    res.status(200).json({ data: exercises });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/for-muscle/:muscleId', async (req: Request, res: Response) => {
  try {
    const { muscleId } = req.params;

    const exerciseBodyParts = await prisma.exerciseBodyPart.findMany({
      where: {
        bodyPartId: muscleId
      },
      include: {
        exercise: {
          select: {
            id: true,
            name: true,
            category: true,
            difficulty: true,
            description: true,
            equipment: true,
          }
        }
      },
      orderBy: {
        activationRank: 'asc'
      }
    });

    const exercises = exerciseBodyParts.map((eb) => ({
      ...eb.exercise,
      activationRating: eb.activationRank ? (100 - (eb.activationRank * 10)) : null,
      activationDescription: eb.activationDescription,
    }));

    res.status(200).json({ data: exercises });
  } catch (error) {
    console.error('Error fetching exercises for muscle:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const exercise = await prisma.exercise.findUnique({
      where: { id },
      include: {
        bodyParts: {
          include: {
            bodyPart: {
              select: {
                id: true,
                name: true,
                category: true,
                description: true,
                anatomicalInfo: true,
              }
            }
          },
          orderBy: {
            activationRank: 'asc'
          }
        }
      }
    });

    if (!exercise) {
      return res.status(404).json({ error: 'Exercise not found' });
    }

    res.status(200).json({ data: exercise });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
