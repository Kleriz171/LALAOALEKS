-- AlterTable
ALTER TABLE "foods" ADD COLUMN     "allergens" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "glycemicIndex" INTEGER,
ADD COLUMN     "isDairyFree" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "isGlutenFree" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "isHalal" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "isKosher" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "isLowSodium" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "isVegan" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "isVegetarian" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "bmi" DOUBLE PRECISION,
ADD COLUMN     "bmiCategory" TEXT,
ADD COLUMN     "dietaryPreferences" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "foodAllergies" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "healthConditions" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "healthProfileComplete" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "physicalLimitations" TEXT[] DEFAULT ARRAY[]::TEXT[];
