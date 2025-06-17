'use server';

import { PerformancesServices } from '@/lib/services/performances-services';

export async function getHeatmapData(userId: string, year: number) {
  try {
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
    return { success: false, error: 'Failed to get heatmap data' };
  }
}
