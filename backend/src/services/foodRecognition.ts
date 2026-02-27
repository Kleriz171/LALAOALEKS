/**
 * Food Recognition Service using Gemini Vision
 *
 * Analyzes food images to identify items and estimate nutritional content.
 * Enhanced with micronutrient estimation for electrolytes and minerals.
 */

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_VISION_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent';

export interface RecognizedFood {
  name: string;
  confidence: number; // 0-1
  estimatedCalories: number;
  estimatedProtein: number;
  estimatedCarbs: number;
  estimatedFat: number;
  estimatedFiber: number;
  servingSize: string;
  servingUnit: string;
  category: string;
  // Electrolytes (mg)
  estimatedSodium: number;
  estimatedPotassium: number;
  // Macrominerals (mg)
  estimatedCalcite: number; // calcium
  estimatedMagnesium: number;
  estimatedPhosphorus: number;
  // Key vitamins
  estimatedIron: number;
  estimatedVitaminC: number;
  estimatedVitaminA: number;
  alternatives?: string[]; // Other possible identifications
}

export interface FoodRecognitionResult {
  success: boolean;
  foods: RecognizedFood[];
  totalEstimatedCalories: number;
  totalMacros: {
    protein: number;
    carbs: number;
    fat: number;
    fiber: number;
  };
  totalElectrolytes: {
    sodium: number;
    potassium: number;
  };
  totalMinerals: {
    calcium: number;
    magnesium: number;
    phosphorus: number;
    iron: number;
  };
  mealDescription: string;
  confidence: 'low' | 'medium' | 'high';
  disclaimer: string;
}

// Reasonable bounds for nutrition values per serving
const NUTRITION_BOUNDS = {
  calories: { min: 0, max: 3000 },
  protein: { min: 0, max: 150 },
  carbs: { min: 0, max: 300 },
  fat: { min: 0, max: 150 },
  fiber: { min: 0, max: 50 },
  sodium: { min: 0, max: 5000 },
  potassium: { min: 0, max: 4000 },
  calcium: { min: 0, max: 2000 },
  magnesium: { min: 0, max: 500 },
  phosphorus: { min: 0, max: 2000 },
  iron: { min: 0, max: 50 },
  vitaminC: { min: 0, max: 500 },
  vitaminA: { min: 0, max: 3000 },
};

function clampValue(value: number, key: keyof typeof NUTRITION_BOUNDS): number {
  const bounds = NUTRITION_BOUNDS[key];
  return Math.max(bounds.min, Math.min(bounds.max, value));
}

/**
 * Analyze a food image using Gemini Vision
 * @param imageBase64 - Base64 encoded image (without data:image prefix)
 * @param mimeType - Image MIME type (image/jpeg, image/png, etc.)
 */
