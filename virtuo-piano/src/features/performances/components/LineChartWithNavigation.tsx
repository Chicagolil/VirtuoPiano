import { useState } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { IconChevronLeft, IconChevronRight } from '@tabler/icons-react';
import * as Separator from '@radix-ui/react-separator';

interface LineConfig {
  dataKey: string;
  color: string;
  strokeWidth?: number;
  strokeDasharray?: string;
  name: string;
}

interface IntervalOption {
  value: number;
  label: string;
}

interface LineChartWithNavigationProps {
  title: string;
  icon: React.ReactNode;
  data: any[];
  lines: LineConfig[];
  interval: number;
  index: number;
  onIntervalChange: (interval: number) => void;
  onIndexChange: (index: number) => void;
  maxDataLength: number;
  yAxisDomain?: [number, number];
  height?: number;
  themeColor: string;
  intervalOptions: IntervalOption[];
  summary?: React.ReactNode;
}

export default function LineChartWithNavigation({
  title,
  icon,
  data,
  lines,
  interval,
  index,
  onIntervalChange,
  onIndexChange,
  maxDataLength,
  yAxisDomain = [60, 100],
  height = 250,
  themeColor,
  intervalOptions,
  summary,
}: LineChartWithNavigationProps) {
  const getDefaultIndex = (dataLength: number, interval: number) => {
    const numCompleteIntervals = Math.floor(dataLength / interval);
    return Math.max(0, numCompleteIntervals - 1);
  };

  const handleIntervalChange = (newInterval: number) => {
    onIntervalChange(newInterval);
    onIndexChange(getDefaultIndex(maxDataLength, newInterval));
  };

  return (
    <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10 h-full">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-white flex items-center">
          {icon}
          {title}
        </h3>
        <div className="flex flex-col items-center mb-2">
          <div className="flex items-center justify-center space-x-4 mb-2">
            <button
              onClick={() => onIndexChange(Math.max(0, index - 1))}
              disabled={index === 0}
              className="p-2 rounded-full hover:bg-white/10 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <IconChevronLeft size={20} className={themeColor} />
            </button>
            <select
              value={interval}
              onChange={(e) => handleIntervalChange(Number(e.target.value))}
              className="bg-white/10 text-white text-sm rounded px-3 py-2 border border-white/20 min-w-[140px]"
            >
              {intervalOptions.map((option) => (
                <option
                  key={option.value}
                  value={option.value}
                  className="bg-slate-800"
                >
                  {option.label}
                </option>
              ))}
            </select>
            <button
              onClick={() => onIndexChange(index + 1)}
              disabled={(index + 1) * interval >= maxDataLength}
              className="p-2 rounded-full hover:bg-white/10 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <IconChevronRight size={20} className={themeColor} />
            </button>
          </div>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={height}>
        <LineChart
          data={data}
          margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
        >
          <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
          <XAxis dataKey="session" tick={{ fontSize: 12, fill: '#94a3b8' }} />
          <YAxis
            domain={yAxisDomain}
            tick={{ fontSize: 12, fill: '#94a3b8' }}
          />
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
              const line = lines.find((l) => l.dataKey === name);
              return [`${value}%`, line?.name || name];
            }}
          />

          {lines.map((line, idx) => (
            <Line
              key={line.dataKey}
              type="monotone"
              dataKey={line.dataKey}
              stroke={line.color}
              strokeWidth={line.strokeWidth || (idx === 0 ? 3 : 2)}
              strokeDasharray={line.strokeDasharray}
              dot={{
                r: idx === 0 ? 4 : 3,
                fill: line.color,
                strokeWidth: 0,
              }}
              activeDot={{
                r: idx === 0 ? 6 : 5,
                fill: line.color.replace('500', '400'),
              }}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>

      <Separator.Root className="h-px bg-slate-500 dark:bg-slate-800 my-4" />

      <div className="flex items-center justify-between flex-wrap gap-4 mt-4 mb-2">
        <div className="flex items-center space-x-4">
          {lines.map((line, idx) => (
            <div key={line.dataKey} className="flex items-center">
              <div
                className={`w-4 h-2 mr-2 rounded ${
                  idx === 0 ? '' : 'border-dashed border-t'
                }`}
                style={{ backgroundColor: line.color }}
              ></div>
              <span className="text-xs text-slate-400 dark:text-slate-200">
                {line.name}
              </span>
            </div>
          ))}
        </div>
      </div>

      {summary && <div className="mt-6">{summary}</div>}
    </div>
  );
}
