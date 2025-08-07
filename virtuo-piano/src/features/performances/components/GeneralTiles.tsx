import { Spinner } from '@/components/ui/spinner';
import InfoTile from './InfoTile';
import {
  IconChartBar,
  IconClock,
  IconFlame,
  IconMedal,
} from '@tabler/icons-react';
import { useSongPerformanceGeneralTiles } from '@/customHooks/useSongPerformances';
import { formatDuration } from '@/common/utils/function';

export default function GeneralTiles({ songId }: { songId: string }) {
  const {
    data: generalTilesResult,
    isLoading: generalTilesLoading,
    error: generalTilesError,
  } = useSongPerformanceGeneralTiles(songId);

  return (
    <>
      <InfoTile
        icon={
          generalTilesLoading ? (
            <Spinner variant="bars" size={20} className="text-white" />
          ) : (
            <IconChartBar
              size={20}
              className="text-blue-600 dark:text-blue-400"
            />
          )
        }
        value={
          generalTilesLoading
            ? ''
            : generalTilesError
            ? 'Erreur'
            : generalTilesResult?.data?.totalSessions.toString() || '0'
        }
        label="Sessions jouées"
      />
      <InfoTile
        icon={
          generalTilesLoading ? (
            <Spinner variant="bars" size={20} className="text-white" />
          ) : (
            <IconClock
              size={20}
              className="text-purple-600 dark:text-purple-400"
            />
          )
        }
        value={
          generalTilesLoading
            ? ''
            : generalTilesError
            ? 'Erreur'
            : generalTilesResult?.data
            ? formatDuration(generalTilesResult.data.totalTimeInMinutes, true)
            : '0 min'
        }
        label="Temps total"
      />
      <InfoTile
        icon={
          generalTilesLoading ? (
            <Spinner variant="bars" size={20} className="text-white" />
          ) : (
            <IconFlame
              size={20}
              className="text-orange-600 dark:text-orange-400"
            />
          )
        }
        value={
          generalTilesLoading
            ? ''
            : generalTilesError
            ? 'Erreur'
            : generalTilesResult?.data?.currentStreak.toString() || '0'
        }
        label="Jours consécutifs"
      />
      <InfoTile
        icon={
          generalTilesLoading ? (
            <Spinner variant="bars" size={20} className="text-white" />
          ) : (
            <IconMedal size={20} className="text-pink-600 dark:text-pink-400" />
          )
        }
        value={
          generalTilesLoading
            ? ''
            : generalTilesError
            ? 'Erreur'
            : generalTilesResult?.data?.globalRanking
            ? `#${generalTilesResult.data.globalRanking}`
            : 'N/A'
        }
        label="Classement global"
      />
    </>
  );
}
