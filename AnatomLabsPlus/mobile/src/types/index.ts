// User & Authentication Types
export interface User {
  id: string;
  email: string;
  name: string;
  age: number;
  gender: 'male' | 'female';
  weight: number; // kg
  height: number; // cm
  goal: 'muscle_gain' | 'fat_loss' | 'body_recomposition' | 'general_fitness' | 'endurance' | 'sport_specific' | 'maintenance' | 'strength' | string;
  experienceLevel: 'beginner' | 'intermediate' | 'advanced';
  activityLevel: 'sedentary' | 'light' | 'moderate' | 'active' | 'very_active';
  bmi?: number;
  bmiCategory?: string;
  healthConditions?: string[];
  physicalLimitations?: string[];
  foodAllergies?: string[];
  dietaryPreferences?: string[];
  healthProfileComplete?: boolean;
  isAdmin?: boolean;
  isCoach?: boolean;
  avatar?: string;
  createdAt: string;
  updatedAt: string;
}

// BMI Types
export interface BMIResult {
  bmi: number;
  category: string;
  categoryId: string;
  healthRisk: string;
  color: string;
  idealWeightRange: { min: number; max: number; message?: string };
  weightToIdeal: number;
  recommendation: string;
}

// Health Profile Types
export interface HealthConditionOption {
  id: string;
  name: string;
  description: string;
  severity?: string;
}

export interface HealthConditionsResponse {
  physicalLimitations: HealthConditionOption[];
  medicalConditions: HealthConditionOption[];
  foodAllergies: HealthConditionOption[];
  dietaryPreferences: HealthConditionOption[];
}

export interface HealthProfile {
  healthConditions: string[];
  physicalLimitations: string[];
  foodAllergies: string[];
  dietaryPreferences: string[];
  healthProfileComplete: boolean;
  bmi?: number;
  bmiCategory?: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData extends LoginCredentials {
  name: string;
  age: number;
  gender: 'male' | 'female';
  weight: number;
  height: number;
  goal: string;
  experienceLevel: string;
  activityLevel: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

// Body Parts & Anatomy Types
export interface BodyPart {
  id: string;
  name: string;
  type: 'muscle' | 'organ' | 'bone';
  layer: number; // 1=surface, 2=middle, 3=deep
  position_x: number;
  position_y: number;
  position_z: number;
  educational_info: EducationalInfo;
  muscles?: Muscle[];
}

export interface Muscle {
  id: string;
  name: string;
  bodyPartId: string;
  scientificName: string;
  function: string;
  recoveryTime: number; // hours
  exercises?: Exercise[];
}

export interface EducationalInfo {
  whatItIs: string;
  whatItDoes: string;
  whyItMatters: string;
  howItWorks: string;
}

// Exercise Types
export interface Exercise {
  id: string;
  name: string;
  primaryMuscles: string[];
  secondaryMuscles: string[];
  equipment: string[];
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  instructions: string[];
  biomechanics: string;
  commonMistakes: string[];
  safetyTips: string[];
  activationRating: number; // 0-100
}

export interface ExerciseInWorkout extends Exercise {
  sets: number;
  reps: string;
  rest: number; // seconds
  notes?: string;
}

// Workout Types
export interface WorkoutPlan {
  id: string;
  userId: string;
  name: string;
  goal: string;
  experienceLevel: string;
  frequency: number; // days per week
  split: string;
  workouts: WorkoutDay[];
  createdAt: string;
}

export interface WorkoutDay {
  day: number;
  name: string;
  focus: string[];
  exercises: ExerciseInWorkout[];
  totalVolume: number; // sets
  estimatedDuration: number; // minutes
}

export interface GenerateWorkoutRequest {
  goal: 'muscle_gain' | 'fat_loss' | 'body_recomposition' | 'strength' | 'endurance' | 'sport_specific';
  experienceLevel: 'beginner' | 'intermediate' | 'advanced';
  frequency: number; // 2-6 days per week
  availableEquipment: string[];
  sport?: string; // for sport-specific
  injuries?: string[];
}

// Nutrition Types
export interface NutritionPlan {
  id?: string;
  userId?: string;
  bmr: number;
  tdee: number;
  targetCalories: number;
  macros: MacroTargets;
  goal?: string;
  activityLevel?: string;
  calculation?: NutritionCalculation;
  explanation?: NutritionExplanation;
  createdAt?: string;
}

export interface NutritionExplanation {
  bmrFormula: string;
  tdeeCalculation: string;
  calorieAdjustment: string;
  macroRationale: string;
}

export interface MacroTargets {
  protein: number; // grams
  carbs: number;
  fat: number;
  proteinCalories?: number;
  carbsCalories?: number;
  fatCalories?: number;
  proteinPercentage?: number;
  carbsPercentage?: number;
  fatPercentage?: number;
}

export interface NutritionCalculation {
  bmrFormula: string;
  tdeeFormula: string;
  proteinFormula: string;
  fatFormula: string;
  carbsFormula: string;
}

export interface Food {
  id: string;
  name: string;
  servingSize: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber?: number;
  sugar?: number;
  sodium?: number;
}

export interface FoodLog {
  id: string;
  userId: string;
  foodId: string;
  food: Food;
  servings: number;
  mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  date: string;
  totalCalories?: number;
  totalProtein?: number;
  totalCarbs?: number;
  totalFat?: number;
}

// Nutrition Tracking Types
export interface DailyNutritionSummary {
  date: string;
  meals: {
    breakfast: FoodLog[];
    lunch: FoodLog[];
    dinner: FoodLog[];
    snack: FoodLog[];
  };
  totals: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
  };
  remaining: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
  } | null;
  logCount: number;
}

