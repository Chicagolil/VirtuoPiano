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

      {/* Système d'onglets et filtres */}
      <Tabs.Root value={activeTab} onValueChange={setActiveTab}>
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <Tabs.List className="flex space-x-2 border-b border-slate-200 dark:border-slate-700 pb-1">
            <Tabs.Trigger
              value="all"
              className={`px-4 py-2 text-sm font-medium rounded-t-lg transition-colors ${
                activeTab === 'all'
                  ? 'bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 border-t border-l border-r border-slate-200 dark:border-slate-700'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              Tous les favoris
            </Tabs.Trigger>
            <Tabs.Trigger
              value="recent"
              className={`px-4 py-2 text-sm font-medium rounded-t-lg transition-colors ${
                activeTab === 'recent'
                  ? 'bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 border-t border-l border-r border-slate-200 dark:border-slate-700'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              Récemment joués
            </Tabs.Trigger>
            <Tabs.Trigger
              value="progress"
              className={`px-4 py-2 text-sm font-medium rounded-t-lg transition-colors ${
                activeTab === 'progress'
                  ? 'bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 border-t border-l border-r border-slate-200 dark:border-slate-700'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              Progression
            </Tabs.Trigger>
            <Tabs.Trigger
              value="featured"
              className={`px-4 py-2 text-sm font-medium rounded-t-lg transition-colors ${
                activeTab === 'featured'
                  ? 'bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 border-t border-l border-r border-slate-200 dark:border-slate-700'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              En vedette
            </Tabs.Trigger>
          </Tabs.List>

          <div className="flex gap-2 items-center">
            <span className="text-sm text-slate-500 dark:text-slate-400">
              Difficulté:
            </span>
            <select
              className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm px-3 py-1.5"
              value={activeFilter}
              onChange={(e) => setActiveFilter(e.target.value)}
            >
              {difficultyFilters.map((filter) => (
                <option key={filter.id} value={filter.id}>
                  {filter.label} {filter.count ? `(${filter.count})` : ''}
                </option>
              ))}
            </select>

            <button className="ml-2 p-1.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400">
              <IconSearch size={18} />
            </button>
          </div>
        </div>

        {/* Contenu des onglets */}
        <Tabs.Content value="all" className="focus:outline-none">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
            {getFilteredSongs().map((song) => (
              <SongCard key={song.id} song={song} />
            ))}
          </div>
        </Tabs.Content>

        <Tabs.Content value="recent" className="focus:outline-none">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
            {getFilteredSongs().map((song) => (
              <SongCard key={song.id} song={song} />
            ))}
          </div>
        </Tabs.Content>

        <Tabs.Content value="progress" className="focus:outline-none">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
            {getFilteredSongs().map((song) => (
              <SongCard key={song.id} song={song} />
            ))}
          </div>
        </Tabs.Content>

        <Tabs.Content value="featured" className="focus:outline-none">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
            {getFilteredSongs().map((song) => (
              <SongCard key={song.id} song={song} />
            ))}
          </div>
        </Tabs.Content>
      </Tabs.Root>

      {/* Playlists */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-md overflow-hidden border border-slate-200 dark:border-slate-700 p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center">
            <IconPlaylist size={20} className="mr-2 text-purple-500" />
            Vos playlists
          </h2>
          <button className="text-xs bg-indigo-600 hover:bg-indigo-700 text-white py-1.5 px-3 rounded-lg flex items-center">
            <IconPlus size={14} className="mr-1" />
            Nouvelle playlist
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {playlists.map((playlist) => (
            <div
              key={playlist.id}
              className={`rounded-lg p-4 flex flex-col bg-gradient-to-r ${playlist.colorScheme} border border-slate-200/50 dark:border-slate-700/50 hover:border-slate-300 dark:hover:border-slate-600 transition-colors cursor-pointer`}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center">
                  {playlist.icon}
                  <h3 className="ml-2 font-medium text-slate-900 dark:text-white text-sm">
                    {playlist.name}
                  </h3>
                </div>
                <button className="p-1 rounded-full hover:bg-white/30 dark:hover:bg-slate-700/50 text-slate-700 dark:text-slate-300">
                  <IconPlayerPlay size={16} />
                </button>
              </div>

              <p className="text-xs text-slate-600 dark:text-slate-400 mb-2 line-clamp-2">
                {playlist.description}
              </p>

              <div className="mt-auto pt-2 flex justify-between items-center text-xs text-slate-500 dark:text-slate-400">
                <span>{playlist.songCount} morceaux</span>
                {playlist.lastPlayed && (
                  <span className="flex items-center">
                    <IconHistory size={12} className="mr-1" />
                    {playlist.lastPlayed}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recommandations */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-md overflow-hidden border border-slate-200 dark:border-slate-700 p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center">
            <IconStar size={20} className="mr-2 text-amber-500" />
            Recommandations pour vous
          </h2>
          <button className="text-xs text-indigo-600 dark:text-indigo-400 font-medium hover:underline flex items-center">
            Voir plus <IconChevronRight size={14} className="ml-1" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {songSuggestions.map((suggestion) => (
            <div
              key={suggestion.id}
              className="bg-slate-50 dark:bg-slate-700/40 rounded-xl p-4 group cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-700/60 transition-colors"
            >
              <div className="h-36 w-full mb-3 rounded-lg bg-slate-200 dark:bg-slate-600 overflow-hidden relative">
                {suggestion.imageUrl ? (
                  <img
                    src={suggestion.imageUrl}
                    alt={suggestion.title}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full w-full">
                    <IconMusic
                      size={36}
                      className="text-slate-400 dark:text-slate-500"
                    />
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent flex items-end p-3">
                  <button className="p-2 bg-white/20 backdrop-blur-sm rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                    <IconPlayerPlay size={20} className="text-white" />
                  </button>
                </div>
              </div>

              <h3 className="font-medium text-slate-900 dark:text-white text-sm">
                {suggestion.title}
              </h3>
              <div className="text-xs text-slate-500 dark:text-slate-400 mb-2">
                {suggestion.composer}
              </div>

              <div className="flex justify-between items-center">
                <div className="text-xs text-indigo-600 dark:text-indigo-400 line-clamp-1">
                  {suggestion.reason}
                </div>
                <DifficultyBadge difficulty={suggestion.difficulty} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Outils supplémentaires */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Explorer de nouvelles pièces */}
        <div className="bg-gradient-to-r from-indigo-500/10 to-purple-500/10 dark:from-indigo-900/20 dark:to-purple-900/20 rounded-2xl shadow-md overflow-hidden border border-indigo-200 dark:border-indigo-900/30 p-5">
          <div className="flex items-center mb-3">
            <div className="p-2 rounded-full bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400 mr-3">
              <IconSearch size={20} />
            </div>
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
              Explorer des morceaux
            </h2>
          </div>

          <p className="text-sm text-slate-600 dark:text-slate-300 mb-4">
            Découvrez des centaines de morceaux adaptés à votre niveau
          </p>

          <div className="flex space-x-2">
            <button className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 py-1.5 px-3 rounded-lg text-sm transition-colors hover:border-indigo-300 dark:hover:border-indigo-700 flex-1">
              Par genre
            </button>
            <button className="bg-indigo-600 hover:bg-indigo-700 text-white py-1.5 px-3 rounded-lg text-sm transition-colors flex-1">
              Explorer
            </button>
          </div>
        </div>

        {/* Tutoriels vidéo */}
        <div className="bg-gradient-to-r from-amber-500/10 to-orange-500/10 dark:from-amber-900/20 dark:to-orange-900/20 rounded-2xl shadow-md overflow-hidden border border-amber-200 dark:border-amber-900/30 p-5">
          <div className="flex items-center mb-3">
            <div className="p-2 rounded-full bg-amber-100 dark:bg-amber-900/50 text-amber-600 dark:text-amber-400 mr-3">
              <IconBrandYoutube size={20} />
            </div>
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
              Tutoriels
            </h2>
          </div>

          <p className="text-sm text-slate-600 dark:text-slate-300 mb-4">
            Vidéos d'apprentissage pour vos morceaux favoris
          </p>

          <button className="w-full bg-amber-600 hover:bg-amber-700 text-white py-1.5 px-3 rounded-lg text-sm transition-colors">
            Voir les tutoriels
          </button>
        </div>

        {/* Personnalisation */}
        <div className="bg-gradient-to-r from-emerald-500/10 to-teal-500/10 dark:from-emerald-900/20 dark:to-teal-900/20 rounded-2xl shadow-md overflow-hidden border border-emerald-200 dark:border-emerald-900/30 p-5">
          <div className="flex items-center mb-3">
            <div className="p-2 rounded-full bg-emerald-100 dark:bg-emerald-900/50 text-emerald-600 dark:text-emerald-400 mr-3">
              <IconPalette size={20} />
            </div>
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
              Personnalisation
            </h2>
          </div>

          <p className="text-sm text-slate-600 dark:text-slate-300 mb-4">
            Organisez votre bibliothèque selon vos préférences
          </p>

          <button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-1.5 px-3 rounded-lg text-sm transition-colors">
            Paramètres
          </button>
        </div>
      </div>
    </div>
  );
}

export default FavoritesBento;
