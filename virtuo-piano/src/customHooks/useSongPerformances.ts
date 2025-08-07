import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getSongLearningModeTilesAction,
  getSongPerformanceGeneralTilesAction,
  getSongPlayModeTilesAction,
  getSongPracticeDataAction,
  getSongLearningPrecisionDataAction,
  getSongLearningPerformanceDataAction,
  getSongPerformancePrecisionBarChartDataAction,
  getSongGamingLineChartDataAction,
  getSongGamingBarChartDataAction,
} from '@/lib/actions/songPerformances-actions';

// Hook pour les tuiles générales
export function useSongPerformanceGeneralTiles(songId: string) {
  return useQuery({
    queryKey: ['songPerformanceGeneralTiles', songId],
    queryFn: () => getSongPerformanceGeneralTilesAction(songId),
    enabled: !!songId,
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
    queryFn: () => getSongPracticeDataAction(songId, interval, index),
    enabled: !!songId,
    staleTime: 2 * 60 * 1000, // 2 minutes
    placeholderData: (previousData) => previousData,
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
          getSongPracticeDataAction(songId, interval, currentIndex - 1),
        staleTime: 2 * 60 * 1000,
      });
    }

    // Précharger l'index suivant
    queryClient.prefetchQuery({
      queryKey: ['songPracticeData', songId, interval, currentIndex + 1],
      queryFn: () =>
        getSongPracticeDataAction(songId, interval, currentIndex + 1),
      staleTime: 2 * 60 * 1000,
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
      queryClient.invalidateQueries({
        queryKey: ['songLearningModeTiles', songId],
      });
      queryClient.invalidateQueries({
        queryKey: ['songPlayModeTiles', songId],
      });
      queryClient.invalidateQueries({
        queryKey: ['songLearningPrecisionData', songId],
      });
      queryClient.invalidateQueries({
        queryKey: ['songGamingLineChartData', songId],
      });
    } else {
      // Invalider tout le cache de pratique
      queryClient.invalidateQueries({
        queryKey: ['songPracticeData'],
      });
      queryClient.invalidateQueries({
        queryKey: ['songPerformanceGeneralTiles'],
      });
      queryClient.invalidateQueries({
        queryKey: ['songLearningModeTiles'],
      });
      queryClient.invalidateQueries({
        queryKey: ['songPlayModeTiles'],
      });
      queryClient.invalidateQueries({
        queryKey: ['songLearningPrecisionData'],
      });
      queryClient.invalidateQueries({
        queryKey: ['songGamingLineChartData'],
      });
    }
  };

  const invalidatePracticeDataOnly = (songId?: string) => {
    if (songId) {
      // Invalider seulement les données de pratique (graphiques)
      queryClient.invalidateQueries({
        queryKey: ['songPracticeData', songId],
      });
    } else {
      queryClient.invalidateQueries({
        queryKey: ['songPracticeData'],
      });
    }
  };

  const invalidatePrecisionDataOnly = (songId?: string) => {
    if (songId) {
      // Invalider seulement les données de précision
      queryClient.invalidateQueries({
        queryKey: ['songLearningPrecisionData', songId],
      });
    } else {
      queryClient.invalidateQueries({
        queryKey: ['songLearningPrecisionData'],
      });
    }
  };

  const invalidatePerformanceDataOnly = (songId?: string) => {
    if (songId) {
      queryClient.invalidateQueries({
        queryKey: ['songLearningPerformanceData', songId],
      });
    } else {
      queryClient.invalidateQueries({
        queryKey: ['songLearningPerformanceData'],
      });
    }
  };

  const invalidateGamingLineChartDataOnly = (songId?: string) => {
    if (songId) {
      queryClient.invalidateQueries({
        queryKey: ['songGamingLineChartData', songId],
      });
    } else {
      queryClient.invalidateQueries({
        queryKey: ['songGamingLineChartData'],
      });
    }
  };

  return {
    invalidateCache,
    invalidatePracticeDataOnly,
    invalidatePrecisionDataOnly,
    invalidatePerformanceDataOnly,
    invalidateGamingLineChartDataOnly,
  };
}

