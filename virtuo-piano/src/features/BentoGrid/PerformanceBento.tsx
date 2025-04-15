'use client';

import React, { useState } from 'react';
import {
  IconChartBar,
  IconListCheck,
  IconCalendar,
  IconDeviceGamepad,
  IconBrain,
  IconMusic,
  IconCheck,
  IconX,
  IconChevronRight,
  IconTarget,
  IconTrophy,
  IconClock,
  IconNotes,
  IconChartLine,
  IconArrowUp,
  IconFlame,
  IconRotate,
  IconHeartHandshake,
  IconChartDots2,
  IconBulb,
  IconAward,
  IconMusicCheck,
  IconSearch,
  IconCrown,
  IconStairs,
  IconTargetArrow,
  IconChartHistogram,
  IconArrowDown,
  IconStar,
} from '@tabler/icons-react';
import * as Progress from '@radix-ui/react-progress';
import * as Tabs from '@radix-ui/react-tabs';
import * as Avatar from '@radix-ui/react-avatar';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  AreaChart,
  Area,
} from 'recharts';

// Types pour les scores et performances
interface ScoreSummary {
  id: string;
  songTitle: string;
  songComposer?: string;
  correctNotes: number;
  missedNotes: number;
  wrongNotes: number;
  totalPoints: number;
  maxMultiplier: number;
  maxCombo: number;
  playedAt: string;
  mode: 'learning' | 'game';
  accuracy: number; // pourcentage de notes correctes
  duration: string; // durée de la session
  thumbnail?: string;
  progress: number; // progression totale dans le morceau
  tempo: number; // tempo en BPM
  level: number; // niveau de difficulté
}

// Modes de jeu
const gameModes = [
  {
    id: 'learning',
    name: 'Apprentissage',
    description: 'Mode pour apprendre et pratiquer les morceaux à votre rythme',
    icon: <IconBrain size={20} className="text-indigo-500" />,
  },
  {
    id: 'game',
    name: 'Performance',
    description: 'Mode compétitif avec scoring et classement',
    icon: <IconDeviceGamepad size={20} className="text-purple-500" />,
  },
];

// Données de démo pour les scores récents
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

// Statistiques de performance par mois
const monthlyStats = [
  { month: 'Jan', sessions: 12, average: 78, bestScore: 3200 },
  { month: 'Fév', sessions: 15, average: 80, bestScore: 3400 },
  { month: 'Mar', sessions: 20, average: 82, bestScore: 3600 },
  { month: 'Avr', sessions: 18, average: 85, bestScore: 4000 },
  { month: 'Mai', sessions: 22, average: 87, bestScore: 4400 },
  { month: 'Juin', sessions: 25, average: 88, bestScore: 4600 },
];

// Données pour le graphique radar des compétences
const skillsData = [
  { skill: 'Précision', learning: 75, game: 70 },
  { skill: 'Timing', learning: 68, game: 80 },
  { skill: 'Rythme', learning: 80, game: 85 },
  { skill: 'Tempo', learning: 65, game: 75 },
  { skill: 'Cohérence', learning: 72, game: 65 },
  { skill: 'Expressivité', learning: 85, game: 60 },
];

// Données pour le graphique en camembert des types de morceaux
const songTypeData = [
  { name: 'Classique', value: 45 },
  { name: 'Jazz', value: 20 },
  { name: 'Pop', value: 15 },
  { name: 'Exercices', value: 20 },
];

// Couleurs pour les graphiques
const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff8042', '#0088FE'];

// Format pour afficher le temps
function formatDuration(minutes: number): string {
  const hours = Math.floor(minutes / 60);
  const mins = Math.round(minutes % 60);

  if (hours > 0) {
    return `${hours}h ${mins}min`;
  } else {
    return `${mins} min`;
  }
}

// Calcule la distribution des notes
function calculateNoteDistribution(scores: ScoreSummary[]) {
  let totalCorrect = 0;
  let totalMissed = 0;
  let totalWrong = 0;

  scores.forEach((score) => {
    totalCorrect += score.correctNotes;
    totalMissed += score.missedNotes;
    totalWrong += score.wrongNotes;
  });

  const total = totalCorrect + totalMissed + totalWrong;

  return [
    { name: 'Correctes', value: Math.round((totalCorrect / total) * 100) },
    { name: 'Manquées', value: Math.round((totalMissed / total) * 100) },
    { name: 'Incorrectes', value: Math.round((totalWrong / total) * 100) },
  ];
}

// Composant pour la barre de progression
function ProgressBar({
  value,
  max = 100,
  className = '',
  colorClass = 'bg-indigo-500',
}: {
  value: number;
  max?: number;
  className?: string;
  colorClass?: string;
}) {
  const percentage = (value / max) * 100;

  return (
    <Progress.Root
      className={`relative overflow-hidden bg-slate-200 dark:bg-slate-700 rounded-full w-full h-2 ${className}`}
      value={percentage}
    >
      <Progress.Indicator
        className={`h-full transition-transform duration-500 ease-in-out rounded-full ${colorClass}`}
        style={{ transform: `translateX(-${100 - percentage}%)` }}
      />
    </Progress.Root>
  );
}

