import React, { useEffect, useState } from 'react';
import ScoreCard, { ScoreSummary } from '@/components/cards/ScoreCard';
import { getFilteredSessions } from '@/lib/actions/history-actions';
import { Spinner } from '@/components/ui/spinner';
import { IconClock, IconChevronRight } from '@tabler/icons-react';
import { useRouter } from 'next/navigation';

interface RecentSessionsByModeProps {
  songTitle: string;
  songComposer: string;
  mode: 'learning' | 'game';
  limit?: number;
}

const PAGE_SIZE = 3;

export default function RecentSessionsByMode({
  songTitle,
  songComposer,
  mode,
  limit = PAGE_SIZE,
}: RecentSessionsByModeProps) {
  const [sessions, setSessions] = useState<ScoreSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState<number>(0);
  const router = useRouter();

  // Fonction pour aller vers l'historique avec filtres préremplis
  const handleViewAllSessions = () => {
    const params = new URLSearchParams();
    params.set('search', songTitle);
    params.set('composer', songComposer);
    params.set('mode', mode);
    router.push(`/performances?tab=history&${params.toString()}`);
  };

  // Fonction pour charger les sessions (page 1 = 3, page 2 = 6, etc)
  const fetchSessions = async (newPage: number) => {
    if (loadingMore) return;
    if (newPage === 1) setLoading(true);
    else setLoadingMore(true);
    setError(null);
    try {
      const filters = {
        searchQuery: songTitle,
        modeFilter: mode,
        onlyCompleted: false,
        dateStart: undefined,
        dateEnd: undefined,
      };
      // On demande toujours une session de plus pour savoir s'il y en a vraiment plus à charger
      const pagination = { limit: newPage * PAGE_SIZE + 1, offset: 0 };
      const { success, data, error } = await getFilteredSessions(
        filters,
        pagination
      );
      if (success) {
        // Filtrer côté client par titre ET compositeur
        const filtered = data.filter(
          (s) =>
            s.songTitle === songTitle &&
            (s.songComposer || '').toLowerCase().trim() ===
              songComposer.toLowerCase().trim()
        );
        setSessions(filtered.slice(0, newPage * PAGE_SIZE));
        setHasMore(filtered.length > newPage * PAGE_SIZE);
        setTotal(filtered.length); // Le total affiché est le nombre filtré
      } else {
        setError(error || 'Erreur lors du chargement des sessions');
      }
    } catch (err) {
      setError('Erreur lors du chargement des sessions');
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  useEffect(() => {
    setPage(1);
    fetchSessions(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [songTitle, songComposer, mode]);

  const handleLoadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    fetchSessions(nextPage);
  };

  return (
    <div className="bg-white/3 shadow-md rounded-2xl mb-6 p-5 border border-slate-200/10 dark:border-slate-700/10 mt-8">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <IconClock
            size={20}
            className={
              mode === 'learning' ? 'text-indigo-400' : 'text-orange-400'
            }
          />
          <h2 className="text-lg font-semibold text-white ml-2">
            Sessions récentes{' '}
            {mode === 'learning' ? 'en apprentissage' : 'en mode jeu'}
          </h2>
        </div>
        <button
          onClick={handleViewAllSessions}
          className={`text-xs cursor-pointer ${
            mode === 'learning'
              ? 'text-indigo-400 hover:text-indigo-300'
              : 'text-orange-400 hover:text-orange-300'
          } font-medium flex items-center relative hover:after:w-[calc(100%-1rem)] after:absolute after:bottom-0 after:left-0 after:h-px after:bg-current after:transition-all after:duration-300 after:ease-out after:w-0`}
        >
          Voir toutes les sessions
          <IconChevronRight size={14} className="ml-1" />
        </button>
      </div>
      {loading ? (
        <div className="flex justify-center items-center py-8">
          <Spinner variant="bars" size={32} className="text-white" />
        </div>
      ) : error ? (
        <div className="text-center py-8 text-red-400">{error}</div>
      ) : sessions.length === 0 ? (
        <div className="text-center py-8 text-white/70">
          Aucune session trouvée
        </div>
      ) : (
        <>
          <div className="mb-4 text-sm text-white/70">
            {sessions.length} session{sessions.length > 1 ? 's' : ''} affichée
            {sessions.length > 1 ? 's' : ''}
            {total > sessions.length && (
              <span className="ml-2 text-white/50">sur {total} total</span>
            )}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {sessions.map((score) => (
              <ScoreCard key={score.id} score={score} />
            ))}
          </div>
          {hasMore && (
            <div className="flex justify-center mt-6">
              <button
                onClick={handleLoadMore}
                disabled={loadingMore}
                className={`flex cursor-pointer items-center px-4 py-2 text-sm font-medium ${
                  mode === 'learning'
                    ? 'text-indigo-400 hover:text-indigo-300'
                    : 'text-orange-400 hover:text-orange-300'
                } disabled:opacity-50 disabled:cursor-not-allowed relative after:absolute after:bottom-2.5 after:left-4 after:h-px after:bg-current after:w-0 ${
                  !loadingMore
                    ? 'hover:after:w-[calc(100%-3.2rem)] after:transition-all after:duration-300 after:ease-out'
                    : 'after:transition-none'
                }`}
              >
                {loadingMore ? (
                  <>
                    <Spinner
                      variant="bars"
                      size={32}
                      className="text-white mr-2"
                    />
                    Chargement...
                  </>
                ) : (
                  <>
                    Voir plus de sessions
                    <IconChevronRight size={16} className="ml-1" />
                  </>
                )}
              </button>
            </div>
          )}
          {!hasMore && sessions.length > 0 && (
            <div className="text-center py-8 text-white/50 text-sm">
              ✨ Toutes les sessions ont été chargées
            </div>
          )}
        </>
      )}
    </div>
  );
}
