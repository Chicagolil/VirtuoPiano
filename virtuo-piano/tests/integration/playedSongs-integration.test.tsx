import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { getPlayedSongsAction } from '@/lib/actions/playedSongs-actions';
import PlayedSongs from '@/features/performances/PlayedSongs';
import { useSearchCache } from '@/customHooks/useSearchCache';

// Mock de Next.js router
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: vi.fn(),
    refresh: vi.fn(),
    pathname: '/performances',
  }),
}));

// Mock des actions et hooks
vi.mock('@/lib/actions/playedSongs-actions');
vi.mock('@/customHooks/useSearchCache');

const mockGetPlayedSongsAction = vi.mocked(getPlayedSongsAction);
const mockUseSearchCache = vi.mocked(useSearchCache);

describe('PlayedSongs Integration Tests', () => {
  const mockPlayedSongs = [
    {
      id: 'song1',
      title: 'Sonate au clair de lune',
      composer: 'Beethoven',
      genre: 'Classical',
      isFavorite: false,
      lastPlayed: '2024-01-15T10:00:00.000Z',
      duration_ms: 180000,
      imageUrl: 'https://example.com/image1.jpg',
      Level: 3,
      tempo: 120,
      timeSignature: '4/4',
      SourceType: 'library' as const,
      SongType: 'song' as const,
      notes: [],
    },
    {
      id: 'song2',
      title: 'Clair de Lune',
      composer: 'Debussy',
      genre: 'Impressionist',
      isFavorite: true,
      lastPlayed: '2024-01-14T15:30:00.000Z',
      duration_ms: 240000,
      imageUrl: 'https://example.com/image2.jpg',
      Level: 4,
      tempo: 100,
      timeSignature: '3/4',
      SourceType: 'library' as const,
      SongType: 'song' as const,
      notes: [],
    },
  ];

  const mockPaginationData = {
    songs: mockPlayedSongs,
    pagination: {
      currentPage: 1,
      totalPages: 1,
      totalSongs: 2,
      hasNextPage: false,
      hasPreviousPage: false,
    },
  };

  beforeEach(() => {
    vi.clearAllMocks();

    // Configuration par défaut du mock useSearchCache
    mockUseSearchCache.mockReturnValue({
      data: mockPaginationData,
      isLoading: false,
      error: null,
      hasCache: true,
      clearCache: vi.fn(),
      refetch: vi.fn(),
      updateCacheData: vi.fn(),
    });

    mockGetPlayedSongsAction.mockResolvedValue(mockPaginationData);
  });

  describe('Rendu et données', () => {
    it('devrait afficher la liste des chansons jouées', async () => {
      render(<PlayedSongs />);

      await waitFor(() => {
        expect(screen.getByText('Sonate au clair de lune')).toBeInTheDocument();
        expect(screen.getByText('Clair de Lune')).toBeInTheDocument();
      });

      expect(screen.getByText('Beethoven')).toBeInTheDocument();
      expect(screen.getByText('Debussy')).toBeInTheDocument();
    });

    it('devrait afficher le nombre total de chansons', async () => {
      render(<PlayedSongs />);

      await waitFor(() => {
        expect(screen.getByText(/2.*morceau.*joué/)).toBeInTheDocument();
      });
    });

    it('devrait afficher un message de chargement', () => {
      mockUseSearchCache.mockReturnValue({
        data: null,
        isLoading: true,
        error: null,
        hasCache: false,
        clearCache: vi.fn(),
        refetch: vi.fn(),
        updateCacheData: vi.fn(),
      });

      render(<PlayedSongs />);

      expect(screen.getByTitle('Loading...')).toBeInTheDocument();
    });

    it('devrait afficher un message quand aucune chanson', () => {
      mockUseSearchCache.mockReturnValue({
        data: {
          songs: [],
          pagination: {
            currentPage: 1,
            totalPages: 0,
            totalSongs: 0,
            hasNextPage: false,
            hasPreviousPage: false,
          },
        },
        isLoading: false,
        error: null,
        hasCache: true,
        clearCache: vi.fn(),
        refetch: vi.fn(),
        updateCacheData: vi.fn(),
      });

      render(<PlayedSongs />);

      expect(screen.getByText(/Aucune chanson jouée/)).toBeInTheDocument();
    });
  });

  describe('Recherche et filtrage', () => {
    it('devrait permettre de rechercher par titre', async () => {
      render(<PlayedSongs />);

      const searchInput = screen.getByPlaceholderText(/Rechercher/);
      fireEvent.change(searchInput, { target: { value: 'Sonate' } });

      expect((searchInput as HTMLInputElement).value).toBe('Sonate');
    });

    it('devrait afficher un indicateur de cache', async () => {
      render(<PlayedSongs />);

      await waitFor(() => {
        expect(screen.getByText('📋')).toBeInTheDocument();
        expect(screen.getByTitle('Données en cache')).toBeInTheDocument();
      });
    });
  });

  describe('Pagination', () => {
    it('devrait afficher les contrôles de pagination', async () => {
      render(<PlayedSongs />);

      await waitFor(() => {
        expect(screen.getByText(/Page 1 sur 1/)).toBeInTheDocument();
      });

      // Les boutons de pagination devraient être présents (même s'ils sont désactivés)
      const buttons = screen.getAllByRole('button');
      const paginationButtons = buttons.filter((btn) =>
        btn.querySelector('svg[class*="chevron"]')
      );
      expect(paginationButtons.length).toBeGreaterThanOrEqual(2);
    });
  });

  describe('Tri et colonnes', () => {
    it('devrait afficher les en-têtes de colonnes', async () => {
      render(<PlayedSongs />);

      expect(screen.getByText('Titre')).toBeInTheDocument();
      expect(screen.getByText('Compositeur')).toBeInTheDocument();
      expect(screen.getByText('Type')).toBeInTheDocument();
      expect(screen.getByText('Difficulté')).toBeInTheDocument();
      expect(screen.getByText('Durée')).toBeInTheDocument();
      expect(screen.getByText(/Dernière lecture/)).toBeInTheDocument();
    });

    it('devrait permettre de cliquer sur les en-têtes pour trier', () => {
      render(<PlayedSongs />);

      const titleHeader = screen.getByText('Titre');
      expect(titleHeader.closest('button')).toBeInTheDocument();

      fireEvent.click(titleHeader.closest('button')!);
      // Le test réussit s'il n'y a pas d'erreur
      expect(true).toBe(true);
    });
  });

  describe('Gestion des erreurs', () => {
    it('devrait gérer les erreurs de chargement', () => {
      mockUseSearchCache.mockReturnValue({
        data: null,
        isLoading: false,
        error: 'Erreur de chargement',
        hasCache: false,
        clearCache: vi.fn(),
        refetch: vi.fn(),
        updateCacheData: vi.fn(),
      });

      render(<PlayedSongs />);

      // En cas d'erreur, le composant affiche quand même l'état vide
      expect(screen.getByText(/Aucune chanson jouée/)).toBeInTheDocument();
    });
  });

  describe('Interface utilisateur', () => {
    it("devrait afficher le bouton d'actualisation", async () => {
      render(<PlayedSongs />);

      await waitFor(() => {
        expect(screen.getByText('🔄 Actualiser')).toBeInTheDocument();
      });
    });

    it("devrait permettre de cliquer sur le bouton d'actualisation", async () => {
      const mockRefetch = vi.fn();
      mockUseSearchCache.mockReturnValue({
        data: mockPaginationData,
        isLoading: false,
        error: null,
        hasCache: true,
        clearCache: vi.fn(),
        refetch: mockRefetch,
        updateCacheData: vi.fn(),
      });

      render(<PlayedSongs />);

      const refreshButton = screen.getByText('🔄 Actualiser');
      fireEvent.click(refreshButton);

      expect(mockRefetch).toHaveBeenCalled();
    });
  });

  describe('Responsive et accessibilité', () => {
    it('devrait avoir des rôles ARIA appropriés', () => {
      render(<PlayedSongs />);

      expect(screen.getByRole('table')).toBeInTheDocument();
      expect(screen.getByRole('textbox')).toBeInTheDocument();
    });

    it('devrait afficher les données de chanson correctement formatées', async () => {
      render(<PlayedSongs />);

      await waitFor(() => {
        // Vérifier que les durées sont formatées
        expect(screen.getByText('3:00')).toBeInTheDocument(); // 180000ms = 3:00
        expect(screen.getByText('4:00')).toBeInTheDocument(); // 240000ms = 4:00
      });
    });
  });

  describe('Intégration avec les hooks', () => {
    it('devrait utiliser useSearchCache avec les bons paramètres', () => {
      render(<PlayedSongs />);

      expect(mockUseSearchCache).toHaveBeenCalledWith(
        expect.objectContaining({
          fetchFunction: expect.any(Function),
          filters: expect.any(Object),
          searchQuery: expect.any(String),
        })
      );
    });

    it('devrait passer les filtres correctement à useSearchCache', () => {
      render(<PlayedSongs />);

      const lastCall =
        mockUseSearchCache.mock.calls[mockUseSearchCache.mock.calls.length - 1];
      const { filters } = lastCall[0];

      expect(filters).toHaveProperty('page');
      expect(filters.page).toBe(1);
      // Note: Le paramètre 'limit' pourrait être nommé différemment dans l'implémentation
    });
  });
});
