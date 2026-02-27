import { Router, Response } from 'express';
import prisma from '../lib/prisma';
import { authenticateToken, AuthRequest } from '../middleware/auth';
import { assessInjuryRisk, MuscleUsageData } from '../services/injuryPrevention';
import {
  getTrendData,
  getAnalyticsSummary,
  getPeriodComparison,
  getVolumeByMuscle,
  getExerciseProgression,
  getTrainingHeatmap,
} from '../services/analyticsService';
import { generateInsights } from '../services/insightsEngine';
import { generateFullReport, createShareToken, getSharedReport } from '../services/reportGenerator';

const router = Router();

router.post('/injury-risk', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId!;

    const muscleUsageLogs = await prisma.muscleUsageLog.findMany({
      where: { userId },
      orderBy: { lastWorkedDate: 'desc' },
    });

    if (muscleUsageLogs.length === 0) {
      return res.status(200).json({
        riskLevel: 'low',
        overusedMuscles: [],
        recommendations: ['Start tracking your workouts to get injury risk assessments'],
        needsRestDay: false,
      });
    }

    const muscleUsageData: MuscleUsageData[] = muscleUsageLogs
      .filter(log => log.muscleId && log.muscleName && log.lastWorkedDate)
      .map(log => ({
        muscleId: log.muscleId!,
        muscleName: log.muscleName!,
        lastWorkedDate: log.lastWorkedDate!,
        workoutFrequency: log.workoutFrequency,
        intensity: log.intensity,
        recoveryTimeHours: log.recoveryTimeHours,
        isRecovered: log.isRecovered,
      }));

    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { workoutPlans: { orderBy: { createdAt: 'desc' }, take: 1 } },
    });

    const workoutFrequency = user?.workoutPlans[0]?.daysPerWeek || 3;
    const assessment = assessInjuryRisk(muscleUsageData, workoutFrequency);

    const report = await prisma.report.create({
      data: {
        userId,
        type: 'injury_risk',
        title: 'Injury Risk Assessment',
        content: JSON.parse(JSON.stringify({
          riskLevel: assessment.riskLevel,
          overusedMuscles: assessment.overusedMuscles,
          recommendations: assessment.recommendations,
          needsRestDay: assessment.needsRestDay,
          generatedAt: new Date().toISOString(),
        })),
        riskLevel: assessment.riskLevel,
        recommendations: assessment.recommendations,
      },
    });

    res.status(201).json({ message: 'Injury risk assessment generated', report, assessment });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.post('/muscle-usage', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId!;
    const { muscleId, muscleName, intensity, workoutFrequency } = req.body;

    if (!muscleId || !muscleName || !intensity) {
      return res.status(400).json({ error: 'muscleId, muscleName, and intensity are required' });
    }

    const recoveryTimeHours = calculateRecoveryTime(intensity);

    const existingLog = await prisma.muscleUsageLog.findFirst({ where: { userId, muscleId } });

    let log;
    if (existingLog) {
      log = await prisma.muscleUsageLog.update({
        where: { id: existingLog.id },
        data: {
          date: new Date(),
          lastWorkedDate: new Date(),
          workoutFrequency: workoutFrequency || existingLog.workoutFrequency,
          intensity,
          recoveryTimeHours,
          isRecovered: false,
        },
      });
    } else {
      log = await prisma.muscleUsageLog.create({
        data: {
          userId,
          bodyPartId: muscleId,
          muscleId,
          muscleName,
          date: new Date(),
          lastWorkedDate: new Date(),
          workoutFrequency: workoutFrequency || 3,
          intensity,
          recoveryTimeHours,
          isRecovered: false,
        },
      });
    }

    res.status(201).json({ message: 'Muscle usage logged successfully', log });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/analytics/trends', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId!;
    const metric = (req.query.metric as string) || 'calories';
    const days = parseInt(req.query.days as string) || 30;
    const data = await getTrendData(userId, metric, days);
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/analytics/summary', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId!;
    const period = (req.query.period as string) || 'week';
    const now = new Date();
    let startDate: Date;

    if (req.query.startDate) {
      startDate = new Date(req.query.startDate as string);
    } else if (period === 'week') {
      startDate = new Date(now);
      startDate.setDate(startDate.getDate() - 7);
    } else {
      startDate = new Date(now);
      startDate.setDate(startDate.getDate() - 30);
    }

    const endDate = req.query.endDate ? new Date(req.query.endDate as string) : now;
    const data = await getAnalyticsSummary(userId, period, startDate, endDate);
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/analytics/comparisons', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId!;
    const { period1Start, period1End, period2Start, period2End } = req.query;

    if (!period1Start || !period1End || !period2Start || !period2End) {
      return res.status(400).json({ error: 'All four date parameters are required' });
    }

    const data = await getPeriodComparison(
      userId,
      new Date(period1Start as string),
      new Date(period1End as string),
      new Date(period2Start as string),
      new Date(period2End as string),
    );
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/training/volume-by-muscle', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId!;
    const days = parseInt(req.query.days as string) || 30;
    const data = await getVolumeByMuscle(userId, days);
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/training/progression', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId!;
    const exerciseName = req.query.exerciseName as string;
    const days = parseInt(req.query.days as string) || 90;

    if (!exerciseName) {
      return res.status(400).json({ error: 'exerciseName is required' });
    }

    const data = await getExerciseProgression(userId, exerciseName, days);
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/training/heatmap', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId!;
    const weeks = parseInt(req.query.weeks as string) || 12;
    const data = await getTrainingHeatmap(userId, weeks);
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.post('/biomarkers', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId!;
    const { type, value, value2, unit, date, notes, source } = req.body;

    if (!type || value === undefined || !unit) {
      return res.status(400).json({ error: 'type, value, and unit are required' });
    }

    const log = await prisma.biomarkerLog.create({
      data: {
        userId,
        type,
        value,
        value2: value2 || null,
        unit,
        date: date ? new Date(date) : new Date(),
        notes: notes || null,
        source: source || 'manual',
      },
    });

    res.status(201).json({ message: 'Biomarker logged', log });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/biomarkers', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId!;
    const type = req.query.type as string;
    const days = parseInt(req.query.days as string) || 90;
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const where: any = { userId, date: { gte: startDate } };
    if (type) where.type = type;

    const logs = await prisma.biomarkerLog.findMany({
      where,
      orderBy: { date: 'desc' },
    });

    res.json(logs);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/health-summary', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId!;

    const [user, biomarkers] = await Promise.all([
      prisma.user.findUnique({
        where: { id: userId },
        select: { healthConditions: true, weight: true },
      }),
      prisma.biomarkerLog.findMany({
        where: { userId },
        orderBy: { date: 'desc' },
        take: 50,
      }),
    ]);

    const latestByType = new Map<string, any>();
    biomarkers.forEach(b => {
      if (!latestByType.has(b.type)) {
        latestByType.set(b.type, b);
      }
    });

    res.json({
      healthConditions: user?.healthConditions || [],
      latestBiomarkers: {
        weight: latestByType.get('weight') || null,
        bodyFat: latestByType.get('body_fat') || null,
        bloodPressure: latestByType.get('blood_pressure') || null,
        bloodGlucose: latestByType.get('blood_glucose') || null,
        heartRate: latestByType.get('heart_rate') || null,
        waist: latestByType.get('waist') || null,
      },
    });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/insights', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId!;
    const insights = await generateInsights(userId);
    res.json(insights);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.post('/generate', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId!;
    const { startDate, endDate, sections } = req.body;

    if (!startDate || !endDate) {
      return res.status(400).json({ error: 'startDate and endDate are required' });
    }

    const report = await generateFullReport(
      userId,
      new Date(startDate),
      new Date(endDate),
      sections || ['nutrition', 'training', 'activity', 'insights'],
    );

    res.status(201).json(report);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.post('/:id/share', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId!;
    const { id } = req.params;
    const { expiresInHours } = req.body;

    const report = await prisma.report.findFirst({ where: { id, userId } });
    if (!report) {
      return res.status(404).json({ error: 'Report not found' });
    }

    const share = await createShareToken(id, expiresInHours || 72);
    res.status(201).json({
      shareToken: share.shareToken,
      expiresAt: share.expiresAt,
    });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/shared/:shareToken', async (req, res) => {
  try {
    const { shareToken } = req.params;
    const report = await getSharedReport(shareToken);

    if (!report) {
      return res.status(404).json({ error: 'Report not found or expired' });
    }

    res.json(report);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId!;
    const { type } = req.query;
    const where: any = { userId };
    if (type && typeof type === 'string') where.type = type;

    const reports = await prisma.report.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    });

    res.status(200).json(reports);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/:id', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.userId!;

    const report = await prisma.report.findFirst({ where: { id, userId } });
    if (!report) {
      return res.status(404).json({ error: 'Report not found' });
    }

    res.status(200).json(report);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

function calculateRecoveryTime(intensity: number): number {
  if (intensity <= 3) return 24;
  if (intensity <= 6) return 48;
  if (intensity <= 8) return 72;
  return 96;
}

export default router;
