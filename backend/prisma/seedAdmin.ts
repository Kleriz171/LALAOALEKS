import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

function randomInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomFloat(min: number, max: number, decimals = 1) {
  return parseFloat((Math.random() * (max - min) + min).toFixed(decimals));
}

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function pickN<T>(arr: T[], n: number): T[] {
  const shuffled = [...arr].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, n);
}

function daysAgo(n: number): Date {
  const d = new Date();
  d.setDate(d.getDate() - n);
  d.setHours(randomInt(6, 22), randomInt(0, 59), 0, 0);
  return d;
}

function randomDateBetween(start: Date, end: Date): Date {
  const s = start.getTime();
  const e = end.getTime();
  return new Date(s + Math.random() * (e - s));
}

const GOALS = ['muscle_gain', 'fat_loss', 'endurance', 'general_fitness', 'sport_specific'];
const EXPERIENCE = ['beginner', 'intermediate', 'advanced'];
const ACTIVITY = ['sedentary', 'light', 'moderate', 'active', 'very_active'];
const GENDERS = ['male', 'female'];
const HEALTH_CONDITIONS = [
  'diabetes_type_2', 'hypertension', 'asthma', 'arthritis', 'hypothyroidism',
  'anxiety', 'depression', 'high_cholesterol', 'ibs', 'migraine',
  'sleep_apnea', 'pcos', 'gerd', 'anemia', 'osteoporosis',
];
const PHYSICAL_LIMITATIONS = ['lower_back_injury', 'knee_injury', 'shoulder_injury', 'ankle_sprain', 'wrist_injury'];
const ALLERGIES = ['peanuts', 'dairy', 'gluten', 'eggs', 'shellfish', 'soy', 'tree_nuts'];
const DIETARY = ['vegetarian', 'vegan', 'keto', 'halal', 'kosher', 'paleo', 'gluten_free'];
const MEAL_TYPES = ['breakfast', 'lunch', 'dinner', 'snack'];
const EXERCISE_NAMES = [
  'Bench Press', 'Squat', 'Deadlift', 'Overhead Press', 'Barbell Row',
  'Pull Up', 'Push Up', 'Dumbbell Curl', 'Tricep Dip', 'Leg Press',
  'Lat Pulldown', 'Cable Fly', 'Romanian Deadlift', 'Lunges', 'Plank',
  'Calf Raise', 'Face Pull', 'Lateral Raise', 'Leg Curl', 'Leg Extension',
];
const MUSCLE_GROUPS = [
  'Chest', 'Back', 'Shoulders', 'Biceps', 'Triceps',
  'Quadriceps', 'Hamstrings', 'Glutes', 'Core', 'Calves',
];
const WORKOUT_NAMES = [
  'Push Day', 'Pull Day', 'Leg Day', 'Upper Body', 'Lower Body',
  'Full Body', 'Chest & Triceps', 'Back & Biceps', 'Shoulders & Arms', 'HIIT Session',
];
const TIME_SLOTS = ['09:00', '10:00', '11:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00'];
const BOOKING_STATUSES = ['PENDING', 'CONFIRMED', 'CANCELLED', 'COMPLETED'];
const SPECIALTIES = ['strength', 'nutrition', 'yoga', 'cardio', 'rehabilitation', 'bodybuilding', 'crossfit', 'pilates'];

const FAKE_USERS = [
  { name: 'Marcus Johnson', email: 'marcus.j@example.com', age: 28, gender: 'male' },
  { name: 'Sofia Rodriguez', email: 'sofia.r@example.com', age: 24, gender: 'female' },
  { name: 'James Chen', email: 'james.c@example.com', age: 35, gender: 'male' },
  { name: 'Emma Williams', email: 'emma.w@example.com', age: 22, gender: 'female' },
  { name: 'David Kim', email: 'david.k@example.com', age: 31, gender: 'male' },
  { name: 'Olivia Brown', email: 'olivia.b@example.com', age: 27, gender: 'female' },
  { name: 'Ryan Patel', email: 'ryan.p@example.com', age: 42, gender: 'male' },
  { name: 'Mia Thompson', email: 'mia.t@example.com', age: 19, gender: 'female' },
  { name: 'Alex Martinez', email: 'alex.m@example.com', age: 38, gender: 'male' },
  { name: 'Isabella Garcia', email: 'isabella.g@example.com', age: 29, gender: 'female' },
  { name: 'Tyler Davis', email: 'tyler.d@example.com', age: 26, gender: 'male' },
  { name: 'Ava Wilson', email: 'ava.w@example.com', age: 33, gender: 'female' },
  { name: 'Nathan Lee', email: 'nathan.l@example.com', age: 45, gender: 'male' },
  { name: 'Chloe Anderson', email: 'chloe.a@example.com', age: 21, gender: 'female' },
  { name: 'Brandon Taylor', email: 'brandon.t@example.com', age: 55, gender: 'male' },
  { name: 'Zoe Jackson', email: 'zoe.j@example.com', age: 30, gender: 'female' },
  { name: 'Coach Mike', email: 'coach.mike@example.com', age: 40, gender: 'male' },
  { name: 'Coach Sarah', email: 'coach.sarah@example.com', age: 34, gender: 'female' },
];

