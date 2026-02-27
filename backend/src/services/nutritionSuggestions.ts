/**
 * Nutrition Suggestions Service
 *
 * Provides smart food recommendations and streak tracking for nutrition goals.
 */

import prisma from '../lib/prisma';

interface MacroRemaining {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

interface FoodWithScore {
  id: string;
  name: string;
  category: string | null;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  servingSize: number;
  servingUnit: string;
  score: number;
  reason: string;
}

/**
 * Score a food item based on how well it fits the remaining macro needs
 * Higher score = better fit
 */
export function scoreFoodFit(
  food: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
  },
  remaining: MacroRemaining
): { score: number; reason: string } {
  // Weights for each macro (protein is most important for fitness goals)
  const weights = { protein: 3, carbs: 1, fat: 1, calories: 0.5 };

  let score = 0;
  const reasons: string[] = [];

  // Score based on protein fit
  if (remaining.protein > 0 && food.protein > 0) {
    const proteinFit = Math.min(food.protein / remaining.protein, 1);
    score += proteinFit * weights.protein * 100;
    if (food.protein >= 15) {
      reasons.push('High protein');
    }
  }

  // Score based on carbs fit
  if (remaining.carbs > 0 && food.carbs > 0) {
    const carbsFit = Math.min(food.carbs / remaining.carbs, 1);
    score += carbsFit * weights.carbs * 50;
  }

  // Score based on fat fit (penalize if already over)
  if (remaining.fat > 0 && food.fat > 0) {
    const fatFit = Math.min(food.fat / remaining.fat, 1);
    score += fatFit * weights.fat * 30;
  } else if (remaining.fat <= 0 && food.fat > 10) {
    score -= 20; // Penalize high fat foods when fat goal is met
    reasons.push('Low fat option preferred');
  }

  // Score based on calorie fit
  if (remaining.calories > 0) {
    const calFit = food.calories <= remaining.calories ? 1 : 0.5;
    score += calFit * weights.calories * 40;
    if (food.calories <= remaining.calories * 0.3) {
      reasons.push('Light option');
    }
  }

  // Bonus for balanced macros
  const totalMacroGrams = food.protein + food.carbs + food.fat;
  if (totalMacroGrams > 0) {
    const proteinRatio = food.protein / totalMacroGrams;
    if (proteinRatio >= 0.4) {
      score += 20;
      if (!reasons.includes('High protein')) {
        reasons.push('Protein-rich');
      }
    }
  }

  // Default reason if none set
  if (reasons.length === 0) {
    if (score > 100) {
      reasons.push('Good macro balance');
    } else {
      reasons.push('Fits your goals');
    }
  }

  return {
    score: Math.round(score),
    reason: reasons.join(', ')
  };
}

/**
 * Get food suggestions based on remaining macros for the day
 */
export async function getSuggestions(
  userId: string,
  remaining: MacroRemaining,
  limit: number = 10
): Promise<FoodWithScore[]> {
  // Get all foods
  const foods = await prisma.food.findMany({
    orderBy: { name: 'asc' }
  });

  // Score each food
  const scoredFoods: FoodWithScore[] = foods.map(food => {
    const { score, reason } = scoreFoodFit(food, remaining);
    return {
      id: food.id,
      name: food.name,
      category: food.category,
      calories: food.calories,
      protein: food.protein,
      carbs: food.carbs,
      fat: food.fat,
      servingSize: food.servingSize,
      servingUnit: food.servingUnit,
      score,
      reason
    };
  });

  // Sort by score (highest first) and return top results
  return scoredFoods
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);
}

/**
 * Get recently and frequently logged foods for a user
 */
export async function getRecentFoods(
  userId: string,
  limit: number = 10
): Promise<{ recent: any[]; frequent: any[] }> {
  // Get recent logs (last 7 days)
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

  const recentLogs = await prisma.nutritionLog.findMany({
    where: {
      userId,
      date: { gte: sevenDaysAgo }
    },
    include: { food: true },
    orderBy: { date: 'desc' },
    take: 50
  });

  // Get unique recent foods
  const recentFoodsMap = new Map();
  for (const log of recentLogs) {
    if (!recentFoodsMap.has(log.foodId)) {
      recentFoodsMap.set(log.foodId, {
        ...log.food,
        lastLogged: log.date,
        defaultServings: log.servings
      });
    }
  }
  const recent = Array.from(recentFoodsMap.values()).slice(0, limit);

  // Get frequently logged foods (all time)
  const allLogs = await prisma.nutritionLog.groupBy({
    by: ['foodId'],
    where: { userId },
    _count: { foodId: true },
    orderBy: { _count: { foodId: 'desc' } },
    take: limit
  });

  const frequentFoodIds = allLogs.map(l => l.foodId);
  const frequentFoods = await prisma.food.findMany({
    where: { id: { in: frequentFoodIds } }
  });

  // Sort by frequency and add count
  const frequentWithCount = allLogs.map(log => {
    const food = frequentFoods.find(f => f.id === log.foodId);
    return food ? { ...food, logCount: log._count.foodId } : null;
  }).filter(Boolean);

  return { recent, frequent: frequentWithCount };
}

/**
 * Update streak for a user after logging food
 */
