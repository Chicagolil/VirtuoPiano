import { ReactNode } from 'react';

interface InfoTileProps {
  icon: ReactNode;
  value: string | number;
  label: string;
  className?: string;
}

export default function InfoTile({
  icon,
  value,
  label,
  className = '',
}: InfoTileProps) {
  return (
    <div
      className={`bg-white/5 backdrop-blur-sm rounded-xl p-4 flex flex-col items-center justify-center border border-white/10 min-h-[120px] ${className}`}
    >
      <div className="mb-2">{icon}</div>
      <div className="text-xl font-bold text-white">{value}</div>
      <div className="text-xs text-slate-300 dark:text-slate-100 mt-1 text-center">
        {label}
      </div>
    </div>
  );
}
