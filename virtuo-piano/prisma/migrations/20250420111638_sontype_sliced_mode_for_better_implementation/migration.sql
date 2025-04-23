/*
  Warnings:

  - The values [sightReading,earTraining] on the enum `SongType` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "SongType_new" AS ENUM ('song', 'scaleEx', 'chordEx', 'rythmEx', 'arpeggioEx');
ALTER TABLE "Songs" ALTER COLUMN "SongType" TYPE "SongType_new" USING ("SongType"::text::"SongType_new");
ALTER TYPE "SongType" RENAME TO "SongType_old";
ALTER TYPE "SongType_new" RENAME TO "SongType";
DROP TYPE "SongType_old";
COMMIT;
