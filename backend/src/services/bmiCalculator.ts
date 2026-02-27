export interface BMICategoryInfo {
  category: string;
  categoryId: string;
  healthRisk: string;
  color: string;
  description: string;
  range: { min: number; max: number };
}

export interface IdealWeightRange {
  min: number;
  max: number;
  message: string;
}

export interface BMIResult {
  bmi: number;
  category: string;
  categoryId: string;
  healthRisk: string;
  color: string;
  idealWeightRange: IdealWeightRange;
  weightToIdeal: number;
  recommendation: string;
  percentile?: number;
}

const BMI_CATEGORIES: BMICategoryInfo[] = [
  {
    category: 'Severely Underweight',
    categoryId: 'severely_underweight',
    healthRisk: 'Very High',
    color: '#9b59b6',
    description: 'Significantly below healthy weight range',
    range: { min: 0, max: 16 }
  },
  {
    category: 'Underweight',
    categoryId: 'underweight',
    healthRisk: 'Moderate',
    color: '#3498db',
    description: 'Below healthy weight range',
    range: { min: 16, max: 18.5 }
  },
  {
    category: 'Normal',
    categoryId: 'normal',
    healthRisk: 'Low',
    color: '#2ecc71',
    description: 'Healthy weight range',
    range: { min: 18.5, max: 25 }
  },
  {
    category: 'Overweight',
    categoryId: 'overweight',
    healthRisk: 'Moderate',
    color: '#f39c12',
    description: 'Above healthy weight range',
    range: { min: 25, max: 30 }
  },
  {
    category: 'Obese Class I',
    categoryId: 'obese_1',
    healthRisk: 'High',
    color: '#e67e22',
    description: 'Obesity Class I',
    range: { min: 30, max: 35 }
  },
  {
    category: 'Obese Class II',
    categoryId: 'obese_2',
    healthRisk: 'Very High',
    color: '#e74c3c',
    description: 'Obesity Class II (Severe)',
    range: { min: 35, max: 40 }
  },
  {
    category: 'Obese Class III',
    categoryId: 'obese_3',
    healthRisk: 'Extremely High',
    color: '#c0392b',
    description: 'Obesity Class III (Morbid)',
    range: { min: 40, max: 100 }
  }
];

export function calculateBMI(weightKg: number, heightCm: number): number {
  if (weightKg <= 0 || heightCm <= 0) {
    throw new Error('Weight and height must be positive values');
  }

  const heightM = heightCm / 100;
  const bmi = weightKg / (heightM * heightM);

  return Math.round(bmi * 10) / 10;
}

export function getBMICategory(bmi: number): BMICategoryInfo {
  for (const category of BMI_CATEGORIES) {
    if (bmi >= category.range.min && bmi < category.range.max) {
      return category;
    }
  }

  return BMI_CATEGORIES[BMI_CATEGORIES.length - 1];
}

export function calculateIdealWeightRange(heightCm: number): IdealWeightRange {
  const heightM = heightCm / 100;
  const heightSquared = heightM * heightM;

  const minWeight = Math.round(18.5 * heightSquared * 10) / 10;
  const maxWeight = Math.round(25 * heightSquared * 10) / 10;

  return {
    min: minWeight,
    max: maxWeight,
    message: `For your height (${heightCm}cm), a healthy weight range is ${minWeight}-${maxWeight}kg`
  };
}

export function calculateWeightToIdeal(currentWeight: number, heightCm: number): number {
  const bmi = calculateBMI(currentWeight, heightCm);
  const category = getBMICategory(bmi);

  if (category.categoryId === 'normal') {
    return 0;
  }

  const heightM = heightCm / 100;
  const heightSquared = heightM * heightM;

  if (bmi < 18.5) {
    const targetWeight = 18.5 * heightSquared;
    return Math.round((targetWeight - currentWeight) * 10) / 10;
  } else {
    const targetWeight = 25 * heightSquared;
    return Math.round((targetWeight - currentWeight) * 10) / 10;
  }
}

function getRecommendation(
  bmi: number,
  categoryId: string,
  fitnessGoal?: string,
  activityLevel?: string
): string {
  const recommendations: { [key: string]: string } = {
    severely_underweight:
      'Priority: Increase caloric intake with nutrient-dense foods. Consider consulting a healthcare provider. Focus on strength training to build muscle mass.',
    underweight:
      'Focus on gradual weight gain through a caloric surplus of 300-500 calories. Prioritize protein intake and resistance training.',
    normal:
      'Maintain your healthy weight through balanced nutrition and regular exercise. Focus on your specific fitness goals.',
    overweight:
      'A moderate caloric deficit of 300-500 calories and regular exercise can help reach a healthier weight. Focus on whole foods and strength training.',
    obese_1:
      'Work with healthcare providers on a sustainable weight loss plan. Aim for 0.5-1kg loss per week through diet and exercise modifications.',
    obese_2:
      'Medical supervision recommended for weight loss. Focus on building sustainable habits with moderate exercise and dietary changes.',
    obese_3:
      'Consult with healthcare providers for comprehensive weight management. Consider working with a registered dietitian and exercise physiologist.'
  };

  let recommendation = recommendations[categoryId] || recommendations.normal;

  if (fitnessGoal === 'muscle_gain' && categoryId === 'normal') {
    recommendation =
      'Your BMI is healthy for muscle building. Focus on a slight caloric surplus (200-300 cal) with high protein intake for lean gains.';
  } else if (fitnessGoal === 'fat_loss' && categoryId === 'normal') {
    recommendation =
      'Your BMI is already healthy. For body recomposition, focus on strength training while maintaining a slight deficit or maintenance calories.';
  }

  return recommendation;
}

export function analyzeBMI(
  weightKg: number,
  heightCm: number,
  fitnessGoal?: string,
  activityLevel?: string
): BMIResult {
  const bmi = calculateBMI(weightKg, heightCm);
  const categoryInfo = getBMICategory(bmi);
  const idealWeightRange = calculateIdealWeightRange(heightCm);
  const weightToIdeal = calculateWeightToIdeal(weightKg, heightCm);
  const recommendation = getRecommendation(bmi, categoryInfo.categoryId, fitnessGoal, activityLevel);

  return {
    bmi,
    category: categoryInfo.category,
    categoryId: categoryInfo.categoryId,
    healthRisk: categoryInfo.healthRisk,
    color: categoryInfo.color,
    idealWeightRange,
    weightToIdeal,
    recommendation
  };
}

export function getAllBMICategories(): BMICategoryInfo[] {
  return BMI_CATEGORIES;
}

export function estimateBMIPercentile(bmi: number): number {
  const mean = 26.5;
  const stdDev = 5.5;
  const zScore = (bmi - mean) / stdDev;

  const percentile = 0.5 * (1 + erf(zScore / Math.sqrt(2)));

  return Math.round(percentile * 100);
}

function erf(x: number): number {
  const sign = x >= 0 ? 1 : -1;
  x = Math.abs(x);

  const a1 = 0.254829592;
  const a2 = -0.284496736;
  const a3 = 1.421413741;
  const a4 = -1.453152027;
  const a5 = 1.061405429;
  const p = 0.3275911;

  const t = 1.0 / (1.0 + p * x);
  const y = 1.0 - ((((a5 * t + a4) * t + a3) * t + a2) * t + a1) * t * Math.exp(-x * x);

  return sign * y;
}

export function canCalculateBMI(weight?: number | null, height?: number | null): boolean {
  return (
    weight !== undefined &&
    weight !== null &&
    height !== undefined &&
    height !== null &&
    weight > 0 &&
    height > 0
  );
}