export interface WeightLog {
  id: string;
  userId: string;
  weight: number;
  date: string;
  note?: string;
}

export interface WeightTrend {
  current: number | null;
  average7Day: number | null;
  average30Day: number | null;
  trend: 'up' | 'down' | 'stable' | 'insufficient_data';
  change: number | null;
}

export interface UserStreak {
  currentStreak: number;
  longestStreak: number;
  totalDaysLogged: number;
  lastLoggedDate: string | null;
}

export interface StreakUpdate extends UserStreak {
  badge?: string;
}

export interface FoodSuggestion {
  id: string;
  name: string;
  category: string | null;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  servingSize: number;
  servingUnit: string;
  score: number;
  reason: string;
}

export interface SuggestionsResponse {
  remaining: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
  };
  suggestions: FoodSuggestion[];
}

export interface RecentFoodsResponse {
  recent: (Food & { lastLogged: string; defaultServings: number })[];
  frequent: (Food & { logCount: number })[];
}

export interface MealPresetItem {
  id: string;
  mealPresetId: string;
  foodId: string;
  servings: number;
  food: Food;
}

export interface MealPreset {
  id: string;
  userId: string;
  name: string;
  createdAt: string;
  items: MealPresetItem[];
}

// Activity & Tracking Types
export interface ActivityLog {
  id: string;
  userId: string;
  date: string;
  steps: number;
  caloriesBurned: number;
  waterIntake: number; // ml
  sleepHours: number;
}

// Injury Prevention Types
export interface InjuryRisk {
  muscle: Muscle;
  riskLevel: 'low' | 'moderate' | 'high' | 'very_high';
  usageCount: number;
  lastTrained: string;
  hoursSinceTraining: number;
  recommendations: string[];
}

export interface InjuryReport {
  overallRisk: 'low' | 'moderate' | 'high' | 'very_high';
  musclesAtRisk: InjuryRisk[];
  recommendations: string[];
  needsRestDay: boolean;
}

// Reports Types
export interface DailyReport {
  date: string;
  nutrition: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
    targetCalories: number;
    targetProtein: number;
    targetCarbs: number;
    targetFat: number;
    adherence: number; // 0-100%
  };
  activity: {
    steps: number;
    caloriesBurned: number;
    waterIntake: number;
    sleepHours: number;
  };
  training: {
    workoutsCompleted: number;
    totalVolume: number;
    totalWeight: number;
    totalReps: number;
    musclesTrained: string[];
    sessions: Array<{
      name: string;
      duration: number;
      totalVolume: number;
      totalSets: number;
      totalReps: number;
      musclesWorked: string[];
    }>;
  };
  injuryRisk: InjuryReport;
}

