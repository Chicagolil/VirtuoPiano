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
import { Spinner } from '@/components/ui/spinner';
import { LineChartDataPoint } from '@/lib/services/performances-services';

interface MultiAxisLine {
  dataKey: string;
  color: string;
  name: string;
  yAxisId: string;
  strokeDasharray?: string;
}

interface IntervalOption {
  value: number;
  label: string;
}

interface MultiAxisLineChartProps {
  title: string;
  icon: React.ReactNode;
  data: any[];
  lines: MultiAxisLine[];
  interval: number;
  index: number;
  onIntervalChange: (interval: number) => void;
  onIndexChange: (index: number) => void;
  maxDataLength: number;
  height?: number;
  themeColor: string;
  intervalOptions: IntervalOption[];
  summary?: React.ReactNode;
  isLoading?: boolean;
  error: Error | null;
  scoreAxisDomain: number[];
  comboAxisDomain: number[];
  multiAxisDomain: number[];
}

export default function MultiAxisLineChart({
  title,
  icon,
  data,
  lines,
  interval,
  index,
  onIntervalChange,
  onIndexChange,
  maxDataLength,
  height = 250,
  themeColor,
  intervalOptions,
  summary,
  isLoading,
  error,
  scoreAxisDomain,
  comboAxisDomain,
  multiAxisDomain,
}: MultiAxisLineChartProps) {
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
              onClick={() => onIndexChange(index + 1)}
              disabled={(index + 1) * interval >= maxDataLength}
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
              onClick={() => onIndexChange(Math.max(0, index - 1))}
              disabled={index === 0}
              className="p-2 rounded-full hover:bg-white/10 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <IconChevronRight size={20} className={themeColor} />
            </button>
          </div>
        </div>
      </div>
      {isLoading ? (
        <div className="flex items-center justify-center h-[250px]">
          <Spinner variant="bars" size={32} className="text-white" />
        </div>
      ) : error ? (
        <div className="flex items-center justify-center h-[250px]">
          <div className="text-center text-red-400 text-sm">
            {error.message || 'Erreur lors du chargement'}
          </div>
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={height}>
          <LineChart
            data={data}
            margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
          >
            <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
            <XAxis dataKey="session" tick={{ fontSize: 12, fill: '#94a3b8' }} />

            {/* Axes Y multiples */}
            <YAxis
              yAxisId="score"
              domain={scoreAxisDomain}
              tick={{ fontSize: 12, fill: '#94a3b8' }}
            />
            <YAxis
              yAxisId="combo"
              orientation="left"
              domain={comboAxisDomain}
              tick={{ fontSize: 12, fill: '#f59e0b' }}
            />
            <YAxis
              yAxisId="multi"
              orientation="left"
              domain={multiAxisDomain}
              tick={{ fontSize: 12, fill: '#10b981' }}
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
                if (line?.dataKey === 'score')
                  return [`${value} points`, 'Score'];
                if (line?.dataKey === 'combo')
                  return [`${value} notes`, 'Combo max'];
                if (line?.dataKey === 'multi')
                  return [`x${value}`, 'Multiplicateur max'];
                return [`${value}`, line?.name || name];
              }}
            />

            {lines.map((line, idx) => (
              <Line
                key={line.dataKey}
                yAxisId={line.yAxisId}
                type="monotone"
                dataKey={line.dataKey}
                stroke={line.color}
                strokeWidth={idx === 0 ? 3 : 2}
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
      )}
      <Separator.Root className="h-px bg-slate-500 dark:bg-slate-800 my-4" />

      <div className="flex items-center justify-between flex-wrap gap-4 mt-4 mb-2">
        <div className="flex items-center space-x-4">
          {lines.map((line) => (
            <div key={line.dataKey} className="flex items-center">
              <div
                className="w-4 h-2 mr-2 rounded"
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
