import prisma from '@/lib/prisma';
import { PlayedSong } from '../types';

export class FavoritesServices {
  static async getFavoriteSongs(
    userId: string,
    pagination?: {
      page: number;
      limit: number;
    },
    filters?: {
      searchQuery?: string;
      genreFilter?: string;
      sortBy?:
        | 'title'
        | 'composer'
        | 'lastPlayed'
        | 'genre'
        | 'duration'
        | 'difficulty';
      sortOrder?: 'asc' | 'desc';
    }
  ): Promise<{
    songs: PlayedSong[];
    pagination: {
      currentPage: number;
      totalPages: number;
      totalSongs: number;
      hasNextPage: boolean;
      hasPreviousPage: boolean;
    };
  }> {
    const page = pagination?.page || 1;
    const limit = pagination?.limit || 20;
    const offset = (page - 1) * limit;

    // Construire les conditions de recherche
    const searchConditions: any = {
      userFavorites: {
        some: {
          user_id: userId,
        },
      },
    };

    // Ajouter le filtre par genre si spécifié
    if (filters?.genreFilter) {
      searchConditions.genre = filters.genreFilter;
    }

    // Construire l'ordre de tri
    let orderBy: any = {};
    if (filters?.sortBy) {
      switch (filters.sortBy) {
        case 'title':
          orderBy = { title: filters.sortOrder || 'asc' };
          break;
        case 'composer':
          orderBy = { composer: filters.sortOrder || 'asc' };
          break;
        case 'duration':
          orderBy = { duration_ms: filters.sortOrder || 'asc' };
          break;
        case 'difficulty':
          orderBy = { Level: filters.sortOrder || 'asc' };
          break;
        case 'lastPlayed':
          // Pour lastPlayed, on doit trier par la dernière session
          orderBy = {
            scores: {
              _count: 'desc',
            },
          };
          break;
        default:
          orderBy = { title: 'asc' };
      }
    } else {
      orderBy = { title: 'asc' };
    }

    // Récupérer le nombre total de chansons favorites
    const totalSongs = await prisma.songs.count({
      where: searchConditions,
    });

    // Récupérer les chansons favorites avec pagination
    const favoriteSongs = await prisma.songs.findMany({
      where: searchConditions,
      include: {
        userFavorites: {
          where: {
            user_id: userId,
          },
        },
        scores: {
          where: {
            user_id: userId,
          },
          orderBy: {
            sessionStartTime: 'desc',
          },
          take: 1,
        },
        key: true,
      },
      orderBy,
      skip: offset,
      take: limit,
    });

    // Transformer les données pour correspondre au format PlayedSong
    const songsWithDetails: PlayedSong[] = favoriteSongs.map((song) => {
      const lastScore = song.scores[0];
      const lastPlayed = lastScore?.sessionStartTime;

      return {
        id: song.id,
        title: song.title,
        composer: song.composer || 'Compositeur inconnu',
        genre: song.genre || 'Genre inconnu',
        duration_ms: song.duration_ms,
        imageUrl: song.imageUrl,
        Level: song.Level,
        SongType: song.SongType,
        SourceType: song.SourceType,
        isFavorite: song.userFavorites.length > 0,
        lastPlayed: lastPlayed ? new Date(lastPlayed).toISOString() : '',
        tempo: song.tempo,
        timeSignature: song.timeSignature,
        notes: song.notes,
        key: song.key,
        createdAt: song.createdAt,
      };
    });

    const totalPages = Math.ceil(totalSongs / limit);

    return {
      songs: songsWithDetails,
      pagination: {
        currentPage: page,
        totalPages,
        totalSongs,
        hasNextPage: page < totalPages,
        hasPreviousPage: page > 1,
      },
    };
  }

  static async getFavoriteSongsGenres(userId: string): Promise<string[]> {
    const favoriteSongs = await prisma.songs.findMany({
      where: {
        userFavorites: {
          some: {
            user_id: userId,
          },
        },
      },
      select: {
        genre: true,
      },
    });

    const uniqueGenres = Array.from(
      new Set(
        favoriteSongs
          .map((song) => song.genre)
          .filter((genre): genre is string => genre !== null)
      )
    ).sort();

    return uniqueGenres;
  }
}
