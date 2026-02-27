import prisma from '../lib/prisma';

interface Insight {
  type: 'pattern' | 'prediction' | 'correlation';
  title: string;
  description: string;
  confidence: number;
  icon: string;
  color: string;
  data?: any;
}

export async function generateInsights(userId: string): Promise<Insight[]> {
  const cached = await prisma.insightCache.findUnique({
    where: { userId_type: { userId, type: 'all' } },
  });

  if (cached && cached.validUntil > new Date()) {
    return cached.data as unknown as Insight[];
  }

  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const [nutritionLogs, activityLogs, workoutSessions, weightLogs] = await Promise.all([
    prisma.nutritionLog.findMany({
      where: { userId, date: { gte: thirtyDaysAgo } },
      orderBy: { date: 'asc' },
    }),
    prisma.activityLog.findMany({
      where: { userId, date: { gte: thirtyDaysAgo } },
      orderBy: { date: 'asc' },
    }),
    prisma.workoutSession.findMany({
      where: { userId, completedAt: { gte: thirtyDaysAgo } },
      orderBy: { completedAt: 'asc' },
    }),
    prisma.weightLog.findMany({
      where: { userId, date: { gte: thirtyDaysAgo } },
      orderBy: { date: 'asc' },
    }),
  ]);

  const insights: Insight[] = [];

  const nutritionConsistency = detectNutritionConsistency(nutritionLogs);
  if (nutritionConsistency) insights.push(nutritionConsistency);

  const trainingPattern = detectTrainingPattern(workoutSessions);
  if (trainingPattern) insights.push(trainingPattern);

  const sleepPerformance = detectSleepPerformanceCorrelation(activityLogs, workoutSessions);
  if (sleepPerformance) insights.push(sleepPerformance);

  const weightPrediction = predictWeight(weightLogs);
  if (weightPrediction) insights.push(weightPrediction);

  const proteinAdherence = detectProteinPattern(nutritionLogs);
  if (proteinAdherence) insights.push(proteinAdherence);

  const volumeProgression = detectVolumeProgression(workoutSessions);
  if (volumeProgression) insights.push(volumeProgression);

  const validUntil = new Date();
  validUntil.setHours(validUntil.getHours() + 6);

  await prisma.insightCache.upsert({
    where: { userId_type: { userId, type: 'all' } },
    update: { data: insights as any, validUntil },
    create: { userId, type: 'all', data: insights as any, validUntil },
  });

  return insights;
}

function detectNutritionConsistency(logs: any[]): Insight | null {
  if (logs.length < 7) return null;

  const dailyCalories = new Map<string, number>();
  logs.forEach(l => {
    const day = l.date.toISOString().split('T')[0];
    dailyCalories.set(day, (dailyCalories.get(day) || 0) + (l.totalCalories || 0));
  });

  const values = Array.from(dailyCalories.values());
  if (values.length < 5) return null;

  const avg = values.reduce((a, b) => a + b, 0) / values.length;
  const variance = values.reduce((a, b) => a + Math.pow(b - avg, 2), 0) / values.length;
  const stdDev = Math.sqrt(variance);
  const cv = avg > 0 ? stdDev / avg : 0;

  if (cv < 0.15) {
    return {
      type: 'pattern',
      title: 'Consistent Nutrition',
      description: `Your calorie intake has been very consistent over the past ${values.length} days, varying by only ${Math.round(cv * 100)}%. Great discipline!`,
      confidence: 0.9,
      icon: 'checkmark-circle',
      color: '#2ecc71',
    };
  } else if (cv > 0.4) {
    return {
      type: 'pattern',
      title: 'Inconsistent Calorie Intake',
      description: `Your daily calories vary by ${Math.round(cv * 100)}%. Try to keep intake more consistent for better results.`,
      confidence: 0.85,
      icon: 'alert-circle',
      color: '#f39c12',
    };
  }

  return null;
}

function detectTrainingPattern(sessions: any[]): Insight | null {
  if (sessions.length < 3) return null;

  const weekMap = new Map<number, number>();
  sessions.forEach(s => {
    const week = getWeekNumber(s.completedAt);
    weekMap.set(week, (weekMap.get(week) || 0) + 1);
  });

  const weekCounts = Array.from(weekMap.values());
  const avgPerWeek = weekCounts.reduce((a, b) => a + b, 0) / weekCounts.length;

  if (avgPerWeek >= 4) {
    return {
      type: 'pattern',
      title: 'High Training Frequency',
      description: `You are averaging ${avgPerWeek.toFixed(1)} workouts per week. Make sure you are getting enough rest between sessions.`,
      confidence: 0.85,
      icon: 'flame',
      color: '#e74c3c',
    };
  } else if (avgPerWeek >= 3) {
    return {
      type: 'pattern',
      title: 'Solid Training Routine',
      description: `You are averaging ${avgPerWeek.toFixed(1)} workouts per week. This is a great frequency for progress.`,
      confidence: 0.85,
      icon: 'trophy',
      color: '#2ecc71',
    };
  }

  return null;
}

