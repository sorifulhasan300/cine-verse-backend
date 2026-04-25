/*
  Warnings:

  - The `plan` column on the `subscriptions` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `plan` column on the `user` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "Plan" AS ENUM ('FREE', 'MONTHLY', 'YEARLY');

-- AlterTable
ALTER TABLE "movies" ADD COLUMN     "duration" INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "subscriptions" DROP COLUMN "plan",
ADD COLUMN     "plan" "Plan" NOT NULL DEFAULT 'FREE';

-- AlterTable
ALTER TABLE "user" DROP COLUMN "plan",
ADD COLUMN     "plan" "Plan" NOT NULL DEFAULT 'FREE';

-- DropEnum
DROP TYPE "SubscriptionPlan";
