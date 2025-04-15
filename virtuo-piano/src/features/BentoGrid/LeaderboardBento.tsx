'use client';

import React, { useState } from 'react';
import {
  IconTrophy,
  IconUsers,
  IconMedal,
  IconArrowUp,
  IconFlame,
  IconStar,
  IconChartLine,
  IconCrown,
  IconMicrophone,
  IconMusic,
  IconCheck,
  IconChevronRight,
  IconFilter,
  IconCalendar,
  IconShare,
  IconMapPin,
  IconWorld,
  IconBadge,
  IconBulb,
  IconActivity,
  IconHistory,
  IconPlayerTrackNext,
  IconDeviceGamepad,
} from '@tabler/icons-react';
import * as Progress from '@radix-ui/react-progress';
import * as Avatar from '@radix-ui/react-avatar';
import * as Tabs from '@radix-ui/react-tabs';

// Types d'utilisateurs pour le classement
type UserRank = {
  id: number;
  name: string;
  avatar?: string;
  score: number;
  rank: number;
  progress: number;
  streak: number;
  badge: string;
  change: number; // Changement de position
  songs: number; // Nombre de chansons maîtrisées
};

// Type pour les compétitions
type Competition = {
  id: number;
  title: string;
  startDate: string;
  endDate: string;
  participants: number;
  isActive: boolean;
  difficulty: 'facile' | 'moyen' | 'difficile' | 'expert';
  reward: number;
  theme?: string;
};

// Type pour les badges
type Badge = {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  rarity: 'commun' | 'rare' | 'épique' | 'légendaire';
  acquired: boolean;
};

// Type pour les récompenses et niveaux
type Reward = {
  id: number;
  name: string;
  type: 'avatar' | 'badge' | 'thème' | 'morceau';
  icon: React.ReactNode;
  description: string;
  requiredPoints: number;
  claimed: boolean;
};

// Données fictives pour le classement
const topUsers: UserRank[] = [
  {
    id: 1,
    name: 'Thomas Dubois',
    avatar: '/avatars/1.jpg',
    score: 12850,
    rank: 1,
    progress: 92,
    streak: 15,
    badge: 'Virtuose',
    change: 0,
    songs: 42,
  },
  {
    id: 2,
    name: 'Marie Laurent',
    avatar: '/avatars/2.jpg',
    score: 10750,
    rank: 2,
    progress: 88,
    streak: 12,
    badge: 'Maestro',
    change: 1,
    songs: 38,
  },
  {
    id: 3,
    name: 'Lucas Martin',
    avatar: '/avatars/3.jpg',
    score: 9800,
    rank: 3,
    progress: 85,
    streak: 8,
    badge: 'Expert',
    change: -1,
    songs: 35,
  },
  {
    id: 4,
    name: 'Sophie Renard',
    avatar: '/avatars/4.jpg',
    score: 8950,
    rank: 4,
    progress: 79,
    streak: 7,
    badge: 'Pianiste Confirmé',
    change: 2,
    songs: 32,
  },
  {
    id: 5,
    name: 'Alex Mercier',
    avatar: '/avatars/5.jpg',
    score: 8200,
    rank: 5,
    progress: 76,
    streak: 5,
    badge: 'Pianiste Confirmé',
    change: -1,
    songs: 27,
  },
];

// Données de l'utilisateur actuel
const currentUser: UserRank = {
  id: 23,
  name: 'Jean Dupont',
  avatar: '/avatars/user.jpg',
  score: 4250,
  rank: 23,
  progress: 68,
  streak: 4,
  badge: 'Intermédiaire',
  change: 3,
  songs: 18,
};

// Utilisateurs amis
const friendUsers: UserRank[] = [
  {
    id: 8,
    name: 'Claire Blanc',
    avatar: '/avatars/8.jpg',
    score: 7200,
    rank: 8,
    progress: 72,
    streak: 6,
    badge: 'Pianiste Avancé',
    change: 1,
    songs: 25,
  },
  {
    id: 15,
    name: 'Pierre Dumont',
    avatar: '/avatars/15.jpg',
    score: 5100,
    rank: 15,
    progress: 63,
    streak: 3,
    badge: 'Intermédiaire',
    change: -2,
    songs: 21,
  },
  {
    id: 23,
    name: 'Jean Dupont',
    avatar: '/avatars/user.jpg',
    score: 4250,
    rank: 23,
    progress: 68,
    streak: 4,
    badge: 'Intermédiaire',
    change: 3,
    songs: 18,
  },
  {
    id: 27,
    name: 'Émilie Rousseau',
    avatar: '/avatars/27.jpg',
    score: 3950,
    rank: 27,
    progress: 58,
    streak: 2,
    badge: 'Intermédiaire',
    change: -1,
    songs: 16,
  },
];

// Défis hebdomadaires
const challenges = [
  {
    id: 1,
    title: '5 jours consécutifs',
    description: 'Pratiquez 5 jours de suite',
    reward: 500,
    progress: 80,
    icon: <IconFlame size={20} className="text-orange-500" />,
  },
  {
    id: 2,
    title: 'Maître du rythme',
    description: 'Obtenez 95% en précision rythmique',
    reward: 300,
    progress: 65,
    icon: <IconMicrophone size={20} className="text-purple-500" />,
  },
  {
    id: 3,
    title: 'Explorateur musical',
    description: 'Jouez 3 nouveaux morceaux',
    reward: 250,
    progress: 33,
    icon: <IconMusic size={20} className="text-blue-500" />,
  },
];

