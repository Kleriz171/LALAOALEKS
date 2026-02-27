/**
 * Injury Prevention Service
 * 
 * Tracks muscle usage patterns and provides intelligent rest recommendations
 * to prevent overtraining and reduce injury risk.
 * 
 * Key principles:
 * - Monitor training frequency per muscle group
 * - Track recovery time based on muscle physiology
 * - Detect overuse patterns before they become injuries
 * - Provide actionable recommendations
 */

export interface MuscleUsageData {
  muscleId: string;
  muscleName: string;
  lastWorkedDate: Date;
  workoutFrequency: number; // times per week
  intensity: number; // 1-10 scale
  recoveryTimeHours: number; // Required recovery time for this muscle
  isRecovered: boolean;
}

export interface InjuryRiskAssessment {
  riskLevel: 'low' | 'moderate' | 'high' | 'very_high';
  overusedMuscles: OverusedMuscle[];
  recommendations: string[];
  needsRestDay: boolean;
}

export interface OverusedMuscle {
  muscleName: string;
  issueType: 'insufficient_recovery' | 'excessive_frequency' | 'high_cumulative_fatigue';
  recommendation: string;
  daysSinceLastWorked: number;
  requiredRecoveryDays: number;
}

/**
 * Analyze muscle usage patterns and assess injury risk
 */
export function assessInjuryRisk(
  muscleUsageData: MuscleUsageData[],
  workoutFrequency: number
): InjuryRiskAssessment {
  const overusedMuscles: OverusedMuscle[] = [];
  const recommendations: string[] = [];
  
  // Check each muscle for overuse patterns
  for (const muscle of muscleUsageData) {
    const hoursSinceLastWorked = getHoursSince(muscle.lastWorkedDate);
    const daysSinceLastWorked = hoursSinceLastWorked / 24;
    const requiredRecoveryDays = muscle.recoveryTimeHours / 24;
    
    // Pattern 1: Insufficient recovery time
    if (!muscle.isRecovered && hoursSinceLastWorked < muscle.recoveryTimeHours) {
      overusedMuscles.push({
        muscleName: muscle.muscleName,
        issueType: 'insufficient_recovery',
        recommendation: `Allow ${Math.ceil(requiredRecoveryDays - daysSinceLastWorked)} more day(s) before training ${muscle.muscleName}`,
        daysSinceLastWorked,
        requiredRecoveryDays
      });
    }
    
    // Pattern 2: Excessive training frequency
    // Most muscles shouldn't be trained more than 2-3x per week at high intensity
    if (muscle.workoutFrequency > 3 && muscle.intensity >= 7) {
      overusedMuscles.push({
        muscleName: muscle.muscleName,
        issueType: 'excessive_frequency',
        recommendation: `Reduce ${muscle.muscleName} training frequency to 2-3x per week`,
        daysSinceLastWorked,
        requiredRecoveryDays
      });
    }
    
    // Pattern 3: High intensity with minimal rest
    if (muscle.intensity >= 8 && daysSinceLastWorked < 2) {
      overusedMuscles.push({
        muscleName: muscle.muscleName,
        issueType: 'high_cumulative_fatigue',
        recommendation: `High-intensity training detected. Rest ${muscle.muscleName} for 48-72 hours`,
        daysSinceLastWorked,
        requiredRecoveryDays: 3
      });
    }
  }
  
  // Generate risk level
  const riskLevel = determineRiskLevel(overusedMuscles.length, muscleUsageData.length);
  
  // Generate overall recommendations
  if (riskLevel === 'very_high' || riskLevel === 'high') {
    recommendations.push('⚠️ Take a full rest day to allow complete recovery');
    recommendations.push('Consider deload week if symptoms persist');
  }
  
  if (overusedMuscles.length > 0) {
    recommendations.push('Focus on underworked muscle groups in next session');
    recommendations.push('Incorporate mobility and stretching work');
  }
  
  // Check for balanced training
  const upperBodyMuscles = muscleUsageData.filter(m => 
    ['chest', 'back', 'shoulders', 'biceps', 'triceps'].some(part => 
      m.muscleName.toLowerCase().includes(part)
    )
  );
  
  const lowerBodyMuscles = muscleUsageData.filter(m => 
    ['quad', 'hamstring', 'glute', 'calf'].some(part => 
      m.muscleName.toLowerCase().includes(part)
    )
  );
  
  const upperAvgFreq = average(upperBodyMuscles.map(m => m.workoutFrequency));
  const lowerAvgFreq = average(lowerBodyMuscles.map(m => m.workoutFrequency));
  
  if (upperAvgFreq > lowerAvgFreq * 1.5) {
    recommendations.push('⚖️ Balance needed: Increase lower body training frequency');
  } else if (lowerAvgFreq > upperAvgFreq * 1.5) {
    recommendations.push('⚖️ Balance needed: Increase upper body training frequency');
  }
  
  const needsRestDay = riskLevel === 'very_high' || riskLevel === 'high';
  
  return {
    riskLevel,
    overusedMuscles,
    recommendations,
    needsRestDay
  };
}

