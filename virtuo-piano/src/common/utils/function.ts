import { difficultyRanges } from '../constants/Difficulties';
import { DifficultyRange } from '../types/songs';

export function getDifficultyRange(difficulty: number) {
  const range = difficultyRanges.find(
    (r: DifficultyRange) => difficulty >= r.min && difficulty <= r.max
  );

  return range || { label: 'Inconnu', className: '' };
}
