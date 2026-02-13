
/**
 * Comprehensive Food Database Seed
 *
 * Contains common foods across all categories for nutrition tracking.
 * Data sourced from USDA and common nutrition databases.
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

interface FoodData {
  name: string;
  brand?: string;
  category: string;
  servingSize: number;
  servingUnit: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber?: number;
  sugar?: number;
  barcode?: string;
}

const foods: FoodData[] = [
  // ========== PROTEINS ==========
  // Chicken
  { name: 'Chicken Breast (grilled)', category: 'protein', servingSize: 100, servingUnit: 'g', calories: 165, protein: 31, carbs: 0, fat: 3.6, fiber: 0 },
  { name: 'Chicken Breast (raw)', category: 'protein', servingSize: 100, servingUnit: 'g', calories: 120, protein: 22.5, carbs: 0, fat: 2.6, fiber: 0 },
  { name: 'Chicken Thigh (grilled)', category: 'protein', servingSize: 100, servingUnit: 'g', calories: 209, protein: 26, carbs: 0, fat: 10.9, fiber: 0 },
  { name: 'Chicken Wings', category: 'protein', servingSize: 100, servingUnit: 'g', calories: 203, protein: 30.5, carbs: 0, fat: 8.1, fiber: 0 },
  { name: 'Rotisserie Chicken', category: 'protein', servingSize: 100, servingUnit: 'g', calories: 190, protein: 25, carbs: 0, fat: 9, fiber: 0 },

  // Beef
  { name: 'Ground Beef (90% lean)', category: 'protein', servingSize: 100, servingUnit: 'g', calories: 176, protein: 20, carbs: 0, fat: 10, fiber: 0 },
  { name: 'Ground Beef (80% lean)', category: 'protein', servingSize: 100, servingUnit: 'g', calories: 254, protein: 17, carbs: 0, fat: 20, fiber: 0 },
  { name: 'Ribeye Steak', category: 'protein', servingSize: 100, servingUnit: 'g', calories: 291, protein: 24, carbs: 0, fat: 21, fiber: 0 },
  { name: 'Sirloin Steak', category: 'protein', servingSize: 100, servingUnit: 'g', calories: 206, protein: 26, carbs: 0, fat: 11, fiber: 0 },
  { name: 'Beef Tenderloin', category: 'protein', servingSize: 100, servingUnit: 'g', calories: 252, protein: 26, carbs: 0, fat: 16, fiber: 0 },
  { name: 'Beef Brisket', category: 'protein', servingSize: 100, servingUnit: 'g', calories: 331, protein: 21, carbs: 0, fat: 27, fiber: 0 },

  // Pork
  { name: 'Pork Chop (grilled)', category: 'protein', servingSize: 100, servingUnit: 'g', calories: 231, protein: 25, carbs: 0, fat: 14, fiber: 0 },
  { name: 'Pork Tenderloin', category: 'protein', servingSize: 100, servingUnit: 'g', calories: 143, protein: 26, carbs: 0, fat: 3.5, fiber: 0 },
  { name: 'Bacon', category: 'protein', servingSize: 30, servingUnit: 'g', calories: 161, protein: 12, carbs: 0.4, fat: 12, fiber: 0 },
  { name: 'Ham (sliced)', category: 'protein', servingSize: 100, servingUnit: 'g', calories: 145, protein: 21, carbs: 1.5, fat: 5.5, fiber: 0 },
  { name: 'Pork Sausage', category: 'protein', servingSize: 100, servingUnit: 'g', calories: 339, protein: 19, carbs: 0, fat: 28, fiber: 0 },

  // Fish & Seafood
  { name: 'Salmon (grilled)', category: 'protein', servingSize: 100, servingUnit: 'g', calories: 208, protein: 20, carbs: 0, fat: 13, fiber: 0 },
  { name: 'Salmon (raw/sashimi)', category: 'protein', servingSize: 100, servingUnit: 'g', calories: 179, protein: 20, carbs: 0, fat: 11, fiber: 0 },
  { name: 'Tuna (canned in water)', category: 'protein', servingSize: 100, servingUnit: 'g', calories: 116, protein: 26, carbs: 0, fat: 0.8, fiber: 0 },
  { name: 'Tuna Steak (grilled)', category: 'protein', servingSize: 100, servingUnit: 'g', calories: 184, protein: 30, carbs: 0, fat: 6, fiber: 0 },
  { name: 'Cod (baked)', category: 'protein', servingSize: 100, servingUnit: 'g', calories: 105, protein: 23, carbs: 0, fat: 0.9, fiber: 0 },
  { name: 'Tilapia (grilled)', category: 'protein', servingSize: 100, servingUnit: 'g', calories: 128, protein: 26, carbs: 0, fat: 2.7, fiber: 0 },
  { name: 'Shrimp (cooked)', category: 'protein', servingSize: 100, servingUnit: 'g', calories: 99, protein: 24, carbs: 0.2, fat: 0.3, fiber: 0 },
  { name: 'Lobster', category: 'protein', servingSize: 100, servingUnit: 'g', calories: 89, protein: 19, carbs: 0, fat: 0.9, fiber: 0 },
  { name: 'Crab Meat', category: 'protein', servingSize: 100, servingUnit: 'g', calories: 97, protein: 19, carbs: 0, fat: 1.5, fiber: 0 },
  { name: 'Scallops', category: 'protein', servingSize: 100, servingUnit: 'g', calories: 111, protein: 21, carbs: 3.2, fat: 1, fiber: 0 },

  // Turkey
  { name: 'Turkey Breast (roasted)', category: 'protein', servingSize: 100, servingUnit: 'g', calories: 135, protein: 30, carbs: 0, fat: 0.7, fiber: 0 },
  { name: 'Ground Turkey (93% lean)', category: 'protein', servingSize: 100, servingUnit: 'g', calories: 148, protein: 21, carbs: 0, fat: 7, fiber: 0 },
  { name: 'Turkey Deli Meat', category: 'protein', servingSize: 50, servingUnit: 'g', calories: 52, protein: 10, carbs: 1, fat: 0.5, fiber: 0 },

  // Eggs
  { name: 'Whole Egg (large)', category: 'protein', servingSize: 50, servingUnit: 'g', calories: 72, protein: 6.3, carbs: 0.4, fat: 5, fiber: 0 },
  { name: 'Egg White (large)', category: 'protein', servingSize: 33, servingUnit: 'g', calories: 17, protein: 3.6, carbs: 0.2, fat: 0.1, fiber: 0 },
  { name: 'Egg Yolk (large)', category: 'protein', servingSize: 17, servingUnit: 'g', calories: 55, protein: 2.7, carbs: 0.6, fat: 4.5, fiber: 0 },
  { name: 'Scrambled Eggs (2 eggs)', category: 'protein', servingSize: 122, servingUnit: 'g', calories: 182, protein: 12, carbs: 2, fat: 14, fiber: 0 },
  { name: 'Hard Boiled Egg', category: 'protein', servingSize: 50, servingUnit: 'g', calories: 77, protein: 6.3, carbs: 0.6, fat: 5.3, fiber: 0 },

  // Plant Proteins
  { name: 'Tofu (firm)', category: 'protein', servingSize: 100, servingUnit: 'g', calories: 144, protein: 17, carbs: 3, fat: 8, fiber: 2 },
  { name: 'Tempeh', category: 'protein', servingSize: 100, servingUnit: 'g', calories: 192, protein: 20, carbs: 8, fat: 11, fiber: 0 },
  { name: 'Seitan', category: 'protein', servingSize: 100, servingUnit: 'g', calories: 370, protein: 75, carbs: 14, fat: 2, fiber: 0 },
  { name: 'Edamame', category: 'protein', servingSize: 100, servingUnit: 'g', calories: 121, protein: 11, carbs: 9, fat: 5, fiber: 5 },

  // ========== DAIRY ==========
  { name: 'Whole Milk', category: 'dairy', servingSize: 244, servingUnit: 'ml', calories: 149, protein: 8, carbs: 12, fat: 8, fiber: 0, sugar: 12 },
  { name: 'Skim Milk', category: 'dairy', servingSize: 244, servingUnit: 'ml', calories: 83, protein: 8, carbs: 12, fat: 0.2, fiber: 0, sugar: 12 },
  { name: '2% Milk', category: 'dairy', servingSize: 244, servingUnit: 'ml', calories: 122, protein: 8, carbs: 12, fat: 5, fiber: 0, sugar: 12 },
  { name: 'Almond Milk (unsweetened)', category: 'dairy', servingSize: 240, servingUnit: 'ml', calories: 30, protein: 1, carbs: 1, fat: 2.5, fiber: 0, sugar: 0 },
  { name: 'Oat Milk', category: 'dairy', servingSize: 240, servingUnit: 'ml', calories: 120, protein: 3, carbs: 16, fat: 5, fiber: 2, sugar: 7 },
  { name: 'Soy Milk', category: 'dairy', servingSize: 240, servingUnit: 'ml', calories: 80, protein: 7, carbs: 4, fat: 4, fiber: 1, sugar: 1 },
  { name: 'Greek Yogurt (plain, non-fat)', category: 'dairy', servingSize: 170, servingUnit: 'g', calories: 100, protein: 17, carbs: 6, fat: 0.7, fiber: 0, sugar: 4 },
  { name: 'Greek Yogurt (plain, full-fat)', category: 'dairy', servingSize: 170, servingUnit: 'g', calories: 190, protein: 18, carbs: 5, fat: 11, fiber: 0, sugar: 4 },
  { name: 'Regular Yogurt', category: 'dairy', servingSize: 170, servingUnit: 'g', calories: 100, protein: 6, carbs: 14, fat: 2, fiber: 0, sugar: 11 },
  { name: 'Cottage Cheese (low-fat)', category: 'dairy', servingSize: 113, servingUnit: 'g', calories: 81, protein: 14, carbs: 3, fat: 1, fiber: 0 },
  { name: 'Cottage Cheese (full-fat)', category: 'dairy', servingSize: 113, servingUnit: 'g', calories: 110, protein: 12, carbs: 4, fat: 5, fiber: 0 },
  { name: 'Cheddar Cheese', category: 'dairy', servingSize: 28, servingUnit: 'g', calories: 113, protein: 7, carbs: 0.4, fat: 9.3, fiber: 0 },
  { name: 'Mozzarella Cheese', category: 'dairy', servingSize: 28, servingUnit: 'g', calories: 85, protein: 6, carbs: 0.6, fat: 6, fiber: 0 },
  { name: 'Parmesan Cheese', category: 'dairy', servingSize: 28, servingUnit: 'g', calories: 111, protein: 10, carbs: 0.9, fat: 7, fiber: 0 },
  { name: 'Feta Cheese', category: 'dairy', servingSize: 28, servingUnit: 'g', calories: 74, protein: 4, carbs: 1, fat: 6, fiber: 0 },
  { name: 'Cream Cheese', category: 'dairy', servingSize: 28, servingUnit: 'g', calories: 99, protein: 2, carbs: 1.6, fat: 10, fiber: 0 },
  { name: 'Butter', category: 'dairy', servingSize: 14, servingUnit: 'g', calories: 102, protein: 0.1, carbs: 0, fat: 11.5, fiber: 0 },

  // ========== GRAINS & CARBS ==========
  { name: 'White Rice (cooked)', category: 'grains', servingSize: 158, servingUnit: 'g', calories: 206, protein: 4.3, carbs: 45, fat: 0.4, fiber: 0.6 },
  { name: 'Brown Rice (cooked)', category: 'grains', servingSize: 195, servingUnit: 'g', calories: 216, protein: 5, carbs: 45, fat: 1.8, fiber: 3.5 },
  { name: 'Jasmine Rice (cooked)', category: 'grains', servingSize: 158, servingUnit: 'g', calories: 205, protein: 4, carbs: 45, fat: 0.4, fiber: 0.6 },
  { name: 'Basmati Rice (cooked)', category: 'grains', servingSize: 158, servingUnit: 'g', calories: 210, protein: 4.4, carbs: 46, fat: 0.5, fiber: 0.7 },
  { name: 'Quinoa (cooked)', category: 'grains', servingSize: 185, servingUnit: 'g', calories: 222, protein: 8, carbs: 39, fat: 3.6, fiber: 5 },
  { name: 'Oatmeal (cooked)', category: 'grains', servingSize: 234, servingUnit: 'g', calories: 158, protein: 6, carbs: 27, fat: 3.2, fiber: 4 },
  { name: 'Instant Oatmeal (packet)', category: 'grains', servingSize: 43, servingUnit: 'g', calories: 160, protein: 4, carbs: 32, fat: 2, fiber: 3 },
  { name: 'Pasta (cooked)', category: 'grains', servingSize: 140, servingUnit: 'g', calories: 220, protein: 8, carbs: 43, fat: 1.3, fiber: 2.5 },
  { name: 'Whole Wheat Pasta (cooked)', category: 'grains', servingSize: 140, servingUnit: 'g', calories: 174, protein: 7.5, carbs: 37, fat: 0.8, fiber: 6 },
  { name: 'Spaghetti (cooked)', category: 'grains', servingSize: 140, servingUnit: 'g', calories: 220, protein: 8, carbs: 43, fat: 1.3, fiber: 2.5 },
  { name: 'White Bread', category: 'grains', servingSize: 30, servingUnit: 'g', calories: 79, protein: 2.7, carbs: 15, fat: 1, fiber: 0.6 },
  { name: 'Whole Wheat Bread', category: 'grains', servingSize: 30, servingUnit: 'g', calories: 81, protein: 4, carbs: 14, fat: 1.1, fiber: 2 },
  { name: 'Sourdough Bread', category: 'grains', servingSize: 30, servingUnit: 'g', calories: 90, protein: 3.5, carbs: 17, fat: 0.6, fiber: 0.7 },
  { name: 'Bagel (plain)', category: 'grains', servingSize: 98, servingUnit: 'g', calories: 277, protein: 11, carbs: 54, fat: 1.4, fiber: 2.3 },
  { name: 'English Muffin', category: 'grains', servingSize: 57, servingUnit: 'g', calories: 132, protein: 5, carbs: 26, fat: 1, fiber: 2 },
  { name: 'Tortilla (flour)', category: 'grains', servingSize: 45, servingUnit: 'g', calories: 140, protein: 3.5, carbs: 24, fat: 3.5, fiber: 1.5 },
  { name: 'Tortilla (corn)', category: 'grains', servingSize: 26, servingUnit: 'g', calories: 52, protein: 1.4, carbs: 11, fat: 0.7, fiber: 1.5 },
  { name: 'Croissant', category: 'grains', servingSize: 57, servingUnit: 'g', calories: 231, protein: 5, carbs: 26, fat: 12, fiber: 1.5 },
  { name: 'Pancakes (2 medium)', category: 'grains', servingSize: 116, servingUnit: 'g', calories: 292, protein: 6, carbs: 50, fat: 8, fiber: 1.5, sugar: 12 },
  { name: 'Waffle (frozen)', category: 'grains', servingSize: 39, servingUnit: 'g', calories: 95, protein: 2, carbs: 15, fat: 3, fiber: 0.5 },

  // ========== FRUITS ==========
  { name: 'Apple (medium)', category: 'fruit', servingSize: 182, servingUnit: 'g', calories: 95, protein: 0.5, carbs: 25, fat: 0.3, fiber: 4.4, sugar: 19 },
  { name: 'Banana (medium)', category: 'fruit', servingSize: 118, servingUnit: 'g', calories: 105, protein: 1.3, carbs: 27, fat: 0.4, fiber: 3.1, sugar: 14 },
  { name: 'Orange (medium)', category: 'fruit', servingSize: 131, servingUnit: 'g', calories: 62, protein: 1.2, carbs: 15, fat: 0.2, fiber: 3.1, sugar: 12 },
  { name: 'Strawberries', category: 'fruit', servingSize: 144, servingUnit: 'g', calories: 46, protein: 1, carbs: 11, fat: 0.4, fiber: 2.9, sugar: 7 },
  { name: 'Blueberries', category: 'fruit', servingSize: 148, servingUnit: 'g', calories: 84, protein: 1.1, carbs: 21, fat: 0.5, fiber: 3.6, sugar: 15 },
  { name: 'Raspberries', category: 'fruit', servingSize: 123, servingUnit: 'g', calories: 64, protein: 1.5, carbs: 15, fat: 0.8, fiber: 8, sugar: 5 },
  { name: 'Grapes (red/green)', category: 'fruit', servingSize: 151, servingUnit: 'g', calories: 104, protein: 1.1, carbs: 27, fat: 0.2, fiber: 1.4, sugar: 23 },
  { name: 'Mango', category: 'fruit', servingSize: 165, servingUnit: 'g', calories: 99, protein: 1.4, carbs: 25, fat: 0.6, fiber: 2.6, sugar: 23 },
  { name: 'Pineapple', category: 'fruit', servingSize: 165, servingUnit: 'g', calories: 82, protein: 0.9, carbs: 22, fat: 0.2, fiber: 2.3, sugar: 16 },
  { name: 'Watermelon', category: 'fruit', servingSize: 154, servingUnit: 'g', calories: 46, protein: 0.9, carbs: 12, fat: 0.2, fiber: 0.6, sugar: 9 },
  { name: 'Cantaloupe', category: 'fruit', servingSize: 160, servingUnit: 'g', calories: 54, protein: 1.3, carbs: 13, fat: 0.3, fiber: 1.4, sugar: 12 },
  { name: 'Peach (medium)', category: 'fruit', servingSize: 150, servingUnit: 'g', calories: 59, protein: 1.4, carbs: 14, fat: 0.4, fiber: 2.3, sugar: 13 },
  { name: 'Pear (medium)', category: 'fruit', servingSize: 178, servingUnit: 'g', calories: 102, protein: 0.6, carbs: 27, fat: 0.2, fiber: 5.5, sugar: 17 },
  { name: 'Avocado', category: 'fruit', servingSize: 150, servingUnit: 'g', calories: 240, protein: 3, carbs: 13, fat: 22, fiber: 10, sugar: 1 },
  { name: 'Kiwi (medium)', category: 'fruit', servingSize: 69, servingUnit: 'g', calories: 42, protein: 0.8, carbs: 10, fat: 0.4, fiber: 2.1, sugar: 6 },
  { name: 'Grapefruit (half)', category: 'fruit', servingSize: 123, servingUnit: 'g', calories: 52, protein: 0.9, carbs: 13, fat: 0.2, fiber: 2, sugar: 8 },
  { name: 'Cherries', category: 'fruit', servingSize: 138, servingUnit: 'g', calories: 87, protein: 1.5, carbs: 22, fat: 0.3, fiber: 2.9, sugar: 18 },
  { name: 'Pomegranate Seeds', category: 'fruit', servingSize: 87, servingUnit: 'g', calories: 72, protein: 1.5, carbs: 16, fat: 1, fiber: 3.5, sugar: 12 },

  // ========== VEGETABLES ==========
  { name: 'Broccoli (cooked)', category: 'vegetable', servingSize: 156, servingUnit: 'g', calories: 55, protein: 3.7, carbs: 11, fat: 0.6, fiber: 5.1 },
  { name: 'Broccoli (raw)', category: 'vegetable', servingSize: 91, servingUnit: 'g', calories: 31, protein: 2.6, carbs: 6, fat: 0.3, fiber: 2.4 },
  { name: 'Spinach (raw)', category: 'vegetable', servingSize: 30, servingUnit: 'g', calories: 7, protein: 0.9, carbs: 1.1, fat: 0.1, fiber: 0.7 },
  { name: 'Spinach (cooked)', category: 'vegetable', servingSize: 180, servingUnit: 'g', calories: 41, protein: 5.4, carbs: 7, fat: 0.5, fiber: 4.3 },
  { name: 'Kale (raw)', category: 'vegetable', servingSize: 67, servingUnit: 'g', calories: 33, protein: 2.2, carbs: 6, fat: 0.5, fiber: 1.3 },
  { name: 'Lettuce (romaine)', category: 'vegetable', servingSize: 47, servingUnit: 'g', calories: 8, protein: 0.6, carbs: 1.5, fat: 0.1, fiber: 1 },
  { name: 'Carrot (medium)', category: 'vegetable', servingSize: 61, servingUnit: 'g', calories: 25, protein: 0.6, carbs: 6, fat: 0.1, fiber: 1.7 },
  { name: 'Carrots (baby)', category: 'vegetable', servingSize: 85, servingUnit: 'g', calories: 35, protein: 0.6, carbs: 8, fat: 0.1, fiber: 2.4 },
  { name: 'Bell Pepper (medium)', category: 'vegetable', servingSize: 119, servingUnit: 'g', calories: 31, protein: 1, carbs: 6, fat: 0.4, fiber: 2.1 },
  { name: 'Tomato (medium)', category: 'vegetable', servingSize: 123, servingUnit: 'g', calories: 22, protein: 1.1, carbs: 4.8, fat: 0.2, fiber: 1.5 },
  { name: 'Cherry Tomatoes', category: 'vegetable', servingSize: 149, servingUnit: 'g', calories: 27, protein: 1.3, carbs: 6, fat: 0.3, fiber: 1.8 },
  { name: 'Cucumber', category: 'vegetable', servingSize: 104, servingUnit: 'g', calories: 16, protein: 0.7, carbs: 3.8, fat: 0.1, fiber: 0.5 },
  { name: 'Zucchini (cooked)', category: 'vegetable', servingSize: 180, servingUnit: 'g', calories: 27, protein: 2, carbs: 5, fat: 0.4, fiber: 1.8 },
  { name: 'Mushrooms (white)', category: 'vegetable', servingSize: 70, servingUnit: 'g', calories: 15, protein: 2.2, carbs: 2.3, fat: 0.2, fiber: 0.7 },
  { name: 'Onion (medium)', category: 'vegetable', servingSize: 110, servingUnit: 'g', calories: 44, protein: 1.2, carbs: 10, fat: 0.1, fiber: 1.9 },
  { name: 'Garlic (clove)', category: 'vegetable', servingSize: 3, servingUnit: 'g', calories: 4, protein: 0.2, carbs: 1, fat: 0, fiber: 0.1 },
  { name: 'Celery (stalk)', category: 'vegetable', servingSize: 40, servingUnit: 'g', calories: 6, protein: 0.3, carbs: 1.2, fat: 0.1, fiber: 0.6 },
  { name: 'Asparagus (cooked)', category: 'vegetable', servingSize: 90, servingUnit: 'g', calories: 20, protein: 2.2, carbs: 3.7, fat: 0.2, fiber: 1.8 },
  { name: 'Green Beans (cooked)', category: 'vegetable', servingSize: 125, servingUnit: 'g', calories: 44, protein: 2.4, carbs: 10, fat: 0.4, fiber: 4 },
  { name: 'Corn (cooked)', category: 'vegetable', servingSize: 164, servingUnit: 'g', calories: 143, protein: 5, carbs: 31, fat: 2.1, fiber: 3.6 },
  { name: 'Peas (cooked)', category: 'vegetable', servingSize: 160, servingUnit: 'g', calories: 134, protein: 8.6, carbs: 25, fat: 0.4, fiber: 8.8 },
  { name: 'Sweet Potato (baked)', category: 'vegetable', servingSize: 200, servingUnit: 'g', calories: 180, protein: 4, carbs: 41, fat: 0.2, fiber: 6.6 },
  { name: 'Potato (baked)', category: 'vegetable', servingSize: 173, servingUnit: 'g', calories: 161, protein: 4.3, carbs: 37, fat: 0.2, fiber: 3.8 },
  { name: 'Cauliflower (cooked)', category: 'vegetable', servingSize: 124, servingUnit: 'g', calories: 29, protein: 2.3, carbs: 5.1, fat: 0.6, fiber: 2.9 },
  { name: 'Brussels Sprouts (cooked)', category: 'vegetable', servingSize: 156, servingUnit: 'g', calories: 56, protein: 4, carbs: 11, fat: 0.8, fiber: 4.1 },
  { name: 'Cabbage (raw)', category: 'vegetable', servingSize: 89, servingUnit: 'g', calories: 22, protein: 1.1, carbs: 5.2, fat: 0.1, fiber: 2.2 },
  { name: 'Eggplant (cooked)', category: 'vegetable', servingSize: 99, servingUnit: 'g', calories: 35, protein: 0.8, carbs: 8.6, fat: 0.2, fiber: 2.5 },

  // ========== LEGUMES ==========
  { name: 'Black Beans (cooked)', category: 'legumes', servingSize: 172, servingUnit: 'g', calories: 227, protein: 15, carbs: 41, fat: 0.9, fiber: 15 },
  { name: 'Kidney Beans (cooked)', category: 'legumes', servingSize: 177, servingUnit: 'g', calories: 225, protein: 15, carbs: 40, fat: 0.9, fiber: 11 },
  { name: 'Chickpeas (cooked)', category: 'legumes', servingSize: 164, servingUnit: 'g', calories: 269, protein: 15, carbs: 45, fat: 4.2, fiber: 12.5 },
  { name: 'Lentils (cooked)', category: 'legumes', servingSize: 198, servingUnit: 'g', calories: 230, protein: 18, carbs: 40, fat: 0.8, fiber: 15.6 },
  { name: 'Pinto Beans (cooked)', category: 'legumes', servingSize: 171, servingUnit: 'g', calories: 245, protein: 15, carbs: 45, fat: 1.1, fiber: 15 },
  { name: 'Navy Beans (cooked)', category: 'legumes', servingSize: 182, servingUnit: 'g', calories: 255, protein: 15, carbs: 47, fat: 1.1, fiber: 19 },
  { name: 'Hummus', category: 'legumes', servingSize: 62, servingUnit: 'g', calories: 109, protein: 3, carbs: 10, fat: 6, fiber: 2 },

  // ========== NUTS & SEEDS ==========
  { name: 'Almonds', category: 'nuts', servingSize: 28, servingUnit: 'g', calories: 164, protein: 6, carbs: 6, fat: 14, fiber: 3.5 },
  { name: 'Walnuts', category: 'nuts', servingSize: 28, servingUnit: 'g', calories: 185, protein: 4.3, carbs: 3.9, fat: 18.5, fiber: 1.9 },
  { name: 'Cashews', category: 'nuts', servingSize: 28, servingUnit: 'g', calories: 157, protein: 5.2, carbs: 8.6, fat: 12.4, fiber: 0.9 },
  { name: 'Peanuts', category: 'nuts', servingSize: 28, servingUnit: 'g', calories: 161, protein: 7, carbs: 4.6, fat: 14, fiber: 2.4 },
  { name: 'Peanut Butter', category: 'nuts', servingSize: 32, servingUnit: 'g', calories: 188, protein: 8, carbs: 6, fat: 16, fiber: 1.9 },
  { name: 'Almond Butter', category: 'nuts', servingSize: 32, servingUnit: 'g', calories: 196, protein: 6.8, carbs: 6, fat: 18, fiber: 3.3 },
  { name: 'Pistachios', category: 'nuts', servingSize: 28, servingUnit: 'g', calories: 159, protein: 5.7, carbs: 7.7, fat: 12.9, fiber: 3 },
  { name: 'Macadamia Nuts', category: 'nuts', servingSize: 28, servingUnit: 'g', calories: 204, protein: 2.2, carbs: 3.9, fat: 21.5, fiber: 2.4 },
  { name: 'Pecans', category: 'nuts', servingSize: 28, servingUnit: 'g', calories: 196, protein: 2.6, carbs: 3.9, fat: 20.4, fiber: 2.7 },
  { name: 'Chia Seeds', category: 'nuts', servingSize: 28, servingUnit: 'g', calories: 137, protein: 4.4, carbs: 12, fat: 8.6, fiber: 10 },
  { name: 'Flax Seeds', category: 'nuts', servingSize: 28, servingUnit: 'g', calories: 150, protein: 5.1, carbs: 8.1, fat: 11.8, fiber: 7.6 },
  { name: 'Sunflower Seeds', category: 'nuts', servingSize: 28, servingUnit: 'g', calories: 165, protein: 5.5, carbs: 6.8, fat: 14, fiber: 3.1 },
  { name: 'Pumpkin Seeds', category: 'nuts', servingSize: 28, servingUnit: 'g', calories: 151, protein: 7, carbs: 5, fat: 13, fiber: 1.1 },

  // ========== FATS & OILS ==========
  { name: 'Olive Oil', category: 'fats', servingSize: 14, servingUnit: 'ml', calories: 119, protein: 0, carbs: 0, fat: 13.5, fiber: 0 },
  { name: 'Coconut Oil', category: 'fats', servingSize: 14, servingUnit: 'ml', calories: 121, protein: 0, carbs: 0, fat: 13.5, fiber: 0 },
  { name: 'Avocado Oil', category: 'fats', servingSize: 14, servingUnit: 'ml', calories: 124, protein: 0, carbs: 0, fat: 14, fiber: 0 },
  { name: 'Vegetable Oil', category: 'fats', servingSize: 14, servingUnit: 'ml', calories: 124, protein: 0, carbs: 0, fat: 14, fiber: 0 },

  // ========== SNACKS ==========
  { name: 'Protein Bar (average)', category: 'snack', servingSize: 60, servingUnit: 'g', calories: 200, protein: 20, carbs: 22, fat: 6, fiber: 3 },
  { name: 'Granola Bar', category: 'snack', servingSize: 35, servingUnit: 'g', calories: 140, protein: 3, carbs: 26, fat: 4, fiber: 2, sugar: 12 },
  { name: 'Trail Mix', category: 'snack', servingSize: 40, servingUnit: 'g', calories: 200, protein: 5, carbs: 18, fat: 13, fiber: 2 },
  { name: 'Dark Chocolate (70%)', category: 'snack', servingSize: 28, servingUnit: 'g', calories: 170, protein: 2, carbs: 13, fat: 12, fiber: 3, sugar: 7 },
  { name: 'Milk Chocolate', category: 'snack', servingSize: 28, servingUnit: 'g', calories: 153, protein: 2.2, carbs: 17, fat: 8.5, fiber: 0.6, sugar: 15 },
  { name: 'Potato Chips', category: 'snack', servingSize: 28, servingUnit: 'g', calories: 152, protein: 2, carbs: 15, fat: 10, fiber: 1.2 },
  { name: 'Tortilla Chips', category: 'snack', servingSize: 28, servingUnit: 'g', calories: 140, protein: 2, carbs: 18, fat: 7, fiber: 1 },
  { name: 'Popcorn (air-popped)', category: 'snack', servingSize: 28, servingUnit: 'g', calories: 110, protein: 3, carbs: 22, fat: 1.3, fiber: 4 },
  { name: 'Pretzels', category: 'snack', servingSize: 28, servingUnit: 'g', calories: 108, protein: 2.8, carbs: 22.5, fat: 1, fiber: 0.9 },
  { name: 'Rice Cakes', category: 'snack', servingSize: 9, servingUnit: 'g', calories: 35, protein: 0.7, carbs: 7.3, fat: 0.3, fiber: 0.4 },
  { name: 'Crackers (whole wheat)', category: 'snack', servingSize: 28, servingUnit: 'g', calories: 118, protein: 2.5, carbs: 19, fat: 4, fiber: 2.8 },

  // ========== BEVERAGES ==========
  { name: 'Orange Juice', category: 'beverage', servingSize: 240, servingUnit: 'ml', calories: 112, protein: 1.7, carbs: 26, fat: 0.5, fiber: 0.5, sugar: 21 },
  { name: 'Apple Juice', category: 'beverage', servingSize: 240, servingUnit: 'ml', calories: 114, protein: 0.2, carbs: 28, fat: 0.3, fiber: 0.2, sugar: 24 },
  { name: 'Coca-Cola', category: 'beverage', servingSize: 355, servingUnit: 'ml', calories: 140, protein: 0, carbs: 39, fat: 0, fiber: 0, sugar: 39 },
  { name: 'Diet Coke', category: 'beverage', servingSize: 355, servingUnit: 'ml', calories: 0, protein: 0, carbs: 0, fat: 0, fiber: 0, sugar: 0 },
  { name: 'Coffee (black)', category: 'beverage', servingSize: 240, servingUnit: 'ml', calories: 2, protein: 0.3, carbs: 0, fat: 0, fiber: 0, sugar: 0 },
  { name: 'Latte (whole milk)', category: 'beverage', servingSize: 480, servingUnit: 'ml', calories: 190, protein: 10, carbs: 15, fat: 7, fiber: 0, sugar: 14 },
  { name: 'Cappuccino', category: 'beverage', servingSize: 240, servingUnit: 'ml', calories: 80, protein: 4, carbs: 6, fat: 4, fiber: 0, sugar: 6 },
  { name: 'Green Tea', category: 'beverage', servingSize: 240, servingUnit: 'ml', calories: 0, protein: 0, carbs: 0, fat: 0, fiber: 0, sugar: 0 },
  { name: 'Protein Shake (whey)', category: 'beverage', servingSize: 350, servingUnit: 'ml', calories: 150, protein: 25, carbs: 5, fat: 2, fiber: 0 },
  { name: 'Smoothie (fruit)', category: 'beverage', servingSize: 350, servingUnit: 'ml', calories: 180, protein: 3, carbs: 42, fat: 0.5, fiber: 3, sugar: 35 },
  { name: 'Sports Drink (Gatorade)', category: 'beverage', servingSize: 355, servingUnit: 'ml', calories: 80, protein: 0, carbs: 21, fat: 0, fiber: 0, sugar: 21 },
  { name: 'Energy Drink (Red Bull)', category: 'beverage', servingSize: 250, servingUnit: 'ml', calories: 110, protein: 0, carbs: 28, fat: 0, fiber: 0, sugar: 27 },
  { name: 'Beer (regular)', category: 'beverage', servingSize: 355, servingUnit: 'ml', calories: 153, protein: 1.6, carbs: 13, fat: 0, fiber: 0 },
  { name: 'Red Wine', category: 'beverage', servingSize: 150, servingUnit: 'ml', calories: 125, protein: 0.1, carbs: 3.8, fat: 0, fiber: 0 },
  { name: 'White Wine', category: 'beverage', servingSize: 150, servingUnit: 'ml', calories: 121, protein: 0.1, carbs: 3.8, fat: 0, fiber: 0 },

  // ========== FAST FOOD ==========
  { name: 'Cheeseburger', category: 'fast_food', servingSize: 154, servingUnit: 'g', calories: 359, protein: 18, carbs: 29, fat: 18, fiber: 1.3 },
  { name: 'Big Mac', brand: 'McDonald\'s', category: 'fast_food', servingSize: 215, servingUnit: 'g', calories: 550, protein: 25, carbs: 46, fat: 30, fiber: 3 },
  { name: 'Quarter Pounder with Cheese', brand: 'McDonald\'s', category: 'fast_food', servingSize: 221, servingUnit: 'g', calories: 520, protein: 30, carbs: 42, fat: 26, fiber: 2 },
  { name: 'French Fries (medium)', category: 'fast_food', servingSize: 117, servingUnit: 'g', calories: 340, protein: 4, carbs: 44, fat: 16, fiber: 4 },
  { name: 'Chicken Nuggets (6 pc)', category: 'fast_food', servingSize: 96, servingUnit: 'g', calories: 280, protein: 13, carbs: 18, fat: 17, fiber: 1 },
  { name: 'Hot Dog', category: 'fast_food', servingSize: 98, servingUnit: 'g', calories: 290, protein: 10, carbs: 24, fat: 17, fiber: 0.8 },
  { name: 'Pizza Slice (pepperoni)', category: 'fast_food', servingSize: 107, servingUnit: 'g', calories: 298, protein: 13, carbs: 34, fat: 12, fiber: 2.3 },
  { name: 'Pizza Slice (cheese)', category: 'fast_food', servingSize: 107, servingUnit: 'g', calories: 272, protein: 12, carbs: 34, fat: 10, fiber: 2.3 },
  { name: 'Burrito (beef)', category: 'fast_food', servingSize: 220, servingUnit: 'g', calories: 431, protein: 19, carbs: 46, fat: 19, fiber: 4 },
  { name: 'Taco (beef)', category: 'fast_food', servingSize: 78, servingUnit: 'g', calories: 170, protein: 8, carbs: 13, fat: 10, fiber: 1 },
  { name: 'Fried Chicken (breast)', category: 'fast_food', servingSize: 140, servingUnit: 'g', calories: 360, protein: 34, carbs: 11, fat: 21, fiber: 0.4 },
  { name: 'Fish & Chips', category: 'fast_food', servingSize: 300, servingUnit: 'g', calories: 585, protein: 22, carbs: 54, fat: 31, fiber: 4.2 },
  { name: 'Subway 6" Turkey Sub', brand: 'Subway', category: 'fast_food', servingSize: 217, servingUnit: 'g', calories: 280, protein: 18, carbs: 46, fat: 3.5, fiber: 5 },

  // ========== CONDIMENTS & SAUCES ==========
  { name: 'Ketchup', category: 'condiment', servingSize: 17, servingUnit: 'g', calories: 17, protein: 0.2, carbs: 4.5, fat: 0, fiber: 0, sugar: 3.6 },
  { name: 'Mustard', category: 'condiment', servingSize: 5, servingUnit: 'g', calories: 3, protein: 0.2, carbs: 0.3, fat: 0.2, fiber: 0.1 },
  { name: 'Mayonnaise', category: 'condiment', servingSize: 13, servingUnit: 'g', calories: 94, protein: 0.1, carbs: 0, fat: 10.3, fiber: 0 },
  { name: 'Mayonnaise (light)', category: 'condiment', servingSize: 15, servingUnit: 'g', calories: 35, protein: 0, carbs: 1, fat: 3.5, fiber: 0 },
  { name: 'Ranch Dressing', category: 'condiment', servingSize: 30, servingUnit: 'g', calories: 145, protein: 0.4, carbs: 1.4, fat: 15, fiber: 0 },
  { name: 'Italian Dressing', category: 'condiment', servingSize: 30, servingUnit: 'g', calories: 85, protein: 0.1, carbs: 2.5, fat: 8.3, fiber: 0 },
  { name: 'Balsamic Vinegar', category: 'condiment', servingSize: 15, servingUnit: 'ml', calories: 14, protein: 0, carbs: 2.7, fat: 0, fiber: 0, sugar: 2.4 },
  { name: 'Soy Sauce', category: 'condiment', servingSize: 18, servingUnit: 'ml', calories: 10, protein: 1, carbs: 1, fat: 0, fiber: 0 },
  { name: 'Hot Sauce', category: 'condiment', servingSize: 5, servingUnit: 'ml', calories: 0, protein: 0, carbs: 0, fat: 0, fiber: 0 },
  { name: 'BBQ Sauce', category: 'condiment', servingSize: 30, servingUnit: 'g', calories: 52, protein: 0.2, carbs: 12.5, fat: 0.2, fiber: 0.2, sugar: 9 },
  { name: 'Honey', category: 'condiment', servingSize: 21, servingUnit: 'g', calories: 64, protein: 0.1, carbs: 17, fat: 0, fiber: 0, sugar: 17 },
  { name: 'Maple Syrup', category: 'condiment', servingSize: 30, servingUnit: 'ml', calories: 78, protein: 0, carbs: 20, fat: 0, fiber: 0, sugar: 18 },
  { name: 'Salsa', category: 'condiment', servingSize: 30, servingUnit: 'g', calories: 10, protein: 0.5, carbs: 2, fat: 0, fiber: 0.5, sugar: 1 },
  { name: 'Guacamole', category: 'condiment', servingSize: 30, servingUnit: 'g', calories: 50, protein: 0.6, carbs: 2.6, fat: 4.5, fiber: 2, sugar: 0.3 },

  // ========== SUPPLEMENTS ==========
  { name: 'Whey Protein (scoop)', category: 'supplement', servingSize: 30, servingUnit: 'g', calories: 120, protein: 24, carbs: 3, fat: 1.5, fiber: 0 },
  { name: 'Casein Protein (scoop)', category: 'supplement', servingSize: 33, servingUnit: 'g', calories: 120, protein: 24, carbs: 3, fat: 1, fiber: 0 },
  { name: 'Plant Protein (scoop)', category: 'supplement', servingSize: 35, servingUnit: 'g', calories: 130, protein: 20, carbs: 6, fat: 3, fiber: 2 },
  { name: 'Mass Gainer (serving)', category: 'supplement', servingSize: 165, servingUnit: 'g', calories: 620, protein: 32, carbs: 104, fat: 8, fiber: 4 },
  { name: 'BCAA Powder', category: 'supplement', servingSize: 7, servingUnit: 'g', calories: 25, protein: 5, carbs: 1, fat: 0, fiber: 0 },
  { name: 'Creatine Monohydrate', category: 'supplement', servingSize: 5, servingUnit: 'g', calories: 0, protein: 0, carbs: 0, fat: 0, fiber: 0 },
];

async function seedFoods() {
  console.log('🌱 Seeding food database...');

  let created = 0;
  let skipped = 0;

  for (const food of foods) {
    try {
      // Check if food already exists
      const existing = await prisma.food.findFirst({
        where: {
          name: food.name,
          brand: food.brand || null
        }
      });

      if (existing) {
        skipped++;
        continue;
      }

      await prisma.food.create({
        data: {
          name: food.name,
          brand: food.brand,
          category: food.category,
          servingSize: food.servingSize,
          servingUnit: food.servingUnit,
          calories: food.calories,
          protein: food.protein,
          carbs: food.carbs,
          fat: food.fat,
          fiber: food.fiber,
          sugar: food.sugar,
        }
      });
      created++;
    } catch (error) {
      console.error(`Failed to create food: ${food.name}`, error);
    }
  }

  console.log(`✅ Food database seeded: ${created} created, ${skipped} skipped (already exist)`);
  console.log(`📊 Total foods in database: ${await prisma.food.count()}`);
}

// Run if called directly
seedFoods()
  .catch(console.error)
  .finally(() => prisma.$disconnect());

export { seedFoods, foods };
