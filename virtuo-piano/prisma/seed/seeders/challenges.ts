import { PrismaClient } from '@prisma/client';

export const seedChallenges = async (prisma: PrismaClient) => {
  // Défi 1: Maîtrise des chansons faciles
  const easySongsChallenge = await prisma.challenge.create({
    data: {
      name: 'Maîtrise des chansons faciles',
      description: 'Progressez en jouant des chansons de niveau facile',
      category: 'difficulty',
      isActive: true,
      levels: {
        create: [
          {
            level: 1,
            name: 'Débutant',
            description: 'Jouez 5 chansons de niveau facile',
            requirement: 5,
            requirementType: 'songs_count',
            requirementFilter: { difficulty: 'easy' },
            reward: { xp: 50, badge: 'easy_beginner' },
          },
          {
            level: 2,
            name: 'Intermédiaire',
            description: 'Jouez 10 chansons de niveau facile',
            requirement: 10,
            requirementType: 'songs_count',
            requirementFilter: { difficulty: 'easy' },
            reward: { xp: 100, badge: 'easy_intermediate' },
            unlockCondition: { previousLevelCompleted: 1 },
          },
          {
            level: 3,
            name: 'Avancé',
            description: 'Jouez 20 chansons de niveau facile',
            requirement: 20,
            requirementType: 'songs_count',
            requirementFilter: { difficulty: 'easy' },
            reward: { xp: 200, badge: 'easy_master' },
            unlockCondition: { previousLevelCompleted: 2 },
          },
        ],
      },
    },
  });

  // Défi 2: Temps de pratique
  const practiceTimeChallenge = await prisma.challenge.create({
    data: {
      name: 'Marathon de pratique',
      description: 'Développez votre endurance en pratiquant régulièrement',
      category: 'practice_time',
      isActive: true,
      levels: {
        create: [
          {
            level: 1,
            name: 'Débutant',
            description: 'Pratiquez pendant 2 heures',
            requirement: 120, // en minutes
            requirementType: 'practice_time',
            reward: { xp: 75, badge: 'practice_beginner' },
          },
          {
            level: 2,
            name: 'Intermédiaire',
            description: 'Pratiquez pendant 5 heures',
            requirement: 300,
            requirementType: 'practice_time',
            reward: { xp: 150, badge: 'practice_intermediate' },
            unlockCondition: { previousLevelCompleted: 1 },
          },
          {
            level: 3,
            name: 'Marathonien',
            description: 'Pratiquez pendant 10 heures',
            requirement: 600,
            requirementType: 'practice_time',
            reward: { xp: 300, badge: 'practice_marathon' },
            unlockCondition: { previousLevelCompleted: 2 },
          },
        ],
      },
    },
  });

  // Défi 3: Précision
  const accuracyChallenge = await prisma.challenge.create({
    data: {
      name: 'Précision parfaite',
      description: 'Améliorez votre précision de jeu',
      category: 'accuracy',
      isActive: true,
      levels: {
        create: [
          {
            level: 1,
            name: 'Précis',
            description: 'Obtenez 80% de précision sur 3 chansons',
            requirement: 3,
            requirementType: 'accuracy_songs',
            requirementFilter: { minAccuracy: 80 },
            reward: { xp: 100, badge: 'accuracy_beginner' },
          },
          {
            level: 2,
            name: 'Très précis',
            description: 'Obtenez 90% de précision sur 5 chansons',
            requirement: 5,
            requirementType: 'accuracy_songs',
            requirementFilter: { minAccuracy: 90 },
            reward: { xp: 200, badge: 'accuracy_intermediate' },
            unlockCondition: { previousLevelCompleted: 1 },
          },
          {
            level: 3,
            name: 'Parfait',
            description: 'Obtenez 95% de précision sur 3 chansons',
            requirement: 3,
            requirementType: 'accuracy_songs',
            requirementFilter: { minAccuracy: 95 },
            reward: { xp: 400, badge: 'accuracy_master' },
            unlockCondition: { previousLevelCompleted: 2 },
          },
        ],
      },
    },
  });

  // Défi 4: Genre musical
  const genreChallenge = await prisma.challenge.create({
    data: {
      name: 'Explorateur musical',
      description: 'Découvrez différents genres musicaux',
      category: 'genre',
      isActive: true,
      levels: {
        create: [
          {
            level: 1,
            name: 'Découvreur',
            description: 'Jouez des chansons de 3 genres différents',
            requirement: 3,
            requirementType: 'unique_genres',
            reward: { xp: 80, badge: 'genre_explorer' },
          },
          {
            level: 2,
            name: 'Connaisseur',
            description: 'Jouez des chansons de 5 genres différents',
            requirement: 5,
            requirementType: 'unique_genres',
            reward: { xp: 160, badge: 'genre_connoisseur' },
            unlockCondition: { previousLevelCompleted: 1 },
          },
          {
            level: 3,
            name: 'Expert',
            description: 'Jouez des chansons de 8 genres différents',
            requirement: 8,
            requirementType: 'unique_genres',
            reward: { xp: 320, badge: 'genre_expert' },
            unlockCondition: { previousLevelCompleted: 2 },
          },
        ],
      },
    },
  });

  // Défi 5: Chansons intermédiaires
  const intermediateSongsChallenge = await prisma.challenge.create({
    data: {
      name: 'Défis intermédiaires',
      description: 'Tentez des chansons de niveau intermédiaire',
      category: 'difficulty',
      isActive: true,
      levels: {
        create: [
          {
            level: 1,
            name: 'Débutant intermédiaire',
            description: 'Jouez 3 chansons de niveau intermédiaire',
            requirement: 3,
            requirementType: 'songs_count',
            requirementFilter: { difficulty: 'intermediate' },
            reward: { xp: 120, badge: 'intermediate_beginner' },
          },
          {
            level: 2,
            name: 'Intermédiaire confirmé',
            description: 'Jouez 8 chansons de niveau intermédiaire',
            requirement: 8,
            requirementType: 'songs_count',
            requirementFilter: { difficulty: 'intermediate' },
            reward: { xp: 250, badge: 'intermediate_confirmed' },
            unlockCondition: { previousLevelCompleted: 1 },
          },
          {
            level: 3,
            name: 'Maître intermédiaire',
            description: 'Jouez 15 chansons de niveau intermédiaire',
            requirement: 15,
            requirementType: 'songs_count',
            requirementFilter: { difficulty: 'intermediate' },
            reward: { xp: 500, badge: 'intermediate_master' },
            unlockCondition: { previousLevelCompleted: 2 },
          },
        ],
      },
    },
  });

  // Défi 6: Chansons difficiles
  const hardSongsChallenge = await prisma.challenge.create({
    data: {
      name: 'Défis avancés',
      description: 'Affrontez les chansons les plus difficiles',
      category: 'difficulty',
      isActive: true,
      levels: {
        create: [
          {
            level: 1,
            name: 'Débutant avancé',
            description: 'Jouez 2 chansons de niveau difficile',
            requirement: 2,
            requirementType: 'songs_count',
            requirementFilter: { difficulty: 'hard' },
            reward: { xp: 200, badge: 'hard_beginner' },
          },
          {
            level: 2,
            name: 'Avancé confirmé',
            description: 'Jouez 5 chansons de niveau difficile',
            requirement: 5,
            requirementType: 'songs_count',
            requirementFilter: { difficulty: 'hard' },
            reward: { xp: 400, badge: 'hard_confirmed' },
            unlockCondition: { previousLevelCompleted: 1 },
          },
          {
            level: 3,
            name: 'Virtuose',
            description: 'Jouez 10 chansons de niveau difficile',
            requirement: 10,
            requirementType: 'songs_count',
            requirementFilter: { difficulty: 'hard' },
            reward: { xp: 800, badge: 'virtuoso' },
            unlockCondition: { previousLevelCompleted: 2 },
          },
        ],
      },
    },
  });

  // Défi 7: Sessions consécutives
  const consecutiveSessionsChallenge = await prisma.challenge.create({
    data: {
      name: 'Régularité',
      description:
        'Pratiquez régulièrement pour développer de bonnes habitudes',
      category: 'consistency',
      isActive: true,
      levels: {
        create: [
          {
            level: 1,
            name: 'Débutant régulier',
            description: 'Pratiquez 3 jours consécutifs',
            requirement: 3,
            requirementType: 'consecutive_days',
            reward: { xp: 100, badge: 'regular_beginner' },
          },
          {
            level: 2,
            name: 'Régulier confirmé',
            description: 'Pratiquez 7 jours consécutifs',
            requirement: 7,
            requirementType: 'consecutive_days',
            reward: { xp: 250, badge: 'regular_confirmed' },
            unlockCondition: { previousLevelCompleted: 1 },
          },
          {
            level: 3,
            name: 'Maître de la régularité',
            description: 'Pratiquez 21 jours consécutifs',
            requirement: 21,
            requirementType: 'consecutive_days',
            reward: { xp: 600, badge: 'regular_master' },
            unlockCondition: { previousLevelCompleted: 2 },
          },
        ],
      },
    },
  });

  // Défi 8: Compositeurs
  const composersChallenge = await prisma.challenge.create({
    data: {
      name: 'Découverte des compositeurs',
      description: "Explorez l'œuvre de différents compositeurs",
      category: 'composers',
      isActive: true,
      levels: {
        create: [
          {
            level: 1,
            name: 'Découvreur de compositeurs',
            description: 'Jouez des chansons de 3 compositeurs différents',
            requirement: 3,
            requirementType: 'unique_composers',
            reward: { xp: 120, badge: 'composer_explorer' },
          },
          {
            level: 2,
            name: 'Connaisseur de compositeurs',
            description: 'Jouez des chansons de 6 compositeurs différents',
            requirement: 6,
            requirementType: 'unique_composers',
            reward: { xp: 250, badge: 'composer_connoisseur' },
            unlockCondition: { previousLevelCompleted: 1 },
          },
          {
            level: 3,
            name: 'Expert en compositeurs',
            description: 'Jouez des chansons de 10 compositeurs différents',
            requirement: 10,
            requirementType: 'unique_composers',
            reward: { xp: 500, badge: 'composer_expert' },
            unlockCondition: { previousLevelCompleted: 2 },
          },
        ],
      },
    },
  });

  // Défi 9: Temps de pratique hebdomadaire
  const weeklyPracticeChallenge = await prisma.challenge.create({
    data: {
      name: 'Objectifs hebdomadaires',
      description: 'Atteignez vos objectifs de pratique hebdomadaire',
      category: 'practice_time',
      isActive: true,
      levels: {
        create: [
          {
            level: 1,
            name: 'Débutant hebdomadaire',
            description: 'Pratiquez 3 heures en une semaine',
            requirement: 180,
            requirementType: 'weekly_practice_time',
            reward: { xp: 150, badge: 'weekly_beginner' },
          },
          {
            level: 2,
            name: 'Intermédiaire hebdomadaire',
            description: 'Pratiquez 7 heures en une semaine',
            requirement: 420,
            requirementType: 'weekly_practice_time',
            reward: { xp: 300, badge: 'weekly_intermediate' },
            unlockCondition: { previousLevelCompleted: 1 },
          },
          {
            level: 3,
            name: 'Marathonien hebdomadaire',
            description: 'Pratiquez 15 heures en une semaine',
            requirement: 900,
            requirementType: 'weekly_practice_time',
            reward: { xp: 600, badge: 'weekly_marathon' },
            unlockCondition: { previousLevelCompleted: 2 },
          },
        ],
      },
    },
  });

  // Défi 10: Sessions longues
  const longSessionsChallenge = await prisma.challenge.create({
    data: {
      name: 'Sessions marathon',
      description: 'Développez votre endurance avec des sessions prolongées',
      category: 'practice_time',
      isActive: true,
      levels: {
        create: [
          {
            level: 1,
            name: 'Session moyenne',
            description: 'Effectuez une session de 30 minutes',
            requirement: 30,
            requirementType: 'single_session_time',
            reward: { xp: 80, badge: 'medium_session' },
          },
          {
            level: 2,
            name: 'Session longue',
            description: 'Effectuez une session de 60 minutes',
            requirement: 60,
            requirementType: 'single_session_time',
            reward: { xp: 180, badge: 'long_session' },
            unlockCondition: { previousLevelCompleted: 1 },
          },
          {
            level: 3,
            name: 'Session marathon',
            description: 'Effectuez une session de 120 minutes',
            requirement: 120,
            requirementType: 'single_session_time',
            reward: { xp: 400, badge: 'marathon_session' },
            unlockCondition: { previousLevelCompleted: 2 },
          },
        ],
      },
    },
  });

  // Défi 11: Précision sur chansons difficiles
  const hardAccuracyChallenge = await prisma.challenge.create({
    data: {
      name: 'Précision sur chansons difficiles',
      description: 'Démontrez votre précision sur des chansons complexes',
      category: 'accuracy',
      isActive: true,
      levels: {
        create: [
          {
            level: 1,
            name: 'Précis sur difficulté',
            description: 'Obtenez 75% de précision sur 2 chansons difficiles',
            requirement: 2,
            requirementType: 'accuracy_songs',
            requirementFilter: { minAccuracy: 75, difficulty: 'hard' },
            reward: { xp: 200, badge: 'hard_accuracy_beginner' },
          },
          {
            level: 2,
            name: 'Très précis sur difficulté',
            description: 'Obtenez 85% de précision sur 3 chansons difficiles',
            requirement: 3,
            requirementType: 'accuracy_songs',
            requirementFilter: { minAccuracy: 85, difficulty: 'hard' },
            reward: { xp: 400, badge: 'hard_accuracy_intermediate' },
            unlockCondition: { previousLevelCompleted: 1 },
          },
          {
            level: 3,
            name: 'Parfait sur difficulté',
            description: 'Obtenez 90% de précision sur 2 chansons difficiles',
            requirement: 2,
            requirementType: 'accuracy_songs',
            requirementFilter: { minAccuracy: 90, difficulty: 'hard' },
            reward: { xp: 800, badge: 'hard_accuracy_master' },
            unlockCondition: { previousLevelCompleted: 2 },
          },
        ],
      },
    },
  });

  // Défi 12: Répertoire varié
  const diverseRepertoireChallenge = await prisma.challenge.create({
    data: {
      name: 'Répertoire varié',
      description: 'Diversifiez votre répertoire musical',
      category: 'repertoire',
      isActive: true,
      levels: {
        create: [
          {
            level: 1,
            name: 'Répertoire diversifié',
            description: 'Jouez 15 chansons différentes',
            requirement: 15,
            requirementType: 'unique_songs',
            reward: { xp: 150, badge: 'diverse_repertoire' },
          },
          {
            level: 2,
            name: 'Répertoire étendu',
            description: 'Jouez 30 chansons différentes',
            requirement: 30,
            requirementType: 'unique_songs',
            reward: { xp: 300, badge: 'extended_repertoire' },
            unlockCondition: { previousLevelCompleted: 1 },
          },
          {
            level: 3,
            name: 'Répertoire complet',
            description: 'Jouez 50 chansons différentes',
            requirement: 50,
            requirementType: 'unique_songs',
            reward: { xp: 600, badge: 'complete_repertoire' },
            unlockCondition: { previousLevelCompleted: 2 },
          },
        ],
      },
    },
  });

  // Défi 13: Progression rapide
  const rapidProgressChallenge = await prisma.challenge.create({
    data: {
      name: 'Progression rapide',
      description: 'Améliorez rapidement vos compétences',
      category: 'progress',
      isActive: true,
      levels: {
        create: [
          {
            level: 1,
            name: 'Progression rapide',
            description: 'Améliorez votre score sur 5 chansons',
            requirement: 5,
            requirementType: 'score_improvements',
            reward: { xp: 120, badge: 'rapid_progress' },
          },
          {
            level: 2,
            name: 'Progression très rapide',
            description: 'Améliorez votre score sur 10 chansons',
            requirement: 10,
            requirementType: 'score_improvements',
            reward: { xp: 250, badge: 'very_rapid_progress' },
            unlockCondition: { previousLevelCompleted: 1 },
          },
          {
            level: 3,
            name: 'Progression explosive',
            description: 'Améliorez votre score sur 20 chansons',
            requirement: 20,
            requirementType: 'score_improvements',
            reward: { xp: 500, badge: 'explosive_progress' },
            unlockCondition: { previousLevelCompleted: 2 },
          },
        ],
      },
    },
  });

  // Défi 14: Sessions matinales
  const morningSessionsChallenge = await prisma.challenge.create({
    data: {
      name: 'Pianiste matinal',
      description: "Développez l'habitude de pratiquer le matin",
      category: 'timing',
      isActive: true,
      levels: {
        create: [
          {
            level: 1,
            name: 'Débutant matinal',
            description: 'Pratiquez 5 fois le matin (6h-10h)',
            requirement: 5,
            requirementType: 'morning_sessions',
            reward: { xp: 100, badge: 'morning_beginner' },
          },
          {
            level: 2,
            name: 'Matinal confirmé',
            description: 'Pratiquez 15 fois le matin (6h-10h)',
            requirement: 15,
            requirementType: 'morning_sessions',
            reward: { xp: 250, badge: 'morning_confirmed' },
            unlockCondition: { previousLevelCompleted: 1 },
          },
          {
            level: 3,
            name: 'Maître matinal',
            description: 'Pratiquez 30 fois le matin (6h-10h)',
            requirement: 30,
            requirementType: 'morning_sessions',
            reward: { xp: 500, badge: 'morning_master' },
            unlockCondition: { previousLevelCompleted: 2 },
          },
        ],
      },
    },
  });

  // Défi 15: Sessions nocturnes
  const nightSessionsChallenge = await prisma.challenge.create({
    data: {
      name: 'Pianiste nocturne',
      description: 'Pratiquez en soirée pour développer votre créativité',
      category: 'timing',
      isActive: true,
      levels: {
        create: [
          {
            level: 1,
            name: 'Débutant nocturne',
            description: 'Pratiquez 5 fois le soir (20h-23h)',
            requirement: 5,
            requirementType: 'night_sessions',
            reward: { xp: 100, badge: 'night_beginner' },
          },
          {
            level: 2,
            name: 'Nocturne confirmé',
            description: 'Pratiquez 15 fois le soir (20h-23h)',
            requirement: 15,
            requirementType: 'night_sessions',
            reward: { xp: 250, badge: 'night_confirmed' },
            unlockCondition: { previousLevelCompleted: 1 },
          },
          {
            level: 3,
            name: 'Maître nocturne',
            description: 'Pratiquez 30 fois le soir (20h-23h)',
            requirement: 30,
            requirementType: 'night_sessions',
            reward: { xp: 500, badge: 'night_master' },
            unlockCondition: { previousLevelCompleted: 2 },
          },
        ],
      },
    },
  });

  return {
    easySongsChallenge,
    practiceTimeChallenge,
    accuracyChallenge,
    genreChallenge,
    intermediateSongsChallenge,
    hardSongsChallenge,
    consecutiveSessionsChallenge,
    composersChallenge,
    weeklyPracticeChallenge,
    longSessionsChallenge,
    hardAccuracyChallenge,
    diverseRepertoireChallenge,
    rapidProgressChallenge,
    morningSessionsChallenge,
    nightSessionsChallenge,
  };
};
