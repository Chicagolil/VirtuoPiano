import prisma from '@/lib/prisma';
import { getLearnScores, getDifficultyRange } from '@/common/utils/function';
import { SongType, SourceType } from '@prisma/client';
import { JsonValue } from '@prisma/client/runtime/library';

export type SongBasicData = {
  id: string;
  title: string;
  composer: string | null;
  imageUrl: string | null;
  duration_ms: number;
  genre: string | null;
  tempo: number;
  Level: number;
  isFavorite: boolean;
};

export type ScoreDurationData = {
  date: Date;
  durationInMinutes: number;
};

export type SessionDetail = {
  id: string;
  songTitle: string;
  songComposer: string | null;
  correctNotes: number | null;
  missedNotes: number | null;
  wrongNotes: number | null;
  totalPoints: number | null;
  maxMultiplier: number | null;
  maxCombo: number | null;
  sessionStartTime: Date;
  sessionEndTime: Date;
  modeName: string;
  durationInMinutes: number;
  accuracy: number;
  performance: number;
};

export interface ScoreSummaryService {
  id: string;
  songTitle: string;
  songComposer: string | null;
  totalPoints: number | null;
  maxMultiplier: number | null;
  imageUrl: string | null;
  wrongNotes: number | null;
  correctNotes: number | null;
  missedNotes: number | null;
  maxCombo: number | null;
  sessionStartTime: Date;
  sessionEndTime: Date;
  modeName: string;
  hands?: 'right' | 'left' | 'both';
}

export type PlayedSong = {
  id: string;
  title: string;
  composer: string | null;
  genre: string | null;
  tempo: number;
  duration_ms: number;
  timeSignature: string;
  SourceType: SourceType;
  notes: JsonValue;
  Level: number;
  imageUrl: string | null;
  SongType: SongType;
  isFavorite: boolean;
  lastPlayed: string;
};

export class PerformancesServices {
  // Méthodes utilitaires privées pour calculer les intervalles
  private static getCurrentIntervalDates(
    interval: 'week' | 'month' | 'quarter'
  ): { startDate: Date; endDate: Date } {
    const now = new Date();
    let startDate: Date;
    let endDate: Date;

    switch (interval) {
      case 'week':
        // 7 derniers jours
        startDate = new Date(now);
        startDate.setDate(now.getDate() - 6);
        startDate.setHours(0, 0, 0, 0);
        endDate = new Date(now);
        endDate.setHours(23, 59, 59, 999);
        break;

      case 'month':
        // 31 derniers jours
        startDate = new Date(now);
        startDate.setDate(now.getDate() - 30);
        startDate.setHours(0, 0, 0, 0);
        endDate = new Date(now);
        endDate.setHours(23, 59, 59, 999);
        break;

      case 'quarter':
        // 90 derniers jours
        startDate = new Date(now);
        startDate.setDate(now.getDate() - 89);
        startDate.setHours(0, 0, 0, 0);
        endDate = new Date(now);
        endDate.setHours(23, 59, 59, 999);
        break;

      default:
        throw new Error('Paramètre invalide');
    }

    return { startDate, endDate };
  }

  private static getPreviousIntervalDates(
    interval: 'week' | 'month' | 'quarter'
  ): { startDate: Date; endDate: Date } {
    const now = new Date();
    let startDate: Date;
    let endDate: Date;

    switch (interval) {
      case 'week':
        // 7 jours précédents (jours 8 à 14)
        startDate = new Date(now);
        startDate.setDate(now.getDate() - 13);
        startDate.setHours(0, 0, 0, 0);
        endDate = new Date(now);
        endDate.setDate(now.getDate() - 7);
        endDate.setHours(23, 59, 59, 999);
        break;

      case 'month':
        // 31 jours précédents (jours 32 à 62)
        startDate = new Date(now);
        startDate.setDate(now.getDate() - 61);
        startDate.setHours(0, 0, 0, 0);
        endDate = new Date(now);
        endDate.setDate(now.getDate() - 31);
        endDate.setHours(23, 59, 59, 999);
        break;

      case 'quarter':
        // 90 jours précédents (jours 91 à 180)
        startDate = new Date(now);
        startDate.setDate(now.getDate() - 179);
        startDate.setHours(0, 0, 0, 0);
        endDate = new Date(now);
        endDate.setDate(now.getDate() - 90);
        endDate.setHours(23, 59, 59, 999);
        break;

      default:
        throw new Error('Paramètre invalide');
    }

    return { startDate, endDate };
  }

