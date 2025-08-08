import prisma from '@/lib/prisma';
import { getLearnScores, getDifficultyRange } from '@/common/utils/function';
import {
  ScoreDurationData,
  SessionDetail,
  ScoreSummaryService,
  PlayedSong,
  SongBasicData,
  SongPerformanceGeneralTiles,
  SongLearningModeTiles,
  SongPlayModeTiles,
  SongPracticeData,
  SongLearningPrecisionData,
  SongLearningPerformanceData,
  SongPerformancePrecisionBarChartData,
  SongGamingLineChartData,
  SongGamingBarChartData,
  SongTimelineRecordsData,
  PracticeDataPoint,
  PrecisionDataPoint,
  PerformanceDataPoint,
  BarChartDataPoint,
  LineChartDataPoint,
  SongGamingBarChartDataPoint,
  TimelineRecordData,
} from '@/lib/types';
import {
  getAccuracyComment,
  getPerformanceComment,
  getBothHandsAccuracyComment,
  getBothHandsPerformanceComment,
  getFinishedComment,
  getSessionComment,
  getMarathonComment,
  getScoreComment,
  getComboComment,
  getMultiplierComment,
  getCurrentIntervalDates,
  getPreviousIntervalDates,
  calculateTotalTimeInMinutes,
  calculateLongestSessionInMinutes,
  hasHandActivity,
} from '@/lib/utils';

export class PerformancesServices {
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
    const currentDate = new Date(today);

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
    const { startDate, endDate } = getCurrentIntervalDates(interval);

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
    const { startDate, endDate } = getPreviousIntervalDates(interval);

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
    const { startDate, endDate } = getCurrentIntervalDates(interval);

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
    const { startDate, endDate } = getPreviousIntervalDates(interval);

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
      hands: score.hands,
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
      hands: score.hands,
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
          hands: score.hands,
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
        hands: score.hands,
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

    const totalTimeInMinutes = calculateTotalTimeInMinutes(sessions);
    const longestSessionInMinutes = calculateLongestSessionInMinutes(sessions);

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

    const totalTimeInMinutes = calculateTotalTimeInMinutes(sessions);
    const longestSessionInMinutes = calculateLongestSessionInMinutes(sessions);

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

