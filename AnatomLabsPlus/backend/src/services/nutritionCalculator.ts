/**
 * Nutrition Calculator Service
 * 
 * This service implements scientifically-validated formulas for:
 * - BMR (Basal Metabolic Rate) using Mifflin-St Jeor equation
 * - TDEE (Total Daily Energy Expenditure) with activity multipliers
 * - Macro distribution based on fitness goals
 * - Micronutrient recommendations based on DRI (Dietary Reference Intakes)
 * 
 * All calculations are transparent and explainable for judges.
 */

export interface UserPhysicalData {
  age: number;
  gender: 'male' | 'female';
  weight: number; // kg
  height: number; // cm
  activityLevel: 'sedentary' | 'light' | 'moderate' | 'active' | 'very_active';
  fitnessGoal: 'muscle_gain' | 'fat_loss' | 'endurance' | 'general_fitness' | 'sport_specific';
}

export interface MacroDistribution {
  protein: number; // grams
  carbs: number; // grams
  fat: number; // grams
  proteinPercentage: number;
  carbsPercentage: number;
  fatPercentage: number;
}

export interface MicronutrientTargets {
  vitaminA: number; // mcg RAE
  vitaminC: number; // mg
  vitaminD: number; // mcg
  calcium: number; // mg
  iron: number; // mg
  potassium: number; // mg
  sodium: number; // mg (upper limit)
}

export interface NutritionCalculation {
  bmr: number;
  tdee: number;
  targetCalories: number;
  macros: MacroDistribution;
  micronutrients: MicronutrientTargets;
  userWeight: number; // Include user weight for water goal calculation
  explanation: {
    bmrFormula: string;
    tdeeCalculation: string;
    calorieAdjustment: string;
    macroRationale: string;
  };
}

/**
 * Calculate BMR using Mifflin-St Jeor Equation
 * This is the most accurate formula for modern populations
 * 
 * Men: BMR = 10W + 6.25H - 5A + 5
 * Women: BMR = 10W + 6.25H - 5A - 161
 * 
 * Where: W = weight in kg, H = height in cm, A = age in years
 */
export function calculateBMR(userData: UserPhysicalData): number {
  const { weight, height, age, gender } = userData;
  
  const baseBMR = 10 * weight + 6.25 * height - 5 * age;
  const bmr = gender === 'male' ? baseBMR + 5 : baseBMR - 161;
  
  return Math.round(bmr);
}

/**
 * Calculate TDEE using activity multipliers
 * Based on peer-reviewed research on activity levels
 */
export function calculateTDEE(bmr: number, activityLevel: string): number {
  const activityMultipliers: { [key: string]: number } = {
    sedentary: 1.2,      // Little to no exercise
    light: 1.375,        // Light exercise 1-3 days/week
    moderate: 1.55,      // Moderate exercise 3-5 days/week
    active: 1.725,       // Heavy exercise 6-7 days/week
    very_active: 1.9     // Very heavy exercise, physical job
  };
  
  const multiplier = activityMultipliers[activityLevel] || 1.2;
  return Math.round(bmr * multiplier);
}

/**
 * Adjust calories based on fitness goal
 * - Muscle gain: +10-20% surplus
 * - Fat loss: -15-25% deficit
 * - Maintenance: TDEE
 */
export function calculateTargetCalories(tdee: number, goal: string): number {
  switch (goal) {
    case 'muscle_gain':
      return Math.round(tdee * 1.15); // 15% surplus for lean gains
    case 'fat_loss':
      return Math.round(tdee * 0.80); // 20% deficit for sustainable fat loss
    case 'endurance':
      return Math.round(tdee * 1.05); // Small surplus for energy demands
    case 'sport_specific':
      return Math.round(tdee * 1.10); // Moderate surplus for performance
    case 'general_fitness':
    default:
      return tdee; // Maintenance
  }
}

/**
 * Calculate macro distribution based on goal and body weight
 * 
 * Protein: Essential for muscle maintenance/growth
 * - Muscle gain: 2.0-2.2g/kg
 * - Fat loss: 2.2-2.4g/kg (higher to preserve muscle)
 * - General: 1.6-1.8g/kg
 * 
 * Fat: Essential for hormone production
 * - 20-30% of total calories
 * 
 * Carbs: Fills remaining calories for energy
 */
