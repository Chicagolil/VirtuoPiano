'use client';

import { useEffect, useState } from 'react';
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

export interface TimelineRecord {
  id: number;
  date: string;
  score: number;
  type: string;
  description: string;
  details: string;
}

interface RecordsTimelineProps {
  records: TimelineRecord[];
}

export default function RecordsTimeline({ records }: RecordsTimelineProps) {
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

  const getValueDisplay = (record: TimelineRecord) => {
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
        {/* Ligne de base */}
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
                    ? 'bottom-16 left-0 transform translate-x-0'
                    : index === records.length - 1
                    ? 'bottom-16 right-0 transform translate-x-0'
                    : 'bottom-16 left-1/2 transform -translate-x-1/2'
                }`}
              >
                <div className="bg-white dark:bg-slate-800 rounded-xl shadow-2xl border border-slate-200 dark:border-slate-700 p-4 min-w-[280px] max-w-[320px]">
                  {/* Flèche vers le bas */}
                  <div
                    className={`absolute top-full w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-white dark:border-t-slate-800 ${
                      index === 0
                        ? 'left-6'
                        : index === records.length - 1
                        ? 'right-6'
                        : 'left-1/2 transform -translate-x-1/2'
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
    </div>
  );
}
