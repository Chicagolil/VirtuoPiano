import { getSongType } from '@/common/utils/function';
import styles from './Badge.module.css';

export default function SongTypeBadge({ songType }: { songType: string }) {
  const { label } = getSongType(songType);
  return <span className={`${styles.songTypeBadge} `}>{label}</span>;
}
