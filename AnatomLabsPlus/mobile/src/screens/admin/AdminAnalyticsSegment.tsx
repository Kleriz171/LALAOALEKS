import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AdminAnalytics, AdminDemographics } from '../../types';
import { GlassCard, COLORS } from '../../components/animations';
import { LineChart, AreaChart, BarChart, RadarChart } from '../../components/charts';
import api from '../../services/api';

const DAY_OPTIONS = [30, 90] as const;

const GENDER_COLORS: Record<string, string> = {
  male: '#3498db',
  female: '#e74c3c',
  'Not set': '#95a5a6',
};

const ACTIVITY_COLORS: Record<string, string> = {
  sedentary: '#e74c3c',
  light: '#f39c12',
  moderate: '#f1c40f',
  active: '#2ecc71',
  very_active: '#1abc9c',
  'Not set': '#95a5a6',
};

const CONDITION_COLORS = [
  '#e74c3c', '#3498db', '#2ecc71', '#f39c12', '#9b59b6',
  '#1abc9c', '#e67e22', '#34495e', '#16a085', '#c0392b',
];

function SummaryPill({ icon, label, value, color }: {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  value: string;
  color: string;
}) {
  return (
    <View style={[styles.pill, { borderColor: `${color}30` }]}>
      <View style={[styles.pillIcon, { backgroundColor: `${color}20` }]}>
        <Ionicons name={icon} size={14} color={color} />
      </View>
      <View>
        <Text style={[styles.pillValue, { color }]}>{value}</Text>
        <Text style={styles.pillLabel}>{label}</Text>
      </View>
    </View>
  );
}

