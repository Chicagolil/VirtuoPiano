import { IconTarget } from '@tabler/icons-react';

export default function AccuracyBadge({ accuracy }: { accuracy: number }) {
  let colorClass = '';

  if (accuracy >= 95) {
    colorClass =
      'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300';
  } else if (accuracy >= 85) {
    colorClass =
      'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300';
  } else if (accuracy >= 75) {
    colorClass =
      'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300';
  } else if (accuracy >= 60) {
    colorClass =
      'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300';
  } else {
    colorClass = 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300';
  }

  return (
    <div
      className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${colorClass}`}
    >
      <IconTarget size={14} className="mr-1" />
      {accuracy}% précision
    </div>
  );
}
