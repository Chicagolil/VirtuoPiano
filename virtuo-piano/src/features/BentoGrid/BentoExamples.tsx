'use client';

import React from 'react';
import Image from 'next/image';
import {
  IconMusic,
  IconMicrophone,
  IconStar,
  IconUser,
  IconSettings,
  IconPlayerPlay,
  IconChartBar,
  IconLogout,
} from '@tabler/icons-react';

// Exemple 1: Grille auto-responsive avec grid-template-areas
export function BentoGridAreas() {
  return (
    <div className="w-full p-4">
      <div
        className="grid grid-cols-1 md:grid-cols-4 gap-4 h-full"
        style={{
          gridTemplateAreas: `
          "main main main sidebar"
          "main main main sidebar"
          "box1 box2 box3 sidebar"
          "box4 box5 box6 box7"
        `,
        }}
      >
        <div
          className="bg-orange-400/80 rounded-xl p-6 col-span-3 row-span-2 flex items-center justify-center"
          style={{ gridArea: 'main' }}
        >
          <div className="flex flex-col items-center">
            <IconMusic size={48} className="text-white mb-4" />
            <h2 className="text-2xl font-bold text-white">
              Bibliothèque de Musique
            </h2>
            <p className="text-white/80 mt-2">Explorez votre collection</p>
            <h2 className="text-2xl font-bold text-white">
              Bibliothèque de Musique
            </h2>
            <p className="text-white/80 mt-2">Explorez votre collection</p>
            <h2 className="text-2xl font-bold text-white">
              Bibliothèque de Musique
            </h2>
            <p className="text-white/80 mt-2">Explorez votre collection</p>
            <h2 className="text-2xl font-bold text-white">
              Bibliothèque de Musique
            </h2>
            <p className="text-white/80 mt-2">Explorez votre collection</p>
          </div>
        </div>

        <div
          className="bg-blue-500/80 rounded-xl p-4 row-span-3 flex flex-col items-center justify-center"
          style={{ gridArea: 'sidebar' }}
        >
          <IconStar size={36} className="text-white mb-2" />
          <h3 className="text-xl font-bold text-white">Favoris</h3>
          <p className="text-white/80 text-sm mt-2">Vos morceaux préférés</p>
          <h3 className="text-xl font-bold text-white">Favoris</h3>
          <p className="text-white/80 text-sm mt-2">Vos morceaux préférés</p>
          <h3 className="text-xl font-bold text-white">Favoris</h3>
          <p className="text-white/80 text-sm mt-2">Vos morceaux préférés</p>
        </div>

        <div
          className="bg-green-500/80 rounded-xl p-4 flex items-center justify-center"
          style={{ gridArea: 'box1' }}
        >
          <div className="text-center">
            <IconMicrophone size={28} className="text-white mx-auto mb-2" />
            <h3 className="text-lg font-bold text-white">Exercices</h3>
            <h3 className="text-lg font-bold text-white">Exercices</h3>
            <h3 className="text-lg font-bold text-white">Exercices</h3>
            <h3 className="text-lg font-bold text-white">Exercices</h3>
            <h3 className="text-lg font-bold text-white">Exercices</h3>
            <h3 className="text-lg font-bold text-white">Exercices</h3>
            <h3 className="text-lg font-bold text-white">Exercices</h3>
            <h3 className="text-lg font-bold text-white">Exercices</h3>
            <h3 className="text-lg font-bold text-white">Exercices</h3>
            <h3 className="text-lg font-bold text-white">Exercices</h3>
            <h3 className="text-lg font-bold text-white">Exercices</h3>
            <h3 className="text-lg font-bold text-white">Exercices</h3>
          </div>
        </div>

        <div
          className="bg-purple-500/80 rounded-xl p-4 flex items-center justify-center"
          style={{ gridArea: 'box2' }}
        >
          <div className="text-center">
            <IconUser size={28} className="text-white mx-auto mb-2" />
            <h3 className="text-lg font-bold text-white">Profil</h3>
            <h3 className="text-lg font-bold text-white">Profil</h3>
            <h3 className="text-lg font-bold text-white">Profil</h3>
            <h3 className="text-lg font-bold text-white">Profil</h3>
            <h3 className="text-lg font-bold text-white">Profil</h3>
            <h3 className="text-lg font-bold text-white">Profil</h3>
            <h3 className="text-lg font-bold text-white">Profil</h3>
            <h3 className="text-lg font-bold text-white">Profil</h3>
            <h3 className="text-lg font-bold text-white">Profil</h3>
            <h3 className="text-lg font-bold text-white">Profil</h3>
          </div>
        </div>

        <div
          className="bg-yellow-500/80 rounded-xl p-4 flex items-center justify-center"
          style={{ gridArea: 'box3' }}
        >
          <div className="text-center">
            <IconSettings size={28} className="text-white mx-auto mb-2" />
            <h3 className="text-lg font-bold text-white">Paramètres</h3>
            <h3 className="text-lg font-bold text-white">Paramètres</h3>
            <h3 className="text-lg font-bold text-white">Paramètres</h3>
            <h3 className="text-lg font-bold text-white">Paramètres</h3>
            <h3 className="text-lg font-bold text-white">Paramètres</h3>
            <h3 className="text-lg font-bold text-white">Paramètres</h3>
            <h3 className="text-lg font-bold text-white">Paramètres</h3>
            <h3 className="text-lg font-bold text-white">Paramètres</h3>
            <h3 className="text-lg font-bold text-white">Paramètres</h3>
            <h3 className="text-lg font-bold text-white">Paramètres</h3>
            <h3 className="text-lg font-bold text-white">Paramètres</h3>
            <h3 className="text-lg font-bold text-white">Paramètres</h3>
            <h3 className="text-lg font-bold text-white">Paramètres</h3>
            <h3 className="text-lg font-bold text-white">Paramètres</h3>
            <h3 className="text-lg font-bold text-white">Paramètres</h3>
            <h3 className="text-lg font-bold text-white">Paramètres</h3>
          </div>
        </div>

        <div
          className="bg-pink-500/80 rounded-xl p-4 flex items-center justify-center"
          style={{ gridArea: 'box4' }}
        >
          <div className="text-center">
            <IconPlayerPlay size={28} className="text-white mx-auto mb-2" />
            <h3 className="text-lg font-bold text-white">Mes chansons</h3>
            <h3 className="text-lg font-bold text-white">Mes chansons</h3>
            <h3 className="text-lg font-bold text-white">Mes chansons</h3>
            <h3 className="text-lg font-bold text-white">Mes chansons</h3>
            <h3 className="text-lg font-bold text-white">Mes chansons</h3>
            <h3 className="text-lg font-bold text-white">Mes chansons</h3>
            <h3 className="text-lg font-bold text-white">Mes chansons</h3>
            <h3 className="text-lg font-bold text-white">Mes chansons</h3>
            <h3 className="text-lg font-bold text-white">Mes chansons</h3>
            <h3 className="text-lg font-bold text-white">Mes chansons</h3>
          </div>
        </div>

        <div
          className="bg-teal-500/80 rounded-xl p-4 flex items-center justify-center"
          style={{ gridArea: 'box5' }}
        >
          <div className="text-center">
            <IconChartBar size={28} className="text-white mx-auto mb-2" />
            <h3 className="text-lg font-bold text-white">Statistiques</h3>
            <h3 className="text-lg font-bold text-white">Statistiques</h3>
            <h3 className="text-lg font-bold text-white">Statistiques</h3>
            <h3 className="text-lg font-bold text-white">Statistiques</h3>
            <h3 className="text-lg font-bold text-white">Statistiques</h3>
            <h3 className="text-lg font-bold text-white">Statistiques</h3>
            <h3 className="text-lg font-bold text-white">Statistiques</h3>
            <IconChartBar size={28} className="text-white mx-auto mb-2" />
            <h3 className="text-lg font-bold text-white">Statistiques</h3>
            <h3 className="text-lg font-bold text-white">Statistiques</h3>
            <h3 className="text-lg font-bold text-white">Statistiques</h3>
            <h3 className="text-lg font-bold text-white">Statistiques</h3>
            <h3 className="text-lg font-bold text-white">Statistiques</h3>
            <h3 className="text-lg font-bold text-white">Statistiques</h3>
            <h3 className="text-lg font-bold text-white">Statistiques</h3>
          </div>
        </div>

        <div
          className="bg-indigo-500/80 rounded-xl p-4 flex items-center justify-center"
          style={{ gridArea: 'box6' }}
        >
          <div className="text-center">
            <IconSettings size={28} className="text-white mx-auto mb-2" />
            <h3 className="text-lg font-bold text-white">Options</h3>
            <h3 className="text-lg font-bold text-white">Options</h3>
            <h3 className="text-lg font-bold text-white">Options</h3>
            <h3 className="text-lg font-bold text-white">Options</h3>
            <h3 className="text-lg font-bold text-white">Options</h3>
            <h3 className="text-lg font-bold text-white">Options</h3>
            <h3 className="text-lg font-bold text-white">Options</h3>
          </div>
        </div>

        <div
          className="bg-red-500/80 rounded-xl p-4 flex items-center justify-center"
          style={{ gridArea: 'box7' }}
        >
          <div className="text-center">
            <IconLogout size={28} className="text-white mx-auto mb-2" />
            <h3 className="text-lg font-bold text-white">Déconnexion</h3>
            <IconLogout size={28} className="text-white mx-auto mb-2" />
            <h3 className="text-lg font-bold text-white">Déconnexion</h3>
            <IconLogout size={28} className="text-white mx-auto mb-2" />
            <h3 className="text-lg font-bold text-white">Déconnexion</h3>
            <IconLogout size={28} className="text-white mx-auto mb-2" />
            <h3 className="text-lg font-bold text-white">Déconnexion</h3>
            <IconLogout size={28} className="text-white mx-auto mb-2" />
            <h3 className="text-lg font-bold text-white">Déconnexion</h3>
            <IconLogout size={28} className="text-white mx-auto mb-2" />
            <h3 className="text-lg font-bold text-white">Déconnexion</h3>
          </div>
        </div>
      </div>
    </div>
  );
}

