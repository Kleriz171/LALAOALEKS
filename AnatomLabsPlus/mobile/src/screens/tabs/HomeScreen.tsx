import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  RefreshControl,
  TextInput,
  TouchableOpacity,
  Alert,
  Linking,
  Platform,
  Image,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  withSpring,
  withTiming,
  interpolate,
} from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient as ExpoLinearGradient } from 'expo-linear-gradient';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import healthService from '../../services/healthService';
import appleHealthService, { HealthData } from '../../services/appleHealthService';
import androidHealthService from '../../services/androidHealthService';
import {
  AnimatedCard,
  AnimatedListItem,
  FadeIn,
  SlideIn,
  BlurHeader,
  GlassCard,
  Skeleton,
  useHaptics,
  COLORS,
  SHADOWS,
} from '../../components/animations';
import BMICard from '../../components/health/BMICard';
import { BMIResult, ActivityLog } from '../../types';

function initials(name: string) {
  if (!name) return '??';
  return name.split(' ').map(n => n[0]).join('').toUpperCase();
}

export default function HomeScreen({ navigation }: any) {
  const { user, logout } = useAuth();
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState({
    bmr: 0,
    tdee: 0,
    workoutsThisWeek: 0,
    totalWorkouts: 0,
  });
  const [bmiData, setBmiData] = useState<BMIResult | null>(null);
  const [activityData, setActivityData] = useState<ActivityLog | null>(null);
  const [activityInput, setActivityInput] = useState({
    steps: '',
    waterIntake: '',
    sleepHours: '',
  });
  const [healthMetrics, setHealthMetrics] = useState({
    estimatedCalories: 0,
    estimatedDistanceKm: 0,
  });
  const [appleHealthData, setAppleHealthData] = useState<HealthData | null>(null);
  const [healthKitStatus, setHealthKitStatus] = useState<'loading' | 'available' | 'unavailable' | 'no_permission'>('loading');
  const [isSavingActivity, setIsSavingActivity] = useState(false);
  const [stepTrackingStatus, setStepTrackingStatus] = useState<'loading' | 'available' | 'unavailable' | 'no_permission'>('loading');
  const [isLoadingSteps, setIsLoadingSteps] = useState(false);

  const scrollY = useSharedValue(0);
  const { trigger } = useHaptics();

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollY.value = event.contentOffset.y;
    },
  });

  useEffect(() => {
    loadStats();
    checkStepTracking();
    initializeAppleHealth();
  }, []);

  const platformHealthService = Platform.OS === 'android' ? androidHealthService : appleHealthService;

  const initializeAppleHealth = async () => {
    if (!platformHealthService.isAvailable()) {
      setHealthKitStatus('unavailable');
      return;
    }

    try {
      const status = await platformHealthService.initialize();
      if (status.isAuthorized) {
        setHealthKitStatus('available');
        fetchAppleHealthData();
      } else {
        setHealthKitStatus('no_permission');
      }
    } catch (error) {
      setHealthKitStatus('unavailable');
    }
  };

  const fetchAppleHealthData = async () => {
    try {
      const data = await platformHealthService.getTodayHealthData();
      if (data) {
        setAppleHealthData(data);
        if (data.steps > 0) {
          setActivityInput(prev => ({ ...prev, steps: String(data.steps) }));
        }
      }
    } catch (error) {
      console.error('Error fetching health data:', error);
    }
  };

  // Check if step tracking is available and has permission
  const checkStepTracking = async () => {
    try {
      const isAvailable = await healthService.isStepCountingAvailable();
      if (!isAvailable) {
        setStepTrackingStatus('unavailable');
        return;
      }

      const permission = await healthService.getPermissionStatus();
      if (permission.granted) {
        setStepTrackingStatus('available');
      } else {
        setStepTrackingStatus('no_permission');
      }
    } catch (error) {
      console.error('Error checking step tracking:', error);
      setStepTrackingStatus('unavailable');
    }
  };

  // Fetch steps from device health data
  const fetchStepsFromDevice = useCallback(async () => {
    if (stepTrackingStatus !== 'available') {
      return;
    }

    setIsLoadingSteps(true);
    try {
      const stepData = await healthService.getTodaySteps();
      if (stepData && stepData.steps > 0) {
        setActivityInput(prev => ({
          ...prev,
          steps: String(stepData.steps),
        }));

        // Calculate personalized calories if user data available
        if (user?.weight && user?.height) {
          const metrics = healthService.calculateCaloriesFromSteps(
            stepData.steps,
            user.weight,
            user.height
          );
          setHealthMetrics({
            estimatedCalories: metrics.calories,
            estimatedDistanceKm: metrics.distanceKm,
          });
        } else {
          // Use default estimates from step data
          setHealthMetrics({
            estimatedCalories: stepData.estimatedCalories || 0,
            estimatedDistanceKm: stepData.estimatedDistanceKm || 0,
          });
        }
        trigger('light');
      }
    } catch (error) {
      console.error('Error fetching steps:', error);
    } finally {
      setIsLoadingSteps(false);
    }
  }, [stepTrackingStatus, trigger, user]);

  // Request permission for step tracking
  const requestStepPermission = async () => {
    try {
      const result = await healthService.requestPermission();
      if (result.granted) {
        setStepTrackingStatus('available');
        // Automatically fetch steps after permission granted
        setTimeout(() => fetchStepsFromDevice(), 500);
        Alert.alert('Success', 'Step tracking enabled! Tap "Sync Steps" to fetch your steps.');
      } else {
        Alert.alert(
          'Permission Required',
          healthService.getSetupInstructions(),
          [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Open Settings', onPress: () => Linking.openSettings() },
          ]
        );
      }
    } catch (error) {
      console.error('Error requesting permission:', error);
      Alert.alert('Error', 'Failed to request step tracking permission.');
    }
  };

  const loadStats = async () => {
    setIsLoading(true);
    try {
      const [nutrition, bmi, activity] = await Promise.all([
        api.getNutritionPlan(),
        api.getBMIAnalysis().catch(() => null),
        api.getTodayActivity().catch(() => null),
      ]);

      setStats(prev => ({
        ...prev,
        bmr: nutrition.bmr,
        tdee: nutrition.tdee,
      }));

      if (bmi) {
        setBmiData(bmi);
      }

      if (activity) {
        setActivityData(activity);
        setActivityInput({
          steps: activity.steps > 0 ? String(activity.steps) : '',
          waterIntake: activity.waterIntake > 0 ? String(activity.waterIntake) : '',
          sleepHours: activity.sleepHours ? String(activity.sleepHours) : '',
        });
      }
    } catch (error) {
      console.log('Stats load error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveActivity = async () => {
    setIsSavingActivity(true);
    try {
      const data: { steps?: number; waterIntake?: number; sleepHours?: number } = {};

      if (activityInput.steps) {
        data.steps = parseInt(activityInput.steps, 10);
      }
      if (activityInput.waterIntake) {
        data.waterIntake = parseInt(activityInput.waterIntake, 10);
      }
      if (activityInput.sleepHours) {
        data.sleepHours = parseFloat(activityInput.sleepHours);
      }

      const result = await api.updateTodayActivity(data);
      setActivityData(result.log);
      trigger('success');
      Alert.alert('Success', 'Activity logged successfully!');
    } catch (error) {
      console.error('Error saving activity:', error);
      Alert.alert('Error', 'Failed to save activity. Please try again.');
    } finally {
      setIsSavingActivity(false);
    }
  };

  const onRefresh = async () => {
    setIsRefreshing(true);
    trigger('light');
    await Promise.all([
      loadStats(),
      healthKitStatus === 'available' ? fetchAppleHealthData() : Promise.resolve(),
    ]);
    setIsRefreshing(false);
    trigger('success');
  };

  const handleLogout = async () => {
    trigger('medium');
    await logout();
  };

  const headerStyle = useAnimatedStyle(() => {
    const opacity = interpolate(
      scrollY.value,
      [0, 100],
      [1, 0],
      'clamp'
    );
    const translateY = interpolate(
      scrollY.value,
      [0, 100],
      [0, -20],
      'clamp'
    );
    return {
      opacity,
      transform: [{ translateY }],
    };
  });

  const quickActions = [
    {
      title: 'Coaches',
      subtitle: 'Browse expert trainers',
      icon: 'people-outline' as const,
      screen: 'Coaches',
      color: '#3498db',
    },
    {
      title: 'Nutrition',
      subtitle: 'BMR, TDEE & macro targets',
      icon: 'nutrition-outline' as const,
      screen: 'Nutrition',
      color: '#2ecc71',
    },
    {
      title: 'Workouts',
      subtitle: 'Science-based training plan',
      icon: 'barbell-outline' as const,
      screen: 'Workouts',
      color: '#e74c3c',
    },
    {
      title: 'Reports',
      subtitle: 'Performance & analytics',
      icon: 'analytics-outline' as const,
      screen: 'Reports',
      color: '#9b59b6',
    },
  ];

  return (
    <View style={styles.container}>
      <BlurHeader
        title="Home"
        scrollY={scrollY}
        rightElement={
          <View style={styles.headerRight}>
            <TouchableOpacity
              onPress={() => navigation.navigate('Notifications')}
              style={styles.notificationBtn}
            >
              <Ionicons name="notifications-outline" size={24} color={COLORS.text} />
            </TouchableOpacity>
            <TouchableOpacity onPress={handleLogout} style={styles.logoutBtn}>
              <Ionicons name="log-out-outline" size={22} color={COLORS.textSecondary} />
            </TouchableOpacity>
          </View>
        }
      />

      <Animated.ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        onScroll={scrollHandler}
        scrollEventThrottle={16}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={onRefresh}
            tintColor={COLORS.primary}
          />
        }
      >
        {/* Header */}
        <Animated.View style={[styles.header, headerStyle]}>
          <View style={styles.headerTopRow}>
            <SlideIn direction="left" delay={0}>
              <View>
                <Text style={styles.greeting}>Welcome back,</Text>
                <Text style={styles.name}>{user?.name || 'User'}</Text>
              </View>
            </SlideIn>
            <SlideIn direction="right" delay={100}>
              <TouchableOpacity 
                style={styles.avatarBtn} 
                onPress={() => navigation.navigate('HealthProfile')}
              >
                <View style={[styles.avatarRing, { borderColor: user?.isCoach ? COLORS.primary : '#3498db' }]}>
                  {user?.avatar ? (
                    <Image source={{ uri: user.avatar }} style={styles.avatarImg} />
                  ) : (
                    <ExpoLinearGradient colors={[user?.isCoach ? COLORS.primary : '#3498db', '#1a1a1a']} style={styles.avatarGrad}>
                      <Text style={styles.avatarText}>{initials(user?.name || '')}</Text>
                    </ExpoLinearGradient>
                  )}
                </View>
              </TouchableOpacity>
            </SlideIn>
          </View>
        </Animated.View>

        {/* Stats Cards */}
        <View style={styles.statsContainer}>
          {isLoading ? (
            <>
              <Skeleton width="48%" height={120} borderRadius={16} />
              <Skeleton width="48%" height={120} borderRadius={16} />
            </>
          ) : (
            <>
              <GlassCard delay={100} style={styles.statCard} borderGlow glowColor="#e74c3c">
                <Text style={styles.statValue}>{stats.bmr}</Text>
                <Text style={styles.statLabel}>BMR (kcal/day)</Text>
                <Text style={styles.statSubtext}>Basal Metabolic Rate</Text>
              </GlassCard>
              <GlassCard delay={200} style={styles.statCard} borderGlow glowColor="#3498db">
                <Text style={[styles.statValue, { color: '#3498db' }]}>{stats.tdee}</Text>
                <Text style={styles.statLabel}>TDEE (kcal/day)</Text>
                <Text style={styles.statSubtext}>Total Daily Energy</Text>
              </GlassCard>
            </>
          )}
        </View>

        {/* BMI Section */}
        {!isLoading && bmiData && (
          <View style={styles.bmiSection}>
            <BMICard
              bmi={bmiData.bmi}
              category={bmiData.category}
              categoryId={bmiData.categoryId}
              healthRisk={bmiData.healthRisk}
              color={bmiData.color}
              idealWeightRange={bmiData.idealWeightRange}
              weightToIdeal={bmiData.weightToIdeal}
              delay={300}
            />
          </View>
        )}

        {/* Activity Tracking Section */}
        <View style={styles.activitySection}>
          <FadeIn delay={350}>
            <Text style={styles.sectionTitle}>Daily Activity</Text>
          </FadeIn>
          {isLoading ? (
            <Skeleton width="100%" height={200} borderRadius={16} />
          ) : (
            <AnimatedCard delay={400} style={styles.activityCard} pressable={false}>
              {/* Steps Row with Sync Button */}
              <View style={styles.activityInputRow}>
                <View style={styles.activityInputContainer}>
                  <View style={styles.activityIconLabel}>
                    <Ionicons name="footsteps-outline" size={20} color={COLORS.primary} />
                    <Text style={styles.activityLabel}>Steps</Text>
                  </View>
                  <View style={styles.stepsInputRow}>
                    <TextInput
                      style={[styles.activityInput, styles.stepsInput]}
                      value={activityInput.steps}
                      onChangeText={(text) => setActivityInput(prev => ({ ...prev, steps: text }))}
                      placeholder="0"
                      placeholderTextColor={COLORS.textTertiary}
                      keyboardType="numeric"
                    />
                    {(stepTrackingStatus === 'available' || healthKitStatus === 'available') ? (
                      <TouchableOpacity
                        style={[styles.syncStepsButton, isLoadingSteps && styles.syncStepsButtonLoading]}
                        onPress={() => {
                          if (healthKitStatus === 'available') {
                            fetchAppleHealthData();
                          } else {
                            fetchStepsFromDevice();
                          }
                        }}
                        disabled={isLoadingSteps}
                      >
                        <Ionicons
                          name={isLoadingSteps ? "hourglass-outline" : "sync-outline"}
                          size={18}
                          color="#fff"
                        />
                      </TouchableOpacity>
                    ) : stepTrackingStatus === 'no_permission' ? (
                      <TouchableOpacity
                        style={styles.enableStepsButton}
                        onPress={requestStepPermission}
                      >
                        <Ionicons name="fitness-outline" size={18} color="#fff" />
                      </TouchableOpacity>
                    ) : null}
                  </View>
                </View>
                <View style={styles.activityInputContainer}>
                  <View style={styles.activityIconLabel}>
                    <Ionicons name="water-outline" size={20} color="#3498db" />
                    <Text style={styles.activityLabel}>Water (ml)</Text>
                  </View>
                  <TextInput
                    style={styles.activityInput}
                    value={activityInput.waterIntake}
                    onChangeText={(text) => setActivityInput(prev => ({ ...prev, waterIntake: text }))}
                    placeholder="0"
                    placeholderTextColor={COLORS.textTertiary}
                    keyboardType="numeric"
                  />
                </View>
              </View>

              {/* Step tracking status hint */}
              {stepTrackingStatus === 'no_permission' && (
                <TouchableOpacity style={styles.stepHint} onPress={requestStepPermission}>
                  <Ionicons name="information-circle-outline" size={16} color={COLORS.primary} />
                  <Text style={styles.stepHintText}>
                    Tap to enable automatic step tracking from {Platform.OS === 'ios' ? 'HealthKit' : 'Google Fit'}
                  </Text>
                </TouchableOpacity>
              )}
              {stepTrackingStatus === 'available' && (
                <View style={styles.stepHint}>
                  <Ionicons name="checkmark-circle-outline" size={16} color={COLORS.success} />
                  <Text style={[styles.stepHintText, { color: COLORS.success }]}>
                    Step tracking enabled - tap sync button to fetch
                  </Text>
                </View>
              )}

              {/* Health Metrics - Apple Health or Estimated */}
              {(appleHealthData || healthMetrics.estimatedCalories > 0) && (
                <View style={styles.healthMetricsContainer}>
                  {appleHealthData && (
                    <View style={styles.healthKitBadge}>
                      <Ionicons name="heart" size={12} color={Platform.OS === 'android' ? '#4CAF50' : '#ff2d55'} />
                      <Text style={styles.healthKitBadgeText}>{Platform.OS === 'android' ? 'Health Connect' : 'Apple Health'}</Text>
                    </View>
                  )}
                  <View style={styles.healthMetricsRow}>
                    <View style={styles.healthMetricItem}>
                      <Ionicons name="flame-outline" size={18} color="#e74c3c" />
                      <Text style={styles.healthMetricValue}>
                        {appleHealthData ? appleHealthData.activeCalories : healthMetrics.estimatedCalories}
                      </Text>
                      <Text style={styles.healthMetricLabel}>
                        {appleHealthData ? 'active cal' : 'est. cal'}
                      </Text>
                    </View>
                    <View style={styles.healthMetricItem}>
                      <Ionicons name="walk-outline" size={18} color="#3498db" />
                      <Text style={styles.healthMetricValue}>
                        {appleHealthData ? appleHealthData.distanceKm : healthMetrics.estimatedDistanceKm}
                      </Text>
                      <Text style={styles.healthMetricLabel}>km walked</Text>
                    </View>
                    {appleHealthData && (
                      <>
                        <View style={styles.healthMetricItem}>
                          <Ionicons name="fitness-outline" size={18} color="#9b59b6" />
                          <Text style={styles.healthMetricValue}>{appleHealthData.basalCalories}</Text>
                          <Text style={styles.healthMetricLabel}>resting cal</Text>
                        </View>
                        <View style={styles.healthMetricItem}>
                          <Ionicons name="trending-up-outline" size={18} color="#2ecc71" />
                          <Text style={styles.healthMetricValue}>{appleHealthData.flightsClimbed}</Text>
                          <Text style={styles.healthMetricLabel}>flights</Text>
                        </View>
                      </>
                    )}
                  </View>
                  {appleHealthData && (
                    <View style={styles.totalCaloriesRow}>
                      <Text style={styles.totalCaloriesLabel}>Total Calories Burned:</Text>
                      <Text style={styles.totalCaloriesValue}>{appleHealthData.totalCalories} kcal</Text>
                    </View>
                  )}
                </View>
              )}

              {/* HealthKit Permission Request */}
              {healthKitStatus === 'no_permission' && !appleHealthData && (
                <TouchableOpacity style={styles.healthKitPrompt} onPress={initializeAppleHealth}>
                  <Ionicons name="heart-circle-outline" size={20} color={Platform.OS === 'android' ? '#4CAF50' : '#ff2d55'} />
                  <Text style={styles.healthKitPromptText}>
                    Tap to enable {Platform.OS === 'android' ? 'Health Connect' : 'Apple Health'} for accurate calorie tracking
                  </Text>
                  <Ionicons name="chevron-forward" size={16} color={COLORS.textSecondary} />
                </TouchableOpacity>
              )}

              {/* Sleep Row */}
              <View style={styles.activityInputRow}>
                <View style={[styles.activityInputContainer, { flex: 1 }]}>
                  <View style={styles.activityIconLabel}>
                    <Ionicons name="moon-outline" size={20} color="#9b59b6" />
                    <Text style={styles.activityLabel}>Sleep (hours)</Text>
                  </View>
                  <TextInput
                    style={styles.activityInput}
                    value={activityInput.sleepHours}
                    onChangeText={(text) => setActivityInput(prev => ({ ...prev, sleepHours: text }))}
                    placeholder="0"
                    placeholderTextColor={COLORS.textTertiary}
                    keyboardType="decimal-pad"
                  />
                </View>
              </View>
              <TouchableOpacity
                style={[styles.saveActivityButton, isSavingActivity && styles.saveActivityButtonDisabled]}
                onPress={handleSaveActivity}
                disabled={isSavingActivity}
              >
                <Ionicons name={isSavingActivity ? "hourglass-outline" : "checkmark-circle-outline"} size={20} color="#fff" />
                <Text style={styles.saveActivityButtonText}>
                  {isSavingActivity ? 'Saving...' : 'Save Activity'}
                </Text>
              </TouchableOpacity>
              {activityData && (activityData.steps > 0 || activityData.waterIntake > 0 || activityData.sleepHours) && (
                <View style={styles.activitySummary}>
                  <Text style={styles.activitySummaryText}>
                    Today: {activityData.steps} steps | {activityData.waterIntake}ml water
                    {activityData.sleepHours ? ` | ${activityData.sleepHours}h sleep` : ''}
                  </Text>
                </View>
              )}
            </AnimatedCard>
          )}
        </View>

        {/* User Profile */}
        <View style={styles.userInfo}>
          <FadeIn delay={300}>
            <Text style={styles.sectionTitle}>Your Profile</Text>
          </FadeIn>
          <View style={styles.infoGrid}>
            {isLoading ? (
              <>
                <Skeleton width="48%" height={80} borderRadius={12} />
                <Skeleton width="48%" height={80} borderRadius={12} />
                <Skeleton width="48%" height={80} borderRadius={12} />
                <Skeleton width="48%" height={80} borderRadius={12} />
              </>
            ) : (
              [
                { label: 'Goal', value: user?.goal?.replace(/_/g, ' ') || 'Not set' },
                { label: 'Level', value: user?.experienceLevel || 'Not set' },
                { label: 'Weight', value: `${user?.weight || 0} kg` },
                { label: 'Height', value: `${user?.height || 0} cm` },
              ].map((item, index) => (
                <AnimatedCard
                  key={item.label}
                  delay={350 + index * 50}
                  pressable={false}
                  style={styles.infoItem}
                >
                  <Text style={styles.infoLabel}>{item.label}</Text>
                  <Text style={styles.infoValue}>{item.value}</Text>
                </AnimatedCard>
              ))
            )}
          </View>
        </View>

        {/* Quick Actions */}
        <View style={styles.quickActions}>
          <FadeIn delay={500}>
            <Text style={styles.sectionTitle}>Quick Actions</Text>
          </FadeIn>
          {quickActions.map((action, index) => (
            <AnimatedListItem key={action.title} index={index} enterFrom="right">
              <AnimatedCard
                onPress={() => {
                  trigger('light');
                  navigation.navigate(action.screen);
                }}
                style={styles.actionButton}
                variant="elevated"
                animateEntry={false}
              >
                <View style={styles.actionContent}>
                  <View style={[styles.iconContainer, { backgroundColor: `${action.color}20` }]}>
                    <Ionicons name={action.icon} size={24} color={action.color} />
                  </View>
                  <View style={styles.actionTextContainer}>
                    <Text style={styles.actionButtonText}>{action.title}</Text>
                    <Text style={styles.actionButtonSubtext}>{action.subtitle}</Text>
                  </View>
                  <Ionicons name="chevron-forward" size={20} color={COLORS.textSecondary} />
                </View>
              </AnimatedCard>
            </AnimatedListItem>
          ))}
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
    paddingTop: 140,
    paddingBottom: 40,
  },
  header: {
    padding: 20,
  },
  greeting: {
    fontSize: 14,
    color: COLORS.textSecondary,
    fontWeight: '500',
    marginBottom: 2,
  },
  name: {
    fontSize: 26,
    fontWeight: '800',
    color: COLORS.text,
    letterSpacing: -0.3,
  },
  statsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    gap: 12,
  },
  bmiSection: {
    paddingHorizontal: 20,
    paddingBottom: 8,
  },
  activitySection: {
    padding: 20,
    paddingTop: 12,
  },
  activityCard: {
    padding: 16,
  },
  activityInputRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 12,
  },
  activityInputContainer: {
    flex: 1,
  },
  activityIconLabel: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 6,
  },
  activityLabel: {
    fontSize: 13,
    color: COLORS.textSecondary,
    fontWeight: '500',
  },
  activityInput: {
    backgroundColor: COLORS.cardBackground,
    borderRadius: 10,
    padding: 12,
    fontSize: 16,
    color: COLORS.text,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  stepsInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  stepsInput: {
    flex: 1,
  },
  syncStepsButton: {
    backgroundColor: COLORS.primary,
    borderRadius: 10,
    padding: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  syncStepsButtonLoading: {
    opacity: 0.6,
  },
  enableStepsButton: {
    backgroundColor: '#2ecc71',
    borderRadius: 10,
    padding: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepHint: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 12,
    paddingHorizontal: 4,
  },
  stepHintText: {
    fontSize: 12,
    color: COLORS.primary,
    flex: 1,
  },
  healthMetricsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: COLORS.cardBackground,
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  healthMetricItem: {
    alignItems: 'center',
    flex: 1,
  },
  healthMetricValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.text,
    marginTop: 4,
  },
  healthMetricLabel: {
    fontSize: 11,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  healthMetricsContainer: {
    marginBottom: 12,
  },
  healthKitBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 8,
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(255, 45, 85, 0.1)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  healthKitBadgeText: {
    fontSize: 11,
    color: '#ff2d55',
    fontWeight: '600',
  },
  totalCaloriesRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  totalCaloriesLabel: {
    fontSize: 14,
    color: COLORS.textSecondary,
  },
  totalCaloriesValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#e74c3c',
  },
  healthKitPrompt: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: 'rgba(255, 45, 85, 0.08)',
    borderRadius: 10,
    padding: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 45, 85, 0.2)',
  },
  healthKitPromptText: {
    flex: 1,
    fontSize: 13,
    color: COLORS.text,
  },
  saveActivityButton: {
    backgroundColor: COLORS.primary,
    borderRadius: 10,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginTop: 4,
  },
  saveActivityButtonDisabled: {
    opacity: 0.6,
  },
  saveActivityButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  activitySummary: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  activitySummaryText: {
    fontSize: 13,
    color: COLORS.textSecondary,
    textAlign: 'center',
  },
  statCard: {
    flex: 1,
  },
  statValue: {
    fontSize: 30,
    fontWeight: '800',
    color: COLORS.primary,
    marginBottom: 2,
    letterSpacing: -0.5,
  },
  statLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: 2,
  },
  statSubtext: {
    fontSize: 11,
    color: COLORS.textTertiary,
  },
  userInfo: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: COLORS.text,
    marginBottom: 14,
    letterSpacing: -0.2,
  },
  infoGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  infoItem: {
    flex: 1,
    minWidth: '45%',
  },
  infoLabel: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.text,
    textTransform: 'capitalize',
  },
  quickActions: {
    padding: 20,
    paddingBottom: 40,
  },
  actionButton: {
    marginBottom: 12,
    padding: 0,
  },
  actionContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  iconContainer: {
    width: 46,
    height: 46,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  actionTextContainer: {
    flex: 1,
  },
  actionButtonText: {
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: 3,
  },
  actionButtonSubtext: {
    fontSize: 12,
    color: COLORS.textSecondary,
    lineHeight: 16,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  notificationBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoutBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  avatarBtn: {
    width: 52,
    height: 52,
  },
  avatarRing: {
    width: 52,
    height: 52,
    borderRadius: 26,
    borderWidth: 2,
    padding: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarImg: {
    width: 44,
    height: 44,
    borderRadius: 22,
  },
  avatarGrad: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
