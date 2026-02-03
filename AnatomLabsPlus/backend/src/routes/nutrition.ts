import { Router, Response } from 'express';
import prisma from '../lib/prisma';
import { authenticateToken, AuthRequest } from '../middleware/auth';
import { calculateNutritionPlan, UserPhysicalData } from '../services/nutritionCalculator';
import {
  getSuggestions,
  getRecentFoods,
  updateStreak,
  getStreak,
  getWeightTrend
} from '../services/nutritionSuggestions';
import { recognizeFoodFromImage } from '../services/foodRecognition';

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
        // Macros
        totalCalories: food.calories * servings,
        totalProtein: food.protein * servings,
        totalCarbs: food.carbs * servings,
        totalFat: food.fat * servings,
        totalFiber: (food.fiber || 0) * servings,
        // Electrolytes
        totalSodium: (food.sodium || 0) * servings,
        totalPotassium: (food.potassium || 0) * servings,
        // Macrominerals
        totalCalcium: (food.calcium || 0) * servings,
        totalMagnesium: (food.magnesium || 0) * servings,
        totalPhosphorus: (food.phosphorus || 0) * servings,
        totalIron: (food.iron || 0) * servings,
      },
      include: {
        food: true
      }
    });

    // Update streak
    const streakUpdate = await updateStreak(userId);

    res.status(201).json({
      message: 'Food logged successfully',
      log,
      streak: streakUpdate
    });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /api/nutrition/logs/today - Get today's logs grouped by meal
