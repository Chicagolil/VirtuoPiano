'use server';

import { getServerSession } from 'next-auth';
import { PlayedSong } from '../types';
import { FavoritesServices } from '../services/favorites-services';
import { authOptions } from '../authoption';

export type FavoritesSongsResult = {
  songs: PlayedSong[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalSongs: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
};

export async function getFavoriteSongsAction(
  page: number = 1,
  searchQuery?: string,
  genreFilter?: string,
  sortBy?:
    | 'title'
    | 'composer'
    | 'lastPlayed'
    | 'genre'
    | 'duration'
    | 'difficulty',
  sortOrder?: 'asc' | 'desc'
): Promise<FavoritesSongsResult> {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      throw new Error('Accès non autorisé');
    }

    const result = await FavoritesServices.getFavoriteSongs(
      session.user.id,
      {
        page,
        limit: 20, // 20 chansons par page
      },
      {
        searchQuery,
        genreFilter,
        sortBy,
        sortOrder,
      }
    );

    return result;
  } catch (error) {
    console.error(
      'Erreur lors de la récupération des chansons favorites:',
      error
    );
    throw new Error('Impossible de récupérer les chansons favorites');
  }
}

// Action pour récupérer uniquement les genres des chansons favorites
export async function getFavoriteSongsGenresAction(): Promise<string[]> {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      throw new Error('Accès non autorisé');
    }

    const genres = await FavoritesServices.getFavoriteSongsGenres(
      session.user.id
    );
    return genres;
  } catch (error) {
    console.error(
      'Erreur lors de la récupération des genres des chansons favorites:',
      error
    );
    throw new Error('Impossible de récupérer les genres');
  }
}
