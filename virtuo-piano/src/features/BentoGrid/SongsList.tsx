'use client';

import React, { useState } from 'react';
import {
  IconMusic,
  IconHeart,
  IconClockHour3,
  IconPlayerPlay,
  IconSearch,
  IconFilter,
  IconArrowsSort,
  IconAdjustments,
  IconStar,
} from '@tabler/icons-react';
import * as Progress from '@radix-ui/react-progress';

// Types pour les chansons
interface Song {
  id: string;
  title: string;
  composer: string;
  difficulty: 'Débutant' | 'Intermédiaire' | 'Avancé' | 'Expert';
  duration: string; // Format "MM:SS"
  category: string;
  isFavorite: boolean;
  progress: number; // Pourcentage de 0 à 100
  imageUrl?: string;
  lastPlayed?: string;
}

// Props pour le composant
interface SongsListProps {
  className?: string;
}

// Données de démo
const demoSongs: Song[] = [
  {
    id: '1',
    title: 'Nocturne Op. 9 No. 2',
    composer: 'Frédéric Chopin',
    difficulty: 'Intermédiaire',
    duration: '4:33',
    category: 'Classique',
    isFavorite: true,
    progress: 85,
    imageUrl: '/images/songs/nocturne.jpg',
    lastPlayed: "Aujourd'hui",
  },
  {
    id: '2',
    title: 'Clair de Lune',
    composer: 'Claude Debussy',
    difficulty: 'Intermédiaire',
    duration: '5:12',
    category: 'Classique',
    isFavorite: true,
    progress: 62,
    lastPlayed: 'Hier',
  },
  {
    id: '3',
    title: 'Sonate au Clair de Lune',
    composer: 'Ludwig van Beethoven',
    difficulty: 'Avancé',
    duration: '6:24',
    category: 'Classique',
    isFavorite: false,
    progress: 24,
    lastPlayed: 'Il y a 3 jours',
  },
  {
    id: '4',
    title: 'Prélude en C Majeur',
    composer: 'Johann Sebastian Bach',
    difficulty: 'Débutant',
    duration: '2:45',
    category: 'Baroque',
    isFavorite: false,
    progress: 100,
    lastPlayed: 'Il y a 1 semaine',
  },
  {
    id: '5',
    title: 'Gymnopédie No. 1',
    composer: 'Erik Satie',
    difficulty: 'Débutant',
    duration: '3:05',
    category: 'Classique',
    isFavorite: true,
    progress: 78,
    lastPlayed: 'Il y a 2 jours',
  },
  {
    id: '6',
    title: 'Rêverie',
    composer: 'Claude Debussy',
    difficulty: 'Intermédiaire',
    duration: '4:16',
    category: 'Impressionniste',
    isFavorite: false,
    progress: 0,
  },
  {
    id: '7',
    title: 'La Campanella',
    composer: 'Franz Liszt',
    difficulty: 'Expert',
    duration: '5:50',
    category: 'Classique',
    isFavorite: true,
    progress: 12,
    lastPlayed: 'Il y a 5 jours',
  },
  {
    id: '8',
    title: 'Fantaisie-Impromptu',
    composer: 'Frédéric Chopin',
    difficulty: 'Avancé',
    duration: '5:05',
    category: 'Romantique',
    isFavorite: false,
    progress: 0,
  },
];

// Composant pour les badges de difficulté
function DifficultyBadge({ difficulty }: { difficulty: Song['difficulty'] }) {
  const colorMap = {
    Débutant:
      'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300',
    Intermédiaire:
      'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300',
    Avancé:
      'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300',
    Expert: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300',
  };

  return (
    <span
      className={`text-xs px-2 py-1 rounded-full font-medium ${colorMap[difficulty]}`}
    >
      {difficulty}
    </span>
  );
}

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

