import { Router, Response } from 'express';
import prisma from '../lib/prisma';
import { authenticateToken, AuthRequest } from '../middleware/auth';

const router = Router();

// POST /api/activity/log - Log activity
router.post('/log', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId!;
    const { activityType, duration, intensity, caloriesBurned, steps, date, notes } = req.body;

    if (!activityType || !duration) {
      return res.status(400).json({
        error: 'activityType and duration are required'
      });
    }

    const log = await prisma.activityLog.create({
      data: {
        userId,
        activityType,
        duration,
        intensity: intensity || 'moderate',
        caloriesBurned: caloriesBurned || 0,
        steps: steps || 0,
        date: date ? new Date(date) : new Date(),
        notes: notes || null,
      }
    });

    res.status(201).json({
      message: 'Activity logged successfully',
      log
    });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /api/activity/logs - Get activity logs
router.get('/logs', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId!;
    const { startDate, endDate, activityType } = req.query;

    const where: any = { userId };

    if (startDate && endDate) {
      where.date = {
        gte: new Date(startDate as string),
        lte: new Date(endDate as string)
      };
    }

    if (activityType && typeof activityType === 'string') {
      where.activityType = activityType;
    }

    const logs = await prisma.activityLog.findMany({
      where,
      orderBy: {
        date: 'desc'
      }
    });

    res.status(200).json(logs);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /api/activity/stats - Get activity statistics
router.get('/stats', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId!;
    const { startDate, endDate } = req.query;

    if (!startDate || !endDate) {
      return res.status(400).json({
        error: 'startDate and endDate are required'
      });
    }

    const logs = await prisma.activityLog.findMany({
      where: {
        userId,
        date: {
          gte: new Date(startDate as string),
          lte: new Date(endDate as string)
        }
      }
    });

    const stats = {
      totalActivities: logs.length,
      totalDuration: logs.reduce((sum, log) => sum + (log.duration || 0), 0),
      totalCaloriesBurned: logs.reduce((sum, log) => sum + log.caloriesBurned, 0),
      totalSteps: logs.reduce((sum, log) => sum + log.steps, 0),
      activityBreakdown: logs.reduce((acc: any, log) => {
        const type = log.activityType || 'unknown';
        if (!acc[type]) {
          acc[type] = {
            count: 0,
            totalDuration: 0,
            totalCalories: 0
          };
        }
        acc[type].count++;
        acc[type].totalDuration += log.duration || 0;
        acc[type].totalCalories += log.caloriesBurned;
        return acc;
      }, {})
    };

    res.status(200).json(stats);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// DELETE /api/activity/logs/:id - Delete activity log
router.delete('/logs/:id', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.userId!;

    const log = await prisma.activityLog.findFirst({
      where: {
        id,
        userId
      }
    });

    if (!log) {
      return res.status(404).json({ error: 'Activity log not found' });
    }

    await prisma.activityLog.delete({
      where: { id }
    });

    res.status(200).json({ message: 'Activity log deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
