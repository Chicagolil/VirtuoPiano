'use client';

import React, { useEffect, useState } from 'react';
import { IconBook } from '@tabler/icons-react';
import InfoTile from '@/components/tiles/Infotile';
import { getStartedSongsComparison } from '@/lib/actions/generalStats-actions';
import { IntervalType } from '@/common/types';

interface StartedSongsData {
  currentSongs: number;
  previousSongs: number;
  difference: number;
  totalSongs: number;
  trend: 'increase' | 'decrease' | 'stable';
}

export default function StartedSongsTile() {
  const [selectedInterval, setSelectedInterval] =
    useState<IntervalType>('month');
  const [startedSongsData, setStartedSongsData] = useState<StartedSongsData>({
    currentSongs: 0,
    previousSongs: 0,
    difference: 0,
    totalSongs: 0,
    trend: 'stable',
  });
  const [loading, setLoading] = useState(false);

  const getInfoTileDescription = (interval: IntervalType) => {
    return {
      week: 'la semaine dernière',
      month: 'le mois dernier',
      quarter: 'le trimestre dernier',
    }[interval];
  };

  // Effet pour récupérer les données de morceaux démarrés
  useEffect(() => {
    const fetchStartedSongs = async () => {
      try {
        setLoading(true);
        const { success, data, error } = await getStartedSongsComparison(
          selectedInterval
        );
        if (success) {
          setStartedSongsData(data);
        } else {
          console.error('Erreur morceaux démarrés:', error);
        }
      } catch (err) {
        console.error('Erreur lors du chargement des morceaux démarrés:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchStartedSongs();
  }, [selectedInterval]);

  return (
    <InfoTile
      value={startedSongsData.currentSongs.toString()}
      icon={<IconBook size={24} />}
      title={`Morceaux commencés `}
      description={`sur ${startedSongsData.totalSongs} morceaux dans la bibliothèque`}
      loading={loading}
      trend={
        startedSongsData.trend !== 'stable'
          ? {
              value: `${startedSongsData.difference > 0 ? '+' : ''}${
                startedSongsData.difference
              }`,
              isPositive: startedSongsData.trend === 'increase',
            }
          : undefined
      }
      showIntervalSelector={true}
      selectedInterval={selectedInterval}
      onIntervalChange={setSelectedInterval}
    />
  );
}
