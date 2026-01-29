/**
 * Database Seed Script
 * 
 * Populates database with:
 * - Body parts (muscles, organs) with educational content
 * - Exercises with biomechanics explanations
 * - Foods with nutrition data
 * - Sample user for testing
 */

import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import * as fs from 'fs';
import * as path from 'path';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed...\n');

  // Clear existing data (in order due to foreign keys)
  console.log('🗑️  Clearing existing data...');
  await prisma.exerciseBodyPart.deleteMany();
  await prisma.workoutExercise.deleteMany();
  await prisma.workout.deleteMany();
  await prisma.workoutPlan.deleteMany();
  await prisma.nutritionLog.deleteMany();
  await prisma.activityLog.deleteMany();
  await prisma.muscleUsageLog.deleteMany();
  await prisma.report.deleteMany();
  await prisma.exercise.deleteMany();
  await prisma.food.deleteMany();
  await prisma.bodyPart.deleteMany();
  await prisma.user.deleteMany();
  console.log('✅ Existing data cleared\n');

  // 1. Load and seed body parts
  console.log('📚 Seeding body parts...');
  const bodyPartsPath = path.join(__dirname, '../../../tools/sample-data/bodyParts.json');
  const bodyPartsData = JSON.parse(fs.readFileSync(bodyPartsPath, 'utf-8'));
  
  const bodyPartMap = new Map<string, string>(); // name -> id
  
  for (const bodyPart of bodyPartsData) {
    const created = await prisma.bodyPart.create({
      data: {
        name: bodyPart.name,
        type: bodyPart.type,
        category: bodyPart.category,
        description: bodyPart.description,
        function: bodyPart.function,
        importance: bodyPart.importance,
        movement: bodyPart.movement,
        modelLayer: bodyPart.modelLayer,
        position3D: bodyPart.position3D,
        recoveryTime: bodyPart.recoveryTime
      }
    });
    bodyPartMap.set(bodyPart.name, created.id);
  }
  console.log(`✅ Created ${bodyPartsData.length} body parts\n`);

  // 2. Load and seed exercises
  console.log('💪 Seeding exercises...');
  const exercisesPath = path.join(__dirname, '../../../tools/sample-data/exercises.json');
  const exercisesData = JSON.parse(fs.readFileSync(exercisesPath, 'utf-8'));
  
  for (const exercise of exercisesData) {
    const created = await prisma.exercise.create({
      data: {
        name: exercise.name,
        category: exercise.category,
        difficulty: exercise.difficulty,
        equipment: exercise.equipment,
        description: exercise.description,
        instructions: exercise.instructions,
        sportTags: exercise.sportTags,
        mechanicalLoad: exercise.mechanicalLoad,
        jointInvolvement: exercise.jointInvolvement
      }
    });

    // Create exercise-bodypart relationships
    if (exercise.primaryMuscles) {
      for (const muscleRelation of exercise.primaryMuscles) {
        const bodyPartId = bodyPartMap.get(muscleRelation.muscle);
        if (bodyPartId) {
          await prisma.exerciseBodyPart.create({
            data: {
              exerciseId: created.id,
              bodyPartId: bodyPartId,
              activationRank: muscleRelation.activationRank,
              activationRanking: muscleRelation.activationRank,
              activationDescription: muscleRelation.explanation
            }
          });
        }
      }
    }
  }
  console.log(`✅ Created ${exercisesData.length} exercises with muscle activation data\n`);

  // 3. Seed foods
  console.log('🍎 Seeding foods...');
  const foods = [
    {
      name: 'Chicken Breast (Grilled)',
      brand: null,
      servingSize: 100,
      servingUnit: 'g',
      calories: 165,
      protein: 31,
      carbs: 0,
      fat: 3.6,
      fiber: 0,
      sugar: 0,
      vitaminA: 21,
      vitaminC: 0,
      vitaminD: 0.1,
      calcium: 15,
      iron: 1,
      potassium: 256,
      sodium: 74
    },
    {
      name: 'Brown Rice (Cooked)',
      brand: null,
      servingSize: 100,
      servingUnit: 'g',
      calories: 112,
      protein: 2.6,
      carbs: 24,
      fat: 0.9,
      fiber: 1.8,
      sugar: 0.4,
      vitaminA: 0,
      vitaminC: 0,
      vitaminD: 0,
      calcium: 10,
      iron: 0.4,
      potassium: 43,
      sodium: 1
    },
    {
      name: 'Broccoli (Steamed)',
      brand: null,
      servingSize: 100,
      servingUnit: 'g',
      calories: 35,
      protein: 2.4,
      carbs: 7,
      fat: 0.4,
      fiber: 3.3,
      sugar: 1.4,
      vitaminA: 623,
      vitaminC: 64.9,
      vitaminD: 0,
      calcium: 47,
      iron: 0.7,
      potassium: 293,
      sodium: 33
    },
    {
      name: 'Salmon (Grilled)',
      brand: null,
      servingSize: 100,
      servingUnit: 'g',
      calories: 206,
      protein: 22,
      carbs: 0,
      fat: 13,
      fiber: 0,
      sugar: 0,
      vitaminA: 50,
      vitaminC: 0,
      vitaminD: 11,
      calcium: 15,
      iron: 0.5,
      potassium: 363,
      sodium: 59
    },
    {
      name: 'Eggs (Whole, Boiled)',
      brand: null,
      servingSize: 100,
      servingUnit: 'g',
      calories: 155,
      protein: 13,
      carbs: 1.1,
      fat: 11,
      fiber: 0,
      sugar: 1.1,
      vitaminA: 540,
      vitaminC: 0,
      vitaminD: 2.2,
      calcium: 56,
      iron: 1.8,
      potassium: 126,
      sodium: 124
    },
    {
      name: 'Sweet Potato (Baked)',
      brand: null,
      servingSize: 100,
      servingUnit: 'g',
      calories: 90,
      protein: 2,
      carbs: 21,
      fat: 0.2,
      fiber: 3.3,
      sugar: 6.5,
      vitaminA: 19218,
      vitaminC: 19.6,
      vitaminD: 0,
      calcium: 38,
      iron: 0.7,
      potassium: 475,
      sodium: 36
    },
    {
      name: 'Greek Yogurt (Plain)',
      brand: 'Generic',
      servingSize: 100,
      servingUnit: 'g',
      calories: 59,
      protein: 10,
      carbs: 3.6,
      fat: 0.4,
      fiber: 0,
      sugar: 3.2,
      vitaminA: 0,
      vitaminC: 0.8,
      vitaminD: 0,
      calcium: 110,
      iron: 0,
      potassium: 141,
      sodium: 36
    },
    {
      name: 'Almonds (Raw)',
      brand: null,
      servingSize: 28,
      servingUnit: 'g',
      calories: 161,
      protein: 6,
      carbs: 6,
      fat: 14,
      fiber: 3.5,
      sugar: 1.2,
      vitaminA: 1,
      vitaminC: 0,
      vitaminD: 0,
      calcium: 76,
      iron: 1,
      potassium: 208,
      sodium: 0
    },
    {
      name: 'Banana (Medium)',
      brand: null,
      servingSize: 118,
      servingUnit: 'g',
      calories: 105,
      protein: 1.3,
      carbs: 27,
      fat: 0.4,
      fiber: 3.1,
      sugar: 14,
      vitaminA: 76,
      vitaminC: 10.3,
      vitaminD: 0,
      calcium: 6,
      iron: 0.3,
      potassium: 422,
      sodium: 1
    },
    {
      name: 'Oatmeal (Cooked)',
      brand: null,
      servingSize: 100,
      servingUnit: 'g',
      calories: 71,
      protein: 2.5,
      carbs: 12,
      fat: 1.5,
      fiber: 1.7,
      sugar: 0.3,
      vitaminA: 0,
      vitaminC: 0,
      vitaminD: 0,
      calcium: 9,
      iron: 0.9,
      potassium: 70,
      sodium: 4
    }
  ];

  for (const food of foods) {
    await prisma.food.create({ data: food });
  }
  console.log(`✅ Created ${foods.length} foods\n`);

  // 4. Create sample user
  console.log('👤 Creating sample user...');
  const hashedPassword = await bcrypt.hash('password123', 10);
  
  const user = await prisma.user.create({
    data: {
      email: 'demo@anatomlabs.com',
      password: hashedPassword,
      name: 'Demo User',
      age: 25,
      gender: 'male',
      weight: 75,
      height: 180,
      activityLevel: 'moderate',
      fitnessGoal: 'muscle_gain',
      goal: 'muscle_gain',
      experienceLevel: 'intermediate'
    }
  });
  console.log(`✅ Created demo user (email: demo@anatomlabs.com, password: password123)\n`);

  // 5. Create sample activity log
  console.log('📊 Creating sample data for demo user...');
  await prisma.activityLog.create({
    data: {
      userId: user.id,
      date: new Date(),
      steps: 8500,
      distance: 6.8,
      activeMinutes: 45,
      caloriesBurned: 320
    }
  });
  console.log('✅ Created sample activity log\n');

  console.log('🎉 Database seeding completed successfully!\n');
  console.log('📝 Summary:');
  console.log(`   - Body Parts: ${bodyPartsData.length} (muscles, organs)`);
  console.log(`   - Exercises: ${exercisesData.length} (with biomechanics)`);
  console.log(`   - Foods: ${foods.length}`);
  console.log(`   - Demo User: demo@anatomlabs.com`);
  console.log('\n🚀 Ready to start the server!\n');
}

main()
  .catch((e) => {
    console.error('❌ Seeding error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
