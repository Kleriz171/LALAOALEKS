import { Router, Response } from 'express';
import prisma from '../lib/prisma';
import { authenticateToken, AuthRequest } from '../middleware/auth';
import { assessInjuryRisk, MuscleUsageData } from '../services/injuryPrevention';

const router = Router();

// POST /api/reports/injury-risk - Generate injury risk assessment
router.post('/injury-risk', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId!;

    const muscleUsageLogs = await prisma.muscleUsageLog.findMany({
      where: { userId },
      orderBy: {
        lastWorkedDate: 'desc'
      }
    });

    if (muscleUsageLogs.length === 0) {
      return res.status(200).json({
        riskLevel: 'low',
        overusedMuscles: [],
        recommendations: ['Start tracking your workouts to get injury risk assessments'],
        needsRestDay: false
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
        isRecovered: log.isRecovered
      }));

    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        workoutPlans: {
          orderBy: { createdAt: 'desc' },
          take: 1
        }
      }
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
          generatedAt: new Date().toISOString()
        })),
        riskLevel: assessment.riskLevel,
        recommendations: assessment.recommendations
      }
    });

    res.status(201).json({
      message: 'Injury risk assessment generated',
      report,
      assessment
    });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST /api/reports/muscle-usage - Log muscle usage after workout
router.post('/muscle-usage', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId!;
    const { muscleId, muscleName, intensity, workoutFrequency } = req.body;

    if (!muscleId || !muscleName || !intensity) {
      return res.status(400).json({
        error: 'muscleId, muscleName, and intensity are required'
      });
    }

    const recoveryTimeHours = calculateRecoveryTime(intensity);

    const existingLog = await prisma.muscleUsageLog.findFirst({
      where: {
        userId,
        muscleId
      }
    });

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
          isRecovered: false
        }
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
          isRecovered: false
        }
      });
    }

    res.status(201).json({
      message: 'Muscle usage logged successfully',
      log
    });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /api/reports - Get all reports for user
router.get('/', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId!;
    const { type } = req.query;

    const where: any = { userId };

    if (type && typeof type === 'string') {
      where.type = type;
    }

    const reports = await prisma.report.findMany({
      where,
      orderBy: {
        createdAt: 'desc'
      }
    });

    res.status(200).json(reports);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /api/reports/:id - Get report by id
router.get('/:id', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.userId!;

    const report = await prisma.report.findFirst({
      where: {
        id,
        userId
      }
    });

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
