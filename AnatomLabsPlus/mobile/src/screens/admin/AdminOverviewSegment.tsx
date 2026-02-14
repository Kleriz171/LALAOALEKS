import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated as RNAnimated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { AdminStats, AdminAnalytics } from '../../types';
import { GlassCard, Skeleton, COLORS } from '../../components/animations';
import { LineChart, AreaChart } from '../../components/charts';

interface Props {
  stats: AdminStats | null;
  analytics: AdminAnalytics | null;
  loading: boolean;
}

function PulseDot({ color }: { color: string }) {
  const scale = useRef(new RNAnimated.Value(1)).current;
  const opacity = useRef(new RNAnimated.Value(1)).current;

  useEffect(() => {
    const loop = RNAnimated.loop(
      RNAnimated.parallel([
        RNAnimated.sequence([
          RNAnimated.timing(scale, { toValue: 1.8, duration: 800, useNativeDriver: true }),
          RNAnimated.timing(scale, { toValue: 1, duration: 800, useNativeDriver: true }),
        ]),
        RNAnimated.sequence([
          RNAnimated.timing(opacity, { toValue: 0.3, duration: 800, useNativeDriver: true }),
          RNAnimated.timing(opacity, { toValue: 1, duration: 800, useNativeDriver: true }),
        ]),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, []);

  return (
    <RNAnimated.View style={[styles.pulseDot, { backgroundColor: color, transform: [{ scale }], opacity }]} />
  );
}

function MiniSparkline({ data, color }: { data: { date: string; count: number }[]; color: string }) {
  if (data.length < 2) return null;
  const last7 = data.slice(-7);
  const max = Math.max(...last7.map(d => d.count), 1);
  const width = 80;
  const height = 24;

  return (
    <View style={{ width, height, flexDirection: 'row', alignItems: 'flex-end', gap: 2 }}>
      {last7.map((d, i) => (
        <View
          key={i}
          style={{
            flex: 1,
            height: Math.max(3, (d.count / max) * height),
            backgroundColor: color,
            borderRadius: 2,
            opacity: 0.5 + (i / last7.length) * 0.5,
          }}
        />
      ))}
    </View>
  );
}

function TrendArrow({ value }: { value: number }) {
  const isUp = value >= 0;
  return (
    <View style={[styles.trendBadge, { backgroundColor: isUp ? 'rgba(46, 204, 113, 0.12)' : 'rgba(231, 76, 60, 0.12)' }]}>
      <Ionicons name={isUp ? 'trending-up' : 'trending-down'} size={12} color={isUp ? '#2ecc71' : '#e74c3c'} />
      <Text style={[styles.trendText, { color: isUp ? '#2ecc71' : '#e74c3c' }]}>
        {isUp ? '+' : ''}{value}%
      </Text>
    </View>
  );
}

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

export default function AdminOverviewSegment({ stats, analytics, loading }: Props) {
  if (loading || !stats) {
    return (
      <View>
        <View style={styles.heroRow}>
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} width="31%" height={140} borderRadius={16} />
          ))}
        </View>
        <View style={styles.compactGrid}>
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} width="31%" height={70} borderRadius={12} />
          ))}
        </View>
      </View>
    );
  }

  const growthPct = stats.totalUsers > 0
    ? Math.round((stats.newUsersThisWeek / stats.totalUsers) * 100)
    : 0;

  const heroCards: { label: string; value: number; icon: keyof typeof Ionicons.glyphMap; color: string; gradient: readonly [string, string]; extra: React.ReactNode }[] = [
    {
      label: 'Total Users',
      value: stats.totalUsers,
      icon: 'people',
      color: '#3498db',
      gradient: ['rgba(52, 152, 219, 0.15)', 'rgba(52, 152, 219, 0.03)'] as const,
      extra: analytics?.userGrowth ? <MiniSparkline data={analytics.userGrowth} color="#3498db" /> : null,
    },
    {
      label: 'Active (7d)',
      value: stats.activeUsers,
      icon: 'pulse',
      color: '#2ecc71',
      gradient: ['rgba(46, 204, 113, 0.15)', 'rgba(46, 204, 113, 0.03)'] as const,
      extra: <PulseDot color="#2ecc71" />,
    },
    {
      label: 'Growth',
      value: growthPct,
      icon: 'trending-up',
      color: '#9b59b6',
      gradient: ['rgba(155, 89, 182, 0.15)', 'rgba(155, 89, 182, 0.03)'] as const,
      extra: <TrendArrow value={growthPct} />,
    },
  ];

  const compactKpis: { label: string; value: number; icon: keyof typeof Ionicons.glyphMap; color: string }[] = [
    { label: 'Coaches', value: stats.totalCoaches, icon: 'fitness', color: '#e67e22' },
    { label: 'Banned', value: stats.bannedUsers, icon: 'ban', color: '#e74c3c' },
    { label: 'Pending', value: stats.pendingApplications, icon: 'hourglass', color: '#f39c12' },
    { label: 'Bookings', value: stats.totalBookings, icon: 'calendar', color: '#1abc9c' },
    { label: 'Workouts', value: stats.totalWorkoutSessions, icon: 'barbell', color: '#e74c3c' },
    { label: 'Foods', value: stats.totalFoods, icon: 'nutrition', color: '#27ae60' },
  ];

  return (
    <View>
      <View style={styles.heroRow}>
        {heroCards.map((card, i) => (
          <GlassCard
            key={card.label}
            delay={100 + i * 80}
            style={styles.heroCard}
            borderGlow
            glowColor={card.color}
            gradientColors={card.gradient}
          >
            <View style={[styles.heroIconWrap, { backgroundColor: `${card.color}18` }]}>
              <Ionicons name={card.icon} size={20} color={card.color} />
            </View>
            <Text style={[styles.heroValue, { color: card.color }]}>
              {card.label === 'Growth' ? `${card.value}%` : card.value.toLocaleString()}
            </Text>
            <Text style={styles.heroLabel}>{card.label}</Text>
            {card.extra && <View style={styles.heroExtra}>{card.extra}</View>}
          </GlassCard>
        ))}
      </View>

      <View style={styles.compactGrid}>
        {compactKpis.map((kpi, i) => (
          <GlassCard key={kpi.label} delay={300 + i * 40} style={styles.compactCard}>
            <View style={styles.compactInner}>
              <View style={[styles.compactIconBg, { backgroundColor: `${kpi.color}15` }]}>
                <Ionicons name={kpi.icon} size={14} color={kpi.color} />
              </View>
              <Text style={[styles.compactValue, { color: kpi.color }]}>{kpi.value.toLocaleString()}</Text>
              <Text style={styles.compactLabel}>{kpi.label}</Text>
            </View>
          </GlassCard>
        ))}
      </View>

      {analytics && analytics.userGrowth.length > 0 && (
        <View style={styles.chartSection}>
          <SectionHeader
            title="User Growth"
            subtitle="Last 30 days trend"
            icon="trending-up-outline"
            color="#3498db"
          />
          <GlassCard style={styles.chartCard} borderGlow glowColor="rgba(52,152,219,0.1)">
            <LineChart
              data={analytics.userGrowth.map(d => ({ date: d.date, value: d.count }))}
              color="#3498db"
              height={170}
              gradientFill
              showDots
            />
          </GlassCard>
        </View>
      )}

      {analytics && analytics.dailyActiveUsers.length > 0 && (
        <View style={styles.chartSection}>
          <SectionHeader
            title="Daily Active Users"
            subtitle="User engagement over time"
            icon="people-outline"
            color="#2ecc71"
          />
          <GlassCard style={styles.chartCard} borderGlow glowColor="rgba(46,204,113,0.1)">
            <AreaChart
              series={[{
                data: analytics.dailyActiveUsers.map(d => ({ date: d.date, value: d.count })),
                color: '#2ecc71',
                label: 'DAU',
              }]}
              height={170}
            />
          </GlassCard>
        </View>
      )}

      {(stats.pendingApplications > 0 || stats.bannedUsers > 0) && (
        <View style={styles.alertsSection}>
          <SectionHeader
            title="Alerts"
            subtitle="Items requiring attention"
            icon="alert-circle-outline"
            color="#f39c12"
          />
          {stats.pendingApplications > 0 && (
            <GlassCard style={styles.alertCard} borderGlow glowColor="rgba(243,156,18,0.15)">
              <LinearGradient
                colors={['rgba(243, 156, 18, 0.08)', 'rgba(243, 156, 18, 0.02)']}
                style={StyleSheet.absoluteFill}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              />
              <View style={styles.alertRow}>
                <View style={[styles.alertIconWrap, { backgroundColor: 'rgba(243,156,18,0.15)' }]}>
                  <Ionicons name="document-text" size={18} color="#f39c12" />
                </View>
                <View style={styles.alertContent}>
                  <Text style={styles.alertTitle}>
                    {stats.pendingApplications} pending application{stats.pendingApplications > 1 ? 's' : ''}
                  </Text>
                  <Text style={styles.alertHint}>Review in Applications tab</Text>
                </View>
                <View style={styles.alertArrow}>
                  <Ionicons name="chevron-forward" size={16} color={COLORS.textTertiary} />
                </View>
              </View>
            </GlassCard>
          )}
          {stats.bannedUsers > 0 && (
            <GlassCard style={styles.alertCard} borderGlow glowColor="rgba(231,76,60,0.15)">
              <LinearGradient
                colors={['rgba(231, 76, 60, 0.08)', 'rgba(231, 76, 60, 0.02)']}
                style={StyleSheet.absoluteFill}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              />
              <View style={styles.alertRow}>
                <View style={[styles.alertIconWrap, { backgroundColor: 'rgba(231,76,60,0.15)' }]}>
                  <Ionicons name="ban" size={18} color="#e74c3c" />
                </View>
                <View style={styles.alertContent}>
                  <Text style={styles.alertTitle}>
                    {stats.bannedUsers} banned user{stats.bannedUsers > 1 ? 's' : ''}
                  </Text>
                  <Text style={styles.alertHint}>Manage in Users tab</Text>
                </View>
                <View style={styles.alertArrow}>
                  <Ionicons name="chevron-forward" size={16} color={COLORS.textTertiary} />
                </View>
              </View>
            </GlassCard>
          )}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  heroRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 12,
  },
  heroCard: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 8,
    minHeight: 140,
  },
  heroIconWrap: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  heroValue: {
    fontSize: 28,
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  heroLabel: {
    fontSize: 11,
    color: COLORS.textSecondary,
    marginTop: 3,
    fontWeight: '600',
    letterSpacing: 0.3,
  },
  heroExtra: {
    marginTop: 8,
    alignItems: 'center',
  },
  pulseDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  trendBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  trendText: {
    fontSize: 11,
    fontWeight: '700',
  },
  compactGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 8,
  },
  compactCard: {
    width: '31%',
    paddingVertical: 12,
    paddingHorizontal: 8,
  },
  compactInner: {
    alignItems: 'center',
    gap: 4,
  },
  compactIconBg: {
    width: 30,
    height: 30,
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
  },
  compactValue: {
    fontSize: 17,
    fontWeight: '800',
    letterSpacing: -0.3,
  },
  compactLabel: {
    fontSize: 10,
    color: COLORS.textTertiary,
    fontWeight: '600',
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 12,
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
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.text,
  },
  sectionSubtitle: {
    fontSize: 11,
    color: COLORS.textTertiary,
    marginTop: 1,
  },
  chartSection: {
    marginTop: 20,
  },
  chartCard: {
    padding: 12,
  },
  alertsSection: {
    marginTop: 20,
  },
  alertCard: {
    marginBottom: 8,
    padding: 0,
    overflow: 'hidden',
  },
  alertRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 14,
  },
  alertIconWrap: {
    width: 38,
    height: 38,
    borderRadius: 11,
    alignItems: 'center',
    justifyContent: 'center',
  },
  alertContent: {
    flex: 1,
  },
  alertTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.text,
  },
  alertHint: {
    fontSize: 11,
    color: COLORS.textTertiary,
    marginTop: 2,
  },
  alertArrow: {
    width: 28,
    height: 28,
    borderRadius: 8,
    backgroundColor: 'rgba(255,255,255,0.04)',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
