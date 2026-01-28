import { Router, Response } from 'express';
import prisma from '../lib/prisma';
import { authenticateToken, AuthRequest } from '../middleware/auth';
import { calculateNutritionPlan, UserPhysicalData } from '../services/nutritionCalculator';

const router = Router();

// POST /api/nutrition/calculate - Calculate nutrition targets
router.post('/calculate', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId!;

    const user = await prisma.user.findUnique({
      where: { id: userId }
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    if (!user.age || !user.gender || !user.weight || !user.height || !user.activityLevel || !user.goal) {
      return res.status(400).json({
        error: 'Please complete your profile (age, gender, weight, height, activityLevel, goal) to calculate nutrition targets'
      });
    }

    const physicalData: UserPhysicalData = {
      age: user.age,
      gender: user.gender as 'male' | 'female',
      weight: user.weight,
      height: user.height,
      activityLevel: user.activityLevel as any,
      fitnessGoal: user.goal as any
    };

    const targets = calculateNutritionPlan(physicalData);

    res.status(200).json(targets);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST /api/nutrition/log - Log food intake
router.post('/log', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId!;
    const { foodId, servings, mealType, date } = req.body;

    if (!foodId || !servings) {
      return res.status(400).json({
        error: 'foodId and servings are required'
      });
    }

    const food = await prisma.food.findUnique({
      where: { id: foodId }
    });

    if (!food) {
      return res.status(404).json({ error: 'Food not found' });
    }

    const log = await prisma.nutritionLog.create({
      data: {
        userId,
        foodId,
        servings,
        mealType: mealType || 'snack',
        date: date ? new Date(date) : new Date(),
        totalCalories: food.calories * servings,
        totalProtein: food.protein * servings,
        totalCarbs: food.carbs * servings,
        totalFat: food.fat * servings,
      },
      include: {
        food: true
      }
    });

    res.status(201).json({
      message: 'Food logged successfully',
      log
    });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /api/nutrition/logs - Get nutrition logs
router.get('/logs', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId!;
    const { startDate, endDate } = req.query;

    const where: any = { userId };

    if (startDate && endDate) {
      where.date = {
        gte: new Date(startDate as string),
        lte: new Date(endDate as string)
      };
    }

    const logs = await prisma.nutritionLog.findMany({
      where,
      include: {
        food: true
      },
      orderBy: {
        date: 'desc'
      }
    });

    res.status(200).json(logs);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /api/nutrition/summary - Get nutrition summary for a date range
router.get('/summary', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId!;
    const { startDate, endDate } = req.query;

    if (!startDate || !endDate) {
      return res.status(400).json({
        error: 'startDate and endDate are required'
      });
    }

    const logs = await prisma.nutritionLog.findMany({
      where: {
        userId,
        date: {
          gte: new Date(startDate as string),
          lte: new Date(endDate as string)
        }
      }
    });

    const summary = {
      totalCalories: logs.reduce((sum, log) => sum + (log.totalCalories || 0), 0),
      totalProtein: logs.reduce((sum, log) => sum + (log.totalProtein || 0), 0),
      totalCarbs: logs.reduce((sum, log) => sum + (log.totalCarbs || 0), 0),
      totalFat: logs.reduce((sum, log) => sum + (log.totalFat || 0), 0),
      logCount: logs.length
    };

    res.status(200).json(summary);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /api/nutrition/foods - Get all foods
router.get('/foods', async (req, res: Response) => {
  try {
    const { search, category } = req.query;

    const where: any = {};

    if (search && typeof search === 'string') {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { category: { contains: search, mode: 'insensitive' } }
      ];
    }

    if (category && typeof category === 'string') {
      where.category = category;
    }

    const foods = await prisma.food.findMany({
      where,
      orderBy: {
        name: 'asc'
      }
    });

    res.status(200).json(foods);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
