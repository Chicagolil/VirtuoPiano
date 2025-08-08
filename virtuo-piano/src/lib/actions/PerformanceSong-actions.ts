'use server';

import { getServerSession } from 'next-auth';
import { SongBasicData } from '@/lib/types';
import { PerformancesServices } from '../services/performances-services';
import { authOptions } from '../authoption';

export async function getSongBasicDataAction(songId: string): Promise<{
  success: boolean;
  data: SongBasicData;
  error?: string;
}> {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      throw new Error('Accès non autorisé');
    }

    const userId = session.user.id;

    const song = await PerformancesServices.getSongBasicData(songId, userId);

    return { success: true, data: song };
  } catch (error) {
    console.error(
      'Erreur lors de la récupération des données de la chanson',
      error
    );
    return {
      success: false,
      data: {
        id: '',
        title: '',
        composer: '',
        imageUrl: '',
        duration_ms: 0,
        genre: '',
        tempo: 0,
        Level: 0,
        isFavorite: false,
      },
      error: 'Erreur lors de la récupération des données de la chanson',
    };
  }
}
