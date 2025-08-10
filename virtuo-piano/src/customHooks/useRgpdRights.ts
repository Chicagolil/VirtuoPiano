import { useMutation } from '@tanstack/react-query';
import {
  deleteUserAction,
  exportUserDataAction,
} from '@/lib/actions/RGPD-actions';
import {
  DeleteUserResponse,
  ExportUserDataResponse,
} from '@/lib/services/account-services';
import { signOut } from 'next-auth/react';

export const useDeleteUser = () => {
  return useMutation({
    mutationFn: deleteUserAction,
    onSuccess: (data: DeleteUserResponse) => {
      if (data.success) {
        signOut({ callbackUrl: '/auth/login' });
      }
    },
    onError: (error) => {
      console.error('Erreur lors de la suppression du compte:', error);
    },
  });
};

export const useExportUserData = () => {
  return useMutation({
    mutationFn: exportUserDataAction,
    onError: (error) => {
      console.error("Erreur lors de l'export des données:", error);
    },
  });
};

export const useRgpdRights = () => {
  const deleteUserMutation = useDeleteUser();
  const exportUserDataMutation = useExportUserData();

  return {
    deleteUser: deleteUserMutation,
    exportUserData: exportUserDataMutation,
    isDeleting: deleteUserMutation.isPending,
    isExporting: exportUserDataMutation.isPending,
    deleteError: deleteUserMutation.error,
    exportError: exportUserDataMutation.error,
  };
};
