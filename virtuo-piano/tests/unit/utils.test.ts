import { describe, it, expect } from 'vitest';
import { castMsToMin, getLearnScores } from '@/common/utils/function';

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
});
