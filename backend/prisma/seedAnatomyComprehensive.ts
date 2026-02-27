import { PrismaClient } from '@prisma/client';
import { COMPLETE_ANATOMY } from './anatomy/index';
import bcrypt from 'bcryptjs';
import * as fs from 'fs';
import * as path from 'path';

const prisma = new PrismaClient();

// ============================================================================
// COMPREHENSIVE MEDICAL ANATOMY SEED
// Seeds ~586 anatomical structures including:
// - 206 bones (complete human skeleton)
// - 200+ muscles (all major muscles)
// - 55+ nerves (cranial, spinal, peripheral)
// - 70+ organs (all major organs)
// - 55+ blood vessels (major arteries and veins)
// ============================================================================

async function seedAnatomyComprehensive() {
  console.log('Starting comprehensive medical anatomy seed...\n');
  console.log(`Total items to seed: ${COMPLETE_ANATOMY.length}\n`);

  // Clear existing data
  console.log('Clearing existing body parts and exercises...');
  await prisma.exerciseBodyPart.deleteMany({});
  await prisma.bodyPart.deleteMany({});

  let successCount = 0;
  let errorCount = 0;

  // Seed all anatomy data
  for (const item of COMPLETE_ANATOMY) {
    try {
      // Create the body part
      const bodyPart = await prisma.bodyPart.create({
        data: {
          name: item.name,
          type: item.type,
          category: item.category,
          description: item.description,
          function: item.function,
          importance: item.importance,
          movement: (item as any).movement || null,
          recoveryTime: (item as any).recoveryTime || null,
          modelLayer: item.modelLayer,
          position3D: item.position3D,
        },
      });

      // Create exercises if they exist
      if (item.exercises && item.exercises.length > 0) {
        for (const ex of item.exercises) {
          // Check if exercise exists
          let exercise = await prisma.exercise.findFirst({
            where: { name: ex.name },
          });

          // Create exercise if it doesn't exist
          if (!exercise) {
            exercise = await prisma.exercise.create({
              data: {
                name: ex.name,
                category: item.type === 'muscle' ? 'strength' : 'mobility',
                difficulty: 'intermediate',
                equipment: 'varies',
                description: ex.description,
                instructions: ex.description,
                mechanicalLoad: 'Standard loading pattern',
                jointInvolvement: 'Multiple joints involved',
              },
            });
          }

          // Create the relationship
          await prisma.exerciseBodyPart.create({
            data: {
              exerciseId: exercise.id,
              bodyPartId: bodyPart.id,
              activationRank: ex.rank,
              activationRanking: ex.rank,
              activationDescription: ex.description,
            },
          });
        }
      }

      successCount++;

      // Progress indicator every 50 items
      if (successCount % 50 === 0) {
        console.log(`Progress: ${successCount}/${COMPLETE_ANATOMY.length} items seeded...`);
      }
    } catch (error) {
      errorCount++;
      console.error(`Error creating ${item.name}:`, error);
    }
  }

  // Get counts by type
  const totalCount = await prisma.bodyPart.count();
  const muscleCount = await prisma.bodyPart.count({ where: { type: 'muscle' } });
  const boneCount = await prisma.bodyPart.count({ where: { type: 'bone' } });
  const organCount = await prisma.bodyPart.count({ where: { type: 'organ' } });
  const veinCount = await prisma.bodyPart.count({ where: { type: 'vein' } });
  const nerveCount = await prisma.bodyPart.count({ where: { type: 'nerve' } });
  const exerciseCount = await prisma.exercise.count();
  const relationshipCount = await prisma.exerciseBodyPart.count();

  console.log('\n========================================');
  console.log('COMPREHENSIVE ANATOMY SEED COMPLETE!');
  console.log('========================================');
  console.log(`Total Body Parts: ${totalCount}`);
  console.log(`  - Bones: ${boneCount}`);
  console.log(`  - Muscles: ${muscleCount}`);
  console.log(`  - Organs: ${organCount}`);
  console.log(`  - Blood Vessels: ${veinCount}`);
  console.log(`  - Nerves: ${nerveCount}`);
  console.log(`Exercises: ${exerciseCount}`);
  console.log(`Exercise-BodyPart Relations: ${relationshipCount}`);
  console.log(`Successful: ${successCount}`);
  console.log(`Errors: ${errorCount}`);
  console.log('========================================\n');

  // Seed foods from JSON
  console.log('🍎 Seeding foods...');
  await prisma.food.deleteMany();
  const foodsPath = path.join(__dirname, '../../tools/sample-data/foods.json');
  const foodsData = JSON.parse(fs.readFileSync(foodsPath, 'utf-8'));

  for (const food of foodsData) {
    await prisma.food.create({
      data: {
        name: food.name,
        category: food.category,
        servingSize: food.servingSize,
        servingUnit: food.servingUnit,
        calories: food.calories,
        protein: food.protein,
        carbs: food.carbs,
        fat: food.fat,
        fiber: food.fiber || null,
        sugar: food.sugar || null
      }
    });
  }
  console.log(`✅ Created ${foodsData.length} foods\n`);

  // Create demo user
  console.log('👤 Creating demo user...');
  await prisma.user.deleteMany();
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

  // Create sample activity log
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

  console.log('🎉 Full database seeding completed!\n');
}

// Run the seed
seedAnatomyComprehensive()
  .catch((e) => {
    console.error('Error seeding anatomy:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
