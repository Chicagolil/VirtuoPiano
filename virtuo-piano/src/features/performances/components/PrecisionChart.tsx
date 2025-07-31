import { IconTarget } from '@tabler/icons-react';
import LineChartWithNavigation from './LineChartWithNavigation';
import {
  calculateAverage,
  defaultIntervalOptions,
  getDefaultIndex,
  sliceDataByInterval,
} from '../utils/chartUtils';
import ChartSummary from './ChartSummary';
import { generateExtendedPrecisionData } from '../data/performanceData';
import { useEffect, useState } from 'react';

export default function PrecisionChart({ songId }: { songId: string }) {
  const extendedPrecisionData = generateExtendedPrecisionData();
  const [precisionInterval, setPrecisionInterval] = useState(7);
  const [precisionIndex, setPrecisionIndex] = useState(0);
  const getPrecisionData = () =>
    sliceDataByInterval(
      extendedPrecisionData,
      precisionIndex,
      precisionInterval
    );
  // Initialiser les indices par défaut
  useEffect(() => {
    setPrecisionIndex(
      getDefaultIndex(extendedPrecisionData.length, precisionInterval)
    );
  }, []);

  const avgPrecisionDeux = calculateAverage(getPrecisionData(), 'deux');
  const avgPrecisionDroite = calculateAverage(getPrecisionData(), 'droite');
  const avgPrecisionGauche = calculateAverage(getPrecisionData(), 'gauche');
  // Configuration des lignes pour les graphiques
  const precisionLines = [
    { dataKey: 'deux', color: '#f59e0b', name: 'Deux mains', strokeWidth: 3 },
    {
      dataKey: 'droite',
      color: '#6366f1',
      name: 'Main droite',
      strokeDasharray: '5 5',
    },
    {
      dataKey: 'gauche',
      color: '#10b981',
      name: 'Main gauche',
      strokeDasharray: '10 5',
    },
  ];

  return (
    <div className="col-span-12 lg:col-span-7">
      <LineChartWithNavigation
        title="Précision par session"
        icon={<IconTarget size={20} className="mr-2 text-green-400" />}
        data={getPrecisionData()}
        lines={precisionLines}
        interval={precisionInterval}
        index={precisionIndex}
        onIntervalChange={setPrecisionInterval}
        onIndexChange={setPrecisionIndex}
        maxDataLength={extendedPrecisionData.length}
        themeColor="text-green-400"
        intervalOptions={defaultIntervalOptions}
        summary={
          <ChartSummary
            title="Précisions moyennes"
            items={[
              {
                label: 'Deux mains',
                value: `${avgPrecisionDeux}%`,
                color: 'text-amber-500 dark:text-amber-400',
              },
              {
                label: 'Main droite',
                value: `${avgPrecisionDroite}%`,
                color: 'text-indigo-600 dark:text-indigo-400',
              },
              {
                label: 'Main gauche',
                value: `${avgPrecisionGauche}%`,
                color: 'text-green-500 dark:text-green-400',
              },
            ]}
          />
        }
      />
    </div>
  );
}
