'use client';

import {
  castMsToMin,
  getLearnScores,
  formatDuration,
} from '@/common/utils/function';
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
  IconBrain,
  IconChevronLeft,
} from '@tabler/icons-react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  BarChart,
  Bar,
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

// --- TIMELINE ---
// Séparation des records par mode
const learningRecords = [
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
    id: 9,
    date: '2024-01-10',
    score: 95,
    type: 'accuracy_both',
    description: 'Précision parfaite',
    details: '95% de précision avec les deux mains. Synchronisation parfaite !',
  },
  {
    id: 6,
    date: '2024-01-02',
    score: 92,
    type: 'performance_right',
    description: 'Performance main droite',
    details: '92% de performance globale avec la main droite. Niveau expert !',
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
    id: 10.1,
    date: '2024-01-11',
    score: 89,
    type: 'performance_both',
    description: 'Performance deux mains',
    details:
      '89% de performance globale avec les deux mains. La maîtrise approche !',
  },
  {
    id: 10,
    date: '2024-01-12',
    score: 94,
    type: 'finished',
    description: 'Musique terminée !',
    details:
      "Plus de 90% de performance globale atteinte avec les deux mains. Félicitations, vous avez terminé l'apprentissage de ce morceau !",
  },
];

const gameRecords = [
  {
    id: 100,
    date: '2023-12-16',
    score: 0,
    type: 'start_game',
    description: 'Première session en mode Jeu',
    details:
      'Vous avez joué ce morceau pour la première fois en mode Jeu. Bonne chance pour battre des records !',
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
    id: 7,
    date: '2024-01-05',
    score: 847,
    type: 'combo',
    description: 'Combo record établi',
    details:
      '847 notes jouées consécutivement sans erreur, un combo historique !',
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

// Composant de timeline des records, reçoit les records en props
const RecordsTimeline = ({ records }: { records: any[] }) => {
  const [selectedRecord, setSelectedRecord] = useState<number | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

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
      case 'start_game':
        return 'from-blue-400 to-cyan-500';
      case 'finished':
        return 'from-green-400 to-emerald-500';
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
      case 'start_game':
        return 'border-blue-300';
      case 'finished':
        return 'border-green-300';
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
      case 'start_game':
        return <IconRocket size={24} className={iconColor} />;
      case 'finished':
        return <IconMedal size={24} className={iconColor} />;
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
      case 'start_game':
        return <IconRocket size={20} className={iconColor} />;
      case 'finished':
        return <IconMedal size={20} className={iconColor} />;
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
      case 'start_game':
        return 'text-blue-500';
      case 'finished':
        return 'text-green-500';
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
      case 'start_game':
        return 'Début de la session de jeu';
      case 'finished':
        return 'Musique terminée !';
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
          <div
            key={record.id}
            className={`relative z-10 ${
              mounted ? 'opacity-100 scale-100' : 'opacity-0 scale-75'
            } animate-timeline-bubble`}
            style={{ transitionDelay: mounted ? `${index * 400}ms` : '0ms' }}
          >
            {/* Bulle cliquable */}
            <button
              onClick={() =>
                setSelectedRecord(
                  selectedRecord === record.id ? null : record.id
                )
              }
              className={`group relative w-12 h-12 rounded-full border-2 transition-all duration-300 hover:scale-110 hover:shadow-lg cursor-pointer ${
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
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-gradient-to-r from-blue-400 to-cyan-500 rounded-full"></div>
          <span className="text-xs text-white/70">
            Démarrage de session de jeu
          </span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full"></div>
          <span className="text-xs text-white/70">Musique terminée</span>
        </div>
      </div>
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
  return (
    <div className="space-y-6">
      {/* Timeline des Records */}
      <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
        <h3 className="text-lg font-semibold text-white flex items-center mb-4">
          <IconTimeline size={20} className="mr-2 text-yellow-400" />
          Timeline des Records
        </h3>
        <RecordsTimeline records={learningRecords} />
      </div>
    </div>
  );
};

// --- SECTION MODE APPRENTISSAGE ---

const learningTiles = [
  {
    label: 'Sessions',
    value: 18,
    icon: <IconClock size={20} className="text-blue-500" />,
    color: 'bg-blue-50 dark:bg-blue-900/20',
  },
  {
    label: 'Précision moyenne',
    value: '87%',
    icon: <IconTarget size={20} className="text-green-500" />,
    color: 'bg-green-50 dark:bg-green-900/20',
  },
  {
    label: 'Performance moyenne',
    value: '84%',
    icon: <IconStar size={20} className="text-pink-500" />,
    color: 'bg-pink-50 dark:bg-pink-900/20',
  },
  {
    label: 'Temps total',
    value: '5h 20min',
    icon: <IconClock size={20} className="text-purple-500" />,
    color: 'bg-purple-50 dark:bg-purple-900/20',
  },
  {
    label: 'Plus longue session',
    value: '52min',
    icon: <IconFlame size={20} className="text-orange-500" />,
    color: 'bg-orange-50 dark:bg-orange-900/20',
  },
  {
    label: 'Streak',
    value: '7 jours',
    icon: <IconFire size={20} className="text-red-500" />,
    color: 'bg-red-50 dark:bg-red-900/20',
  },
];

const learningPrecisionData = [
  { session: 1, droite: 82, gauche: 75, deux: 80 },
  { session: 2, droite: 85, gauche: 78, deux: 82 },
  { session: 3, droite: 88, gauche: 80, deux: 85 },
  { session: 4, droite: 90, gauche: 82, deux: 87 },
  { session: 5, droite: 92, gauche: 85, deux: 89 },
  { session: 6, droite: 91, gauche: 86, deux: 90 },
  { session: 7, droite: 93, gauche: 88, deux: 92 },
];

const learningPerformanceData = [
  { session: 1, droite: 78, gauche: 70, deux: 75 },
  { session: 2, droite: 80, gauche: 72, deux: 77 },
  { session: 3, droite: 83, gauche: 74, deux: 80 },
  { session: 4, droite: 85, gauche: 76, deux: 82 },
  { session: 5, droite: 87, gauche: 78, deux: 84 },
  { session: 6, droite: 89, gauche: 80, deux: 86 },
  { session: 7, droite: 91, gauche: 82, deux: 88 },
];

const learningBarData = [
  { mois: 'Jan', precision: 87, performance: 84 },
  { mois: 'Fév', precision: 89, performance: 86 },
  { mois: 'Mar', precision: 91, performance: 88 },
  { mois: 'Avr', precision: 92, performance: 90 },
  { mois: 'Mai', precision: 93, performance: 91 },
  { mois: 'Juin', precision: 94, performance: 92 },
];

// --- SECTION MODE JEU ---

const gameTiles = [
  {
    label: 'Sessions',
    value: 14,
    icon: <IconClock size={20} className="text-blue-500" />,
    color: 'bg-blue-50 dark:bg-blue-900/20',
  },
  {
    label: 'Score moyen',
    value: '7,850',
    icon: <IconChartBar size={20} className="text-green-500" />,
    color: 'bg-green-50 dark:bg-green-900/20',
  },
  {
    label: 'Meilleur score',
    value: '8,950',
    icon: <IconTrophy size={20} className="text-yellow-500" />,
    color: 'bg-yellow-50 dark:bg-yellow-900/20',
  },
  {
    label: 'Temps total',
    value: '3h 40min',
    icon: <IconClock size={20} className="text-purple-500" />,
    color: 'bg-purple-50 dark:bg-purple-900/20',
  },
  {
    label: 'Plus longue session',
    value: '38min',
    icon: <IconFlame size={20} className="text-orange-500" />,
    color: 'bg-orange-50 dark:bg-orange-900/20',
  },
  {
    label: 'Streak',
    value: '4 jours',
    icon: <IconFire size={20} className="text-red-500" />,
    color: 'bg-red-50 dark:bg-red-900/20',
  },
];

const gameScoreData = [
  { session: 1, droite: 7200, gauche: 6800, deux: 7000 },
  { session: 2, droite: 7500, gauche: 6900, deux: 7200 },
  { session: 3, droite: 7800, gauche: 7100, deux: 7400 },
  { session: 4, droite: 8000, gauche: 7300, deux: 7600 },
  { session: 5, droite: 8200, gauche: 7500, deux: 7800 },
  { session: 6, droite: 8500, gauche: 7700, deux: 8000 },
  { session: 7, droite: 8950, gauche: 7900, deux: 8200 },
];

const gameBarData = [
  { mois: 'Jan', score: 8200, combo: 320, multi: 3.2 },
  { mois: 'Fév', score: 8450, combo: 350, multi: 3.5 },
  { mois: 'Mar', score: 8700, combo: 370, multi: 3.8 },
  { mois: 'Avr', score: 8900, combo: 400, multi: 4.0 },
  { mois: 'Mai', score: 9100, combo: 420, multi: 4.1 },
  { mois: 'Juin', score: 9300, combo: 450, multi: 4.2 },
];

// Données pour le graphique en ligne Score par session (score, combo, multi)
const gameScoreLineData = [
  { session: 1, score: 8200, combo: 320, multi: 3.2 },
  { session: 2, score: 8450, combo: 350, multi: 3.5 },
  { session: 3, score: 8700, combo: 370, multi: 3.8 },
  { session: 4, score: 8900, combo: 400, multi: 4.0 },
  { session: 5, score: 9100, combo: 420, multi: 4.1 },
  { session: 6, score: 9300, combo: 450, multi: 4.2 },
  { session: 7, score: 9500, combo: 470, multi: 4.3 },
];

export default function SongPerformances({ song }: { song: SongBasicData }) {
  const { setCurrentSong } = useSong();
  const router = useRouter();
  const [isFavorite, setIsFavorite] = useState(song.isFavorite || false);
  const [isPending, startTransition] = useTransition();
  const [activeTab, setActiveTab] = useState<'apprentissage' | 'jeu'>(
    'apprentissage'
  );

  const [precisionInterval, setPrecisionInterval] = useState(7);
  const [precisionIndex, setPrecisionIndex] = useState(0);
  const [performanceInterval, setPerformanceInterval] = useState(7);
  const [performanceIndex, setPerformanceIndex] = useState(0);
  const [scoreInterval, setScoreInterval] = useState(7);
  const [scoreIndex, setScoreIndex] = useState(0);
  const [practiceInterval, setPracticeInterval] = useState(7);
  const [practiceIndex, setPracticeIndex] = useState(0);

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

  const [learningBarIndex, setLearningBarIndex] = useState(0);
  const learningBarIntervals = [
    {
      label: 'Jan - Juin 2024',
      data: [
        { mois: 'Jan', precision: 87, performance: 84 },
        { mois: 'Fév', precision: 89, performance: 86 },
        { mois: 'Mar', precision: 91, performance: 88 },
        { mois: 'Avr', precision: 92, performance: 90 },
        { mois: 'Mai', precision: 93, performance: 91 },
        { mois: 'Juin', precision: 94, performance: 92 },
      ],
    },
    {
      label: 'Juil - Déc 2024',
      data: [
        { mois: 'Juil', precision: 95, performance: 93 },
        { mois: 'Août', precision: 96, performance: 94 },
        { mois: 'Sept', precision: 97, performance: 95 },
        { mois: 'Oct', precision: 98, performance: 96 },
        { mois: 'Nov', precision: 99, performance: 97 },
        { mois: 'Déc', precision: 99, performance: 98 },
      ],
    },
  ];

  const [gameBarIndex, setGameBarIndex] = useState(0);
  const gameBarIntervals = [
    {
      label: 'Jan - Juin 2024',
      data: [
        { mois: 'Jan', score: 8200, combo: 320, multi: 3.2 },
        { mois: 'Fév', score: 8450, combo: 350, multi: 3.5 },
        { mois: 'Mar', score: 8700, combo: 370, multi: 3.8 },
        { mois: 'Avr', score: 8900, combo: 400, multi: 4.0 },
        { mois: 'Mai', score: 9100, combo: 420, multi: 4.1 },
        { mois: 'Juin', score: 9300, combo: 450, multi: 4.2 },
      ],
    },
    {
      label: 'Juil - Déc 2024',
      data: [
        { mois: 'Juil', score: 9350, combo: 470, multi: 4.3 },
        { mois: 'Août', score: 9400, combo: 480, multi: 4.4 },
        { mois: 'Sept', score: 9450, combo: 490, multi: 4.5 },
        { mois: 'Oct', score: 9500, combo: 500, multi: 4.6 },
        { mois: 'Nov', score: 9550, combo: 510, multi: 4.7 },
        { mois: 'Déc', score: 9600, combo: 520, multi: 4.8 },
      ],
    },
  ];

  // Étendre les données pour plus de sessions
  const extendedLearningPrecisionData = [
    // Sessions 1-7 (données existantes)
    ...learningPrecisionData,
    // Sessions 8-14
    { session: 8, droite: 94, gauche: 89, deux: 93 },
    { session: 9, droite: 95, gauche: 90, deux: 94 },
    { session: 10, droite: 93, gauche: 91, deux: 93 },
    { session: 11, droite: 96, gauche: 92, deux: 95 },
    { session: 12, droite: 97, gauche: 93, deux: 96 },
    { session: 13, droite: 95, gauche: 94, deux: 95 },
    { session: 14, droite: 98, gauche: 95, deux: 97 },
    // Sessions 15-21
    { session: 15, droite: 96, gauche: 93, deux: 95 },
    { session: 16, droite: 97, gauche: 94, deux: 96 },
    { session: 17, droite: 98, gauche: 95, deux: 97 },
    { session: 18, droite: 99, gauche: 96, deux: 98 },
    { session: 19, droite: 97, gauche: 97, deux: 97 },
    { session: 20, droite: 98, gauche: 98, deux: 98 },
    { session: 21, droite: 99, gauche: 99, deux: 99 },
  ];

  const extendedLearningPerformanceData = [
    // Sessions 1-7 (données existantes)
    ...learningPerformanceData,
    // Sessions 8-14
    { session: 8, droite: 92, gauche: 83, deux: 89 },
    { session: 9, droite: 93, gauche: 84, deux: 90 },
    { session: 10, droite: 91, gauche: 85, deux: 89 },
    { session: 11, droite: 94, gauche: 86, deux: 91 },
    { session: 12, droite: 95, gauche: 87, deux: 92 },
    { session: 13, droite: 93, gauche: 88, deux: 91 },
    { session: 14, droite: 96, gauche: 89, deux: 93 },
    // Sessions 15-21
    { session: 15, droite: 94, gauche: 87, deux: 91 },
    { session: 16, droite: 95, gauche: 88, deux: 92 },
    { session: 17, droite: 96, gauche: 89, deux: 93 },
    { session: 18, droite: 97, gauche: 90, deux: 94 },
    { session: 19, droite: 95, gauche: 91, deux: 93 },
    { session: 20, droite: 96, gauche: 92, deux: 94 },
    { session: 21, droite: 97, gauche: 93, deux: 95 },
  ];

  const extendedGameScoreLineData = [
    // Sessions 1-7 (données existantes)
    ...gameScoreLineData,
    // Sessions 8-14
    { session: 8, score: 9600, combo: 480, multi: 4.4 },
    { session: 9, score: 9700, combo: 490, multi: 4.5 },
    { session: 10, score: 9550, combo: 485, multi: 4.3 },
    { session: 11, score: 9800, combo: 500, multi: 4.6 },
    { session: 12, score: 9900, combo: 510, multi: 4.7 },
    { session: 13, score: 9750, combo: 495, multi: 4.4 },
    { session: 14, score: 10000, combo: 520, multi: 4.8 },
    // Sessions 15-21
    { session: 15, score: 9850, combo: 505, multi: 4.5 },
    { session: 16, score: 9950, combo: 515, multi: 4.6 },
    { session: 17, score: 10100, combo: 525, multi: 4.9 },
    { session: 18, score: 10200, combo: 535, multi: 5.0 },
    { session: 19, score: 10050, combo: 530, multi: 4.8 },
    { session: 20, score: 10150, combo: 540, multi: 4.9 },
    { session: 21, score: 10300, combo: 550, multi: 5.1 },
  ];

  // Options d'intervalles pour la navigation
  const intervalOptions = [
    { value: 7, label: '7 sessions' },
    { value: 15, label: '15 sessions' },
    { value: 30, label: '30 sessions' },
  ];

  // Fonction pour calculer l'index par défaut (intervalle le plus récent)
  const getDefaultIndex = (dataLength: number, interval: number = 7) => {
    const numCompleteIntervals = Math.floor(dataLength / interval);
    return Math.max(0, numCompleteIntervals - 1);
  };

  // Initialiser les index sur l'intervalle le plus récent au montage
  useEffect(() => {
    setPrecisionIndex(
      getDefaultIndex(extendedLearningPrecisionData.length, precisionInterval)
    );
    setPerformanceIndex(
      getDefaultIndex(
        extendedLearningPerformanceData.length,
        performanceInterval
      )
    );
    setScoreIndex(
      getDefaultIndex(extendedGameScoreLineData.length, scoreInterval)
    );
    setPracticeIndex(
      getDefaultIndex(extendedPracticeData.length, practiceInterval)
    );
  }, []); // Uniquement au montage

  // Fonctions pour obtenir les données par intervalles
  const getPracticeData = () => {
    const totalIntervals = Math.ceil(
      extendedPracticeData.length / practiceInterval
    );
    const reverseIndex = totalIntervals - 1 - practiceIndex;
    const endIndex =
      extendedPracticeData.length - reverseIndex * practiceInterval;
    const startIndex = Math.max(0, endIndex - practiceInterval);
    return extendedPracticeData.slice(startIndex, endIndex);
  };

  const getPrecisionData = () => {
    const totalIntervals = Math.ceil(
      extendedLearningPrecisionData.length / precisionInterval
    );
    const reverseIndex = totalIntervals - 1 - precisionIndex;
    const endIndex =
      extendedLearningPrecisionData.length - reverseIndex * precisionInterval;
    const startIndex = Math.max(0, endIndex - precisionInterval);
    return extendedLearningPrecisionData.slice(startIndex, endIndex);
  };

  const getPerformanceData = () => {
    const totalIntervals = Math.ceil(
      extendedLearningPerformanceData.length / performanceInterval
    );
    const reverseIndex = totalIntervals - 1 - performanceIndex;
    const endIndex =
      extendedLearningPerformanceData.length -
      reverseIndex * performanceInterval;
    const startIndex = Math.max(0, endIndex - performanceInterval);
    return extendedLearningPerformanceData.slice(startIndex, endIndex);
  };

  const getScoreData = () => {
    const totalIntervals = Math.ceil(
      extendedGameScoreLineData.length / scoreInterval
    );
    const reverseIndex = totalIntervals - 1 - scoreIndex;
    const endIndex =
      extendedGameScoreLineData.length - reverseIndex * scoreInterval;
    const startIndex = Math.max(0, endIndex - scoreInterval);
    return extendedGameScoreLineData.slice(startIndex, endIndex);
  };

  // Données de pratique
  const extendedPracticeData = [
    { name: 'J-29', pratique: 45, modeJeu: 20, modeApprentissage: 25 },
    { name: 'J-28', pratique: 52, modeJeu: 25, modeApprentissage: 27 },
    { name: 'J-27', pratique: 38, modeJeu: 15, modeApprentissage: 23 },
    { name: 'J-26', pratique: 60, modeJeu: 30, modeApprentissage: 30 },
    { name: 'J-25', pratique: 42, modeJeu: 18, modeApprentissage: 24 },
    { name: 'J-24', pratique: 55, modeJeu: 28, modeApprentissage: 27 },
    { name: 'J-23', pratique: 48, modeJeu: 22, modeApprentissage: 26 },
    { name: 'J-22', pratique: 65, modeJeu: 35, modeApprentissage: 30 },
    { name: 'J-21', pratique: 40, modeJeu: 16, modeApprentissage: 24 },
    { name: 'J-20', pratique: 58, modeJeu: 30, modeApprentissage: 28 },
    { name: 'J-19', pratique: 47, modeJeu: 20, modeApprentissage: 27 },
    { name: 'J-18', pratique: 53, modeJeu: 26, modeApprentissage: 27 },
    { name: 'J-17', pratique: 61, modeJeu: 32, modeApprentissage: 29 },
    { name: 'J-16', pratique: 44, modeJeu: 19, modeApprentissage: 25 },
    { name: 'J-15', pratique: 56, modeJeu: 28, modeApprentissage: 28 },
    { name: 'J-14', pratique: 45, modeJeu: 20, modeApprentissage: 25 },
    { name: 'J-13', pratique: 52, modeJeu: 25, modeApprentissage: 27 },
    { name: 'J-12', pratique: 38, modeJeu: 15, modeApprentissage: 23 },
    { name: 'J-11', pratique: 60, modeJeu: 30, modeApprentissage: 30 },
    { name: 'J-10', pratique: 42, modeJeu: 18, modeApprentissage: 24 },
    { name: 'J-9', pratique: 55, modeJeu: 28, modeApprentissage: 27 },
    { name: 'J-8', pratique: 48, modeJeu: 22, modeApprentissage: 26 },
    { name: 'J-7', pratique: 65, modeJeu: 35, modeApprentissage: 30 },
    { name: 'J-6', pratique: 40, modeJeu: 16, modeApprentissage: 24 },
    { name: 'J-5', pratique: 58, modeJeu: 30, modeApprentissage: 28 },
    { name: 'J-4', pratique: 47, modeJeu: 20, modeApprentissage: 27 },
    { name: 'J-3', pratique: 53, modeJeu: 26, modeApprentissage: 27 },
    { name: 'J-2', pratique: 61, modeJeu: 32, modeApprentissage: 29 },
    { name: 'J-1', pratique: 44, modeJeu: 19, modeApprentissage: 25 },
    { name: "Aujourd'hui", pratique: 72, modeJeu: 38, modeApprentissage: 34 },
  ];

  // Calculs des totaux pour la première carte
  const practiceData = getPracticeData();
  const totalPratique = practiceData.reduce(
    (sum, item) => sum + item.pratique,
    0
  );
  const totalModeJeu = practiceData.reduce(
    (sum, item) => sum + item.modeJeu,
    0
  );
  const totalModeApprentissage = practiceData.reduce(
    (sum, item) => sum + item.modeApprentissage,
    0
  );

  // Calculs des moyennes basés sur les données filtrées
  const avgPrecisionDroite = Math.round(
    getPrecisionData().reduce((sum, item) => sum + item.droite, 0) /
      getPrecisionData().length
  );
  const avgPrecisionGauche = Math.round(
    getPrecisionData().reduce((sum, item) => sum + item.gauche, 0) /
      getPrecisionData().length
  );
  const avgPrecisionDeux = Math.round(
    getPrecisionData().reduce((sum, item) => sum + item.deux, 0) /
      getPrecisionData().length
  );

  const avgPerformanceDroite = Math.round(
    getPerformanceData().reduce((sum, item) => sum + item.droite, 0) /
      getPerformanceData().length
  );
  const avgPerformanceGauche = Math.round(
    getPerformanceData().reduce((sum, item) => sum + item.gauche, 0) /
      getPerformanceData().length
  );
  const avgPerformanceDeux = Math.round(
    getPerformanceData().reduce((sum, item) => sum + item.deux, 0) /
      getPerformanceData().length
  );

  const avgScore = Math.round(
    getScoreData().reduce((sum, item) => sum + item.score, 0) /
      getScoreData().length
  );
  const avgCombo = Math.round(
    getScoreData().reduce((sum, item) => sum + item.combo, 0) /
      getScoreData().length
  );
  const avgMulti = Number(
    (
      getScoreData().reduce((sum, item) => sum + item.multi, 0) /
      getScoreData().length
    ).toFixed(2)
  );

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
          <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10 col-span-1 md:col-span-2 lg:col-span-3 row-span-2">
            <div className="h-full flex flex-col">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-white">
                  Statistiques de pratique
                </h2>
                <div className="flex flex-col items-center mb-2">
                  <div className="flex items-center justify-center space-x-4 mb-2">
                    <button
                      onClick={() =>
                        setPracticeIndex(Math.max(0, practiceIndex - 1))
                      }
                      disabled={practiceIndex === 0}
                      className="p-2 rounded-full hover:bg-white/10 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <IconChevronLeft size={20} className="text-indigo-400" />
                    </button>
                    <select
                      value={practiceInterval}
                      onChange={(e) => {
                        setPracticeInterval(Number(e.target.value));
                        const newInterval = Number(e.target.value);
                        setPracticeIndex(
                          getDefaultIndex(
                            extendedPracticeData.length,
                            newInterval
                          )
                        );
                      }}
                      className="bg-white/10 text-white text-sm rounded px-3 py-2 border border-white/20 min-w-[140px]"
                    >
                      {intervalOptions.map((option) => (
                        <option
                          key={option.value}
                          value={option.value}
                          className="bg-slate-800"
                        >
                          {option.label}
                        </option>
                      ))}
                    </select>
                    <button
                      onClick={() => setPracticeIndex(practiceIndex + 1)}
                      disabled={
                        (practiceIndex + 1) * practiceInterval >=
                        extendedPracticeData.length
                      }
                      className="p-2 rounded-full hover:bg-white/10 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <IconChevronRight size={20} className="text-indigo-400" />
                    </button>
                  </div>
                </div>
              </div>

              <div className="flex-grow">
                <ResponsiveContainer width="100%" height={250}>
                  <LineChart
                    data={getPracticeData()}
                    margin={{ top: 10, right: 30, left: -20, bottom: 0 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                    <XAxis
                      dataKey="name"
                      tick={{ fontSize: 12, fill: '#94a3b8' }}
                    />

                    {/* Un seul axe Y - Minutes */}
                    <YAxis tick={{ fontSize: 12, fill: '#94a3b8' }} />

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
                          return [`${value} min`, 'Temps de pratique total'];
                        if (name === 'modeJeu')
                          return [`${value} min`, 'Mode jeu'];
                        if (name === 'modeApprentissage')
                          return [`${value} min`, 'Mode apprentissage'];
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
                      dataKey="modeJeu"
                      stroke="#f59e0b"
                      strokeWidth={2}
                      strokeDasharray="5 5"
                      dot={{
                        r: 3,
                        fill: '#f59e0b',
                        strokeWidth: 0,
                      }}
                      activeDot={{ r: 5, fill: '#fbbf24', strokeWidth: 0 }}
                    />

                    {/* Ligne 3 - Temps de théorie */}
                    <Line
                      type="monotone"
                      dataKey="modeApprentissage"
                      stroke="#10b981"
                      strokeWidth={2}
                      strokeDasharray="10 5"
                      dot={{
                        r: 3,
                        fill: '#10b981',
                        strokeWidth: 0,
                      }}
                      activeDot={{ r: 5, fill: '#34d399', strokeWidth: 0 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              <Separator.Root className="h-px bg-slate-500 dark:bg-slate-800 my-4" />

              {/* Légende des métriques */}
              <div className="flex items-center justify-between flex-wrap gap-4 mb-4">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center">
                    <div className="w-4 h-2 bg-indigo-500 mr-2 rounded"></div>
                    <span className="text-xs text-slate-400 dark:text-slate-200">
                      Pratique
                    </span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-4 h-2 bg-amber-500 mr-2 rounded"></div>
                    <span className="text-xs text-slate-400 dark:text-slate-200">
                      Mode jeu
                    </span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-4 h-2 bg-green-500 mr-2 rounded"></div>
                    <span className="text-xs text-slate-400 dark:text-slate-200">
                      Mode apprentissage
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between px-8">
                <div className="flex flex-col items-center">
                  <span className="text-xs text-slate-300 dark:text-slate-100">
                    Pratique totale
                  </span>
                  <span className="text-xl font-bold text-indigo-600 dark:text-indigo-400">
                    {formatDuration(totalPratique, true)}
                  </span>
                </div>
                <div className="flex flex-col items-center">
                  <span className="text-xs text-slate-300 dark:text-slate-100">
                    Mode jeu
                  </span>
                  <span className="text-xl font-bold text-amber-500 dark:text-amber-400">
                    {formatDuration(totalModeJeu, true)}
                  </span>
                </div>
                <div className="flex flex-col items-center">
                  <span className="text-xs text-slate-300 dark:text-slate-100">
                    Mode apprentissage
                  </span>
                  <span className="text-xl font-bold text-green-500 dark:text-green-400">
                    {formatDuration(totalModeApprentissage, true)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Tuiles d'informations à droite */}

          {/* Score Record */}
          <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10 col-span-1">
            <div className="flex items-center justify-between mb-2">
              <IconTrophy
                size={20}
                className="text-yellow-600 dark:text-yellow-400"
              />
              <span className="text-xs bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300 px-2 py-1 rounded-full font-medium">
                Record
              </span>
            </div>
            <div className="text-2xl font-bold text-white mb-1">8,750</div>
            <div className="text-sm text-slate-300 dark:text-slate-100">
              Meilleur score
            </div>
            <div className="text-xs text-yellow-500 dark:text-yellow-400 mt-1">
              +12% ce mois
            </div>
          </div>

          {/* Précision Moyenne */}
          <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10 col-span-1">
            <div className="flex items-center justify-between mb-2">
              <IconTarget
                size={20}
                className="text-green-600 dark:text-green-400"
              />
              <span className="text-xs bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 px-2 py-1 rounded-full font-medium">
                Précision
              </span>
            </div>
            <div className="text-2xl font-bold text-white mb-1">87%</div>
            <div className="text-sm text-slate-300 dark:text-slate-100">
              Précision moyenne
            </div>
            <div className="text-xs text-green-500 dark:text-green-400 mt-1">
              +5% semaine
            </div>
          </div>

          {/* Sessions Totales */}
          <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10 col-span-1">
            <div className="flex items-center justify-between mb-2">
              <IconChartBar
                size={20}
                className="text-blue-600 dark:text-blue-400"
              />
              <span className="text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-2 py-1 rounded-full font-medium">
                Sessions
              </span>
            </div>
            <div className="text-2xl font-bold text-white mb-1">23</div>
            <div className="text-sm text-slate-300 dark:text-slate-100">
              Sessions jouées
            </div>
            <div className="text-xs text-blue-500 dark:text-blue-400 mt-1">
              Cette chanson
            </div>
          </div>

          {/* Temps de Pratique */}
          <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10 col-span-1">
            <div className="flex items-center justify-between mb-2">
              <IconClock
                size={20}
                className="text-purple-600 dark:text-purple-400"
              />
              <span className="text-xs bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 px-2 py-1 rounded-full font-medium">
                Temps
              </span>
            </div>
            <div className="text-2xl font-bold text-white mb-1">4h 5m</div>
            <div className="text-sm text-slate-300 dark:text-slate-100">
              Temps total
            </div>
            <div className="text-xs text-purple-500 dark:text-purple-400 mt-1">
              Sur cette chanson
            </div>
          </div>

          {/* Streak Actuel */}
          <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10 col-span-1">
            <div className="flex items-center justify-between mb-2">
              <IconFlame
                size={20}
                className="text-orange-600 dark:text-orange-400"
              />
              <span className="text-xs bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300 px-2 py-1 rounded-full font-medium">
                Streak
              </span>
            </div>
            <div className="text-2xl font-bold text-white mb-1">5</div>
            <div className="text-sm text-slate-300 dark:text-slate-100">
              Jours consécutifs
            </div>
            <div className="text-xs text-orange-500 dark:text-orange-400 mt-1">
              Record: 12 jours
            </div>
          </div>

          {/* Rang Global */}
          <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10 col-span-1">
            <div className="flex items-center justify-between mb-2">
              <IconMedal
                size={20}
                className="text-pink-600 dark:text-pink-400"
              />
              <span className="text-xs bg-pink-100 dark:bg-pink-900/30 text-pink-700 dark:text-pink-300 px-2 py-1 rounded-full font-medium">
                Rang
              </span>
            </div>
            <div className="text-2xl font-bold text-white mb-1">#12</div>
            <div className="text-sm text-slate-300 dark:text-slate-100">
              Classement global
            </div>
            <div className="text-xs text-pink-500 dark:text-pink-400 mt-1">
              Top 5%
            </div>
          </div>
        </div>
        {/* --- ONGLETS MODES --- */}
        <div className="mt-12">
          {/* Barre d'onglets */}
          <div className="flex items-center mb-8">
            <div className="bg-white/5 backdrop-blur-sm rounded-xl p-1 border border-white/10 flex">
              <button
                onClick={() => setActiveTab('apprentissage')}
                className={`flex items-center px-6 py-3 rounded-lg transition-all duration-300 transform hover:scale-105 ${
                  activeTab === 'apprentissage'
                    ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 scale-105 shadow-lg shadow-indigo-500/20'
                    : 'text-slate-400 hover:text-slate-300 hover:bg-white/10 hover:shadow-md'
                }`}
              >
                <IconBrain size={20} className="mr-2" />
                Mode Apprentissage
              </button>
              <button
                onClick={() => setActiveTab('jeu')}
                className={`flex items-center px-6 py-3 rounded-lg transition-all duration-300 transform hover:scale-105 ${
                  activeTab === 'jeu'
                    ? 'bg-orange-500/20 text-orange-300 border border-orange-500/30 scale-105 shadow-lg shadow-orange-500/20'
                    : 'text-slate-400 hover:text-slate-300 hover:bg-white/10 hover:shadow-md'
                }`}
              >
                <IconChartBar size={20} className="mr-2" />
                Mode Jeu
              </button>
            </div>
          </div>

          {/* Contenu conditionnel */}
          {activeTab === 'apprentissage' && (
            <div className="animate-in fade-in slide-in-from-right-8 duration-500">
              {/* Timeline Apprentissage */}
              <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10 mb-8">
                <h3 className="text-lg font-semibold text-white flex items-center mb-4">
                  <IconTimeline size={20} className="mr-2 text-yellow-400" />
                  Timeline des Records (Apprentissage)
                </h3>
                <RecordsTimeline records={learningRecords} />
              </div>

              {/* Layout créatif - Graphiques et tuiles */}
              <div className="grid grid-cols-12 gap-6 mb-8">
                {/* Tuiles compactes à gauche */}
                <div className="col-span-12 lg:col-span-5">
                  <div className="grid grid-cols-2 gap-4 h-full">
                    {learningTiles.map((tile, idx) => (
                      <div
                        key={idx}
                        className="bg-white/5 backdrop-blur-sm rounded-xl p-4 flex flex-col items-center justify-center border border-white/10 min-h-[120px]"
                      >
                        <div className="mb-2">{tile.icon}</div>
                        <div className="text-xl font-bold text-white">
                          {tile.value}
                        </div>
                        <div className="text-xs text-slate-300 dark:text-slate-100 mt-1 text-center">
                          {tile.label}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Graphique Précision à droite */}
                <div className="col-span-12 lg:col-span-7">
                  <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10 h-full">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold text-white flex items-center">
                        <IconTarget size={20} className="mr-2 text-green-400" />
                        Précision par session
                      </h3>
                      <div className="flex flex-col items-center mb-2">
                        <div className="flex items-center justify-center space-x-4 mb-2">
                          <button
                            onClick={() =>
                              setPrecisionIndex(Math.max(0, precisionIndex - 1))
                            }
                            disabled={precisionIndex === 0}
                            className="p-2 rounded-full hover:bg-white/10 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            <IconChevronLeft
                              size={20}
                              className="text-green-400"
                            />
                          </button>
                          <select
                            value={precisionInterval}
                            onChange={(e) => {
                              setPrecisionInterval(Number(e.target.value));
                              const newInterval = Number(e.target.value);
                              setPrecisionIndex(
                                getDefaultIndex(
                                  extendedLearningPrecisionData.length,
                                  newInterval
                                )
                              );
                            }}
                            className="bg-white/10 text-white text-sm rounded px-3 py-2 border border-white/20 min-w-[140px]"
                          >
                            {intervalOptions.map((option) => (
                              <option
                                key={option.value}
                                value={option.value}
                                className="bg-slate-800"
                              >
                                {option.label}
                              </option>
                            ))}
                          </select>
                          <button
                            onClick={() =>
                              setPrecisionIndex(precisionIndex + 1)
                            }
                            disabled={
                              (precisionIndex + 1) * precisionInterval >=
                              extendedLearningPrecisionData.length
                            }
                            className="p-2 rounded-full hover:bg-white/10 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            <IconChevronRight
                              size={20}
                              className="text-green-400"
                            />
                          </button>
                        </div>
                      </div>
                    </div>
                    <ResponsiveContainer width="100%" height={250}>
                      <LineChart
                        data={getPrecisionData()}
                        margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                        <XAxis
                          dataKey="session"
                          tick={{ fontSize: 12, fill: '#94a3b8' }}
                        />
                        <YAxis
                          domain={[60, 100]}
                          tick={{ fontSize: 12, fill: '#94a3b8' }}
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
                            if (name === 'droite')
                              return [`${value}%`, 'Main droite'];
                            if (name === 'gauche')
                              return [`${value}%`, 'Main gauche'];
                            if (name === 'deux')
                              return [`${value}%`, 'Deux mains'];
                            return [value, name];
                          }}
                        />

                        <Line
                          type="monotone"
                          dataKey="droite"
                          stroke="#6366f1"
                          strokeWidth={3}
                          dot={{ r: 4, fill: '#6366f1', strokeWidth: 0 }}
                          activeDot={{ r: 6, fill: '#818cf8' }}
                        />
                        <Line
                          type="monotone"
                          dataKey="gauche"
                          stroke="#10b981"
                          strokeWidth={2}
                          strokeDasharray="5 5"
                          dot={{ r: 3, fill: '#10b981', strokeWidth: 0 }}
                          activeDot={{ r: 5, fill: '#34d399' }}
                        />
                        <Line
                          type="monotone"
                          dataKey="deux"
                          stroke="#f59e0b"
                          strokeWidth={2}
                          strokeDasharray="10 5"
                          dot={{ r: 3, fill: '#f59e0b', strokeWidth: 0 }}
                          activeDot={{ r: 5, fill: '#fbbf24' }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                    <Separator.Root className="h-px bg-slate-500 dark:bg-slate-800 my-4" />
                    <div className="flex items-center justify-between flex-wrap gap-4 mt-4 mb-2">
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center">
                          <div className="w-4 h-2 bg-indigo-500 mr-2 rounded"></div>
                          <span className="text-xs text-slate-400 dark:text-slate-200">
                            Main droite
                          </span>
                        </div>
                        <div className="flex items-center">
                          <div className="w-4 h-2 bg-green-500 border-dashed border-t mr-2 rounded"></div>
                          <span className="text-xs text-slate-400 dark:text-slate-200">
                            Main gauche
                          </span>
                        </div>
                        <div className="flex items-center">
                          <div className="w-4 h-2 bg-amber-500 border-dashed border-t mr-2 rounded"></div>
                          <span className="text-xs text-slate-400 dark:text-slate-200">
                            Deux mains
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="mt-6">
                      <p className="text-base text-slate-300 dark:text-slate-100 mb-3">
                        Précisions moyennes
                      </p>
                      <div className="flex items-center justify-between px-8">
                        <div className="flex flex-col items-center">
                          <span className="text-xs text-slate-300 dark:text-slate-100">
                            Deux mains
                          </span>
                          <span className="text-xl font-bold text-amber-500 dark:text-amber-400">
                            {avgPrecisionDeux}%
                          </span>
                        </div>
                        <div className="flex flex-col items-center">
                          <span className="text-xs text-slate-300 dark:text-slate-100">
                            Main droite
                          </span>
                          <span className="text-xl font-bold text-indigo-600 dark:text-indigo-400">
                            {avgPrecisionDroite}%
                          </span>
                        </div>
                        <div className="flex flex-col items-center">
                          <span className="text-xs text-slate-300 dark:text-slate-100">
                            Main gauche
                          </span>
                          <span className="text-xl font-bold text-green-500 dark:text-green-400">
                            {avgPrecisionGauche}%
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Layout inversé pour Performance */}
              <div className="grid grid-cols-12 gap-6 mb-8">
                {/* Graphique Performance à gauche */}
                <div className="col-span-12 lg:col-span-7">
                  <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10 h-full">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold text-white flex items-center">
                        <IconStar size={20} className="mr-2 text-pink-400" />
                        Performance par session
                      </h3>
                      <div className="flex flex-col items-center mb-2">
                        <div className="flex items-center justify-center space-x-4 mb-2">
                          <button
                            onClick={() =>
                              setPerformanceIndex(
                                Math.max(0, performanceIndex - 1)
                              )
                            }
                            disabled={performanceIndex === 0}
                            className="p-2 rounded-full hover:bg-white/10 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            <IconChevronLeft
                              size={20}
                              className="text-pink-400"
                            />
                          </button>
                          <select
                            value={performanceInterval}
                            onChange={(e) => {
                              setPerformanceInterval(Number(e.target.value));
                              const newInterval = Number(e.target.value);
                              setPerformanceIndex(
                                getDefaultIndex(
                                  extendedLearningPerformanceData.length,
                                  newInterval
                                )
                              );
                            }}
                            className="bg-white/10 text-white text-sm rounded px-3 py-2 border border-white/20 min-w-[140px]"
                          >
                            {intervalOptions.map((option) => (
                              <option
                                key={option.value}
                                value={option.value}
                                className="bg-slate-800"
                              >
                                {option.label}
                              </option>
                            ))}
                          </select>
                          <button
                            onClick={() =>
                              setPerformanceIndex(performanceIndex + 1)
                            }
                            disabled={
                              (performanceIndex + 1) * performanceInterval >=
                              extendedLearningPerformanceData.length
                            }
                            className="p-2 rounded-full hover:bg-white/10 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            <IconChevronRight
                              size={20}
                              className="text-pink-400"
                            />
                          </button>
                        </div>
                      </div>
                    </div>
                    <ResponsiveContainer width="100%" height={250}>
                      <LineChart
                        data={getPerformanceData()}
                        margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                        <XAxis
                          dataKey="session"
                          tick={{ fontSize: 12, fill: '#94a3b8' }}
                        />
                        <YAxis
                          domain={[60, 100]}
                          tick={{ fontSize: 12, fill: '#94a3b8' }}
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
                            if (name === 'droite')
                              return [`${value}%`, 'Main droite'];
                            if (name === 'gauche')
                              return [`${value}%`, 'Main gauche'];
                            if (name === 'deux')
                              return [`${value}%`, 'Deux mains'];
                            return [value, name];
                          }}
                        />

                        <Line
                          type="monotone"
                          dataKey="droite"
                          stroke="#6366f1"
                          strokeWidth={3}
                          dot={{ r: 4, fill: '#6366f1', strokeWidth: 0 }}
                          activeDot={{ r: 6, fill: '#818cf8' }}
                        />
                        <Line
                          type="monotone"
                          dataKey="gauche"
                          stroke="#10b981"
                          strokeWidth={2}
                          strokeDasharray="5 5"
                          dot={{ r: 3, fill: '#10b981', strokeWidth: 0 }}
                          activeDot={{ r: 5, fill: '#34d399' }}
                        />
                        <Line
                          type="monotone"
                          dataKey="deux"
                          stroke="#f59e0b"
                          strokeWidth={2}
                          strokeDasharray="10 5"
                          dot={{ r: 3, fill: '#f59e0b', strokeWidth: 0 }}
                          activeDot={{ r: 5, fill: '#fbbf24' }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                    <Separator.Root className="h-px bg-slate-500 dark:bg-slate-800 my-4" />
                    <div className="flex items-center justify-between flex-wrap gap-4 mt-4 mb-2">
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center">
                          <div className="w-4 h-2 bg-indigo-500 mr-2 rounded"></div>
                          <span className="text-xs text-slate-400 dark:text-slate-200">
                            Main droite
                          </span>
                        </div>
                        <div className="flex items-center">
                          <div className="w-4 h-2 bg-green-500 border-dashed border-t mr-2 rounded"></div>
                          <span className="text-xs text-slate-400 dark:text-slate-200">
                            Main gauche
                          </span>
                        </div>
                        <div className="flex items-center">
                          <div className="w-4 h-2 bg-amber-500 border-dashed border-t mr-2 rounded"></div>
                          <span className="text-xs text-slate-400 dark:text-slate-200">
                            Deux mains
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="mt-6">
                      <p className="text-base text-slate-300 dark:text-slate-100 mb-3">
                        Performances moyennes
                      </p>
                      <div className="flex items-center justify-between px-8">
                        <div className="flex flex-col items-center">
                          <span className="text-xs text-slate-300 dark:text-slate-100">
                            Deux mains
                          </span>
                          <span className="text-xl font-bold text-amber-500 dark:text-amber-400">
                            {avgPerformanceDeux}%
                          </span>
                        </div>
                        <div className="flex flex-col items-center">
                          <span className="text-xs text-slate-300 dark:text-slate-100">
                            Main droite
                          </span>
                          <span className="text-xl font-bold text-indigo-600 dark:text-indigo-400">
                            {avgPerformanceDroite}%
                          </span>
                        </div>
                        <div className="flex flex-col items-center">
                          <span className="text-xs text-slate-300 dark:text-slate-100">
                            Main gauche
                          </span>
                          <span className="text-xl font-bold text-green-500 dark:text-green-400">
                            {avgPerformanceGauche}%
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Graphique en barres à droite */}
                <div className="col-span-12 lg:col-span-5">
                  <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10 h-full">
                    <h3 className="text-lg font-semibold text-white flex items-center mb-4">
                      <IconChartBar
                        size={20}
                        className="mr-2 text-indigo-400"
                      />
                      Précision & Performance par mois
                    </h3>
                    <div className="flex flex-col items-center mb-2">
                      <div className="flex items-center justify-center space-x-4 mb-2">
                        <button
                          className="p-2 rounded-full hover:bg-white/10 transition-colors"
                          onClick={() =>
                            setLearningBarIndex((i) => Math.max(0, i - 1))
                          }
                          aria-label="6 mois précédents"
                        >
                          <IconChevronLeft
                            size={20}
                            className="text-indigo-400"
                          />
                        </button>
                        <span className="text-sm font-medium text-white/90">
                          {learningBarIntervals[learningBarIndex].label}
                        </span>
                        <button
                          className="p-2 rounded-full hover:bg-white/10 transition-colors"
                          onClick={() =>
                            setLearningBarIndex((i) =>
                              Math.min(learningBarIntervals.length - 1, i + 1)
                            )
                          }
                          aria-label="6 mois suivants"
                        >
                          <IconChevronRight
                            size={20}
                            className="text-indigo-400"
                          />
                        </button>
                      </div>
                    </div>
                    <ResponsiveContainer width="100%" height={280}>
                      <BarChart
                        data={learningBarIntervals[learningBarIndex].data}
                        margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                        <XAxis
                          dataKey="mois"
                          tick={{ fontSize: 12, fill: '#94a3b8' }}
                        />
                        <YAxis
                          domain={[70, 100]}
                          tick={{ fontSize: 12, fill: '#94a3b8' }}
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
                            if (name === 'precision')
                              return [`${value}%`, 'Précision'];
                            if (name === 'performance')
                              return [`${value}%`, 'Performance'];
                            return [value, name];
                          }}
                        />

                        <Bar
                          dataKey="precision"
                          fill="#6366f1"
                          radius={[4, 4, 0, 0]}
                        />
                        <Bar
                          dataKey="performance"
                          fill="#f59e0b"
                          radius={[4, 4, 0, 0]}
                        />
                      </BarChart>
                    </ResponsiveContainer>
                    <Separator.Root className="h-px bg-slate-500 dark:bg-slate-800 my-4" />
                    <div className="flex items-center justify-between flex-wrap gap-4 mt-2 mb-2">
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center">
                          <div className="w-3 h-3 bg-indigo-500 rounded-full mr-2"></div>
                          <span className="text-xs text-slate-400 dark:text-slate-200">
                            Précision
                          </span>
                        </div>
                        <div className="flex items-center">
                          <div className="w-3 h-3 bg-amber-500 rounded-full mr-2"></div>
                          <span className="text-xs text-slate-400 dark:text-slate-200">
                            Performance
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'jeu' && (
            <div className="animate-in fade-in slide-in-from-left-8 duration-500">
              {/* Timeline Jeu */}
              <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10 mb-8">
                <h3 className="text-lg font-semibold text-white flex items-center mb-4">
                  <IconTimeline size={20} className="mr-2 text-orange-400" />
                  Timeline des Records (Jeu)
                </h3>
                <RecordsTimeline records={gameRecords} />
              </div>

              {/* Tuiles d'infos en ligne */}
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
                {gameTiles.map((tile, idx) => (
                  <div
                    key={idx}
                    className="bg-white/5 backdrop-blur-sm rounded-xl p-4 flex flex-col items-center justify-center border border-white/10 min-h-[120px]"
                  >
                    <div className="mb-2">{tile.icon}</div>
                    <div className="text-xl font-bold text-white">
                      {tile.value}
                    </div>
                    <div className="text-xs text-slate-300 dark:text-slate-100 mt-1 text-center">
                      {tile.label}
                    </div>
                  </div>
                ))}
              </div>

              {/* Graphiques côte à côte */}
              <div className="grid grid-cols-12 gap-6 mb-8">
                {/* Graphique Score par session */}
                <div className="col-span-12 lg:col-span-6">
                  <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10 h-full">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold text-white flex items-center">
                        <IconTrophy
                          size={20}
                          className="mr-2 text-yellow-400"
                        />
                        Score par session
                      </h3>
                      <div className="flex flex-col items-center mb-2">
                        <div className="flex items-center justify-center space-x-4 mb-2">
                          <button
                            onClick={() =>
                              setScoreIndex(Math.max(0, scoreIndex - 1))
                            }
                            disabled={scoreIndex === 0}
                            className="p-2 rounded-full hover:bg-white/10 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            <IconChevronLeft
                              size={20}
                              className="text-yellow-400"
                            />
                          </button>
                          <select
                            value={scoreInterval}
                            onChange={(e) => {
                              setScoreInterval(Number(e.target.value));
                              const newInterval = Number(e.target.value);
                              setScoreIndex(
                                getDefaultIndex(
                                  extendedGameScoreLineData.length,
                                  newInterval
                                )
                              );
                            }}
                            className="bg-white/10 text-white text-sm rounded px-3 py-2 border border-white/20 min-w-[140px]"
                          >
                            {intervalOptions.map((option) => (
                              <option
                                key={option.value}
                                value={option.value}
                                className="bg-slate-800"
                              >
                                {option.label}
                              </option>
                            ))}
                          </select>
                          <button
                            onClick={() => setScoreIndex(scoreIndex + 1)}
                            disabled={
                              (scoreIndex + 1) * scoreInterval >=
                              extendedGameScoreLineData.length
                            }
                            className="p-2 rounded-full hover:bg-white/10 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            <IconChevronRight
                              size={20}
                              className="text-yellow-400"
                            />
                          </button>
                        </div>
                      </div>
                    </div>
                    <ResponsiveContainer width="100%" height={250}>
                      <LineChart
                        data={getScoreData()}
                        margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                        <XAxis
                          dataKey="session"
                          tick={{ fontSize: 12, fill: '#94a3b8' }}
                        />
                        {/* Axe principal : score */}
                        <YAxis
                          yAxisId="score"
                          domain={[8000, 10000]}
                          tick={{ fontSize: 12, fill: '#94a3b8' }}
                        />
                        {/* Axe secondaire : combo */}
                        <YAxis
                          yAxisId="combo"
                          orientation="left"
                          domain={[300, 600]}
                          tick={{ fontSize: 12, fill: '#f59e0b' }}
                        />
                        {/* Axe secondaire : multi */}
                        <YAxis
                          yAxisId="multi"
                          orientation="left"
                          domain={[3, 5]}
                          tick={{ fontSize: 12, fill: '#10b981' }}
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
                            if (name === 'score')
                              return [`${value} points`, 'Score'];
                            if (name === 'combo')
                              return [`${value} notes`, 'Combo max'];
                            if (name === 'multi')
                              return [`x${value}`, 'Multiplicateur max'];
                            return [value, name];
                          }}
                        />
                        <Line
                          yAxisId="score"
                          type="monotone"
                          dataKey="score"
                          stroke="#6366f1"
                          strokeWidth={3}
                          dot={{ r: 4, fill: '#6366f1', strokeWidth: 0 }}
                          activeDot={{ r: 6, fill: '#818cf8' }}
                        />
                        <Line
                          yAxisId="combo"
                          type="monotone"
                          dataKey="combo"
                          stroke="#f59e0b"
                          strokeWidth={2}
                          strokeDasharray="10 5"
                          dot={{ r: 3, fill: '#f59e0b', strokeWidth: 0 }}
                          activeDot={{ r: 5, fill: '#fbbf24' }}
                        />
                        <Line
                          yAxisId="multi"
                          type="monotone"
                          dataKey="multi"
                          stroke="#10b981"
                          strokeWidth={2}
                          strokeDasharray="5 5"
                          dot={{ r: 3, fill: '#10b981', strokeWidth: 0 }}
                          activeDot={{ r: 5, fill: '#34d399' }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                    <Separator.Root className="h-px bg-slate-500 dark:bg-slate-800 my-4" />
                    <div className="flex items-center justify-between flex-wrap gap-4 mt-4 mb-2">
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center">
                          <div className="w-4 h-2 bg-indigo-500 mr-2 rounded"></div>
                          <span className="text-xs text-slate-400 dark:text-slate-200">
                            Score
                          </span>
                        </div>
                        <div className="flex items-center">
                          <div className="w-4 h-2 bg-amber-500 mr-2 rounded"></div>
                          <span className="text-xs text-slate-400 dark:text-slate-200">
                            Combo max
                          </span>
                        </div>
                        <div className="flex items-center">
                          <div className="w-4 h-2 bg-green-500 mr-2 rounded"></div>
                          <span className="text-xs text-slate-400 dark:text-slate-200">
                            Multiplicateur max
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="mt-6">
                      <p className="text-base text-slate-300 dark:text-slate-100 mb-3">
                        Moyennes sur la période
                      </p>
                      <div className="flex items-center justify-between px-8">
                        <div className="flex flex-col items-center">
                          <span className="text-xs text-slate-300 dark:text-slate-100">
                            Score
                          </span>
                          <span className="text-xl font-bold text-indigo-600 dark:text-indigo-400">
                            {avgScore}
                          </span>
                        </div>
                        <div className="flex flex-col items-center">
                          <span className="text-xs text-slate-300 dark:text-slate-100">
                            Combo
                          </span>
                          <span className="text-xl font-bold text-amber-500 dark:text-amber-400">
                            {avgCombo}
                          </span>
                        </div>
                        <div className="flex flex-col items-center">
                          <span className="text-xs text-slate-300 dark:text-slate-100">
                            Multiplicateur
                          </span>
                          <span className="text-xl font-bold text-green-500 dark:text-green-400">
                            x{avgMulti}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Graphique en barres à droite */}
                <div className="col-span-12 lg:col-span-6">
                  <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
                    <h3 className="text-lg font-semibold text-white flex items-center mb-4">
                      <IconChartBar
                        size={20}
                        className="mr-2 text-orange-400"
                      />
                      Score, combo & multiplicateur par mois
                    </h3>
                    <div className="flex flex-col items-center mb-2">
                      <div className="flex items-center justify-center space-x-4 mb-2">
                        <button
                          className="p-2 rounded-full hover:bg-white/10 transition-colors"
                          onClick={() =>
                            setGameBarIndex((i) => Math.max(0, i - 1))
                          }
                          aria-label="6 mois précédents"
                        >
                          <IconChevronLeft
                            size={20}
                            className="text-orange-400"
                          />
                        </button>
                        <span className="text-sm font-medium text-white/90">
                          {gameBarIntervals[gameBarIndex].label}
                        </span>
                        <button
                          className="p-2 rounded-full hover:bg-white/10 transition-colors"
                          onClick={() =>
                            setGameBarIndex((i) =>
                              Math.min(gameBarIntervals.length - 1, i + 1)
                            )
                          }
                          aria-label="6 mois suivants"
                        >
                          <IconChevronRight
                            size={20}
                            className="text-orange-400"
                          />
                        </button>
                      </div>
                    </div>
                    <ResponsiveContainer width="100%" height={280}>
                      <BarChart
                        data={gameBarIntervals[gameBarIndex].data}
                        margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                        <XAxis
                          dataKey="mois"
                          tick={{ fontSize: 12, fill: '#94a3b8' }}
                        />
                        <YAxis
                          yAxisId="score"
                          domain={[8000, 10000]}
                          tick={{ fontSize: 12, fill: '#94a3b8' }}
                        />
                        <YAxis
                          yAxisId="combo"
                          orientation="left"
                          domain={[300, 600]}
                          tick={{ fontSize: 12, fill: '#f59e0b' }}
                        />
                        <YAxis
                          yAxisId="multi"
                          orientation="left"
                          domain={[3, 5]}
                          tick={{ fontSize: 12, fill: '#10b981' }}
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
                            if (name === 'score')
                              return [`${value} points`, 'Meilleur score'];
                            if (name === 'combo')
                              return [`${value} notes`, 'Combo max'];
                            if (name === 'multi')
                              return [`x${value}`, 'Multiplicateur max'];
                            return [value, name];
                          }}
                        />

                        <Bar
                          yAxisId="score"
                          dataKey="score"
                          fill="#6366f1"
                          radius={[4, 4, 0, 0]}
                        />
                        <Bar
                          yAxisId="combo"
                          dataKey="combo"
                          fill="#f59e0b"
                          radius={[4, 4, 0, 0]}
                        />
                        <Bar
                          yAxisId="multi"
                          dataKey="multi"
                          fill="#10b981"
                          radius={[4, 4, 0, 0]}
                        />
                      </BarChart>
                    </ResponsiveContainer>
                    <Separator.Root className="h-px bg-slate-500 dark:bg-slate-800 my-4" />
                    <div className="flex items-center justify-between flex-wrap gap-4 mt-2 mb-2">
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center">
                          <div className="w-3 h-3 bg-indigo-500 rounded-full mr-2"></div>
                          <span className="text-xs text-slate-400 dark:text-slate-200">
                            Meilleur score
                          </span>
                        </div>
                        <div className="flex items-center">
                          <div className="w-3 h-3 bg-amber-500 rounded-full mr-2"></div>
                          <span className="text-xs text-slate-400 dark:text-slate-200">
                            Combo max
                          </span>
                        </div>
                        <div className="flex items-center">
                          <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                          <span className="text-xs text-slate-400 dark:text-slate-200">
                            Multiplicateur max
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
