'use server';

import { revalidatePath } from 'next/cache';
import prisma from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '../authoption';
import { Songs } from '@prisma/client';

/**
 * Action serveur pour ajouter ou supprimer une chanson des favoris
 * @param songId - L'ID de la chanson à ajouter/supprimer des favoris
 * @returns Un objet contenant le statut de l'opération et un message
 */
export async function toggleFavorite(songId: string) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return {
        success: false,
        message: 'Vous devez être connecté pour ajouter des favoris',
      };
    }

    const userId = session.user.id;

    // Vérifier si la chanson existe déjà dans les favoris
    const existingFavorite = await prisma.usersFavorites.findFirst({
      where: {
        user_id: userId,
        song_id: songId,
      },
    });

    if (existingFavorite) {
      // Supprimer des favoris
      await prisma.usersFavorites.deleteMany({
        where: {
          user_id: userId,
          song_id: songId,
        },
      });

      return {
        success: true,
        message: 'Chanson retirée des favoris',
        isFavorite: false,
      };
    } else {
      // Ajouter aux favoris
      await prisma.usersFavorites.create({
        data: {
          user_id: userId,
          song_id: songId,
        },
      });

      return {
        success: true,
        message: 'Chanson ajoutée aux favoris',
        isFavorite: true,
      };
    }
  } catch (error) {
    console.error('Erreur lors de la modification des favoris:', error);
    return {
      success: false,
      message: 'Une erreur est survenue lors de la modification des favoris',
    };
  } finally {
    // Revalider le chemin pour mettre à jour l'interface utilisateur
    revalidatePath('/library');
  }
}

export type SongById = Songs & {
  key: {
    id: string;
    name: string;
  };
  similarSongs?: {
    id: string;
    title: string;
    composer: string | null;
  }[];
  playSessions?: {
    id: string;
    totalPoints: number;
    played_at: Date;
    mode: {
      id: string;
      name: string;
    };
  }[];
  learnSessions?: {
    id: string;
    correctNotes: number | null;
    wrongNotes: number | null;
    missedNotes: number | null;
    played_at: Date;
    mode: {
      id: string;
      name: string;
    };
  }[];
  globalMaxScore: {
    totalPoints: number;
    played_at: Date;
    user: {
      id: string;
      userName: string;
    };
  }[];
  isFavorite?: boolean;
  createdAt: Date;
};

export async function getSongById(songId: string) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return {
        success: false,
        message: 'Vous devez être connecté pour accéder à cette page',
      };
    }

    const userId = session.user.id;

    const song = await prisma.songs.findUnique({
      where: { id: songId },
      include: {
        key: true,
      },
    });

    if (!song) {
      return null;
    }

    const similarSongs = await prisma.songs.findMany({
      where: {
        AND: [
          {
            Level: {
              gte: Math.max(1, song.Level - 2),
              lte: Math.min(10, song.Level + 2),
            },
          },
          { genre: song.genre },
          { SourceType: 'library' },
          { id: { not: songId } }, // Exclure la chanson actuelle
        ],
      },
      select: {
        id: true,
        title: true,
        composer: true,
      },
      take: 5, // Limiter à 5 chansons similaires
    });

    // Récupérer les 3 dernières sessions du mode Jeu
    const playSessions = await prisma.scores.findMany({
      where: {
        song_id: songId,
        user_id: userId,
        mode: {
          name: 'Jeu',
        },
      },
      select: {
        id: true,
        totalPoints: true,
        played_at: true,
        mode: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      orderBy: {
        played_at: 'desc',
      },
    });

    // Récupérer les 3 dernières sessions du mode Apprentissage
    const learnSessions = await prisma.scores.findMany({
      where: {
        song_id: songId,
        user_id: userId,
        mode: {
          name: 'Apprentissage',
        },
      },
      select: {
        id: true,
        correctNotes: true,
        wrongNotes: true,
        missedNotes: true,
        played_at: true,
        mode: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      orderBy: {
        played_at: 'desc',
      },
    });

    const globalMaxScore = await prisma.scores.findMany({
      where: {
        song_id: songId,
        mode: {
          name: 'Jeu',
        },
      },
      select: {
        totalPoints: true,
        played_at: true,
        user: {
          select: {
            id: true,
            userName: true,
          },
        },
      },
      orderBy: {
        totalPoints: 'desc',
      },
      distinct: ['user_id'],
    });

    // Vérifier si la chanson est dans les favoris de l'utilisateur
    const favorite = await prisma.usersFavorites.findFirst({
      where: {
        user_id: userId,
        song_id: songId,
      },
    });

    return {
      ...song,
      similarSongs,
      playSessions,
      learnSessions,
      globalMaxScore,
      isFavorite: !!favorite,
    };
  } catch (error) {
    console.error('Erreur lors de la récupération de la chanson:', error);
    return {
      success: false,
      message: 'Une erreur est survenue lors de la récupération de la chanson',
    };
  }
}