  static async getSongLearningPrecisionData(
    songId: string,
    userId: string,
    interval: number,
    index: number
  ): Promise<SongLearningPrecisionData> {
    // Compter le nombre total de sessions
    const totalSessions = await prisma.scores.count({
      where: {
        song_id: songId,
        user_id: userId,
        mode: {
          name: 'Apprentissage',
        },
      },
    });

    // session dans l'intervalle
    const sessions = await prisma.scores.findMany({
      where: {
        song_id: songId,
        user_id: userId,
        mode: {
          name: 'Apprentissage',
        },
      },
      include: {
        mode: true,
      },
      orderBy: {
        sessionStartTime: 'desc',
      },
      take: interval,
      skip: index * interval,
    });

    // Inverser l'ordre pour avoir les sessions du plus ancien au plus récent
    const orderedSessions = sessions.reverse();

    // Créer un point de données pour chaque session
    const data: PrecisionDataPoint[] = [];
    const today = new Date();

    orderedSessions.forEach((session, index) => {
      const sessionDate = session.sessionStartTime;

      // Calculer la précision pour cette session
      const { accuracy } = getLearnScores(
        session.wrongNotes || 0,
        session.correctNotes || 0,
        session.missedNotes || 0
      );

      // Formater le nom de la date
      let displayName: string;
      const isToday = sessionDate.toDateString() === today.toDateString();

      if (isToday) {
        displayName = "Aujourd'hui";
      } else {
        const day = String(sessionDate.getDate()).padStart(2, '0');
        const month = String(sessionDate.getMonth() + 1).padStart(2, '0');
        const year = sessionDate.getFullYear();
        displayName = `${day}/${month}/${year}`;
      }

      // Déterminer quelle main a été utilisée et assigner la précision
      let precisionRightHand: number | null = null;
      let precisionLeftHand: number | null = null;
      let precisionBothHands: number | null = null;

      switch (session.hands) {
        case 'right':
          precisionRightHand = accuracy;
          break;
        case 'left':
          precisionLeftHand = accuracy;
          break;
        case 'both':
          precisionBothHands = accuracy;
          break;
        default:
          // Si hands n'est pas défini, on met tout dans both
          precisionBothHands = accuracy;
          break;
      }

      data.push({
        session: displayName,
        precisionRightHand,
        precisionLeftHand,
        precisionBothHands,
      });
    });

    // Calculer les moyennes globales seulement sur les sessions avec activité
    const rightHandSessions = data.filter((point, index) => {
      const session = orderedSessions[index];
      const hasActivity = hasHandActivity(session);
      return (
        point.precisionRightHand !== null ||
        (hasActivity && session.hands === 'right')
      );
    });

    const leftHandSessions = data.filter((point, index) => {
      const session = orderedSessions[index];
      const hasActivity = hasHandActivity(session);
      return (
        point.precisionLeftHand !== null ||
        (hasActivity && session.hands === 'left')
      );
    });

    const bothHandsSessions = data.filter((point, index) => {
      const session = orderedSessions[index];
      const hasActivity = hasHandActivity(session);
      return (
        point.precisionBothHands !== null ||
        (hasActivity && session.hands === 'both')
      );
    });

    const totalPrecisionRightHand = rightHandSessions.reduce(
      (sum, point) => sum + (point.precisionRightHand || 0),
      0
    );
    const totalPrecisionLeftHand = leftHandSessions.reduce(
      (sum, point) => sum + (point.precisionLeftHand || 0),
      0
    );
    const totalPrecisionBothHands = bothHandsSessions.reduce(
      (sum, point) => sum + (point.precisionBothHands || 0),
      0
    );

    const averagePrecisionRightHand =
      rightHandSessions.length > 0
        ? Math.round(totalPrecisionRightHand / rightHandSessions.length)
        : 0;
    const averagePrecisionLeftHand =
      leftHandSessions.length > 0
        ? Math.round(totalPrecisionLeftHand / leftHandSessions.length)
        : 0;
    const averagePrecisionBothHands =
      bothHandsSessions.length > 0
        ? Math.round(totalPrecisionBothHands / bothHandsSessions.length)
        : 0;

    return {
      data,
      averagePrecisionRightHand,
      averagePrecisionLeftHand,
      averagePrecisionBothHands,
      totalSessions,
    };
  }