export interface WeeklyReport extends DailyReport {
  weekStart: string;
  weekEnd: string;
  averageAdherence: number;
  totalWorkouts: number;
  progressIndicators: {
    weightChange?: number;
    strengthGains?: number;
    volumeIncrease?: number;
  };
}

// ============================================
// WORKOUT TRACKING TYPES (Tracked-style)
// ============================================

export interface WorkoutSet {
  id: string;
  setNumber: number;
  weight: number; // kg
  reps: number;
  rpe?: number; // Rate of Perceived Exertion 1-10
  isWarmup: boolean;
  isDropSet: boolean;
  isFailure: boolean;
  restTime?: number; // seconds
  notes?: string;
  completedAt?: string;
}

export interface WorkoutExerciseLog {
  id: string;
  exerciseId: string;
  exerciseName: string;
  muscleGroup: string;
  sets: WorkoutSet[];
  notes?: string;
  supersetWith?: string; // exercise id
  orderIndex: number;
}

export interface ActiveWorkout {
  id: string;
  userId: string;
  name: string;
  startedAt: string;
  exercises: WorkoutExerciseLog[];
  notes?: string;
  templateId?: string;
}

export interface CompletedWorkout extends ActiveWorkout {
  completedAt: string;
  duration: number; // minutes
  totalVolume: number; // total kg lifted (weight * reps)
  totalSets: number; // total kg lifted (weight * reps)
  totalReps: number;
  musclesWorked: string[];
  personalRecords?: PersonalRecord[];
}

export interface PersonalRecord {
  id: string;
  exerciseId: string;
  exerciseName: string;
  type: 'weight' | 'reps' | 'volume' | 'one_rep_max';
  value: number;
  previousValue?: number;
  achievedAt: string;
  workoutId: string;
}

export interface ExerciseHistory {
  exerciseId: string;
  exerciseName: string;
  sessions: {
    date: string;
    workoutId: string;
    sets: WorkoutSet[];
    totalVolume: number;
    maxWeight: number;
    maxReps: number;
    estimatedOneRepMax: number;
  }[];
  personalRecords: {
    maxWeight: number;
    maxReps: number;
    maxVolume: number;
    estimatedOneRepMax: number;
  };
  progression: {
    volumeTrend: 'increasing' | 'stable' | 'decreasing';
    strengthTrend: 'increasing' | 'stable' | 'decreasing';
  };
}

export interface WorkoutTemplate {
  id: string;
  userId: string;
  name: string;
  exercises: {
    exerciseId: string;
    exerciseName: string;
    muscleGroup: string;
    targetSets: number;
    targetReps: string; // e.g., "8-12"
    restTime: number;
    notes?: string;
  }[];
  estimatedDuration: number;
  muscleGroups: string[];
  lastUsed?: string;
  useCount: number;
}

export interface WorkoutStats {
  totalWorkouts: number;
  totalVolume: number;
  totalTime: number; // minutes
  averageWorkoutDuration: number;
  workoutsThisWeek: number;
  workoutsThisMonth: number;
  currentStreak: number;
  longestStreak: number;
  favoriteExercises: { exerciseId: string; name: string; count: number }[];
  muscleGroupDistribution: { muscle: string; percentage: number }[];
}

// ============================================
// ENHANCED NUTRITION TYPES (Cronometer-style)
// ============================================

export interface Micronutrients {
  // Vitamins (in mg unless specified)
  vitaminA?: number; // mcg
  vitaminC?: number;
  vitaminD?: number; // mcg
  vitaminE?: number;
  vitaminK?: number; // mcg
  vitaminB1?: number; // Thiamin
  vitaminB2?: number; // Riboflavin
  vitaminB3?: number; // Niacin
  vitaminB5?: number; // Pantothenic Acid
  vitaminB6?: number;
  vitaminB7?: number; // mcg Biotin
  vitaminB9?: number; // mcg Folate
  vitaminB12?: number; // mcg

