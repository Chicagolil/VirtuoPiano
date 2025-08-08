import { getDifficultyRange } from '../common/utils/function';
import styles from './Badge.module.css';

export default function DifficultyBadge({
  difficulty,
}: {
  difficulty: number;
}) {
  const { label, className } = getDifficultyRange(difficulty);

  return (
    <span
      className={`${styles.difficultyBadge} ${styles[className]}`}
      data-testid="difficulty-badge"
    >
      {label}
    </span>
  );
}
