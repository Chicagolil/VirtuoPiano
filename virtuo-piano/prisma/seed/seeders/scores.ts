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

  // Trouver Chicagolil et sa chanson
  const chicagolil = await prisma.user.findUnique({
    where: { email: 'ldevroye1@gmail.com' },
  });

  const chicagolilSong = await prisma.songs.findFirst({
    where: { composer: 'Chicagolil' },
  });

  if (!chicagolil) {
    throw new Error('Utilisateur Chicagolil non trouvé');
  }

  if (!chicagolilSong) {
    throw new Error('Chanson de Chicagolil non trouvée');
  }

  // Générer des sessions pour Chicagolil et sa chanson (plus de données)
  const chicagolilSessionsCount = 120; // 120 sessions pour Chicagolil (plus étalées)
  const otherSessionsCount = 1000; // 1000 sessions pour les autres

  // Sessions pour Chicagolil et sa chanson
  for (let i = 0; i < chicagolilSessionsCount; i++) {
    const gameMode = faker.helpers.arrayElement(gameModes);
    const notesArray = chicagolilSong.notes as any[];

    // Générer des dates étalées sur 12 mois pour Chicagolil
    const monthsAgo = faker.number.int({ min: 0, max: 12 });
    const daysAgo = faker.number.int({ min: 0, max: 30 });
    const sessionStartTime = new Date();
    sessionStartTime.setMonth(sessionStartTime.getMonth() - monthsAgo);
    sessionStartTime.setDate(sessionStartTime.getDate() - daysAgo);
    sessionStartTime.setHours(
      faker.number.int({ min: 8, max: 22 }),
      faker.number.int({ min: 0, max: 59 }),
      0,
      0
    );

    const sessionDuration = faker.number.int({ min: 15, max: 45 }) * 60 * 1000;
    const sessionEndTime = new Date(
      sessionStartTime.getTime() + sessionDuration
    );

    // Logique différente selon le mode de jeu
    const isGameMode = gameMode.name === 'Jeu';
    const isLearningMode = gameMode.name === 'Apprentissage';

    const scoreData = {
      user_id: chicagolil.id,
      song_id: chicagolilSong.id,
      mode_id: gameMode.id,
      sessionStartTime: sessionStartTime,
      sessionEndTime: sessionEndTime,
    };

    // Calculer la progression basée sur la date (plus récent = meilleur)
    const monthsFromNow =
      (new Date().getTime() - sessionStartTime.getTime()) /
      (1000 * 60 * 60 * 24 * 30);
    const progressFactor = Math.max(0, 1 - monthsFromNow / 12); // 0 = il y a 12 mois, 1 = maintenant

    if (isGameMode) {
      // Mode Jeu : hands, correctNotes, missedNotes, wrongNotes, selectedTempo sont null
      const baseScore = 3000 + progressFactor * 7000; // 3000-10000 selon la progression
      const baseMultiplier = 1 + progressFactor * 9; // 1-10 selon la progression
      const baseCombo = 5 + progressFactor * (notesArray.length - 5); // 5-max selon la progression

      Object.assign(scoreData, {
        hands: null,
        correctNotes: null,
        missedNotes: null,
        wrongNotes: null,
        selectedTempo: null,
        totalPoints: Math.round(
          baseScore + faker.number.int({ min: -500, max: 500 })
        ), // Variation autour de la progression
        maxMultiplier: Math.round(
          baseMultiplier + faker.number.float({ min: -0.5, max: 0.5 })
        ),
        maxCombo: Math.round(
          baseCombo + faker.number.int({ min: -10, max: 10 })
        ),
      });
    } else if (isLearningMode) {
      // Mode Apprentissage : totalPoints, maxMultiplier, maxCombo sont null
      const baseCorrectNotes = Math.max(
        5,
        Math.round(progressFactor * notesArray.length)
      );
      const baseWrongNotes = Math.max(0, Math.round((1 - progressFactor) * 8)); // Moins d'erreurs avec le temps
      const baseMissedNotes = Math.max(0, Math.round((1 - progressFactor) * 5)); // Moins de notes manquées avec le temps
      const baseTempo = 60 + progressFactor * 100; // 60-160 selon la progression

      Object.assign(scoreData, {
        correctNotes: Math.round(
          baseCorrectNotes + faker.number.int({ min: -2, max: 2 })
        ),
        wrongNotes: Math.round(
          baseWrongNotes + faker.number.int({ min: -1, max: 1 })
        ),
        missedNotes: Math.round(
          baseMissedNotes + faker.number.int({ min: -1, max: 1 })
        ),
        hands: faker.helpers.arrayElement(Object.values(Hands)),
        selectedTempo: Math.round(
          baseTempo + faker.number.int({ min: -10, max: 10 })
        ),
        totalPoints: null,
        maxMultiplier: null,
        maxCombo: null,
      });
    }

    scores.push(scoreData);
  }

  // Générer les autres sessions (pour tous les utilisateurs et chansons)
  for (let i = 0; i < otherSessionsCount; i++) {
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
