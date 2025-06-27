import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { getServerSession } from 'next-auth';
import {
  getSongsPropertyRepertory,
  getPracticeTimeComparison,
  getStartedSongsComparison,
} from '@/lib/actions/generalStats-actions';
import { PerformancesServices } from '@/lib/services/performances-services';

// Mock des dépendances
vi.mock('next-auth', () => ({
  getServerSession: vi.fn(),
}));

vi.mock('@/lib/authoption', () => ({
  authOptions: {},
}));

vi.mock('@/lib/services/performances-services', () => ({
  PerformancesServices: {
    getSongsRepertory: vi.fn(),
    getPracticeTimeForInterval: vi.fn(),
    getPracticeTimeForPreviousInterval: vi.fn(),
    getStartedSongsForInterval: vi.fn(),
    getStartedSongsForPreviousInterval: vi.fn(),
    getTotalSongsInLibrary: vi.fn(),
  },
}));

const mockGetServerSession = vi.mocked(getServerSession);
const mockPerformancesServices = vi.mocked(PerformancesServices);

describe('GeneralStats Actions', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Mock d'une session valide par défaut
    mockGetServerSession.mockResolvedValue({
      user: { id: 'user123' },
    } as any);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('getSongsPropertyRepertory', () => {
    it('should return processed repertory data successfully', async () => {
      // Mock des données du service
      const mockRawData = {
        genre: ['Classical', 'Jazz', 'Classical', 'Pop', 'Jazz', 'Jazz'],
        composer: ['Bach', 'Mozart', 'Bach', 'Chopin'],
        difficulty: [
          'Débutant',
          'Intermédiaire',
          'Débutant',
          'Avancé',
          'Débutant',
        ],
      };

      mockPerformancesServices.getSongsRepertory.mockResolvedValue(mockRawData);

      const result = await getSongsPropertyRepertory();

      expect(result.success).toBe(true);
      expect(result.data).toEqual({
        genre: [
          { name: 'Classical', value: 33 }, // 2/6 = 33%
          { name: 'Jazz', value: 50 }, // 3/6 = 50%
          { name: 'Pop', value: 17 }, // 1/6 = 17%
        ],
        composer: [
          { name: 'Bach', value: 50 }, // 2/4 = 50%
          { name: 'Mozart', value: 25 }, // 1/4 = 25%
          { name: 'Chopin', value: 25 }, // 1/4 = 25%
        ],
        difficulty: [
          { name: 'Débutant', value: 60 }, // 3/5 = 60%
          { name: 'Intermédiaire', value: 20 }, // 1/5 = 20%
          { name: 'Avancé', value: 20 }, // 1/5 = 20%
        ],
      });

      expect(mockPerformancesServices.getSongsRepertory).toHaveBeenCalledWith(
        'user123'
      );
    });

    it('should handle empty data gracefully', async () => {
      const mockEmptyData = {
        genre: [],
        composer: [],
        difficulty: [],
      };

      mockPerformancesServices.getSongsRepertory.mockResolvedValue(
        mockEmptyData
      );

      const result = await getSongsPropertyRepertory();

      expect(result.success).toBe(true);
      expect(result.data).toEqual({
        genre: [],
        composer: [],
        difficulty: [],
      });
    });

    it('should handle unauthenticated user', async () => {
      mockGetServerSession.mockResolvedValue(null);

      const result = await getSongsPropertyRepertory();

      expect(result.success).toBe(false);
      expect(result.error).toBe('Utilisateur non connecté');
      expect(result.data).toEqual({
        genre: [],
        composer: [],
        difficulty: [],
      });
    });

    it('should handle service errors', async () => {
      mockPerformancesServices.getSongsRepertory.mockRejectedValue(
        new Error('Database connection failed')
      );

      const result = await getSongsPropertyRepertory();

      expect(result.success).toBe(false);
      expect(result.error).toBe('Database connection failed');
      expect(result.data).toEqual({
        genre: [],
        composer: [],
        difficulty: [],
      });
    });

    it('should calculate percentages correctly with single items', async () => {
      const mockSingleData = {
        genre: ['Classical'],
        composer: ['Bach'],
        difficulty: ['Débutant'],
      };

      mockPerformancesServices.getSongsRepertory.mockResolvedValue(
        mockSingleData
      );

      const result = await getSongsPropertyRepertory();

      expect(result.success).toBe(true);
      expect(result.data).toEqual({
        genre: [{ name: 'Classical', value: 100 }],
        composer: [{ name: 'Bach', value: 100 }],
        difficulty: [{ name: 'Débutant', value: 100 }],
      });
    });
  });

  describe('getPracticeTimeComparison', () => {
    it('should return practice time comparison with increase trend', async () => {
      mockPerformancesServices.getPracticeTimeForInterval.mockResolvedValue(
        150
      ); // 2h30
      mockPerformancesServices.getPracticeTimeForPreviousInterval.mockResolvedValue(
        120
      ); // 2h

      const result = await getPracticeTimeComparison('week');

      expect(result.success).toBe(true);
      expect(result.data).toEqual({
        currentTime: 150,
        previousTime: 120,
        percentageChange: 25, // (150-120)/120 * 100 = 25%
        formattedCurrentTime: '2h30m',
        formattedPreviousTime: '2h00m',
        trend: 'increase',
      });

      expect(
        mockPerformancesServices.getPracticeTimeForInterval
      ).toHaveBeenCalledWith('user123', 'week');
      expect(
        mockPerformancesServices.getPracticeTimeForPreviousInterval
      ).toHaveBeenCalledWith('user123', 'week');
    });

    it('should return practice time comparison with decrease trend', async () => {
      mockPerformancesServices.getPracticeTimeForInterval.mockResolvedValue(80);
      mockPerformancesServices.getPracticeTimeForPreviousInterval.mockResolvedValue(
        120
      );

      const result = await getPracticeTimeComparison('month');

      expect(result.success).toBe(true);
      expect(result.data).toEqual({
        currentTime: 80,
        previousTime: 120,
        percentageChange: -33, // (80-120)/120 * 100 = -33%
        formattedCurrentTime: '1h20m',
        formattedPreviousTime: '2h00m',
        trend: 'decrease',
      });
    });

    it('should return stable trend when times are equal', async () => {
      mockPerformancesServices.getPracticeTimeForInterval.mockResolvedValue(
        120
      );
      mockPerformancesServices.getPracticeTimeForPreviousInterval.mockResolvedValue(
        120
      );

      const result = await getPracticeTimeComparison('quarter');

      expect(result.success).toBe(true);
      expect(result.data.trend).toBe('stable');
      expect(result.data.percentageChange).toBe(0);
    });

    it('should handle zero previous time', async () => {
      mockPerformancesServices.getPracticeTimeForInterval.mockResolvedValue(60);
      mockPerformancesServices.getPracticeTimeForPreviousInterval.mockResolvedValue(
        0
      );

      const result = await getPracticeTimeComparison('week');

      expect(result.success).toBe(true);
      expect(result.data.percentageChange).toBe(0);
      expect(result.data.trend).toBe('stable');
    });

    it('should format time correctly', async () => {
      mockPerformancesServices.getPracticeTimeForInterval.mockResolvedValue(65); // 1h05
      mockPerformancesServices.getPracticeTimeForPreviousInterval.mockResolvedValue(
        5
      ); // 5 minutes

      const result = await getPracticeTimeComparison('week');

      expect(result.success).toBe(true);
      expect(result.data.formattedCurrentTime).toBe('1h05m');
      expect(result.data.formattedPreviousTime).toBe('0h05m');
    });

    it('should handle unauthenticated user', async () => {
      mockGetServerSession.mockResolvedValue(null);

      const result = await getPracticeTimeComparison('week');

      expect(result.success).toBe(false);
      expect(result.error).toBe('Utilisateur non connecté');
    });

    it('should handle service errors', async () => {
      mockPerformancesServices.getPracticeTimeForInterval.mockRejectedValue(
        new Error('Service error')
      );

      const result = await getPracticeTimeComparison('week');

      expect(result.success).toBe(false);
      expect(result.error).toBe('Service error');
      expect(result.data.formattedCurrentTime).toBe('0H00');
    });
  });

  describe('getStartedSongsComparison', () => {
    it('should return started songs comparison with increase trend', async () => {
      mockPerformancesServices.getStartedSongsForInterval.mockResolvedValue(8);
      mockPerformancesServices.getStartedSongsForPreviousInterval.mockResolvedValue(
        5
      );
      mockPerformancesServices.getTotalSongsInLibrary.mockResolvedValue(50);

      const result = await getStartedSongsComparison('week');

      expect(result.success).toBe(true);
      expect(result.data).toEqual({
        currentSongs: 8,
        previousSongs: 5,
        difference: 3,
        totalSongs: 50,
        trend: 'increase',
      });

      expect(
        mockPerformancesServices.getStartedSongsForInterval
      ).toHaveBeenCalledWith('user123', 'week');
      expect(
        mockPerformancesServices.getStartedSongsForPreviousInterval
      ).toHaveBeenCalledWith('user123', 'week');
      expect(
        mockPerformancesServices.getTotalSongsInLibrary
      ).toHaveBeenCalledWith('user123');
    });

    it('should return started songs comparison with decrease trend', async () => {
      mockPerformancesServices.getStartedSongsForInterval.mockResolvedValue(3);
      mockPerformancesServices.getStartedSongsForPreviousInterval.mockResolvedValue(
        7
      );
      mockPerformancesServices.getTotalSongsInLibrary.mockResolvedValue(50);

      const result = await getStartedSongsComparison('month');

      expect(result.success).toBe(true);
      expect(result.data).toEqual({
        currentSongs: 3,
        previousSongs: 7,
        difference: -4,
        totalSongs: 50,
        trend: 'decrease',
      });
    });

    it('should return stable trend when numbers are equal', async () => {
      mockPerformancesServices.getStartedSongsForInterval.mockResolvedValue(5);
      mockPerformancesServices.getStartedSongsForPreviousInterval.mockResolvedValue(
        5
      );
      mockPerformancesServices.getTotalSongsInLibrary.mockResolvedValue(50);

      const result = await getStartedSongsComparison('quarter');

      expect(result.success).toBe(true);
      expect(result.data.trend).toBe('stable');
      expect(result.data.difference).toBe(0);
    });

    it('should handle zero values', async () => {
      mockPerformancesServices.getStartedSongsForInterval.mockResolvedValue(0);
      mockPerformancesServices.getStartedSongsForPreviousInterval.mockResolvedValue(
        0
      );
      mockPerformancesServices.getTotalSongsInLibrary.mockResolvedValue(0);

      const result = await getStartedSongsComparison('week');

      expect(result.success).toBe(true);
      expect(result.data).toEqual({
        currentSongs: 0,
        previousSongs: 0,
        difference: 0,
        totalSongs: 0,
        trend: 'stable',
      });
    });

    it('should handle unauthenticated user', async () => {
      mockGetServerSession.mockResolvedValue(null);

      const result = await getStartedSongsComparison('week');

      expect(result.success).toBe(false);
      expect(result.error).toBe('Utilisateur non connecté');
    });

    it('should handle service errors', async () => {
      mockPerformancesServices.getStartedSongsForInterval.mockRejectedValue(
        new Error('Database error')
      );

      const result = await getStartedSongsComparison('week');

      expect(result.success).toBe(false);
      expect(result.error).toBe('Database error');
      expect(result.data.currentSongs).toBe(0);
    });
  });

  describe('Input validation', () => {
    it('should handle different interval types for practice time', async () => {
      mockPerformancesServices.getPracticeTimeForInterval.mockResolvedValue(
        100
      );
      mockPerformancesServices.getPracticeTimeForPreviousInterval.mockResolvedValue(
        80
      );

      // Test all valid intervals
      const intervals: ('week' | 'month' | 'quarter')[] = [
        'week',
        'month',
        'quarter',
      ];

      for (const interval of intervals) {
        const result = await getPracticeTimeComparison(interval);
        expect(result.success).toBe(true);
        expect(
          mockPerformancesServices.getPracticeTimeForInterval
        ).toHaveBeenCalledWith('user123', interval);
      }
    });

    it('should handle different interval types for started songs', async () => {
      mockPerformancesServices.getStartedSongsForInterval.mockResolvedValue(5);
      mockPerformancesServices.getStartedSongsForPreviousInterval.mockResolvedValue(
        3
      );
      mockPerformancesServices.getTotalSongsInLibrary.mockResolvedValue(50);

      // Test all valid intervals
      const intervals: ('week' | 'month' | 'quarter')[] = [
        'week',
        'month',
        'quarter',
      ];

      for (const interval of intervals) {
        const result = await getStartedSongsComparison(interval);
        expect(result.success).toBe(true);
        expect(
          mockPerformancesServices.getStartedSongsForInterval
        ).toHaveBeenCalledWith('user123', interval);
      }
    });
  });
});
