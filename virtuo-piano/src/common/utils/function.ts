import { DIFFICULTY_RANGES } from '../constants/Difficulties';
import { Midi } from '@tonejs/midi';
import { DifficultyRange } from '../types/songs';
import { SONG_TYPE_RANGE } from '../constants/SongTypes';
import { SongTypeRange } from '../types/songs';
import { ScoreDurationData } from '@/lib/types';
import { MONTH_NAMES } from '../constants/heatmaps';

export function getDifficultyRange(difficulty: number) {
  const range = DIFFICULTY_RANGES.find(
    (r: DifficultyRange) => difficulty >= r.min && difficulty <= r.max
  );

  return range || { label: 'Inconnu', className: '' };
}

export function getSongType(songType: string) {
  const range = SONG_TYPE_RANGE.find((r: SongTypeRange) => songType === r.type);
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

  // Traductions FR pour les pages principales
  const translations: Record<string, string> = {
    imports: 'Imports',
    favorites: 'Favoris',
    leaderboard: 'Classement',
    performances: 'Performances',
    library: 'Librairie',
    settings: 'Paramètres',
    profile: 'Profil',
  };

  if (translations[pageName]) return translations[pageName];
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

// Fonction pour formater la durée (utilisée dans le titre et les cartes)
export const formatDuration = (minutes: number, court: boolean = false) => {
  if (court) {
    if (minutes < 60) return `${minutes}min`;
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    if (remainingMinutes === 0) return `${hours}h`;
    return `${hours}h${remainingMinutes}`;
  } else {
    if (minutes < 60) {
      return `${minutes} minute${minutes !== 1 ? 's' : ''}`;
    }
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    if (remainingMinutes === 0) {
      return `${hours} heure${hours !== 1 ? 's' : ''}`;
    }
    return `${hours} heure${hours !== 1 ? 's' : ''} ${remainingMinutes} minute${
      remainingMinutes !== 1 ? 's' : ''
    }`;
  }
};

// Type pour une semaine de contributions (7 jours)
export type Week = (number | null)[];

// Fonction pour générer les données d'une année complète avec les vraies données
export function generateYearData(
  year: number,
  performanceData: ScoreDurationData[]
): Week[] {
  const startDate = new Date(year, 0, 1); // 1er janvier
  const endDate = new Date(year, 11, 31); // 31 décembre

  // Calculer le jour de la semaine du 1er janvier (0 = dimanche, 1 = lundi, etc.)
  const startDayOfWeek = startDate.getDay();
  // Convertir pour que lundi = 0, dimanche = 6
  const mondayStartDay = startDayOfWeek === 0 ? 6 : startDayOfWeek - 1;

  // Calculer le nombre total de jours dans l'année
  const totalDays =
    Math.floor(
      (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)
    ) + 1;

  // Calculer le nombre de semaines nécessaires
  const totalCells = mondayStartDay + totalDays;
  const weeksNeeded = Math.ceil(totalCells / 7);

  // Créer un Map pour accéder rapidement aux données par date
  const dataMap = new Map<string, number>();
  performanceData.forEach((item) => {
    // Utiliser une méthode qui respecte le fuseau horaire local
    const year = item.date.getFullYear();
    const month = String(item.date.getMonth() + 1).padStart(2, '0');
    const day = String(item.date.getDate()).padStart(2, '0');
    const dateKey = `${year}-${month}-${day}`; // Format YYYY-MM-DD
    const previousDuration = dataMap.get(dateKey) || 0;
    dataMap.set(dateKey, previousDuration + item.durationInMinutes);
  });

  const weeks: Week[] = [];

  for (let weekIndex = 0; weekIndex < weeksNeeded; weekIndex++) {
    const week: (number | null)[] = [];

    for (let dayIndex = 0; dayIndex < 7; dayIndex++) {
      const cellIndex = weekIndex * 7 + dayIndex;

      if (cellIndex < mondayStartDay) {
        // Jours avant le 1er janvier
        week.push(null);
      } else if (cellIndex >= mondayStartDay + totalDays) {
        // Jours après le 31 décembre
        week.push(null);
      } else {
        // Jours de l'année
        const daysSinceStart = cellIndex - mondayStartDay;
        const currentDate = new Date(year, 0, 1 + daysSinceStart);
        // Utiliser une méthode qui respecte le fuseau horaire local
        const currentYear = currentDate.getFullYear();
        const currentMonth = String(currentDate.getMonth() + 1).padStart(
          2,
          '0'
        );
        const currentDay = String(currentDate.getDate()).padStart(2, '0');
        const dateKey = `${currentYear}-${currentMonth}-${currentDay}`;
        const duration = dataMap.get(dateKey) || 0;
        week.push(duration);
      }
    }

    weeks.push(week);
  }

  return weeks;
}

// Fonction pour générer une grille vide pour le chargement
export function generateEmptyGrid(year: number): Week[] {
  const startDate = new Date(year, 0, 1);
  const endDate = new Date(year, 11, 31);
  const startDayOfWeek = startDate.getDay();
  const mondayStartDay = startDayOfWeek === 0 ? 6 : startDayOfWeek - 1;
  const totalDays =
    Math.floor(
      (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)
    ) + 1;
  const totalCells = mondayStartDay + totalDays;
  const weeksNeeded = Math.ceil(totalCells / 7);

  const weeks: Week[] = [];
  for (let weekIndex = 0; weekIndex < weeksNeeded; weekIndex++) {
    const week: (number | null)[] = [];
    for (let dayIndex = 0; dayIndex < 7; dayIndex++) {
      const cellIndex = weekIndex * 7 + dayIndex;
      if (
        cellIndex < mondayStartDay ||
        cellIndex >= mondayStartDay + totalDays
      ) {
        week.push(null);
      } else {
        week.push(0); // Cellules vides avec 0 contribution
      }
    }
    weeks.push(week);
  }
  return weeks;
}

// Fonction pour générer les labels des mois
export function generateMonthLabels(
  year: number,
  weeksData: Week[]
): { month: string; position: number }[] {
  const startDate = new Date(year, 0, 1);
  const startDayOfWeek = startDate.getDay();
  const mondayStartDay = startDayOfWeek === 0 ? 6 : startDayOfWeek - 1;

  const monthLabels: { month: string; position: number }[] = [];

  for (let month = 0; month < 12; month++) {
    const firstDayOfMonth = new Date(year, month, 1);
    const daysSinceYearStart = Math.floor(
      (firstDayOfMonth.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)
    );
    const cellIndex = mondayStartDay + daysSinceYearStart;
    const weekIndex = Math.floor(cellIndex / 7);

    // Ne pas afficher le mois s'il dépasse le nombre de semaines
    if (weekIndex < weeksData.length) {
      monthLabels.push({
        month: MONTH_NAMES[month],
        position: weekIndex,
      });
    }
  }

  return monthLabels;
}

// Types pour la conversion MIDI
interface MidiNote {
  note: string;
  startBeat: number;
  durationInBeats: number;
  track: number;
}

interface MidiConversionResult {
  notes: MidiNote[];
  tempo: number;
  timeSignature: string;
  duration_ms: number;
  originalTracksCount: number;
  uniqueTracksCount: number;
}

// Fonction pour détecter et supprimer les tracks en double
function removeDuplicateTracks(tracks: any[]): any[] {
  const uniqueTracks: any[] = [];
  const trackSignatures: Set<string> = new Set();

  for (const track of tracks) {
    if (track.notes.length === 0) {
      // Garder les tracks vides (métadonnées)
      uniqueTracks.push(track);
      continue;
    }

    // Créer une signature unique pour cette track basée sur ses notes
    const trackSignature = createTrackSignature(track);

    if (!trackSignatures.has(trackSignature)) {
      trackSignatures.add(trackSignature);
      uniqueTracks.push(track);
    }
  }

  return uniqueTracks;
}

// Fonction pour créer une signature unique d'une track
function createTrackSignature(track: any): string {
  // Trier les notes par temps puis par note pour une comparaison cohérente
  const sortedNotes = track.notes
    .map((note: any) => ({
      note: note.name,
      time: Math.round(note.time * 100) / 100, // Arrondir à 2 décimales
      duration: Math.round(note.duration * 100) / 100,
    }))
    .sort((a: any, b: any) => {
      if (a.time !== b.time) return a.time - b.time;
      return a.note.localeCompare(b.note);
    });

  // Créer une signature JSON de la track
  return JSON.stringify(sortedNotes);
}

// Fonction pour convertir un fichier MIDI en format compatible avec la base de données
export async function convertMidiToSongFormat(
  midiFile: File
): Promise<MidiConversionResult> {
  try {
    // Lire le fichier MIDI
    const arrayBuffer = await midiFile.arrayBuffer();
    const midi = new Midi(arrayBuffer);

    // Extraire les métadonnées
    const tempo = midi.header.tempos[0]?.bpm || 120;
    const timeSignature = midi.header.timeSignatures[0]
      ? `${midi.header.timeSignatures[0].timeSignature[0]}/${midi.header.timeSignatures[0].timeSignature[1]}`
      : '4/4';

    // Calculer la durée totale en millisecondes
    const durationSeconds = midi.duration;
    const duration_ms = Math.round(durationSeconds * 1000);

    // Supprimer les tracks en double avant traitement
    const uniqueTracks = removeDuplicateTracks(midi.tracks);

    // Convertir toutes les notes en format unifié (en beats)
    const allNotes: MidiNote[] = [];
    let trackIndex = 0;
    const effectivePpq = midi.header.ppq || 480;

    for (const track of uniqueTracks) {
      // Traiter toutes les tracks qui contiennent des notes
      if (track.notes.length > 0) {
        for (const note of track.notes) {
          const startBeat = (note.ticks ?? 0) / effectivePpq;
          const durationInBeats = (note.durationTicks ?? 0) / effectivePpq;
          allNotes.push({
            note: note.name, // ex: "C4", "F#5"
            startBeat,
            durationInBeats,
            track: trackIndex,
          });
        }
      }
      trackIndex++;
    }

    // Trier les notes par position en beats
    allNotes.sort((a, b) => a.startBeat - b.startBeat);

    return {
      notes: allNotes,
      tempo,
      timeSignature,
      duration_ms,
      originalTracksCount: midi.tracks.length,
      uniqueTracksCount: uniqueTracks.length,
    };
  } catch (error) {
    console.error('Erreur lors de la conversion MIDI:', error);
    throw new Error('Impossible de convertir le fichier MIDI');
  }
}
