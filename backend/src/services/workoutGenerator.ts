/**
 * Workout Generation Service
 *
 * Implements evidence-based workout programming principles from BuiltWithScience:
 * - Proper training splits based on frequency and goals
 * - Volume landmarks (10-20 sets per muscle per week)
 * - Exercise selection for maximum muscle activation
 * - Progressive overload framework
 * - Sport-specific training templates
 * - Health-aware filtering for safe exercise selection
 *
 * NO AI GENERATION - Pure rule-based logic for judge transparency
 */

import {
  filterWorkoutForHealth,
  needsHealthFiltering,
  getHealthFilterSummary,
  UserHealthContext,
  WorkoutFilterResult
} from './workoutFilter';

export interface WorkoutGenerationParams {
  goal: 'muscle_gain' | 'fat_loss' | 'body_recomposition' | 'endurance' | 'general_fitness' | 'sport_specific';
  experienceLevel: 'beginner' | 'intermediate' | 'advanced';
  daysPerWeek: number; // 2-6 days
  sport?: 'football' | 'basketball' | 'volleyball' | 'boxing' | 'swimming' | null;
  healthContext?: UserHealthContext; // Optional health profile for filtering
}

export interface WorkoutSplit {
  name: string;
  description: string;
  workouts: WorkoutDay[];
  rationale: string;
  healthModifications?: {
    wasFiltered: boolean;
    summary: string;
    removedExercises: string[];
    modifiedExercises: string[];
    warnings: string[];
    recommendations: string[];
  };
}

export interface WorkoutDay {
  dayName: string;
  dayOfWeek: number;
  split: string;
  focus: string[];
  exercises: WorkoutExerciseTemplate[];
}

export interface WorkoutExerciseTemplate {
  exerciseName: string;
  sets: number;
  reps: string;
  rest: number; // seconds
  notes: string;
  targetMuscles: string[];
}

/**
 * Main workout generation function
 * Selects appropriate split and exercises based on parameters
 * Applies health-based filtering if healthContext is provided
 */
export function generateWorkoutPlan(params: WorkoutGenerationParams): WorkoutSplit {
  const { goal, experienceLevel, daysPerWeek, sport, healthContext } = params;

  // Generate base workout plan
  let workoutPlan: WorkoutSplit;

  // Sport-specific training takes precedence
  if (goal === 'sport_specific' && sport) {
    workoutPlan = generateSportSpecificPlan(sport, experienceLevel, daysPerWeek);
  } else if (daysPerWeek <= 2) {
    workoutPlan = generateFullBodySplit(goal, experienceLevel, daysPerWeek);
  } else if (daysPerWeek === 3) {
    workoutPlan = generateThreeDaySplit(goal, experienceLevel);
  } else if (daysPerWeek === 4) {
    workoutPlan = generateUpperLowerSplit(goal, experienceLevel);
  } else if (daysPerWeek === 5) {
    workoutPlan = generateFiveDaySplit(goal, experienceLevel);
  } else {
    workoutPlan = generatePushPullLegsSplit(goal, experienceLevel);
  }

  // Apply health filtering if health context is provided
  if (healthContext && needsHealthFiltering(healthContext)) {
    workoutPlan = applyHealthFiltering(workoutPlan, healthContext);
  }

  return workoutPlan;
}

/**
 * Apply health-based filtering to all workouts in a plan
 */
function applyHealthFiltering(plan: WorkoutSplit, healthContext: UserHealthContext): WorkoutSplit {
  const allRemovedExercises: string[] = [];
  const allModifiedExercises: string[] = [];
  const allWarnings: string[] = [];
  const allRecommendations: string[] = [];

  // Filter each workout day
  const filteredWorkouts = plan.workouts.map(workout => {
    const filterResult = filterWorkoutForHealth(workout.exercises, healthContext);

    // Collect all modifications
    filterResult.removedExercises.forEach(ex => {
      if (!allRemovedExercises.includes(ex.name)) {
        allRemovedExercises.push(ex.name);
      }
    });
    filterResult.modifiedExercises.forEach(ex => {
      const modDesc = `${ex.original} → ${ex.replacement}`;
      if (!allModifiedExercises.includes(modDesc)) {
        allModifiedExercises.push(modDesc);
      }
    });
    filterResult.warnings.forEach(w => {
      if (!allWarnings.includes(w)) {
        allWarnings.push(w);
      }
    });
    filterResult.recommendations.forEach(r => {
      if (!allRecommendations.includes(r)) {
        allRecommendations.push(r);
      }
    });

    return {
      ...workout,
      exercises: filterResult.exercises.map(ex => ({
        exerciseName: ex.exerciseName,
        sets: ex.sets,
        reps: ex.reps,
        rest: ex.rest,
        notes: ex.modificationNotes?.length
          ? `${ex.notes} [Modified: ${ex.modificationNotes.join('; ')}]`
          : ex.notes,
        targetMuscles: ex.targetMuscles
      }))
    };
  });

  const summary = getHealthFilterSummary(healthContext);

  return {
    ...plan,
    workouts: filteredWorkouts,
    healthModifications: {
      wasFiltered: true,
      summary,
      removedExercises: allRemovedExercises,
      modifiedExercises: allModifiedExercises,
      warnings: allWarnings,
      recommendations: allRecommendations
    }
  };
}

/**
 * Full Body Split (2 days/week)
 * Best for beginners or time-constrained individuals
 * Trains all major muscle groups each session
 */