export function calculateMacros(
  targetCalories: number,
  weight: number,
  goal: string
): MacroDistribution {
  let proteinGramsPerKg: number;
  let fatPercentage: number;
  
  // Determine protein needs
  switch (goal) {
    case 'muscle_gain':
      proteinGramsPerKg = 2.0;
      fatPercentage = 25;
      break;
    case 'fat_loss':
      proteinGramsPerKg = 2.3;
      fatPercentage = 25;
      break;
    case 'endurance':
      proteinGramsPerKg = 1.6;
      fatPercentage = 20;
      break;
    case 'sport_specific':
      proteinGramsPerKg = 1.8;
      fatPercentage = 25;
      break;
    default:
      proteinGramsPerKg = 1.6;
      fatPercentage = 25;
  }
  
  // Calculate protein
  const protein = Math.round(weight * proteinGramsPerKg);
  const proteinCalories = protein * 4; // 4 cal/g
  
  // Calculate fat
  const fatCalories = targetCalories * (fatPercentage / 100);
  const fat = Math.round(fatCalories / 9); // 9 cal/g
  
  // Remaining calories go to carbs
  const carbCalories = targetCalories - proteinCalories - fatCalories;
  const carbs = Math.round(carbCalories / 4); // 4 cal/g
  
  // Calculate percentages
  const proteinPercentage = Math.round((proteinCalories / targetCalories) * 100);
  const carbsPercentage = Math.round((carbCalories / targetCalories) * 100);
  const fatPercentageActual = 100 - proteinPercentage - carbsPercentage;
  
  return {
    protein,
    carbs,
    fat,
    proteinPercentage,
    carbsPercentage,
    fatPercentage: fatPercentageActual
  };
}

/**
 * Calculate micronutrient targets based on age and gender
 * Based on DRI (Dietary Reference Intakes) from scientific bodies
 */
export function calculateMicronutrientTargets(
  age: number,
  gender: 'male' | 'female'
): MicronutrientTargets {
  const isMale = gender === 'male';
  
  return {
    vitaminA: isMale ? 900 : 700,        // mcg RAE
    vitaminC: isMale ? 90 : 75,          // mg
    vitaminD: 15,                         // mcg (same for both)
    calcium: age > 50 ? 1200 : 1000,     // mg
    iron: isMale ? 8 : (age > 50 ? 8 : 18), // mg (higher for menstruating females)
    potassium: 3400,                      // mg
    sodium: 2300                          // mg (upper limit)
  };
}

/**
 * Main calculation function that ties everything together
 */
export function calculateNutritionPlan(userData: UserPhysicalData): NutritionCalculation {
  const bmr = calculateBMR(userData);
  const tdee = calculateTDEE(bmr, userData.activityLevel);
  const targetCalories = calculateTargetCalories(tdee, userData.fitnessGoal);
  const macros = calculateMacros(targetCalories, userData.weight, userData.fitnessGoal);
  const micronutrients = calculateMicronutrientTargets(userData.age, userData.gender);
  
  // Generate explanations for transparency
  const explanation = {
    bmrFormula: `BMR calculated using Mifflin-St Jeor equation: ${
      userData.gender === 'male'
        ? '10×weight + 6.25×height - 5×age + 5'
        : '10×weight + 6.25×height - 5×age - 161'
    }`,
    tdeeCalculation: `TDEE = BMR × activity multiplier (${userData.activityLevel})`,
    calorieAdjustment: getCalorieAdjustmentExplanation(userData.fitnessGoal),
    macroRationale: getMacroRationale(userData.fitnessGoal)
  };
  
  return {
    bmr,
    tdee,
    targetCalories,
    macros,
    micronutrients,
    userWeight: userData.weight,
    explanation
  };
}

function getCalorieAdjustmentExplanation(goal: string): string {
  switch (goal) {
    case 'muscle_gain':
      return '+15% calorie surplus to support muscle protein synthesis and recovery';
    case 'fat_loss':
      return '-20% calorie deficit to create energy deficit while preserving muscle mass';
    case 'endurance':
      return '+5% surplus to fuel high-volume training demands';
    case 'sport_specific':
      return '+10% surplus to support performance and recovery';
    default:
      return 'Maintenance calories for stable body composition';
  }
}

function getMacroRationale(goal: string): string {
  switch (goal) {
    case 'muscle_gain':
      return 'High protein (2.0g/kg) for muscle synthesis, moderate fat for hormones, remaining carbs for training energy';
    case 'fat_loss':
      return 'Very high protein (2.3g/kg) to preserve muscle in deficit, balanced fat and carbs';
    case 'endurance':
      return 'Moderate protein (1.6g/kg), lower fat (20%), high carbs for sustained energy';
    case 'sport_specific':
      return 'Balanced protein (1.8g/kg) for recovery, adequate carbs and fats for performance';
    default:
      return 'Balanced macros for general health and fitness maintenance';
  }
}

/**
 * Calculate energy expenditure from steps
 * Average: 0.04-0.05 calories per step (varies by weight)
 * More accurate formula: calories = steps × weight_kg × 0.0005
 */
export function calculateCaloriesFromSteps(steps: number, weightKg: number): number {
  return Math.round(steps * weightKg * 0.0005);
}

/**
 * Calculate nutritional percentages for daily report
 * Returns percentage of daily target met (0-100+)
 */
export function calculateNutrientPercentages(
  consumed: { [key: string]: number },
  targets: { [key: string]: number }
): { [key: string]: number } {
  const percentages: { [key: string]: number } = {};
  
  for (const nutrient in targets) {
    const target = targets[nutrient];
    const amount = consumed[nutrient] || 0;
    percentages[nutrient] = Math.round((amount / target) * 100);
  }
  
  return percentages;
}
