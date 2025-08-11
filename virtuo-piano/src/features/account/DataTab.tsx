import {
  IconDatabase,
  IconDownload,
  IconEdit,
  IconTrash,
  IconBan,
} from '@tabler/icons-react';
import { useState } from 'react';
import {
  ExportDataModal,
  EditDataModal,
  OppositionModal,
  DeleteAccountModal,
} from './modals';

export default function DataTab() {
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showOppositionModal, setShowOppositionModal] = useState(false);

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
          {/* Droit d'accès */}
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
            <button
              onClick={() => setShowExportModal(true)}
              className="bg-green-500/20 hover:bg-green-500/30 text-green-300 px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 whitespace-nowrap cursor-pointer"
            >
              <IconDownload size={16} />
              Exporter
            </button>
          </div>

          {/* Droit de rectification */}
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
            <button
              onClick={() => setShowEditModal(true)}
              className="bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 whitespace-nowrap cursor-pointer"
            >
              <IconEdit size={16} />
              Modifier
            </button>
          </div>

          {/* Droit d'opposition */}
          <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10 flex justify-between items-center">
            <div className="flex-1 mr-4">
              <div className="flex items-center gap-2 mb-2">
                <IconBan size={18} className="text-orange-400" />
                <strong className="text-white text-base">
                  Droit d'opposition
                </strong>
              </div>
              <p className="text-sm text-white/70">
                Retirez votre consentement au traitement de vos données
                personnelles.
              </p>
            </div>
            <button
              onClick={() => setShowOppositionModal(true)}
              className="bg-orange-500/20 hover:bg-orange-500/30 text-orange-300 px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 whitespace-nowrap cursor-pointer"
            >
              <IconBan size={16} />
              Retirer consentement
            </button>
          </div>

          {/* Droit à l'effacement */}
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
            <button
              onClick={() => setShowDeleteModal(true)}
              className="bg-red-500/20 hover:bg-red-500/30 text-red-300 px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 whitespace-nowrap cursor-pointer"
            >
              <IconTrash size={16} />
              Supprimer
            </button>
          </div>
        </div>
      </div>

      <ExportDataModal
        isOpen={showExportModal}
        onClose={() => setShowExportModal(false)}
      />

      <EditDataModal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
      />

      <OppositionModal
        isOpen={showOppositionModal}
        onClose={() => setShowOppositionModal(false)}
      />

      <DeleteAccountModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
      />
    </div>
  );
}
