// difficultyUtils.ts
import { DifficultyRange } from '../types/songs';

export const difficultyRanges: DifficultyRange[] = [
  {
    min: 1,
    max: 3,
    label: 'Débutant',
    className: 'difficultyBeginner',
  },
  {
    min: 4,
    max: 6,
    label: 'Intermédiaire',
    className: 'difficultyIntermediate',
  },
  {
    min: 7,
    max: 8,
    label: 'Avancé',
    className: 'difficultyAdvanced',
  },
  {
    min: 9,
    max: 10,
    label: 'Expert',
    className: 'difficultyExpert',
  },
];
