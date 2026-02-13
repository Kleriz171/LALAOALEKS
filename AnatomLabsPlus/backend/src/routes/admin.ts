import { Router, Response } from 'express';
import prisma from '../lib/prisma';
import { authenticateToken, AuthRequest } from '../middleware/auth';
import { requireAdmin } from '../middleware/admin';

const router = Router();

router.get('/stats', authenticateToken, requireAdmin, async (req: AuthRequest, res: Response) => {
  try {
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const [
      totalUsers,
      newUsersThisWeek,
      totalCoaches,
      bannedUsers,
      totalBookings,
      pendingApplications,
      totalWorkoutSessions,
      totalFoods,
      totalExercises,
      activeWorkoutUsers,
      activeNutritionUsers,
      activeActivityUsers,
    ] = await Promise.all([
      prisma.user.count(),
      prisma.user.count({ where: { createdAt: { gte: sevenDaysAgo } } }),
      prisma.user.count({ where: { isCoach: true } }),
      prisma.user.count({ where: { isBanned: true } }),
      prisma.booking.count(),
      prisma.coachApplication.count({ where: { status: 'PENDING' } }),
      prisma.workoutSession.count(),
      prisma.food.count(),
      prisma.exercise.count(),
      prisma.workoutSession.findMany({
        where: { completedAt: { gte: sevenDaysAgo } },
        select: { userId: true },
        distinct: ['userId'],
      }),
      prisma.nutritionLog.findMany({
        where: { createdAt: { gte: sevenDaysAgo } },
        select: { userId: true },
        distinct: ['userId'],
      }),
      prisma.activityLog.findMany({
        where: { createdAt: { gte: sevenDaysAgo } },
        select: { userId: true },
        distinct: ['userId'],
      }),
    ]);

    const activeUserIds = new Set([
      ...activeWorkoutUsers.map(u => u.userId),
      ...activeNutritionUsers.map(u => u.userId),
      ...activeActivityUsers.map(u => u.userId),
    ]);

    res.json({
      totalUsers,
      activeUsers: activeUserIds.size,
      newUsersThisWeek,
      totalCoaches,
      bannedUsers,
      totalBookings,
      pendingApplications,
      totalWorkoutSessions,
      totalFoods,
      totalExercises,
    });
  } catch (error) {
    console.error('Error fetching admin stats:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/users', authenticateToken, requireAdmin, async (req: AuthRequest, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const search = (req.query.search as string) || '';
    const role = req.query.role as string;

    const where: any = {};

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
      ];
    }

    if (role === 'admin') where.isAdmin = true;
    else if (role === 'coach') where.isCoach = true;
    else if (role === 'banned') where.isBanned = true;

    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where,
        select: {
          id: true,
          email: true,
          name: true,
          isAdmin: true,
          isCoach: true,
          isBanned: true,
          goal: true,
          experienceLevel: true,
          createdAt: true,
          _count: {
            select: {
              workoutSessions: true,
              nutritionLogs: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.user.count({ where }),
    ]);

    res.json({
      users,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/users/:id', authenticateToken, requireAdmin, async (req: AuthRequest, res: Response) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.params.id },
      select: {
        id: true,
        email: true,
        name: true,
        age: true,
        gender: true,
        weight: true,
        height: true,
        goal: true,
        experienceLevel: true,
        activityLevel: true,
        isAdmin: true,
        isCoach: true,
        isBanned: true,
        healthConditions: true,
        physicalLimitations: true,
        foodAllergies: true,
        dietaryPreferences: true,
        createdAt: true,
        coachProfile: true,
        coachApplication: true,
        _count: {
          select: {
            workoutSessions: true,
            nutritionLogs: true,
            activityLogs: true,
            bookingsAsClient: true,
          },
        },
      },
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    console.error('Error fetching user detail:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.put('/users/:id', authenticateToken, requireAdmin, async (req: AuthRequest, res: Response) => {
  try {
    const { isAdmin, isCoach, isBanned } = req.body;

    if (req.params.id === req.userId && isAdmin === false) {
      return res.status(400).json({ error: 'Cannot remove your own admin status' });
    }

    const data: any = {};
    if (typeof isAdmin === 'boolean') data.isAdmin = isAdmin;
    if (typeof isCoach === 'boolean') data.isCoach = isCoach;
    if (typeof isBanned === 'boolean') data.isBanned = isBanned;

    const updated = await prisma.user.update({
      where: { id: req.params.id },
      data,
      select: {
        id: true,
        email: true,
        name: true,
        isAdmin: true,
        isCoach: true,
        isBanned: true,
      },
    });

    res.json(updated);
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.put('/users/:id/ban', authenticateToken, requireAdmin, async (req: AuthRequest, res: Response) => {
  try {
    const { isBanned } = req.body;

    if (req.params.id === req.userId) {
      return res.status(400).json({ error: 'Cannot ban yourself' });
    }

    const target = await prisma.user.findUnique({ where: { id: req.params.id }, select: { isAdmin: true } });
    if (!target) return res.status(404).json({ error: 'User not found' });
    if (target.isAdmin) return res.status(400).json({ error: 'Cannot ban an admin user' });

    const updated = await prisma.user.update({
      where: { id: req.params.id },
      data: { isBanned: !!isBanned },
      select: {
        id: true,
        email: true,
        name: true,
        isAdmin: true,
        isCoach: true,
        isBanned: true,
      },
    });

    res.json(updated);
  } catch (error) {
    console.error('Error banning user:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.delete('/users/:id', authenticateToken, requireAdmin, async (req: AuthRequest, res: Response) => {
  try {
    if (req.params.id === req.userId) {
      return res.status(400).json({ error: 'Cannot delete your own account' });
    }

    await prisma.user.delete({ where: { id: req.params.id } });
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/analytics', authenticateToken, requireAdmin, async (req: AuthRequest, res: Response) => {
  try {
    const days = parseInt(req.query.days as string) || 30;
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);
    const startISO = startDate.toISOString();

    const [userGrowthRaw, dauRaw, workoutsRaw, nutritionRaw, revenueRaw, totalRevenueRaw] = await Promise.all([
      prisma.$queryRawUnsafe<{ date: string; count: bigint }[]>(
        `SELECT DATE("createdAt") as date, COUNT(*)::bigint as count FROM users WHERE "createdAt" >= $1::timestamp GROUP BY DATE("createdAt") ORDER BY date`,
        startISO
      ),
      prisma.$queryRawUnsafe<{ date: string; count: bigint }[]>(
        `SELECT d.date, COUNT(DISTINCT d.uid)::bigint as count FROM (
          SELECT DATE("completedAt") as date, "userId" as uid FROM workout_sessions WHERE "completedAt" >= $1::timestamp
          UNION ALL
          SELECT DATE("date") as date, "userId" as uid FROM nutrition_logs WHERE "date" >= $1::timestamp
          UNION ALL
          SELECT DATE("date") as date, "userId" as uid FROM activity_logs WHERE "date" >= $1::timestamp
        ) d GROUP BY d.date ORDER BY d.date`,
        startISO
      ),
      prisma.$queryRawUnsafe<{ date: string; count: bigint }[]>(
        `SELECT DATE("completedAt") as date, COUNT(*)::bigint as count FROM workout_sessions WHERE "completedAt" >= $1::timestamp GROUP BY DATE("completedAt") ORDER BY date`,
        startISO
      ),
      prisma.$queryRawUnsafe<{ date: string; count: bigint }[]>(
        `SELECT DATE("date") as date, COUNT(*)::bigint as count FROM nutrition_logs WHERE "date" >= $1::timestamp GROUP BY DATE("date") ORDER BY date`,
        startISO
      ),
      prisma.$queryRawUnsafe<{ date: string; amount: number }[]>(
        `SELECT DATE("createdAt") as date, COALESCE(SUM(price), 0)::float as amount FROM bookings WHERE status = 'COMPLETED' AND "createdAt" >= $1::timestamp GROUP BY DATE("createdAt") ORDER BY date`,
        startISO
      ),
      prisma.$queryRawUnsafe<{ total: number }[]>(
        `SELECT COALESCE(SUM(price), 0)::float as total FROM bookings WHERE status = 'COMPLETED'`
      ),
    ]);

    const totalUsers = await prisma.user.count();
    const [workoutUsers, nutritionUsers, activityUsers, coachingUsers] = await Promise.all([
      prisma.workoutSession.findMany({ select: { userId: true }, distinct: ['userId'] }),
      prisma.nutritionLog.findMany({ select: { userId: true }, distinct: ['userId'] }),
      prisma.activityLog.findMany({ select: { userId: true }, distinct: ['userId'] }),
      prisma.booking.findMany({ select: { clientId: true }, distinct: ['clientId'] }),
    ]);

    const pct = (n: number) => totalUsers > 0 ? Math.round((n / totalUsers) * 100) : 0;

    res.json({
      userGrowth: userGrowthRaw.map(r => ({ date: String(r.date), count: Number(r.count) })),
      dailyActiveUsers: dauRaw.map(r => ({ date: String(r.date), count: Number(r.count) })),
      workoutSessionsPerDay: workoutsRaw.map(r => ({ date: String(r.date), count: Number(r.count) })),
      nutritionLogsPerDay: nutritionRaw.map(r => ({ date: String(r.date), count: Number(r.count) })),
      revenue: revenueRaw.map(r => ({ date: String(r.date), amount: Number(r.amount) })),
      totalRevenue: Number(totalRevenueRaw[0]?.total || 0),
      featureAdoption: {
        workouts: { users: workoutUsers.length, percentage: pct(workoutUsers.length) },
        nutrition: { users: nutritionUsers.length, percentage: pct(nutritionUsers.length) },
        activity: { users: activityUsers.length, percentage: pct(activityUsers.length) },
        coaching: { users: coachingUsers.length, percentage: pct(coachingUsers.length) },
      },
    });
  } catch (error) {
    console.error('Error fetching analytics:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/analytics/users', authenticateToken, requireAdmin, async (req: AuthRequest, res: Response) => {
  try {
    const allUsers = await prisma.user.findMany({
      select: { goal: true, experienceLevel: true, gender: true, activityLevel: true, healthConditions: true, age: true },
    });

    const goalCounts: Record<string, number> = {};
    const expCounts: Record<string, number> = {};
    const genderCounts: Record<string, number> = {};
    const actCounts: Record<string, number> = {};
    const condCounts: Record<string, number> = {};
    const ageBuckets: Record<string, number> = { '13-17': 0, '18-24': 0, '25-34': 0, '35-44': 0, '45-54': 0, '55+': 0 };

    for (const u of allUsers) {
      const g = u.goal || 'Not set';
      goalCounts[g] = (goalCounts[g] || 0) + 1;

      const e = u.experienceLevel || 'Not set';
      expCounts[e] = (expCounts[e] || 0) + 1;

      const gen = u.gender || 'Not set';
      genderCounts[gen] = (genderCounts[gen] || 0) + 1;

      const act = u.activityLevel || 'Not set';
      actCounts[act] = (actCounts[act] || 0) + 1;

      for (const c of u.healthConditions) {
        condCounts[c] = (condCounts[c] || 0) + 1;
      }

      if (u.age) {
        if (u.age < 18) ageBuckets['13-17']++;
        else if (u.age < 25) ageBuckets['18-24']++;
        else if (u.age < 35) ageBuckets['25-34']++;
        else if (u.age < 45) ageBuckets['35-44']++;
        else if (u.age < 55) ageBuckets['45-54']++;
        else ageBuckets['55+']++;
      }
    }

    const toArr = (obj: Record<string, number>) =>
      Object.entries(obj).map(([label, value]) => ({ label, value })).sort((a, b) => b.value - a.value);

    const topConditions = toArr(condCounts).slice(0, 10);

    res.json({
      goalDistribution: toArr(goalCounts),
      experienceLevels: toArr(expCounts),
      genderSplit: toArr(genderCounts),
      activityLevels: toArr(actCounts),
      healthConditions: topConditions,
      ageRanges: Object.entries(ageBuckets).map(([label, value]) => ({ label, value })),
    });
  } catch (error) {
    console.error('Error fetching user demographics:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/analytics/engagement', authenticateToken, requireAdmin, async (req: AuthRequest, res: Response) => {
  try {
    const days = parseInt(req.query.days as string) || 30;
    const now = new Date();

    const d7 = new Date(now); d7.setDate(d7.getDate() - 7);
    const d30 = new Date(now); d30.setDate(d30.getDate() - 30);
    const d90 = new Date(now); d90.setDate(d90.getDate() - 90);

    const totalUsers = await prisma.user.count();

    const getActiveCount = async (since: Date) => {
      const [w, n, a] = await Promise.all([
        prisma.workoutSession.findMany({ where: { completedAt: { gte: since } }, select: { userId: true }, distinct: ['userId'] }),
        prisma.nutritionLog.findMany({ where: { createdAt: { gte: since } }, select: { userId: true }, distinct: ['userId'] }),
        prisma.activityLog.findMany({ where: { createdAt: { gte: since } }, select: { userId: true }, distinct: ['userId'] }),
      ]);
      return new Set([...w.map(x => x.userId), ...n.map(x => x.userId), ...a.map(x => x.userId)]).size;
    };

    const [active7, active30, active90] = await Promise.all([
      getActiveCount(d7),
      getActiveCount(d30),
      getActiveCount(d90),
    ]);

    const retPct = (active: number) => totalUsers > 0 ? Math.round((active / totalUsers) * 100) : 0;

    const weeksInRange = Math.max(1, days / 7);
    const workoutCount = await prisma.workoutSession.count({ where: { completedAt: { gte: d30 } } });
    const workoutUserCount = (await prisma.workoutSession.findMany({ where: { completedAt: { gte: d30 } }, select: { userId: true }, distinct: ['userId'] })).length;
    const avgWorkoutsPerUserPerWeek = workoutUserCount > 0 ? Math.round((workoutCount / workoutUserCount / weeksInRange) * 10) / 10 : 0;

    const nutritionCount = await prisma.nutritionLog.count({ where: { createdAt: { gte: d30 } } });
    const nutritionUserCount = (await prisma.nutritionLog.findMany({ where: { createdAt: { gte: d30 } }, select: { userId: true }, distinct: ['userId'] })).length;
    const avgNutritionLogsPerUserPerDay = nutritionUserCount > 0 ? Math.round((nutritionCount / nutritionUserCount / days) * 10) / 10 : 0;

    const topExercisesRaw = await prisma.$queryRawUnsafe<{ name: string; count: bigint }[]>(
      `SELECT "exerciseName" as name, COUNT(*)::bigint as count FROM workout_session_exercises GROUP BY "exerciseName" ORDER BY count DESC LIMIT 10`
    );

    const topFoodsRaw = await prisma.$queryRawUnsafe<{ name: string; count: bigint }[]>(
      `SELECT f.name, COUNT(*)::bigint as count FROM nutrition_logs nl JOIN foods f ON nl."foodId" = f.id GROUP BY f.name ORDER BY count DESC LIMIT 10`
    );

    const heatmapStart = new Date(now);
    heatmapStart.setDate(heatmapStart.getDate() - 84);
    const heatmapRaw = await prisma.$queryRawUnsafe<{ date: string; count: bigint }[]>(
      `SELECT DATE("completedAt") as date, COUNT(*)::bigint as count FROM workout_sessions WHERE "completedAt" >= $1::timestamp GROUP BY DATE("completedAt") ORDER BY date`,
      heatmapStart.toISOString()
    );

    res.json({
      retention: {
        days7: { active: active7, total: totalUsers, percentage: retPct(active7) },
        days30: { active: active30, total: totalUsers, percentage: retPct(active30) },
        days90: { active: active90, total: totalUsers, percentage: retPct(active90) },
      },
      avgWorkoutsPerUserPerWeek,
      avgNutritionLogsPerUserPerDay,
      topExercises: topExercisesRaw.map(r => ({ label: r.name, value: Number(r.count) })),
      topFoods: topFoodsRaw.map(r => ({ label: r.name, value: Number(r.count) })),
      platformHeatmap: heatmapRaw.map(r => ({ date: String(r.date), value: Number(r.count) })),
    });
  } catch (error) {
    console.error('Error fetching engagement:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/applications', authenticateToken, requireAdmin, async (req: AuthRequest, res: Response) => {
  try {
    const { status } = req.query;

    const where: any = {};
    if (status) where.status = status;

    const applications = await prisma.coachApplication.findMany({
      where,
      include: {
        user: { select: { id: true, name: true, email: true } },
      },
      orderBy: { createdAt: 'desc' },
    });

    res.json(applications);
  } catch (error) {
    console.error('Error fetching applications:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/applications/:id', authenticateToken, requireAdmin, async (req: AuthRequest, res: Response) => {
  try {
    const application = await prisma.coachApplication.findUnique({
      where: { id: req.params.id },
      include: {
        user: { select: { id: true, name: true, email: true } },
      },
    });

    if (!application) {
      return res.status(404).json({ error: 'Application not found' });
    }

    res.json(application);
  } catch (error) {
    console.error('Error fetching application:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.put('/applications/:id/approve', authenticateToken, requireAdmin, async (req: AuthRequest, res: Response) => {
  try {
    const application = await prisma.coachApplication.findUnique({
      where: { id: req.params.id },
      include: { user: true },
    });

    if (!application) {
      return res.status(404).json({ error: 'Application not found' });
    }

    if (application.status !== 'PENDING') {
      return res.status(400).json({ error: 'Application is not pending' });
    }

    await prisma.$transaction([
      prisma.coachApplication.update({
        where: { id: req.params.id },
        data: {
          status: 'APPROVED',
          reviewedBy: req.userId,
        },
      }),
      prisma.user.update({
        where: { id: application.userId },
        data: { isCoach: true },
      }),
      prisma.coachProfile.create({
        data: {
          userId: application.userId,
          specialty: application.specialty,
          bio: application.bio,
          experience: application.experience,
          certifications: [],
          verified: false,
        },
      }),
    ]);

    res.json({ message: 'Application approved' });
  } catch (error) {
    console.error('Error approving application:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.put('/applications/:id/reject', authenticateToken, requireAdmin, async (req: AuthRequest, res: Response) => {
  try {
    const { note } = req.body;

    const application = await prisma.coachApplication.findUnique({
      where: { id: req.params.id },
    });

    if (!application) {
      return res.status(404).json({ error: 'Application not found' });
    }

    if (application.status !== 'PENDING') {
      return res.status(400).json({ error: 'Application is not pending' });
    }

    await prisma.coachApplication.update({
      where: { id: req.params.id },
      data: {
        status: 'REJECTED',
        reviewedBy: req.userId,
        reviewNote: note || null,
      },
    });

    res.json({ message: 'Application rejected' });
  } catch (error) {
    console.error('Error rejecting application:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
