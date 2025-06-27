import { describe, it, expect } from 'vitest';
import {
  generateYearData,
  generateEmptyGrid,
  generateMonthLabels,
  formatDuration,
  type Week,
} from '@/common/utils/function';
import { ScoreDurationData } from '@/lib/services/performances-services';

describe('Heatmap Functions - Unit Tests', () => {
  describe('generateYearData', () => {
    it('should generate correct grid structure for a leap year', () => {
      const year = 2024; // Année bissextile
      const mockData: ScoreDurationData[] = [
        { date: new Date('2024-01-15'), durationInMinutes: 30 },
        { date: new Date('2024-06-20'), durationInMinutes: 45 },
      ];

      const result = generateYearData(year, mockData);

      expect(result).toBeInstanceOf(Array);
      expect(result.length).toBeGreaterThan(0);
      expect(result[0]).toHaveLength(7); // Chaque semaine a 7 jours
    });

    it('should handle empty data correctly', () => {
      const year = 2024;
      const mockData: ScoreDurationData[] = [];

      const result = generateYearData(year, mockData);

      expect(result).toBeInstanceOf(Array);
      // Vérifier que toutes les cellules sont à 0 ou null
      result.forEach((week) => {
        week.forEach((cell) => {
          expect(cell === null || cell === 0).toBe(true);
        });
      });
    });

    it('should aggregate multiple sessions on the same day', () => {
      const year = 2024;
      const mockData: ScoreDurationData[] = [
        { date: new Date('2024-01-15'), durationInMinutes: 30 },
        { date: new Date('2024-01-15'), durationInMinutes: 45 },
        { date: new Date('2024-01-16'), durationInMinutes: 20 },
      ];

      const result = generateYearData(year, mockData);

      // Trouver la cellule du 15 janvier (doit contenir 75 minutes)
      const startDate = new Date(2024, 0, 1);
      const startDayOfWeek = startDate.getDay();
      const mondayStartDay = startDayOfWeek === 0 ? 6 : startDayOfWeek - 1;
      const daysSinceStart = 14; // 15 janvier = jour 15 (index 14)
      const cellIndex = mondayStartDay + daysSinceStart;
      const weekIndex = Math.floor(cellIndex / 7);
      const dayIndex = cellIndex % 7;

      expect(result[weekIndex][dayIndex]).toBe(75);
    });

    it('should handle null cells for days outside the year', () => {
      const year = 2024;
      const mockData: ScoreDurationData[] = [];

      const result = generateYearData(year, mockData);

      // Les premières cellules (avant le 1er janvier) doivent être null
      const startDate = new Date(2024, 0, 1);
      const startDayOfWeek = startDate.getDay();
      const mondayStartDay = startDayOfWeek === 0 ? 6 : startDayOfWeek - 1;

      for (let i = 0; i < mondayStartDay; i++) {
        expect(result[0][i]).toBeNull();
      }
    });
  });

  describe('generateEmptyGrid', () => {
    it('should generate grid with correct dimensions', () => {
      const year = 2024;
      const result = generateEmptyGrid(year);

      expect(result).toBeInstanceOf(Array);
      expect(result.length).toBeGreaterThan(0);
      expect(result[0]).toHaveLength(7);
    });

    it('should fill all valid days with 0', () => {
      const year = 2024;
      const result = generateEmptyGrid(year);

      result.forEach((week) => {
        week.forEach((cell) => {
          expect(cell === null || cell === 0).toBe(true);
        });
      });
    });

    function countActiveDays(grid: Week[]): number {
      return grid.flat().filter((cell) => cell === 0).length;
    }

    it('should handle different years correctly', () => {
      const year2023 = 2023;
      const year2024 = 2024; // Bissextile
      const year2025 = 2025;

      const result2023 = generateEmptyGrid(year2023);
      const result2024 = generateEmptyGrid(year2024);
      const result2025 = generateEmptyGrid(year2025);

      const activeDays2023 = countActiveDays(result2023);
      const activeDays2024 = countActiveDays(result2024);
      const activeDays2025 = countActiveDays(result2025);

      expect(activeDays2024).toBe(366); // 29 février inclus
      expect(activeDays2023).toBe(365);
      expect(activeDays2025).toBe(365);
    });
  });

  describe('generateMonthLabels', () => {
    it('should generate correct month labels', () => {
      const year = 2024;
      const mockWeeks: Week[] = Array(53)
        .fill(null)
        .map(() => Array(7).fill(0));

      const result = generateMonthLabels(year, mockWeeks);

      expect(result).toBeInstanceOf(Array);
      expect(result.length).toBe(12); // 12 mois

      // Vérifier que les mois sont dans le bon ordre
      const expectedMonths = [
        'Jan',
        'Fév',
        'Mar',
        'Avr',
        'Mai',
        'Jun',
        'Jul',
        'Aoû',
        'Sep',
        'Oct',
        'Nov',
        'Déc',
      ];
      result.forEach((label, index) => {
        expect(label.month).toBe(expectedMonths[index]);
      });
    });

    it('should handle empty weeks array', () => {
      const year = 2024;
      const mockWeeks: Week[] = [];

      const result = generateMonthLabels(year, mockWeeks);

      expect(result).toBeInstanceOf(Array);
      expect(result.length).toBe(0);
    });

    it('should calculate correct positions for month labels', () => {
      const year = 2024;
      const mockWeeks: Week[] = Array(53)
        .fill(null)
        .map(() => Array(7).fill(0));

      const result = generateMonthLabels(year, mockWeeks);

      result.forEach((label, index) => {
        expect(label.position).toBeGreaterThanOrEqual(0);
        expect(label.position).toBeLessThan(mockWeeks.length);
      });
    });
  });

  describe('formatDuration', () => {
    it('should format minutes correctly', () => {
      expect(formatDuration(30)).toBe('30 minutes');
      expect(formatDuration(1)).toBe('1 minute');
      expect(formatDuration(0)).toBe('0 minutes');
    });

    it('should format hours correctly', () => {
      expect(formatDuration(60)).toBe('1 heure');
      expect(formatDuration(120)).toBe('2 heures');
      expect(formatDuration(90)).toBe('1 heure 30 minutes');
      expect(formatDuration(150)).toBe('2 heures 30 minutes');
    });

    it('should handle edge cases', () => {
      expect(formatDuration(59)).toBe('59 minutes');
      expect(formatDuration(61)).toBe('1 heure 1 minute');
      expect(formatDuration(119)).toBe('1 heure 59 minutes');
    });

    it('should handle plural forms correctly', () => {
      expect(formatDuration(1)).toBe('1 minute');
      expect(formatDuration(2)).toBe('2 minutes');
      expect(formatDuration(1 * 60)).toBe('1 heure');
      expect(formatDuration(2 * 60)).toBe('2 heures');
      expect(formatDuration(1 * 60 + 1)).toBe('1 heure 1 minute');
      expect(formatDuration(1 * 60 + 2)).toBe('1 heure 2 minutes');
    });
  });
});
