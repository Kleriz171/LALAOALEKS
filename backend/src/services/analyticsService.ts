import prisma from '../lib/prisma';

export async function getTrendData(userId: string, metric: string, days: number) {
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);

  const dataPoints: { date: string; value: number }[] = [];

  if (metric === 'weight') {
    const logs = await prisma.weightLog.findMany({
      where: { userId, date: { gte: startDate } },
      orderBy: { date: 'asc' },
    });
    logs.forEach(l => {
      dataPoints.push({ date: l.date.toISOString().split('T')[0], value: l.weight });
    });
  } else if (metric === 'calories' || metric === 'protein') {
    const logs = await prisma.nutritionLog.findMany({
      where: { userId, date: { gte: startDate } },
      orderBy: { date: 'asc' },
    });
    const dailyMap = new Map<string, number>();
    logs.forEach(l => {
      const day = l.date.toISOString().split('T')[0];
      const val = metric === 'calories' ? (l.totalCalories || 0) : (l.totalProtein || 0);
      dailyMap.set(day, (dailyMap.get(day) || 0) + val);
    });
    Array.from(dailyMap.entries())
      .sort(([a], [b]) => a.localeCompare(b))
      .forEach(([date, value]) => dataPoints.push({ date, value }));
  } else if (metric === 'volume') {
    const sessions = await prisma.workoutSession.findMany({
      where: { userId, completedAt: { gte: startDate } },
      orderBy: { completedAt: 'asc' },
    });
    const dailyMap = new Map<string, number>();
    sessions.forEach(s => {
      const day = s.completedAt.toISOString().split('T')[0];
      dailyMap.set(day, (dailyMap.get(day) || 0) + s.totalVolume);
    });
    Array.from(dailyMap.entries())
      .sort(([a], [b]) => a.localeCompare(b))
      .forEach(([date, value]) => dataPoints.push({ date, value }));
  } else if (metric === 'steps') {
    const logs = await prisma.activityLog.findMany({
      where: { userId, date: { gte: startDate } },
      orderBy: { date: 'asc' },
    });
    logs.forEach(l => {
      dataPoints.push({ date: l.date.toISOString().split('T')[0], value: l.steps });
    });
  }

  if (dataPoints.length === 0) {
    return { metric, data: [], average: 0, min: 0, max: 0, change: 0, changePercent: 0, trend: 'stable' as const };
  }

  const values = dataPoints.map(d => d.value);
  const avg = values.reduce((a, b) => a + b, 0) / values.length;
  const minVal = Math.min(...values);
  const maxVal = Math.max(...values);
  const first = values[0];
  const last = values[values.length - 1];
  const change = last - first;
  const changePercent = first > 0 ? (change / first) * 100 : 0;
  const trend = change > 0.01 * first ? 'up' : change < -0.01 * first ? 'down' : 'stable';

  return {
    metric,
    data: dataPoints,
    average: Math.round(avg * 10) / 10,
    min: Math.round(minVal * 10) / 10,
    max: Math.round(maxVal * 10) / 10,
    change: Math.round(change * 10) / 10,
    changePercent: Math.round(changePercent * 10) / 10,
    trend: trend as 'up' | 'down' | 'stable',
  };
}

