import axios, { AxiosInstance, AxiosError } from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  User,
  LoginCredentials,
  RegisterData,
  AuthResponse,
  BodyPart,
  Exercise,
  WorkoutPlan,
  GenerateWorkoutRequest,
  NutritionPlan,
  DailyReport,
  WeeklyReport,
  ActivityLog,
  ApiResponse,
  ApiError,
  Food,
  FoodLog,
  DailyNutritionSummary,
  WeightLog,
  WeightTrend,
  UserStreak,
  StreakUpdate,
  SuggestionsResponse,
  RecentFoodsResponse,
  MealPreset,
  BMIResult,
  HealthConditionsResponse,
  HealthProfile,
  TrendData,
  TrendMetric,
  AnalyticsSummary,
  PeriodComparison,
  VolumeByMuscle,
  ExerciseProgression,
  BiomarkerEntry,
  HealthSummary,
  InsightItem,
  ShareableReport,
  TrainingHeatmapDay,
} from '../types';

import { Platform } from 'react-native';
import Constants from 'expo-constants';

const PRODUCTION_API_URL = 'https://anatomlabs-production.up.railway.app/api';

const getApiUrl = () => {
  if (__DEV__) {
    const debuggerHost = Constants.expoConfig?.hostUri || Constants.manifest?.debuggerHost;
    if (debuggerHost) {
      const host = debuggerHost.split(':')[0];
      return `http://${host}:3001/api`;
    }
    return 'http://localhost:3001/api';
  }
  return PRODUCTION_API_URL;
};

const API_BASE_URL = getApiUrl();

// Callback for when auth fails - will be set by AuthContext
let onAuthFailure: (() => void) | null = null;

export const setAuthFailureCallback = (callback: () => void) => {
  onAuthFailure = callback;
};

class ApiService {
  private api: AxiosInstance;

