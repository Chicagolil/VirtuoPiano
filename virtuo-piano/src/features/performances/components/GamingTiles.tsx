import { Spinner } from '@/components/ui/spinner';
import { useSongPlayModeTiles } from '@/customHooks/useSongPerformances';
import InfoTile from './InfoTile';
import {
  IconChartBar,
  IconClock,
  IconFlame,
  IconTrophy,
} from '@tabler/icons-react';
import { formatDuration } from '@/common/utils/function';

export default function GamingTiles({ songId }: { songId: string }) {
  const {
    data: gamingTilesResult,
    isLoading: gamingTilesLoading,
    error: gamingTilesError,
  } = useSongPlayModeTiles(songId);
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
      <InfoTile
        icon={
          gamingTilesLoading ? (
            <Spinner variant="bars" size={20} className="text-white" />
          ) : (
            <IconClock size={20} className="text-blue-500" />
          )
        }
        value={
          gamingTilesLoading
            ? ''
            : gamingTilesError
            ? 'Erreur'
            : `${gamingTilesResult?.data?.totalSessions || '0'}`
        }
        label="Sessions"
      />
      <InfoTile
        icon={
          gamingTilesLoading ? (
            <Spinner variant="bars" size={20} className="text-white" />
          ) : (
            <IconChartBar size={20} className="text-green-500" />
          )
        }
        value={
          gamingTilesLoading
            ? ''
            : gamingTilesError
            ? 'Erreur'
            : `${gamingTilesResult?.data?.averageScore || 0}`
        }
        label="Score Moyen"
      />
      <InfoTile
        icon={
          gamingTilesLoading ? (
            <Spinner variant="bars" size={20} className="text-white" />
          ) : (
            <IconTrophy size={20} className="text-yellow-500" />
          )
        }
        value={
          gamingTilesLoading
            ? ''
            : gamingTilesError
            ? 'Erreur'
            : `${gamingTilesResult?.data?.bestScore || 0}`
        }
        label="Meilleur Score"
      />
      <InfoTile
        icon={
          gamingTilesLoading ? (
            <Spinner variant="bars" size={20} className="text-white" />
          ) : (
            <IconClock size={20} className="text-purple-500" />
          )
        }
        value={
          gamingTilesLoading
            ? ''
            : gamingTilesError
            ? 'Erreur'
            : formatDuration(
                gamingTilesResult?.data?.totalTimeInMinutes || 0,
                true
              )
        }
        label="Temps total"
      />
      <InfoTile
        icon={
          gamingTilesLoading ? (
            <Spinner variant="bars" size={20} className="text-white" />
          ) : (
            <IconFlame size={20} className="text-orange-500" />
          )
        }
        value={
          gamingTilesLoading
            ? ''
            : gamingTilesError
            ? 'Erreur'
            : formatDuration(
                gamingTilesResult?.data?.longestSessionInMinutes || 0,
                true
              )
        }
        label="Plus longue session"
      />
      <InfoTile
        icon={
          gamingTilesLoading ? (
            <Spinner variant="bars" size={20} className="text-white" />
          ) : (
            <IconFlame size={20} className="text-red-500" />
          )
        }
        value={
          gamingTilesLoading
            ? ''
            : gamingTilesError
            ? 'Erreur'
            : `${gamingTilesResult?.data?.currentStreak || 0} jours`
        }
        label="Streak"
      />
    </div>
  );
}
