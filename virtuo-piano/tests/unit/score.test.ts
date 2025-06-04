import { describe, it, expect } from 'vitest';

// Fonction de calcul de score (à adapter selon votre implémentation)
const calculateScore = (
  correctNotes: number,
  wrongNotes: number,
  missedNotes: number,
  maxCombo: number,
  maxMultiplier: number
): number => {
  const baseScore = correctNotes * 100;
  const comboBonus = maxCombo * 10;
  const multiplierBonus = maxMultiplier * 50;
  const penalty = (wrongNotes + missedNotes) * 25;
  return baseScore + comboBonus + multiplierBonus - penalty;
};

describe('Calcul des scores', () => {
  it('devrait calculer correctement le score de base', () => {
    const score = calculateScore(10, 2, 1, 5, 2);
    expect(score).toBe(1000 + 50 + 100 - 75); // 1000 (notes correctes) + 50 (combo) + 100 (multiplicateur) - 75 (pénalités)
  });

  it('devrait gérer un score parfait', () => {
    const score = calculateScore(20, 0, 0, 20, 4);
    expect(score).toBe(2000 + 200 + 200 - 0); // Score maximum possible
  });

  it('devrait gérer un score nul', () => {
    const score = calculateScore(0, 0, 0, 0, 0);
    expect(score).toBe(0);
  });

  it('devrait appliquer correctement les pénalités', () => {
    const score = calculateScore(5, 5, 5, 0, 0);
    expect(score).toBe(500 - 250); // 500 (notes correctes) - 250 (pénalités)
  });

  it('devrait maximiser le bonus de combo', () => {
    const score = calculateScore(10, 0, 0, 10, 1);
    expect(score).toBe(1000 + 100 + 50); // 1000 (notes correctes) + 100 (combo max) + 50 (multiplicateur)
  });
});