export default function AdminAnalyticsSegment() {
  const [days, setDays] = useState<number>(30);
  const [analytics, setAnalytics] = useState<AdminAnalytics | null>(null);
  const [demographics, setDemographics] = useState<AdminDemographics | null>(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [a, d] = await Promise.all([
        api.getAdminAnalytics(days),
        api.getAdminDemographics(),
      ]);
      setAnalytics(a);
      setDemographics(d);
    } catch (e) {
      console.error('Failed to load analytics:', e);
    } finally {
      setLoading(false);
    }
  }, [days]);

  useEffect(() => { load(); }, [load]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator color={COLORS.primary} size="large" />
      </View>
    );
  }

  if (!analytics) return <Text style={styles.emptyText}>Failed to load analytics</Text>;

  const totalWorkouts = analytics.workoutSessionsPerDay.reduce((s, d) => s + d.count, 0);
  const totalNutrition = analytics.nutritionLogsPerDay.reduce((s, d) => s + d.count, 0);
  const avgAdoption = Math.round(
    (analytics.featureAdoption.workouts.percentage +
     analytics.featureAdoption.nutrition.percentage +
     analytics.featureAdoption.activity.percentage +
     analytics.featureAdoption.coaching.percentage) / 4
  );

  return (
    <View>
      <View style={styles.dayToggle}>
        {DAY_OPTIONS.map(d => (
          <TouchableOpacity
            key={d}
            style={[styles.dayChip, days === d && styles.dayChipActive]}
            onPress={() => setDays(d)}
          >
            <Text style={[styles.dayChipText, days === d && styles.dayChipTextActive]}>{d}d</Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.pillRow}>
        <SummaryPill icon="cash-outline" label="Revenue" value={`$${analytics.totalRevenue.toLocaleString()}`} color="#f39c12" />
        <SummaryPill icon="barbell-outline" label="Sessions" value={totalWorkouts.toLocaleString()} color="#e74c3c" />
        <SummaryPill icon="nutrition-outline" label="Logs" value={totalNutrition.toLocaleString()} color="#2ecc71" />
        <SummaryPill icon="rocket-outline" label="Adoption" value={`${avgAdoption}%`} color="#3498db" />
      </View>

      {analytics.userGrowth.length > 0 && (
        <View style={styles.chartBlock}>
          <Text style={styles.chartTitle}>User Growth</Text>
          <GlassCard style={styles.chartCard}>
            <LineChart
              data={analytics.userGrowth.map(d => ({ date: d.date, value: d.count }))}
              color="#3498db"
              height={200}
              gradientFill
              showDots
            />
          </GlassCard>
        </View>
      )}

      {analytics.dailyActiveUsers.length > 0 && (
        <View style={styles.chartBlock}>
          <Text style={styles.chartTitle}>Daily Active Users</Text>
          <GlassCard style={styles.chartCard}>
            <AreaChart
              series={[{
                data: analytics.dailyActiveUsers.map(d => ({ date: d.date, value: d.count })),
                color: '#2ecc71',
                label: 'DAU',
              }]}
              height={200}
            />
          </GlassCard>
        </View>
      )}

      {(analytics.workoutSessionsPerDay.length > 0 || analytics.nutritionLogsPerDay.length > 0) && (
        <View style={styles.chartBlock}>
          <Text style={styles.chartTitle}>Platform Activity</Text>
          <GlassCard style={styles.chartCard}>
            <AreaChart
              series={[
                {
                  data: analytics.workoutSessionsPerDay.map(d => ({ date: d.date, value: d.count })),
                  color: '#e74c3c',
                  label: 'Workouts',
                },
                {
                  data: analytics.nutritionLogsPerDay.map(d => ({ date: d.date, value: d.count })),
                  color: '#9b59b6',
                  label: 'Nutrition',
                },
              ]}
              height={200}
            />
          </GlassCard>
        </View>
      )}

      {analytics.revenue.length > 0 && (
        <View style={styles.chartBlock}>
          <Text style={styles.chartTitle}>Revenue</Text>
          <Text style={styles.chartSubtitle}>Total: ${analytics.totalRevenue.toLocaleString()}</Text>
          <GlassCard style={styles.chartCard}>
            <LineChart
              data={analytics.revenue.map(d => ({ date: d.date, value: d.amount }))}
              color="#f39c12"
              height={200}
              gradientFill
              showDots
              yAxisSuffix="$"
            />
          </GlassCard>
        </View>
      )}

      <View style={styles.chartBlock}>
        <Text style={styles.chartTitle}>Feature Adoption</Text>
        <GlassCard style={styles.chartCard}>
          <RadarChart
            data={[
              { label: 'Workouts', value: analytics.featureAdoption.workouts.percentage, maxValue: 100 },
              { label: 'Nutrition', value: analytics.featureAdoption.nutrition.percentage, maxValue: 100 },
              { label: 'Activity', value: analytics.featureAdoption.activity.percentage, maxValue: 100 },
              { label: 'Coaching', value: analytics.featureAdoption.coaching.percentage, maxValue: 100 },
            ]}
            color="#1abc9c"
            size={220}
          />
        </GlassCard>
      </View>

      {demographics && (
        <>
          <Text style={styles.sectionHeader}>User Demographics</Text>

          {demographics.genderSplit.length > 0 && (
            <View style={styles.chartBlock}>
              <Text style={styles.chartTitle}>Gender Split</Text>
              <GlassCard style={styles.chartCard}>
                <BarChart
                  data={demographics.genderSplit.map(d => ({
                    label: d.label.charAt(0).toUpperCase() + d.label.slice(1),
                    value: d.value,
                    color: GENDER_COLORS[d.label] || '#95a5a6',
                  }))}
                  horizontal
                  height={Math.max(120, demographics.genderSplit.length * 40)}
                  color="#3498db"
                  showValues
                />
              </GlassCard>
            </View>
          )}

          {demographics.activityLevels.length > 0 && (
            <View style={styles.chartBlock}>
              <Text style={styles.chartTitle}>Activity Levels</Text>
              <GlassCard style={styles.chartCard}>
                <BarChart
                  data={demographics.activityLevels.map(d => ({
                    label: d.label.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase()),
                    value: d.value,
                    color: ACTIVITY_COLORS[d.label] || '#95a5a6',
                  }))}
                  horizontal
                  height={Math.max(160, demographics.activityLevels.length * 36)}
                  color="#2ecc71"
                  showValues
                />
              </GlassCard>
            </View>
          )}

          {demographics.healthConditions.length > 0 && (
            <View style={styles.chartBlock}>
              <Text style={styles.chartTitle}>Top Health Conditions</Text>
              <GlassCard style={styles.chartCard}>
                <BarChart
                  data={demographics.healthConditions.map((d, i) => ({
                    label: d.label.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase()),
                    value: d.value,
                    color: CONDITION_COLORS[i % CONDITION_COLORS.length],
                  }))}
                  horizontal
                  height={Math.max(200, demographics.healthConditions.length * 36)}
                  color="#e74c3c"
                  showValues
                />
              </GlassCard>
            </View>
          )}

          {demographics.goalDistribution.length > 0 && (
            <View style={styles.chartBlock}>
              <Text style={styles.chartTitle}>Goal Distribution</Text>
              <GlassCard style={styles.chartCard}>
                <BarChart
                  data={demographics.goalDistribution.map(d => ({ label: d.label.replace(/_/g, ' '), value: d.value }))}
                  horizontal
                  height={Math.max(180, demographics.goalDistribution.length * 36)}
                  color="#3498db"
                  showValues
                />
              </GlassCard>
            </View>
          )}

          {demographics.experienceLevels.length > 0 && (
            <View style={styles.chartBlock}>
              <Text style={styles.chartTitle}>Experience Levels</Text>
              <GlassCard style={styles.chartCard}>
                <BarChart
                  data={demographics.experienceLevels.map(d => ({ label: d.label, value: d.value }))}
                  height={200}
                  color="#e67e22"
                  showValues
                />
              </GlassCard>
            </View>
          )}

          {demographics.ageRanges.length > 0 && (
            <View style={styles.chartBlock}>
              <Text style={styles.chartTitle}>Age Ranges</Text>
              <GlassCard style={styles.chartCard}>
                <BarChart
                  data={demographics.ageRanges.map(d => ({ label: d.label, value: d.value }))}
                  height={200}
                  color="#9b59b6"
                  showValues
                />
              </GlassCard>
            </View>
          )}
        </>
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
  dayToggle: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 16,
  },
  dayChip: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: COLORS.cardBackground,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  dayChipActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  dayChipText: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.textSecondary,
  },
  dayChipTextActive: {
    color: '#fff',
  },
  pillRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 20,
  },
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    backgroundColor: COLORS.cardBackground,
    borderWidth: 1,
  },
  pillIcon: {
    width: 26,
    height: 26,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pillValue: {
    fontSize: 14,
    fontWeight: '700',
  },
  pillLabel: {
    fontSize: 10,
    color: COLORS.textTertiary,
  },
  chartBlock: {
    marginBottom: 20,
  },
  chartTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: 8,
  },
  chartSubtitle: {
    fontSize: 13,
    color: COLORS.textSecondary,
    marginBottom: 8,
  },
  chartCard: {
    padding: 12,
  },
  sectionHeader: {
    fontSize: 18,
    fontWeight: '800',
    color: COLORS.text,
    marginTop: 12,
    marginBottom: 16,
  },
});
