import prisma from '@/lib/prisma';
import { getLearnScores, getDifficultyRange } from '@/common/utils/function';

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
        // Semaine en cours (lundi à dimanche)
        const dayOfWeek = now.getDay();
        const daysToMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
        startDate = new Date(now);
        startDate.setDate(now.getDate() - daysToMonday);
        startDate.setHours(0, 0, 0, 0);
        endDate = new Date(startDate);
        endDate.setDate(startDate.getDate() + 6);
        endDate.setHours(23, 59, 59, 999);
        break;

      case 'month':
        // Mois en cours
        startDate = new Date(now.getFullYear(), now.getMonth(), 1);
        endDate = new Date(
          now.getFullYear(),
          now.getMonth() + 1,
          0,
          23,
          59,
          59,
          999
        );
        break;

      case 'quarter':
        // Trimestre en cours
        const currentQuarter = Math.floor(now.getMonth() / 3);
        const quarterStartMonth = currentQuarter * 3;
        startDate = new Date(now.getFullYear(), quarterStartMonth, 1);
        endDate = new Date(
          now.getFullYear(),
          quarterStartMonth + 3,
          0,
          23,
          59,
          59,
          999
        );
        break;

      default:
        throw new Error('Intervalle invalide');
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
        // Semaine précédente (lundi à dimanche)
        const dayOfWeek = now.getDay();
        const daysToMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
        const currentWeekStart = new Date(now);
        currentWeekStart.setDate(now.getDate() - daysToMonday);
        startDate = new Date(currentWeekStart);
        startDate.setDate(currentWeekStart.getDate() - 7);
        startDate.setHours(0, 0, 0, 0);
        endDate = new Date(startDate);
        endDate.setDate(startDate.getDate() + 6);
        endDate.setHours(23, 59, 59, 999);
        break;

      case 'month':
        // Mois précédent
        startDate = new Date(now.getFullYear(), now.getMonth() - 1, 1);
        endDate = new Date(
          now.getFullYear(),
          now.getMonth(),
          0,
          23,
          59,
          59,
          999
        );
        break;

      case 'quarter':
        // Trimestre précédent
        const currentQuarter = Math.floor(now.getMonth() / 3);
        const previousQuarterStartMonth = (currentQuarter - 1) * 3;
        const year =
          previousQuarterStartMonth < 0
            ? now.getFullYear() - 1
            : now.getFullYear();
        const adjustedMonth =
          previousQuarterStartMonth < 0
            ? previousQuarterStartMonth + 12
            : previousQuarterStartMonth;
        startDate = new Date(year, adjustedMonth, 1);
        endDate = new Date(year, adjustedMonth + 3, 0, 23, 59, 59, 999);
        break;

      default:
        throw new Error('Intervalle invalide');
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

  static async getRecentSessions(
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
}
