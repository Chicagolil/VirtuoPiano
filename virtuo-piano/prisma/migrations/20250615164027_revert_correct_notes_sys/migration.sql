/*
  Warnings:

  - You are about to drop the column `correctNotesL` on the `Scores` table. All the data in the column will be lost.
  - You are about to drop the column `correctNotesR` on the `Scores` table. All the data in the column will be lost.
  - You are about to drop the column `missedNotesL` on the `Scores` table. All the data in the column will be lost.
  - You are about to drop the column `missedNotesR` on the `Scores` table. All the data in the column will be lost.
  - You are about to drop the column `wrongNotesL` on the `Scores` table. All the data in the column will be lost.
  - You are about to drop the column `wrongNotesR` on the `Scores` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "Hands" AS ENUM ('right', 'left', 'both');

-- AlterTable
ALTER TABLE "Scores" DROP COLUMN "correctNotesL",
DROP COLUMN "correctNotesR",
DROP COLUMN "missedNotesL",
DROP COLUMN "missedNotesR",
DROP COLUMN "wrongNotesL",
DROP COLUMN "wrongNotesR",
ADD COLUMN     "correctNotes" INTEGER,
ADD COLUMN     "hands" "Hands",
ADD COLUMN     "missedNotes" INTEGER,
ADD COLUMN     "wrongNotes" INTEGER;