// Badge pour le mode de jeu
function ModeBadge({ mode }: { mode: 'learning' | 'game' }) {
  const isLearning = mode === 'learning';

  return (
    <div
      className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
        isLearning
          ? 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300'
          : 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300'
      }`}
    >
      {isLearning ? (
        <IconBrain size={14} className="mr-1" />
      ) : (
        <IconDeviceGamepad size={14} className="mr-1" />
      )}
      {isLearning ? 'Apprentissage' : 'Performance'}
    </div>
  );
}

// Badge pour la précision
function AccuracyBadge({ accuracy }: { accuracy: number }) {
  let colorClass = '';

  if (accuracy >= 95) {
    colorClass =
      'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300';
  } else if (accuracy >= 85) {
    colorClass =
      'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300';
  } else if (accuracy >= 75) {
    colorClass =
      'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300';
  } else if (accuracy >= 60) {
    colorClass =
      'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300';
  } else {
    colorClass = 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300';
  }

  return (
    <div
      className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${colorClass}`}
    >
      <IconTarget size={14} className="mr-1" />
      {accuracy}% précision
    </div>
  );
}

// Card pour le score
function ScoreCard({ score }: { score: ScoreSummary }) {
  return (
    <div
      className={`bg-white dark:bg-slate-800 shadow-sm rounded-xl p-4 border ${
        score.mode === 'learning'
          ? 'border-indigo-200 dark:border-indigo-900/30'
          : 'border-purple-200 dark:border-purple-900/30'
      } hover:shadow-md transition-shadow`}
    >
      <div className="flex items-start">
        <div className="flex-shrink-0 w-14 h-14 rounded-lg overflow-hidden bg-slate-100 dark:bg-slate-700 mr-3">
          {score.thumbnail ? (
            <img
              src={score.thumbnail}
              alt={score.songTitle}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <IconMusic
                size={24}
                className="text-slate-400 dark:text-slate-500"
              />
            </div>
          )}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-1">
            <h3 className="text-sm font-medium text-slate-900 dark:text-white truncate pr-2">
              {score.songTitle}
            </h3>
            <ModeBadge mode={score.mode} />
          </div>

          {score.songComposer && (
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1.5">
              {score.songComposer}
            </p>
          )}

          <div className="flex items-center mb-2 text-xs text-slate-500 dark:text-slate-400">
            <span className="inline-flex items-center mr-3">
              <IconCalendar size={14} className="mr-1" />
              {score.playedAt}
            </span>
            <span className="inline-flex items-center">
              <IconClock size={14} className="mr-1" />
              {score.duration}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <AccuracyBadge accuracy={score.accuracy} />
            <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
              {score.totalPoints} pts
            </span>
          </div>
        </div>
      </div>

      <div className="mt-3">
        <div className="flex justify-between items-center text-xs mb-1">
          <span className="text-slate-500 dark:text-slate-400">
            Progression
          </span>
          <span className="text-slate-700 dark:text-slate-300">
            {score.progress}%
          </span>
        </div>
        <ProgressBar
          value={score.progress}
          colorClass={
            score.progress === 100
              ? 'bg-emerald-500'
              : score.mode === 'learning'
              ? 'bg-indigo-500'
              : 'bg-purple-500'
          }
        />
      </div>

      <div className="grid grid-cols-3 gap-2 mt-3 text-center">
        <div className="bg-slate-50 dark:bg-slate-700/40 rounded py-1.5 px-1">
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Précision
          </p>
          <p className="text-sm font-medium text-slate-700 dark:text-slate-300">
            {score.accuracy}%
          </p>
        </div>
        <div className="bg-slate-50 dark:bg-slate-700/40 rounded py-1.5 px-1">
          <p className="text-xs text-slate-500 dark:text-slate-400">Combo</p>
          <p className="text-sm font-medium text-slate-700 dark:text-slate-300">
            x{score.maxCombo}
          </p>
        </div>
        <div className="bg-slate-50 dark:bg-slate-700/40 rounded py-1.5 px-1">
          <p className="text-xs text-slate-500 dark:text-slate-400">Multi.</p>
          <p className="text-sm font-medium text-slate-700 dark:text-slate-300">
            x{score.maxMultiplier}
          </p>
        </div>
      </div>
    </div>
  );
}

// Stats Card pour afficher une statistique simple
function StatCard({
  title,
  value,
  icon,
  change,
  iconColorClass = 'text-indigo-500',
  bgColorClass = 'bg-slate-50 dark:bg-slate-700/40',
}: {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  change?: { value: string | number; positive: boolean };
  iconColorClass?: string;
  bgColorClass?: string;
}) {
  return (
    <div className={`rounded-xl p-4 ${bgColorClass}`}>
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm font-medium text-slate-500 dark:text-slate-400 flex items-center">
          <span className={`mr-1.5 ${iconColorClass}`}>{icon}</span>
          {title}
        </h3>
        {change && (
          <div
            className={`text-xs flex items-center ${
              change.positive ? 'text-emerald-500' : 'text-rose-500'
            }`}
          >
            {change.positive ? '▲' : '▼'} {change.value}
          </div>
        )}
      </div>
      <div className="text-2xl font-bold text-slate-900 dark:text-white">
        {value}
      </div>
    </div>
  );
}

