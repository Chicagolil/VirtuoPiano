import { PrismaClient, Hands } from '@prisma/client';
import { faker } from '@faker-js/faker';

export const seedScores = async (prisma: PrismaClient) => {
  const scores = [];

  const users = await prisma.user.findMany();
  if (!users) {
    throw new Error('Aucun utilisateur trouvé');
  }

  const songs = await prisma.songs.findMany();
  if (!songs) {
    throw new Error('Aucune chanson trouvée');
  }

  const gameModes = await prisma.gameMode.findMany();
  if (!gameModes) {
    throw new Error('Aucun mode de jeu trouvé');
  }

  for (let i = 0; i < 1000; i++) {
    const user = faker.helpers.arrayElement(users);
    const song = faker.helpers.arrayElement(songs);
    const gameMode = faker.helpers.arrayElement(gameModes);
    const notesArray = song.notes as any[];

    scores.push({
      user_id: user.id,
      song_id: song.id,
      mode_id: gameMode.id,
      correctNotes: faker.number.int({ min: 0, max: notesArray.length }),
      wrongNotes: faker.number.int({ min: 0, max: notesArray.length }),
      missedNotes: faker.number.int({ min: 0, max: notesArray.length }),
      hands: faker.helpers.arrayElement(Object.values(Hands)),
      selectedTempo: faker.number.int({ min: 40, max: 200 }),
      totalPoints: faker.number.int({ min: 0, max: 10000 }),
      maxMultiplier: faker.number.int({ min: 1, max: 10 }),
      maxCombo: faker.number.int({ min: 1, max: notesArray.length }),
      played_at: faker.date.recent(),
    });
  }

  for (const score of scores) {
    await prisma.scores.create({
      data: score,
    });
  }
};
