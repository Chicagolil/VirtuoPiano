'use client';

import React, { useEffect, useState } from 'react';
import { IconClock } from '@tabler/icons-react';
import InfoTile from '@/components/tiles/Infotile';
import { getPracticeTimeComparison } from '@/lib/actions/generalStats-actions';
import { IntervalType } from '@/common/types';

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
  const [error, setError] = useState<string | undefined>(undefined);

  const getInfoTileDescription = (interval: IntervalType) => {
    return {
      week: 'les 7 derniers jours',
      month: 'les 31 derniers jours',
      quarter: 'les 90 derniers jours',
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
          setError('Erreur lors du chargement du temps de pratique');
        }
      } catch (err) {
        setError('Erreur lors du chargement du temps de pratique');
      } finally {
        setLoading(false);
      }
    };

    fetchPracticeTime();
  }, [selectedInterval]);
  console.log(practiceTimeData);
  return (
    <InfoTile
      value={
        practiceTimeData.currentTime === 0
          ? 'Aucune pratique'
          : practiceTimeData.formattedCurrentTime
      }
      icon={<IconClock size={24} />}
      title={`Temps total de pratique `}
      description={
        practiceTimeData.currentTime === 0
          ? `Aucune session de pratique enregistrée ${getInfoTileDescription(
              selectedInterval
            )}`
          : `Temps cumulé pour ${getInfoTileDescription(selectedInterval)}`
      }
      loading={loading}
      error={error}
      trend={
        practiceTimeData.trend !== 'stable'
          ? {
              value: `${practiceTimeData.percentageChange > 0 ? '+' : ''}${
                practiceTimeData.percentageChange
              }%`,
              isPositive: practiceTimeData.trend === 'increase',
            }
          : {
              value: 'Aucun changement',
              isPositive: true,
            }
      }
      showIntervalSelector={true}
      selectedInterval={selectedInterval}
      onIntervalChange={setSelectedInterval}
    />
  );
}