export async function getAnalyticsSummary(userId: string, period: string, startDate: Date, endDate: Date) {
  const [nutritionLogs, activityLogs, workoutSessions] = await Promise.all([
    prisma.nutritionLog.findMany({
      where: { userId, date: { gte: startDate, lte: endDate } },
    }),
    prisma.activityLog.findMany({
      where: { userId, date: { gte: startDate, lte: endDate } },
    }),
    prisma.workoutSession.findMany({
      where: { userId, completedAt: { gte: startDate, lte: endDate } },
      include: { exercises: true },
    }),
  ]);

  const nutritionByDay = new Map<string, { calories: number; protein: number; carbs: number; fat: number }>();
  nutritionLogs.forEach(l => {
    const day = l.date.toISOString().split('T')[0];
    const existing = nutritionByDay.get(day) || { calories: 0, protein: 0, carbs: 0, fat: 0 };
    existing.calories += l.totalCalories || 0;
    existing.protein += l.totalProtein || 0;
    existing.carbs += l.totalCarbs || 0;
    existing.fat += l.totalFat || 0;
    nutritionByDay.set(day, existing);
  });

  const daysTracked = nutritionByDay.size;
  const nutTotals = Array.from(nutritionByDay.values());
  const avgCalories = daysTracked > 0 ? nutTotals.reduce((a, b) => a + b.calories, 0) / daysTracked : 0;
  const avgProtein = daysTracked > 0 ? nutTotals.reduce((a, b) => a + b.protein, 0) / daysTracked : 0;
  const avgCarbs = daysTracked > 0 ? nutTotals.reduce((a, b) => a + b.carbs, 0) / daysTracked : 0;
  const avgFat = daysTracked > 0 ? nutTotals.reduce((a, b) => a + b.fat, 0) / daysTracked : 0;

  const activityDays = activityLogs.length;
  const avgSteps = activityDays > 0 ? activityLogs.reduce((a, b) => a + b.steps, 0) / activityDays : 0;
  const avgCalBurned = activityDays > 0 ? activityLogs.reduce((a, b) => a + b.caloriesBurned, 0) / activityDays : 0;
  const avgWater = activityDays > 0 ? activityLogs.reduce((a, b) => a + b.waterIntake, 0) / activityDays : 0;
  const avgSleep = activityDays > 0 ? activityLogs.reduce((a, b) => a + (b.sleepHours || 0), 0) / activityDays : 0;

  const muscleMap = new Map<string, number>();
  let totalSetsAll = 0;
  workoutSessions.forEach(ws => {
    ws.exercises.forEach(ex => {
      const setsData = Array.isArray(ex.setsData) ? ex.setsData : [];
      const setCount = setsData.length;
      totalSetsAll += setCount;
      muscleMap.set(ex.muscleGroup, (muscleMap.get(ex.muscleGroup) || 0) + setCount);
    });
  });

  const muscleGroupDistribution = Array.from(muscleMap.entries())
    .map(([muscle, sets]) => ({
      muscle,
      sets,
      percentage: totalSetsAll > 0 ? Math.round((sets / totalSetsAll) * 100) : 0,
    }))
    .sort((a, b) => b.sets - a.sets);

  const totalDuration = workoutSessions.reduce((a, b) => a + b.duration, 0);
  const totalVolume = workoutSessions.reduce((a, b) => a + b.totalVolume, 0);

  return {
    period,
    startDate: startDate.toISOString().split('T')[0],
    endDate: endDate.toISOString().split('T')[0],
    nutrition: {
      avgCalories: Math.round(avgCalories),
      avgProtein: Math.round(avgProtein),
      avgCarbs: Math.round(avgCarbs),
      avgFat: Math.round(avgFat),
      adherenceScore: 0,
      daysTracked,
    },
    activity: {
      avgSteps: Math.round(avgSteps),
      avgCaloriesBurned: Math.round(avgCalBurned),
      avgWaterIntake: Math.round(avgWater),
      avgSleepHours: Math.round(avgSleep * 10) / 10,
      totalActiveDays: activityDays,
    },
    training: {
      totalWorkouts: workoutSessions.length,
      totalVolume: Math.round(totalVolume),
      avgDuration: workoutSessions.length > 0 ? Math.round(totalDuration / workoutSessions.length) : 0,
      muscleGroupDistribution,
    },
  };
}

export async function getPeriodComparison(userId: string, p1Start: Date, p1End: Date, p2Start: Date, p2End: Date) {
  const [period1, period2] = await Promise.all([
    getAnalyticsSummary(userId, 'comparison', p1Start, p1End),
    getAnalyticsSummary(userId, 'comparison', p2Start, p2End),
  ]);

  return {
    period1,
    period2,
    changes: {
      calories: period1.nutrition.avgCalories - period2.nutrition.avgCalories,
      protein: period1.nutrition.avgProtein - period2.nutrition.avgProtein,
      steps: period1.activity.avgSteps - period2.activity.avgSteps,
      workouts: period1.training.totalWorkouts - period2.training.totalWorkouts,
      volume: period1.training.totalVolume - period2.training.totalVolume,
      sleepHours: period1.activity.avgSleepHours - period2.activity.avgSleepHours,
    },
  };
}

