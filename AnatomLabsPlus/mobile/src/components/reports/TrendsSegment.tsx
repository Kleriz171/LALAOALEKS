import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { GlassCard, Skeleton, COLORS } from '../animations';
import { LineChart } from '../charts';
import { ComparisonBars } from '../charts';
import api from '../../services/api';
import { TrendData, TrendMetric, AnalyticsSummary } from '../../types';

const metrics: { key: TrendMetric; label: string; icon: string; color: string; suffix: string }[] = [
  { key: 'calories', label: 'Calories', icon: 'flame-outline', color: COLORS.primary, suffix: ' cal' },
  { key: 'protein', label: 'Protein', icon: 'nutrition-outline', color: COLORS.info, suffix: 'g' },
  { key: 'weight', label: 'Weight', icon: 'scale-outline', color: COLORS.warning, suffix: ' kg' },
  { key: 'volume', label: 'Volume', icon: 'barbell-outline', color: COLORS.success, suffix: ' kg' },
  { key: 'steps', label: 'Steps', icon: 'footsteps-outline', color: '#9b59b6', suffix: '' },
];

export default function TrendsSegment() {
  const [selectedMetric, setSelectedMetric] = useState<TrendMetric>('calories');
  const [trendData, setTrendData] = useState<TrendData | null>(null);
  const [summary, setSummary] = useState<AnalyticsSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [days, setDays] = useState(30);

  useEffect(() => {
    loadData();
  }, [selectedMetric, days]);

  const loadData = async () => {
    setLoading(true);
    try {
      const [trend, sum] = await Promise.all([
        api.getTrends(selectedMetric, days),
        api.getAnalyticsSummary(days <= 7 ? 'week' : 'month'),
      ]);
      setTrendData(trend);
      setSummary(sum);
    } catch (e) {
      console.error('Failed to load trends:', e);
    } finally {
      setLoading(false);
    }
  };

  const metricConfig = metrics.find(m => m.key === selectedMetric)!;

  return (
    <View style={styles.container}>
      <View style={styles.metricPills}>
        {metrics.map(m => (
          <TouchableOpacity
            key={m.key}
            style={[styles.metricPill, selectedMetric === m.key && { backgroundColor: m.color }]}
            onPress={() => setSelectedMetric(m.key)}
          >
            <Ionicons name={m.icon as any} size={14} color={selectedMetric === m.key ? '#fff' : COLORS.textSecondary} />
            <Text style={[styles.metricPillText, selectedMetric === m.key && { color: '#fff' }]}>{m.label}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.daysPills}>
        {[7, 30, 90].map(d => (
          <TouchableOpacity
            key={d}
            style={[styles.dayPill, days === d && styles.dayPillActive]}
            onPress={() => setDays(d)}
          >
            <Text style={[styles.dayPillText, days === d && styles.dayPillTextActive]}>{d}d</Text>
          </TouchableOpacity>
        ))}
      </View>

      {loading ? (
        <View style={styles.skeletons}>
          <Skeleton width="100%" height={220} borderRadius={16} />
          <Skeleton width="100%" height={100} borderRadius={16} style={{ marginTop: 12 }} />
        </View>
      ) : (
        <>
          <GlassCard style={styles.chartCard}>
            <View style={styles.chartHeader}>
              <Text style={styles.chartTitle}>{metricConfig.label} Trend</Text>
              {trendData && (
                <View style={[styles.trendBadge, { backgroundColor: (trendData.trend === 'up' ? COLORS.success : trendData.trend === 'down' ? COLORS.error : COLORS.info) + '20' }]}>
                  <Ionicons
                    name={trendData.trend === 'up' ? 'trending-up' : trendData.trend === 'down' ? 'trending-down' : 'remove-outline'}
                    size={14}
                    color={trendData.trend === 'up' ? COLORS.success : trendData.trend === 'down' ? COLORS.error : COLORS.info}
                  />
                  <Text style={{ color: trendData.trend === 'up' ? COLORS.success : trendData.trend === 'down' ? COLORS.error : COLORS.info, fontSize: 12, fontWeight: '600' }}>
                    {trendData.changePercent > 0 ? '+' : ''}{trendData.changePercent}%
                  </Text>
                </View>
              )}
            </View>

            {trendData && trendData.data.length > 1 ? (
              <LineChart
                data={trendData.data}
                color={metricConfig.color}
                height={180}
                yAxisSuffix={metricConfig.suffix}
              />
            ) : (
              <View style={styles.noData}>
                <Ionicons name="analytics-outline" size={32} color={COLORS.textTertiary} />
                <Text style={styles.noDataText}>Not enough data for this period</Text>
              </View>
            )}
          </GlassCard>

          {trendData && trendData.data.length > 0 && (
            <GlassCard style={styles.statsCard}>
              <View style={styles.statsRow}>
                <View style={styles.statItem}>
                  <Text style={styles.statLabel}>Average</Text>
                  <Text style={[styles.statValue, { color: metricConfig.color }]}>{trendData.average}{metricConfig.suffix}</Text>
                </View>
                <View style={styles.statDivider} />
                <View style={styles.statItem}>
                  <Text style={styles.statLabel}>Min</Text>
                  <Text style={styles.statValue}>{trendData.min}{metricConfig.suffix}</Text>
                </View>
                <View style={styles.statDivider} />
                <View style={styles.statItem}>
                  <Text style={styles.statLabel}>Max</Text>
                  <Text style={styles.statValue}>{trendData.max}{metricConfig.suffix}</Text>
                </View>
                <View style={styles.statDivider} />
                <View style={styles.statItem}>
                  <Text style={styles.statLabel}>Change</Text>
                  <Text style={[styles.statValue, { color: trendData.change >= 0 ? COLORS.success : COLORS.error }]}>
                    {trendData.change >= 0 ? '+' : ''}{trendData.change}{metricConfig.suffix}
                  </Text>
                </View>
              </View>
            </GlassCard>
          )}

          {summary && (
            <GlassCard style={styles.summaryCard}>
              <Text style={styles.summaryTitle}>Period Summary</Text>
              <View style={styles.summaryGrid}>
                <View style={styles.summaryItem}>
                  <Text style={styles.summaryLabel}>Avg Calories</Text>
                  <Text style={styles.summaryValue}>{summary.nutrition.avgCalories}</Text>
                </View>
                <View style={styles.summaryItem}>
                  <Text style={styles.summaryLabel}>Avg Protein</Text>
                  <Text style={styles.summaryValue}>{summary.nutrition.avgProtein}g</Text>
                </View>
                <View style={styles.summaryItem}>
                  <Text style={styles.summaryLabel}>Workouts</Text>
                  <Text style={styles.summaryValue}>{summary.training.totalWorkouts}</Text>
                </View>
                <View style={styles.summaryItem}>
                  <Text style={styles.summaryLabel}>Avg Steps</Text>
                  <Text style={styles.summaryValue}>{summary.activity.avgSteps.toLocaleString()}</Text>
                </View>
              </View>
            </GlassCard>
          )}
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { gap: 12 },
  metricPills: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  metricPill: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: 12, paddingVertical: 6, borderRadius: 16, backgroundColor: COLORS.cardBackground, borderWidth: 1, borderColor: COLORS.border },
  metricPillText: { fontSize: 12, fontWeight: '500', color: COLORS.textSecondary },
  daysPills: { flexDirection: 'row', gap: 8 },
  dayPill: { paddingHorizontal: 16, paddingVertical: 6, borderRadius: 12, backgroundColor: COLORS.cardBackground, borderWidth: 1, borderColor: COLORS.border },
  dayPillActive: { backgroundColor: COLORS.primary, borderColor: COLORS.primary },
  dayPillText: { fontSize: 12, fontWeight: '600', color: COLORS.textSecondary },
  dayPillTextActive: { color: '#fff' },
  skeletons: { marginTop: 4 },
  chartCard: { marginTop: 4 },
  chartHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  chartTitle: { fontSize: 16, fontWeight: '600', color: COLORS.text },
  trendBadge: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8 },
  noData: { alignItems: 'center', paddingVertical: 40 },
  noDataText: { fontSize: 13, color: COLORS.textTertiary, marginTop: 8 },
  statsCard: { marginTop: 0 },
  statsRow: { flexDirection: 'row', alignItems: 'center' },
  statItem: { flex: 1, alignItems: 'center' },
  statDivider: { width: 1, height: 30, backgroundColor: COLORS.border },
  statLabel: { fontSize: 10, color: COLORS.textTertiary, marginBottom: 4 },
  statValue: { fontSize: 14, fontWeight: '600', color: COLORS.text },
  summaryCard: { marginTop: 0 },
  summaryTitle: { fontSize: 15, fontWeight: '600', color: COLORS.text, marginBottom: 12 },
  summaryGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  summaryItem: { width: '46%', backgroundColor: COLORS.cardBackgroundLight, padding: 12, borderRadius: 10 },
  summaryLabel: { fontSize: 11, color: COLORS.textTertiary, marginBottom: 4 },
  summaryValue: { fontSize: 18, fontWeight: '700', color: COLORS.text },
});
