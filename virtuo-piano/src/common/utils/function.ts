import { difficultyRanges } from '../constants/Difficulties';
import { DifficultyRange } from '../types/songs';
import { songTypeRange } from '../constants/SongTypes';
import { SongTypeRange } from '../types/songs';
import { NextRouter } from 'next/router';

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

// Fonction pour extraire le nom de la page à partir du chemin
export const getPageName = (pathname: string) => {
  if (pathname === '/') return 'Accueil';

  // Extraire le dernier segment du chemin (nom de la page)
  const segments = pathname.split('/').filter(Boolean);
  if (segments.length === 0) return 'Accueil';

  // Formatage du nom de la page (première lettre en majuscule, reste en minuscule)
  const pageName = segments[segments.length - 1];
  return pageName.charAt(0).toUpperCase() + pageName.slice(1);
};

export const getLearnScores = (
  wrongNotes: number,
  correctNotes: number,
  missedNotes: number
) => {
  const totalNotes = wrongNotes + correctNotes + missedNotes;
  const performance = Math.floor((correctNotes / totalNotes) * 100) || 0;
  const accuracy =
    Math.floor((correctNotes / (correctNotes + wrongNotes)) * 100) || 0;
  return { performance, accuracy };
};
