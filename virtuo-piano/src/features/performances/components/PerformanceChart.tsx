import { useEffect, useState } from 'react';
import { defaultIntervalOptions } from '../utils/chartUtils';
import LineChartWithNavigation from './LineChartWithNavigation';
import { IconStar } from '@tabler/icons-react';
import ChartSummary from './ChartSummary';
import {
  useSongLearningPerformanceData,
  usePrefetchLearningPerformanceData,
  useInvalidatePracticeCache,
} from '@/customHooks/useSongPerformances';

export default function PerformanceChart({ songId }: { songId: string }) {
  const [performanceInterval, setPerformanceInterval] = useState(15);
  const [performanceIndex, setPerformanceIndex] = useState(0);

  // Hooks React Query
  const {
    data: performanceResult,
    isLoading: performanceLoading,
    error: performanceError,
  } = useSongLearningPerformanceData(
    songId,
    performanceInterval,
    performanceIndex
  );

  const { prefetchAdjacent } = usePrefetchLearningPerformanceData(
    songId,
    performanceInterval,
    performanceIndex
  );

  const { invalidatePerformanceDataOnly } = useInvalidatePracticeCache();

  useEffect(() => {
    prefetchAdjacent();
  }, [prefetchAdjacent]);

  const handleIntervalChange = (newInterval: number) => {
    setPerformanceInterval(newInterval);
    setPerformanceIndex(0); // Reset à l'index 0 pour le nouvel intervalle
    invalidatePerformanceDataOnly(songId);
  };
  const handleIndexChange = (newIndex: number) => {
    setPerformanceIndex(newIndex);
  };

  const performanceData = performanceResult?.data?.data || [];

  const avgPerformanceDeux =
    performanceResult?.data?.averagePerformanceBothHands || 0;
  const avgPerformanceDroite =
    performanceResult?.data?.averagePerformanceRightHand || 0;
  const avgPerformanceGauche =
    performanceResult?.data?.averagePerformanceLeftHand || 0;

  const performanceLines = [
    {
      dataKey: 'performanceBothHands',
      color: '#f59e0b',
      name: 'Deux mains',
      strokeWidth: 3,
    },
    {
      dataKey: 'performanceRightHand',
      color: '#6366f1',
      name: 'Main droite',
      strokeDasharray: '5 5',
    },
    {
      dataKey: 'performanceLeftHand',
      color: '#10b981',
      name: 'Main gauche',
      strokeDasharray: '10 5',
    },
  ];
  return (
    <div className="col-span-12 lg:col-span-7">
      <LineChartWithNavigation
        isLoading={performanceLoading}
        error={performanceError}
        title="Performance par session"
        icon={<IconStar size={20} className="mr-2 text-pink-400" />}
        data={performanceData}
        lines={performanceLines}
        interval={performanceInterval}
        index={performanceIndex}
        onIntervalChange={handleIntervalChange}
        onIndexChange={handleIndexChange}
        maxDataLength={performanceResult?.data?.totalSessions || 0}
        yAxisDomain={[0, 100]}
        themeColor="text-pink-400"
        intervalOptions={defaultIntervalOptions}
        summary={
          <ChartSummary
            title="Performances moyennes"
            items={[
              {
                label: 'Deux mains',
                value: `${avgPerformanceDeux}%`,
                color: 'text-amber-500 dark:text-amber-400',
              },
              {
                label: 'Main droite',
                value: `${avgPerformanceDroite}%`,
                color: 'text-indigo-600 dark:text-indigo-400',
              },
              {
                label: 'Main gauche',
                value: `${avgPerformanceGauche}%`,
                color: 'text-green-500 dark:text-green-400',
              },
            ]}
          />
        }
      />
    </div>
  );
}
