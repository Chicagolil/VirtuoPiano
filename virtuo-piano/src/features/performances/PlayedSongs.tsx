'use client';

import React, {
  useState,
  useRef,
  useEffect,
  useTransition,
  useMemo,
  useCallback,
} from 'react';
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
import {
  getPlayedSongsAction,
  getAllPlayedSongsAction,
  PlayedSongsResult,
} from '@/lib/actions/playedSongs-actions';
import { toggleFavorite } from '@/lib/actions/songs';
import { toast } from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import { Spinner } from '@/components/ui/spinner';

// Types pour le cache
type CacheKey = string;
type CacheEntry = {
  data: PlayedSongsResult;
  timestamp: Date;
};

export default function PlayedSongs() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<string | null>(null);
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [sortBy, setSortBy] = useState<
    'title' | 'composer' | 'duration' | 'difficulty' | 'lastPlayed'
  >('lastPlayed');
  const [isFilterMenuOpen, setIsFilterMenuOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [isPending, startTransition] = useTransition();
  const [isLoading, setIsLoading] = useState(true);
  const [playedSongsData, setPlayedSongsData] = useState<PlayedSongsResult>({
    songs: [],
    pagination: {
      currentPage: 1,
      totalPages: 0,
      totalSongs: 0,
      hasNextPage: false,
      hasPreviousPage: false,
    },
  });
  const [allGenres, setAllGenres] = useState<string[]>([]);

  // Cache côté client
  const [songsCache, setSongsCache] = useState<Map<CacheKey, CacheEntry>>(
    new Map()
  );

  const filterMenuRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const initialLoadRef = useRef(false);
  const [filterMenuPosition, setFilterMenuPosition] = useState<
    'top' | 'bottom'
  >('bottom');

  // Générer la clé de cache basée sur les filtres actuels
  const cacheKey = useMemo(() => {
    const filters = {
      search: searchQuery.trim(),
      page: currentPage,
      genre: activeFilter && activeFilter !== 'Favoris' ? activeFilter : '',
      favorites: activeFilter === 'Favoris',
      sortBy,
      sortOrder,
    };
    return JSON.stringify(filters);
  }, [searchQuery, currentPage, activeFilter, sortBy, sortOrder]);

  // Fonction pour vider le cache (utile pour le refresh manuel)
  const clearCache = useCallback(() => {
    setSongsCache(new Map());
  }, []);

  // Fonction pour charger les chansons jouées avec cache intelligent
  const loadPlayedSongs = useCallback(
    async (forceRefresh = false) => {
      try {
        // Vérifier si on a les données en cache
        const currentCacheEntry = songsCache.get(cacheKey);

        if (currentCacheEntry && !forceRefresh) {
          // On a les données en cache, les utiliser immédiatement
          setPlayedSongsData(currentCacheEntry.data);
          setIsLoading(false);
          return;
        }

        setIsLoading(true);

        const result = await getPlayedSongsAction(
          currentPage,
          searchQuery || undefined,
          activeFilter && activeFilter !== 'Favoris' ? activeFilter : undefined,
          activeFilter === 'Favoris',
          sortBy,
          sortOrder
        );

        setPlayedSongsData(result);

        // Mettre à jour le cache
        const newCacheEntry: CacheEntry = {
          data: result,
          timestamp: new Date(),
        };

        setSongsCache((prevCache) => {
          const newCache = new Map(prevCache);
          newCache.set(cacheKey, newCacheEntry);

          // Limiter la taille du cache à 10 entrées
          if (newCache.size > 10) {
            const oldestKey = Array.from(newCache.keys())[0];
            newCache.delete(oldestKey);
          }

          return newCache;
        });
      } catch (error) {
        console.error('Erreur lors du chargement des chansons jouées:', error);
        toast.error('Erreur lors du chargement des chansons jouées');
      } finally {
        setIsLoading(false);
      }
    },
    [
      cacheKey,
      songsCache,
      currentPage,
      searchQuery,
      activeFilter,
      sortBy,
      sortOrder,
    ]
  );

  // Charger tous les genres au montage pour les filtres
  useEffect(() => {
    const loadAllGenres = async () => {
      try {
        const allSongs = await getAllPlayedSongsAction();
        const uniqueGenres = Array.from(
          new Set(
            allSongs
              .filter((song) => song.genre)
              .map((song) => song.genre)
              .filter((genre): genre is string => genre !== null)
          )
        ).sort();
        setAllGenres(uniqueGenres);
      } catch (error) {
        console.error('Erreur lors du chargement des genres:', error);
      }
    };
    loadAllGenres();
  }, []);

  // Effet pour charger depuis le cache ou faire une nouvelle requête quand les filtres changent
  useEffect(() => {
    const currentCacheEntry = songsCache.get(cacheKey);

    if (currentCacheEntry) {
      // On a les données en cache, les utiliser immédiatement
      setPlayedSongsData(currentCacheEntry.data);
      setIsLoading(false);
    } else {
      // Pas de cache, charger avec debounce pour la recherche textuelle
      if (searchQuery.trim()) {
        const timer = setTimeout(() => {
          loadPlayedSongs();
        }, 300); // Délai de 300ms pour la recherche

        return () => clearTimeout(timer);
      } else {
        // Chargement immédiat pour les filtres non-textuels
        loadPlayedSongs();
      }
    }
  }, [cacheKey, songsCache, searchQuery, loadPlayedSongs]);

  // Chargement initial unique
  useEffect(() => {
    if (!initialLoadRef.current) {
      initialLoadRef.current = true;
      loadPlayedSongs();
    }
  }, []);

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
  }, [searchQuery, activeFilter, sortBy, sortOrder]);

  // Fonction pour gérer le clic sur le bouton favori
  const handleFavoriteClick = (
    songId: string,
    currentFavoriteState: boolean
  ) => {
    // Mise à jour optimiste de l'état local
    setPlayedSongsData((prevData) => ({
      ...prevData,
      songs: prevData.songs.map((song) =>
        song.id === songId
          ? { ...song, isFavorite: !currentFavoriteState }
          : song
      ),
    }));

    // Appeler l'action serveur
    startTransition(async () => {
      try {
        const result = await toggleFavorite(songId);

        if (result.success) {
          toast.success(result.message);
        } else {
          // En cas d'échec, revenir à l'état précédent
          setPlayedSongsData((prevData) => ({
            ...prevData,
            songs: prevData.songs.map((song) =>
              song.id === songId
                ? { ...song, isFavorite: currentFavoriteState }
                : song
            ),
          }));
          toast.error(result.message);
        }
      } catch (error) {
        console.error('Erreur lors de la modification des favoris:', error);
        // En cas d'erreur, revenir à l'état précédent
        setPlayedSongsData((prevData) => ({
          ...prevData,
          songs: prevData.songs.map((song) =>
            song.id === songId
              ? { ...song, isFavorite: currentFavoriteState }
              : song
          ),
        }));
        toast.error(
          'Une erreur est survenue lors de la modification des favoris'
        );
      }
    });
  };

  const handleSongClick = (songId: string) => {
    router.push(`/library/${songId}`);
  };

  // Les chansons sont déjà filtrées côté serveur
  const filteredSongs = playedSongsData.songs;

  // Fonctions de navigation
  const goToNextPage = () => {
    if (playedSongsData.pagination.hasNextPage) {
      setCurrentPage(currentPage + 1);
    }
  };

  const goToPreviousPage = () => {
    if (playedSongsData.pagination.hasPreviousPage) {
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
            {playedSongsData.pagination.totalSongs} morceau
            {playedSongsData.pagination.totalSongs !== 1 ? 'x' : ''} joué
            {playedSongsData.pagination.totalSongs !== 1 ? 's' : ''}
            {/* Indicateur de cache */}
            {songsCache.has(cacheKey) && (
              <span
                className="ml-2 text-xs text-green-400 opacity-50"
                title="Données en cache"
              >
                📋
              </span>
            )}
          </div>

          {/* Bouton pour vider le cache */}
          <button
            onClick={() => {
              clearCache();
              loadPlayedSongs(true);
            }}
            className="text-xs text-white/50 hover:text-white/70 transition-colors ml-4"
            title="Actualiser les données"
          >
            🔄 Actualiser
          </button>
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
                <th className={styles.tableHeaderCell}>
                  <button
                    className={styles.sortButton}
                    onClick={() => handleSort('lastPlayed')}
                  >
                    Dernière lecture
                    {sortBy === 'lastPlayed' &&
                      (sortOrder === 'asc' ? '↑' : '↓')}
                  </button>
                </th>
                <th className={styles.tableHeaderCell}></th>
              </tr>
            </thead>
            <tbody className={styles.tableBody}>
              {isLoading ? (
                <tr>
                  <td colSpan={8} className="text-center py-12">
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
                        <div className={styles.songDetails}>
                          <div className={styles.songTitle}>{song.title}</div>
                        </div>
                      </div>
                    </td>
                    <td
                      className={`${styles.tableCell} ${styles.hideOnMobile} ${styles.songComposer}`}
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
                      <div className={styles.lastPlayedContainer}>
                        {song.lastPlayed && (
                          <div className={styles.songLastPlayed}>
                            {new Date(song.lastPlayed).toLocaleDateString(
                              'fr-FR',
                              {
                                day: '2-digit',
                                month: '2-digit',
                                year: 'numeric',
                              }
                            )}
                          </div>
                        )}
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
        {(playedSongsData.pagination.totalSongs > 0 || isLoading) && (
          <div className={styles.paginationContainer}>
            <div className={styles.paginationControls}>
              <button
                className={`${styles.paginationButton} ${
                  !playedSongsData.pagination.hasPreviousPage || isLoading
                    ? styles.paginationButtonDisabled
                    : ''
                }`}
                onClick={goToPreviousPage}
                disabled={
                  !playedSongsData.pagination.hasPreviousPage || isLoading
                }
              >
                <IconChevronLeft size={20} />
              </button>
              <div className={styles.paginationPageInfo}>
                {isLoading
                  ? 'Chargement...'
                  : `Page ${playedSongsData.pagination.currentPage} sur ${playedSongsData.pagination.totalPages}`}
              </div>
              <button
                className={`${styles.paginationButton} ${
                  !playedSongsData.pagination.hasNextPage || isLoading
                    ? styles.paginationButtonDisabled
                    : ''
                }`}
                onClick={goToNextPage}
                disabled={!playedSongsData.pagination.hasNextPage || isLoading}
              >
                <IconChevronRight size={20} />
              </button>
            </div>
          </div>
        )}

        {/* État vide */}
        {!isLoading && playedSongsData.pagination.totalSongs === 0 && (
          <div className={styles.emptyState}>
            <div className={styles.emptyIcon}>
              <IconMusic size={32} className={styles.emptyIconText} />
            </div>
            <h3 className={styles.emptyTitle}>Aucune chanson jouée</h3>
            <p className={styles.emptyDescription}>
              {searchQuery || activeFilter
                ? 'Aucune chanson ne correspond à vos critères de recherche. Essayez de modifier vos filtres ou votre recherche.'
                : "Vous n'avez encore joué aucune chanson. Commencez à jouer pour voir vos chansons ici !"}
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
