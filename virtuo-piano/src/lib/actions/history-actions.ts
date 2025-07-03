'use server';

import { getServerSession } from 'next-auth';
import { authOptions } from '../authoption';
import {
  PerformancesServices,
  ScoreSummaryService,
} from '../services/performances-services';
import { ScoreSummary } from '@/components/cards/ScoreCard';
import { getLearnScores } from '@/common/utils/function';

export async function getRecentSessions(limit: number = 3): Promise<{
  success: boolean;
  data: ScoreSummary[];
  error?: string;
}> {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      throw new Error('Utilisateur non connecté');
    }

    const userId = session.user.id;

    // Récupérer les sessions récentes depuis le service
    const sessions = await PerformancesServices.getRecentSessionsData(
      userId,
      limit
    );

    // Transformer les données en format ScoreSummary avec la logique métier
    const scoreSummaries: ScoreSummary[] = sessions.map((score) => {
      const durationMs =
        score.sessionEndTime.getTime() - score.sessionStartTime.getTime();
      const durationInMinutes = Math.round(durationMs / (1000 * 60));

      // Utiliser la fonction existante pour calculer la précision et la performance
      const { performance, accuracy } = getLearnScores(
        score.wrongNotes || 0,
        score.correctNotes || 0,
        score.missedNotes || 0
      );

      // Formater la date
      const now = new Date();
      const sessionDate = score.sessionStartTime;
      const diffTime = Math.abs(now.getTime() - sessionDate.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      let playedAt: string;
      if (diffDays === 1) {
        playedAt = "Aujourd'hui";
      } else if (diffDays === 2) {
        playedAt = 'Hier';
      } else if (diffDays <= 7) {
        playedAt = `Il y a ${diffDays - 1} jours`;
      } else if (diffDays <= 30) {
        const weeks = Math.floor((diffDays - 1) / 7);
        playedAt = `Il y a ${weeks} semaine${weeks > 1 ? 's' : ''}`;
      } else {
        playedAt = sessionDate.toLocaleDateString('fr-FR', {
          day: 'numeric',
          month: 'long',
        });
      }

      // Ajouter l'heure si c'est aujourd'hui ou hier
      if (diffDays <= 2) {
        playedAt += `, ${sessionDate.toLocaleTimeString('fr-FR', {
          hour: '2-digit',
          minute: '2-digit',
        })}`;
      }

      // Formater la durée
      const hours = Math.floor(durationInMinutes / 60);
      const minutes = durationInMinutes % 60;
      const duration =
        hours > 0
          ? `${hours}:${minutes.toString().padStart(2, '0')}`
          : `${minutes}:00`;

      return {
        id: score.id,
        songTitle: score.songTitle,
        songComposer: score.songComposer || undefined,

        totalPoints: score.totalPoints || 0,
        maxMultiplier: score.maxMultiplier || 0,
        maxCombo: score.maxCombo || 0,
        playedAt,
        mode: score.modeName === 'Apprentissage' ? 'learning' : 'game',
        accuracy,
        duration,
        imageUrl: score.imageUrl || undefined,
        performance,
      };
    });

    return {
      success: true,
      data: scoreSummaries,
    };
  } catch (error) {
    console.error(
      'Erreur lors de la récupération des sessions récentes:',
      error
    );
    return {
      success: false,
      data: [],
      error: error instanceof Error ? error.message : 'Erreur inconnue',
    };
  }
}

// A TESTER
export async function getAllSessions(): Promise<{
  success: boolean;
  data: ScoreSummary[];
  error?: string;
}> {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      throw new Error('Utilisateur non connecté');
    }

    const userId = session.user.id;

    // Récupérer toutes les sessions depuis le service (sans limite)
    const sessions = await PerformancesServices.getAllSessionsData(userId);

    // Transformer les données en format ScoreSummary avec la logique métier
    const scoreSummaries: ScoreSummary[] = sessions.map(
      (score: ScoreSummaryService) => {
        const durationMs =
          score.sessionEndTime.getTime() - score.sessionStartTime.getTime();
        const durationInMinutes = Math.round(durationMs / (1000 * 60));

        // Utiliser la fonction existante pour calculer la précision et la performance
        const { performance, accuracy } = getLearnScores(
          score.wrongNotes || 0,
          score.correctNotes || 0,
          score.missedNotes || 0
        );

        // Formater la date
        const now = new Date();
        const sessionDate = score.sessionStartTime;
        const diffTime = Math.abs(now.getTime() - sessionDate.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        let playedAt: string;
        if (diffDays === 1) {
          playedAt = "Aujourd'hui";
        } else if (diffDays === 2) {
          playedAt = 'Hier';
        } else if (diffDays <= 7) {
          playedAt = `Il y a ${diffDays - 1} jours`;
        } else if (diffDays <= 30) {
          const weeks = Math.floor((diffDays - 1) / 7);
          playedAt = `Il y a ${weeks} semaine${weeks > 1 ? 's' : ''}`;
        } else {
          playedAt = sessionDate.toLocaleDateString('fr-FR', {
            day: 'numeric',
            month: 'long',
          });
        }

        // Ajouter l'heure si c'est aujourd'hui ou hier
        if (diffDays <= 2) {
          playedAt += `, ${sessionDate.toLocaleTimeString('fr-FR', {
            hour: '2-digit',
            minute: '2-digit',
          })}`;
        }

        // Formater la durée
        const hours = Math.floor(durationInMinutes / 60);
        const minutes = durationInMinutes % 60;
        const duration =
          hours > 0
            ? `${hours}:${minutes.toString().padStart(2, '0')}`
            : `${minutes}:00`;

        return {
          id: score.id,
          songTitle: score.songTitle,
          songComposer: score.songComposer || undefined,
          totalPoints: score.totalPoints || 0,
          maxMultiplier: score.maxMultiplier || 0,
          maxCombo: score.maxCombo || 0,
          playedAt,
          mode: score.modeName === 'Apprentissage' ? 'learning' : 'game',
          accuracy,
          duration,
          imageUrl: score.imageUrl || undefined,
          performance,
        };
      }
    );

    return {
      success: true,
      data: scoreSummaries,
    };
  } catch (error) {
    console.error(
      'Erreur lors de la récupération de toutes les sessions:',
      error
    );
    return {
      success: false,
      data: [],
      error: error instanceof Error ? error.message : 'Erreur inconnue',
    };
  }
}
