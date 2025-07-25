'use server';

import {
  PerformancesServices,
  SongPerformanceGeneralTiles,
} from '@/lib/services/performances-services';

import { getAuthenticatedUser } from '../auth/get-authenticated-user';

export interface SongGeneralTilesActionResponse {
  success: boolean;
  data?: SongPerformanceGeneralTiles;
  error?: string;
}

export async function getSongPerformanceGeneralTilesAction(
  songId: string
): Promise<SongGeneralTilesActionResponse> {
  try {
    const user = await getAuthenticatedUser();

    // Récupérer les données depuis le service
    const data = await PerformancesServices.getSongPerformanceGeneralTilesData(
      songId,
      user.id
    );

    return {
      success: true,
      data,
    };
  } catch (error) {
    console.error(
      'Erreur lors de la récupération des tuiles générales:',
      error
    );
    return {
      success: false,
      error: 'Erreur lors de la récupération des données',
    };
  }
}
