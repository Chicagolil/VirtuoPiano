/*
  Warnings:

  - You are about to drop the column `correctNotes` on the `Scores` table. All the data in the column will be lost.
  - You are about to drop the column `missedNotes` on the `Scores` table. All the data in the column will be lost.
  - You are about to drop the column `wrongNotes` on the `Scores` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Scores" DROP COLUMN "correctNotes",
DROP COLUMN "missedNotes",
DROP COLUMN "wrongNotes",
ADD COLUMN     "correctNotesL" INTEGER,
ADD COLUMN     "correctNotesR" INTEGER,
ADD COLUMN     "missedNotesL" INTEGER,
ADD COLUMN     "missedNotesR" INTEGER,
ADD COLUMN     "selectedTempo" INTEGER,
ADD COLUMN     "wrongNotesL" INTEGER,
ADD COLUMN     "wrongNotesR" INTEGER;
