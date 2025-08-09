import { IconEdit, IconX, IconCheck } from '@tabler/icons-react';

interface EditDataModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function EditDataModal({ isOpen, onClose }: EditDataModalProps) {
  if (!isOpen) return null;

  const handleSave = () => {
    // Ici sera ajoutée la logique de modification
    console.log('Données modifiées');
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-gray-900 border border-blue-500/30 rounded-2xl p-6 max-w-lg w-full mx-4 shadow-xl">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="bg-blue-500/20 p-3 rounded-lg text-blue-400">
              <IconEdit size={24} />
            </div>
            <h3 className="text-lg font-semibold text-white">
              Modifier vos données
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
            Exercez votre droit de rectification en corrigeant ou mettant à jour
            vos informations personnelles.
          </p>

          <div className="space-y-4">
            <div>
              <label className="block text-white/70 text-sm font-medium mb-2">
                Nom d'utilisateur
              </label>
              <input
                type="text"
                defaultValue="John Doe"
                className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-400 transition-colors"
                placeholder="Votre nom d'utilisateur"
              />
            </div>

            <div>
              <label className="block text-white/70 text-sm font-medium mb-2">
                Adresse email
              </label>
              <input
                type="email"
                defaultValue="john.doe@example.com"
                className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-400 transition-colors"
                placeholder="votre.email@exemple.com"
              />
            </div>

            <div>
              <label className="block text-white/70 text-sm font-medium mb-2">
                Changer le mot de passe
              </label>
              <div className="space-y-3">
                <input
                  type="password"
                  placeholder="Mot de passe actuel"
                  className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-400 transition-colors"
                />
                <input
                  type="password"
                  placeholder="Nouveau mot de passe"
                  className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-400 transition-colors"
                />
                <input
                  type="password"
                  placeholder="Confirmer le nouveau mot de passe"
                  className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-400 transition-colors"
                />
              </div>
            </div>
          </div>

          <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-3 mt-4">
            <p className="text-blue-300 text-sm">
              💡 <strong>Important :</strong> Ces modifications seront
              appliquées immédiatement. Vous pouvez toujours les modifier
              ultérieurement.
            </p>
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
            onClick={handleSave}
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 rounded-lg font-medium transition-colors flex items-center justify-center gap-2 cursor-pointer"
          >
            <IconCheck size={18} />
            Enregistrer
          </button>
        </div>
      </div>
    </div>
  );
}
