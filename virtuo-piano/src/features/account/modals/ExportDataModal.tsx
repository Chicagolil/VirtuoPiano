import {
  IconDownload,
  IconX,
  IconCheck,
  IconFile,
  IconEye,
} from '@tabler/icons-react';
import { useExportUserData } from '@/customHooks/useRgpdRights';
import { useState } from 'react';
import DataPreviewModal from './DataPreviewModal';
import toast from 'react-hot-toast';

interface ExportDataModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ExportDataModal({
  isOpen,
  onClose,
}: ExportDataModalProps) {
  const exportUserDataMutation = useExportUserData();
  const [showPreview, setShowPreview] = useState(false);
  const [exportedData, setExportedData] = useState<any>(null);

  if (!isOpen) return null;

  const handleGeneratePreview = async () => {
    try {
      const result = await exportUserDataMutation.mutateAsync();
      if (result.success && result.data) {
        setExportedData(result.data);
        setShowPreview(true);
        toast.success('Données générées avec succès !');
      } else {
        toast.error(`Erreur : ${result.message}`);
      }
    } catch (error) {
      console.error(
        'Erreur lors de la génération de la prévisualisation:',
        error
      );
      toast.error('Une erreur est survenue lors de la génération des données');
    }
  };

  const handleDownload = () => {
    if (exportedData) {
      const jsonString = JSON.stringify(exportedData, null, 2);
      const blob = new Blob([jsonString], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `mes-donnees-${
        new Date().toISOString().split('T')[0]
      }.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      toast.success('Fichier téléchargé avec succès !');
      onClose();
    }
  };

  const handleClose = () => {
    setShowPreview(false);
    setExportedData(null);
    onClose();
  };

  const handleBack = () => {
    setShowPreview(false);
  };

  return (
    <>
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
              onClick={handleClose}
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
                💡 <strong>Nouveau :</strong> Vous pouvez maintenant
                prévisualiser vos données avant de les télécharger pour voir
                exactement ce qui sera exporté.
              </p>
            </div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={handleClose}
              disabled={exportUserDataMutation.isPending}
              className="flex-1 bg-white/10 hover:bg-white/20 disabled:bg-white/5 disabled:cursor-not-allowed text-white px-4 py-3 rounded-lg font-medium transition-colors cursor-pointer"
            >
              Annuler
            </button>
            <button
              onClick={handleGeneratePreview}
              disabled={exportUserDataMutation.isPending}
              className="flex-1 bg-green-600 hover:bg-green-700 disabled:bg-green-800 disabled:cursor-not-allowed text-white px-4 py-3 rounded-lg font-medium transition-colors flex items-center justify-center gap-2 cursor-pointer"
            >
              <IconEye size={18} />
              {exportUserDataMutation.isPending
                ? 'Génération...'
                : 'Prévisualiser et télécharger'}
            </button>
          </div>
        </div>
      </div>

      <DataPreviewModal
        isOpen={showPreview}
        onClose={handleClose}
        onBack={handleBack}
        onDownload={handleDownload}
        data={exportedData}
      />
    </>
  );
}