function generateFullBodySplit(
  goal: string,
  level: string,
  days: number
): WorkoutSplit {
  const setsPerExercise = level === 'beginner' ? 3 : level === 'intermediate' ? 4 : 5;
  const reps = goal === 'muscle_gain' ? '8-12' : goal === 'endurance' ? '15-20' : '10-15';
  
  const workout: WorkoutDay = {
    dayName: 'Full Body',
    dayOfWeek: 1,
    split: 'full_body',
    focus: ['chest', 'back', 'legs', 'shoulders', 'arms'],
    exercises: [
      {
        exerciseName: 'Barbell Squat',
        sets: setsPerExercise,
        reps: reps,
        rest: 180,
        notes: 'Compound leg exercise - drives overall strength and muscle growth',
        targetMuscles: ['quadriceps', 'glutes', 'hamstrings']
      },
      {
        exerciseName: 'Bench Press',
        sets: setsPerExercise,
        reps: reps,
        rest: 180,
        notes: 'Primary chest builder - also engages triceps and shoulders',
        targetMuscles: ['pectoralis_major', 'triceps', 'anterior_deltoid']
      },
      {
        exerciseName: 'Bent-Over Barbell Row',
        sets: setsPerExercise,
        reps: reps,
        rest: 180,
        notes: 'Targets entire back - lats, traps, rhomboids',
        targetMuscles: ['latissimus_dorsi', 'trapezius', 'rhomboids']
      },
      {
        exerciseName: 'Overhead Press',
        sets: setsPerExercise,
        reps: reps,
        rest: 120,
        notes: 'Builds shoulder strength and size',
        targetMuscles: ['deltoids', 'triceps']
      },
      {
        exerciseName: 'Romanian Deadlift',
        sets: setsPerExercise,
        reps: reps,
        rest: 120,
        notes: 'Posterior chain focus - hamstrings and glutes',
        targetMuscles: ['hamstrings', 'glutes', 'erector_spinae']
      }
    ]
  };
  
  const workouts = days === 2 ? [workout, { ...workout, dayOfWeek: 4 }] : [workout];
  
  return {
    name: `${days}-Day Full Body Split`,
    description: 'Efficient full-body training hitting all major muscle groups each session',
    workouts,
    rationale: 'Full body splits maximize frequency for each muscle group, ideal for beginners or those with limited training days. Each muscle is stimulated 2x/week for optimal growth.'
  };
}

/**
 * 3-Day Split (Push/Pull/Legs or Full Body variation)
 * Balanced approach for intermediate lifters
 */
function generateThreeDaySplit(goal: string, level: string): WorkoutSplit {
  const setsPerExercise = level === 'beginner' ? 3 : 4;
  const reps = goal === 'muscle_gain' ? '8-12' : goal === 'endurance' ? '15-20' : '10-15';
  
  return {
    name: '3-Day Push/Pull/Legs',
    description: 'Classic split separating pushing, pulling, and leg movements',
    workouts: [
      {
        dayName: 'Push (Chest, Shoulders, Triceps)',
        dayOfWeek: 1,
        split: 'push',
        focus: ['chest', 'shoulders', 'triceps'],
        exercises: [
          {
            exerciseName: 'Barbell Bench Press',
            sets: 4,
            reps: '6-10',
            rest: 180,
            notes: 'Heavy compound chest movement',
            targetMuscles: ['pectoralis_major', 'anterior_deltoid', 'triceps']
          },
          {
            exerciseName: 'Incline Dumbbell Press',
            sets: 3,
            reps: '8-12',
            rest: 120,
            notes: 'Upper chest emphasis',
            targetMuscles: ['upper_pectoralis', 'anterior_deltoid']
          },
          {
            exerciseName: 'Overhead Press',
            sets: 4,
            reps: '8-10',
            rest: 120,
            notes: 'Primary shoulder builder',
            targetMuscles: ['deltoids']
          },
          {
            exerciseName: 'Lateral Raises',
            sets: 3,
            reps: '12-15',
            rest: 60,
            notes: 'Isolates medial deltoid for width',
            targetMuscles: ['medial_deltoid']
          },
          {
            exerciseName: 'Tricep Dips',
            sets: 3,
            reps: '8-12',
            rest: 90,
            notes: 'Compound tricep movement',
            targetMuscles: ['triceps', 'lower_pectoralis']
          }
        ]
      },
      {
        dayName: 'Pull (Back, Biceps)',
        dayOfWeek: 3,
        split: 'pull',
        focus: ['back', 'biceps'],
        exercises: [
          {
            exerciseName: 'Deadlift',
            sets: 4,
            reps: '6-8',
            rest: 240,
            notes: 'Total posterior chain - back, glutes, hamstrings',
            targetMuscles: ['erector_spinae', 'latissimus_dorsi', 'trapezius', 'glutes', 'hamstrings']
          },
          {
            exerciseName: 'Pull-Ups',
            sets: 4,
            reps: '8-12',
            rest: 120,
            notes: 'Vertical pulling - lats and upper back',
            targetMuscles: ['latissimus_dorsi', 'teres_major', 'biceps']
          },
          {
            exerciseName: 'Barbell Row',
            sets: 4,
            reps: '8-10',
            rest: 120,
            notes: 'Horizontal pulling - mid back thickness',
            targetMuscles: ['latissimus_dorsi', 'rhomboids', 'trapezius']
          },
          {
            exerciseName: 'Face Pulls',
            sets: 3,
            reps: '15-20',
            rest: 60,
            notes: 'Rear delts and upper back health',
            targetMuscles: ['posterior_deltoid', 'trapezius']
          },
          {
            exerciseName: 'Barbell Curl',
            sets: 3,
            reps: '10-12',
            rest: 90,
            notes: 'Primary bicep mass builder',
            targetMuscles: ['biceps']
          }
        ]
      },
      {
        dayName: 'Legs (Quads, Hamstrings, Glutes, Calves)',
        dayOfWeek: 5,
        split: 'legs',
        focus: ['quadriceps', 'hamstrings', 'glutes', 'calves'],
        exercises: [
          {
            exerciseName: 'Barbell Back Squat',
            sets: 4,
            reps: '6-10',
            rest: 180,
            notes: 'King of leg exercises - total leg development',
            targetMuscles: ['quadriceps', 'glutes', 'hamstrings']
          },
          {
            exerciseName: 'Romanian Deadlift',
            sets: 4,
            reps: '8-12',
            rest: 120,
            notes: 'Hamstring and glute focus',
            targetMuscles: ['hamstrings', 'glutes']
          },
          {
            exerciseName: 'Leg Press',
            sets: 3,
            reps: '12-15',
            rest: 120,
            notes: 'Quad volume without spinal loading',
            targetMuscles: ['quadriceps', 'glutes']
          },
          {
            exerciseName: 'Walking Lunges',
            sets: 3,
            reps: '12-15 each leg',
            rest: 90,
            notes: 'Unilateral leg work - balance and coordination',
            targetMuscles: ['quadriceps', 'glutes', 'hamstrings']
          },
          {
            exerciseName: 'Standing Calf Raise',
            sets: 4,
            reps: '15-20',
            rest: 60,
            notes: 'Calf development',
            targetMuscles: ['gastrocnemius', 'soleus']
          }
        ]
      }
    ],
    rationale: 'PPL split allows for high frequency (each muscle 1-2x/week) with adequate recovery. Separating pushing and pulling movements prevents overlap and maximizes performance in each session.'
  };
}