  static async getPracticeDataForHeatmap(
    userId: string,
    year: number
  ): Promise<ScoreDurationData[]> {
    const startDate = new Date(`${year}-01-01`);
    const endDate = new Date(`${year}-12-31`);

    const scores = await prisma.scores.findMany({
      where: {
        user_id: userId,
        sessionStartTime: {
          gte: startDate,
          lte: endDate,
        },
      },
      select: {
        sessionStartTime: true,
        sessionEndTime: true,
      },
    });

    // Calculer la durée de chaque session
    const sessionsWithDuration = scores.map((score) => {
      const durationMs =
        score.sessionEndTime.getTime() - score.sessionStartTime.getTime();
      const durationInMinutes = Math.round(durationMs / (1000 * 60));

      return {
        date: score.sessionStartTime,
        durationInMinutes,
      };
    });

    // Regrouper par date et additionner les durées
    const groupedByDate = new Map<string, ScoreDurationData>();

    sessionsWithDuration.forEach((session) => {
      // Utiliser une méthode qui respecte le fuseau horaire local
      const year = session.date.getFullYear();
      const month = String(session.date.getMonth() + 1).padStart(2, '0');
      const day = String(session.date.getDate()).padStart(2, '0');
      const dateKey = `${year}-${month}-${day}`; // Format YYYY-MM-DD

      if (groupedByDate.has(dateKey)) {
        // Si la date existe déjà, additionner la durée
        const existing = groupedByDate.get(dateKey)!;
        existing.durationInMinutes += session.durationInMinutes;
      } else {
        // Si c'est une nouvelle date, créer une nouvelle entrée
        groupedByDate.set(dateKey, {
          date: session.date,
          durationInMinutes: session.durationInMinutes,
        });
      }
    });

    return Array.from(groupedByDate.values());
  }

  static async getSessionsByDate(
    userId: string,
    date: Date
  ): Promise<SessionDetail[]> {
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    const scores = await prisma.scores.findMany({
      where: {
        user_id: userId,
        sessionStartTime: {
          gte: startOfDay,
          lte: endOfDay,
        },
      },
      include: {
        song: {
          select: {
            title: true,
            composer: true,
          },
        },
        mode: {
          select: {
            name: true,
          },
        },
      },
      orderBy: {
        sessionStartTime: 'asc',
      },
    });

    return scores.map((score) => {
      const durationMs =
        score.sessionEndTime.getTime() - score.sessionStartTime.getTime();
      const durationInMinutes = Math.round(durationMs / (1000 * 60));

      // Utiliser la fonction existante pour calculer la précision et la performance
      const { performance, accuracy } = getLearnScores(
        score.wrongNotes || 0,
        score.correctNotes || 0,
        score.missedNotes || 0
      );

      return {
        id: score.id,
        songTitle: score.song.title,
        songComposer: score.song.composer,
        correctNotes: score.correctNotes,
        missedNotes: score.missedNotes,
        wrongNotes: score.wrongNotes,
        totalPoints: score.totalPoints,
        maxMultiplier: score.maxMultiplier,
        maxCombo: score.maxCombo,
        sessionStartTime: score.sessionStartTime,
        sessionEndTime: score.sessionEndTime,
        modeName: score.mode.name,
        durationInMinutes,
        accuracy,
        performance,
      };
    });
  }

  static async getSongsRepertory(userId: string): Promise<{
    genre: string[];
    composer: string[];
    difficulty: string[];
  }> {
    const scores = await prisma.scores.findMany({
      where: {
        user_id: userId,
      },
      select: {
        song: {
          select: {
            genre: true,
            composer: true,
            Level: true,
          },
        },
      },
    });

    // Extraire les données brutes
    const genres = scores
      .map((score) => score.song.genre)
      .filter((genre): genre is string => genre !== null);

    const composers = scores
      .map((score) => score.song.composer)
      .filter((composer): composer is string => composer !== null);

    const difficulties = scores
      .map((score) => score.song.Level)
      .filter((difficulty): difficulty is number => difficulty !== null)
      .map((difficulty) => getDifficultyRange(difficulty).label);

    return {
      genre: genres,
      composer: composers,
      difficulty: difficulties,
    };
  }

