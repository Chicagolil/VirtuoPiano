import { useQuery, useQueryClient } from '@tanstack/react-query';
import {
  getFavoriteSongsAction,
  getFavoriteSongsGenresAction,
  type FavoritesSongsResult,
} from '@/lib/actions/favorites-actions';

type UseFavoritesSongsParams = {
  page: number;
  search?: string;
  genre?: string;
  sortBy: 'title' | 'composer' | 'duration' | 'difficulty';
  sortOrder: 'asc' | 'desc';
};

export function useFavoritesSongs(params: UseFavoritesSongsParams) {
  const queryClient = useQueryClient();

  // Créer une clé de cache unique basée sur les paramètres
  const queryKey = [
    'favoritesSongs',
    params.page,
    params.search,
    params.genre,
    params.sortBy,
    params.sortOrder,
  ];

  const {
    data: favoritesSongsData,
    isLoading,
    error,
    refetch,
    isFetching,
  } = useQuery({
    queryKey,
    queryFn: async () => {
      return await getFavoriteSongsAction(
        params.page,
        params.search,
        params.genre,
        params.sortBy,
        params.sortOrder
      );
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes (anciennement cacheTime)
    refetchOnWindowFocus: false,
    retry: 2,
  });

  // Fonction pour vider le cache
  const clearCache = () => {
    queryClient.removeQueries({ queryKey: ['favoritesSongs'] });
  };

  // Fonction pour invalider et recharger
  const invalidateAndRefetch = () => {
    queryClient.invalidateQueries({ queryKey: ['favoritesSongs'] });
  };

  // Fonction pour mettre à jour les données en cache
  const updateCacheData = (newData: FavoritesSongsResult) => {
    queryClient.setQueryData(queryKey, newData);
  };

  // Vérifier si on a des données en cache
  const hasCache = queryClient.getQueryData(queryKey) !== undefined;

  return {
    data: favoritesSongsData,
    isLoading,
    error: error ? (error as Error).message : null,
    clearCache,
    refetch,
    invalidateAndRefetch,
    hasCache,
    updateCacheData,
    isFetching,
  };
}

// Hook pour charger tous les genres des chansons favorites (pour les filtres)
export function useFavoritesGenres() {
  const {
    data: favoritesGenres,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['favoritesSongsGenres'],
    queryFn: getFavoriteSongsGenresAction,
    staleTime: 10 * 60 * 1000, // 10 minutes
    gcTime: 30 * 60 * 1000, // 30 minutes
  });

  return {
    allGenres: favoritesGenres || [],
    isLoading,
    error: error ? (error as Error).message : null,
  };
}
