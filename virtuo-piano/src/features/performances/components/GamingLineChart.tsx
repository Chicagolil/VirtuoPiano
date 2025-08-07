import { IconTrophy } from '@tabler/icons-react';
import MultiAxisLineChart from './MultiAxisLineChart';
import ChartSummary from './ChartSummary';
import { defaultIntervalOptions } from '../utils/chartUtils';
import {
  useInvalidatePracticeCache,
  usePrefetchGamingLineChartData,
  useSongGamingLineChartData,
} from '@/customHooks/useSongPerformances';
import { useEffect, useState } from 'react';

export default function GamingLineChart({ songId }: { songId: string }) {
  const [scoreInterval, setScoreInterval] = useState(15);
  const [scoreIndex, setScoreIndex] = useState(0);

  const scoreLines = [
    { dataKey: 'score', color: '#6366f1', name: 'Score', yAxisId: 'score' },
    {
      dataKey: 'combo',
      color: '#f59e0b',
      name: 'Combo max',
      yAxisId: 'combo',
      strokeDasharray: '10 5',
    },
    {
      dataKey: 'multi',
      color: '#10b981',
      name: 'Multiplicateur max',
      yAxisId: 'multi',
      strokeDasharray: '5 5',
    },
  ];

  const {
    data: gamingLineChartResult,
    isLoading: gamingLineChartLoading,
    error: gamingLineChartError,
  } = useSongGamingLineChartData(songId, scoreIndex, scoreInterval);

  const { prefetchAdjacent } = usePrefetchGamingLineChartData(
    songId,
    scoreInterval,
    scoreIndex
  );

  const { invalidateGamingLineChartDataOnly } = useInvalidatePracticeCache();

  useEffect(() => {
    prefetchAdjacent();
  }, [songId, scoreInterval, scoreIndex, prefetchAdjacent]);

  // Gestion des changements d'intervalle et d'index
  const handleIntervalChange = (newInterval: number) => {
    setScoreInterval(newInterval);
    setScoreIndex(0); // Reset à l'index 0 pour le nouvel intervalle
    invalidateGamingLineChartDataOnly(songId);
  };

  const handleIndexChange = (newIndex: number) => {
    setScoreIndex(newIndex);
  };
  const gamingLineChartData = gamingLineChartResult?.data?.data || [];
  const totalSessions = gamingLineChartResult?.data?.totalSessions || 0;
  const avgScore = gamingLineChartResult?.data?.averageScore || 0;
  const avgCombo = gamingLineChartResult?.data?.averageCombo || 0;
  const avgMulti = gamingLineChartResult?.data?.averageMulti || 0;

  const scoreAxisDomain = [
    Math.min(...gamingLineChartData.map((point) => point.score)),
    Math.max(...gamingLineChartData.map((point) => point.score)),
  ];

  const comboAxisDomain = [
    Math.min(...gamingLineChartData.map((point) => point.combo)),
    Math.max(...gamingLineChartData.map((point) => point.combo)),
  ];

  const multiAxisDomain = [
    Math.min(...gamingLineChartData.map((point) => point.multi)),
    Math.max(...gamingLineChartData.map((point) => point.multi)),
  ];

  return (
    <div className="col-span-12 lg:col-span-6">
      <MultiAxisLineChart
        scoreAxisDomain={scoreAxisDomain}
        comboAxisDomain={comboAxisDomain}
        multiAxisDomain={multiAxisDomain}
        isLoading={gamingLineChartLoading}
        error={gamingLineChartError}
        title="Score par session"
        icon={<IconTrophy size={20} className="mr-2 text-yellow-400" />}
        data={gamingLineChartData}
        lines={scoreLines}
        interval={scoreInterval}
        index={scoreIndex}
        onIntervalChange={handleIntervalChange}
        onIndexChange={handleIndexChange}
        maxDataLength={totalSessions}
        height={280}
        themeColor="text-yellow-400"
        intervalOptions={defaultIntervalOptions}
        summary={
          <ChartSummary
            title="Moyennes sur la période"
            items={[
              {
                label: 'Score',
                value: avgScore,
                color: 'text-indigo-600 dark:text-indigo-400',
              },
              {
                label: 'Combo',
                value: avgCombo,
                color: 'text-amber-500 dark:text-amber-400',
              },
              {
                label: 'Multiplicateur',
                value: `x${avgMulti}`,
                color: 'text-green-500 dark:text-green-400',
              },
            ]}
          />
        }
      />
    </div>
  );
}
