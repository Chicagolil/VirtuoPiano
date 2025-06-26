import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { PerformancesServices } from '@/lib/services/performances-services';
import * as functions from '@/common/utils/function';

// Mock de Prisma - défini dans la factory pour éviter les problèmes de hoisting
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

// Import du mock pour pouvoir l'utiliser dans les tests
import mockPrismaModule from '@/lib/prisma';
const mockPrisma = mockPrismaModule as any;

const mockGetLearnScores = vi.mocked(functions.getLearnScores);
const mockGetDifficultyRange = vi.mocked(functions.getDifficultyRange);

describe('PerformancesServices', () => {
  beforeEach(() => {
    vi.clearAllMocks();

    // Mock par défaut pour getLearnScores
    mockGetLearnScores.mockReturnValue({
      performance: 85,
      accuracy: 90,
    });

    // Mock par défaut pour getDifficultyRange
    mockGetDifficultyRange.mockReturnValue({
      label: 'Intermédiaire',
      className: 'difficultyIntermediate',
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('getPracticeDataForHeatmap', () => {
    it('should return practice data grouped by date', async () => {
      const mockScores = [
        {
          sessionStartTime: new Date('2025-01-15T10:00:00'),
          sessionEndTime: new Date('2025-01-15T10:30:00'),
        },
        {
          sessionStartTime: new Date('2025-01-15T14:00:00'),
          sessionEndTime: new Date('2025-01-15T14:45:00'),
        },
        {
          sessionStartTime: new Date('2025-01-16T09:00:00'),
          sessionEndTime: new Date('2025-01-16T09:20:00'),
        },
      ];

      mockPrisma.scores.findMany.mockResolvedValue(mockScores);

      const result = await PerformancesServices.getPracticeDataForHeatmap(
        'user123',
        2025
      );

      expect(result).toHaveLength(2); // 2 jours différents

      // Vérifier que les durées sont correctement calculées et agrégées
      const jan15Data = result.find(
        (item) => item.date.getDate() === 15 && item.date.getMonth() === 0
      );
      const jan16Data = result.find(
        (item) => item.date.getDate() === 16 && item.date.getMonth() === 0
      );

      expect(jan15Data?.durationInMinutes).toBe(75); // 30 + 45 minutes
      expect(jan16Data?.durationInMinutes).toBe(20); // 20 minutes

      expect(mockPrisma.scores.findMany).toHaveBeenCalledWith({
        where: {
          user_id: 'user123',
          sessionStartTime: {
            gte: new Date('2025-01-01'),
            lte: new Date('2025-12-31'),
          },
        },
        select: {
          sessionStartTime: true,
          sessionEndTime: true,
        },
      });
    });

    it('should handle empty scores array', async () => {
      mockPrisma.scores.findMany.mockResolvedValue([]);

      const result = await PerformancesServices.getPracticeDataForHeatmap(
        'user123',
        2025
      );

      expect(result).toEqual([]);
    });

    it('should handle single session', async () => {
      const mockScores = [
        {
          sessionStartTime: new Date('2025-01-15T10:00:00'),
          sessionEndTime: new Date('2025-01-15T11:00:00'),
        },
      ];

      mockPrisma.scores.findMany.mockResolvedValue(mockScores);

      const result = await PerformancesServices.getPracticeDataForHeatmap(
        'user123',
        2025
      );

      expect(result).toHaveLength(1);
      expect(result[0].durationInMinutes).toBe(60);
    });
  });

  describe('getSessionsByDate', () => {
    it('should return sessions for a specific date', async () => {
      const mockScores = [
        {
          id: 'score1',
          correctNotes: 95,
          missedNotes: 3,
          wrongNotes: 2,
          totalPoints: 1500,
          maxMultiplier: 4,
          maxCombo: 30,
          sessionStartTime: new Date('2025-01-15T10:00:00'),
          sessionEndTime: new Date('2025-01-15T10:30:00'),
          song: {
            title: 'Clair de Lune',
            composer: 'Debussy',
          },
          mode: {
            name: 'Apprentissage',
          },
        },
        {
          id: 'score2',
          correctNotes: 80,
          missedNotes: 5,
          wrongNotes: 10,
          totalPoints: 1200,
          maxMultiplier: 3,
          maxCombo: 25,
          sessionStartTime: new Date('2025-01-15T14:00:00'),
          sessionEndTime: new Date('2025-01-15T14:25:00'),
          song: {
            title: 'Für Elise',
            composer: 'Beethoven',
          },
          mode: {
            name: 'Performance',
          },
        },
      ];

      mockPrisma.scores.findMany.mockResolvedValue(mockScores);

      const testDate = new Date('2025-01-15');
      const result = await PerformancesServices.getSessionsByDate(
        'user123',
        testDate
      );

      expect(result).toHaveLength(2);

      expect(result[0]).toEqual({
        id: 'score1',
        songTitle: 'Clair de Lune',
        songComposer: 'Debussy',
        correctNotes: 95,
        missedNotes: 3,
        wrongNotes: 2,
        totalPoints: 1500,
        maxMultiplier: 4,
        maxCombo: 30,
        sessionStartTime: new Date('2025-01-15T10:00:00'),
        sessionEndTime: new Date('2025-01-15T10:30:00'),
        modeName: 'Apprentissage',
        durationInMinutes: 30,
        accuracy: 90,
        performance: 85,
      });

      // Vérifier les paramètres de la requête
      expect(mockPrisma.scores.findMany).toHaveBeenCalledWith({
        where: {
          user_id: 'user123',
          sessionStartTime: {
            gte: expect.any(Date),
            lte: expect.any(Date),
          },
        },
        include: {
          song: {
            select: {
              title: true,
              composer: true,
            },
          },
          mode: {
            select: {
              name: true,
            },
          },
        },
        orderBy: {
          sessionStartTime: 'asc',
        },
      });

      expect(mockGetLearnScores).toHaveBeenCalledWith(2, 95, 3);
    });

    it('should handle null values gracefully', async () => {
      const mockScores = [
        {
          id: 'score1',
          correctNotes: null,
          missedNotes: null,
          wrongNotes: null,
          totalPoints: 1000,
          maxMultiplier: 2,
          maxCombo: 20,
          sessionStartTime: new Date('2025-01-15T10:00:00'),
          sessionEndTime: new Date('2025-01-15T10:30:00'),
          song: {
            title: 'Test Song',
            composer: null,
          },
          mode: {
            name: 'Apprentissage',
          },
        },
      ];

      mockPrisma.scores.findMany.mockResolvedValue(mockScores);

      const result = await PerformancesServices.getSessionsByDate(
        'user123',
        new Date('2025-01-15')
      );

      expect(result[0].correctNotes).toBe(null);
      expect(result[0].songComposer).toBe(null);
      expect(mockGetLearnScores).toHaveBeenCalledWith(0, 0, 0);
    });
  });

  describe('getSongsRepertory', () => {
    it('should return repertory data with filtered null values', async () => {
      const mockScores = [
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
            genre: null,
            composer: null,
            Level: null,
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

      mockPrisma.scores.findMany.mockResolvedValue(mockScores);

      // Mock getDifficultyRange pour différents niveaux
      mockGetDifficultyRange.mockImplementation((level) => {
        const ranges = {
          3: { label: 'Intermédiaire', className: 'intermediate' },
          4: { label: 'Avancé', className: 'advanced' },
          5: { label: 'Expert', className: 'expert' },
        };
        return (
          ranges[level as keyof typeof ranges] || {
            label: 'Inconnu',
            className: 'unknown',
          }
        );
      });

      const result = await PerformancesServices.getSongsRepertory('user123');

      expect(result).toEqual({
        genre: ['Classical', 'Jazz', 'Classical'],
        composer: ['Bach', 'Miles Davis', 'Mozart'],
        difficulty: ['Intermédiaire', 'Expert', 'Avancé'],
      });

      expect(mockPrisma.scores.findMany).toHaveBeenCalledWith({
        where: {
          user_id: 'user123',
        },
        select: {
          song: {
            select: {
              genre: true,
              composer: true,
              Level: true,
            },
          },
        },
      });
    });

    it('should handle empty scores array', async () => {
      mockPrisma.scores.findMany.mockResolvedValue([]);

      const result = await PerformancesServices.getSongsRepertory('user123');

      expect(result).toEqual({
        genre: [],
        composer: [],
        difficulty: [],
      });
    });
  });

  describe('getPracticeTimeForInterval', () => {
    it('should calculate total practice time for week interval', async () => {
      const mockScores = [
        {
          sessionStartTime: new Date('2025-01-15T10:00:00'),
          sessionEndTime: new Date('2025-01-15T10:30:00'), // 30 minutes
        },
        {
          sessionStartTime: new Date('2025-01-16T14:00:00'),
          sessionEndTime: new Date('2025-01-16T15:00:00'), // 60 minutes
        },
      ];

      mockPrisma.scores.findMany.mockResolvedValue(mockScores);

      const result = await PerformancesServices.getPracticeTimeForInterval(
        'user123',
        'week'
      );

      expect(result).toBe(90); // 30 + 60 minutes

      expect(mockPrisma.scores.findMany).toHaveBeenCalledWith({
        where: {
          user_id: 'user123',
          sessionStartTime: {
            gte: expect.any(Date),
            lte: expect.any(Date),
          },
        },
        select: {
          sessionStartTime: true,
          sessionEndTime: true,
        },
      });
    });

    it('should return 0 for empty scores', async () => {
      mockPrisma.scores.findMany.mockResolvedValue([]);

      const result = await PerformancesServices.getPracticeTimeForInterval(
        'user123',
        'month'
      );

      expect(result).toBe(0);
    });
  });

  describe('getPracticeTimeForPreviousInterval', () => {
    it('should calculate practice time for previous interval', async () => {
      const mockScores = [
        {
          sessionStartTime: new Date('2025-01-08T10:00:00'),
          sessionEndTime: new Date('2025-01-08T10:45:00'), // 45 minutes
        },
      ];

      mockPrisma.scores.findMany.mockResolvedValue(mockScores);

      const result =
        await PerformancesServices.getPracticeTimeForPreviousInterval(
          'user123',
          'week'
        );

      expect(result).toBe(45);
    });
  });

  describe('getStartedSongsForInterval', () => {
    it('should count unique songs started in interval', async () => {
      const mockGroupBy = [
        { song_id: 'song1' },
        { song_id: 'song2' },
        { song_id: 'song3' },
      ];

      mockPrisma.scores.groupBy.mockResolvedValue(mockGroupBy);

      const result = await PerformancesServices.getStartedSongsForInterval(
        'user123',
        'week'
      );

      expect(result).toBe(3);

      expect(mockPrisma.scores.groupBy).toHaveBeenCalledWith({
        by: ['song_id'],
        where: {
          user_id: 'user123',
          sessionStartTime: {
            gte: expect.any(Date),
            lte: expect.any(Date),
          },
        },
      });
    });

    it('should return 0 for no started songs', async () => {
      mockPrisma.scores.groupBy.mockResolvedValue([]);

      const result = await PerformancesServices.getStartedSongsForInterval(
        'user123',
        'month'
      );

      expect(result).toBe(0);
    });
  });

  describe('getStartedSongsForPreviousInterval', () => {
    it('should count unique songs started in previous interval', async () => {
      const mockGroupBy = [{ song_id: 'song1' }, { song_id: 'song2' }];

      mockPrisma.scores.groupBy.mockResolvedValue(mockGroupBy);

      const result =
        await PerformancesServices.getStartedSongsForPreviousInterval(
          'user123',
          'quarter'
        );

      expect(result).toBe(2);
    });
  });

  describe('getTotalSongsInLibrary', () => {
    it('should count total songs from all sources', async () => {
      mockPrisma.songs.count.mockResolvedValue(100); // Library songs
      mockPrisma.usersCompositions.count.mockResolvedValue(15); // User compositions
      mockPrisma.usersImports.count.mockResolvedValue(8); // User imports

      const result = await PerformancesServices.getTotalSongsInLibrary(
        'user123'
      );

      expect(result).toBe(123); // 100 + 15 + 8

      expect(mockPrisma.songs.count).toHaveBeenCalledWith({
        where: {
          SourceType: 'library',
        },
      });

      expect(mockPrisma.usersCompositions.count).toHaveBeenCalledWith({
        where: {
          user_id: 'user123',
        },
      });

      expect(mockPrisma.usersImports.count).toHaveBeenCalledWith({
        where: {
          user_id: 'user123',
        },
      });
    });

    it('should handle zero counts', async () => {
      mockPrisma.songs.count.mockResolvedValue(0);
      mockPrisma.usersCompositions.count.mockResolvedValue(0);
      mockPrisma.usersImports.count.mockResolvedValue(0);

      const result = await PerformancesServices.getTotalSongsInLibrary(
        'user123'
      );

      expect(result).toBe(0);
    });
  });

  describe('getRecentSessionsData', () => {
    it('should return recent sessions with song and mode data', async () => {
      const mockScores = [
        {
          id: 'score1',
          wrongNotes: 5,
          correctNotes: 95,
          missedNotes: 2,
          totalPoints: 1500,
          maxMultiplier: 4,
          maxCombo: 30,
          sessionStartTime: new Date('2025-01-15T10:00:00'),
          sessionEndTime: new Date('2025-01-15T10:30:00'),
          song: {
            title: 'Clair de Lune',
            composer: 'Debussy',
            imageUrl: '/images/song1.jpg',
            tempo: 120,
            Level: 4,
          },
          mode: {
            name: 'Apprentissage',
          },
        },
        {
          id: 'score2',
          wrongNotes: 10,
          correctNotes: 80,
          missedNotes: 5,
          totalPoints: 1200,
          maxMultiplier: 3,
          maxCombo: 25,
          sessionStartTime: new Date('2025-01-14T14:00:00'),
          sessionEndTime: new Date('2025-01-14T14:30:00'),
          song: {
            title: 'Für Elise',
            composer: 'Beethoven',
            imageUrl: null,
            tempo: 140,
            Level: 3,
          },
          mode: {
            name: 'Performance',
          },
        },
      ];

      mockPrisma.scores.findMany.mockResolvedValue(mockScores);

      const result = await PerformancesServices.getRecentSessionsData(
        'user123',
        5
      );

      expect(result).toHaveLength(2);

      expect(result[0]).toEqual({
        id: 'score1',
        songTitle: 'Clair de Lune',
        songComposer: 'Debussy',
        modeName: 'Apprentissage',
        imageUrl: '/images/song1.jpg',
        wrongNotes: 5,
        correctNotes: 95,
        missedNotes: 2,
        totalPoints: 1500,
        maxMultiplier: 4,
        maxCombo: 30,
        sessionStartTime: new Date('2025-01-15T10:00:00'),
        sessionEndTime: new Date('2025-01-15T10:30:00'),
      });

      expect(mockPrisma.scores.findMany).toHaveBeenCalledWith({
        where: {
          user_id: 'user123',
        },
        include: {
          song: {
            select: {
              title: true,
              composer: true,
              imageUrl: true,
              tempo: true,
              Level: true,
            },
          },
          mode: {
            select: {
              name: true,
            },
          },
        },
        orderBy: {
          sessionStartTime: 'desc',
        },
        take: 5,
      });
    });

    it('should use default limit when not specified', async () => {
      mockPrisma.scores.findMany.mockResolvedValue([]);

      await PerformancesServices.getRecentSessionsData('user123');

      expect(mockPrisma.scores.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          take: 5,
        })
      );
    });

    it('should handle empty results', async () => {
      mockPrisma.scores.findMany.mockResolvedValue([]);

      const result = await PerformancesServices.getRecentSessionsData(
        'user123',
        3
      );

      expect(result).toEqual([]);
    });
  });

  describe('Date interval calculations', () => {
    beforeEach(() => {
      // Mock une date fixe pour des tests prévisibles
      vi.setSystemTime(new Date('2025-01-20T12:00:00'));
    });

    it('should calculate correct date ranges for different intervals', async () => {
      mockPrisma.scores.findMany.mockResolvedValue([]);

      // Test week interval
      await PerformancesServices.getPracticeTimeForInterval('user123', 'week');

      // Vérifier que la requête utilise les bonnes dates (7 derniers jours)
      expect(mockPrisma.scores.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            sessionStartTime: expect.objectContaining({
              gte: expect.any(Date),
              lte: expect.any(Date),
            }),
          }),
        })
      );

      // Test month interval
      await PerformancesServices.getPracticeTimeForInterval('user123', 'month');

      // Test quarter interval
      await PerformancesServices.getPracticeTimeForInterval(
        'user123',
        'quarter'
      );

      expect(mockPrisma.scores.findMany).toHaveBeenCalledTimes(3);
    });
  });
});
