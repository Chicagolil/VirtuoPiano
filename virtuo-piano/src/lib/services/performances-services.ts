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

export interface SongPerformanceGeneralTiles {
  totalSessions: number;
  totalTimeInMinutes: number;
  currentStreak: number;
  globalRanking: number | null;
}

export interface PracticeDataPoint {
  name: string;
  pratique: number;
  modeJeu: number;
  modeApprentissage: number;
}

export interface SongPracticeData {
  data: PracticeDataPoint[];
  totalPratique: number;
  totalModeJeu: number;
  totalModeApprentissage: number;
}

export interface SongLearningModeTiles {
  totalSessions: number;
  averageAccuracy: number;
  averagePerformance: number;
  totalTimeInMinutes: number;
  longestSessionInMinutes: number;
  currentStreak: number;
}

export interface SongPlayModeTiles {
  totalSessions: number;
  averageScore: number;
  bestScore: number;
  totalTimeInMinutes: number;
  longestSessionInMinutes: number;
  currentStreak: number;
}

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

  private static async calculateCurrentStreak(
    songId: string,
    userId: string,
    modeName: string
  ): Promise<number> {
    const whereClause: any = {
      song_id: songId,
      user_id: userId,
    };

    // Si modeName n'est pas 'all', filtrer par mode
    if (modeName !== 'all') {
      whereClause.mode = {
        name: modeName,
      };
    }

    const sessions = await prisma.scores.findMany({
      where: whereClause,
      select: {
        sessionStartTime: true,
      },
      orderBy: {
        sessionStartTime: 'desc',
      },
    });

    if (sessions.length === 0) return 0;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    let streak = 0;
    let currentDate = new Date(today);

    for (let i = 0; i < 365; i++) {
      // Limite à 1 an
      const sessionsForDate = sessions.filter((session) => {
        const sessionDate = new Date(session.sessionStartTime);
        sessionDate.setHours(0, 0, 0, 0);
        return sessionDate.getTime() === currentDate.getTime();
      });

      if (sessionsForDate.length > 0) {
        streak++;
        currentDate.setDate(currentDate.getDate() - 1);
      } else {
        break;
      }
    }

    return streak;
  }

  private static calculateTotalTimeInMinutes(sessions: any[]): number {
    return sessions.reduce((sum, session) => {
      const durationMs =
        session.sessionEndTime.getTime() - session.sessionStartTime.getTime();
      return sum + Math.round(durationMs / (1000 * 60));
    }, 0);
  }

  private static calculateLongestSessionInMinutes(sessions: any[]): number {
    return sessions.reduce((max, session) => {
      const durationMs =
        session.sessionEndTime.getTime() - session.sessionStartTime.getTime();
      return Math.max(max, Math.round(durationMs / (1000 * 60)));
    }, 0);
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

  static async getSongPerformanceGeneralTilesData(
    songId: string,
    userId: string
  ): Promise<SongPerformanceGeneralTiles> {
    // Récupérer toutes les sessions pour cette chanson
    const sessions = await prisma.scores.findMany({
      where: {
        song_id: songId,
        user_id: userId,
      },
      select: {
        sessionStartTime: true,
        sessionEndTime: true,
      },
      orderBy: {
        sessionStartTime: 'asc',
      },
    });

    // Calculer le nombre total de sessions
    const totalSessions = sessions.length;

    // Calculer le temps total en minutes
    const totalTimeInMinutes = sessions.reduce((total, session) => {
      const durationMs =
        session.sessionEndTime.getTime() - session.sessionStartTime.getTime();
      return total + Math.round(durationMs / (1000 * 60));
    }, 0);

    // Calculer les jours consécutifs (toutes sessions confondues)
    const currentStreak = await this.calculateCurrentStreak(
      songId,
      userId,
      'all'
    );

    // Vérifier d'abord si l'utilisateur actuel a des sessions de jeu
    const currentUserGameSessions = await prisma.scores.findMany({
      where: {
        song_id: songId,
        user_id: userId,
        mode: {
          name: 'Jeu',
        },
      },
      select: {
        totalPoints: true,
      },
    });

    let globalRanking: number | null = null;

    // Si l'utilisateur a des sessions de jeu, calculer son classement
    if (currentUserGameSessions.length > 0) {
      // Calculer le classement global basé sur les meilleurs scores
      const allUsersScores = await prisma.scores.groupBy({
        by: ['user_id'],
        where: {
          song_id: songId,
          mode: {
            name: 'Jeu', // Seulement les scores du mode jeu
          },
        },
      });

      // Calculer le meilleur score pour chaque utilisateur
      const userBestScores = await Promise.all(
        allUsersScores.map(async (userScore) => {
          const userSessions = await prisma.scores.findMany({
            where: {
              song_id: songId,
              user_id: userScore.user_id,
              mode: {
                name: 'Jeu',
              },
            },
            select: {
              totalPoints: true,
            },
          });

          // Trouver le meilleur score de l'utilisateur
          const bestScore = userSessions.reduce((max, session) => {
            return Math.max(max, session.totalPoints || 0);
          }, 0);

          return {
            userId: userScore.user_id,
            bestScore,
          };
        })
      );

      // Trier par meilleur score décroissant
      userBestScores.sort((a, b) => b.bestScore - a.bestScore);

      // Trouver la position de l'utilisateur actuel
      const currentUserIndex = userBestScores.findIndex(
        (user) => user.userId === userId
      );
      globalRanking = currentUserIndex !== -1 ? currentUserIndex + 1 : null;
    }

    return {
      totalSessions,
      totalTimeInMinutes,
      currentStreak,
      globalRanking,
    };
  }

  static async getSongPracticeData(
    songId: string,
    userId: string,
    interval: number,
    index: number
  ): Promise<SongPracticeData> {
    // Calculer la date de début et de fin pour l'intervalle
    const endDate = new Date();
    endDate.setHours(23, 59, 59, 999);

    const startDate = new Date();
    startDate.setDate(endDate.getDate() - interval * (index + 1) + 1);
    startDate.setHours(0, 0, 0, 0);

    // Récupérer toutes les sessions pour cette chanson dans l'intervalle
    const sessions = await prisma.scores.findMany({
      where: {
        song_id: songId,
        user_id: userId,
        sessionStartTime: {
          gte: startDate,
          lte: endDate,
        },
      },
      include: {
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

    // Grouper les sessions par jour
    const dailyData = new Map<
      string,
      {
        pratique: number;
        modeJeu: number;
        modeApprentissage: number;
      }
    >();

    sessions.forEach((session) => {
      const dateKey = session.sessionStartTime.toISOString().split('T')[0];
      const durationMs =
        session.sessionEndTime.getTime() - session.sessionStartTime.getTime();
      const durationMinutes = Math.round(durationMs / (1000 * 60));

      if (!dailyData.has(dateKey)) {
        dailyData.set(dateKey, {
          pratique: 0,
          modeJeu: 0,
          modeApprentissage: 0,
        });
      }

      const dayData = dailyData.get(dateKey)!;
      dayData.pratique += durationMinutes;

      if (session.mode.name === 'Jeu') {
        dayData.modeJeu += durationMinutes;
      } else if (session.mode.name === 'Apprentissage') {
        dayData.modeApprentissage += durationMinutes;
      }
    });

    // Créer les points de données avec les bonnes dates
    const data: PracticeDataPoint[] = [];
    const today = new Date();

    for (let i = interval - 1; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(today.getDate() - index * interval - i);
      const dateKey = date.toISOString().split('T')[0];

      const dayData = dailyData.get(dateKey) || {
        pratique: 0,
        modeJeu: 0,
        modeApprentissage: 0,
      };

      // Formater le nom de la date
      let displayName: string;
      if (i === 0 && index === 0) {
        displayName = "Aujourd'hui";
      } else {
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        displayName = `${day}/${month}`;
      }

      data.push({
        name: displayName,
        pratique: dayData.pratique,
        modeJeu: dayData.modeJeu,
        modeApprentissage: dayData.modeApprentissage,
      });
    }

    // Calculer les totaux
    const totalPratique = data.reduce((sum, point) => sum + point.pratique, 0);
    const totalModeJeu = data.reduce((sum, point) => sum + point.modeJeu, 0);
    const totalModeApprentissage = data.reduce(
      (sum, point) => sum + point.modeApprentissage,
      0
    );

    return {
      data,
      totalPratique,
      totalModeJeu,
      totalModeApprentissage,
    };
  }

  static async getSongLearningModeTilesData(
    songId: string,
    userId: string
  ): Promise<SongLearningModeTiles> {
    const sessions = await prisma.scores.findMany({
      where: {
        song_id: songId,
        user_id: userId,
        mode: {
          name: 'Apprentissage',
        },
      },
      orderBy: {
        sessionStartTime: 'desc',
      },
    });

    const totalSessions = sessions.length;

    if (totalSessions === 0) {
      return {
        totalSessions: 0,
        averageAccuracy: 0,
        averagePerformance: 0,
        totalTimeInMinutes: 0,
        longestSessionInMinutes: 0,
        currentStreak: 0,
      };
    }

    const sessionsScores = sessions.map((session) => {
      const { performance, accuracy } = getLearnScores(
        session.wrongNotes || 0,
        session.correctNotes || 0,
        session.missedNotes || 0
      );
      return { performance, accuracy };
    });

    const averageAccuracy = Math.round(
      sessionsScores.reduce((sum, session) => sum + session.accuracy, 0) /
        totalSessions
    );

    const averagePerformance = Math.round(
      sessionsScores.reduce((sum, session) => sum + session.performance, 0) /
        totalSessions
    );

    const totalTimeInMinutes = this.calculateTotalTimeInMinutes(sessions);
    const longestSessionInMinutes =
      this.calculateLongestSessionInMinutes(sessions);

    // Calculer le streak (jours consécutifs)
    const currentStreak = await this.calculateCurrentStreak(
      songId,
      userId,
      'Apprentissage'
    );

    return {
      totalSessions,
      averageAccuracy,
      averagePerformance,
      totalTimeInMinutes,
      longestSessionInMinutes,
      currentStreak,
    };
  }

  static async getSongPlayModeTilesData(
    songId: string,
    userId: string
  ): Promise<SongPlayModeTiles> {
    const sessions = await prisma.scores.findMany({
      where: {
        song_id: songId,
        user_id: userId,
        mode: {
          name: 'Jeu',
        },
      },
      orderBy: {
        sessionStartTime: 'desc',
      },
    });

    const totalSessions = sessions.length;

    if (totalSessions === 0) {
      return {
        totalSessions: 0,
        averageScore: 0,
        bestScore: 0,
        totalTimeInMinutes: 0,
        longestSessionInMinutes: 0,
        currentStreak: 0,
      };
    }

    const averageScore = Math.round(
      sessions.reduce((sum, session) => sum + (session.totalPoints || 0), 0) /
        totalSessions
    );

    const bestScore = Math.max(
      ...sessions.map((session) => session.totalPoints || 0)
    );

    const totalTimeInMinutes = this.calculateTotalTimeInMinutes(sessions);
    const longestSessionInMinutes =
      this.calculateLongestSessionInMinutes(sessions);

    // Calculer le streak (jours consécutifs)
    const currentStreak = await this.calculateCurrentStreak(
      songId,
      userId,
      'Jeu'
    );

    return {
      totalSessions,
      averageScore,
      bestScore,
      totalTimeInMinutes,
      longestSessionInMinutes,
      currentStreak,
    };
  }
}
