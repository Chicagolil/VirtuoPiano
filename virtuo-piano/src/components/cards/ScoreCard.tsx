import { IconCalendar, IconClock, IconMusic } from '@tabler/icons-react';
import AccuracyBadge from '../badge/AccuracyBadge';
import ProgressBar from '../ProgressBar';
import ModeBadge from '../badge/ModeBadge';

export interface ScoreSummary {
  id: string;
  songTitle: string;
  songComposer?: string;
  correctNotes: number;
  missedNotes: number;
  wrongNotes: number;
  totalPoints: number;
  maxMultiplier: number;
  maxCombo: number;
  playedAt: string;
  mode: 'learning' | 'game';
  accuracy: number; // pourcentage de notes correctes
  duration: string; // durée de la session
  thumbnail?: string;
  progress: number; // progression totale dans le morceau
  tempo: number; // tempo en BPM
  level: number; // niveau de difficulté
}

export default function ScoreCard({ score }: { score: ScoreSummary }) {
  return (
    <div
      className={`bg-white dark:bg-slate-800 shadow-sm rounded-xl p-4 border ${
        score.mode === 'learning'
          ? 'border-indigo-200 dark:border-indigo-900/30'
          : 'border-purple-200 dark:border-purple-900/30'
      } hover:shadow-md transition-shadow`}
    >
      <div className="flex items-start">
        <div className="flex-shrink-0 w-14 h-14 rounded-lg overflow-hidden bg-slate-100 dark:bg-slate-700 mr-3">
          {score.thumbnail ? (
            <img
              src={score.thumbnail}
              alt={score.songTitle}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <IconMusic
                size={24}
                className="text-slate-400 dark:text-slate-500"
              />
            </div>
          )}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-1">
            <h3 className="text-sm font-medium text-slate-900 dark:text-white truncate pr-2">
              {score.songTitle}
            </h3>
            <ModeBadge mode={score.mode} />
          </div>

          {score.songComposer && (
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1.5">
              {score.songComposer}
            </p>
          )}

          <div className="flex items-center mb-2 text-xs text-slate-500 dark:text-slate-400">
            <span className="inline-flex items-center mr-3">
              <IconCalendar size={14} className="mr-1" />
              {score.playedAt}
            </span>
            <span className="inline-flex items-center">
              <IconClock size={14} className="mr-1" />
              {score.duration}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <AccuracyBadge accuracy={score.accuracy} />
            <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
              {score.totalPoints} pts
            </span>
          </div>
        </div>
      </div>

      <div className="mt-3">
        <div className="flex justify-between items-center text-xs mb-1">
          <span className="text-slate-500 dark:text-slate-400">
            Progression
          </span>
          <span className="text-slate-700 dark:text-slate-300">
            {score.progress}%
          </span>
        </div>
        <ProgressBar
          value={score.progress}
          max={100}
          colorClass={
            score.progress === 100
              ? 'bg-emerald-500'
              : score.mode === 'learning'
              ? 'bg-indigo-500'
              : 'bg-purple-500'
          }
        />
      </div>

      <div className="grid grid-cols-3 gap-2 mt-3 text-center">
        <div className="bg-slate-50 dark:bg-slate-700/40 rounded py-1.5 px-1">
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Précision
          </p>
          <p className="text-sm font-medium text-slate-700 dark:text-slate-300">
            {score.accuracy}%
          </p>
        </div>
        <div className="bg-slate-50 dark:bg-slate-700/40 rounded py-1.5 px-1">
          <p className="text-xs text-slate-500 dark:text-slate-400">Combo</p>
          <p className="text-sm font-medium text-slate-700 dark:text-slate-300">
            x{score.maxCombo}
          </p>
        </div>
        <div className="bg-slate-50 dark:bg-slate-700/40 rounded py-1.5 px-1">
          <p className="text-xs text-slate-500 dark:text-slate-400">Multi.</p>
          <p className="text-sm font-medium text-slate-700 dark:text-slate-300">
            x{score.maxMultiplier}
          </p>
        </div>
      </div>
    </div>
  );
}
