import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createImportedSongAction } from '@/lib/actions/imports-actions';

export const useCreateImport = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createImportedSongAction,
    onSuccess: () => {
      // Invalider toutes les listes d'import pour forcer le rafraîchissement
      queryClient.invalidateQueries({ queryKey: ['importedSongs'] });
      queryClient.invalidateQueries({ queryKey: ['importedSongsGenres'] });
    },
  });
};
