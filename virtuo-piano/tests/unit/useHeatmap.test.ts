import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act, waitFor } from '@testing-library/react';
import { useHeatmap } from '@/customHooks/useHeatmap';
import {
  getHeatmapData,
  getSessionsByDate,
} from '@/lib/actions/heatmap-actions';

// Mock des actions
vi.mock('@/lib/actions/heatmap-actions');
const mockGetHeatmapData = vi.mocked(getHeatmapData);
const mockGetSessionsByDate = vi.mocked(getSessionsByDate);

// Mock console.error pour éviter les messages dans les tests
const originalConsoleError = console.error;
beforeEach(() => {
  console.error = vi.fn();
});

afterEach(() => {
  console.error = originalConsoleError;
});

describe('useHeatmap Hook', () => {
  const mockHeatmapData = [
    { date: new Date('2025-01-15'), durationInMinutes: 30 },
    { date: new Date('2025-01-16'), durationInMinutes: 45 },
    { date: new Date('2025-01-15'), durationInMinutes: 20 }, // Même jour, doit être agrégé
  ];

  const mockSessionData = [
    {
      id: '1',
      songTitle: 'Test Song',
      songComposer: 'Test Composer',
      correctNotes: 85,
      missedNotes: 5,
      wrongNotes: 10,
      totalPoints: 1250,
      maxMultiplier: 3,
      maxCombo: 15,
      sessionStartTime: new Date('2025-01-15T10:00:00'),
      sessionEndTime: new Date('2025-01-15T10:30:00'),
      modeName: 'Apprentissage',
      durationInMinutes: 30,
      accuracy: 85,
      performance: 90,
    },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
    mockGetHeatmapData.mockResolvedValue({
      success: true,
      data: mockHeatmapData,
    });
    mockGetSessionsByDate.mockResolvedValue({
      success: true,
      data: mockSessionData,
    });
  });

  it('should initialize with default values', () => {
    const { result } = renderHook(() => useHeatmap());

    expect(result.current.loading).toBe(true);
    expect(result.current.selectedYear).toBe(2025);
    expect(result.current.selectedDate).toBe('');
    expect(result.current.sessions).toEqual([]);
    expect(result.current.sessionsLoading).toBe(false);
    expect(result.current.isExpanded).toBe(false);
    expect(result.current.isClosing).toBe(false);
    expect(result.current.colorTheme).toBe('green');
    expect(result.current.monthLabels).toEqual([]);
    expect(result.current.totalContributions).toBe(0);
  });

  it('should load heatmap data on mount', async () => {
    const { result } = renderHook(() => useHeatmap());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(mockGetHeatmapData).toHaveBeenCalledWith(2025);
    expect(result.current.data).toBeDefined();
    expect(result.current.monthLabels).toBeDefined();
    expect(result.current.totalContributions).toBeGreaterThan(0);
  });

  it('should handle year change', async () => {
    const { result } = renderHook(() => useHeatmap());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    act(() => {
      result.current.setSelectedYear(2024);
    });

    await waitFor(() => {
      expect(mockGetHeatmapData).toHaveBeenCalledWith(2024);
    });
  });

  it('should handle color theme change', () => {
    const { result } = renderHook(() => useHeatmap());

    act(() => {
      result.current.setColorTheme('orange');
    });

    expect(result.current.colorTheme).toBe('orange');
  });

  it('should handle cell click and load sessions', async () => {
    const { result } = renderHook(() => useHeatmap());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    const testDate = new Date('2025-01-15');
    const testCount = 50;

    act(() => {
      result.current.handleCellClick(testDate, testCount);
    });

    await waitFor(() => {
      expect(result.current.sessionsLoading).toBe(false);
      expect(result.current.selectedDate).toBe('2025-01-15');
      expect(result.current.isExpanded).toBe(true);
      expect(result.current.sessions).toEqual(mockSessionData);
    });

    expect(mockGetSessionsByDate).toHaveBeenCalledWith('2025-01-15');
  });

  it('should not handle cell click when count is 0', async () => {
    const { result } = renderHook(() => useHeatmap());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    const testDate = new Date('2025-01-15');
    const testCount = 0;

    act(() => {
      result.current.handleCellClick(testDate, testCount);
    });

    expect(mockGetSessionsByDate).not.toHaveBeenCalled();
    expect(result.current.selectedDate).toBe('');
  });

  it('should handle close sessions', async () => {
    const { result } = renderHook(() => useHeatmap());

    // D'abord ouvrir des sessions
    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    const testDate = new Date('2025-01-15');
    act(() => {
      result.current.handleCellClick(testDate, 50);
    });

    await waitFor(() => {
      expect(result.current.isExpanded).toBe(true);
    });

    // Puis les fermer
    act(() => {
      result.current.closeSessions();
    });

    expect(result.current.isClosing).toBe(true);

    // Attendre que l'animation de fermeture se termine
    await waitFor(
      () => {
        expect(result.current.isExpanded).toBe(false);
        expect(result.current.selectedDate).toBe('');
        expect(result.current.sessions).toEqual([]);
        expect(result.current.isClosing).toBe(false);
      },
      { timeout: 400 }
    );
  });

  it('should handle heatmap data loading error', async () => {
    mockGetHeatmapData.mockResolvedValue({
      success: false,
      data: [],
      error: 'Test error',
    });

    const { result } = renderHook(() => useHeatmap());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.data).toEqual([]);
    expect(result.current.monthLabels).toEqual([]);
    expect(result.current.totalContributions).toBe(0);
  });

  it('should handle sessions loading error', async () => {
    const { result } = renderHook(() => useHeatmap());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    mockGetSessionsByDate.mockResolvedValue({
      success: false,
      data: [],
      error: 'Test error',
    });

    const testDate = new Date('2025-01-15');
    act(() => {
      result.current.handleCellClick(testDate, 50);
    });

    await waitFor(() => {
      expect(result.current.sessionsLoading).toBe(false);
      expect(result.current.sessions).toEqual([]);
    });
  });

  it('should handle network error during heatmap data loading', async () => {
    mockGetHeatmapData.mockRejectedValue(new Error('Network error'));

    const { result } = renderHook(() => useHeatmap());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.data).toEqual([]);
    expect(result.current.monthLabels).toEqual([]);
    expect(result.current.totalContributions).toBe(0);
  });

  it('should handle network error during sessions loading', async () => {
    const { result } = renderHook(() => useHeatmap());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    mockGetSessionsByDate.mockRejectedValue(new Error('Network error'));

    const testDate = new Date('2025-01-15');
    act(() => {
      result.current.handleCellClick(testDate, 50);
    });

    await waitFor(() => {
      expect(result.current.sessionsLoading).toBe(false);
      expect(result.current.sessions).toEqual([]);
    });
  });

  it('should calculate total contributions correctly', async () => {
    const { result } = renderHook(() => useHeatmap());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    // Les données mockées contiennent 30 + 45 + 20 = 95 minutes
    expect(result.current.totalContributions).toBe(95);
  });

  it('should handle empty heatmap data', async () => {
    mockGetHeatmapData.mockResolvedValue({
      success: true,
      data: [],
    });

    const { result } = renderHook(() => useHeatmap());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.totalContributions).toBe(0);
  });

  it('should validate year selection', async () => {
    const { result } = renderHook(() => useHeatmap());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    // Tester avec une année invalide
    act(() => {
      result.current.setSelectedYear(2020);
    });

    // L'année ne devrait pas changer car 2020 n'est pas dans HEATMAP_YEARS
    expect(result.current.selectedYear).toBe(2025);
  });

  it('should handle multiple rapid year changes', async () => {
    const { result } = renderHook(() => useHeatmap());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    // Changer rapidement d'année plusieurs fois
    act(() => {
      result.current.setSelectedYear(2024);
    });

    act(() => {
      result.current.setSelectedYear(2023);
    });

    act(() => {
      result.current.setSelectedYear(2025);
    });

    // Vérifier que les appels API ont été faits
    expect(mockGetHeatmapData).toHaveBeenCalledWith(2024);
    expect(mockGetHeatmapData).toHaveBeenCalledWith(2023);
    expect(mockGetHeatmapData).toHaveBeenCalledWith(2025);
  });

  it('should maintain state consistency during interactions', async () => {
    const { result } = renderHook(() => useHeatmap());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    // Tester une séquence d'interactions
    act(() => {
      result.current.setColorTheme('orange');
    });

    const testDate = new Date('2025-01-15');
    act(() => {
      result.current.handleCellClick(testDate, 50);
    });

    await waitFor(() => {
      expect(result.current.isExpanded).toBe(true);
    });

    act(() => {
      result.current.closeSessions();
    });

    // Vérifier que l'état reste cohérent
    expect(result.current.colorTheme).toBe('orange');
    expect(result.current.selectedYear).toBe(2025);
  });
});