/**
 * 4-Day Upper/Lower Split
 * Excellent for intermediate to advanced lifters
 */
function generateUpperLowerSplit(goal: string, level: string): WorkoutSplit {
  return {
    name: '4-Day Upper/Lower Split',
    description: 'Train each muscle group 2x/week with dedicated upper and lower days',
    workouts: [
      {
        dayName: 'Upper A (Strength Focus)',
        dayOfWeek: 1,
        split: 'upper',
        focus: ['chest', 'back', 'shoulders', 'arms'],
        exercises: [
          {
            exerciseName: 'Barbell Bench Press',
            sets: 4,
            reps: '6-8',
            rest: 180,
            notes: 'Heavy chest pressing',
            targetMuscles: ['pectoralis_major', 'triceps']
          },
          {
            exerciseName: 'Bent-Over Row',
            sets: 4,
            reps: '6-8',
            rest: 180,
            notes: 'Heavy back work',
            targetMuscles: ['latissimus_dorsi', 'rhomboids']
          },
          {
            exerciseName: 'Overhead Press',
            sets: 3,
            reps: '8-10',
            rest: 120,
            notes: 'Shoulder strength',
            targetMuscles: ['deltoids']
          },
          {
            exerciseName: 'Chin-Ups',
            sets: 3,
            reps: '8-10',
            rest: 120,
            notes: 'Vertical pull with bicep emphasis',
            targetMuscles: ['latissimus_dorsi', 'biceps']
          }
        ]
      },
      {
        dayName: 'Lower A (Quad Focus)',
        dayOfWeek: 2,
        split: 'lower',
        focus: ['quadriceps', 'hamstrings', 'glutes'],
        exercises: [
          {
            exerciseName: 'Back Squat',
            sets: 4,
            reps: '6-8',
            rest: 180,
            notes: 'Heavy squat for quad development',
            targetMuscles: ['quadriceps', 'glutes']
          },
          {
            exerciseName: 'Romanian Deadlift',
            sets: 3,
            reps: '8-10',
            rest: 120,
            notes: 'Hamstring work',
            targetMuscles: ['hamstrings', 'glutes']
          },
          {
            exerciseName: 'Leg Press',
            sets: 3,
            reps: '12-15',
            rest: 90,
            notes: 'Additional quad volume',
            targetMuscles: ['quadriceps']
          },
          {
            exerciseName: 'Leg Curl',
            sets: 3,
            reps: '12-15',
            rest: 60,
            notes: 'Hamstring isolation',
            targetMuscles: ['hamstrings']
          }
        ]
      },
      {
        dayName: 'Upper B (Hypertrophy Focus)',
        dayOfWeek: 4,
        split: 'upper',
        focus: ['chest', 'back', 'shoulders', 'arms'],
        exercises: [
          {
            exerciseName: 'Incline Dumbbell Press',
            sets: 4,
            reps: '10-12',
            rest: 90,
            notes: 'Upper chest development',
            targetMuscles: ['upper_pectoralis']
          },
          {
            exerciseName: 'Cable Rows',
            sets: 4,
            reps: '10-12',
            rest: 90,
            notes: 'Constant tension on back',
            targetMuscles: ['latissimus_dorsi', 'rhomboids']
          },
          {
            exerciseName: 'Lateral Raises',
            sets: 4,
            reps: '12-15',
            rest: 60,
            notes: 'Shoulder width',
            targetMuscles: ['medial_deltoid']
          },
          {
            exerciseName: 'Barbell Curl',
            sets: 3,
            reps: '10-12',
            rest: 60,
            notes: 'Bicep mass',
            targetMuscles: ['biceps']
          },
          {
            exerciseName: 'Tricep Pushdown',
            sets: 3,
            reps: '12-15',
            rest: 60,
            notes: 'Tricep isolation',
            targetMuscles: ['triceps']
          }
        ]
      },
      {
        dayName: 'Lower B (Posterior Chain Focus)',
        dayOfWeek: 5,
        split: 'lower',
        focus: ['hamstrings', 'glutes', 'quadriceps'],
        exercises: [
          {
            exerciseName: 'Conventional Deadlift',
            sets: 4,
            reps: '6-8',
            rest: 240,
            notes: 'Total posterior chain strength',
            targetMuscles: ['hamstrings', 'glutes', 'erector_spinae']
          },
          {
            exerciseName: 'Front Squat',
            sets: 3,
            reps: '8-10',
            rest: 120,
            notes: 'Quad-focused squat variation',
            targetMuscles: ['quadriceps']
          },
          {
            exerciseName: 'Bulgarian Split Squat',
            sets: 3,
            reps: '10-12 each',
            rest: 90,
            notes: 'Unilateral leg development',
            targetMuscles: ['quadriceps', 'glutes']
          },
          {
            exerciseName: 'Calf Raises',
            sets: 4,
            reps: '15-20',
            rest: 60,
            notes: 'Calf development',
            targetMuscles: ['gastrocnemius', 'soleus']
          }
        ]
      }
    ],
    rationale: 'Upper/lower split hits each muscle 2x/week with varied rep ranges and exercise selection. First session focuses on strength (heavier), second on hypertrophy (higher volume). Optimal for muscle growth.'
  };
}

