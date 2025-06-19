'use server';

import {
  PerformancesServices,
  ScoreDurationData,
} from '@/lib/services/performances-services';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/authoption';

export async function getHeatmapData(
  year: number
): Promise<{ success: boolean; error?: string; data: ScoreDurationData[] }> {
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
    return { success: true, data };
  } catch (error) {
    console.error(
      'Erreur lors de la récupération des données pour le heatmap',
      error
    );
    return {
      success: false,
      error: 'Failed to get heatmap data',
      data: [],
    };
  }
}
