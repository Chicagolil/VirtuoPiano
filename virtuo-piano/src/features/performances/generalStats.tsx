'use client';

import React, { useState } from 'react';

import {
  IconMusic,
  IconStar,
  IconTrendingUp,
  IconClock,
  IconBook,
  IconCalendar,
  IconBrain,
  IconDeviceGamepad,
  IconTarget,
  IconChevronRight,
  IconTargetArrow,
  IconChartBar,
} from '@tabler/icons-react';
import * as Separator from '@radix-ui/react-separator';
import { Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import ProgressBar from '@/components/ProgressBar';
import * as Tabs from '@radix-ui/react-tabs';
import InfoTile from '@/components/tiles/Infotile';
import AchievementsCard from '@/components/cards/AchievementsCard';
import UserAvatar from '@/components/badge/UserAvatar';
import ScoreCard from '@/components/cards/ScoreCard';
import { ScoreSummary } from '@/components/cards/ScoreCard';

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

const songCategoryData = [
  { name: 'Classique', value: 40 },
  { name: 'Jazz', value: 25 },
  { name: 'Pop', value: 20 },
  { name: 'Rock', value: 15 },
  { name: 'Autre', value: 10 },
];

const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff8042', '#ff4040'];

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
  const [activeTab, setActiveTab] = useState('overview');
  return (
    <div className="w-full p-4">
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
                activeTab === 'playedSongs'
                  ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
              value="playedSongs"
            >
              Chansons Jouées
            </Tabs.Trigger>
          </Tabs.List>
        </div>
        <Tabs.Content value="overview" className="focus:outline-none">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-white dark:bg-slate-800 shadow-md rounded-2xl p-5 col-span-1 border border-slate-200 dark:border-slate-700 flex flex-col">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
                Répertoire
              </h3>

              <div className="flex-grow flex items-center justify-center">
                <ResponsiveContainer width="100%" height={160}>
                  <PieChart>
                    <Pie
                      data={songCategoryData}
                      cx="50%"
                      cy="50%"
                      innerRadius={30}
                      outerRadius={45}
                      labelLine={false}
                      label={({ name, percent }) =>
                        `${name}: ${(percent * 100).toFixed(0)}%`
                      }
                      paddingAngle={2}
                      dataKey="value"
                      blendStroke={true}
                    >
                      {songCategoryData.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={COLORS[index % COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(value) => [`${value}%`]}
                      contentStyle={{
                        backgroundColor: '#1e293b',
                        border: 'none',
                        borderRadius: '8px',
                        fontSize: '12px',
                      }}
                      itemStyle={{ color: '#e2e8f0' }}
                      labelStyle={{ color: '#e2e8f0', fontWeight: 'bold' }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              <div className="mt-2 grid grid-cols-2 gap-1">
                {songCategoryData.map((category, index) => (
                  <div key={index} className="flex items-center space-x-1.5">
                    <div
                      className="w-2.5 h-2.5 rounded-full"
                      style={{
                        backgroundColor: COLORS[index % COLORS.length],
                      }}
                    ></div>
                    <span className="text-xs text-slate-500 dark:text-slate-400">
                      {category.name}
                    </span>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-white dark:bg-slate-800 shadow-md rounded-2xl p-5 col-span-1 border border-slate-200 dark:border-slate-700 flex flex-col">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
                Répertoire
              </h3>

              <div className="flex-grow flex items-center justify-center">
                <ResponsiveContainer width="100%" height={160}>
                  <PieChart>
                    <Pie
                      data={songCategoryData}
                      cx="50%"
                      cy="50%"
                      innerRadius={30}
                      outerRadius={45}
                      paddingAngle={2}
                      labelLine={false}
                      label={({ name, percent }) =>
                        `${name}: ${(percent * 100).toFixed(0)}%`
                      }
                      dataKey="value"
                      blendStroke={true}
                    >
                      {songCategoryData.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={COLORS[index % COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(value) => [`${value}%`]}
                      contentStyle={{
                        backgroundColor: '#1e293b',
                        border: 'none',
                        borderRadius: '8px',
                        fontSize: '12px',
                      }}
                      itemStyle={{ color: '#e2e8f0' }}
                      labelStyle={{ color: '#e2e8f0', fontWeight: 'bold' }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              <div className="mt-2 grid grid-cols-2 gap-1">
                {songCategoryData.map((category, index) => (
                  <div key={index} className="flex items-center space-x-1.5">
                    <div
                      className="w-2.5 h-2.5 rounded-full"
                      style={{
                        backgroundColor: COLORS[index % COLORS.length],
                      }}
                    ></div>
                    <span className="text-xs text-slate-500 dark:text-slate-400">
                      {category.name}
                    </span>
                  </div>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-1 gap-4">
              <InfoTile
                title="Temps total de pratique"
                value="18h 45min"
                description="Temps cumulé pour ce mois-ci"
                icon={<IconClock size={24} />}
                trend={{ value: '+12%', isPositive: true }}
              />
              <InfoTile
                title="Morceaux dans la bibliothèque"
                value="128"
                description="32 morceaux commencés"
                icon={<IconBook size={24} />}
                trend={{ value: '+3', isPositive: true }}
              />
            </div>
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
              {recentScores.slice(0, 3).map((score) => (
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

          {/* Carte de défis avec animation */}
          <div className="mt-6 mb-6 bg-gradient-to-r from-violet-500/10 to-purple-500/10 dark:from-violet-900/20 dark:to-purple-900/20 rounded-2xl overflow-hidden border border-purple-200 dark:border-purple-900/30 shadow-md relative">
            <div className="absolute top-0 right-0 w-64 h-64 bg-purple-300/20 dark:bg-purple-500/10 rounded-full -mt-20 -mr-20 blur-2xl"></div>
            <div className="absolute bottom-0 left-0 w-40 h-40 bg-indigo-300/20 dark:bg-indigo-500/10 rounded-full -mb-10 -ml-10 blur-xl"></div>

            <div className="p-6 relative z-10">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                    Défi hebdomadaire
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-300 mt-1">
                    Pratiquez 30 minutes par jour pendant 7 jours consécutifs
                  </p>
                </div>
                <div className="flex items-center justify-center w-16 h-16 rounded-full bg-white/80 dark:bg-slate-800/80 border-4 border-purple-100 dark:border-purple-900/40">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                      5
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 -mt-1">
                      jours
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-4">
                <div className="w-full h-3 bg-white/50 dark:bg-slate-700/50 rounded-full overflow-hidden mb-2">
                  <div
                    className="h-full bg-gradient-to-r from-violet-500 to-purple-500 rounded-full"
                    style={{ width: '70%' }}
                  ></div>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-600 dark:text-slate-400">
                    Progression: 70%
                  </span>
                  <span className="text-purple-600 dark:text-purple-400 font-medium">
                    5/7 jours
                  </span>
                </div>
              </div>

              <div className="mt-4 flex items-center">
                <div className="flex items-center text-amber-600 dark:text-amber-400 mr-3">
                  <IconStar size={18} className="mr-1" />
                  <span className="text-sm font-medium">+150 points</span>
                </div>
                <div className="flex items-center text-emerald-600 dark:text-emerald-400">
                  <IconTrendingUp size={18} className="mr-1" />
                  <span className="text-sm font-medium">+3 niveau</span>
                </div>
                <div className="ml-auto">
                  <button className="bg-white dark:bg-slate-700 text-purple-600 dark:text-purple-400 border border-purple-200 dark:border-purple-800/30 hover:bg-purple-50 dark:hover:bg-purple-900/20 py-2 px-4 rounded-lg text-sm font-medium transition-colors">
                    Voir tous les défis
                  </button>
                </div>
              </div>
            </div>
          </div>
        </Tabs.Content>
        <Tabs.Content value="history" className="focus:outline-none">
          <div className="text-center p-8 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
              Historique des sessions
            </h3>
            <p className="text-slate-500 dark:text-slate-400 mt-2">
              Cette section affichera l'historique complet de vos sessions de
              jeu.
            </p>
          </div>
        </Tabs.Content>
        <Tabs.Content value="playedSongs" className="focus:outline-none">
          <div className="text-center p-8 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
              Chansons Jouées
            </h3>
            <p className="text-slate-500 dark:text-slate-400 mt-2">
              Cette section listera toutes les chansons que vous avez jouées,
              avec vos statistiques pour chacune.
            </p>
          </div>
        </Tabs.Content>
      </Tabs.Root>
    </div>
  );
}