/**
 * 5-Day Split (Bro split variant)
 * Each major muscle group gets dedicated day
 */
function generateFiveDaySplit(goal: string, level: string): WorkoutSplit {
  const setsPerExercise = level === 'beginner' ? 3 : level === 'intermediate' ? 4 : 5;
  const reps = goal === 'muscle_gain' ? '8-12' : goal === 'endurance' ? '15-20' : '10-15';

  return {
    name: '5-Day Body Part Split',
    description: 'Dedicated day for each major muscle group with maximum focus and volume',
    workouts: [
      {
        dayName: 'Chest Day',
        dayOfWeek: 1,
        split: 'chest',
        focus: ['pectoralis_major', 'pectoralis_minor'],
        exercises: [
          {
            exerciseName: 'Barbell Bench Press',
            sets: 4,
            reps: '6-10',
            rest: 180,
            notes: 'Primary chest mass builder - flat angle for overall development',
            targetMuscles: ['pectoralis_major', 'anterior_deltoid', 'triceps']
          },
          {
            exerciseName: 'Incline Dumbbell Press',
            sets: 4,
            reps: '8-12',
            rest: 120,
            notes: 'Upper chest emphasis - 30-45 degree incline',
            targetMuscles: ['upper_pectoralis', 'anterior_deltoid']
          },
          {
            exerciseName: 'Dumbbell Flyes',
            sets: 3,
            reps: '12-15',
            rest: 90,
            notes: 'Chest isolation - focus on stretch and squeeze',
            targetMuscles: ['pectoralis_major']
          },
          {
            exerciseName: 'Cable Crossovers',
            sets: 3,
            reps: '12-15',
            rest: 60,
            notes: 'Constant tension throughout ROM',
            targetMuscles: ['pectoralis_major', 'pectoralis_minor']
          },
          {
            exerciseName: 'Push-Ups',
            sets: 3,
            reps: 'To failure',
            rest: 60,
            notes: 'Finisher - pump and endurance',
            targetMuscles: ['pectoralis_major', 'triceps']
          }
        ]
      },
      {
        dayName: 'Back Day',
        dayOfWeek: 2,
        split: 'back',
        focus: ['latissimus_dorsi', 'trapezius', 'rhomboids'],
        exercises: [
          {
            exerciseName: 'Deadlift',
            sets: 4,
            reps: '5-8',
            rest: 240,
            notes: 'Total back thickness and posterior chain strength',
            targetMuscles: ['erector_spinae', 'latissimus_dorsi', 'trapezius', 'glutes', 'hamstrings']
          },
          {
            exerciseName: 'Pull-Ups',
            sets: 4,
            reps: '8-12',
            rest: 120,
            notes: 'Lat width - go for full stretch and squeeze',
            targetMuscles: ['latissimus_dorsi', 'teres_major', 'biceps']
          },
          {
            exerciseName: 'Barbell Row',
            sets: 4,
            reps: '8-10',
            rest: 120,
            notes: 'Mid-back thickness - keep torso at 45 degrees',
            targetMuscles: ['latissimus_dorsi', 'rhomboids', 'trapezius']
          },
          {
            exerciseName: 'Seated Cable Row',
            sets: 3,
            reps: '10-12',
            rest: 90,
            notes: 'Squeeze shoulder blades at peak contraction',
            targetMuscles: ['latissimus_dorsi', 'rhomboids']
          },
          {
            exerciseName: 'Face Pulls',
            sets: 3,
            reps: '15-20',
            rest: 60,
            notes: 'Rear delt and upper back health',
            targetMuscles: ['posterior_deltoid', 'trapezius', 'rhomboids']
          }
        ]
      },
      {
        dayName: 'Shoulders Day',
        dayOfWeek: 3,
        split: 'shoulders',
        focus: ['anterior_deltoid', 'medial_deltoid', 'posterior_deltoid'],
        exercises: [
          {
            exerciseName: 'Overhead Press',
            sets: 4,
            reps: '6-10',
            rest: 180,
            notes: 'Primary shoulder mass builder',
            targetMuscles: ['anterior_deltoid', 'medial_deltoid', 'triceps']
          },
          {
            exerciseName: 'Dumbbell Lateral Raises',
            sets: 4,
            reps: '12-15',
            rest: 60,
            notes: 'Shoulder width - slight lean forward',
            targetMuscles: ['medial_deltoid']
          },
          {
            exerciseName: 'Reverse Pec Deck',
            sets: 4,
            reps: '12-15',
            rest: 60,
            notes: 'Rear delt isolation',
            targetMuscles: ['posterior_deltoid']
          },
          {
            exerciseName: 'Arnold Press',
            sets: 3,
            reps: '10-12',
            rest: 90,
            notes: 'Hits all three delt heads through rotation',
            targetMuscles: ['anterior_deltoid', 'medial_deltoid']
          },
          {
            exerciseName: 'Shrugs',
            sets: 4,
            reps: '12-15',
            rest: 60,
            notes: 'Upper trap development',
            targetMuscles: ['trapezius']
          }
        ]
      },
      {
        dayName: 'Legs Day',
        dayOfWeek: 4,
        split: 'legs',
        focus: ['quadriceps', 'hamstrings', 'glutes', 'calves'],
        exercises: [
          {
            exerciseName: 'Barbell Back Squat',
            sets: 4,
            reps: '6-10',
            rest: 180,
            notes: 'King of leg exercises - total leg development',
            targetMuscles: ['quadriceps', 'glutes', 'hamstrings']
          },
          {
            exerciseName: 'Romanian Deadlift',
            sets: 4,
            reps: '8-12',
            rest: 120,
            notes: 'Hamstring focus - maintain slight knee bend',
            targetMuscles: ['hamstrings', 'glutes']
          },
          {
            exerciseName: 'Leg Press',
            sets: 4,
            reps: '12-15',
            rest: 90,
            notes: 'Quad volume without spinal loading',
            targetMuscles: ['quadriceps', 'glutes']
          },
          {
            exerciseName: 'Leg Curl',
            sets: 3,
            reps: '12-15',
            rest: 60,
            notes: 'Hamstring isolation',
            targetMuscles: ['hamstrings']
          },
          {
            exerciseName: 'Leg Extension',
            sets: 3,
            reps: '12-15',
            rest: 60,
            notes: 'Quad isolation - focus on peak contraction',
            targetMuscles: ['quadriceps']
          },
          {
            exerciseName: 'Standing Calf Raise',
            sets: 4,
            reps: '15-20',
            rest: 60,
            notes: 'Full ROM - stretch at bottom, squeeze at top',
            targetMuscles: ['gastrocnemius', 'soleus']
          }
        ]
      },
      {
        dayName: 'Arms Day',
        dayOfWeek: 5,
        split: 'arms',
        focus: ['biceps', 'triceps', 'forearms'],
        exercises: [
          {
            exerciseName: 'Barbell Curl',
            sets: 4,
            reps: '8-12',
            rest: 90,
            notes: 'Primary bicep mass builder',
            targetMuscles: ['biceps']
          },
          {
            exerciseName: 'Close-Grip Bench Press',
            sets: 4,
            reps: '8-10',
            rest: 120,
            notes: 'Compound tricep movement - heavy loading',
            targetMuscles: ['triceps', 'pectoralis_major']
          },
          {
            exerciseName: 'Incline Dumbbell Curl',
            sets: 3,
            reps: '10-12',
            rest: 60,
            notes: 'Long head bicep emphasis',
            targetMuscles: ['biceps']
          },
          {
            exerciseName: 'Skull Crushers',
            sets: 3,
            reps: '10-12',
            rest: 90,
            notes: 'Tricep long head focus',
            targetMuscles: ['triceps']
          },
          {
            exerciseName: 'Hammer Curls',
            sets: 3,
            reps: '12-15',
            rest: 60,
            notes: 'Brachialis and forearm development',
            targetMuscles: ['brachialis', 'forearms']
          },
          {
            exerciseName: 'Tricep Pushdown',
            sets: 3,
            reps: '12-15',
            rest: 60,
            notes: 'Tricep isolation - squeeze at full extension',
            targetMuscles: ['triceps']
          }
        ]
      }
    ],
    rationale: '5-day split allows maximum volume and focus per muscle group. Each body part gets fully trained with 15-25 sets when recovered, optimal for intermediate to advanced lifters seeking maximum hypertrophy.'
  };
}

