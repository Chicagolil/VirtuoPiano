'use client';

import React, { useState, useRef, useEffect, useTransition } from 'react';
import {
  IconMusic,
  IconHeart,
  IconClockHour3,
  IconPlayerPlay,
  IconSearch,
  IconFilter,
  IconChevronLeft,
  IconChevronRight,
} from '@tabler/icons-react';

import styles from './SongList.module.css';
import DifficultyBadge from '@/components/DifficultyBadge';
import SongTypeBadge from '@/components/SongTypeBadge';
import { castMsToMin } from '@/common/utils/function';
import { SongList } from '@/lib/services/songs';
import { toggleFavorite } from '@/lib/actions/songs';
import { toast } from 'react-hot-toast';

// Props pour le composant
interface SongsListProps {
  songs: SongList[];
}

export function SongsList({ songs }: SongsListProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<string | null>(null);
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [sortBy, setSortBy] = useState<
    'title' | 'composer' | 'duration' | 'difficulty' | 'SongType'
  >('title');
  const [isFilterMenuOpen, setIsFilterMenuOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const songsPerPage = 20;
  const [isPending, startTransition] = useTransition();
  const [localSongs, setLocalSongs] = useState<SongList[]>(songs);

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

  // Réinitialiser la page courante lorsque les filtres changent
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, activeFilter, sortBy, sortOrder]);

  // Mettre à jour les chansons locales lorsque les props changent
  useEffect(() => {
    setLocalSongs(songs);
  }, [songs]);

  // Fonction pour gérer le clic sur le bouton favori
  const handleFavoriteClick = (
    songId: string,
    currentFavoriteState: boolean
  ) => {
    setLocalSongs((prevSongs) =>
      prevSongs.map((song) =>
        song.id === songId
          ? { ...song, isFavorite: !currentFavoriteState }
          : song
      )
    );

    // Appeler l'action serveur
    startTransition(async () => {
      try {
        const result = await toggleFavorite(songId);

        if (result.success) {
          toast.success(result.message);
        } else {
          // En cas d'échec, revenir à l'état précédent
          setLocalSongs((prevSongs) =>
            prevSongs.map((song) =>
              song.id === songId
                ? { ...song, isFavorite: currentFavoriteState }
                : song
            )
          );
          toast.error(result.message);
        }
      } catch (error) {
        console.error('Erreur lors de la modification des favoris:', error);
        // En cas d'erreur, revenir à l'état précédent
        setLocalSongs((prevSongs) =>
          prevSongs.map((song) =>
            song.id === songId
              ? { ...song, isFavorite: currentFavoriteState }
              : song
          )
        );
        toast.error(
          'Une erreur est survenue lors de la modification des favoris'
        );
      }
    });
  };

  // Filtrer et trier les chansons
  const filteredSongs = localSongs
    .filter((song) => {
      const matchesSearch =
        song.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (song.composer?.toLowerCase() || '').includes(
          searchQuery.toLowerCase()
        );

      const matchesFilter =
        !activeFilter ||
        song.genre === activeFilter ||
        (activeFilter === 'Favoris' && song.isFavorite);

      return matchesSearch && matchesFilter;
    })
    .sort((a, b) => {
      if (sortBy === 'title') {
        return sortOrder === 'asc'
          ? a.title.localeCompare(b.title)
          : b.title.localeCompare(a.title);
      } else if (sortBy === 'composer') {
        const composerA = a.composer || '';
        const composerB = b.composer || '';
        return sortOrder === 'asc'
          ? composerA.localeCompare(composerB)
          : composerB.localeCompare(composerA);
      } else if (sortBy === 'duration') {
        return sortOrder === 'asc'
          ? a.duration_ms - b.duration_ms
          : b.duration_ms - a.duration_ms;
      } else if (sortBy === 'difficulty') {
        return sortOrder === 'asc' ? a.Level - b.Level : b.Level - a.Level;
      }
      return 0;
    });

  // Calculer les indices de début et de fin pour la pagination
  const indexOfLastSong = currentPage * songsPerPage;
  const indexOfFirstSong = indexOfLastSong - songsPerPage;
  const currentSongs = filteredSongs.slice(indexOfFirstSong, indexOfLastSong);
  const totalPages = Math.ceil(filteredSongs.length / songsPerPage);

  // Fonctions de navigation
  const goToNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const goToPreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  // Création des filtres disponibles
  // Extraire les genres uniques des chansons
  const uniqueGenres = Array.from(
    new Set(localSongs.filter((song) => song.genre).map((song) => song.genre))
  ).sort();

  // Créer les filtres de base + les filtres de genre dynamiques
  const availableFilters = [
    { id: 'all', label: 'Tous' },
    { id: 'Favoris', label: 'Favoris' },
    ...uniqueGenres.map((genre) => ({ id: genre, label: genre })),
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
    <div className={`${styles.container} ${styles.pageWidth}`}>
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

        {/* Filtres actifs */}
        {activeFilter && (
          <div className={styles.activeFilters}>
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
          </div>
        )}

        {/* Nombre de morceaux */}
        <div className={`${styles.songCount} `}>
          {filteredSongs.length} morceau
          {filteredSongs.length !== 1 ? 'x' : ''}
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
                  <button className={styles.sortButton}>Type </button>
                </th>
                <th
                  className={`${styles.tableHeaderCell} ${styles.hideOnMobile}`}
                >
                  <button className={styles.sortButton}>Difficulté</button>
                </th>
                <th
                  className={`${styles.tableHeaderCell} ${styles.hideOnMobile}`}
                >
                  <button
                    className={styles.sortButton}
                    onClick={() => handleSort('duration')}
                  >
                    Durée
                    {sortBy === 'duration' && (sortOrder === 'asc' ? '↑' : '↓')}
                  </button>
                </th>

                <th className={styles.tableHeaderCell}></th>
              </tr>
            </thead>
            <tbody className={styles.tableBody}>
              {currentSongs.map((song) => (
                <tr key={song.id} className={styles.tableRow}>
                  <td className={styles.tableCell}>
                    <button
                      className={`${styles.favoriteButton} ${
                        song.isFavorite ? styles.favoriteButtonActive : ''
                      }`}
                      onClick={() =>
                        handleFavoriteClick(song.id, song.isFavorite)
                      }
                      disabled={isPending}
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

                        {song.lastPlayed && (
                          <div className={styles.songLastPlayed}>Joué le</div>
                        )}
                      </div>
                    </div>
                  </td>
                  <td
                    className={`${styles.tableCell} ${styles.hideOnMobile} ${styles.songComposer}`}
                  >
                    {song.composer}
                  </td>
                  <td className={`${styles.tableCell} ${styles.hideOnMobile}`}>
                    <SongTypeBadge songType={song.SongType} />
                  </td>
                  <td className={styles.tableCell}>
                    <DifficultyBadge difficulty={song.Level} />
                  </td>
                  <td className={`${styles.tableCell} ${styles.hideOnMobile}`}>
                    <div className={styles.durationContainer}>
                      <IconClockHour3
                        size={16}
                        className={styles.durationIcon}
                      />
                      {castMsToMin(song.duration_ms)}
                    </div>
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

        {/* Pagination */}
        {filteredSongs.length > 0 && (
          <div className={styles.paginationContainer}>
            <div className={styles.paginationControls}>
              <button
                className={`${styles.paginationButton} ${
                  currentPage === 1 ? styles.paginationButtonDisabled : ''
                }`}
                onClick={goToPreviousPage}
                disabled={currentPage === 1}
              >
                <IconChevronLeft size={20} />
              </button>
              <div className={styles.paginationPageInfo}>
                Page {currentPage} sur {totalPages}
              </div>
              <button
                className={`${styles.paginationButton} ${
                  currentPage === totalPages
                    ? styles.paginationButtonDisabled
                    : ''
                }`}
                onClick={goToNextPage}
                disabled={currentPage === totalPages}
              >
                <IconChevronRight size={20} />
              </button>
            </div>
          </div>
        )}

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
