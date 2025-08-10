import prisma from '@/lib/prisma';

export interface DeleteUserResponse {
  success: boolean;
  message: string;
}

export interface ExportUserDataResponse {
  success: boolean;
  data?: {
    user: any;
    scores: any[];
    compositions: any[];
    favorites: any[];
    imports: any[];
    challengeProgress: any[];
  };
  message: string;
}

export class AccountServices {
  static async deleteUser(userId: string): Promise<DeleteUserResponse> {
    try {
      const user = await prisma.user.findUnique({
        where: { id: userId },
      });

      if (!user) {
        return {
          success: false,
          message: 'Utilisateur non trouvé',
        };
      }

      // Supprimer toutes les données liées à l'utilisateur dans une transaction
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

  static async exportUserData(userId: string): Promise<ExportUserDataResponse> {
    try {
      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: {
          id: true,
          email: true,
          userName: true,
          level: true,
          xp: true,
          preferences: true,
          createdAt: true,
          updatedAt: true,
        },
      });

      if (!user) {
        return {
          success: false,
          message: 'Utilisateur non trouvé',
        };
      }

      // Récupérer toutes les données liées à l'utilisateur
      const [scores, compositions, favorites, imports, challengeProgress] =
        await Promise.all([
          prisma.scores.findMany({
            where: { user_id: userId },
            include: {
              song: {
                select: {
                  id: true,
                  title: true,
                  composer: true,
                  genre: true,
                  Level: true,
                  SongType: true,
                  imageUrl: true,
                  createdAt: true,
                  key: {
                    select: {
                      id: true,
                      name: true,
                    },
                  },
                },
              },
              mode: {
                select: {
                  id: true,
                  name: true,
                  description: true,
                },
              },
            },
          }),
          prisma.usersCompositions.findMany({
            where: { user_id: userId },
            include: {
              song: {
                select: {
                  id: true,
                  title: true,
                  composer: true,
                  genre: true,
                  Level: true,
                  SongType: true,
                  imageUrl: true,
                  createdAt: true,
                  key: {
                    select: {
                      id: true,
                      name: true,
                    },
                  },
                },
              },
            },
          }),
          prisma.usersFavorites.findMany({
            where: { user_id: userId },
            include: {
              song: {
                select: {
                  id: true,
                  title: true,
                  composer: true,
                  genre: true,
                  Level: true,
                  SongType: true,
                  imageUrl: true,
                  createdAt: true,
                  key: {
                    select: {
                      id: true,
                      name: true,
                    },
                  },
                },
              },
            },
          }),
          prisma.usersImports.findMany({
            where: { user_id: userId },
            include: {
              song: {
                select: {
                  id: true,
                  title: true,
                  composer: true,
                  genre: true,
                  Level: true,
                  SongType: true,
                  imageUrl: true,
                  createdAt: true,
                  key: {
                    select: {
                      id: true,
                      name: true,
                    },
                  },
                },
              },
            },
          }),
          prisma.userChallengeProgress.findMany({
            where: { userId },
            include: {
              challenge: {
                select: {
                  id: true,
                  name: true,
                  description: true,
                  levels: {
                    select: {
                      id: true,
                      level: true,
                      name: true,
                      description: true,
                      requirement: true,
                      reward: true,
                    },
                  },
                },
              },
            },
          }),
        ]);

      return {
        success: true,
        data: {
          user,
          scores,
          compositions,
          favorites,
          imports,
          challengeProgress,
        },
        message: 'Données exportées avec succès',
      };
    } catch (error) {
      console.error("Erreur lors de l'export des données:", error);
      return {
        success: false,
        message: "Erreur lors de l'export des données",
      };
    }
  }
}
