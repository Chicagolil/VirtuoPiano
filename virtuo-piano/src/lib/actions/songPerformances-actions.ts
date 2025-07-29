'use server';

import {
  PerformancesServices,
  SongLearningModeTiles,
  SongPerformanceGeneralTiles,
  SongPracticeData,
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

export interface SongPracticeDataMultipleActionResponse {
  success: boolean;
  data?: {
    current: SongPracticeData;
    previous?: SongPracticeData;
    next?: SongPracticeData;
  };
  error?: string;
}

export async function getSongPracticeDataMultipleAction(
  songId: string,
  interval: number,
  index: number
): Promise<SongPracticeDataMultipleActionResponse> {
  try {
    const user = await getAuthenticatedUser();

    // Récupérer les données actuelles, précédentes et suivantes en parallèle
    const [current, previous, next] = await Promise.all([
      PerformancesServices.getSongPracticeData(
        songId,
        user.id,
        interval,
        index
      ),
      index > 0
        ? PerformancesServices.getSongPracticeData(
            songId,
            user.id,
            interval,
            index - 1
          )
        : Promise.resolve(null),
      PerformancesServices.getSongPracticeData(
        songId,
        user.id,
        interval,
        index + 1
      ),
    ]);

    return {
      success: true,
      data: {
        current,
        previous: previous || undefined,
        next: next || undefined,
      },
    };
  } catch (error) {
    console.error(
      'Erreur lors de la récupération des données de pratique multiples:',
      error
    );
    return {
      success: false,
      error: 'Erreur lors de la récupération des données',
    };
  }
}

export interface SongLearningModeTilesActionResponse {
  success: boolean;
  data?: SongLearningModeTiles;
  error?: string;
}

export async function getSongLearningModeTilesAction(
  songId: string
): Promise<SongLearningModeTilesActionResponse> {
  try {
    const user = await getAuthenticatedUser();

    const data = await PerformancesServices.getSongLearningModeTilesData(
      songId,
      user.id
    );

    return {
      success: true,
      data,
    };
  } catch (error) {
    console.error(
      "Erreur lors de la récupération des tuiles d'apprentissage:",
      error
    );
    return {
      success: false,
      error: 'Erreur lors de la récupération des données',
    };
  }
}
