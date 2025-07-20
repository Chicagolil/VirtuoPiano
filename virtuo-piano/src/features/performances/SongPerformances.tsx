'use client';

import { castMsToMin, getLearnScores } from '@/common/utils/function';
import { useEffect, useState, useTransition } from 'react';
import { useSong } from '@/contexts/SongContext';
import { useRouter } from 'next/navigation';
import {
  IconMusic,
  IconHeart,
  IconClock,
  IconChartBar,
  IconChevronRight,
  IconTrophy,
  IconTarget,
  IconTrendingUp,
  IconFlame,
  IconBolt,
  IconMedal,
  IconFlame as IconFire,
  IconTimeline,
  IconBadge,
  IconRocket,
  IconStar,
} from '@tabler/icons-react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import React from 'react';
import styles from '../library/Song.module.css';
import { toggleFavorite } from '@/lib/actions/songs';
import DifficultyBadge from '@/components/DifficultyBadge';
import { toast } from 'react-hot-toast';
import { SongBasicData } from '@/lib/services/performances-services';
import PerformanceBento from '../BentoGrid/PerformanceBento';
import BentoShadcnExample from '../BentoGrid/BentoShadcnExample';
import * as Separator from '@radix-ui/react-separator';
import UserAvatar from '@/components/badge/UserAvatar';
import ProgressBar from '@/components/ProgressBar';

const practiceData = [
  {
    name: 'Lun',
    pratique: 25,
    ecoute: 15,
    theorie: 10,
    total: 50,
  },
  {
    name: 'Mar',
    pratique: 40,
    ecoute: 20,
    theorie: 15,
    total: 75,
  },
  {
    name: 'Mer',
    pratique: 30,
    ecoute: 12,
    theorie: 8,
    total: 50,
  },
  {
    name: 'Jeu',
    pratique: 45,
    ecoute: 25,
    theorie: 20,
    total: 90,
  },
  {
    name: 'Ven',
    pratique: 20,
    ecoute: 10,
    theorie: 5,
    total: 35,
  },
  {
    name: 'Sam',
    pratique: 60,
    ecoute: 30,
    theorie: 25,
    total: 115,
  },
  {
    name: 'Dim',
    pratique: 35,
    ecoute: 18,
    theorie: 12,
    total: 65,
  },
];

