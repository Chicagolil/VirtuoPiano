'use client';

import React, { useEffect, useState } from 'react';

import {
  IconStar,
  IconClock,
  IconBook,
  IconChevronRight,
  IconTargetArrow,
  IconMusic,
  IconUsers,
  IconTrendingUp,
} from '@tabler/icons-react';
import * as Separator from '@radix-ui/react-separator';
import ProgressBar from '@/components/ProgressBar';
import AchievementsCard from '@/components/cards/AchievementsCard';
import UserAvatar from '@/components/badge/UserAvatar';
import ScoreCard from '@/components/cards/ScoreCard';
import { ScoreSummary } from '@/components/cards/ScoreCard';
import { PieChartCard } from '@/components/cards/PieChartCard';
import { getSongsPropertyRepertory } from '@/lib/actions/generalStats-actions';
import { getRecentSessions } from '@/lib/actions/history-actions';
import { PIE_CHART_COLORS } from '@/common/constants/generalStats';
import PracticeTimeTile from './PracticeTimeTile';
import StartedSongsTile from './StartedSongsTile';
import { Spinner } from '@/components/ui/spinner';
import { useRouter } from 'next/navigation';

const achievements = [
  {
    id: 1,
    title: 'Virtuose Débutant',
    description: 'Jouez 10 morceaux avec une précision de 80% ou plus',
    progress: 70,
    icon: <IconStar size={22} />,
    colorClass: 'text-amber-500',
  },
  {
    id: 2,
    title: 'Marathon Musical',
    description: 'Pratiquez pendant 5 heures en une semaine',
    progress: 85,
    icon: <IconClock size={22} />,
    colorClass: 'text-emerald-500',
  },
  {
    id: 3,
    title: 'Précision Parfaite',
    description: 'Obtenez 100% de précision sur un morceau complet',
    progress: 30,
    icon: <IconTargetArrow size={22} />,
    colorClass: 'text-indigo-500',
  },
];

