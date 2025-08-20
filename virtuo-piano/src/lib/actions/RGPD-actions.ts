'use server';

import {
  DeleteUserResponse,
  ExportUserDataResponse,
  UpdateUserDataRequest,
  UpdateUserDataResponse,
  GetUserDataResponse,
  WithdrawConsentResponse,
  AccountServices,
} from '@/lib/services/account-services';
import { getAuthenticatedUser } from '@/lib/auth/get-authenticated-user';
import { rectificationSchema } from '@/lib/validations/auth-schemas';
import { EmailService } from '../services/email-service';
import { LoginAttemptsService } from '../services/login-attempts-service';
import prisma from '@/lib/prisma';

export const getUserDataAction = async (): Promise<GetUserDataResponse> => {
  try {
    const user = await getAuthenticatedUser();
    if (!user) {
      return {
        success: false,
        message: 'Utilisateur non authentifié',
      };
    }

    const result = await AccountServices.getUserData(user.id);
    return result;
  } catch (error) {
    console.error('Erreur dans getUserDataAction:', error);
    return {
      success: false,
      message: 'Erreur lors de la récupération des données utilisateur',
    };
  }
};

export const deleteUserAction = async (): Promise<DeleteUserResponse> => {
  try {
    const user = await getAuthenticatedUser();
    if (!user) {
      return {
        success: false,
        message: 'Utilisateur non authentifié',
      };
    }

    const result = await AccountServices.deleteUser(user.id);
    return result;
  } catch (error) {
    console.error('Erreur dans deleteUserAction:', error);
    return {
      success: false,
      message: 'Erreur lors de la suppression du compte',
    };
  }
};

export const exportUserDataAction =
  async (): Promise<ExportUserDataResponse> => {
    try {
      const user = await getAuthenticatedUser();
      if (!user) {
        return {
          success: false,
          message: 'Utilisateur non authentifié',
        };
      }

      const result = await AccountServices.exportUserData(user.id);
      return result;
    } catch (error) {
      console.error('Erreur dans exportUserDataAction:', error);
      return {
        success: false,
        message: "Erreur lors de l'export des données",
      };
    }
  };

export const updateUserDataAction = async (
  data: UpdateUserDataRequest
): Promise<UpdateUserDataResponse> => {
  try {
    // Validation des données d'entrée
    const validationResult = rectificationSchema.safeParse(data);
    if (!validationResult.success) {
      return {
        success: false,
        message: `Erreur de validation: ${validationResult.error.errors[0].message}`,
      };
    }

    const user = await getAuthenticatedUser();
    if (!user) {
      return {
        success: false,
        message: 'Utilisateur non authentifié',
      };
    }

    const result = await AccountServices.updateUserData(user.id, data);
    return result;
  } catch (error) {
    console.error('Erreur dans updateUserDataAction:', error);
    return {
      success: false,
      message: 'Erreur lors de la mise à jour des données',
    };
  }
};

export const withdrawConsentAction =
  async (): Promise<WithdrawConsentResponse> => {
    try {
      const user = await getAuthenticatedUser();
      if (!user) {
        return {
          success: false,
          message: 'Utilisateur non authentifié',
        };
      }

      const result = await AccountServices.withdrawConsent(user.id);
      return result;
    } catch (error) {
      console.error('Erreur dans withdrawConsentAction:', error);
      return {
        success: false,
        message: 'Erreur lors du retrait du consentement',
      };
    }
  };

export async function getInactiveUsersAction() {
  try {
    const user = await getAuthenticatedUser();
    if (!user) {
      return {
        success: false,
        message: 'Non autorisé',
      };
    }

    const result = await AccountServices.getInactiveUsers();
    return result;
  } catch (error) {
    console.error('Erreur dans getInactiveUsersAction:', error);
    return {
      success: false,
      message: 'Erreur lors de la récupération des utilisateurs inactifs',
    };
  }
}