/**
 * 6-Day Push/Pull/Legs (2x per week)
 * High frequency for advanced lifters
 */
function generatePushPullLegsSplit(goal: string, level: string): WorkoutSplit {
  // Run PPL twice per week
  const threeDayPPL = generateThreeDaySplit(goal, level);
  
  return {
    name: '6-Day Push/Pull/Legs (2x Frequency)',
    description: 'PPL split performed twice per week for maximum frequency',
    workouts: [
      ...threeDayPPL.workouts,
      { ...threeDayPPL.workouts[0], dayOfWeek: 4, dayName: 'Push (Repeat)' },
      { ...threeDayPPL.workouts[1], dayOfWeek: 5, dayName: 'Pull (Repeat)' },
      { ...threeDayPPL.workouts[2], dayOfWeek: 6, dayName: 'Legs (Repeat)' }
    ],
    rationale: 'Training each muscle group 2x/week maximizes muscle protein synthesis frequency. Ideal for advanced lifters who can recover from high training volumes.'
  };
}

/**
 * Sport-specific workout templates
 * Combines strength training with sport-specific movements
 */
function generateSportSpecificPlan(
  sport: string,
  level: string,
  days: number
): WorkoutSplit {
  switch (sport) {
    case 'football':
      return generateFootballPlan(level, days);
    case 'basketball':
      return generateBasketballPlan(level, days);
    case 'volleyball':
      return generateVolleyballPlan(level, days);
    case 'boxing':
      return generateBoxingPlan(level, days);
    case 'swimming':
      return generateSwimmingPlan(level, days);
    default:
      return generateThreeDaySplit('sport_specific', level);
  }
}

