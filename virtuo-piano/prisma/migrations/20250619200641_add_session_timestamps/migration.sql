/*
  Warnings:

  - You are about to drop the column `played_at` on the `Scores` table. All the data in the column will be lost.
  - Added the required column `sessionEndTime` to the `Scores` table without a default value. This is not possible if the table is not empty.
  - Added the required column `sessionStartTime` to the `Scores` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Scores" DROP COLUMN "played_at",
ADD COLUMN     "sessionEndTime" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "sessionStartTime" TIMESTAMP(3) NOT NULL;