export async function getVolumeByMuscle(userId: string, days: number) {
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);

  const sessions = await prisma.workoutSession.findMany({
    where: { userId, completedAt: { gte: startDate } },
    include: { exercises: true },
  });

  const muscleMap = new Map<string, { totalSets: number; totalVolume: number; sessions: Set<string>; lastTrained: Date }>();

  sessions.forEach(ws => {
    ws.exercises.forEach(ex => {
      const setsData = Array.isArray(ex.setsData) ? ex.setsData : [];
      const existing = muscleMap.get(ex.muscleGroup) || { totalSets: 0, totalVolume: 0, sessions: new Set(), lastTrained: new Date(0) };
      existing.totalSets += setsData.length;
      existing.totalVolume += ex.totalVolume;
      existing.sessions.add(ws.id);
      if (ws.completedAt > existing.lastTrained) existing.lastTrained = ws.completedAt;
      muscleMap.set(ex.muscleGroup, existing);
    });
  });

  const totalSets = Array.from(muscleMap.values()).reduce((a, b) => a + b.totalSets, 0) || 1;

  return Array.from(muscleMap.entries())
    .map(([muscle, data]) => ({
      muscle,
      totalSets: data.totalSets,
      totalVolume: Math.round(data.totalVolume),
      sessions: data.sessions.size,
      lastTrained: data.lastTrained.toISOString().split('T')[0],
      percentage: Math.round((data.totalSets / totalSets) * 100),
    }))
    .sort((a, b) => b.totalSets - a.totalSets);
}

export async function getExerciseProgression(userId: string, exerciseName: string, days: number) {
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);

  const exercises = await prisma.workoutSessionExercise.findMany({
    where: {
      exerciseName: { contains: exerciseName, mode: 'insensitive' },
      workoutSession: { userId, completedAt: { gte: startDate } },
    },
    include: { workoutSession: true },
    orderBy: { workoutSession: { completedAt: 'asc' } },
  });

  const dataPoints = exercises.map(ex => ({
    date: ex.workoutSession.completedAt.toISOString().split('T')[0],
    maxWeight: ex.maxWeight,
    maxReps: ex.maxReps,
    totalVolume: ex.totalVolume,
    estimatedOneRepMax: ex.maxWeight * (1 + ex.maxReps / 30),
  }));

  const bestWeight = Math.max(...dataPoints.map(d => d.maxWeight), 0);
  const bestReps = Math.max(...dataPoints.map(d => d.maxReps), 0);
  const bestVolume = Math.max(...dataPoints.map(d => d.totalVolume), 0);
  const bestORM = Math.max(...dataPoints.map(d => d.estimatedOneRepMax), 0);

  const first1RM = dataPoints.length > 0 ? dataPoints[0].estimatedOneRepMax : 0;
  const last1RM = dataPoints.length > 0 ? dataPoints[dataPoints.length - 1].estimatedOneRepMax : 0;
  const change = last1RM - first1RM;
  const trend = change > 0.5 ? 'up' : change < -0.5 ? 'down' : 'stable';

  return {
    exerciseName,
    dataPoints,
    personalBest: {
      weight: Math.round(bestWeight * 10) / 10,
      reps: bestReps,
      volume: Math.round(bestVolume),
      oneRepMax: Math.round(bestORM * 10) / 10,
    },
    trend: trend as 'up' | 'down' | 'stable',
  };
}

export async function getTrainingHeatmap(userId: string, weeks: number) {
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - weeks * 7);

  const sessions = await prisma.workoutSession.findMany({
    where: { userId, completedAt: { gte: startDate } },
  });

  const dayMap = new Map<string, { workouts: number; totalVolume: number }>();
  sessions.forEach(s => {
    const day = s.completedAt.toISOString().split('T')[0];
    const existing = dayMap.get(day) || { workouts: 0, totalVolume: 0 };
    existing.workouts += 1;
    existing.totalVolume += s.totalVolume;
    dayMap.set(day, existing);
  });

  const maxVolume = Math.max(...Array.from(dayMap.values()).map(v => v.totalVolume), 1);

  return Array.from(dayMap.entries()).map(([date, data]) => ({
    date,
    intensity: Math.round((data.totalVolume / maxVolume) * 100),
    workouts: data.workouts,
  }));
}
