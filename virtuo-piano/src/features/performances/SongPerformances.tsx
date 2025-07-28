'use client';

import { useEffect, useState, useTransition } from 'react';
import { useSong } from '@/contexts/SongContext';
import { useRouter } from 'next/navigation';
import { castMsToMin, formatDuration } from '@/common/utils/function';
import {
  IconMusic,
  IconHeart,
  IconClock,
  IconChartBar,
  IconChevronRight,
  IconTrophy,
  IconTarget,
  IconFlame,
  IconMedal,
  IconTimeline,
  IconStar,
  IconBrain,
  IconFlame as IconFire,
} from '@tabler/icons-react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import React from 'react';
import styles from '../library/Song.module.css';
import { toggleFavorite } from '@/lib/actions/songs';
import DifficultyBadge from '@/components/DifficultyBadge';
import { toast } from 'react-hot-toast';
import { SongBasicData } from '@/lib/services/performances-services';
import { Spinner } from '@/components/ui/spinner';
import {
  useSongPerformanceGeneralTiles,
  useSongPracticeData,
  usePrefetchAdjacentData,
  useInvalidatePracticeCache,
} from '@/customHooks/useSongPerformances';
import * as Separator from '@radix-ui/react-separator';

// Composants extraits
import RecordsTimeline from './components/RecordsTimeline';
import InfoTile from './components/InfoTile';
import LineChartWithNavigation from './components/LineChartWithNavigation';
import BarChartWithNavigation from './components/BarChartWithNavigation';
import MultiAxisLineChart from './components/MultiAxisLineChart';
import ChartSummary from './components/ChartSummary';
import RecentSessionsByMode from './components/RecentSessionsByMode';

// Données et utilitaires
import {
  learningRecords,
  gameRecords,
  learningTiles,
  gameTiles,
  generateExtendedPrecisionData,
  generateExtendedPerformanceData,
  generateExtendedScoreData,
  learningBarIntervals,
  gameBarIntervals,
} from './data/performanceData';
import {
  defaultIntervalOptions,
  getDefaultIndex,
  sliceDataByInterval,
  calculateAverage,
  calculateAverageFixed,
} from './utils/chartUtils';

