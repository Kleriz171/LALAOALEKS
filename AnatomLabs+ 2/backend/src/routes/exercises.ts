import { Router, Request, Response } from 'express';
import prisma from '../lib/prisma';

const router = Router();

// GET /api/exercises
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

    res.status(200).json(exercises);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /api/exercises/:id
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

    res.status(200).json(exercise);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
