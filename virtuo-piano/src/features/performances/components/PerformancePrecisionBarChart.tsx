import { IconChartBar } from '@tabler/icons-react';
import BarChartWithNavigation from './BarChartWithNavigation';
import { useState, useEffect } from 'react';
import {
  useSongPerformancePrecisionBarChartData,
  usePrefetchPerformancePrecisionBarChartData,
} from '@/customHooks/useSongPerformances';
import { learningBarIntervals } from '../data/performanceData';

export default function PerformancePrecisionBarChart({
  songId,
}: {
  songId: string;
}) {
  const [learningBarIndex, setLearningBarIndex] = useState(0);
  // Hook React Query pour récupérer les données réelles
  const {
    data: barChartResult,
    isLoading: barChartLoading,
    error: barChartError,
  } = useSongPerformancePrecisionBarChartData(songId, learningBarIndex);

  const { prefetchAdjacent } = usePrefetchPerformancePrecisionBarChartData(
    songId,
    learningBarIndex
  );

  // Précharger les données adjacentes
  useEffect(() => {
    prefetchAdjacent();
  }, [songId, learningBarIndex, prefetchAdjacent]);

  const learningBars = [
    { dataKey: 'precision', color: '#6366f1', name: 'Précision' },
    { dataKey: 'performance', color: '#f59e0b', name: 'Performance' },
  ];

  // Créer la structure d'intervalles attendue par BarChartWithNavigation
  const intervals = barChartResult?.data
    ? [
        {
          label: barChartResult.data.label,
          data: barChartResult.data.data,
        },
      ]
    : [];

  return (
    <div className="col-span-12 lg:col-span-5">
      <BarChartWithNavigation
        maxIntervals={barChartResult?.data?.totalIntervals || 0}
        isLoading={barChartLoading}
        error={barChartError}
        title="Précision & Performance par mois"
        icon={<IconChartBar size={20} className="mr-2 text-indigo-400" />}
        intervals={intervals}
        bars={learningBars}
        index={learningBarIndex}
        onIndexChange={setLearningBarIndex}
        themeColor="text-indigo-400"
        yAxisDomain={[0, 100]}
      />
    </div>
  );
}
