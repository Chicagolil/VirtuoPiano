import { useState } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { IconChevronLeft, IconChevronRight } from '@tabler/icons-react';
import * as Separator from '@radix-ui/react-separator';
import { Spinner } from '@/components/ui/spinner';

interface BarConfig {
  dataKey: string;
  color: string;
  name: string;
  yAxisId?: string;
}

interface BarInterval {
  label: string;
  data: any[];
}

interface BarChartWithNavigationProps {
  title: string;
  icon: React.ReactNode;
  intervals: BarInterval[];
  bars: BarConfig[];
  index: number;
  onIndexChange: (index: number) => void;
  height?: number;
  themeColor: string;
  yAxisDomain?: [number, number];
  multiAxis?: boolean;
  isLoading?: boolean;
  error?: any;
}

export default function BarChartWithNavigation({
  title,
  icon,
  intervals,
  bars,
  index,
  onIndexChange,
  height = 280,
  themeColor,
  yAxisDomain,
  multiAxis = false,
  isLoading = false,
  error = null,
}: BarChartWithNavigationProps) {
  const currentData = intervals[index]?.data || [];

  return (
    <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10 h-full">
      <h3 className="text-lg font-semibold text-white flex items-center mb-4">
        {icon}
        {title}
      </h3>

      <div className="flex flex-col items-center mb-2">
        <div className="flex items-center justify-center space-x-4 mb-2">
          <button
            className="p-2 rounded-full hover:bg-white/10 transition-colors"
            onClick={() => onIndexChange(Math.max(0, index - 1))}
            disabled={index === 0}
            aria-label="Période précédente"
          >
            <IconChevronLeft size={20} className={themeColor} />
          </button>
          <span className="text-sm font-medium text-white/90">
            {intervals[index]?.label}
          </span>
          <button
            className="p-2 rounded-full hover:bg-white/10 transition-colors"
            onClick={() =>
              onIndexChange(Math.min(intervals.length - 1, index + 1))
            }
            disabled={index >= intervals.length - 1}
            aria-label="Période suivante"
          >
            <IconChevronRight size={20} className={themeColor} />
          </button>
        </div>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center" style={{ height }}>
          <Spinner variant="bars" size={32} className="text-white" />
        </div>
      ) : error ? (
        <div className="flex items-center justify-center" style={{ height }}>
          <div className="text-center text-red-400 text-sm">
            {error.message || 'Erreur lors du chargement'}
          </div>
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={height}>
          <BarChart
            data={currentData}
            margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
          >
            <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
            <XAxis dataKey="mois" tick={{ fontSize: 12, fill: '#94a3b8' }} />

            {multiAxis ? (
              // Mode multi-axes : créer un YAxis pour chaque yAxisId unique
              <>
                {Array.from(
                  new Set(bars.map((bar) => bar.yAxisId).filter(Boolean))
                ).map((yAxisId) => (
                  <YAxis
                    key={yAxisId}
                    yAxisId={yAxisId}
                    orientation="left"
                    domain={
                      yAxisId === 'score'
                        ? [8000, 10000]
                        : yAxisId === 'combo'
                        ? [300, 600]
                        : [3, 5]
                    }
                    tick={{
                      fontSize: 12,
                      fill:
                        bars.find((b) => b.yAxisId === yAxisId)?.color ||
                        '#94a3b8',
                    }}
                  />
                ))}
              </>
            ) : (
              // Mode simple : un seul YAxis sans yAxisId
              <YAxis
                domain={yAxisDomain}
                tick={{ fontSize: 12, fill: '#94a3b8' }}
              />
            )}

            <Tooltip
              contentStyle={{
                backgroundColor: '#1e293b',
                border: 'none',
                borderRadius: '8px',
                fontSize: '12px',
              }}
              itemStyle={{ color: '#e2e8f0' }}
              labelStyle={{
                color: '#e2e8f0',
                fontWeight: 'bold',
                marginBottom: '4px',
              }}
              formatter={(value, name) => {
                const bar = bars.find((b) => b.dataKey === name);
                if (bar?.dataKey === 'precision')
                  return [`${value}%`, 'Précision'];
                if (bar?.dataKey === 'performance')
                  return [`${value}%`, 'Performance'];
                if (bar?.dataKey === 'score')
                  return [`${value} points`, 'Meilleur score'];
                if (bar?.dataKey === 'combo')
                  return [`${value} notes`, 'Combo max'];
                if (bar?.dataKey === 'multi')
                  return [`x${value}`, 'Multiplicateur max'];
                return [`${value}`, bar?.name || name];
              }}
            />

            {multiAxis
              ? // Mode multi-axes : utiliser les yAxisId des barres
                bars.map((bar) => (
                  <Bar
                    key={bar.dataKey}
                    yAxisId={bar.yAxisId}
                    dataKey={bar.dataKey}
                    fill={bar.color}
                    radius={[4, 4, 0, 0]}
                  />
                ))
              : // Mode simple : aucun yAxisId
                bars.map((bar) => (
                  <Bar
                    key={bar.dataKey}
                    dataKey={bar.dataKey}
                    fill={bar.color}
                    radius={[4, 4, 0, 0]}
                  />
                ))}
          </BarChart>
        </ResponsiveContainer>
      )}

      <Separator.Root className="h-px bg-slate-500 dark:bg-slate-800 my-4" />

      <div className="flex items-center justify-between flex-wrap gap-4 mt-2 mb-2">
        <div className="flex items-center space-x-4">
          {bars.map((bar) => (
            <div key={bar.dataKey} className="flex items-center">
              <div
                className="w-3 h-3 rounded-full mr-2"
                style={{ backgroundColor: bar.color }}
              ></div>
              <span className="text-xs text-slate-400 dark:text-slate-200">
                {bar.name}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