export async function recognizeFoodFromImage(
  imageBase64: string,
  mimeType: string = 'image/jpeg'
): Promise<FoodRecognitionResult> {

  if (!GEMINI_API_KEY) {
    return {
      success: false,
      foods: [],
      totalEstimatedCalories: 0,
      totalMacros: { protein: 0, carbs: 0, fat: 0, fiber: 0 },
      totalElectrolytes: { sodium: 0, potassium: 0 },
      totalMinerals: { calcium: 0, magnesium: 0, phosphorus: 0, iron: 0 },
      mealDescription: 'Food recognition unavailable',
      confidence: 'low',
      disclaimer: 'Gemini API key not configured'
    };
  }

  try {
    const response = await fetch(`${GEMINI_VISION_URL}?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [
            {
              text: `You are an expert nutritionist and food scientist analyzing a food image. Your task is to identify ALL visible food items and provide accurate nutritional estimates.

ANALYSIS GUIDELINES:
1. Look carefully at the ENTIRE image - identify every distinct food item
2. Estimate portion sizes by comparing to standard references (plate size ~10 inches, typical utensils)
3. Consider cooking methods visible (grilled, fried, steamed, etc.) as they affect nutrition
4. For mixed dishes, break down into components when possible
5. Be conservative with estimates - it's better to slightly underestimate than overestimate

For EACH food item detected, provide:
- name: Specific name (e.g., "grilled chicken breast" not just "chicken")
- servingSize: Numeric amount (e.g., "150" for 150g, "1" for 1 piece)
- servingUnit: Unit type (g, oz, piece, cup, slice, etc.)
- calories: Total calories for this serving
- protein: Grams of protein
- carbs: Grams of carbohydrates
- fat: Grams of fat
- fiber: Grams of dietary fiber
- sodium: Milligrams of sodium (important for processed/seasoned foods)
- potassium: Milligrams of potassium
- calcium: Milligrams of calcium
- magnesium: Milligrams of magnesium
- phosphorus: Milligrams of phosphorus
- iron: Milligrams of iron
- vitaminC: Milligrams of vitamin C
- vitaminA: Micrograms RAE of vitamin A
- confidence: Your confidence 0.0-1.0 (be honest about uncertainty)
- category: One of: protein, carb, vegetable, fruit, dairy, grain, legume, nut, beverage, snack, condiment, mixed

RESPOND WITH VALID JSON ONLY (no markdown, no code blocks, no explanation):
{
  "foods": [
    {
      "name": "grilled chicken breast",
      "servingSize": "150",
      "servingUnit": "g",
      "calories": 248,
      "protein": 46,
      "carbs": 0,
      "fat": 5,
      "fiber": 0,
      "sodium": 74,
      "potassium": 358,
      "calcium": 15,
      "magnesium": 34,
      "phosphorus": 268,
      "iron": 1.3,
      "vitaminC": 0,
      "vitaminA": 9,
      "confidence": 0.85,
      "category": "protein"
    }
  ],
  "mealDescription": "A balanced meal with lean protein and vegetables",
  "overallConfidence": "high"
}

CONFIDENCE LEVELS:
- "high" (>0.7): Clear image, easily identifiable standard foods
- "medium" (0.4-0.7): Somewhat unclear or mixed dishes
- "low" (<0.4): Blurry image, unusual foods, or significant uncertainty

If no food is visible or image is too unclear:
{
  "foods": [],
  "mealDescription": "Unable to identify food items - image may be unclear or not contain food",
  "overallConfidence": "low"
}`
            },
            {
              inlineData: {
                mimeType: mimeType,
                data: imageBase64
              }
            }
          ]
        }],
        generationConfig: {
          temperature: 0.1, // Lower temperature for more consistent/accurate results
          topK: 20,
          topP: 0.9,
          maxOutputTokens: 4096, // More tokens for detailed nutrition data
        }
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Gemini Vision API error:', response.status, errorText);
      return getErrorResult('Failed to analyze image. Please try again.');
    }

    const data: any = await response.json();
    const textResponse = data.candidates?.[0]?.content?.parts?.[0]?.text || '';

    // Parse JSON from response (handle potential markdown wrapping)
    let jsonStr = textResponse.trim();
    if (jsonStr.startsWith('```json')) {
      jsonStr = jsonStr.slice(7);
    }
    if (jsonStr.startsWith('```')) {
      jsonStr = jsonStr.slice(3);
    }
    if (jsonStr.endsWith('```')) {
      jsonStr = jsonStr.slice(0, -3);
    }

    const aiResponse = JSON.parse(jsonStr.trim());

    // Process and validate the response with bounds checking
    const foods: RecognizedFood[] = (aiResponse.foods || []).map((food: any) => ({
      name: food.name || 'Unknown food',
      confidence: Math.min(1, Math.max(0, food.confidence || 0.5)),
      estimatedCalories: clampValue(Math.round(food.calories || 0), 'calories'),
      estimatedProtein: clampValue(Math.round((food.protein || 0) * 10) / 10, 'protein'),
      estimatedCarbs: clampValue(Math.round((food.carbs || 0) * 10) / 10, 'carbs'),
      estimatedFat: clampValue(Math.round((food.fat || 0) * 10) / 10, 'fat'),
      estimatedFiber: clampValue(Math.round((food.fiber || 0) * 10) / 10, 'fiber'),
      servingSize: String(food.servingSize || '1'),
      servingUnit: food.servingUnit || 'serving',
      category: food.category || 'mixed',
      // Electrolytes
      estimatedSodium: clampValue(Math.round(food.sodium || 0), 'sodium'),
      estimatedPotassium: clampValue(Math.round(food.potassium || 0), 'potassium'),
      // Macrominerals
      estimatedCalcite: clampValue(Math.round(food.calcium || 0), 'calcium'),
      estimatedMagnesium: clampValue(Math.round(food.magnesium || 0), 'magnesium'),
      estimatedPhosphorus: clampValue(Math.round(food.phosphorus || 0), 'phosphorus'),
      // Other
      estimatedIron: clampValue(Math.round((food.iron || 0) * 10) / 10, 'iron'),
      estimatedVitaminC: clampValue(Math.round(food.vitaminC || 0), 'vitaminC'),
      estimatedVitaminA: clampValue(Math.round(food.vitaminA || 0), 'vitaminA'),
    }));

    // Calculate totals
    const totalCalories = foods.reduce((sum, f) => sum + f.estimatedCalories, 0);
    const totalProtein = foods.reduce((sum, f) => sum + f.estimatedProtein, 0);
    const totalCarbs = foods.reduce((sum, f) => sum + f.estimatedCarbs, 0);
    const totalFat = foods.reduce((sum, f) => sum + f.estimatedFat, 0);
    const totalFiber = foods.reduce((sum, f) => sum + f.estimatedFiber, 0);
    const totalSodium = foods.reduce((sum, f) => sum + f.estimatedSodium, 0);
    const totalPotassium = foods.reduce((sum, f) => sum + f.estimatedPotassium, 0);
    const totalCalcium = foods.reduce((sum, f) => sum + f.estimatedCalcite, 0);
    const totalMagnesium = foods.reduce((sum, f) => sum + f.estimatedMagnesium, 0);
    const totalPhosphorus = foods.reduce((sum, f) => sum + f.estimatedPhosphorus, 0);
    const totalIron = foods.reduce((sum, f) => sum + f.estimatedIron, 0);

    return {
      success: true,
      foods,
      totalEstimatedCalories: totalCalories,
      totalMacros: {
        protein: Math.round(totalProtein * 10) / 10,
        carbs: Math.round(totalCarbs * 10) / 10,
        fat: Math.round(totalFat * 10) / 10,
        fiber: Math.round(totalFiber * 10) / 10,
      },
      totalElectrolytes: {
        sodium: Math.round(totalSodium),
        potassium: Math.round(totalPotassium),
      },
      totalMinerals: {
        calcium: Math.round(totalCalcium),
        magnesium: Math.round(totalMagnesium),
        phosphorus: Math.round(totalPhosphorus),
        iron: Math.round(totalIron * 10) / 10,
      },
      mealDescription: aiResponse.mealDescription || 'Food items detected',
      confidence: aiResponse.overallConfidence || 'medium',
      disclaimer: 'Nutritional estimates are AI-generated approximations. For accurate tracking, verify with nutrition labels or a registered dietitian.'
    };

  } catch (error) {
    console.error('Food recognition error:', error);
    return getErrorResult('Failed to process image. Please ensure the image is clear and try again.');
  }
}

