import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

// Mock des dépendances externes AVANT les imports
vi.mock('next-auth', () => ({
  getServerSession: vi.fn(),
}));

vi.mock('@/lib/authoption', () => ({
  authOptions: {},
}));

vi.mock('@/lib/prisma', () => ({
  default: {
    scores: {
      findMany: vi.fn(),
      groupBy: vi.fn(),
    },
    songs: {
      count: vi.fn(),
    },
    usersCompositions: {
      count: vi.fn(),
    },
    usersImports: {
      count: vi.fn(),
    },
  },
}));

vi.mock('@/common/utils/function', () => ({
  getLearnScores: vi.fn(),
  getDifficultyRange: vi.fn(),
}));

// Imports APRÈS les mocks
import { getServerSession } from 'next-auth';
import {
  getSongsPropertyRepertory,
  getPracticeTimeComparison,
  getStartedSongsComparison,
} from '@/lib/actions/generalStats-actions';
import { getRecentSessions } from '@/lib/actions/history-actions';
import { PerformancesServices } from '@/lib/services/performances-services';
import * as functions from '@/common/utils/function';
import prisma from '@/lib/prisma';

const mockGetServerSession = vi.mocked(getServerSession);
const mockGetLearnScores = vi.mocked(functions.getLearnScores);
const mockGetDifficultyRange = vi.mocked(functions.getDifficultyRange);

