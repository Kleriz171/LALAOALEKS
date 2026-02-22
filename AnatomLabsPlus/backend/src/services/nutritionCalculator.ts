import { getMedicalCondition, getDietaryPreference, MEDICAL_CONDITIONS } from '../constants/healthConditions';

export interface UserPhysicalData {
  age: number;
  gender: 'male' | 'female';
  weight: number;
  height: number;
  activityLevel: 'sedentary' | 'light' | 'moderate' | 'active' | 'very_active';
  fitnessGoal: 'muscle_gain' | 'fat_loss' | 'body_recomposition' | 'endurance' | 'general_fitness' | 'sport_specific';
}

export interface UserHealthProfile {
  medicalConditions?: string[];
  dietaryPreferences?: string[];
}

export interface MacroDistribution {
  protein: number;
  carbs: number;
  fat: number;
  proteinPercentage: number;
  carbsPercentage: number;
  fatPercentage: number;
}

export interface MicronutrientTargets {
  vitaminA: number;
  vitaminC: number;
  vitaminD: number;
  calcium: number;
  iron: number;
  potassium: number;
  sodium: number;
}

export interface HealthAdjustments {
  adjustedMacros: Partial<MacroDistribution>;
  restrictions: { nutrient: string; limit?: number; reason: string }[];
  focusNutrients: string[];
  warnings: string[];
  recommendations: string[];
}

export interface NutritionCalculation {
  bmr: number;
  tdee: number;
  targetCalories: number;
  macros: MacroDistribution;
  micronutrients: MicronutrientTargets;
  userWeight: number;
  healthAdjustments?: HealthAdjustments;
  explanation: {
    bmrFormula: string;
    tdeeCalculation: string;
    calorieAdjustment: string;
    macroRationale: string;
    healthModifications?: string;
  };
}

export function calculateBMR(userData: UserPhysicalData): number {
  const { weight, height, age, gender } = userData;

  const baseBMR = 10 * weight + 6.25 * height - 5 * age;
  const bmr = gender === 'male' ? baseBMR + 5 : baseBMR - 161;

  return Math.round(bmr);
}

export function calculateTDEE(bmr: number, activityLevel: string): number {
  const activityMultipliers: { [key: string]: number } = {
    sedentary: 1.2,
    light: 1.375,
    moderate: 1.55,
    active: 1.725,
    very_active: 1.9
  };

  const multiplier = activityMultipliers[activityLevel] || 1.2;
  return Math.round(bmr * multiplier);
}

export function calculateTargetCalories(tdee: number, goal: string): number {
  switch (goal) {
    case 'muscle_gain':
      return Math.round(tdee * 1.15);
    case 'fat_loss':
      return Math.round(tdee * 0.80);
    case 'body_recomposition':
      return tdee;
    case 'endurance':
      return Math.round(tdee * 1.05);
    case 'sport_specific':
      return Math.round(tdee * 1.10);
    case 'general_fitness':
    default:
      return tdee;
  }
}

