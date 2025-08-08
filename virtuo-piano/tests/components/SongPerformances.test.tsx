import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import SongPerformances from '@/features/performances/SongPerformances';
import { IconHeart, IconChevronRight } from '@tabler/icons-react';
import { useSong } from '@/contexts/SongContext';
import { useRouter } from 'next/navigation';
import { toggleFavorite } from '@/lib/actions/songs';
import { toast } from 'react-hot-toast';

// Mock des hooks
vi.mock('@/customHooks/useSongPerformances', () => ({
  useSongPerformanceGeneralTiles: vi.fn(),
  useSongPracticeData: vi.fn(),
  useSongLearningModeTiles: vi.fn(),
  useSongPlayModeTiles: vi.fn(),
  useSongTimelineRecordsData: vi.fn(),
}));

// Mock des composants
vi.mock('@/features/performances/components/GeneralTiles', () => ({
  default: ({ songId }: { songId: string }) => (
    <div data-testid="general-tiles">General Tiles for {songId}</div>
  ),
}));

vi.mock('@/features/performances/components/PracticeGraph', () => ({
  default: ({ songId }: { songId: string }) => (
    <div data-testid="practice-graph">Practice Graph for {songId}</div>
  ),
}));

vi.mock('@/features/performances/components/LearningTiles', () => ({
  default: ({ songId }: { songId: string }) => (
    <div data-testid="learning-tiles">Learning Tiles for {songId}</div>
  ),
}));

vi.mock('@/features/performances/components/GamingTiles', () => ({
  default: ({ songId }: { songId: string }) => (
    <div data-testid="gaming-tiles">Gaming Tiles for {songId}</div>
  ),
}));

vi.mock('@/features/performances/components/PrecisionChart', () => ({
  default: ({ songId }: { songId: string }) => (
    <div data-testid="precision-chart">Precision Chart for {songId}</div>
  ),
}));

vi.mock('@/features/performances/components/PerformanceChart', () => ({
  default: ({ songId }: { songId: string }) => (
    <div data-testid="performance-chart">Performance Chart for {songId}</div>
  ),
}));

vi.mock(
  '@/features/performances/components/PerformancePrecisionBarChart',
  () => ({
    default: ({ songId }: { songId: string }) => (
      <div data-testid="performance-precision-bar-chart">
        Performance Precision Bar Chart for {songId}
      </div>
    ),
  })
);

vi.mock('@/features/performances/components/GamingLineChart', () => ({
  default: ({ songId }: { songId: string }) => (
    <div data-testid="gaming-line-chart">Gaming Line Chart for {songId}</div>
  ),
}));

vi.mock('@/features/performances/components/GamingBarChart', () => ({
  default: ({ songId }: { songId: string }) => (
    <div data-testid="gaming-bar-chart">Gaming Bar Chart for {songId}</div>
  ),
}));

vi.mock('@/features/performances/components/LearningTimeline', () => ({
  default: ({ songId }: { songId: string }) => (
    <div data-testid="learning-timeline">Learning Timeline for {songId}</div>
  ),
}));

vi.mock('@/features/performances/components/GamingTimeline', () => ({
  default: ({ songId }: { songId: string }) => (
    <div data-testid="gaming-timeline">Gaming Timeline for {songId}</div>
  ),
}));

vi.mock('@/features/performances/components/RecentSessionsByMode', () => ({
  default: ({ songId }: { songId: string }) => (
    <div data-testid="recent-sessions">Recent Sessions for {songId}</div>
  ),
}));

// Mock des autres composants qui peuvent causer des warnings
vi.mock('@/components/timeline/RecordsTimeline', () => ({
  default: ({ records, isLoading, error }: any) => (
    <div data-testid="records-timeline">
      {isLoading
        ? 'Loading...'
        : error
        ? 'Error'
        : `${records?.length || 0} records`}
    </div>
  ),
}));