describe('Server Actions Integration Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();

    // Mock d'une session valide par défaut
    mockGetServerSession.mockResolvedValue({
      user: { id: 'user123' },
    } as any);

    // Mock par défaut pour les fonctions utilitaires
    mockGetLearnScores.mockReturnValue({
      performance: 85,
      accuracy: 90,
    });

    mockGetDifficultyRange.mockReturnValue({
      label: 'Intermédiaire',
      className: 'difficultyIntermediate',
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('Full workflow integration', () => {
    it('should handle complete user statistics workflow', async () => {
      // Setup des données mockées pour un scénario réaliste
      const mockScoresForRepertory = [
        {
          song: {
            genre: 'Classical',
            composer: 'Bach',
            Level: 3,
          },
        },
        {
          song: {
            genre: 'Jazz',
            composer: 'Miles Davis',
            Level: 5,
          },
        },
        {
          song: {
            genre: 'Classical',
            composer: 'Mozart',
            Level: 4,
          },
        },
      ];

      const mockScoresForPracticeTime = [
        {
          sessionStartTime: new Date('2025-01-15T10:00:00'),
          sessionEndTime: new Date('2025-01-15T11:30:00'), // 90 minutes
        },
        {
          sessionStartTime: new Date('2025-01-16T14:00:00'),
          sessionEndTime: new Date('2025-01-16T14:30:00'), // 30 minutes
        },
      ];

      const mockScoresForPreviousPracticeTime = [
        {
          sessionStartTime: new Date('2025-01-08T10:00:00'),
          sessionEndTime: new Date('2025-01-08T11:00:00'), // 60 minutes
        },
      ];

      const mockGroupByForCurrentSongs = [
        { song_id: 'song1' },
        { song_id: 'song2' },
        { song_id: 'song3' },
      ];

      const mockGroupByForPreviousSongs = [
        { song_id: 'song1' },
        { song_id: 'song4' },
      ];

      const mockRecentSessionsData = [
        {
          id: 'session1',
          wrongNotes: 5,
          correctNotes: 95,
          missedNotes: 2,
          totalPoints: 1500,
          maxMultiplier: 4,
          maxCombo: 30,
          sessionStartTime: new Date('2025-01-15T10:00:00'),
          sessionEndTime: new Date('2025-01-15T11:30:00'),
          mode: {
            name: 'Apprentissage',
          },
          song: {
            title: 'Clair de Lune',
            composer: 'Debussy',
            imageUrl: '/images/song1.jpg',
          },
        },
      ];

      // Mock getDifficultyRange pour différents niveaux
      mockGetDifficultyRange.mockImplementation((level) => {
        const ranges: Record<number, { label: string; className: string }> = {
          3: { label: 'Intermédiaire', className: 'intermediate' },
          4: { label: 'Avancé', className: 'advanced' },
          5: { label: 'Expert', className: 'expert' },
        };
        return ranges[level] || { label: 'Inconnu', className: 'unknown' };
      });

      // Configuration des mocks Prisma
      vi.mocked(prisma.songs.count).mockResolvedValue(50);
      vi.mocked(prisma.usersCompositions.count).mockResolvedValue(10);
      vi.mocked(prisma.usersImports.count).mockResolvedValue(5);

      // Mock de la date pour des tests prévisibles
      vi.setSystemTime(new Date('2025-01-16T12:00:00'));

      // Test getSongsPropertyRepertory
      vi.mocked(prisma.scores.findMany).mockResolvedValue(
        mockScoresForRepertory as any
      );
      const repertoryResult = await getSongsPropertyRepertory();

      // Test getPracticeTimeComparison
      vi.mocked(prisma.scores.findMany)
        .mockResolvedValueOnce(mockScoresForPracticeTime as any) // Current
        .mockResolvedValueOnce(mockScoresForPreviousPracticeTime as any); // Previous
      const practiceTimeResult = await getPracticeTimeComparison('week');

      // Test getStartedSongsComparison
      vi.mocked(prisma.scores.groupBy)
        .mockResolvedValueOnce(mockGroupByForCurrentSongs as any) // Current
        .mockResolvedValueOnce(mockGroupByForPreviousSongs as any); // Previous
      const startedSongsResult = await getStartedSongsComparison('week');

      // Test getRecentSessions
      vi.mocked(prisma.scores.findMany).mockResolvedValue(
        mockRecentSessionsData as any
      );
      const recentSessionsResult = await getRecentSessions(3);

      // Vérifications des résultats
      expect(repertoryResult.success).toBe(true);
      expect(repertoryResult.data.genre).toEqual([
        { name: 'Classical', value: 67 }, // 2/3 = 67%
        { name: 'Jazz', value: 33 }, // 1/3 = 33%
      ]);

      expect(practiceTimeResult.success).toBe(true);
      expect(practiceTimeResult.data).toEqual({
        currentTime: 120, // 90 + 30 minutes
        previousTime: 60, // 60 minutes (mockScoresForPreviousPracticeTime)
        percentageChange: 100, // (120-60)/60 * 100 = 100%
        formattedCurrentTime: '2h00m',
        formattedPreviousTime: '1h00m',
        trend: 'increase',
      });

      expect(startedSongsResult.success).toBe(true);
      expect(startedSongsResult.data).toEqual({
        currentSongs: 3,
        previousSongs: 2,
        difference: 1,
        totalSongs: 65, // 50 + 10 + 5
        trend: 'increase',
      });

      expect(recentSessionsResult.success).toBe(true);
      expect(recentSessionsResult.data).toHaveLength(1);
      expect(recentSessionsResult.data[0]).toEqual({
        id: 'session1',
        songTitle: 'Clair de Lune',
        songComposer: 'Debussy',
        totalPoints: 1500,
        maxMultiplier: 4,
        maxCombo: 30,
        playedAt: 'Hier, 10:00',
        mode: 'learning',
        accuracy: 90,
        duration: '1:30',
        imageUrl: '/images/song1.jpg',
        performance: 85,
      });
    });

    it('should handle errors gracefully across all actions', async () => {
      // Simuler des erreurs de base de données
      vi.mocked(prisma.scores.findMany).mockRejectedValue(
        new Error('Database connection failed')
      );
      vi.mocked(prisma.scores.groupBy).mockRejectedValue(
        new Error('Database connection failed')
      );
      vi.mocked(prisma.songs.count).mockRejectedValue(
        new Error('Database connection failed')
      );

      // Exécution des actions qui doivent échouer
      const [
        repertoryResult,
        practiceTimeResult,
        startedSongsResult,
        recentSessionsResult,
      ] = await Promise.all([
        getSongsPropertyRepertory(),
        getPracticeTimeComparison('week'),
        getStartedSongsComparison('week'),
        getRecentSessions(3),
      ]);

      // Vérifications que toutes les actions gèrent les erreurs
      expect(repertoryResult.success).toBe(false);
      expect(practiceTimeResult.success).toBe(false);
      expect(startedSongsResult.success).toBe(false);
      expect(recentSessionsResult.success).toBe(false);
    });
  });

  describe('PerformancesServices integration', () => {
    it('should work with PerformancesServices methods', async () => {
      const mockScores = [
        {
          id: 'score1',
          totalPoints: 1000,
          wrongNotes: 5,
          correctNotes: 95,
          missedNotes: 2,
          sessionStartTime: new Date('2025-01-15T10:00:00'),
          sessionEndTime: new Date('2025-01-15T11:00:00'),
          song: {
            title: 'Test Song',
            composer: 'Test Composer',
            Level: 3,
          },
        },
      ];

      vi.mocked(prisma.scores.findMany).mockResolvedValue(mockScores as any);
      vi.mocked(prisma.scores.groupBy).mockResolvedValue([
        { song_id: 'song1' },
      ] as any);

      vi.setSystemTime(new Date('2025-01-20T12:00:00'));

      const result = await getSongsPropertyRepertory();

      expect(result.success).toBe(true);
      expect(vi.mocked(prisma.scores.findMany)).toHaveBeenCalled();
    });

    it('should handle concurrent requests correctly', async () => {
      // Reset pour ce test
      vi.mocked(prisma.scores.findMany).mockResolvedValue([]);
      vi.mocked(prisma.scores.groupBy).mockResolvedValue([]);
      vi.mocked(prisma.songs.count).mockResolvedValue(0);
      vi.mocked(prisma.usersCompositions.count).mockResolvedValue(0);
      vi.mocked(prisma.usersImports.count).mockResolvedValue(0);

      // Exécuter plusieurs requêtes simultanément
      const promises = Array.from({ length: 3 }, () =>
        Promise.all([
          getSongsPropertyRepertory(),
          getPracticeTimeComparison('week'),
          getStartedSongsComparison('week'),
        ])
      );

      const results = await Promise.all(promises);

      // Vérifier que toutes les requêtes ont réussi
      results.forEach(([repertory, practiceTime, startedSongs]) => {
        expect(repertory.success).toBe(true);
        expect(practiceTime.success).toBe(true);
        expect(startedSongs.success).toBe(true);
      });

      // Vérifier que les mocks ont été appelés (3 requêtes × 3 actions = 9 appels minimum)
      expect(vi.mocked(prisma.scores.findMany)).toHaveBeenCalled();
      expect(vi.mocked(prisma.scores.groupBy)).toHaveBeenCalled();
    });
  });

  describe('Performance with large datasets', () => {
    it('should handle large datasets efficiently', async () => {
      // Simuler un grand dataset
      const largeScoresArray = Array.from({ length: 1000 }, (_, i) => ({
        id: `score${i}`,
        totalPoints: Math.floor(Math.random() * 2000),
        wrongNotes: Math.floor(Math.random() * 10),
        correctNotes: Math.floor(Math.random() * 100) + 50,
        missedNotes: Math.floor(Math.random() * 5),
        sessionStartTime: new Date(2025, 0, 1 + (i % 30)),
        sessionEndTime: new Date(2025, 0, 1 + (i % 30), 1),
        song: {
          title: `Song ${i}`,
          composer: `Composer ${i % 10}`,
          Level: (i % 5) + 1,
          genre: ['Classical', 'Jazz', 'Pop', 'Rock'][i % 4],
        },
      }));

      const largeGroupByArray = Array.from({ length: 500 }, (_, i) => ({
        song_id: `song${i}`,
      }));

      vi.mocked(prisma.scores.findMany).mockResolvedValue(
        largeScoresArray as any
      );
      vi.mocked(prisma.scores.groupBy).mockResolvedValue(
        largeGroupByArray as any
      );
      vi.mocked(prisma.songs.count).mockResolvedValue(1000);
      vi.mocked(prisma.usersCompositions.count).mockResolvedValue(100);
      vi.mocked(prisma.usersImports.count).mockResolvedValue(50);

      const startTime = Date.now();

      const result = await getSongsPropertyRepertory();

      const endTime = Date.now();
      const executionTime = endTime - startTime;

      expect(result.success).toBe(true);
      expect(executionTime).toBeLessThan(1000); // Moins d'une seconde
      expect(result.data.genre).toBeDefined();
      expect(result.data.composer).toBeDefined();
      expect(result.data.difficulty).toBeDefined();
    });
  });
});