export async function updateStreak(userId: string): Promise<{
  currentStreak: number;
  longestStreak: number;
  totalDaysLogged: number;
  badge?: string;
}> {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  // Get or create streak record
  let streak = await prisma.userStreak.findUnique({
    where: { userId }
  });

  if (!streak) {
    streak = await prisma.userStreak.create({
      data: {
        userId,
        currentStreak: 1,
        longestStreak: 1,
        lastLoggedDate: today,
        totalDaysLogged: 1
      }
    });
    return {
      currentStreak: 1,
      longestStreak: 1,
      totalDaysLogged: 1,
      badge: 'First Log!'
    };
  }

  const lastLogged = streak.lastLoggedDate ? new Date(streak.lastLoggedDate) : null;
  if (lastLogged) {
    lastLogged.setHours(0, 0, 0, 0);
  }

  // Check if already logged today
  if (lastLogged && lastLogged.getTime() === today.getTime()) {
    return {
      currentStreak: streak.currentStreak,
      longestStreak: streak.longestStreak,
      totalDaysLogged: streak.totalDaysLogged
    };
  }

  let newCurrentStreak = streak.currentStreak;
  let newTotalDays = streak.totalDaysLogged + 1;
  let badge: string | undefined;

  // Check if consecutive day
  if (lastLogged && lastLogged.getTime() === yesterday.getTime()) {
    newCurrentStreak = streak.currentStreak + 1;
  } else if (!lastLogged || lastLogged.getTime() < yesterday.getTime()) {
    // Streak broken, start fresh
    newCurrentStreak = 1;
  }

  const newLongestStreak = Math.max(streak.longestStreak, newCurrentStreak);

  // Check for badges
  if (newCurrentStreak === 7) badge = '7-Day Streak!';
  else if (newCurrentStreak === 30) badge = '30-Day Streak!';
  else if (newCurrentStreak === 100) badge = '100-Day Streak!';
  else if (newTotalDays === 10) badge = '10 Days Logged!';
  else if (newTotalDays === 50) badge = '50 Days Logged!';
  else if (newTotalDays === 100) badge = '100 Days Logged!';

  // Update streak
  await prisma.userStreak.update({
    where: { userId },
    data: {
      currentStreak: newCurrentStreak,
      longestStreak: newLongestStreak,
      lastLoggedDate: today,
      totalDaysLogged: newTotalDays
    }
  });

  return {
    currentStreak: newCurrentStreak,
    longestStreak: newLongestStreak,
    totalDaysLogged: newTotalDays,
    badge
  };
}

/**
 * Get current streak info for a user
 */
export async function getStreak(userId: string): Promise<{
  currentStreak: number;
  longestStreak: number;
  totalDaysLogged: number;
  lastLoggedDate: Date | null;
}> {
  const streak = await prisma.userStreak.findUnique({
    where: { userId }
  });

  if (!streak) {
    return {
      currentStreak: 0,
      longestStreak: 0,
      totalDaysLogged: 0,
      lastLoggedDate: null
    };
  }

  // Check if streak is still active
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  if (streak.lastLoggedDate) {
    const lastLogged = new Date(streak.lastLoggedDate);
    lastLogged.setHours(0, 0, 0, 0);

    // If last logged is older than yesterday, streak is broken
    if (lastLogged.getTime() < yesterday.getTime()) {
      return {
        currentStreak: 0,
        longestStreak: streak.longestStreak,
        totalDaysLogged: streak.totalDaysLogged,
        lastLoggedDate: streak.lastLoggedDate
      };
    }
  }

  return {
    currentStreak: streak.currentStreak,
    longestStreak: streak.longestStreak,
    totalDaysLogged: streak.totalDaysLogged,
    lastLoggedDate: streak.lastLoggedDate
  };
}

/**
 * Calculate weight trend from logs
 */
export async function getWeightTrend(
  userId: string,
  days: number = 30
): Promise<{
  current: number | null;
  average7Day: number | null;
  average30Day: number | null;
  trend: 'up' | 'down' | 'stable' | 'insufficient_data';
  change: number | null;
}> {
  const daysAgo = new Date();
  daysAgo.setDate(daysAgo.getDate() - days);

  const logs = await prisma.weightLog.findMany({
    where: {
      userId,
      date: { gte: daysAgo }
    },
    orderBy: { date: 'desc' }
  });

  if (logs.length === 0) {
    return {
      current: null,
      average7Day: null,
      average30Day: null,
      trend: 'insufficient_data',
      change: null
    };
  }

  const current = logs[0].weight;

  // Calculate 7-day average
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
  const last7Days = logs.filter(l => new Date(l.date) >= sevenDaysAgo);
  const average7Day = last7Days.length > 0
    ? last7Days.reduce((sum, l) => sum + l.weight, 0) / last7Days.length
    : null;

  // Calculate 30-day average
  const average30Day = logs.reduce((sum, l) => sum + l.weight, 0) / logs.length;

  // Determine trend
  let trend: 'up' | 'down' | 'stable' | 'insufficient_data' = 'insufficient_data';
  let change: number | null = null;

  if (logs.length >= 3) {
    // Compare first half average to second half
    const midpoint = Math.floor(logs.length / 2);
    const recentAvg = logs.slice(0, midpoint).reduce((s, l) => s + l.weight, 0) / midpoint;
    const olderAvg = logs.slice(midpoint).reduce((s, l) => s + l.weight, 0) / (logs.length - midpoint);

    change = recentAvg - olderAvg;

    if (Math.abs(change) < 0.5) {
      trend = 'stable';
    } else if (change > 0) {
      trend = 'up';
    } else {
      trend = 'down';
    }
  }

  return {
    current: Math.round(current * 10) / 10,
    average7Day: average7Day ? Math.round(average7Day * 10) / 10 : null,
    average30Day: Math.round(average30Day * 10) / 10,
    trend,
    change: change ? Math.round(change * 10) / 10 : null
  };
}
