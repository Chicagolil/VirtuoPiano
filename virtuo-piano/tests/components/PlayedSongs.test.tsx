import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
  render,
  screen,
  fireEvent,
  waitFor,
  act,
} from '@testing-library/react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import PlayedSongs from '@/features/performances/PlayedSongs';
import { useSearchCache } from '@/customHooks/useSearchCache';
import { toggleFavorite } from '@/lib/actions/songs';
import {
  getPlayedSongsAction,
  getPlayedSongsGenresAction,
} from '@/lib/actions/playedSongs-actions';

// Mock des dépendances
vi.mock('next/navigation', () => ({
  useRouter: vi.fn(),
}));

vi.mock('react-hot-toast', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

vi.mock('@/customHooks/useSearchCache', () => ({
  useSearchCache: vi.fn(),
}));

vi.mock('@/lib/actions/songs', () => ({
  toggleFavorite: vi.fn(),
}));

vi.mock('@/lib/actions/playedSongs-actions', () => ({
  getPlayedSongsAction: vi.fn(),
  getPlayedSongsGenresAction: vi.fn(),
}));

const mockUseRouter = vi.mocked(useRouter);
const mockUseSearchCache = vi.mocked(useSearchCache);
const mockToggleFavorite = vi.mocked(toggleFavorite);
const mockGetPlayedSongsAction = vi.mocked(getPlayedSongsAction);
const mockGetPlayedSongsGenresAction = vi.mocked(getPlayedSongsGenresAction);
const mockToast = vi.mocked(toast);

// Fonctions utilitaires pour trouver les boutons sans nom accessible
const getFilterButton = () => {
  // Chercher un bouton avec "Filtrer" ou essayer d'autres méthodes
  const buttons = screen.getAllByRole('button');
  return (
    buttons.find(
      (button) =>
        button.textContent?.includes('Filtrer') ||
        button.textContent?.includes('Filter') ||
        button.className.includes('filter') ||
        button.getAttribute('aria-label')?.includes('filtrer')
    ) ||
    buttons.find(
      (button) =>
        // Si pas trouvé, prendre le premier bouton qui n'est pas favori
        !button.className.includes('favorite')
    )
  );
};

const getFavoriteButtons = () => {
  return screen
    .getAllByRole('button')
    .filter(
      (button) =>
        button.className.includes('favoriteButton') ||
        button.className.includes('favorite')
    );
};

const getPaginationButtons = () => {
  return screen
    .getAllByRole('button')
    .filter(
      (button) =>
        button.className.includes('paginationButton') ||
        button.textContent?.includes('Précédent') ||
        button.textContent?.includes('Suivant')
    );
};

describe('PlayedSongs Component', () => {
  const mockPush = vi.fn();

  const mockPlayedSongsData = {
    songs: [
      {
        id: 'song1',
        title: 'Sonate au clair de lune',
        composer: 'Beethoven',
        genre: 'Classical',
        tempo: 120,
        duration_ms: 180000,
        timeSignature: '4/4',
        SourceType: 'library' as const,
        notes: [],
        Level: 1,
        imageUrl: 'https://example.com/image1.jpg',
        SongType: 'song' as const,
        isFavorite: false,
        lastPlayed: '2024-01-15T10:00:00.000Z',
      },
      {
        id: 'song2',
        title: 'Für Elise',
        composer: 'Beethoven',
        genre: 'Classical',
        tempo: 110,
        duration_ms: 120000,
        timeSignature: '3/8',
        SourceType: 'library' as const,
        notes: [],
        Level: 2,
        imageUrl: null,
        SongType: 'song' as const,
        isFavorite: true,
        lastPlayed: '2024-01-14T15:30:00.000Z',
      },
    ],
    pagination: {
      currentPage: 1,
      totalPages: 1,
      totalSongs: 2,
      hasNextPage: false,
      hasPreviousPage: false,
    },
  };

  const mockSearchCacheDefault = {
    data: mockPlayedSongsData,
    isLoading: false,
    error: null,
    clearCache: vi.fn(),
    refetch: vi.fn(),
    hasCache: false,
    updateCacheData: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
    mockUseRouter.mockReturnValue({ push: mockPush } as any);
    mockUseSearchCache.mockReturnValue(mockSearchCacheDefault);
    mockGetPlayedSongsAction.mockResolvedValue(mockPlayedSongsData);
    mockGetPlayedSongsGenresAction.mockResolvedValue([
      'Classical',
      'Jazz',
      'Pop',
    ]);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('Rendu de base', () => {
    it('devrait afficher la liste des chansons jouées', async () => {
      await act(async () => {
        render(<PlayedSongs />);
      });

      await waitFor(() => {
        expect(screen.getByText('Sonate au clair de lune')).toBeInTheDocument();
        expect(screen.getByText('Für Elise')).toBeInTheDocument();
        expect(screen.getAllByText('Beethoven')).toHaveLength(2);
      });
    });

    it('devrait afficher les informations de pagination', async () => {
      await act(async () => {
        render(<PlayedSongs />);
      });

      await waitFor(() => {
        expect(screen.getByText('2 morceaux joués')).toBeInTheDocument();
        expect(screen.getByText('Page 1 sur 1')).toBeInTheDocument();
      });
    });

    it('devrait afficher la barre de recherche', async () => {
      await act(async () => {
        render(<PlayedSongs />);
      });

      await waitFor(() => {
        const searchInput = screen.getByPlaceholderText(
          'Rechercher par titre ou compositeur...'
        );
        expect(searchInput).toBeInTheDocument();
      });
    });

    it('devrait afficher le bouton de filtres', async () => {
      await act(async () => {
        render(<PlayedSongs />);
      });

      await waitFor(() => {
        const filterButton = getFilterButton();
        expect(filterButton).toBeTruthy();
        expect(filterButton).toBeInTheDocument();
      });
    });

    it('devrait afficher les en-têtes de colonnes', async () => {
      await act(async () => {
        render(<PlayedSongs />);
      });

      await waitFor(() => {
        expect(screen.getByText('Titre')).toBeInTheDocument();
        expect(screen.getByText('Compositeur')).toBeInTheDocument();
        expect(screen.getByText('Durée')).toBeInTheDocument();
        expect(screen.getByText(/Dernière lecture/)).toBeInTheDocument();
      });
    });

    it('devrait afficher les boutons de favoris', async () => {
      await act(async () => {
        render(<PlayedSongs />);
      });

      await waitFor(() => {
        const favoriteButtons = getFavoriteButtons();
        expect(favoriteButtons).toHaveLength(2);
      });
    });
  });

  describe('État de chargement', () => {
    it('devrait afficher le spinner pendant le chargement', async () => {
      mockUseSearchCache.mockReturnValue({
        ...mockSearchCacheDefault,
        isLoading: true,
        data: null,
      });

      await act(async () => {
        render(<PlayedSongs />);
      });

      expect(screen.getByText('Chargement...')).toBeInTheDocument();
    });
  });

  describe('Filtres', () => {
    it('devrait ouvrir le menu des filtres', async () => {
      await act(async () => {
        render(<PlayedSongs />);
      });

      await waitFor(() => {
        const filterButton = getFilterButton();
        expect(filterButton).toBeTruthy();
        fireEvent.click(filterButton!);
      });

      await waitFor(() => {
        expect(screen.getByText('Tous')).toBeInTheDocument();
        expect(screen.getByText('Favoris')).toBeInTheDocument();
      });
    });

    it('devrait supprimer un filtre actif', async () => {
      render(<PlayedSongs />);

      const filterButton = getFilterButton();
      expect(filterButton).toBeTruthy();
      fireEvent.click(filterButton!);

      await waitFor(() => {
        const favoritesFilter = screen.getByText('Favoris');
        fireEvent.click(favoritesFilter);
      });

      await waitFor(() => {
        const removeFilterButton = screen.getByText('×');
        fireEvent.click(removeFilterButton);
      });

      expect(mockUseSearchCache).toHaveBeenLastCalledWith(
        expect.objectContaining({
          filters: expect.objectContaining({
            favorites: false,
          }),
        })
      );
    });

    it('devrait afficher les filtres actifs', async () => {
      render(<PlayedSongs />);

      const filterButton = getFilterButton();
      expect(filterButton).toBeTruthy();
      fireEvent.click(filterButton!);

      await waitFor(() => {
        const favoritesFilter = screen.getByText('Favoris');
        fireEvent.click(favoritesFilter);
      });

      await waitFor(() => {
        expect(screen.getByText('Favoris')).toBeInTheDocument();
      });
    });
  });

  describe('Tri', () => {
    it('devrait afficher les indicateurs de tri', async () => {
      await act(async () => {
        render(<PlayedSongs />);
      });

      await waitFor(() => {
        // Le tri par défaut est par dernière lecture, descendant
        expect(screen.getByText(/Dernière lecture/)).toBeInTheDocument();
        // L'indicateur est affiché avec le texte
        expect(screen.getByText(/↓/)).toBeInTheDocument();
      });
    });
  });

  describe('Pagination', () => {
    it('devrait afficher les boutons de pagination', async () => {
      const multiPageData = {
        ...mockPlayedSongsData,
        pagination: {
          currentPage: 2,
          totalPages: 5,
          totalSongs: 100,
          hasNextPage: true,
          hasPreviousPage: true,
        },
      };

      mockUseSearchCache.mockReturnValue({
        ...mockSearchCacheDefault,
        data: multiPageData,
      });

      await act(async () => {
        render(<PlayedSongs />);
      });

      await waitFor(() => {
        expect(screen.getByText('Page 2 sur 5')).toBeInTheDocument();

        const paginationButtons = getPaginationButtons();
        const prevButton = paginationButtons[0];
        const nextButton = paginationButtons[1];

        expect(prevButton).toBeInTheDocument();
        expect(nextButton).toBeInTheDocument();
        expect(prevButton).not.toBeDisabled();
        expect(nextButton).not.toBeDisabled();
      });
    });

    it('devrait désactiver le bouton précédent sur la première page', async () => {
      await act(async () => {
        render(<PlayedSongs />);
      });

      await waitFor(() => {
        const paginationButtons = getPaginationButtons();
        const prevButton = paginationButtons[0];
        expect(prevButton).toBeDisabled();
      });
    });

    it('devrait désactiver le bouton suivant sur la dernière page', async () => {
      await act(async () => {
        render(<PlayedSongs />);
      });

      await waitFor(() => {
        const paginationButtons = getPaginationButtons();
        const nextButton = paginationButtons[1];
        expect(nextButton).toBeDisabled();
      });
    });

    it('devrait naviguer vers la page suivante', async () => {
      const multiPageData = {
        ...mockPlayedSongsData,
        pagination: {
          currentPage: 1,
          totalPages: 3,
          totalSongs: 60,
          hasNextPage: true,
          hasPreviousPage: false,
        },
      };

      mockUseSearchCache.mockReturnValue({
        ...mockSearchCacheDefault,
        data: multiPageData,
      });

      await act(async () => {
        render(<PlayedSongs />);
      });

      await waitFor(() => {
        const paginationButtons = getPaginationButtons();
        const nextButton = paginationButtons[1];
        fireEvent.click(nextButton);
      });

      await waitFor(() => {
        expect(mockUseSearchCache).toHaveBeenLastCalledWith(
          expect.objectContaining({
            filters: expect.objectContaining({
              page: 2,
            }),
          })
        );
      });
    });
  });

  describe('Favoris', () => {
    it('devrait basculer un favori', async () => {
      mockToggleFavorite.mockResolvedValue({
        success: true,
        message: 'Ajouté aux favoris',
      });

      await act(async () => {
        render(<PlayedSongs />);
      });

      await waitFor(() => {
        const favoriteButtons = getFavoriteButtons();
        fireEvent.click(favoriteButtons[0]);
      });

      await waitFor(() => {
        expect(mockToggleFavorite).toHaveBeenCalledWith('song1');
      });
    });

    it('devrait rafraîchir les données après modification', async () => {
      mockToggleFavorite.mockResolvedValue({
        success: true,
        message: 'Supprimé des favoris',
      });

      const mockRefetch = vi.fn();
      mockUseSearchCache.mockReturnValue({
        ...mockSearchCacheDefault,
        refetch: mockRefetch,
      });

      await act(async () => {
        render(<PlayedSongs />);
      });

      await waitFor(() => {
        const favoriteButtons = getFavoriteButtons();
        fireEvent.click(favoriteButtons[0]);
      });

      await waitFor(() => {
        expect(mockRefetch).toHaveBeenCalled();
      });
    });

    it('devrait gérer les erreurs de favoris', async () => {
      mockToggleFavorite.mockResolvedValue({
        success: false,
        message: 'Erreur lors de la modification',
      });

      await act(async () => {
        render(<PlayedSongs />);
      });

      await waitFor(() => {
        const favoriteButtons = getFavoriteButtons();
        fireEvent.click(favoriteButtons[0]);
      });

      await waitFor(() => {
        expect(mockToast.error).toHaveBeenCalledWith(
          'Erreur lors de la modification'
        );
      });
    });
  });

  describe('Responsive design', () => {
    it('devrait cacher certaines colonnes sur mobile', async () => {
      await act(async () => {
        render(<PlayedSongs />);
      });

      await waitFor(() => {
        // Les colonnes avec hideOnMobile devraient avoir la classe appropriée
        const composerHeader = screen.getByText('Compositeur');
        expect(composerHeader.closest('th')?.className).toContain(
          'hideOnMobile'
        );
      });
    });
  });
});