function generateFootballPlan(level: string, days: number): WorkoutSplit {
  return {
    name: 'Football Strength & Power Program',
    description: 'Builds explosive power, speed, and functional strength for football',
    workouts: [
      {
        dayName: 'Lower Body Power',
        dayOfWeek: 1,
        split: 'lower_power',
        focus: ['explosive_strength', 'speed', 'agility'],
        exercises: [
          {
            exerciseName: 'Box Jumps',
            sets: 4,
            reps: '5',
            rest: 120,
            notes: 'Develops explosive leg power for jumping and sprinting',
            targetMuscles: ['quadriceps', 'glutes', 'calves']
          },
          {
            exerciseName: 'Back Squat',
            sets: 4,
            reps: '5-6',
            rest: 180,
            notes: 'Heavy strength foundation for lower body',
            targetMuscles: ['quadriceps', 'glutes']
          },
          {
            exerciseName: 'Romanian Deadlift',
            sets: 3,
            reps: '8',
            rest: 120,
            notes: 'Strengthens hamstrings (injury prevention)',
            targetMuscles: ['hamstrings', 'glutes']
          },
          {
            exerciseName: 'Sled Push',
            sets: 5,
            reps: '20m',
            rest: 90,
            notes: 'Sport-specific: mimics blocking and driving through opponents',
            targetMuscles: ['quadriceps', 'glutes', 'calves']
          }
        ]
      },
      {
        dayName: 'Upper Body Strength',
        dayOfWeek: 3,
        split: 'upper_strength',
        focus: ['pushing_power', 'core_stability'],
        exercises: [
          {
            exerciseName: 'Bench Press',
            sets: 4,
            reps: '6-8',
            rest: 180,
            notes: 'Builds pushing strength for blocking',
            targetMuscles: ['pectoralis_major', 'triceps']
          },
          {
            exerciseName: 'Pull-Ups',
            sets: 4,
            reps: '8-10',
            rest: 120,
            notes: 'Upper back strength for tackling',
            targetMuscles: ['latissimus_dorsi']
          },
          {
            exerciseName: 'Overhead Press',
            sets: 3,
            reps: '8',
            rest: 120,
            notes: 'Shoulder stability and strength',
            targetMuscles: ['deltoids']
          },
          {
            exerciseName: 'Plank Variations',
            sets: 3,
            reps: '60s',
            rest: 60,
            notes: 'Core stability for contact situations',
            targetMuscles: ['rectus_abdominis', 'obliques']
          }
        ]
      },
      {
        dayName: 'Speed & Agility',
        dayOfWeek: 5,
        split: 'conditioning',
        focus: ['speed', 'agility', 'endurance'],
        exercises: [
          {
            exerciseName: 'Sprint Intervals',
            sets: 8,
            reps: '40m',
            rest: 120,
            notes: 'Develops acceleration and top-end speed',
            targetMuscles: ['full_body_cardio']
          },
          {
            exerciseName: 'Cone Drills',
            sets: 6,
            reps: '1 set',
            rest: 90,
            notes: 'Improves change of direction',
            targetMuscles: ['quadriceps', 'glutes', 'core']
          },
          {
            exerciseName: 'Trap Bar Deadlift',
            sets: 3,
            reps: '6',
            rest: 180,
            notes: 'Total body power and explosiveness',
            targetMuscles: ['hamstrings', 'glutes', 'back']
          }
        ]
      }
    ],
    rationale: 'Football requires explosive power, speed, and collision strength. Training emphasizes compound movements for total body power, plyometrics for explosiveness, and sport-specific conditioning.'
  };
}

function generateBasketballPlan(level: string, days: number): WorkoutSplit {
  return {
    name: 'Basketball Performance Program',
    description: 'Develops vertical jump, lateral agility, and endurance for basketball',
    workouts: [
      {
        dayName: 'Lower Body Explosiveness',
        dayOfWeek: 1,
        split: 'lower_explosive',
        focus: ['vertical_jump', 'lateral_quickness'],
        exercises: [
          {
            exerciseName: 'Depth Jumps',
            sets: 4,
            reps: '6',
            rest: 120,
            notes: 'Develops reactive strength for jumping',
            targetMuscles: ['quadriceps', 'glutes', 'calves']
          },
          {
            exerciseName: 'Bulgarian Split Squat',
            sets: 3,
            reps: '8 each leg',
            rest: 90,
            notes: 'Single-leg strength for jumping and cutting',
            targetMuscles: ['quadriceps', 'glutes']
          },
          {
            exerciseName: 'Lateral Bounds',
            sets: 4,
            reps: '10 each side',
            rest: 60,
            notes: 'Mimics defensive sliding and cutting movements',
            targetMuscles: ['adductors', 'abductors', 'glutes']
          }
        ]
      },
      {
        dayName: 'Upper Body & Core',
        dayOfWeek: 3,
        split: 'upper_core',
        focus: ['shoulder_health', 'core_rotation'],
        exercises: [
          {
            exerciseName: 'Push-Ups',
            sets: 4,
            reps: '15-20',
            rest: 60,
            notes: 'Functional upper body strength',
            targetMuscles: ['pectoralis', 'triceps']
          },
          {
            exerciseName: 'Dumbbell Rows',
            sets: 3,
            reps: '12 each arm',
            rest: 60,
            notes: 'Back strength and shoulder stability',
            targetMuscles: ['latissimus_dorsi']
          },
          {
            exerciseName: 'Medicine Ball Rotational Throws',
            sets: 4,
            reps: '10 each side',
            rest: 60,
            notes: 'Develops rotational power for shooting',
            targetMuscles: ['obliques', 'core']
          }
        ]
      }
    ],
    rationale: 'Basketball demands vertical explosiveness, lateral agility, and endurance. Program focuses on plyometrics for jumping, single-leg stability, and rotational core strength for shooting power.'
  };
}