async function seedAdmin() {
  console.log('Seeding admin demo data...');

  const hashedPassword = await bcrypt.hash('password123', 10);
  const now = new Date();

  const foods = await prisma.food.findMany({ select: { id: true }, take: 100 });
  if (foods.length === 0) {
    console.log('No foods found in DB. Run seedFoods.ts first.');
    return;
  }

  const existingEmails = new Set(
    (await prisma.user.findMany({ select: { email: true } })).map(u => u.email)
  );

  const createdUserIds: { id: string; createdAt: Date }[] = [];
  const coachUserIds: string[] = [];

  for (let i = 0; i < FAKE_USERS.length; i++) {
    const fu = FAKE_USERS[i];

    if (existingEmails.has(fu.email)) {
      console.log(`Skipping ${fu.email} (already exists)`);
      const existing = await prisma.user.findUnique({ where: { email: fu.email }, select: { id: true, createdAt: true } });
      if (existing) createdUserIds.push({ id: existing.id, createdAt: existing.createdAt });
      if (fu.email.startsWith('coach.')) coachUserIds.push(existing!.id);
      continue;
    }

    const isCoachUser = fu.email.startsWith('coach.');
    const isBanned = i === 14;
    const createdAt = daysAgo(randomInt(10, 90));
    const weight = fu.gender === 'male' ? randomFloat(65, 100) : randomFloat(50, 80);
    const height = fu.gender === 'male' ? randomFloat(165, 195) : randomFloat(155, 180);
    const bmi = parseFloat((weight / ((height / 100) ** 2)).toFixed(1));

    const user = await prisma.user.create({
      data: {
        email: fu.email,
        password: hashedPassword,
        name: fu.name,
        age: fu.age,
        gender: fu.gender,
        weight,
        height,
        activityLevel: pick(ACTIVITY),
        fitnessGoal: pick(GOALS),
        experienceLevel: pick(EXPERIENCE),
        goal: pick(GOALS),
        bmi,
        bmiCategory: bmi < 18.5 ? 'underweight' : bmi < 25 ? 'normal' : bmi < 30 ? 'overweight' : 'obese_1',
        healthConditions: pickN(HEALTH_CONDITIONS, randomInt(0, 3)),
        physicalLimitations: pickN(PHYSICAL_LIMITATIONS, randomInt(0, 2)),
        foodAllergies: pickN(ALLERGIES, randomInt(0, 2)),
        dietaryPreferences: pickN(DIETARY, randomInt(0, 2)),
        healthProfileComplete: true,
        isAdmin: false,
        isCoach: isCoachUser,
        isBanned,
        createdAt,
        updatedAt: createdAt,
      },
    });

    createdUserIds.push({ id: user.id, createdAt });
    if (isCoachUser) coachUserIds.push(user.id);
    console.log(`Created user: ${fu.name} (${isCoachUser ? 'coach' : isBanned ? 'banned' : 'user'})`);
  }

  console.log(`\nCreated ${createdUserIds.length} users. Seeding activity data...`);

  for (const coachId of coachUserIds) {
    const existing = await prisma.coachProfile.findUnique({ where: { userId: coachId } });
    if (!existing) {
      await prisma.coachProfile.create({
        data: {
          userId: coachId,
          specialty: pickN(SPECIALTIES, randomInt(2, 4)),
          bio: 'Certified personal trainer with years of experience helping clients reach their fitness goals.',
          experience: randomInt(3, 15),
          certifications: ['NASM-CPT', 'ACE'],
          price: randomFloat(30, 100, 0),
          availability: ['Monday', 'Wednesday', 'Friday', 'Saturday'],
          verified: true,
          rating: randomFloat(4.0, 5.0),
          reviewCount: randomInt(5, 50),
          clientCount: randomInt(3, 25),
        },
      });
    }
  }

  for (const { id: userId, createdAt } of createdUserIds) {
    const daysSinceCreated = Math.floor((now.getTime() - createdAt.getTime()) / (1000 * 60 * 60 * 24));

    for (let dayOffset = 0; dayOffset < daysSinceCreated; dayOffset++) {
      const date = new Date(createdAt);
      date.setDate(date.getDate() + dayOffset);
      date.setHours(12, 0, 0, 0);

      if (date > now) break;

      const existingActivity = await prisma.activityLog.findFirst({
        where: { userId, date: { gte: new Date(date.getFullYear(), date.getMonth(), date.getDate()), lt: new Date(date.getFullYear(), date.getMonth(), date.getDate() + 1) } },
      });
      if (!existingActivity) {
        await prisma.activityLog.create({
          data: {
            userId,
            date,
            steps: randomInt(3000, 15000),
            waterIntake: randomInt(1000, 3000),
            sleepHours: randomFloat(5, 9),
            caloriesBurned: randomFloat(150, 600),
            createdAt: date,
          },
        });
      }

      const mealsToday = randomInt(2, 4);
      for (let m = 0; m < mealsToday; m++) {
        const mealDate = new Date(date);
        mealDate.setHours(m === 0 ? 8 : m === 1 ? 12 : m === 2 ? 19 : 15, randomInt(0, 30));
        const food = pick(foods);
        const servings = randomFloat(0.5, 3.0);
        await prisma.nutritionLog.create({
          data: {
            userId,
            foodId: food.id,
            date: mealDate,
            mealType: MEAL_TYPES[m] || 'snack',
            servings,
            createdAt: mealDate,
          },
        });
      }

      const isWorkoutDay = Math.random() < 0.4;
      if (isWorkoutDay) {
        const sessionDate = new Date(date);
        sessionDate.setHours(randomInt(6, 20), randomInt(0, 59));
        const duration = randomInt(30, 90);
        const exerciseCount = randomInt(4, 8);
        const sessionExercises = pickN(EXERCISE_NAMES, exerciseCount);
        const totalSets = exerciseCount * randomInt(3, 5);
        const totalReps = totalSets * randomInt(8, 15);

        const session = await prisma.workoutSession.create({
          data: {
            userId,
            name: pick(WORKOUT_NAMES),
            startedAt: sessionDate,
            completedAt: new Date(sessionDate.getTime() + duration * 60000),
            duration,
            totalVolume: randomFloat(2000, 15000, 0),
            totalSets,
            totalReps,
            musclesWorked: pickN(MUSCLE_GROUPS, randomInt(2, 5)),
            createdAt: sessionDate,
          },
        });

        for (let e = 0; e < sessionExercises.length; e++) {
          const sets = randomInt(3, 5);
          const setsData = Array.from({ length: sets }, (_, si) => ({
            setNumber: si + 1,
            weight: randomFloat(20, 120, 1),
            reps: randomInt(6, 15),
            isWarmup: si === 0,
            isDropSet: false,
          }));

          await prisma.workoutSessionExercise.create({
            data: {
              workoutSessionId: session.id,
              exerciseName: sessionExercises[e],
              muscleGroup: pick(MUSCLE_GROUPS),
              orderIndex: e,
              setsData: JSON.stringify(setsData),
              totalVolume: randomFloat(500, 5000, 0),
              maxWeight: randomFloat(40, 140, 1),
              maxReps: randomInt(8, 15),
            },
          });
        }
      }
    }

    console.log(`Seeded activity for user ${userId.slice(0, 8)}...`);
  }

  console.log('\nSeeding coach applications...');
  const nonCoachUsers = createdUserIds.filter(u => !coachUserIds.includes(u.id));
  const applicantPool = pickN(nonCoachUsers, Math.min(4, nonCoachUsers.length));

  for (let i = 0; i < applicantPool.length; i++) {
    const userId = applicantPool[i].id;
    const existing = await prisma.coachApplication.findUnique({ where: { userId } });
    if (existing) continue;

    let status = 'PENDING';
    let reviewNote: string | null = null;
    if (i === 2) {
      status = 'APPROVED';
    } else if (i === 3) {
      status = 'REJECTED';
      reviewNote = 'Insufficient experience for our platform requirements at this time.';
    }

    await prisma.coachApplication.create({
      data: {
        userId,
        specialty: pickN(SPECIALTIES, randomInt(1, 3)),
        experience: randomInt(1, 10),
        bio: `Passionate fitness professional with a focus on helping individuals achieve their health goals through personalized training programs and evidence-based methodologies.`,
        status,
        reviewNote,
        createdAt: daysAgo(randomInt(1, 30)),
      },
    });
  }

  console.log('Seeding bookings...');
  if (coachUserIds.length > 0) {
    const bookingCount = randomInt(8, 10);
    for (let b = 0; b < bookingCount; b++) {
      const client = pick(nonCoachUsers);
      const coachId = pick(coachUserIds);
      const bookDate = daysAgo(randomInt(0, 60));
      const status = pick(BOOKING_STATUSES);

      await prisma.booking.create({
        data: {
          clientId: client.id,
          coachId,
          date: bookDate,
          timeSlot: pick(TIME_SLOTS),
          goal: pick(['Weight loss', 'Muscle gain', 'General fitness', 'Sport performance', 'Injury recovery']),
          status,
          price: randomFloat(30, 100, 0),
          createdAt: bookDate,
        },
      });
    }
  }

  console.log('\nSeed complete!');
  const totalUsers = await prisma.user.count();
  const totalSessions = await prisma.workoutSession.count();
  const totalLogs = await prisma.nutritionLog.count();
  const totalActivity = await prisma.activityLog.count();
  const totalApps = await prisma.coachApplication.count();
  const totalBookings = await prisma.booking.count();

  console.log(`Users: ${totalUsers}`);
  console.log(`Workout Sessions: ${totalSessions}`);
  console.log(`Nutrition Logs: ${totalLogs}`);
  console.log(`Activity Logs: ${totalActivity}`);
  console.log(`Coach Applications: ${totalApps}`);
  console.log(`Bookings: ${totalBookings}`);
}

seedAdmin()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