// Hook pour les tuiles d'apprentissage
export function useSongLearningModeTiles(songId: string) {
  return useQuery({
    queryKey: ['songLearningModeTiles', songId],
    queryFn: () => getSongLearningModeTilesAction(songId),
    enabled: !!songId,
  });
}

// hook tuiles de jeu
export function useSongPlayModeTiles(songId: string) {
  return useQuery({
    queryKey: ['songPlayModeTiles', songId],
    queryFn: () => getSongPlayModeTilesAction(songId),
    enabled: !!songId,
  });
}

// Hook pour les données de précision d'apprentissage
export function useSongLearningPrecisionData(
  songId: string,
  interval: number,
  index: number
) {
  return useQuery({
    queryKey: ['songLearningPrecisionData', songId, interval, index],
    queryFn: () => getSongLearningPrecisionDataAction(songId, interval, index),
    enabled: !!songId,
    staleTime: 2 * 60 * 1000, // 2 minutes
    placeholderData: (previousData) => previousData,
  });
}

// Hook pour précharger les données de précision adjacentes
export function usePrefetchLearningPrecisionData(
  songId: string,
  interval: number,
  currentIndex: number
) {
  const queryClient = useQueryClient();

  const prefetchAdjacent = () => {
    // Précharger l'index précédent
    if (currentIndex > 0) {
      queryClient.prefetchQuery({
        queryKey: [
          'songLearningPrecisionData',
          songId,
          interval,
          currentIndex - 1,
        ],
        queryFn: () =>
          getSongLearningPrecisionDataAction(
            songId,
            interval,
            currentIndex - 1
          ),
        staleTime: 2 * 60 * 1000,
      });
    }

    // Précharger l'index suivant
    queryClient.prefetchQuery({
      queryKey: [
        'songLearningPrecisionData',
        songId,
        interval,
        currentIndex + 1,
      ],
      queryFn: () =>
        getSongLearningPrecisionDataAction(songId, interval, currentIndex + 1),
      staleTime: 2 * 60 * 1000,
    });
  };

  return { prefetchAdjacent };
}

export function useSongLearningPerformanceData(
  songId: string,
  interval: number,
  index: number
) {
  return useQuery({
    queryKey: ['songLearningPerformanceData', songId, interval, index],
    queryFn: () =>
      getSongLearningPerformanceDataAction(songId, interval, index),
    enabled: !!songId,
    staleTime: 2 * 60 * 1000, // 2 minutes
    placeholderData: (previousData) => previousData,
  });
}

export function usePrefetchLearningPerformanceData(
  songId: string,
  interval: number,
  currentIndex: number
) {
  const queryClient = useQueryClient();

  const prefetchAdjacent = () => {
    // Précharger l'index précédent
    if (currentIndex > 0) {
      queryClient.prefetchQuery({
        queryKey: [
          'songLearningPerformanceData',
          songId,
          interval,
          currentIndex - 1,
        ],
        queryFn: () =>
          getSongLearningPerformanceDataAction(
            songId,
            interval,
            currentIndex - 1
          ),
        staleTime: 2 * 60 * 1000,
      });
    }

    // Précharger l'index suivant
    queryClient.prefetchQuery({
      queryKey: [
        'songLearningPerformanceData',
        songId,
        interval,
        currentIndex + 1,
      ],
      queryFn: () =>
        getSongLearningPerformanceDataAction(
          songId,
          interval,
          currentIndex + 1
        ),
      staleTime: 2 * 60 * 1000,
    });
  };

  return { prefetchAdjacent };
}

