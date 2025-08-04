import { IconChartBar } from '@tabler/icons-react';
import BarChartWithNavigation from './BarChartWithNavigation';
import { learningBarIntervals } from '../data/performanceData';
import { useState } from 'react';

export default function PerformancePrecisionBarChart({
  songId,
}: {
  songId: string;
}) {
  const [learningBarIndex, setLearningBarIndex] = useState(0);

  const learningBars = [
    { dataKey: 'precision', color: '#6366f1', name: 'Précision' },
    { dataKey: 'performance', color: '#f59e0b', name: 'Performance' },
  ];
  return (
    <div className="col-span-12 lg:col-span-5">
      <BarChartWithNavigation
        title="Précision & Performance par mois"
        icon={<IconChartBar size={20} className="mr-2 text-indigo-400" />}
        intervals={learningBarIntervals}
        bars={learningBars}
        index={learningBarIndex}
        onIndexChange={setLearningBarIndex}
        themeColor="text-indigo-400"
        yAxisDomain={[70, 100]}
      />
    </div>
  );
}
