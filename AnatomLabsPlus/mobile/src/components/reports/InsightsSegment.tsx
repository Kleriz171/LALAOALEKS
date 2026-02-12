import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { GlassCard, Skeleton, SlideIn, COLORS } from '../animations';
import { RadarChart } from '../charts';
import api from '../../services/api';
import { InsightItem, AnalyticsSummary } from '../../types';

export default function InsightsSegment() {
  const [insights, setInsights] = useState<InsightItem[]>([]);
  const [summary, setSummary] = useState<AnalyticsSummary | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [insightData, summaryData] = await Promise.all([
        api.getInsights(),
        api.getAnalyticsSummary('month'),
      ]);
      setInsights(insightData);
      setSummary(summaryData);
    } catch (e) {
      console.error('Failed to load insights:', e);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <Skeleton width="100%" height={200} borderRadius={16} />
        <Skeleton width="100%" height={120} borderRadius={16} style={{ marginTop: 12 }} />
        <Skeleton width="100%" height={120} borderRadius={16} style={{ marginTop: 12 }} />
      </View>
    );
  }

  const radarData = summary ? [
    { label: 'Nutrition', value: Math.min(summary.nutrition.adherenceScore || (summary.nutrition.daysTracked / 30 * 100), 100) },
    { label: 'Training', value: Math.min((summary.training.totalWorkouts / 12) * 100, 100) },
    { label: 'Steps', value: Math.min((summary.activity.avgSteps / 10000) * 100, 100) },
    { label: 'Sleep', value: Math.min((summary.activity.avgSleepHours / 8) * 100, 100) },
    { label: 'Hydration', value: Math.min((summary.activity.avgWaterIntake / 2500) * 100, 100) },
  ] : [];

  return (
    <View style={styles.container}>
      {radarData.length > 0 && (
        <GlassCard>
          <View style={styles.cardHeader}>
            <Ionicons name="analytics-outline" size={20} color={COLORS.info} />
            <Text style={styles.cardTitle}>Performance Overview</Text>
          </View>
          <RadarChart data={radarData} size={220} color={COLORS.primary} />
        </GlassCard>
      )}

      {insights.length > 0 ? (
        insights.map((insight, i) => (
          <SlideIn key={insight.id || i} direction="bottom" delay={100 + i * 50}>
            <GlassCard>
              <View style={styles.insightHeader}>
                <View style={[styles.insightIcon, { backgroundColor: (insight.color || COLORS.info) + '20' }]}>
                  <Ionicons name={(insight.icon || 'bulb-outline') as any} size={22} color={insight.color || COLORS.info} />
                </View>
                <View style={{ flex: 1 }}>
                  <View style={styles.insightTitleRow}>
                    <Text style={styles.insightTitle}>{insight.title}</Text>
                    <View style={[styles.typeBadge, {
                      backgroundColor: insight.type === 'pattern' ? COLORS.info + '20' :
                        insight.type === 'prediction' ? COLORS.warning + '20' : COLORS.success + '20'
                    }]}>
                      <Text style={[styles.typeBadgeText, {
                        color: insight.type === 'pattern' ? COLORS.info :
                          insight.type === 'prediction' ? COLORS.warning : COLORS.success
                      }]}>
                        {insight.type}
                      </Text>
                    </View>
                  </View>
                  <Text style={styles.insightDescription}>{insight.description}</Text>
                </View>
              </View>
              {insight.confidence > 0 && (
                <View style={styles.confidenceRow}>
                  <Text style={styles.confidenceLabel}>Confidence</Text>
                  <View style={styles.confidenceBar}>
                    <View style={[styles.confidenceFill, { width: `${insight.confidence * 100}%`, backgroundColor: insight.color || COLORS.info }]} />
                  </View>
                  <Text style={styles.confidenceValue}>{Math.round(insight.confidence * 100)}%</Text>
                </View>
              )}
            </GlassCard>
          </SlideIn>
        ))
      ) : (
        <GlassCard>
          <View style={styles.empty}>
            <Ionicons name="bulb-outline" size={40} color={COLORS.textTertiary} />
            <Text style={styles.emptyTitle}>No Insights Yet</Text>
            <Text style={styles.emptyText}>Keep tracking your activity, nutrition, and workouts. Insights will appear once there is enough data to analyze.</Text>
          </View>
        </GlassCard>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { gap: 12 },
  cardHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 12 },
  cardTitle: { fontSize: 16, fontWeight: '600', color: COLORS.text },
  insightHeader: { flexDirection: 'row', gap: 12 },
  insightIcon: { width: 44, height: 44, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  insightTitleRow: { flexDirection: 'row', alignItems: 'center', gap: 8, flexWrap: 'wrap' },
  insightTitle: { fontSize: 15, fontWeight: '600', color: COLORS.text },
  typeBadge: { paddingHorizontal: 8, paddingVertical: 2, borderRadius: 6 },
  typeBadgeText: { fontSize: 10, fontWeight: '600', textTransform: 'capitalize' },
  insightDescription: { fontSize: 13, color: COLORS.textSecondary, lineHeight: 19, marginTop: 4 },
  confidenceRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 12, paddingTop: 12, borderTopWidth: 1, borderTopColor: COLORS.border },
  confidenceLabel: { fontSize: 11, color: COLORS.textTertiary },
  confidenceBar: { flex: 1, height: 4, backgroundColor: COLORS.cardBackgroundLight, borderRadius: 2, overflow: 'hidden' },
  confidenceFill: { height: '100%', borderRadius: 2 },
  confidenceValue: { fontSize: 11, fontWeight: '600', color: COLORS.textSecondary, width: 32, textAlign: 'right' },
  empty: { alignItems: 'center', paddingVertical: 30, gap: 8 },
  emptyTitle: { fontSize: 16, fontWeight: '600', color: COLORS.text },
  emptyText: { fontSize: 13, color: COLORS.textTertiary, textAlign: 'center', lineHeight: 19, paddingHorizontal: 20 },
});
