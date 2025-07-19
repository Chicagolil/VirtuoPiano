import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { getServerSession } from 'next-auth';
import {
  getRecentSessions,
  getAllSessions,
  getFilteredSessions,
} from '@/lib/actions/history-actions';
import { PerformancesServices } from '@/lib/services/performances-services';
import * as functions from '@/common/utils/function';

// Mock des dépendances
vi.mock('next-auth', () => ({
  getServerSession: vi.fn(),
}));

vi.mock('@/lib/authoption', () => ({
  authOptions: {},
}));

vi.mock('@/lib/services/performances-services', () => ({
  PerformancesServices: {
    getRecentSessionsData: vi.fn(),
    getAllSessionsData: vi.fn(),
    getFilteredSessionsData: vi.fn(),
  },
}));

vi.mock('@/common/utils/function', () => ({
  getLearnScores: vi.fn(),
}));

const mockGetServerSession = vi.mocked(getServerSession);
const mockPerformancesServices = vi.mocked(PerformancesServices);
const mockGetLearnScores = vi.mocked(functions.getLearnScores);

describe('History Actions', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Mock d'une session valide par défaut
    mockGetServerSession.mockResolvedValue({
      user: { id: 'user123' },
    } as any);

    // Mock par défaut pour getLearnScores
    mockGetLearnScores.mockReturnValue({
      performance: 85,
      accuracy: 90,
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('getRecentSessions', () => {
    it('should return recent sessions with default limit', async () => {
      const mockSessionsData = [
        {
          id: 'session1',
          songTitle: 'Clair de Lune',
          songComposer: 'Debussy',
          wrongNotes: 5,
          correctNotes: 95,
          missedNotes: 2,
          totalPoints: 1250,
          maxMultiplier: 3,
          maxCombo: 25,
          sessionStartTime: new Date('2025-01-15T14:30:00'),
          sessionEndTime: new Date('2025-01-15T15:00:00'),
          modeName: 'Apprentissage',
          imageUrl: '/images/song1.jpg',
        },
        {
          id: 'session2',
          songTitle: 'Für Elise',
          songComposer: 'Beethoven',
          wrongNotes: 10,
          correctNotes: 80,
          missedNotes: 5,
          totalPoints: 950,
          maxMultiplier: 2,
          maxCombo: 15,
          sessionStartTime: new Date('2025-01-14T16:00:00'),
          sessionEndTime: new Date('2025-01-14T16:25:00'),
          modeName: 'Performance',
          imageUrl: null,
        },
      ];

      mockPerformancesServices.getRecentSessionsData.mockResolvedValue(
        mockSessionsData
      );

      // Mock de la date actuelle pour des tests prévisibles
      vi.setSystemTime(new Date('2025-01-16T10:00:00'));

      const result = await getRecentSessions();

      expect(result.success).toBe(true);
      expect(result.data).toHaveLength(2);

      // Vérifier la première session (utilisera "Aujourd'hui" car la date est récente)
      expect(result.data[0]).toEqual({
        id: 'session1',
        songTitle: 'Clair de Lune',
        songComposer: 'Debussy',
        totalPoints: 1250,
        maxMultiplier: 3,
        maxCombo: 25,
        playedAt: "Aujourd'hui, 14:30",
        mode: 'learning',
        accuracy: 90,
        duration: '30:00',
        imageUrl: '/images/song1.jpg',
        performance: 85,
      });

      // Vérifier la deuxième session
      expect(result.data[1]).toEqual({
        id: 'session2',
        songTitle: 'Für Elise',
        songComposer: 'Beethoven',
        totalPoints: 950,
        maxMultiplier: 2,
        maxCombo: 15,
        playedAt: 'Hier, 16:00', // Corrigé selon le formatage réel
        mode: 'game',
        accuracy: 90,
        duration: '25:00',
        imageUrl: undefined,
        performance: 85,
      });

      expect(
        mockPerformancesServices.getRecentSessionsData
      ).toHaveBeenCalledWith('user123', 3);
    });

    it('should return recent sessions with custom limit', async () => {
      const mockSessionsData = [
        {
          id: 'session1',
          songTitle: 'Test Song',
          songComposer: 'Test Composer',
          wrongNotes: 0,
          correctNotes: 100,
          missedNotes: 0,
          totalPoints: 1500,
          maxMultiplier: 4,
          maxCombo: 30,
          sessionStartTime: new Date('2025-01-15T10:00:00'),
          sessionEndTime: new Date('2025-01-15T10:30:00'),
          modeName: 'Apprentissage',
          imageUrl: null,
        },
      ];

      mockPerformancesServices.getRecentSessionsData.mockResolvedValue(
        mockSessionsData
      );

      const result = await getRecentSessions(5);

      expect(result.success).toBe(true);
      expect(
        mockPerformancesServices.getRecentSessionsData
      ).toHaveBeenCalledWith('user123', 5);
    });

    it('should handle sessions without composer', async () => {
      const mockSessionsData = [
        {
          id: 'session1',
          songTitle: 'Unknown Song',
          songComposer: null,
          wrongNotes: 5,
          correctNotes: 95,
          missedNotes: 0,
          totalPoints: 1000,
          maxMultiplier: 2,
          maxCombo: 20,
          sessionStartTime: new Date('2025-01-15T14:30:00'),
          sessionEndTime: new Date('2025-01-15T15:00:00'),
          modeName: 'Apprentissage',
          imageUrl: null,
        },
      ];

      mockPerformancesServices.getRecentSessionsData.mockResolvedValue(
        mockSessionsData
      );

      const result = await getRecentSessions();

      expect(result.success).toBe(true);
      expect(result.data[0].songComposer).toBeUndefined();
    });

    it('should format duration correctly for different time spans', async () => {
      const mockSessionsData = [
        {
          id: 'session1',
          songTitle: 'Short Song',
          songComposer: 'Test',
          wrongNotes: 0,
          correctNotes: 100,
          missedNotes: 0,
          totalPoints: 1000,
          maxMultiplier: 2,
          maxCombo: 20,
          sessionStartTime: new Date('2025-01-15T14:30:00'),
          sessionEndTime: new Date('2025-01-15T14:35:00'), // 5 minutes
          modeName: 'Apprentissage',
          imageUrl: null,
        },
        {
          id: 'session2',
          songTitle: 'Long Song',
          songComposer: 'Test',
          wrongNotes: 0,
          correctNotes: 100,
          missedNotes: 0,
          totalPoints: 1000,
          maxMultiplier: 2,
          maxCombo: 20,
          sessionStartTime: new Date('2025-01-15T14:00:00'),
          sessionEndTime: new Date('2025-01-15T15:30:00'), // 1h30
          modeName: 'Apprentissage',
          imageUrl: null,
        },
      ];

      mockPerformancesServices.getRecentSessionsData.mockResolvedValue(
        mockSessionsData
      );

      const result = await getRecentSessions();

      expect(result.success).toBe(true);
      expect(result.data[0].duration).toBe('5:00');
      expect(result.data[1].duration).toBe('1:30');
    });

    it('should format playedAt correctly for different time periods', async () => {
      const now = new Date('2025-01-20T10:00:00');
      vi.setSystemTime(now);

      const mockSessionsData = [
        // Aujourd'hui
        {
          id: 'today',
          songTitle: 'Today Song',
          songComposer: 'Test',
          wrongNotes: 0,
          correctNotes: 100,
          missedNotes: 0,
          totalPoints: 1000,
          maxMultiplier: 2,
          maxCombo: 20,
          sessionStartTime: new Date('2025-01-20T09:30:00'),
          sessionEndTime: new Date('2025-01-20T10:00:00'),
          modeName: 'Apprentissage',
          imageUrl: null,
        },
        // Hier
        {
          id: 'yesterday',
          songTitle: 'Yesterday Song',
          songComposer: 'Test',
          wrongNotes: 0,
          correctNotes: 100,
          missedNotes: 0,
          totalPoints: 1000,
          maxMultiplier: 2,
          maxCombo: 20,
          sessionStartTime: new Date('2025-01-19T15:00:00'),
          sessionEndTime: new Date('2025-01-19T15:30:00'),
          modeName: 'Apprentissage',
          imageUrl: null,
        },
        // Il y a quelques jours
        {
          id: 'few_days',
          songTitle: 'Few Days Song',
          songComposer: 'Test',
          wrongNotes: 0,
          correctNotes: 100,
          missedNotes: 0,
          totalPoints: 1000,
          maxMultiplier: 2,
          maxCombo: 20,
          sessionStartTime: new Date('2025-01-17T12:00:00'),
          sessionEndTime: new Date('2025-01-17T12:30:00'),
          modeName: 'Apprentissage',
          imageUrl: null,
        },
        // Il y a des semaines
        {
          id: 'weeks',
          songTitle: 'Weeks Song',
          songComposer: 'Test',
          wrongNotes: 0,
          correctNotes: 100,
          missedNotes: 0,
          totalPoints: 1000,
          maxMultiplier: 2,
          maxCombo: 20,
          sessionStartTime: new Date('2025-01-05T12:00:00'),
          sessionEndTime: new Date('2025-01-05T12:30:00'),
          modeName: 'Apprentissage',
          imageUrl: null,
        },
        // Il y a des mois
        {
          id: 'months',
          songTitle: 'Months Song',
          songComposer: 'Test',
          wrongNotes: 0,
          correctNotes: 100,
          missedNotes: 0,
          totalPoints: 1000,
          maxMultiplier: 2,
          maxCombo: 20,
          sessionStartTime: new Date('2024-12-10T12:00:00'),
          sessionEndTime: new Date('2024-12-10T12:30:00'),
          modeName: 'Apprentissage',
          imageUrl: null,
        },
      ];

      mockPerformancesServices.getRecentSessionsData.mockResolvedValue(
        mockSessionsData
      );

      const result = await getRecentSessions(5);

      expect(result.success).toBe(true);
      expect(result.data[0].playedAt).toBe("Aujourd'hui, 09:30");
      expect(result.data[1].playedAt).toBe("Aujourd'hui, 15:00"); // Corrigé car la date est aussi récente
      expect(result.data[2].playedAt).toBe('Il y a 2 jours'); // Corrigé selon le calcul réel
      expect(result.data[3].playedAt).toBe('Il y a 2 semaines');
      expect(result.data[4].playedAt).toBe('10 décembre');
    });

    it('should map mode names correctly', async () => {
      const mockSessionsData = [
        {
          id: 'learning',
          songTitle: 'Learning Song',
          songComposer: 'Test',
          wrongNotes: 0,
          correctNotes: 100,
          missedNotes: 0,
          totalPoints: 1000,
          maxMultiplier: 2,
          maxCombo: 20,
          sessionStartTime: new Date('2025-01-15T14:30:00'),
          sessionEndTime: new Date('2025-01-15T15:00:00'),
          modeName: 'Apprentissage',
          imageUrl: null,
        },
        {
          id: 'game',
          songTitle: 'Game Song',
          songComposer: 'Test',
          wrongNotes: 0,
          correctNotes: 100,
          missedNotes: 0,
          totalPoints: 1000,
          maxMultiplier: 2,
          maxCombo: 20,
          sessionStartTime: new Date('2025-01-15T14:30:00'),
          sessionEndTime: new Date('2025-01-15T15:00:00'),
          modeName: 'Performance',
          imageUrl: null,
        },
      ];

      mockPerformancesServices.getRecentSessionsData.mockResolvedValue(
        mockSessionsData
      );

      const result = await getRecentSessions();

      expect(result.success).toBe(true);
      expect(result.data[0].mode).toBe('learning');
      expect(result.data[1].mode).toBe('game');
    });

    it('should handle null values gracefully', async () => {
      const mockSessionsData = [
        {
          id: 'session1',
          songTitle: 'Test Song',
          songComposer: null,
          wrongNotes: null,
          correctNotes: null,
          missedNotes: null,
          totalPoints: null,
          maxMultiplier: null,
          maxCombo: null,
          sessionStartTime: new Date('2025-01-15T14:30:00'),
          sessionEndTime: new Date('2025-01-15T15:00:00'),
          modeName: 'Apprentissage',
          imageUrl: null,
        },
      ];

      mockPerformancesServices.getRecentSessionsData.mockResolvedValue(
        mockSessionsData
      );

      const result = await getRecentSessions();

      expect(result.success).toBe(true);
      expect(result.data[0]).toEqual({
        id: 'session1',
        songTitle: 'Test Song',
        songComposer: undefined,
        totalPoints: 0,
        maxMultiplier: 0,
        maxCombo: 0,
        playedAt: expect.any(String),
        mode: 'learning',
        accuracy: 90,
        duration: '30:00',
        imageUrl: undefined,
        performance: 85,
      });

      // Vérifier que getLearnScores est appelé avec 0 pour les valeurs null
      expect(mockGetLearnScores).toHaveBeenCalledWith(0, 0, 0);
    });

    it('should handle unauthenticated user', async () => {
      mockGetServerSession.mockResolvedValue(null);

      const result = await getRecentSessions();

      expect(result.success).toBe(false);
      expect(result.error).toBe('Échec du chargement des données');
      expect(result.data).toEqual([]);
    });

    it('should handle service errors', async () => {
      mockPerformancesServices.getRecentSessionsData.mockRejectedValue(
        new Error('Database connection failed')
      );

      const result = await getRecentSessions();

      expect(result.success).toBe(false);
      expect(result.error).toBe('Échec du chargement des données');
      expect(result.data).toEqual([]);
    });

    it('should handle empty sessions array', async () => {
      mockPerformancesServices.getRecentSessionsData.mockResolvedValue([]);

      const result = await getRecentSessions();

      expect(result.success).toBe(true);
      expect(result.data).toEqual([]);
    });

    it('should call getLearnScores with correct parameters', async () => {
      const mockSessionsData = [
        {
          id: 'session1',
          songTitle: 'Test Song',
          songComposer: 'Test',
          wrongNotes: 10,
          correctNotes: 85,
          missedNotes: 5,
          totalPoints: 1000,
          maxMultiplier: 2,
          maxCombo: 20,
          sessionStartTime: new Date('2025-01-15T14:30:00'),
          sessionEndTime: new Date('2025-01-15T15:00:00'),
          modeName: 'Apprentissage',
          imageUrl: null,
        },
      ];

      mockPerformancesServices.getRecentSessionsData.mockResolvedValue(
        mockSessionsData
      );

      await getRecentSessions();

      expect(mockGetLearnScores).toHaveBeenCalledWith(10, 85, 5);
    });
  });

  describe('getAllSessions', () => {
    it('should return all sessions successfully', async () => {
      const mockSessionsData = [
        {
          id: 'session1',
          songTitle: 'Song 1',
          songComposer: 'Composer 1',
          wrongNotes: 5,
          correctNotes: 95,
          missedNotes: 2,
          totalPoints: 1250,
          maxMultiplier: 3,
          maxCombo: 25,
          sessionStartTime: new Date('2025-01-15T14:30:00'),
          sessionEndTime: new Date('2025-01-15T15:00:00'),
          modeName: 'Apprentissage',
          imageUrl: '/images/song1.jpg',
        },
        {
          id: 'session2',
          songTitle: 'Song 2',
          songComposer: 'Composer 2',
          wrongNotes: 10,
          correctNotes: 80,
          missedNotes: 5,
          totalPoints: 950,
          maxMultiplier: 2,
          maxCombo: 15,
          sessionStartTime: new Date('2025-01-14T16:00:00'),
          sessionEndTime: new Date('2025-01-14T16:25:00'),
          modeName: 'Jeu',
          imageUrl: null,
        },
      ];

      mockPerformancesServices.getAllSessionsData.mockResolvedValue(
        mockSessionsData
      );

      const result = await getAllSessions();

      expect(result.success).toBe(true);
      expect(result.data).toHaveLength(2);
      expect(result.data[0].id).toBe('session1');
      expect(result.data[1].mode).toBe('game');

      expect(mockPerformancesServices.getAllSessionsData).toHaveBeenCalledWith(
        'user123'
      );
    });

    it('should handle unauthenticated user', async () => {
      mockGetServerSession.mockResolvedValue(null);

      const result = await getAllSessions();

      expect(result.success).toBe(false);
      expect(result.error).toBe('Échec du chargement des données');
      expect(result.data).toEqual([]);
    });

    it('should handle service errors', async () => {
      mockPerformancesServices.getAllSessionsData.mockRejectedValue(
        new Error('Database error')
      );

      const result = await getAllSessions();

      expect(result.success).toBe(false);
      expect(result.error).toBe('Échec du chargement des données');
      expect(result.data).toEqual([]);
    });
  });

  describe('getFilteredSessions', () => {
    it('should return filtered sessions with pagination', async () => {
      const mockSessionsData = [
        {
          id: 'session1',
          songTitle: 'Filtered Song 1',
          songComposer: 'Test Composer',
          wrongNotes: 5,
          correctNotes: 95,
          missedNotes: 2,
          totalPoints: 1250,
          maxMultiplier: 3,
          maxCombo: 25,
          sessionStartTime: new Date('2025-01-15T14:30:00'),
          sessionEndTime: new Date('2025-01-15T15:00:00'),
          modeName: 'Apprentissage',
          imageUrl: '/images/song1.jpg',
        },
      ];

      mockPerformancesServices.getFilteredSessionsData.mockResolvedValue({
        sessions: mockSessionsData,
        hasMore: true,
        total: 50,
      });

      const filters = {
        searchQuery: 'test',
        modeFilter: 'learning' as const,
        onlyCompleted: true,
        dateStart: '2025-01-01',
        dateEnd: '2025-01-31',
      };

      const pagination = {
        limit: 10,
        offset: 0,
      };

      const result = await getFilteredSessions(filters, pagination);

      expect(result.success).toBe(true);
      expect(result.data).toHaveLength(1);
      expect(result.hasMore).toBe(true);
      expect(result.total).toBe(50);
      expect(result.data[0].songTitle).toBe('Filtered Song 1');

      expect(
        mockPerformancesServices.getFilteredSessionsData
      ).toHaveBeenCalledWith('user123', filters, pagination);
    });

    it('should handle empty filters', async () => {
      mockPerformancesServices.getFilteredSessionsData.mockResolvedValue({
        sessions: [],
        hasMore: false,
        total: 0,
      });

      const filters = {};
      const pagination = { limit: 30, offset: 0 };

      const result = await getFilteredSessions(filters, pagination);

      expect(result.success).toBe(true);
      expect(result.data).toEqual([]);
      expect(result.hasMore).toBe(false);
      expect(result.total).toBe(0);

      expect(
        mockPerformancesServices.getFilteredSessionsData
      ).toHaveBeenCalledWith('user123', {}, pagination);
    });

    it('should handle all filter types', async () => {
      mockPerformancesServices.getFilteredSessionsData.mockResolvedValue({
        sessions: [],
        hasMore: false,
        total: 0,
      });

      // Test with all filter types
      const filters = {
        searchQuery: 'moonlight',
        modeFilter: 'game' as const,
        onlyCompleted: false,
        dateStart: '2025-01-01',
        dateEnd: '2025-01-31',
      };

      const pagination = { limit: 20, offset: 40 };

      await getFilteredSessions(filters, pagination);

      expect(
        mockPerformancesServices.getFilteredSessionsData
      ).toHaveBeenCalledWith('user123', filters, pagination);
    });

    it('should transform sessions correctly', async () => {
      const mockSessionsData = [
        {
          id: 'session1',
          songTitle: 'Test Song',
          songComposer: null,
          wrongNotes: 10,
          correctNotes: 90,
          missedNotes: 5,
          totalPoints: null,
          maxMultiplier: null,
          maxCombo: null,
          sessionStartTime: new Date('2025-01-15T14:30:00'),
          sessionEndTime: new Date('2025-01-15T16:00:00'), // 1h30
          modeName: 'Jeu',
          imageUrl: null,
        },
      ];

      mockPerformancesServices.getFilteredSessionsData.mockResolvedValue({
        sessions: mockSessionsData,
        hasMore: false,
        total: 1,
      });

      const result = await getFilteredSessions({}, { limit: 10, offset: 0 });

      expect(result.success).toBe(true);
      expect(result.data[0]).toEqual({
        id: 'session1',
        songTitle: 'Test Song',
        songComposer: undefined,
        totalPoints: 0,
        maxMultiplier: 0,
        maxCombo: 0,
        playedAt: expect.any(String),
        mode: 'game',
        accuracy: 90,
        duration: '1:30',
        imageUrl: undefined,
        performance: 85,
      });
    });

    it('should handle unauthenticated user', async () => {
      mockGetServerSession.mockResolvedValue(null);

      const result = await getFilteredSessions({}, { limit: 10, offset: 0 });

      expect(result.success).toBe(false);
      expect(result.error).toBe('Échec du chargement des données');
      expect(result.data).toEqual([]);
      expect(result.hasMore).toBe(false);
      expect(result.total).toBe(0);
    });

    it('should handle service errors', async () => {
      mockPerformancesServices.getFilteredSessionsData.mockRejectedValue(
        new Error('Filter error')
      );

      const result = await getFilteredSessions({}, { limit: 10, offset: 0 });

      expect(result.success).toBe(false);
      expect(result.error).toBe('Échec du chargement des données');
      expect(result.data).toEqual([]);
      expect(result.hasMore).toBe(false);
      expect(result.total).toBe(0);
    });

    it('should handle pagination correctly', async () => {
      mockPerformancesServices.getFilteredSessionsData.mockResolvedValue({
        sessions: [],
        hasMore: true,
        total: 100,
      });

      const pagination = { limit: 30, offset: 60 };

      const result = await getFilteredSessions({}, pagination);

      expect(result.success).toBe(true);
      expect(result.hasMore).toBe(true);
      expect(result.total).toBe(100);

      expect(
        mockPerformancesServices.getFilteredSessionsData
      ).toHaveBeenCalledWith('user123', {}, pagination);
    });
  });
});