// Exemple 2: Grille avec aspect-ratio et responsive dynamique
export function BentoGridFullBleed() {
  return (
    <div className="w-full p-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4 auto-rows-auto">
        {/* Élément principal */}
        <div className="bg-gradient-to-br from-violet-500 to-purple-700 rounded-2xl p-6 col-span-1 md:col-span-1 lg:col-span-3 aspect-square lg:aspect-auto lg:row-span-2 flex flex-col justify-between overflow-hidden relative group">
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-500"></div>
          <div className="z-10">
            <h3 className="text-xl md:text-2xl font-bold text-white">
              Bibliothèque Virtuo
            </h3>
            <p className="text-white/70 mt-2">
              Découvrez des partitions interactives
            </p>
          </div>
          <div className="flex justify-end items-end z-10">
            <button className="bg-white/20 hover:bg-white/30 text-white font-medium py-2 px-4 rounded-lg transition-all">
              Explorer
            </button>
          </div>
        </div>

        {/* Éléments secondaires */}
        <div className="bg-gradient-to-br from-amber-400 to-orange-500 rounded-2xl p-5 col-span-1 lg:col-span-2 aspect-video flex flex-col justify-between overflow-hidden relative group">
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-500"></div>
          <h3 className="text-lg md:text-xl font-bold text-white z-10">
            Tutoriels récents
          </h3>
          <p className="text-white/70 mt-1 z-10">
            Apprenez de nouvelles techniques
          </p>
        </div>

        <div className="bg-gradient-to-br from-emerald-400 to-green-600 rounded-2xl p-5 col-span-1 lg:col-span-1 aspect-square flex flex-col justify-between overflow-hidden relative group">
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-500"></div>
          <h3 className="text-lg md:text-xl font-bold text-white z-10">
            Stats
          </h3>
          <p className="text-white/70 mt-1 z-10">Votre progression</p>
        </div>

        <div className="bg-gradient-to-br from-blue-400 to-cyan-600 rounded-2xl p-5 col-span-1 lg:col-span-1 aspect-square flex flex-col justify-between overflow-hidden relative group">
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-500"></div>
          <h3 className="text-lg md:text-xl font-bold text-white z-10">
            Profil
          </h3>
          <p className="text-white/70 mt-1 z-10">
            Personnalisez votre expérience
          </p>
        </div>

        <div className="bg-gradient-to-br from-pink-400 to-rose-600 rounded-2xl p-5 col-span-1 lg:col-span-2 aspect-video flex flex-col justify-between overflow-hidden relative group">
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-500"></div>
          <h3 className="text-lg md:text-xl font-bold text-white z-10">
            Favoris
          </h3>
          <p className="text-white/70 mt-1 z-10">Vos morceaux préférés</p>
        </div>

        <div className="bg-gradient-to-br from-sky-400 to-indigo-600 rounded-2xl p-5 col-span-1 md:col-span-2 lg:col-span-3 aspect-video flex flex-col justify-between overflow-hidden relative group">
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-500"></div>
          <h3 className="text-lg md:text-xl font-bold text-white z-10">
            Communauté
          </h3>
          <p className="text-white/70 mt-1 z-10">Partagez vos créations</p>
        </div>
      </div>
    </div>
  );
}

