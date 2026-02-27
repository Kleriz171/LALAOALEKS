import { Router, Response } from 'express';
import prisma from '../lib/prisma';
import { authenticateToken, AuthRequest } from '../middleware/auth';

const router = Router();

// Helper to get start and end of a day
function getDayBounds(date: Date) {
  const start = new Date(date);
  start.setHours(0, 0, 0, 0);
  const end = new Date(date);
  end.setHours(23, 59, 59, 999);
  return { start, end };
}

// GET /api/activity/today - Get or create today's activity log
router.get('/today', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId!;
    const { start, end } = getDayBounds(new Date());

    // Find today's log or create one
    let todayLog = await prisma.activityLog.findFirst({
      where: {
        userId,
        date: { gte: start, lte: end }
      }
    });

    if (!todayLog) {
      todayLog = await prisma.activityLog.create({
        data: {
          userId,
          date: new Date(),
          steps: 0,
          waterIntake: 0,
          sleepHours: null,
          caloriesBurned: 0,
        }
      });
    }

    res.json(todayLog);
  } catch (error) {
    console.error('Error getting today activity:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// PUT /api/activity/today - Update today's activity log
router.put('/today', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId!;
    const { steps, waterIntake, sleepHours } = req.body;
    const { start, end } = getDayBounds(new Date());

    // Find today's log or create one
    let todayLog = await prisma.activityLog.findFirst({
      where: {
        userId,
        date: { gte: start, lte: end }
      }
    });

    if (!todayLog) {
      todayLog = await prisma.activityLog.create({
        data: {
          userId,
          date: new Date(),
          steps: steps || 0,
          waterIntake: waterIntake || 0,
          sleepHours: sleepHours || null,
          caloriesBurned: 0,
        }
      });
    } else {
      todayLog = await prisma.activityLog.update({
        where: { id: todayLog.id },
        data: {
          ...(steps !== undefined && { steps }),
          ...(waterIntake !== undefined && { waterIntake }),
          ...(sleepHours !== undefined && { sleepHours }),
        }
      });
    }

    res.json({
      message: 'Activity updated successfully',
      log: todayLog
    });
  } catch (error) {
    console.error('Error updating today activity:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /api/activity - Get activity log for a specific date (or today)
router.get('/', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId!;
    const dateParam = req.query.date as string;

    const targetDate = dateParam ? new Date(dateParam) : new Date();
    const { start, end } = getDayBounds(targetDate);

    const activityLog = await prisma.activityLog.findFirst({
      where: {
        userId,
        date: { gte: start, lte: end }
      }
    });

    if (!activityLog) {
      return res.json({
        success: true,
        data: {
          date: targetDate.toISOString(),
          steps: 0,
          waterIntake: 0,
          sleepHours: null,
          caloriesBurned: 0,
        }
      });
    }

    res.json({ success: true, data: activityLog });
  } catch (error) {
    console.error('Error getting activity:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST /api/activity/log - Log activity
router.post('/log', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId!;
    const { activityType, duration, intensity, caloriesBurned, steps, waterIntake, sleepHours, date, notes } = req.body;

    // For general activity logging (workouts, runs, etc.), require activityType and duration
    // For daily tracking (steps, water, sleep), allow without those fields
    const isGeneralActivity = activityType || duration;

    if (isGeneralActivity && (!activityType || !duration)) {
      return res.status(400).json({
        error: 'activityType and duration are required for activity logging'
      });
    }

    const log = await prisma.activityLog.create({
      data: {
        userId,
        activityType: activityType || null,
        duration: duration || null,
        intensity: intensity || 'moderate',
        caloriesBurned: caloriesBurned || 0,
        steps: steps || 0,
        waterIntake: waterIntake || 0,
        sleepHours: sleepHours || null,
        date: date ? new Date(date) : new Date(),
        notes: notes || null,
      }
    });

    res.status(201).json({
      message: 'Activity logged successfully',
      log
    });
  } catch (error) {
    console.error('Error logging activity:', error);
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
