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
        // Détermine l'état de progression selon l'index de l'utilisateur et du niveau
        const progressType = (userIndex + challengeIndex + levelIndex) % 3;

        let progressData;

        switch (progressType) {
          case 0:
            // Cas 1 : progression en cours
            progressData = {
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
            };
            break;

          case 1:
            // Cas 2 : défi terminé mais récompense non réclamée
            progressData = {
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
            };
            break;

          case 2:
          default:
            // Cas 3 : défi terminé et récompense réclamée
            progressData = {
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
            };
            break;
        }

        // Crée un seul enregistrement par combinaison userId/challengeId/levelId
        await prisma.userChallengeProgress.create({
          data: progressData,
        });
      }
    }
  }
};