function getErrorResult(message: string): FoodRecognitionResult {
  return {
    success: false,
    foods: [],
    totalEstimatedCalories: 0,
    totalMacros: { protein: 0, carbs: 0, fat: 0, fiber: 0 },
    totalElectrolytes: { sodium: 0, potassium: 0 },
    totalMinerals: { calcium: 0, magnesium: 0, phosphorus: 0, iron: 0 },
    mealDescription: message,
    confidence: 'low',
    disclaimer: 'Unable to analyze the image. Please try again with a clearer photo or enter food manually.'
  };
}

/**
 * Validate that the image contains food
 * Returns quick check before full analysis
 */
export async function quickFoodCheck(
  imageBase64: string,
  mimeType: string = 'image/jpeg'
): Promise<{ containsFood: boolean; description: string }> {

  if (!GEMINI_API_KEY) {
    return { containsFood: false, description: 'API not configured' };
  }

  try {
    const response = await fetch(`${GEMINI_VISION_URL}?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [
            {
              text: `Does this image contain food? Answer with JSON only:
{"containsFood": true/false, "description": "brief description of what you see"}`
            },
            {
              inlineData: {
                mimeType: mimeType,
                data: imageBase64
              }
            }
          ]
        }],
        generationConfig: {
          temperature: 0.1,
          maxOutputTokens: 100,
        }
      })
    });

    if (!response.ok) {
      return { containsFood: false, description: 'Failed to check image' };
    }

    const data: any = await response.json();
    const textResponse = data.candidates?.[0]?.content?.parts?.[0]?.text || '';

    let jsonStr = textResponse.trim();
    if (jsonStr.startsWith('```json')) jsonStr = jsonStr.slice(7);
    if (jsonStr.startsWith('```')) jsonStr = jsonStr.slice(3);
    if (jsonStr.endsWith('```')) jsonStr = jsonStr.slice(0, -3);

    const result = JSON.parse(jsonStr.trim());
    return {
      containsFood: result.containsFood === true,
      description: result.description || ''
    };

  } catch (error) {
    console.error('Quick food check error:', error);
    return { containsFood: false, description: 'Error checking image' };
  }
}