  static async getSongLearningPerformanceData(
    songId: string,
    userId: string,
    interval: number,
    index: number
  ): Promise<SongLearningPerformanceData> {
    const totalSessions = await prisma.scores.count({
      where: {
        song_id: songId,
        user_id: userId,
        mode: {
          name: 'Apprentissage',
        },
      },
    });

    const sessions = await prisma.scores.findMany({
      where: {
        song_id: songId,
        user_id: userId,
        mode: {
          name: 'Apprentissage',
        },
      },
      include: {
        mode: true,
      },
      orderBy: {
        sessionStartTime: 'desc',
      },
      take: interval,
      skip: index * interval,
    });

    const orderedSessions = sessions.reverse();

    const data: PerformanceDataPoint[] = [];
    const today = new Date();

    orderedSessions.forEach((session, index) => {
      const sessionDate = session.sessionStartTime;

      const { performance } = getLearnScores(
        session.wrongNotes || 0,
        session.correctNotes || 0,
        session.missedNotes || 0
      );
      // Formater le nom de la date
      let displayName: string;
      const isToday = sessionDate.toDateString() === today.toDateString();

      if (isToday) {
        displayName = "Aujourd'hui";
      } else {
        const day = String(sessionDate.getDate()).padStart(2, '0');
        const month = String(sessionDate.getMonth() + 1).padStart(2, '0');
        const year = sessionDate.getFullYear();
        displayName = `${day}/${month}/${year}`;
      }
      // Déterminer quelle main a été utilisée et assigner la précision
      let performanceRightHand: number | null = null;
      let performanceLeftHand: number | null = null;
      let performanceBothHands: number | null = null;

      switch (session.hands) {
        case 'right':
          performanceRightHand = performance;
          break;
        case 'left':
          performanceLeftHand = performance;
          break;
        case 'both':
          performanceBothHands = performance;
          break;
        default:
          // Si hands n'est pas défini, on met tout dans both
          performanceBothHands = performance;
          break;
      }

      data.push({
        session: displayName,
        performanceRightHand,
        performanceLeftHand,
        performanceBothHands,
      });
    });

    // Calculer les moyennes globales seulement sur les sessions avec activité
    const rightHandSessions = data.filter((point, index) => {
      const session = orderedSessions[index];
      const hasActivity = hasHandActivity(session);
      return (
        point.performanceRightHand !== null ||
        (hasActivity && session.hands === 'right')
      );
    });
    const leftHandSessions = data.filter((point, index) => {
      const session = orderedSessions[index];
      const hasActivity = hasHandActivity(session);
      return (
        point.performanceLeftHand !== null ||
        (hasActivity && session.hands === 'left')
      );
    });
    const bothHandsSessions = data.filter((point, index) => {
      const session = orderedSessions[index];
      const hasActivity = hasHandActivity(session);
      return (
        point.performanceBothHands !== null ||
        (hasActivity && session.hands === 'both')
      );
    });

    const totalPerformanceRightHand = rightHandSessions.reduce(
      (sum, point) => sum + (point.performanceRightHand || 0),
      0
    );
    const totalPerformanceLeftHand = leftHandSessions.reduce(
      (sum, point) => sum + (point.performanceLeftHand || 0),
      0
    );
    const totalPerformanceBothHands = bothHandsSessions.reduce(
      (sum, point) => sum + (point.performanceBothHands || 0),
      0
    );

    const averagePerformanceRightHand =
      rightHandSessions.length > 0
        ? Math.round(totalPerformanceRightHand / rightHandSessions.length)
        : 0;
    const averagePerformanceLeftHand =
      leftHandSessions.length > 0
        ? Math.round(totalPerformanceLeftHand / leftHandSessions.length)
        : 0;
    const averagePerformanceBothHands =
      bothHandsSessions.length > 0
        ? Math.round(totalPerformanceBothHands / bothHandsSessions.length)
        : 0;

    return {
      data,
      totalSessions,
      averagePerformanceRightHand,
      averagePerformanceLeftHand,
      averagePerformanceBothHands,
    };
  }

