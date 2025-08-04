'use server';

import {
  PerformancesServices,
  SongLearningModeTiles,
  SongLearningPerformanceData,
  SongLearningPrecisionData,
  SongPerformanceGeneralTiles,
  SongPlayModeTiles,
  SongPracticeData,
} from '@/lib/services/performances-services';

import { getAuthenticatedUser } from '../auth/get-authenticated-user';

export interface SongGeneralTilesActionResponse {
  success: boolean;
  data?: SongPerformanceGeneralTiles;
  error?: string;
}

export interface SongPracticeDataActionResponse {
  success: boolean;
  data?: SongPracticeData;
  error?: string;
}

export interface SongLearningPrecisionDataActionResponse {
  success: boolean;
  data?: SongLearningPrecisionData;
  error?: string;
}

export interface SongLearningPerformanceDataActionResponse {
  success: boolean;
  data?: SongLearningPerformanceData;
  error?: string;
}

export interface SongLearningModeTilesActionResponse {
  success: boolean;
  data?: SongLearningModeTiles;
  error?: string;
}

export interface SongPlayModeTilesActionResponse {
  success: boolean;
  data?: SongPlayModeTiles;
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

export async function getSongPracticeDataAction(
  songId: string,
  interval: number,
  index: number
): Promise<SongPracticeDataActionResponse> {
  try {
    const user = await getAuthenticatedUser();

    const data = await PerformancesServices.getSongPracticeData(
      songId,
      user.id,
      interval,
      index
    );

    return {
      success: true,
      data,
    };
  } catch (error) {
    console.error(
      'Erreur lors de la récupération des données de pratique:',
      error
    );
    return {
      success: false,
      error: 'Erreur lors de la récupération des données',
    };
  }
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

export async function getSongPlayModeTilesAction(
  songId: string
): Promise<SongPlayModeTilesActionResponse> {
  try {
    const user = await getAuthenticatedUser();

    const data = await PerformancesServices.getSongPlayModeTilesData(
      songId,
      user.id
    );

    return {
      success: true,
      data,
    };
  } catch (error) {
    console.error('Erreur lors de la récupération des tuiles de jeu:', error);
    return {
      success: false,
      error: 'Erreur lors de la récupération des données',
    };
  }
}

export async function getSongLearningPrecisionDataAction(
  songId: string,
  interval: number,
  index: number
): Promise<SongLearningPrecisionDataActionResponse> {
  try {
    const user = await getAuthenticatedUser();

    const data = await PerformancesServices.getSongLearningPrecisionData(
      songId,
      user.id,
      interval,
      index
    );

    return {
      success: true,
      data,
    };
  } catch (error) {
    console.error(
      'Erreur lors de la récupération des données de précision:',
      error
    );
    return {
      success: false,
      error: 'Erreur lors de la récupération des données',
    };
  }
}

export async function getSongLearningPerformanceDataAction(
  songId: string,
  interval: number,
  index: number
): Promise<SongLearningPerformanceDataActionResponse> {
  try {
    const user = await getAuthenticatedUser();

    const data = await PerformancesServices.getSongLearningPerformanceData(
      songId,
      user.id,
      interval,
      index
    );

    return {
      success: true,
      data,
    };
  } catch (error) {
    console.error(
      'Erreur lors de la récupération des données de performance:',
      error
    );
    return {
      success: false,
      error: 'Erreur lors de la récupération des données',
    };
  }
}
