'use client';

import {
  IconX,
  IconHelp,
  IconQuestionMark,
  IconBook,
  IconVideo,
} from '@tabler/icons-react';

interface HelpModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function HelpModal({ isOpen, onClose }: HelpModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-gray-900 border border-orange-500/30 rounded-2xl p-6 max-w-2xl w-full mx-4 shadow-xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="bg-orange-500/20 p-3 rounded-lg text-orange-400">
              <IconHelp size={24} />
            </div>
            <h3 className="text-lg font-semibold text-white">
              Centre d'aide Virtuo Piano
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-white/50 hover:text-white/80 transition-colors cursor-pointer"
          >
            <IconX size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="space-y-6">
          {/* Introduction */}
          <div>
            <h3 className="text-xl font-semibold text-white mb-3">
              🆘 Besoin d'aide ?
            </h3>
            <p className="text-white/80 leading-relaxed">
              Nous travaillons actuellement sur un centre d'aide complet pour
              vous accompagner dans votre apprentissage du piano en réalité
              virtuelle. Voici ce qui arrive prochainement :
            </p>
          </div>

          {/* FAQ */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-blue-500/20 p-2 rounded-lg">
                <IconQuestionMark size={20} className="text-blue-400" />
              </div>
              <h3 className="text-lg font-semibold text-white">
                FAQ - Questions fréquentes
              </h3>
            </div>
            <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
              <div className="flex items-center gap-3 mb-3">
                <div className="bg-yellow-500/20 p-2 rounded-lg">
                  <IconHelp size={16} className="text-yellow-400" />
                </div>
                <span className="text-yellow-400 font-medium text-sm">
                  En chantier
                </span>
              </div>
              <p className="text-white/80 text-sm">
                Trouvez rapidement des réponses aux questions les plus courantes
                sur l'utilisation de Virtuo Piano, la configuration VR, et les
                fonctionnalités de l'application.
              </p>
              <p className="text-white/60 text-xs mt-2 italic">
                Arrive prochainement
              </p>
            </div>
          </div>

          {/* Guide de démarrage */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-green-500/20 p-2 rounded-lg">
                <IconBook size={20} className="text-green-400" />
              </div>
              <h3 className="text-lg font-semibold text-white">
                Guide de démarrage
              </h3>
            </div>
            <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4">
              <div className="flex items-center gap-3 mb-3">
                <div className="bg-yellow-500/20 p-2 rounded-lg">
                  <IconHelp size={16} className="text-yellow-400" />
                </div>
                <span className="text-yellow-400 font-medium text-sm">
                  En chantier
                </span>
              </div>
              <p className="text-white/80 text-sm">
                Un guide étape par étape pour configurer votre casque VR,
                prendre en main l'interface Virtuo Piano et commencer votre
                premier cours de piano immersif.
              </p>
              <p className="text-white/60 text-xs mt-2 italic">
                Arrive prochainement
              </p>
            </div>
          </div>

          {/* Tutoriels */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-purple-500/20 p-2 rounded-lg">
                <IconVideo size={20} className="text-purple-400" />
              </div>
              <h3 className="text-lg font-semibold text-white">
                Tutoriels vidéo
              </h3>
            </div>
            <div className="bg-purple-500/10 border border-purple-500/30 rounded-lg p-4">
              <div className="flex items-center gap-3 mb-3">
                <div className="bg-yellow-500/20 p-2 rounded-lg">
                  <IconHelp size={16} className="text-yellow-400" />
                </div>
                <span className="text-yellow-400 font-medium text-sm">
                  En chantier
                </span>
              </div>
              <p className="text-white/80 text-sm">
                Des tutoriels vidéo détaillés pour maîtriser toutes les
                fonctionnalités de Virtuo Piano, des techniques de base aux
                fonctionnalités avancées.
              </p>
              <p className="text-white/60 text-xs mt-2 italic">
                Arrive prochainement
              </p>
            </div>
          </div>

          {/* Contact d'urgence */}
          <div className="bg-orange-500/10 border border-orange-500/30 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-white mb-2">
              💬 Besoin d'aide immédiate ?
            </h3>
            <p className="text-white/80 text-sm mb-3">
              En attendant que notre centre d'aide soit complet, n'hésitez pas à
              nous contacter directement pour toute question ou problème
              technique.
            </p>
            <button
              onClick={onClose}
              className="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-lg font-medium transition-colors cursor-pointer text-sm"
            >
              Contacter le support
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-6 pt-6 border-t border-gray-700">
          <p className="text-center text-white/60 text-sm">
            Centre d'aide en développement - Merci de votre patience
          </p>
        </div>
      </div>
    </div>
  );
}
