import {
  IconRocket,
  IconTrophy,
  IconTarget,
  IconFlame,
  IconBolt,
  IconClock,
  IconStar,
  IconMedal,
} from '@tabler/icons-react';
import { TimelineRecord } from '../../../components/timeline/RecordsTimeline';

export interface IntervalOption {
  value: number;
  label: string;
}

export const defaultIntervalOptions: IntervalOption[] = [
  { value: 7, label: '7 sessions' },
  { value: 15, label: '15 sessions' },
  { value: 30, label: '30 sessions' },
];

export const getDefaultIndex = (
  dataLength: number,
  interval: number = 7
): number => {
  const numCompleteIntervals = Math.floor(dataLength / interval);
  return Math.max(0, numCompleteIntervals - 1);
};

export const getBubbleColor = (type: string) => {
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

export const getBubbleBorderColor = (type: string) => {
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

export const getPopupIcon = (type: string) => {
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

export const getIcon = (type: string, isSelected: boolean = false) => {
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

export const getIconColor = (type: string) => {
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

export const getValueDisplay = (record: TimelineRecord) => {
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
