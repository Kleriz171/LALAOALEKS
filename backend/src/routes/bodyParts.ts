import { Router, Request, Response } from 'express';
import prisma from '../lib/prisma';

const router = Router();

router.get('/', async (req: Request, res: Response) => {
  try {
    const { category, search } = req.query;

    const where: any = {};

    if (category && typeof category === 'string') {
      where.category = category;
    }

    if (search && typeof search === 'string') {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } }
      ];
    }

    const bodyParts = await prisma.bodyPart.findMany({
      where,
      include: {
        exercises: {
          include: {
            exercise: {
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

    res.status(200).json({ data: bodyParts });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const bodyPart = await prisma.bodyPart.findUnique({
      where: { id },
      include: {
        exercises: {
          include: {
            exercise: {
              select: {
                id: true,
                name: true,
                category: true,
                description: true,
                difficulty: true,
                equipment: true,
              }
            }
          },
          orderBy: {
            activationRank: 'asc'
          }
        }
      }
    });

    if (!bodyPart) {
      return res.status(404).json({ error: 'Body part not found' });
    }

    const transformedBodyPart = {
      ...bodyPart,
      exercises: bodyPart.exercises.map((eb: any) => ({
        id: eb.exercise.id,
        name: eb.exercise.name,
        category: eb.exercise.category,
        description: eb.exercise.description,
        difficulty: eb.exercise.difficulty,
        equipment: eb.exercise.equipment,
        activationRating: eb.activationRank ? (100 - (eb.activationRank * 10)) : null,
      })),
    };

    res.status(200).json({ data: transformedBodyPart });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
