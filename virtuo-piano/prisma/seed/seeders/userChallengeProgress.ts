import { PrismaClient } from '@prisma/client';

export const seedUserChallengeProgress = async (prisma: PrismaClient) => {
  // Récupère tous les utilisateurs
  const users = await prisma.user.findMany();
  if (users.length < 1) throw new Error("Pas d'utilisateurs trouvés");

  // Récupère tous les challenges et leurs niveaux
  const challenges = await prisma.challenge.findMany({
    include: { levels: true },
  });
  if (challenges.length < 1) throw new Error('Pas de challenges trouvés');

  // Pour chaque utilisateur, simule la progression sur différents défis
  for (const [userIndex, user] of users.entries()) {
    for (const [challengeIndex, challenge] of challenges.entries()) {
      // Pour chaque niveau du challenge
      for (const [levelIndex, level] of challenge.levels.entries()) {
        // Cas 1 : progression en cours (pour tous les utilisateurs)
        await prisma.userChallengeProgress.create({
          data: {
            userId: user.id,
            challengeId: challenge.id,
            levelId: level.id,
            currentProgress: Math.floor(Math.random() * level.requirement),
            isCompleted: false,
            startedAt: new Date(
              Date.now() -
                (userIndex + challengeIndex + levelIndex + 1) * 86400000
            ),
            updatedAt: new Date(),
            isRewardClaimed: false,
          },
        });

        // Cas 2 : défi terminé mais récompense non réclamée (pour les utilisateurs pairs)
        if (userIndex % 2 === 0) {
          await prisma.userChallengeProgress.create({
            data: {
              userId: user.id,
              challengeId: challenge.id,
              levelId: level.id,
              currentProgress: level.requirement,
              isCompleted: true,
              completedAt: new Date(
                Date.now() - (challengeIndex + levelIndex + 1) * 3600000
              ),
              startedAt: new Date(
                Date.now() -
                  (userIndex + challengeIndex + levelIndex + 2) * 86400000
              ),
              updatedAt: new Date(),
              isRewardClaimed: false,
            },
          });
        }

        // Cas 3 : défi terminé et récompense réclamée (pour les utilisateurs impairs)
        if (userIndex % 2 === 1) {
          await prisma.userChallengeProgress.create({
            data: {
              userId: user.id,
              challengeId: challenge.id,
              levelId: level.id,
              currentProgress: level.requirement,
              isCompleted: true,
              completedAt: new Date(
                Date.now() - (challengeIndex + levelIndex + 2) * 3600000
              ),
              startedAt: new Date(
                Date.now() -
                  (userIndex + challengeIndex + levelIndex + 3) * 86400000
              ),
              updatedAt: new Date(),
              isRewardClaimed: true,
              claimedAt: new Date(
                Date.now() - (challengeIndex + levelIndex + 1) * 1800000
              ),
            },
          });
        }
      }
    }
  }
  console.log('✅ UserChallengeProgress seeded for all users!');
};
