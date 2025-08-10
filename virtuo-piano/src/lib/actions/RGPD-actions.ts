'use server';

import {
  DeleteUserResponse,
  AccountServices,
} from '@/lib/services/account-services';
import { getAuthenticatedUser } from '@/lib/auth/get-authenticated-user';

export const deleteUserAction = async (): Promise<DeleteUserResponse> => {
  try {
    // Vérifier que l'utilisateur est authentifié
    const user = await getAuthenticatedUser();

    if (!user) {
      return {
        success: false,
        message: 'Utilisateur non authentifié',
      };
    }

    // Appeler le service de suppression
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
