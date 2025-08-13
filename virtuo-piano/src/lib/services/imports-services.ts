import prisma from '@/lib/prisma';
import { PlayedSong } from '../types';

export class ImportsServices {
  static async getImportedSongs(
    userId: string,
    pagination?: {
      page: number;
      limit: number;
    },
    filters?: {
      searchQuery?: string;
      genreFilter?: string;
      favoritesOnly?: boolean;
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
    // Récupérer toutes les chansons importées par l'utilisateur via la table UsersImports
    const userImports = await prisma.usersImports.findMany({
      where: {
        user_id: userId,
      },
      include: {
        song: {
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
          },
        },
      },
      orderBy: {
        song: {
          createdAt: 'desc',
        },
      },
    });

    // Transformer les données
    const songsWithDetails = userImports.map((userImport) => ({
      id: userImport.song.id,
      title: userImport.song.title,
      composer: userImport.song.composer,
      genre: userImport.song.genre,
      tempo: userImport.song.tempo,
      duration_ms: userImport.song.duration_ms,
      timeSignature: userImport.song.timeSignature,
      SourceType: userImport.song.SourceType,
      notes: userImport.song.notes,
      Level: userImport.song.Level,
      imageUrl: userImport.song.imageUrl,
      SongType: userImport.song.SongType,
      isFavorite: userImport.song.userFavorites.length > 0,
      lastPlayed:
        userImport.song.scores[0]?.sessionStartTime?.toISOString() || '',
    }));

    // Filtrer les chansons nulles
    let filteredSongs = songsWithDetails.filter(
      (song): song is PlayedSong => song !== null
    );

    // Appliquer le filtrage par recherche
    if (filters?.searchQuery && filters.searchQuery.trim()) {
      const searchTerm = filters.searchQuery.toLowerCase().trim();
      filteredSongs = filteredSongs.filter(
        (song) =>
          song.title.toLowerCase().includes(searchTerm) ||
          (song.composer && song.composer.toLowerCase().includes(searchTerm)) ||
          (song.genre && song.genre.toLowerCase().includes(searchTerm))
      );
    }

    // Appliquer le filtrage par genre
    if (filters?.genreFilter) {
      filteredSongs = filteredSongs.filter(
        (song) => song.genre === filters.genreFilter
      );
    }

    // Appliquer le filtrage par favoris
    if (filters?.favoritesOnly) {
      filteredSongs = filteredSongs.filter((song) => song.isFavorite);
    }

    // Appliquer le tri
    if (filters?.sortBy) {
      filteredSongs.sort((a, b) => {
        let aValue: string | number;
        let bValue: string | number;

        switch (filters.sortBy) {
          case 'title':
            aValue = a.title.toLowerCase();
            bValue = b.title.toLowerCase();
            break;
          case 'composer':
            aValue = (a.composer || '').toLowerCase();
            bValue = (b.composer || '').toLowerCase();
            break;
          case 'lastPlayed':
            aValue = new Date(a.lastPlayed).getTime();
            bValue = new Date(b.lastPlayed).getTime();
            break;
          case 'genre':
            aValue = (a.genre || '').toLowerCase();
            bValue = (b.genre || '').toLowerCase();
            break;
          case 'duration':
            aValue = a.duration_ms;
            bValue = b.duration_ms;
            break;
          case 'difficulty':
            aValue = a.Level;
            bValue = b.Level;
            break;
          default:
            return 0;
        }

        if (aValue < bValue) return filters.sortOrder === 'desc' ? 1 : -1;
        if (aValue > bValue) return filters.sortOrder === 'desc' ? -1 : 1;
        return 0;
      });
    } else {
      // Tri par défaut : par dernière date de jeu (plus récent en premier)
      filteredSongs.sort(
        (a, b) =>
          new Date(b.lastPlayed).getTime() - new Date(a.lastPlayed).getTime()
      );
    }

    // Calculer la pagination
    const totalSongs = filteredSongs.length;
    const limit = pagination?.limit || 20;
    const currentPage = pagination?.page || 1;
    const totalPages = Math.ceil(totalSongs / limit);
    const startIndex = (currentPage - 1) * limit;
    const endIndex = startIndex + limit;

    const paginatedSongs = filteredSongs.slice(startIndex, endIndex);

    return {
      songs: paginatedSongs,
      pagination: {
        currentPage,
        totalPages,
        totalSongs,
        hasNextPage: currentPage < totalPages,
        hasPreviousPage: currentPage > 1,
      },
    };
  }
}
