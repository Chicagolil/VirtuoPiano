'use client';

import { useEffect, useState, useTransition } from 'react';
import { useSong } from '@/contexts/SongContext';
import { useRouter } from 'next/navigation';
import { castMsToMin } from '@/common/utils/function';
import {
  IconMusic,
  IconHeart,
  IconClock,
  IconChartBar,
  IconChevronRight,
  IconTimeline,
  IconBrain,
} from '@tabler/icons-react';

import React from 'react';
import styles from '../library/Song.module.css';
import { toggleFavorite } from '@/lib/actions/songs';
import DifficultyBadge from '@/components/DifficultyBadge';
import { toast } from 'react-hot-toast';
import { SongBasicData } from '@/lib/services/performances-services';

// Composants extraits
import RecordsTimeline from './components/RecordsTimeline';
import BarChartWithNavigation from './components/BarChartWithNavigation';

import RecentSessionsByMode from './components/RecentSessionsByMode';

// Données et utilitaires
import {
  learningRecords,
  gameRecords,
  gameBarIntervals,
} from './data/performanceData';

import LearningTiles from './components/LearningTiles';
import PracticeGraph from './components/PracticeGraph';
import GeneralTiles from './components/GeneralTiles';
import GamingTiles from './components/GamingTiles';
import PrecisionChart from './components/PrecisionChart';
import PerformanceChart from './components/PerformanceChart';
import PerformancePrecisionBarChart from './components/PerformancePrecisionBarChart';
import GamingLineChart from './components/GamingLineChart';

