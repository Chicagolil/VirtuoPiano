import React, { useEffect, useState } from 'react';
import ScoreCard, { ScoreSummary } from '@/components/cards/ScoreCard';
import { getFilteredSessions } from '@/lib/actions/history-actions';
import { Spinner } from '@/components/ui/spinner';
import { IconClock } from '@tabler/icons-react';

interface RecentSessionsByModeProps {
  songTitle: string;
  songComposer: string;
  mode: 'learning' | 'game';
  limit?: number;
}

export default function RecentSessionsByMode({
  songTitle,
  songComposer,
  mode,
  limit = 3,
}: RecentSessionsByModeProps) {
  const [sessions, setSessions] = useState<ScoreSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSessions = async () => {
      setLoading(true);
      setError(null);
      try {
        const filters = {
          searchQuery: songTitle,
          modeFilter: mode,
          onlyCompleted: false,
          dateStart: undefined,
          dateEnd: undefined,
        };
        const pagination = { limit: 10, offset: 0 }; // On prend un peu plus large pour filtrer ensuite
        const { success, data, error } = await getFilteredSessions(
          filters,
          pagination
        );
        if (success) {
          // On filtre côté client pour ne garder que les sessions du bon titre ET compositeur
          setSessions(
            data
              .filter(
                (s) =>
                  s.songTitle === songTitle &&
                  (s.songComposer || '').toLowerCase().trim() ===
                    songComposer.toLowerCase().trim()
              )
              .slice(0, limit)
          );
        } else {
          setError(error || 'Erreur lors du chargement des sessions');
        }
      } catch (err) {
        setError('Erreur lors du chargement des sessions');
      } finally {
        setLoading(false);
      }
    };
    fetchSessions();
  }, [songTitle, songComposer, mode, limit]);

  return (
    <div className="bg-white/3 shadow-md rounded-2xl mb-6 p-5 border border-slate-200/10 dark:border-slate-700/10">
      <div className="flex items-center mb-4">
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {sessions.map((score) => (
            <ScoreCard key={score.id} score={score} />
          ))}
        </div>
      )}
    </div>
  );
}
