import { describe, it, expect } from 'vitest';
import {
  castMsToMin,
  getLearnScores,
  getDifficultyRange,
  getSongType,
  getPageName,
  formatDuration,
  generateYearData,
  generateEmptyGrid,
  generateMonthLabels,
} from '@/common/utils/function';
import { ScoreDurationData } from '@/lib/services/performances-services';

describe('Fonctions utilitaires', () => {
  describe('castMsToMin', () => {
    it('devrait convertir correctement les millisecondes en format minutes:secondes', () => {
      expect(castMsToMin(60000)).toBe('1:00'); // 1 minute
      expect(castMsToMin(90000)).toBe('1:30'); // 1 minute 30 secondes
      expect(castMsToMin(30000)).toBe('0:30'); // 30 secondes
      expect(castMsToMin(125000)).toBe('2:05'); // 2 minutes 5 secondes
    });

    it('devrait gérer correctement les secondes avec un seul chiffre', () => {
      expect(castMsToMin(61000)).toBe('1:01'); // 1 minute 1 seconde
      expect(castMsToMin(5000)).toBe('0:05'); // 5 secondes
    });
  });

  describe('getLearnScores', () => {
    it("devrait calculer correctement les scores d'apprentissage", () => {
      const result = getLearnScores(5, 15, 2);
      expect(result.performance).toBe(68); // (15/22) * 100
      expect(result.accuracy).toBe(75); // (15/20) * 100
    });

    it("devrait retourner 0 pour les scores quand il n'y a pas de notes", () => {
      const result = getLearnScores(0, 0, 0);
      expect(result.performance).toBe(0);
      expect(result.accuracy).toBe(0);
    });

    it('devrait gérer correctement les cas avec uniquement des notes correctes', () => {
      const result = getLearnScores(0, 10, 0);
      expect(result.performance).toBe(100);
      expect(result.accuracy).toBe(100);
    });

    it('devrait gérer correctement les cas avec uniquement des notes incorrectes', () => {
      const result = getLearnScores(10, 0, 0);
      expect(result.performance).toBe(0);
      expect(result.accuracy).toBe(0);
    });
  });

  describe('getDifficultyRange', () => {
    it('devrait retourner la bonne difficulté pour chaque niveau', () => {
      expect(getDifficultyRange(1)).toEqual({
        label: 'Débutant',
        className: 'difficultyBeginner',
        min: 1,
        max: 3,
      });
      expect(getDifficultyRange(5)).toEqual({
        label: 'Intermédiaire',
        className: 'difficultyIntermediate',
        min: 4,
        max: 6,
      });
      expect(getDifficultyRange(8)).toEqual({
        label: 'Avancé',
        className: 'difficultyAdvanced',
        min: 7,
        max: 8,
      });
      expect(getDifficultyRange(10)).toEqual({
        label: 'Expert',
        className: 'difficultyExpert',
        min: 9,
        max: 10,
      });
    });

    it('devrait retourner "Inconnu" pour les niveaux invalides', () => {
      expect(getDifficultyRange(0)).toEqual({
        label: 'Inconnu',
        className: '',
      });
      expect(getDifficultyRange(11)).toEqual({
        label: 'Inconnu',
        className: '',
      });
      expect(getDifficultyRange(-1)).toEqual({
        label: 'Inconnu',
        className: '',
      });
    });
  });

  describe('getSongType', () => {
    it('devrait retourner le bon type pour chaque catégorie', () => {
      expect(getSongType('song')).toEqual({ label: 'Chanson', type: 'song' });
      expect(getSongType('scaleEx')).toEqual({
        label: 'Gammes',
        type: 'scaleEx',
      });
      expect(getSongType('chordEx')).toEqual({
        label: 'Accords',
        type: 'chordEx',
      });
      expect(getSongType('rythmEx')).toEqual({
        label: 'Rythme',
        type: 'rythmEx',
      });
      expect(getSongType('arpeggioEx')).toEqual({
        label: 'Arpèges',
        type: 'arpeggioEx',
      });
    });

    it('devrait retourner "Inconnu" pour les types invalides', () => {
      expect(getSongType('brrbrrPatatim')).toEqual({
        label: 'Inconnu',
        className: '',
      });
      expect(getSongType('')).toEqual({ label: 'Inconnu', className: '' });
    });
  });

  describe('getPageName', () => {
    it('devrait retourner "Accueil" pour la page d\'accueil', () => {
      expect(getPageName('/')).toBe('Accueil');
    });

    it('devrait extraire et formater correctement le nom de la page', () => {
      expect(getPageName('/library')).toBe('Library');
      expect(getPageName('/profile/settings')).toBe('Settings');
      expect(getPageName('/songs/123')).toBe('123');
    });

    it('devrait gérer les chemins vides ou invalides', () => {
      expect(getPageName('')).toBe('Accueil');
      expect(getPageName('///')).toBe('Accueil');
    });
  });

  describe('formatDuration', () => {
    it('should format minutes correctly', () => {
      expect(formatDuration(1)).toBe('1 minute');
      expect(formatDuration(30)).toBe('30 minutes');
      expect(formatDuration(59)).toBe('59 minutes');
    });

    it('should format hours correctly', () => {
      expect(formatDuration(60)).toBe('1 heure');
      expect(formatDuration(120)).toBe('2 heures');
      expect(formatDuration(180)).toBe('3 heures');
    });

    it('should format hours and minutes correctly', () => {
      expect(formatDuration(61)).toBe('1 heure 1 minute');
      expect(formatDuration(90)).toBe('1 heure 30 minutes');
      expect(formatDuration(125)).toBe('2 heures 5 minutes');
      expect(formatDuration(185)).toBe('3 heures 5 minutes');
    });

    it('should handle zero minutes', () => {
      expect(formatDuration(0)).toBe('0 minutes');
    });
  });

  describe('generateYearData', () => {
    it('should generate correct year data with performance data', () => {
      const year = 2024;
      const performanceData: ScoreDurationData[] = [
        {
          date: new Date('2024-01-01'),
          durationInMinutes: 30,
        },
        {
          date: new Date('2024-01-01'),
          durationInMinutes: 15,
        },
        {
          date: new Date('2024-06-15'),
          durationInMinutes: 45,
        },
      ];

      const result = generateYearData(year, performanceData);

      expect(result).toBeDefined();
      expect(result.length).toBeGreaterThan(0);
      expect(result[0]).toHaveLength(7); // Each week has 7 days
    });

    it('should handle empty performance data', () => {
      const year = 2024;
      const performanceData: ScoreDurationData[] = [];

      const result = generateYearData(year, performanceData);

      expect(result).toBeDefined();
      expect(result.length).toBeGreaterThan(0);

      // Check that all values are 0 or null
      const allValues = result.flat();
      const nonNullValues = allValues.filter((val) => val !== null);
      expect(nonNullValues.every((val) => val === 0)).toBe(true);
    });

    it('should aggregate multiple sessions on the same day', () => {
      const year = 2024;
      const performanceData: ScoreDurationData[] = [
        {
          date: new Date('2024-01-01'),
          durationInMinutes: 30,
        },
        {
          date: new Date('2024-01-01'),
          durationInMinutes: 15,
        },
      ];

      const result = generateYearData(year, performanceData);

      // Find the first non-null value (should be January 1st)
      const firstWeek = result[0];
      const firstNonNullIndex = firstWeek.findIndex((val) => val !== null);
      expect(firstWeek[firstNonNullIndex]).toBe(45); // 30 + 15
    });
  });

  describe('generateEmptyGrid', () => {
    it('should generate empty grid for a year', () => {
      const year = 2024;
      const result = generateEmptyGrid(year);

      expect(result).toBeDefined();
      expect(result.length).toBeGreaterThan(0);
      expect(result[0]).toHaveLength(7);

      // Check that all non-null values are 0
      const allValues = result.flat();
      const nonNullValues = allValues.filter((val) => val !== null);
      expect(nonNullValues.every((val) => val === 0)).toBe(true);
    });
  });

  describe('generateMonthLabels', () => {
    it('should generate month labels for a year', () => {
      const year = 2024;
      const weeksData = generateEmptyGrid(year);
      const result = generateMonthLabels(year, weeksData);

      expect(result).toBeDefined();
      expect(result.length).toBeLessThanOrEqual(12);
      expect(result[0]).toHaveProperty('month');
      expect(result[0]).toHaveProperty('position');
      expect(typeof result[0].position).toBe('number');
      expect(typeof result[0].month).toBe('string');
    });

    it('should have valid positions within weeks range', () => {
      const year = 2024;
      const weeksData = generateEmptyGrid(year);
      const result = generateMonthLabels(year, weeksData);

      result.forEach((monthLabel) => {
        expect(monthLabel.position).toBeGreaterThanOrEqual(0);
        expect(monthLabel.position).toBeLessThan(weeksData.length);
      });
    });
  });
});
