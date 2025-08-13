import { useQuery, useQueryClient } from '@tanstack/react-query';
import {
  getImportedSongsAction,
  getAllImportedSongsAction,
  type ImportedSongsResult,
} from '@/lib/actions/imports-actions';

type UseImportedSongsParams = {
  page: number;
  search?: string;
  genre?: string;
  favorites?: boolean;
  sortBy: 'title' | 'composer' | 'duration' | 'difficulty';
  sortOrder: 'asc' | 'desc';
};

export function useImportedSongs(params: UseImportedSongsParams) {
  const queryClient = useQueryClient();

  // Créer une clé de cache unique basée sur les paramètres
  const queryKey = [
    'importedSongs',
    params.page,
    params.search,
    params.genre,
    params.favorites,
    params.sortBy,
    params.sortOrder,
  ];

  const {
    data: importedSongsData,
    isLoading,
    error,
    refetch,
    isFetching,
  } = useQuery({
    queryKey,
    queryFn: async () => {
      return await getImportedSongsAction(
        params.page,
        params.search,
        params.genre,
        params.favorites,
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
    queryClient.removeQueries({ queryKey: ['importedSongs'] });
  };

  // Fonction pour invalider et recharger
  const invalidateAndRefetch = () => {
    queryClient.invalidateQueries({ queryKey: ['importedSongs'] });
  };

  // Fonction pour mettre à jour les données en cache
  const updateCacheData = (newData: ImportedSongsResult) => {
    queryClient.setQueryData(queryKey, newData);
  };

  // Vérifier si on a des données en cache
  const hasCache = queryClient.getQueryData(queryKey) !== undefined;

  return {
    data: importedSongsData,
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

// Hook pour charger tous les genres (pour les filtres)
export function useAllGenres() {
  const {
    data: allSongs,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['allImportedSongs'],
    queryFn: getAllImportedSongsAction,
    staleTime: 10 * 60 * 1000, // 10 minutes
    gcTime: 30 * 60 * 1000, // 30 minutes
  });

  const allGenres = allSongs
    ? Array.from(
        new Set(
          allSongs
            .filter((song) => song.genre)
            .map((song) => song.genre)
            .filter((genre): genre is string => genre !== null)
        )
      ).sort()
    : [];

  return {
    allGenres,
    isLoading,
    error: error ? (error as Error).message : null,
  };
}