// Additional sport-specific functions would follow similar patterns
function generateVolleyballPlan(level: string, days: number): WorkoutSplit {
  return {
    name: 'Volleyball Performance Program',
    description: 'Develops vertical jump, shoulder health, and reactive power for volleyball',
    workouts: [
      {
        dayName: 'Lower Body Power',
        dayOfWeek: 1,
        split: 'lower_power',
        focus: ['vertical_jump', 'explosiveness'],
        exercises: [
          {
            exerciseName: 'Box Jumps',
            sets: 4,
            reps: '6',
            rest: 120,
            notes: 'Develop explosive jumping power',
            targetMuscles: ['quadriceps', 'glutes', 'calves']
          },
          {
            exerciseName: 'Back Squat',
            sets: 4,
            reps: '6-8',
            rest: 180,
            notes: 'Foundational leg strength',
            targetMuscles: ['quadriceps', 'glutes']
          },
          {
            exerciseName: 'Bulgarian Split Squat',
            sets: 3,
            reps: '10 each leg',
            rest: 90,
            notes: 'Single-leg power for jumping',
            targetMuscles: ['quadriceps', 'glutes']
          },
          {
            exerciseName: 'Calf Raises',
            sets: 4,
            reps: '15-20',
            rest: 60,
            notes: 'Ankle strength for jumping and landing',
            targetMuscles: ['gastrocnemius', 'soleus']
          }
        ]
      },
      {
        dayName: 'Upper Body & Shoulder Health',
        dayOfWeek: 3,
        split: 'upper',
        focus: ['shoulder_stability', 'rotator_cuff'],
        exercises: [
          {
            exerciseName: 'Dumbbell Shoulder Press',
            sets: 4,
            reps: '10-12',
            rest: 90,
            notes: 'Shoulder strength for spiking',
            targetMuscles: ['deltoids']
          },
          {
            exerciseName: 'Face Pulls',
            sets: 4,
            reps: '15-20',
            rest: 60,
            notes: 'Rotator cuff health - critical for volleyball',
            targetMuscles: ['posterior_deltoid', 'rotator_cuff']
          },
          {
            exerciseName: 'Lat Pulldown',
            sets: 4,
            reps: '10-12',
            rest: 90,
            notes: 'Pulling strength for blocking',
            targetMuscles: ['latissimus_dorsi']
          },
          {
            exerciseName: 'External Rotations',
            sets: 3,
            reps: '15 each arm',
            rest: 60,
            notes: 'Rotator cuff strengthening',
            targetMuscles: ['rotator_cuff']
          }
        ]
      },
      {
        dayName: 'Plyometrics & Core',
        dayOfWeek: 5,
        split: 'plyo',
        focus: ['reactive_power', 'core_stability'],
        exercises: [
          {
            exerciseName: 'Depth Jumps',
            sets: 4,
            reps: '6',
            rest: 120,
            notes: 'Reactive jumping power',
            targetMuscles: ['quadriceps', 'glutes']
          },
          {
            exerciseName: 'Medicine Ball Slams',
            sets: 4,
            reps: '10',
            rest: 60,
            notes: 'Explosive power for spiking',
            targetMuscles: ['core', 'shoulders', 'lats']
          },
          {
            exerciseName: 'Plank Variations',
            sets: 3,
            reps: '45s each',
            rest: 60,
            notes: 'Core stability for jumping and landing',
            targetMuscles: ['rectus_abdominis', 'obliques']
          }
        ]
      }
    ],
    rationale: 'Volleyball requires explosive vertical jumping, shoulder stability for overhead motions, and reactive power. Program emphasizes plyometrics, rotator cuff health, and single-leg strength.'
  };
}

function generateBoxingPlan(level: string, days: number): WorkoutSplit {
  return {
    name: 'Boxing Strength & Conditioning',
    description: 'Builds punching power, endurance, and rotational strength for boxing',
    workouts: [
      {
        dayName: 'Upper Body Power',
        dayOfWeek: 1,
        split: 'upper_power',
        focus: ['punching_power', 'shoulder_endurance'],
        exercises: [
          {
            exerciseName: 'Medicine Ball Chest Pass',
            sets: 4,
            reps: '10',
            rest: 90,
            notes: 'Explosive pushing power for jabs and crosses',
            targetMuscles: ['pectoralis_major', 'triceps', 'anterior_deltoid']
          },
          {
            exerciseName: 'Push-Ups',
            sets: 4,
            reps: '20-30',
            rest: 60,
            notes: 'Endurance for repeated punching',
            targetMuscles: ['pectoralis_major', 'triceps']
          },
          {
            exerciseName: 'Pull-Ups',
            sets: 4,
            reps: '10-12',
            rest: 90,
            notes: 'Pulling strength for clinch work',
            targetMuscles: ['latissimus_dorsi', 'biceps']
          },
          {
            exerciseName: 'Landmine Press',
            sets: 3,
            reps: '10 each arm',
            rest: 60,
            notes: 'Rotational pressing mimics punch mechanics',
            targetMuscles: ['deltoids', 'core']
          }
        ]
      },
      {
        dayName: 'Lower Body & Core',
        dayOfWeek: 3,
        split: 'lower_core',
        focus: ['leg_drive', 'rotational_power'],
        exercises: [
          {
            exerciseName: 'Back Squat',
            sets: 4,
            reps: '8-10',
            rest: 120,
            notes: 'Leg strength for power generation',
            targetMuscles: ['quadriceps', 'glutes']
          },
          {
            exerciseName: 'Romanian Deadlift',
            sets: 3,
            reps: '10-12',
            rest: 90,
            notes: 'Posterior chain for hip drive in punches',
            targetMuscles: ['hamstrings', 'glutes']
          },
          {
            exerciseName: 'Medicine Ball Rotational Throws',
            sets: 4,
            reps: '10 each side',
            rest: 60,
            notes: 'Rotational power - core of punching mechanics',
            targetMuscles: ['obliques', 'core']
          },
          {
            exerciseName: 'Russian Twists',
            sets: 3,
            reps: '20 total',
            rest: 60,
            notes: 'Core rotation endurance',
            targetMuscles: ['obliques']
          }
        ]
      },
      {
        dayName: 'Conditioning',
        dayOfWeek: 5,
        split: 'conditioning',
        focus: ['cardio_endurance', 'recovery'],
        exercises: [
          {
            exerciseName: 'Jump Rope',
            sets: 5,
            reps: '3 min rounds',
            rest: 60,
            notes: 'Footwork and cardio - boxing staple',
            targetMuscles: ['calves', 'cardio']
          },
          {
            exerciseName: 'Burpees',
            sets: 4,
            reps: '15',
            rest: 60,
            notes: 'Full body conditioning',
            targetMuscles: ['full_body']
          },
          {
            exerciseName: 'Battle Ropes',
            sets: 4,
            reps: '30s',
            rest: 60,
            notes: 'Shoulder endurance and grip',
            targetMuscles: ['shoulders', 'core', 'grip']
          },
          {
            exerciseName: 'Shadow Boxing',
            sets: 5,
            reps: '3 min rounds',
            rest: 60,
            notes: 'Sport-specific movement patterns',
            targetMuscles: ['full_body']
          }
        ]
      }
    ],
    rationale: 'Boxing requires rotational power, shoulder endurance, and exceptional cardio. Program focuses on explosive movements, core rotation, and high-rep conditioning to match fight demands.'
  };
}

