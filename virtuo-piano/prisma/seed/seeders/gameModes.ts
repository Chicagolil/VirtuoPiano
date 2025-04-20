import { PrismaClient } from '@prisma/client';

export const seedGameModes = async (prisma: PrismaClient) => {
  const gameModes = [
    { name: 'Apprentissage', description: 'Apprentissage mode' },
    { name: 'Jeu', description: 'Jeu mode' },
    // { name: 'Ecoute', description: 'Ecoute mode' },
    // { name: 'Composition', description: 'Composition mode' },
  ];

  for (const gameMode of gameModes) {
    await prisma.gameMode.upsert({
      where: { name: gameMode.name },
      update: {},
      create: gameMode,
    });
  }
};
