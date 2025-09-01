'use client';

import { X, Music, Zap } from 'lucide-react';

import { useRouter } from 'next/navigation';

interface PreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function PreviewModal({ isOpen, onClose }: PreviewModalProps) {
  const router = useRouter();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-slate-800/95 backdrop-blur-md rounded-2xl border border-white/10 shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* En-tête de la modale */}
        <div className="bg-gradient-to-r from-blue-500/20 via-indigo-500/20 to-orange-400/20 p-6 rounded-t-2xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500/30 to-orange-500/30 rounded-lg flex items-center justify-center">
                <Music size={20} className="text-orange-300" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">
                  Prévisualisation
                </h2>
                <p className="text-white/70 text-sm">
                  Écoutez un aperçu du morceau
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors duration-200"
            >
              <X size={18} className="text-white" />
            </button>
          </div>
        </div>

        {/* Contenu de la modale */}
        <div className="p-6">
          {/* Zone de prévisualisation */}
          <div className="bg-gradient-to-br from-slate-700/50 to-slate-800/50 rounded-xl p-8 text-center border border-white/10 mb-6">
            <div className="w-24 h-24 bg-gradient-to-br from-blue-500/20 to-orange-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Music size={40} className="text-orange-300" />
            </div>
            <h4 className="text-lg font-semibold text-white mb-2">
              Fonctionnalité en développement
            </h4>
            <p className="text-white/70 text-sm mb-4 max-w-md mx-auto">
              La prévisualisation audio sera bientôt disponible ! Vous pourrez
              écouter un aperçu de ce morceau directement depuis la
              bibliothèque.
            </p>
            <div className="flex items-center justify-center space-x-2 text-orange-300">
              <Zap size={16} />
              <span className="text-sm font-medium">Arrive bientôt</span>
            </div>
          </div>

          {/* Boutons d'action */}
          <div className="flex items-center justify-end space-x-3 pt-4 border-t border-white/10">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 bg-gradient-to-r from-blue-500 to-orange-500 hover:from-blue-600 hover:to-orange-600 text-white font-medium rounded-lg transition-all duration-200 transform hover:scale-105"
            >
              Continuer à explorer
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