function generateSwimmingPlan(level: string, days: number): WorkoutSplit {
  return {
    name: 'Swimming Strength Program',
    description: 'Develops pulling power, shoulder stability, and core strength for swimming',
    workouts: [
      {
        dayName: 'Pull Strength',
        dayOfWeek: 1,
        split: 'pull',
        focus: ['lat_strength', 'pulling_power'],
        exercises: [
          {
            exerciseName: 'Lat Pulldown',
            sets: 4,
            reps: '10-12',
            rest: 90,
            notes: 'Primary lat development for pulling through water',
            targetMuscles: ['latissimus_dorsi', 'teres_major']
          },
          {
            exerciseName: 'Straight-Arm Pulldown',
            sets: 4,
            reps: '12-15',
            rest: 60,
            notes: 'Mimics catch phase of stroke',
            targetMuscles: ['latissimus_dorsi']
          },
          {
            exerciseName: 'Dumbbell Row',
            sets: 3,
            reps: '12 each arm',
            rest: 60,
            notes: 'Unilateral pulling strength',
            targetMuscles: ['latissimus_dorsi', 'rhomboids']
          },
          {
            exerciseName: 'Face Pulls',
            sets: 3,
            reps: '15-20',
            rest: 60,
            notes: 'Shoulder health and rear delt',
            targetMuscles: ['posterior_deltoid', 'rotator_cuff']
          }
        ]
      },
      {
        dayName: 'Core & Stability',
        dayOfWeek: 3,
        split: 'core',
        focus: ['core_stability', 'body_position'],
        exercises: [
          {
            exerciseName: 'Plank',
            sets: 4,
            reps: '60s',
            rest: 60,
            notes: 'Core stability for streamlined position',
            targetMuscles: ['rectus_abdominis', 'obliques']
          },
          {
            exerciseName: 'Flutter Kicks',
            sets: 4,
            reps: '30s',
            rest: 45,
            notes: 'Mimics kicking motion',
            targetMuscles: ['hip_flexors', 'core']
          },
          {
            exerciseName: 'Superman Hold',
            sets: 3,
            reps: '30s',
            rest: 45,
            notes: 'Back extension for body position',
            targetMuscles: ['erector_spinae', 'glutes']
          },
          {
            exerciseName: 'Dead Bug',
            sets: 3,
            reps: '10 each side',
            rest: 45,
            notes: 'Core stability with limb movement',
            targetMuscles: ['rectus_abdominis', 'obliques']
          }
        ]
      },
      {
        dayName: 'Lower Body & Shoulders',
        dayOfWeek: 5,
        split: 'lower_shoulders',
        focus: ['kick_power', 'shoulder_stability'],
        exercises: [
          {
            exerciseName: 'Goblet Squat',
            sets: 4,
            reps: '12-15',
            rest: 90,
            notes: 'Leg strength for powerful kicks',
            targetMuscles: ['quadriceps', 'glutes']
          },
          {
            exerciseName: 'External Rotations',
            sets: 3,
            reps: '15 each arm',
            rest: 45,
            notes: 'Rotator cuff health - critical for swimmers',
            targetMuscles: ['rotator_cuff']
          },
          {
            exerciseName: 'Dumbbell Shoulder Press',
            sets: 3,
            reps: '10-12',
            rest: 90,
            notes: 'Shoulder strength and stability',
            targetMuscles: ['deltoids']
          },
          {
            exerciseName: 'Band Pull-Aparts',
            sets: 3,
            reps: '20',
            rest: 45,
            notes: 'Posterior shoulder health',
            targetMuscles: ['posterior_deltoid', 'rhomboids']
          }
        ]
      }
    ],
    rationale: 'Swimming demands strong pulling muscles, exceptional core stability, and healthy shoulders. Program emphasizes lat strength for propulsion, core work for body position, and rotator cuff exercises for injury prevention.'
  };
}
