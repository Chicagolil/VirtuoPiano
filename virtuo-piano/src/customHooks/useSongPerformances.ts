import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getSongPerformanceGeneralTilesAction,
  getSongPracticeDataMultipleAction,
} from '@/lib/actions/songPerformances-actions';

// Hook pour les tuiles générales
export function useSongPerformanceGeneralTiles(songId: string) {
  return useQuery({
    queryKey: ['songPerformanceGeneralTiles', songId],
    queryFn: () => getSongPerformanceGeneralTilesAction(songId),
    enabled: !!songId,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
}

// Hook pour les données de pratique avec préchargement
export function useSongPracticeData(
  songId: string,
  interval: number,
  index: number
) {
  return useQuery({
    queryKey: ['songPracticeData', songId, interval, index],
    queryFn: () => getSongPracticeDataMultipleAction(songId, interval, index),
    enabled: !!songId,
    staleTime: 1 * 60 * 1000, // 1 minute
    placeholderData: (previousData) => previousData, // Garde les anciennes données pendant le chargement
  });
}

// Hook pour précharger les données adjacentes
export function usePrefetchAdjacentData(
  songId: string,
  interval: number,
  currentIndex: number
) {
  const queryClient = useQueryClient();

  const prefetchAdjacent = () => {
    // Précharger l'index précédent
    if (currentIndex > 0) {
      queryClient.prefetchQuery({
        queryKey: ['songPracticeData', songId, interval, currentIndex - 1],
        queryFn: () =>
          getSongPracticeDataMultipleAction(songId, interval, currentIndex - 1),
        staleTime: 1 * 60 * 1000,
      });
    }

    // Précharger l'index suivant
    queryClient.prefetchQuery({
      queryKey: ['songPracticeData', songId, interval, currentIndex + 1],
      queryFn: () =>
        getSongPracticeDataMultipleAction(songId, interval, currentIndex + 1),
      staleTime: 1 * 60 * 1000,
    });
  };

  return { prefetchAdjacent };
}

// Hook pour invalider le cache
export function useInvalidatePracticeCache() {
  const queryClient = useQueryClient();

  const invalidateCache = (songId?: string) => {
    if (songId) {
      // Invalider seulement pour cette chanson
      queryClient.invalidateQueries({
        queryKey: ['songPracticeData', songId],
      });
      queryClient.invalidateQueries({
        queryKey: ['songPerformanceGeneralTiles', songId],
      });
    } else {
      // Invalider tout le cache de pratique
      queryClient.invalidateQueries({
        queryKey: ['songPracticeData'],
      });
      queryClient.invalidateQueries({
        queryKey: ['songPerformanceGeneralTiles'],
      });
    }
  };

  return { invalidateCache };
}
