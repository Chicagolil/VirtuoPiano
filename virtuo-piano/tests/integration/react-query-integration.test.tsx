import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import {
  useSongPerformanceGeneralTiles,
  useSongPracticeData,
  useSongLearningModeTiles,
  useSongPlayModeTiles,
  useSongTimelineRecordsData,
  useInvalidatePracticeCache,
  usePrefetchAdjacentData,
} from '@/customHooks/useSongPerformances';
import {
  getSongPerformanceGeneralTilesAction,
  getSongPracticeDataAction,
  getSongLearningModeTilesAction,
  getSongPlayModeTilesAction,
  getSongTimelineRecordsDataAction,
} from '@/lib/actions/songPerformances-actions';

// Mock des actions
vi.mock('@/lib/actions/songPerformances-actions', () => ({
  getSongPerformanceGeneralTilesAction: vi.fn(),
  getSongPracticeDataAction: vi.fn(),
  getSongLearningModeTilesAction: vi.fn(),
  getSongPlayModeTilesAction: vi.fn(),
  getSongTimelineRecordsDataAction: vi.fn(),
}));

// Composant de test pour les hooks
const TestComponent = ({
  songId,
  mode,
}: {
  songId: string;
  mode?: 'learning' | 'game';
}) => {
  const generalTiles = useSongPerformanceGeneralTiles(songId);
  const practiceData = useSongPracticeData(songId, 7, 0);
  const learningTiles = useSongLearningModeTiles(songId);
  const playTiles = useSongPlayModeTiles(songId);
  const timelineRecords = useSongTimelineRecordsData(
    songId,
    mode || 'learning'
  );
  const { invalidateCache } = useInvalidatePracticeCache();
  const { prefetchAdjacent } = usePrefetchAdjacentData(songId, 7, 1);

  return (
    <div>
      <div data-testid="general-tiles-loading">
        {generalTiles.isLoading ? 'Loading' : 'Loaded'}
      </div>
      <div data-testid="general-tiles-data">
        {generalTiles.data && generalTiles.data.success ? 'Data' : 'No Data'}
      </div>
      <div data-testid="practice-data-loading">
        {practiceData.isLoading ? 'Loading' : 'Loaded'}
      </div>
      <div data-testid="practice-data-data">
        {practiceData.data && practiceData.data.success ? 'Data' : 'No Data'}
      </div>
      <div data-testid="learning-tiles-loading">
        {learningTiles.isLoading ? 'Loading' : 'Loaded'}
      </div>
      <div data-testid="learning-tiles-data">
        {learningTiles.data && learningTiles.data.success ? 'Data' : 'No Data'}
      </div>
      <div data-testid="play-tiles-loading">
        {playTiles.isLoading ? 'Loading' : 'Loaded'}
      </div>
      <div data-testid="play-tiles-data">
        {playTiles.data && playTiles.data.success ? 'Data' : 'No Data'}
      </div>
      <div data-testid="timeline-loading">
        {timelineRecords.isLoading ? 'Loading' : 'Loaded'}
      </div>
      <div data-testid="timeline-data">
        {timelineRecords.data && timelineRecords.data.success
          ? 'Data'
          : 'No Data'}
      </div>
      <button
        onClick={() => invalidateCache(songId)}
        data-testid="invalidate-button"
      >
        Invalidate Cache
      </button>
      <button onClick={() => prefetchAdjacent()} data-testid="prefetch-button">
        Prefetch Adjacent
      </button>
    </div>
  );
};

// Wrapper pour les tests React Query
const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

