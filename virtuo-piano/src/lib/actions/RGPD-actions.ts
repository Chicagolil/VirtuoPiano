'use server';

import {
  DeleteUserResponse,
  ExportUserDataResponse,
  UpdateUserDataRequest,
  UpdateUserDataResponse,
  GetUserDataResponse,
  AccountServices,
} from '@/lib/services/account-services';
import { getAuthenticatedUser } from '@/lib/auth/get-authenticated-user';
import { z } from 'zod';

// Schémas de validation
const updateUserDataSchema = z.object({
  userName: z
    .string()
    .min(2, "Le nom d'utilisateur doit contenir au moins 2 caractères")
    .max(50, "Le nom d'utilisateur ne peut pas dépasser 50 caractères")
    .optional(),
  email: z
    .string()
    .email('Adresse email invalide')
    .max(100, "L'email ne peut pas dépasser 100 caractères")
    .optional(),
  currentPassword: z
    .string()
    .min(1, 'Le mot de passe actuel est requis')
    .optional(),
  newPassword: z
    .string()
    .min(8, 'Le nouveau mot de passe doit contenir au moins 8 caractères')
    .max(100, 'Le mot de passe ne peut pas dépasser 100 caractères')
    .optional(),
  resetLevel: z.boolean().optional(),
});

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
    const validationResult = updateUserDataSchema.safeParse(data);
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
