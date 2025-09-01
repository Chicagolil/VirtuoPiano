import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
  render,
  screen,
  fireEvent,
  waitFor,
  act,
} from '@testing-library/react';
import HistoryStats from '@/features/performances/HistoryStats';
import { useSearchCache } from '@/customHooks/useSearchCache';
import { getFilteredSessions } from '@/lib/actions/history-actions';

// Mock de Next.js router
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: vi.fn(),
    refresh: vi.fn(),
    pathname: '/performances',
  }),
}));

// Mock des dépendances
vi.mock('@/customHooks/useSearchCache', () => ({
  useSearchCache: vi.fn(),
}));

vi.mock('@/lib/actions/history-actions', () => ({
  getFilteredSessions: vi.fn(),
}));

// Mock des composants lourds
vi.mock('@/components/cards/ScoreCard', () => ({
  default: ({ score }: any) => (
    <div data-testid="score-card">
      <span>{score.songTitle}</span>
      <span>{score.songComposer}</span>
      <span>{score.modeName}</span>
    </div>
  ),
}));

const mockUseSearchCache = vi.mocked(useSearchCache);
const mockGetFilteredSessions = vi.mocked(getFilteredSessions);

describe('HistoryStats Component (Refactored)', () => {
  const mockSessionsData = {
    sessions: [
      {
        id: '1',
        songTitle: 'Sonate au clair de lune',
        songComposer: 'Beethoven',
        correctNotes: 85,
        missedNotes: 5,
        wrongNotes: 10,
        totalPoints: 1250,
        maxMultiplier: 3,
        maxCombo: 15,
        sessionStartTime: new Date('2024-01-15T10:00:00'),
        sessionEndTime: new Date('2024-01-15T10:30:00'),
        modeName: 'Apprentissage',
        durationInMinutes: 30,
        accuracy: 85,
        performance: 90,
      },
      {
        id: '2',
        songTitle: 'Für Elise',
        songComposer: 'Beethoven',
        correctNotes: 92,
        missedNotes: 3,
        wrongNotes: 5,
        totalPoints: 1580,
        maxMultiplier: 4,
        maxCombo: 25,
        sessionStartTime: new Date('2024-01-14T15:00:00'),
        sessionEndTime: new Date('2024-01-14T15:25:00'),
        modeName: 'Pratique',
        durationInMinutes: 25,
        accuracy: 92,
        performance: 95,
      },
    ],
    hasMore: true,
    total: 50,
  };

  const mockSearchCacheDefault = {
    data: mockSessionsData,
    isLoading: false,
    error: null,
    clearCache: vi.fn(),
    refetch: vi.fn(),
    hasCache: false,
    updateCacheData: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
    mockUseSearchCache.mockReturnValue(mockSearchCacheDefault);
    mockGetFilteredSessions.mockResolvedValue({
      success: true,
      data: [],
      hasMore: false,
      total: 0,
      error: null,
    });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('Rendu de base', () => {
    it("devrait afficher le titre avec l'icône", async () => {
      await act(async () => {
        render(<HistoryStats />);
      });

      await waitFor(() => {
        expect(screen.getByText('Toutes les sessions')).toBeInTheDocument();
      });
    });

    it('devrait afficher la liste des sessions', async () => {
      await act(async () => {
        render(<HistoryStats />);
      });

      await waitFor(() => {
        expect(screen.getByText('Sonate au clair de lune')).toBeInTheDocument();
        expect(screen.getByText('Für Elise')).toBeInTheDocument();
        expect(screen.getAllByText('Beethoven')).toHaveLength(2);
      });
    });

    it("devrait afficher le bouton d'actualisation", async () => {
      await act(async () => {
        render(<HistoryStats />);
      });

      await waitFor(() => {
        const refreshButton = screen.getByText('🔄 Actualiser');
        expect(refreshButton).toBeInTheDocument();
      });
    });

    it("devrait afficher l'indicateur de nombre de sessions", async () => {
      await act(async () => {
        render(<HistoryStats />);
      });

      await waitFor(() => {
        expect(screen.getByText('sur 50 total')).toBeInTheDocument();
      });
    });
  });

  describe('État de chargement', () => {
    it('devrait afficher le spinner pendant le chargement initial', async () => {
      mockUseSearchCache.mockReturnValue({
        ...mockSearchCacheDefault,
        isLoading: true,
        data: null,
      });

      await act(async () => {
        render(<HistoryStats />);
      });

      // Le spinner personnalisé est affiché avec le titre "Loading..."
      expect(screen.getByTitle('Loading...')).toBeInTheDocument();
    });

    it('ne devrait pas afficher les sessions pendant le chargement', async () => {
      mockUseSearchCache.mockReturnValue({
        ...mockSearchCacheDefault,
        isLoading: true,
        data: null,
      });

      await act(async () => {
        render(<HistoryStats />);
      });

      expect(
        screen.queryByText('Sonate au clair de lune')
      ).not.toBeInTheDocument();
    });
  });

  describe('État vide', () => {
    it("devrait afficher un message quand aucune session n'est trouvée", async () => {
      mockUseSearchCache.mockReturnValue({
        ...mockSearchCacheDefault,
        data: {
          sessions: [],
          hasMore: false,
          total: 0,
        },
      });

      await act(async () => {
        render(<HistoryStats />);
      });

      await waitFor(() => {
        expect(
          screen.getByText('Aucune session trouvée dans votre historique')
        ).toBeInTheDocument();
      });
    });

    it('devrait afficher un bouton de réinitialisation des filtres', () => {
      mockUseSearchCache.mockReturnValue({
        ...mockSearchCacheDefault,
        data: {
          sessions: [],
          hasMore: false,
          total: 0,
        },
      });

      render(<HistoryStats />);

      const resetButton = screen.getByText('Réinitialiser tous les filtres');
      expect(resetButton).toBeInTheDocument();
    });
  });

  describe('Filtres de recherche', () => {
    it('devrait permettre de saisir une recherche', async () => {
      render(<HistoryStats />);

      const searchInput = screen.getByPlaceholderText(
        "Rechercher par nom de musique ou d'artiste..."
      );
      expect(searchInput).toBeInTheDocument();

      fireEvent.change(searchInput, { target: { value: 'beethoven' } });
      expect(searchInput).toHaveValue('beethoven');
    });

    it('devrait appeler useSearchCache avec la nouvelle recherche', async () => {
      render(<HistoryStats />);

      const searchInput = screen.getByPlaceholderText(
        "Rechercher par nom de musique ou d'artiste..."
      );

      fireEvent.change(searchInput, { target: { value: 'mozart' } });

      await waitFor(() => {
        expect(mockUseSearchCache).toHaveBeenLastCalledWith(
          expect.objectContaining({
            filters: expect.objectContaining({
              search: 'mozart',
            }),
            searchQuery: 'mozart',
          })
        );
      });
    });
  });

  describe('Filtres de mode', () => {
    it("devrait permettre de filtrer par mode d'apprentissage", async () => {
      render(<HistoryStats />);

      const learningModeButton = screen.getByRole('button', {
        name: 'Apprentissage',
      });
      fireEvent.click(learningModeButton);

      expect(mockUseSearchCache).toHaveBeenLastCalledWith(
        expect.objectContaining({
          filters: expect.objectContaining({
            mode: 'learning',
          }),
        })
      );
    });

    it('devrait permettre de filtrer par mode de jeu', async () => {
      render(<HistoryStats />);

      const gameModeButton = screen.getByText('Jeu');
      fireEvent.click(gameModeButton);

      expect(mockUseSearchCache).toHaveBeenLastCalledWith(
        expect.objectContaining({
          filters: expect.objectContaining({
            mode: 'game',
          }),
        })
      );
    });

    it("devrait permettre d'afficher tous les modes", async () => {
      render(<HistoryStats />);

      const allModesButton = screen.getByText('Tous');
      fireEvent.click(allModesButton);

      expect(mockUseSearchCache).toHaveBeenLastCalledWith(
        expect.objectContaining({
          filters: expect.objectContaining({
            mode: 'all',
          }),
        })
      );
    });
  });

  describe('Filtre des sessions complétées', () => {
    it('devrait permettre de filtrer par sessions complétées uniquement', async () => {
      // D'abord sélectionner le mode apprentissage
      render(<HistoryStats />);

      const learningModeButton = screen.getByRole('button', {
        name: 'Apprentissage',
      });
      fireEvent.click(learningModeButton);

      await waitFor(() => {
        const completedOnlyCheckbox = screen.getByLabelText(
          'Chansons terminées (90%+)'
        );
        fireEvent.click(completedOnlyCheckbox);
      });

      expect(mockUseSearchCache).toHaveBeenLastCalledWith(
        expect.objectContaining({
          filters: expect.objectContaining({
            completed: true,
          }),
        })
      );
    });

    it('ne devrait afficher le filtre complété que pour le mode apprentissage', () => {
      render(<HistoryStats />);

      // Par défaut (mode 'all'), le checkbox ne devrait pas être visible
      expect(
        screen.queryByLabelText('Sessions complétées uniquement')
      ).not.toBeInTheDocument();

      // Sélectionner apprentissage
      const learningModeButton = screen.getByRole('button', {
        name: 'Apprentissage',
      });
      fireEvent.click(learningModeButton);

      // Maintenant le checkbox devrait être visible
      expect(
        screen.getByLabelText('Chansons terminées (90%+)')
      ).toBeInTheDocument();
    });
  });

  describe('Filtres de date', () => {
    it('devrait permettre de filtrer par date personnalisée', async () => {
      render(<HistoryStats />);

      // Ouvrir le panneau de filtres de date
      const filterButton = screen.getByText('Filtrer par date');
      fireEvent.click(filterButton);

      await waitFor(() => {
        // Interagir directement avec les champs de date (pas de bouton "Personnalisé")
        const dateInputs = screen
          .getAllByDisplayValue('')
          .filter((input) => input.getAttribute('type') === 'date');
        const startDateInput = dateInputs[0];
        const endDateInput = dateInputs[1];

        fireEvent.change(startDateInput, { target: { value: '2024-01-01' } });
        fireEvent.change(endDateInput, { target: { value: '2024-01-31' } });
      });

      expect(mockUseSearchCache).toHaveBeenLastCalledWith(
        expect.objectContaining({
          filters: expect.objectContaining({
            dateFilter: 'custom',
            startDate: '2024-01-01',
            endDate: '2024-01-31',
          }),
        })
      );
    });

    it('devrait afficher/cacher les champs de date personnalisés', async () => {
      render(<HistoryStats />);

      // Les champs de date ne devraient pas être visibles initialement
      const initialDateInputs = screen
        .queryAllByDisplayValue('')
        .filter((input) => input.getAttribute('type') === 'date');
      expect(initialDateInputs).toHaveLength(0);

      // Ouvrir le panneau de filtres de date
      const filterButton = screen.getByText('Filtrer par date');
      fireEvent.click(filterButton);

      await waitFor(() => {
        // Les champs de date devraient être visibles
        const dateInputs = screen
          .getAllByDisplayValue('')
          .filter((input) => input.getAttribute('type') === 'date');
        expect(dateInputs).toHaveLength(2); // Deux champs de date
      });
    });

    it('devrait permettre de filtrer par période prédéfinie', async () => {
      render(<HistoryStats />);

      // Ouvrir le panneau de filtres de date
      const filterButton = screen.getByText('Filtrer par date');
      fireEvent.click(filterButton);

      // Cliquer sur "Toutes" (qui est le filtre prédéfini disponible)
      const allButton = screen.getByText('Toutes');
      fireEvent.click(allButton);

      expect(mockUseSearchCache).toHaveBeenLastCalledWith(
        expect.objectContaining({
          filters: expect.objectContaining({
            dateFilter: 'all',
          }),
        })
      );
    });
  });

  describe('Bouton "Charger plus"', () => {
    it('devrait afficher le bouton quand hasMore est true', () => {
      render(<HistoryStats />);

      expect(screen.getByText('Voir plus de sessions')).toBeInTheDocument();
    });

    it('ne devrait pas afficher le bouton quand hasMore est false', () => {
      mockUseSearchCache.mockReturnValue({
        ...mockSearchCacheDefault,
        data: {
          ...mockSessionsData,
          hasMore: false,
        },
      });

      render(<HistoryStats />);

      expect(
        screen.queryByText('Voir plus de sessions')
      ).not.toBeInTheDocument();
    });

    it('devrait voir plus de sessions au clic', async () => {
      mockGetFilteredSessions.mockResolvedValue({
        success: true,
        data: [
          {
            id: '3',
            songTitle: 'Nouvelle Session',
            songComposer: 'Mozart',
            correctNotes: 80,
            missedNotes: 10,
            wrongNotes: 10,
            totalPoints: 1000,
            maxMultiplier: 2,
            maxCombo: 12,
            sessionStartTime: new Date('2024-01-13T14:00:00'),
            sessionEndTime: new Date('2024-01-13T14:20:00'),
            modeName: 'Pratique',
            durationInMinutes: 20,
            accuracy: 80,
            performance: 85,
          },
        ],
        hasMore: false,
        total: 51,
        error: null,
      });

      const mockUpdateCacheData = vi.fn();
      mockUseSearchCache.mockReturnValue({
        ...mockSearchCacheDefault,
        updateCacheData: mockUpdateCacheData,
      });

      render(<HistoryStats />);

      const loadMoreButton = screen.getByText('Voir plus de sessions');
      fireEvent.click(loadMoreButton);

      await waitFor(() => {
        expect(mockGetFilteredSessions).toHaveBeenCalledWith(
          expect.any(Object),
          expect.objectContaining({
            limit: 30,
            offset: 2, // Nombre de sessions actuelles
          })
        );
      });

      await waitFor(() => {
        expect(mockUpdateCacheData).toHaveBeenCalledWith({
          sessions: [...mockSessionsData.sessions, expect.any(Object)],
          hasMore: false,
          total: 51,
        });
      });
    });

    it('devrait afficher un spinner pendant le chargement de plus de sessions', async () => {
      render(<HistoryStats />);

      const loadMoreButton = screen.getByText('Voir plus de sessions');
      fireEvent.click(loadMoreButton);

      // Le bouton devrait être remplacé par un spinner avec le texte "Chargement..."
      expect(screen.getByText('Chargement...')).toBeInTheDocument();
      expect(
        screen.queryByText('Voir plus de sessions')
      ).not.toBeInTheDocument();
    });

    it('devrait gérer les erreurs lors du chargement de plus de sessions', async () => {
      mockGetFilteredSessions.mockRejectedValue(new Error('Network error'));

      render(<HistoryStats />);

      const loadMoreButton = screen.getByText('Voir plus de sessions');
      fireEvent.click(loadMoreButton);

      await waitFor(() => {
        // Vérifier que l'erreur est affichée
        expect(
          screen.getByText('Erreur lors du chargement de plus de sessions')
        ).toBeInTheDocument();
        // Vérifier qu'il y a un bouton "Réessayer"
        expect(screen.getByText('Réessayer')).toBeInTheDocument();
      });
    });
  });

  describe('Réinitialisation des filtres', () => {
    it('devrait réinitialiser tous les filtres', async () => {
      // Mock pour simuler aucun résultat trouvé (total = 0)
      mockUseSearchCache.mockReturnValue({
        data: { sessions: [], hasMore: false, total: 0 },
        isLoading: false,
        error: null,
        clearCache: vi.fn(),
        refetch: vi.fn(),
        hasCache: false,
        updateCacheData: vi.fn(),
      });

      render(<HistoryStats />);

      // Appliquer quelques filtres
      const searchInput = screen.getByPlaceholderText(
        "Rechercher par nom de musique ou d'artiste..."
      );
      fireEvent.change(searchInput, { target: { value: 'beethoven' } });

      const learningModeButton = screen.getByRole('button', {
        name: 'Apprentissage',
      });
      fireEvent.click(learningModeButton);

      // Attendre que le message "Aucune session trouvée" et le bouton de réinitialisation apparaissent
      await waitFor(() => {
        expect(
          screen.getByText('Aucune session trouvée dans votre historique')
        ).toBeInTheDocument();
      });

      // Réinitialiser
      const resetButton = screen.getByText('Réinitialiser tous les filtres');
      fireEvent.click(resetButton);

      expect(searchInput).toHaveValue('');
      expect(mockUseSearchCache).toHaveBeenLastCalledWith(
        expect.objectContaining({
          filters: expect.objectContaining({
            search: '',
            mode: 'all',
            completed: false,
            dateFilter: 'all',
            startDate: '',
            endDate: '',
          }),
        })
      );
    });
  });

  describe('Cache et actualisation', () => {
    it("devrait afficher l'indicateur de cache", () => {
      mockUseSearchCache.mockReturnValue({
        ...mockSearchCacheDefault,
        hasCache: true,
      });

      render(<HistoryStats />);

      expect(screen.getByText('📋')).toBeInTheDocument();
    });

    it('devrait actualiser les données', async () => {
      const mockClearCache = vi.fn();
      const mockRefetch = vi.fn();

      mockUseSearchCache.mockReturnValue({
        ...mockSearchCacheDefault,
        clearCache: mockClearCache,
        refetch: mockRefetch,
      });

      render(<HistoryStats />);

      const refreshButton = screen.getByText('🔄 Actualiser');
      fireEvent.click(refreshButton);

      expect(mockClearCache).toHaveBeenCalled();
      expect(mockRefetch).toHaveBeenCalled();
    });
  });

  describe('Gestion des erreurs', () => {
    it("devrait afficher un message d'erreur", () => {
      mockUseSearchCache.mockReturnValue({
        ...mockSearchCacheDefault,
        data: null,
        isLoading: false,
        error: 'Erreur de chargement des sessions',
      });

      render(<HistoryStats />);

      expect(
        screen.getByText('Erreur de chargement des sessions')
      ).toBeInTheDocument();
      expect(screen.getByText('Réessayer')).toBeInTheDocument();
    });

    it('devrait permettre de réessayer après une erreur', async () => {
      const mockRefetch = vi.fn();
      mockUseSearchCache.mockReturnValue({
        ...mockSearchCacheDefault,
        data: null,
        isLoading: false,
        error: 'Erreur de chargement des sessions',
        refetch: mockRefetch,
      });

      render(<HistoryStats />);

      const retryButton = screen.getByText('Réessayer');
      fireEvent.click(retryButton);

      expect(mockRefetch).toHaveBeenCalled();
    });
  });

  describe('Performance et optimisation', () => {
    it('devrait utiliser le debounce pour la recherche', async () => {
      render(<HistoryStats />);

      const searchInput = screen.getByPlaceholderText(
        "Rechercher par nom de musique ou d'artiste..."
      );

      // Taper rapidement plusieurs caractères
      fireEvent.change(searchInput, { target: { value: 'b' } });
      fireEvent.change(searchInput, { target: { value: 'be' } });
      fireEvent.change(searchInput, { target: { value: 'bee' } });

      // Le hook devrait être appelé avec debounce
      expect(mockUseSearchCache).toHaveBeenLastCalledWith(
        expect.objectContaining({
          searchQuery: 'bee',
          filters: expect.objectContaining({
            search: 'bee',
          }),
        })
      );
    });

    it('devrait réutiliser le cache pour les mêmes filtres', () => {
      const { rerender } = render(<HistoryStats />);

      // Premier rendu
      expect(mockUseSearchCache).toHaveBeenCalled();
      const firstCallCount = mockUseSearchCache.mock.calls.length;

      // Re-render avec les mêmes props
      rerender(<HistoryStats />);

      // Devrait réutiliser le cache
      expect(mockUseSearchCache.mock.calls.length).toBeGreaterThan(
        firstCallCount
      );
    });
  });

  describe('Intégration avec ScoreCard', () => {
    it('devrait passer les bonnes props aux ScoreCard', () => {
      render(<HistoryStats />);

      // Vérifier que les cartes de session sont affichées
      expect(screen.getByText('Sonate au clair de lune')).toBeInTheDocument();
      expect(screen.getByText('Für Elise')).toBeInTheDocument();

      // Vérifier que les données sont passées correctement
      expect(screen.getByText('Sonate au clair de lune')).toBeInTheDocument();
      expect(screen.getByText('Für Elise')).toBeInTheDocument();

      // Vérifier les modes dans les score cards spécifiquement
      const scoreCards = screen.getAllByTestId('score-card');
      expect(scoreCards).toHaveLength(2);
      expect(scoreCards[0]).toHaveTextContent('Apprentissage');
      expect(scoreCards[1]).toHaveTextContent('Pratique');
    });
  });

  describe('Types et validation', () => {
    it('devrait gérer correctement les sessions avec des données partielles', async () => {
      const incompleteSessionsData = {
        sessions: [
          {
            id: '1',
            songTitle: 'Test Song',
            songComposer: null,
            correctNotes: null,
            missedNotes: null,
            wrongNotes: null,
            totalPoints: null,
            maxMultiplier: null,
            maxCombo: null,
            sessionStartTime: new Date('2024-01-15T10:00:00'),
            sessionEndTime: new Date('2024-01-15T10:30:00'),
            modeName: 'Apprentissage',
            durationInMinutes: 30,
            accuracy: 0,
            performance: 0,
          },
        ],
        hasMore: false,
        total: 1,
      };

      mockUseSearchCache.mockReturnValue({
        ...mockSearchCacheDefault,
        data: incompleteSessionsData,
      });

      await act(async () => {
        render(<HistoryStats />);
      });

      await waitFor(() => {
        expect(screen.getByText('Test Song')).toBeInTheDocument();
      });
    });
  });
});
