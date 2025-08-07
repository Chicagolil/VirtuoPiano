import RecordsTimeline from './RecordsTimeline';
import { useSongTimelineRecordsData } from '@/customHooks/useSongPerformances';

interface GamingTimelineProps {
  songId: string;
}

export default function GamingTimeline({ songId }: GamingTimelineProps) {
  const {
    data: timelineResult,
    isLoading,
    error,
  } = useSongTimelineRecordsData(songId, 'game');

  const records = timelineResult?.data?.records || [];

  return (
    <RecordsTimeline isLoading={isLoading} error={error} records={records} />
  );
}