// Hook pour les données de bar chart précision/performance
export function useSongPerformancePrecisionBarChartData(
  songId: string,
  index: number
) {
  return useQuery({
    queryKey: ['songPerformancePrecisionBarChartData', songId, index],
    queryFn: () => getSongPerformancePrecisionBarChartDataAction(songId, index),
    enabled: !!songId,
    staleTime: 5 * 60 * 1000,
    placeholderData: (previousData) => previousData,
  });
}

// Hook pour précharger les données de bar chart adjacentes
export function usePrefetchPerformancePrecisionBarChartData(
  songId: string,
  currentIndex: number
) {
  const queryClient = useQueryClient();

  const prefetchAdjacent = () => {
    // Précharger l'index précédent
    if (currentIndex > 0) {
      queryClient.prefetchQuery({
        queryKey: [
          'songPerformancePrecisionBarChartData',
          songId,
          currentIndex - 1,
        ],
        queryFn: () =>
          getSongPerformancePrecisionBarChartDataAction(
            songId,
            currentIndex - 1
          ),
        staleTime: 5 * 60 * 1000,
      });
    }

    // Précharger l'index suivant
    queryClient.prefetchQuery({
      queryKey: [
        'songPerformancePrecisionBarChartData',
        songId,
        currentIndex + 1,
      ],
      queryFn: () =>
        getSongPerformancePrecisionBarChartDataAction(songId, currentIndex + 1),
      staleTime: 5 * 60 * 1000,
    });
  };

  return { prefetchAdjacent };
}

export function useSongGamingLineChartData(
  songId: string,
  index: number,
  interval: number
) {
  return useQuery({
    queryKey: ['songGamingLineChartData', songId, index, interval],
    queryFn: () => getSongGamingLineChartDataAction(songId, index, interval),
    enabled: !!songId,
    staleTime: 2 * 60 * 1000,
    placeholderData: (previousData) => previousData,
  });
}

export function usePrefetchGamingLineChartData(
  songId: string,
  interval: number,
  currentIndex: number
) {
  const queryClient = useQueryClient();

  const prefetchAdjacent = () => {
    // Précharger l'index précédent
    if (currentIndex > 0) {
      queryClient.prefetchQuery({
        queryKey: [
          'songGamingLineChartData',
          songId,
          currentIndex - 1,
          interval,
        ],
        queryFn: () =>
          getSongGamingLineChartDataAction(songId, currentIndex - 1, interval),
        staleTime: 2 * 60 * 1000,
      });
    }

    // Précharger l'index suivant
    queryClient.prefetchQuery({
      queryKey: ['songGamingLineChartData', songId, currentIndex + 1, interval],
      queryFn: () =>
        getSongGamingLineChartDataAction(songId, currentIndex + 1, interval),
      staleTime: 2 * 60 * 1000,
    });
  };

  return { prefetchAdjacent };
}

export function useSongGamingBarChartData(songId: string, index: number) {
  return useQuery({
    queryKey: ['songGamingBarChartData', songId, index],
    queryFn: () => getSongGamingBarChartDataAction(songId, index),
    enabled: !!songId,
    staleTime: 5 * 60 * 1000,
    placeholderData: (previousData) => previousData,
  });
}

export function usePrefetchGamingBarChartData(
  songId: string,
  currentIndex: number
) {
  const queryClient = useQueryClient();

  const prefetchAdjacent = () => {
    // Précharger l'index précédent
    if (currentIndex > 0) {
      queryClient.prefetchQuery({
        queryKey: ['songGamingBarChartData', songId, currentIndex - 1],
        queryFn: () =>
          getSongGamingBarChartDataAction(songId, currentIndex - 1),
        staleTime: 5 * 60 * 1000,
      });
    }

    // Précharger l'index suivant
    queryClient.prefetchQuery({
      queryKey: ['songGamingBarChartData', songId, currentIndex + 1],
      queryFn: () => getSongGamingBarChartDataAction(songId, currentIndex + 1),
      staleTime: 5 * 60 * 1000,
    });
  };

  return { prefetchAdjacent };
}