  // Minerals (in mg unless specified)
  calcium?: number;
  iron?: number;
  magnesium?: number;
  phosphorus?: number;
  potassium?: number;
  sodium?: number;
  zinc?: number;
  copper?: number;
  manganese?: number;
  selenium?: number; // mcg
  chromium?: number; // mcg
  molybdenum?: number; // mcg
  iodine?: number; // mcg

  // Other
  cholesterol?: number;
  omega3?: number;
  omega6?: number;
  transFat?: number;
  saturatedFat?: number;
  monounsaturatedFat?: number;
  polyunsaturatedFat?: number;
}

export interface DetailedFood extends Food {
  brand?: string;
  category?: string;
  barcode?: string;
  micronutrients?: Micronutrients;
  servingSizeGrams?: number;
  alternateServings?: {
    name: string;
    grams: number;
    calories: number;
  }[];
  isVerified?: boolean;
  source?: 'usda' | 'user' | 'community';
}

export interface DetailedFoodLog extends FoodLog {
  food: DetailedFood;
  timestamp?: string;
  micronutrients?: Micronutrients;
}

export interface NutrientTarget {
  name: string;
  key: string;
  current: number;
  target: number;
  unit: string;
  category: 'macro' | 'vitamin' | 'mineral' | 'other';
  color?: string;
}

export interface DailyNutrientSummary {
  date: string;
  macros: {
    calories: { consumed: number; target: number; remaining: number };
    protein: { consumed: number; target: number; remaining: number };
    carbs: { consumed: number; target: number; remaining: number };
    fat: { consumed: number; target: number; remaining: number };
    fiber: { consumed: number; target: number; remaining: number };
    sugar: { consumed: number; target: number };
  };
  micronutrients: {
    [key: string]: { consumed: number; target: number; percentage: number };
  };
  waterIntake: number; // ml
  caloriesBurned: number;
  netCalories: number;
}

export interface BiometricLog {
  id: string;
  userId: string;
  date: string;
  type: 'weight' | 'body_fat' | 'blood_pressure' | 'blood_glucose' | 'heart_rate' | 'waist' | 'chest' | 'arms' | 'thighs';
  value: number;
  value2?: number; // for blood pressure (systolic/diastolic)
  unit: string;
  notes?: string;
}

export interface NutrientGoals {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
  sugar: number;
  sodium: number;
  water: number; // ml
  micronutrients: {
    [key: string]: number;
  };
}

export interface MealPlanDay {
  date: string;
  meals: {
    breakfast: DetailedFood[];
    lunch: DetailedFood[];
    dinner: DetailedFood[];
    snacks: DetailedFood[];
  };
  totalCalories: number;
  totalMacros: {
    protein: number;
    carbs: number;
    fat: number;
  };
}

export interface NutritionReport {
  period: 'day' | 'week' | 'month';
  startDate: string;
  endDate: string;
  averages: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
  };
  adherenceScore: number; // 0-100
  topFoods: { food: Food; count: number; totalCalories: number }[];
  macroDistribution: {
    protein: number; // percentage
    carbs: number;
    fat: number;
  };
  trends: {
    caloriesTrend: number[]; // daily values
    weightTrend?: number[];
  };
  insights: string[];
}

// ============================================
// REPORTS ANALYTICS TYPES
// ============================================

export type ReportSegment = 'overview' | 'trends' | 'training' | 'health' | 'insights' | 'share';
export type DateRangeMode = 'day' | 'week' | 'month';
export type TrendMetric = 'weight' | 'calories' | 'protein' | 'volume' | 'steps';

export interface ChartDataPoint {
  date: string;
  value: number;
  label?: string;
}

export interface TrendData {
  metric: TrendMetric;
  data: ChartDataPoint[];
  average: number;
  min: number;
  max: number;
  change: number;
  changePercent: number;
  trend: 'up' | 'down' | 'stable';
}

