import { SongType, SourceType } from '@prisma/client';
import { JsonValue } from '@prisma/client/runtime/library';

export type SongBasicData = {
  id: string;
  title: string;
  composer: string | null;
  imageUrl: string | null;
  duration_ms: number;
  genre: string | null;
  tempo: number;
  Level: number;
  isFavorite: boolean;
};

export type ScoreDurationData = {
  date: Date;
  durationInMinutes: number;
};

export type SessionDetail = {
  id: string;
  songTitle: string;
  songComposer: string | null;
  correctNotes: number | null;
  missedNotes: number | null;
  wrongNotes: number | null;
  totalPoints: number | null;
  maxMultiplier: number | null;
  maxCombo: number | null;
  sessionStartTime: Date;
  sessionEndTime: Date;
  modeName: string;
  durationInMinutes: number;
  accuracy: number;
  performance: number;
};

export interface ScoreSummaryService {
  id: string;
  songTitle: string;
  songComposer: string | null;
  totalPoints: number | null;
  maxMultiplier: number | null;
  imageUrl: string | null;
  wrongNotes: number | null;
  correctNotes: number | null;
  missedNotes: number | null;
  maxCombo: number | null;
  sessionStartTime: Date;
  sessionEndTime: Date;
  modeName: string;
  hands: string | null;
}

export type PlayedSong = {
  id: string;
  title: string;
  composer: string | null;
  genre: string | null;
  tempo: number;
  duration_ms: number;
  timeSignature: string;
  SourceType: SourceType;
  notes: JsonValue;
  Level: number;
  imageUrl: string | null;
  SongType: SongType;
  isFavorite: boolean;
  lastPlayed: string;
};

export interface SongPerformanceGeneralTiles {
  totalSessions: number;
  totalTimeInMinutes: number;
  currentStreak: number;
  globalRanking: number | null;
}

export interface PracticeDataPoint {
  name: string;
  pratique: number;
  modeJeu: number;
  modeApprentissage: number;
}

export interface PrecisionDataPoint {
  session: string;
  precisionRightHand: number | null;
  precisionLeftHand: number | null;
  precisionBothHands: number | null;
}

export interface PerformanceDataPoint {
  session: string;
  performanceRightHand: number | null;
  performanceLeftHand: number | null;
  performanceBothHands: number | null;
}

export interface SongPracticeData {
  data: PracticeDataPoint[];
  totalPratique: number;
  totalModeJeu: number;
  totalModeApprentissage: number;
}
export interface SongLearningPrecisionData {
  data: PrecisionDataPoint[];
  averagePrecisionRightHand: number;
  averagePrecisionLeftHand: number;
  averagePrecisionBothHands: number;
  totalSessions: number;
}
export interface SongLearningPerformanceData {
  data: PerformanceDataPoint[];
  totalSessions: number;
  averagePerformanceRightHand: number;
  averagePerformanceLeftHand: number;
  averagePerformanceBothHands: number;
}

export interface SongLearningModeTiles {
  totalSessions: number;
  averageAccuracy: number;
  averagePerformance: number;
  totalTimeInMinutes: number;
  longestSessionInMinutes: number;
  currentStreak: number;
}

export interface SongPlayModeTiles {
  totalSessions: number;
  averageScore: number;
  bestScore: number;
  totalTimeInMinutes: number;
  longestSessionInMinutes: number;
  currentStreak: number;
}

export interface BarChartDataPoint {
  mois: string;
  precision: number;
  performance: number;
}

export interface SongPerformancePrecisionBarChartData {
  label: string;
  data: BarChartDataPoint[];
  totalIntervals: number;
}

export interface LineChartDataPoint {
  session: string;
  score: number;
  combo: number;
  multi: number;
}

export interface SongGamingLineChartData {
  data: LineChartDataPoint[];
  averageScore: number;
  averageCombo: number;
  averageMulti: number;
  totalSessions: number;
}

export interface TimelineRecordData {
  id: number;
  date: string;
  score: number;
  type: string;
  description: string;
  details: string;
}

export interface SongTimelineRecordsData {
  records: TimelineRecordData[];
}

export interface SongGamingBarChartDataPoint {
  mois: string;
  score: number;
  combo: number;
  multi: number;
}

export interface SongGamingBarChartData {
  label: string;
  data: SongGamingBarChartDataPoint[];
  totalIntervals: number;
}