  static async getSongPerformancePrecisionBarChartData(
    songId: string,
    userId: string,
    index: number = 0
  ): Promise<SongPerformancePrecisionBarChartData> {
    // Récupérer toutes les sessions d'apprentissage pour cette chanson
    const sessions = await prisma.scores.findMany({
      where: {
        song_id: songId,
        user_id: userId,
        mode: {
          name: 'Apprentissage',
        },
      },
      include: {
        mode: true,
      },
      orderBy: {
        sessionStartTime: 'asc',
      },
    });

    if (sessions.length === 0) {
      return {
        label: 'Aucune donnée',
        data: [],
        totalIntervals: 0,
      };
    }

    // Grouper les sessions par mois et calculer les moyennes
    const monthlyData = new Map<
      string,
      {
        precisionSum: number;
        performanceSum: number;
        count: number;
        date: Date;
      }
    >();

    sessions.forEach((session) => {
      const sessionDate = session.sessionStartTime;
      const monthKey = `${sessionDate.getFullYear()}-${String(
        sessionDate.getMonth() + 1
      ).padStart(2, '0')}`;

      // Calculer la précision et la performance pour cette session
      const { accuracy, performance } = getLearnScores(
        session.wrongNotes || 0,
        session.correctNotes || 0,
        session.missedNotes || 0
      );

      if (!monthlyData.has(monthKey)) {
        monthlyData.set(monthKey, {
          precisionSum: 0,
          performanceSum: 0,
          count: 0,
          date: sessionDate,
        });
      }

      const monthData = monthlyData.get(monthKey)!;
      monthData.precisionSum += accuracy;
      monthData.performanceSum += performance;
      monthData.count += 1;
    });

    // Convertir en tableau et trier par date
    const sortedMonthlyData = Array.from(monthlyData.entries())
      .map(([monthKey, data]) => ({
        monthKey,
        averagePrecision: Math.round(data.precisionSum / data.count),
        averagePerformance: Math.round(data.performanceSum / data.count),
        date: data.date,
      }))
      .sort((a, b) => a.date.getTime() - b.date.getTime());

    // Grouper par intervalles de 6 mois en partant du plus récent
    const intervalsData: Array<{
      label: string;
      data: BarChartDataPoint[];
    }> = [];

    // Calculer le nombre de groupes et le reste
    const totalMonths = sortedMonthlyData.length;
    const remainder = totalMonths % 6;

    // Commencer par le groupe incomplet des plus anciens (si il y en a un)
    if (remainder > 0) {
      const incompleteGroup = sortedMonthlyData.slice(0, remainder);

      const startMonth = incompleteGroup[0].date;
      const endMonth = incompleteGroup[incompleteGroup.length - 1].date;

      const startMonthName = startMonth.toLocaleDateString('fr-FR', {
        month: 'short',
        year: 'numeric',
      });
      const endMonthName = endMonth.toLocaleDateString('fr-FR', {
        month: 'short',
        year: 'numeric',
      });

      const label = `${startMonthName} - ${endMonthName}`;

      const data: BarChartDataPoint[] = incompleteGroup.map((monthData) => ({
        mois: monthData.date.toLocaleDateString('fr-FR', {
          month: 'short',
          year: 'numeric',
        }),
        precision: monthData.averagePrecision,
        performance: monthData.averagePerformance,
      }));

      intervalsData.push({ label, data });
    }

    // Puis ajouter les groupes complets de 6 mois
    for (let i = remainder; i < totalMonths; i += 6) {
      const intervalMonths = sortedMonthlyData.slice(i, i + 6);

      if (intervalMonths.length === 0) continue;

      const startMonth = intervalMonths[0].date;
      const endMonth = intervalMonths[intervalMonths.length - 1].date;

      const startMonthName = startMonth.toLocaleDateString('fr-FR', {
        month: 'short',
        year: 'numeric',
      });
      const endMonthName = endMonth.toLocaleDateString('fr-FR', {
        month: 'short',
        year: 'numeric',
      });

      const label = `${startMonthName} - ${endMonthName}`;

      const data: BarChartDataPoint[] = intervalMonths.map((monthData) => ({
        mois: monthData.date.toLocaleDateString('fr-FR', {
          month: 'short',
          year: 'numeric',
        }),
        precision: monthData.averagePrecision,
        performance: monthData.averagePerformance,
      }));

      intervalsData.push({ label, data });
    }

    // Si aucun intervalle, créer un intervalle par défaut
    if (intervalsData.length === 0) {
      return {
        label: 'Aucune donnée',
        data: [],
        totalIntervals: 0,
      };
    }

    // Retourner l'intervalle demandé par l'index (en commençant par le plus récent)
    const totalIntervals = intervalsData.length;
    const requestedIntervalIndex = Math.min(index, totalIntervals - 1);
    const requestedInterval =
      intervalsData[totalIntervals - 1 - requestedIntervalIndex];

    return {
      label: requestedInterval.label,
      data: requestedInterval.data,
      totalIntervals,
    };
  }

  static async getSongGamingLineChartData(
    songId: string,
    userId: string,
    index: number,
    interval: number
  ): Promise<SongGamingLineChartData> {
    const totalSessions = await prisma.scores.count({
      where: {
        song_id: songId,
        user_id: userId,
        mode: {
          name: 'Jeu',
        },
      },
    });
    const sessions = await prisma.scores.findMany({
      where: {
        song_id: songId,
        user_id: userId,
        mode: {
          name: 'Jeu',
        },
      },
      include: {
        mode: true,
      },
      orderBy: {
        sessionStartTime: 'desc',
      },
      take: interval,
      skip: index * interval,
    });

    const orderedSessions = sessions.reverse();

    const data: LineChartDataPoint[] = [];
    const today = new Date();

    orderedSessions.forEach((session, index) => {
      const sessionDate = session.sessionStartTime;
      const isToday = sessionDate.toDateString() === today.toDateString();
      let displayName: string;

      if (isToday) {
        displayName = "Aujourd'hui";
      } else {
        const day = String(sessionDate.getDate()).padStart(2, '0');
        const month = String(sessionDate.getMonth() + 1).padStart(2, '0');
        const year = sessionDate.getFullYear();
        displayName = `${day}/${month}/${year}`;
      }

      data.push({
        session: displayName,
        score: session.totalPoints || 0,
        combo: session.maxCombo || 0,
        multi: session.maxMultiplier || 0,
      });
    });

    const averageScore = Math.round(
      data.reduce((sum, point) => sum + point.score, 0) / data.length
    );
    const averageCombo = Math.round(
      data.reduce((sum, point) => sum + point.combo, 0) / data.length
    );
    const averageMulti = Math.round(
      data.reduce((sum, point) => sum + point.multi, 0) / data.length
    );

    return {
      data,
      averageScore,
      averageCombo,
      averageMulti,
      totalSessions,
    };
  }