// Composant de timeline des records
const RecordsTimeline = () => {
  const [selectedRecord, setSelectedRecord] = useState<number | null>(null);

  const records = [
    {
      id: 1,
      date: '2023-12-15',
      score: 0,
      type: 'start',
      description: "Début de l'apprentissage",
      details:
        "Première session d'apprentissage de ce morceau. Le voyage commence !",
    },
    {
      id: 2,
      date: '2023-12-15',
      score: 60,
      type: 'session',
      description: 'Session marathon',
      details: 'Session de 60 minutes non-stop, endurance remarquable !',
    },
    {
      id: 3,
      date: '2023-12-20',
      score: 85,
      type: 'accuracy_right',
      description: 'Précision main droite',
      details:
        '85% de précision atteinte avec la main droite. Progression remarquable !',
    },
    {
      id: 4,
      date: '2023-12-25',
      score: 78,
      type: 'accuracy_left',
      description: 'Précision main gauche',
      details:
        "78% de précision avec la main gauche. La coordination s'améliore !",
    },
    {
      id: 5,
      date: '2023-12-28',
      score: 4.2,
      type: 'multiplier',
      description: 'Multiplicateur maximal',
      details: 'Multiplicateur x4.2 atteint, performance exceptionnelle !',
    },
    {
      id: 6,
      date: '2024-01-02',
      score: 92,
      type: 'performance_right',
      description: 'Performance main droite',
      details:
        '92% de performance globale avec la main droite. Niveau expert !',
    },
    {
      id: 7,
      date: '2024-01-05',
      score: 847,
      type: 'combo',
      description: 'Combo record établi',
      details:
        '847 notes jouées consécutivement sans erreur, un combo historique !',
    },
    {
      id: 8,
      date: '2024-01-08',
      score: 88,
      type: 'performance_left',
      description: 'Performance main gauche',
      details: '88% de performance avec la main gauche. Équilibre parfait !',
    },
    {
      id: 9,
      date: '2024-01-10',
      score: 95,
      type: 'accuracy_both',
      description: 'Précision parfaite',
      details:
        '95% de précision avec les deux mains. Synchronisation parfaite !',
    },
    {
      id: 10,
      date: '2024-01-12',
      score: 94,
      type: 'performance_both',
      description: 'Performance exceptionnelle',
      details:
        '94% de performance globale avec les deux mains. Maîtrise totale !',
    },
    {
      id: 11,
      date: '2024-01-15',
      score: 8750,
      type: 'score',
      description: 'Nouveau record de score !',
      details:
        'Score exceptionnel de 8750 points atteint après 3 semaines de pratique intensive.',
    },
  ];

  const getBubbleColor = (type: string) => {
    switch (type) {
      case 'start':
        return 'from-emerald-400 to-teal-500';
      case 'score':
        return 'from-yellow-400 to-orange-500';
      case 'accuracy':
        return 'from-green-400 to-emerald-500';
      case 'accuracy_right':
        return 'from-green-400 to-emerald-500';
      case 'accuracy_left':
        return 'from-emerald-400 to-teal-500';
      case 'accuracy_both':
        return 'from-green-500 to-emerald-600';
      case 'combo':
        return 'from-orange-400 to-red-500';
      case 'multiplier':
        return 'from-purple-400 to-violet-500';
      case 'session':
        return 'from-blue-400 to-cyan-500';
      case 'performance':
        return 'from-pink-400 to-rose-500';
      case 'performance_right':
        return 'from-pink-400 to-rose-500';
      case 'performance_left':
        return 'from-rose-400 to-pink-500';
      case 'performance_both':
        return 'from-pink-500 to-rose-600';
      default:
        return 'from-indigo-500 to-purple-600';
    }
  };

  const getBubbleBorderColor = (type: string) => {
    switch (type) {
      case 'start':
        return 'border-emerald-300';
      case 'score':
        return 'border-yellow-300';
      case 'accuracy':
        return 'border-green-300';
      case 'accuracy_right':
        return 'border-green-300';
      case 'accuracy_left':
        return 'border-emerald-300';
      case 'accuracy_both':
        return 'border-green-400';
      case 'combo':
        return 'border-orange-300';
      case 'multiplier':
        return 'border-purple-300';
      case 'session':
        return 'border-blue-300';
      case 'performance':
        return 'border-pink-300';
      case 'performance_right':
        return 'border-pink-300';
      case 'performance_left':
        return 'border-rose-300';
      case 'performance_both':
        return 'border-pink-400';
      default:
        return 'border-indigo-300';
    }
  };

  const getPopupIcon = (type: string) => {
    const iconColor = getIconColor(type);

    switch (type) {
      case 'start':
        return <IconRocket size={24} className={iconColor} />;
      case 'score':
        return <IconTrophy size={24} className={iconColor} />;
      case 'accuracy':
        return <IconTarget size={24} className={iconColor} />;
      case 'accuracy_right':
        return <IconTarget size={24} className={iconColor} />;
      case 'accuracy_left':
        return <IconTarget size={24} className={iconColor} />;
      case 'accuracy_both':
        return <IconTarget size={24} className={iconColor} />;
      case 'combo':
        return <IconFlame size={24} className={iconColor} />;
      case 'multiplier':
        return <IconBolt size={24} className={iconColor} />;
      case 'session':
        return <IconClock size={24} className={iconColor} />;
      case 'performance':
        return <IconStar size={24} className={iconColor} />;
      case 'performance_right':
        return <IconStar size={24} className={iconColor} />;
      case 'performance_left':
        return <IconStar size={24} className={iconColor} />;
      case 'performance_both':
        return <IconStar size={24} className={iconColor} />;
      default:
        return <IconMedal size={24} className={iconColor} />;
    }
  };

  const getIcon = (type: string, isSelected: boolean = false) => {
    const iconColor = isSelected ? getIconColor(type) : 'text-white';

    switch (type) {
      case 'start':
        return <IconRocket size={20} className={iconColor} />;
      case 'score':
        return <IconTrophy size={20} className={iconColor} />;
      case 'accuracy':
        return <IconTarget size={20} className={iconColor} />;
      case 'accuracy_right':
        return <IconTarget size={20} className={iconColor} />;
      case 'accuracy_left':
        return <IconTarget size={20} className={iconColor} />;
      case 'accuracy_both':
        return <IconTarget size={20} className={iconColor} />;
      case 'combo':
        return <IconFlame size={20} className={iconColor} />;
      case 'multiplier':
        return <IconBolt size={20} className={iconColor} />;
      case 'session':
        return <IconClock size={20} className={iconColor} />;
      case 'performance':
        return <IconStar size={20} className={iconColor} />;
      case 'performance_right':
        return <IconStar size={20} className={iconColor} />;
      case 'performance_left':
        return <IconStar size={20} className={iconColor} />;
      case 'performance_both':
        return <IconStar size={20} className={iconColor} />;
      default:
        return <IconMedal size={20} className={iconColor} />;
    }
  };

  const getIconColor = (type: string) => {
    switch (type) {
      case 'start':
        return 'text-emerald-500';
      case 'score':
        return 'text-yellow-500';
      case 'accuracy':
        return 'text-green-500';
      case 'accuracy_right':
        return 'text-green-500';
      case 'accuracy_left':
        return 'text-emerald-500';
      case 'accuracy_both':
        return 'text-green-600';
      case 'combo':
        return 'text-orange-500';
      case 'multiplier':
        return 'text-purple-500';
      case 'session':
        return 'text-blue-500';
      case 'performance':
        return 'text-pink-500';
      case 'performance_right':
        return 'text-pink-500';
      case 'performance_left':
        return 'text-rose-500';
      case 'performance_both':
        return 'text-pink-600';
      default:
        return 'text-indigo-500';
    }
  };

  const getValueDisplay = (record: any) => {
    switch (record.type) {
      case 'start':
        return 'Début du voyage';
      case 'score':
        return `${record.score.toLocaleString()} points`;
      case 'accuracy':
        return `${record.score}% de précision`;
      case 'accuracy_right':
        return `${record.score}% main droite`;
      case 'accuracy_left':
        return `${record.score}% main gauche`;
      case 'accuracy_both':
        return `${record.score}% deux mains`;
      case 'combo':
        return `${record.score} notes d'affilée`;
      case 'multiplier':
        return `x${record.score} multiplicateur`;
      case 'session':
        return `${record.score} minutes`;
      case 'performance':
        return `${record.score}% de performance`;
      case 'performance_right':
        return `${record.score}% main droite`;
      case 'performance_left':
        return `${record.score}% main gauche`;
      case 'performance_both':
        return `${record.score}% deux mains`;
      default:
        return record.score;
    }
  };

  return (
    <div className="relative">
      {/* Timeline horizontale */}
      <div className="relative flex items-center justify-between px-4 py-8">
        {/* Ligne de base - commence dans la première bulle et s'arrête dans la dernière */}
        <div className="absolute top-1/2 left-6 right-6 h-0.5 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 transform -translate-y-1/2"></div>

        {/* Bulles d'icônes */}
        {records.map((record, index) => (
          <div key={record.id} className="relative z-10">
            {/* Bulle cliquable */}
            <button
              onClick={() =>
                setSelectedRecord(
                  selectedRecord === record.id ? null : record.id
                )
              }
              className={`group relative w-12 h-12 rounded-full border-2 transition-all duration-300 hover:scale-110 hover:shadow-lg ${
                selectedRecord === record.id
                  ? 'bg-white shadow-xl'
                  : `bg-gradient-to-br ${getBubbleColor(
                      record.type
                    )} border-white hover:${getBubbleBorderColor(record.type)}`
              }`}
            >
              <div
                className={`absolute inset-0 rounded-full bg-gradient-to-br ${getBubbleColor(
                  record.type
                )} opacity-0 group-hover:opacity-20 transition-opacity`}
              ></div>
              <div className="relative flex items-center justify-center w-full h-full">
                {getIcon(record.type, selectedRecord === record.id)}
              </div>

              {/* Indicateur de sélection */}
              {selectedRecord === record.id && (
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white animate-pulse"></div>
              )}
            </button>

            {/* Date sous la bulle */}
            <div className="absolute top-14 left-1/2 transform -translate-x-1/2 whitespace-nowrap">
              <span className="text-xs text-white/70 font-medium">
                {new Date(record.date).toLocaleDateString('fr-FR', {
                  day: 'numeric',
                  month: 'short',
                })}
              </span>
            </div>

            {/* Popup d'information */}
            {selectedRecord === record.id && (
              <div
                className={`absolute z-20 ${
                  index === 0
                    ? 'bottom-16 left-0 transform translate-x-0' // Première bulle : aligné à gauche
                    : index === records.length - 1
                    ? 'bottom-16 right-0 transform translate-x-0' // Dernière bulle : aligné à droite
                    : 'bottom-16 left-1/2 transform -translate-x-1/2' // Bulles du milieu : centré
                }`}
              >
                <div className="bg-white dark:bg-slate-800 rounded-xl shadow-2xl border border-slate-200 dark:border-slate-700 p-4 min-w-[280px] max-w-[320px]">
                  {/* Flèche vers le bas - position conditionnelle */}
                  <div
                    className={`absolute top-full w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-white dark:border-t-slate-800 ${
                      index === 0
                        ? 'left-6' // Première bulle : flèche à gauche
                        : index === records.length - 1
                        ? 'right-6' // Dernière bulle : flèche à droite
                        : 'left-1/2 transform -translate-x-1/2' // Bulles du milieu : flèche centrée
                    }`}
                  ></div>

                  {/* En-tête du popup */}
                  <div className="flex items-center space-x-3 mb-3">
                    <div className="flex items-center justify-center w-8 h-8">
                      {getPopupIcon(record.type)}
                    </div>
                    <div>
                      <h4 className="font-semibold text-slate-900 dark:text-white text-sm">
                        {record.description}
                      </h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        {new Date(record.date).toLocaleDateString('fr-FR', {
                          weekday: 'long',
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        })}
                      </p>
                    </div>
                  </div>

                  {/* Valeur principale */}
                  <div className="bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 rounded-lg p-3 mb-3">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">
                        {getValueDisplay(record)}
                      </div>
                      <div className="text-xs text-indigo-500 dark:text-indigo-300 mt-1">
                        Nouveau record !
                      </div>
                    </div>
                  </div>

                  {/* Détails */}
                  <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                    {record.details}
                  </p>

                  {/* Bouton fermer */}
                  <button
                    onClick={() => setSelectedRecord(null)}
                    className="absolute top-2 right-2 w-6 h-6 rounded-full bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 flex items-center justify-center transition-colors"
                  >
                    <span className="text-slate-500 dark:text-slate-400 text-xs">
                      ×
                    </span>
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Légende */}
      <div className="flex items-center justify-center space-x-3 mt-8 pt-4 border-t border-white/10 flex-wrap">
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-gradient-to-r from-emerald-400 to-teal-500 rounded-full"></div>
          <span className="text-xs text-white/70">Démarrage</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full"></div>
          <span className="text-xs text-white/70">Records de score</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full"></div>
          <span className="text-xs text-white/70">Précision main droite</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-gradient-to-r from-emerald-400 to-teal-500 rounded-full"></div>
          <span className="text-xs text-white/70">Précision main gauche</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full"></div>
          <span className="text-xs text-white/70">Précision deux mains</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-gradient-to-r from-orange-400 to-red-500 rounded-full"></div>
          <span className="text-xs text-white/70">Combos</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-gradient-to-r from-purple-400 to-violet-500 rounded-full"></div>
          <span className="text-xs text-white/70">Multiplicateurs</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-gradient-to-r from-blue-400 to-cyan-500 rounded-full"></div>
          <span className="text-xs text-white/70">Sessions</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-gradient-to-r from-pink-400 to-rose-500 rounded-full"></div>
          <span className="text-xs text-white/70">Performance main droite</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-gradient-to-r from-rose-400 to-pink-500 rounded-full"></div>
          <span className="text-xs text-white/70">Performance main gauche</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-gradient-to-r from-pink-500 to-rose-600 rounded-full"></div>
          <span className="text-xs text-white/70">Performance deux mains</span>
        </div>
      </div>
    </div>
  );
};

// Composant de badges et récompenses
const BadgeSystem = ({ song }: { song: SongBasicData }) => {
  const badges = [
    {
      id: 'perfectionist',
      name: 'Perfectionniste',
      description: '95% de précision atteinte',
      icon: '🎯',
      rarity: 'epic',
      unlocked: true,
      progress: 95,
    },
    {
      id: 'speed_demon',
      name: 'Démon de Vitesse',
      description: `Joué à ${song.tempo + 20} BPM`,
      icon: '⚡',
      rarity: 'rare',
      unlocked: false,
      progress: 73,
    },
    {
      id: 'combo_master',
      name: 'Maître du Combo',
      description: '500+ notes sans erreur',
      icon: '🔥',
      rarity: 'legendary',
      unlocked: true,
      progress: 100,
    },
    {
      id: 'endurance',
      name: 'Endurance',
      description: '1h de pratique continue',
      icon: '💪',
      rarity: 'common',
      unlocked: true,
      progress: 100,
    },
    {
      id: 'night_owl',
      name: 'Oiseau de Nuit',
      description: 'Session après minuit',
      icon: '🦉',
      rarity: 'rare',
      unlocked: false,
      progress: 0,
    },
    {
      id: 'early_bird',
      name: 'Lève-tôt',
      description: 'Session avant 7h',
      icon: '🌅',
      rarity: 'rare',
      unlocked: false,
      progress: 0,
    },
  ];

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'common':
        return 'from-gray-400 to-gray-600';
      case 'rare':
        return 'from-blue-400 to-blue-600';
      case 'epic':
        return 'from-purple-400 to-purple-600';
      case 'legendary':
        return 'from-yellow-400 to-orange-600';
      default:
        return 'from-gray-400 to-gray-600';
    }
  };

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
      {badges.map((badge) => (
        <div
          key={badge.id}
          className={`relative p-4 rounded-xl border transition-all duration-300 ${
            badge.unlocked
              ? 'bg-white/10 border-white/20 hover:bg-white/15'
              : 'bg-white/5 border-white/10 opacity-60'
          }`}
        >
          {badge.unlocked && (
            <div className="absolute -top-1 -right-1 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
              <IconBadge size={12} className="text-white" />
            </div>
          )}

          <div className="text-center space-y-2">
            <div
              className={`text-2xl p-2 rounded-lg bg-gradient-to-br ${getRarityColor(
                badge.rarity
              )} inline-block`}
            >
              {badge.icon}
            </div>
            <div>
              <div className="font-medium text-white text-sm">{badge.name}</div>
              <div className="text-xs text-white/70">{badge.description}</div>
            </div>

            {!badge.unlocked && badge.progress > 0 && (
              <div className="space-y-1">
                <div className="w-full bg-white/10 rounded-full h-1">
                  <div
                    className="bg-gradient-to-r from-blue-400 to-purple-400 h-1 rounded-full transition-all duration-1000"
                    style={{ width: `${badge.progress}%` }}
                  />
                </div>
                <div className="text-xs text-white/50">{badge.progress}%</div>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

// Composant de carte de statistiques
const StatCard = ({
  icon,
  title,
  value,
  subtitle,
  trend,
  className = '',
}: {
  icon: React.ReactNode;
  title: string;
  value: string | number;
  subtitle?: string;
  trend?: 'up' | 'down' | 'neutral';
  className?: string;
}) => {
  return (
    <div
      className={`bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10 hover:bg-white/10 transition-colors ${className}`}
    >
      <div className="flex items-center justify-between mb-2">
        <div className="text-indigo-400">{icon}</div>
        {trend && (
          <div
            className={`flex items-center text-xs ${
              trend === 'up'
                ? 'text-green-400'
                : trend === 'down'
                ? 'text-red-400'
                : 'text-gray-400'
            }`}
          >
            <IconTrendingUp
              size={12}
              className={trend === 'down' ? 'rotate-180' : ''}
            />
          </div>
        )}
      </div>
      <div className="text-2xl font-bold text-white mb-1">{value}</div>
      <div className="text-sm text-white/70">{title}</div>
      {subtitle && <div className="text-xs text-white/50 mt-1">{subtitle}</div>}
    </div>
  );
};

// Composant principal des statistiques
const SongStatsOverview = ({ song }: { song: SongBasicData }) => {
  const mockStats = {
    bestScore: 8750,
    averageAccuracy: 87,
    totalSessions: 23,
    totalPracticeTime: 245, // en minutes
    lastPlayed: '2024-01-15',
    personalBest: 92,
    globalRank: 12,
    streak: 5,
    completionRate: 78,
    averageSessionTime: 12, // en minutes
  };

  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };

  return (
    <div className="space-y-6">
      {/* Métriques principales */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard
          icon={<IconTrophy size={20} />}
          title="Meilleur Score"
          value={mockStats.bestScore.toLocaleString()}
          trend="up"
        />
        <StatCard
          icon={<IconTarget size={20} />}
          title="Précision Moy."
          value={`${mockStats.averageAccuracy}%`}
          trend="up"
        />
        <StatCard
          icon={<IconClock size={20} />}
          title="Temps Total"
          value={formatTime(mockStats.totalPracticeTime)}
          subtitle={`${mockStats.totalSessions} sessions`}
        />
        <StatCard
          icon={<IconFlame size={20} />}
          title="Série Actuelle"
          value={`${mockStats.streak} jours`}
          trend="up"
        />
      </div>

      {/* Timeline des Records */}
      <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
        <h3 className="text-lg font-semibold text-white flex items-center mb-4">
          <IconTimeline size={20} className="mr-2 text-yellow-400" />
          Timeline des Records
        </h3>
        <RecordsTimeline />
      </div>

      {/* Système de Badges */}
      <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
        <h3 className="text-lg font-semibold text-white flex items-center mb-4">
          <IconBadge size={20} className="mr-2 text-purple-400" />
          Badges et Récompenses
        </h3>
        <BadgeSystem song={song} />
      </div>
    </div>
  );
};

export default function SongPerformances({ song }: { song: SongBasicData }) {
  const { setCurrentSong } = useSong();
  const router = useRouter();
  const [isFavorite, setIsFavorite] = useState(song.isFavorite || false);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    // Mettre à jour le contexte avec la chanson actuelle
    setCurrentSong(song);

    // Nettoyer le contexte lorsque le composant est démonté
    return () => {
      setCurrentSong(null);
    };
  }, [song, setCurrentSong]);

  // Fonction pour naviguer vers l'onglet "Chansons Jouées"
  const handleBackToPlayedSongs = () => {
    router.push('/performances?tab=playedSongs');
  };

  // Fonction pour gérer le clic sur le bouton favori
  const handleFavoriteClick = () => {
    // Mettre à jour l'état local immédiatement pour une meilleure expérience utilisateur
    setIsFavorite(!isFavorite);

    // Appeler l'action serveur
    startTransition(async () => {
      try {
        const result = await toggleFavorite(song.id);

        if (result.success) {
          toast.success(result.message);
        } else {
          // En cas d'échec, revenir à l'état précédent
          setIsFavorite(isFavorite);
          toast.error(result.message);
        }
      } catch (error) {
        console.error('Erreur lors de la modification des favoris:', error);
        // En cas d'erreur, revenir à l'état précédent
        setIsFavorite(isFavorite);
        toast.error(
          'Une erreur est survenue lors de la modification des favoris'
        );
      }
    });
  };

  return (
    <div className={styles.container}>
      {/* En-tête du morceau */}

      <div className={styles.header}>
        <div
          className={styles.headerGradient}
          style={{
            background:
              'linear-gradient(to right, rgba(59, 130, 246, 0.2), rgba(99, 102, 241, 0.2), rgba(251, 146, 60, 0.2))',
          }}
        >
          <div className="absolute top-4 right-4 z-10">
            <button
              onClick={handleBackToPlayedSongs}
              className="text-md cursor-pointer text-indigo-400 hover:text-indigo-300 font-medium flex items-center relative hover:after:w-[calc(100%-1rem)] after:absolute after:bottom-0 after:left-0 after:h-px after:bg-current after:transition-all after:duration-300 after:ease-out after:w-0"
            >
              Retour aux chansons jouées
              <IconChevronRight size={18} className="ml-1" />
            </button>
          </div>

          <div className={styles.headerContent}>
            <div className={styles.songImage}>
              {song.imageUrl ? (
                <img
                  src={song.imageUrl}
                  alt={song.title}
                  className="h-full w-full object-cover"
                />
              ) : (
                <IconMusic size={36} className={styles.similarSongIconText} />
              )}
            </div>

            <div className={styles.songInfo}>
              <div className="flex items-start">
                <div>
                  <h1 className={styles.songTitle}>{song.title}</h1>
                  <p className={styles.songComposer}>
                    {song.composer || 'Compositeur inconnu'}
                  </p>
                </div>

                <button
                  onClick={handleFavoriteClick}
                  className={`${styles.favoriteButton} ml-3 ${
                    isFavorite ? styles.favoriteActive : ''
                  }`}
                  disabled={isPending}
                >
                  <IconHeart
                    size={41}
                    fill={isFavorite ? 'currentColor' : 'none'}
                  />
                </button>
              </div>

              <div className={styles.songMeta}>
                <div className={styles.metaBadge}>
                  <IconClock size={14} className={styles.metaIcon} />
                  <span>{castMsToMin(song.duration_ms)}</span>
                </div>

                <div className={styles.metaBadge}>
                  <IconChartBar size={14} className={styles.metaIcon} />
                  <span>{song.tempo} BPM</span>
                </div>

                <div className={styles.metaBadge}>
                  <IconMusic size={14} className={styles.metaIcon} />
                  <span>{song.genre || 'Non spécifié'}</span>
                </div>

                <DifficultyBadge difficulty={song.Level} />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className={styles.tabContent}>
        <div className="grid grid-cols-1 pb-4 md:grid-cols-3 lg:grid-cols-6 gap-4 auto-rows-auto">
          {/* Carte principale avec graphique */}
          <div className="bg-white dark:bg-slate-800 shadow-md rounded-2xl overflow-hidden col-span-1 md:col-span-2 lg:col-span-3 row-span-2 border border-slate-200 dark:border-slate-700">
            <div className="p-6 h-full flex flex-col">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                  Statistiques de pratique
                </h2>
                <span className="bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 text-xs font-medium px-2.5 py-1 rounded-full">
                  Cette semaine
                </span>
              </div>

              <div className="flex-grow">
                <ResponsiveContainer width="100%" height={200}>
                  <LineChart
                    data={practiceData}
                    margin={{ top: 10, right: 30, left: -20, bottom: 0 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                    <XAxis
                      dataKey="name"
                      tick={{ fontSize: 12, fill: '#94a3b8' }}
                    />

                    {/* Un seul axe Y - Minutes */}
                    <YAxis
                      tick={{ fontSize: 12, fill: '#94a3b8' }}
                      label={{
                        value: 'Minutes',
                        angle: -90,
                        position: 'insideLeft',
                      }}
                    />

                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#1e293b',
                        border: 'none',
                        borderRadius: '8px',
                        fontSize: '12px',
                      }}
                      itemStyle={{ color: '#e2e8f0' }}
                      labelStyle={{
                        color: '#e2e8f0',
                        fontWeight: 'bold',
                        marginBottom: '4px',
                      }}
                      formatter={(value, name) => {
                        if (name === 'pratique')
                          return [`${value} min`, 'Temps de pratique'];
                        if (name === 'ecoute')
                          return [`${value} min`, "Temps d'écoute"];
                        if (name === 'theorie')
                          return [`${value} min`, 'Temps de théorie'];
                        return [`${value} min`, name];
                      }}
                    />

                    {/* Ligne 1 - Temps de pratique */}
                    <Line
                      type="monotone"
                      dataKey="pratique"
                      stroke="#6366f1"
                      strokeWidth={3}
                      dot={{
                        r: 4,
                        fill: '#6366f1',
                        strokeWidth: 0,
                      }}
                      activeDot={{ r: 6, fill: '#818cf8', strokeWidth: 0 }}
                    />

                    {/* Ligne 2 - Temps d'écoute */}
                    <Line
                      type="monotone"
                      dataKey="ecoute"
                      stroke="#10b981"
                      strokeWidth={2}
                      strokeDasharray="5 5"
                      dot={{
                        r: 3,
                        fill: '#10b981',
                        strokeWidth: 0,
                      }}
                      activeDot={{ r: 5, fill: '#34d399', strokeWidth: 0 }}
                    />

                    {/* Ligne 3 - Temps de théorie */}
                    <Line
                      type="monotone"
                      dataKey="theorie"
                      stroke="#f59e0b"
                      strokeWidth={2}
                      strokeDasharray="10 5"
                      dot={{
                        r: 3,
                        fill: '#f59e0b',
                        strokeWidth: 0,
                      }}
                      activeDot={{ r: 5, fill: '#fbbf24', strokeWidth: 0 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              <Separator.Root className="h-px bg-slate-200 dark:bg-slate-700 my-4" />

              {/* Légende des métriques */}
              <div className="flex items-center justify-between flex-wrap gap-4 mb-4">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center">
                    <div className="w-4 h-0.5 bg-indigo-500 mr-2"></div>
                    <span className="text-xs text-slate-600 dark:text-slate-400">
                      Pratique
                    </span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-4 h-0.5 bg-green-500 border-dashed border-t mr-2"></div>
                    <span className="text-xs text-slate-600 dark:text-slate-400">
                      Écoute
                    </span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-4 h-0.5 bg-amber-500 border-dashed border-t mr-2"></div>
                    <span className="text-xs text-slate-600 dark:text-slate-400">
                      Théorie
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    Pratique totale
                  </p>
                  <p className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">
                    4h 15min
                  </p>
                </div>
                <div>
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    Écoute totale
                  </p>
                  <p className="text-xl font-bold text-green-600 dark:text-green-400">
                    2h 10min
                  </p>
                </div>
                <div>
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    Théorie totale
                  </p>
                  <p className="text-xl font-bold text-amber-600 dark:text-amber-400">
                    1h 35min
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Tuiles d'informations à droite */}

          {/* Score Record */}
          <div className="bg-gradient-to-br from-yellow-50 to-amber-50 dark:from-yellow-900/20 dark:to-amber-900/20 shadow-md rounded-xl p-4 border border-yellow-200 dark:border-yellow-800/30 col-span-1">
            <div className="flex items-center justify-between mb-2">
              <IconTrophy
                size={20}
                className="text-yellow-600 dark:text-yellow-400"
              />
              <span className="text-xs bg-yellow-200 dark:bg-yellow-800/50 text-yellow-800 dark:text-yellow-200 px-2 py-1 rounded-full font-medium">
                Record
              </span>
            </div>
            <div className="text-2xl font-bold text-yellow-900 dark:text-yellow-100 mb-1">
              8,750
            </div>
            <div className="text-sm text-yellow-700 dark:text-yellow-300">
              Meilleur score
            </div>
            <div className="text-xs text-yellow-600 dark:text-yellow-400 mt-1">
              +12% ce mois
            </div>
          </div>

          {/* Précision Moyenne */}
          <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 shadow-md rounded-xl p-4 border border-green-200 dark:border-green-800/30 col-span-1">
            <div className="flex items-center justify-between mb-2">
              <IconTarget
                size={20}
                className="text-green-600 dark:text-green-400"
              />
              <span className="text-xs bg-green-200 dark:bg-green-800/50 text-green-800 dark:text-green-200 px-2 py-1 rounded-full font-medium">
                Précision
              </span>
            </div>
            <div className="text-2xl font-bold text-green-900 dark:text-green-100 mb-1">
              87%
            </div>
            <div className="text-sm text-green-700 dark:text-green-300">
              Précision moyenne
            </div>
            <div className="text-xs text-green-600 dark:text-green-400 mt-1">
              +5% semaine
            </div>
          </div>

          {/* Sessions Totales */}
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 shadow-md rounded-xl p-4 border border-blue-200 dark:border-blue-800/30 col-span-1">
            <div className="flex items-center justify-between mb-2">
              <IconChartBar
                size={20}
                className="text-blue-600 dark:text-blue-400"
              />
              <span className="text-xs bg-blue-200 dark:bg-blue-800/50 text-blue-800 dark:text-blue-200 px-2 py-1 rounded-full font-medium">
                Sessions
              </span>
            </div>
            <div className="text-2xl font-bold text-blue-900 dark:text-blue-100 mb-1">
              23
            </div>
            <div className="text-sm text-blue-700 dark:text-blue-300">
              Sessions jouées
            </div>
            <div className="text-xs text-blue-600 dark:text-blue-400 mt-1">
              Cette chanson
            </div>
          </div>

          {/* Temps de Pratique */}
          <div className="bg-gradient-to-br from-purple-50 to-violet-50 dark:from-purple-900/20 dark:to-violet-900/20 shadow-md rounded-xl p-4 border border-purple-200 dark:border-purple-800/30 col-span-1">
            <div className="flex items-center justify-between mb-2">
              <IconClock
                size={20}
                className="text-purple-600 dark:text-purple-400"
              />
              <span className="text-xs bg-purple-200 dark:bg-purple-800/50 text-purple-800 dark:text-purple-200 px-2 py-1 rounded-full font-medium">
                Temps
              </span>
            </div>
            <div className="text-2xl font-bold text-purple-900 dark:text-purple-100 mb-1">
              4h 5m
            </div>
            <div className="text-sm text-purple-700 dark:text-purple-300">
              Temps total
            </div>
            <div className="text-xs text-purple-600 dark:text-purple-400 mt-1">
              Sur cette chanson
            </div>
          </div>

          {/* Streak Actuel */}
          <div className="bg-gradient-to-br from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20 shadow-md rounded-xl p-4 border border-orange-200 dark:border-orange-800/30 col-span-1">
            <div className="flex items-center justify-between mb-2">
              <IconFlame
                size={20}
                className="text-orange-600 dark:text-orange-400"
              />
              <span className="text-xs bg-orange-200 dark:bg-orange-800/50 text-orange-800 dark:text-orange-200 px-2 py-1 rounded-full font-medium">
                Streak
              </span>
            </div>
            <div className="text-2xl font-bold text-orange-900 dark:text-orange-100 mb-1">
              5
            </div>
            <div className="text-sm text-orange-700 dark:text-orange-300">
              Jours consécutifs
            </div>
            <div className="text-xs text-orange-600 dark:text-orange-400 mt-1">
              Record: 12 jours
            </div>
          </div>

          {/* Rang Global */}
          <div className="bg-gradient-to-br from-pink-50 to-rose-50 dark:from-pink-900/20 dark:to-rose-900/20 shadow-md rounded-xl p-4 border border-pink-200 dark:border-pink-800/30 col-span-1">
            <div className="flex items-center justify-between mb-2">
              <IconMedal
                size={20}
                className="text-pink-600 dark:text-pink-400"
              />
              <span className="text-xs bg-pink-200 dark:bg-pink-800/50 text-pink-800 dark:text-pink-200 px-2 py-1 rounded-full font-medium">
                Rang
              </span>
            </div>
            <div className="text-2xl font-bold text-pink-900 dark:text-pink-100 mb-1">
              #12
            </div>
            <div className="text-sm text-pink-700 dark:text-pink-300">
              Classement global
            </div>
            <div className="text-xs text-pink-600 dark:text-pink-400 mt-1">
              Top 5%
            </div>
          </div>
        </div>
        <SongStatsOverview song={song} />
        <PerformanceBento />
        <BentoShadcnExample />
      </div>
    </div>
  );
}