// Exemple 3: Grille avec disposition masonry et hauteurs variables
export function BentoGridMasonry() {
  return (
    <div className="w-full p-4 h-full">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 auto-rows-[minmax(120px,auto)]">
        {/* Élément 1 - Card importante */}
        <div className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-2xl overflow-hidden col-span-1 sm:col-span-2 lg:col-span-2 row-span-2 p-6 flex flex-col justify-between">
          <div className="flex-1 flex flex-col justify-center items-center">
            <h2 className="text-2xl md:text-3xl font-bold text-white text-center">
              Bibliothèque Musicale
            </h2>
            <p className="text-white/80 mt-2 text-center">
              Explorez votre collection de partitions interactives
            </p>
            <button className="mt-4 bg-white/20 hover:bg-white/30 text-white py-2 px-6 rounded-full transition-all">
              Accéder
            </button>
          </div>
        </div>

        {/* Élément 2 */}
        <div className="bg-gradient-to-br from-amber-400 to-orange-500 rounded-2xl p-5 row-span-1 flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <h3 className="text-lg font-bold text-white">Favoris</h3>
            <IconStar size={24} className="text-white" />
          </div>
          <p className="text-white/70 mt-1 text-sm">5 morceaux favoris</p>
        </div>

        {/* Élément 3 */}
        <div className="bg-gradient-to-br from-teal-400 to-emerald-500 rounded-2xl p-5 row-span-1 flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <h3 className="text-lg font-bold text-white">Statistiques</h3>
            <IconChartBar size={24} className="text-white" />
          </div>
          <p className="text-white/70 mt-1 text-sm">
            3h de pratique cette semaine
          </p>
        </div>

        {/* Élément 4 */}
        <div className="bg-gradient-to-br from-blue-400 to-cyan-500 rounded-2xl p-5 col-span-1 sm:col-span-2 lg:col-span-2 row-span-1 flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <h3 className="text-lg font-bold text-white">Tutoriels récents</h3>
            <IconPlayerPlay size={24} className="text-white" />
          </div>
          <p className="text-white/70 mt-1 text-sm">
            10 nouveaux tutoriels disponibles
          </p>
        </div>

        {/* Élément 5 */}
        <div className="bg-gradient-to-br from-rose-400 to-red-500 rounded-2xl p-5 row-span-1 flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <h3 className="text-lg font-bold text-white">Profil</h3>
            <IconUser size={24} className="text-white" />
          </div>
          <p className="text-white/70 mt-1 text-sm">Niveau intermédiaire</p>
        </div>

        {/* Élément 6 */}
        <div className="bg-gradient-to-br from-purple-400 to-indigo-500 rounded-2xl p-5 row-span-1 flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <h3 className="text-lg font-bold text-white">Paramètres</h3>
            <IconSettings size={24} className="text-white" />
          </div>
          <p className="text-white/70 mt-1 text-sm">
            Personnalisez votre expérience
          </p>
        </div>

        {/* Élément 7 */}
        <div className="bg-gradient-to-br from-green-400 to-lime-500 rounded-2xl p-5 row-span-1 flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <h3 className="text-lg font-bold text-white">Mes compositions</h3>
            <IconMusic size={24} className="text-white" />
          </div>
          <p className="text-white/70 mt-1 text-sm">3 compositions en cours</p>
        </div>
      </div>
    </div>
  );
}

