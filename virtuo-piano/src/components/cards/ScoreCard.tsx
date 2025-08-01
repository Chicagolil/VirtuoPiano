import {
  IconCalendar,
  IconClock,
  IconFlame,
  IconHandFinger,
  IconHandStop,
  IconMusic,
  IconTrophy,
} from '@tabler/icons-react';
import AccuracyBadge from '../badge/AccuracyBadge';
import ProgressBar from '../ProgressBar';
import ModeBadge from '../badge/ModeBadge';

export interface ScoreSummary {
  id: string;
  songTitle: string;
  songComposer?: string;
  totalPoints: number;
  maxMultiplier: number;
  maxCombo: number;
  playedAt: string;
  mode: 'learning' | 'game';
  accuracy: number;
  duration: string;
  imageUrl?: string;
  performance: number;
  hands?: string;
}

export default function ScoreCard({ score }: { score: ScoreSummary }) {
  return (
    <div
      className={`group bg-white/3 shadow-sm rounded-xl p-4 border ${
        score.mode === 'learning'
          ? 'border-indigo-200/10 dark:border-indigo-900/10'
          : 'border-purple-200/10 dark:border-purple-900/10'
      } hover:shadow-md transition-shadow`}
    >
      <div className="flex items-start">
        <div className="flex-shrink-0 w-14 h-14 rounded-lg overflow-hidden bg-slate-100 dark:bg-slate-700 mr-3">
          {score.imageUrl ? (
            <img
              src={score.imageUrl}
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
            <h3 className="text-sm font-medium text-white truncate pr-2 relative group-hover:after:w-[calc(100%-0.5rem)] after:absolute after:bottom-0 after:left-0 after:h-px after:bg-current after:transition-all after:duration-300 after:ease-out after:w-0">
              {score.songTitle}
            </h3>
            <ModeBadge mode={score.mode} />
          </div>

          {score.songComposer && (
            <p className="text-xs text-white/70 mb-1.5">{score.songComposer}</p>
          )}

          <div className="flex items-center mb-2 text-xs text-white/70">
            <span className="inline-flex items-center mr-3">
              <IconCalendar size={14} className="mr-1" />
              {score.playedAt}
            </span>
            <span className="inline-flex items-center mr-3">
              <IconClock size={14} className="mr-1" />
              {score.duration}
            </span>
            {score.hands && (
              <span
                className={`inline-flex items-center px-2 py-1 rounded-md text-xs font-medium border ${
                  score.hands === 'right'
                    ? 'bg-indigo-100/20 text-indigo-300 border-indigo-300/30'
                    : score.hands === 'left'
                    ? 'bg-green-100/20 text-green-300 border-green-300/30'
                    : score.hands === 'both'
                    ? 'bg-amber-100/20 text-amber-300 border-amber-300/30'
                    : 'bg-blue-100/20 text-blue-300 border-blue-300/30'
                }`}
              >
                <IconHandStop size={12} className="mr-1" />
                {score.hands === 'right'
                  ? 'Main droite'
                  : score.hands === 'left'
                  ? 'Main gauche'
                  : score.hands === 'both'
                  ? 'Deux mains'
                  : score.hands}
              </span>
            )}
          </div>

          <div className="flex items-center justify-between">
            {score.mode === 'learning' ? (
              <AccuracyBadge accuracy={score.accuracy} />
            ) : (
              <div className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300">
                <IconTrophy size={14} className="mr-1" />
                {score.totalPoints} pts
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Barre de progression seulement en mode apprentissage */}
      {score.mode === 'learning' && (
        <div className="mt-3">
          <div className="flex justify-between items-center text-xs mb-1">
            <span className="text-white/70">Progression</span>
            <span className="text-white">{score.performance}%</span>
          </div>
          <ProgressBar
            value={score.performance}
            max={100}
            colorClass={
              score.performance === 100 ? 'bg-emerald-500' : 'bg-indigo-500'
            }
          />
        </div>
      )}

      {/* Tuiles du bas seulement en mode jeu */}
      {score.mode === 'game' && (
        <div className="grid grid-cols-2 gap-2 mt-3 text-center">
          <div className="bg-white/5 rounded py-1.5 px-1">
            <p className="text-xs text-white/70">Combo</p>
            <p className="text-sm font-medium text-white">x{score.maxCombo}</p>
          </div>
          <div className="bg-white/5 rounded py-1.5 px-1">
            <p className="text-xs text-white/70">Multi.</p>
            <p className="text-sm font-medium text-white">
              x{score.maxMultiplier}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
