import RecordsTimeline from '../../../components/timeline/RecordsTimeline';
import { useSongTimelineRecordsData } from '@/customHooks/useSongPerformances';

interface LearningTimelineProps {
  songId: string;
}

export default function LearningTimeline({ songId }: LearningTimelineProps) {
  const {
    data: timelineResult,
    isLoading,
    error,
  } = useSongTimelineRecordsData(songId, 'learning');
  const records = timelineResult?.data?.records || [];

  return (
    <RecordsTimeline isLoading={isLoading} error={error} records={records} />
  );
}
