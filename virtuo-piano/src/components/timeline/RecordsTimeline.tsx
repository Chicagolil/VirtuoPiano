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
import { Spinner } from '@/components/ui/spinner';
import {
  getBubbleBorderColor,
  getBubbleColor,
  getIcon,
  getPopupIcon,
  getValueDisplay,
} from '../../features/performances/utils/chartUtils';

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
  isLoading: boolean;
  error: Error | null;
}

export default function RecordsTimeline({
  records,
  isLoading,
  error,
}: RecordsTimelineProps) {
  const [selectedRecord, setSelectedRecord] = useState<number | null>(null);
  const [mounted, setMounted] = useState(false);
  const [animateRecords, setAnimateRecords] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Déclencher l'animation quand les données changent
  useEffect(() => {
    if (mounted && records.length > 0 && !isLoading) {
      setAnimateRecords(false);
      // Petit délai pour permettre au DOM de se mettre à jour
      const timer = setTimeout(() => {
        setAnimateRecords(true);
      }, 50);
      return () => clearTimeout(timer);
    }
  }, [records, mounted, isLoading]);

  return (
    <div className="relative">
      {/* Timeline horizontale */}
      <div className="relative flex items-center justify-between px-4 py-8">
        {/* Ligne de base */}
        <div className="absolute top-1/2 left-6 right-6 h-0.5 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 transform -translate-y-1/2"></div>

        {/* Bulles d'icônes */}

        {isLoading ? (
          <div className="flex items-center justify-center w-full">
            <Spinner variant="bars" size={32} className="text-white" />
          </div>
        ) : error ? (
          <div className="flex items-center justify-center w-full">
            <div className="text-center text-red-400 text-sm">
              {error.message || 'Erreur lors du chargement'}
            </div>
          </div>
        ) : (
          records.map((record, index) => (
            <div
              key={record.id}
              className={`relative z-10 ${
                animateRecords ? 'opacity-100 scale-100' : 'opacity-0 scale-75'
              } animate-timeline-bubble`}
              style={{
                transitionDelay: animateRecords ? `${index * 400}ms` : '0ms',
              }}
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
                      )} border-white hover:${getBubbleBorderColor(
                        record.type
                      )}`
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
                  <div
                    className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white animate-pulse"
                    data-testid="selected-indicator"
                  ></div>
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
          ))
        )}
      </div>
    </div>
  );
}