/**
 * Determine overall risk level based on number of overused muscles
 */
function determineRiskLevel(
  overusedCount: number,
  totalMusclesTracked: number
): 'low' | 'moderate' | 'high' | 'very_high' {
  const percentage = (overusedCount / totalMusclesTracked) * 100;
  
  if (percentage === 0) return 'low';
  if (percentage < 20) return 'moderate';
  if (percentage < 40) return 'high';
  return 'very_high';
}

/**
 * Calculate recovery status for a muscle
 */
export function isMuscleFullyRecovered(
  lastWorkedDate: Date,
  recoveryTimeHours: number,
  intensity: number
): boolean {
  const hoursSince = getHoursSince(lastWorkedDate);
  
  // Adjust recovery time based on intensity
  // Higher intensity requires more recovery
  const adjustedRecoveryTime = recoveryTimeHours * (intensity / 7);
  
  return hoursSince >= adjustedRecoveryTime;
}

/**
 * Suggest alternative exercises for overused muscles
 */
export function suggestAlternativeExercises(
  overusedMuscle: string,
  allBodyParts: string[]
): string[] {
  // Find antagonist or supporting muscles that could be trained instead
  const alternatives: { [key: string]: string[] } = {
    'pectoralis': ['latissimus_dorsi', 'trapezius', 'rhomboids'],
    'latissimus_dorsi': ['pectoralis', 'anterior_deltoid'],
    'quadriceps': ['hamstrings', 'glutes'],
    'hamstrings': ['quadriceps', 'calves'],
    'biceps': ['triceps', 'forearms'],
    'triceps': ['biceps', 'shoulders'],
    'anterior_deltoid': ['posterior_deltoid', 'trapezius'],
  };
  
  const suggested = alternatives[overusedMuscle.toLowerCase()] || [];
  return suggested.filter(alt => allBodyParts.includes(alt));
}

/**
 * Calculate recommended rest days before next workout
 */
export function calculateRestDaysNeeded(
  muscle: MuscleUsageData
): number {
  const hoursSince = getHoursSince(muscle.lastWorkedDate);
  const hoursNeeded = muscle.recoveryTimeHours * (muscle.intensity / 7);
  const hoursRemaining = Math.max(0, hoursNeeded - hoursSince);
  
  return Math.ceil(hoursRemaining / 24);
}

/**
 * Generate recovery plan for overtraining
 */
export function generateRecoveryPlan(
  assessment: InjuryRiskAssessment
): {
  restDays: number;
  activities: string[];
  nutritionFocus: string[];
} {
  let restDays = 0;
  const activities: string[] = [];
  const nutritionFocus: string[] = [];
  
  switch (assessment.riskLevel) {
    case 'very_high':
      restDays = 3;
      activities.push('Light walking (20-30 min)');
      activities.push('Gentle yoga or stretching');
      activities.push('Foam rolling');
      nutritionFocus.push('Increase protein for recovery (2.5g/kg)');
      nutritionFocus.push('Stay hydrated (3+ liters water)');
      nutritionFocus.push('Focus on anti-inflammatory foods');
      break;
      
    case 'high':
      restDays = 2;
      activities.push('Light cardio (walking, cycling)');
      activities.push('Mobility work');
      activities.push('Active recovery (low intensity)');
      nutritionFocus.push('Maintain protein intake');
      nutritionFocus.push('Adequate carbs for glycogen replenishment');
      break;
      
    case 'moderate':
      restDays = 1;
      activities.push('Train underworked muscle groups');
      activities.push('Lower intensity workout');
      activities.push('Focus on technique over weight');
      nutritionFocus.push('Normal nutrition targets');
      break;
      
    case 'low':
      restDays = 0;
      activities.push('Continue normal training');
      activities.push('Incorporate preventive mobility work');
      nutritionFocus.push('Maintain balanced nutrition');
      break;
  }
  
  return {
    restDays,
    activities,
    nutritionFocus
  };
}

/**
 * Track cumulative fatigue over time
 * Returns fatigue score (0-100)
 */
export function calculateCumulativeFatigue(
  recentWorkouts: Array<{ date: Date; intensity: number; volume: number }>
): number {
  // Fatigue accumulates but also dissipates over time
  let fatigueScore = 0;
  
  for (const workout of recentWorkouts) {
    const daysAgo = getDaysSince(workout.date);
    
    // Recent workouts contribute more to current fatigue
    const timeDecay = Math.exp(-0.15 * daysAgo); // Exponential decay
    const workoutFatigue = workout.intensity * workout.volume * 0.1;
    
    fatigueScore += workoutFatigue * timeDecay;
  }
  
  // Cap at 100
  return Math.min(100, fatigueScore);
}

// Helper functions

function getHoursSince(date: Date): number {
  const now = new Date();
  const diff = now.getTime() - new Date(date).getTime();
  return diff / (1000 * 60 * 60);
}

function getDaysSince(date: Date): number {
  return getHoursSince(date) / 24;
}

function average(numbers: number[]): number {
  if (numbers.length === 0) return 0;
  return numbers.reduce((a, b) => a + b, 0) / numbers.length;
}
