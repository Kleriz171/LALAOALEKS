/*
  Warnings:

  - Added the required column `activationRanking` to the `exercise_body_parts` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "activity_logs" ADD COLUMN     "activityType" TEXT,
ADD COLUMN     "duration" INTEGER,
ADD COLUMN     "intensity" TEXT,
ADD COLUMN     "notes" TEXT,
ALTER COLUMN "steps" SET DEFAULT 0;

-- AlterTable
ALTER TABLE "body_parts" ADD COLUMN     "anatomicalInfo" JSONB;

-- AlterTable
ALTER TABLE "exercise_body_parts" ADD COLUMN     "activationRanking" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "foods" ADD COLUMN     "category" TEXT;

-- AlterTable
ALTER TABLE "muscle_usage_logs" ADD COLUMN     "lastWorkedDate" TIMESTAMP(3),
ADD COLUMN     "muscleId" TEXT,
ADD COLUMN     "muscleName" TEXT,
ADD COLUMN     "recoveryTimeHours" INTEGER NOT NULL DEFAULT 48,
ADD COLUMN     "workoutFrequency" INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "nutrition_logs" ADD COLUMN     "totalCalories" DOUBLE PRECISION,
ADD COLUMN     "totalCarbs" DOUBLE PRECISION,
ADD COLUMN     "totalFat" DOUBLE PRECISION,
ADD COLUMN     "totalProtein" DOUBLE PRECISION;

-- AlterTable
ALTER TABLE "reports" ADD COLUMN     "content" JSONB,
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "recommendations" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "riskLevel" TEXT,
ADD COLUMN     "title" TEXT,
ALTER COLUMN "startDate" DROP NOT NULL,
ALTER COLUMN "endDate" DROP NOT NULL,
ALTER COLUMN "nutritionData" DROP NOT NULL,
ALTER COLUMN "trainingData" DROP NOT NULL,
ALTER COLUMN "recoveryData" DROP NOT NULL,
ALTER COLUMN "activityData" DROP NOT NULL;

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "goal" TEXT,
ALTER COLUMN "age" DROP NOT NULL,
ALTER COLUMN "gender" DROP NOT NULL,
ALTER COLUMN "weight" DROP NOT NULL,
ALTER COLUMN "height" DROP NOT NULL,
ALTER COLUMN "activityLevel" DROP NOT NULL,
ALTER COLUMN "fitnessGoal" DROP NOT NULL,
ALTER COLUMN "experienceLevel" DROP NOT NULL;

-- AlterTable
ALTER TABLE "workout_exercises" ADD COLUMN     "exerciseName" TEXT,
ADD COLUMN     "targetMuscles" TEXT[] DEFAULT ARRAY[]::TEXT[],
ALTER COLUMN "exerciseId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "workout_plans" ADD COLUMN     "description" TEXT,
ADD COLUMN     "experienceLevel" TEXT,
ADD COLUMN     "rationale" TEXT,
ALTER COLUMN "startDate" SET DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "workouts" ADD COLUMN     "dayName" TEXT,
ADD COLUMN     "focus" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "planId" TEXT,
ALTER COLUMN "name" DROP NOT NULL;
