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
    const sessionStartTime = faker.date.recent({ days: 730 });
    const sessionDuration = faker.number.int({ min: 15, max: 45 }) * 60 * 1000;
    const sessionEndTime = new Date(
      sessionStartTime.getTime() + sessionDuration
    );

    // Logique différente selon le mode de jeu
    const isGameMode = gameMode.name === 'Jeu';
    const isLearningMode = gameMode.name === 'Apprentissage';

    const scoreData = {
      user_id: user.id,
      song_id: song.id,
      mode_id: gameMode.id,
      sessionStartTime: sessionStartTime,
      sessionEndTime: sessionEndTime,
    };

    if (isGameMode) {
      // Mode Jeu : hands, correctNotes, missedNotes, wrongNotes, selectedTempo sont null
      Object.assign(scoreData, {
        hands: null,
        correctNotes: null,
        missedNotes: null,
        wrongNotes: null,
        selectedTempo: null,
        totalPoints: faker.number.int({ min: 0, max: 10000 }),
        maxMultiplier: faker.number.int({ min: 1, max: 10 }),
        maxCombo: faker.number.int({ min: 1, max: notesArray.length }),
      });
    } else if (isLearningMode) {
      // Mode Apprentissage : totalPoints, maxMultiplier, maxCombo sont null
      Object.assign(scoreData, {
        correctNotes: faker.number.int({ min: 0, max: notesArray.length }),
        wrongNotes: faker.number.int({ min: 0, max: notesArray.length }),
        missedNotes: faker.number.int({ min: 0, max: notesArray.length }),
        hands: faker.helpers.arrayElement(Object.values(Hands)),
        selectedTempo: faker.number.int({ min: 40, max: 200 }),
        totalPoints: null,
        maxMultiplier: null,
        maxCombo: null,
      });
    } else {
      // Pour les autres modes (si ajoutés plus tard), on garde la logique par défaut
      Object.assign(scoreData, {
        correctNotes: faker.number.int({ min: 0, max: notesArray.length }),
        wrongNotes: faker.number.int({ min: 0, max: notesArray.length }),
        missedNotes: faker.number.int({ min: 0, max: notesArray.length }),
        hands: faker.helpers.arrayElement(Object.values(Hands)),
        selectedTempo: faker.number.int({ min: 40, max: 200 }),
        totalPoints: faker.number.int({ min: 0, max: 10000 }),
        maxMultiplier: faker.number.int({ min: 1, max: 10 }),
        maxCombo: faker.number.int({ min: 1, max: notesArray.length }),
      });
    }

    scores.push(scoreData);
  }

  for (const score of scores) {
    await prisma.scores.create({
      data: score,
    });
  }
};
