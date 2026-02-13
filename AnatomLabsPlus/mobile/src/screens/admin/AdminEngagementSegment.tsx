import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AdminEngagement } from '../../types';
import { GlassCard, COLORS } from '../../components/animations';
import { BarChart, HeatmapGrid } from '../../components/charts';
import api from '../../services/api';

function HealthScore({ score }: { score: number }) {
  const color = score >= 70 ? '#2ecc71' : score >= 40 ? '#f39c12' : '#e74c3c';
  const label = score >= 70 ? 'Healthy' : score >= 40 ? 'Moderate' : 'Needs Attention';

  return (
    <GlassCard style={styles.healthScoreCard} borderGlow glowColor={color}>
      <View style={styles.healthScoreHeader}>
        <Ionicons name="heart-circle" size={28} color={color} />
        <Text style={styles.healthScoreTitle}>Platform Health</Text>
      </View>
      <View style={styles.healthScoreRow}>
        <Text style={[styles.healthScoreValue, { color }]}>{score}</Text>
        <View>
          <Text style={[styles.healthScoreLabel, { color }]}>{label}</Text>
          <Text style={styles.healthScoreDesc}>Avg retention across 7/30/90d</Text>
        </View>
      </View>
      <View style={styles.healthScoreBar}>
        <View style={[styles.healthScoreBarFill, { width: `${Math.min(score, 100)}%`, backgroundColor: color }]} />
      </View>
    </GlassCard>
  );
}

function ComparisonBar({ label, value, maxValue, color, icon }: {
  label: string; value: number; maxValue: number; color: string; icon: keyof typeof Ionicons.glyphMap;
}) {
  const pct = maxValue > 0 ? (value / maxValue) * 100 : 0;

  return (
    <View style={styles.compBarRow}>
      <View style={styles.compBarLabel}>
        <Ionicons name={icon} size={16} color={color} />
        <Text style={styles.compBarText}>{label}</Text>
      </View>
      <View style={styles.compBarTrack}>
        <View style={[styles.compBarFill, { width: `${Math.min(pct, 100)}%`, backgroundColor: color }]} />
      </View>
      <Text style={[styles.compBarValue, { color }]}>{value}</Text>
    </View>
  );
}

