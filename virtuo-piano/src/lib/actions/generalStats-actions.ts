'use server';

import { PerformancesServices } from '../services/performances-services';
import { getServerSession } from 'next-auth';
import { authOptions } from '../authoption';

export async function getSongsPropertyRepertory(): Promise<{
  success: boolean;
  data: {
    genre: { name: string; value: number }[];
    composer: { name: string; value: number }[];
    difficulty: { name: string; value: number }[];
  };
  error?: string;
}> {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      throw new Error('Accès non autorisé');
    }

    const userId = session.user.id;
    const rawData = await PerformancesServices.getSongsRepertory(userId);

    // Fonction utilitaire pour calculer les pourcentages
    const calculatePercentages = (
      items: string[]
    ): { name: string; value: number }[] => {
      const countMap: Record<string, number> = {};

      // Compter les occurrences
      items.forEach((item) => {
        countMap[item] = (countMap[item] || 0) + 1;
      });

      const total = items.length;

      // Calculer les pourcentages
      return Object.entries(countMap).map(([name, count]) => ({
        name,
        value: total > 0 ? Math.round((count / total) * 100) : 0,
      }));
    };

    const processedData = {
      genre: calculatePercentages(rawData.genre),
      composer: calculatePercentages(rawData.composer),
      difficulty: calculatePercentages(rawData.difficulty),
    };

    return {
      success: true,
      data: processedData,
    };
  } catch (error) {
    console.error('Échec du chargement des données');
    return {
      success: false,
      data: {
        genre: [],
        composer: [],
        difficulty: [],
      },
      error: 'Échec du chargement des données',
    };
  }
}

export async function getPracticeTimeComparison(
  interval: 'week' | 'month' | 'quarter'
): Promise<{
  success: boolean;
  data: {
    currentTime: number; // en minutes
    previousTime: number; // en minutes
    percentageChange: number; // pourcentage de changement
    formattedCurrentTime: string; // format "12H50"
    formattedPreviousTime: string; // format "12H50"
    trend: 'increase' | 'decrease' | 'stable';
  };
  error?: string;
}> {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      throw new Error('Accès non autorisé');
    }

    const userId = session.user.id;

    // Récupérer le temps de pratique pour l'intervalle actuel
    const currentTime = await PerformancesServices.getPracticeTimeForInterval(
      userId,
      interval
    );

    // Récupérer le temps de pratique pour l'intervalle précédent
    const previousTime =
      await PerformancesServices.getPracticeTimeForPreviousInterval(
        userId,
        interval
      );

    // Calculer le pourcentage de changement
    let percentageChange = 0;
    let trend: 'increase' | 'decrease' | 'stable' = 'stable';

    if (previousTime > 0) {
      percentageChange = Math.round(
        ((currentTime - previousTime) / previousTime) * 100
      );
      trend =
        percentageChange > 0
          ? 'increase'
          : percentageChange < 0
          ? 'decrease'
          : 'stable';
    }

    // Fonction pour formater le temps en "HH:MM"
    const formatTime = (minutes: number): string => {
      const hours = Math.floor(minutes / 60);
      const mins = minutes % 60;
      return `${hours}h${mins.toString().padStart(2, '0')}m`;
    };

    return {
      success: true,
      data: {
        currentTime,
        previousTime,
        percentageChange,
        formattedCurrentTime: formatTime(currentTime),
        formattedPreviousTime: formatTime(previousTime),
        trend,
      },
    };
  } catch (error) {
    console.error('Échec du chargement des données');
    return {
      success: false,
      data: {
        currentTime: 0,
        previousTime: 0,
        percentageChange: 0,
        formattedCurrentTime: '0H00',
        formattedPreviousTime: '0H00',
        trend: 'stable',
      },
      error: 'Échec du chargement des données',
    };
  }
}

export async function getStartedSongsComparison(
  interval: 'week' | 'month' | 'quarter'
): Promise<{
  success: boolean;
  data: {
    currentSongs: number;
    previousSongs: number;
    difference: number; // différence absolue
    totalSongs: number; // nombre total de morceaux dans la bibliothèque
    trend: 'increase' | 'decrease' | 'stable';
  };
  error?: string;
}> {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      throw new Error('Accès non autorisé');
    }

    const userId = session.user.id;

    // Récupérer le nombre de morceaux démarrés pour l'intervalle actuel
    const currentSongs = await PerformancesServices.getStartedSongsForInterval(
      userId,
      interval
    );

    // Récupérer le nombre de morceaux démarrés pour l'intervalle précédent
    const previousSongs =
      await PerformancesServices.getStartedSongsForPreviousInterval(
        userId,
        interval
      );

    // Récupérer le nombre total de morceaux dans la bibliothèque
    const totalSongs = await PerformancesServices.getTotalSongsInLibrary(
      userId
    );

    // Calculer la différence
    const difference = currentSongs - previousSongs;
    let trend: 'increase' | 'decrease' | 'stable' = 'stable';

    if (difference > 0) {
      trend = 'increase';
    } else if (difference < 0) {
      trend = 'decrease';
    }

    return {
      success: true,
      data: {
        currentSongs,
        previousSongs,
        difference,
        totalSongs,
        trend,
      },
    };
  } catch (error) {
    console.error('Échec du chargement des données');
    return {
      success: false,
      data: {
        currentSongs: 0,
        previousSongs: 0,
        difference: 0,
        totalSongs: 0,
        trend: 'stable',
      },
      error: 'Échec du chargement des données',
    };
  }
}
