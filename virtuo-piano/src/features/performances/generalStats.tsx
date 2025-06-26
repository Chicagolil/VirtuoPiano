'use client';

import React, { useEffect, useState } from 'react';

import {
  IconStar,
  IconClock,
  IconBook,
  IconChevronRight,
  IconTargetArrow,
} from '@tabler/icons-react';
import * as Separator from '@radix-ui/react-separator';
import ProgressBar from '@/components/ProgressBar';
import InfoTile from '@/components/tiles/Infotile';
import AchievementsCard from '@/components/cards/AchievementsCard';
import UserAvatar from '@/components/badge/UserAvatar';
import ScoreCard from '@/components/cards/ScoreCard';
import { ScoreSummary } from '@/components/cards/ScoreCard';
import { PieChartCard } from '@/components/cards/PieChartCard';
import { getSongsPropertyRepertory } from '@/lib/actions/generalStats-actions';
import { PIE_CHART_COLORS } from '@/common/constants/generalStats';
import PracticeTimeTile from './PracticeTimeTile';
import StartedSongsTile from './StartedSongsTile';

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

const recentScores: ScoreSummary[] = [
  {
    id: '1',
    songTitle: 'Nocturne Op. 9 No. 2',
    songComposer: 'Frédéric Chopin',
    correctNotes: 342,
    missedNotes: 18,
    wrongNotes: 24,
    totalPoints: 4850,
    maxMultiplier: 4,
    maxCombo: 78,
    playedAt: "Aujourd'hui, 14:30",
    mode: 'game',
    accuracy: 89,
    duration: '4:12',
    thumbnail: '/images/songs/nocturne.jpg',
    progress: 100,
    tempo: 120,
    level: 3,
  },
  {
    id: '2',
    songTitle: 'Clair de Lune',
    songComposer: 'Claude Debussy',
    correctNotes: 278,
    missedNotes: 12,
    wrongNotes: 16,
    totalPoints: 3750,
    maxMultiplier: 3,
    maxCombo: 56,
    playedAt: 'Hier, 19:15',
    mode: 'learning',
    accuracy: 91,
    duration: '5:05',
    thumbnail: '/images/songs/clairdelune.jpg',
    progress: 73,
    tempo: 110,
    level: 3,
  },
  {
    id: '3',
    songTitle: 'Sonate au Clair de Lune',
    songComposer: 'Ludwig van Beethoven',
    correctNotes: 186,
    missedNotes: 28,
    wrongNotes: 32,
    totalPoints: 2200,
    maxMultiplier: 2,
    maxCombo: 42,
    playedAt: 'Il y a 3 jours',
    mode: 'game',
    accuracy: 76,
    duration: '3:45',
    progress: 65,
    tempo: 125,
    level: 4,
  },
  {
    id: '4',
    songTitle: 'Gymnopédie No. 1',
    songComposer: 'Erik Satie',
    correctNotes: 154,
    missedNotes: 8,
    wrongNotes: 12,
    totalPoints: 2800,
    maxMultiplier: 3,
    maxCombo: 64,
    playedAt: 'Il y a 5 jours',
    mode: 'learning',
    accuracy: 88,
    duration: '2:58',
    progress: 100,
    tempo: 100,
    level: 2,
  },
  {
    id: '5',
    songTitle: 'Prélude en C Majeur',
    songComposer: 'J.S. Bach',
    correctNotes: 208,
    missedNotes: 4,
    wrongNotes: 8,
    totalPoints: 3100,
    maxMultiplier: 4,
    maxCombo: 72,
    playedAt: 'Il y a 1 semaine',
    mode: 'game',
    accuracy: 95,
    duration: '2:40',
    progress: 100,
    tempo: 118,
    level: 2,
  },
];

export default function GeneralStats() {
  const [genreData, setGenreData] = useState<{ name: string; value: number }[]>(
    []
  );
  const [composerData, setComposerData] = useState<
    { name: string; value: number }[]
  >([]);
  const [difficultyData, setDifficultyData] = useState<
    { name: string; value: number }[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
    fetchData();
  }, []);

  return (
    <div className="w-full p-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <PieChartCard
          title="Répertoire par genre"
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
      <div className="bg-white dark:bg-slate-800 shadow-md rounded-2xl mb-6 p-5 border border-slate-200 dark:border-slate-700">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white flex items-center">
            <IconClock size={20} className="mr-2 text-indigo-500" />
            Sessions récentes
          </h2>
          <button className="text-xs text-indigo-600 dark:text-indigo-400 font-medium hover:underline flex items-center">
            Voir l'historique complet
            <IconChevronRight size={14} className="ml-1" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {recentScores.slice(0, 5).map((score) => (
            <ScoreCard key={score.id} score={score} />
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Carte avec Avatar et progression */}
        <div className="bg-white dark:bg-slate-800 shadow-md rounded-2xl p-5 border border-slate-200 dark:border-slate-700">
          <div className="flex items-start space-x-3">
            <UserAvatar name="Jean Dupont" />
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                Jean Dupont
              </h3>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Niveau intermédiaire
              </p>
            </div>
          </div>

          <div className="mt-4 space-y-3">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-slate-500 dark:text-slate-400">
                  Progression niveau
                </span>
                <span className="text-slate-700 dark:text-slate-300 font-medium">
                  68%
                </span>
              </div>
              <ProgressBar value={68} max={100} />
            </div>

            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-slate-500 dark:text-slate-400">
                  Objectif hebdomadaire
                </span>
                <span className="text-slate-700 dark:text-slate-300 font-medium">
                  5h / 7h
                </span>
              </div>
              <ProgressBar value={5} max={7} className="h-2.5" />
            </div>
          </div>

          <Separator.Root className="h-px bg-slate-200 dark:bg-slate-700 my-4" />

          <div className="flex justify-between items-center">
            <span className="text-sm text-slate-500 dark:text-slate-400">
              4 jours consécutifs
            </span>
            <button className="text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300 text-sm font-medium">
              Profil complet
            </button>
          </div>
        </div>
        <AchievementsCard achievements={achievements} />
      </div>
    </div>
  );
}