export default function SongPerformances({ song }: { song: SongBasicData }) {
  const { setCurrentSong } = useSong();
  const router = useRouter();
  const [isFavorite, setIsFavorite] = useState(song.isFavorite || false);
  const [isPending, startTransition] = useTransition();
  const [activeTab, setActiveTab] = useState<'apprentissage' | 'jeu'>(
    'apprentissage'
  );

  // États pour la navigation des intervalles de barres

  const [gameBarIndex, setGameBarIndex] = useState(0);

  // Données étendues

  useEffect(() => {
    setCurrentSong(song);
    return () => setCurrentSong(null);
  }, [song, setCurrentSong]);

  // Gestion des favoris
  const handleFavoriteClick = () => {
    setIsFavorite(!isFavorite);
    startTransition(async () => {
      try {
        const result = await toggleFavorite(song.id);
        if (result.success) {
          toast.success(result.message);
        } else {
          setIsFavorite(isFavorite);
          toast.error(result.message);
        }
      } catch (error) {
        console.error('Erreur lors de la modification des favoris:', error);
        setIsFavorite(isFavorite);
        toast.error(
          'Une erreur est survenue lors de la modification des favoris'
        );
      }
    });
  };

  // Navigation
  const handleBackToPlayedSongs = () => {
    router.push('/performances?tab=playedSongs');
  };

  const gameBars = [
    {
      dataKey: 'score',
      color: '#6366f1',
      name: 'Meilleur score',
      yAxisId: 'score',
    },
    { dataKey: 'combo', color: '#f59e0b', name: 'Combo max', yAxisId: 'combo' },
    {
      dataKey: 'multi',
      color: '#10b981',
      name: 'Multiplicateur max',
      yAxisId: 'multi',
    },
  ];

  return (
    <div className={styles.container}>
      {/* En-tête du morceau */}
      <div className={styles.header}>
        <div
          className={styles.headerGradient}
          style={{
            background:
              'linear-gradient(to right, rgba(59, 130, 246, 0.2), rgba(99, 102, 241, 0.2), rgba(251, 146, 60, 0.2))',
          }}
        >
          <div className="absolute top-4 right-4 z-10">
            <button
              onClick={handleBackToPlayedSongs}
              className="text-md cursor-pointer text-indigo-400 hover:text-indigo-300 font-medium flex items-center relative hover:after:w-[calc(100%-1rem)] after:absolute after:bottom-0 after:left-0 after:h-px after:bg-current after:transition-all after:duration-300 after:ease-out after:w-0"
            >
              Retour aux chansons jouées
              <IconChevronRight size={18} className="ml-1" />
            </button>
          </div>

          <div className={styles.headerContent}>
            <div className={styles.songImage}>
              {song.imageUrl ? (
                <img
                  src={song.imageUrl}
                  alt={song.title}
                  className="h-full w-full object-cover"
                />
              ) : (
                <IconMusic size={36} className={styles.similarSongIconText} />
              )}
            </div>

            <div className={styles.songInfo}>
              <div className="flex items-start">
                <div>
                  <h1 className={styles.songTitle}>{song.title}</h1>
                  <p className={styles.songComposer}>
                    {song.composer || 'Compositeur inconnu'}
                  </p>
                </div>

                <button
                  onClick={handleFavoriteClick}
                  className={`${styles.favoriteButton} ml-3 ${
                    isFavorite ? styles.favoriteActive : ''
                  }`}
                  disabled={isPending}
                >
                  <IconHeart
                    size={41}
                    fill={isFavorite ? 'currentColor' : 'none'}
                  />
                </button>
              </div>

              <div className={styles.songMeta}>
                <div className={styles.metaBadge}>
                  <IconClock size={14} className={styles.metaIcon} />
                  <span>{castMsToMin(song.duration_ms)}</span>
                </div>
                <div className={styles.metaBadge}>
                  <IconChartBar size={14} className={styles.metaIcon} />
                  <span>{song.tempo} BPM</span>
                </div>
                <div className={styles.metaBadge}>
                  <IconMusic size={14} className={styles.metaIcon} />
                  <span>{song.genre || 'Non spécifié'}</span>
                </div>
                <DifficultyBadge difficulty={song.Level} />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className={styles.tabContent}>
        {/* Première section avec graphique principal et tuiles */}
        <div className="grid grid-cols-1 pb-4 md:grid-cols-3 lg:grid-cols-4 gap-4 auto-rows-auto">
          {/* Graphique principal de pratique */}
          <PracticeGraph songId={song.id} />
          {/* Tuiles d'informations */}
          <GeneralTiles songId={song.id} />
        </div>

        {/* Onglets */}
        <div className="mt-12">
          <div className="flex items-center justify-center mb-8">
            <nav className="flex space-x-8">
              <button
                onClick={() => setActiveTab('apprentissage')}
                className={`relative flex items-center px-4 py-3 font-medium transition-all duration-300 group ${
                  activeTab === 'apprentissage'
                    ? 'text-blue-400'
                    : 'text-slate-400 hover:text-slate-300'
                }`}
              >
                <IconBrain
                  size={18}
                  className="mr-2 transition-transform duration-300 group-hover:scale-110"
                />
                <span className="text-sm font-semibold tracking-wide">
                  Mode Apprentissage
                </span>
                {activeTab === 'apprentissage' && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-400 to-indigo-500 rounded-full animate-in slide-in-from-bottom-2 duration-300" />
                )}
                {activeTab !== 'apprentissage' && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-slate-600 opacity-0 group-hover:opacity-50 transition-opacity duration-300 rounded-full" />
                )}
              </button>
              <button
                onClick={() => setActiveTab('jeu')}
                className={`relative flex items-center px-4 py-3 font-medium transition-all duration-300 group ${
                  activeTab === 'jeu'
                    ? 'text-orange-400'
                    : 'text-slate-400 hover:text-slate-300'
                }`}
              >
                <IconChartBar
                  size={18}
                  className="mr-2 transition-transform duration-300 group-hover:scale-110"
                />
                <span className="text-sm font-semibold tracking-wide">
                  Mode Jeu
                </span>
                {activeTab === 'jeu' && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-orange-400 to-red-500 rounded-full animate-in slide-in-from-bottom-2 duration-300" />
                )}
                {activeTab !== 'jeu' && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-slate-600 opacity-0 group-hover:opacity-50 transition-opacity duration-300 rounded-full" />
                )}
              </button>
            </nav>
          </div>

          {/* Contenu des onglets */}
          {activeTab === 'apprentissage' && (
            <div className="animate-in fade-in slide-in-from-right-8 duration-500">
              {/* Timeline Apprentissage */}
              <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10 mb-8">
                <h3 className="text-lg font-semibold text-white flex items-center mb-4">
                  <IconTimeline size={20} className="mr-2 text-yellow-400" />
                  Ligne du temps des records
                </h3>
                <RecordsTimeline records={learningRecords} />
              </div>

              {/* Layout avec tuiles et graphiques */}
              <div className="grid grid-cols-12 gap-6 mb-8">
                {/* Tuiles à gauche */}
                <LearningTiles songId={song.id} />

                {/* Graphique Précision */}
                <PrecisionChart songId={song.id} />
              </div>

              {/* Graphique Performance et graphique en barres */}
              <div className="grid grid-cols-12 gap-6">
                <PerformanceChart songId={song.id} />
                {/* Graphique à barres Précision & Performance */}
                <PerformancePrecisionBarChart songId={song.id} />
              </div>
              <RecentSessionsByMode
                songTitle={song.title}
                songComposer={song.composer || ''}
                mode="learning"
              />
            </div>
          )}

          {activeTab === 'jeu' && (
            <div className="animate-in fade-in slide-in-from-left-8 duration-500">
              {/* Timeline Jeu */}
              <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10 mb-8">
                <h3 className="text-lg font-semibold text-white flex items-center mb-4">
                  <IconTimeline size={20} className="mr-2 text-orange-400" />
                  Ligne du temps des records
                </h3>
                <RecordsTimeline records={gameRecords} />
              </div>

              {/* Tuiles d'infos */}
              <GamingTiles songId={song.id} />
              {/* Graphiques côte à côte */}
              <div className="grid grid-cols-12 gap-6">
                {/* Graphique Score multi-axes */}
                <GamingLineChart songId={song.id} />

                {/* Graphique à barres Score, combo & multiplicateur */}
                <div className="col-span-12 lg:col-span-6">
                  <BarChartWithNavigation
                    title="Score, combo & multiplicateur par mois"
                    icon={
                      <IconChartBar
                        size={20}
                        className="mr-2 text-orange-400"
                      />
                    }
                    intervals={gameBarIntervals}
                    bars={gameBars}
                    index={gameBarIndex}
                    onIndexChange={setGameBarIndex}
                    height={320}
                    themeColor="text-orange-400"
                    multiAxis={true}
                  />
                </div>
              </div>
              <RecentSessionsByMode
                songTitle={song.title}
                songComposer={song.composer || ''}
                mode="game"
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
