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
  // Calculer le pourcentage par rapport au max
  const percentage = Math.min((value / max) * 100, 100);
  const maxPercentage = max > 50 ? max / 2 : 50; // Seuil adaptatif

  return (
    <Progress.Root
      className={`${styles.progressRoot} ${className}`}
      value={Math.min(value, max)} // Radix UI rejette les valeurs > max
      max={max}
    >
      <Progress.Indicator
        className={`${styles.progressIndicator} ${colorClass} ${
          value >= max
            ? styles.progressComplete
            : percentage > maxPercentage
            ? styles.progressHigh
            : styles.progressLow
        }`}
        style={{ transform: `translateX(-${100 - percentage}%)` }}
      />
    </Progress.Root>
  );
}

export default ProgressBar;
