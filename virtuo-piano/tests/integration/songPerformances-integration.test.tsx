import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import SongPerformances from '@/features/performances/SongPerformances';
import {
  getSongPerformanceGeneralTilesAction,
  getSongLearningModeTilesAction,
  getSongPlayModeTilesAction,
  getSongPracticeDataAction,
  getSongLearningPrecisionDataAction,
  getSongLearningPerformanceDataAction,
  getSongPerformancePrecisionBarChartDataAction,
  getSongGamingLineChartDataAction,
  getSongGamingBarChartDataAction,
  getSongTimelineRecordsDataAction,
} from '@/lib/actions/songPerformances-actions';

// Mock des actions
vi.mock('@/lib/actions/songPerformances-actions', () => ({
  getSongPerformanceGeneralTilesAction: vi.fn(),
  getSongLearningModeTilesAction: vi.fn(),
  getSongPlayModeTilesAction: vi.fn(),
  getSongPracticeDataAction: vi.fn(),
  getSongLearningPrecisionDataAction: vi.fn(),
  getSongLearningPerformanceDataAction: vi.fn(),
  getSongPerformancePrecisionBarChartDataAction: vi.fn(),
  getSongGamingLineChartDataAction: vi.fn(),
  getSongGamingBarChartDataAction: vi.fn(),
  getSongTimelineRecordsDataAction: vi.fn(),
}));

// Mock de next/navigation
vi.mock('next/navigation', () => ({
  useRouter: vi.fn(),
}));

// Mock du contexte SongContext
const mockSetCurrentSong = vi.fn();
vi.mock('@/contexts/SongContext', () => ({
  useSong: vi.fn(() => ({
    setCurrentSong: mockSetCurrentSong,
  })),
}));

// Mock des actions de favoris
vi.mock('@/lib/actions/favorites', () => ({
  toggleFavoriteAction: vi.fn(),
}));

const mockSong = {
  id: 'song1',
  title: 'Test Song',
  composer: 'Test Composer',
  genre: 'Classical',
  Level: 3,
  duration_ms: 180000, // 3 minutes en millisecondes
  tempo: 120,
  imageUrl: 'https://example.com/image.jpg',
  isFavorite: false,
};

const mockData = {
  totalSessions: 5,
  totalTimeInMinutes: 120,
  currentStreak: 3,
  globalRanking: 2,
};

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

