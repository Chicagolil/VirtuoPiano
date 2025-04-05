-- CreateEnum
CREATE TYPE "SourceType" AS ENUM ('library', 'composition', 'import');

-- CreateEnum
CREATE TYPE "SongType" AS ENUM ('song', 'scaleEx', 'chordEx', 'rythmEx', 'sightReading', 'arpeggioEx', 'earTraining');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "userName" TEXT NOT NULL,
    "level" INTEGER NOT NULL DEFAULT 1,
    "preferences" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Key" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "notes" JSONB NOT NULL,

    CONSTRAINT "Key_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GameMode" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,

    CONSTRAINT "GameMode_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Songs" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "composer" TEXT,
    "genre" TEXT,
    "tempo" INTEGER NOT NULL,
    "duration_ms" INTEGER NOT NULL,
    "notes" JSONB NOT NULL,
    "timeSignature" TEXT NOT NULL,
    "SourceType" "SourceType" NOT NULL,
    "Level" INTEGER NOT NULL,
    "SongType" "SongType" NOT NULL,
    "key_id" TEXT NOT NULL,

    CONSTRAINT "Songs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Scores" (
    "id" TEXT NOT NULL,
    "correctNotes" INTEGER,
    "missedNotes" INTEGER,
    "wrongNotes" INTEGER,
    "totalPoints" INTEGER,
    "maxMultiplier" INTEGER,
    "maxCombo" INTEGER,
    "played_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "user_id" TEXT NOT NULL,
    "song_id" TEXT NOT NULL,
    "mode_id" TEXT NOT NULL,

    CONSTRAINT "Scores_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UsersCompositions" (
    "user_id" TEXT NOT NULL,
    "song_id" TEXT NOT NULL,

    CONSTRAINT "UsersCompositions_pkey" PRIMARY KEY ("user_id","song_id")
);

-- CreateTable
CREATE TABLE "UsersFavorites" (
    "user_id" TEXT NOT NULL,
    "song_id" TEXT NOT NULL,

    CONSTRAINT "UsersFavorites_pkey" PRIMARY KEY ("user_id","song_id")
);

-- CreateTable
CREATE TABLE "UsersImports" (
    "user_id" TEXT NOT NULL,
    "song_id" TEXT NOT NULL,

    CONSTRAINT "UsersImports_pkey" PRIMARY KEY ("user_id","song_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- AddForeignKey
ALTER TABLE "Songs" ADD CONSTRAINT "Songs_key_id_fkey" FOREIGN KEY ("key_id") REFERENCES "Key"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Scores" ADD CONSTRAINT "Scores_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Scores" ADD CONSTRAINT "Scores_song_id_fkey" FOREIGN KEY ("song_id") REFERENCES "Songs"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Scores" ADD CONSTRAINT "Scores_mode_id_fkey" FOREIGN KEY ("mode_id") REFERENCES "GameMode"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UsersCompositions" ADD CONSTRAINT "UsersCompositions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UsersCompositions" ADD CONSTRAINT "UsersCompositions_song_id_fkey" FOREIGN KEY ("song_id") REFERENCES "Songs"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UsersFavorites" ADD CONSTRAINT "UsersFavorites_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UsersFavorites" ADD CONSTRAINT "UsersFavorites_song_id_fkey" FOREIGN KEY ("song_id") REFERENCES "Songs"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UsersImports" ADD CONSTRAINT "UsersImports_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UsersImports" ADD CONSTRAINT "UsersImports_song_id_fkey" FOREIGN KEY ("song_id") REFERENCES "Songs"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
