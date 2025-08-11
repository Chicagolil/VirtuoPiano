import { IconTrash, IconX } from '@tabler/icons-react';
import { useDeleteUser } from '@/customHooks/useRgpdRights';

interface DeleteAccountModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function DeleteAccountModal({
  isOpen,
  onClose,
}: DeleteAccountModalProps) {
  const deleteUserMutation = useDeleteUser();

  if (!isOpen) return null;

  const handleDelete = () => {
    deleteUserMutation.mutate();
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-gray-900 border border-red-500/30 rounded-2xl p-6 max-w-md w-full mx-4 shadow-xl">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="bg-red-500/20 p-3 rounded-lg text-red-400">
              <IconTrash size={24} />
            </div>
            <h3 className="text-lg font-semibold text-white">
              Supprimer le compte
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-white/50 hover:text-white/80 transition-colors cursor-pointer"
          >
            <IconX size={20} />
          </button>
        </div>

        <div className="mb-6">
          <p className="text-white/80 mb-4">
            Êtes-vous sûr de vouloir supprimer votre compte ?
          </p>
          <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3">
            <p className="text-red-300 text-sm">
              ⚠️ Cette action est <strong>définitive et irréversible</strong>.
              Toutes vos données seront supprimées :
            </p>
            <ul className="text-red-300/80 text-sm mt-2 ml-4 list-disc">
              <li>Scores et performances</li>
              <li>Favoris et Imports</li>
              <li>Progression et défis</li>
              <li>Préférences et paramètres</li>
            </ul>
          </div>
        </div>

        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 bg-white/10 hover:bg-white/20 text-white px-4 py-3 rounded-lg font-medium transition-colors cursor-pointer"
          >
            Annuler
          </button>
          <button
            onClick={handleDelete}
            disabled={deleteUserMutation.isPending}
            className="flex-1 bg-red-600 hover:bg-red-700 disabled:bg-red-800 disabled:cursor-not-allowed text-white px-4 py-3 rounded-lg font-medium transition-colors cursor-pointer"
          >
            {deleteUserMutation.isPending ? 'Suppression...' : 'Supprimer'}
          </button>
        </div>
      </div>
    </div>
  );
}
