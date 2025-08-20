import { PrismaClient } from '@prisma/client';

export const seedUserChallengeProgress = async (prisma: PrismaClient) => {
  // Récupère tous les utilisateurs
  const users = await prisma.user.findMany();
  if (users.length < 1) throw new Error("Pas d'utilisateurs trouvés");

  // Récupère tous les challenges et leurs niveaux
  const challenges = await prisma.challenge.findMany({
    include: { levels: { orderBy: { level: 'asc' } } },
  });
  if (challenges.length < 1) throw new Error('Pas de challenges trouvés');

  // Pour chaque utilisateur, simule la progression sur différents défis
  for (const [userIndex, user] of users.entries()) {
    for (const [challengeIndex, challenge] of challenges.entries()) {
      // Pour chaque niveau du challenge
      for (const [levelIndex, level] of challenge.levels.entries()) {
        // Détermine l'état de progression selon l'index de l'utilisateur et du niveau
        const progressType = (userIndex + challengeIndex + levelIndex) % 3;

        // Détermine si le niveau est débloqué pour cet utilisateur
        let isUnlocked = false;
        
        if (level.level === 1) {
          // Le niveau 1 est toujours débloqué
          isUnlocked = true;
        } else {
          // Pour les niveaux suivants, vérifier si le niveau précédent est complété
          const previousLevel = challenge.levels.find(l => l.level === level.level - 1);
          if (previousLevel) {
            // Simuler que le niveau précédent est complété pour certains utilisateurs
            // (pour démontrer le déblocage progressif)
            const shouldUnlock = (userIndex + challengeIndex + levelIndex) % 2 === 0;
            isUnlocked = shouldUnlock;
          }
        }

        let progressData;

        switch (progressType) {
          case 0:
            // Cas 1 : progression en cours (niveau débloqué)
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
              isUnlocked: isUnlocked,
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
              isUnlocked: true, // Si terminé, forcément débloqué
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
              isUnlocked: true, // Si terminé, forcément débloqué
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