function detectSleepPerformanceCorrelation(activityLogs: any[], sessions: any[]): Insight | null {
  if (activityLogs.length < 7 || sessions.length < 3) return null;

  const sleepByDay = new Map<string, number>();
  activityLogs.forEach(l => {
    if (l.sleepHours) {
      sleepByDay.set(l.date.toISOString().split('T')[0], l.sleepHours);
    }
  });

  let goodSleepVolume = 0;
  let badSleepVolume = 0;
  let goodCount = 0;
  let badCount = 0;

  sessions.forEach(s => {
    const day = s.completedAt.toISOString().split('T')[0];
    const prevDay = new Date(s.completedAt);
    prevDay.setDate(prevDay.getDate() - 1);
    const prevDayStr = prevDay.toISOString().split('T')[0];
    const sleep = sleepByDay.get(prevDayStr);

    if (sleep !== undefined) {
      if (sleep >= 7) {
        goodSleepVolume += s.totalVolume;
        goodCount++;
      } else {
        badSleepVolume += s.totalVolume;
        badCount++;
      }
    }
  });

  if (goodCount > 0 && badCount > 0) {
    const avgGood = goodSleepVolume / goodCount;
    const avgBad = badSleepVolume / badCount;
    const diff = ((avgGood - avgBad) / avgBad) * 100;

    if (diff > 10) {
      return {
        type: 'correlation',
        title: 'Sleep Boosts Performance',
        description: `When you sleep 7+ hours, your training volume is ${Math.round(diff)}% higher. Prioritize sleep for better gains!`,
        confidence: 0.75,
        icon: 'moon',
        color: '#9b59b6',
        data: { avgGoodSleep: Math.round(avgGood), avgBadSleep: Math.round(avgBad) },
      };
    }
  }

  return null;
}

function predictWeight(weightLogs: any[]): Insight | null {
  if (weightLogs.length < 5) return null;

  const points = weightLogs.map((l, i) => ({ x: i, y: l.weight }));
  const n = points.length;
  const sumX = points.reduce((a, p) => a + p.x, 0);
  const sumY = points.reduce((a, p) => a + p.y, 0);
  const sumXY = points.reduce((a, p) => a + p.x * p.y, 0);
  const sumX2 = points.reduce((a, p) => a + p.x * p.x, 0);

  const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
  const intercept = (sumY - slope * sumX) / n;

  const predictedIn30 = intercept + slope * (n + 30);
  const currentWeight = weightLogs[weightLogs.length - 1].weight;
  const predictedChange = predictedIn30 - currentWeight;

  if (Math.abs(predictedChange) < 0.3) return null;

  const direction = predictedChange > 0 ? 'gain' : 'lose';

  return {
    type: 'prediction',
    title: 'Weight Projection',
    description: `Based on your trend, you're projected to ${direction} ${Math.abs(predictedChange).toFixed(1)} kg in the next 30 days (reaching ~${predictedIn30.toFixed(1)} kg).`,
    confidence: 0.7,
    icon: 'analytics',
    color: '#3498db',
    data: { currentWeight, predictedWeight: Math.round(predictedIn30 * 10) / 10, daysOut: 30 },
  };
}

function detectProteinPattern(logs: any[]): Insight | null {
  if (logs.length < 7) return null;

  const dailyProtein = new Map<string, number>();
  logs.forEach(l => {
    const day = l.date.toISOString().split('T')[0];
    dailyProtein.set(day, (dailyProtein.get(day) || 0) + (l.totalProtein || 0));
  });

  const values = Array.from(dailyProtein.values());
  if (values.length < 5) return null;

  const avg = values.reduce((a, b) => a + b, 0) / values.length;
  const lowDays = values.filter(v => v < avg * 0.7).length;
  const lowPercent = (lowDays / values.length) * 100;

  if (lowPercent > 40) {
    return {
      type: 'pattern',
      title: 'Protein Gaps Detected',
      description: `${Math.round(lowPercent)}% of your days had below-average protein intake. Consistent protein is key for muscle recovery.`,
      confidence: 0.8,
      icon: 'nutrition',
      color: '#e74c3c',
    };
  }

  return null;
}

function detectVolumeProgression(sessions: any[]): Insight | null {
  if (sessions.length < 6) return null;

  const half = Math.floor(sessions.length / 2);
  const firstHalf = sessions.slice(0, half);
  const secondHalf = sessions.slice(half);

  const avgFirst = firstHalf.reduce((a, s) => a + s.totalVolume, 0) / firstHalf.length;
  const avgSecond = secondHalf.reduce((a, s) => a + s.totalVolume, 0) / secondHalf.length;

  if (avgFirst === 0) return null;

  const change = ((avgSecond - avgFirst) / avgFirst) * 100;

  if (change > 10) {
    return {
      type: 'pattern',
      title: 'Volume Increasing',
      description: `Your training volume has increased by ${Math.round(change)}% in the latter half of this period. Great progressive overload!`,
      confidence: 0.8,
      icon: 'trending-up',
      color: '#2ecc71',
    };
  } else if (change < -10) {
    return {
      type: 'pattern',
      title: 'Volume Declining',
      description: `Your training volume has decreased by ${Math.abs(Math.round(change))}%. This could be a deload or a sign you need more motivation.`,
      confidence: 0.75,
      icon: 'trending-down',
      color: '#f39c12',
    };
  }

  return null;
}

function getWeekNumber(date: Date): number {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  d.setDate(d.getDate() + 4 - (d.getDay() || 7));
  const yearStart = new Date(d.getFullYear(), 0, 1);
  return Math.ceil((((d.getTime() - yearStart.getTime()) / 86400000) + 1) / 7);
}
