'use server';

import { getServerSession } from 'next-auth';
import { PlayedSong } from '../types';
import { ImportsServices } from '../services/imports-services';
import { authOptions } from '../authoption';

export type ImportedSongsResult = {
  songs: PlayedSong[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalSongs: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
};

export async function getImportedSongsAction(
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
): Promise<ImportedSongsResult> {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      throw new Error('Accès non autorisé');
    }

    const result = await ImportsServices.getImportedSongs(
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
    console.error(
      'Erreur lors de la récupération des chansons importées:',
      error
    );
    throw new Error('Impossible de récupérer les chansons importées');
  }
}

// Action pour récupérer uniquement les genres des chansons importées
export async function getImportedSongsGenresAction(): Promise<string[]> {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      throw new Error('Accès non autorisé');
    }

    const genres = await ImportsServices.getImportedSongsGenres(
      session.user.id
    );
    return genres;
  } catch (error) {
    console.error(
      'Erreur lors de la récupération des genres des chansons importées:',
      error
    );
    throw new Error('Impossible de récupérer les genres');
  }
}