router.get('/logs/today', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId!;

    // Get start and end of today
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    // Get all logs for today
    const logs = await prisma.nutritionLog.findMany({
      where: {
        userId,
        date: {
          gte: today,
          lt: tomorrow
        }
      },
      include: {
        food: true
      },
      orderBy: {
        date: 'asc'
      }
    });

    // Group by meal type
    const mealGroups: {
      breakfast: typeof logs;
      lunch: typeof logs;
      dinner: typeof logs;
      snack: typeof logs;
    } = {
      breakfast: [],
      lunch: [],
      dinner: [],
      snack: []
    };

    logs.forEach(log => {
      const mealType = log.mealType as keyof typeof mealGroups;
      if (mealGroups[mealType]) {
        mealGroups[mealType].push(log);
      } else {
        mealGroups.snack.push(log);
      }
    });

    // Calculate daily totals
    const totals = {
      calories: logs.reduce((sum, log) => sum + (log.totalCalories || 0), 0),
      protein: logs.reduce((sum, log) => sum + (log.totalProtein || 0), 0),
      carbs: logs.reduce((sum, log) => sum + (log.totalCarbs || 0), 0),
      fat: logs.reduce((sum, log) => sum + (log.totalFat || 0), 0),
      fiber: logs.reduce((sum, log) => sum + (log.totalFiber || 0), 0),
      // Electrolytes
      sodium: logs.reduce((sum, log) => sum + (log.totalSodium || 0), 0),
      potassium: logs.reduce((sum, log) => sum + (log.totalPotassium || 0), 0),
      // Macrominerals
      calcium: logs.reduce((sum, log) => sum + (log.totalCalcium || 0), 0),
      magnesium: logs.reduce((sum, log) => sum + (log.totalMagnesium || 0), 0),
      phosphorus: logs.reduce((sum, log) => sum + (log.totalPhosphorus || 0), 0),
      iron: logs.reduce((sum, log) => sum + (log.totalIron || 0), 0),
    };

    // Get user's targets for remaining calculation
    const user = await prisma.user.findUnique({
      where: { id: userId }
    });

    let remaining = null;
    if (user?.age && user?.gender && user?.weight && user?.height && user?.activityLevel && user?.goal) {
      const targets = calculateNutritionPlan({
        age: user.age,
        gender: user.gender as 'male' | 'female',
        weight: user.weight,
        height: user.height,
        activityLevel: user.activityLevel as any,
        fitnessGoal: user.goal as any
      });

      remaining = {
        calories: targets.targetCalories - totals.calories,
        protein: targets.macros.protein - totals.protein,
        carbs: targets.macros.carbs - totals.carbs,
        fat: targets.macros.fat - totals.fat
      };
    }

    res.status(200).json({
      date: today.toISOString(),
      meals: mealGroups,
      totals,
      remaining,
      logCount: logs.length
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

// GET /api/nutrition/logs/history - Get daily calorie totals for the last N days
router.get('/logs/history', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId!;
    const { days } = req.query;
    const numDays = days ? parseInt(days as string) : 7;

    // Get user's target calories
    const user = await prisma.user.findUnique({
      where: { id: userId }
    });

    let targetCalories = 2000; // default
    if (user?.age && user?.gender && user?.weight && user?.height && user?.activityLevel && user?.goal) {
      const targets = calculateNutritionPlan({
        age: user.age,
        gender: user.gender as 'male' | 'female',
        weight: user.weight,
        height: user.height,
        activityLevel: user.activityLevel as any,
        fitnessGoal: user.goal as any
      });
      targetCalories = targets.targetCalories;
    }

    // Calculate date range
    const endDate = new Date();
    endDate.setHours(23, 59, 59, 999);
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - (numDays - 1));
    startDate.setHours(0, 0, 0, 0);

    // Get all logs in date range
    const logs = await prisma.nutritionLog.findMany({
      where: {
        userId,
        date: {
          gte: startDate,
          lte: endDate
        }
      },
      select: {
        date: true,
        totalCalories: true
      }
    });

    // Group by date and sum calories
    const dailyCalories: { [date: string]: number } = {};

    // Initialize all days with 0
    for (let i = 0; i < numDays; i++) {
      const date = new Date(startDate);
      date.setDate(date.getDate() + i);
      const dateStr = date.toISOString().split('T')[0];
      dailyCalories[dateStr] = 0;
    }

    // Sum calories for each day
    logs.forEach(log => {
      const dateStr = log.date.toISOString().split('T')[0];
      dailyCalories[dateStr] = (dailyCalories[dateStr] || 0) + (log.totalCalories || 0);
    });

    // Convert to array sorted by date
    const history = Object.entries(dailyCalories)
      .sort((a, b) => a[0].localeCompare(b[0]))
      .map(([date, calories]) => ({
        date,
        calories: Math.round(calories),
        dayOfWeek: new Date(date).toLocaleDateString('en-US', { weekday: 'short' })[0]
      }));

    // Calculate stats
    const daysWithData = history.filter(d => d.calories > 0);
    const average = daysWithData.length > 0
      ? Math.round(daysWithData.reduce((sum, d) => sum + d.calories, 0) / daysWithData.length)
      : 0;

    // Calculate adherence (days within ±200 of target / days with data)
    const daysOnTarget = daysWithData.filter(d =>
      Math.abs(d.calories - targetCalories) <= 200
    ).length;
    const adherence = daysWithData.length > 0
      ? Math.round((daysOnTarget / daysWithData.length) * 100)
      : 0;

    res.status(200).json({
      history,
      stats: {
        average,
        target: targetCalories,
        adherence,
        daysTracked: daysWithData.length,
        totalDays: numDays
      }
    });
  } catch (error) {
    console.error('Get calorie history error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// PUT /api/nutrition/logs/:id - Update a nutrition log
router.put('/logs/:id', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId!;
    const { id } = req.params;
    const { servings, mealType } = req.body;

    // Check ownership
    const existingLog = await prisma.nutritionLog.findFirst({
      where: { id, userId },
      include: { food: true }
    });

    if (!existingLog) {
      return res.status(404).json({ error: 'Log not found' });
    }

    const updateData: any = {};
    if (servings !== undefined) {
      updateData.servings = servings;
      // Macros
      updateData.totalCalories = existingLog.food.calories * servings;
      updateData.totalProtein = existingLog.food.protein * servings;
      updateData.totalCarbs = existingLog.food.carbs * servings;
      updateData.totalFat = existingLog.food.fat * servings;
      updateData.totalFiber = (existingLog.food.fiber || 0) * servings;
      // Electrolytes
      updateData.totalSodium = (existingLog.food.sodium || 0) * servings;
      updateData.totalPotassium = (existingLog.food.potassium || 0) * servings;
      // Macrominerals
      updateData.totalCalcium = (existingLog.food.calcium || 0) * servings;
      updateData.totalMagnesium = (existingLog.food.magnesium || 0) * servings;
      updateData.totalPhosphorus = (existingLog.food.phosphorus || 0) * servings;
      updateData.totalIron = (existingLog.food.iron || 0) * servings;
    }
    if (mealType) {
      updateData.mealType = mealType;
    }

    const log = await prisma.nutritionLog.update({
      where: { id },
      data: updateData,
      include: { food: true }
    });

    res.status(200).json({
      message: 'Log updated successfully',
      log
    });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// DELETE /api/nutrition/logs/:id - Delete a nutrition log
router.delete('/logs/:id', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId!;
    const { id } = req.params;

    // Check ownership
    const existingLog = await prisma.nutritionLog.findFirst({
      where: { id, userId }
    });

    if (!existingLog) {
      return res.status(404).json({ error: 'Log not found' });
    }

    await prisma.nutritionLog.delete({
      where: { id }
    });

    res.status(200).json({ message: 'Log deleted successfully' });
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

// POST /api/nutrition/weight - Log weight
router.post('/weight', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId!;
    const { weight, note, date } = req.body;

    if (!weight || typeof weight !== 'number') {
      return res.status(400).json({ error: 'Weight is required and must be a number' });
    }

    const weightLog = await prisma.weightLog.create({
      data: {
        userId,
        weight,
        note: note || null,
        date: date ? new Date(date) : new Date()
      }
    });

    // Also update user's current weight
    await prisma.user.update({
      where: { id: userId },
      data: { weight }
    });

    res.status(201).json({
      message: 'Weight logged successfully',
      weightLog
    });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /api/nutrition/weight - Get weight history
router.get('/weight', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId!;
    const { days } = req.query;

    const daysToFetch = days ? parseInt(days as string) : 30;
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - daysToFetch);

    const logs = await prisma.weightLog.findMany({
      where: {
        userId,
        date: { gte: startDate }
      },
      orderBy: { date: 'desc' }
    });

    res.status(200).json(logs);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /api/nutrition/weight/trend - Get weight trend analysis
router.get('/weight/trend', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId!;
    const { days } = req.query;

    const trend = await getWeightTrend(userId, days ? parseInt(days as string) : 30);

    res.status(200).json(trend);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /api/nutrition/suggestions - Get food suggestions based on remaining macros
router.get('/suggestions', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId!;

    // Get today's logs to calculate remaining
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const logs = await prisma.nutritionLog.findMany({
      where: {
        userId,
        date: { gte: today, lt: tomorrow }
      }
    });

    const consumed = {
      calories: logs.reduce((s, l) => s + (l.totalCalories || 0), 0),
      protein: logs.reduce((s, l) => s + (l.totalProtein || 0), 0),
      carbs: logs.reduce((s, l) => s + (l.totalCarbs || 0), 0),
      fat: logs.reduce((s, l) => s + (l.totalFat || 0), 0)
    };

    // Get user's targets
    const user = await prisma.user.findUnique({
      where: { id: userId }
    });

    if (!user?.age || !user?.gender || !user?.weight || !user?.height || !user?.activityLevel || !user?.goal) {
      return res.status(400).json({
        error: 'Please complete your profile to get suggestions'
      });
    }

    const targets = calculateNutritionPlan({
      age: user.age,
      gender: user.gender as 'male' | 'female',
      weight: user.weight,
      height: user.height,
      activityLevel: user.activityLevel as any,
      fitnessGoal: user.goal as any
    });

    const remaining = {
      calories: targets.targetCalories - consumed.calories,
      protein: targets.macros.protein - consumed.protein,
      carbs: targets.macros.carbs - consumed.carbs,
      fat: targets.macros.fat - consumed.fat
    };

    const suggestions = await getSuggestions(userId, remaining);

    res.status(200).json({
      remaining,
      suggestions
    });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /api/nutrition/recent - Get recently and frequently logged foods
router.get('/recent', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId!;
    const { limit } = req.query;

    const recentFoods = await getRecentFoods(userId, limit ? parseInt(limit as string) : 10);

    res.status(200).json(recentFoods);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /api/nutrition/streak - Get user's logging streak
router.get('/streak', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId!;

    const streak = await getStreak(userId);

    res.status(200).json(streak);
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

// POST /api/nutrition/foods - Create a new food entry (for scanned/custom foods)
router.post('/foods', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const {
      name,
      brand,
      category,
      servingSize,
      servingUnit,
      calories,
      protein,
      carbs,
      fat,
      fiber,
      sugar,
      // Micronutrients
      sodium,
      potassium,
      calcium,
      magnesium,
      phosphorus,
      iron,
      zinc,
      vitaminA,
      vitaminC,
      vitaminD,
      vitaminE,
      vitaminK,
      vitaminB1,
      vitaminB2,
      vitaminB3,
      vitaminB6,
      vitaminB12,
      folate,
      barcode,
    } = req.body;

    if (!name || calories === undefined || protein === undefined || carbs === undefined || fat === undefined) {
      return res.status(400).json({
        error: 'Name, calories, protein, carbs, and fat are required'
      });
    }

    // Validate nutrition values are reasonable
    if (calories < 0 || calories > 10000 || protein < 0 || protein > 500 ||
        carbs < 0 || carbs > 500 || fat < 0 || fat > 500) {
      return res.status(400).json({
        error: 'Nutrition values appear unrealistic. Please verify the data.'
      });
    }

    const food = await prisma.food.create({
      data: {
        name,
        brand: brand || null,
        category: category || 'custom',
        servingSize: servingSize || 100,
        servingUnit: servingUnit || 'g',
        calories,
        protein,
        carbs,
        fat,
        fiber: fiber || null,
        sugar: sugar || null,
        // Electrolytes & Macrominerals
        sodium: sodium || null,
        potassium: potassium || null,
        calcium: calcium || null,
        iron: iron || null,
        // Vitamins
        vitaminA: vitaminA || null,
        vitaminC: vitaminC || null,
        vitaminD: vitaminD || null,
      }
    });

    res.status(201).json({
      message: 'Food created successfully',
      food
    });
  } catch (error) {
    console.error('Create food error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST /api/nutrition/presets - Create a meal preset
router.post('/presets', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId!;
    const { name, items } = req.body;

    if (!name || !items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        error: 'Name and at least one food item are required'
      });
    }

    // Validate all food items exist
    const foodIds = items.map((i: any) => i.foodId);
    const foods = await prisma.food.findMany({
      where: { id: { in: foodIds } }
    });

    if (foods.length !== foodIds.length) {
      return res.status(400).json({ error: 'One or more foods not found' });
    }

    const preset = await prisma.mealPreset.create({
      data: {
        userId,
        name,
        items: {
          create: items.map((item: { foodId: string; servings: number }) => ({
            foodId: item.foodId,
            servings: item.servings
          }))
        }
      },
      include: {
        items: {
          include: { food: true }
        }
      }
    });

    res.status(201).json({
      message: 'Meal preset created successfully',
      preset
    });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /api/nutrition/presets - Get user's meal presets
router.get('/presets', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId!;

    const presets = await prisma.mealPreset.findMany({
      where: { userId },
      include: {
        items: {
          include: { food: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    res.status(200).json(presets);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// DELETE /api/nutrition/presets/:id - Delete a meal preset
router.delete('/presets/:id', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId!;
    const { id } = req.params;

    const preset = await prisma.mealPreset.findFirst({
      where: { id, userId }
    });

    if (!preset) {
      return res.status(404).json({ error: 'Preset not found' });
    }

    await prisma.mealPreset.delete({
      where: { id }
    });

    res.status(200).json({ message: 'Preset deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST /api/nutrition/scan-food - Scan food image using AI
router.post('/scan-food', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const { image, mimeType } = req.body;

    if (!image) {
      return res.status(400).json({
        error: 'Image data is required (base64 encoded)'
      });
    }

    // Remove data URL prefix if present
    let imageBase64 = image;
    if (image.includes('base64,')) {
      imageBase64 = image.split('base64,')[1];
    }

    const result = await recognizeFoodFromImage(imageBase64, mimeType || 'image/jpeg');

    res.status(200).json(result);
  } catch (error) {
    console.error('Food scan error:', error);
    res.status(500).json({ error: 'Failed to analyze food image' });
  }
});

// POST /api/nutrition/presets/:id/log - Log all items from a preset
router.post('/presets/:id/log', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId!;
    const { id } = req.params;
    const { mealType, date } = req.body;

    const preset = await prisma.mealPreset.findFirst({
      where: { id, userId },
      include: {
        items: {
          include: { food: true }
        }
      }
    });

    if (!preset) {
      return res.status(404).json({ error: 'Preset not found' });
    }

    const logDate = date ? new Date(date) : new Date();

    // Create nutrition logs for each item
    const logs = await Promise.all(
      preset.items.map(item =>
        prisma.nutritionLog.create({
          data: {
            userId,
            foodId: item.foodId,
            servings: item.servings,
            mealType: mealType || 'snack',
            date: logDate,
            // Macros
            totalCalories: item.food.calories * item.servings,
            totalProtein: item.food.protein * item.servings,
            totalCarbs: item.food.carbs * item.servings,
            totalFat: item.food.fat * item.servings,
            totalFiber: (item.food.fiber || 0) * item.servings,
            // Electrolytes
            totalSodium: (item.food.sodium || 0) * item.servings,
            totalPotassium: (item.food.potassium || 0) * item.servings,
            // Macrominerals
            totalCalcium: (item.food.calcium || 0) * item.servings,
            totalMagnesium: (item.food.magnesium || 0) * item.servings,
            totalPhosphorus: (item.food.phosphorus || 0) * item.servings,
            totalIron: (item.food.iron || 0) * item.servings,
          },
          include: { food: true }
        })
      )
    );

    // Update streak
    const streakUpdate = await updateStreak(userId);

    res.status(201).json({
      message: `Logged ${logs.length} items from "${preset.name}"`,
      logs,
      streak: streakUpdate
    });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
