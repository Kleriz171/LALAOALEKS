import prisma from '../lib/prisma';
import { getAnalyticsSummary } from './analyticsService';
import { generateInsights } from './insightsEngine';
import crypto from 'crypto';

export async function generateFullReport(userId: string, startDate: Date, endDate: Date, sections: string[]) {
  const summary = await getAnalyticsSummary(userId, 'custom', startDate, endDate);

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { name: true, age: true, gender: true, weight: true, height: true, goal: true, healthConditions: true },
  });

  let insights: any[] = [];
  if (sections.includes('insights')) {
    insights = await generateInsights(userId);
  }

  let biomarkers: any[] = [];
  if (sections.includes('health')) {
    biomarkers = await prisma.biomarkerLog.findMany({
      where: { userId, date: { gte: startDate, lte: endDate } },
      orderBy: { date: 'desc' },
    });
  }

  const content = {
    user: {
      name: user?.name,
      age: user?.age,
      gender: user?.gender,
      weight: user?.weight,
      height: user?.height,
      goal: user?.goal,
      healthConditions: user?.healthConditions,
    },
    period: {
      start: startDate.toISOString().split('T')[0],
      end: endDate.toISOString().split('T')[0],
    },
    summary,
    insights,
    biomarkers,
    generatedAt: new Date().toISOString(),
  };

  const report = await prisma.report.create({
    data: {
      userId,
      type: 'comprehensive',
      title: `Report ${startDate.toLocaleDateString()} - ${endDate.toLocaleDateString()}`,
      startDate,
      endDate,
      content,
      nutritionData: summary.nutrition as any,
      trainingData: summary.training as any,
      activityData: summary.activity as any,
    },
  });

  return { ...report, content };
}

export async function createShareToken(reportId: string, expiresInHours?: number) {
  const shareToken = crypto.randomBytes(32).toString('hex');
  const expiresAt = expiresInHours ? new Date(Date.now() + expiresInHours * 60 * 60 * 1000) : null;

  const share = await prisma.reportShare.create({
    data: {
      reportId,
      shareToken,
      expiresAt,
    },
  });

  return share;
}

export async function getSharedReport(shareToken: string) {
  const share = await prisma.reportShare.findUnique({
    where: { shareToken },
    include: { report: true },
  });

  if (!share) return null;
  if (share.expiresAt && share.expiresAt < new Date()) return null;

  await prisma.reportShare.update({
    where: { id: share.id },
    data: { accessCount: share.accessCount + 1 },
  });

  return share.report;
}
