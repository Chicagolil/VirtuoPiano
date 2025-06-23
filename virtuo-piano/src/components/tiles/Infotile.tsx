import { IconTrendingUp } from '@tabler/icons-react';

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
}

export default function InfoTile({
  title,
  value,
  description,
  icon,
  trend,
  className,
}: InfoTileProps) {
  return (
    <div
      className={`bg-white dark:bg-slate-800 shadow-md rounded-xl p-5 border border-slate-200 dark:border-slate-700 ${className}`}
    >
      <div className="flex justify-between items-start">
        <div>
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
            {title}
          </p>
          <h3 className="text-2xl font-bold text-slate-900 dark:text-white mt-1">
            {value}
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            {description}
          </p>

          {trend && (
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
                depuis la semaine dernière
              </span>
            </div>
          )}
        </div>
        <div className="bg-indigo-100 dark:bg-indigo-900/30 p-3 rounded-lg text-indigo-600 dark:text-indigo-400">
          {icon}
        </div>
      </div>
    </div>
  );
}
