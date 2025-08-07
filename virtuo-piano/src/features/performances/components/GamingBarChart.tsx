import { IconChartBar } from '@tabler/icons-react';
import BarChartWithNavigation from '../../../components/charts/BarChartWithNavigation';
import { useEffect, useState } from 'react';
import {
  usePrefetchGamingBarChartData,
  useSongGamingBarChartData,
} from '@/customHooks/useSongPerformances';

export default function GamingBarChart({ songId }: { songId: string }) {
  const [gameBarIndex, setGameBarIndex] = useState(0);
  const {
    data: gamingBarResult,
    isLoading: gamingBarLoading,
    error: gamingBarError,
  } = useSongGamingBarChartData(songId, gameBarIndex);

  const { prefetchAdjacent } = usePrefetchGamingBarChartData(
    songId,
    gameBarIndex
  );

  useEffect(() => {
    prefetchAdjacent();
  }, [songId, gameBarIndex, prefetchAdjacent]);

  const gameBars = [
    {
      dataKey: 'score',
      color: '#6366f1',
      name: 'Meilleur score',
      yAxisId: 'score',
    },
    { dataKey: 'combo', color: '#f59e0b', name: 'Combo max', yAxisId: 'combo' },
    {
      dataKey: 'multi',
      color: '#10b981',
      name: 'Multiplicateur max',
      yAxisId: 'multi',
    },
  ];

  const intervals = gamingBarResult?.data
    ? [
        {
          label: gamingBarResult.data.label,
          data: gamingBarResult.data.data,
        },
      ]
    : [];
  return (
    <div className="col-span-12 lg:col-span-6">
      <BarChartWithNavigation
        maxIntervals={gamingBarResult?.data?.totalIntervals || 0}
        isLoading={gamingBarLoading}
        error={gamingBarError}
        title="Score, combo & multiplicateur par mois"
        icon={<IconChartBar size={20} className="mr-2 text-orange-400" />}
        intervals={intervals}
        bars={gameBars}
        index={gameBarIndex}
        onIndexChange={setGameBarIndex}
        height={320}
        themeColor="text-orange-400"
        multiAxis={true}
        yAxisDomain={[0, 100]}
      />
    </div>
  );
}
