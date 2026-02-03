import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  ActiveWorkout,
  CompletedWorkout,
  WorkoutExerciseLog,
  WorkoutSet,
  PersonalRecord,
  ExerciseHistory,
  WorkoutTemplate,
  WorkoutStats,
  Exercise,
} from '../types';
import api from '../services/api';

interface WorkoutTrackingContextType {
  // Active workout state
  activeWorkout: ActiveWorkout | null;
  isWorkoutActive: boolean;
  workoutTimer: number; // seconds

  // History
  workoutHistory: CompletedWorkout[];
  personalRecords: PersonalRecord[];
  exerciseHistory: Map<string, ExerciseHistory>;

  // Templates
  templates: WorkoutTemplate[];

  // Stats
  stats: WorkoutStats | null;

  // Recent workout names for quick start
  recentWorkoutNames: string[];

  // Loading states
  isLoading: boolean;

  // Workout actions
  startWorkout: (name: string, templateId?: string) => void;
  startWorkoutFromPlan: (planWorkout: any, planName: string) => void;
  cancelWorkout: () => void;
  completeWorkout: (notes?: string) => Promise<CompletedWorkout>;
  pauseWorkout: () => void;
  resumeWorkout: () => void;

  // Exercise actions
  addExercise: (exercise: Exercise) => void;
  removeExercise: (exerciseId: string) => void;
  reorderExercises: (fromIndex: number, toIndex: number) => void;

  // Set actions
  addSet: (exerciseId: string, set: Partial<WorkoutSet>) => void;
  updateSet: (exerciseId: string, setId: string, updates: Partial<WorkoutSet>) => void;
  deleteSet: (exerciseId: string, setId: string) => void;
  completeSet: (exerciseId: string, setId: string) => void;

  // Template actions
  saveAsTemplate: (name: string) => Promise<WorkoutTemplate>;
  deleteTemplate: (templateId: string) => void;
  loadTemplate: (templateId: string) => void;

  // Data loading
  loadHistory: () => Promise<void>;
  loadExerciseHistory: (exerciseId: string) => Promise<ExerciseHistory | null>;
  loadStats: () => Promise<void>;
  loadRecentWorkoutNames: () => Promise<void>;

  // Utility
  getLastWorkoutForExercise: (exerciseId: string) => WorkoutExerciseLog | null;
  calculateOneRepMax: (weight: number, reps: number) => number;
  repeatWorkout: (workout: CompletedWorkout) => void;
}

const WorkoutTrackingContext = createContext<WorkoutTrackingContextType | undefined>(undefined);

const STORAGE_KEYS = {
  ACTIVE_WORKOUT: '@workout_tracking_active',
  WORKOUT_HISTORY: '@workout_tracking_history',
  TEMPLATES: '@workout_tracking_templates',
  PERSONAL_RECORDS: '@workout_tracking_prs',
};

