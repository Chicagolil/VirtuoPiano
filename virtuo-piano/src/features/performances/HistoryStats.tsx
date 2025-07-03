'use client';

import React, { useEffect, useState, useMemo } from 'react';
import {
  IconClock,
  IconSearch,
  IconCalendar,
  IconFilter,
} from '@tabler/icons-react';
import ScoreCard from '@/components/cards/ScoreCard';
import { ScoreSummary } from '@/components/cards/ScoreCard';
import { getAllSessions } from '@/lib/actions/history-actions';
import { Spinner } from '@/components/ui/spinner';

// A TESTER
export default function HistoryStats() {
  const [allScores, setAllScores] = useState<ScoreSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [dateFilter, setDateFilter] = useState('all'); // 'all', 'today', 'week', 'month', 'custom'
  const [customStartDate, setCustomStartDate] = useState('');
  const [customEndDate, setCustomEndDate] = useState('');
  const [showDateFilters, setShowDateFilters] = useState(false);
  const [modeFilter, setModeFilter] = useState<'all' | 'learning' | 'game'>(
    'all'
  );
  const [onlyCompleted, setOnlyCompleted] = useState(false);

  // Fonction pour convertir playedAt en Date
  const parsePlayedAtToDate = (playedAt: string): Date => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    if (playedAt.includes("Aujourd'hui")) {
      return today;
    } else if (playedAt.includes('Hier')) {
      const yesterday = new Date(today);
      yesterday.setDate(today.getDate() - 1);
      return yesterday;
    } else if (playedAt.includes('Il y a')) {
      const match = playedAt.match(/Il y a (\d+) jour/);
      if (match) {
        const daysAgo = parseInt(match[1]);
        const date = new Date(today);
        date.setDate(today.getDate() - daysAgo);
        return date;
      }
    } else if (playedAt.includes('semaine')) {
      const match = playedAt.match(/Il y a (\d+) semaine/);
      if (match) {
        const weeksAgo = parseInt(match[1]);
        const date = new Date(today);
        date.setDate(today.getDate() - weeksAgo * 7);
        return date;
      }
    }

    // Pour les dates formatées comme "15 janvier", on essaie de les parser
    try {
      const [day, month] = playedAt.split(' ');
      const monthIndex = {
        janvier: 0,
        février: 1,
        mars: 2,
        avril: 3,
        mai: 4,
        juin: 5,
        juillet: 6,
        août: 7,
        septembre: 8,
        octobre: 9,
        novembre: 10,
        décembre: 11,
      }[month.toLowerCase()];

      if (monthIndex !== undefined) {
        const year = now.getFullYear();
        return new Date(year, monthIndex, parseInt(day));
      }
    } catch (e) {
      // Ignore les erreurs de parsing
    }

    // Fallback: retourner une date très ancienne
    return new Date(0);
  };

  // Filtrer les scores en fonction de la recherche et des dates
  const filteredScores = useMemo(() => {
    let filtered = allScores;

    // Filtrage par mode
    if (modeFilter !== 'all') {
      filtered = filtered.filter((score) => score.mode === modeFilter);
    }
    // Filtrage chansons terminées (si mode = apprentissage)
    if (modeFilter === 'learning' && onlyCompleted) {
      filtered = filtered.filter((score) => score.performance >= 90);
    }

    // Filtrage par recherche textuelle
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      filtered = filtered.filter((score) => {
        const titleMatch = score.songTitle.toLowerCase().includes(query);
        const composerMatch =
          score.songComposer?.toLowerCase().includes(query) || false;
        return titleMatch || composerMatch;
      });
    }

    // Filtrage par date
    if (dateFilter !== 'all') {
      const now = new Date();
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

      filtered = filtered.filter((score) => {
        const sessionDate = parsePlayedAtToDate(score.playedAt);

        switch (dateFilter) {
          case 'today':
            return sessionDate >= today && sessionDate <= today;
          case 'week':
            const weekAgo = new Date(today);
            weekAgo.setDate(today.getDate() - 7);
            return sessionDate >= weekAgo;
          case 'month':
            const monthAgo = new Date(today);
            monthAgo.setMonth(today.getMonth() - 1);
            return sessionDate >= monthAgo;
          case 'custom':
            if (customStartDate && customEndDate) {
              const startDate = new Date(customStartDate);
              const endDate = new Date(customEndDate);
              endDate.setHours(23, 59, 59, 999); // Fin de journée
              return sessionDate >= startDate && sessionDate <= endDate;
            }
            return true;
          default:
            return true;
        }
      });
    }

    return filtered;
  }, [
    allScores,
    searchQuery,
    dateFilter,
    customStartDate,
    customEndDate,
    modeFilter,
    onlyCompleted,
  ]);

  useEffect(() => {
    const fetchAllSessions = async () => {
      try {
        setLoading(true);
        const { success, data, error } = await getAllSessions();
        if (success) {
          setAllScores(data);
          setError(null);
        } else {
          setError(error || "Erreur lors du chargement de l'historique");
        }
      } catch (err) {
        setError("Erreur lors du chargement de l'historique");
      } finally {
        setLoading(false);
      }
    };

    fetchAllSessions();
  }, []);

  return (
    <div className="max-w-full mx-auto p-4 px-8">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-white flex items-center">
          <IconClock size={20} className="mr-2 text-indigo-400" />
          Toutes les sessions
        </h2>
      </div>

      {/* Barre de recherche */}
      <div className="mb-6">
        <div className="flex gap-4 items-center">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <IconSearch size={20} className="text-white/50" />
            </div>
            <input
              type="text"
              placeholder="Rechercher par nom de musique ou d'artiste..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
            />
          </div>

          {/* Bouton filtre de date */}
          <button
            onClick={() => setShowDateFilters(!showDateFilters)}
            className={`px-4 py-3 rounded-lg border transition-all flex items-center gap-2 ${
              dateFilter !== 'all'
                ? 'bg-indigo-500/20 border-indigo-500/50 text-indigo-300'
                : 'bg-white/10 border-white/20 text-white/70 hover:bg-white/20'
            }`}
          >
            <IconFilter size={18} />
            <span className="hidden sm:inline">Filtrer par date</span>
          </button>
        </div>

        {/* Panneau des filtres de date */}
        {showDateFilters && (
          <div className="mt-4 p-4 bg-white/5 rounded-lg border border-white/10">
            <div className="flex flex-wrap gap-4 items-center">
              {/* Filtres rapides */}
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setDateFilter('all')}
                  className={`px-3 py-1.5 rounded-md text-sm transition-colors ${
                    dateFilter === 'all'
                      ? 'bg-indigo-500 text-white'
                      : 'bg-white/10 text-white/70 hover:bg-white/20'
                  }`}
                >
                  Toutes
                </button>
                <button
                  onClick={() => setDateFilter('today')}
                  className={`px-3 py-1.5 rounded-md text-sm transition-colors ${
                    dateFilter === 'today'
                      ? 'bg-indigo-500 text-white'
                      : 'bg-white/10 text-white/70 hover:bg-white/20'
                  }`}
                >
                  Aujourd'hui
                </button>
                <button
                  onClick={() => setDateFilter('week')}
                  className={`px-3 py-1.5 rounded-md text-sm transition-colors ${
                    dateFilter === 'week'
                      ? 'bg-indigo-500 text-white'
                      : 'bg-white/10 text-white/70 hover:bg-white/20'
                  }`}
                >
                  Cette semaine
                </button>
                <button
                  onClick={() => setDateFilter('month')}
                  className={`px-3 py-1.5 rounded-md text-sm transition-colors ${
                    dateFilter === 'month'
                      ? 'bg-indigo-500 text-white'
                      : 'bg-white/10 text-white/70 hover:bg-white/20'
                  }`}
                >
                  Ce mois
                </button>
              </div>

              {/* Dates personnalisées */}
              <div className="flex items-center gap-2">
                <span className="text-white/70 text-sm">
                  Période personnalisée:
                </span>
                <input
                  type="date"
                  value={customStartDate}
                  onChange={(e) => {
                    setCustomStartDate(e.target.value);
                    setDateFilter('custom');
                  }}
                  className="px-3 py-1.5 bg-white/10 border border-white/20 rounded-md text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <span className="text-white/50">à</span>
                <input
                  type="date"
                  value={customEndDate}
                  onChange={(e) => {
                    setCustomEndDate(e.target.value);
                    setDateFilter('custom');
                  }}
                  className="px-3 py-1.5 bg-white/10 border border-white/20 rounded-md text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Filtres avancés */}
      <div className="mb-6 flex flex-col gap-2 items-start">
        {/* Filtre par mode */}
        <div className="flex gap-2 items-center">
          <span className="text-white/70 text-sm">Mode :</span>
          <button
            onClick={() => setModeFilter('all')}
            className={`px-3 py-1.5 rounded-md text-sm transition-colors ${
              modeFilter === 'all'
                ? 'bg-indigo-500 text-white'
                : 'bg-white/10 text-white/70 hover:bg-white/20'
            }`}
          >
            Tous
          </button>
          <button
            onClick={() => setModeFilter('learning')}
            className={`px-3 py-1.5 rounded-md text-sm transition-colors ${
              modeFilter === 'learning'
                ? 'bg-indigo-500 text-white'
                : 'bg-white/10 text-white/70 hover:bg-white/20'
            }`}
          >
            Apprentissage
          </button>
          <button
            onClick={() => setModeFilter('game')}
            className={`px-3 py-1.5 rounded-md text-sm transition-colors ${
              modeFilter === 'game'
                ? 'bg-indigo-500 text-white'
                : 'bg-white/10 text-white/70 hover:bg-white/20'
            }`}
          >
            Jeu
          </button>
        </div>
        {/* Filtre chansons terminées */}
        {modeFilter === 'learning' && (
          <div className="mt-2">
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <span className="text-white/70 text-sm">
                Chansons terminées (90%+)
              </span>
              <span className="relative inline-block w-10 h-6">
                <input
                  type="checkbox"
                  checked={onlyCompleted}
                  onChange={() => setOnlyCompleted((v) => !v)}
                  className="sr-only peer"
                />
                <span
                  className={`
                    absolute left-0 top-0 w-12 h-6 rounded-full transition
                    ${onlyCompleted ? 'bg-indigo-500' : 'bg-white/20'}
                  `}
                ></span>
                <span
                  className={`
                    absolute top-1 left-1 w-4 h-4 rounded-full bg-white transition
                    peer-checked:translate-x-2
                    ${onlyCompleted ? 'shadow-lg' : ''}
                  `}
                  style={{
                    transform: onlyCompleted
                      ? 'translateX(16px)'
                      : 'translateX(0)',
                  }}
                >
                  {onlyCompleted && (
                    <svg
                      className="w-4 h-4 text-indigo-600"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={2}
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  )}
                </span>
              </span>
            </label>
          </div>
        )}
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-8">
          <Spinner variant="bars" size={32} className="text-white" />
        </div>
      ) : error ? (
        <div className="text-center py-8">
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 mb-4 max-w-md mx-auto">
            <p className="text-red-600 dark:text-red-400 mb-4">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="inline-flex cursor-pointer items-center px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 dark:bg-red-500 dark:hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed rounded-md transition-colors"
            >
              Réessayer
            </button>
          </div>
        </div>
      ) : filteredScores.length === 0 ? (
        <div className="text-center py-8 text-white/70">
          Aucune session trouvée dans votre historique
        </div>
      ) : (
        <>
          <div className="mb-4 text-sm text-white/70">
            {filteredScores.length} session
            {filteredScores.length > 1 ? 's' : ''} trouvée
            {filteredScores.length > 1 ? 's' : ''}
            {searchQuery && filteredScores.length !== allScores.length && (
              <span className="ml-2 text-white/50">
                sur {allScores.length} total
              </span>
            )}
          </div>
          <div className="grid cursor-pointer grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredScores.map((score) => (
              <ScoreCard key={score.id} score={score} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
