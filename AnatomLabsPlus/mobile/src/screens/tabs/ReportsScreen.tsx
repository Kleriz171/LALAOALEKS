import React, { useEffect, useState, useMemo, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  RefreshControl,
  Modal,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedScrollHandler,
} from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import api from '../../services/api';
import { DailyReport, ReportSegment, DateRangeMode } from '../../types';
import {
  BlurHeader,
  GlassCard,
  FadeIn as FadeInComponent,
  SlideIn,
  Skeleton,
  useHaptics,
  COLORS,
} from '../../components/animations';
import {
  DateRangePicker,
  SegmentBar,
  DailyScoreCard,
  RecoveryStatusCard,
  NutritionSummaryCard,
  ActivitySummaryCard,
  TrainingSummaryCard,
  TrendsSegment,
  TrainingSegment,
  HealthSegment,
  InsightsSegment,
  ShareSegment,
} from '../../components/reports';

export default function ReportsScreen() {
  const [report, setReport] = useState<DailyReport | null>(null);
  const [injuryRisk, setInjuryRisk] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [dateMode, setDateMode] = useState<DateRangeMode>('day');
  const [activeSegment, setActiveSegment] = useState<ReportSegment>('overview');
  const [showCalendar, setShowCalendar] = useState(false);

  const scrollY = useSharedValue(0);
  const { trigger } = useHaptics();

  const getDateString = (date: Date) => date.toISOString().split('T')[0];

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event: any) => {
      scrollY.value = event.contentOffset.y;
    },
  });

  useEffect(() => {
    if (activeSegment === 'overview') {
      loadDailyData();
    }
  }, [selectedDate, activeSegment]);

  const loadDailyData = async () => {
    try {
      setIsLoading(true);
      const dateStr = getDateString(selectedDate);
      const [dailyData, injuryData] = await Promise.all([
        api.getDailyReport(dateStr),
        api.getInjuryRisk(),
      ]);
      setReport(dailyData);
      setInjuryRisk(injuryData);
    } catch (error) {
      console.error('Failed to load report:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const onRefresh = async () => {
    setIsRefreshing(true);
    trigger('light');
    if (activeSegment === 'overview') {
      await loadDailyData();
    }
    setIsRefreshing(false);
    trigger('success');
  };

  const handleDateChange = useCallback((days: number) => {
    trigger('selection');
    const newDate = new Date(selectedDate);
    newDate.setDate(newDate.getDate() + days);
    if (newDate <= new Date()) {
      setSelectedDate(newDate);
    }
  }, [selectedDate, trigger]);

  const handleDateSelect = useCallback((date: Date) => {
    trigger('selection');
    setSelectedDate(date);
    setShowCalendar(false);
  }, [trigger]);

  const handleModeChange = useCallback((mode: DateRangeMode) => {
    trigger('selection');
    setDateMode(mode);
  }, [trigger]);

  const handleSegmentChange = useCallback((segment: ReportSegment) => {
    trigger('selection');
    setActiveSegment(segment);
  }, [trigger]);

  const generateCalendarDays = () => {
    const year = selectedDate.getFullYear();
    const month = selectedDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startPadding = firstDay.getDay();
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const days: Array<{ date: Date | null; isToday: boolean; isSelected: boolean; isFuture: boolean }> = [];

    for (let i = 0; i < startPadding; i++) {
      days.push({ date: null, isToday: false, isSelected: false, isFuture: false });
    }

    for (let i = 1; i <= lastDay.getDate(); i++) {
      const date = new Date(year, month, i);
      date.setHours(0, 0, 0, 0);
      const selected = new Date(selectedDate);
      selected.setHours(0, 0, 0, 0);

      days.push({
        date,
        isToday: date.getTime() === today.getTime(),
        isSelected: date.getTime() === selected.getTime(),
        isFuture: date > today,
      });
    }

    return days;
  };

  const calendarDays = useMemo(() => generateCalendarDays(), [selectedDate]);

  const changeMonth = (delta: number) => {
    trigger('selection');
    const newDate = new Date(selectedDate);
    newDate.setMonth(newDate.getMonth() + delta);
    setSelectedDate(newDate);
  };

  const getHeaderTitle = () => {
    switch (activeSegment) {
      case 'overview': return 'Daily Report';
      case 'trends': return 'Trends';
      case 'training': return 'Training';
      case 'health': return 'Health';
      case 'insights': return 'Insights';
      case 'share': return 'Share & Export';
      default: return 'Reports';
    }
  };

  const renderSegmentContent = () => {
    switch (activeSegment) {
      case 'overview':
        return renderOverview();
      case 'trends':
        return <TrendsSegment />;
      case 'training':
        return <TrainingSegment />;
      case 'health':
        return <HealthSegment />;
      case 'insights':
        return <InsightsSegment />;
      case 'share':
        return <ShareSegment />;
      default:
        return null;
    }
  };

  const renderOverview = () => {
    if (isLoading) {
      return (
        <View style={styles.skeletonContainer}>
          <Skeleton width="100%" height={180} borderRadius={16} style={{ marginBottom: 16 }} />
          <Skeleton width="100%" height={150} borderRadius={16} style={{ marginBottom: 16 }} />
          <Skeleton width="100%" height={150} borderRadius={16} />
        </View>
      );
    }

    if (!report) {
      return (
        <FadeInComponent delay={200}>
          <GlassCard style={styles.emptyCard} contentStyle={styles.emptyCardContent}>
            <Ionicons name="document-text-outline" size={48} color={COLORS.textSecondary} />
            <Text style={styles.emptyText}>No data available for this date</Text>
          </GlassCard>
        </FadeInComponent>
      );
    }

    return (
      <>
        <DailyScoreCard report={report} injuryRisk={injuryRisk} />
        <RecoveryStatusCard injuryRisk={injuryRisk} />
        <NutritionSummaryCard report={report} />
        <ActivitySummaryCard report={report} />
        <TrainingSummaryCard report={report} />

        <SlideIn direction="bottom" delay={350}>
          <GlassCard style={styles.tipsCard}>
            <View style={styles.tipsHeader}>
              <Ionicons name="bulb-outline" size={20} color={COLORS.warning} />
              <Text style={styles.tipsTitle}>Daily Insight</Text>
            </View>
            <Text style={styles.tipsText}>
              {getDailyScore() >= 80
                ? "Great job today! You're hitting your targets consistently. Keep up the momentum!"
                : getDailyScore() >= 60
                ? "Good progress! Focus on improving your nutrition adherence for better results."
                : "Room for improvement. Try to hit your step goal and track your meals more consistently."}
            </Text>
          </GlassCard>
        </SlideIn>
      </>
    );
  };

  const getDailyScore = () => {
    if (!report) return 0;
    const nutritionScore = Math.min(report.nutrition.adherence, 100);
    const activityScore = Math.min((report.activity.steps / 10000) * 100, 100);
    const trainingScore = report.training.workoutsCompleted > 0 ? 100 : 50;
    const recoveryScore = injuryRisk?.overallRisk === 'low' ? 100 : injuryRisk?.overallRisk === 'moderate' ? 70 : 40;
    return Math.round((nutritionScore + activityScore + trainingScore + recoveryScore) / 4);
  };

  return (
    <View style={styles.container}>
      <BlurHeader title={getHeaderTitle()} scrollY={scrollY} />

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
        <FadeInComponent delay={50}>
          <SegmentBar active={activeSegment} onChange={handleSegmentChange} />
        </FadeInComponent>

        {activeSegment === 'overview' && (
          <FadeInComponent delay={80}>
            <DateRangePicker
              mode={dateMode}
              selectedDate={selectedDate}
              onModeChange={handleModeChange}
              onDateChange={handleDateChange}
              onCalendarPress={() => setShowCalendar(true)}
            />
          </FadeInComponent>
        )}

        {renderSegmentContent()}
      </Animated.ScrollView>

      <Modal
        visible={showCalendar}
        transparent
        animationType="fade"
        onRequestClose={() => setShowCalendar(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setShowCalendar(false)}
        >
          <TouchableOpacity activeOpacity={1} onPress={(e: any) => e.stopPropagation()}>
            <View style={styles.calendarContainer}>
              <View style={styles.calendarHeader}>
                <TouchableOpacity onPress={() => changeMonth(-1)}>
                  <Ionicons name="chevron-back" size={24} color={COLORS.primary} />
                </TouchableOpacity>
                <Text style={styles.calendarTitle}>
                  {selectedDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                </Text>
                <TouchableOpacity onPress={() => changeMonth(1)}>
                  <Ionicons name="chevron-forward" size={24} color={COLORS.primary} />
                </TouchableOpacity>
              </View>

              <View style={styles.calendarWeekdays}>
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                  <Text key={day} style={styles.weekdayText}>{day}</Text>
                ))}
              </View>

              <View style={styles.calendarGrid}>
                {calendarDays.map((day, index) => (
                  <TouchableOpacity
                    key={index}
                    style={[
                      styles.calendarDay,
                      day.isSelected && styles.calendarDaySelected,
                      day.isToday && !day.isSelected && styles.calendarDayToday,
                    ]}
                    onPress={() => day.date && !day.isFuture && handleDateSelect(day.date)}
                    disabled={!day.date || day.isFuture}
                  >
                    <Text
                      style={[
                        styles.calendarDayText,
                        day.isSelected && styles.calendarDayTextSelected,
                        day.isFuture && styles.calendarDayTextFuture,
                        !day.date && styles.calendarDayTextEmpty,
                      ]}
                    >
                      {day.date?.getDate() || ''}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              <TouchableOpacity
                style={styles.todayButton}
                onPress={() => handleDateSelect(new Date())}
              >
                <Text style={styles.todayButtonText}>Go to Today</Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>
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
    paddingHorizontal: 20,
    paddingBottom: 100,
  },
  skeletonContainer: {
    marginTop: 10,
  },
  emptyCard: {
    marginTop: 20,
  },
  emptyCardContent: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyText: {
    fontSize: 16,
    color: COLORS.textSecondary,
    marginTop: 16,
  },
  tipsCard: {
    marginTop: 4,
    marginBottom: 20,
  },
  tipsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  tipsTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.text,
  },
  tipsText: {
    fontSize: 14,
    color: COLORS.textSecondary,
    lineHeight: 20,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  calendarContainer: {
    backgroundColor: COLORS.cardBackground,
    borderRadius: 20,
    padding: 20,
    width: 340,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  calendarHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  calendarTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.text,
  },
  calendarWeekdays: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 10,
  },
  weekdayText: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.textTertiary,
    width: 40,
    textAlign: 'center',
  },
  calendarGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
  },
  calendarDay: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 2,
    marginHorizontal: 3.5,
    borderRadius: 20,
  },
  calendarDaySelected: {
    backgroundColor: COLORS.primary,
  },
  calendarDayToday: {
    borderWidth: 2,
    borderColor: COLORS.primary,
  },
  calendarDayText: {
    fontSize: 15,
    color: COLORS.text,
    fontWeight: '500',
  },
  calendarDayTextSelected: {
    color: '#fff',
    fontWeight: '600',
  },
  calendarDayTextFuture: {
    color: COLORS.textTertiary,
    opacity: 0.5,
  },
  calendarDayTextEmpty: {
    color: 'transparent',
  },
  todayButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: 12,
    borderRadius: 12,
    marginTop: 16,
    alignItems: 'center',
  },
  todayButtonText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '600',
  },
});
