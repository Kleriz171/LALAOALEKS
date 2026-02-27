-- AlterTable
ALTER TABLE "activity_logs" ADD COLUMN     "sleepHours" DOUBLE PRECISION,
ADD COLUMN     "waterIntake" INTEGER NOT NULL DEFAULT 0;