export interface AnalyticsSummary {
  period: DateRangeMode;
  startDate: string;
  endDate: string;
  nutrition: {
    avgCalories: number;
    avgProtein: number;
    avgCarbs: number;
    avgFat: number;
    adherenceScore: number;
    daysTracked: number;
  };
  activity: {
    avgSteps: number;
    avgCaloriesBurned: number;
    avgWaterIntake: number;
    avgSleepHours: number;
    totalActiveDays: number;
  };
  training: {
    totalWorkouts: number;
    totalVolume: number;
    avgDuration: number;
    muscleGroupDistribution: { muscle: string; sets: number; percentage: number }[];
  };
}

export interface PeriodComparison {
  period1: AnalyticsSummary;
  period2: AnalyticsSummary;
  changes: {
    calories: number;
    protein: number;
    steps: number;
    workouts: number;
    volume: number;
    sleepHours: number;
  };
}

export interface VolumeByMuscle {
  muscle: string;
  totalSets: number;
  totalVolume: number;
  sessions: number;
  lastTrained: string;
  percentage: number;
}

export interface ExerciseProgression {
  exerciseName: string;
  dataPoints: {
    date: string;
    maxWeight: number;
    maxReps: number;
    totalVolume: number;
    estimatedOneRepMax: number;
  }[];
  personalBest: {
    weight: number;
    reps: number;
    volume: number;
    oneRepMax: number;
  };
  trend: 'up' | 'down' | 'stable';
}

export interface BiomarkerEntry {
  id: string;
  type: string;
  value: number;
  value2?: number;
  unit: string;
  date: string;
  notes?: string;
  source?: string;
}

export interface HealthSummary {
  latestBiomarkers: {
    weight?: BiomarkerEntry;
    bodyFat?: BiomarkerEntry;
    bloodPressure?: BiomarkerEntry;
    bloodGlucose?: BiomarkerEntry;
    heartRate?: BiomarkerEntry;
    waist?: BiomarkerEntry;
  };
  healthConditions: string[];
  trends: {
    weight: TrendData | null;
    bodyFat: TrendData | null;
  };
}

export interface InsightItem {
  id: string;
  type: 'pattern' | 'prediction' | 'correlation';
  title: string;
  description: string;
  confidence: number;
  icon: string;
  color: string;
  data?: any;
  createdAt: string;
}

export interface ShareableReport {
  id: string;
  title: string;
  period: string;
  startDate: string;
  endDate: string;
  sections: string[];
  content: any;
  shareToken?: string;
  shareUrl?: string;
  expiresAt?: string;
  createdAt: string;
}

export interface TrainingHeatmapDay {
  date: string;
  intensity: number;
  workouts: number;
}

// ============================================
// COACH MARKETPLACE TYPES
// ============================================

export interface CoachStory {
  id: string;
  type: 'workout' | 'tip' | 'transformation' | 'motivation' | 'nutrition';
  title: string;
  description: string;
  timestamp: string;
}

export interface CoachPost {
  id: string;
  type: 'photo' | 'video' | 'carousel';
  caption: string;
  imageUrl: string;
  likes: number;
  comments: number;
  shares?: number;
  isLiked?: boolean;
  recentComments?: Array<{
    id: string;
    userId: string;
    userName: string;
    content: string;
    timestamp: string;
  }>;
  timestamp: string;
}

export interface Coach {
  id: string;
  userId?: string;
  name: string;
  avatar?: string;
  specialty: string[];
  rating: number;
  reviewCount: number;
  price: string;
  bio: string;
  experience: number;
  certifications: string[];
  clientCount: number;
  verified: boolean;
  email?: string;
  phone?: string;
  availability?: string[];
  stories?: CoachStory[];
  posts?: CoachPost[];
  followerCount?: number;
  followingCount?: number;
  isFollowing?: boolean;
}

export interface CoachApplication {
  id: string;
  userId: string;
  specialty: string[];
  experience: number;
  bio: string;
  certificationPdfPath?: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  reviewNote?: string;
  createdAt: string;
}