// Ajout de données pour le tableau de classement
const leaderboardData = [
  {
    id: 1,
    name: 'JeanPianiste',
    score: 9750,
    rank: 1,
    avatar: '/avatars/user1.jpg',
    change: 0,
  },
  {
    id: 2,
    name: 'MélodieM',
    score: 9320,
    rank: 2,
    avatar: '/avatars/user2.jpg',
    change: 2,
  },
  {
    id: 3,
    name: 'PianoMaster',
    score: 8990,
    rank: 3,
    avatar: '/avatars/user3.jpg',
    change: -1,
  },
  {
    id: 4,
    name: 'ClavieristeExpert',
    score: 8760,
    rank: 4,
    avatar: '/avatars/user4.jpg',
    change: 1,
  },
  {
    id: 5,
    name: 'Vous',
    score: 8450,
    rank: 5,
    avatar: '/avatars/user5.jpg',
    change: -2,
  },
];

// Données pour la progression quotidienne
const dailyProgress = [
  { day: 'Lun', minutes: 45, songs: 6 },
  { day: 'Mar', minutes: 30, songs: 4 },
  { day: 'Mer', minutes: 60, songs: 8 },
  { day: 'Jeu', minutes: 20, songs: 3 },
  { day: 'Ven', minutes: 50, songs: 7 },
  { day: 'Sam', minutes: 75, songs: 10 },
  { day: 'Dim', minutes: 35, songs: 5 },
];

// Données pour les tendances
const trendsData = [
  { category: 'Classique', lastMonth: 65, thisMonth: 75, change: '+15%' },
  { category: 'Jazz', lastMonth: 40, thisMonth: 55, change: '+37.5%' },
  { category: 'Pop', lastMonth: 80, thisMonth: 70, change: '-12.5%' },
  { category: 'Rock', lastMonth: 50, thisMonth: 65, change: '+30%' },
];

// Données pour les achievements
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