  constructor() {
    this.api = axios.create({
      baseURL: API_BASE_URL,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Add auth token to requests
    this.api.interceptors.request.use(
      async (config) => {
        const token = await AsyncStorage.getItem('auth_token');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Handle response errors
    this.api.interceptors.response.use(
      (response) => response,
      async (error: AxiosError) => {
        if (error.response?.status === 401) {
          // Clear token on unauthorized
          await AsyncStorage.removeItem('auth_token');
          await AsyncStorage.removeItem('user_data');
          // Trigger logout in AuthContext
          if (onAuthFailure) {
            onAuthFailure();
          }
        }
        return Promise.reject(this.handleError(error));
      }
    );
  }

  private handleError(error: AxiosError): ApiError {
    if (error.response) {
      const status = error.response.status;
      const serverMessage = (error.response.data as any)?.message || (error.response.data as any)?.error;

      // User-friendly messages based on status code
      let friendlyMessage: string;

      switch (status) {
        case 400:
          friendlyMessage = serverMessage || 'There was a problem with your request. Please check your input and try again.';
          break;
        case 401:
          friendlyMessage = 'Your session has expired. Please log in again for security reasons.';
          break;
        case 403:
          friendlyMessage = 'Sorry, you do not have permission to access this. Please contact support if you believe this is an error.';
          break;
        case 404:
          friendlyMessage = serverMessage || 'We could not find the information you were looking for. It might have been moved or deleted.';
          break;
        case 405:
          friendlyMessage = 'The action you are trying to do is not allowed.';
          break;
        case 409:
          friendlyMessage = serverMessage || 'It seems this item already exists. Please try a different name or option.';
          break;
        case 422:
          friendlyMessage = serverMessage || 'The data you provided could not be processed. Please check for errors and try again.';
          break;
        case 429:
          friendlyMessage = 'You are making too many requests. Please wait a moment before trying again.';
          break;
        case 500:
          friendlyMessage = 'A server error occurred. We are working on fixing it. Please try again later.';
          break;
        case 502:
        case 503:
        case 504:
          friendlyMessage = 'We are having trouble connecting to our servers. This is a temporary issue, please try again in a few moments.';
          break;
        default:
          friendlyMessage = serverMessage || `An unexpected error occurred (Code: ${status}). Please try again.`;
      }

      return {
        success: false,
        error: friendlyMessage,
        message: friendlyMessage,
        statusCode: status,
      };
    } else if (error.request) {
      // Network error - no response received
      let networkMessage = 'Unable to connect. Please check your internet connection.';

      if (error.code === 'ECONNABORTED') {
        networkMessage = 'Request timed out. Please check your connection and try again.';
      } else if (error.code === 'ERR_NETWORK') {
        networkMessage = 'Network error. Make sure you\'re connected to the internet.';
      }

      return {
        success: false,
        error: networkMessage,
        message: networkMessage,
        statusCode: 0,
      };
    }

    // Unknown error
    return {
      success: false,
      error: 'Something unexpected happened. Please try again.',
      message: 'Something unexpected happened. Please try again.',
      statusCode: 0,
    };
  }

  // Authentication
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const response = await this.api.post('/auth/login', credentials);
    // Backend returns { message, user, token } directly (not wrapped in data)
    const { token, user } = response.data;
    await AsyncStorage.setItem('auth_token', token);
    await AsyncStorage.setItem('user_data', JSON.stringify(user));
    return { token, user };
  }

  async register(data: RegisterData): Promise<AuthResponse> {
    const response = await this.api.post('/auth/register', data);
    // Backend returns { message, user, token } directly (not wrapped in data)
    const { token, user } = response.data;
    await AsyncStorage.setItem('auth_token', token);
    await AsyncStorage.setItem('user_data', JSON.stringify(user));
    return { token, user };
  }

  async logout(): Promise<void> {
    await AsyncStorage.removeItem('auth_token');
    await AsyncStorage.removeItem('user_data');
  }

  async getCurrentUser(): Promise<User | null> {
    try {
      // First try to fetch from the server to validate the token
      const response = await this.api.get('/users/me');
      const user = response.data;
      // Update cached user data
      if (user) {
        await AsyncStorage.setItem('user_data', JSON.stringify(user));
      }
      return user;
    } catch (error) {
      // If server request fails, fall back to cached data
      // (but the 401 interceptor will handle logout if needed)
      try {
        const userData = await AsyncStorage.getItem('user_data');
        return userData ? JSON.parse(userData) : null;
      } catch {
        return null;
      }
    }
  }

  async isAuthenticated(): Promise<boolean> {
    const token = await AsyncStorage.getItem('auth_token');
    // Explicitly return boolean (not string) for Fabric compatibility
    return token !== null && token !== undefined && token !== '';
  }

  // Body Parts & Anatomy
  async getBodyParts(layer?: number): Promise<BodyPart[]> {
    const params = layer ? { layer } : {};
    const response = await this.api.get<ApiResponse<BodyPart[]>>('/body-parts', {
      params,
    });
    return response.data.data;
  }

  async getBodyPart(id: string): Promise<BodyPart> {
    const response = await this.api.get<ApiResponse<BodyPart>>(`/body-parts/${id}`);
    return response.data.data;
  }

  async getMuscles(): Promise<any[]> {
    const response = await this.api.get<ApiResponse<any[]>>('/body-parts');
    return response.data.data;
  }

  async getMuscle(id: string): Promise<any> {
    const response = await this.api.get<ApiResponse<any>>(`/body-parts/${id}`);
    return response.data.data;
  }

  // Exercises
  async getExercises(muscleId?: string): Promise<Exercise[]> {
    const url = muscleId
      ? `/exercises/for-muscle/${muscleId}`
      : '/exercises';
    const response = await this.api.get<ApiResponse<Exercise[]>>(url);
    return response.data.data;
  }

  async getExercise(id: string): Promise<Exercise> {
    const response = await this.api.get<ApiResponse<Exercise>>(`/exercises/${id}`);
    return response.data.data;
  }

  // Workouts
  async generateWorkout(request: GenerateWorkoutRequest): Promise<WorkoutPlan> {
    // Backend expects daysPerWeek, not frequency
    const backendRequest = {
      goal: request.goal,
      experienceLevel: request.experienceLevel,
      daysPerWeek: request.frequency,
      sport: request.sport,
    };
    const response = await this.api.post('/workouts/generate', backendRequest);
    // Backend returns { message, plan } directly
    return response.data.plan;
  }

  async getWorkoutPlans(): Promise<WorkoutPlan[]> {
    const response = await this.api.get('/workouts/plans');
    return response.data || [];
  }

  async getWorkoutPlan(id: string): Promise<WorkoutPlan> {
    const response = await this.api.get(`/workouts/plans/${id}`);
    return response.data;
  }

  async logWorkout(workoutId: string, exercises: any[]): Promise<void> {
    await this.api.post('/workouts/log', {
      workoutId,
      exercises,
      date: new Date().toISOString(),
    });
  }

  // Workout Sessions - Save completed workout to server
  async saveWorkoutSession(sessionData: {
    name: string;
    startedAt: string;
    completedAt: string;
    duration: number;
    notes?: string;
    totalVolume: number;
    totalSets: number;
    totalReps: number;
    musclesWorked: string[];
    exercises: Array<{
      exerciseName: string;
      muscleGroup: string;
      sets: any[];
      totalVolume: number;
      maxWeight: number;
      maxReps: number;
    }>;
    workoutPlanId?: string;
  }): Promise<any> {
    const response = await this.api.post('/workouts/sessions', sessionData);
    return response.data.session;
  }

  // Get workout session history from server
  async getWorkoutSessions(limit?: number, offset?: number): Promise<any[]> {
    const params: any = {};
    if (limit) params.limit = limit;
    if (offset) params.offset = offset;
    const response = await this.api.get('/workouts/sessions', { params });
    return response.data;
  }

  // Get recent workout names for quick start suggestions
  async getRecentWorkoutNames(limit?: number): Promise<string[]> {
    const params = limit ? { limit } : {};
    const response = await this.api.get<{ names: string[] }>('/workouts/sessions/recent-names', { params });
    return response.data.names;
  }

  // Get single workout session by ID
  async getWorkoutSession(sessionId: string): Promise<any> {
    const response = await this.api.get(`/workouts/sessions/${sessionId}`);
    return response.data;
  }

  // Nutrition
  async calculateNutrition(): Promise<NutritionPlan> {
    const response = await this.api.post('/nutrition/calculate');
    // Backend returns the plan directly
    return response.data;
  }

  async getNutritionPlan(): Promise<NutritionPlan> {
    // Backend doesn't have a GET /nutrition endpoint, so we calculate
    const response = await this.api.post('/nutrition/calculate');
    return response.data;
  }

  async logFood(foodData: {
    foodId: string;
    servings: number;
    mealType: string;
  }): Promise<void> {
    await this.api.post('/nutrition/log', {
      ...foodData,
      date: new Date().toISOString(),
    });
  }

  async searchFood(query: string): Promise<Food[]> {
    const response = await this.api.get<Food[]>('/nutrition/foods', {
      params: { search: query },
    });
    return response.data;
  }

  async getFoods(category?: string): Promise<Food[]> {
    const params = category ? { category } : {};
    const response = await this.api.get<Food[]>('/nutrition/foods', { params });
    return response.data;
  }

  async getTodayLogs(): Promise<DailyNutritionSummary> {
    const response = await this.api.get<DailyNutritionSummary>('/nutrition/logs/today');
    return response.data;
  }

  // Get nutrition logs for a specific date (YYYY-MM-DD format)
  async getLogsByDate(date: string): Promise<DailyNutritionSummary> {
    const response = await this.api.get<DailyNutritionSummary>('/nutrition/logs/today', {
      params: { date }
    });
    return response.data;
  }

  // Get calorie history for last N days (for trends chart)
  async getCalorieHistory(days?: number): Promise<{
    history: Array<{ date: string; calories: number; dayOfWeek: string }>;
    stats: { average: number; target: number; adherence: number; daysTracked: number; totalDays: number };
  }> {
    const params = days ? { days } : {};
    const response = await this.api.get('/nutrition/logs/history', { params });
    return response.data;
  }

  async updateFoodLog(logId: string, data: { servings?: number; mealType?: string }): Promise<FoodLog> {
    const response = await this.api.put<{ message: string; log: FoodLog }>(`/nutrition/logs/${logId}`, data);
    return response.data.log;
  }

  async deleteFoodLog(logId: string): Promise<void> {
    await this.api.delete(`/nutrition/logs/${logId}`);
  }

  async logWeight(weight: number, note?: string): Promise<WeightLog> {
    const response = await this.api.post<{ message: string; weightLog: WeightLog }>('/nutrition/weight', {
      weight,
      note,
    });
    return response.data.weightLog;
  }

  async getWeightHistory(days?: number): Promise<WeightLog[]> {
    const params = days ? { days } : {};
    const response = await this.api.get<WeightLog[]>('/nutrition/weight', { params });
    return response.data;
  }

  async getWeightTrend(days?: number): Promise<WeightTrend> {
    const params = days ? { days } : {};
    const response = await this.api.get<WeightTrend>('/nutrition/weight/trend', { params });
    return response.data;
  }

  async getSuggestions(): Promise<SuggestionsResponse> {
    const response = await this.api.get<SuggestionsResponse>('/nutrition/suggestions');
    return response.data;
  }

  async getRecentFoods(limit?: number): Promise<RecentFoodsResponse> {
    const params = limit ? { limit } : {};
    const response = await this.api.get<RecentFoodsResponse>('/nutrition/recent', { params });
    return response.data;
  }

  async getStreak(): Promise<UserStreak> {
    const response = await this.api.get<UserStreak>('/nutrition/streak');
    return response.data;
  }

  async getMealPresets(): Promise<MealPreset[]> {
    const response = await this.api.get<MealPreset[]>('/nutrition/presets');
    return response.data;
  }

  async createMealPreset(name: string, items: { foodId: string; servings: number }[]): Promise<MealPreset> {
    const response = await this.api.post<{ message: string; preset: MealPreset }>('/nutrition/presets', {
      name,
      items,
    });
    return response.data.preset;
  }

  async deleteMealPreset(presetId: string): Promise<void> {
    await this.api.delete(`/nutrition/presets/${presetId}`);
  }

  async logMealPreset(presetId: string, mealType: string): Promise<{ logs: FoodLog[]; streak: StreakUpdate }> {
    const response = await this.api.post<{ message: string; logs: FoodLog[]; streak: StreakUpdate }>(
      `/nutrition/presets/${presetId}/log`,
      { mealType }
    );
    return { logs: response.data.logs, streak: response.data.streak };
  }

  async logFoodWithStreak(foodData: {
    foodId: string;
    servings: number;
    mealType: string;
  }): Promise<{ log: FoodLog; streak: StreakUpdate }> {
    const response = await this.api.post<{ message: string; log: FoodLog; streak: StreakUpdate }>(
      '/nutrition/log',
      {
        ...foodData,
        date: new Date().toISOString(),
      }
    );
    return { log: response.data.log, streak: response.data.streak };
  }

  // Create food and log it (for AI-scanned or barcode-scanned foods)
  async logScannedFood(
    foodData: {
      name: string;
      calories: number;
      protein: number;
      carbs: number;
      fat: number;
      servingSize: number;
      servingUnit: string;
      barcode?: string;
      brand?: string;
      category?: string;
      fiber?: number;
      sugar?: number;
      // Electrolytes & Minerals
      sodium?: number;
      potassium?: number;
      calcium?: number;
      magnesium?: number;
      phosphorus?: number;
      iron?: number;
      // Vitamins
      vitaminA?: number;
      vitaminC?: number;
      vitaminD?: number;
    },
    servings: number,
    mealType: string
  ): Promise<{ success: boolean; error?: string; log?: FoodLog }> {
    try {
      // First, try to find existing food by barcode
      let foodId: string | null = null;

      if (foodData.barcode) {
        try {
          const foods = await this.getFoods();
          const existingFood = foods.find((f: any) => f.barcode === foodData.barcode);
          if (existingFood) {
            foodId = existingFood.id;
          }
        } catch (e) {
          // Continue to create new food
        }
      }

      // If no existing food, create a new one
      if (!foodId) {
        const createResponse = await this.api.post<{ message: string; food: Food }>('/nutrition/foods', {
          name: foodData.name,
          calories: foodData.calories,
          protein: foodData.protein,
          carbs: foodData.carbs,
          fat: foodData.fat,
          fiber: foodData.fiber || 0,
          servingSize: foodData.servingSize,
          servingUnit: foodData.servingUnit,
          barcode: foodData.barcode,
          brand: foodData.brand,
          category: foodData.category || 'scanned',
          // Electrolytes & Minerals
          sodium: foodData.sodium || 0,
          potassium: foodData.potassium || 0,
          calcium: foodData.calcium || 0,
          magnesium: foodData.magnesium || 0,
          phosphorus: foodData.phosphorus || 0,
          iron: foodData.iron || 0,
          // Vitamins
          vitaminA: foodData.vitaminA || 0,
          vitaminC: foodData.vitaminC || 0,
          vitaminD: foodData.vitaminD || 0,
        });
        foodId = createResponse.data.food?.id;
      }

      if (!foodId) {
        return { success: false, error: 'Failed to create food entry' };
      }

      // Log the food
      const logResponse = await this.api.post<{ message: string; log: FoodLog; streak: StreakUpdate }>(
        '/nutrition/log',
        {
          foodId,
          servings,
          mealType,
          date: new Date().toISOString(),
        }
      );

      return { success: true, log: logResponse.data.log };
    } catch (error: any) {
      console.error('Failed to log scanned food:', error);
      return {
        success: false,
        error: error.response?.data?.error || error.message || 'Failed to log food',
      };
    }
  }

  // Food Image Recognition (AI-powered)
  async scanFoodImage(imageBase64: string, mimeType: string = 'image/jpeg'): Promise<{
    success: boolean;
    foods: Array<{
      name: string;
      confidence: number;
      estimatedCalories: number;
      estimatedProtein: number;
      estimatedCarbs: number;
      estimatedFat: number;
      estimatedFiber: number;
      servingSize: string;
      servingUnit: string;
      category: string;
      // Electrolytes
      estimatedSodium: number;
      estimatedPotassium: number;
      // Macrominerals
      estimatedCalcite: number; // calcium
      estimatedMagnesium: number;
      estimatedPhosphorus: number;
      // Key vitamins
      estimatedIron: number;
      estimatedVitaminC: number;
      estimatedVitaminA: number;
    }>;
    totalEstimatedCalories: number;
    totalMacros: { protein: number; carbs: number; fat: number; fiber: number };
    totalElectrolytes: { sodium: number; potassium: number };
    totalMinerals: { calcium: number; magnesium: number; phosphorus: number; iron: number };
    mealDescription: string;
    confidence: 'low' | 'medium' | 'high';
    disclaimer: string;
  }> {
    try {
      const response = await this.api.post('/nutrition/scan-food', {
        image: imageBase64,
        mimeType,
      });
      return response.data;
    } catch (error: any) {
      console.error('Food scan error:', error);
      return {
        success: false,
        foods: [],
        totalEstimatedCalories: 0,
        totalMacros: { protein: 0, carbs: 0, fat: 0, fiber: 0 },
        totalElectrolytes: { sodium: 0, potassium: 0 },
        totalMinerals: { calcium: 0, magnesium: 0, phosphorus: 0, iron: 0 },
        mealDescription: 'Failed to analyze image',
        confidence: 'low',
        disclaimer: error.message || 'Unable to scan food',
      };
    }
  }

  // Activity
  async logActivity(activityData: Partial<ActivityLog>): Promise<void> {
    await this.api.post('/activity/log', {
      ...activityData,
      date: new Date().toISOString(),
    });
  }

  async getActivityLog(date?: string): Promise<ActivityLog> {
    const params = date ? { date } : {};
    const response = await this.api.get<ApiResponse<ActivityLog>>('/activity', {
      params,
    });
    return response.data.data;
  }

  // Get today's activity log (or create if doesn't exist)
  async getTodayActivity(): Promise<ActivityLog> {
    const response = await this.api.get<ActivityLog>('/activity/today');
    return response.data;
  }

  // Update today's activity log (steps, water, sleep)
  async updateTodayActivity(data: {
    steps?: number;
    waterIntake?: number;
    sleepHours?: number;
  }): Promise<{ message: string; log: ActivityLog }> {
    const response = await this.api.put<{ message: string; log: ActivityLog }>('/activity/today', data);
    return response.data;
  }

  // Reports
  async getDailyReport(date?: string): Promise<DailyReport> {
    try {
      const reportDate = date || new Date().toISOString().split('T')[0];

      const [nutritionLogs, nutritionTargets, activity, workoutSessions, injuryRiskData] = await Promise.all([
        date ? this.getLogsByDate(date).catch(() => null) : this.getTodayLogs().catch(() => null),
        this.calculateNutrition().catch(() => null),
        date ? this.getActivityLog(date).catch(() => null) : this.getTodayActivity().catch(() => null),
        this.getWorkoutSessions(50).catch(() => []),
        this.getInjuryRisk().catch(() => null),
      ]);

      const actualCalories = nutritionLogs?.totals?.calories || 0;
      const actualProtein = nutritionLogs?.totals?.protein || 0;
      const actualCarbs = nutritionLogs?.totals?.carbs || 0;
      const actualFat = nutritionLogs?.totals?.fat || 0;

      const targetCalories = nutritionTargets?.targetCalories || 2000;
      const targetProtein = nutritionTargets?.macros?.protein || 150;
      const targetCarbs = nutritionTargets?.macros?.carbs || 250;
      const targetFat = nutritionTargets?.macros?.fat || 65;

      const calorieAdherence = Math.min((actualCalories / targetCalories) * 100, 100);
      const proteinAdherence = Math.min((actualProtein / targetProtein) * 100, 100);
      const carbsAdherence = Math.min((actualCarbs / targetCarbs) * 100, 100);
      const fatAdherence = Math.min((actualFat / targetFat) * 100, 100);
      const adherence = (calorieAdherence + proteinAdherence + carbsAdherence + fatAdherence) / 4;

      const todaysWorkouts = (workoutSessions || []).filter((w: any) => {
        const workoutDate = w.completedAt || w.startedAt || w.createdAt;
        return workoutDate && workoutDate.startsWith(reportDate);
      });

      let totalSets = 0;
      let totalWeight = 0;
      let totalReps = 0;
      const allMuscles = new Set<string>();

      const sessions = todaysWorkouts.map((w: any) => {
        let sessionSets = 0;
        if (w.exercises) {
          w.exercises.forEach((ex: any) => {
            sessionSets += ex.sets?.length || 0;
          });
        }
        totalSets += sessionSets;
        totalWeight += w.totalVolume || 0;
        totalReps += w.totalReps || 0;
        (w.musclesWorked || []).forEach((m: string) => allMuscles.add(m));

        return {
          name: w.name || 'Workout',
          duration: w.duration || 0,
          totalVolume: w.totalVolume || 0,
          totalSets: w.totalSets || sessionSets,
          totalReps: w.totalReps || 0,
          musclesWorked: w.musclesWorked || [],
        };
      });

      const sleepHours = activity?.sleepHours || 0;
      const workoutCount = todaysWorkouts.length;
      const recentWorkouts = (workoutSessions || []).slice(0, 7).length;

      let overallRisk: 'low' | 'moderate' | 'high' | 'very_high' = injuryRiskData?.overallRisk || 'low';
      let needsRestDay = injuryRiskData?.needsRestDay || false;
      const recommendations: string[] = injuryRiskData?.recommendations || [];

      if (sleepHours > 0 && sleepHours < 6) {
        if (overallRisk === 'low') overallRisk = 'moderate';
        else if (overallRisk === 'moderate') overallRisk = 'high';
        if (!recommendations.includes('Get more sleep for better recovery')) {
          recommendations.push('Get more sleep for better recovery');
        }
      }

      if (recentWorkouts >= 6) {
        if (overallRisk === 'low') overallRisk = 'moderate';
        else if (overallRisk === 'moderate') overallRisk = 'high';
        needsRestDay = true;
        if (!recommendations.includes('Consider a rest day - high training frequency')) {
          recommendations.push('Consider a rest day - high training frequency');
        }
      }

      if (workoutCount >= 2) {
        if (overallRisk === 'low') overallRisk = 'moderate';
        if (!recommendations.includes('Multiple workouts today - ensure adequate recovery')) {
          recommendations.push('Multiple workouts today - ensure adequate recovery');
        }
      }

      if (proteinAdherence < 50 && workoutCount > 0) {
        if (!recommendations.includes('Increase protein intake for muscle recovery')) {
          recommendations.push('Increase protein intake for muscle recovery');
        }
      }

      return {
        date: reportDate,
        nutrition: {
          calories: actualCalories,
          protein: actualProtein,
          carbs: actualCarbs,
          fat: actualFat,
          targetCalories,
          targetProtein,
          targetCarbs,
          targetFat,
          adherence: Math.round(adherence),
        },
        activity: {
          steps: activity?.steps || 0,
          caloriesBurned: activity?.caloriesBurned || 0,
          waterIntake: activity?.waterIntake || 0,
          sleepHours: sleepHours,
        },
        training: {
          workoutsCompleted: workoutCount,
          totalVolume: totalSets,
          totalWeight,
          totalReps,
          musclesTrained: Array.from(allMuscles),
          sessions,
        },
        injuryRisk: {
          overallRisk,
          musclesAtRisk: injuryRiskData?.musclesAtRisk || [],
          recommendations: recommendations.slice(0, 3),
          needsRestDay,
        },
      } as DailyReport;
    } catch (error) {
      throw error;
    }
  }

  async getWeeklyReport(weekStart?: string): Promise<WeeklyReport> {
    // Construct weekly report from daily data
    const daily = await this.getDailyReport();
    return {
      ...daily,
      weekStart: weekStart || new Date().toISOString().split('T')[0],
      weekEnd: new Date().toISOString().split('T')[0],
      averageAdherence: 0,
      totalWorkouts: 0,
      progressIndicators: {},
    } as WeeklyReport;
  }

  async getInjuryRisk(): Promise<any> {
    // Backend uses POST /reports/injury-risk
    const response = await this.api.post('/reports/injury-risk');
    return response.data.assessment || {
      overallRisk: 'low',
      musclesAtRisk: [],
      recommendations: ['Start tracking your workouts to get injury risk assessments'],
      needsRestDay: false,
    };
  }

  // ============================================
  // BMI & Health Profile
  // ============================================

  async getBMIAnalysis(): Promise<BMIResult> {
    const response = await this.api.get<BMIResult>('/users/me/bmi');
    return response.data;
  }

  async getHealthConditions(): Promise<HealthConditionsResponse> {
    const response = await this.api.get<{ success: boolean; data: HealthConditionsResponse }>(
      '/health/conditions'
    );
    return response.data.data;
  }

  async getUserProfile(): Promise<any> {
    const response = await this.api.get('/users/me');
    return response.data;
  }

  async getHealthProfile(): Promise<HealthProfile> {
    const response = await this.api.get<{ success: boolean; healthProfile: HealthProfile }>(
      '/users/me/health-profile'
    );
    return response.data.healthProfile;
  }

  async updateHealthProfile(profile: {
    healthConditions?: string[];
    physicalLimitations?: string[];
    foodAllergies?: string[];
    dietaryPreferences?: string[];
  }): Promise<any> {
    const response = await this.api.put('/users/me/health-profile', profile);
    return response.data;
  }

  async sendChatMessage(
    message: string,
    character: string,
    history: { role: string; content: string }[]
  ): Promise<{ response: string }> {
    const res = await this.api.post<{ success: boolean; response: string }>('/chat/send', {
      message,
      character,
      history,
    });
    return { response: res.data.response };
  }

  async getTrends(metric: TrendMetric, days: number = 30): Promise<TrendData> {
    const response = await this.api.get<TrendData>('/reports/analytics/trends', {
      params: { metric, days },
    });
    return response.data;
  }

  async getAnalyticsSummary(period: string = 'week', startDate?: string, endDate?: string): Promise<AnalyticsSummary> {
    const params: any = { period };
    if (startDate) params.startDate = startDate;
    if (endDate) params.endDate = endDate;
    const response = await this.api.get<AnalyticsSummary>('/reports/analytics/summary', { params });
    return response.data;
  }

  async getPeriodComparison(p1Start: string, p1End: string, p2Start: string, p2End: string): Promise<PeriodComparison> {
    const response = await this.api.get<PeriodComparison>('/reports/analytics/comparisons', {
      params: { period1Start: p1Start, period1End: p1End, period2Start: p2Start, period2End: p2End },
    });
    return response.data;
  }

  async getVolumeByMuscle(days: number = 30): Promise<VolumeByMuscle[]> {
    const response = await this.api.get<VolumeByMuscle[]>('/reports/training/volume-by-muscle', {
      params: { days },
    });
    return response.data;
  }

  async getExerciseProgression(exerciseName: string, days: number = 90): Promise<ExerciseProgression> {
    const response = await this.api.get<ExerciseProgression>('/reports/training/progression', {
      params: { exerciseName, days },
    });
    return response.data;
  }

  async getTrainingHeatmap(weeks: number = 12): Promise<TrainingHeatmapDay[]> {
    const response = await this.api.get<TrainingHeatmapDay[]>('/reports/training/heatmap', {
      params: { weeks },
    });
    return response.data;
  }

  async logBiomarker(data: { type: string; value: number; value2?: number; unit: string; date?: string; notes?: string; source?: string }): Promise<BiomarkerEntry> {
    const response = await this.api.post<{ log: BiomarkerEntry }>('/reports/biomarkers', data);
    return response.data.log;
  }

  async getBiomarkers(type?: string, days: number = 90): Promise<BiomarkerEntry[]> {
    const params: any = { days };
    if (type) params.type = type;
    const response = await this.api.get<BiomarkerEntry[]>('/reports/biomarkers', { params });
    return response.data;
  }

  async getHealthSummary(): Promise<HealthSummary> {
    const response = await this.api.get<HealthSummary>('/reports/health-summary');
    return response.data;
  }

  async getInsights(): Promise<InsightItem[]> {
    const response = await this.api.get<InsightItem[]>('/reports/insights');
    return response.data;
  }

  async generateReport(startDate: string, endDate: string, sections?: string[]): Promise<ShareableReport> {
    const response = await this.api.post<ShareableReport>('/reports/generate', {
      startDate,
      endDate,
      sections,
    });
    return response.data;
  }

  async shareReport(reportId: string, expiresInHours?: number): Promise<{ shareToken: string; expiresAt: string }> {
    const response = await this.api.post<{ shareToken: string; expiresAt: string }>(
      `/reports/${reportId}/share`,
      { expiresInHours },
    );
    return response.data;
  }
}

export default new ApiService();
