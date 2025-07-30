import { Spinner } from '@/components/ui/spinner';
import { IconChevronRight } from '@tabler/icons-react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import * as Separator from '@radix-ui/react-separator';
import {
  useSongPracticeData,
  useInvalidatePracticeCache,
  usePrefetchAdjacentData,
} from '@/customHooks/useSongPerformances';
import { useState, useEffect } from 'react';
import { formatDuration } from '@/common/utils/function';
import { defaultIntervalOptions } from '../utils/chartUtils';
import ChartSummary from './ChartSummary';

export default function PracticeGraph({ songId }: { songId: string }) {
  const [practiceInterval, setPracticeInterval] = useState(7);
  const [practiceIndex, setPracticeIndex] = useState(0);

  const {
    data: practiceResult,
    isLoading: practiceLoading,
    error: practiceError,
  } = useSongPracticeData(songId, practiceInterval, practiceIndex);

  const { invalidatePracticeDataOnly } = useInvalidatePracticeCache();
  const { prefetchAdjacent } = usePrefetchAdjacentData(
    songId,
    practiceInterval,
    practiceIndex
  );

  // Précharger les données adjacentes quand les données changent
  useEffect(() => {
    if (practiceResult?.data) {
      prefetchAdjacent();
    }
  }, [practiceResult?.data, prefetchAdjacent]);

  // Fonctions pour obtenir les données
  const getPracticeData = () => {
    if (!practiceResult?.data?.current?.data) {
      return [];
    }
    return practiceResult.data.current.data;
  };

  // Calculs des totaux
  const practiceData = getPracticeData();
  const currentData = practiceResult?.data?.current;

  const totalPratique = currentData?.totalPratique || 0;
  const totalModeJeu = currentData?.totalModeJeu || 0;
  const totalModeApprentissage = currentData?.totalModeApprentissage || 0;

  return (
    <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10 col-span-1 md:col-span-2 lg:col-span-2 row-span-2">
      <div className="h-full flex flex-col">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-white">
            Statistiques de pratique
          </h2>
          <div className="flex flex-col items-center mb-2">
            <div className="flex items-center justify-center space-x-4 mb-2">
              <button
                onClick={() => setPracticeIndex(practiceIndex + 1)}
                disabled={practiceLoading || practiceIndex >= 10} // Limite à 10 intervalles en arrière
                className="p-2 rounded-full hover:bg-white/10 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <IconChevronRight
                  size={20}
                  className="text-indigo-400 rotate-180"
                />
              </button>
              <select
                value={practiceInterval}
                onChange={(e) => {
                  const newInterval = Number(e.target.value);
                  setPracticeInterval(newInterval);
                  setPracticeIndex(0); // Reset à l'index 0 quand on change l'intervalle
                  // Invalider seulement les données de pratique (graphiques) pour le nouvel intervalle
                  invalidatePracticeDataOnly(songId);
                }}
                disabled={practiceLoading}
                className="bg-white/10 text-white text-sm rounded px-3 py-2 border border-white/20 min-w-[140px] disabled:opacity-50"
              >
                {defaultIntervalOptions.map((option) => (
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
                onClick={() => setPracticeIndex(Math.max(0, practiceIndex - 1))}
                disabled={practiceIndex === 0}
                className="p-2 rounded-full hover:bg-white/10 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <IconChevronRight size={20} className="text-indigo-400" />
              </button>
            </div>
          </div>
        </div>

        {practiceLoading ? (
          <div className="flex items-center justify-center h-[250px]">
            <Spinner variant="bars" size={32} className="text-white" />
          </div>
        ) : practiceError ? (
          <div className="flex items-center justify-center h-[250px]">
            <div className="text-center text-red-400 text-sm">
              {practiceError.message || 'Erreur lors du chargement'}
            </div>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={250}>
            <LineChart
              data={practiceData}
              margin={{ top: 10, right: 30, left: -20, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
              <XAxis dataKey="name" tick={{ fontSize: 12, fill: '#94a3b8' }} />
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
                  const nameMap: Record<string, string> = {
                    pratique: 'Temps de pratique total',
                    modeJeu: 'Mode jeu',
                    modeApprentissage: 'Mode apprentissage',
                  };
                  return [`${value} min`, nameMap[name as string] || name];
                }}
              />
              <Line
                type="monotone"
                dataKey="pratique"
                stroke="#6366f1"
                strokeWidth={3}
                dot={{ r: 4, fill: '#6366f1', strokeWidth: 0 }}
                activeDot={{ r: 6, fill: '#818cf8', strokeWidth: 0 }}
              />
              <Line
                type="monotone"
                dataKey="modeJeu"
                stroke="#f59e0b"
                strokeWidth={2}
                strokeDasharray="5 5"
                dot={{ r: 3, fill: '#f59e0b', strokeWidth: 0 }}
                activeDot={{ r: 5, fill: '#fbbf24', strokeWidth: 0 }}
              />
              <Line
                type="monotone"
                dataKey="modeApprentissage"
                stroke="#10b981"
                strokeWidth={2}
                strokeDasharray="10 5"
                dot={{ r: 3, fill: '#10b981', strokeWidth: 0 }}
                activeDot={{ r: 5, fill: '#34d399', strokeWidth: 0 }}
              />
            </LineChart>
          </ResponsiveContainer>
        )}

        <Separator.Root className="h-px bg-slate-500 dark:bg-slate-800 my-4" />

        {/* Légende */}
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

        <ChartSummary
          title=""
          items={[
            {
              label: 'Pratique totale',
              value: formatDuration(totalPratique, true),
              color: 'text-indigo-600 dark:text-indigo-400',
            },
            {
              label: 'Mode jeu',
              value: formatDuration(totalModeJeu, true),
              color: 'text-amber-500 dark:text-amber-400',
            },
            {
              label: 'Mode apprentissage',
              value: formatDuration(totalModeApprentissage, true),
              color: 'text-green-500 dark:text-green-400',
            },
          ]}
        />
      </div>
    </div>
  );
}
