'use client';

import React, { useState, useRef, useEffect } from 'react';
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

import type { Songs } from '@prisma/client';

import styles from './SongList.module.css';
import ProgressBar from '@/components/ProgressBar';
import DifficultyBadge from '@/components/DifficultyBadge';
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
  songs: Songs[];
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

export function SongsList({ songs }: SongsListProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<string | null>(null);
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [sortBy, setSortBy] = useState<
    'title' | 'composer' | 'duration' | 'difficulty'
  >('title');
  const [isFilterMenuOpen, setIsFilterMenuOpen] = useState(false);

  const filterMenuRef = useRef<HTMLDivElement>(null);

  const [filterMenuPosition, setFilterMenuPosition] = useState<
    'top' | 'bottom'
  >('bottom');

  // Fonction pour calculer la position du menu
  const calculateMenuPosition = (
    buttonRef: React.RefObject<HTMLDivElement | null>,
    setPosition: (position: 'top' | 'bottom') => void
  ) => {
    if (buttonRef.current) {
      const buttonRect = buttonRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      const spaceBelow = windowHeight - buttonRect.bottom;
      const spaceAbove = buttonRect.top;
      const menuHeight = 150;

      setPosition(
        spaceBelow < menuHeight && spaceAbove > spaceBelow ? 'top' : 'bottom'
      );
    }
  };

  // Mise à jour des positions lors de l'ouverture des menus
  useEffect(() => {
    if (isFilterMenuOpen) {
      calculateMenuPosition(filterMenuRef, setFilterMenuPosition);
    }
  }, [isFilterMenuOpen]);

  // Gestion du clic en dehors des menus
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        filterMenuRef.current &&
        !filterMenuRef.current.contains(event.target as Node)
      ) {
        setIsFilterMenuOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

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

  return (
    <div className={`${styles.container} `}>
      <div className={styles.content}>
        <h2 className={styles.title}>Bibliothèque de chansons</h2>

        {/* Barre de recherche et filtres */}
        <div className={styles.searchContainer}>
          <div className={styles.searchWrapper}>
            <div className={styles.searchIcon}>
              <IconSearch size={18} />
            </div>
            <input
              type="text"
              placeholder="Rechercher par titre ou compositeur..."
              className={styles.searchInput}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className={styles.filtersContainer}>
            <div className="relative" ref={filterMenuRef}>
              <button
                className={styles.filterButton}
                onClick={() => setIsFilterMenuOpen(!isFilterMenuOpen)}
              >
                <IconFilter size={20} />
              </button>
              {isFilterMenuOpen && (
                <div
                  className={`${styles.filterMenu} ${
                    filterMenuPosition === 'top'
                      ? styles.filterMenuTop
                      : styles.filterMenuBottom
                  }`}
                >
                  {availableFilters.map((filter) => (
                    <button
                      key={filter.id}
                      className={`${styles.filterOption} ${
                        (filter.id === 'all' && !activeFilter) ||
                        activeFilter === filter.id
                          ? styles.filterOptionActive
                          : ''
                      }`}
                      onClick={() => {
                        setActiveFilter(filter.id === 'all' ? null : filter.id);
                        setIsFilterMenuOpen(false);
                      }}
                    >
                      {filter.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Filtres actifs et statistiques */}
        <div className={styles.activeFilters}>
          {activeFilter && (
            <div className={styles.activeFilter}>
              <span>
                {availableFilters.find((f) => f.id === activeFilter)?.label}
              </span>
              <button
                className={styles.removeFilter}
                onClick={() => setActiveFilter(null)}
              >
                ×
              </button>
            </div>
          )}
          <div className={styles.songCount}>
            {filteredSongs.length} morceau
            {filteredSongs.length !== 1 ? 'x' : ''}
          </div>
        </div>

        {/* Tableau des chansons */}
        <div className={styles.tableContainer}>
          <table className={styles.table}>
            <thead className={styles.tableHeader}>
              <tr>
                <th className={styles.tableHeaderCell}></th>
                <th className={styles.tableHeaderCell}>
                  <button
                    className={styles.sortButton}
                    onClick={() => handleSort('title')}
                  >
                    Titre{' '}
                    {sortBy === 'title' && (sortOrder === 'asc' ? '↑' : '↓')}
                  </button>
                </th>
                <th
                  className={`${styles.tableHeaderCell} ${styles.hideOnMobile}`}
                >
                  <button
                    className={styles.sortButton}
                    onClick={() => handleSort('composer')}
                  >
                    Compositeur{' '}
                    {sortBy === 'composer' && (sortOrder === 'asc' ? '↑' : '↓')}
                  </button>
                </th>
                <th
                  className={`${styles.tableHeaderCell} ${styles.hideOnMobile}`}
                >
                  <button
                    className={styles.sortButton}
                    onClick={() => handleSort('difficulty')}
                  >
                    Difficulté{' '}
                    {sortBy === 'difficulty' &&
                      (sortOrder === 'asc' ? '↑' : '↓')}
                  </button>
                </th>
                <th
                  className={`${styles.tableHeaderCell} ${styles.hideOnMobile}`}
                >
                  <button
                    className={styles.sortButton}
                    onClick={() => handleSort('duration')}
                  >
                    Durée{' '}
                    {sortBy === 'duration' && (sortOrder === 'asc' ? '↑' : '↓')}
                  </button>
                </th>
                <th
                  className={`${styles.tableHeaderCell} ${styles.hideOnMobile}`}
                >
                  Progression
                </th>
                <th className={styles.tableHeaderCell}></th>
              </tr>
            </thead>
            <tbody className={styles.tableBody}>
              {filteredSongs.map((song) => (
                <tr key={song.id} className={styles.tableRow}>
                  <td className={styles.tableCell}>
                    <button
                      className={`${styles.favoriteButton} ${
                        song.isFavorite ? styles.favoriteButtonActive : ''
                      }`}
                    >
                      <IconHeart
                        size={20}
                        fill={song.isFavorite ? 'currentColor' : 'none'}
                      />
                    </button>
                  </td>
                  <td className={styles.tableCell}>
                    <div className={styles.songInfo}>
                      <div className={styles.songIcon}>
                        {song.imageUrl ? (
                          <img
                            src={song.imageUrl}
                            alt={song.title}
                            className="h-10 w-10 rounded object-cover"
                          />
                        ) : (
                          <IconMusic
                            size={20}
                            className={styles.songIconText}
                          />
                        )}
                      </div>
                      <div className={styles.songDetails}>
                        <div className={styles.songTitle}>{song.title}</div>
                        <div
                          className={`${styles.songComposer} ${styles.hideOnMobile}`}
                        >
                          {song.composer}
                        </div>
                        {song.lastPlayed && (
                          <div className={styles.songLastPlayed}>
                            Joué {song.lastPlayed}
                          </div>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className={`${styles.tableCell} ${styles.hideOnMobile}`}>
                    {song.composer}
                  </td>
                  <td className={`${styles.tableCell} ${styles.hideOnMobile}`}>
                    <DifficultyBadge difficulty={1} />
                  </td>
                  <td className={`${styles.tableCell} ${styles.hideOnMobile}`}>
                    <div className={styles.durationContainer}>
                      <IconClockHour3
                        size={16}
                        className={styles.durationIcon}
                      />
                      {song.duration}
                    </div>
                  </td>
                  <td className={styles.tableCell}>
                    <ProgressBar value={song.progress} />
                  </td>
                  <td className={styles.tableCell}>
                    <button className={styles.playButton}>
                      <IconPlayerPlay size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* État vide */}
        {filteredSongs.length === 0 && (
          <div className={styles.emptyState}>
            <div className={styles.emptyIcon}>
              <IconMusic size={32} className={styles.emptyIconText} />
            </div>
            <h3 className={styles.emptyTitle}>Aucun morceau trouvé</h3>
            <p className={styles.emptyDescription}>
              Aucun morceau ne correspond à vos critères de recherche. Essayez
              de modifier vos filtres ou votre recherche.
            </p>
            <button
              className={styles.resetButton}
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
