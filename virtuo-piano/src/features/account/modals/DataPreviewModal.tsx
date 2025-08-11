import {
  IconDownload,
  IconX,
  IconCheck,
  IconFile,
  IconArrowLeft,
} from '@tabler/icons-react';

interface DataPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  onBack: () => void;
  onDownload: () => void;
  data: any;
}

export default function DataPreviewModal({
  isOpen,
  onClose,
  onBack,
  onDownload,
  data,
}: DataPreviewModalProps) {
  if (!isOpen || !data) return null;

  const formatDataPreview = (data: any) => {
    return {
      profil: {
        nom: data.user.userName,
        email: data.user.email,
        niveau: data.user.level,
        xp: data.user.xp,
        dateCreation: new Date(data.user.createdAt).toLocaleDateString('fr-FR'),
      },
      statistiques: {
        scores: data.scores.length,
        compositions: data.compositions.length,
        favoris: data.favorites.length,
        imports: data.imports.length,
        defis: data.challengeProgress.length,
      },
      dernieresActivites: data.scores.slice(0, 3).map((score: any) => ({
        chanson: score.song.title,
        score: score.totalPoints || 0,
        date: new Date(score.sessionEndTime).toLocaleDateString('fr-FR'),
      })),
    };
  };

  const preview = formatDataPreview(data);

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-gray-900 border border-green-500/30 rounded-2xl p-6 max-w-4xl w-full mx-4 shadow-xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="bg-green-500/20 p-3 rounded-lg text-green-400">
              <IconFile size={24} />
            </div>
            <h3 className="text-lg font-semibold text-white">
              Prévisualisation de vos données
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-white/50 hover:text-white/80 transition-colors cursor-pointer"
          >
            <IconX size={20} />
          </button>
        </div>

        <div className="space-y-6">
          {/* Profil */}
          <div className="bg-white/5 rounded-lg p-4 border border-white/10">
            <h4 className="text-green-300 font-semibold mb-3 flex items-center gap-2">
              <IconFile size={18} />
              Informations de profil
            </h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div>
                <span className="text-white/60">Nom :</span>
                <p className="text-white font-medium">{preview.profil.nom}</p>
              </div>
              <div>
                <span className="text-white/60">Email :</span>
                <p className="text-white font-medium">{preview.profil.email}</p>
              </div>
              <div>
                <span className="text-white/60">Niveau :</span>
                <p className="text-white font-medium">
                  {preview.profil.niveau}
                </p>
              </div>
              <div>
                <span className="text-white/60">XP :</span>
                <p className="text-white font-medium">{preview.profil.xp}</p>
              </div>
            </div>
          </div>

          {/* Statistiques */}
          <div className="bg-white/5 rounded-lg p-4 border border-white/10">
            <h4 className="text-green-300 font-semibold mb-3 flex items-center gap-2">
              <IconCheck size={18} />
              Statistiques de votre activité
            </h4>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-sm">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-400">
                  {preview.statistiques.scores}
                </div>
                <div className="text-white/60">Scores</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-400">
                  {preview.statistiques.compositions}
                </div>
                <div className="text-white/60">Compositions</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-yellow-400">
                  {preview.statistiques.favoris}
                </div>
                <div className="text-white/60">Favoris</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-400">
                  {preview.statistiques.imports}
                </div>
                <div className="text-white/60">Imports</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-400">
                  {preview.statistiques.defis}
                </div>
                <div className="text-white/60">Défis</div>
              </div>
            </div>
          </div>

          <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-3">
            <p className="text-blue-300 text-sm">
              💡 <strong>Prévisualisation :</strong> Ceci est un aperçu de vos
              données. Le fichier complet contiendra toutes vos données
              détaillées au format JSON.
            </p>
          </div>
        </div>

        <div className="flex gap-3 mt-6">
          <button
            onClick={onBack}
            className="flex-1 bg-white/10 hover:bg-white/20 text-white px-4 py-3 rounded-lg font-medium transition-colors flex items-center justify-center gap-2 cursor-pointer"
          >
            <IconArrowLeft size={18} />
            Retour
          </button>
          <button
            onClick={onDownload}
            className="flex-1 bg-green-600 hover:bg-green-700 text-white px-4 py-3 rounded-lg font-medium transition-colors flex items-center justify-center gap-2 cursor-pointer"
          >
            <IconDownload size={18} />
            Télécharger le fichier complet
          </button>
        </div>
      </div>
    </div>
  );
}
