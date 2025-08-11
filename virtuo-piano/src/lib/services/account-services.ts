import prisma from '@/lib/prisma';
import argon2 from 'argon2';
import { RectificationData } from '@/lib/validations/auth-schemas';

export interface DeleteUserResponse {
  success: boolean;
  message: string;
}

const argon2Config = {
  type: argon2.argon2id,
  memoryCost: 65536,
  timeCost: 3,
  parallelism: 4,
};

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

export interface GetUserDataResponse {
  success: boolean;
  data?: {
    userName: string;
    email: string;
    level: number;
    xp: number;
  };
  message: string;
}

export interface UpdateUserDataRequest extends RectificationData {}

export interface UpdateUserDataResponse {
  success: boolean;
  message: string;
}

export interface WithdrawConsentResponse {
  success: boolean;
  message: string;
}

export interface InactiveUser {
  id: string;
  email: string;
  userName: string;
  lastLoginAt: Date | null;
  createdAt: Date;
}

export interface InactiveUsersResponse {
  success: boolean;
  data?: InactiveUser[];
  message: string;
}

export interface DeleteInactiveUsersResponse {
  success: boolean;
  deletedCount: number;
  message: string;
}

export class AccountServices {
  static async getUserData(userId: string): Promise<GetUserDataResponse> {
    try {
      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: {
          userName: true,
          email: true,
          level: true,
          xp: true,
        },
      });

      if (!user) {
        return {
          success: false,
          message: 'Utilisateur non trouvé',
        };
      }

