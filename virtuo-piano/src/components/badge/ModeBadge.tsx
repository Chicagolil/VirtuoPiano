import { IconBrain, IconDeviceGamepad } from '@tabler/icons-react';

export default function ModeBadge({ mode }: { mode: 'learning' | 'game' }) {
  const isLearning = mode === 'learning';

  return (
    <div
      className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
        isLearning
          ? 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300'
          : 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300'
      }`}
    >
      {isLearning ? (
        <IconBrain size={14} className="mr-1" />
      ) : (
        <IconDeviceGamepad size={14} className="mr-1" />
      )}
      {isLearning ? 'Apprentissage' : 'Performance'}
    </div>
  );
}
