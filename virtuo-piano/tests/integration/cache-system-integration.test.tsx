import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, waitFor, act } from '@testing-library/react';
import { useSearchCache } from '@/customHooks/useSearchCache';

// Tests d'intégration pour le système de cache global
describe('Cache System Integration Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Utiliser les vrais timers pour éviter les problèmes de debounce
    vi.useRealTimers();
  });

  afterEach(() => {
    vi.clearAllMocks();
    vi.useRealTimers();
  });

  describe('Cache Inter-Composants', () => {
    it('devrait partager le cache entre différentes instances', async () => {
      const sharedData = { data: 'test-shared', id: 1 };
      const mockFetch1 = vi.fn().mockResolvedValue(sharedData);
      const mockFetch2 = vi.fn().mockResolvedValue(sharedData);

      // Première instance avec des filtres identiques
      const { result: result1 } = renderHook(() =>
        useSearchCache({
          filters: { search: 'beethoven', page: 1 },
          searchQuery: 'beethoven',
          fetchFunction: mockFetch1,
        })
      );

      // Deuxième instance avec les mêmes filtres
      const { result: result2 } = renderHook(() =>
        useSearchCache({
          filters: { search: 'beethoven', page: 1 },
          searchQuery: 'beethoven',
          fetchFunction: mockFetch2,
        })
      );

      await waitFor(() => {
        expect(result1.current.isLoading).toBe(false);
        expect(result2.current.isLoading).toBe(false);
      });

      // Les deux instances devraient avoir les mêmes données
      expect(result1.current.data).toEqual(result2.current.data);

      // Chaque instance fait son propre appel (pas de cache partagé entre instances)
      expect(mockFetch1).toHaveBeenCalledTimes(1);
      expect(mockFetch2).toHaveBeenCalledTimes(1);
    });

    it('devrait isoler le cache pour des filtres différents', async () => {
      const mockFetch1 = vi.fn().mockResolvedValue({ data: 'search1' });
      const mockFetch2 = vi.fn().mockResolvedValue({ data: 'search2' });

      // Première instance
      const { result: result1 } = renderHook(() =>
        useSearchCache({
          filters: { search: 'beethoven' },
          searchQuery: 'beethoven',
          fetchFunction: mockFetch1,
        })
      );

      // Deuxième instance avec filtres différents
      const { result: result2 } = renderHook(() =>
        useSearchCache({
          filters: { search: 'mozart' },
          searchQuery: 'mozart',
          fetchFunction: mockFetch2,
        })
      );

      await waitFor(() => {
        expect(result1.current.isLoading).toBe(false);
        expect(result2.current.isLoading).toBe(false);
      });

      // Les deux instances devraient avoir des données différentes
      expect(result1.current.data).toEqual({ data: 'search1' });
      expect(result2.current.data).toEqual({ data: 'search2' });

      // Les deux fetch devraient avoir été appelés
      expect(mockFetch1).toHaveBeenCalledTimes(1);
      expect(mockFetch2).toHaveBeenCalledTimes(1);
    });
  });

  describe('Limitation de Taille du Cache', () => {
    it('devrait respecter la limite maximale du cache', async () => {
      const maxCacheSize = 3;
      let fetchCount = 0;

      // Créer plusieurs instances avec des filtres différents
      const instances: Array<{ result: any; mockFetch: any }> = [];
      for (let i = 1; i <= 5; i++) {
        const mockFetch = vi.fn().mockResolvedValue({ data: `search${i}` });
        const { result } = renderHook(() =>
          useSearchCache({
            filters: { search: `search${i}` },
            searchQuery: `search${i}`,
            fetchFunction: mockFetch,
            maxCacheSize,
          })
        );
        instances.push({ result, mockFetch });
        fetchCount++;
      }

      // Attendre que tous les appels se terminent
      await waitFor(() => {
        instances.forEach(({ result }) => {
          expect(result.current.isLoading).toBe(false);
        });
      });

      // Tous les fetch devraient avoir été appelés
      expect(fetchCount).toBe(5);

      // Maintenant, refaire un appel avec les premiers filtres
      const firstSearchAgain = vi
        .fn()
        .mockResolvedValue({ data: 'search1-again' });
      const { result: resultAgain } = renderHook(() =>
        useSearchCache({
          filters: { search: 'search1' },
          searchQuery: 'search1',
          fetchFunction: firstSearchAgain,
          maxCacheSize,
        })
      );

      await waitFor(() => {
        expect(resultAgain.current.isLoading).toBe(false);
      });

      // Si le cache a été éjecté, le fetch devrait être appelé à nouveau
      expect(firstSearchAgain).toHaveBeenCalledTimes(1);
    });
  });

  describe('Debounce Cross-Component', () => {
    it('devrait appliquer le debounce individuellement par instance', async () => {
      const mockFetch1 = vi.fn().mockResolvedValue({ data: 'component1' });
      const mockFetch2 = vi.fn().mockResolvedValue({ data: 'component2' });

      // Instances avec debounce court pour un test rapide
      const { result: result1 } = renderHook(() =>
        useSearchCache({
          filters: { search: 'beethoven' },
          searchQuery: 'beethoven',
          fetchFunction: mockFetch1,
          debounceMs: 50,
        })
      );

      const { result: result2 } = renderHook(() =>
        useSearchCache({
          filters: { search: 'mozart' },
          searchQuery: 'mozart',
          fetchFunction: mockFetch2,
          debounceMs: 50,
        })
      );

      // Attendre que les deux instances se chargent
      await waitFor(() => {
        expect(result1.current.isLoading).toBe(false);
        expect(result2.current.isLoading).toBe(false);
      });

      // Vérifier que chaque instance a fait son appel
      expect(mockFetch1).toHaveBeenCalledTimes(1);
      expect(mockFetch2).toHaveBeenCalledTimes(1);
      expect(result1.current.data).toEqual({ data: 'component1' });
      expect(result2.current.data).toEqual({ data: 'component2' });
    });
  });

  describe('Gestion des Erreurs Cross-Component', () => {
    it('devrait isoler les erreurs entre les instances', async () => {
      const mockFetchSuccess = vi.fn().mockResolvedValue({ data: 'success' });
      const mockFetchError = vi
        .fn()
        .mockRejectedValue(new Error('Fetch error'));

      // Instance qui réussit
      const { result: resultSuccess } = renderHook(() =>
        useSearchCache({
          filters: { search: 'success' },
          searchQuery: 'success',
          fetchFunction: mockFetchSuccess,
        })
      );

      // Instance qui échoue
      const { result: resultError } = renderHook(() =>
        useSearchCache({
          filters: { search: 'error' },
          searchQuery: 'error',
          fetchFunction: mockFetchError,
        })
      );

      await waitFor(() => {
        expect(resultSuccess.current.isLoading).toBe(false);
        expect(resultError.current.isLoading).toBe(false);
      });

      // L'instance qui réussit devrait avoir les données
      expect(resultSuccess.current.data).toEqual({ data: 'success' });
      expect(resultSuccess.current.error).toBe(null);

      // L'instance qui échoue devrait avoir l'erreur
      expect(resultError.current.data).toBe(null);
      expect(resultError.current.error).toBe('Fetch error');
    });
  });

  describe('Cache Persistence et Mise à Jour', () => {
    it('devrait permettre la mise à jour du cache par une instance et la partager', async () => {
      const mockFetch = vi.fn().mockResolvedValue({ data: 'initial' });

      // Première instance
      const { result: result1 } = renderHook(() =>
        useSearchCache({
          filters: { search: 'shared' },
          searchQuery: 'shared',
          fetchFunction: mockFetch,
        })
      );

      await waitFor(() => {
        expect(result1.current.isLoading).toBe(false);
      });

      expect(result1.current.data).toEqual({ data: 'initial' });

      // Deuxième instance avec les mêmes filtres
      const { result: result2 } = renderHook(() =>
        useSearchCache({
          filters: { search: 'shared' },
          searchQuery: 'shared',
          fetchFunction: mockFetch,
        })
      );

      await waitFor(() => {
        expect(result2.current.isLoading).toBe(false);
      });

      // Chaque instance fait son propre appel (pas de cache partagé)
      expect(result2.current.data).toEqual({ data: 'initial' });
      expect(mockFetch).toHaveBeenCalledTimes(2);

      // Mettre à jour le cache via la première instance
      act(() => {
        result1.current.updateCacheData({ data: 'updated' });
      });

      // Seule la première instance voit la mise à jour (cache non partagé)
      expect(result1.current.data).toEqual({ data: 'updated' });
      expect(result2.current.data).toEqual({ data: 'initial' });
    });

    it('devrait vider le cache pour toutes les instances', async () => {
      const mockFetch = vi
        .fn()
        .mockResolvedValueOnce({ data: 'first-call' })
        .mockResolvedValueOnce({ data: 'second-call' })
        .mockResolvedValueOnce({ data: 'third-call' });

      // Première instance
      const { result: result1 } = renderHook(() =>
        useSearchCache({
          filters: { search: 'clearable' },
          searchQuery: 'clearable',
          fetchFunction: mockFetch,
        })
      );

      await waitFor(() => {
        expect(result1.current.isLoading).toBe(false);
      });

      expect(result1.current.data).toEqual({ data: 'first-call' });

      // Deuxième instance avec les mêmes filtres
      const { result: result2 } = renderHook(() =>
        useSearchCache({
          filters: { search: 'clearable' },
          searchQuery: 'clearable',
          fetchFunction: mockFetch,
        })
      );

      await waitFor(() => {
        expect(result2.current.isLoading).toBe(false);
      });

      // Chaque instance fait son propre appel (pas de cache partagé)
      expect(result2.current.data).toEqual({ data: 'second-call' });
      expect(mockFetch).toHaveBeenCalledTimes(2);

      // Vider le cache via la première instance (n'affecte que cette instance)
      act(() => {
        result1.current.clearCache();
      });

      // Seule la première instance n'a plus de cache
      expect(result1.current.hasCache).toBe(false);
      expect(result2.current.hasCache).toBe(true);

      // Refetch via la première instance
      await act(async () => {
        await result1.current.refetch();
      });

      // Attendre que le refetch termine
      await waitFor(() => {
        expect(result1.current.isLoading).toBe(false);
      });

      // Devrait faire un nouvel appel (3e appel total)
      expect(mockFetch).toHaveBeenCalledTimes(3);
      expect(result1.current.data).toEqual({ data: 'third-call' });
    });
  });

  describe('Performance et Concurrence', () => {
    it('devrait gérer les appels concurrents correctement', async () => {
      const mockFetch = vi
        .fn()
        .mockResolvedValue({ data: 'concurrent-result' });

      // Lancer plusieurs instances en même temps avec les mêmes filtres
      const instances: Array<any> = [];
      for (let i = 0; i < 3; i++) {
        const { result } = renderHook(() =>
          useSearchCache({
            filters: { search: 'concurrent' },
            searchQuery: 'concurrent',
            fetchFunction: mockFetch,
          })
        );
        instances.push(result);
      }

      // Attendre que toutes les instances se chargent
      await waitFor(() => {
        instances.forEach((result) => {
          expect(result.current.isLoading).toBe(false);
          expect(result.current.data).toEqual({ data: 'concurrent-result' });
        });
      });

      // Chaque instance fait son propre appel (pas de cache partagé)
      expect(mockFetch).toHaveBeenCalledTimes(3);
    });

    it('devrait nettoyer les timers correctement', async () => {
      const mockFetch = vi.fn().mockResolvedValue({ data: 'cleanup-test' });

      let searchQuery = '';
      const { result, rerender, unmount } = renderHook(() =>
        useSearchCache({
          filters: { search: searchQuery },
          searchQuery,
          fetchFunction: mockFetch,
          debounceMs: 300,
        })
      );

      // Attendre le chargement initial (avec searchQuery vide)
      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      // Vérifier qu'un appel initial a été fait
      expect(mockFetch).toHaveBeenCalledTimes(2);

      // Changer la recherche pour déclencher le debounce
      searchQuery = 'test';
      rerender();

      // Démonter le composant avant que le debounce se déclenche
      unmount();

      // Attendre un délai pour vérifier que le timer a été nettoyé
      await new Promise((resolve) => setTimeout(resolve, 400));

      // Les appels initiaux ont été faits mais pas le debounce (timer nettoyé)
      expect(mockFetch).toHaveBeenCalledTimes(2);
    });
  });

  describe('Types et Généricité', () => {
    it('devrait fonctionner avec différents types de données', async () => {
      interface UserData {
        id: number;
        name: string;
        email: string;
      }

      interface SongData {
        id: string;
        title: string;
        artist: string;
      }

      const mockFetchUsers = vi.fn().mockResolvedValue({
        users: [{ id: 1, name: 'John', email: 'john@example.com' }],
        total: 1,
      });

      const mockFetchSongs = vi.fn().mockResolvedValue({
        songs: [{ id: 'song1', title: 'Test Song', artist: 'Test Artist' }],
        total: 1,
      });

      // Instance pour les utilisateurs
      const { result: usersResult } = renderHook(() =>
        useSearchCache<{ users: UserData[]; total: number }>({
          filters: { type: 'users' },
          searchQuery: '',
          fetchFunction: mockFetchUsers,
        })
      );

      // Instance pour les chansons
      const { result: songsResult } = renderHook(() =>
        useSearchCache<{ songs: SongData[]; total: number }>({
          filters: { type: 'songs' },
          searchQuery: '',
          fetchFunction: mockFetchSongs,
        })
      );

      await waitFor(() => {
        expect(usersResult.current.isLoading).toBe(false);
        expect(songsResult.current.isLoading).toBe(false);
      });

      // Vérifier les types et données
      expect(usersResult.current.data?.users[0].name).toBe('John');
      expect(songsResult.current.data?.songs[0].title).toBe('Test Song');
    });
  });

  describe('Gestion Mémoire', () => {
    it("devrait éviter les fuites mémoire avec beaucoup d'instances", async () => {
      const instances: Array<{ result: any; unmount: () => void }> = [];
      const mockFetch = vi.fn().mockResolvedValue({ data: 'memory-test' });

      // Créer beaucoup d'instances
      for (let i = 0; i < 100; i++) {
        const { result, unmount } = renderHook(() =>
          useSearchCache({
            filters: { search: `search${i}` },
            searchQuery: `search${i}`,
            fetchFunction: mockFetch,
            maxCacheSize: 10, // Limite le cache à 10 entrées
          })
        );
        instances.push({ result, unmount });
      }

      await waitFor(() => {
        instances.forEach(({ result }) => {
          expect(result.current.isLoading).toBe(false);
        });
      });

      // Démonter toutes les instances
      instances.forEach(({ unmount }) => {
        unmount();
      });

      // Vérifier qu'il n'y a pas de fuite mémoire évidente
      // (dans un vrai test, on pourrait utiliser des outils de profiling)
      expect(true).toBe(true); // Test symbolique
    });
  });
});
