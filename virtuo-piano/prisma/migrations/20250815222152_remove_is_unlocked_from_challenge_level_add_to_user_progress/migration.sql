/*
  Warnings:

  - You are about to drop the column `isUnlocked` on the `ChallengeLevel` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "ChallengeLevel" DROP COLUMN "isUnlocked";

-- AlterTable
ALTER TABLE "UserChallengeProgress" ADD COLUMN     "isUnlocked" BOOLEAN NOT NULL DEFAULT false;