export interface Booking {
  id: string;
  clientId: string;
  coachId: string;
  date: string;
  timeSlot: string;
  goal?: string;
  status: 'PENDING' | 'CONFIRMED' | 'CANCELLED' | 'COMPLETED';
  price?: number;
  coach?: { id: string; name: string };
  client?: { id: string; name: string };
  createdAt: string;
}

export interface Conversation {
  id: string;
  participants: { id: string; name: string; avatar?: string }[];
  lastMessage?: {
    id: string;
    content: string;
    senderId: string;
    createdAt: string;
  };
  unreadCount: number;
  updatedAt: string;
}

export interface ChatMessage {
  id: string;
  conversationId: string;
  senderId: string;
  content: string;
  sender?: { id: string; name: string; avatar?: string };
  createdAt: string;
}

// ============================================
// ADMIN DASHBOARD TYPES
// ============================================

export interface AdminStats {
  totalUsers: number;
  activeUsers: number;
  newUsersThisWeek: number;
  totalCoaches: number;
  bannedUsers: number;
  totalBookings: number;
  pendingApplications: number;
  totalWorkoutSessions: number;
  totalFoods: number;
  totalExercises: number;
}

export interface AdminUser {
  id: string;
  email: string;
  name: string;
  isAdmin: boolean;
  isCoach: boolean;
  isBanned: boolean;
  goal?: string | null;
  experienceLevel?: string | null;
  createdAt: string;
  _count: {
    workoutSessions: number;
    nutritionLogs: number;
  };
}

export interface AdminUserDetail extends AdminUser {
  age: number | null;
  gender: string | null;
  weight: number | null;
  height: number | null;
  goal: string | null;
  experienceLevel: string | null;
  activityLevel: string | null;
  healthConditions: string[];
  physicalLimitations: string[];
  foodAllergies: string[];
  dietaryPreferences: string[];
  coachProfile: any | null;
  coachApplication: any | null;
  _count: {
    workoutSessions: number;
    nutritionLogs: number;
    activityLogs: number;
    bookingsAsClient: number;
  };
}

export interface AdminUserListResponse {
  users: AdminUser[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface AdminCoachApplication {
  id: string;
  userId: string;
  specialty: string[];
  experience: number;
  bio: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  reviewNote: string | null;
  createdAt: string;
  user: {
    id: string;
    name: string;
    email: string;
  };
}

export type AdminSegment = 'overview' | 'analytics' | 'users' | 'applications' | 'engagement';

export interface AdminAnalytics {
  userGrowth: Array<{ date: string; count: number }>;
  dailyActiveUsers: Array<{ date: string; count: number }>;
  workoutSessionsPerDay: Array<{ date: string; count: number }>;
  nutritionLogsPerDay: Array<{ date: string; count: number }>;
  revenue: Array<{ date: string; amount: number }>;
  totalRevenue: number;
  featureAdoption: {
    workouts: { users: number; percentage: number };
    nutrition: { users: number; percentage: number };
    activity: { users: number; percentage: number };
    coaching: { users: number; percentage: number };
  };
}

export interface AdminDemographics {
  goalDistribution: Array<{ label: string; value: number }>;
  experienceLevels: Array<{ label: string; value: number }>;
  genderSplit: Array<{ label: string; value: number }>;
  activityLevels: Array<{ label: string; value: number }>;
  healthConditions: Array<{ label: string; value: number }>;
  ageRanges: Array<{ label: string; value: number }>;
}

export interface AdminEngagement {
  retention: {
    days7: { active: number; total: number; percentage: number };
    days30: { active: number; total: number; percentage: number };
    days90: { active: number; total: number; percentage: number };
  };
  avgWorkoutsPerUserPerWeek: number;
  avgNutritionLogsPerUserPerDay: number;
  topExercises: Array<{ label: string; value: number }>;
  topFoods: Array<{ label: string; value: number }>;
  platformHeatmap: Array<{ date: string; value: number }>;
}

// ============================================
// API Response Types
// ============================================

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export interface ApiError {
  success: false;
  error: string;
  message: string;
  statusCode: number;
}
