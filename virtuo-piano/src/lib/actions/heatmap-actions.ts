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
      throw new Error('Accès non autorisé');
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
    console.error('Échec du chargement des données');
    return {
      success: false,
      data: [],
      error: 'Échec du chargement des données',
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
      throw new Error('Accès non autorisé');
    }

    const userId = session.user.id;
    const dateObj = new Date(date);
    const data = await PerformancesServices.getSessionsByDate(userId, dateObj);

    return {
      success: true,
      data,
    };
  } catch (error) {
    console.error('Échec du chargement des données');
    return {
      success: false,
      data: [],
      error: 'Échec du chargement des données',
    };
  }
}