  static async getPracticeTimeForInterval(
    userId: string,
    interval: 'week' | 'month' | 'quarter'
  ): Promise<number> {
    const { startDate, endDate } = this.getCurrentIntervalDates(interval);

    const scores = await prisma.scores.findMany({
      where: {
        user_id: userId,
        sessionStartTime: {
          gte: startDate,
          lte: endDate,
        },
      },
      select: {
        sessionStartTime: true,
        sessionEndTime: true,
      },
    });

    // Calculer le temps total en minutes
    const totalMinutes = scores.reduce((total, score) => {
      const durationMs =
        score.sessionEndTime.getTime() - score.sessionStartTime.getTime();
      return total + Math.round(durationMs / (1000 * 60));
    }, 0);

    return totalMinutes;
  }

  static async getPracticeTimeForPreviousInterval(
    userId: string,
    interval: 'week' | 'month' | 'quarter'
  ): Promise<number> {
    const { startDate, endDate } = this.getPreviousIntervalDates(interval);

    const scores = await prisma.scores.findMany({
      where: {
        user_id: userId,
        sessionStartTime: {
          gte: startDate,
          lte: endDate,
        },
      },
      select: {
        sessionStartTime: true,
        sessionEndTime: true,
      },
    });

    // Calculer le temps total en minutes
    const totalMinutes = scores.reduce((total, score) => {
      const durationMs =
        score.sessionEndTime.getTime() - score.sessionStartTime.getTime();
      return total + Math.round(durationMs / (1000 * 60));
    }, 0);

    return totalMinutes;
  }

  static async getStartedSongsForInterval(
    userId: string,
    interval: 'week' | 'month' | 'quarter'
  ): Promise<number> {
    const { startDate, endDate } = this.getCurrentIntervalDates(interval);

    // Compter les morceaux uniques démarrés dans l'intervalle
    const startedSongs = await prisma.scores.groupBy({
      by: ['song_id'],
      where: {
        user_id: userId,
        sessionStartTime: {
          gte: startDate,
          lte: endDate,
        },
      },
    });

    return startedSongs.length;
  }

  static async getStartedSongsForPreviousInterval(
    userId: string,
    interval: 'week' | 'month' | 'quarter'
  ): Promise<number> {
    const { startDate, endDate } = this.getPreviousIntervalDates(interval);

    // Compter les morceaux uniques démarrés dans l'intervalle précédent
    const startedSongs = await prisma.scores.groupBy({
      by: ['song_id'],
      where: {
        user_id: userId,
        sessionStartTime: {
          gte: startDate,
          lte: endDate,
        },
      },
    });

    return startedSongs.length;
  }

  static async getTotalSongsInLibrary(userId: string): Promise<number> {
    // Compter tous les morceaux de la bibliothèque
    const librarySongs = await prisma.songs.count({
      where: {
        SourceType: 'library',
      },
    });

    // Compter les compositions de l'utilisateur via la table de liaison
    const userCompositions = await prisma.usersCompositions.count({
      where: {
        user_id: userId,
      },
    });

    // Compter les imports de l'utilisateur via la table de liaison
    const userImports = await prisma.usersImports.count({
      where: {
        user_id: userId,
      },
    });

    return librarySongs + userCompositions + userImports;
  }

