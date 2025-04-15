'use client';

import React, { useState } from 'react';
import {
  IconMusic,
  IconHeart,
  IconClockHour3,
  IconPlayerPlay,
  IconCalendar,
  IconTrendingUp,
  IconStar,
  IconBookmark,
  IconPlus,
  IconFilter,
  IconHistory,
  IconDiamondsFilled,
  IconChartLine,
  IconPlaylist,
  IconSettings,
  IconSearch,
  IconX,
  IconArrowRight,
  IconDeviceGamepad,
  IconChevronRight,
  IconListCheck,
  IconHeadphones,
  IconBrandYoutube,
  IconPalette,
  IconDots,
} from '@tabler/icons-react';
import * as Progress from '@radix-ui/react-progress';
import * as Tabs from '@radix-ui/react-tabs';

// Types pour les morceaux en favoris
interface FavoriteSong {
  id: string;
  title: string;
  composer: string;
  category: string;
  lastPlayed?: string;
  progress: number;
  imageUrl?: string;
  duration: string;
  dateAdded: string;
  playCount: number;
  difficulty?: 'débutant' | 'intermédiaire' | 'avancé' | 'expert';
  tags?: string[];
  notes?: string;
  isFeatured?: boolean;
}

// Type pour les playlists
interface Playlist {
  id: string;
  name: string;
  imageUrl?: string;
  songCount: number;
  description?: string;
  lastPlayed?: string;
  colorScheme: string;
  icon: React.ReactNode;
}

// Type pour les suggestions
interface SongSuggestion {
  id: string;
  title: string;
  composer: string;
  imageUrl?: string;
  reason: string;
  similarTo?: string;
  difficulty?: 'débutant' | 'intermédiaire' | 'avancé' | 'expert';
}

// Type pour les filtres
interface FilterOption {
  id: string;
  label: string;
  icon?: React.ReactNode;
  count?: number;
}

// Données de démo pour les morceaux favoris
const favoriteSongs: FavoriteSong[] = [
  {
    id: '1',
    title: 'Nocturne Op. 9 No. 2',
    composer: 'Frédéric Chopin',
    category: 'Classique',
    progress: 85,
    imageUrl: '/images/songs/nocturne.jpg',
    lastPlayed: "Aujourd'hui",
    duration: '4:33',
    dateAdded: 'Il y a 3 mois',
    playCount: 24,
    difficulty: 'intermédiaire',
    tags: ['Romantique', 'Doux', 'Mélancolique'],
    isFeatured: true,
  },
  {
    id: '2',
    title: 'Clair de Lune',
    composer: 'Claude Debussy',
    category: 'Classique',
    progress: 62,
    lastPlayed: 'Hier',
    duration: '5:12',
    dateAdded: 'Il y a 2 semaines',
    playCount: 18,
    difficulty: 'avancé',
    tags: ['Impressionnisme', 'Doux'],
  },
  {
    id: '5',
    title: 'Gymnopédie No. 1',
    composer: 'Erik Satie',
    category: 'Classique',
    progress: 78,
    lastPlayed: 'Il y a 2 jours',
    duration: '3:05',
    dateAdded: 'Il y a 1 mois',
    playCount: 12,
    difficulty: 'intermédiaire',
    tags: ['Minimaliste', 'Calme'],
    isFeatured: true,
  },
  {
    id: '7',
    title: 'La Campanella',
    composer: 'Franz Liszt',
    category: 'Classique',
    progress: 12,
    lastPlayed: 'Il y a 5 jours',
    duration: '5:50',
    dateAdded: 'Il y a 3 jours',
    playCount: 3,
    difficulty: 'expert',
    tags: ['Virtuose', 'Technique'],
  },
  {
    id: '8',
    title: 'River Flows In You',
    composer: 'Yiruma',
    category: 'Contemporain',
    progress: 92,
    lastPlayed: 'Il y a 1 semaine',
    duration: '3:50',
    dateAdded: 'Il y a 5 mois',
    playCount: 35,
    difficulty: 'intermédiaire',
    tags: ['Populaire', 'Mélodique'],
    isFeatured: true,
  },
  {
    id: '10',
    title: 'Prélude en C Majeur',
    composer: 'J.S. Bach',
    category: 'Baroque',
    progress: 55,
    lastPlayed: 'Il y a 3 jours',
    duration: '2:45',
    dateAdded: 'Il y a 1 mois',
    playCount: 8,
    difficulty: 'intermédiaire',
    tags: ['Technique', 'Harmonique'],
  },
  {
    id: '11',
    title: 'Sonate au Clair de Lune',
    composer: 'Ludwig van Beethoven',
    category: 'Classique',
    progress: 45,
    lastPlayed: 'Il y a 10 jours',
    duration: '6:15',
    dateAdded: 'Il y a 2 mois',
    playCount: 14,
    difficulty: 'avancé',
    tags: ['Romantique', 'Émotionnel'],
  },
];

