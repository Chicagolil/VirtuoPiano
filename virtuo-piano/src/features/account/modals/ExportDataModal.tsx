import { IconDownload, IconX, IconCheck, IconFile } from '@tabler/icons-react';

interface ExportDataModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ExportDataModal({
  isOpen,
  onClose,
}: ExportDataModalProps) {
  if (!isOpen) return null;

  const handleExport = () => {
    // Ici sera ajoutée la logique d'export
    console.log('Export des données lancé');
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-gray-900 border border-green-500/30 rounded-2xl p-6 max-w-lg w-full mx-4 shadow-xl">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="bg-green-500/20 p-3 rounded-lg text-green-400">
              <IconDownload size={24} />
            </div>
            <h3 className="text-lg font-semibold text-white">
              Exporter vos données
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
            Téléchargez une copie complète de toutes vos données personnelles
            conformément au RGPD.
          </p>

          <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4 mb-4">
            <h4 className="text-green-300 font-semibold mb-2 flex items-center gap-2">
              <IconFile size={18} />
              Données incluses dans l'export
            </h4>
            <ul className="text-green-300/80 text-sm space-y-1">
              <li className="flex items-center gap-2">
                <IconCheck size={14} />
                Informations de profil (nom, email, niveau)
              </li>
              <li className="flex items-center gap-2">
                <IconCheck size={14} />
                Scores et performances de jeu
              </li>
              <li className="flex items-center gap-2">
                <IconCheck size={14} />
                Chansons favorites et importées
              </li>
              <li className="flex items-center gap-2">
                <IconCheck size={14} />
                Compositions créées
              </li>
              <li className="flex items-center gap-2">
                <IconCheck size={14} />
                Progression et défis complétés
              </li>
              <li className="flex items-center gap-2">
                <IconCheck size={14} />
                Préférences et paramètres
              </li>
            </ul>
          </div>

          <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-3">
            <p className="text-blue-300 text-sm">
              💡 <strong>Format :</strong> Les données seront exportées au
              format JSON lisible. Le téléchargement commencera automatiquement
              une fois la génération terminée.
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
            onClick={handleExport}
            className="flex-1 bg-green-600 hover:bg-green-700 text-white px-4 py-3 rounded-lg font-medium transition-colors flex items-center justify-center gap-2 cursor-pointer"
          >
            <IconDownload size={18} />
            Télécharger
          </button>
        </div>
      </div>
    </div>
  );
}
