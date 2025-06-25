'use client';

import React, { useEffect, useState } from 'react';
import { IconClock } from '@tabler/icons-react';
import InfoTile from '@/components/tiles/Infotile';
import { getPracticeTimeComparison } from '@/lib/actions/generalStats-actions';

type IntervalType = 'week' | 'month' | 'quarter';

export default function PracticeTimeTile() {
  const [selectedInterval, setSelectedInterval] =
    useState<IntervalType>('month');
  const [practiceTimeData, setPracticeTimeData] = useState({
    currentTime: 0,
    previousTime: 0,
    percentageChange: 0,
    formattedCurrentTime: '0H00',
    formattedPreviousTime: '0H00',
    trend: 'stable' as 'increase' | 'decrease' | 'stable',
  });
  const [loading, setLoading] = useState(false);

  const getInfoTileDescription = (interval: IntervalType) => {
    return {
      week: 'la semaine dernière',
      month: 'le mois dernier',
      quarter: 'le trimestre dernier',
    }[interval];
  };
  // Effet pour récupérer les données de temps de pratique
  useEffect(() => {
    const fetchPracticeTime = async () => {
      try {
        setLoading(true);
        const { success, data, error } = await getPracticeTimeComparison(
          selectedInterval
        );
        if (success) {
          setPracticeTimeData(data);
        } else {
          console.error('Erreur temps de pratique:', error);
        }
      } catch (err) {
        console.error('Erreur lors du chargement du temps de pratique:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchPracticeTime();
  }, [selectedInterval]);
  return (
    <InfoTile
      value={practiceTimeData.formattedCurrentTime}
      icon={<IconClock size={24} />}
      title={`Temps total de pratique `}
      description={`Temps cumulé pour ${getInfoTileDescription(
        selectedInterval
      )}`}
      loading={loading}
      trend={
        practiceTimeData.trend !== 'stable'
          ? {
              value: `${practiceTimeData.percentageChange > 0 ? '+' : ''}${
                practiceTimeData.percentageChange
              }%`,
              isPositive: practiceTimeData.trend === 'increase',
            }
          : undefined
      }
      showIntervalSelector={true}
      selectedInterval={selectedInterval}
      onIntervalChange={setSelectedInterval}
    />
  );
}