// Données pour les playlists
const playlists: Playlist[] = [
  {
    id: '1',
    name: 'Pièces classiques',
    songCount: 5,
    description: 'Mes morceaux classiques préférés',
    colorScheme:
      'from-blue-500/10 to-indigo-500/10 dark:from-blue-900/20 dark:to-indigo-900/20',
    icon: (
      <IconDiamondsFilled
        size={16}
        className="text-blue-500 dark:text-blue-400"
      />
    ),
  },
  {
    id: '2',
    name: 'Pour méditer',
    songCount: 3,
    description: 'Morceaux apaisants et méditatifs',
    lastPlayed: 'Il y a 3 jours',
    colorScheme:
      'from-emerald-500/10 to-teal-500/10 dark:from-emerald-900/20 dark:to-teal-900/20',
    icon: (
      <IconDiamondsFilled
        size={16}
        className="text-emerald-500 dark:text-emerald-400"
      />
    ),
  },
  {
    id: '3',
    name: 'Techniques avancées',
    songCount: 2,
    description: 'Pour améliorer ma technique',
    colorScheme:
      'from-amber-500/10 to-yellow-500/10 dark:from-amber-900/20 dark:to-yellow-900/20',
    icon: (
      <IconDiamondsFilled
        size={16}
        className="text-amber-500 dark:text-amber-400"
      />
    ),
  },
  {
    id: '4',
    name: 'Mes compositions',
    songCount: 1,
    description: 'Compositions personnelles',
    colorScheme:
      'from-rose-500/10 to-pink-500/10 dark:from-rose-900/20 dark:to-pink-900/20',
    icon: (
      <IconDiamondsFilled
        size={16}
        className="text-rose-500 dark:text-rose-400"
      />
    ),
  },
];

// Données pour les suggestions
const songSuggestions: SongSuggestion[] = [
  {
    id: '101',
    title: 'Rêverie',
    composer: 'Claude Debussy',
    imageUrl: '/images/songs/reverie.jpg',
    reason: 'Similaire à Clair de Lune',
    similarTo: 'Clair de Lune',
    difficulty: 'intermédiaire',
  },
  {
    id: '102',
    title: 'Prélude en C Majeur',
    composer: 'J.S. Bach',
    imageUrl: '/images/songs/prelude.jpg',
    reason: 'Populaire parmi les utilisateurs comme vous',
    difficulty: 'intermédiaire',
  },
  {
    id: '103',
    title: 'Arabesque No. 1',
    composer: 'Claude Debussy',
    reason: 'Basé sur vos préférences pour Debussy',
    difficulty: 'avancé',
  },
  {
    id: '104',
    title: 'Fantaisie-Impromptu',
    composer: 'Frédéric Chopin',
    reason: 'Similaire à Nocturne Op. 9 No. 2',
    similarTo: 'Nocturne Op. 9 No. 2',
    difficulty: 'expert',
  },
];

// Options de filtres
const difficultyFilters: FilterOption[] = [
  { id: 'all', label: 'Toutes difficultés' },
  { id: 'débutant', label: 'Débutant', count: 1 },
  { id: 'intermédiaire', label: 'Intermédiaire', count: 3 },
  { id: 'avancé', label: 'Avancé', count: 2 },
  { id: 'expert', label: 'Expert', count: 1 },
];

