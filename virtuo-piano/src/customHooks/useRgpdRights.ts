import { useMutation, useQuery } from '@tanstack/react-query';
import {
  deleteUserAction,
  exportUserDataAction,
  updateUserDataAction,
  getUserDataAction,
} from '@/lib/actions/RGPD-actions';
import { DeleteUserResponse } from '@/lib/services/account-services';
import { signOut } from 'next-auth/react';

export const useGetUserData = () => {
  return useQuery({
    queryKey: ['userData'],
    queryFn: getUserDataAction,
    staleTime: 1000 * 60 * 2,
  });
};

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

export const useUpdateUserData = () => {
  return useMutation({
    mutationFn: updateUserDataAction,
    onError: (error) => {
      console.error('Erreur lors de la mise à jour des données:', error);
    },
  });
};

export const useRgpdRights = () => {
  const deleteUserMutation = useDeleteUser();
  const exportUserDataMutation = useExportUserData();
  const updateUserDataMutation = useUpdateUserData();

  return {
    deleteUser: deleteUserMutation,
    exportUserData: exportUserDataMutation,
    updateUserData: updateUserDataMutation,
    isDeleting: deleteUserMutation.isPending,
    isExporting: exportUserDataMutation.isPending,
    isUpdating: updateUserDataMutation.isPending,
    deleteError: deleteUserMutation.error,
    exportError: exportUserDataMutation.error,
    updateError: updateUserDataMutation.error,
  };
};
