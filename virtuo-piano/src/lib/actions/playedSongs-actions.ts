'use server';

import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/authoption';
import { PlayedSong } from '@/lib/types';
import { PerformancesServices } from '../services/performances-services';

export type PlayedSongsResult = {
  songs: PlayedSong[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalSongs: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
};

export async function getPlayedSongsAction(
  page: number = 1,
  searchQuery?: string,
  genreFilter?: string,
  favoritesOnly?: boolean,
  sortBy?:
    | 'title'
    | 'composer'
    | 'lastPlayed'
    | 'genre'
    | 'duration'
    | 'difficulty',
  sortOrder?: 'asc' | 'desc'
): Promise<PlayedSongsResult> {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      throw new Error('Accès non autorisé');
    }

    const result = await PerformancesServices.getPlayedSongs(
      session.user.id,
      {
        page,
        limit: 20, // 20 chansons par page
      },
      {
        searchQuery,
        genreFilter,
        favoritesOnly,
        sortBy,
        sortOrder,
      }
    );

    return result;
  } catch (error) {
    console.error('Erreur lors de la récupération des chansons jouées:', error);
    throw new Error('Impossible de récupérer les chansons jouées');
  }
}

// Action pour récupérer uniquement les genres des chansons jouées
export async function getPlayedSongsGenresAction(): Promise<string[]> {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      throw new Error('Accès non autorisé');
    }

    const genres = await PerformancesServices.getPlayedSongsGenres(
      session.user.id
    );
    return genres;
  } catch (error) {
    console.error(
      'Erreur lors de la récupération des genres des chansons jouées:',
      error
    );
    throw new Error('Impossible de récupérer les genres');
  }
}