export default function SongPerformances({ song }: { song: SongBasicData }) {
  const { setCurrentSong } = useSong();
  const router = useRouter();
  const [isFavorite, setIsFavorite] = useState(song.isFavorite || false);
  const [isPending, startTransition] = useTransition();
  const [activeTab, setActiveTab] = useState<'apprentissage' | 'jeu'>(
    'apprentissage'
  );

  // États pour la navigation des intervalles de lignes
  const [precisionInterval, setPrecisionInterval] = useState(7);
  const [precisionIndex, setPrecisionIndex] = useState(0);
  const [performanceInterval, setPerformanceInterval] = useState(7);
  const [performanceIndex, setPerformanceIndex] = useState(0);
  const [scoreInterval, setScoreInterval] = useState(7);
  const [scoreIndex, setScoreIndex] = useState(0);
  const [practiceInterval, setPracticeInterval] = useState(7);
  const [practiceIndex, setPracticeIndex] = useState(0);

  // États pour la navigation des intervalles de barres
  const [learningBarIndex, setLearningBarIndex] = useState(0);
  const [gameBarIndex, setGameBarIndex] = useState(0);

  // Hooks React Query
  const {
    data: generalTilesResult,
    isLoading: generalTilesLoading,
    error: generalTilesError,
  } = useSongPerformanceGeneralTiles(song.id);

  const {
    data: practiceResult,
    isLoading: practiceLoading,
    error: practiceError,
  } = useSongPracticeData(song.id, practiceInterval, practiceIndex);

  const { prefetchAdjacent } = usePrefetchAdjacentData(
    song.id,
    practiceInterval,
    practiceIndex
  );

  const { invalidateCache } = useInvalidatePracticeCache();

  // Données étendues
  const extendedPrecisionData = generateExtendedPrecisionData();
  const extendedPerformanceData = generateExtendedPerformanceData();
  const extendedScoreData = generateExtendedScoreData();

  useEffect(() => {
    setCurrentSong(song);
    return () => setCurrentSong(null);
  }, [song, setCurrentSong]);

  // Précharger les données adjacentes quand les données changent
  useEffect(() => {
    if (practiceResult?.data) {
      prefetchAdjacent();
    }
  }, [practiceResult?.data, prefetchAdjacent]);

  // Initialiser les indices par défaut
  useEffect(() => {
    setPrecisionIndex(
      getDefaultIndex(extendedPrecisionData.length, precisionInterval)
    );
    setPerformanceIndex(
      getDefaultIndex(extendedPerformanceData.length, performanceInterval)
    );
    setScoreIndex(getDefaultIndex(extendedScoreData.length, scoreInterval));
    // Pas besoin d'initialiser practiceIndex car il est géré par le serveur
  }, []);

  // Fonctions pour obtenir les données par intervalles
  const getPracticeData = () => {
    if (!practiceResult?.data?.current?.data) {
      return [];
    }
    return practiceResult.data.current.data;
  };
  const getPrecisionData = () =>
    sliceDataByInterval(
      extendedPrecisionData,
      precisionIndex,
      precisionInterval
    );
  const getPerformanceData = () =>
    sliceDataByInterval(
      extendedPerformanceData,
      performanceIndex,
      performanceInterval
    );
  const getScoreData = () =>
    sliceDataByInterval(extendedScoreData, scoreIndex, scoreInterval);

  // Calculs des totaux et moyennes
  const practiceData = getPracticeData();
  const currentData = practiceResult?.data?.current;

  const totalPratique =
    currentData?.totalPratique ||
    practiceData.reduce(
      (sum: number, item: any) => sum + (item.pratique || 0),
      0
    );
  const totalModeJeu =
    currentData?.totalModeJeu ||
    practiceData.reduce(
      (sum: number, item: any) => sum + (item.modeJeu || 0),
      0
    );
  const totalModeApprentissage =
    currentData?.totalModeApprentissage ||
    practiceData.reduce(
      (sum: number, item: any) => sum + (item.modeApprentissage || 0),
      0
    );

  const avgPrecisionDeux = calculateAverage(getPrecisionData(), 'deux');
  const avgPrecisionDroite = calculateAverage(getPrecisionData(), 'droite');
  const avgPrecisionGauche = calculateAverage(getPrecisionData(), 'gauche');

  const avgPerformanceDeux = calculateAverage(getPerformanceData(), 'deux');
  const avgPerformanceDroite = calculateAverage(getPerformanceData(), 'droite');
  const avgPerformanceGauche = calculateAverage(getPerformanceData(), 'gauche');

  const avgScore = calculateAverage(getScoreData(), 'score');
  const avgCombo = calculateAverage(getScoreData(), 'combo');
  const avgMulti = calculateAverageFixed(getScoreData(), 'multi');

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

  // Fonction pour obtenir l'icône correspondant au nom d'icône
  const getIconComponent = (iconName: string, iconColor: string) => {
    const iconMap: Record<string, React.ComponentType<any>> = {
      IconClock,
      IconTarget,
      IconStar,
      IconFlame,
      IconFire,
      IconChartBar,
      IconTrophy,
    };
    const IconComponent = iconMap[iconName];
    return IconComponent ? (
      <IconComponent size={20} className={iconColor} />
    ) : null;
  };

  // Configuration des lignes pour les graphiques
  const precisionLines = [
    { dataKey: 'deux', color: '#f59e0b', name: 'Deux mains', strokeWidth: 3 },
    {
      dataKey: 'droite',
      color: '#6366f1',
      name: 'Main droite',
      strokeDasharray: '5 5',
    },
    {
      dataKey: 'gauche',
      color: '#10b981',
      name: 'Main gauche',
      strokeDasharray: '10 5',
    },
  ];

  const performanceLines = [
    { dataKey: 'deux', color: '#f59e0b', name: 'Deux mains', strokeWidth: 3 },
    {
      dataKey: 'droite',
      color: '#6366f1',
      name: 'Main droite',
      strokeDasharray: '5 5',
    },
    {
      dataKey: 'gauche',
      color: '#10b981',
      name: 'Main gauche',
      strokeDasharray: '10 5',
    },
  ];

  const scoreLines = [
    { dataKey: 'score', color: '#6366f1', name: 'Score', yAxisId: 'score' },
    {
      dataKey: 'combo',
      color: '#f59e0b',
      name: 'Combo max',
      yAxisId: 'combo',
      strokeDasharray: '10 5',
    },
    {
      dataKey: 'multi',
      color: '#10b981',
      name: 'Multiplicateur max',
      yAxisId: 'multi',
      strokeDasharray: '5 5',
    },
  ];

  // Configuration des barres pour les graphiques
  const learningBars = [
    { dataKey: 'precision', color: '#6366f1', name: 'Précision' },
    { dataKey: 'performance', color: '#f59e0b', name: 'Performance' },
  ];

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
          <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10 col-span-1 md:col-span-2 lg:col-span-2 row-span-2">
            <div className="h-full flex flex-col">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-white">
                  Statistiques de pratique
                </h2>
                <div className="flex flex-col items-center mb-2">
                  <div className="flex items-center justify-center space-x-4 mb-2">
                    <button
                      onClick={() => setPracticeIndex(practiceIndex + 1)}
                      disabled={practiceLoading || practiceIndex >= 10} // Limite à 10 intervalles en arrière
                      className="p-2 rounded-full hover:bg-white/10 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <IconChevronRight
                        size={20}
                        className="text-indigo-400 rotate-180"
                      />
                    </button>
                    <select
                      value={practiceInterval}
                      onChange={(e) => {
                        const newInterval = Number(e.target.value);
                        setPracticeInterval(newInterval);
                        setPracticeIndex(0); // Reset à l'index 0 quand on change l'intervalle
                        // Invalider le cache pour forcer le rechargement avec le nouvel intervalle
                        invalidateCache(song.id);
                      }}
                      disabled={practiceLoading}
                      className="bg-white/10 text-white text-sm rounded px-3 py-2 border border-white/20 min-w-[140px] disabled:opacity-50"
                    >
                      {defaultIntervalOptions.map((option) => (
                        <option
                          key={option.value}
                          value={option.value}
                          className="bg-slate-800"
                        >
                          {option.label}
                        </option>
                      ))}
                    </select>
                    <button
                      onClick={() =>
                        setPracticeIndex(Math.max(0, practiceIndex - 1))
                      }
                      disabled={practiceIndex === 0}
                      className="p-2 rounded-full hover:bg-white/10 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <IconChevronRight size={20} className="text-indigo-400" />
                    </button>
                  </div>
                </div>
              </div>

              {practiceLoading ? (
                <div className="flex items-center justify-center h-[250px]">
                  <Spinner variant="bars" size={32} className="text-white" />
                </div>
              ) : practiceError ? (
                <div className="flex items-center justify-center h-[250px]">
                  <div className="text-center text-red-400 text-sm">
                    {practiceError.message || 'Erreur lors du chargement'}
                  </div>
                </div>
              ) : (
                <ResponsiveContainer width="100%" height={250}>
                  <LineChart
                    data={practiceData}
                    margin={{ top: 10, right: 30, left: -20, bottom: 0 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                    <XAxis
                      dataKey="name"
                      tick={{ fontSize: 12, fill: '#94a3b8' }}
                    />
                    <YAxis tick={{ fontSize: 12, fill: '#94a3b8' }} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#1e293b',
                        border: 'none',
                        borderRadius: '8px',
                        fontSize: '12px',
                      }}
                      itemStyle={{ color: '#e2e8f0' }}
                      labelStyle={{
                        color: '#e2e8f0',
                        fontWeight: 'bold',
                        marginBottom: '4px',
                      }}
                      formatter={(value, name) => {
                        const nameMap: Record<string, string> = {
                          pratique: 'Temps de pratique total',
                          modeJeu: 'Mode jeu',
                          modeApprentissage: 'Mode apprentissage',
                        };
                        return [
                          `${value} min`,
                          nameMap[name as string] || name,
                        ];
                      }}
                    />
                    <Line
                      type="monotone"
                      dataKey="pratique"
                      stroke="#6366f1"
                      strokeWidth={3}
                      dot={{ r: 4, fill: '#6366f1', strokeWidth: 0 }}
                      activeDot={{ r: 6, fill: '#818cf8', strokeWidth: 0 }}
                    />
                    <Line
                      type="monotone"
                      dataKey="modeJeu"
                      stroke="#f59e0b"
                      strokeWidth={2}
                      strokeDasharray="5 5"
                      dot={{ r: 3, fill: '#f59e0b', strokeWidth: 0 }}
                      activeDot={{ r: 5, fill: '#fbbf24', strokeWidth: 0 }}
                    />
                    <Line
                      type="monotone"
                      dataKey="modeApprentissage"
                      stroke="#10b981"
                      strokeWidth={2}
                      strokeDasharray="10 5"
                      dot={{ r: 3, fill: '#10b981', strokeWidth: 0 }}
                      activeDot={{ r: 5, fill: '#34d399', strokeWidth: 0 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              )}

              <Separator.Root className="h-px bg-slate-500 dark:bg-slate-800 my-4" />

              {/* Légende */}
              <div className="flex items-center justify-between flex-wrap gap-4 mb-4">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center">
                    <div className="w-4 h-2 bg-indigo-500 mr-2 rounded"></div>
                    <span className="text-xs text-slate-400 dark:text-slate-200">
                      Pratique
                    </span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-4 h-2 bg-amber-500 mr-2 rounded"></div>
                    <span className="text-xs text-slate-400 dark:text-slate-200">
                      Mode jeu
                    </span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-4 h-2 bg-green-500 mr-2 rounded"></div>
                    <span className="text-xs text-slate-400 dark:text-slate-200">
                      Mode apprentissage
                    </span>
                  </div>
                </div>
              </div>

              <ChartSummary
                title=""
                items={[
                  {
                    label: 'Pratique totale',
                    value: formatDuration(totalPratique, true),
                    color: 'text-indigo-600 dark:text-indigo-400',
                  },
                  {
                    label: 'Mode jeu',
                    value: formatDuration(totalModeJeu, true),
                    color: 'text-amber-500 dark:text-amber-400',
                  },
                  {
                    label: 'Mode apprentissage',
                    value: formatDuration(totalModeApprentissage, true),
                    color: 'text-green-500 dark:text-green-400',
                  },
                ]}
              />
            </div>
          </div>

          {/* Tuiles d'informations */}
          <InfoTile
            icon={
              generalTilesLoading ? (
                <Spinner variant="bars" size={20} className="text-white" />
              ) : (
                <IconChartBar
                  size={20}
                  className="text-blue-600 dark:text-blue-400"
                />
              )
            }
            value={
              generalTilesLoading
                ? ''
                : generalTilesError
                ? 'Erreur'
                : generalTilesResult?.data?.totalSessions.toString() || '0'
            }
            label="Sessions jouées"
          />
          <InfoTile
            icon={
              generalTilesLoading ? (
                <Spinner variant="bars" size={20} className="text-white" />
              ) : (
                <IconClock
                  size={20}
                  className="text-purple-600 dark:text-purple-400"
                />
              )
            }
            value={
              generalTilesLoading
                ? ''
                : generalTilesError
                ? 'Erreur'
                : generalTilesResult?.data
                ? formatDuration(
                    generalTilesResult.data.totalTimeInMinutes,
                    true
                  )
                : '0 min'
            }
            label="Temps total"
          />
          <InfoTile
            icon={
              generalTilesLoading ? (
                <Spinner variant="bars" size={20} className="text-white" />
              ) : (
                <IconFlame
                  size={20}
                  className="text-orange-600 dark:text-orange-400"
                />
              )
            }
            value={
              generalTilesLoading
                ? ''
                : generalTilesError
                ? 'Erreur'
                : generalTilesResult?.data?.currentStreak.toString() || '0'
            }
            label="Jours consécutifs"
          />
          <InfoTile
            icon={
              generalTilesLoading ? (
                <Spinner variant="bars" size={20} className="text-white" />
              ) : (
                <IconMedal
                  size={20}
                  className="text-pink-600 dark:text-pink-400"
                />
              )
            }
            value={
              generalTilesLoading
                ? ''
                : generalTilesError
                ? 'Erreur'
                : generalTilesResult?.data?.globalRanking
                ? `#${generalTilesResult.data.globalRanking}`
                : 'N/A'
            }
            label="Classement global"
          />
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
                <div className="col-span-12 lg:col-span-5">
                  <div className="grid grid-cols-2 gap-4 h-full">
                    {learningTiles.map((tile, idx) => (
                      <InfoTile
                        key={idx}
                        icon={getIconComponent(tile.iconName, tile.iconColor)}
                        value={tile.value}
                        label={tile.label}
                      />
                    ))}
                  </div>
                </div>

                {/* Graphique Précision */}
                <div className="col-span-12 lg:col-span-7">
                  <LineChartWithNavigation
                    title="Précision par session"
                    icon={
                      <IconTarget size={20} className="mr-2 text-green-400" />
                    }
                    data={getPrecisionData()}
                    lines={precisionLines}
                    interval={precisionInterval}
                    index={precisionIndex}
                    onIntervalChange={setPrecisionInterval}
                    onIndexChange={setPrecisionIndex}
                    maxDataLength={extendedPrecisionData.length}
                    themeColor="text-green-400"
                    intervalOptions={defaultIntervalOptions}
                    summary={
                      <ChartSummary
                        title="Précisions moyennes"
                        items={[
                          {
                            label: 'Deux mains',
                            value: `${avgPrecisionDeux}%`,
                            color: 'text-amber-500 dark:text-amber-400',
                          },
                          {
                            label: 'Main droite',
                            value: `${avgPrecisionDroite}%`,
                            color: 'text-indigo-600 dark:text-indigo-400',
                          },
                          {
                            label: 'Main gauche',
                            value: `${avgPrecisionGauche}%`,
                            color: 'text-green-500 dark:text-green-400',
                          },
                        ]}
                      />
                    }
                  />
                </div>
              </div>

              {/* Graphique Performance et graphique en barres */}
              <div className="grid grid-cols-12 gap-6">
                <div className="col-span-12 lg:col-span-7">
                  <LineChartWithNavigation
                    title="Performance par session"
                    icon={<IconStar size={20} className="mr-2 text-pink-400" />}
                    data={getPerformanceData()}
                    lines={performanceLines}
                    interval={performanceInterval}
                    index={performanceIndex}
                    onIntervalChange={setPerformanceInterval}
                    onIndexChange={setPerformanceIndex}
                    maxDataLength={extendedPerformanceData.length}
                    themeColor="text-pink-400"
                    intervalOptions={defaultIntervalOptions}
                    summary={
                      <ChartSummary
                        title="Performances moyennes"
                        items={[
                          {
                            label: 'Deux mains',
                            value: `${avgPerformanceDeux}%`,
                            color: 'text-amber-500 dark:text-amber-400',
                          },
                          {
                            label: 'Main droite',
                            value: `${avgPerformanceDroite}%`,
                            color: 'text-indigo-600 dark:text-indigo-400',
                          },
                          {
                            label: 'Main gauche',
                            value: `${avgPerformanceGauche}%`,
                            color: 'text-green-500 dark:text-green-400',
                          },
                        ]}
                      />
                    }
                  />
                </div>

                {/* Graphique à barres Précision & Performance */}
                <div className="col-span-12 lg:col-span-5">
                  <BarChartWithNavigation
                    title="Précision & Performance par mois"
                    icon={
                      <IconChartBar
                        size={20}
                        className="mr-2 text-indigo-400"
                      />
                    }
                    intervals={learningBarIntervals}
                    bars={learningBars}
                    index={learningBarIndex}
                    onIndexChange={setLearningBarIndex}
                    themeColor="text-indigo-400"
                    yAxisDomain={[70, 100]}
                  />
                </div>
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
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
                {gameTiles.map((tile, idx) => (
                  <InfoTile
                    key={idx}
                    icon={getIconComponent(tile.iconName, tile.iconColor)}
                    value={tile.value}
                    label={tile.label}
                  />
                ))}
              </div>

              {/* Graphiques côte à côte */}
              <div className="grid grid-cols-12 gap-6">
                {/* Graphique Score multi-axes */}
                <div className="col-span-12 lg:col-span-6">
                  <MultiAxisLineChart
                    title="Score par session"
                    icon={
                      <IconTrophy size={20} className="mr-2 text-yellow-400" />
                    }
                    data={getScoreData()}
                    lines={scoreLines}
                    interval={scoreInterval}
                    index={scoreIndex}
                    onIntervalChange={setScoreInterval}
                    onIndexChange={setScoreIndex}
                    maxDataLength={extendedScoreData.length}
                    height={280}
                    themeColor="text-yellow-400"
                    intervalOptions={defaultIntervalOptions}
                    summary={
                      <ChartSummary
                        title="Moyennes sur la période"
                        items={[
                          {
                            label: 'Score',
                            value: avgScore,
                            color: 'text-indigo-600 dark:text-indigo-400',
                          },
                          {
                            label: 'Combo',
                            value: avgCombo,
                            color: 'text-amber-500 dark:text-amber-400',
                          },
                          {
                            label: 'Multiplicateur',
                            value: `x${avgMulti}`,
                            color: 'text-green-500 dark:text-green-400',
                          },
                        ]}
                      />
                    }
                  />
                </div>

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
