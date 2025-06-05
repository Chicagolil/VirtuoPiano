import { describe, it, expect } from 'vitest';
import {
  castMsToMin,
  getLearnScores,
  getDifficultyRange,
  getSongType,
  getPageName,
} from '@/common/utils/function';

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
});
