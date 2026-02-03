import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TextInput,
  Alert,
  RefreshControl,
  TouchableOpacity,
  ScrollView,
  Platform,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Animated, {
  useSharedValue,
  useAnimatedScrollHandler,
  withSpring,
} from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { useNutrition } from '../../context/NutritionContext';
import { useWorkoutTracking } from '../../context/WorkoutTrackingContext';
import {
  AnimatedCard,
  AnimatedButton,
  AnimatedListItem,
  AnimatedProgressRing,
  BlurHeader,
  GlassCard,
  FadeIn,
  SlideIn,
  Skeleton,
  useHaptics,
  COLORS,
  SPRING_CONFIG,
} from '../../components/animations';
import { Food, FoodLog, NutritionPlan, WeightLog } from '../../types';
import api from '../../services/api';

// Micronutrient daily values (RDA)
const MICRONUTRIENT_RDA: { [key: string]: { name: string; unit: string; target: number; color: string } } = {
  fiber: { name: 'Fiber', unit: 'g', target: 28, color: '#8B4513' },
  sugar: { name: 'Sugar', unit: 'g', target: 50, color: '#FF69B4' },
  sodium: { name: 'Sodium', unit: 'mg', target: 2300, color: '#4169E1' },
  potassium: { name: 'Potassium', unit: 'mg', target: 4700, color: '#9370DB' },
  calcium: { name: 'Calcium', unit: 'mg', target: 1000, color: '#E0E0E0' },
  magnesium: { name: 'Magnesium', unit: 'mg', target: 420, color: '#20B2AA' },
  phosphorus: { name: 'Phosphorus', unit: 'mg', target: 700, color: '#DAA520' },
  iron: { name: 'Iron', unit: 'mg', target: 18, color: '#B22222' },
  zinc: { name: 'Zinc', unit: 'mg', target: 11, color: '#708090' },
  vitaminA: { name: 'Vitamin A', unit: 'mcg', target: 900, color: '#FF8C00' },
  vitaminD: { name: 'Vitamin D', unit: 'mcg', target: 20, color: '#FFD700' },
  vitaminC: { name: 'Vitamin C', unit: 'mg', target: 90, color: '#FFA500' },
  vitaminB12: { name: 'Vitamin B12', unit: 'mcg', target: 2.4, color: '#FF6347' },
};

type TabType = 'diary' | 'nutrients' | 'trends' | 'goals';