export default function AdminEngagementSegment() {
  const [data, setData] = useState<AdminEngagement | null>(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const result = await api.getAdminEngagement(30);
      setData(result);
    } catch (e) {
      console.error('Failed to load engagement:', e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator color={COLORS.primary} size="large" />
      </View>
    );
  }

  if (!data) return <Text style={styles.emptyText}>Failed to load engagement data</Text>;

  const healthScore = Math.round(
    (data.retention.days7.percentage + data.retention.days30.percentage + data.retention.days90.percentage) / 3
  );

  const retentionCards = [
    { label: '7-Day', ...data.retention.days7, color: '#2ecc71' },
    { label: '30-Day', ...data.retention.days30, color: '#3498db' },
    { label: '90-Day', ...data.retention.days90, color: '#9b59b6' },
  ];

  const compMax = Math.max(data.avgWorkoutsPerUserPerWeek, data.avgNutritionLogsPerUserPerDay, 1);

  return (
    <View>
      <HealthScore score={healthScore} />

      <Text style={styles.sectionTitle}>Retention</Text>
      <View style={styles.retentionRow}>
        {retentionCards.map(r => (
          <GlassCard key={r.label} style={styles.retentionCard} borderGlow glowColor={r.color}>
            <Text style={[styles.retentionPct, { color: r.color }]}>{r.percentage}%</Text>
            <Text style={styles.retentionLabel}>{r.label}</Text>
            <Text style={styles.retentionDetail}>{r.active}/{r.total}</Text>
          </GlassCard>
        ))}
      </View>

      <Text style={styles.sectionTitle}>Engagement Comparison</Text>
      <GlassCard style={styles.comparisonCard}>
        <ComparisonBar
          label="Workouts/user/wk"
          value={data.avgWorkoutsPerUserPerWeek}
          maxValue={compMax}
          color="#e74c3c"
          icon="barbell"
        />
        <ComparisonBar
          label="Logs/user/day"
          value={data.avgNutritionLogsPerUserPerDay}
          maxValue={compMax}
          color="#2ecc71"
          icon="nutrition"
        />
      </GlassCard>

      <Text style={styles.sectionTitle}>Engagement Stats</Text>
      <View style={styles.engagementRow}>
        <GlassCard style={styles.engagementCard}>
          <Ionicons name="barbell" size={22} color="#e74c3c" />
          <Text style={styles.engagementValue}>{data.avgWorkoutsPerUserPerWeek}</Text>
          <Text style={styles.engagementLabel}>Workouts/user/week</Text>
        </GlassCard>
        <GlassCard style={styles.engagementCard}>
          <Ionicons name="nutrition" size={22} color="#2ecc71" />
          <Text style={styles.engagementValue}>{data.avgNutritionLogsPerUserPerDay}</Text>
          <Text style={styles.engagementLabel}>Logs/user/day</Text>
        </GlassCard>
      </View>

      {data.platformHeatmap.length > 0 && (
        <View style={styles.chartBlock}>
          <Text style={styles.sectionTitle}>Training Heatmap</Text>
          <GlassCard style={styles.chartCard}>
            <HeatmapGrid
              data={data.platformHeatmap}
              weeks={12}
              color="#2ecc71"
            />
          </GlassCard>
        </View>
      )}

      {data.topExercises.length > 0 && (
        <View style={styles.chartBlock}>
          <Text style={styles.sectionTitle}>Top 10 Exercises</Text>
          <GlassCard style={styles.chartCard}>
            <BarChart
              data={data.topExercises}
              horizontal
              height={260}
              color="#e74c3c"
              showValues
            />
          </GlassCard>
        </View>
      )}

      {data.topFoods.length > 0 && (
        <View style={styles.chartBlock}>
          <Text style={styles.sectionTitle}>Top 10 Foods</Text>
          <GlassCard style={styles.chartCard}>
            <BarChart
              data={data.topFoods}
              horizontal
              height={260}
              color="#2ecc71"
              showValues
            />
          </GlassCard>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    paddingVertical: 60,
    alignItems: 'center',
  },
  emptyText: {
    textAlign: 'center',
    color: COLORS.textSecondary,
    fontSize: 15,
    paddingVertical: 40,
  },
  healthScoreCard: {
    padding: 16,
    marginBottom: 20,
  },
  healthScoreHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  healthScoreTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.text,
  },
  healthScoreRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    marginBottom: 12,
  },
  healthScoreValue: {
    fontSize: 44,
    fontWeight: '800',
  },
  healthScoreLabel: {
    fontSize: 16,
    fontWeight: '700',
  },
  healthScoreDesc: {
    fontSize: 11,
    color: COLORS.textTertiary,
    marginTop: 2,
  },
  healthScoreBar: {
    height: 6,
    borderRadius: 3,
    backgroundColor: 'rgba(255,255,255,0.1)',
    overflow: 'hidden',
  },
  healthScoreBarFill: {
    height: '100%',
    borderRadius: 3,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: 12,
    marginTop: 8,
  },
  retentionRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 20,
  },
  retentionCard: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 16,
  },
  retentionPct: {
    fontSize: 28,
    fontWeight: 'bold',
  },
  retentionLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.textSecondary,
    marginTop: 4,
  },
  retentionDetail: {
    fontSize: 11,
    color: COLORS.textTertiary,
    marginTop: 2,
  },
  comparisonCard: {
    padding: 16,
    marginBottom: 20,
    gap: 14,
  },
  compBarRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  compBarLabel: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    width: 140,
  },
  compBarText: {
    fontSize: 12,
    color: COLORS.textSecondary,
    fontWeight: '600',
  },
  compBarTrack: {
    flex: 1,
    height: 10,
    borderRadius: 5,
    backgroundColor: 'rgba(255,255,255,0.08)',
    overflow: 'hidden',
  },
  compBarFill: {
    height: '100%',
    borderRadius: 5,
  },
  compBarValue: {
    fontSize: 14,
    fontWeight: '700',
    width: 36,
    textAlign: 'right',
  },
  engagementRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 20,
  },
  engagementCard: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 16,
  },
  engagementValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.text,
    marginTop: 6,
  },
  engagementLabel: {
    fontSize: 11,
    color: COLORS.textSecondary,
    marginTop: 4,
    textAlign: 'center',
  },
  chartBlock: {
    marginBottom: 20,
  },
  chartCard: {
    padding: 12,
  },
});
