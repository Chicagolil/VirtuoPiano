'use client';

import { useState } from 'react';
import { FolderUp, Upload, Music, FileText } from 'lucide-react';
import ImportModal from '@/features/imports/ImportModal';
import ImportedSongs from './ImportedSongs';

export default function SongImports() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="max-w-[98.5%] mx-auto bg-transparent shadow-md rounded-2xl p-6 border border-slate-200/20 dark:border-slate-700/20">
      {/* En-tête avec dégradé bleu/orange */}
      <div className="bg-gradient-to-r from-blue-500/20 via-indigo-500/20 to-orange-400/20 rounded-t-xl p-8 mb-6 -mx-6 -mt-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl font-bold text-white flex items-center">
              <FolderUp size={28} className="mr-2 text-orange-300" />
              Gérez vos compositions et morceaux personnalisés
            </h1>
          </div>
        </div>
      </div>

      {/* Contenu principal */}
      <div className="space-y-6">
        {/* Carte d'imports */}
        <div className="flex justify-center">
          <div
            className="bg-white/5 backdrop-blur-sm rounded-xl p-8 border border-white/10 hover:border-white/20 transition-all duration-300 cursor-pointer group w-80 h-120
             flex flex-col items-center justify-center text-center"
            onClick={() => setIsModalOpen(true)}
          >
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500/20 to-orange-500/20 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 mb-6">
              <Upload size={32} className="text-orange-300" />
            </div>
            <h3 className="text-xl font-semibold text-white group-hover:text-orange-300 transition-colors duration-300 mb-3">
              Importer une nouvelle chanson
            </h3>
            <p className="text-white/60 text-sm mb-6 leading-relaxed">
              Ajoutez vos compositions ou morceaux personnalisés à votre
              bibliothèque
            </p>
            <div className="flex items-center space-x-2 text-white/40 group-hover:text-white/60 transition-colors duration-300">
              <span className="text-sm font-medium">Cliquer pour importer</span>
              <Upload
                size={16}
                className="group-hover:translate-x-1 transition-transform duration-300"
              />
            </div>
          </div>
        </div>

        {/* Section des chansons importées (à venir) */}
        <div className="bg-transparent backdrop-blur-sm rounded-xl p-6 border border-white/10">
          <div className="flex items-center space-x-3 mb-4">
            <Music size={20} className="text-blue-300" />
            <h3 className="text-lg font-semibold text-white">
              Mes chansons importées
            </h3>
          </div>
          <div className="text-center py-8">
            <ImportedSongs />
          </div>
        </div>
      </div>

      {/* Modale d'import */}
      <ImportModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
}
