import React from 'react';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
} from 'chart.js';
import { Pie } from 'react-chartjs-2';
import { Spinner } from '@/components/ui/spinner';

// Enregistrer les composants Chart.js nécessaires
ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale);

interface PieChartData {
  name: string;
  value: number;
}

interface PieChartCardProps {
  title: string;
  icon?: React.ReactNode;
  data: PieChartData[];
  colors?: readonly string[];
  height?: number;
  showLabels?: boolean;
  className?: string;
  maxCategories?: number; // Nombre maximum de catégories avant regroupement
  minPercentage?: number; // Pourcentage minimum pour éviter le regroupement
  loading?: boolean; // Nouvelle prop pour l'état de chargement
  error?: string | null;
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
  icon,
  data,
  colors = DEFAULT_COLORS,
  height = 160,
  showLabels = false,
  className = '',
  maxCategories = 5,
  minPercentage = 5,
  loading = false,
  error = null,
}: PieChartCardProps) {
  const processedData = processChartData(data, maxCategories, minPercentage);

  // Préparer les données pour Chart.js
  const chartData = {
    labels: processedData.map((item) => item.name),
    datasets: [
      {
        data: processedData.map((item) => item.value),
        backgroundColor: colors.slice(0, processedData.length),
        borderColor: colors
          .slice(0, processedData.length)
          .map((color) => color + '80'),
        borderWidth: 2,
        hoverOffset: 4,
      },
    ],
  };

  // Options de configuration pour Chart.js
  const options = {
    responsive: true,
    borderWidth: 10,
    borderColor: '#475569',
    hoverBorderWidth: 3,
    hoverOffset: 10,
    hoverBackgroundColor: '#FFFFFF',
    hoverBorderColor: '#475569',

    maintainAspectRatio: false,
    cutout: '60%', // Crée un trou au centre (innerRadius)
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: '#1e293b',
        titleColor: '#e2e8f0',
        bodyColor: '#e2e8f0',
        borderColor: '#475569',
        borderWidth: 1,
        cornerRadius: 8,
        displayColors: false,
        padding: 10,
        bodyFont: {
          size: 12,
          weight: 'bold' as const,
        },
        titleFont: {
          size: 12,
        },
        callbacks: {
          label: function (context: any) {
            const total = context.dataset.data.reduce(
              (a: number, b: number) => a + b,
              0
            );
            const percentage = ((context.parsed / total) * 100).toFixed(0);
            return `${percentage}%`;
          },
        },
      },
    },
    animation: {
      duration: 1500,
      easing: 'easeOutQuart' as const,
      animateRotate: true,
      animateScale: true,
    },
  };

  return (
    <div
      className={`bg-white/3 shadow-md rounded-2xl p-5 border border-slate-200/10 dark:border-slate-700/10 flex flex-col ${className}`}
    >
      <h3 className="text-lg font-semibold text-white mb-2 flex items-center">
        {icon && <span className="mr-2">{icon}</span>}
        {title}
      </h3>

      <div className="flex-grow flex items-center justify-center h-60">
        {loading ? (
          <div className="flex items-center justify-center ">
            <Spinner variant="bars" size={32} className="text-white" />
          </div>
        ) : error ? (
          <div className="mt-2 text-sm text-red-400">
            Erreur lors du chargement des données
          </div>
        ) : data.length === 0 ? (
          <div className="flex items-center justify-center text-center">
            <span className="text-sm text-white/70">
              Aucune donnée disponible
            </span>
          </div>
        ) : (
          <div style={{ height: `${height}px`, width: '100%' }}>
            <Pie data={chartData} options={options} />
          </div>
        )}
      </div>

      <div className="mt-2 grid grid-cols-2 gap-1">
        {error || data.length === 0
          ? ''
          : processedData.map((category, index) => (
              <div key={index} className="flex items-center space-x-1.5">
                <div
                  className="w-2.5 h-2.5 rounded-full"
                  style={{
                    backgroundColor: colors[index % colors.length],
                  }}
                ></div>
                <span className="text-xs text-white/70 truncate">
                  {category.name}
                </span>
              </div>
            ))}
      </div>
    </div>
  );
}