  static async getRecentSessionsData(
    userId: string,
    limit: number = 5
  ): Promise<ScoreSummaryService[]> {
    const scores = await prisma.scores.findMany({
      where: {
        user_id: userId,
      },
      include: {
        song: {
          select: {
            title: true,
            composer: true,
            imageUrl: true,
            tempo: true,
            Level: true,
          },
        },
        mode: {
          select: {
            name: true,
          },
        },
      },
      orderBy: {
        sessionStartTime: 'desc',
      },
      take: limit,
    });

    return scores.map((score) => ({
      id: score.id,
      songTitle: score.song.title,
      songComposer: score.song.composer,
      modeName: score.mode.name,
      imageUrl: score.song.imageUrl,
      wrongNotes: score.wrongNotes,
      correctNotes: score.correctNotes,
      missedNotes: score.missedNotes,
      totalPoints: score.totalPoints,
      maxMultiplier: score.maxMultiplier,
      maxCombo: score.maxCombo,
      sessionStartTime: score.sessionStartTime,
      sessionEndTime: score.sessionEndTime,
      hands: score.hands || undefined,
    }));
  }

  static async getAllSessionsData(
    userId: string
  ): Promise<ScoreSummaryService[]> {
    const scores = await prisma.scores.findMany({
      where: {
        user_id: userId,
      },
      include: {
        song: {
          select: {
            title: true,
            composer: true,
            imageUrl: true,
            tempo: true,
            Level: true,
          },
        },
        mode: {
          select: {
            name: true,
          },
        },
      },
      orderBy: {
        sessionStartTime: 'desc',
      },
    });

    return scores.map((score) => ({
      id: score.id,
      songTitle: score.song.title,
      songComposer: score.song.composer,
      modeName: score.mode.name,
      imageUrl: score.song.imageUrl,
      wrongNotes: score.wrongNotes,
      correctNotes: score.correctNotes,
      missedNotes: score.missedNotes,
      totalPoints: score.totalPoints,
      maxMultiplier: score.maxMultiplier,
      maxCombo: score.maxCombo,
      sessionStartTime: score.sessionStartTime,
      sessionEndTime: score.sessionEndTime,
      hands: score.hands || undefined,
    }));
  }

  static async getFilteredSessionsData(
    userId: string,
    filters: {
      searchQuery?: string;
      modeFilter?: 'all' | 'learning' | 'game';
      onlyCompleted?: boolean;
      dateStart?: string;
      dateEnd?: string;
    },
    pagination: {
      limit: number;
      offset: number;
    }
  ): Promise<{
    sessions: ScoreSummaryService[];
    hasMore: boolean;
    total: number;
  }> {
    // Construire les conditions where
    const whereConditions: any = {
      user_id: userId,
    };

    // Filtre par mode
    if (filters.modeFilter && filters.modeFilter !== 'all') {
      whereConditions.mode = {
        name: filters.modeFilter === 'learning' ? 'Apprentissage' : 'Jeu',
      };
    }

    // Filtre par recherche textuelle
    if (filters.searchQuery && filters.searchQuery.trim()) {
      const searchTerm = filters.searchQuery.trim();
      whereConditions.song = {
        OR: [
          {
            title: {
              contains: searchTerm,
              mode: 'insensitive',
            },
          },
          {
            composer: {
              contains: searchTerm,
              mode: 'insensitive',
            },
          },
        ],
      };
    }

    // Filtre par dates
    if (filters.dateStart && filters.dateEnd) {
      const startDate = new Date(filters.dateStart);
      const endDate = new Date(filters.dateEnd);
      endDate.setHours(23, 59, 59, 999);

      whereConditions.sessionStartTime = {
        gte: startDate,
        lte: endDate,
      };
    }

    // Si on filtre les chansons terminées, on doit récupérer TOUTES les sessions correspondantes
    // pour pouvoir calculer la performance et filtrer correctement AVANT la pagination
    if (filters.modeFilter === 'learning' && filters.onlyCompleted) {
      // Récupérer TOUTES les sessions qui matchent les autres critères
      const allScores = await prisma.scores.findMany({
        where: whereConditions,
        include: {
          song: {
            select: {
              title: true,
              composer: true,
              imageUrl: true,
              tempo: true,
              Level: true,
            },
          },
          mode: {
            select: {
              name: true,
            },
          },
        },
        orderBy: {
          sessionStartTime: 'desc',
        },
      });

      // Mapper et filtrer les chansons terminées
      const completedSessions = allScores
        .map((score) => ({
          id: score.id,
          songTitle: score.song.title,
          songComposer: score.song.composer,
          modeName: score.mode.name,
          imageUrl: score.song.imageUrl,
          wrongNotes: score.wrongNotes,
          correctNotes: score.correctNotes,
          missedNotes: score.missedNotes,
          totalPoints: score.totalPoints,
          maxMultiplier: score.maxMultiplier,
          maxCombo: score.maxCombo,
          sessionStartTime: score.sessionStartTime,
          sessionEndTime: score.sessionEndTime,
          hands: score.hands || undefined,
        }))
        .filter((score) => {
          const { performance } = getLearnScores(
            score.wrongNotes || 0,
            score.correctNotes || 0,
            score.missedNotes || 0
          );
          return performance >= 90;
        });

      // Maintenant appliquer la pagination sur les sessions filtrées
      const total = completedSessions.length;
      const sessions = completedSessions.slice(
        pagination.offset,
        pagination.offset + pagination.limit
      );
      const hasMore = pagination.offset + sessions.length < total;

      return {
        sessions,
        hasMore,
        total,
      };
    } else {
      // Comportement normal pour les autres cas
      const total = await prisma.scores.count({
        where: whereConditions,
      });

      const scores = await prisma.scores.findMany({
        where: whereConditions,
        include: {
          song: {
            select: {
              title: true,
              composer: true,
              imageUrl: true,
              tempo: true,
              Level: true,
            },
          },
          mode: {
            select: {
              name: true,
            },
          },
        },
        orderBy: {
          sessionStartTime: 'desc',
        },
        skip: pagination.offset,
        take: pagination.limit,
      });

      const mappedScores = scores.map((score) => ({
        id: score.id,
        songTitle: score.song.title,
        songComposer: score.song.composer,
        modeName: score.mode.name,
        imageUrl: score.song.imageUrl,
        wrongNotes: score.wrongNotes,
        correctNotes: score.correctNotes,
        missedNotes: score.missedNotes,
        totalPoints: score.totalPoints,
        maxMultiplier: score.maxMultiplier,
        maxCombo: score.maxCombo,
        sessionStartTime: score.sessionStartTime,
        sessionEndTime: score.sessionEndTime,
        hands: score.hands || undefined,
      }));

      const hasMore = pagination.offset + mappedScores.length < total;

      return {
        sessions: mappedScores,
        hasMore,
        total,
      };
    }
  }

