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
import { rectificationSchema } from '@/lib/validations/auth-schemas';

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