// Données pour les compétitions
const competitions: Competition[] = [
  {
    id: 1,
    title: 'Concours mensuel - La magie de Mozart',
    startDate: '2023-11-01',
    endDate: '2023-11-30',
    participants: 234,
    isActive: true,
    difficulty: 'moyen',
    reward: 1500,
    theme: 'Musique classique',
  },
  {
    id: 2,
    title: 'Défi du weekend - Rythmes modernes',
    startDate: '2023-11-10',
    endDate: '2023-11-12',
    participants: 126,
    isActive: true,
    difficulty: 'facile',
    reward: 500,
    theme: 'Pop contemporaine',
  },
  {
    id: 3,
    title: 'Tournoi des virtuoses',
    startDate: '2023-12-01',
    endDate: '2023-12-15',
    participants: 78,
    isActive: false,
    difficulty: 'expert',
    reward: 3000,
    theme: 'Morceaux techniques',
  },
];

// Données pour les badges
const badges: Badge[] = [
  {
    id: 'speed-demon',
    name: 'As de la vitesse',
    description: 'Jouez 10 morceaux à tempo rapide avec une précision de 90%+',
    icon: <IconActivity size={16} />,
    color: 'text-red-500',
    rarity: 'rare',
    acquired: true,
  },
  {
    id: 'perfect-streak',
    name: 'Sans faute',
    description: 'Complétez 5 morceaux avec 100% de précision',
    icon: <IconCheck size={16} />,
    color: 'text-emerald-500',
    rarity: 'épique',
    acquired: true,
  },
  {
    id: 'explorer',
    name: 'Explorateur musical',
    description: 'Jouez des morceaux de 10 compositeurs différents',
    icon: <IconWorld size={16} />,
    color: 'text-blue-500',
    rarity: 'commun',
    acquired: true,
  },
  {
    id: 'maestro',
    name: 'Maestro',
    description: 'Atteignez le niveau 25 et maîtrisez 50 morceaux',
    icon: <IconCrown size={16} />,
    color: 'text-amber-500',
    rarity: 'légendaire',
    acquired: false,
  },
  {
    id: 'dedication',
    name: 'Dévouement',
    description: 'Pratiquez pendant 30 jours consécutifs',
    icon: <IconFlame size={16} />,
    color: 'text-orange-500',
    rarity: 'rare',
    acquired: false,
  },
];

// Données pour les récompenses
const rewards: Reward[] = [
  {
    id: 1,
    name: 'Avatar Piano à queue',
    type: 'avatar',
    icon: <IconBadge size={18} />,
    description: "Un avatar exclusif d'un piano à queue doré",
    requiredPoints: 2000,
    claimed: true,
  },
  {
    id: 2,
    name: "Badge 'Compositeur en herbe'",
    type: 'badge',
    icon: <IconBulb size={18} />,
    description: 'Un badge spécial qui montre votre créativité',
    requiredPoints: 3500,
    claimed: false,
  },
  {
    id: 3,
    name: "Thème 'Nuit étoilée'",
    type: 'thème',
    icon: <IconShare size={18} />,
    description: "Un magnifique thème d'interface inspiré de Van Gogh",
    requiredPoints: 5000,
    claimed: false,
  },
  {
    id: 4,
    name: "Morceau exclusif 'Clair de Lune'",
    type: 'morceau',
    icon: <IconMusic size={18} />,
    description: 'Un arrangement exclusif du célèbre morceau de Debussy',
    requiredPoints: 7500,
    claimed: false,
  },
];

// Composant Avatar personnalisé
function UserAvatar({
  name,
  image,
  size = 'md',
}: {
  name: string;
  image?: string;
  size?: 'sm' | 'md' | 'lg';
}) {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-14 h-14',
  };

  return (
    <Avatar.Root
      className={`inline-flex items-center justify-center align-middle overflow-hidden rounded-full bg-slate-200 ${sizeClasses[size]}`}
    >
      <Avatar.Image
        className="h-full w-full object-cover"
        src={image || ''}
        alt={name}
      />
      <Avatar.Fallback className="w-full h-full flex items-center justify-center bg-indigo-500 text-white text-sm font-medium">
        {name
          .split(' ')
          .map((n) => n[0])
          .join('')}
      </Avatar.Fallback>
    </Avatar.Root>
  );
}

// Composant de barre de progression
function ProgressBar({
  value,
  colorClass = 'bg-indigo-500',
}: {
  value: number;
  colorClass?: string;
}) {
  return (
    <Progress.Root
      className="relative overflow-hidden bg-slate-200 dark:bg-slate-700 rounded-full w-full h-2"
      value={value}
    >
      <Progress.Indicator
        className={`h-full transition-transform duration-500 ease-in-out rounded-full ${colorClass}`}
        style={{ transform: `translateX(-${100 - value}%)` }}
      />
    </Progress.Root>
  );
}