  static async getPlayedSongs(
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
    // Récupérer toutes les chansons distinctes jouées par l'utilisateur
    const playedSongsData = await prisma.scores.groupBy({
      by: ['song_id'],
      where: {
        user_id: userId,
      },
      _max: {
        sessionStartTime: true,
      },
    });

    // Récupérer les détails de chaque chanson
    const songsWithDetails = await Promise.all(
      playedSongsData.map(async (playedSong) => {
        const song = await prisma.songs.findUnique({
          where: {
            id: playedSong.song_id,
          },
          include: {
            userFavorites: {
              where: {
                user_id: userId,
              },
            },
          },
        });

        if (!song) return null;

        return {
          id: song.id,
          title: song.title,
          composer: song.composer,
          genre: song.genre,
          tempo: song.tempo,
          duration_ms: song.duration_ms,
          timeSignature: song.timeSignature,
          SourceType: song.SourceType,
          notes: song.notes,
          Level: song.Level,
          imageUrl: song.imageUrl,
          SongType: song.SongType,
          isFavorite: song.userFavorites.length > 0,
          lastPlayed: playedSong._max.sessionStartTime?.toISOString() || '',
        };
      })
    );

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

  static async getSongBasicData(
    songId: string,
    userId: string
  ): Promise<SongBasicData> {
    const song = await prisma.songs.findUnique({
      where: {
        id: songId,
      },
      select: {
        id: true,
        title: true,
        composer: true,
        imageUrl: true,
        duration_ms: true,
        genre: true,
        tempo: true,
        Level: true,
        userFavorites: {
          where: {
            user_id: userId,
          },
        },
      },
    });

    if (!song) {
      throw new Error('Chanson non trouvée');
    }

    return {
      ...song,
      isFavorite: song.userFavorites.length > 0,
    };
  }
}