// Exemple 4: Grille avec items interactifs et dark mode
export function BentoGridInteractive() {
  return (
    <div className="w-full p-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 auto-rows-fr">
        {/* Item 1 - Grande carte principale */}
        <div className="col-span-1 md:col-span-2 md:row-span-2 bg-slate-800/50 backdrop-blur-md rounded-2xl overflow-hidden border border-slate-700/50 group hover:border-slate-500/50 transition-all duration-300">
          <div className="p-6 h-full flex flex-col">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-white">
                Bibliothèque Musicale
              </h2>
              <span className="bg-indigo-500/20 text-indigo-300 text-xs px-2 py-1 rounded-full">
                Premium
              </span>
            </div>
            <div className="flex-grow flex items-center justify-center">
              <div className="text-center">
                <div className="bg-indigo-500/20 w-20 h-20 mx-auto rounded-full flex items-center justify-center mb-4">
                  <IconMusic size={36} className="text-indigo-300" />
                </div>
                <p className="text-slate-300 max-w-md mx-auto">
                  Explorez votre collection complète de partitions interactives
                  et enregistrements
                </p>
              </div>
            </div>
            <div className="mt-4">
              <button className="w-full bg-indigo-600 hover:bg-indigo-500 text-white py-2 rounded-lg transition-colors">
                Accéder
              </button>
            </div>
          </div>
        </div>

        {/* Item 2 */}
        <div className="col-span-1 row-span-1 bg-slate-800/50 backdrop-blur-md rounded-2xl overflow-hidden border border-slate-700/50 group hover:border-slate-500/50 transition-all duration-300">
          <div className="p-5 h-full flex flex-col">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-base font-medium text-white">Statistiques</h3>
              <IconChartBar size={20} className="text-blue-300" />
            </div>
            <div className="flex-grow flex items-center">
              <div className="w-full bg-slate-700/50 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-blue-500 h-full"
                  style={{ width: '68%' }}
                ></div>
              </div>
            </div>
            <p className="text-sm text-slate-400 mt-2">
              68% d'objectifs atteints
            </p>
          </div>
        </div>

        {/* Item 3 */}
        <div className="col-span-1 row-span-1 bg-slate-800/50 backdrop-blur-md rounded-2xl overflow-hidden border border-slate-700/50 group hover:border-slate-500/50 transition-all duration-300">
          <div className="p-5 h-full flex flex-col">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-base font-medium text-white">Favoris</h3>
              <IconStar size={20} className="text-amber-300" />
            </div>
            <div className="flex-grow flex items-center">
              <p className="text-sm text-slate-400">
                8 morceaux ajoutés aux favoris
              </p>
            </div>
          </div>
        </div>

        {/* Item 4 */}
        <div className="col-span-1 row-span-1 bg-slate-800/50 backdrop-blur-md rounded-2xl overflow-hidden border border-slate-700/50 group hover:border-slate-500/50 transition-all duration-300">
          <div className="p-5 h-full flex flex-col">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-base font-medium text-white">Profil</h3>
              <IconUser size={20} className="text-emerald-300" />
            </div>
            <div className="flex-grow flex items-center">
              <p className="text-sm text-slate-400">Niveau intermédiaire</p>
            </div>
          </div>
        </div>

        {/* Item 5 */}
        <div className="col-span-1 md:col-span-2 row-span-1 bg-slate-800/50 backdrop-blur-md rounded-2xl overflow-hidden border border-slate-700/50 group hover:border-slate-500/50 transition-all duration-300">
          <div className="p-5 h-full flex flex-col">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-base font-medium text-white">
                Dernière session
              </h3>
              <IconPlayerPlay size={20} className="text-rose-300" />
            </div>
            <div className="flex-grow flex items-center">
              <p className="text-sm text-slate-400">
                45 minutes de pratique - "Nocturne in E-flat major"
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Exportation principale pour les exemples
export default function BentoExamples() {
  return (
    <div className="flex flex-col gap-20 py-10">
      <section>
        <h2 className="text-2xl font-bold mb-6 text-center">
          Exemple 1: Grid avec template areas
        </h2>
        <BentoGridAreas />
      </section>

      <section>
        <h2 className="text-2xl font-bold mb-6 text-center">
          Exemple 2: Grid responsive avec aspect-ratio
        </h2>
        <BentoGridFullBleed />
      </section>

      <section>
        <h2 className="text-2xl font-bold mb-6 text-center">
          Exemple 3: Grid style Masonry
        </h2>
        <BentoGridMasonry />
      </section>

      <section>
        <h2 className="text-2xl font-bold mb-6 text-center">
          Exemple 4: Grid en dark mode avec effets interactifs
        </h2>
        <BentoGridInteractive />
      </section>
    </div>
  );
}
