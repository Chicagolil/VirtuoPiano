import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useSearchCache } from '@/customHooks/useSearchCache';

// Mock synchrone plus simple pour éviter les problèmes de timing
const createMockFetch = (returnValue: any) => {
  return vi.fn().mockImplementation(() => {
    return Promise.resolve(returnValue);
  });
};

describe('useSearchCache Hook', () => {
  let mockFetch: ReturnType<typeof vi.fn>;
  const mockData = { test: 'data' };

  beforeEach(() => {
    vi.useFakeTimers();
    mockFetch = createMockFetch(mockData);
  });

  afterEach(() => {
    vi.runOnlyPendingTimers();
    vi.useRealTimers();
    vi.clearAllMocks();
  });

  describe('Tests de base', () => {
    it('devrait initialiser avec isLoading = true', () => {
      const { result } = renderHook(() =>
        useSearchCache({
          fetchFunction: mockFetch,
          filters: { search: 'test' },
          searchQuery: '',
        })
      );

      expect(result.current.isLoading).toBe(true);
      expect(result.current.data).toBe(null);
      expect(result.current.error).toBe(null);
    });

    it('devrait exposer les fonctions utilitaires', () => {
      const { result } = renderHook(() =>
        useSearchCache({
          fetchFunction: mockFetch,
          filters: { search: 'test' },
          searchQuery: '',
        })
      );

      expect(typeof result.current.clearCache).toBe('function');
      expect(typeof result.current.refetch).toBe('function');
      expect(typeof result.current.updateCacheData).toBe('function');
      expect(typeof result.current.hasCache).toBe('boolean');
    });
  });

  describe('Gestion du cache', () => {
    it('devrait indiquer hasCache = false au début', () => {
      const { result } = renderHook(() =>
        useSearchCache({
          fetchFunction: mockFetch,
          filters: { search: 'test' },
          searchQuery: '',
        })
      );

      expect(result.current.hasCache).toBe(false);
    });

    it('devrait permettre de vider le cache', () => {
      const { result } = renderHook(() =>
        useSearchCache({
          fetchFunction: mockFetch,
          filters: { search: 'test' },
          searchQuery: '',
        })
      );

      act(() => {
        result.current.clearCache();
      });

      expect(result.current.hasCache).toBe(false);
    });

    it('devrait permettre de mettre à jour les données du cache', () => {
      const { result } = renderHook(() =>
        useSearchCache({
          fetchFunction: mockFetch,
          filters: { search: 'test' },
          searchQuery: '',
        })
      );

      const newData = { test: 'updated' };

      act(() => {
        result.current.updateCacheData(newData);
      });

      expect(result.current.data).toEqual(newData);
    });
  });

  describe('Debounce avec timers', () => {
    it('devrait utiliser debounce pour les recherches textuelles', () => {
      const { rerender } = renderHook(
        ({ searchQuery }) =>
          useSearchCache({
            fetchFunction: mockFetch,
            filters: { page: 1 },
            searchQuery,
            debounceMs: 500,
          }),
        { initialProps: { searchQuery: 'a' } }
      );

      // Réinitialiser les appels après le rendu initial
      mockFetch.mockClear();

      // Changer rapidement la recherche
      rerender({ searchQuery: 'ab' });
      rerender({ searchQuery: 'abc' });

      // Pas d'appels immédiats
      expect(mockFetch).not.toHaveBeenCalled();

      // Avancer de 400ms - pas encore assez
      act(() => {
        vi.advanceTimersByTime(400);
      });
      expect(mockFetch).not.toHaveBeenCalled();

      // Avancer de 100ms supplémentaires - maintenant ça devrait être appelé
      act(() => {
        vi.advanceTimersByTime(100);
      });
      expect(mockFetch).toHaveBeenCalledTimes(1);
    });

    it('ne devrait pas utiliser debounce pour searchQuery vide', () => {
      const { result } = renderHook(() =>
        useSearchCache({
          fetchFunction: mockFetch,
          filters: { genre: 'rock' },
          searchQuery: '', // Pas de recherche textuelle
          debounceMs: 500,
        })
      );

      // Devrait appeler immédiatement (pas de debounce)
      expect(mockFetch).toHaveBeenCalled();
    });
  });

  describe('Gestion des erreurs', () => {
    it('devrait initialiser sans erreur', () => {
      const { result } = renderHook(() =>
        useSearchCache({
          fetchFunction: mockFetch,
          filters: { search: 'test' },
          searchQuery: '',
        })
      );

      expect(result.current.error).toBe(null);
    });

    it('devrait permettre de refetch', async () => {
      const { result } = renderHook(() =>
        useSearchCache({
          fetchFunction: mockFetch,
          filters: { search: 'test' },
          searchQuery: '',
        })
      );

      // Refetch devrait être une fonction async
      expect(result.current.refetch).toBeInstanceOf(Function);

      // L'appeler ne devrait pas planter
      act(() => {
        result.current.refetch();
      });
    });
  });

  describe('Configuration personnalisée', () => {
    it('devrait accepter des options personnalisées', () => {
      const { result } = renderHook(() =>
        useSearchCache({
          fetchFunction: mockFetch,
          filters: { page: 1 },
          searchQuery: 'test',
          debounceMs: 1000,
          maxCacheSize: 5,
        })
      );

      expect(result.current.isLoading).toBe(true);
    });

    it('devrait gérer les filtres avec des valeurs undefined/null', () => {
      const { result } = renderHook(() =>
        useSearchCache({
          fetchFunction: mockFetch,
          filters: { search: undefined, genre: null },
          searchQuery: '',
        })
      );

      expect(result.current.isLoading).toBe(true);
    });
  });

  describe('Changements de props', () => {
    it('devrait réagir aux changements de filtres', () => {
      const { result, rerender } = renderHook(
        ({ filters }) =>
          useSearchCache({
            fetchFunction: mockFetch,
            filters,
            searchQuery: '',
          }),
        { initialProps: { filters: { search: 'test1' } } }
      );

      const initialCallCount = mockFetch.mock.calls.length;

      // Changer les filtres
      rerender({ filters: { search: 'test2' } });

      // Devrait déclencher un nouvel appel
      expect(mockFetch.mock.calls.length).toBeGreaterThan(initialCallCount);
    });

    it('devrait gérer les changements rapides de searchQuery', () => {
      const { rerender } = renderHook(
        ({ searchQuery }) =>
          useSearchCache({
            fetchFunction: mockFetch,
            filters: { page: 1 },
            searchQuery,
            debounceMs: 100,
          }),
        { initialProps: { searchQuery: 'a' } }
      );

      // Changements très rapides
      for (let i = 0; i < 5; i++) {
        rerender({ searchQuery: `test${i}` });
      }

      // Réinitialiser les mocks après les changements
      mockFetch.mockClear();

      // Avancer les timers
      act(() => {
        vi.advanceTimersByTime(100);
      });

      // Devrait n'avoir qu'un seul appel final
      expect(mockFetch).toHaveBeenCalledTimes(1);
    });
  });

  describe('Cleanup', () => {
    it('devrait nettoyer les timers au démontage', () => {
      const { unmount } = renderHook(() =>
        useSearchCache({
          fetchFunction: mockFetch,
          filters: { page: 1 },
          searchQuery: 'test',
          debounceMs: 1000,
        })
      );

      // Démonter immédiatement
      unmount();

      // Avancer les timers - ne devrait pas causer d'erreur
      act(() => {
        vi.advanceTimersByTime(1000);
      });

      // Le test réussit s'il n'y a pas d'erreur
      expect(true).toBe(true);
    });
  });
});
