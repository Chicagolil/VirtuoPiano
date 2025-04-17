import { Songs } from '@prisma/client';
import { difficultyRanges } from '../constants/Difficulties';
import { DifficultyRange } from '../types/songs';
import { songTypeRange } from '../constants/SongTypes';
import { SongTypeRange } from '../types/songs';
export function getDifficultyRange(difficulty: number) {
  const range = difficultyRanges.find(
    (r: DifficultyRange) => difficulty >= r.min && difficulty <= r.max
  );

  return range || { label: 'Inconnu', className: '' };
}

export function getSongType(songType: string) {
  const range = songTypeRange.find((r: SongTypeRange) => songType === r.type);
  return range || { label: 'Inconnu', className: '' };
}

export function castMsToMin(duration: number) {
  const minutes = Math.floor(duration / 60000);
  const seconds = Math.floor((duration % 60000) / 1000);
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
}
