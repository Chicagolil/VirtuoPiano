import { Spinner } from '@/components/ui/spinner';
import InfoTile from './InfoTile';
import {
  IconClock,
  IconFlame,
  IconStar,
  IconTarget,
} from '@tabler/icons-react';
import { formatDuration } from '@/common/utils/function';
import { useSongLearningModeTiles } from '@/customHooks/useSongPerformances';

export default function LearningTiles({ songId }: { songId: string }) {
  const {
    data: learningTilesResult,
    isLoading: learningTilesLoading,
    error: learningTilesError,
  } = useSongLearningModeTiles(songId);

  return (
    <div className="col-span-12 lg:col-span-5">
      <div className="grid grid-cols-2 gap-4 h-full">
        {/* Sessions */}
        <InfoTile
          icon={
            learningTilesLoading ? (
              <Spinner variant="bars" size={20} className="text-white" />
            ) : (
              <IconClock size={20} className="text-blue-500" />
            )
          }
          value={
            learningTilesLoading
              ? ''
              : learningTilesError
              ? 'Erreur'
              : learningTilesResult?.data?.totalSessions.toString() || '0'
          }
          label="Sessions"
        />

        {/* Précision moyenne */}
        <InfoTile
          icon={
            learningTilesLoading ? (
              <Spinner variant="bars" size={20} className="text-white" />
            ) : (
              <IconTarget size={20} className="text-green-500" />
            )
          }
          value={
            learningTilesLoading
              ? ''
              : learningTilesError
              ? 'Erreur'
              : `${learningTilesResult?.data?.averageAccuracy || 0}%`
          }
          label="Précision moyenne"
        />

        {/* Performance moyenne */}
        <InfoTile
          icon={
            learningTilesLoading ? (
              <Spinner variant="bars" size={20} className="text-white" />
            ) : (
              <IconStar size={20} className="text-pink-500" />
            )
          }
          value={
            learningTilesLoading
              ? ''
              : learningTilesError
              ? 'Erreur'
              : `${learningTilesResult?.data?.averagePerformance || 0}%`
          }
          label="Performance moyenne"
        />

        {/* Temps total */}
        <InfoTile
          icon={
            learningTilesLoading ? (
              <Spinner variant="bars" size={20} className="text-white" />
            ) : (
              <IconClock size={20} className="text-purple-500" />
            )
          }
          value={
            learningTilesLoading
              ? ''
              : learningTilesError
              ? 'Erreur'
              : formatDuration(
                  learningTilesResult?.data?.totalTimeInMinutes || 0,
                  true
                )
          }
          label="Temps total"
        />

        {/* Plus longue session */}
        <InfoTile
          icon={
            learningTilesLoading ? (
              <Spinner variant="bars" size={20} className="text-white" />
            ) : (
              <IconFlame size={20} className="text-orange-500" />
            )
          }
          value={
            learningTilesLoading
              ? ''
              : learningTilesError
              ? 'Erreur'
              : `${learningTilesResult?.data?.longestSessionInMinutes || 0}min`
          }
          label="Plus longue session"
        />

        {/* Streak */}
        <InfoTile
          icon={
            learningTilesLoading ? (
              <Spinner variant="bars" size={20} className="text-white" />
            ) : (
              <IconFlame size={20} className="text-red-500" />
            )
          }
          value={
            learningTilesLoading
              ? ''
              : learningTilesError
              ? 'Erreur'
              : `${learningTilesResult?.data?.currentStreak || 0} jours`
          }
          label="Streak"
        />
      </div>
    </div>
  );
}
