import { IconTarget } from '@tabler/icons-react';
import LineChartWithNavigation from './LineChartWithNavigation';
import { defaultIntervalOptions } from '../utils/chartUtils';
import ChartSummary from './ChartSummary';
import { useEffect, useState } from 'react';
import {
  useSongLearningPrecisionData,
  usePrefetchLearningPrecisionData,
  useInvalidatePracticeCache,
} from '@/customHooks/useSongPerformances';

export default function PrecisionChart({ songId }: { songId: string }) {
  const [precisionInterval, setPrecisionInterval] = useState(7);
  const [precisionIndex, setPrecisionIndex] = useState(0);

  // Hooks React Query
  const {
    data: precisionResult,
    isLoading: precisionLoading,
    error: precisionError,
  } = useSongLearningPrecisionData(songId, precisionInterval, precisionIndex);

  const { prefetchAdjacent } = usePrefetchLearningPrecisionData(
    songId,
    precisionInterval,
    precisionIndex
  );

  const { invalidatePrecisionDataOnly } = useInvalidatePracticeCache();

  // Précharger les données adjacentes
  useEffect(() => {
    prefetchAdjacent();
  }, [songId, precisionInterval, precisionIndex, prefetchAdjacent]);

  // Gestion des changements d'intervalle et d'index
  const handleIntervalChange = (newInterval: number) => {
    setPrecisionInterval(newInterval);
    setPrecisionIndex(0); // Reset à l'index 0 pour le nouvel intervalle
    invalidatePrecisionDataOnly(songId);
  };

  const handleIndexChange = (newIndex: number) => {
    setPrecisionIndex(newIndex);
  };

  // Données pour le graphique
  const precisionData = precisionResult?.data?.current?.data || [];
  const precisionLines = [
    {
      dataKey: 'precisionBothHands',
      color: '#f59e0b',
      name: 'Deux mains',
      strokeWidth: 3,
    },
    {
      dataKey: 'precisionRightHand',
      color: '#6366f1',
      name: 'Main droite',
      strokeDasharray: '5 5',
    },
    {
      dataKey: 'precisionLeftHand',
      color: '#10b981',
      name: 'Main gauche',
      strokeDasharray: '10 5',
    },
  ];

  // Calculer les moyennes
  const avgPrecisionBothHands =
    precisionResult?.data?.current?.averagePrecisionBothHands || 0;
  const avgPrecisionRightHand =
    precisionResult?.data?.current?.averagePrecisionRightHand || 0;
  const avgPrecisionLeftHand =
    precisionResult?.data?.current?.averagePrecisionLeftHand || 0;

  return (
    <div className="col-span-12 lg:col-span-7">
      <LineChartWithNavigation
        isLoading={precisionLoading}
        error={precisionError}
        title="Précision par session"
        icon={<IconTarget size={20} className="mr-2 text-green-400" />}
        data={precisionData}
        lines={precisionLines}
        interval={precisionInterval}
        index={precisionIndex}
        onIntervalChange={handleIntervalChange}
        onIndexChange={handleIndexChange}
        maxDataLength={precisionResult?.data?.current?.totalSessions || 0}
        themeColor="text-green-400"
        intervalOptions={defaultIntervalOptions}
        summary={
          <ChartSummary
            title="Précisions moyennes"
            items={[
              {
                label: 'Deux mains',
                value: `${avgPrecisionBothHands}%`,
                color: 'text-amber-500 dark:text-amber-400',
              },
              {
                label: 'Main droite',
                value: `${avgPrecisionRightHand}%`,
                color: 'text-indigo-600 dark:text-indigo-400',
              },
              {
                label: 'Main gauche',
                value: `${avgPrecisionLeftHand}%`,
                color: 'text-green-500 dark:text-green-400',
              },
            ]}
          />
        }
      />
    </div>
  );
}
