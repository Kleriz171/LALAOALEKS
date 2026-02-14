import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
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

function SectionHeader({ title, subtitle, icon, color }: {
  title: string; subtitle?: string; icon: keyof typeof Ionicons.glyphMap; color: string;
}) {
  return (
    <View style={styles.sectionHeader}>
      <View style={[styles.sectionIconWrap, { backgroundColor: `${color}15` }]}>
        <Ionicons name={icon} size={16} color={color} />
      </View>
      <View style={styles.sectionHeaderText}>
        <Text style={styles.sectionTitle}>{title}</Text>
        {subtitle && <Text style={styles.sectionSubtitle}>{subtitle}</Text>}
      </View>
    </View>
  );
}

function MetricCard({ icon, label, value, color, subtext }: {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  value: string;
  color: string;
  subtext?: string;
}) {
  return (
    <GlassCard style={styles.metricCard} gradientColors={[`${color}12`, `${color}04`] as readonly [string, string]}>
      <View style={[styles.metricIconBg, { backgroundColor: `${color}15` }]}>
        <Ionicons name={icon} size={16} color={color} />
      </View>
      <Text style={[styles.metricValue, { color }]}>{value}</Text>
      <Text style={styles.metricLabel}>{label}</Text>
      {subtext && <Text style={styles.metricSubtext}>{subtext}</Text>}
    </GlassCard>
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
        <Text style={styles.loadingText}>Loading analytics...</Text>
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
            {days === d && (
              <LinearGradient
                colors={['rgba(231, 76, 60, 0.9)', 'rgba(192, 57, 43, 0.9)']}
                style={StyleSheet.absoluteFill}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
              />
            )}
            <Text style={[styles.dayChipText, days === d && styles.dayChipTextActive]}>{d} days</Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.metricsRow}>
        <MetricCard icon="cash-outline" label="Revenue" value={`$${analytics.totalRevenue.toLocaleString()}`} color="#f39c12" />
        <MetricCard icon="barbell-outline" label="Sessions" value={totalWorkouts.toLocaleString()} color="#e74c3c" />
        <MetricCard icon="nutrition-outline" label="Logs" value={totalNutrition.toLocaleString()} color="#2ecc71" />
        <MetricCard icon="rocket-outline" label="Adoption" value={`${avgAdoption}%`} color="#3498db" />
      </View>

      {analytics.userGrowth.length > 0 && (
        <View style={styles.chartBlock}>
          <SectionHeader title="User Growth" subtitle={`${days}-day registration trend`} icon="trending-up-outline" color="#3498db" />
          <GlassCard style={styles.chartCard} borderGlow glowColor="rgba(52,152,219,0.08)">
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
          <SectionHeader title="Daily Active Users" subtitle="Active session tracking" icon="people-outline" color="#2ecc71" />
          <GlassCard style={styles.chartCard} borderGlow glowColor="rgba(46,204,113,0.08)">
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
          <SectionHeader title="Platform Activity" subtitle="Workouts vs Nutrition logs" icon="layers-outline" color="#9b59b6" />
          <GlassCard style={styles.chartCard}>
            <View style={styles.legendRow}>
              <View style={styles.legendItem}>
                <View style={[styles.legendDot, { backgroundColor: '#e74c3c' }]} />
                <Text style={styles.legendText}>Workouts</Text>
              </View>
              <View style={styles.legendItem}>
                <View style={[styles.legendDot, { backgroundColor: '#9b59b6' }]} />
                <Text style={styles.legendText}>Nutrition</Text>
              </View>
            </View>
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
          <SectionHeader title="Revenue" subtitle={`Total: $${analytics.totalRevenue.toLocaleString()}`} icon="wallet-outline" color="#f39c12" />
          <GlassCard style={styles.chartCard} borderGlow glowColor="rgba(243,156,18,0.08)">
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
        <SectionHeader title="Feature Adoption" subtitle="Platform feature usage rates" icon="apps-outline" color="#1abc9c" />
        <GlassCard style={styles.chartCard}>
          <View style={styles.adoptionGrid}>
            {[
              { label: 'Workouts', pct: analytics.featureAdoption.workouts.percentage, users: analytics.featureAdoption.workouts.users, color: '#e74c3c', icon: 'barbell' as const },
              { label: 'Nutrition', pct: analytics.featureAdoption.nutrition.percentage, users: analytics.featureAdoption.nutrition.users, color: '#2ecc71', icon: 'nutrition' as const },
              { label: 'Activity', pct: analytics.featureAdoption.activity.percentage, users: analytics.featureAdoption.activity.users, color: '#3498db', icon: 'footsteps' as const },
              { label: 'Coaching', pct: analytics.featureAdoption.coaching.percentage, users: analytics.featureAdoption.coaching.users, color: '#9b59b6', icon: 'people' as const },
            ].map(f => (
              <View key={f.label} style={styles.adoptionItem}>
                <View style={styles.adoptionTop}>
                  <View style={[styles.adoptionIcon, { backgroundColor: `${f.color}15` }]}>
                    <Ionicons name={f.icon} size={14} color={f.color} />
                  </View>
                  <Text style={[styles.adoptionPct, { color: f.color }]}>{f.pct}%</Text>
                </View>
                <View style={styles.adoptionBarTrack}>
                  <View style={[styles.adoptionBarFill, { width: `${Math.min(f.pct, 100)}%`, backgroundColor: f.color }]} />
                </View>
                <Text style={styles.adoptionLabel}>{f.label}</Text>
                <Text style={styles.adoptionUsers}>{f.users} users</Text>
              </View>
            ))}
          </View>
          <View style={styles.radarWrap}>
            <RadarChart
              data={[
                { label: 'Workouts', value: analytics.featureAdoption.workouts.percentage, maxValue: 100 },
                { label: 'Nutrition', value: analytics.featureAdoption.nutrition.percentage, maxValue: 100 },
                { label: 'Activity', value: analytics.featureAdoption.activity.percentage, maxValue: 100 },
                { label: 'Coaching', value: analytics.featureAdoption.coaching.percentage, maxValue: 100 },
              ]}
              color="#1abc9c"
              size={200}
            />
          </View>
        </GlassCard>
      </View>

      {demographics && (
        <>
          <View style={styles.demographicsHeader}>
            <View style={styles.demographicsHeaderLine} />
            <Text style={styles.demographicsHeaderText}>User Demographics</Text>
            <View style={styles.demographicsHeaderLine} />
          </View>

          {demographics.genderSplit.length > 0 && (
            <View style={styles.chartBlock}>
              <SectionHeader title="Gender Split" icon="male-female-outline" color="#3498db" />
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
              <SectionHeader title="Activity Levels" icon="speedometer-outline" color="#2ecc71" />
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
              <SectionHeader title="Top Health Conditions" subtitle="Most reported conditions" icon="medical-outline" color="#e74c3c" />
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
              <SectionHeader title="Goal Distribution" subtitle="What users are training for" icon="flag-outline" color="#3498db" />
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
              <SectionHeader title="Experience Levels" icon="school-outline" color="#e67e22" />
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
              <SectionHeader title="Age Ranges" subtitle="User age distribution" icon="calendar-outline" color="#9b59b6" />
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
    gap: 12,
  },
  loadingText: {
    fontSize: 13,
    color: COLORS.textTertiary,
  },
  emptyText: {
    textAlign: 'center',
    color: COLORS.textSecondary,
    fontSize: 15,
    paddingVertical: 40,
  },
  dayToggle: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 16,
  },
  dayChip: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 12,
    backgroundColor: COLORS.cardBackground,
    borderWidth: 1,
    borderColor: COLORS.border,
    alignItems: 'center',
    overflow: 'hidden',
  },
  dayChipActive: {
    borderColor: COLORS.primary,
  },
  dayChipText: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.textSecondary,
  },
  dayChipTextActive: {
    color: '#fff',
    fontWeight: '700',
  },
  metricsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 20,
  },
  metricCard: {
    width: '48%',
    paddingVertical: 14,
    paddingHorizontal: 14,
    alignItems: 'flex-start',
  },
  metricIconBg: {
    width: 32,
    height: 32,
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  metricValue: {
    fontSize: 20,
    fontWeight: '800',
    letterSpacing: -0.3,
  },
  metricLabel: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginTop: 2,
    fontWeight: '600',
  },
  metricSubtext: {
    fontSize: 10,
    color: COLORS.textTertiary,
    marginTop: 1,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 10,
  },
  sectionIconWrap: {
    width: 32,
    height: 32,
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sectionHeaderText: {
    flex: 1,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.text,
  },
  sectionSubtitle: {
    fontSize: 11,
    color: COLORS.textTertiary,
    marginTop: 1,
  },
  chartBlock: {
    marginBottom: 20,
  },
  chartCard: {
    padding: 14,
  },
  legendRow: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 10,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  legendDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  legendText: {
    fontSize: 12,
    color: COLORS.textSecondary,
    fontWeight: '600',
  },
  adoptionGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 16,
  },
  adoptionItem: {
    width: '47%',
  },
  adoptionTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  adoptionIcon: {
    width: 28,
    height: 28,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  adoptionPct: {
    fontSize: 18,
    fontWeight: '800',
  },
  adoptionBarTrack: {
    height: 4,
    borderRadius: 2,
    backgroundColor: 'rgba(255,255,255,0.06)',
    overflow: 'hidden',
    marginBottom: 4,
  },
  adoptionBarFill: {
    height: '100%',
    borderRadius: 2,
  },
  adoptionLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.textSecondary,
  },
  adoptionUsers: {
    fontSize: 10,
    color: COLORS.textTertiary,
  },
  radarWrap: {
    alignItems: 'center',
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.06)',
  },
  demographicsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    marginTop: 12,
    marginBottom: 20,
  },
  demographicsHeaderLine: {
    flex: 1,
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.08)',
  },
  demographicsHeaderText: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 1.5,
  },
});
