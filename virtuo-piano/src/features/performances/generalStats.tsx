'use client';

import React, { useState } from 'react';

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

// Exemple avec plus de styles pour tester le regroupement
const extendedSongCategoryData = [
  { name: 'Classique', value: 35 },
  { name: 'Jazz', value: 20 },
  { name: 'Pop', value: 18 },
  { name: 'Rock', value: 12 },
  { name: 'Blues', value: 8 },
  { name: 'Folk', value: 6 },
  { name: 'Country', value: 4 },
  { name: 'Reggae', value: 3 },
  { name: 'Hip-Hop', value: 2 },
  { name: 'Électronique', value: 2 },
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
  return (
    <div className="w-full p-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <PieChartCard
          title="Répertoire (5 styles max)"
          data={songCategoryData}
          colors={COLORS}
          showLabels={true}
          maxCategories={5}
          minPercentage={5}
        />
        <PieChartCard
          title="Répertoire caca (regroupement auto)"
          data={extendedSongCategoryData}
          colors={COLORS}
          showLabels={true}
          maxCategories={10}
          minPercentage={50}
        />
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
    </div>
  );
}
