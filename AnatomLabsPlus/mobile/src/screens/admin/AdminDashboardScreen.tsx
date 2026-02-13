import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Animated, {
  useSharedValue,
  useAnimatedScrollHandler,
} from 'react-native-reanimated';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import { AdminStats, AdminAnalytics, AdminSegment } from '../../types';
import {
  BlurHeader,
  AnimatedButton,
  COLORS,
} from '../../components/animations';
import AdminOverviewSegment from './AdminOverviewSegment';
import AdminAnalyticsSegment from './AdminAnalyticsSegment';
import AdminUsersSegment from './AdminUsersSegment';
import AdminApplicationsSegment from './AdminApplicationsSegment';
import AdminEngagementSegment from './AdminEngagementSegment';

const SEGMENTS: { key: AdminSegment; label: string; icon: keyof typeof Ionicons.glyphMap }[] = [
  { key: 'overview', label: 'Overview', icon: 'grid-outline' },
  { key: 'analytics', label: 'Analytics', icon: 'analytics-outline' },
  { key: 'users', label: 'Users', icon: 'people-outline' },
  { key: 'applications', label: 'Apps', icon: 'document-text-outline' },
  { key: 'engagement', label: 'Engage', icon: 'trending-up-outline' },
];

export default function AdminDashboardScreen() {
  const { logout } = useAuth();
  const [segment, setSegment] = useState<AdminSegment>('overview');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const [stats, setStats] = useState<AdminStats | null>(null);
  const [analytics, setAnalytics] = useState<AdminAnalytics | null>(null);

  const loadedSegments = useRef(new Set<AdminSegment>(['overview']));

  const scrollY = useSharedValue(0);
  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => { scrollY.value = event.contentOffset.y; },
  });

  const loadStats = useCallback(async () => {
    try {
      const data = await api.getAdminStats();
      setStats(data);
    } catch (error) {
      console.error('Failed to load stats:', error);
    }
  }, []);

  const loadOverviewAnalytics = useCallback(async () => {
    try {
      const data = await api.getAdminAnalytics(30);
      setAnalytics(data);
    } catch (error) {
      console.error('Failed to load overview analytics:', error);
    }
  }, []);

  useEffect(() => {
    const init = async () => {
      setLoading(true);
      await Promise.all([loadStats(), loadOverviewAnalytics()]);
      setLoading(false);
    };
    init();
  }, []);

  useEffect(() => {
    loadedSegments.current.add(segment);
  }, [segment]);

  const onRefresh = async () => {
    setRefreshing(true);
    await Promise.all([loadStats(), loadOverviewAnalytics()]);
    setRefreshing(false);
  };

  const segmentTabsRef = useRef<ScrollView>(null);

  return (
    <View style={styles.container}>
      <BlurHeader
        title="Admin Dashboard"
        scrollY={scrollY}
        rightElement={
          <AnimatedButton
            variant="ghost"
            size="small"
            onPress={logout}
            title="Logout"
            textStyle={{ color: COLORS.primary }}
          />
        }
      />

      <Animated.ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        onScroll={scrollHandler}
        scrollEventThrottle={16}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={COLORS.primary}
          />
        }
      >
        <ScrollView
          ref={segmentTabsRef}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.segmentRow}
        >
          {SEGMENTS.map(s => (
            <TouchableOpacity
              key={s.key}
              style={[styles.segmentBtn, segment === s.key && styles.segmentBtnActive]}
              onPress={() => setSegment(s.key)}
            >
              <Ionicons
                name={s.icon}
                size={16}
                color={segment === s.key ? '#fff' : COLORS.textSecondary}
              />
              <Text style={[styles.segmentText, segment === s.key && styles.segmentTextActive]}>
                {s.label}
              </Text>
              {segment === s.key && <View style={styles.activeIndicator} />}
            </TouchableOpacity>
          ))}
        </ScrollView>

        <View style={styles.content}>
          {segment === 'overview' && (
            <AdminOverviewSegment stats={stats} analytics={analytics} loading={loading} />
          )}
          {segment === 'analytics' && <AdminAnalyticsSegment />}
          {segment === 'users' && <AdminUsersSegment />}
          {segment === 'applications' && <AdminApplicationsSegment onStatsChange={loadStats} />}
          {segment === 'engagement' && <AdminEngagementSegment />}
        </View>
      </Animated.ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingTop: 120,
    paddingBottom: 40,
  },
  segmentRow: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    gap: 8,
  },
  segmentBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
    backgroundColor: COLORS.cardBackground,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  segmentBtnActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  segmentText: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.textSecondary,
  },
  segmentTextActive: {
    color: '#fff',
  },
  activeIndicator: {
    position: 'absolute',
    bottom: -2,
    left: '20%',
    right: '20%',
    height: 3,
    borderRadius: 1.5,
    backgroundColor: '#fff',
  },
  content: {
    padding: 16,
  },
});
