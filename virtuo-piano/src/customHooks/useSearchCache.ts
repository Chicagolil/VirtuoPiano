import { useState, useMemo, useCallback, useEffect, useRef } from 'react';

// Types génériques pour le cache
type CacheKey = string;
type CacheEntry<T> = {
  data: T;
  timestamp: Date;
};

type UseSearchCacheOptions<T> = {
  filters: Record<string, any>;
  searchQuery: string;
  fetchFunction: () => Promise<T>;
  debounceMs?: number;
  maxCacheSize?: number;
};

type UseSearchCacheReturn<T> = {
  data: T | null;
  isLoading: boolean;
  error: string | null;
  clearCache: () => void;
  refetch: () => Promise<void>;
  hasCache: boolean;
};

export function useSearchCache<T>({
  filters,
  searchQuery,
  fetchFunction,
  debounceMs = 300,
  maxCacheSize = 10,
}: UseSearchCacheOptions<T>): UseSearchCacheReturn<T> {
  const [cache, setCache] = useState<Map<CacheKey, CacheEntry<T>>>(new Map());
  const [data, setData] = useState<T | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const initialLoadRef = useRef(false);

  // Générer la clé de cache basée sur les filtres
  const cacheKey = useMemo(() => {
    return JSON.stringify(filters);
  }, [filters]);

  // Fonction pour vider le cache
  const clearCache = useCallback(() => {
    setCache(new Map());
  }, []);

  // Fonction pour charger les données avec cache intelligent
  const loadData = useCallback(
    async (forceRefresh = false) => {
      try {
        // Vérifier si on a les données en cache
        const currentCacheEntry = cache.get(cacheKey);

        if (currentCacheEntry && !forceRefresh) {
          // On a les données en cache, les utiliser immédiatement
          setData(currentCacheEntry.data);
          setError(null);
          setIsLoading(false);
          return;
        }

        setIsLoading(true);
        setError(null);

        const result = await fetchFunction();
        setData(result);

        // Mettre à jour le cache
        const newCacheEntry: CacheEntry<T> = {
          data: result,
          timestamp: new Date(),
        };

        setCache((prevCache) => {
          const newCache = new Map(prevCache);
          newCache.set(cacheKey, newCacheEntry);

          // Limiter la taille du cache
          if (newCache.size > maxCacheSize) {
            const oldestKey = Array.from(newCache.keys())[0];
            newCache.delete(oldestKey);
          }

          return newCache;
        });
      } catch (err) {
        setError(
          err instanceof Error ? err.message : 'Erreur lors du chargement'
        );
        setData(null);
      } finally {
        setIsLoading(false);
      }
    },
    [cacheKey, cache, fetchFunction, maxCacheSize]
  );

  // Fonction de refetch publique
  const refetch = useCallback(() => {
    return loadData(true);
  }, [loadData]);

  // Effet pour charger depuis le cache ou faire une nouvelle requête
  useEffect(() => {
    const currentCacheEntry = cache.get(cacheKey);

    if (currentCacheEntry) {
      // On a les données en cache, les utiliser immédiatement
      setData(currentCacheEntry.data);
      setError(null);
      setIsLoading(false);
    } else {
      // Pas de cache, charger avec debounce pour la recherche textuelle
      if (searchQuery.trim()) {
        const timer = setTimeout(() => {
          loadData();
        }, debounceMs);

        return () => clearTimeout(timer);
      } else {
        // Chargement immédiat pour les filtres non-textuels
        loadData();
      }
    }
  }, [cacheKey, cache, searchQuery, loadData, debounceMs]);

  // Chargement initial unique
  useEffect(() => {
    if (!initialLoadRef.current) {
      initialLoadRef.current = true;
      loadData();
    }
  }, []);

  return {
    data,
    isLoading,
    error,
    clearCache,
    refetch,
    hasCache: cache.has(cacheKey),
  };
}
