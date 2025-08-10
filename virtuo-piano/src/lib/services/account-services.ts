import prisma from '@/lib/prisma';

export interface DeleteUserResponse {
  success: boolean;
  message: string;
}
export class AccountServices {
  static async deleteUser(userId: string): Promise<DeleteUserResponse> {
    try {
      // Vérifier que l'utilisateur existe
      const user = await prisma.user.findUnique({
        where: { id: userId },
        include: {
          scores: true,
          compositions: true,
          favorites: true,
          imports: true,
          challengeProgress: true,
        },
      });

      if (!user) {
        return {
          success: false,
          message: 'Utilisateur non trouvé',
        };
      }

      // Supprimer toutes les données associées à l'utilisateur
      await prisma.$transaction(async (tx) => {
        // scores
        await tx.scores.deleteMany({
          where: { user_id: userId },
        });

        // compositions
        await tx.usersCompositions.deleteMany({
          where: { user_id: userId },
        });

        // favoris
        await tx.usersFavorites.deleteMany({
          where: { user_id: userId },
        });

        // imports
        await tx.usersImports.deleteMany({
          where: { user_id: userId },
        });

        //  progression des défis
        await tx.userChallengeProgress.deleteMany({
          where: { userId },
        });

        // l'utilisateur
        await tx.user.delete({
          where: { id: userId },
        });
      });

      return {
        success: true,
        message: 'Compte et toutes les données supprimés avec succès',
      };
    } catch (error) {
      console.error('Erreur lors de la suppression du compte:', error);
      return {
        success: false,
        message: 'Erreur lors de la suppression du compte',
      };
    }
  }
}
