'use server';

import {
  DeleteUserResponse,
  ExportUserDataResponse,
  AccountServices,
} from '@/lib/services/account-services';
import { getAuthenticatedUser } from '@/lib/auth/get-authenticated-user';

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