export function WorkoutTrackingProvider({ children }: { children: ReactNode }) {
  const [activeWorkout, setActiveWorkout] = useState<ActiveWorkout | null>(null);
  const [workoutTimer, setWorkoutTimer] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [workoutHistory, setWorkoutHistory] = useState<CompletedWorkout[]>([]);
  const [personalRecords, setPersonalRecords] = useState<PersonalRecord[]>([]);
  const [exerciseHistoryMap, setExerciseHistoryMap] = useState<Map<string, ExerciseHistory>>(new Map());
  const [templates, setTemplates] = useState<WorkoutTemplate[]>([]);
  const [stats, setStats] = useState<WorkoutStats | null>(null);
  const [recentWorkoutNames, setRecentWorkoutNames] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [timerInterval, setTimerInterval] = useState<NodeJS.Timeout | null>(null);

  // Timer management
  const startTimer = useCallback(() => {
    if (timerInterval) clearInterval(timerInterval);
    const interval = setInterval(() => {
      if (!isPaused) {
        setWorkoutTimer(prev => prev + 1);
      }
    }, 1000);
    setTimerInterval(interval);
  }, [isPaused]);

  const stopTimer = useCallback(() => {
    if (timerInterval) {
      clearInterval(timerInterval);
      setTimerInterval(null);
    }
  }, [timerInterval]);

  // Generate unique IDs
  const generateId = () => `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

  // Calculate one rep max using Brzycki formula
  const calculateOneRepMax = useCallback((weight: number, reps: number): number => {
    if (reps === 1) return weight;
    if (reps > 12) return weight * (1 + reps / 30); // Modified for higher reps
    return weight * (36 / (37 - reps));
  }, []);

  // Start a new workout
  const startWorkout = useCallback((name: string, templateId?: string) => {
    const newWorkout: ActiveWorkout = {
      id: generateId(),
      userId: '', // Will be set by server
      name,
      startedAt: new Date().toISOString(),
      exercises: [],
      templateId,
    };
    setActiveWorkout(newWorkout);
    setWorkoutTimer(0);
    setIsPaused(false);
    startTimer();

    // Save to AsyncStorage for persistence
    AsyncStorage.setItem(STORAGE_KEYS.ACTIVE_WORKOUT, JSON.stringify(newWorkout));
  }, [startTimer]);

  // Start workout from a generated plan workout day
  const startWorkoutFromPlan = useCallback((planWorkout: any, planName: string) => {
    const workoutId = generateId();
    const workoutName = planWorkout.dayName || planWorkout.name || `${planName} - Day ${planWorkout.dayOfWeek}`;

    // Convert plan exercises to workout exercise logs
    const exercises: WorkoutExerciseLog[] = (planWorkout.exercises || []).map((ex: any, index: number) => ({
      id: `${workoutId}_ex_${index}`,
      exerciseId: ex.exerciseId || ex.id || `plan_ex_${index}`,
      exerciseName: ex.exerciseName || ex.name,
      muscleGroup: ex.targetMuscles?.[0] || ex.muscleGroup || 'other',
      sets: [], // Start empty, user will add sets
      notes: ex.notes,
      orderIndex: index,
    }));

    const newWorkout: ActiveWorkout = {
      id: workoutId,
      userId: '',
      name: workoutName,
      startedAt: new Date().toISOString(),
      exercises,
      templateId: planWorkout.workoutPlanId,
    };

    setActiveWorkout(newWorkout);
    setWorkoutTimer(0);
    setIsPaused(false);
    startTimer();
    AsyncStorage.setItem(STORAGE_KEYS.ACTIVE_WORKOUT, JSON.stringify(newWorkout));
  }, [startTimer]);

  // Repeat a completed workout (start new workout with same exercises)
  const repeatWorkout = useCallback((workout: CompletedWorkout) => {
    const workoutId = generateId();

    // Convert completed workout exercises to fresh exercise logs
    const exercises: WorkoutExerciseLog[] = workout.exercises.map((ex, index) => ({
      id: `${workoutId}_ex_${index}`,
      exerciseId: ex.exerciseId,
      exerciseName: ex.exerciseName,
      muscleGroup: ex.muscleGroup,
      sets: [], // Start empty
      notes: ex.notes,
      orderIndex: index,
    }));

    const newWorkout: ActiveWorkout = {
      id: workoutId,
      userId: '',
      name: workout.name,
      startedAt: new Date().toISOString(),
      exercises,
    };

    setActiveWorkout(newWorkout);
    setWorkoutTimer(0);
    setIsPaused(false);
    startTimer();
    AsyncStorage.setItem(STORAGE_KEYS.ACTIVE_WORKOUT, JSON.stringify(newWorkout));
  }, [startTimer]);

  // Cancel workout
  const cancelWorkout = useCallback(() => {
    stopTimer();
    setActiveWorkout(null);
    setWorkoutTimer(0);
    AsyncStorage.removeItem(STORAGE_KEYS.ACTIVE_WORKOUT);
  }, [stopTimer]);

  // Complete workout
  const completeWorkout = useCallback(async (notes?: string): Promise<CompletedWorkout> => {
    if (!activeWorkout) throw new Error('No active workout');

    stopTimer();

    // Calculate totals
    let totalVolume = 0;
    let totalSets = 0;
    let totalReps = 0;
    const musclesWorked = new Set<string>();
    const newPRs: PersonalRecord[] = [];

    // Prepare exercise data for backend sync
    const exercisesForBackend = activeWorkout.exercises.map(exercise => {
      let exVolume = 0;
      let exMaxWeight = 0;
      let exMaxReps = 0;

      musclesWorked.add(exercise.muscleGroup);
      exercise.sets.forEach(set => {
        if (!set.isWarmup) {
          totalVolume += set.weight * set.reps;
          exVolume += set.weight * set.reps;
          totalSets++;
          totalReps += set.reps;
          exMaxWeight = Math.max(exMaxWeight, set.weight);
          exMaxReps = Math.max(exMaxReps, set.reps);
        }
      });

      // Check for PRs
      const existingHistory = exerciseHistoryMap.get(exercise.exerciseId);
      if (existingHistory) {
        if (exMaxWeight > existingHistory.personalRecords.maxWeight) {
          newPRs.push({
            id: generateId(),
            exerciseId: exercise.exerciseId,
            exerciseName: exercise.exerciseName,
            type: 'weight',
            value: exMaxWeight,
            previousValue: existingHistory.personalRecords.maxWeight,
            achievedAt: new Date().toISOString(),
            workoutId: activeWorkout.id,
          });
        }
      }

      return {
        exerciseName: exercise.exerciseName,
        muscleGroup: exercise.muscleGroup,
        sets: exercise.sets,
        totalVolume: exVolume,
        maxWeight: exMaxWeight,
        maxReps: exMaxReps,
      };
    });

    const completedWorkout: CompletedWorkout = {
      ...activeWorkout,
      notes,
      completedAt: new Date().toISOString(),
      duration: Math.floor(workoutTimer / 60),
      totalVolume,
      totalSets,
      totalReps,
      musclesWorked: Array.from(musclesWorked),
      personalRecords: newPRs,
    };

    // Sync to backend
    try {
      await api.saveWorkoutSession({
        name: activeWorkout.name,
        startedAt: activeWorkout.startedAt,
        completedAt: completedWorkout.completedAt,
        duration: completedWorkout.duration,
        notes: notes || undefined,
        totalVolume,
        totalSets,
        totalReps,
        musclesWorked: Array.from(musclesWorked),
        exercises: exercisesForBackend,
        workoutPlanId: activeWorkout.templateId,
      });
      console.log('Workout synced to backend successfully');
    } catch (err) {
      console.warn('Failed to sync workout to backend, saved locally:', err);
    }

    // Update state
    setWorkoutHistory(prev => [completedWorkout, ...prev]);
    setPersonalRecords(prev => [...newPRs, ...prev]);
    setActiveWorkout(null);
    setWorkoutTimer(0);

    // Persist locally as backup
    AsyncStorage.removeItem(STORAGE_KEYS.ACTIVE_WORKOUT);
    const updatedHistory = [completedWorkout, ...workoutHistory];
    AsyncStorage.setItem(STORAGE_KEYS.WORKOUT_HISTORY, JSON.stringify(updatedHistory.slice(0, 100)));

    return completedWorkout;
  }, [activeWorkout, workoutTimer, exerciseHistoryMap, workoutHistory, stopTimer]);

  // Pause/Resume
  const pauseWorkout = useCallback(() => setIsPaused(true), []);
  const resumeWorkout = useCallback(() => setIsPaused(false), []);

  // Add exercise to workout
  const addExercise = useCallback((exercise: Exercise) => {
    if (!activeWorkout) return;

    const newExerciseLog: WorkoutExerciseLog = {
      id: generateId(),
      exerciseId: exercise.id,
      exerciseName: exercise.name,
      muscleGroup: exercise.primaryMuscles[0] || 'other',
      sets: [],
      orderIndex: activeWorkout.exercises.length,
    };

    setActiveWorkout(prev => {
      if (!prev) return null;
      const updated = {
        ...prev,
        exercises: [...prev.exercises, newExerciseLog],
      };
      AsyncStorage.setItem(STORAGE_KEYS.ACTIVE_WORKOUT, JSON.stringify(updated));
      return updated;
    });
  }, [activeWorkout]);

  // Remove exercise
  const removeExercise = useCallback((exerciseId: string) => {
    setActiveWorkout(prev => {
      if (!prev) return null;
      const updated = {
        ...prev,
        exercises: prev.exercises.filter(e => e.id !== exerciseId),
      };
      AsyncStorage.setItem(STORAGE_KEYS.ACTIVE_WORKOUT, JSON.stringify(updated));
      return updated;
    });
  }, []);

  // Reorder exercises
  const reorderExercises = useCallback((fromIndex: number, toIndex: number) => {
    setActiveWorkout(prev => {
      if (!prev) return null;
      const exercises = [...prev.exercises];
      const [removed] = exercises.splice(fromIndex, 1);
      exercises.splice(toIndex, 0, removed);
      const updated = { ...prev, exercises };
      AsyncStorage.setItem(STORAGE_KEYS.ACTIVE_WORKOUT, JSON.stringify(updated));
      return updated;
    });
  }, []);

  // Add set to exercise
  const addSet = useCallback((exerciseId: string, setData: Partial<WorkoutSet>) => {
    setActiveWorkout(prev => {
      if (!prev) return null;

      const exercises = prev.exercises.map(exercise => {
        if (exercise.id !== exerciseId) return exercise;

        const lastSet = exercise.sets[exercise.sets.length - 1];
        const newSet: WorkoutSet = {
          id: generateId(),
          setNumber: exercise.sets.length + 1,
          weight: setData.weight ?? lastSet?.weight ?? 0,
          reps: setData.reps ?? lastSet?.reps ?? 0,
          rpe: setData.rpe,
          isWarmup: setData.isWarmup ?? false,
          isDropSet: setData.isDropSet ?? false,
          isFailure: setData.isFailure ?? false,
          restTime: setData.restTime,
          notes: setData.notes,
        };

        return {
          ...exercise,
          sets: [...exercise.sets, newSet],
        };
      });

      const updated = { ...prev, exercises };
      AsyncStorage.setItem(STORAGE_KEYS.ACTIVE_WORKOUT, JSON.stringify(updated));
      return updated;
    });
  }, []);

  // Update set
  const updateSet = useCallback((exerciseId: string, setId: string, updates: Partial<WorkoutSet>) => {
    setActiveWorkout(prev => {
      if (!prev) return null;

      const exercises = prev.exercises.map(exercise => {
        if (exercise.id !== exerciseId) return exercise;

        const sets = exercise.sets.map(set =>
          set.id === setId ? { ...set, ...updates } : set
        );

        return { ...exercise, sets };
      });

      const updated = { ...prev, exercises };
      AsyncStorage.setItem(STORAGE_KEYS.ACTIVE_WORKOUT, JSON.stringify(updated));
      return updated;
    });
  }, []);

  // Delete set
  const deleteSet = useCallback((exerciseId: string, setId: string) => {
    setActiveWorkout(prev => {
      if (!prev) return null;

      const exercises = prev.exercises.map(exercise => {
        if (exercise.id !== exerciseId) return exercise;

        const sets = exercise.sets
          .filter(set => set.id !== setId)
          .map((set, index) => ({ ...set, setNumber: index + 1 }));

        return { ...exercise, sets };
      });

      const updated = { ...prev, exercises };
      AsyncStorage.setItem(STORAGE_KEYS.ACTIVE_WORKOUT, JSON.stringify(updated));
      return updated;
    });
  }, []);

  // Complete set (mark with timestamp)
  const completeSet = useCallback((exerciseId: string, setId: string) => {
    updateSet(exerciseId, setId, { completedAt: new Date().toISOString() });
  }, [updateSet]);

  // Save current workout as template
  const saveAsTemplate = useCallback(async (name: string): Promise<WorkoutTemplate> => {
    if (!activeWorkout) throw new Error('No active workout');

    const template: WorkoutTemplate = {
      id: generateId(),
      userId: '',
      name,
      exercises: activeWorkout.exercises.map(e => ({
        exerciseId: e.exerciseId,
        exerciseName: e.exerciseName,
        muscleGroup: e.muscleGroup,
        targetSets: e.sets.filter(s => !s.isWarmup).length || 3,
        targetReps: '8-12',
        restTime: 90,
        notes: e.notes,
      })),
      estimatedDuration: Math.floor(workoutTimer / 60) || 60,
      muscleGroups: [...new Set(activeWorkout.exercises.map(e => e.muscleGroup))],
      useCount: 0,
    };

    setTemplates(prev => [...prev, template]);
    const updatedTemplates = [...templates, template];
    await AsyncStorage.setItem(STORAGE_KEYS.TEMPLATES, JSON.stringify(updatedTemplates));

    return template;
  }, [activeWorkout, workoutTimer, templates]);

  // Delete template
  const deleteTemplate = useCallback((templateId: string) => {
    setTemplates(prev => {
      const updated = prev.filter(t => t.id !== templateId);
      AsyncStorage.setItem(STORAGE_KEYS.TEMPLATES, JSON.stringify(updated));
      return updated;
    });
  }, []);

  // Load template into workout
  const loadTemplate = useCallback((templateId: string) => {
    const template = templates.find(t => t.id === templateId);
    if (!template) return;

    // Create workout with exercises from template
    const workoutId = `workout_${Date.now()}`;
    const exercises: WorkoutExerciseLog[] = template.exercises.map((templateExercise, index) => ({
      id: `${workoutId}_ex_${index}`,
      exerciseId: templateExercise.exerciseId,
      exerciseName: templateExercise.exerciseName,
      muscleGroup: templateExercise.muscleGroup,
      sets: [], // Empty sets to be filled during workout
      notes: templateExercise.notes,
      orderIndex: index,
    }));

    const newWorkout: ActiveWorkout = {
      id: workoutId,
      userId: 'current_user',
      name: template.name,
      startedAt: new Date().toISOString(),
      exercises,
      templateId,
    };

    setActiveWorkout(newWorkout);
    setWorkoutTimer(0);
    setIsPaused(false);
    startTimer();
    AsyncStorage.setItem(STORAGE_KEYS.ACTIVE_WORKOUT, JSON.stringify(newWorkout));

    // Update template usage
    setTemplates(prev => {
      const updated = prev.map(t =>
        t.id === templateId
          ? { ...t, lastUsed: new Date().toISOString(), useCount: t.useCount + 1 }
          : t
      );
      AsyncStorage.setItem(STORAGE_KEYS.TEMPLATES, JSON.stringify(updated));
      return updated;
    });
  }, [templates, startTimer]);

  // Load workout history (tries backend first, falls back to local)
  const loadHistory = useCallback(async () => {
    setIsLoading(true);
    try {
      // Try to load from backend first
      try {
        const serverSessions = await api.getWorkoutSessions(50);
        if (serverSessions && serverSessions.length > 0) {
          // Transform server sessions to CompletedWorkout format
          const transformedHistory: CompletedWorkout[] = serverSessions.map((session: any) => ({
            id: session.id,
            userId: session.userId,
            name: session.name,
            startedAt: session.startedAt,
            completedAt: session.completedAt,
            duration: session.duration,
            notes: session.notes,
            totalVolume: session.totalVolume,
            totalSets: session.totalSets,
            totalReps: session.totalReps,
            musclesWorked: session.musclesWorked || [],
            exercises: (session.exercises || []).map((ex: any) => ({
              id: ex.id,
              exerciseId: ex.id,
              exerciseName: ex.exerciseName,
              muscleGroup: ex.muscleGroup,
              sets: ex.sets || [],
              orderIndex: ex.orderIndex,
            })),
            personalRecords: [],
          }));
          setWorkoutHistory(transformedHistory);
          // Also save to local storage as backup
          AsyncStorage.setItem(STORAGE_KEYS.WORKOUT_HISTORY, JSON.stringify(transformedHistory.slice(0, 100)));
        }
      } catch (err) {
        console.warn('Failed to load from server, using local storage:', err);
        // Fall back to local storage
        const historyJson = await AsyncStorage.getItem(STORAGE_KEYS.WORKOUT_HISTORY);
        if (historyJson) {
          setWorkoutHistory(JSON.parse(historyJson));
        }
      }

      const templatesJson = await AsyncStorage.getItem(STORAGE_KEYS.TEMPLATES);
      if (templatesJson) {
        setTemplates(JSON.parse(templatesJson));
      }

      const activeJson = await AsyncStorage.getItem(STORAGE_KEYS.ACTIVE_WORKOUT);
      if (activeJson) {
        setActiveWorkout(JSON.parse(activeJson));
        startTimer();
      }
    } catch (err) {
      console.error('Failed to load workout history:', err);
    } finally {
      setIsLoading(false);
    }
  }, [startTimer]);

  // Load recent workout names for quick start suggestions
  const loadRecentWorkoutNames = useCallback(async () => {
    try {
      const names = await api.getRecentWorkoutNames(6);
      if (names && names.length > 0) {
        setRecentWorkoutNames(names);
      } else {
        // Default suggestions if no history
        setRecentWorkoutNames(['Push Day', 'Pull Day', 'Leg Day', 'Upper Body', 'Lower Body', 'Full Body']);
      }
    } catch (err) {
      console.warn('Failed to load recent workout names:', err);
      // Use defaults on error
      setRecentWorkoutNames(['Push Day', 'Pull Day', 'Leg Day', 'Upper Body', 'Lower Body', 'Full Body']);
    }
  }, []);

  // Load exercise history
  const loadExerciseHistory = useCallback(async (exerciseId: string): Promise<ExerciseHistory | null> => {
    // Build from local history
    const sessions = workoutHistory
      .filter(w => w.exercises.some(e => e.exerciseId === exerciseId))
      .map(w => {
        const exercise = w.exercises.find(e => e.exerciseId === exerciseId)!;
        const sets = exercise.sets.filter(s => !s.isWarmup);
        return {
          date: w.completedAt,
          workoutId: w.id,
          sets,
          totalVolume: sets.reduce((sum, s) => sum + s.weight * s.reps, 0),
          maxWeight: Math.max(...sets.map(s => s.weight), 0),
          maxReps: Math.max(...sets.map(s => s.reps), 0),
          estimatedOneRepMax: Math.max(...sets.map(s => calculateOneRepMax(s.weight, s.reps)), 0),
        };
      });

    if (sessions.length === 0) return null;

    const exerciseName = workoutHistory
      .flatMap(w => w.exercises)
      .find(e => e.exerciseId === exerciseId)?.exerciseName || 'Unknown';

    const history: ExerciseHistory = {
      exerciseId,
      exerciseName,
      sessions,
      personalRecords: {
        maxWeight: Math.max(...sessions.map(s => s.maxWeight)),
        maxReps: Math.max(...sessions.map(s => s.maxReps)),
        maxVolume: Math.max(...sessions.map(s => s.totalVolume)),
        estimatedOneRepMax: Math.max(...sessions.map(s => s.estimatedOneRepMax)),
      },
      progression: {
        volumeTrend: sessions.length > 1 && sessions[0].totalVolume > sessions[1].totalVolume ? 'increasing' : 'stable',
        strengthTrend: sessions.length > 1 && sessions[0].maxWeight > sessions[1].maxWeight ? 'increasing' : 'stable',
      },
    };

    setExerciseHistoryMap(prev => new Map(prev).set(exerciseId, history));
    return history;
  }, [workoutHistory, calculateOneRepMax]);

  // Load stats
  const loadStats = useCallback(async () => {
    const now = new Date();
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    const workoutsThisWeek = workoutHistory.filter(w => new Date(w.completedAt) > weekAgo).length;
    const workoutsThisMonth = workoutHistory.filter(w => new Date(w.completedAt) > monthAgo).length;

    const totalVolume = workoutHistory.reduce((sum, w) => sum + w.totalVolume, 0);
    const totalTime = workoutHistory.reduce((sum, w) => sum + w.duration, 0);

    // Calculate muscle group distribution
    const muscleCount: { [key: string]: number } = {};
    workoutHistory.forEach(w => {
      w.musclesWorked.forEach(m => {
        muscleCount[m] = (muscleCount[m] || 0) + 1;
      });
    });
    const totalMuscleOccurrences = Object.values(muscleCount).reduce((a, b) => a + b, 0) || 1;

    // Calculate streak (consecutive workout days)
    const calculateStreaks = () => {
      if (workoutHistory.length === 0) return { current: 0, longest: 0 };

      // Get unique workout dates (normalized to date only)
      const workoutDates = [...new Set(
        workoutHistory.map(w => new Date(w.completedAt).toISOString().split('T')[0])
      )].sort((a, b) => new Date(b).getTime() - new Date(a).getTime());

      if (workoutDates.length === 0) return { current: 0, longest: 0 };

      const today = new Date().toISOString().split('T')[0];
      const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];

      // Current streak: count consecutive days starting from today or yesterday
      let currentStreak = 0;
      const startFromToday = workoutDates[0] === today || workoutDates[0] === yesterday;

      if (startFromToday) {
        currentStreak = 1;
        for (let i = 1; i < workoutDates.length; i++) {
          const prevDate = new Date(workoutDates[i - 1]);
          const currDate = new Date(workoutDates[i]);
          const diffDays = Math.round((prevDate.getTime() - currDate.getTime()) / 86400000);
          if (diffDays === 1) {
            currentStreak++;
          } else {
            break;
          }
        }
      }

      // Longest streak: find the longest consecutive run
      let longestStreak = 1;
      let tempStreak = 1;
      for (let i = 1; i < workoutDates.length; i++) {
        const prevDate = new Date(workoutDates[i - 1]);
        const currDate = new Date(workoutDates[i]);
        const diffDays = Math.round((prevDate.getTime() - currDate.getTime()) / 86400000);
        if (diffDays === 1) {
          tempStreak++;
          longestStreak = Math.max(longestStreak, tempStreak);
        } else {
          tempStreak = 1;
        }
      }

      return { current: currentStreak, longest: Math.max(longestStreak, currentStreak) };
    };

    const streaks = calculateStreaks();

    // Calculate favorite exercises (most frequently performed)
    const exerciseCount: { [id: string]: { name: string; count: number } } = {};
    workoutHistory.forEach(w => {
      w.exercises.forEach(e => {
        if (!exerciseCount[e.exerciseId]) {
          exerciseCount[e.exerciseId] = { name: e.exerciseName, count: 0 };
        }
        exerciseCount[e.exerciseId].count++;
      });
    });

    const favoriteExercises = Object.entries(exerciseCount)
      .map(([exerciseId, data]) => ({
        exerciseId,
        name: data.name,
        count: data.count,
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    const newStats: WorkoutStats = {
      totalWorkouts: workoutHistory.length,
      totalVolume,
      totalTime,
      averageWorkoutDuration: workoutHistory.length > 0 ? totalTime / workoutHistory.length : 0,
      workoutsThisWeek,
      workoutsThisMonth,
      currentStreak: streaks.current,
      longestStreak: streaks.longest,
      favoriteExercises,
      muscleGroupDistribution: Object.entries(muscleCount).map(([muscle, count]) => ({
        muscle,
        percentage: (count / totalMuscleOccurrences) * 100,
      })),
    };

    setStats(newStats);
  }, [workoutHistory]);

  // Get last workout data for an exercise
  const getLastWorkoutForExercise = useCallback((exerciseId: string): WorkoutExerciseLog | null => {
    for (const workout of workoutHistory) {
      const exercise = workout.exercises.find(e => e.exerciseId === exerciseId);
      if (exercise) return exercise;
    }
    return null;
  }, [workoutHistory]);

  const value: WorkoutTrackingContextType = {
    activeWorkout,
    isWorkoutActive: !!activeWorkout,
    workoutTimer,
    workoutHistory,
    personalRecords,
    exerciseHistory: exerciseHistoryMap,
    templates,
    stats,
    recentWorkoutNames,
    isLoading,
    startWorkout,
    startWorkoutFromPlan,
    cancelWorkout,
    completeWorkout,
    pauseWorkout,
    resumeWorkout,
    addExercise,
    removeExercise,
    reorderExercises,
    addSet,
    updateSet,
    deleteSet,
    completeSet,
    saveAsTemplate,
    deleteTemplate,
    loadTemplate,
    loadHistory,
    loadExerciseHistory,
    loadStats,
    loadRecentWorkoutNames,
    getLastWorkoutForExercise,
    calculateOneRepMax,
    repeatWorkout,
  };

  return (
    <WorkoutTrackingContext.Provider value={value}>
      {children}
    </WorkoutTrackingContext.Provider>
  );
}

export function useWorkoutTracking() {
  const context = useContext(WorkoutTrackingContext);
  if (!context) {
    throw new Error('useWorkoutTracking must be used within WorkoutTrackingProvider');
  }
  return context;
}