      return {
        success: true,
        data: user,
        message: 'Données utilisateur récupérées avec succès',
      };
    } catch (error) {
      console.error(
        'Erreur lors de la récupération des données utilisateur:',
        error
      );
      return {
        success: false,
        message: 'Erreur lors de la récupération des données utilisateur',
      };
    }
  }

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
          privacyConsent: true,
          privacyConsentAt: true,
          lastLoginAt: true,
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

  static async updateUserData(
    userId: string,
    data: UpdateUserDataRequest
  ): Promise<UpdateUserDataResponse> {
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

      const updateData: any = {};

      // Vérifier si l'email est déjà utilisé par un autre utilisateur
      if (data.email && data.email !== user.email) {
        const existingUser = await prisma.user.findUnique({
          where: { email: data.email },
        });
        if (existingUser) {
          return {
            success: false,
            message: 'Cette adresse email est déjà utilisée',
          };
        }
        updateData.email = data.email;
      }

      // Mettre à jour le nom d'utilisateur
      if (data.userName && data.userName !== user.userName) {
        updateData.userName = data.userName;
      }

      // Vérifier et mettre à jour le mot de passe
      if (data.currentPassword && data.newPassword) {
        const isPasswordValid = await argon2.verify(
          user.password,
          data.currentPassword
        );
        if (!isPasswordValid) {
          return {
            success: false,
            message: 'Le mot de passe actuel est incorrect',
          };
        }
        updateData.password = await argon2.hash(data.newPassword, argon2Config);
      }

      // Réinitialiser le niveau si demandé
      if (data.resetLevel) {
        updateData.level = 1;
        updateData.xp = 0;
      }

      // Mettre à jour l'utilisateur
      if (Object.keys(updateData).length > 0) {
        await prisma.user.update({
          where: { id: userId },
          data: updateData,
        });
      }

      return {
        success: true,
        message: 'Données mises à jour avec succès',
      };
    } catch (error) {
      console.error('Erreur lors de la mise à jour des données:', error);
      return {
        success: false,
        message: 'Erreur lors de la mise à jour des données',
      };
    }
  }

  static async withdrawConsent(
    userId: string
  ): Promise<WithdrawConsentResponse> {
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

      await prisma.user.update({
        where: { id: userId },
        data: {
          privacyConsent: false,
          privacyConsentAt: null,
        },
      });

      return {
        success: true,
        message: 'Consentement retiré avec succès. Redirection en cours...',
      };
    } catch (error) {
      console.error('Erreur lors du retrait du consentement:', error);
      return {
        success: false,
        message: 'Erreur lors du retrait du consentement',
      };
    }
  }

  static async getInactiveUsers(): Promise<InactiveUsersResponse> {
    try {
      const oneYearAgo = new Date();
      oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);

      const inactiveUsers = await prisma.user.findMany({
        where: {
          OR: [
            { lastLoginAt: { lt: oneYearAgo } },
            {
              lastLoginAt: null,
              createdAt: { lt: oneYearAgo },
            },
          ],
        },
        select: {
          id: true,
          email: true,
          userName: true,
          lastLoginAt: true,
          createdAt: true,
        },
      });

      return {
        success: true,
        data: inactiveUsers,
        message: `${inactiveUsers.length} utilisateurs inactifs trouvés`,
      };
    } catch (error) {
      console.error(
        'Erreur lors de la récupération des utilisateurs inactifs:',
        error
      );
      return {
        success: false,
        message: 'Erreur lors de la récupération des utilisateurs inactifs',
      };
    }
  }

  static async getUsersToDelete(): Promise<InactiveUsersResponse> {
    try {
      const oneYearAgo = new Date();
      oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);

      const usersToDelete = await prisma.user.findMany({
        where: {
          OR: [
            { lastLoginAt: { lt: oneYearAgo } },
            {
              lastLoginAt: null,
              createdAt: { lt: oneYearAgo },
            },
          ],
        },
        select: {
          id: true,
          email: true,
          userName: true,
          lastLoginAt: true,
          createdAt: true,
        },
      });

      return {
        success: true,
        data: usersToDelete,
        message: `${usersToDelete.length} utilisateurs à supprimer trouvés`,
      };
    } catch (error) {
      console.error(
        'Erreur lors de la récupération des utilisateurs à supprimer:',
        error
      );
      return {
        success: false,
        message: 'Erreur lors de la récupération des utilisateurs à supprimer',
      };
    }
  }

  static async deleteInactiveUsers(): Promise<DeleteInactiveUsersResponse> {
    try {
      const oneYearAgo = new Date();
      oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);

      // Récupérer les utilisateurs à supprimer
      const usersToDelete = await prisma.user.findMany({
        where: {
          OR: [
            { lastLoginAt: { lt: oneYearAgo } },
            {
              lastLoginAt: null,
              createdAt: { lt: oneYearAgo },
            },
          ],
        },
        select: {
          id: true,
        },
      });

      if (usersToDelete.length === 0) {
        return {
          success: true,
          deletedCount: 0,
          message: 'Aucun utilisateur inactif à supprimer',
        };
      }

      let deletedCount = 0;

      // Supprimer chaque utilisateur et ses données associées
      for (const user of usersToDelete) {
        try {
          await prisma.$transaction(async (tx) => {
            // Supprimer toutes les données liées
            await tx.scores.deleteMany({
              where: { user_id: user.id },
            });

            await tx.usersCompositions.deleteMany({
              where: { user_id: user.id },
            });

            await tx.usersFavorites.deleteMany({
              where: { user_id: user.id },
            });

            await tx.usersImports.deleteMany({
              where: { user_id: user.id },
            });

            await tx.userChallengeProgress.deleteMany({
              where: { userId: user.id },
            });

            // Supprimer l'utilisateur
            await tx.user.delete({
              where: { id: user.id },
            });
          });

          deletedCount++;
        } catch (error) {
          console.error(
            `Erreur lors de la suppression de l'utilisateur ${user.id}:`,
            error
          );
        }
      }

      return {
        success: true,
        deletedCount,
        message: `${deletedCount} utilisateurs inactifs supprimés avec succès`,
      };
    } catch (error) {
      console.error(
        'Erreur lors de la suppression des utilisateurs inactifs:',
        error
      );
      return {
        success: false,
        deletedCount: 0,
        message: 'Erreur lors de la suppression des utilisateurs inactifs',
      };
    }
  }
}
