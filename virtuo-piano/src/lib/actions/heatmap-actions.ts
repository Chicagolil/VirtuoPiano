'use server';

import {
  PerformancesServices,
  ScoreDurationData,
  SessionDetail,
} from '@/lib/services/performances-services';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/authoption';

export async function getHeatmapData(year: number): Promise<{
  success: boolean;
  data: ScoreDurationData[];
  error?: string;
}> {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      throw new Error('Utilisateur non connecté');
    }

    const userId = session.user.id;
    const data = await PerformancesServices.getPracticeDataForHeatmap(
      userId,
      year
    );

    return {
      success: true,
      data,
    };
  } catch (error) {
    console.error('Erreur lors de la récupération des données heatmap:', error);
    return {
      success: false,
      data: [],
      error: error instanceof Error ? error.message : 'Erreur inconnue',
    };
  }
}

export async function getSessionsByDate(date: string): Promise<{
  success: boolean;
  data: SessionDetail[];
  error?: string;
}> {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      throw new Error('Utilisateur non connecté');
    }

    const userId = session.user.id;
    const dateObj = new Date(date);
    const data = await PerformancesServices.getSessionsByDate(userId, dateObj);

    return {
      success: true,
      data,
    };
  } catch (error) {
    console.error('Erreur lors de la récupération des sessions:', error);
    return {
      success: false,
      data: [],
      error: error instanceof Error ? error.message : 'Erreur inconnue',
    };
  }
}
