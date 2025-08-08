import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React from 'react';
import {
  useSongPerformanceGeneralTiles,
  useSongPracticeData,
  usePrefetchAdjacentData,
  useSongTimelineRecordsData,
  useInvalidatePracticeCache,
  useSongLearningModeTiles,
  useSongPlayModeTiles,
  useSongLearningPrecisionData,
  usePrefetchLearningPrecisionData,
  useSongLearningPerformanceData,
  usePrefetchLearningPerformanceData,
  useSongPerformancePrecisionBarChartData,
  usePrefetchPerformancePrecisionBarChartData,
  useSongGamingLineChartData,
  usePrefetchGamingLineChartData,
  useSongGamingBarChartData,
  usePrefetchGamingBarChartData,
} from '@/customHooks/useSongPerformances';
import {
  getSongPerformanceGeneralTilesAction,
  getSongPracticeDataAction,
  getSongTimelineRecordsDataAction,
  getSongLearningModeTilesAction,
  getSongPlayModeTilesAction,
  getSongLearningPrecisionDataAction,
  getSongLearningPerformanceDataAction,
  getSongPerformancePrecisionBarChartDataAction,
  getSongGamingLineChartDataAction,
  getSongGamingBarChartDataAction,
} from '@/lib/actions/songPerformances-actions';

// Mock des actions
vi.mock('@/lib/actions/songPerformances-actions', () => ({
  getSongPerformanceGeneralTilesAction: vi.fn(),
  getSongPracticeDataAction: vi.fn(),
  getSongTimelineRecordsDataAction: vi.fn(),
  getSongLearningModeTilesAction: vi.fn(),
  getSongPlayModeTilesAction: vi.fn(),
  getSongLearningPrecisionDataAction: vi.fn(),
  getSongLearningPerformanceDataAction: vi.fn(),
  getSongPerformancePrecisionBarChartDataAction: vi.fn(),
  getSongGamingLineChartDataAction: vi.fn(),
  getSongGamingBarChartDataAction: vi.fn(),
}));

// Wrapper pour les tests React Query
const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

  const Wrapper = ({ children }: { children: React.ReactNode }) => {
    return React.createElement(
      QueryClientProvider,
      { client: queryClient },
      children
    );
  };

  return Wrapper;
};