describe('SongPerformances Integration', () => {
  beforeEach(() => {
    vi.clearAllMocks();

    // Mock par défaut des actions
    (getSongPerformanceGeneralTilesAction as any).mockResolvedValue({
      success: true,
      data: mockData,
    });
    (getSongLearningModeTilesAction as any).mockResolvedValue({
      success: true,
      data: mockData,
    });
    (getSongPlayModeTilesAction as any).mockResolvedValue({
      success: true,
      data: mockData,
    });
    (getSongPracticeDataAction as any).mockResolvedValue({
      success: true,
      data: {
        data: [],
        totalPratique: 60,
        totalModeJeu: 30,
        totalModeApprentissage: 30,
      },
    });
    (getSongLearningPrecisionDataAction as any).mockResolvedValue({
      success: true,
      data: {
        data: [],
        averagePrecisionRightHand: 85,
        averagePrecisionLeftHand: 90,
        totalSessions: 2,
      },
    });
    (getSongLearningPerformanceDataAction as any).mockResolvedValue({
      success: true,
      data: {
        data: [],
        averagePerformanceRightHand: 80,
        averagePerformanceLeftHand: 85,
        totalSessions: 2,
      },
    });
    (getSongPerformancePrecisionBarChartDataAction as any).mockResolvedValue({
      success: true,
      data: { data: [] },
    });
    (getSongGamingLineChartDataAction as any).mockResolvedValue({
      success: true,
      data: { data: [] },
    });
    (getSongGamingBarChartDataAction as any).mockResolvedValue({
      success: true,
      data: { data: [] },
    });
    (getSongTimelineRecordsDataAction as any).mockResolvedValue({
      success: true,
      data: { records: [] },
    });
  });

  it('devrait charger et afficher les données de performance', async () => {
    render(<SongPerformances song={mockSong} />, { wrapper: createWrapper() });

    // Vérifier que le composant se rend correctement
    expect(screen.getByText('Test Song')).toBeInTheDocument();
    expect(screen.getByText('Test Composer')).toBeInTheDocument();
  });

  it('devrait gérer la navigation de retour', async () => {
    const mockRouter = {
      push: vi.fn(),
      back: vi.fn(),
      forward: vi.fn(),
      refresh: vi.fn(),
      replace: vi.fn(),
      prefetch: vi.fn(),
    };
    const mockUseRouter = vi.mocked(useRouter);
    mockUseRouter.mockReturnValue(mockRouter);

    render(<SongPerformances song={mockSong} />, { wrapper: createWrapper() });

    const backButton = screen.getByText('Retour aux chansons jouées');
    fireEvent.click(backButton);

    expect(mockRouter.push).toHaveBeenCalledWith(
      '/performances?tab=playedSongs'
    );
  });

  it('devrait afficher les informations de la chanson correctement', () => {
    render(<SongPerformances song={mockSong} />, { wrapper: createWrapper() });

    expect(screen.getByText('Test Song')).toBeInTheDocument();
    expect(screen.getByText('Test Composer')).toBeInTheDocument();
    expect(screen.getByText('120 BPM')).toBeInTheDocument();
    expect(screen.getByText('Classical')).toBeInTheDocument();
    expect(screen.getByText('3:00')).toBeInTheDocument(); // Format correct
  });

  it('devrait gérer les chansons sans image', () => {
    const songWithoutImage = { ...mockSong, imageUrl: null };
    render(<SongPerformances song={songWithoutImage} />, {
      wrapper: createWrapper(),
    });

    // Chercher l'icône de musique par sa classe CSS
    const musicIcon = screen.getByTestId('music-icon');
    expect(musicIcon).toBeInTheDocument();
  });

  it('devrait gérer les chansons favorites', () => {
    const favoriteSong = { ...mockSong, isFavorite: true };
    render(<SongPerformances song={favoriteSong} />, {
      wrapper: createWrapper(),
    });

    // Chercher le bouton favori par sa classe CSS
    const favoriteButtons = screen.getAllByRole('button');
    const favoriteButton = favoriteButtons.find((button) =>
      button.className.includes('_favoriteActive_b4e1c5')
    );
    expect(favoriteButton).toBeInTheDocument();
    expect(favoriteButton).toHaveClass('_favoriteActive_b4e1c5');
  });

  it('devrait gérer les chansons sans compositeur', () => {
    const songWithoutComposer = { ...mockSong, composer: null };
    render(<SongPerformances song={songWithoutComposer} />, {
      wrapper: createWrapper(),
    });

    expect(screen.getByText('Compositeur inconnu')).toBeInTheDocument();
  });

  it('devrait gérer les chansons sans genre', () => {
    const songWithoutGenre = { ...mockSong, genre: null };
    render(<SongPerformances song={songWithoutGenre} />, {
      wrapper: createWrapper(),
    });

    expect(screen.getByText('Non spécifié')).toBeInTheDocument();
  });

  it('devrait mettre à jour le contexte avec la chanson', () => {
    render(<SongPerformances song={mockSong} />, { wrapper: createWrapper() });

    expect(mockSetCurrentSong).toHaveBeenCalledWith(mockSong);
  });

  it('devrait nettoyer le contexte lors du démontage', () => {
    const { unmount } = render(<SongPerformances song={mockSong} />, {
      wrapper: createWrapper(),
    });

    unmount();

    expect(mockSetCurrentSong).toHaveBeenCalledWith(null);
  });

  it('devrait gérer les erreurs de réseau', async () => {
    (getSongPerformanceGeneralTilesAction as any).mockRejectedValue(
      new Error('Erreur réseau')
    );

    render(<SongPerformances song={mockSong} />, { wrapper: createWrapper() });

    // Le composant se rend même avec des erreurs
    expect(screen.getByText('Test Song')).toBeInTheDocument();
  });

  it('devrait gérer les données vides', async () => {
    (getSongPerformanceGeneralTilesAction as any).mockResolvedValue({
      success: true,
      data: {
        totalSessions: 0,
        totalTimeInMinutes: 0,
        currentStreak: 0,
        globalRanking: null,
      },
    });

    render(<SongPerformances song={mockSong} />, { wrapper: createWrapper() });

    // Le composant se rend même avec des données vides
    expect(screen.getByText('Test Song')).toBeInTheDocument();
  });
});