  static async getSongGamingBarChartData(
    songId: string,
    userId: string,
    index: number
  ): Promise<SongGamingBarChartData> {
    const sessions = await prisma.scores.findMany({
      where: {
        song_id: songId,
        user_id: userId,
        mode: { name: 'Jeu' },
      },
      include: {
        mode: true,
      },
      orderBy: {
        sessionStartTime: 'asc',
      },
    });

    if (sessions.length === 0) {
      return {
        label: 'Aucune donnée',
        data: [],
        totalIntervals: 0,
      };
    }
    // Grouper les sessions par mois et calculer les moyennes
    const monthlyData = new Map<
      string,
      {
        scoreSum: number;
        comboSum: number;
        multiSum: number;
        count: number;
        date: Date;
      }
    >();

    sessions.forEach((session) => {
      const sessionDate = session.sessionStartTime;
      const monthKey = `${sessionDate.getFullYear()}-${String(
        sessionDate.getMonth() + 1
      ).padStart(2, '0')}`;

      if (!monthlyData.has(monthKey)) {
        monthlyData.set(monthKey, {
          scoreSum: 0,
          comboSum: 0,
          multiSum: 0,
          count: 0,
          date: sessionDate,
        });
      }

      const monthData = monthlyData.get(monthKey)!;
      monthData.scoreSum += session.totalPoints || 0;
      monthData.comboSum += session.maxCombo || 0;
      monthData.multiSum += session.maxMultiplier || 0;
      monthData.count += 1;
    });

    // Convertir en tableau et trier par date
    const sortedMonthlyData = Array.from(monthlyData.entries())
      .map(([monthKey, data]) => ({
        monthKey,
        averageScore: Math.round(data.scoreSum / data.count),
        averageCombo: Math.round(data.comboSum / data.count),
        averageMulti: Math.round(data.multiSum / data.count),
        date: data.date,
      }))
      .sort((a, b) => a.date.getTime() - b.date.getTime());

    // Grouper par intervalles de 6 mois en partant du plus récent
    const intervalsData: Array<{
      label: string;
      data: SongGamingBarChartDataPoint[];
    }> = [];

    // Calculer le nombre de groupes et le reste
    const totalMonths = sortedMonthlyData.length;
    const remainder = totalMonths % 6;

    // Commencer par le groupe incomplet des plus anciens (si il y en a un)
    if (remainder > 0) {
      const incompleteGroup = sortedMonthlyData.slice(0, remainder);

      const startMonth = incompleteGroup[0].date;
      const endMonth = incompleteGroup[incompleteGroup.length - 1].date;

      const startMonthName = startMonth.toLocaleDateString('fr-FR', {
        month: 'short',
        year: 'numeric',
      });
      const endMonthName = endMonth.toLocaleDateString('fr-FR', {
        month: 'short',
        year: 'numeric',
      });

      const label = `${startMonthName} - ${endMonthName}`;

      const data: SongGamingBarChartDataPoint[] = incompleteGroup.map(
        (monthData) => ({
          mois: monthData.date.toLocaleDateString('fr-FR', {
            month: 'short',
            year: 'numeric',
          }),
          score: monthData.averageScore,
          combo: monthData.averageCombo,
          multi: monthData.averageMulti,
        })
      );

      intervalsData.push({ label, data });
    }

    // Puis ajouter les groupes complets de 6 mois
    for (let i = remainder; i < totalMonths; i += 6) {
      const intervalMonths = sortedMonthlyData.slice(i, i + 6);

      if (intervalMonths.length === 0) continue;

      const startMonth = intervalMonths[0].date;
      const endMonth = intervalMonths[intervalMonths.length - 1].date;

      const startMonthName = startMonth.toLocaleDateString('fr-FR', {
        month: 'short',
        year: 'numeric',
      });
      const endMonthName = endMonth.toLocaleDateString('fr-FR', {
        month: 'short',
        year: 'numeric',
      });

      const label = `${startMonthName} - ${endMonthName}`;

      const data: SongGamingBarChartDataPoint[] = intervalMonths.map(
        (monthData) => ({
          mois: monthData.date.toLocaleDateString('fr-FR', {
            month: 'short',
            year: 'numeric',
          }),
          score: monthData.averageScore,
          combo: monthData.averageCombo,
          multi: monthData.averageMulti,
        })
      );

      intervalsData.push({ label, data });
    }

    // Si aucun intervalle, créer un intervalle par défaut
    if (intervalsData.length === 0) {
      return {
        label: 'Aucune donnée',
        data: [],
        totalIntervals: 0,
      };
    }

    // Retourner l'intervalle demandé par l'index (en commençant par le plus récent)
    const totalIntervals = intervalsData.length;
    const requestedIntervalIndex = Math.min(index, totalIntervals - 1);
    const requestedInterval =
      intervalsData[totalIntervals - 1 - requestedIntervalIndex];

    return {
      label: requestedInterval.label,
      data: requestedInterval.data,
      totalIntervals,
    };
  }