// Mock des utilitaires qui peuvent être lents
vi.mock('@/common/utils/function', () => ({
  castMsToMin: vi.fn(
    (ms: number) =>
      `${Math.floor(ms / 60000)}:${String(
        Math.floor((ms % 60000) / 1000)
      ).padStart(2, '0')}`
  ),
  getDifficultyRange: vi.fn((level: number) => ({
    label: level <= 2 ? 'Facile' : level <= 4 ? 'Moyen' : 'Difficile',
    className: level <= 2 ? 'easy' : level <= 4 ? 'medium' : 'hard',
  })),
}));

// Mock des dépendances
vi.mock('@/contexts/SongContext', () => ({
  useSong: vi.fn(),
}));

vi.mock('next/navigation', () => ({
  useRouter: vi.fn(),
}));

vi.mock('@/lib/actions/songs', () => ({
  toggleFavorite: vi.fn(),
}));

vi.mock('react-hot-toast', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

describe('SongPerformances', () => {
  const mockSong = {
    id: 'song1',
    title: 'Test Song',
    composer: 'Test Composer',
    imageUrl: 'https://example.com/image.jpg',
    duration_ms: 180000, // 3 minutes
    genre: 'Classical',
    tempo: 120,
    Level: 3,
    isFavorite: false,
  };

  const mockUseSong = {
    currentSong: null,
    setCurrentSong: vi.fn(),
  };

  const mockRouter = {
    push: vi.fn(),
    back: vi.fn(),
    forward: vi.fn(),
    refresh: vi.fn(),
    replace: vi.fn(),
    prefetch: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(useSong).mockReturnValue(mockUseSong);
    vi.mocked(useRouter).mockReturnValue(mockRouter);
    vi.mocked(toggleFavorite).mockResolvedValue({ success: true });
  });

  it('devrait rendre le composant avec les informations de la chanson', () => {
    render(<SongPerformances song={mockSong} />);

    expect(screen.getByText('Test Song')).toBeInTheDocument();
    expect(screen.getByText('Test Composer')).toBeInTheDocument();
    expect(screen.getByText('120 BPM')).toBeInTheDocument();
    expect(screen.getByText('Classical')).toBeInTheDocument();
  });

  it("devrait afficher l'image de la chanson si disponible", () => {
    render(<SongPerformances song={mockSong} />);

    const image = screen.getByAltText('Test Song');
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute('src', 'https://example.com/image.jpg');
  });

  it("devrait afficher l'icône de musique si pas d'image", () => {
    const songWithoutImage = { ...mockSong, imageUrl: null };
    render(<SongPerformances song={songWithoutImage} />);

    expect(screen.getByTestId('music-icon')).toBeInTheDocument();
  });

  it('devrait afficher le bouton de retour', () => {
    render(<SongPerformances song={mockSong} />);

    expect(screen.getByText('Retour aux chansons jouées')).toBeInTheDocument();
    expect(screen.getByTestId('chevron-right-icon')).toBeInTheDocument();
  });

  it('devrait afficher le bouton favori', () => {
    render(<SongPerformances song={mockSong} />);

    // Le bouton favori n'a pas de name, utilisons sa classe CSS
    const favoriteButton = screen
      .getAllByRole('button')
      .find((button) => button.className.includes('_favoriteButton_'));
    expect(favoriteButton).toBeInTheDocument();
  });

  it('devrait afficher les badges de difficulté', () => {
    render(<SongPerformances song={mockSong} />);

    expect(screen.getByTestId('difficulty-badge')).toBeInTheDocument();
  });

  it('devrait afficher les composants de performances', () => {
    render(<SongPerformances song={mockSong} />);

    expect(screen.getByTestId('general-tiles')).toBeInTheDocument();
    expect(screen.getByTestId('practice-graph')).toBeInTheDocument();
  });

  it("devrait afficher les onglets d'apprentissage et de jeu", () => {
    render(<SongPerformances song={mockSong} />);

    expect(screen.getByText('Mode Apprentissage')).toBeInTheDocument();
    expect(screen.getByText('Mode Jeu')).toBeInTheDocument();
  });

  it("devrait afficher les composants d'apprentissage par défaut", () => {
    render(<SongPerformances song={mockSong} />);

    expect(screen.getByTestId('learning-tiles')).toBeInTheDocument();
    expect(screen.getByTestId('precision-chart')).toBeInTheDocument();
    expect(screen.getByTestId('performance-chart')).toBeInTheDocument();
    expect(
      screen.getByTestId('performance-precision-bar-chart')
    ).toBeInTheDocument();
    expect(screen.getByTestId('learning-timeline')).toBeInTheDocument();
  });

  it("devrait afficher les composants de jeu lors du changement d'onglet", () => {
    render(<SongPerformances song={mockSong} />);

    const gameTab = screen.getByText('Mode Jeu');
    fireEvent.click(gameTab);

    expect(screen.getByTestId('gaming-tiles')).toBeInTheDocument();
    expect(screen.getByTestId('gaming-line-chart')).toBeInTheDocument();
    expect(screen.getByTestId('gaming-bar-chart')).toBeInTheDocument();
    expect(screen.getByTestId('gaming-timeline')).toBeInTheDocument();
  });

  it('devrait gérer le clic sur le bouton favori', async () => {
    vi.mocked(toggleFavorite).mockResolvedValue({
      success: true,
      message: 'Ajouté aux favoris',
      isFavorite: true,
    });

    render(<SongPerformances song={mockSong} />);

    const favoriteButton = screen
      .getAllByRole('button')
      .find((button) => button.className.includes('_favoriteButton_'))!;

    fireEvent.click(favoriteButton);

    // Attendre que l'action soit résolue
    await waitFor(() => {
      expect(toggleFavorite).toHaveBeenCalledWith('song1');
      expect(toast.success).toHaveBeenCalledWith('Ajouté aux favoris');
    });
  });

  it('devrait gérer les erreurs lors du clic sur favori', async () => {
    vi.mocked(toggleFavorite).mockResolvedValue({
      success: false,
      message: 'Erreur',
      isFavorite: false,
    });

    render(<SongPerformances song={mockSong} />);

    const favoriteButton = screen
      .getAllByRole('button')
      .find((button) => button.className.includes('_favoriteButton_'))!;

    fireEvent.click(favoriteButton);

    // Attendre que l'action soit résolue
    await waitFor(() => {
      expect(toggleFavorite).toHaveBeenCalledWith('song1');
      expect(toast.error).toHaveBeenCalledWith('Erreur');
    });
  });

  it('devrait mettre à jour le contexte avec la chanson', () => {
    render(<SongPerformances song={mockSong} />);

    expect(mockUseSong.setCurrentSong).toHaveBeenCalledWith(mockSong);
  });

  it('devrait nettoyer le contexte lors du démontage', () => {
    const { unmount } = render(<SongPerformances song={mockSong} />);

    unmount();

    expect(mockUseSong.setCurrentSong).toHaveBeenCalledWith(null);
  });

  it('devrait afficher la durée formatée', () => {
    render(<SongPerformances song={mockSong} />);

    // La durée est affichée comme "3:00" d'après le terminal output
    expect(screen.getByText('3:00')).toBeInTheDocument();
  });

  it('devrait gérer les chansons sans compositeur', () => {
    const songWithoutComposer = { ...mockSong, composer: null };
    render(<SongPerformances song={songWithoutComposer} />);

    expect(screen.getByText('Compositeur inconnu')).toBeInTheDocument();
  });

  it('devrait gérer les chansons sans genre', () => {
    const songWithoutGenre = { ...mockSong, genre: null };
    render(<SongPerformances song={songWithoutGenre} />);

    expect(screen.getByText('Non spécifié')).toBeInTheDocument();
  });

  it('devrait afficher le bouton favori comme actif si la chanson est favorite', () => {
    const favoriteSong = { ...mockSong, isFavorite: true };
    render(<SongPerformances song={favoriteSong} />);

    const favoriteButton = screen
      .getAllByRole('button')
      .find((button) => button.className.includes('_favoriteButton_'))!;
    expect(favoriteButton).toHaveClass('_favoriteActive_b4e1c5');
  });

  it('devrait naviguer vers la page des chansons jouées lors du clic sur retour', () => {
    render(<SongPerformances song={mockSong} />);

    const backButton = screen.getByText('Retour aux chansons jouées');
    fireEvent.click(backButton);

    expect(mockRouter.push).toHaveBeenCalledWith(
      '/performances?tab=playedSongs'
    );
  });
});