export function SongsList({ className }: SongsListProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<string | null>(null);
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [sortBy, setSortBy] = useState<
    'title' | 'composer' | 'duration' | 'difficulty'
  >('title');

  // Filtrer et trier les chansons
  const filteredSongs = demoSongs
    .filter((song) => {
      const matchesSearch =
        song.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        song.composer.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesFilter =
        !activeFilter ||
        song.category === activeFilter ||
        (activeFilter === 'Favoris' && song.isFavorite) ||
        (activeFilter === 'Complétés' && song.progress === 100) ||
        (activeFilter === 'En cours' &&
          song.progress > 0 &&
          song.progress < 100) ||
        (activeFilter === 'Non commencés' && song.progress === 0);

      return matchesSearch && matchesFilter;
    })
    .sort((a, b) => {
      if (sortBy === 'title') {
        return sortOrder === 'asc'
          ? a.title.localeCompare(b.title)
          : b.title.localeCompare(a.title);
      } else if (sortBy === 'composer') {
        return sortOrder === 'asc'
          ? a.composer.localeCompare(b.composer)
          : b.composer.localeCompare(a.composer);
      } else if (sortBy === 'duration') {
        const timeA =
          parseInt(a.duration.split(':')[0]) * 60 +
          parseInt(a.duration.split(':')[1]);
        const timeB =
          parseInt(b.duration.split(':')[0]) * 60 +
          parseInt(b.duration.split(':')[1]);
        return sortOrder === 'asc' ? timeA - timeB : timeB - timeA;
      } else if (sortBy === 'difficulty') {
        const difficultyMap = {
          Débutant: 1,
          Intermédiaire: 2,
          Avancé: 3,
          Expert: 4,
        };
        return sortOrder === 'asc'
          ? difficultyMap[a.difficulty] - difficultyMap[b.difficulty]
          : difficultyMap[b.difficulty] - difficultyMap[a.difficulty];
      }
      return 0;
    });

  // Création des filtres disponibles
  const availableFilters = [
    { id: 'all', label: 'Tous' },
    { id: 'Favoris', label: 'Favoris' },
    { id: 'Complétés', label: 'Complétés' },
    { id: 'En cours', label: 'En cours' },
    { id: 'Non commencés', label: 'Non commencés' },
    { id: 'Classique', label: 'Classique' },
    { id: 'Baroque', label: 'Baroque' },
    { id: 'Romantique', label: 'Romantique' },
    { id: 'Impressionniste', label: 'Impressionniste' },
  ];

  // Gestion du tri
  const handleSort = (column: typeof sortBy) => {
    if (sortBy === column) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(column);
      setSortOrder('asc');
    }
  };

  // Rendu des entêtes de colonnes avec indicateurs de tri
  const renderSortableHeader = (column: typeof sortBy, label: string) => (
    <button
      className="flex items-center text-left font-medium text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
      onClick={() => handleSort(column)}
    >
      {label}
      {sortBy === column && (
        <span className="ml-1">{sortOrder === 'asc' ? '↑' : '↓'}</span>
      )}
    </button>
  );

  return (
    <div
      className={`bg-white dark:bg-slate-800 shadow-md rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-700 ${className}`}
    >
      <div className="p-5">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4">
          Bibliothèque de chansons
        </h2>

        {/* Barre de recherche et filtres */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-grow">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <IconSearch size={18} className="text-slate-400" />
            </div>
            <input
              type="text"
              placeholder="Rechercher par titre ou compositeur..."
              className="pl-10 pr-4 py-2 w-full rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="flex space-x-2">
            <div className="relative group">
              <button className="p-2 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-300 flex items-center justify-center hover:bg-slate-50 dark:hover:bg-slate-600 transition-colors">
                <IconFilter size={20} />
              </button>
              <div className="absolute right-0 top-full mt-2 bg-white dark:bg-slate-800 rounded-lg shadow-lg border border-slate-200 dark:border-slate-700 z-10 p-2 hidden group-hover:block min-w-[160px]">
                {availableFilters.map((filter) => (
                  <button
                    key={filter.id}
                    className={`block w-full px-4 py-2 text-left text-sm rounded-lg transition-colors ${
                      (filter.id === 'all' && !activeFilter) ||
                      activeFilter === filter.id
                        ? 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300'
                        : 'hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300'
                    }`}
                    onClick={() =>
                      setActiveFilter(filter.id === 'all' ? null : filter.id)
                    }
                  >
                    {filter.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="relative group">
              <button className="p-2 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-300 flex items-center justify-center hover:bg-slate-50 dark:hover:bg-slate-600 transition-colors">
                <IconArrowsSort size={20} />
              </button>
              <div className="absolute right-0 top-full mt-2 bg-white dark:bg-slate-800 rounded-lg shadow-lg border border-slate-200 dark:border-slate-700 z-10 p-2 hidden group-hover:block min-w-[160px]">
                {[
                  { id: 'title', label: 'Titre' },
                  { id: 'composer', label: 'Compositeur' },
                  { id: 'duration', label: 'Durée' },
                  { id: 'difficulty', label: 'Difficulté' },
                ].map((column) => (
                  <button
                    key={column.id}
                    className={`block w-full px-4 py-2 text-left text-sm rounded-lg transition-colors ${
                      sortBy === column.id
                        ? 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300'
                        : 'hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300'
                    }`}
                    onClick={() => handleSort(column.id as typeof sortBy)}
                  >
                    {column.label}{' '}
                    {sortBy === column.id && (sortOrder === 'asc' ? '↑' : '↓')}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Filtres actifs et statistiques */}
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center">
            {activeFilter && (
              <div className="flex items-center bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 px-3 py-1 rounded-full text-sm">
                <span>
                  {availableFilters.find((f) => f.id === activeFilter)?.label}
                </span>
                <button
                  className="ml-2 text-indigo-500 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300"
                  onClick={() => setActiveFilter(null)}
                >
                  ×
                </button>
              </div>
            )}
          </div>
          <div className="text-sm text-slate-500 dark:text-slate-400">
            {filteredSongs.length} morceau
            {filteredSongs.length !== 1 ? 'x' : ''}
          </div>
        </div>

        {/* Tableau des chansons */}
        <div className="overflow-x-auto -mx-5">
          <table className="min-w-full">
            <thead className="bg-slate-50 dark:bg-slate-700/50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider w-12"></th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  {renderSortableHeader('title', 'Titre')}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider hidden md:table-cell">
                  {renderSortableHeader('composer', 'Compositeur')}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider hidden md:table-cell">
                  {renderSortableHeader('difficulty', 'Difficulté')}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider hidden md:table-cell">
                  {renderSortableHeader('duration', 'Durée')}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  Progression
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider w-12"></th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-slate-800 divide-y divide-slate-200 dark:divide-slate-700">
              {filteredSongs.map((song) => (
                <tr
                  key={song.id}
                  className="hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors cursor-pointer"
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button
                      className={`text-slate-400 hover:text-amber-500 ${
                        song.isFavorite ? 'text-amber-500' : ''
                      }`}
                    >
                      <IconHeart
                        size={20}
                        fill={song.isFavorite ? 'currentColor' : 'none'}
                      />
                    </button>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <div className="h-10 w-10 flex-shrink-0 rounded bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center mr-3">
                        {song.imageUrl ? (
                          <img
                            src={song.imageUrl}
                            alt={song.title}
                            className="h-10 w-10 rounded object-cover"
                          />
                        ) : (
                          <IconMusic
                            size={20}
                            className="text-indigo-600 dark:text-indigo-400"
                          />
                        )}
                      </div>
                      <div>
                        <div className="text-sm font-medium text-slate-900 dark:text-white">
                          {song.title}
                        </div>
                        <div className="text-xs text-slate-500 dark:text-slate-400 md:hidden">
                          {song.composer}
                        </div>
                        {song.lastPlayed && (
                          <div className="text-xs text-slate-400 dark:text-slate-500 mt-1">
                            Joué {song.lastPlayed}
                          </div>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-700 dark:text-slate-300 hidden md:table-cell">
                    {song.composer}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap hidden md:table-cell">
                    <DifficultyBadge difficulty={song.difficulty} />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-700 dark:text-slate-300 hidden md:table-cell">
                    <div className="flex items-center">
                      <IconClockHour3
                        size={16}
                        className="mr-1 text-slate-400"
                      />
                      {song.duration}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="w-full max-w-xs">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs text-slate-500 dark:text-slate-400">
                          {song.progress === 0
                            ? 'Non commencé'
                            : song.progress === 100
                            ? 'Complété'
                            : `${song.progress}%`}
                        </span>
                        {song.progress === 100 && (
                          <div className="flex items-center text-amber-500">
                            <IconStar size={14} fill="currentColor" />
                            <IconStar size={14} fill="currentColor" />
                            <IconStar size={14} fill="currentColor" />
                          </div>
                        )}
                      </div>
                      <ProgressBar value={song.progress} />
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <button className="p-2 rounded-full bg-indigo-100 hover:bg-indigo-200 dark:bg-indigo-900/30 dark:hover:bg-indigo-800/50 text-indigo-600 dark:text-indigo-400 transition-colors">
                      <IconPlayerPlay size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Aucun résultat */}
        {filteredSongs.length === 0 && (
          <div className="py-12 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-700 mb-4">
              <IconMusic
                size={32}
                className="text-slate-400 dark:text-slate-500"
              />
            </div>
            <h3 className="text-lg font-medium text-slate-900 dark:text-white mb-2">
              Aucun morceau trouvé
            </h3>
            <p className="text-slate-500 dark:text-slate-400 max-w-md mx-auto">
              Aucun morceau ne correspond à vos critères de recherche. Essayez
              de modifier vos filtres ou votre recherche.
            </p>
            <button
              className="mt-4 bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 rounded-lg text-sm font-medium transition-colors"
              onClick={() => {
                setSearchQuery('');
                setActiveFilter(null);
              }}
            >
              Réinitialiser les filtres
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default SongsList;
