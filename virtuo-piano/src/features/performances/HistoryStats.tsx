'use client';

import React, {
  useEffect,
  useState,
  useCallback,
  useRef,
  useMemo,
} from 'react';
import { IconClock, IconSearch, IconFilter } from '@tabler/icons-react';
import ScoreCard from '@/components/cards/ScoreCard';
import { ScoreSummary } from '@/components/cards/ScoreCard';
import { getFilteredSessions } from '@/lib/actions/history-actions';
import { Spinner } from '@/components/ui/spinner';

const SESSIONS_PER_PAGE = 30;

// Types pour le cache
type CacheKey = string;
type CacheEntry = {
  sessions: ScoreSummary[];
  total: number;
  lastOffset: number;
  hasMore: boolean;
  timestamp: Date;
};

export default function HistoryStats() {
  const [allScores, setAllScores] = useState<ScoreSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [dateFilter, setDateFilter] = useState('all');
  const [customStartDate, setCustomStartDate] = useState('');
  const [customEndDate, setCustomEndDate] = useState('');
  const [showDateFilters, setShowDateFilters] = useState(false);
  const [modeFilter, setModeFilter] = useState<'all' | 'learning' | 'game'>(
    'all'
  );
  const [onlyCompleted, setOnlyCompleted] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [total, setTotal] = useState(0);
  const [currentOffset, setCurrentOffset] = useState(0);

  // Cache côté client
  const [sessionsCache, setSessionsCache] = useState<Map<CacheKey, CacheEntry>>(
    new Map()
  );

  // Ref pour détecter le scroll
  const observerRef = useRef<IntersectionObserver | null>(null);
  const loadMoreRef = useRef<HTMLDivElement | null>(null);

  // Générer la clé de cache basée sur les filtres actuels
  const cacheKey = useMemo(() => {
    const filters = {
      search: searchQuery.trim(),
      mode: modeFilter,
      completed: modeFilter === 'learning' ? onlyCompleted : false,
      dateFilter,
      startDate: dateFilter === 'custom' ? customStartDate : '',
      endDate: dateFilter === 'custom' ? customEndDate : '',
    };
    return JSON.stringify(filters);
  }, [
    searchQuery,
    modeFilter,
    onlyCompleted,
    dateFilter,
    customStartDate,
    customEndDate,
  ]);

  // Fonction pour vider le cache (utile pour le refresh manuel)
  const clearCache = useCallback(() => {
    setSessionsCache(new Map());
  }, []);

  // Fonction pour réinitialiser tous les filtres
  const resetAllFilters = () => {
    setSearchQuery('');
    setDateFilter('all');
    setCustomStartDate('');
    setCustomEndDate('');
    setModeFilter('all');
    setOnlyCompleted(false);
    setShowDateFilters(false);
    // Le cache se mettra à jour automatiquement avec la nouvelle clé
  };

  // Fonction pour charger les sessions avec cache intelligent
  const loadSessions = useCallback(
    async (reset = false) => {
      try {
        const currentCacheEntry = sessionsCache.get(cacheKey);

        // Si on reset ou qu'on n'a pas de cache, on recommence depuis le début
        if (reset) {
          setLoading(true);
          setCurrentOffset(0);
          setAllScores([]);
        } else {
          setLoadingMore(true);
        }

        // Calculer l'offset réel
        const targetOffset = reset ? 0 : currentOffset;

        // Vérifier si on a déjà les données en cache
        if (currentCacheEntry && !reset) {
          // Si on demande des données qu'on a déjà en cache
          const cachedSessionsCount = currentCacheEntry.sessions.length;
          if (targetOffset < cachedSessionsCount) {
            // On a les données en cache, les utiliser
            const sessionsByOffset = currentCacheEntry.sessions.slice(
              0,
              targetOffset + SESSIONS_PER_PAGE
            );
            setAllScores(sessionsByOffset);
            setTotal(currentCacheEntry.total);
            setHasMore(sessionsByOffset.length < currentCacheEntry.total);
            setCurrentOffset(sessionsByOffset.length);
            setError(null);
            setLoading(false);
            setLoadingMore(false);
            return;
          }
        }

        // Construire les filtres pour l'action serveur
        const filters = {
          searchQuery: searchQuery.trim() || undefined,
          modeFilter,
          onlyCompleted: modeFilter === 'learning' ? onlyCompleted : false,
          dateStart: dateFilter === 'custom' ? customStartDate : undefined,
          dateEnd: dateFilter === 'custom' ? customEndDate : undefined,
        };

        const pagination = {
          limit: SESSIONS_PER_PAGE,
          offset: targetOffset,
        };

        const {
          success,
          data,
          hasMore: newHasMore,
          total: newTotal,
          error,
        } = await getFilteredSessions(filters, pagination);

        if (success) {
          // Mettre à jour le cache
          const existingCacheEntry = sessionsCache.get(cacheKey);
          let updatedSessions: ScoreSummary[];

          if (reset || !existingCacheEntry) {
            // Nouveau cache ou reset
            updatedSessions = data;
          } else {
            // Ajouter aux données existantes
            updatedSessions = [...existingCacheEntry.sessions, ...data];
          }

          // Créer la nouvelle entrée de cache
          const newCacheEntry: CacheEntry = {
            sessions: updatedSessions,
            total: newTotal,
            lastOffset: targetOffset + data.length,
            hasMore: newHasMore,
            timestamp: new Date(),
          };

          // Mettre à jour le cache (garder seulement les 5 dernières recherches pour éviter une surcharge mémoire)
          setSessionsCache((prevCache) => {
            const newCache = new Map(prevCache);
            newCache.set(cacheKey, newCacheEntry);

            // Limiter la taille du cache à 5 entrées
            if (newCache.size > 5) {
              const oldestKey = Array.from(newCache.keys())[0];
              newCache.delete(oldestKey);
            }

            return newCache;
          });

          // Mettre à jour l'état
          if (reset) {
            setAllScores(updatedSessions);
            setCurrentOffset(updatedSessions.length);
          } else {
            setAllScores((prev) => [...prev, ...data]);
            setCurrentOffset((prev) => prev + data.length);
          }

          setHasMore(newHasMore);
          setTotal(newTotal);
          setError(null);
        } else {
          setError(error || 'Erreur lors du chargement des sessions');
        }
      } catch (err) {
        setError('Erreur lors du chargement des sessions');
      } finally {
        setLoading(false);
        setLoadingMore(false);
      }
    },
    [
      cacheKey,
      sessionsCache,
      searchQuery,
      dateFilter,
      customStartDate,
      customEndDate,
      modeFilter,
      onlyCompleted,
      currentOffset,
    ]
  );

  // Configurer l'Intersection Observer pour le scroll infini
  useEffect(() => {
    if (observerRef.current) {
      observerRef.current.disconnect();
    }

    observerRef.current = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting && hasMore && !loading && !loadingMore) {
          loadSessions(false);
        }
      },
      {
        threshold: 0.1,
        rootMargin: '100px', // Commencer le chargement 100px avant d'atteindre le bas
      }
    );

    if (loadMoreRef.current) {
      observerRef.current.observe(loadMoreRef.current);
    }

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [hasMore, loading, loadingMore, loadSessions]);

  // Effet pour charger depuis le cache ou faire une nouvelle requête quand les filtres changent
  useEffect(() => {
    const currentCacheEntry = sessionsCache.get(cacheKey);

    if (currentCacheEntry) {
      // On a les données en cache, les utiliser immédiatement
      const cachedSessions = currentCacheEntry.sessions.slice(
        0,
        SESSIONS_PER_PAGE
      );
      setAllScores(cachedSessions);
      setTotal(currentCacheEntry.total);
      setHasMore(cachedSessions.length < currentCacheEntry.total);
      setCurrentOffset(cachedSessions.length);
      setError(null);
      setLoading(false);
    } else {
      // Pas de cache, charger avec debounce pour la recherche textuelle
      if (searchQuery.trim()) {
        const timeoutId = setTimeout(() => {
          loadSessions(true);
        }, 300); // Debounce pour la recherche

        return () => clearTimeout(timeoutId);
      } else {
        // Chargement immédiat pour les filtres non-textuels
        loadSessions(true);
      }
    }
  }, [cacheKey, sessionsCache, searchQuery]);

  // Charger les sessions au début
  useEffect(() => {
    loadSessions(true);
  }, []);

  return (
    <div className="max-w-full mx-auto p-4 px-8">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-white flex items-center">
          <IconClock size={20} className="mr-2 text-indigo-400" />
          Toutes les sessions
          {/* Indicateur de cache pour debug */}
          {sessionsCache.has(cacheKey) && (
            <span className="ml-2 text-xs text-green-400 opacity-50">📋</span>
          )}
        </h2>

        {/* Bouton pour vider le cache (pour debug/test) */}
        <button
          onClick={() => {
            clearCache();
            loadSessions(true);
          }}
          className="text-xs text-white/50 hover:text-white/70 transition-colors"
          title="Actualiser les données"
        >
          🔄 Actualiser
        </button>
      </div>

      {/* Barre de recherche */}
      <div className="mb-6">
        <div className="flex gap-4 items-center">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <IconSearch size={20} className="text-white/50" />
            </div>
            <input
              type="text"
              placeholder="Rechercher par nom de musique ou d'artiste..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
            />
          </div>

          {/* Bouton filtre de date */}
          <button
            onClick={() => setShowDateFilters(!showDateFilters)}
            className={`px-4 py-3 rounded-lg border transition-all flex items-center gap-2 ${
              dateFilter !== 'all'
                ? 'bg-indigo-500/20 border-indigo-500/50 text-indigo-300'
                : 'bg-white/10 border-white/20 text-white/70 hover:bg-white/20'
            }`}
          >
            <IconFilter size={18} />
            <span className="hidden sm:inline">Filtrer par date</span>
          </button>
        </div>

        {/* Panneau des filtres de date */}
        {showDateFilters && (
          <div className="mt-4 p-4 bg-white/5 rounded-lg border border-white/10">
            <div className="flex flex-col gap-4">
              {/* Filtres rapides - première ligne */}
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => {
                    setDateFilter('all');
                    setCustomStartDate('');
                    setCustomEndDate('');
                  }}
                  className={`px-3 py-1.5 rounded-md text-sm transition-colors ${
                    dateFilter === 'all'
                      ? 'bg-indigo-500 text-white'
                      : 'bg-white/10 text-white/70 hover:bg-white/20'
                  }`}
                >
                  Toutes
                </button>
              </div>

              {/* Dates personnalisées - deuxième ligne */}
              <div className="flex items-center gap-2">
                <span className="text-white/70 text-sm">
                  Période personnalisée:
                </span>
                <input
                  type="date"
                  value={customStartDate}
                  onChange={(e) => {
                    setCustomStartDate(e.target.value);
                    setDateFilter('custom');
                  }}
                  className="px-3 py-1.5 bg-white/10 border border-white/20 rounded-md text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <span className="text-white/50">à</span>
                <input
                  type="date"
                  value={customEndDate}
                  onChange={(e) => {
                    setCustomEndDate(e.target.value);
                    setDateFilter('custom');
                  }}
                  className="px-3 py-1.5 bg-white/10 border border-white/20 rounded-md text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Filtres avancés */}
      <div className="mb-6 flex flex-col gap-2 items-start">
        {/* Filtre par mode */}
        <div className="flex gap-2 items-center">
          <span className="text-white/70 text-sm">Mode :</span>
          <button
            onClick={() => setModeFilter('all')}
            className={`px-3 py-1.5 rounded-md text-sm transition-colors ${
              modeFilter === 'all'
                ? 'bg-indigo-500 text-white'
                : 'bg-white/10 text-white/70 hover:bg-white/20'
            }`}
          >
            Tous
          </button>
          <button
            onClick={() => setModeFilter('learning')}
            className={`px-3 py-1.5 rounded-md text-sm transition-colors ${
              modeFilter === 'learning'
                ? 'bg-indigo-500 text-white'
                : 'bg-white/10 text-white/70 hover:bg-white/20'
            }`}
          >
            Apprentissage
          </button>
          <button
            onClick={() => setModeFilter('game')}
            className={`px-3 py-1.5 rounded-md text-sm transition-colors ${
              modeFilter === 'game'
                ? 'bg-indigo-500 text-white'
                : 'bg-white/10 text-white/70 hover:bg-white/20'
            }`}
          >
            Jeu
          </button>
        </div>
        {/* Filtre chansons terminées */}
        {modeFilter === 'learning' && (
          <div className="mt-2">
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <span className="text-white/70 text-sm">
                Chansons terminées (90%+)
              </span>
              <span className="relative inline-block w-10 h-6">
                <input
                  type="checkbox"
                  checked={onlyCompleted}
                  onChange={() => setOnlyCompleted((v) => !v)}
                  className="sr-only peer"
                />
                <span
                  className={`
                    absolute left-0 top-0 w-12 h-6 rounded-full transition
                    ${onlyCompleted ? 'bg-indigo-500' : 'bg-white/20'}
                  `}
                ></span>
                <span
                  className={`
                    absolute top-1 left-1 w-4 h-4 rounded-full bg-white transition
                    peer-checked:translate-x-2
                    ${onlyCompleted ? 'shadow-lg' : ''}
                  `}
                  style={{
                    transform: onlyCompleted
                      ? 'translateX(16px)'
                      : 'translateX(0)',
                  }}
                >
                  {onlyCompleted && (
                    <svg
                      className="w-4 h-4 text-indigo-600"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={2}
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  )}
                </span>
              </span>
            </label>
          </div>
        )}
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-8">
          <Spinner variant="bars" size={32} className="text-white" />
        </div>
      ) : error ? (
        <div className="text-center py-8">
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 mb-4 max-w-md mx-auto">
            <p className="text-red-600 dark:text-red-400 mb-4">{error}</p>
            <button
              onClick={() => loadSessions(true)}
              className="inline-flex cursor-pointer items-center px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 dark:bg-red-500 dark:hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed rounded-md transition-colors"
            >
              Réessayer
            </button>
          </div>
        </div>
      ) : allScores.length === 0 ? (
        <div className="text-center py-8">
          <div className="text-white/70 mb-4">
            {total === 0
              ? 'Aucune session trouvée dans votre historique'
              : 'Aucune session ne correspond à vos critères de recherche'}
          </div>
          {total === 0 && (
            <button
              onClick={resetAllFilters}
              className="inline-flex cursor-pointer items-center px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-md transition-colors"
            >
              Réinitialiser tous les filtres
            </button>
          )}
        </div>
      ) : (
        <>
          <div className="mb-4 text-sm text-white/70">
            {allScores.length} session
            {allScores.length > 1 ? 's' : ''} affichée
            {allScores.length > 1 ? 's' : ''}
            {total > allScores.length && (
              <span className="ml-2 text-white/50">sur {total} total</span>
            )}
          </div>
          <div className="grid cursor-pointer grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {allScores.map((score) => (
              <ScoreCard key={score.id} score={score} />
            ))}
          </div>

          {/* Zone de détection pour le scroll infini */}
          {hasMore && (
            <div
              ref={loadMoreRef}
              className="flex justify-center items-center py-8"
            >
              {loadingMore && (
                <div className="flex items-center text-white/70">
                  <Spinner
                    variant="bars"
                    size={24}
                    className="text-white mr-2"
                  />
                  Chargement des sessions suivantes...
                </div>
              )}
            </div>
          )}

          {/* Indicateur de fin */}
          {!hasMore && allScores.length > 0 && (
            <div className="text-center py-8 text-white/50 text-sm">
              ✨ Toutes les sessions ont été chargées
            </div>
          )}
        </>
      )}
    </div>
  );
}
