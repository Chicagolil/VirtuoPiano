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
      throw new Error('Utilisateur non connecté');
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
    console.error('Erreur lors de la récupération des données:', error);
    return {
      success: false,
      data: {
        genre: [],
        composer: [],
        difficulty: [],
      },
      error: error instanceof Error ? error.message : 'Erreur inconnue',
    };
  }
}

export async function getTotalPracticeTime(): Promise<{
  success: boolean;
  data: {
    totalTime: number;
  };
  error?: string;
}> {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      throw new Error('Utilisateur non connecté');
    }

    const userId = session.user.id;
    const rawData = await PerformancesServices.getTotalPracticeTime(userId);

    return {
      success: true,
      data: {
        totalTime: rawData.totalTime,
      },
    };
  } catch (error) {
    console.error('Erreur lors de la récupération des données:', error);
    return {
      success: false,
      data: {
        totalTime: 0,
      },
      error: error instanceof Error ? error.message : 'Erreur inconnue',
    };
  }
}
