import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Animated, {
  useSharedValue,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  withSpring,
  withTiming,
  interpolateColor,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import { AdminStats, AdminAnalytics, AdminSegment } from '../../types';
import { COLORS, SPRING_CONFIG } from '../../components/animations/config';
import AdminOverviewSegment from './AdminOverviewSegment';
import AdminAnalyticsSegment from './AdminAnalyticsSegment';
import AdminUsersSegment from './AdminUsersSegment';
import AdminApplicationsSegment from './AdminApplicationsSegment';
import AdminEngagementSegment from './AdminEngagementSegment';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const SEGMENTS: { key: AdminSegment; label: string; icon: keyof typeof Ionicons.glyphMap; activeIcon: keyof typeof Ionicons.glyphMap }[] = [
  { key: 'overview', label: 'Overview', icon: 'grid-outline', activeIcon: 'grid' },
  { key: 'analytics', label: 'Analytics', icon: 'analytics-outline', activeIcon: 'analytics' },
  { key: 'users', label: 'Users', icon: 'people-outline', activeIcon: 'people' },
  { key: 'applications', label: 'Apps', icon: 'document-text-outline', activeIcon: 'document-text' },
  { key: 'engagement', label: 'Engage', icon: 'pulse-outline', activeIcon: 'pulse' },
];

function NavTab({ segment, isActive, onPress, pendingCount }: {
  segment: typeof SEGMENTS[number];
  isActive: boolean;
  onPress: () => void;
  pendingCount?: number;
}) {
  const scale = useSharedValue(1);

  const animStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <TouchableOpacity
      onPress={() => {
        scale.value = withSpring(0.9, SPRING_CONFIG.snappy);
        setTimeout(() => { scale.value = withSpring(1, SPRING_CONFIG.bouncy); }, 100);
        onPress();
      }}
      activeOpacity={0.7}
      style={styles.navTab}
    >
      <Animated.View style={[styles.navTabInner, animStyle]}>
        {isActive && (
          <LinearGradient
            colors={['rgba(231, 76, 60, 0.2)', 'rgba(231, 76, 60, 0.05)']}
            style={styles.navTabActiveBg}
          />
        )}
        <View style={styles.navIconWrap}>
          <Ionicons
            name={isActive ? segment.activeIcon : segment.icon}
            size={22}
            color={isActive ? COLORS.primary : COLORS.textTertiary}
          />
          {pendingCount !== undefined && pendingCount > 0 && (
            <View style={styles.navBadge}>
              <Text style={styles.navBadgeText}>{pendingCount > 9 ? '9+' : pendingCount}</Text>
            </View>
          )}
        </View>
        <Text style={[styles.navTabLabel, isActive && styles.navTabLabelActive]}>
          {segment.label}
        </Text>
        {isActive && <View style={styles.navActiveBar} />}
      </Animated.View>
    </TouchableOpacity>
  );
}

export default function AdminDashboardScreen() {
  const { logout, user } = useAuth();
  const [segment, setSegment] = useState<AdminSegment>('overview');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [analytics, setAnalytics] = useState<AdminAnalytics | null>(null);

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

  const onRefresh = async () => {
    setRefreshing(true);
    await Promise.all([loadStats(), loadOverviewAnalytics()]);
    setRefreshing(false);
  };

  const headerAnimStyle = useAnimatedStyle(() => ({
    opacity: withTiming(scrollY.value > 60 ? 1 : 0.97, { duration: 150 }),
  }));

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.header, headerAnimStyle]}>
        <BlurView intensity={60} tint="dark" style={StyleSheet.absoluteFill} />
        <LinearGradient
          colors={['rgba(10, 10, 10, 0.95)', 'rgba(10, 10, 10, 0.8)']}
          style={StyleSheet.absoluteFill}
        />
        <View style={styles.headerContent}>
          <View style={styles.headerLeft}>
            <View style={styles.adminAvatarWrap}>
              <LinearGradient
                colors={['#e74c3c', '#c0392b']}
                style={styles.adminAvatar}
              >
                <Ionicons name="shield-checkmark" size={18} color="#fff" />
              </LinearGradient>
              <View style={styles.adminOnlineDot} />
            </View>
            <View>
              <Text style={styles.headerGreeting}>Command Center</Text>
              <Text style={styles.headerName}>{user?.name || 'Admin'}</Text>
            </View>
          </View>
          <TouchableOpacity style={styles.logoutBtn} onPress={logout}>
            <Ionicons name="log-out-outline" size={20} color={COLORS.textSecondary} />
          </TouchableOpacity>
        </View>
      </Animated.View>

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

      <View style={styles.navBarContainer}>
        <BlurView intensity={80} tint="dark" style={StyleSheet.absoluteFill} />
        <LinearGradient
          colors={['rgba(10, 10, 10, 0.9)', 'rgba(10, 10, 10, 0.98)']}
          style={StyleSheet.absoluteFill}
        />
        <View style={styles.navBarBorder} />
        <View style={styles.navBar}>
          {SEGMENTS.map(s => (
            <NavTab
              key={s.key}
              segment={s}
              isActive={segment === s.key}
              onPress={() => setSegment(s.key)}
              pendingCount={s.key === 'applications' ? stats?.pendingApplications : undefined}
            />
          ))}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
    overflow: 'hidden',
    paddingTop: 54,
    paddingBottom: 12,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  adminAvatarWrap: {
    position: 'relative',
  },
  adminAvatar: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  adminOnlineDot: {
    position: 'absolute',
    bottom: -1,
    right: -1,
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#2ecc71',
    borderWidth: 2,
    borderColor: COLORS.background,
  },
  headerGreeting: {
    fontSize: 11,
    fontWeight: '600',
    color: COLORS.primary,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  headerName: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.text,
    marginTop: 1,
  },
  logoutBtn: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.06)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingTop: 110,
    paddingBottom: 100,
  },
  content: {
    padding: 16,
  },
  navBarContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    overflow: 'hidden',
    paddingBottom: 28,
  },
  navBarBorder: {
    position: 'absolute',
    top: 0,
    left: 20,
    right: 20,
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.06)',
  },
  navBar: {
    flexDirection: 'row',
    paddingHorizontal: 8,
    paddingTop: 8,
  },
  navTab: {
    flex: 1,
    alignItems: 'center',
  },
  navTabInner: {
    alignItems: 'center',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 14,
    overflow: 'hidden',
    minWidth: 60,
  },
  navTabActiveBg: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 14,
  },
  navIconWrap: {
    position: 'relative',
  },
  navBadge: {
    position: 'absolute',
    top: -4,
    right: -10,
    minWidth: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
  },
  navBadgeText: {
    fontSize: 9,
    fontWeight: '800',
    color: '#fff',
  },
  navTabLabel: {
    fontSize: 10,
    fontWeight: '600',
    color: COLORS.textTertiary,
    marginTop: 4,
  },
  navTabLabelActive: {
    color: COLORS.primary,
    fontWeight: '700',
  },
  navActiveBar: {
    width: 20,
    height: 2.5,
    borderRadius: 2,
    backgroundColor: COLORS.primary,
    marginTop: 4,
  },
});