const categoryFilters: FilterOption[] = [
  { id: 'all', label: 'Toutes catégories' },
  { id: 'classique', label: 'Classique', count: 5 },
  { id: 'baroque', label: 'Baroque', count: 1 },
  { id: 'contemporain', label: 'Contemporain', count: 1 },
];

// Composant de barre de progression
function ProgressBar({ value }: { value: number }) {
  return (
    <Progress.Root
      className="relative overflow-hidden bg-slate-200 dark:bg-slate-700 rounded-full w-full h-2"
      value={value}
    >
      <Progress.Indicator
        className={`h-full transition-transform duration-500 ease-in-out rounded-full ${
          value === 100
            ? 'bg-emerald-500'
            : value > 50
            ? 'bg-blue-500'
            : 'bg-indigo-500'
        }`}
        style={{ transform: `translateX(-${100 - value}%)` }}
      />
    </Progress.Root>
  );
}

// Composant pour le badge de difficulté
function DifficultyBadge({ difficulty }: { difficulty?: string }) {
  const colorMap: Record<string, string> = {
    débutant:
      'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300',
    intermédiaire:
      'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300',
    avancé:
      'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300',
    expert: 'bg-rose-100 dark:bg-rose-900/30 text-rose-700 dark:text-rose-300',
  };

  if (!difficulty) return null;

  return (
    <span
      className={`text-xs font-medium px-2 py-0.5 rounded-full ${colorMap[difficulty]}`}
    >
      {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
    </span>
  );
}

// Composant de carte pour un morceau favori
function SongCard({ song }: { song: FavoriteSong }) {
  return (
    <div className="bg-white dark:bg-slate-800 shadow-sm border border-slate-200 dark:border-slate-700 rounded-xl p-3 hover:shadow-md transition-all">
      <div className="flex gap-3">
        <div className="h-16 w-16 flex-shrink-0 rounded bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center relative group overflow-hidden">
          {song.imageUrl ? (
            <img
              src={song.imageUrl}
              alt={song.title}
              className="h-16 w-16 rounded object-cover"
            />
          ) : (
            <IconMusic
              size={24}
              className="text-indigo-600 dark:text-indigo-400"
            />
          )}
          <div className="absolute inset-0 bg-black/40 rounded flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
            <IconPlayerPlay size={24} className="text-white" />
          </div>
        </div>

        <div className="flex-1">
          <div className="flex items-center justify-between">
            <h3 className="font-medium text-slate-900 dark:text-white text-sm truncate">
              {song.title}
            </h3>
            <button className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
              <IconDots size={16} />
            </button>
          </div>

          <div className="text-xs text-slate-500 dark:text-slate-400">
            {song.composer}
          </div>

          <div className="mt-2">
            <ProgressBar value={song.progress} />
          </div>

          <div className="flex justify-between items-center mt-1">
            <div className="text-xs text-slate-500 dark:text-slate-400">
              {song.progress}% complété
            </div>
            <DifficultyBadge difficulty={song.difficulty} />
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between mt-3 pt-2 border-t border-slate-100 dark:border-slate-700/50">
        <div className="text-xs text-slate-500 dark:text-slate-400 flex items-center">
          <IconClockHour3 size={14} className="mr-1" />
          {song.duration}
        </div>

        <div className="text-xs text-slate-500 dark:text-slate-400 flex items-center">
          <IconPlayerPlay size={14} className="mr-1" />
          {song.playCount} écoutes
        </div>

        {song.lastPlayed && (
          <div className="text-xs text-indigo-600 dark:text-indigo-400 flex items-center">
            <IconHistory size={14} className="mr-1" />
            {song.lastPlayed}
          </div>
        )}
      </div>
    </div>
  );
}

// Composant pour la page de favoris avec divers widgets
export function FavoritesBento() {
  const [activeTab, setActiveTab] = useState('all');
  const [activeFilter, setActiveFilter] = useState('all');

  // Filtrer les morceaux en fonction de l'onglet actif
  const getFilteredSongs = () => {
    let filtered = [...favoriteSongs];

    // Filtre par difficulté
    if (activeFilter !== 'all') {
      filtered = filtered.filter((song) => song.difficulty === activeFilter);
    }

    // Tri en fonction de l'onglet actif
    switch (activeTab) {
      case 'recent':
        return filtered.sort((a, b) => {
          const timeA = a.lastPlayed?.includes('Aujourd')
            ? 0
            : a.lastPlayed?.includes('Hier')
            ? 1
            : a.lastPlayed?.includes('jours')
            ? parseInt(a.lastPlayed.split(' ')[2])
            : 999;
          const timeB = b.lastPlayed?.includes('Aujourd')
            ? 0
            : b.lastPlayed?.includes('Hier')
            ? 1
            : b.lastPlayed?.includes('jours')
            ? parseInt(b.lastPlayed.split(' ')[2])
            : 999;
          return timeA - timeB;
        });
      case 'progress':
        return filtered.sort((a, b) => b.progress - a.progress);
      case 'featured':
        return filtered.filter((song) => song.isFeatured);
      default:
        return filtered;
    }
  };

  return (
    <div className="w-full p-4 space-y-8">
      {/* En-tête avec statistiques */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-md overflow-hidden border border-slate-200 dark:border-slate-700">
        <div className="p-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center">
                <IconHeart
                  size={28}
                  className="mr-2 text-rose-500"
                  fill="currentColor"
                />
                Mes favoris
              </h1>
              <p className="text-slate-500 dark:text-slate-400 mt-1">
                Retrouvez vos morceaux préférés et suivez votre progression
              </p>
            </div>

            <div className="grid grid-cols-3 gap-4 text-center">
              <div className="bg-slate-50 dark:bg-slate-700/50 p-3 rounded-lg">
                <div className="text-2xl font-bold text-slate-900 dark:text-white">
                  {favoriteSongs.length}
                </div>
                <div className="text-xs text-slate-500 dark:text-slate-400">
                  Morceaux
                </div>
              </div>
              <div className="bg-slate-50 dark:bg-slate-700/50 p-3 rounded-lg">
                <div className="text-2xl font-bold text-slate-900 dark:text-white">
                  {Math.round(
                    favoriteSongs.reduce(
                      (acc, song) => acc + song.progress,
                      0
                    ) / favoriteSongs.length
                  )}
                  %
                </div>
                <div className="text-xs text-slate-500 dark:text-slate-400">
                  Progression
                </div>
              </div>
              <div className="bg-slate-50 dark:bg-slate-700/50 p-3 rounded-lg">
                <div className="text-2xl font-bold text-slate-900 dark:text-white">
                  {favoriteSongs.reduce((acc, song) => acc + song.playCount, 0)}
                </div>
                <div className="text-xs text-slate-500 dark:text-slate-400">
                  Écoutes
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Grille principale */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {/* Morceaux récemment joués */}
        <div className="md:col-span-2 bg-white dark:bg-slate-800 rounded-2xl shadow-md overflow-hidden border border-slate-200 dark:border-slate-700">
          <div className="p-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center">
                <IconHistory size={20} className="mr-2 text-indigo-500" />
                Derniers morceaux joués
              </h2>
              <button className="text-xs text-indigo-600 dark:text-indigo-400 font-medium hover:underline">
                Voir tout
              </button>
            </div>

            <div className="space-y-3">
              {favoriteSongs
                .sort((a, b) => {
                  const timeA = a.lastPlayed?.includes('Aujourd')
                    ? 0
                    : a.lastPlayed?.includes('Hier')
                    ? 1
                    : 3;
                  const timeB = b.lastPlayed?.includes('Aujourd')
                    ? 0
                    : b.lastPlayed?.includes('Hier')
                    ? 1
                    : 3;
                  return timeA - timeB;
                })
                .slice(0, 3)
                .map((song) => (
                  <div
                    key={song.id}
                    className="flex items-center p-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700/40 transition-colors cursor-pointer"
                  >
                    <div className="h-12 w-12 flex-shrink-0 rounded bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center mr-3 relative group">
                      {song.imageUrl ? (
                        <img
                          src={song.imageUrl}
                          alt={song.title}
                          className="h-12 w-12 rounded object-cover"
                        />
                      ) : (
                        <IconMusic
                          size={20}
                          className="text-indigo-600 dark:text-indigo-400"
                        />
                      )}
                      <div className="absolute inset-0 bg-black/40 rounded flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <IconPlayerPlay size={20} className="text-white" />
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium text-slate-900 dark:text-white truncate">
                        {song.title}
                      </div>
                      <div className="text-xs text-slate-500 dark:text-slate-400">
                        {song.composer}
                      </div>
                      {song.lastPlayed && (
                        <div className="text-xs text-indigo-600 dark:text-indigo-400 mt-1 flex items-center">
                          <IconCalendar size={12} className="mr-1" />
                          Joué {song.lastPlayed}
                        </div>
                      )}
                    </div>
                    <div className="flex-shrink-0 ml-2">
                      <span className="text-xs text-slate-500 dark:text-slate-400 inline-block min-w-[40px] text-right">
                        {song.duration}
                      </span>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>

        {/* Recommandations basées sur vos favoris */}
        <div className="md:col-span-1 lg:col-span-2 bg-white dark:bg-slate-800 rounded-2xl shadow-md overflow-hidden border border-slate-200 dark:border-slate-700">
          <div className="p-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center">
                <IconStar size={20} className="mr-2 text-amber-500" />
                Recommandations
              </h2>
              <button className="text-xs text-indigo-600 dark:text-indigo-400 font-medium hover:underline">
                Actualiser
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
              {[
                {
                  title: 'Rêverie',
                  composer: 'Claude Debussy',
                  image: '/images/songs/reverie.jpg',
                },
                {
                  title: 'Prélude en C Majeur',
                  composer: 'J.S. Bach',
                  image: '/images/songs/prelude.jpg',
                },
              ].map((rec, i) => (
                <div
                  key={i}
                  className="bg-slate-50 dark:bg-slate-700/40 rounded-lg p-3 flex items-center group cursor-pointer"
                >
                  <div className="h-14 w-14 flex-shrink-0 rounded bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center mr-3 relative overflow-hidden">
                    {rec.image ? (
                      <img
                        src={rec.image}
                        alt={rec.title}
                        className="h-14 w-14 rounded object-cover"
                      />
                    ) : (
                      <IconMusic
                        size={24}
                        className="text-indigo-600 dark:text-indigo-400"
                      />
                    )}
                    <div className="absolute inset-0 bg-black/40 rounded flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <IconPlus size={20} className="text-white" />
                    </div>
                  </div>
                  <div>
                    <div className="text-sm font-medium text-slate-900 dark:text-white">
                      {rec.title}
                    </div>
                    <div className="text-xs text-slate-500 dark:text-slate-400">
                      {rec.composer}
                    </div>
                    <div className="mt-1 text-xs text-indigo-600 dark:text-indigo-400">
                      Suggéré pour vous
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Progression sur les favoris */}
        <div className="md:col-span-2 bg-white dark:bg-slate-800 rounded-2xl shadow-md overflow-hidden border border-slate-200 dark:border-slate-700">
          <div className="p-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center">
                <IconTrendingUp size={20} className="mr-2 text-emerald-500" />
                Votre progression
              </h2>
              <div className="flex space-x-2">
                <button className="text-xs py-1 px-2 rounded bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 font-medium">
                  Semaine
                </button>
                <button className="text-xs py-1 px-2 rounded text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700/50">
                  Mois
                </button>
                <button className="text-xs py-1 px-2 rounded text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700/50">
                  Année
                </button>
              </div>
            </div>

            <div className="space-y-4">
              {favoriteSongs
                .sort((a, b) => b.progress - a.progress)
                .map((song) => (
                  <div key={song.id} className="space-y-1">
                    <div className="flex justify-between text-xs mb-1">
                      <span className="font-medium text-slate-700 dark:text-slate-300">
                        {song.title}
                      </span>
                      <span className="text-slate-500 dark:text-slate-400">
                        {song.progress}%
                      </span>
                    </div>
                    <ProgressBar value={song.progress} />
                    <div className="flex justify-between text-xs mt-1">
                      <span className="text-slate-500 dark:text-slate-400">
                        {song.playCount} séances
                      </span>
                      <span className="text-slate-500 dark:text-slate-400">
                        {song.progress < 25
                          ? 'Débute'
                          : song.progress < 50
                          ? 'En progression'
                          : song.progress < 75
                          ? 'Avancé'
                          : 'Maîtrisé'}
                      </span>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>

        {/* Collections */}
        <div className="md:col-span-1 lg:col-span-2 bg-white dark:bg-slate-800 rounded-2xl shadow-md overflow-hidden border border-slate-200 dark:border-slate-700">
          <div className="p-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center">
                <IconBookmark size={20} className="mr-2 text-purple-500" />
                Vos collections
              </h2>
              <button className="text-xs bg-indigo-600 hover:bg-indigo-700 text-white py-1 px-3 rounded-full flex items-center">
                <IconPlus size={14} className="mr-1" />
                Nouvelle
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
              {[
                {
                  name: 'Pièces classiques',
                  count: 5,
                  color:
                    'bg-gradient-to-r from-blue-500/10 to-indigo-500/10 dark:from-blue-900/20 dark:to-indigo-900/20',
                  icon: (
                    <IconDiamondsFilled
                      size={16}
                      className="text-blue-500 dark:text-blue-400"
                    />
                  ),
                },
                {
                  name: 'Pour méditer',
                  count: 3,
                  color:
                    'bg-gradient-to-r from-emerald-500/10 to-teal-500/10 dark:from-emerald-900/20 dark:to-teal-900/20',
                  icon: (
                    <IconDiamondsFilled
                      size={16}
                      className="text-emerald-500 dark:text-emerald-400"
                    />
                  ),
                },
                {
                  name: 'Techniques avancées',
                  count: 2,
                  color:
                    'bg-gradient-to-r from-amber-500/10 to-yellow-500/10 dark:from-amber-900/20 dark:to-yellow-900/20',
                  icon: (
                    <IconDiamondsFilled
                      size={16}
                      className="text-amber-500 dark:text-amber-400"
                    />
                  ),
                },
                {
                  name: 'Mes compositions',
                  count: 1,
                  color:
                    'bg-gradient-to-r from-rose-500/10 to-pink-500/10 dark:from-rose-900/20 dark:to-pink-900/20',
                  icon: (
                    <IconDiamondsFilled
                      size={16}
                      className="text-rose-500 dark:text-rose-400"
                    />
                  ),
                },
              ].map((collection, i) => (
                <div
                  key={i}
                  className={`rounded-lg p-3 flex items-center justify-between cursor-pointer ${collection.color} border border-slate-200/50 dark:border-slate-700/50 hover:border-slate-300 dark:hover:border-slate-600 transition-colors`}
                >
                  <div className="flex items-center">
                    <div className="mr-3">{collection.icon}</div>
                    <div>
                      <div className="text-sm font-medium text-slate-900 dark:text-white">
                        {collection.name}
                      </div>
                      <div className="text-xs text-slate-500 dark:text-slate-400">
                        {collection.count} morceaux
                      </div>
                    </div>
                  </div>
                  <button className="p-1 rounded-full hover:bg-white/50 dark:hover:bg-slate-700/50 text-slate-500 dark:text-slate-400">
                    <IconPlayerPlay size={16} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Section de partage */}
      <div className="bg-gradient-to-r from-indigo-500/10 to-purple-500/10 dark:from-indigo-900/20 dark:to-purple-900/20 rounded-2xl shadow-md overflow-hidden border border-indigo-200 dark:border-indigo-900/30">
        <div className="p-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                Partagez vos favoris
              </h2>
              <p className="text-slate-700 dark:text-slate-300 mt-1">
                Permettez à vos amis de découvrir votre collection de morceaux
                préférés
              </p>
            </div>

            <div className="flex space-x-3">
              <button className="bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800/50 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 py-2 px-4 rounded-lg text-sm font-medium transition-colors">
                Créer un lien
              </button>
              <button className="bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 rounded-lg text-sm font-medium transition-colors">
                Partager maintenant
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default FavoritesBento;
