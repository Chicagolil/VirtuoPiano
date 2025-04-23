'use client';

import * as Progress from '@radix-ui/react-progress';
import styles from './ProgressBar.module.css';

// Composant de barre de progression
function ProgressBar({ value }: { value: number }) {
  return (
    <Progress.Root className={styles.progressRoot} value={value}>
      <Progress.Indicator
        className={`${styles.progressIndicator} ${
          value === 100
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
