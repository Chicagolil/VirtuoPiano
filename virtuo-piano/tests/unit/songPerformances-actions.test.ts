import { describe, it, expect, beforeEach, vi } from 'vitest';
import {
  getSongPerformanceGeneralTilesAction,
  getSongPracticeDataAction,
  getSongLearningModeTilesAction,
  getSongPlayModeTilesAction,
  getSongLearningPrecisionDataAction,
  getSongLearningPerformanceDataAction,
  getSongPerformancePrecisionBarChartDataAction,
  getSongGamingLineChartDataAction,
  getSongGamingBarChartDataAction,
  getSongTimelineRecordsDataAction,
} from '@/lib/actions/songPerformances-actions';
import { PerformancesServices } from '@/lib/services/performances-services';
import { getAuthenticatedUser } from '@/lib/auth/get-authenticated-user';

// Mock des dépendances
vi.mock('@/lib/services/performances-services');
vi.mock('@/lib/auth/get-authenticated-user');

describe('SongPerformances Actions', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('getSongPerformanceGeneralTilesAction', () => {
    it('devrait retourner les données générales avec succès', async () => {
      const mockUser = { id: 'user1' };
      const mockData = {
        totalSessions: 5,
        totalTimeInMinutes: 120,
        currentStreak: 3,
        globalRanking: 2,
      };

      (getAuthenticatedUser as any).mockResolvedValue(mockUser);
      (
        PerformancesServices.getSongPerformanceGeneralTilesData as any
      ).mockResolvedValue(mockData);

      const result = await getSongPerformanceGeneralTilesAction('song1');

      expect(result).toEqual({
        success: true,
        data: mockData,
      });
      expect(
        PerformancesServices.getSongPerformanceGeneralTilesData
      ).toHaveBeenCalledWith('song1', 'user1');
    });

    it('devrait gérer les erreurs', async () => {
      (getAuthenticatedUser as any).mockRejectedValue(
        new Error("Erreur d'authentification")
      );

      const result = await getSongPerformanceGeneralTilesAction('song1');

      expect(result).toEqual({
        success: false,
        error: 'Erreur lors de la récupération des données',
      });
    });
  });

  describe('getSongPracticeDataAction', () => {
    it('devrait retourner les données de pratique avec succès', async () => {
      const mockUser = { id: 'user1' };
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

      (getAuthenticatedUser as any).mockResolvedValue(mockUser);
      (PerformancesServices.getSongPracticeData as any).mockResolvedValue(
        mockData
      );

      const result = await getSongPracticeDataAction('song1', 7, 0);

      expect(result).toEqual({
        success: true,
        data: mockData,
      });
      expect(PerformancesServices.getSongPracticeData).toHaveBeenCalledWith(
        'song1',
        'user1',
        7,
        0
      );
    });
  });

  describe('getSongLearningModeTilesAction', () => {
    it("devrait retourner les tuiles d'apprentissage avec succès", async () => {
      const mockUser = { id: 'user1' };
      const mockData = {
        totalSessions: 10,
        averageAccuracy: 85,
        averagePerformance: 80,
        totalTimeInMinutes: 300,
        longestSessionInMinutes: 45,
        currentStreak: 5,
      };

      (getAuthenticatedUser as any).mockResolvedValue(mockUser);
      (
        PerformancesServices.getSongLearningModeTilesData as any
      ).mockResolvedValue(mockData);

      const result = await getSongLearningModeTilesAction('song1');

      expect(result).toEqual({
        success: true,
        data: mockData,
      });
      expect(
        PerformancesServices.getSongLearningModeTilesData
      ).toHaveBeenCalledWith('song1', 'user1');
    });
  });

  describe('getSongPlayModeTilesAction', () => {
    it('devrait retourner les tuiles de jeu avec succès', async () => {
      const mockUser = { id: 'user1' };
      const mockData = {
        totalSessions: 8,
        averageScore: 7500,
        bestScore: 10000,
        totalTimeInMinutes: 240,
        longestSessionInMinutes: 60,
        currentStreak: 2,
      };

      (getAuthenticatedUser as any).mockResolvedValue(mockUser);
      (PerformancesServices.getSongPlayModeTilesData as any).mockResolvedValue(
        mockData
      );

      const result = await getSongPlayModeTilesAction('song1');

      expect(result).toEqual({
        success: true,
        data: mockData,
      });
      expect(
        PerformancesServices.getSongPlayModeTilesData
      ).toHaveBeenCalledWith('song1', 'user1');
    });
  });

  describe('getSongLearningPrecisionDataAction', () => {
    it('devrait retourner les données de précision avec succès', async () => {
      const mockUser = { id: 'user1' };
      const mockData = {
        data: [
          {
            session: "Aujourd'hui",
            precisionRightHand: 90,
            precisionLeftHand: 85,
            precisionBothHands: 88,
          },
        ],
        averagePrecisionRightHand: 90,
        averagePrecisionLeftHand: 85,
        averagePrecisionBothHands: 88,
        totalSessions: 5,
      };

      (getAuthenticatedUser as any).mockResolvedValue(mockUser);
      (
        PerformancesServices.getSongLearningPrecisionData as any
      ).mockResolvedValue(mockData);

      const result = await getSongLearningPrecisionDataAction('song1', 5, 0);

      expect(result).toEqual({
        success: true,
        data: mockData,
      });
      expect(
        PerformancesServices.getSongLearningPrecisionData
      ).toHaveBeenCalledWith('song1', 'user1', 5, 0);
    });
  });

  describe('getSongLearningPerformanceDataAction', () => {
    it('devrait retourner les données de performance avec succès', async () => {
      const mockUser = { id: 'user1' };
      const mockData = {
        data: [
          {
            session: "Aujourd'hui",
            performanceRightHand: 85,
            performanceLeftHand: 80,
            performanceBothHands: 83,
          },
        ],
        totalSessions: 5,
        averagePerformanceRightHand: 85,
        averagePerformanceLeftHand: 80,
        averagePerformanceBothHands: 83,
      };

      (getAuthenticatedUser as any).mockResolvedValue(mockUser);
      (
        PerformancesServices.getSongLearningPerformanceData as any
      ).mockResolvedValue(mockData);

      const result = await getSongLearningPerformanceDataAction('song1', 5, 0);

      expect(result).toEqual({
        success: true,
        data: mockData,
      });
      expect(
        PerformancesServices.getSongLearningPerformanceData
      ).toHaveBeenCalledWith('song1', 'user1', 5, 0);
    });
  });

  describe('getSongPerformancePrecisionBarChartDataAction', () => {
    it('devrait retourner les données de bar chart précision/performance avec succès', async () => {
      const mockUser = { id: 'user1' };
      const mockData = {
        label: 'Jan 2024 - Jun 2024',
        data: [
          { mois: 'Jan 2024', precision: 85, performance: 80 },
          { mois: 'Feb 2024', precision: 88, performance: 83 },
        ],
        totalIntervals: 2,
      };

      (getAuthenticatedUser as any).mockResolvedValue(mockUser);
      (
        PerformancesServices.getSongPerformancePrecisionBarChartData as any
      ).mockResolvedValue(mockData);

      const result = await getSongPerformancePrecisionBarChartDataAction(
        'song1',
        0
      );

      expect(result).toEqual({
        success: true,
        data: mockData,
      });
      expect(
        PerformancesServices.getSongPerformancePrecisionBarChartData
      ).toHaveBeenCalledWith('song1', 'user1', 0);
    });
  });

  describe('getSongGamingLineChartDataAction', () => {
    it('devrait retourner les données de ligne de jeu avec succès', async () => {
      const mockUser = { id: 'user1' };
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

      (getAuthenticatedUser as any).mockResolvedValue(mockUser);
      (
        PerformancesServices.getSongGamingLineChartData as any
      ).mockResolvedValue(mockData);

      const result = await getSongGamingLineChartDataAction('song1', 0, 5);

      expect(result).toEqual({
        success: true,
        data: mockData,
      });
      expect(
        PerformancesServices.getSongGamingLineChartData
      ).toHaveBeenCalledWith('song1', 'user1', 0, 5);
    });
  });

  describe('getSongGamingBarChartDataAction', () => {
    it('devrait retourner les données de bar chart de jeu avec succès', async () => {
      const mockUser = { id: 'user1' };
      const mockData = {
        label: 'Jan 2024 - Jun 2024',
        data: [
          { mois: 'Jan 2024', score: 8000, combo: 40, multi: 3.2 },
          { mois: 'Feb 2024', score: 8500, combo: 45, multi: 3.5 },
        ],
        totalIntervals: 2,
      };

      (getAuthenticatedUser as any).mockResolvedValue(mockUser);
      (PerformancesServices.getSongGamingBarChartData as any).mockResolvedValue(
        mockData
      );

      const result = await getSongGamingBarChartDataAction('song1', 0);

      expect(result).toEqual({
        success: true,
        data: mockData,
      });
      expect(
        PerformancesServices.getSongGamingBarChartData
      ).toHaveBeenCalledWith('song1', 'user1', 0);
    });
  });

  describe('getSongTimelineRecordsDataAction', () => {
    it('devrait retourner les records timeline pour le mode apprentissage', async () => {
      const mockUser = { id: 'user1' };
      const mockData = {
        records: [
          {
            id: 1,
            date: '2024-01-01T10:00:00Z',
            score: 90,
            type: 'accuracy_right',
            description: 'Meilleure précision main droite',
            details:
              'Vous avez atteint 90% de précision avec votre main droite.',
          },
        ],
      };

      (getAuthenticatedUser as any).mockResolvedValue(mockUser);
      (
        PerformancesServices.getSongTimelineRecordsData as any
      ).mockResolvedValue(mockData);

      const result = await getSongTimelineRecordsDataAction(
        'song1',
        'learning'
      );

      expect(result).toEqual({
        success: true,
        data: mockData,
      });
      expect(
        PerformancesServices.getSongTimelineRecordsData
      ).toHaveBeenCalledWith('song1', 'user1', 'learning');
    });

    it('devrait retourner les records timeline pour le mode jeu', async () => {
      const mockUser = { id: 'user1' };
      const mockData = {
        records: [
          {
            id: 1,
            date: '2024-01-01T10:00:00Z',
            score: 10000,
            type: 'score',
            description: 'Meilleur score',
            details: 'Vous avez obtenu 10,000 points.',
          },
        ],
      };

      (getAuthenticatedUser as any).mockResolvedValue(mockUser);
      (
        PerformancesServices.getSongTimelineRecordsData as any
      ).mockResolvedValue(mockData);

      const result = await getSongTimelineRecordsDataAction('song1', 'game');

      expect(result).toEqual({
        success: true,
        data: mockData,
      });
      expect(
        PerformancesServices.getSongTimelineRecordsData
      ).toHaveBeenCalledWith('song1', 'user1', 'game');
    });
  });
});
