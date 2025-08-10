import { useMutation } from '@tanstack/react-query';
import { deleteUserAction } from '@/lib/actions/RGPD-actions';
import { DeleteUserResponse } from '@/lib/services/account-services';
import { signOut } from 'next-auth/react';

export const useDeleteUser = () => {
  return useMutation({
    mutationFn: deleteUserAction,
    onSuccess: (data: DeleteUserResponse) => {
      if (data.success) {
        // Déconnecter l'utilisateur après suppression réussie
        signOut({ callbackUrl: '/auth/login' });
      }
    },
    onError: (error) => {
      console.error('Erreur lors de la suppression du compte:', error);
    },
  });
};

// Hook pour gérer les autres droits RGPD (à étendre plus tard)
export const useRgpdRights = () => {
  const deleteUserMutation = useDeleteUser();

  return {
    deleteUser: deleteUserMutation,
    isDeleting: deleteUserMutation.isPending,
    deleteError: deleteUserMutation.error,
  };
};