export async function sendInactiveAccountWarningsAction() {
  try {
    // Pour les routes de maintenance, on n'a pas besoin d'authentification
    // const user = await getAuthenticatedUser();
    // if (!user) {
    //   return {
    //     success: false,
    //     message: 'Non autorisé',
    //   };
    // }

    // Récupérer les utilisateurs qui seront supprimés dans 2 semaines
    // (donc inactifs depuis 11 mois et 2 semaines)
    const elevenMonthsTwoWeeksAgo = new Date();
    elevenMonthsTwoWeeksAgo.setMonth(elevenMonthsTwoWeeksAgo.getMonth() - 11);
    elevenMonthsTwoWeeksAgo.setDate(elevenMonthsTwoWeeksAgo.getDate() - 14);

    const usersToWarn = await prisma.user.findMany({
      where: {
        OR: [
          {
            lastLoginAt: {
              lt: elevenMonthsTwoWeeksAgo,
            },
          },
          {
            lastLoginAt: null,
            createdAt: {
              lt: elevenMonthsTwoWeeksAgo,
            },
          },
        ],
      },
      select: {
        id: true,
        email: true,
        userName: true,
        lastLoginAt: true,
      },
    });

    let sentCount = 0;
    let errorCount = 0;

    for (const user of usersToWarn) {
      try {
        const emailSent = await EmailService.sendInactiveAccountWarning(
          user.email,
          user.userName,
          user.lastLoginAt
        );

        if (emailSent) {
          sentCount++;
        } else {
          errorCount++;
        }
      } catch (error) {
        console.error(
          `Erreur lors de l'envoi de l'email d'avertissement à ${user.email}:`,
          error
        );
        errorCount++;
      }
    }

    return {
      success: true,
      message: `${sentCount} emails d'avertissement envoyés avec succès. ${errorCount} erreurs.`,
      data: {
        sentCount,
        errorCount,
        totalUsers: usersToWarn.length,
      },
    };
  } catch (error) {
    console.error('Erreur dans sendInactiveAccountWarningsAction:', error);
    return {
      success: false,
      message: "Erreur lors de l'envoi des emails d'avertissement",
    };
  }
}

export async function deleteInactiveUsersAction() {
  try {
    // const user = await getAuthenticatedUser();
    // if (!user) {
    //   return {
    //     success: false,
    //     message: 'Non autorisé',
    //   };
    // }

    // Récupérer les utilisateurs à supprimer AVANT de les supprimer
    const result = await AccountServices.getUsersToDelete();

    if (!result.success || !result.data || result.data.length === 0) {
      return {
        success: true,
        deletedCount: 0,
        message: 'Aucun utilisateur inactif à supprimer',
      };
    }

    // Envoyer des emails de notification de suppression
    let notificationSentCount = 0;
    for (const userData of result.data) {
      try {
        await EmailService.sendAccountDeletionNotification(
          userData.email,
          userData.userName
        );
        notificationSentCount++;
      } catch (error) {
        console.error(
          `Erreur lors de l'envoi de l'email de suppression à ${userData.email}:`,
          error
        );
      }
    }

    // Supprimer les utilisateurs
    const deletionResult = await AccountServices.deleteInactiveUsers();

    return {
      ...deletionResult,
      notificationSentCount,
    };
  } catch (error) {
    console.error('Erreur dans deleteInactiveUsersAction:', error);
    return {
      success: false,
      deletedCount: 0,
      message: 'Erreur lors de la suppression des utilisateurs inactifs',
    };
  }
}

export async function cleanupLoginAttemptsAction() {
  try {
    // const user = await getAuthenticatedUser();
    // if (!user) {
    //   return {
    //     success: false,
    //     message: 'Non autorisé',
    //   };
    // }

    console.log(
      '🧹 Début du nettoyage des anciennes tentatives de connexion...'
    );

    // Compter les tentatives avant nettoyage pour le rapport
    const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const attemptsToDelete = await prisma.loginAttempt.count({
      where: {
        createdAt: {
          lt: twentyFourHoursAgo,
        },
      },
    });

    if (attemptsToDelete === 0) {
      return {
        success: true,
        deletedCount: 0,
        message: 'Aucune ancienne tentative de connexion à supprimer',
      };
    }

    // Effectuer le nettoyage
    await LoginAttemptsService.cleanupOldAttempts();

    console.log(
      `✅ ${attemptsToDelete} anciennes tentatives de connexion supprimées`
    );

    return {
      success: true,
      deletedCount: attemptsToDelete,
      message: `${attemptsToDelete} anciennes tentatives de connexion supprimées avec succès`,
    };
  } catch (error) {
    console.error('Erreur dans cleanupLoginAttemptsAction:', error);
    return {
      success: false,
      deletedCount: 0,
      message: 'Erreur lors du nettoyage des anciennes tentatives de connexion',
    };
  }
}
