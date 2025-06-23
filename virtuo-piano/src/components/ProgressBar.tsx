'use client';

import * as Progress from '@radix-ui/react-progress';
import styles from './ProgressBar.module.css';

// Composant de barre de progression
function ProgressBar({
  value,
  max,
  className,
  colorClass,
}: {
  value: number;
  max: number;
  className?: string;
  colorClass?: string;
}) {
  return (
    <Progress.Root
      className={`${styles.progressRoot} ${className}`}
      value={value}
    >
      <Progress.Indicator
        className={`${styles.progressIndicator} ${colorClass} ${
          value === max
            ? styles.progressComplete
            : value > 50
            ? styles.progressHigh
            : styles.progressLow
        }`}
        style={{ transform: `translateX(-${100 - value}%)` }}
      />
    </Progress.Root>
  );
}

export default ProgressBar;