describe('React Query Integration Tests', () => {
  const mockGeneralTilesData = {
    totalSessions: 5,
    totalTimeInMinutes: 120,
    currentStreak: 3,
    globalRanking: 2,
  };

  const mockPracticeData = {
    data: [
      { name: "Aujourd'hui", pratique: 30, modeJeu: 15, modeApprentissage: 15 },
    ],
    totalPratique: 30,
    totalModeJeu: 15,
    totalModeApprentissage: 15,
  };

  const mockLearningTilesData = {
    totalSessions: 10,
    averageAccuracy: 85,
    averagePerformance: 80,
    totalTimeInMinutes: 300,
    longestSessionInMinutes: 45,
    currentStreak: 5,
  };

  const mockPlayTilesData = {
    totalSessions: 8,
    averageScore: 7500,
    bestScore: 10000,
    totalTimeInMinutes: 240,
    longestSessionInMinutes: 60,
    currentStreak: 2,
  };

  const mockTimelineRecordsData = {
    records: [
      {
        id: 1,
        date: '2024-01-01T10:00:00Z',
        score: 90,
        type: 'accuracy_right',
        description: 'Meilleure précision main droite',
        details: 'Vous avez atteint 90% de précision avec votre main droite.',
      },
    ],
  };

  beforeEach(() => {
    vi.clearAllMocks();

    // Mock des actions avec des données de succès par défaut
    (getSongPerformanceGeneralTilesAction as any).mockResolvedValue({
      success: true,
      data: mockGeneralTilesData,
    });

    (getSongPracticeDataAction as any).mockResolvedValue({
      success: true,
      data: mockPracticeData,
    });

    (getSongLearningModeTilesAction as any).mockResolvedValue({
      success: true,
      data: mockLearningTilesData,
    });

    (getSongPlayModeTilesAction as any).mockResolvedValue({
      success: true,
      data: mockPlayTilesData,
    });

    (getSongTimelineRecordsDataAction as any).mockResolvedValue({
      success: true,
      data: mockTimelineRecordsData,
    });
  });

  it('devrait charger toutes les données avec succès', async () => {
    render(<TestComponent songId="song1" />, { wrapper: createWrapper() });

    // Vérifier l'état de chargement initial
    expect(screen.getByTestId('general-tiles-loading')).toHaveTextContent(
      'Loading'
    );
    expect(screen.getByTestId('practice-data-loading')).toHaveTextContent(
      'Loading'
    );
    expect(screen.getByTestId('learning-tiles-loading')).toHaveTextContent(
      'Loading'
    );
    expect(screen.getByTestId('play-tiles-loading')).toHaveTextContent(
      'Loading'
    );
    expect(screen.getByTestId('timeline-loading')).toHaveTextContent('Loading');

    // Attendre que toutes les données soient chargées
    await waitFor(() => {
      expect(screen.getByTestId('general-tiles-loading')).toHaveTextContent(
        'Loaded'
      );
      expect(screen.getByTestId('practice-data-loading')).toHaveTextContent(
        'Loaded'
      );
      expect(screen.getByTestId('learning-tiles-loading')).toHaveTextContent(
        'Loaded'
      );
      expect(screen.getByTestId('play-tiles-loading')).toHaveTextContent(
        'Loaded'
      );
      expect(screen.getByTestId('timeline-loading')).toHaveTextContent(
        'Loaded'
      );
    });

    // Vérifier que les données sont affichées
    expect(screen.getByTestId('general-tiles-data')).toHaveTextContent('Data');
    expect(screen.getByTestId('practice-data-data')).toHaveTextContent('Data');
    expect(screen.getByTestId('learning-tiles-data')).toHaveTextContent('Data');
    expect(screen.getByTestId('play-tiles-data')).toHaveTextContent('Data');
    expect(screen.getByTestId('timeline-data')).toHaveTextContent('Data');
  });

  it('devrait gérer les erreurs de chargement', async () => {
    // Reconfigurer le mock pour retourner une erreur
    (getSongPerformanceGeneralTilesAction as any).mockResolvedValue({
      success: false,
      error: 'Erreur de chargement',
    });

    render(<TestComponent songId="song1" />, { wrapper: createWrapper() });

    await waitFor(() => {
      expect(screen.getByTestId('general-tiles-loading')).toHaveTextContent(
        'Loaded'
      );
    });

    expect(screen.getByTestId('general-tiles-data')).toHaveTextContent(
      'No Data'
    );
  });

  it('devrait gérer les erreurs de réseau', async () => {
    // Reconfigurer le mock pour retourner une erreur
    (getSongPerformanceGeneralTilesAction as any).mockRejectedValue(
      new Error('Erreur réseau')
    );

    render(<TestComponent songId="song1" />, { wrapper: createWrapper() });

    await waitFor(() => {
      expect(screen.getByTestId('general-tiles-loading')).toHaveTextContent(
        'Loaded'
      );
    });

    expect(screen.getByTestId('general-tiles-data')).toHaveTextContent(
      'No Data'
    );
  });

  it('devrait invalider le cache correctement', async () => {
    render(<TestComponent songId="song1" />, { wrapper: createWrapper() });

    // Attendre que les données soient chargées
    await waitFor(() => {
      expect(screen.getByTestId('general-tiles-data')).toHaveTextContent(
        'Data'
      );
    });

    // Cliquer sur le bouton d'invalidation
    const invalidateButton = screen.getByTestId('invalidate-button');
    fireEvent.click(invalidateButton);

    // Vérifier que les actions sont appelées pour l'invalidation
    await waitFor(() => {
      expect(getSongPerformanceGeneralTilesAction).toHaveBeenCalled();
    });
  });

  it('devrait précharger les données adjacentes', async () => {
    render(<TestComponent songId="song1" />, { wrapper: createWrapper() });

    // Attendre que les données soient chargées
    await waitFor(() => {
      expect(screen.getByTestId('practice-data-data')).toHaveTextContent(
        'Data'
      );
    });

    // Cliquer sur le bouton de préchargement
    const prefetchButton = screen.getByTestId('prefetch-button');
    fireEvent.click(prefetchButton);

    // Vérifier que les actions de préchargement sont appelées
    await waitFor(() => {
      expect(getSongPracticeDataAction).toHaveBeenCalledWith('song1', 7, 0); // index précédent
      expect(getSongPracticeDataAction).toHaveBeenCalledWith('song1', 7, 2); // index suivant
    });
  });

  it('devrait gérer les requêtes avec des songId vides', () => {
    // Reconfigurer les mocks pour retourner des données vides
    (getSongPerformanceGeneralTilesAction as any).mockResolvedValue({
      success: true,
      data: null,
    });

    render(<TestComponent songId="" />, { wrapper: createWrapper() });

    // Vérifier que les requêtes ne sont pas exécutées
    expect(screen.getByTestId('general-tiles-loading')).toHaveTextContent(
      'Loaded'
    );
    expect(screen.getByTestId('general-tiles-data')).toHaveTextContent(
      'No Data'
    );
  });

  it('devrait gérer les différents modes pour les records timeline', async () => {
    render(<TestComponent songId="song1" mode="game" />, {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(screen.getByTestId('timeline-loading')).toHaveTextContent(
        'Loaded'
      );
      expect(screen.getByTestId('timeline-data')).toHaveTextContent('Data');
    });

    expect(getSongTimelineRecordsDataAction).toHaveBeenCalledWith(
      'song1',
      'game'
    );
  });

  it('devrait utiliser le cache pour les requêtes répétées', async () => {
    const { rerender } = render(<TestComponent songId="song1" />, {
      wrapper: createWrapper(),
    });

    // Attendre que les données soient chargées
    await waitFor(() => {
      expect(screen.getByTestId('general-tiles-data')).toHaveTextContent(
        'Data'
      );
    });

    // Re-rendre le composant avec le même songId
    rerender(<TestComponent songId="song1" />);

    // Vérifier que les données sont immédiatement disponibles (cache)
    expect(screen.getByTestId('general-tiles-data')).toHaveTextContent('Data');
  });

  it('devrait gérer les requêtes concurrentes', async () => {
    render(<TestComponent songId="song1" />, { wrapper: createWrapper() });

    // Vérifier que toutes les requêtes sont lancées simultanément
    await waitFor(() => {
      expect(getSongPerformanceGeneralTilesAction).toHaveBeenCalledWith(
        'song1'
      );
      expect(getSongPracticeDataAction).toHaveBeenCalledWith('song1', 7, 0);
      expect(getSongLearningModeTilesAction).toHaveBeenCalledWith('song1');
      expect(getSongPlayModeTilesAction).toHaveBeenCalledWith('song1');
      expect(getSongTimelineRecordsDataAction).toHaveBeenCalledWith(
        'song1',
        'learning'
      );
    });
  });

  it('devrait gérer les timeouts de requête', async () => {
    // Simuler un timeout en ne résolvant jamais la promesse
    (getSongPerformanceGeneralTilesAction as any).mockImplementation(
      () => new Promise(() => {})
    );

    render(<TestComponent songId="song1" />, { wrapper: createWrapper() });

    // Vérifier que le composant gère le timeout
    await waitFor(
      () => {
        expect(screen.getByTestId('general-tiles-loading')).toHaveTextContent(
          'Loading'
        );
      },
      { timeout: 1000 }
    );
  });

  it('devrait gérer les données vides', async () => {
    // Reconfigurer le mock pour retourner des données vides
    (getSongPerformanceGeneralTilesAction as any).mockResolvedValue({
      success: false,
      data: null,
    });

    render(<TestComponent songId="song1" />, { wrapper: createWrapper() });

    await waitFor(() => {
      expect(screen.getByTestId('general-tiles-loading')).toHaveTextContent(
        'Loaded'
      );
    });

    expect(screen.getByTestId('general-tiles-data')).toHaveTextContent(
      'No Data'
    );
  });

  it('devrait gérer les requêtes avec des paramètres différents', async () => {
    render(<TestComponent songId="song2" />, { wrapper: createWrapper() });

    await waitFor(() => {
      expect(getSongPerformanceGeneralTilesAction).toHaveBeenCalledWith(
        'song2'
      );
      expect(getSongPracticeDataAction).toHaveBeenCalledWith('song2', 7, 0);
      expect(getSongLearningModeTilesAction).toHaveBeenCalledWith('song2');
      expect(getSongPlayModeTilesAction).toHaveBeenCalledWith('song2');
    });
  });
});
