import React from 'react';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from 'recharts';

interface PieChartData {
  name: string;
  value: number;
}

interface PieChartCardProps {
  title: string;
  data: PieChartData[];
  colors?: string[];
  height?: number;
  showLabels?: boolean;
  className?: string;
  maxCategories?: number; // Nombre maximum de catégories avant regroupement
  minPercentage?: number; // Pourcentage minimum pour éviter le regroupement
}

const DEFAULT_COLORS = [
  '#8884d8',
  '#82ca9d',
  '#ffc658',
  '#ff8042',
  '#ff4040',
  '#00C49F',
  '#FFBB28',
  '#FF8042',
];

// Fonction pour regrouper les données mineures dans "Autre"
function processChartData(
  data: PieChartData[],
  maxCategories: number = 5,
  minPercentage: number = 5
): PieChartData[] {
  if (data.length <= maxCategories) {
    return data;
  }

  // Calculer le total pour déterminer les pourcentages
  const total = data.reduce((sum, item) => sum + item.value, 0);

  // Séparer les données principales et mineures
  const mainCategories: PieChartData[] = [];
  const minorCategories: PieChartData[] = [];

  data.forEach((item) => {
    const percentage = (item.value / total) * 100;
    if (
      percentage >= minPercentage ||
      mainCategories.length < maxCategories - 1
    ) {
      mainCategories.push(item);
    } else {
      minorCategories.push(item);
    }
  });

  // Si on a des catégories mineures, les regrouper dans "Autre"
  if (minorCategories.length > 0) {
    const otherValue = minorCategories.reduce(
      (sum, item) => sum + item.value,
      0
    );
    mainCategories.push({
      name: 'Autre',
      value: otherValue,
    });
  }

  return mainCategories;
}

export function PieChartCard({
  title,
  data,
  colors = DEFAULT_COLORS,
  height = 160,
  showLabels = false,
  className = '',
  maxCategories = 5,
  minPercentage = 5,
}: PieChartCardProps) {
  const processedData = processChartData(data, maxCategories, minPercentage);

  return (
    <div
      className={`bg-white dark:bg-slate-800 shadow-md rounded-2xl p-5 border border-slate-200 dark:border-slate-700 flex flex-col ${className}`}
    >
      <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
        {title}
      </h3>

      <div className="flex-grow flex items-center justify-center">
        <ResponsiveContainer width="100%" height={height}>
          <PieChart>
            <Pie
              data={processedData}
              cx="50%"
              cy="50%"
              innerRadius={30}
              outerRadius={45}
              labelLine={false}
              label={
                showLabels
                  ? ({ name, percent }) =>
                      `${name}: ${(percent * 100).toFixed(0)}%`
                  : undefined
              }
              paddingAngle={2}
              dataKey="value"
              blendStroke={true}
            >
              {processedData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={colors[index % colors.length]}
                />
              ))}
            </Pie>
            <Tooltip
              formatter={(value, name) => [`${value}`, name]}
              contentStyle={{
                backgroundColor: '#1e293b',
                border: 'none',
                borderRadius: '8px',
                fontSize: '12px',
              }}
              itemStyle={{ color: '#e2e8f0' }}
              labelStyle={{ color: '#e2e8f0', fontWeight: 'bold' }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-2 grid grid-cols-2 gap-1">
        {processedData.map((category, index) => (
          <div key={index} className="flex items-center space-x-1.5">
            <div
              className="w-2.5 h-2.5 rounded-full"
              style={{
                backgroundColor: colors[index % colors.length],
              }}
            ></div>
            <span className="text-xs text-slate-500 dark:text-slate-400 truncate">
              {category.name}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