// Composant de badge de difficulté
function DifficultyBadge({
  difficulty,
}: {
  difficulty: Competition['difficulty'];
}) {
  const colorMap = {
    facile:
      'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300',
    moyen: 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300',
    difficile:
      'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300',
    expert:
      'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300',
  };

  return (
    <span
      className={`text-xs font-medium px-2 py-0.5 rounded-full ${colorMap[difficulty]}`}
    >
      {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
    </span>
  );
}

// Composant de badge de rareté
function RarityBadge({
  rarity,
  acquired,
}: {
  rarity: Badge['rarity'];
  acquired: boolean;
}) {
  const colorMap = {
    commun: 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300',
    rare: 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300',
    épique:
      'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300',
    légendaire:
      'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300',
  };

  return (
    <span
      className={`text-xs font-medium px-2 py-0.5 rounded-full ${
        colorMap[rarity]
      } ${!acquired ? 'opacity-60' : ''}`}
    >
      {rarity.charAt(0).toUpperCase() + rarity.slice(1)}
    </span>
  );
}

// Composant de carte de compétition
function CompetitionCard({ competition }: { competition: Competition }) {
  return (
    <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-4 hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-2">
        <h3 className="font-semibold text-slate-900 dark:text-white">
          {competition.title}
        </h3>
        <DifficultyBadge difficulty={competition.difficulty} />
      </div>

      <div className="text-xs text-slate-500 dark:text-slate-400 mb-3 flex items-center">
        <IconCalendar size={14} className="mr-1" />
        {new Date(competition.startDate).toLocaleDateString()} -{' '}
        {new Date(competition.endDate).toLocaleDateString()}
      </div>

      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center text-xs text-slate-600 dark:text-slate-400">
          <IconUsers size={14} className="mr-1" />
          {competition.participants} participants
        </div>
        <div className="flex items-center text-xs font-medium text-indigo-600 dark:text-indigo-400">
          <IconTrophy size={14} className="mr-1" />+{competition.reward} points
        </div>
      </div>

      {competition.theme && (
        <div className="flex items-center text-xs text-slate-500 dark:text-slate-400 mb-3">
          <IconMusic size={14} className="mr-1" />
          Thème: {competition.theme}
        </div>
      )}

      <button
        className={`w-full py-1.5 px-3 rounded text-xs font-medium ${
          competition.isActive
            ? 'bg-indigo-600 hover:bg-indigo-700 text-white'
            : 'bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-300'
        }`}
      >
        {competition.isActive ? 'Participer' : 'Rappel'}
      </button>
    </div>
  );
}

// Composant de carte de badge
function BadgeCard({ badge }: { badge: Badge }) {
  return (
    <div
      className={`bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-4 ${
        !badge.acquired ? 'opacity-70' : ''
      }`}
    >
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center">
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center ${
              badge.acquired
                ? 'bg-slate-100 dark:bg-slate-700'
                : 'bg-slate-100/50 dark:bg-slate-700/50'
            }`}
          >
            <span className={badge.color}>{badge.icon}</span>
          </div>
          <h3 className="ml-2 font-medium text-slate-900 dark:text-white text-sm">
            {badge.name}
          </h3>
        </div>
        <RarityBadge rarity={badge.rarity} acquired={badge.acquired} />
      </div>

      <p className="text-xs text-slate-500 dark:text-slate-400 mb-2">
        {badge.description}
      </p>

      {!badge.acquired && (
        <div className="flex justify-between items-center mt-2 text-xs">
          <span className="text-slate-500 dark:text-slate-400">Progrès</span>
          <span className="text-slate-700 dark:text-slate-300">0/1</span>
        </div>
      )}
    </div>
  );
}

// Composant de carte de récompense
function RewardCard({ reward }: { reward: Reward }) {
  return (
    <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-4">
      <div className="flex items-center mb-2">
        <div
          className={`w-8 h-8 rounded-full flex items-center justify-center ${
            reward.type === 'avatar'
              ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-600'
              : reward.type === 'badge'
              ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-600'
              : reward.type === 'thème'
              ? 'bg-amber-100 dark:bg-amber-900/30 text-amber-600'
              : 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600'
          }`}
        >
          {reward.icon}
        </div>
        <div className="ml-2">
          <h3 className="font-medium text-slate-900 dark:text-white text-sm">
            {reward.name}
          </h3>
          <div className="text-xs text-slate-500 dark:text-slate-400">
            {reward.type.charAt(0).toUpperCase() + reward.type.slice(1)}
          </div>
        </div>
      </div>

      <p className="text-xs text-slate-500 dark:text-slate-400 mb-3">
        {reward.description}
      </p>

      <div className="flex justify-between items-center mb-2">
        <div className="text-xs font-medium text-slate-700 dark:text-slate-300">
          {reward.requiredPoints} points requis
        </div>
        {reward.claimed ? (
          <span className="text-xs bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 px-2 py-0.5 rounded-full">
            Obtenu
          </span>
        ) : (
          <span className="text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-2 py-0.5 rounded-full">
            À débloquer
          </span>
        )}
      </div>

      {!reward.claimed && (
        <ProgressBar
          value={Math.min(
            Math.round((currentUser.score / reward.requiredPoints) * 100),
            100
          )}
          colorClass={
            reward.type === 'avatar'
              ? 'bg-blue-500'
              : reward.type === 'badge'
              ? 'bg-purple-500'
              : reward.type === 'thème'
              ? 'bg-amber-500'
              : 'bg-emerald-500'
          }
        />
      )}

      <button
        className={`w-full mt-3 py-1.5 px-3 rounded text-xs font-medium transition-colors ${
          reward.claimed
            ? 'bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-300'
            : currentUser.score >= reward.requiredPoints
            ? 'bg-indigo-600 hover:bg-indigo-700 text-white'
            : 'bg-slate-100 cursor-not-allowed opacity-70 dark:bg-slate-700 text-slate-500 dark:text-slate-400'
        }`}
      >
        {reward.claimed
          ? 'Déjà réclamé'
          : currentUser.score >= reward.requiredPoints
          ? 'Réclamer'
          : 'Débloquer'}
      </button>
    </div>
  );
}

// Composant de filtres de classement
function LeaderboardFilters({
  onFilterChange,
}: {
  onFilterChange: (filter: string) => void;
}) {
  return (
    <div className="flex flex-wrap gap-2 mb-4">
      <button
        onClick={() => onFilterChange('all')}
        className="px-3 py-1.5 bg-indigo-600 text-white rounded-lg text-xs font-medium hover:bg-indigo-700 transition-colors"
      >
        Tous
      </button>
      <button
        onClick={() => onFilterChange('friends')}
        className="px-3 py-1.5 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg text-xs font-medium hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
      >
        Amis
      </button>
      <button
        onClick={() => onFilterChange('region')}
        className="px-3 py-1.5 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg text-xs font-medium hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors flex items-center"
      >
        <IconMapPin size={12} className="mr-1" />
        Région
      </button>
      <button
        onClick={() => onFilterChange('level')}
        className="px-3 py-1.5 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg text-xs font-medium hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
      >
        Niveau similaire
      </button>
      <div className="ml-auto">
        <button className="px-3 py-1.5 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg text-xs font-medium hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors flex items-center">
          <IconFilter size={12} className="mr-1" />
          Plus de filtres
        </button>
      </div>
    </div>
  );
}

// Composant de statistiques récapitulatives
function StatsSummary() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
      <div className="bg-white dark:bg-slate-800 shadow-sm border border-slate-200 dark:border-slate-700 rounded-xl p-4">
        <div className="flex items-center mb-1">
          <IconCrown size={18} className="text-amber-500 mr-2" />
          <h3 className="text-sm font-medium text-slate-900 dark:text-white">
            Rang global
          </h3>
        </div>
        <div className="flex items-end justify-between">
          <div className="text-2xl font-bold text-slate-900 dark:text-white">
            {currentUser.rank}
          </div>
          <div
            className={`text-xs flex items-center ${
              currentUser.change > 0
                ? 'text-emerald-500'
                : currentUser.change < 0
                ? 'text-rose-500'
                : 'text-slate-500'
            }`}
          >
            {currentUser.change > 0
              ? `+${currentUser.change}`
              : currentUser.change}
            <IconArrowUp
              size={12}
              className={`ml-0.5 ${currentUser.change < 0 ? 'rotate-180' : ''}`}
            />
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-800 shadow-sm border border-slate-200 dark:border-slate-700 rounded-xl p-4">
        <div className="flex items-center mb-1">
          <IconStar size={18} className="text-indigo-500 mr-2" />
          <h3 className="text-sm font-medium text-slate-900 dark:text-white">
            Points
          </h3>
        </div>
        <div className="flex items-end justify-between">
          <div className="text-2xl font-bold text-slate-900 dark:text-white">
            {currentUser.score}
          </div>
          <div className="text-xs text-slate-500">Cette saison</div>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-800 shadow-sm border border-slate-200 dark:border-slate-700 rounded-xl p-4">
        <div className="flex items-center mb-1">
          <IconBadge size={18} className="text-purple-500 mr-2" />
          <h3 className="text-sm font-medium text-slate-900 dark:text-white">
            Badges
          </h3>
        </div>
        <div className="flex items-end justify-between">
          <div className="text-2xl font-bold text-slate-900 dark:text-white">
            {badges.filter((b) => b.acquired).length}
          </div>
          <div className="text-xs text-slate-500">sur {badges.length}</div>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-800 shadow-sm border border-slate-200 dark:border-slate-700 rounded-xl p-4">
        <div className="flex items-center mb-1">
          <IconDeviceGamepad size={18} className="text-emerald-500 mr-2" />
          <h3 className="text-sm font-medium text-slate-900 dark:text-white">
            Niveau
          </h3>
        </div>
        <div className="flex items-end justify-between">
          <div className="text-2xl font-bold text-slate-900 dark:text-white">
            18
          </div>
          <div className="text-xs text-slate-500">Intermédiaire</div>
        </div>
      </div>
    </div>
  );
}

// Composant pour la vue de progression
function ProgressionView() {
  const nextRankProgress = 40; // Pour l'exemple
  const nextRankPoints = 1250; // Points nécessaires pour le rang suivant

  return (
    <div className="bg-white dark:bg-slate-800 shadow-md rounded-2xl p-5 border border-slate-200 dark:border-slate-700">
      <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-4 flex items-center">
        <IconChartLine size={20} className="mr-2 text-indigo-500" />
        Votre parcours compétitif
      </h2>

      <div className="space-y-5">
        <div className="bg-slate-50 dark:bg-slate-700/30 rounded-lg p-4">
          <h3 className="text-sm font-medium text-slate-900 dark:text-white mb-2">
            Prochain niveau
          </h3>
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs text-slate-500 dark:text-slate-400">
              Niveau 18
            </span>
            <span className="text-xs text-slate-500 dark:text-slate-400">
              Niveau 19
            </span>
          </div>
          <ProgressBar value={65} colorClass="bg-emerald-500" />
          <div className="flex justify-between items-center mt-2">
            <span className="text-xs text-slate-500 dark:text-slate-400">
              3250 XP
            </span>
            <span className="text-xs text-slate-500 dark:text-slate-400">
              5000 XP
            </span>
          </div>
          <div className="text-center mt-2">
            <span className="text-xs bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 px-2 py-0.5 rounded-full">
              1750 XP restants
            </span>
          </div>
        </div>

        <div className="bg-slate-50 dark:bg-slate-700/30 rounded-lg p-4">
          <h3 className="text-sm font-medium text-slate-900 dark:text-white mb-2">
            Prochain rang
          </h3>
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs text-slate-500 dark:text-slate-400">
              Rang {currentUser.rank}
            </span>
            <span className="text-xs text-slate-500 dark:text-slate-400">
              Rang {currentUser.rank - 1}
            </span>
          </div>
          <ProgressBar value={nextRankProgress} colorClass="bg-indigo-500" />
          <div className="flex justify-between items-center mt-2">
            <span className="text-xs text-slate-500 dark:text-slate-400">
              {currentUser.score} pts
            </span>
            <span className="text-xs text-slate-500 dark:text-slate-400">
              {currentUser.score + nextRankPoints} pts
            </span>
          </div>
          <div className="text-center mt-2">
            <span className="text-xs bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 px-2 py-0.5 rounded-full">
              {nextRankPoints} pts restants
            </span>
          </div>
        </div>

        <div className="bg-slate-50 dark:bg-slate-700/30 rounded-lg p-4">
          <h3 className="text-sm font-medium text-slate-900 dark:text-white mb-2">
            Historique des rangs
          </h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-6 h-6 rounded-full bg-slate-200 dark:bg-slate-600 flex items-center justify-center text-xs font-medium text-slate-800 dark:text-slate-200">
                  27
                </div>
                <span className="ml-2 text-sm text-slate-700 dark:text-slate-300">
                  Débutant
                </span>
              </div>
              <span className="text-xs text-slate-500 dark:text-slate-400">
                Il y a 3 mois
              </span>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-6 h-6 rounded-full bg-slate-200 dark:bg-slate-600 flex items-center justify-center text-xs font-medium text-slate-800 dark:text-slate-200">
                  25
                </div>
                <span className="ml-2 text-sm text-slate-700 dark:text-slate-300">
                  Intermédiaire
                </span>
              </div>
              <span className="text-xs text-slate-500 dark:text-slate-400">
                Il y a 2 mois
              </span>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-6 h-6 rounded-full bg-slate-200 dark:bg-slate-600 flex items-center justify-center text-xs font-medium text-slate-800 dark:text-slate-200">
                  {currentUser.rank}
                </div>
                <span className="ml-2 text-sm text-slate-700 dark:text-slate-300">
                  Intermédiaire
                </span>
              </div>
              <span className="text-xs text-slate-500 dark:text-slate-400">
                Actuel
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Composant principal pour la page de classement
export function LeaderboardBento() {
  const [activeTab, setActiveTab] = useState('ranking');
  const [currentFilter, setCurrentFilter] = useState('all');

  const handleFilterChange = (filter: string) => {
    setCurrentFilter(filter);
  };

  return (
    <div className="w-full p-4">
      {/* Onglets de navigation */}
      <Tabs.Root value={activeTab} onValueChange={setActiveTab}>
        <div className="flex items-center border-b border-slate-200 dark:border-slate-700 mb-6">
          <Tabs.List
            className="flex space-x-4"
            aria-label="Sections du classement"
          >
            <Tabs.Trigger
              value="ranking"
              className={`pb-2 px-1 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'ranking'
                  ? 'border-indigo-500 text-indigo-600 dark:text-indigo-400'
                  : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-300'
              }`}
            >
              <div className="flex items-center">
                <IconTrophy size={16} className="mr-1" />
                Classement
              </div>
            </Tabs.Trigger>

            <Tabs.Trigger
              value="competitions"
              className={`pb-2 px-1 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'competitions'
                  ? 'border-indigo-500 text-indigo-600 dark:text-indigo-400'
                  : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-300'
              }`}
            >
              <div className="flex items-center">
                <IconMedal size={16} className="mr-1" />
                Compétitions
              </div>
            </Tabs.Trigger>

            <Tabs.Trigger
              value="rewards"
              className={`pb-2 px-1 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'rewards'
                  ? 'border-indigo-500 text-indigo-600 dark:text-indigo-400'
                  : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-300'
              }`}
            >
              <div className="flex items-center">
                <IconStar size={16} className="mr-1" />
                Récompenses
              </div>
            </Tabs.Trigger>

            <Tabs.Trigger
              value="badges"
              className={`pb-2 px-1 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'badges'
                  ? 'border-indigo-500 text-indigo-600 dark:text-indigo-400'
                  : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-300'
              }`}
            >
              <div className="flex items-center">
                <IconBadge size={16} className="mr-1" />
                Badges
              </div>
            </Tabs.Trigger>

            <Tabs.Trigger
              value="progress"
              className={`pb-2 px-1 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'progress'
                  ? 'border-indigo-500 text-indigo-600 dark:text-indigo-400'
                  : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-300'
              }`}
            >
              <div className="flex items-center">
                <IconChartLine size={16} className="mr-1" />
                Progression
              </div>
            </Tabs.Trigger>
          </Tabs.List>
        </div>

        <StatsSummary />

        <Tabs.Content value="ranking" className="focus:outline-none">
          {/* En-tête avec statistiques */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div className="bg-white dark:bg-slate-800 shadow-md rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-700 p-5">
              <div className="flex items-center justify-between mb-4">
                <h1 className="text-xl font-bold text-slate-900 dark:text-white flex items-center">
                  <IconTrophy size={24} className="mr-2 text-amber-500" />
                  Classement Général
                </h1>
                <div className="bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 text-xs font-medium px-2.5 py-1 rounded-full">
                  Saison 3
                </div>
              </div>

              <div className="flex items-center mb-2">
                <div className="flex">
                  <UserAvatar
                    name={currentUser.name}
                    image={currentUser.avatar}
                    size="lg"
                  />
                  <div className="ml-3">
                    <div className="flex items-center">
                      <p className="text-lg font-semibold text-slate-900 dark:text-white">
                        {currentUser.name}
                      </p>
                      <div className="ml-2 bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 text-xs px-2 py-0.5 rounded-full">
                        {currentUser.badge}
                      </div>
                    </div>
                    <div className="flex items-center space-x-2 mt-1">
                      <div className="bg-slate-100 dark:bg-slate-700 px-2 py-0.5 rounded text-xs flex items-center">
                        <IconCrown size={14} className="text-amber-500 mr-1" />
                        Rang {currentUser.rank}
                      </div>
                      <div className="bg-slate-100 dark:bg-slate-700 px-2 py-0.5 rounded text-xs flex items-center">
                        <IconStar size={14} className="text-indigo-500 mr-1" />
                        {currentUser.score} pts
                      </div>
                      <div className="bg-slate-100 dark:bg-slate-700 px-2 py-0.5 rounded text-xs flex items-center">
                        <IconFlame size={14} className="text-orange-500 mr-1" />
                        {currentUser.streak} jours
                      </div>
                    </div>
                  </div>
                </div>
                <div className="ml-auto text-right">
                  <div
                    className={`flex items-center justify-end ${
                      currentUser.change > 0
                        ? 'text-emerald-500'
                        : currentUser.change < 0
                        ? 'text-rose-500'
                        : 'text-slate-500'
                    }`}
                  >
                    {currentUser.change > 0 ? (
                      <>
                        +{currentUser.change}{' '}
                        <IconArrowUp size={16} className="ml-0.5" />
                      </>
                    ) : currentUser.change < 0 ? (
                      <>
                        {currentUser.change}{' '}
                        <IconArrowUp size={16} className="ml-0.5 rotate-180" />
                      </>
                    ) : (
                      <>
                        = <span className="ml-0.5">—</span>
                      </>
                    )}
                  </div>
                  <div className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                    depuis la semaine dernière
                  </div>
                </div>
              </div>

              <div className="mt-4">
                <div className="flex justify-between items-center text-sm mb-1">
                  <span className="text-slate-500 dark:text-slate-400">
                    Progression niveau
                  </span>
                  <span className="text-slate-700 dark:text-slate-300 font-medium">
                    {currentUser.progress}%
                  </span>
                </div>
                <ProgressBar value={currentUser.progress} />
              </div>
            </div>

            <div className="bg-white dark:bg-slate-800 shadow-md rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-700 p-5">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center">
                  <IconFlame size={20} className="mr-2 text-orange-500" />
                  Défis hebdomadaires
                </h2>
                <div className="bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-medium px-2.5 py-1 rounded-full">
                  3 défis en cours
                </div>
              </div>

              <div className="space-y-4">
                {challenges.map((challenge) => (
                  <div
                    key={challenge.id}
                    className="bg-slate-50 dark:bg-slate-700/40 rounded-lg p-3"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center">
                        {challenge.icon}
                        <span className="ml-2 font-medium text-slate-800 dark:text-slate-200">
                          {challenge.title}
                        </span>
                      </div>
                      <div className="bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 text-xs px-2 py-0.5 rounded-full">
                        +{challenge.reward} pts
                      </div>
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mb-2">
                      {challenge.description}
                    </p>
                    <div className="flex items-center justify-between">
                      <ProgressBar
                        value={challenge.progress}
                        colorClass={
                          challenge.progress >= 100
                            ? 'bg-emerald-500'
                            : 'bg-indigo-500'
                        }
                      />
                      <span className="ml-2 text-xs text-slate-500 dark:text-slate-400">
                        {challenge.progress}%
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              <button className="w-full mt-4 bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-300 py-2 px-4 rounded-lg text-sm font-medium transition-colors flex items-center justify-center">
                Voir tous les défis{' '}
                <IconChevronRight size={16} className="ml-1" />
              </button>
            </div>
          </div>

          {/* Filtres du classement */}
          <LeaderboardFilters onFilterChange={handleFilterChange} />

          {/* Tableau des Top 5 */}
          <div className="grid grid-cols-1 gap-4 mb-6">
            <div className="bg-white dark:bg-slate-800 shadow-md rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-700 p-5">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center">
                  <IconMedal size={20} className="mr-2 text-amber-500" />
                  Top 5 Global
                </h2>
                <div className="bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-medium px-2.5 py-1 rounded">
                  Mise à jour: Aujourd'hui
                </div>
              </div>

              <div className="space-y-3">
                {topUsers.map((user, index) => (
                  <div
                    key={user.id}
                    className={`rounded-lg p-3 ${
                      index === 0
                        ? 'bg-gradient-to-r from-amber-50/80 to-amber-100/80 dark:from-amber-900/20 dark:to-amber-800/20 border border-amber-200/50 dark:border-amber-800/30'
                        : 'bg-slate-50 dark:bg-slate-700/40'
                    }`}
                  >
                    <div className="flex items-center">
                      <div
                        className={`w-8 h-8 flex items-center justify-center rounded-full ${
                          index === 0
                            ? 'bg-amber-500 text-white'
                            : index === 1
                            ? 'bg-slate-400 text-white'
                            : index === 2
                            ? 'bg-amber-700 text-white'
                            : 'bg-slate-200 dark:bg-slate-600 text-slate-700 dark:text-slate-300'
                        } font-bold text-sm mr-3`}
                      >
                        {user.rank}
                      </div>

                      <UserAvatar name={user.name} image={user.avatar} />

                      <div className="ml-3 flex-grow">
                        <div className="flex items-center">
                          <p className="text-sm font-medium text-slate-900 dark:text-white">
                            {user.name}
                          </p>
                          <div className="ml-2 text-xs px-1.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-700/60 text-slate-700 dark:text-slate-300">
                            {user.badge}
                          </div>
                        </div>
                        <div className="flex items-center mt-0.5">
                          <div className="w-24 mr-2">
                            <ProgressBar
                              value={user.progress}
                              colorClass={
                                index === 0
                                  ? 'bg-amber-500'
                                  : index === 1
                                  ? 'bg-slate-400'
                                  : index === 2
                                  ? 'bg-amber-700'
                                  : 'bg-indigo-500'
                              }
                            />
                          </div>
                          <span className="text-xs text-slate-500 dark:text-slate-400">
                            {user.progress}%
                          </span>
                        </div>
                      </div>

                      <div className="text-right">
                        <div className="text-sm font-semibold text-slate-900 dark:text-white">
                          {user.score} pts
                        </div>
                        <div
                          className={`text-xs flex items-center justify-end ${
                            user.change > 0
                              ? 'text-emerald-500'
                              : user.change < 0
                              ? 'text-rose-500'
                              : 'text-slate-500'
                          }`}
                        >
                          {user.change > 0 ? (
                            <>
                              +{user.change}{' '}
                              <IconArrowUp size={12} className="ml-0.5" />
                            </>
                          ) : user.change < 0 ? (
                            <>
                              {user.change}{' '}
                              <IconArrowUp
                                size={12}
                                className="ml-0.5 rotate-180"
                              />
                            </>
                          ) : (
                            <>
                              = <span className="ml-0.5">—</span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <button className="w-full mt-4 bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 rounded-lg text-sm font-medium transition-colors">
                Voir le classement complet
              </button>
            </div>
          </div>

          {/* Statistiques et classement des amis */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2 bg-white dark:bg-slate-800 shadow-md rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-700 p-5">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center">
                  <IconUsers size={20} className="mr-2 text-blue-500" />
                  Classement des amis
                </h2>
                <button className="text-xs text-indigo-600 dark:text-indigo-400 hover:underline">
                  Inviter des amis
                </button>
              </div>

              <div className="space-y-3">
                {friendUsers.map((user) => (
                  <div
                    key={user.id}
                    className={`rounded-lg p-3 ${
                      user.id === currentUser.id
                        ? 'bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-200 dark:border-indigo-800/30'
                        : 'bg-slate-50 dark:bg-slate-700/40'
                    }`}
                  >
                    <div className="flex items-center">
                      <div className="w-8 h-8 flex items-center justify-center rounded-full bg-slate-200 dark:bg-slate-600 text-slate-700 dark:text-slate-300 font-bold text-sm mr-3">
                        {user.rank}
                      </div>

                      <UserAvatar name={user.name} image={user.avatar} />

                      <div className="ml-3 flex-grow">
                        <p className="text-sm font-medium text-slate-900 dark:text-white">
                          {user.name}
                        </p>
                        <div className="flex items-center mt-0.5 text-xs text-slate-500 dark:text-slate-400">
                          <IconMusic size={14} className="mr-1" />
                          {user.songs} morceaux maîtrisés
                        </div>
                      </div>

                      <div className="text-right">
                        <div className="text-sm font-semibold text-slate-900 dark:text-white">
                          {user.score} pts
                        </div>
                        <div
                          className={`text-xs flex items-center justify-end ${
                            user.change > 0
                              ? 'text-emerald-500'
                              : user.change < 0
                              ? 'text-rose-500'
                              : 'text-slate-500'
                          }`}
                        >
                          {user.change > 0 ? (
                            <>
                              +{user.change}{' '}
                              <IconArrowUp size={12} className="ml-0.5" />
                            </>
                          ) : user.change < 0 ? (
                            <>
                              {user.change}{' '}
                              <IconArrowUp
                                size={12}
                                className="ml-0.5 rotate-180"
                              />
                            </>
                          ) : (
                            <>
                              = <span className="ml-0.5">—</span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white dark:bg-slate-800 shadow-md rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-700 p-5">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center">
                  <IconChartLine size={20} className="mr-2 text-emerald-500" />
                  Votre progression
                </h2>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-slate-50 dark:bg-slate-700/40 rounded-lg p-3 text-center">
                    <div className="text-2xl font-bold text-slate-900 dark:text-white">
                      {currentUser.songs}
                    </div>
                    <div className="text-xs text-slate-500 dark:text-slate-400">
                      Morceaux maîtrisés
                    </div>
                  </div>
                  <div className="bg-slate-50 dark:bg-slate-700/40 rounded-lg p-3 text-center">
                    <div className="text-2xl font-bold text-slate-900 dark:text-white">
                      {currentUser.streak}
                    </div>
                    <div className="text-xs text-slate-500 dark:text-slate-400">
                      Jours consécutifs
                    </div>
                  </div>
                </div>

                <div className="bg-slate-50 dark:bg-slate-700/40 rounded-lg p-3">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                      Prochain rang
                    </span>
                    <span className="text-xs text-slate-500 dark:text-slate-400">
                      1250 pts restants
                    </span>
                  </div>
                  <ProgressBar value={40} colorClass="bg-emerald-500" />
                  <div className="flex justify-between mt-2">
                    <div className="text-xs text-slate-500 dark:text-slate-400">
                      Intermédiaire
                    </div>
                    <div className="text-xs text-slate-500 dark:text-slate-400">
                      Pianiste Avancé
                    </div>
                  </div>
                </div>

                <div className="bg-slate-50 dark:bg-slate-700/40 rounded-lg p-3">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                      Objectif mensuel
                    </span>
                    <span className="text-xs bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 px-2 py-0.5 rounded-full flex items-center">
                      <IconCheck size={12} className="mr-1" />
                      En bonne voie
                    </span>
                  </div>
                  <ProgressBar value={65} colorClass="bg-blue-500" />
                  <div className="flex justify-between mt-2">
                    <div className="text-xs text-slate-500 dark:text-slate-400">
                      Progression: 65%
                    </div>
                    <div className="text-xs text-slate-500 dark:text-slate-400">
                      13 jours restants
                    </div>
                  </div>
                </div>
              </div>

              <button className="w-full mt-4 bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-300 py-2 px-4 rounded-lg text-sm font-medium transition-colors">
                Voir mes statistiques détaillées
              </button>
            </div>
          </div>
        </Tabs.Content>

        <Tabs.Content value="competitions" className="focus:outline-none">
          <div className="bg-white dark:bg-slate-800 shadow-md rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-700 p-5 mb-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center">
                <IconTrophy size={20} className="mr-2 text-amber-500" />
                Compétitions actives
              </h2>
              <div className="flex space-x-2">
                <button className="px-3 py-1 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded text-xs font-medium hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors flex items-center">
                  <IconFilter size={14} className="mr-1" />
                  Filtrer
                </button>
                <button className="px-3 py-1 bg-indigo-600 hover:bg-indigo-700 text-white rounded text-xs font-medium transition-colors">
                  Voir l'historique
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {competitions
                .filter((comp) => comp.isActive)
                .map((competition) => (
                  <CompetitionCard
                    key={competition.id}
                    competition={competition}
                  />
                ))}
            </div>
          </div>

          <div className="bg-white dark:bg-slate-800 shadow-md rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-700 p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center">
                <IconPlayerTrackNext
                  size={20}
                  className="mr-2 text-indigo-500"
                />
                Compétitions à venir
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {competitions
                .filter((comp) => !comp.isActive)
                .map((competition) => (
                  <CompetitionCard
                    key={competition.id}
                    competition={competition}
                  />
                ))}
            </div>
          </div>
        </Tabs.Content>

        <Tabs.Content value="rewards" className="focus:outline-none">
          <div className="bg-white dark:bg-slate-800 shadow-md rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-700 p-5 mb-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center">
                <IconStar size={20} className="mr-2 text-amber-500" />
                Récompenses débloquables
              </h2>
              <div className="text-sm text-slate-500 dark:text-slate-400">
                Points actuels:{' '}
                <span className="font-medium text-indigo-600 dark:text-indigo-400">
                  {currentUser.score}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {rewards.map((reward) => (
                <RewardCard key={reward.id} reward={reward} />
              ))}
            </div>
          </div>
        </Tabs.Content>

        <Tabs.Content value="badges" className="focus:outline-none">
          <div className="bg-white dark:bg-slate-800 shadow-md rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-700 p-5 mb-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center">
                <IconBadge size={20} className="mr-2 text-purple-500" />
                Vos badges
              </h2>
              <div className="bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 text-xs font-medium px-2.5 py-1 rounded-full">
                {badges.filter((b) => b.acquired).length}/{badges.length}{' '}
                obtenus
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {badges.map((badge) => (
                <BadgeCard key={badge.id} badge={badge} />
              ))}
            </div>
          </div>
        </Tabs.Content>

        <Tabs.Content value="progress" className="focus:outline-none">
          <ProgressionView />
        </Tabs.Content>
      </Tabs.Root>
    </div>
  );
}

export default LeaderboardBento;