describe('useSongPerformances Hooks', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('useSongPerformanceGeneralTiles', () => {
    it('devrait récupérer les données générales avec succès', async () => {
      const mockData = {
        totalSessions: 5,
        totalTimeInMinutes: 120,
        currentStreak: 3,
        globalRanking: 2,
      };

      (getSongPerformanceGeneralTilesAction as any).mockResolvedValue({
        success: true,
        data: mockData,
      });

      const { result } = renderHook(
        () => useSongPerformanceGeneralTiles('song1'),
        {
          wrapper: createWrapper(),
        }
      );

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(result.current.data).toEqual({
        success: true,
        data: mockData,
      });
      expect(getSongPerformanceGeneralTilesAction).toHaveBeenCalledWith(
        'song1'
      );
    });

    it('ne devrait pas exécuter la requête si songId est vide', () => {
      const { result } = renderHook(() => useSongPerformanceGeneralTiles(''), {
        wrapper: createWrapper(),
      });

      expect(result.current.isFetching).toBe(false);
      expect(getSongPerformanceGeneralTilesAction).not.toHaveBeenCalled();
    });
  });

  describe('useSongPracticeData', () => {
    it('devrait récupérer les données de pratique avec navigation', async () => {
      const mockData = {
        data: [
          {
            name: "Aujourd'hui",
            pratique: 30,
            modeJeu: 15,
            modeApprentissage: 15,
          },
        ],
        totalPratique: 30,
        totalModeJeu: 15,
        totalModeApprentissage: 15,
      };

      (getSongPracticeDataAction as any).mockResolvedValue({
        success: true,
        data: mockData,
      });

      const { result } = renderHook(() => useSongPracticeData('song1', 7, 0), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(result.current.data).toEqual({
        success: true,
        data: mockData,
      });
      expect(getSongPracticeDataAction).toHaveBeenCalledWith('song1', 7, 0);
    });
  });

  describe('usePrefetchAdjacentData', () => {
    it('devrait précharger les données adjacentes', async () => {
      const { result } = renderHook(
        () => usePrefetchAdjacentData('song1', 7, 1),
        {
          wrapper: createWrapper(),
        }
      );

      // Simuler le préchargement
      result.current.prefetchAdjacent();

      // Vérifier que les appels de préchargement ont été faits
      expect(getSongPracticeDataAction).toHaveBeenCalledWith('song1', 7, 0); // index précédent
      expect(getSongPracticeDataAction).toHaveBeenCalledWith('song1', 7, 2); // index suivant
    });
  });

  describe('useSongTimelineRecordsData', () => {
    it('devrait récupérer les records timeline pour le mode apprentissage', async () => {
      const mockData = {
        records: [
          {
            id: 1,
            type: 'accuracy_right',
            score: 90,
            date: '2024-01-01T10:00:00Z',
            description: 'Meilleure précision main droite',
            details:
              'Vous avez atteint 90% de précision avec votre main droite.',
          },
        ],
      };

      (getSongTimelineRecordsDataAction as any).mockResolvedValue({
        success: true,
        data: mockData,
      });

      const { result } = renderHook(
        () => useSongTimelineRecordsData('song1', 'learning'),
        {
          wrapper: createWrapper(),
        }
      );

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(result.current.data).toEqual({
        success: true,
        data: mockData,
      });
      expect(getSongTimelineRecordsDataAction).toHaveBeenCalledWith(
        'song1',
        'learning'
      );
    });

    it('devrait récupérer les records timeline pour le mode jeu', async () => {
      const mockData = {
        records: [
          {
            id: 1,
            type: 'score',
            score: 10000,
            date: '2024-01-01T10:00:00Z',
            description: 'Meilleur score',
            details: 'Vous avez obtenu 10,000 points.',
          },
        ],
      };

      (getSongTimelineRecordsDataAction as any).mockResolvedValue({
        success: true,
        data: mockData,
      });

      const { result } = renderHook(
        () => useSongTimelineRecordsData('song1', 'game'),
        {
          wrapper: createWrapper(),
        }
      );

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(result.current.data).toEqual({
        success: true,
        data: mockData,
      });
      expect(getSongTimelineRecordsDataAction).toHaveBeenCalledWith(
        'song1',
        'game'
      );
    });
  });

  describe('useInvalidatePracticeCache', () => {
    it('devrait invalider le cache pour une chanson spécifique', async () => {
      const { result } = renderHook(() => useInvalidatePracticeCache(), {
        wrapper: createWrapper(),
      });

      // Simuler l'invalidation du cache
      result.current.invalidateCache('song1');

      // Vérifier que les fonctions d'invalidation sont disponibles
      expect(result.current.invalidatePracticeDataOnly).toBeDefined();
      expect(result.current.invalidatePrecisionDataOnly).toBeDefined();
      expect(result.current.invalidatePerformanceDataOnly).toBeDefined();
      expect(result.current.invalidateGamingLineChartDataOnly).toBeDefined();
    });

    it('devrait invalider tout le cache si aucun songId', async () => {
      const { result } = renderHook(() => useInvalidatePracticeCache(), {
        wrapper: createWrapper(),
      });

      // Simuler l'invalidation de tout le cache
      result.current.invalidateCache();

      // Vérifier que les fonctions d'invalidation sont disponibles
      expect(result.current.invalidatePracticeDataOnly).toBeDefined();
      expect(result.current.invalidatePrecisionDataOnly).toBeDefined();
      expect(result.current.invalidatePerformanceDataOnly).toBeDefined();
      expect(result.current.invalidateGamingLineChartDataOnly).toBeDefined();
    });
  });

  describe('useSongLearningModeTiles', () => {
    it("devrait récupérer les tuiles d'apprentissage", async () => {
      const mockData = {
        totalSessions: 10,
        averageAccuracy: 85,
        averagePerformance: 80,
        totalTimeInMinutes: 300,
        longestSessionInMinutes: 45,
        currentStreak: 5,
      };

      (getSongLearningModeTilesAction as any).mockResolvedValue({
        success: true,
        data: mockData,
      });

      const { result } = renderHook(() => useSongLearningModeTiles('song1'), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(result.current.data).toEqual({
        success: true,
        data: mockData,
      });
      expect(getSongLearningModeTilesAction).toHaveBeenCalledWith('song1');
    });
  });

  describe('useSongPlayModeTiles', () => {
    it('devrait récupérer les tuiles de jeu', async () => {
      const mockData = {
        totalSessions: 8,
        averageScore: 7500,
        bestScore: 10000,
        totalTimeInMinutes: 240,
        longestSessionInMinutes: 60,
        currentStreak: 2,
      };

      (getSongPlayModeTilesAction as any).mockResolvedValue({
        success: true,
        data: mockData,
      });

      const { result } = renderHook(() => useSongPlayModeTiles('song1'), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(result.current.data).toEqual({
        success: true,
        data: mockData,
      });
      expect(getSongPlayModeTilesAction).toHaveBeenCalledWith('song1');
    });
  });

  describe('useSongLearningPrecisionData', () => {
    it("devrait récupérer les données de précision d'apprentissage", async () => {
      const mockData = {
        data: [
          {
            session: "Aujourd'hui",
            precisionRightHand: 90,
            precisionLeftHand: null,
            precisionBothHands: null,
          },
        ],
        averagePrecisionRightHand: 90,
        averagePrecisionLeftHand: 85,
        averagePrecisionBothHands: 88,
        totalSessions: 5,
      };

      (getSongLearningPrecisionDataAction as any).mockResolvedValue({
        success: true,
        data: mockData,
      });

      const { result } = renderHook(
        () => useSongLearningPrecisionData('song1', 5, 0),
        {
          wrapper: createWrapper(),
        }
      );

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(result.current.data).toEqual({
        success: true,
        data: mockData,
      });
      expect(getSongLearningPrecisionDataAction).toHaveBeenCalledWith(
        'song1',
        5,
        0
      );
    });
  });

  describe('usePrefetchLearningPrecisionData', () => {
    it('devrait précharger les données de précision adjacentes', async () => {
      const { result } = renderHook(
        () => usePrefetchLearningPrecisionData('song1', 5, 1),
        {
          wrapper: createWrapper(),
        }
      );

      // Simuler le préchargement
      result.current.prefetchAdjacent();

      // Vérifier que les appels de préchargement ont été faits
      expect(getSongLearningPrecisionDataAction).toHaveBeenCalledWith(
        'song1',
        5,
        0
      ); // index précédent
      expect(getSongLearningPrecisionDataAction).toHaveBeenCalledWith(
        'song1',
        5,
        2
      ); // index suivant
    });
  });

  describe('useSongLearningPerformanceData', () => {
    it("devrait récupérer les données de performance d'apprentissage", async () => {
      const mockData = {
        data: [
          {
            session: "Aujourd'hui",
            performanceRightHand: 85,
            performanceLeftHand: null,
            performanceBothHands: null,
          },
        ],
        averagePerformanceRightHand: 85,
        averagePerformanceLeftHand: 80,
        averagePerformanceBothHands: 83,
        totalSessions: 5,
      };

      (getSongLearningPerformanceDataAction as any).mockResolvedValue({
        success: true,
        data: mockData,
      });

      const { result } = renderHook(
        () => useSongLearningPerformanceData('song1', 5, 0),
        {
          wrapper: createWrapper(),
        }
      );

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(result.current.data).toEqual({
        success: true,
        data: mockData,
      });
      expect(getSongLearningPerformanceDataAction).toHaveBeenCalledWith(
        'song1',
        5,
        0
      );
    });
  });

  describe('useSongPerformancePrecisionBarChartData', () => {
    it('devrait récupérer les données de bar chart précision/performance', async () => {
      const mockData = {
        label: 'Jan 2024 - Jun 2024',
        data: [
          {
            mois: 'Jan 2024',
            precision: 85,
            performance: 80,
          },
          {
            mois: 'Jun 2024',
            precision: 88,
            performance: 85,
          },
        ],
        totalIntervals: 2,
      };

      (getSongPerformancePrecisionBarChartDataAction as any).mockResolvedValue({
        success: true,
        data: mockData,
      });

      const { result } = renderHook(
        () => useSongPerformancePrecisionBarChartData('song1', 0),
        {
          wrapper: createWrapper(),
        }
      );

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(result.current.data).toEqual({
        success: true,
        data: mockData,
      });
      expect(
        getSongPerformancePrecisionBarChartDataAction
      ).toHaveBeenCalledWith('song1', 0);
    });
  });

  describe('useSongGamingLineChartData', () => {
    it('devrait récupérer les données de ligne de jeu', async () => {
      const mockData = {
        data: [
          {
            session: "Aujourd'hui",
            score: 8500,
            combo: 45,
            multi: 3.5,
          },
        ],
        averageScore: 8500,
        averageCombo: 45,
        averageMulti: 3.5,
        totalSessions: 3,
      };

      (getSongGamingLineChartDataAction as any).mockResolvedValue({
        success: true,
        data: mockData,
      });

      const { result } = renderHook(
        () => useSongGamingLineChartData('song1', 0, 7),
        {
          wrapper: createWrapper(),
        }
      );

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(result.current.data).toEqual({
        success: true,
        data: mockData,
      });
      expect(getSongGamingLineChartDataAction).toHaveBeenCalledWith(
        'song1',
        0,
        7
      );
    });
  });

  describe('useSongGamingBarChartData', () => {
    it('devrait récupérer les données de bar chart de jeu', async () => {
      const mockData = {
        label: 'Jan 2024 - Jun 2024',
        data: [
          {
            mois: 'Jan 2024',
            score: 8000,
            combo: 40,
            multi: 3.2,
          },
          {
            mois: 'Jun 2024',
            score: 8500,
            combo: 45,
            multi: 3.5,
          },
        ],
        totalIntervals: 2,
      };

      (getSongGamingBarChartDataAction as any).mockResolvedValue({
        success: true,
        data: mockData,
      });

      const { result } = renderHook(
        () => useSongGamingBarChartData('song1', 0),
        {
          wrapper: createWrapper(),
        }
      );

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(result.current.data).toEqual({
        success: true,
        data: mockData,
      });
      expect(getSongGamingBarChartDataAction).toHaveBeenCalledWith('song1', 0);
    });
  });
});
