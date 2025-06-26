import { IconTrendingUp } from '@tabler/icons-react';
import { Spinner } from '../ui/spinner';

type IntervalType = 'week' | 'month' | 'quarter';

interface InfoTileProps {
  title: string;
  value: string;
  description: string;
  icon: React.ReactNode;
  trend?: {
    value: string;
    isPositive: boolean;
  };
  className?: string;
  selectedInterval?: IntervalType;
  onIntervalChange?: (interval: IntervalType) => void;
  showIntervalSelector?: boolean;
  loading?: boolean;
  error?: string | null;
}

export default function InfoTile({
  title,
  value,
  description,
  icon,
  trend,
  className,
  selectedInterval = 'month',
  onIntervalChange,
  showIntervalSelector = false,
  loading = false,
  error,
}: InfoTileProps) {
  const intervals = [
    { key: 'week' as const, label: 'Semaine' },
    { key: 'month' as const, label: 'Mois' },
    { key: 'quarter' as const, label: 'Trimestre' },
  ];

  return (
    <div
      className={`bg-white dark:bg-slate-800 shadow-md rounded-xl p-5 border border-slate-200 dark:border-slate-700 ${className}`}
    >
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
            {title}
          </p>
          {loading ? (
            <div className="flex items-center justify-center h-21">
              <Spinner variant="bars" className="w-8 h-8" />
            </div>
          ) : error ? (
            <div className="mt-2 text-sm text-red-500 dark:text-red-400">
              {error}
            </div>
          ) : (
            <>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white mt-1">
                {value}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                {description}
              </p>

              {trend ? (
                <div className="flex items-center mt-3">
                  <span
                    className={`text-xs font-medium ${
                      trend.isPositive
                        ? 'text-emerald-600 dark:text-emerald-400'
                        : 'text-rose-600 dark:text-rose-400'
                    } flex items-center`}
                  >
                    <span
                      className={`mr-1 ${
                        trend.isPositive ? 'rotate-0' : 'rotate-180'
                      }`}
                    >
                      <IconTrendingUp size={14} />
                    </span>
                    {trend.value}
                  </span>
                  <span className="text-xs text-slate-500 dark:text-slate-400 ml-1.5">
                    depuis{' '}
                    {selectedInterval === 'week'
                      ? 'la semaine'
                      : selectedInterval === 'month'
                      ? 'le mois'
                      : 'le trimestre'}{' '}
                    précédent{selectedInterval === 'week' ? 'e' : ''}
                  </span>
                </div>
              ) : null}
            </>
          )}
        </div>
        <div className="flex flex-col items-end gap-3">
          <div className="bg-indigo-100 dark:bg-indigo-900/30 p-3 rounded-lg text-indigo-600 dark:text-indigo-400">
            {icon}
          </div>

          {showIntervalSelector && onIntervalChange && (
            <div className="flex gap-1">
              {intervals.map((interval) => (
                <button
                  key={interval.key}
                  onClick={() => onIntervalChange(interval.key)}
                  className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                    selectedInterval === interval.key
                      ? 'bg-indigo-100 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300'
                      : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-600'
                  }`}
                >
                  {interval.label}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