export default function NutritionScreen() {
  const navigation = useNavigation<any>();
  const {
    todaySummary,
    targets,
    streak,
    weightTrend,
    recentFoods,
    isLoading,
    refreshAll,
    refreshToday,
    logFood,
    deleteLog,
    logWeight,
  } = useNutrition();

  const { workoutHistory } = useWorkoutTracking();

  const [activeTab, setActiveTab] = useState<TabType>('diary');
  const [showAddFoodModal, setShowAddFoodModal] = useState(false);
  const [showFoodDetailModal, setShowFoodDetailModal] = useState(false);
  const [selectedMealType, setSelectedMealType] = useState<'breakfast' | 'lunch' | 'dinner' | 'snack'>('breakfast');
  const [selectedFood, setSelectedFood] = useState<Food | null>(null);
  const [servings, setServings] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Food[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [waterIntake, setWaterIntake] = useState(0);
  const [showFormulas, setShowFormulas] = useState(false);
  const [weightInput, setWeightInput] = useState('');
  const [weightHistory, setWeightHistory] = useState<WeightLog[]>([]);
  const [localTargets, setLocalTargets] = useState<NutritionPlan | null>(null);
  const [calorieHistory, setCalorieHistory] = useState<{
    history: Array<{ date: string; calories: number; dayOfWeek: string }>;
    stats: { average: number; target: number; adherence: number; daysTracked: number; totalDays: number };
  } | null>(null);

  const scrollY = useSharedValue(0);
  const { trigger } = useHaptics();
  const tabIndicatorPosition = useSharedValue(0);

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollY.value = event.contentOffset.y;
    },
  });

  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    await refreshAll();
    loadWeightHistory();
    loadTargets();
    loadCalorieHistory();
  };

  const loadCalorieHistory = async () => {
    try {
      const history = await api.getCalorieHistory(7);
      setCalorieHistory(history);
    } catch (error) {
      console.error('Failed to load calorie history:', error);
    }
  };

  const loadWeightHistory = async () => {
    try {
      const history = await api.getWeightHistory(30);
      setWeightHistory(history);
    } catch (error) {
      console.error('Failed to load weight history:', error);
    }
  };

  const loadTargets = async () => {
    try {
      const plan = await api.calculateNutrition();
      setLocalTargets(plan);
    } catch (error) {
      console.error('Failed to load targets:', error);
    }
  };

  const onRefresh = async () => {
    setIsRefreshing(true);
    trigger('light');
    await refreshAll();
    await loadWeightHistory();
    await loadTargets();
    await loadCalorieHistory();
    setIsRefreshing(false);
    trigger('success');
  };

  // Search foods
  const searchFoods = useCallback(async (query: string) => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }
    setIsSearching(true);
    try {
      const results = await api.searchFood(query);
      setSearchResults(results);
    } catch (err) {
      console.error('Search failed:', err);
    } finally {
      setIsSearching(false);
    }
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      searchFoods(searchQuery);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery, searchFoods]);

  // Handle adding food
  const handleAddFood = async () => {
    if (!selectedFood) return;
    trigger('success');
    try {
      await logFood(selectedFood.id, servings, selectedMealType);
      setShowFoodDetailModal(false);
      setShowAddFoodModal(false);
      setSelectedFood(null);
      setServings(1);
      setSearchQuery('');
    } catch (err) {
      trigger('error');
      Alert.alert('Error', 'Failed to log food');
    }
  };

  const handleLogWeight = async () => {
    const weight = parseFloat(weightInput);
    if (isNaN(weight) || weight <= 0) {
      Alert.alert('Invalid Weight', 'Please enter a valid weight');
      return;
    }
    try {
      await logWeight(weight);
      setWeightInput('');
      await loadWeightHistory();
      trigger('success');
      Alert.alert('Success', 'Weight logged successfully');
    } catch (error) {
      Alert.alert('Error', 'Failed to log weight');
    }
  };

  const handleTabChange = (tab: TabType) => {
    trigger('selection');
    setActiveTab(tab);
    const positions = { diary: 0, nutrients: 1, trends: 2, goals: 3 };
    tabIndicatorPosition.value = withSpring(positions[tab] * 80, SPRING_CONFIG.snappy);
  };

  const addWater = (amount: number) => {
    trigger('light');
    setWaterIntake(prev => prev + amount);
  };

  // Calculate consumed nutrients
  const consumed = todaySummary?.totals || { calories: 0, protein: 0, carbs: 0, fat: 0 };
  const currentTargets = localTargets || targets;
  const targetValues = currentTargets
    ? { targetCalories: currentTargets.targetCalories, macros: currentTargets.macros }
    : { targetCalories: 2000, macros: { protein: 150, carbs: 250, fat: 67 } };

  // Calculate remaining
  const remaining = {
    calories: Math.max(0, targetValues.targetCalories - consumed.calories),
    protein: Math.max(0, targetValues.macros.protein - consumed.protein),
    carbs: Math.max(0, targetValues.macros.carbs - consumed.carbs),
    fat: Math.max(0, targetValues.macros.fat - consumed.fat),
  };

  // Calculate water goal based on user weight (35ml per kg body weight)
  const userWeight = (currentTargets as any)?.userWeight || 70; // Default 70kg if not set
  const waterGoal = Math.round(userWeight * 35); // 35ml per kg is standard recommendation

  // Net calories (with exercise)
  const today = new Date().toISOString().split('T')[0];
  const todaysWorkouts = workoutHistory.filter(w =>
    w.completedAt && w.completedAt.startsWith(today)
  );
  const caloriesBurned = todaysWorkouts.reduce((total, workout) => {
    const durationCals = workout.duration * 5;
    const volumeCals = workout.totalVolume * 0.05;
    return total + durationCals + volumeCals;
  }, 0);

  const renderDiaryTab = () => (
    <>
      {/* Calorie Summary Card */}
      <SlideIn direction="bottom" delay={100}>
        <GlassCard style={styles.calorieCard}>
          <View style={styles.calorieHeader}>
            <View>
              <Text style={styles.calorieTitle}>Today's Calories</Text>
              <Text style={styles.dateText}>
                {new Date().toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
              </Text>
            </View>
            {streak && streak.currentStreak > 0 && (
              <View style={styles.streakBadge}>
                <Text style={styles.streakEmoji}>🔥</Text>
                <Text style={styles.streakText}>{streak.currentStreak}</Text>
              </View>
            )}
          </View>

          <View style={styles.calorieRing}>
            <AnimatedProgressRing
              progress={(consumed.calories / targetValues.targetCalories) * 100}
              size={140}
              strokeWidth={12}
              color={consumed.calories > targetValues.targetCalories ? COLORS.warning : COLORS.primary}
              label="Remaining"
              value={remaining.calories.toString()}
              delay={0}
              duration={800}
            />
          </View>

          <View style={styles.calorieBreakdown}>
            <View style={styles.calorieItem}>
              <Text style={styles.calorieLabel}>Goal</Text>
              <Text style={styles.calorieValue}>{targetValues.targetCalories}</Text>
            </View>
            <View style={styles.calorieDivider} />
            <View style={styles.calorieItem}>
              <Text style={styles.calorieLabel}>Food</Text>
              <Text style={[styles.calorieValue, { color: COLORS.primary }]}>
                +{Math.round(consumed.calories)}
              </Text>
            </View>
            <View style={styles.calorieDivider} />
            <View style={styles.calorieItem}>
              <Text style={styles.calorieLabel}>Exercise</Text>
              <Text style={[styles.calorieValue, { color: COLORS.success }]}>
                -{Math.round(caloriesBurned)}
              </Text>
            </View>
          </View>
        </GlassCard>
      </SlideIn>

      {/* Macro Progress */}
      <SlideIn direction="bottom" delay={150}>
        <GlassCard style={styles.macroCard}>
          <Text style={styles.sectionTitle}>Macros</Text>
          <View style={styles.macroGrid}>
            {[
              { name: 'P', current: consumed.protein, target: targetValues.macros.protein, color: COLORS.primary, unit: 'g' },
              { name: 'C', current: consumed.carbs, target: targetValues.macros.carbs, color: COLORS.info, unit: 'g' },
              { name: 'F', current: consumed.fat, target: targetValues.macros.fat, color: COLORS.warning, unit: 'g' },
            ].map((macro, index) => (
              <View key={macro.name} style={styles.macroItem}>
                <AnimatedProgressRing
                  progress={(macro.current / macro.target) * 100}
                  size={60}
                  strokeWidth={5}
                  color={macro.color}
                  label={macro.name}
                  value={`${Math.round(macro.current)}`}
                  delay={200 + index * 80}
                />
                <Text style={styles.macroRemaining}>
                  {Math.round(Math.max(0, macro.target - macro.current))}{macro.unit} left
                </Text>
              </View>
            ))}
          </View>
        </GlassCard>
      </SlideIn>

      {/* Water Tracking */}
      <SlideIn direction="bottom" delay={200}>
        <GlassCard style={styles.waterCard}>
          <View style={styles.waterHeader}>
            <View style={styles.waterInfo}>
              <Ionicons name="water" size={20} color={COLORS.info} />
              <Text style={styles.waterTitle}>Water</Text>
            </View>
            <Text style={styles.waterAmount}>{waterIntake} / {waterGoal} ml</Text>
          </View>
          <View style={styles.waterProgress}>
            <View style={[styles.waterProgressFill, { width: `${Math.min(100, (waterIntake / waterGoal) * 100)}%` }]} />
          </View>
          <View style={styles.waterButtons}>
            {[250, 500, 750].map(amount => (
              <TouchableOpacity key={amount} style={styles.waterButton} onPress={() => addWater(amount)}>
                <Text style={styles.waterButtonText}>+{amount}ml</Text>
              </TouchableOpacity>
            ))}
          </View>
        </GlassCard>
      </SlideIn>

      {/* Meals */}
      <FadeIn delay={250}>
        <Text style={styles.sectionTitle}>Meals</Text>
      </FadeIn>

      {['breakfast', 'lunch', 'dinner', 'snack'].map((mealType, mealIndex) => {
        const meals = todaySummary?.meals?.[mealType as keyof typeof todaySummary.meals] || [];
        const mealCalories = meals.reduce((sum, log) => sum + (log.totalCalories || log.food.calories * log.servings), 0);

        return (
          <AnimatedListItem key={mealType} index={mealIndex} enterFrom="right">
            <GlassCard style={styles.mealCard}>
              <TouchableOpacity
                style={styles.mealHeader}
                onPress={() => {
                  trigger('light');
                  setSelectedMealType(mealType as any);
                  setShowAddFoodModal(true);
                }}
              >
                <View style={styles.mealInfo}>
                  <Ionicons
                    name={
                      mealType === 'breakfast' ? 'sunny-outline' :
                      mealType === 'lunch' ? 'partly-sunny-outline' :
                      mealType === 'dinner' ? 'moon-outline' : 'cafe-outline'
                    }
                    size={20}
                    color={COLORS.primary}
                  />
                  <Text style={styles.mealName}>{mealType.charAt(0).toUpperCase() + mealType.slice(1)}</Text>
                </View>
                <View style={styles.mealRight}>
                  <Text style={styles.mealCalories}>{Math.round(mealCalories)} kcal</Text>
                  <Ionicons name="add-circle" size={22} color={COLORS.primary} />
                </View>
              </TouchableOpacity>

              {meals.length > 0 && (
                <View style={styles.mealItems}>
                  {meals.map((log) => (
                    <View key={log.id} style={styles.foodItem}>
                      <View style={styles.foodInfo}>
                        <Text style={styles.foodName} numberOfLines={1}>{log.food.name}</Text>
                        <Text style={styles.foodServings}>{log.servings} × {log.food.servingSize}</Text>
                      </View>
                      <View style={styles.foodNutrients}>
                        <Text style={styles.foodCalories}>
                          {Math.round(log.food.calories * log.servings)} kcal
                        </Text>
                        <View style={styles.macroMini}>
                          <Text style={[styles.macroMiniText, { color: COLORS.primary }]}>
                            P {Math.round(log.food.protein * log.servings)}
                          </Text>
                          <Text style={[styles.macroMiniText, { color: COLORS.info }]}>
                            C {Math.round(log.food.carbs * log.servings)}
                          </Text>
                          <Text style={[styles.macroMiniText, { color: COLORS.warning }]}>
                            F {Math.round(log.food.fat * log.servings)}
                          </Text>
                        </View>
                      </View>
                      <TouchableOpacity
                        style={styles.deleteButton}
                        onPress={() => {
                          Alert.alert('Delete', 'Remove this food?', [
                            { text: 'Cancel', style: 'cancel' },
                            {
                              text: 'Delete',
                              style: 'destructive',
                              onPress: () => {
                                trigger('warning');
                                deleteLog(log.id);
                              },
                            },
                          ]);
                        }}
                      >
                        <Ionicons name="close-circle" size={18} color={COLORS.textTertiary} />
                      </TouchableOpacity>
                    </View>
                  ))}
                </View>
              )}
            </GlassCard>
          </AnimatedListItem>
        );
      })}
    </>
  );

  const renderNutrientGroup = (keys: string[], startIndex: number) => {
    return keys.map((key, index) => {
      const nutrient = MICRONUTRIENT_RDA[key];
      if (!nutrient) return null;

      let current = 0;
      if (todaySummary?.meals) {
        const allLogs = [
          ...(todaySummary.meals.breakfast || []),
          ...(todaySummary.meals.lunch || []),
          ...(todaySummary.meals.dinner || []),
          ...(todaySummary.meals.snack || []),
        ];
        allLogs.forEach(log => {
          const food = log.food as any;
          const multiplier = log.servings || 1;
          if (key === 'fiber' && food.fiber) current += food.fiber * multiplier;
          if (key === 'sugar' && food.sugar) current += food.sugar * multiplier;
          if (key === 'sodium' && food.sodium) current += food.sodium * multiplier;
          if (food.micronutrients && food.micronutrients[key]) {
            current += food.micronutrients[key] * multiplier;
          }
        });
      }
      const percentage = nutrient.target > 0 ? Math.min(100, (current / nutrient.target) * 100) : 0;
      const hasData = current > 0 || ['fiber', 'sugar', 'sodium'].includes(key);

      return (
        <AnimatedListItem key={key} index={startIndex + index} enterFrom="right">
          <View style={[styles.nutrientRow, !hasData && styles.nutrientRowUnavailable]}>
            <View style={styles.nutrientInfo}>
              <Text style={[styles.nutrientName, !hasData && styles.nutrientNameUnavailable]}>
                {nutrient.name}
              </Text>
              <Text style={styles.nutrientValues}>
                {hasData ? `${current >= 1 ? Math.round(current) : current.toFixed(1)} / ${nutrient.target} ${nutrient.unit}` : 'No data'}
              </Text>
            </View>
            <View style={styles.nutrientBarContainer}>
              <View style={styles.nutrientBar}>
                <Animated.View
                  style={[
                    styles.nutrientBarFill,
                    {
                      width: hasData ? `${percentage}%` : '0%',
                      backgroundColor: percentage >= 100 ? COLORS.success : nutrient.color,
                    },
                  ]}
                />
              </View>
              <Text style={[styles.nutrientPercentage, { color: hasData ? (percentage >= 100 ? COLORS.success : nutrient.color) : COLORS.textTertiary }]}>
                {hasData ? `${Math.round(percentage)}%` : '--'}
              </Text>
            </View>
          </View>
        </AnimatedListItem>
      );
    });
  };

  const renderNutrientsTab = () => (
    <>
      <SlideIn direction="bottom" delay={100}>
        <GlassCard style={styles.nutrientOverview}>
          <Text style={styles.sectionTitle}>Nutrient Targets</Text>
          <Text style={styles.nutrientSubtitle}>Daily progress towards your goals</Text>
        </GlassCard>
      </SlideIn>

      <FadeIn delay={150}>
        <Text style={styles.nutrientCategory}>Macronutrients</Text>
      </FadeIn>

      {[
        { name: 'Calories', current: consumed.calories, target: targetValues.targetCalories, unit: 'kcal', color: COLORS.primary },
        { name: 'Protein', current: consumed.protein, target: targetValues.macros.protein, unit: 'g', color: COLORS.primary },
        { name: 'Carbs', current: consumed.carbs, target: targetValues.macros.carbs, unit: 'g', color: COLORS.info },
        { name: 'Fat', current: consumed.fat, target: targetValues.macros.fat, unit: 'g', color: COLORS.warning },
      ].map((nutrient, index) => {
        const percentage = Math.min(100, (nutrient.current / nutrient.target) * 100);
        return (
          <AnimatedListItem key={nutrient.name} index={index} enterFrom="right">
            <View style={styles.nutrientRow}>
              <View style={styles.nutrientInfo}>
                <Text style={styles.nutrientName}>{nutrient.name}</Text>
                <Text style={styles.nutrientValues}>
                  {Math.round(nutrient.current)} / {nutrient.target} {nutrient.unit}
                </Text>
              </View>
              <View style={styles.nutrientBarContainer}>
                <View style={styles.nutrientBar}>
                  <Animated.View
                    style={[styles.nutrientBarFill, { width: `${percentage}%`, backgroundColor: nutrient.color }]}
                  />
                </View>
                <Text style={[styles.nutrientPercentage, { color: nutrient.color }]}>
                  {Math.round(percentage)}%
                </Text>
              </View>
            </View>
          </AnimatedListItem>
        );
      })}

      <FadeIn delay={250}>
        <Text style={styles.nutrientCategory}>Key Micronutrients</Text>
      </FadeIn>
      {renderNutrientGroup(['fiber', 'sugar', 'sodium', 'potassium', 'calcium', 'iron', 'vitaminC', 'vitaminD'], 4)}
    </>
  );

  const renderTrendsTab = () => {
    // Use real calorie history or fall back to placeholder showing only today's data
    const historyData = calorieHistory?.history || [];
    const hasRealData = historyData.length > 0 && historyData.some(d => d.calories > 0);

    // If no history data, create placeholder with only today's calories visible
    const chartData = hasRealData
      ? historyData.map((d, i) => ({
          calories: d.calories,
          label: d.dayOfWeek,
          isToday: i === historyData.length - 1,
        }))
      : Array(7).fill(null).map((_, i) => ({
          calories: i === 6 ? consumed.calories : 0,
          label: ['M', 'T', 'W', 'T', 'F', 'S', 'S'][i],
          isToday: i === 6,
        }));

    const stats = calorieHistory?.stats || {
      average: consumed.calories > 0 ? Math.round(consumed.calories) : 0,
      target: targetValues.targetCalories,
      adherence: 0,
      daysTracked: consumed.calories > 0 ? 1 : 0,
    };

    const maxCal = Math.max(targetValues.targetCalories + 500, ...chartData.map(d => d.calories), 2000);

    return (
    <>
      <SlideIn direction="bottom" delay={100}>
        <GlassCard style={styles.trendCard}>
          <Text style={styles.sectionTitle}>Calorie Trend</Text>
          <Text style={styles.trendSubtitle}>Last 7 days</Text>
          <View style={styles.trendChart}>
            {chartData.map((day, i) => {
              const height = day.calories > 0 ? (day.calories / maxCal) * 100 : 3;
              return (
                <View key={i} style={styles.trendBarContainer}>
                  <View style={[styles.trendBar, { height: `${Math.max(height, 3)}%`, opacity: day.calories > 0 ? 1 : 0.3 }]}>
                    {day.isToday && day.calories > 0 && <View style={styles.currentDayIndicator} />}
                  </View>
                  <Text style={styles.trendLabel}>{day.label}</Text>
                </View>
              );
            })}
          </View>
          <View style={styles.trendStats}>
            <View style={styles.trendStat}>
              <Text style={styles.trendStatLabel}>Average</Text>
              <Text style={styles.trendStatValue}>
                {stats.average > 0 ? stats.average.toLocaleString() : '--'}
              </Text>
            </View>
            <View style={styles.trendStat}>
              <Text style={styles.trendStatLabel}>Goal</Text>
              <Text style={styles.trendStatValue}>{targetValues.targetCalories.toLocaleString()}</Text>
            </View>
            <View style={styles.trendStat}>
              <Text style={styles.trendStatLabel}>Adherence</Text>
              <Text style={[styles.trendStatValue, { color: stats.adherence >= 70 ? COLORS.success : stats.adherence >= 40 ? COLORS.warning : COLORS.textSecondary }]}>
                {stats.daysTracked > 0 ? `${stats.adherence}%` : '--'}
              </Text>
            </View>
          </View>
          {!hasRealData && (
            <Text style={styles.noHistoryHint}>
              Track your meals daily to see trends
            </Text>
          )}
        </GlassCard>
      </SlideIn>

      <SlideIn direction="bottom" delay={200}>
        <GlassCard style={styles.trendCard}>
          <Text style={styles.sectionTitle}>Weight Progress</Text>
          {weightTrend ? (
            <>
              <View style={styles.weightStats}>
                <View style={styles.weightStat}>
                  <Text style={styles.weightStatLabel}>Current</Text>
                  <Text style={styles.weightStatValue}>{weightTrend.current || '--'} kg</Text>
                </View>
                <View style={styles.weightStat}>
                  <Text style={styles.weightStatLabel}>7-Day Avg</Text>
                  <Text style={styles.weightStatValue}>{weightTrend.average7Day?.toFixed(1) || '--'} kg</Text>
                </View>
                <View style={styles.weightStat}>
                  <Text style={styles.weightStatLabel}>Change</Text>
                  <Text style={[styles.weightStatValue, { color: weightTrend.trend === 'down' ? COLORS.success : COLORS.warning }]}>
                    {weightTrend.change ? `${weightTrend.change > 0 ? '+' : ''}${weightTrend.change.toFixed(1)}` : '--'} kg
                  </Text>
                </View>
              </View>
              <View style={styles.trendIndicator}>
                <Ionicons
                  name={weightTrend.trend === 'down' ? 'trending-down' : weightTrend.trend === 'up' ? 'trending-up' : 'remove'}
                  size={22}
                  color={weightTrend.trend === 'down' ? COLORS.success : weightTrend.trend === 'up' ? COLORS.warning : COLORS.textSecondary}
                />
                <Text style={styles.trendText}>
                  {weightTrend.trend === 'down' ? 'Losing weight' : weightTrend.trend === 'up' ? 'Gaining weight' : 'Stable'}
                </Text>
              </View>
            </>
          ) : (
            <Text style={styles.noDataText}>Log your weight to see trends</Text>
          )}
        </GlassCard>
      </SlideIn>

      <SlideIn direction="bottom" delay={300}>
        <GlassCard style={styles.trendCard}>
          <View style={styles.biometricHeader}>
            <Ionicons name="scale-outline" size={20} color={COLORS.primary} />
            <Text style={styles.biometricTitle}>Log Weight</Text>
          </View>
          <View style={styles.weightInputContainer}>
            <TextInput
              style={styles.weightInput}
              placeholder="Enter weight"
              placeholderTextColor={COLORS.textTertiary}
              keyboardType="numeric"
              value={weightInput}
              onChangeText={setWeightInput}
            />
            <Text style={styles.weightUnit}>kg</Text>
            <TouchableOpacity style={styles.logWeightButton} onPress={handleLogWeight}>
              <Text style={styles.logWeightButtonText}>Log</Text>
            </TouchableOpacity>
          </View>
        </GlassCard>
      </SlideIn>
    </>
    );
  };

  const renderGoalsTab = () => (
    <>
      {currentTargets && (
        <>
          <SlideIn direction="bottom" delay={100}>
            <View style={styles.caloriesSection}>
              <View style={styles.calorieGoalCard}>
                <Text style={styles.goalValue}>{Math.round(currentTargets.bmr)}</Text>
                <Text style={styles.goalLabel}>BMR</Text>
                <Text style={styles.goalSubtext}>Basal Metabolic Rate</Text>
              </View>

              <View style={styles.calorieGoalCard}>
                <Text style={styles.goalValue}>{Math.round(currentTargets.tdee)}</Text>
                <Text style={styles.goalLabel}>TDEE</Text>
                <Text style={styles.goalSubtext}>Maintenance calories</Text>
              </View>

              <View style={[styles.calorieGoalCard, styles.targetCard]}>
                <Text style={[styles.goalValue, styles.targetValue]}>
                  {Math.round(currentTargets.targetCalories || 0)}
                </Text>
                <Text style={styles.goalLabel}>TARGET</Text>
                <Text style={styles.goalSubtext}>Daily Goal</Text>
              </View>
            </View>
          </SlideIn>

          <SlideIn direction="bottom" delay={200}>
            <GlassCard style={styles.macrosGoalCard}>
              <Text style={styles.sectionTitle}>Daily Macros</Text>

              {[
                { name: 'Protein', value: currentTargets.macros.protein, color: COLORS.primary },
                { name: 'Carbs', value: currentTargets.macros.carbs, color: COLORS.info },
                { name: 'Fat', value: currentTargets.macros.fat, color: COLORS.warning },
              ].map((macro) => (
                <View key={macro.name} style={styles.macroGoalRow}>
                  <View style={styles.macroGoalHeader}>
                    <Text style={styles.macroGoalName}>{macro.name}</Text>
                    <Text style={[styles.macroGoalAmount, { color: macro.color }]}>{Math.round(macro.value)}g</Text>
                  </View>
                  <View style={styles.macroGoalBar}>
                    <View
                      style={[
                        styles.macroGoalBarFill,
                        {
                          width: `${Math.min((macro.value * (macro.name === 'Fat' ? 9 : 4) / currentTargets.targetCalories) * 100, 100)}%`,
                          backgroundColor: macro.color,
                        },
                      ]}
                    />
                  </View>
                  <Text style={styles.macroGoalCalories}>
                    {Math.round(macro.value * (macro.name === 'Fat' ? 9 : 4))} kcal
                  </Text>
                </View>
              ))}
            </GlassCard>
          </SlideIn>

          <TouchableOpacity style={styles.formulasToggle} onPress={() => setShowFormulas(!showFormulas)}>
            <Text style={styles.formulasToggleText}>
              {showFormulas ? 'Hide' : 'Show'} Scientific Formulas
            </Text>
          </TouchableOpacity>

          {showFormulas && currentTargets.explanation && (
            <FadeIn delay={100}>
              <View style={styles.formulasSection}>
                <View style={styles.formulaCard}>
                  <Text style={styles.formulaTitle}>BMR Formula</Text>
                  <Text style={styles.formulaText}>{currentTargets.explanation.bmrFormula}</Text>
                </View>
                <View style={styles.formulaCard}>
                  <Text style={styles.formulaTitle}>TDEE Calculation</Text>
                  <Text style={styles.formulaText}>{currentTargets.explanation.tdeeCalculation}</Text>
                </View>
                <View style={styles.formulaCard}>
                  <Text style={styles.formulaTitle}>Calorie Adjustment</Text>
                  <Text style={styles.formulaText}>{currentTargets.explanation.calorieAdjustment}</Text>
                </View>
                <View style={styles.formulaCard}>
                  <Text style={styles.formulaTitle}>Macro Rationale</Text>
                  <Text style={styles.formulaText}>{currentTargets.explanation.macroRationale}</Text>
                </View>
              </View>
            </FadeIn>
          )}
        </>
      )}
    </>
  );

  if (isLoading && !todaySummary && !currentTargets) {
    return (
      <View style={styles.loadingContainer}>
        <Skeleton width="100%" height={200} borderRadius={12} style={{ marginBottom: 14 }} />
        <Skeleton width="100%" height={120} borderRadius={12} style={{ marginBottom: 14 }} />
        <Skeleton width="100%" height={80} borderRadius={12} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <BlurHeader
        title="Nutrition"
        scrollY={scrollY}
        rightElement={
          <View style={styles.headerButtons}>
            <TouchableOpacity
              style={styles.scanButton}
              onPress={() => navigation.navigate('FoodScanner', { mealType: selectedMealType })}
            >
              <Ionicons name="camera" size={18} color="#fff" />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.scanButtonOutline}
              onPress={() => navigation.navigate('BarcodeScanner', { mealType: selectedMealType })}
            >
              <Ionicons name="barcode-outline" size={18} color={COLORS.primary} />
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
          <RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} tintColor={COLORS.primary} />
        }
      >
        {/* Tab Selector */}
        <FadeIn delay={50}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.tabScroll}
            contentContainerStyle={styles.tabContainer}
          >
            {[
              { id: 'diary', label: 'Diary', icon: 'book-outline' },
              { id: 'nutrients', label: 'Nutrients', icon: 'nutrition-outline' },
              { id: 'trends', label: 'Trends', icon: 'trending-up-outline' },
              { id: 'goals', label: 'Goals', icon: 'flag-outline' },
            ].map((tab) => (
              <TouchableOpacity
                key={tab.id}
                style={[styles.tab, activeTab === tab.id && styles.tabActive]}
                onPress={() => handleTabChange(tab.id as TabType)}
              >
                <Ionicons
                  name={tab.icon as any}
                  size={16}
                  color={activeTab === tab.id ? '#fff' : COLORS.textSecondary}
                />
                <Text style={[styles.tabText, activeTab === tab.id && styles.tabTextActive]}>
                  {tab.label}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </FadeIn>

        {/* Tab Content */}
        {activeTab === 'diary' && renderDiaryTab()}
        {activeTab === 'nutrients' && renderNutrientsTab()}
        {activeTab === 'trends' && renderTrendsTab()}
        {activeTab === 'goals' && renderGoalsTab()}

        <View style={styles.bottomPadding} />
      </Animated.ScrollView>

      {/* Add Food Modal */}
      <Modal
        visible={showAddFoodModal}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setShowAddFoodModal(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>
              Add to {selectedMealType.charAt(0).toUpperCase() + selectedMealType.slice(1)}
            </Text>
            <AnimatedButton
              variant="ghost"
              size="small"
              onPress={() => setShowAddFoodModal(false)}
              title="Cancel"
              textStyle={{ color: COLORS.primary }}
            />
          </View>

          <View style={styles.searchContainer}>
            <Ionicons name="search" size={18} color={COLORS.textSecondary} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search foods..."
              placeholderTextColor={COLORS.textTertiary}
              value={searchQuery}
              onChangeText={setSearchQuery}
              autoFocus
            />
            {isSearching && <Ionicons name="hourglass-outline" size={18} color={COLORS.textSecondary} />}
          </View>

          {/* Recent Foods */}
          {!searchQuery && recentFoods?.recent && recentFoods.recent.length > 0 && (
            <View style={styles.recentSection}>
              <Text style={styles.recentTitle}>Recent</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                {recentFoods.recent.slice(0, 8).map((food) => (
                  <TouchableOpacity
                    key={food.id}
                    style={styles.recentChip}
                    onPress={() => {
                      setSelectedFood(food);
                      setServings(food.defaultServings || 1);
                      setShowFoodDetailModal(true);
                    }}
                  >
                    <Text style={styles.recentChipText} numberOfLines={1}>{food.name}</Text>
                    <Text style={styles.recentChipCalories}>{food.calories} cal</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          )}

          <Animated.ScrollView style={styles.foodList}>
            {searchResults.map((food, index) => (
              <AnimatedListItem key={food.id} index={index} enterFrom="right">
                <AnimatedCard
                  onPress={() => {
                    setSelectedFood(food);
                    setServings(1);
                    setShowFoodDetailModal(true);
                  }}
                  style={styles.foodSearchCard}
                >
                  <View style={styles.foodSearchInfo}>
                    <Text style={styles.foodSearchName}>{food.name}</Text>
                    <Text style={styles.foodSearchServing}>{food.servingSize}</Text>
                  </View>
                  <View style={styles.foodSearchNutrients}>
                    <Text style={styles.foodSearchCalories}>{food.calories} cal</Text>
                    <View style={styles.foodSearchMacros}>
                      <Text style={[styles.foodSearchMacro, { color: COLORS.primary }]}>P {food.protein}g</Text>
                      <Text style={[styles.foodSearchMacro, { color: COLORS.info }]}>C {food.carbs}g</Text>
                      <Text style={[styles.foodSearchMacro, { color: COLORS.warning }]}>F {food.fat}g</Text>
                    </View>
                  </View>
                </AnimatedCard>
              </AnimatedListItem>
            ))}
          </Animated.ScrollView>
        </View>
      </Modal>

      {/* Food Detail Modal */}
      <Modal
        visible={showFoodDetailModal}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setShowFoodDetailModal(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Add Food</Text>
            <AnimatedButton
              variant="ghost"
              size="small"
              onPress={() => setShowFoodDetailModal(false)}
              title="Cancel"
              textStyle={{ color: COLORS.primary }}
            />
          </View>

          {selectedFood && (
            <View style={styles.foodDetailContent}>
              <GlassCard style={styles.foodDetailCard}>
                <Text style={styles.foodDetailName}>{selectedFood.name}</Text>
                <Text style={styles.foodDetailServing}>{selectedFood.servingSize}</Text>

                <View style={styles.servingsControl}>
                  <Text style={styles.servingsLabel}>Servings</Text>
                  <View style={styles.servingsButtons}>
                    <TouchableOpacity style={styles.servingButton} onPress={() => setServings(Math.max(0.5, servings - 0.5))}>
                      <Ionicons name="remove" size={22} color={COLORS.text} />
                    </TouchableOpacity>
                    <Text style={styles.servingsValue}>{servings}</Text>
                    <TouchableOpacity style={styles.servingButton} onPress={() => setServings(servings + 0.5)}>
                      <Ionicons name="add" size={22} color={COLORS.text} />
                    </TouchableOpacity>
                  </View>
                </View>

                <View style={styles.foodDetailNutrients}>
                  <View style={styles.foodDetailNutrient}>
                    <Text style={styles.foodDetailNutrientValue}>{Math.round(selectedFood.calories * servings)}</Text>
                    <Text style={styles.foodDetailNutrientLabel}>Calories</Text>
                  </View>
                  <View style={[styles.foodDetailNutrient, { borderLeftWidth: 1, borderLeftColor: COLORS.border }]}>
                    <Text style={[styles.foodDetailNutrientValue, { color: COLORS.primary }]}>{Math.round(selectedFood.protein * servings)}g</Text>
                    <Text style={styles.foodDetailNutrientLabel}>Protein</Text>
                  </View>
                  <View style={[styles.foodDetailNutrient, { borderLeftWidth: 1, borderLeftColor: COLORS.border }]}>
                    <Text style={[styles.foodDetailNutrientValue, { color: COLORS.info }]}>{Math.round(selectedFood.carbs * servings)}g</Text>
                    <Text style={styles.foodDetailNutrientLabel}>Carbs</Text>
                  </View>
                  <View style={[styles.foodDetailNutrient, { borderLeftWidth: 1, borderLeftColor: COLORS.border }]}>
                    <Text style={[styles.foodDetailNutrientValue, { color: COLORS.warning }]}>{Math.round(selectedFood.fat * servings)}g</Text>
                    <Text style={styles.foodDetailNutrientLabel}>Fat</Text>
                  </View>
                </View>
              </GlassCard>

              <AnimatedButton
                title="Add Food"
                variant="primary"
                size="large"
                onPress={handleAddFood}
                style={styles.addFoodButton}
                hapticType="heavy"
              />
            </View>
          )}
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: COLORS.background,
    padding: 16,
    paddingTop: 120,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingTop: 110,
    paddingHorizontal: 16,
    paddingBottom: 40,
  },
  // Header
  headerButtons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  scanButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scanButtonOutline: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: `${COLORS.primary}20`,
    justifyContent: 'center',
    alignItems: 'center',
  },
  // Tabs
  tabScroll: {
    marginBottom: 16,
    marginHorizontal: -16,
  },
  tabContainer: {
    paddingHorizontal: 16,
    gap: 8,
  },
  tab: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: COLORS.cardBackground,
    borderRadius: 16,
    gap: 5,
  },
  tabActive: {
    backgroundColor: COLORS.primary,
  },
  tabText: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.textSecondary,
  },
  tabTextActive: {
    color: '#fff',
  },
  // Calorie Card
  calorieCard: {
    marginBottom: 12,
    alignItems: 'center',
    padding: 14,
  },
  calorieHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    width: '100%',
    marginBottom: 12,
  },
  calorieTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
  },
  dateText: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  streakBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: `${COLORS.warning}20`,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
    gap: 3,
  },
  streakEmoji: {
    fontSize: 12,
  },
  streakText: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.warning,
  },
  calorieRing: {
    marginVertical: 12,
  },
  calorieBreakdown: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
  },
  calorieItem: {
    flex: 1,
    alignItems: 'center',
  },
  calorieDivider: {
    width: 1,
    height: 24,
    backgroundColor: COLORS.border,
  },
  calorieLabel: {
    fontSize: 11,
    color: COLORS.textSecondary,
    marginBottom: 2,
  },
  calorieValue: {
    fontSize: 15,
    fontWeight: '600',
    color: COLORS.text,
  },
  // Macro Card
  macroCard: {
    marginBottom: 12,
    padding: 12,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 12,
  },
  macroGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  macroItem: {
    alignItems: 'center',
  },
  macroRemaining: {
    fontSize: 10,
    color: COLORS.textTertiary,
    marginTop: 4,
  },
  // Water Card
  waterCard: {
    marginBottom: 12,
    padding: 12,
  },
  waterHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  waterInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  waterTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.text,
  },
  waterAmount: {
    fontSize: 12,
    color: COLORS.textSecondary,
  },
  waterProgress: {
    height: 6,
    backgroundColor: COLORS.cardBackgroundLight,
    borderRadius: 3,
    overflow: 'hidden',
    marginBottom: 10,
  },
  waterProgressFill: {
    height: '100%',
    backgroundColor: COLORS.info,
    borderRadius: 3,
  },
  waterButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  waterButton: {
    flex: 1,
    backgroundColor: COLORS.cardBackgroundLight,
    paddingVertical: 8,
    borderRadius: 6,
    alignItems: 'center',
  },
  waterButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.info,
  },
  // Meals
  mealCard: {
    marginBottom: 10,
    padding: 12,
  },
  mealHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  mealInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  mealName: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.text,
  },
  mealRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  mealCalories: {
    fontSize: 13,
    color: COLORS.textSecondary,
  },
  mealItems: {
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  foodItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
  },
  foodInfo: {
    flex: 1,
  },
  foodName: {
    fontSize: 13,
    fontWeight: '500',
    color: COLORS.text,
    marginBottom: 1,
  },
  foodServings: {
    fontSize: 11,
    color: COLORS.textTertiary,
  },
  foodNutrients: {
    alignItems: 'flex-end',
  },
  foodCalories: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 1,
  },
  macroMini: {
    flexDirection: 'row',
    gap: 6,
  },
  macroMiniText: {
    fontSize: 10,
    fontWeight: '600',
  },
  deleteButton: {
    marginLeft: 10,
    padding: 3,
  },
  // Nutrients Tab
  nutrientOverview: {
    marginBottom: 12,
    padding: 12,
  },
  nutrientSubtitle: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginTop: -6,
  },
  nutrientCategory: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.textSecondary,
    marginTop: 12,
    marginBottom: 10,
  },
  nutrientRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.cardBackground,
    padding: 12,
    borderRadius: 10,
    marginBottom: 6,
  },
  nutrientRowUnavailable: {
    opacity: 0.6,
  },
  nutrientInfo: {
    flex: 1,
  },
  nutrientName: {
    fontSize: 13,
    fontWeight: '500',
    color: COLORS.text,
    marginBottom: 1,
  },
  nutrientNameUnavailable: {
    color: COLORS.textSecondary,
  },
  nutrientValues: {
    fontSize: 11,
    color: COLORS.textSecondary,
  },
  nutrientBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  nutrientBar: {
    width: 80,
    height: 5,
    backgroundColor: COLORS.cardBackgroundLight,
    borderRadius: 2.5,
    overflow: 'hidden',
  },
  nutrientBarFill: {
    height: '100%',
    borderRadius: 2.5,
  },
  nutrientPercentage: {
    fontSize: 11,
    fontWeight: '600',
    width: 32,
    textAlign: 'right',
  },
  // Trends Tab
  trendCard: {
    marginBottom: 12,
    padding: 12,
  },
  trendSubtitle: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginTop: -6,
    marginBottom: 12,
  },
  trendChart: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    height: 100,
    gap: 6,
    marginBottom: 12,
  },
  trendBarContainer: {
    flex: 1,
    alignItems: 'center',
    height: '100%',
    justifyContent: 'flex-end',
  },
  trendBar: {
    width: '100%',
    backgroundColor: COLORS.primary,
    borderRadius: 3,
    minHeight: 3,
  },
  currentDayIndicator: {
    position: 'absolute',
    top: -3,
    left: '50%',
    marginLeft: -3,
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: COLORS.success,
  },
  trendLabel: {
    fontSize: 10,
    color: COLORS.textTertiary,
    marginTop: 4,
  },
  trendStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  trendStat: {
    alignItems: 'center',
  },
  trendStatLabel: {
    fontSize: 11,
    color: COLORS.textSecondary,
    marginBottom: 2,
  },
  trendStatValue: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
  },
  weightStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 12,
  },
  weightStat: {
    alignItems: 'center',
  },
  weightStatLabel: {
    fontSize: 11,
    color: COLORS.textSecondary,
    marginBottom: 2,
  },
  weightStatValue: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
  },
  trendIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  trendText: {
    fontSize: 13,
    color: COLORS.textSecondary,
  },
  noDataText: {
    fontSize: 13,
    color: COLORS.textTertiary,
    textAlign: 'center',
    padding: 16,
  },
  noHistoryHint: {
    fontSize: 12,
    color: COLORS.textTertiary,
    textAlign: 'center',
    marginTop: 8,
    fontStyle: 'italic',
  },
  biometricHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  biometricTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: COLORS.text,
  },
  weightInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  weightInput: {
    flex: 1,
    backgroundColor: COLORS.cardBackgroundLight,
    borderRadius: 10,
    padding: 12,
    fontSize: 16,
    color: COLORS.text,
  },
  weightUnit: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginLeft: 10,
  },
  logWeightButton: {
    backgroundColor: COLORS.primary,
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginLeft: 10,
  },
  logWeightButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  // Goals Tab
  caloriesSection: {
    gap: 10,
    marginBottom: 12,
  },
  calorieGoalCard: {
    backgroundColor: COLORS.cardBackground,
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  targetCard: {
    borderColor: COLORS.primary,
    borderWidth: 2,
  },
  goalValue: {
    fontSize: 28,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 2,
  },
  targetValue: {
    color: COLORS.primary,
  },
  goalLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.textSecondary,
    marginBottom: 1,
  },
  goalSubtext: {
    fontSize: 11,
    color: COLORS.textTertiary,
  },
  macrosGoalCard: {
    marginBottom: 12,
    padding: 12,
  },
  macroGoalRow: {
    marginBottom: 12,
  },
  macroGoalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  macroGoalName: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.text,
  },
  macroGoalAmount: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  macroGoalBar: {
    height: 5,
    backgroundColor: COLORS.cardBackgroundLight,
    borderRadius: 2.5,
    overflow: 'hidden',
    marginBottom: 4,
  },
  macroGoalBarFill: {
    height: '100%',
  },
  macroGoalCalories: {
    fontSize: 11,
    color: COLORS.textSecondary,
  },
  formulasToggle: {
    padding: 14,
    backgroundColor: COLORS.cardBackground,
    borderRadius: 10,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
    marginBottom: 12,
  },
  formulasToggleText: {
    color: COLORS.primary,
    fontSize: 13,
    fontWeight: '600',
  },
  formulasSection: {
    gap: 8,
  },
  formulaCard: {
    backgroundColor: COLORS.cardBackground,
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  formulaTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.primary,
    marginBottom: 4,
  },
  formulaText: {
    fontSize: 11,
    color: COLORS.textSecondary,
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
    lineHeight: 16,
  },
  bottomPadding: {
    height: 80,
  },
  // Modal
  modalContainer: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    paddingTop: 54,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: COLORS.border,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.cardBackground,
    margin: 16,
    paddingHorizontal: 14,
    borderRadius: 10,
    gap: 10,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 15,
    color: COLORS.text,
  },
  recentSection: {
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  recentTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.textSecondary,
    marginBottom: 8,
  },
  recentChip: {
    backgroundColor: COLORS.cardBackground,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    marginRight: 8,
    maxWidth: 120,
  },
  recentChipText: {
    fontSize: 13,
    fontWeight: '500',
    color: COLORS.text,
    marginBottom: 1,
  },
  recentChipCalories: {
    fontSize: 11,
    color: COLORS.textTertiary,
  },
  foodList: {
    flex: 1,
    paddingHorizontal: 16,
  },
  foodSearchCard: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    padding: 12,
  },
  foodSearchInfo: {
    flex: 1,
  },
  foodSearchName: {
    fontSize: 14,
    fontWeight: '500',
    color: COLORS.text,
    marginBottom: 1,
  },
  foodSearchServing: {
    fontSize: 11,
    color: COLORS.textTertiary,
  },
  foodSearchNutrients: {
    alignItems: 'flex-end',
  },
  foodSearchCalories: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 1,
  },
  foodSearchMacros: {
    flexDirection: 'row',
    gap: 6,
  },
  foodSearchMacro: {
    fontSize: 10,
    fontWeight: '600',
  },
  // Food Detail Modal
  foodDetailContent: {
    padding: 16,
  },
  foodDetailCard: {
    marginBottom: 20,
    padding: 14,
  },
  foodDetailName: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 2,
  },
  foodDetailServing: {
    fontSize: 13,
    color: COLORS.textSecondary,
    marginBottom: 16,
  },
  servingsControl: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  servingsLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.text,
  },
  servingsButtons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  servingButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.cardBackgroundLight,
    justifyContent: 'center',
    alignItems: 'center',
  },
  servingsValue: {
    fontSize: 22,
    fontWeight: '700',
    color: COLORS.text,
    minWidth: 44,
    textAlign: 'center',
  },
  foodDetailNutrients: {
    flexDirection: 'row',
  },
  foodDetailNutrient: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 10,
  },
  foodDetailNutrientValue: {
    fontSize: 20,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: 2,
  },
  foodDetailNutrientLabel: {
    fontSize: 11,
    color: COLORS.textSecondary,
  },
  addFoodButton: {
    marginTop: 'auto',
  },
});
