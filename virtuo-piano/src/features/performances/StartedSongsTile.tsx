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
  const [error, setError] = useState<string | null>(null);

  const getInfoTileDescription = (interval: IntervalType) => {
    return {
      week: 'les 7 derniers jours',
      month: 'les 31 derniers jours',
      quarter: 'les 90 derniers jours',
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
          setError('Erreur lors du chargement des morceaux démarrés');
        }
      } catch (err) {
        setError('Erreur lors du chargement des morceaux démarrés');
      } finally {
        setLoading(false);
      }
    };

    fetchStartedSongs();
  }, [selectedInterval]);

  return (
    <InfoTile
      value={
        startedSongsData.currentSongs === 0
          ? 'Aucun nouveau morceau'
          : startedSongsData.currentSongs.toString()
      }
      icon={<IconBook size={24} />}
      title={`Morceaux commencés `}
      description={
        startedSongsData.currentSongs === 0
          ? `Aucun nouveau morceau commencé ${getInfoTileDescription(
              selectedInterval
            )}`
          : `sur ${startedSongsData.totalSongs} morceaux dans la bibliothèque`
      }
      loading={loading}
      error={error}
      trend={
        startedSongsData.trend !== 'stable'
          ? {
              value: `${startedSongsData.difference > 0 ? '+' : ''}${
                startedSongsData.difference
              }`,
              isPositive: startedSongsData.trend === 'increase',
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