export default function GeneralStats({
  onTabChange,
}: {
  onTabChange?: (tab: string) => void;
}) {
  const [genreData, setGenreData] = useState<{ name: string; value: number }[]>(
    []
  );
  const [composerData, setComposerData] = useState<
    { name: string; value: number }[]
  >([]);
  const [difficultyData, setDifficultyData] = useState<
    { name: string; value: number }[]
  >([]);
  const [recentScores, setRecentScores] = useState<ScoreSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [scoresLoading, setScoresLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [scoresError, setScoresError] = useState<string | null>(null);
  const [hasMoreSessions, setHasMoreSessions] = useState(true);

  const router = useRouter();

  const loadMoreSessions = async () => {
    try {
      setLoadingMore(true);
      const currentCount = recentScores.length;
      const { success, data, error } = await getRecentSessions(
        currentCount + 3
      );
      if (success) {
        setRecentScores(data);
        // Si on reçoit moins de 3 nouvelles sessions, il n'y a plus de sessions à charger
        if (data.length <= currentCount) {
          setHasMoreSessions(false);
        }
        setScoresError(null);
      } else {
        setScoresError(
          error || 'Erreur lors du chargement des sessions supplémentaires'
        );
      }
    } catch (err) {
      setScoresError('Erreur lors du chargement des sessions supplémentaires');
    } finally {
      setLoadingMore(false);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const { success, data, error } = await getSongsPropertyRepertory();
        if (success) {
          setGenreData(data.genre);
          setComposerData(data.composer);
          setDifficultyData(data.difficulty);
          setError(null);
        } else {
          setError(error || 'Erreur inconnue');
        }
      } catch (err) {
        setError('Erreur lors du chargement des données');
      } finally {
        setLoading(false);
      }
    };

    const fetchRecentSessions = async () => {
      try {
        setScoresLoading(true);
        const { success, data, error } = await getRecentSessions(3);
        if (success) {
          setRecentScores(data);
          // Si on reçoit moins de 3 sessions, il n'y a plus de sessions à charger
          if (data.length < 3) {
            setHasMoreSessions(false);
          }
          setScoresError(null);
        } else {
          setScoresError(
            error || 'Erreur lors du chargement des sessions récentes'
          );
        }
      } catch (err) {
        setScoresError('Erreur lors du chargement des sessions récentes');
      } finally {
        setScoresLoading(false);
      }
    };

    fetchData();
    fetchRecentSessions();
  }, []);

  return (
    <div className="max-w-full mx-auto p-4 px-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <PieChartCard
          title="Répertoire par genre"
          icon={<IconMusic size={20} className="text-purple-400" />}
          data={genreData}
          colors={PIE_CHART_COLORS}
          showLabels={true}
          maxCategories={5}
          minPercentage={10}
          loading={loading}
          error={error}
        />
        <PieChartCard
          title="Répertoire par compositeur"
          icon={<IconUsers size={20} className="text-emerald-400" />}
          data={composerData}
          colors={PIE_CHART_COLORS}
          showLabels={true}
          maxCategories={5}
          minPercentage={10}
          loading={loading}
          error={error}
        />
        <PieChartCard
          title="Répertoire par difficulté"
          icon={<IconTrendingUp size={20} className="text-amber-400" />}
          data={difficultyData}
          colors={PIE_CHART_COLORS}
          showLabels={true}
          maxCategories={5}
          minPercentage={10}
          loading={loading}
          error={error}
        />
      </div>
      <div className="grid grid-cols-2 gap-4 mb-6">
        <PracticeTimeTile />
        <StartedSongsTile />
      </div>
      <div className="bg-white/3 shadow-md rounded-2xl mb-6 p-5 border border-slate-200/10 dark:border-slate-700/10">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-white flex items-center">
            <IconClock size={20} className="mr-2 text-indigo-400" />
            Sessions récentes
          </h2>
          <button
            onClick={() => onTabChange?.('history')}
            className="text-xs cursor-pointer text-indigo-400 hover:text-indigo-300 font-medium flex items-center relative hover:after:w-[calc(100%-1rem)] after:absolute after:bottom-0 after:left-0 after:h-px after:bg-current after:transition-all after:duration-300 after:ease-out after:w-0"
          >
            Voir l'historique complet
            <IconChevronRight size={14} className="ml-1" />
          </button>
        </div>

        {scoresLoading ? (
          <div className="flex justify-center items-center py-8">
            <Spinner variant="bars" size={32} className="text-white" />
          </div>
        ) : scoresError ? (
          <div className="text-center py-8">
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 mb-4 max-w-md mx-auto">
              <p className="text-red-600 dark:text-red-400 mb-4">
                Erreur lors du chargement des sessions récentes
              </p>
              <button
                onClick={loadMoreSessions}
                disabled={loadingMore}
                className="inline-flex cursor-pointer items-center px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 dark:bg-red-500 dark:hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed rounded-md transition-colors"
              >
                Réessayer
                <IconChevronRight size={16} className="ml-1" />
              </button>
            </div>
          </div>
        ) : recentScores.length === 0 ? (
          <div className="text-center py-8 text-white/70">
            Aucune session récente trouvée
          </div>
        ) : (
          <>
            <div className="grid cursor-pointer grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {recentScores.map((score) => (
                <ScoreCard
                  key={score.id}
                  score={score}
                  onClick={() =>
                    router.push(`/performances/session/${score.id}`)
                  }
                />
              ))}
            </div>

            {hasMoreSessions && (
              <div className="flex justify-center mt-6">
                <button
                  onClick={loadMoreSessions}
                  disabled={loadingMore}
                  className={`flex cursor-pointer items-center px-4 py-2 text-sm font-medium text-indigo-400 hover:text-indigo-300 disabled:opacity-50 disabled:cursor-not-allowed relative after:absolute after:bottom-2.5 after:left-4 after:h-px after:bg-current after:w-0 ${
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
          </>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Carte avec Avatar et progression */}
        <div className="bg-white/3 shadow-md rounded-2xl p-5 border border-slate-200/10 dark:border-slate-700/10">
          <div className="flex items-start space-x-3">
            <UserAvatar name="Jean Dupont" />
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-white">Jean Dupont</h3>
              <p className="text-sm text-white/70">Niveau intermédiaire</p>
            </div>
          </div>

          <div className="mt-4 space-y-3">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-white/70">Progression niveau</span>
                <span className="text-white font-medium">68%</span>
              </div>
              <ProgressBar value={68} max={100} />
            </div>

            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-white/70">Objectif hebdomadaire</span>
                <span className="text-white font-medium">5h / 7h</span>
              </div>
              <ProgressBar value={5} max={7} className="h-2.5" />
            </div>
          </div>

          <Separator.Root className="h-px bg-white/20 my-4" />

          <div className="flex justify-between items-center">
            <span className="text-sm text-white/70">4 jours consécutifs</span>
            <button className="text-indigo-400 hover:text-indigo-300 text-sm font-medium">
              Profil complet
            </button>
          </div>
        </div>
        <AchievementsCard achievements={achievements} />
      </div>
    </div>
  );
}
