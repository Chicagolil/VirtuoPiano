-- AlterTable
ALTER TABLE "ChallengeLevel" ADD COLUMN     "autoReward" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "UserChallengeProgress" ADD COLUMN     "claimedAt" TIMESTAMP(3),
ADD COLUMN     "isRewardClaimed" BOOLEAN NOT NULL DEFAULT false;
