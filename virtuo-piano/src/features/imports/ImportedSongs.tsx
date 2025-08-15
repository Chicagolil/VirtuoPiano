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

import styles from '../library/SongList.module.css';
import DifficultyBadge from '@/components/DifficultyBadge';
import SongTypeBadge from '@/components/SongTypeBadge';
import { castMsToMin } from '@/common/utils/function';
import { toggleFavorite } from '@/lib/actions/songs';
import { toast } from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import { Spinner } from '@/components/ui/spinner';
import { useImportedSongs, useAllGenres } from '@/customHooks/useImportedSongs';
import { convertMidiToSongFormat } from '@/common/utils/function';

export default function ImportedSongs() {
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<string | null>(null);
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [sortBy, setSortBy] = useState<
    'title' | 'composer' | 'duration' | 'difficulty'
  >('title');
  const [isFilterMenuOpen, setIsFilterMenuOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [isPending, startTransition] = useTransition();
  const [isDebugModalOpen, setIsDebugModalOpen] = useState(false);
  const [debugResult, setDebugResult] = useState<any>(null);
  const [debugError, setDebugError] = useState<string | null>(null);
  const filterMenuRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const [filterMenuPosition, setFilterMenuPosition] = useState<
    'top' | 'bottom'
  >('bottom');

  // Utilisation du custom hook React Query pour la gestion du cache
  const {
    data: importedSongsData,
    isLoading,
    error,

    invalidateAndRefetch,
  } = useImportedSongs({
    page: currentPage,
    search: debouncedSearchQuery.trim() || undefined,
    genre:
      activeFilter && activeFilter !== 'Favoris' ? activeFilter : undefined,
    favorites: activeFilter === 'Favoris',
    sortBy,
    sortOrder,
  });

  // Hook pour charger tous les genres
  const { allGenres } = useAllGenres();

  // Debounce pour la recherche
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
    }, 300); // 300ms de délai

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Valeurs par défaut si pas de données
  const safeImportedSongsData = importedSongsData || {
    songs: [],
    pagination: {
      currentPage: 1,
      totalPages: 0,
      totalSongs: 0,
      hasNextPage: false,
      hasPreviousPage: false,
    },
  };

  // Afficher les erreurs avec toast
  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

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
    if (currentPage !== 1) {
      setCurrentPage(1);
    }
  }, [debouncedSearchQuery, activeFilter, sortBy, sortOrder]);

  // Fonction pour gérer le clic sur le bouton favori
  const handleFavoriteClick = (
    songId: string,
    currentFavoriteState: boolean
  ) => {
    // Appeler l'action serveur
    startTransition(async () => {
      try {
        const result = await toggleFavorite(songId);

        if (result.success) {
          toast.success(result.message);
          // Recharger les données pour refléter le changement
          invalidateAndRefetch();
        } else {
          toast.error(result.message);
        }
      } catch (error) {
        console.error('Erreur lors de la modification des favoris:', error);
        toast.error(
          'Une erreur est survenue lors de la modification des favoris'
        );
      }
    });
  };

  const handleSongClick = (songId: string) => {
    router.push(`/performances/${songId}`);
  };

  // Les chansons sont déjà filtrées côté serveur
  const filteredSongs = safeImportedSongsData.songs;

  // Fonctions de navigation
  const goToNextPage = () => {
    if (safeImportedSongsData.pagination.hasNextPage) {
      setCurrentPage(currentPage + 1);
    }
  };

  const goToPreviousPage = () => {
    if (safeImportedSongsData.pagination.hasPreviousPage) {
      setCurrentPage(currentPage - 1);
    }
  };

  // Création des filtres disponibles à partir de tous les genres
  const availableFilters = [
    { id: 'all', label: 'Tous' },
    { id: 'Favoris', label: 'Favoris' },
    ...allGenres.map((genre) => ({ id: genre, label: genre })),
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

  // Fonction de debug pour tester la conversion MIDI
  const handleDebugMidi = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setDebugError(null);
      setDebugResult(null);
      setIsDebugModalOpen(true);

      const result = await convertMidiToSongFormat(file);
      setDebugResult(result);
    } catch (error) {
      setDebugError(error instanceof Error ? error.message : 'Erreur inconnue');
    }
  };

  return (
    <div className="w-full">
      <div className="space-y-4">
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

        {/* Nombre de morceaux avec indicateur de cache */}
        <div
          className={`${styles.songCount} flex items-center justify-between`}
        >
          <div>
            {safeImportedSongsData.pagination.totalSongs} morceau
            {safeImportedSongsData.pagination.totalSongs !== 1 ? 'x' : ''}{' '}
            importé
            {safeImportedSongsData.pagination.totalSongs !== 1 ? 's' : ''}
          </div>

          {/* Bouton de debug MIDI */}
          <div className="flex items-center space-x-2">
            <input
              type="file"
              accept=".mid,.midi"
              onChange={handleDebugMidi}
              className="hidden"
              id="debug-midi-input"
            />
            <label
              htmlFor="debug-midi-input"
              className="px-3 py-1 bg-orange-500/20 hover:bg-orange-500/30 text-orange-300 text-xs rounded-lg cursor-pointer transition-colors duration-200 border border-orange-500/30"
            >
              🎹 Test MIDI
            </label>
          </div>
        </div>

        {/* Tableau des chansons */}
        <div className={`${styles.tableContainer}`}>
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
              {isLoading ? (
                <tr>
                  <td colSpan={7} className="text-center py-12">
                    <div className="flex justify-center items-center">
                      <Spinner
                        variant="bars"
                        size={32}
                        className="text-white"
                      />
                    </div>
                  </td>
                </tr>
              ) : (
                filteredSongs.map((song) => (
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
                    <td
                      className={styles.tableCell}
                      style={{ cursor: 'pointer' }}
                      onClick={() => handleSongClick(song.id)}
                    >
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
                        <div
                          className={styles.songDetails}
                          style={{ textAlign: 'left' }}
                        >
                          <div className={styles.songTitle}>{song.title}</div>
                          {song.lastPlayed && (
                            <div className={styles.songLastPlayed}>
                              Joué le{' '}
                              {new Date(song.lastPlayed).toLocaleDateString(
                                'fr-FR',
                                {
                                  year: 'numeric',
                                  month: 'long',
                                  day: 'numeric',
                                }
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td
                      className={`${styles.tableCell} ${styles.hideOnMobile} ${styles.songComposer}`}
                      style={{ textAlign: 'left' }}
                    >
                      {song.composer}
                    </td>
                    <td
                      className={`${styles.tableCell} ${styles.hideOnMobile}`}
                    >
                      <SongTypeBadge songType={song.SongType} />
                    </td>
                    <td className={styles.tableCell}>
                      <DifficultyBadge difficulty={song.Level} />
                    </td>
                    <td
                      className={`${styles.tableCell} ${styles.hideOnMobile}`}
                    >
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
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {(safeImportedSongsData.pagination.totalSongs > 0 || isLoading) && (
          <div className={styles.paginationContainer}>
            <div className={styles.paginationControls}>
              <button
                className={`${styles.paginationButton} ${
                  !safeImportedSongsData.pagination.hasPreviousPage || isLoading
                    ? styles.paginationButtonDisabled
                    : ''
                }`}
                onClick={goToPreviousPage}
                disabled={
                  !safeImportedSongsData.pagination.hasPreviousPage || isLoading
                }
              >
                <IconChevronLeft size={20} />
              </button>
              <div className={styles.paginationPageInfo}>
                {isLoading
                  ? 'Chargement...'
                  : `Page ${safeImportedSongsData.pagination.currentPage} sur ${safeImportedSongsData.pagination.totalPages}`}
              </div>
              <button
                className={`${styles.paginationButton} ${
                  !safeImportedSongsData.pagination.hasNextPage || isLoading
                    ? styles.paginationButtonDisabled
                    : ''
                }`}
                onClick={goToNextPage}
                disabled={
                  !safeImportedSongsData.pagination.hasNextPage || isLoading
                }
              >
                <IconChevronRight size={20} />
              </button>
            </div>
          </div>
        )}

        {/* État vide */}
        {!isLoading && safeImportedSongsData.pagination.totalSongs === 0 && (
          <div className={styles.emptyState}>
            <div className={styles.emptyIcon}>
              <IconMusic size={32} className={styles.emptyIconText} />
            </div>
            <h3 className={styles.emptyTitle}>
              {debouncedSearchQuery || activeFilter
                ? 'Aucune chanson trouvée.'
                : 'Aucune chanson importée'}
            </h3>
            <p className={styles.emptyDescription}>
              {debouncedSearchQuery || activeFilter
                ? 'Aucune chanson ne correspond à vos critères de recherche. Essayez de modifier vos filtres ou votre recherche.'
                : "Vous n'avez encore importé aucune chanson. Commencez à importer pour voir vos chansons ici !"}
            </p>
            {debouncedSearchQuery || activeFilter ? (
              <button
                className={styles.resetButton}
                onClick={() => {
                  setSearchQuery('');
                  setActiveFilter(null);
                }}
              >
                Réinitialiser les filtres
              </button>
            ) : null}
          </div>
        )}
      </div>

      {/* Modale de debug MIDI */}
      {isDebugModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-800/95 backdrop-blur-md rounded-2xl border border-white/10 shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            {/* En-tête de la modale */}
            <div className="bg-gradient-to-r from-orange-500/20 via-red-500/20 to-pink-500/20 p-6 rounded-t-2xl">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-orange-500/30 to-red-500/30 rounded-lg flex items-center justify-center">
                    <span className="text-orange-300 text-xl">🎹</span>
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-white">
                      Debug - Conversion MIDI
                    </h2>
                    <p className="text-white/70 text-sm">
                      Résultat de la conversion du fichier MIDI
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setIsDebugModalOpen(false)}
                  className="w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors duration-200"
                >
                  <span className="text-white text-lg">×</span>
                </button>
              </div>
            </div>

            {/* Contenu de la modale */}
            <div className="p-6">
              {debugError ? (
                <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4">
                  <h3 className="text-red-300 font-semibold mb-2">
                    ❌ Erreur de conversion
                  </h3>
                  <p className="text-red-200 text-sm">{debugError}</p>
                </div>
              ) : debugResult ? (
                <div className="space-y-6">
                  {/* Informations générales */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-white/5 rounded-lg p-4">
                      <h3 className="text-white/80 text-sm font-medium mb-2">
                        Tempo
                      </h3>
                      <p className="text-white text-lg font-semibold">
                        {debugResult.tempo} BPM
                      </p>
                    </div>
                    <div className="bg-white/5 rounded-lg p-4">
                      <h3 className="text-white/80 text-sm font-medium mb-2">
                        Signature rythmique
                      </h3>
                      <p className="text-white text-lg font-semibold">
                        {debugResult.timeSignature}
                      </p>
                    </div>
                    <div className="bg-white/5 rounded-lg p-4">
                      <h3 className="text-white/80 text-sm font-medium mb-2">
                        Durée
                      </h3>
                      <p className="text-white text-lg font-semibold">
                        {Math.round(debugResult.duration_ms / 1000)}s
                      </p>
                    </div>
                  </div>

                  {/* Informations sur les tracks */}
                  <div className="bg-white/5 rounded-lg p-4">
                    <h3 className="text-white/80 text-sm font-medium mb-3">
                      Informations sur les tracks
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm mb-4">
                      <div>
                        <span className="text-white/60">
                          Tracks originales:
                        </span>
                        <span className="text-white ml-2 font-semibold">
                          {debugResult.originalTracksCount}
                        </span>
                      </div>
                      <div>
                        <span className="text-white/60">Tracks uniques:</span>
                        <span className="text-white ml-2 font-semibold">
                          {debugResult.uniqueTracksCount}
                        </span>
                      </div>
                    </div>
                    {debugResult.originalTracksCount >
                      debugResult.uniqueTracksCount && (
                      <div className="bg-orange-500/10 border border-orange-500/20 rounded-lg p-3">
                        <p className="text-orange-300 text-sm">
                          🧹{' '}
                          {debugResult.originalTracksCount -
                            debugResult.uniqueTracksCount}{' '}
                          track(s) en double supprimée(s)
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Statistiques des notes */}
                  <div className="bg-white/5 rounded-lg p-4">
                    <h3 className="text-white/80 text-sm font-medium mb-3">
                      Statistiques des notes
                    </h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                      <div>
                        <span className="text-white/60">Total notes:</span>
                        <span className="text-white ml-2 font-semibold">
                          {debugResult.notes.length}
                        </span>
                      </div>
                      <div>
                        <span className="text-white/60">Notes uniques:</span>
                        <span className="text-white ml-2 font-semibold">
                          {
                            new Set(debugResult.notes.map((n: any) => n.note))
                              .size
                          }
                        </span>
                      </div>
                      <div>
                        <span className="text-white/60">Vélocité max:</span>
                        <span className="text-white ml-2 font-semibold">
                          {Math.max(
                            ...debugResult.notes.map((n: any) => n.velocity)
                          )}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Aperçu des notes */}
                  <div className="bg-white/5 rounded-lg p-4">
                    <h3 className="text-white/80 text-sm font-medium mb-3">
                      Aperçu des notes (premières 20)
                    </h3>
                    <div className="bg-slate-900/50 rounded-lg p-3 max-h-60 overflow-y-auto">
                      <pre className="text-xs text-green-300 font-mono">
                        {JSON.stringify(
                          debugResult.notes.slice(0, 20),
                          null,
                          2
                        )}
                      </pre>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-center py-12">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-300"></div>
                  <span className="text-white/60 ml-3">
                    Conversion en cours...
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
