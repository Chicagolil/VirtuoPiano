import {
  IconDatabase,
  IconDownload,
  IconEdit,
  IconTrash,
} from '@tabler/icons-react';

export default function DataTab() {
  return (
    <div className="space-y-6">
      <div className="bg-white/3 shadow-md rounded-2xl p-6 border border-slate-200/10 dark:border-slate-700/10">
        <div className="flex items-center gap-3 mb-6">
          <div className="bg-blue-500/20 p-3 rounded-lg text-blue-400">
            <IconDatabase size={24} />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white">Droits RGPD</h3>
            <p className="text-sm text-white/70">
              Conformément au Règlement Général sur la Protection des Données
              (RGPD)
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10 flex justify-between items-center">
            <div className="flex-1 mr-4">
              <div className="flex items-center gap-2 mb-2">
                <IconDownload size={18} className="text-green-400" />
                <strong className="text-white text-base">Droit d'accès</strong>
              </div>
              <p className="text-sm text-white/70">
                Obtenez une copie de toutes vos données personnelles que nous
                conservons.
              </p>
            </div>
            <button className="bg-green-500/20 hover:bg-green-500/30 text-green-300 px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 whitespace-nowrap">
              <IconDownload size={16} />
              Exporter
            </button>
          </div>

          <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10 flex justify-between items-center">
            <div className="flex-1 mr-4">
              <div className="flex items-center gap-2 mb-2">
                <IconEdit size={18} className="text-blue-400" />
                <strong className="text-white text-base">
                  Droit de rectification
                </strong>
              </div>
              <p className="text-sm text-white/70">
                Modifiez ou corrigez vos informations personnelles.
              </p>
            </div>
            <button className="bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 whitespace-nowrap">
              <IconEdit size={16} />
              Modifier
            </button>
          </div>

          <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10 flex justify-between items-center">
            <div className="flex-1 mr-4">
              <div className="flex items-center gap-2 mb-2">
                <IconTrash size={18} className="text-red-400" />
                <strong className="text-white text-base">
                  Droit à l'effacement
                </strong>
              </div>
              <p className="text-sm text-white/70">
                Supprimez définitivement votre compte et toutes vos données.
              </p>
            </div>
            <button className="bg-red-500/20 hover:bg-red-500/30 text-red-300 px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 whitespace-nowrap">
              <IconTrash size={16} />
              Supprimer
            </button>
          </div>
        </div>
      </div>

      {/* Avertissement */}
      <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4">
        <div className="flex items-start gap-3">
          <div className="text-red-400 mt-0.5">⚠️</div>
          <div>
            <h4 className="text-red-400 font-semibold mb-1">
              Information importante
            </h4>
            <p className="text-sm text-white/80">
              La suppression de votre compte est définitive et irréversible.
              Toutes vos données (scores, favoris, compositions) seront
              supprimées.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
