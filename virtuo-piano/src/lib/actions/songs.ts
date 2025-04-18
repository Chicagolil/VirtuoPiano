'use server';

import { revalidatePath } from 'next/cache';
import prisma from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '../authoption';

/**
 * Action serveur pour ajouter ou supprimer une chanson des favoris
 * @param songId - L'ID de la chanson à ajouter/supprimer des favoris
 * @returns Un objet contenant le statut de l'opération et un message
 */
export async function toggleFavorite(songId: string) {
  try {
    // Récupérer la session de l'utilisateur
    const session = await getServerSession(authOptions);

    // Vérifier si l'utilisateur est connecté
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