  static async getSongTimelineRecordsData(
    songId: string,
    userId: string,
    mode: 'learning' | 'game'
  ): Promise<SongTimelineRecordsData> {
    const records: TimelineRecordData[] = [];
    let recordId = 1;

    // Récupérer toutes les sessions pour cette chanson et ce mode
    const sessions = await prisma.scores.findMany({
      where: {
        song_id: songId,
        user_id: userId,
        mode: {
          name: mode === 'learning' ? 'Apprentissage' : 'Jeu',
        },
      },
      orderBy: {
        sessionStartTime: 'asc',
      },
    });

    if (sessions.length === 0) {
      return { records: [] };
    }

    // Premier record : première session
    const firstSession = sessions[0];
    records.push({
      id: recordId++,
      date: firstSession.sessionStartTime.toISOString(),
      score: 0,
      type: mode === 'learning' ? 'start' : 'start_game',
      description:
        mode === 'learning'
          ? "Début de l'apprentissage"
          : 'Première session en mode Jeu',
      details:
        mode === 'learning'
          ? 'Vous avez commencé votre apprentissage de ce morceau. Le voyage commence !'
          : 'Vous avez joué ce morceau pour la première fois en mode Jeu. Bonne chance pour battre des records !',
    });

    // Records pour les meilleures performances
    if (mode === 'learning') {
      // Meilleure précision main droite
      const bestAccuracyRight = sessions
        .filter((s) => s.hands === 'right' && hasHandActivity(s))
        .map((s) => {
          const { accuracy } = getLearnScores(
            s.wrongNotes || 0,
            s.correctNotes || 0,
            s.missedNotes || 0
          );
          return { session: s, accuracy };
        })
        .sort((a, b) => b.accuracy - a.accuracy)[0];

      if (bestAccuracyRight && bestAccuracyRight.accuracy > 0) {
        records.push({
          id: recordId++,
          date: bestAccuracyRight.session.sessionStartTime.toISOString(),
          score: bestAccuracyRight.accuracy,
          type: 'accuracy_right',
          description: 'Meilleure précision main droite',
          details: `Vous avez atteint ${
            bestAccuracyRight.accuracy
          }% de précision avec votre main droite. ${getAccuracyComment(
            bestAccuracyRight.accuracy,
            'main droite'
          )}`,
        });
      }

      // Meilleure précision main gauche
      const bestAccuracyLeft = sessions
        .filter((s) => s.hands === 'left' && hasHandActivity(s))
        .map((s) => {
          const { accuracy } = getLearnScores(
            s.wrongNotes || 0,
            s.correctNotes || 0,
            s.missedNotes || 0
          );
          return { session: s, accuracy };
        })
        .sort((a, b) => b.accuracy - a.accuracy)[0];

      if (bestAccuracyLeft && bestAccuracyLeft.accuracy > 0) {
        records.push({
          id: recordId++,
          date: bestAccuracyLeft.session.sessionStartTime.toISOString(),
          score: bestAccuracyLeft.accuracy,
          type: 'accuracy_left',
          description: 'Meilleure précision main gauche',
          details: `Vous avez atteint ${
            bestAccuracyLeft.accuracy
          }% de précision avec votre main gauche. ${getAccuracyComment(
            bestAccuracyLeft.accuracy,
            'main gauche'
          )}`,
        });
      }

      // Meilleure précision deux mains
      const bestAccuracyBoth = sessions
        .filter((s) => s.hands === 'both' && hasHandActivity(s))
        .map((s) => {
          const { accuracy } = getLearnScores(
            s.wrongNotes || 0,
            s.correctNotes || 0,
            s.missedNotes || 0
          );
          return { session: s, accuracy };
        })
        .sort((a, b) => b.accuracy - a.accuracy)[0];

      if (bestAccuracyBoth && bestAccuracyBoth.accuracy > 0) {
        records.push({
          id: recordId++,
          date: bestAccuracyBoth.session.sessionStartTime.toISOString(),
          score: bestAccuracyBoth.accuracy,
          type: 'accuracy_both',
          description: 'Meilleure précision deux mains',
          details: `Vous avez atteint ${
            bestAccuracyBoth.accuracy
          }% de précision avec les deux mains. ${getBothHandsAccuracyComment(
            bestAccuracyBoth.accuracy
          )}`,
        });
      }

      // Meilleure performance main droite
      const bestPerformanceRight = sessions
        .filter((s) => s.hands === 'right' && hasHandActivity(s))
        .map((s) => {
          const { performance } = getLearnScores(
            s.wrongNotes || 0,
            s.correctNotes || 0,
            s.missedNotes || 0
          );
          return { session: s, performance };
        })
        .sort((a, b) => b.performance - a.performance)[0];

      if (bestPerformanceRight && bestPerformanceRight.performance > 0) {
        records.push({
          id: recordId++,
          date: bestPerformanceRight.session.sessionStartTime.toISOString(),
          score: bestPerformanceRight.performance,
          type: 'performance_right',
          description: 'Meilleure performance main droite',
          details: `Vous avez atteint ${
            bestPerformanceRight.performance
          }% de performance avec votre main droite. ${getPerformanceComment(
            bestPerformanceRight.performance,
            'main droite'
          )}`,
        });
      }

      // Meilleure performance main gauche
      const bestPerformanceLeft = sessions
        .filter((s) => s.hands === 'left' && hasHandActivity(s))
        .map((s) => {
          const { performance } = getLearnScores(
            s.wrongNotes || 0,
            s.correctNotes || 0,
            s.missedNotes || 0
          );
          return { session: s, performance };
        })
        .sort((a, b) => b.performance - a.performance)[0];

      if (bestPerformanceLeft && bestPerformanceLeft.performance > 0) {
        records.push({
          id: recordId++,
          date: bestPerformanceLeft.session.sessionStartTime.toISOString(),
          score: bestPerformanceLeft.performance,
          type: 'performance_left',
          description: 'Meilleure performance main gauche',
          details: `Vous avez atteint ${
            bestPerformanceLeft.performance
          }% de performance avec votre main gauche. ${getPerformanceComment(
            bestPerformanceLeft.performance,
            'main gauche'
          )}`,
        });
      }

      // Meilleure performance deux mains
      const bestPerformanceBoth = sessions
        .filter((s) => s.hands === 'both' && hasHandActivity(s))
        .map((s) => {
          const { performance } = getLearnScores(
            s.wrongNotes || 0,
            s.correctNotes || 0,
            s.missedNotes || 0
          );
          return { session: s, performance };
        })
        .sort((a, b) => b.performance - a.performance)[0];

      if (bestPerformanceBoth && bestPerformanceBoth.performance > 0) {
        // Vérifier si la performance dépasse 90% pour afficher "Musique terminée"
        if (bestPerformanceBoth.performance >= 90) {
          records.push({
            id: recordId++,
            date: bestPerformanceBoth.session.sessionStartTime.toISOString(),
            score: bestPerformanceBoth.performance,
            type: 'finished',
            description: 'Musique terminée !',
            details: `Félicitations ! Vous avez atteint ${
              bestPerformanceBoth.performance
            }% de performance avec les deux mains. ${getFinishedComment(
              bestPerformanceBoth.performance
            )}`,
          });
        } else {
          records.push({
            id: recordId++,
            date: bestPerformanceBoth.session.sessionStartTime.toISOString(),
            score: bestPerformanceBoth.performance,
            type: 'performance_both',
            description: 'Meilleure performance deux mains',
            details: `Vous avez atteint ${
              bestPerformanceBoth.performance
            }% de performance avec les deux mains. ${getBothHandsPerformanceComment(
              bestPerformanceBoth.performance
            )}`,
          });
        }
      }

      // Session la plus longue
      const longestSession = sessions.reduce((longest, session) => {
        const duration =
          session.sessionEndTime.getTime() - session.sessionStartTime.getTime();
        const longestDuration =
          longest.sessionEndTime.getTime() - longest.sessionStartTime.getTime();
        return duration > longestDuration ? session : longest;
      });

      const longestDurationMinutes = Math.round(
        (longestSession.sessionEndTime.getTime() -
          longestSession.sessionStartTime.getTime()) /
          (1000 * 60)
      );

      records.push({
        id: recordId++,
        date: longestSession.sessionStartTime.toISOString(),
        score: longestDurationMinutes,
        type: 'session',
        description: 'Session la plus longue',
        details: `Vous avez pratiqué pendant ${longestDurationMinutes} minutes d'affilée. ${getSessionComment(
          longestDurationMinutes
        )}`,
      });

      // Session marathon (> 60 min)
      const marathonSession = sessions.find((session) => {
        const durationMinutes = Math.round(
          (session.sessionEndTime.getTime() -
            session.sessionStartTime.getTime()) /
            (1000 * 60)
        );
        return durationMinutes >= 60;
      });

      if (marathonSession) {
        const marathonDurationMinutes = Math.round(
          (marathonSession.sessionEndTime.getTime() -
            marathonSession.sessionStartTime.getTime()) /
            (1000 * 60)
        );

        records.push({
          id: recordId++,
          date: marathonSession.sessionStartTime.toISOString(),
          score: marathonDurationMinutes,
          type: 'session',
          description: 'Session marathon',
          details: `Session marathon de ${marathonDurationMinutes} minutes ! ${getMarathonComment(
            marathonDurationMinutes
          )}`,
        });
      }
    } else {
      // Mode jeu
      // Meilleur score
      const bestScore = sessions
        .filter((s) => s.totalPoints && s.totalPoints > 0)
        .sort((a, b) => (b.totalPoints || 0) - (a.totalPoints || 0))[0];

      if (bestScore && bestScore.totalPoints) {
        records.push({
          id: recordId++,
          date: bestScore.sessionStartTime.toISOString(),
          score: bestScore.totalPoints,
          type: 'score',
          description: 'Meilleur score',
          details: `Vous avez obtenu ${bestScore.totalPoints.toLocaleString()} points. ${getScoreComment(
            bestScore.totalPoints
          )}`,
        });
      }

      // Meilleur combo
      const bestCombo = sessions
        .filter((s) => s.maxCombo && s.maxCombo > 0)
        .sort((a, b) => (b.maxCombo || 0) - (a.maxCombo || 0))[0];

      if (bestCombo && bestCombo.maxCombo) {
        records.push({
          id: recordId++,
          date: bestCombo.sessionStartTime.toISOString(),
          score: bestCombo.maxCombo,
          type: 'combo',
          description: 'Meilleur combo',
          details: `Vous avez enchaîné ${
            bestCombo.maxCombo
          } notes d'affilée. ${getComboComment(bestCombo.maxCombo)}`,
        });
      }

      // Meilleur multiplicateur
      const bestMultiplier = sessions
        .filter((s) => s.maxMultiplier && s.maxMultiplier > 0)
        .sort((a, b) => (b.maxMultiplier || 0) - (a.maxMultiplier || 0))[0];

      if (bestMultiplier && bestMultiplier.maxMultiplier) {
        records.push({
          id: recordId++,
          date: bestMultiplier.sessionStartTime.toISOString(),
          score: bestMultiplier.maxMultiplier,
          type: 'multiplier',
          description: 'Meilleur multiplicateur',
          details: `Vous avez atteint un multiplicateur de x${
            bestMultiplier.maxMultiplier
          }. ${getMultiplierComment(bestMultiplier.maxMultiplier)}`,
        });
      }
    }

    // Trier les records par date
    records.sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
    );

    return { records };
  }
}