// Composant pour la carte de classement
function LeaderboardCard() {
  return (
    <div className="bg-white dark:bg-slate-800 shadow-md rounded-2xl p-5 border border-slate-200 dark:border-slate-700">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-slate-900 dark:text-white flex items-center">
          <IconTrophy size={20} className="mr-2 text-amber-500" />
          Classement
        </h2>
        <button className="text-xs text-indigo-600 dark:text-indigo-400 font-medium hover:underline flex items-center">
          Classement mondial
          <IconChevronRight size={14} className="ml-1" />
        </button>
      </div>

      <div className="space-y-3">
        {leaderboardData.map((user, index) => (
          <div
            key={user.id}
            className={`flex items-center justify-between p-3 rounded-lg ${
              user.name === 'Vous'
                ? 'bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-100 dark:border-indigo-800/30'
                : 'bg-slate-50 dark:bg-slate-700/30'
            }`}
          >
            <div className="flex items-center">
              <div className="w-7 text-center font-semibold text-slate-700 dark:text-slate-300 mr-3">
                {user.rank}
                {user.change !== 0 && (
                  <span
                    className={`text-xs ${
                      user.change > 0 ? 'text-emerald-500' : 'text-red-500'
                    }`}
                  >
                    {user.change > 0
                      ? `↑${user.change}`
                      : `↓${Math.abs(user.change)}`}
                  </span>
                )}
              </div>
              <div className="h-8 w-8 rounded-full bg-slate-200 dark:bg-slate-600 overflow-hidden mr-3">
                <div className="h-full w-full bg-gradient-to-br from-indigo-400 to-purple-500"></div>
              </div>
              <span
                className={`font-medium ${
                  user.name === 'Vous'
                    ? 'text-indigo-600 dark:text-indigo-400'
                    : 'text-slate-700 dark:text-slate-300'
                }`}
              >
                {user.name}
              </span>
            </div>
            <span className="font-bold text-slate-900 dark:text-white">
              {user.score}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

// Composant pour la carte d'activité quotidienne
function DailyActivityCard() {
  return (
    <div className="bg-white dark:bg-slate-800 shadow-md rounded-2xl p-5 border border-slate-200 dark:border-slate-700">
      <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-4 flex items-center">
        <IconCalendar size={20} className="mr-2 text-indigo-500" />
        Activité hebdomadaire
      </h2>

      <div className="h-60">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={dailyProgress}
            margin={{ top: 20, right: 10, left: 10, bottom: 5 }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              vertical={false}
              opacity={0.1}
            />
            <XAxis dataKey="day" />
            <YAxis yAxisId="left" orientation="left" stroke="#8884d8" />
            <YAxis yAxisId="right" orientation="right" stroke="#82ca9d" />
            <Tooltip
              contentStyle={{
                backgroundColor: '#1e293b',
                border: 'none',
                borderRadius: '8px',
                fontSize: '12px',
              }}
              itemStyle={{ color: '#e2e8f0' }}
              labelStyle={{ color: '#e2e8f0', fontWeight: 'bold' }}
            />
            <Legend />
            <Bar
              yAxisId="left"
              dataKey="minutes"
              name="Minutes"
              fill="#8884d8"
              radius={[4, 4, 0, 0]}
            />
            <Bar
              yAxisId="right"
              dataKey="songs"
              name="Morceaux"
              fill="#82ca9d"
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-2 gap-4 mt-4">
        <div className="bg-slate-50 dark:bg-slate-700/30 rounded-lg p-3 text-center">
          <span className="text-sm text-slate-500 dark:text-slate-400">
            Temps total
          </span>
          <div className="text-xl font-bold text-slate-900 dark:text-white mt-1">
            5h 15m
          </div>
          <span className="text-xs text-emerald-500 flex items-center justify-center mt-1">
            <IconArrowUp size={14} className="mr-1" />
            +45min
          </span>
        </div>
        <div className="bg-slate-50 dark:bg-slate-700/30 rounded-lg p-3 text-center">
          <span className="text-sm text-slate-500 dark:text-slate-400">
            Morceaux joués
          </span>
          <div className="text-xl font-bold text-slate-900 dark:text-white mt-1">
            43
          </div>
          <span className="text-xs text-emerald-500 flex items-center justify-center mt-1">
            <IconArrowUp size={14} className="mr-1" />
            +8
          </span>
        </div>
      </div>
    </div>
  );
}

// Composant pour la carte de tendances
function TrendsCard() {
  return (
    <div className="bg-white dark:bg-slate-800 shadow-md rounded-2xl p-5 border border-slate-200 dark:border-slate-700">
      <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-4 flex items-center">
        <IconChartDots2 size={20} className="mr-2 text-purple-500" />
        Tendances par genre
      </h2>

      <div className="space-y-3">
        {trendsData.map((trend, index) => (
          <div key={index} className="group">
            <div className="flex justify-between items-center mb-1">
              <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                {trend.category}
              </span>
              <span
                className={`text-xs font-medium ${
                  trend.change.startsWith('+')
                    ? 'text-emerald-500'
                    : 'text-red-500'
                }`}
              >
                {trend.change}
              </span>
            </div>
            <div className="h-2.5 w-full bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all ${
                  trend.category === 'Classique'
                    ? 'bg-blue-500'
                    : trend.category === 'Jazz'
                    ? 'bg-amber-500'
                    : trend.category === 'Pop'
                    ? 'bg-pink-500'
                    : 'bg-emerald-500'
                }`}
                style={{ width: `${trend.thisMonth}%` }}
              ></div>
            </div>
            <div className="flex justify-between items-center mt-1 text-xs text-slate-500 dark:text-slate-400">
              <span>Mois dernier: {trend.lastMonth}%</span>
              <span>Ce mois: {trend.thisMonth}%</span>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 p-3 bg-slate-50 dark:bg-slate-700/30 rounded-lg">
        <div className="flex items-center">
          <div className="p-2 rounded-full bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 mr-3">
            <IconBulb size={18} />
          </div>
          <div className="flex-1">
            <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
              Suggestion
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Essayez d'explorer plus de morceaux classiques pour améliorer
              votre technique.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

// Composant pour les achievements
function AchievementsCard() {
  return (
    <div className="bg-white dark:bg-slate-800 shadow-md rounded-2xl p-5 border border-slate-200 dark:border-slate-700">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-slate-900 dark:text-white flex items-center">
          <IconAward size={20} className="mr-2 text-amber-500" />
          Réussites
        </h2>
        <button className="text-xs text-indigo-600 dark:text-indigo-400 font-medium hover:underline flex items-center">
          Voir tout
          <IconChevronRight size={14} className="ml-1" />
        </button>
      </div>

      <div className="space-y-4">
        {achievements.map((achievement) => (
          <div key={achievement.id} className="group">
            <div className="flex items-start">
              <div
                className={`p-2 rounded-lg ${
                  achievement.progress >= 100
                    ? 'bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400'
                    : 'bg-slate-100 dark:bg-slate-700/50 text-slate-500 dark:text-slate-400'
                } mr-3`}
              >
                {achievement.icon}
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-center">
                  <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
                    {achievement.title}
                    {achievement.progress >= 100 && (
                      <span className="ml-2 text-xs bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 px-2 py-0.5 rounded-full">
                        Complété
                      </span>
                    )}
                  </h3>
                  <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
                    {achievement.progress}%
                  </span>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 mb-1.5">
                  {achievement.description}
                </p>
                <div className="h-1.5 w-full bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full ${
                      achievement.progress >= 100
                        ? 'bg-amber-500'
                        : achievement.progress > 66
                        ? 'bg-emerald-500'
                        : achievement.progress > 33
                        ? 'bg-blue-500'
                        : 'bg-indigo-500'
                    }`}
                    style={{ width: `${Math.min(achievement.progress, 100)}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Composant pour les suggestions de morceaux
function SuggestedSongsCard() {
  const suggestedSongs = [
    {
      id: 1,
      title: 'Clair de Lune',
      composer: 'Debussy',
      difficulty: 'Intermédiaire',
      match: '95%',
      image: '/songs/clair-de-lune.jpg',
    },
    {
      id: 2,
      title: 'Gymnopédie No.1',
      composer: 'Erik Satie',
      difficulty: 'Débutant',
      match: '92%',
      image: '/songs/gymnopedie.jpg',
    },
    {
      id: 3,
      title: 'River Flows in You',
      composer: 'Yiruma',
      difficulty: 'Intermédiaire',
      match: '88%',
      image: '/songs/river-flows.jpg',
    },
  ];

  return (
    <div className="bg-white dark:bg-slate-800 shadow-md rounded-2xl p-5 border border-slate-200 dark:border-slate-700">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-slate-900 dark:text-white flex items-center">
          <IconMusicCheck size={20} className="mr-2 text-indigo-500" />
          Suggestions personnalisées
        </h2>
        <button className="text-xs text-indigo-600 dark:text-indigo-400 font-medium hover:underline flex items-center">
          Plus de suggestions
          <IconChevronRight size={14} className="ml-1" />
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {suggestedSongs.map((song) => (
          <div
            key={song.id}
            className="group relative overflow-hidden rounded-xl"
          >
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-black/20 z-10"></div>
            <div className="absolute inset-0 bg-slate-900 group-hover:bg-slate-800 transition-colors duration-300 z-0"></div>

            <div className="relative flex flex-col justify-end p-4 h-full z-20 min-h-[180px]">
              <div className="absolute top-3 right-3 bg-indigo-600 text-white text-xs font-medium px-2 py-1 rounded-full">
                {song.match} match
              </div>

              <div className="mb-2">
                <span className="px-2 py-1 bg-white/10 text-white text-xs rounded">
                  {song.difficulty}
                </span>
              </div>

              <h3 className="text-lg font-bold text-white">{song.title}</h3>
              <p className="text-slate-300 text-sm">{song.composer}</p>

              <button className="mt-3 w-full bg-white/10 hover:bg-white/20 text-white py-2 rounded-lg text-sm font-medium transition-colors duration-300">
                Commencer
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Composant principal pour la page performances
export function PerformanceBento() {
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedMode, setSelectedMode] = useState<string | null>(null);

  // Calcul des statistiques globales
  const totalSessions = recentScores.length;
  const learningModeCount = recentScores.filter(
    (s) => s.mode === 'learning'
  ).length;
  const gameModeCount = recentScores.filter((s) => s.mode === 'game').length;
  const averageAccuracy = Math.round(
    recentScores.reduce((acc, score) => acc + score.accuracy, 0) / totalSessions
  );
  const bestScore = Math.max(...recentScores.map((s) => s.totalPoints));
  const noteDistribution = calculateNoteDistribution(recentScores);

  // Filtrer les scores en fonction du mode sélectionné
  const filteredScores = selectedMode
    ? recentScores.filter((score) => score.mode === selectedMode)
    : recentScores;

  return (
    <div className="w-full p-4">
      {/* En-tête avec les onglets */}
      <Tabs.Root
        className="w-full"
        defaultValue="overview"
        onValueChange={setActiveTab}
      >
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center">
              <IconChartBar size={24} className="mr-2 text-indigo-500" />
              Performances
            </h1>
            <p className="text-slate-500 dark:text-slate-400 mt-1">
              Suivez votre progression et vos performances
            </p>
          </div>

          <Tabs.List className="flex p-1 bg-slate-100 dark:bg-slate-800 rounded-lg">
            <Tabs.Trigger
              className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                activeTab === 'overview'
                  ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
              value="overview"
            >
              Vue d'ensemble
            </Tabs.Trigger>
            <Tabs.Trigger
              className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                activeTab === 'history'
                  ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
              value="history"
            >
              Historique
            </Tabs.Trigger>
            <Tabs.Trigger
              className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                activeTab === 'skills'
                  ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
              value="skills"
            >
              Compétences
            </Tabs.Trigger>
          </Tabs.List>
        </div>

        {/* Contenu des onglets */}
        <Tabs.Content value="overview" className="focus:outline-none">
          {/* Statistiques globales */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <StatCard
              title="Sessions totales"
              value={totalSessions}
              icon={<IconListCheck size={18} />}
              change={{ value: '+3', positive: true }}
            />
            <StatCard
              title="Précision moyenne"
              value={`${averageAccuracy}%`}
              icon={<IconTarget size={18} />}
              change={{ value: '+2%', positive: true }}
            />
            <StatCard
              title="Meilleur score"
              value={bestScore}
              icon={<IconTrophy size={18} />}
              iconColorClass="text-amber-500"
            />
            <StatCard
              title="Temps de pratique"
              value="8h 45min"
              icon={<IconClock size={18} />}
              change={{ value: '+1h 20min', positive: true }}
              iconColorClass="text-emerald-500"
            />
          </div>

          {/* Graphiques principaux */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            {/* Distribution des notes et types de morceaux */}
            <div className="md:col-span-1 bg-white dark:bg-slate-800 shadow-md rounded-2xl p-5 border border-slate-200 dark:border-slate-700">
              <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-4 flex items-center">
                <IconNotes size={20} className="mr-2 text-indigo-500" />
                Distribution des notes
              </h2>

              <div className="h-60">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={noteDistribution}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) =>
                        `${name}: ${(percent * 100).toFixed(0)}%`
                      }
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {noteDistribution.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={
                            index === 0
                              ? '#10b981'
                              : index === 1
                              ? '#f59e0b'
                              : '#ef4444'
                          }
                        />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => [`${value}%`, '']} />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              <div className="mt-2 grid grid-cols-3 gap-2">
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full bg-emerald-500 mr-2"></div>
                  <span className="text-xs text-slate-600 dark:text-slate-400">
                    Correctes
                  </span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full bg-amber-500 mr-2"></div>
                  <span className="text-xs text-slate-600 dark:text-slate-400">
                    Manquées
                  </span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full bg-red-500 mr-2"></div>
                  <span className="text-xs text-slate-600 dark:text-slate-400">
                    Incorrectes
                  </span>
                </div>
              </div>
            </div>

            {/* Répartition par mode de jeu */}
            <div className="md:col-span-2 bg-white dark:bg-slate-800 shadow-md rounded-2xl p-5 border border-slate-200 dark:border-slate-700">
              <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-4 flex items-center">
                <IconChartLine size={20} className="mr-2 text-indigo-500" />
                Progression mensuelle
              </h2>

              <div className="h-60">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={monthlyStats}>
                    <CartesianGrid
                      strokeDasharray="3 3"
                      vertical={false}
                      opacity={0.1}
                    />
                    <XAxis dataKey="month" />
                    <YAxis yAxisId="left" orientation="left" stroke="#8884d8" />
                    <YAxis
                      yAxisId="right"
                      orientation="right"
                      stroke="#82ca9d"
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#1e293b',
                        border: 'none',
                        borderRadius: '8px',
                        fontSize: '12px',
                      }}
                      itemStyle={{ color: '#e2e8f0' }}
                      labelStyle={{ color: '#e2e8f0', fontWeight: 'bold' }}
                    />
                    <Legend />
                    <Bar
                      yAxisId="left"
                      dataKey="average"
                      name="Précision moyenne (%)"
                      fill="#8884d8"
                      radius={[4, 4, 0, 0]}
                    />
                    <Bar
                      yAxisId="right"
                      dataKey="bestScore"
                      name="Meilleur score"
                      fill="#82ca9d"
                      radius={[4, 4, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Nouvelles sections pour l'onglet Vue d'ensemble */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div className="md:col-span-1">
              <LeaderboardCard />
            </div>
            <div className="md:col-span-2">
              <DailyActivityCard />
            </div>
          </div>

          {/* Nouvelles sections pour l'onglet Vue d'ensemble */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <TrendsCard />
            <AchievementsCard />
          </div>

          {/* Suggestions de morceaux */}
          <SuggestedSongsCard />

          {/* Modes de jeu */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            {gameModes.map((mode) => (
              <div
                key={mode.id}
                className={`bg-white dark:bg-slate-800 shadow-md rounded-2xl p-5 border ${
                  mode.id === 'learning'
                    ? 'border-indigo-200 dark:border-indigo-900/30'
                    : 'border-purple-200 dark:border-purple-900/30'
                }`}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center">
                    <div
                      className={`p-3 rounded-lg mr-3 ${
                        mode.id === 'learning'
                          ? 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400'
                          : 'bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400'
                      }`}
                    >
                      {mode.icon}
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                        {mode.name}
                      </h3>
                      <p className="text-sm text-slate-500 dark:text-slate-400">
                        {mode.description}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-slate-900 dark:text-white">
                      {mode.id === 'learning'
                        ? learningModeCount
                        : gameModeCount}
                    </div>
                    <div className="text-xs text-slate-500 dark:text-slate-400">
                      sessions
                    </div>
                  </div>
                </div>

                <div className="mt-4 grid grid-cols-2 gap-4">
                  <div>
                    <div className="flex justify-between items-center text-sm mb-1">
                      <span className="text-slate-500 dark:text-slate-400">
                        Précision moyenne
                      </span>
                      <span className="text-slate-700 dark:text-slate-300 font-medium">
                        {Math.round(
                          recentScores
                            .filter((s) => s.mode === mode.id)
                            .reduce((acc, s) => acc + s.accuracy, 0) /
                            (mode.id === 'learning'
                              ? learningModeCount
                              : gameModeCount)
                        )}
                        %
                      </span>
                    </div>
                    <ProgressBar
                      value={Math.round(
                        recentScores
                          .filter((s) => s.mode === mode.id)
                          .reduce((acc, s) => acc + s.accuracy, 0) /
                          (mode.id === 'learning'
                            ? learningModeCount
                            : gameModeCount)
                      )}
                      colorClass={
                        mode.id === 'learning'
                          ? 'bg-indigo-500'
                          : 'bg-purple-500'
                      }
                    />
                  </div>
                  <div>
                    <div className="flex justify-between items-center text-sm mb-1">
                      <span className="text-slate-500 dark:text-slate-400">
                        Meilleur score
                      </span>
                      <span className="text-slate-700 dark:text-slate-300 font-medium">
                        {Math.max(
                          ...recentScores
                            .filter((s) => s.mode === mode.id)
                            .map((s) => s.totalPoints)
                        )}
                      </span>
                    </div>
                    <ProgressBar
                      value={Math.max(
                        ...recentScores
                          .filter((s) => s.mode === mode.id)
                          .map((s) => s.totalPoints)
                      )}
                      max={5000}
                      colorClass={
                        mode.id === 'learning'
                          ? 'bg-indigo-500'
                          : 'bg-purple-500'
                      }
                    />
                  </div>
                </div>

                <button
                  className={`w-full mt-4 text-sm font-medium py-2 px-4 rounded-lg transition-colors ${
                    mode.id === 'learning'
                      ? 'bg-indigo-600 hover:bg-indigo-700 text-white'
                      : 'bg-purple-600 hover:bg-purple-700 text-white'
                  }`}
                  onClick={() => {
                    setSelectedMode(mode.id === selectedMode ? null : mode.id);
                    setActiveTab('history');
                  }}
                >
                  Voir les détails
                </button>
              </div>
            ))}
          </div>

          {/* Scores récents */}
          <div className="bg-white dark:bg-slate-800 shadow-md rounded-2xl p-5 border border-slate-200 dark:border-slate-700">
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
              {recentScores.slice(0, 3).map((score) => (
                <ScoreCard key={score.id} score={score} />
              ))}
            </div>
          </div>
        </Tabs.Content>

        <Tabs.Content value="history" className="focus:outline-none">
          {/* Filtres de mode */}
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
              Historique des sessions
            </h2>

            <div className="flex space-x-2">
              <button
                className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
                  selectedMode === null
                    ? 'bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
                onClick={() => setSelectedMode(null)}
              >
                Tous
              </button>

              <button
                className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
                  selectedMode === 'learning'
                    ? 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
                onClick={() =>
                  setSelectedMode(
                    selectedMode === 'learning' ? null : 'learning'
                  )
                }
              >
                <IconBrain size={14} className="inline-block mr-1" />
                Apprentissage
              </button>

              <button
                className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
                  selectedMode === 'game'
                    ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
                onClick={() =>
                  setSelectedMode(selectedMode === 'game' ? null : 'game')
                }
              >
                <IconDeviceGamepad size={14} className="inline-block mr-1" />
                Performance
              </button>
            </div>
          </div>

          {/* Liste des scores */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredScores.map((score) => (
              <ScoreCard key={score.id} score={score} />
            ))}
          </div>

          {/* Ajout d'une section d'analyse détaillée */}
          <div className="mt-8 bg-white dark:bg-slate-800 shadow-md rounded-2xl p-5 border border-slate-200 dark:border-slate-700">
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-4 flex items-center">
              <IconSearch size={20} className="mr-2 text-indigo-500" />
              Analyse détaillée
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-slate-50 dark:bg-slate-700/30 rounded-lg p-4">
                <h3 className="text-sm font-semibold text-slate-900 dark:text-white mb-2 flex items-center">
                  <IconClock size={16} className="mr-2 text-indigo-500" />
                  Heures de jeu par jour
                </h3>
                <div className="h-40">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={dailyProgress}>
                      <CartesianGrid
                        strokeDasharray="3 3"
                        vertical={false}
                        opacity={0.1}
                      />
                      <XAxis dataKey="day" />
                      <YAxis />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: '#1e293b',
                          border: 'none',
                          borderRadius: '8px',
                          fontSize: '12px',
                        }}
                        itemStyle={{ color: '#e2e8f0' }}
                        labelStyle={{ color: '#e2e8f0', fontWeight: 'bold' }}
                      />
                      <Line
                        type="monotone"
                        dataKey="minutes"
                        stroke="#6366f1"
                        strokeWidth={2}
                        dot={{ fill: '#6366f1', r: 4 }}
                        activeDot={{ r: 6, fill: '#4f46e5' }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="bg-slate-50 dark:bg-slate-700/30 rounded-lg p-4">
                <h3 className="text-sm font-semibold text-slate-900 dark:text-white mb-2 flex items-center">
                  <IconChartHistogram
                    size={16}
                    className="mr-2 text-purple-500"
                  />
                  Progression de la précision
                </h3>
                <div className="h-40">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={monthlyStats}>
                      <CartesianGrid
                        strokeDasharray="3 3"
                        vertical={false}
                        opacity={0.1}
                      />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: '#1e293b',
                          border: 'none',
                          borderRadius: '8px',
                          fontSize: '12px',
                        }}
                        itemStyle={{ color: '#e2e8f0' }}
                        labelStyle={{ color: '#e2e8f0', fontWeight: 'bold' }}
                      />
                      <Area
                        type="monotone"
                        dataKey="average"
                        stroke="#8884d8"
                        fill="#8884d8"
                        fillOpacity={0.2}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="bg-slate-50 dark:bg-slate-700/30 rounded-lg p-4">
                <h3 className="text-sm font-semibold text-slate-900 dark:text-white mb-2 flex items-center">
                  <IconCrown size={16} className="mr-2 text-amber-500" />
                  Scores maximums
                </h3>
                <div className="h-40">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={monthlyStats}>
                      <CartesianGrid
                        strokeDasharray="3 3"
                        vertical={false}
                        opacity={0.1}
                      />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: '#1e293b',
                          border: 'none',
                          borderRadius: '8px',
                          fontSize: '12px',
                        }}
                        itemStyle={{ color: '#e2e8f0' }}
                        labelStyle={{ color: '#e2e8f0', fontWeight: 'bold' }}
                      />
                      <Area
                        type="monotone"
                        dataKey="bestScore"
                        stroke="#82ca9d"
                        fill="#82ca9d"
                        fillOpacity={0.2}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </div>
        </Tabs.Content>

        <Tabs.Content value="skills" className="focus:outline-none">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            {/* Graphique radar des compétences */}
            <div className="bg-white dark:bg-slate-800 shadow-md rounded-2xl p-5 border border-slate-200 dark:border-slate-700">
              <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-4 flex items-center">
                <IconStar size={20} className="mr-2 text-amber-500" />
                Analyse des compétences
              </h2>

              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart outerRadius={90} data={skillsData}>
                    <PolarGrid />
                    <PolarAngleAxis dataKey="skill" />
                    <PolarRadiusAxis angle={30} domain={[0, 100]} />
                    <Radar
                      name="Apprentissage"
                      dataKey="learning"
                      stroke="#6366f1"
                      fill="#6366f1"
                      fillOpacity={0.2}
                    />
                    <Radar
                      name="Performance"
                      dataKey="game"
                      stroke="#9333ea"
                      fill="#9333ea"
                      fillOpacity={0.2}
                    />
                    <Legend />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#1e293b',
                        border: 'none',
                        borderRadius: '8px',
                        fontSize: '12px',
                      }}
                      itemStyle={{ color: '#e2e8f0' }}
                      labelStyle={{ color: '#e2e8f0', fontWeight: 'bold' }}
                    />
                  </RadarChart>
                </ResponsiveContainer>
              </div>

              <div className="mt-2 text-center">
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Comparaison des compétences entre les modes d'apprentissage et
                  de performance
                </p>
              </div>
            </div>

            {/* Types de morceaux joués */}
            <div className="bg-white dark:bg-slate-800 shadow-md rounded-2xl p-5 border border-slate-200 dark:border-slate-700">
              <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-4 flex items-center">
                <IconMusic size={20} className="mr-2 text-indigo-500" />
                Types de morceaux joués
              </h2>

              <div className="h-60">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={songTypeData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) =>
                        `${name}: ${(percent * 100).toFixed(0)}%`
                      }
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {songTypeData.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={COLORS[index % COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => [`${value}%`, '']} />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-2">
                {songTypeData.map((type, index) => (
                  <div key={index} className="flex items-center">
                    <div
                      className="w-3 h-3 rounded-full mr-2"
                      style={{ backgroundColor: COLORS[index % COLORS.length] }}
                    ></div>
                    <span className="text-xs text-slate-600 dark:text-slate-400">
                      {type.name}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Objectifs et améliorations */}
          <div className="bg-white dark:bg-slate-800 shadow-md rounded-2xl p-5 border border-slate-200 dark:border-slate-700">
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-4 flex items-center">
              <IconTarget size={20} className="mr-2 text-emerald-500" />
              Améliorations suggérées
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-slate-50 dark:bg-slate-700/40 rounded-lg p-4">
                <div className="flex items-center mb-3">
                  <div className="p-2 rounded-lg mr-3 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400">
                    <IconRotate size={18} />
                  </div>
                  <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
                    Exercices de rythme
                  </h3>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 mb-3">
                  Pratiquez des exercices spécifiques pour améliorer votre
                  précision rythmique de 15%.
                </p>
                <button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-1.5 px-3 rounded text-xs font-medium transition-colors">
                  Commencer
                </button>
              </div>

              <div className="bg-slate-50 dark:bg-slate-700/40 rounded-lg p-4">
                <div className="flex items-center mb-3">
                  <div className="p-2 rounded-lg mr-3 bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400">
                    <IconHeartHandshake size={18} />
                  </div>
                  <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
                    Coordination des mains
                  </h3>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 mb-3">
                  Améliorez la coordination entre vos mains gauche et droite
                  avec des exercices ciblés.
                </p>
                <button className="w-full bg-purple-600 hover:bg-purple-700 text-white py-1.5 px-3 rounded text-xs font-medium transition-colors">
                  Commencer
                </button>
              </div>

              <div className="bg-slate-50 dark:bg-slate-700/40 rounded-lg p-4">
                <div className="flex items-center mb-3">
                  <div className="p-2 rounded-lg mr-3 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400">
                    <IconFlame size={18} />
                  </div>
                  <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
                    Défi de précision
                  </h3>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 mb-3">
                  Atteignez 95% de précision sur trois morceaux consécutifs en
                  mode Performance.
                </p>
                <button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-1.5 px-3 rounded text-xs font-medium transition-colors">
                  Commencer
                </button>
              </div>
            </div>
          </div>

          {/* Ajout d'une section Niveaux de difficulté maîtrisés */}
          <div className="mt-6 bg-white dark:bg-slate-800 shadow-md rounded-2xl p-5 border border-slate-200 dark:border-slate-700">
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-4 flex items-center">
              <IconStairs size={20} className="mr-2 text-blue-500" />
              Niveaux de difficulté maîtrisés
            </h2>

            <div className="space-y-4">
              <div>
                <div className="flex justify-between items-center mb-1">
                  <div className="flex items-center">
                    <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                      Débutant
                    </span>
                    <span className="ml-2 text-xs bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 px-2 py-0.5 rounded-full">
                      Maîtrisé
                    </span>
                  </div>
                  <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
                    100%
                  </span>
                </div>
                <div className="h-2.5 w-full bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-emerald-500 rounded-full"
                    style={{ width: '100%' }}
                  ></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                    Intermédiaire
                  </span>
                  <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
                    75%
                  </span>
                </div>
                <div className="h-2.5 w-full bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-blue-500 rounded-full"
                    style={{ width: '75%' }}
                  ></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                    Avancé
                  </span>
                  <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
                    45%
                  </span>
                </div>
                <div className="h-2.5 w-full bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-indigo-500 rounded-full"
                    style={{ width: '45%' }}
                  ></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                    Expert
                  </span>
                  <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
                    15%
                  </span>
                </div>
                <div className="h-2.5 w-full bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-purple-500 rounded-full"
                    style={{ width: '15%' }}
                  ></div>
                </div>
              </div>
            </div>

            <div className="mt-4 p-3 bg-slate-50 dark:bg-slate-700/30 rounded-lg">
              <div className="flex items-center">
                <div className="p-2 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 mr-3">
                  <IconArrowUp size={18} />
                </div>
                <div className="flex-1">
                  <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
                    Niveau suivant: Avancé
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    Terminez 5 morceaux de niveau intermédiaire avec une
                    précision de 90% ou plus.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </Tabs.Content>
      </Tabs.Root>
    </div>
  );
}

export default PerformanceBento;