export function calculateMacros(
  targetCalories: number,
  weight: number,
  goal: string
): MacroDistribution {
  let proteinGramsPerKg: number;
  let fatPercentage: number;

  switch (goal) {
    case 'muscle_gain':
      proteinGramsPerKg = 1.6;
      fatPercentage = 25;
      break;
    case 'fat_loss':
      proteinGramsPerKg = 1.8;
      fatPercentage = 25;
      break;
    case 'body_recomposition':
      proteinGramsPerKg = 1.8;
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

  const protein = Math.round(weight * proteinGramsPerKg);
  const proteinCalories = protein * 4;

  const fatCalories = targetCalories * (fatPercentage / 100);
  const fat = Math.round(fatCalories / 9);

  const carbCalories = targetCalories - proteinCalories - fatCalories;
  const carbs = Math.round(carbCalories / 4);

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

export function calculateMicronutrientTargets(
  age: number,
  gender: 'male' | 'female'
): MicronutrientTargets {
  const isMale = gender === 'male';

  return {
    vitaminA: isMale ? 900 : 700,
    vitaminC: isMale ? 90 : 75,
    vitaminD: 15,
    calcium: age > 50 ? 1200 : 1000,
    iron: isMale ? 8 : (age > 50 ? 8 : 18),
    potassium: 3400,
    sodium: 2300
  };
}

export function calculateNutritionPlan(userData: UserPhysicalData): NutritionCalculation {
  const bmr = calculateBMR(userData);
  const tdee = calculateTDEE(bmr, userData.activityLevel);
  const targetCalories = calculateTargetCalories(tdee, userData.fitnessGoal);
  const macros = calculateMacros(targetCalories, userData.weight, userData.fitnessGoal);
  const micronutrients = calculateMicronutrientTargets(userData.age, userData.gender);

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
    case 'body_recomposition':
      return 'Maintenance calories — supports simultaneous fat loss and muscle gain through proper training and nutrition';
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
      return 'Protein (1.6g/kg) for muscle synthesis, moderate fat for hormones, remaining carbs for training energy';
    case 'fat_loss':
      return 'Higher protein (1.8g/kg) to preserve muscle in deficit, balanced fat and carbs';
    case 'body_recomposition':
      return 'Higher protein (1.8g/kg) at maintenance calories — combined with progressive training enables simultaneous muscle growth and fat loss';
    case 'endurance':
      return 'Moderate protein (1.6g/kg), lower fat (20%), high carbs for sustained energy';
    case 'sport_specific':
      return 'Balanced protein (1.8g/kg) for recovery, adequate carbs and fats for performance';
    default:
      return 'Balanced macros for general health and fitness maintenance';
  }
}

export function calculateCaloriesFromSteps(steps: number, weightKg: number): number {
  return Math.round(steps * weightKg * 0.0005);
}

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

export function calculateHealthAdjustments(
  baseCalculation: NutritionCalculation,
  healthProfile: UserHealthProfile
): HealthAdjustments {
  const adjustments: HealthAdjustments = {
    adjustedMacros: {},
    restrictions: [],
    focusNutrients: [],
    warnings: [],
    recommendations: []
  };

  if (!healthProfile.medicalConditions?.length && !healthProfile.dietaryPreferences?.length) {
    return adjustments;
  }

  for (const conditionId of healthProfile.medicalConditions || []) {
    const condition = getMedicalCondition(conditionId);
    if (!condition) continue;

    for (const restriction of condition.nutritionAdjustments.restrictions) {
      const existing = adjustments.restrictions.find(r => r.nutrient === restriction.nutrient);
      if (existing) {
        if (restriction.limit !== undefined && existing.limit !== undefined) {
          if (restriction.limit < existing.limit) {
            existing.limit = restriction.limit;
            existing.reason = `${existing.reason}; ${restriction.reason}`;
          }
        }
      } else {
        adjustments.restrictions.push({
          nutrient: restriction.nutrient,
          limit: restriction.limit,
          reason: restriction.reason
        });
      }
    }

    for (const nutrient of condition.nutritionAdjustments.focusNutrients) {
      if (!adjustments.focusNutrients.includes(nutrient)) {
        adjustments.focusNutrients.push(nutrient);
      }
    }

    adjustments.recommendations.push(...condition.nutritionAdjustments.recommendations);
  }

  for (const preferenceId of healthProfile.dietaryPreferences || []) {
    const preference = getDietaryPreference(preferenceId);
    if (!preference) continue;

    adjustments.recommendations.push(...preference.nutritionConsiderations);

    if (preferenceId === 'keto') {
      adjustments.adjustedMacros = {
        carbsPercentage: 10,
        fatPercentage: 70,
        proteinPercentage: 20
      };
      adjustments.warnings.push('Keto diet: Very low carb (10%), high fat (70%). May need electrolyte supplementation.');
    }
  }

  applyConditionMacroAdjustments(baseCalculation, healthProfile.medicalConditions || [], adjustments);

  adjustments.recommendations = [...new Set(adjustments.recommendations)];

  return adjustments;
}

function applyConditionMacroAdjustments(
  baseCalculation: NutritionCalculation,
  conditions: string[],
  adjustments: HealthAdjustments
): void {
  const targetCalories = baseCalculation.targetCalories;

  if (conditions.includes('diabetes_type_1') || conditions.includes('diabetes_type_2')) {
    const maxCarbPercent = conditions.includes('diabetes_type_2') ? 40 : 45;

    adjustments.warnings.push(
      `Carbohydrate intake limited to ${maxCarbPercent}% due to diabetes management`
    );

    if (baseCalculation.macros.carbsPercentage > maxCarbPercent) {
      const newCarbCals = targetCalories * (maxCarbPercent / 100);
      const newCarbs = Math.round(newCarbCals / 4);
      adjustments.adjustedMacros.carbs = newCarbs;
      adjustments.adjustedMacros.carbsPercentage = maxCarbPercent;

      const extraCals = baseCalculation.macros.carbs * 4 - newCarbCals;
      const extraProtein = Math.round(extraCals / 4);
      adjustments.adjustedMacros.protein =
        (adjustments.adjustedMacros.protein || baseCalculation.macros.protein) + extraProtein;
    }

    adjustments.focusNutrients.push('fiber');
    adjustments.recommendations.push('Choose low glycemic index foods (GI < 55)');
    adjustments.recommendations.push('Increase fiber intake to 30g+ daily');
  }

  if (conditions.includes('kidney_disease')) {
    const weight = baseCalculation.userWeight;
    const maxProtein = Math.round(weight * 0.8);

    if (baseCalculation.macros.protein > maxProtein) {
      adjustments.adjustedMacros.protein = maxProtein;
      adjustments.warnings.push(
        `Protein limited to ${maxProtein}g (0.8g/kg) for kidney health`
      );
    }
  }

  if (conditions.includes('hypertension') || conditions.includes('heart_disease')) {
    adjustments.warnings.push('Sodium intake strictly limited to 1500mg/day');
    adjustments.focusNutrients.push('potassium', 'magnesium');
    adjustments.recommendations.push('Follow DASH diet principles');
  }

  if (conditions.includes('osteoporosis')) {
    adjustments.focusNutrients.push('calcium', 'vitaminD', 'vitaminK');
    adjustments.recommendations.push('Calcium intake: 1200mg+ daily');
    adjustments.recommendations.push('Vitamin D: 800-1000 IU daily');
  }

  if (conditions.includes('depression') || conditions.includes('anxiety') || conditions.includes('ptsd') || conditions.includes('bipolar')) {
    adjustments.focusNutrients.push('omega3', 'vitaminD', 'vitaminB12', 'magnesium');
    adjustments.recommendations.push('Prioritize omega-3 rich foods (fatty fish, walnuts, flaxseed)');
    adjustments.recommendations.push('Regular meal timing helps regulate mood');

    if (conditions.includes('anxiety') || conditions.includes('ptsd')) {
      adjustments.warnings.push('Caffeine limited to 100-200mg/day to reduce anxiety symptoms');
    }
  }

  if (conditions.includes('chronic_fatigue') || conditions.includes('fibromyalgia')) {
    adjustments.focusNutrients.push('vitaminB12', 'vitaminD', 'magnesium', 'iron');
    adjustments.recommendations.push('Small, frequent meals to maintain energy levels');
    adjustments.recommendations.push('Anti-inflammatory diet may help reduce symptoms');
    adjustments.recommendations.push('Consider CoQ10 supplementation');
  }

  if (conditions.includes('multiple_sclerosis')) {
    adjustments.focusNutrients.push('vitaminD', 'omega3', 'vitaminB12');
    adjustments.recommendations.push('Vitamin D is especially important - aim for 600-800 IU daily');
    adjustments.recommendations.push('Anti-inflammatory omega-3 fatty acids');
    adjustments.warnings.push('Adequate fiber important for bowel function');
  }

  if (conditions.includes('parkinsons')) {
    adjustments.focusNutrients.push('fiber', 'omega3');
    adjustments.recommendations.push('Adequate fiber for constipation management');
    adjustments.warnings.push('Time protein intake carefully if taking levodopa - protein can interfere with medication absorption');
  }

  if (conditions.includes('ibs')) {
    adjustments.focusNutrients.push('fiber', 'probiotics');
    adjustments.recommendations.push('Consider low FODMAP diet to identify triggers');
    adjustments.recommendations.push('Increase fiber gradually');
    adjustments.recommendations.push('Probiotics may help digestive symptoms');
  }

  if (conditions.includes('crohns_disease')) {
    adjustments.focusNutrients.push('vitaminB12', 'iron', 'vitaminD', 'calcium', 'zinc');
    adjustments.recommendations.push('Small, frequent meals easier to digest');
    adjustments.recommendations.push('May need supplements due to malabsorption');
    adjustments.warnings.push('Reduce fiber during flares, increase during remission');
  }

  if (conditions.includes('celiac_disease')) {
    adjustments.focusNutrients.push('iron', 'calcium', 'vitaminD', 'vitaminB12', 'folate');
    adjustments.warnings.push('STRICT gluten-free diet required - zero tolerance');
    adjustments.recommendations.push('Check all supplements and medications for hidden gluten');
    adjustments.recommendations.push('Initially may need iron, calcium, vitamin D supplementation');
  }

  if (conditions.includes('arthritis_rheumatoid')) {
    adjustments.focusNutrients.push('omega3', 'vitaminD', 'calcium');
    adjustments.recommendations.push('Anti-inflammatory diet is essential');
    adjustments.recommendations.push('High omega-3 intake from fatty fish');
    adjustments.recommendations.push('Consider Mediterranean diet pattern');
  }

  if (conditions.includes('adhd')) {
    adjustments.focusNutrients.push('omega3', 'protein', 'iron', 'zinc');
    adjustments.recommendations.push('Protein at breakfast helps focus');
    adjustments.recommendations.push('Limit sugar and processed foods');
  }

  if (conditions.includes('eating_disorder_recovery')) {
    adjustments.warnings.push('Follow meal plan from treatment team - do not modify without guidance');
    adjustments.recommendations.push('Regular meals and snacks as prescribed');
    adjustments.focusNutrients.push('calcium', 'vitaminD', 'iron', 'zinc');
  }

  if (conditions.includes('epilepsy')) {
    adjustments.focusNutrients.push('magnesium', 'vitaminB6', 'omega3');
    adjustments.recommendations.push('Maintain regular meal times');
    adjustments.recommendations.push('Stay well hydrated');
  }
}

export function applyHealthAdjustments(
  baseCalculation: NutritionCalculation,
  healthProfile: UserHealthProfile
): NutritionCalculation {
  const adjustments = calculateHealthAdjustments(baseCalculation, healthProfile);

  if (
    !adjustments.adjustedMacros.carbs &&
    !adjustments.adjustedMacros.protein &&
    !adjustments.adjustedMacros.fat &&
    adjustments.restrictions.length === 0
  ) {
    return {
      ...baseCalculation,
      healthAdjustments: adjustments
    };
  }

  const adjustedMacros: MacroDistribution = {
    ...baseCalculation.macros,
    protein: adjustments.adjustedMacros.protein ?? baseCalculation.macros.protein,
    carbs: adjustments.adjustedMacros.carbs ?? baseCalculation.macros.carbs,
    fat: adjustments.adjustedMacros.fat ?? baseCalculation.macros.fat,
    proteinPercentage:
      adjustments.adjustedMacros.proteinPercentage ?? baseCalculation.macros.proteinPercentage,
    carbsPercentage:
      adjustments.adjustedMacros.carbsPercentage ?? baseCalculation.macros.carbsPercentage,
    fatPercentage:
      adjustments.adjustedMacros.fatPercentage ?? baseCalculation.macros.fatPercentage
  };

  const conditionNames = (healthProfile.medicalConditions || [])
    .map(id => getMedicalCondition(id)?.name)
    .filter(Boolean);

  const preferenceNames = (healthProfile.dietaryPreferences || [])
    .map(id => getDietaryPreference(id)?.name)
    .filter(Boolean);

  let healthModifications = '';
  if (conditionNames.length > 0) {
    healthModifications += `Adjusted for: ${conditionNames.join(', ')}. `;
  }
  if (preferenceNames.length > 0) {
    healthModifications += `Diet: ${preferenceNames.join(', ')}.`;
  }

  return {
    ...baseCalculation,
    macros: adjustedMacros,
    healthAdjustments: adjustments,
    explanation: {
      ...baseCalculation.explanation,
      healthModifications: healthModifications.trim()
    }
  };
}

export function calculateHealthAwareNutritionPlan(
  userData: UserPhysicalData,
  healthProfile?: UserHealthProfile
): NutritionCalculation {
  const baseCalculation = calculateNutritionPlan(userData);

  if (healthProfile && (healthProfile.medicalConditions?.length || healthProfile.dietaryPreferences?.length)) {
    return applyHealthAdjustments(baseCalculation, healthProfile);
  }

  return baseCalculation;
}

export function filterFoodsForUser(
  foods: any[],
  allergies: string[],
  preferences: string[]
): { allowed: any[]; excluded: { food: any; reason: string }[] } {
  const allowed: any[] = [];
  const excluded: { food: any; reason: string }[] = [];

  for (const food of foods) {
    let isExcluded = false;
    let excludeReason = '';

    if (food.allergens && Array.isArray(food.allergens)) {
      for (const allergy of allergies) {
        if (food.allergens.some((a: string) => a.toLowerCase().includes(allergy.toLowerCase()))) {
          isExcluded = true;
          excludeReason = `Contains allergen: ${allergy}`;
          break;
        }
      }
    }

    if (!isExcluded) {
      for (const pref of preferences) {
        switch (pref) {
          case 'vegetarian':
            if (food.category?.toLowerCase().includes('meat') ||
                food.category?.toLowerCase().includes('poultry') ||
                food.category?.toLowerCase().includes('fish')) {
              isExcluded = true;
              excludeReason = 'Not vegetarian';
            }
            break;
          case 'vegan':
            if (!food.isVegan && (
              food.category?.toLowerCase().includes('meat') ||
              food.category?.toLowerCase().includes('dairy') ||
              food.category?.toLowerCase().includes('egg') ||
              food.category?.toLowerCase().includes('fish')
            )) {
              isExcluded = true;
              excludeReason = 'Not vegan';
            }
            break;
          case 'halal':
            if (food.category?.toLowerCase().includes('pork') ||
                food.name?.toLowerCase().includes('pork') ||
                food.name?.toLowerCase().includes('bacon') ||
                food.name?.toLowerCase().includes('ham')) {
              isExcluded = true;
              excludeReason = 'Not halal';
            }
            break;
          case 'kosher':
            if (food.category?.toLowerCase().includes('pork') ||
                food.category?.toLowerCase().includes('shellfish')) {
              isExcluded = true;
              excludeReason = 'Not kosher';
            }
            break;
          case 'gluten':
            if (!food.isGlutenFree && (
              food.name?.toLowerCase().includes('bread') ||
              food.name?.toLowerCase().includes('pasta') ||
              food.name?.toLowerCase().includes('wheat')
            )) {
              isExcluded = true;
              excludeReason = 'Contains gluten';
            }
            break;
          case 'keto':
            if (food.carbs > 15) {
              isExcluded = true;
              excludeReason = 'Too high in carbs for keto';
            }
            break;
        }
        if (isExcluded) break;
      }
    }

    if (isExcluded) {
      excluded.push({ food, reason: excludeReason });
    } else {
      allowed.push(food);
    }
  }

  return { allowed, excluded };
}
