import { useState, useEffect, useCallback } from 'react';
import {
  getHeatmapData,
  getSessionsByDate,
} from '@/lib/actions/heatmap-actions';
import {
  ScoreDurationData,
  SessionDetail,
} from '@/lib/services/performances-services';
import {
  generateYearData,
  generateMonthLabels,
  Week,
} from '@/common/utils/function';
import { HEATMAP_YEARS } from '@/common/constants/heatmaps';

interface UseHeatmapReturn {
  data: Week[];
  loading: boolean;
  selectedYear: number;
  selectedDate: string;
  sessions: SessionDetail[];
  sessionsLoading: boolean;
  isExpanded: boolean;
  isClosing: boolean;
  colorTheme: 'green' | 'orange';
  monthLabels: { month: string; position: number }[];
  totalContributions: number;
  setSelectedYear: (year: number) => void;
  setColorTheme: (theme: 'green' | 'orange') => void;
  handleCellClick: (date: Date, count: number) => Promise<void>;
  closeSessions: () => void;
  sessionsError: string | null;
  heatmapError: string | null;
  loadPerformanceData: (year: number) => Promise<void>;
}

export const useHeatmap = (initialYear: number = 2025): UseHeatmapReturn => {
  const [data, setData] = useState<Week[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedYear, setSelectedYear] = useState(
    HEATMAP_YEARS[HEATMAP_YEARS.length - 1]
  );
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [sessions, setSessions] = useState<SessionDetail[]>([]);
  const [sessionsLoading, setSessionsLoading] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [colorTheme, setColorTheme] = useState<'green' | 'orange'>('green');
  const [monthLabels, setMonthLabels] = useState<
    { month: string; position: number }[]
  >([]);
  const [totalContributions, setTotalContributions] = useState(0);
  const [sessionsError, setSessionsError] = useState<string | null>(null);
  const [heatmapError, setHeatmapError] = useState<string | null>(null);
  // Charger les données de performance
  const loadPerformanceData = useCallback(async (year: number) => {
    setLoading(true);
    try {
      const result = await getHeatmapData(year);

      if (result.success) {
        const yearData = generateYearData(year, result.data);
        const labels = generateMonthLabels(year, yearData);

        setData(yearData);
        setMonthLabels(labels);

        // Calculer le total des contributions
        const total = yearData
          .flat()
          .filter((count): count is number => count !== null)
          .reduce((sum, count) => sum + count, 0);
        setTotalContributions(total);
      } else {
        setHeatmapError(
          result.error || 'Erreur lors du chargement des données'
        );
        setData([]);
        setMonthLabels([]);
        setTotalContributions(0);
      }
    } catch (error) {
      setHeatmapError(
        error instanceof Error
          ? error.message
          : 'Erreur lors du chargement des données'
      );
      setData([]);
      setMonthLabels([]);
      setTotalContributions(0);
    } finally {
      setLoading(false);
    }
  }, []);

  // Charger les sessions pour une date donnée
  const loadSessions = useCallback(async (date: Date) => {
    setSessionsLoading(true);
    try {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      const dateKey = `${year}-${month}-${day}`;

      setSelectedDate(dateKey);

      const result = await getSessionsByDate(dateKey);

      if (result.success) {
        setSessions(result.data);
        setIsExpanded(true);
        setIsClosing(false);
      } else {
        setSessionsError(
          result.error || 'Erreur lors du chargement des sessions'
        );
        setSessions([]);
      }
    } catch (error) {
      setSessionsError(
        error instanceof Error
          ? error.message
          : 'Erreur lors du chargement des sessions'
      );
      setSessions([]);
    } finally {
      setSessionsLoading(false);
    }
  }, []);

  // Gérer le clic sur une cellule
  const handleCellClick = useCallback(
    async (date: Date, count: number) => {
      if (count > 0) {
        await loadSessions(date);
      }
    },
    [loadSessions]
  );

  // Fermer la section des sessions
  const closeSessions = useCallback(() => {
    setIsClosing(true);
    setTimeout(() => {
      setIsExpanded(false);
      setSelectedDate('');
      setSessions([]);
      setIsClosing(false);
    }, 300);
  }, []);

  // Charger les données quand l'année change
  useEffect(() => {
    loadPerformanceData(selectedYear);
  }, [selectedYear, loadPerformanceData]);

  return {
    data,
    loading,
    selectedYear,
    selectedDate,
    sessions,
    sessionsLoading,
    isExpanded,
    isClosing,
    colorTheme,
    monthLabels,
    totalContributions,
    setSelectedYear: (year: number) => {
      if (HEATMAP_YEARS.includes(year as any)) {
        setSelectedYear(year as any);
      }
    },
    setColorTheme,
    handleCellClick,
    closeSessions,
    sessionsError,
    heatmapError,
    loadPerformanceData,
  };
};
