'use client';

import React, { useState, useRef, useEffect } from 'react';
import {
  IconMusic,
  IconUpload,
  IconFileMusic,
  IconSearch,
  IconFilter,
  IconPlayerPlay,
  IconTrash,
  IconEdit,
  IconHeart,
  IconInfoCircle,
  IconX,
  IconCheck,
  IconCloudUpload,
  IconFileImport,
  IconDownload,
  IconAnalyze,
  IconAlertTriangle,
  IconArrowsShuffle,
  IconListCheck,
  IconFileZip,
  IconMusicOff,
  IconChevronRight,
  IconRobot,
  IconWand,
  IconSettings,
  IconDeviceGamepad,
  IconBrain,
  IconEqual,
  IconPiano,
  IconLayoutGrid,
  IconWaveSine,
  IconVersions,
  IconSettings2,
  IconBolt,
  IconTargetArrow,
  IconArrowNarrowRight,
  IconArrowsExchange,
  IconCalendarTime,
  IconMoodHappy,
  IconMoodSad,
  IconAward,
  IconLibrary,
  IconStars,
  IconBookmark,
  IconChartPie,
  IconCpu,
  IconTimeline,
  IconEye,
  IconEyeOff,
  IconVolume,
  IconVolumeOff,
  IconPlaylist,
  IconSortAscending,
  IconSortDescending,
  IconMoodNeutral,
  IconMoodSmile,
  IconRadar,
  IconPlus,
  IconChevronLeft,
  IconUsers,
  IconShare,
  IconMessageCircle,
  IconMicrophone,
  IconSparkles,
  IconPencil,
  IconBrush,
  IconCards,
  IconTextRecognition,
  IconHistory,
  IconArrowBackUp,
  IconArrowForwardUp,
  IconGitBranch,
  IconGitCommit,
  IconGitMerge,
  IconCloudComputing,
  IconMathFunction,
} from '@tabler/icons-react';
import * as Tabs from '@radix-ui/react-tabs';
import * as Dialog from '@radix-ui/react-dialog';
import * as Progress from '@radix-ui/react-progress';

// Types pour les imports de musique
interface ImportedSong {
  id: string;
  title: string;
  composer?: string;
  genre?: string;
  tempo: number;
  duration_ms: number;
  timeSignature: string;
  level: number;
  key: string;
  importedAt: string;
  thumbnail?: string;
  analyzed: boolean;
  status: 'ready' | 'processing' | 'error';
  format: 'midi' | 'musicxml' | 'mp3' | 'other';
  fileSize: number;
}

// État de l'analyse pour les nouveaux imports
interface AnalysisState {
  notesDetected: number;
  tempoDetected: number | null;
  keyDetected: string | null;
  progressPercent: number;
  status: 'idle' | 'analyzing' | 'complete' | 'error';
  error?: string;
}

// Données fictives pour les imports
const demoImports: ImportedSong[] = [
  {
    id: '1',
    title: 'Clair de Lune',
    composer: 'Claude Debussy',
    genre: 'Classique',
    tempo: 72,
    duration_ms: 320000,
    timeSignature: '4/4',
    level: 3,
    key: 'C Major',
    importedAt: 'Il y a 2 jours',
    thumbnail: '/images/songs/clairdelune.jpg',
    analyzed: true,
    status: 'ready',
    format: 'midi',
    fileSize: 45000,
  },
  {
    id: '2',
    title: 'Nocturne Op. 9 No. 2',
    composer: 'Frédéric Chopin',
    genre: 'Classique',
    tempo: 110,
    duration_ms: 270000,
    timeSignature: '4/4',
    level: 4,
    key: 'E♭ Major',
    importedAt: 'Il y a 1 semaine',
    thumbnail: '/images/songs/nocturne.jpg',
    analyzed: true,
    status: 'ready',
    format: 'musicxml',
    fileSize: 78000,
  },
  {
    id: '3',
    title: 'Chanson sans nom',
    composer: 'Inconnu',
    genre: 'Pop',
    tempo: 120,
    duration_ms: 180000,
    timeSignature: '4/4',
    level: 2,
    key: 'Inconnu',
    importedAt: "Aujourd'hui",
    analyzed: false,
    status: 'processing',
    format: 'mp3',
    fileSize: 3500000,
  },
  {
    id: '4',
    title: 'Improvisation #1',
    tempo: 90,
    duration_ms: 125000,
    timeSignature: '3/4',
    level: 2,
    key: 'A Minor',
    importedAt: 'Il y a 3 jours',
    analyzed: true,
    status: 'ready',
    format: 'midi',
    fileSize: 32000,
  },
  {
    id: '5',
    title: 'Sonate au Clair de Lune (1er mvt)',
    composer: 'Ludwig van Beethoven',
    genre: 'Classique',
    tempo: 60,
    duration_ms: 330000,
    timeSignature: '4/4',
    level: 4,
    key: 'C# Minor',
    importedAt: 'Il y a 2 semaines',
    thumbnail: '/images/songs/moonlight.jpg',
    analyzed: true,
    status: 'ready',
    format: 'musicxml',
    fileSize: 67000,
  },
  {
    id: '6',
    title: 'Fichier corrompu',
    tempo: 0,
    duration_ms: 0,
    timeSignature: '?',
    level: 1,
    key: 'Inconnu',
    importedAt: 'Il y a 5 jours',
    analyzed: false,
    status: 'error',
    format: 'other',
    fileSize: 12000,
  },
];

// Formats acceptés pour l'import
const acceptedFormats = [
  { extension: '.mid', name: 'MIDI', icon: <IconFileMusic size={20} /> },
  {
    extension: '.musicxml',
    name: 'MusicXML',
    icon: <IconFileMusic size={20} />,
  },
  {
    extension: '.mp3',
    name: 'MP3 (expérimental)',
    icon: <IconFileMusic size={20} />,
  },
  {
    extension: '.wav',
    name: 'WAV (expérimental)',
    icon: <IconFileMusic size={20} />,
  },
  {
    extension: '.zip',
    name: 'ZIP (collection)',
    icon: <IconFileZip size={20} />,
  },
];

// Fonction pour formater la taille des fichiers
function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} o`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} Ko`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} Mo`;
}

// Fonction pour déterminer l'icône de format
function getFormatIcon(format: ImportedSong['format']) {
  switch (format) {
    case 'midi':
      return <IconFileMusic className="text-indigo-500" />;
    case 'musicxml':
      return <IconFileMusic className="text-emerald-500" />;
    case 'mp3':
      return <IconFileMusic className="text-amber-500" />;
    default:
      return <IconFileMusic className="text-slate-500" />;
  }
}

// Fonction pour déterminer l'icône et la couleur d'état
function getStatusInfo(status: ImportedSong['status']) {
  switch (status) {
    case 'ready':
      return {
        icon: <IconCheck size={16} />,
        text: 'Prêt',
        colorClass:
          'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400',
      };
    case 'processing':
      return {
        icon: <IconAnalyze size={16} />,
        text: "En cours d'analyse",
        colorClass:
          'bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400',
      };
    case 'error':
      return {
        icon: <IconAlertTriangle size={16} />,
        text: 'Erreur',
        colorClass:
          'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400',
      };
    default:
      return {
        icon: <IconInfoCircle size={16} />,
        text: 'Inconnu',
        colorClass:
          'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400',
      };
  }
}

// Composant pour la carte d'un import de musique
function ImportCard({ song }: { song: ImportedSong }) {
  const statusInfo = getStatusInfo(song.status);

  return (
    <div
      className={`bg-white dark:bg-slate-800 shadow-sm rounded-xl p-4 border ${
        song.status === 'ready'
          ? 'border-emerald-200 dark:border-emerald-900/30'
          : song.status === 'processing'
          ? 'border-amber-200 dark:border-amber-900/30'
          : 'border-red-200 dark:border-red-900/30'
      } hover:shadow-md transition-shadow`}
    >
      <div className="flex items-start">
        <div className="flex-shrink-0 w-14 h-14 rounded-lg overflow-hidden bg-slate-100 dark:bg-slate-700 mr-3">
          {song.thumbnail ? (
            <img
              src={song.thumbnail}
              alt={song.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              {getFormatIcon(song.format)}
            </div>
          )}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-1">
            <h3 className="text-sm font-medium text-slate-900 dark:text-white truncate pr-2">
              {song.title}
            </h3>
            <div
              className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${statusInfo.colorClass}`}
            >
              {statusInfo.icon}
              <span className="ml-1">{statusInfo.text}</span>
            </div>
          </div>

          {song.composer && (
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1.5">
              {song.composer}
            </p>
          )}

          <div className="flex items-center mb-2 text-xs text-slate-500 dark:text-slate-400">
            <span className="inline-flex items-center mr-3">
              <IconMusic size={14} className="mr-1" />
              {song.key}
            </span>
            <span className="inline-flex items-center">
              {formatFileSize(song.fileSize)}
            </span>
          </div>

          <div className="flex items-center justify-between mb-2 text-xs">
            <span className="text-slate-500 dark:text-slate-400">
              Importé {song.importedAt}
            </span>
          </div>
        </div>
      </div>

      <div className="mt-3 grid grid-cols-4 gap-2">
        <button
          disabled={song.status !== 'ready'}
          className={`flex items-center justify-center p-2 rounded ${
            song.status === 'ready'
              ? 'bg-indigo-100 text-indigo-600 hover:bg-indigo-200 dark:bg-indigo-900/30 dark:text-indigo-400 dark:hover:bg-indigo-900/40'
              : 'bg-slate-100 text-slate-400 cursor-not-allowed dark:bg-slate-700/40 dark:text-slate-500'
          }`}
        >
          <IconPlayerPlay size={18} />
        </button>
        <button
          disabled={song.status !== 'ready'}
          className={`flex items-center justify-center p-2 rounded ${
            song.status === 'ready'
              ? 'bg-amber-100 text-amber-600 hover:bg-amber-200 dark:bg-amber-900/30 dark:text-amber-400 dark:hover:bg-amber-900/40'
              : 'bg-slate-100 text-slate-400 cursor-not-allowed dark:bg-slate-700/40 dark:text-slate-500'
          }`}
        >
          <IconEdit size={18} />
        </button>
        <button
          disabled={song.status !== 'ready'}
          className={`flex items-center justify-center p-2 rounded ${
            song.status === 'ready'
              ? 'bg-emerald-100 text-emerald-600 hover:bg-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-400 dark:hover:bg-emerald-900/40'
              : 'bg-slate-100 text-slate-400 cursor-not-allowed dark:bg-slate-700/40 dark:text-slate-500'
          }`}
        >
          <IconHeart size={18} />
        </button>
        <button className="flex items-center justify-center p-2 rounded bg-red-100 text-red-600 hover:bg-red-200 dark:bg-red-900/30 dark:text-red-400 dark:hover:bg-red-900/40">
          <IconTrash size={18} />
        </button>
      </div>
    </div>
  );
}

// Composant pour la zone de drop de fichiers
function DropZone({
  onAnalysis,
}: {
  onAnalysis: (state: AnalysisState) => void;
}) {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFiles(files);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFiles(e.target.files);
    }
  };

  const handleFiles = (files: FileList) => {
    setIsUploading(true);

    // Simuler un téléchargement
    let progress = 0;
    const interval = setInterval(() => {
      progress += 5;
      setUploadProgress(progress);

      if (progress >= 100) {
        clearInterval(interval);
        setIsUploading(false);

        // Simuler le début de l'analyse
        onAnalysis({
          notesDetected: 0,
          tempoDetected: null,
          keyDetected: null,
          progressPercent: 0,
          status: 'analyzing',
        });
      }
    }, 100);
  };

  return (
    <div
      className={`w-full p-8 border-2 border-dashed rounded-xl text-center transition-colors ${
        isDragging
          ? 'border-indigo-400 bg-indigo-50 dark:border-indigo-500 dark:bg-indigo-950/20'
          : 'border-slate-300 hover:border-indigo-300 dark:border-slate-700 dark:hover:border-indigo-700'
      }`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
        accept=".mid,.midi,.musicxml,.mp3,.wav,.zip"
        multiple
      />

      {isUploading ? (
        <div className="space-y-4">
          <div className="flex justify-center">
            <IconCloudUpload
              size={48}
              className="text-indigo-500 dark:text-indigo-400 animate-pulse"
            />
          </div>
          <div className="text-slate-700 dark:text-slate-300 font-medium">
            Téléchargement en cours...
          </div>
          <div className="w-full max-w-md mx-auto">
            <Progress.Root
              className="relative overflow-hidden bg-slate-200 dark:bg-slate-700 rounded-full w-full h-3"
              value={uploadProgress}
            >
              <Progress.Indicator
                className="h-full bg-indigo-500 transition-transform duration-300 ease-in-out rounded-full"
                style={{ transform: `translateX(-${100 - uploadProgress}%)` }}
              />
            </Progress.Root>
            <div className="text-right text-xs text-slate-500 dark:text-slate-400 mt-1">
              {uploadProgress}%
            </div>
          </div>
        </div>
      ) : (
        <div>
          <div className="flex justify-center mb-4">
            <IconUpload
              size={48}
              className="text-slate-400 dark:text-slate-500"
            />
          </div>
          <h3 className="text-lg font-semibold text-slate-700 dark:text-slate-300 mb-2">
            Déposez vos fichiers ici
          </h3>
          <p className="text-slate-500 dark:text-slate-400 mb-4 max-w-md mx-auto">
            Glissez-déposez vos fichiers ou cliquez pour sélectionner les
            fichiers à importer
          </p>
          <button
            onClick={() => fileInputRef.current?.click()}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium transition-colors"
          >
            Sélectionner des fichiers
          </button>

          <div className="mt-6">
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-2">
              Formats acceptés:
            </p>
            <div className="flex flex-wrap justify-center gap-2">
              {acceptedFormats.map((format) => (
                <div
                  key={format.extension}
                  className="inline-flex items-center px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs"
                >
                  {format.icon}
                  <span className="ml-1">{format.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Composant pour l'analyse des fichiers
function AnalysisViewer({
  state,
  onComplete,
}: {
  state: AnalysisState;
  onComplete: () => void;
}) {
  // Simuler la progression de l'analyse
  React.useEffect(() => {
    if (state.status === 'analyzing') {
      let progress = 0;
      let detectedNotes = 0;

      const interval = setInterval(() => {
        progress += 5;
        detectedNotes += Math.floor(Math.random() * 10);

        // Mise à jour progressive de l'état
        if (progress >= 100) {
          clearInterval(interval);
          onComplete();
        }
      }, 200);

      return () => clearInterval(interval);
    }
  }, [state.status, onComplete]);

  if (state.status === 'idle') {
    return null;
  }

  if (state.status === 'error') {
    return (
      <div className="p-6 bg-red-50 dark:bg-red-900/20 rounded-xl">
        <div className="flex items-center text-red-600 dark:text-red-400 mb-4">
          <IconAlertTriangle size={24} className="mr-2" />
          <h3 className="text-lg font-semibold">Erreur d'analyse</h3>
        </div>
        <p className="text-slate-700 dark:text-slate-300 mb-4">
          {state.error ||
            "Une erreur s'est produite lors de l'analyse du fichier."}
        </p>
        <button
          onClick={onComplete}
          className="px-4 py-2 bg-slate-600 hover:bg-slate-700 text-white rounded-lg font-medium transition-colors"
        >
          Fermer
        </button>
      </div>
    );
  }

  return (
    <div className="p-6 bg-indigo-50 dark:bg-indigo-950/20 rounded-xl">
      <div className="flex items-center text-indigo-600 dark:text-indigo-400 mb-4">
        <IconAnalyze size={24} className="mr-2" />
        <h3 className="text-lg font-semibold">
          {state.status === 'analyzing'
            ? 'Analyse en cours...'
            : 'Analyse terminée'}
        </h3>
      </div>

      <div className="space-y-4 mb-6">
        <div>
          <div className="flex justify-between items-center mb-1">
            <span className="text-sm text-slate-600 dark:text-slate-400">
              Progression
            </span>
            <span className="text-sm text-slate-700 dark:text-slate-300 font-medium">
              {state.progressPercent}%
            </span>
          </div>
          <Progress.Root
            className="relative overflow-hidden bg-slate-200 dark:bg-slate-700 rounded-full w-full h-2"
            value={state.progressPercent}
          >
            <Progress.Indicator
              className="h-full bg-indigo-500 transition-transform duration-300 ease-in-out rounded-full"
              style={{
                transform: `translateX(-${100 - state.progressPercent}%)`,
              }}
            />
          </Progress.Root>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white dark:bg-slate-800 p-3 rounded-lg shadow-sm">
            <div className="text-xs text-slate-500 dark:text-slate-400">
              Notes détectées
            </div>
            <div className="text-lg font-semibold text-slate-900 dark:text-white">
              {state.notesDetected || 'En attente...'}
            </div>
          </div>

          <div className="bg-white dark:bg-slate-800 p-3 rounded-lg shadow-sm">
            <div className="text-xs text-slate-500 dark:text-slate-400">
              Tempo détecté
            </div>
            <div className="text-lg font-semibold text-slate-900 dark:text-white">
              {state.tempoDetected
                ? `${state.tempoDetected} BPM`
                : 'En attente...'}
            </div>
          </div>

          <div className="bg-white dark:bg-slate-800 p-3 rounded-lg shadow-sm">
            <div className="text-xs text-slate-500 dark:text-slate-400">
              Tonalité détectée
            </div>
            <div className="text-lg font-semibold text-slate-900 dark:text-white">
              {state.keyDetected || 'En attente...'}
            </div>
          </div>

          <div className="bg-white dark:bg-slate-800 p-3 rounded-lg shadow-sm">
            <div className="text-xs text-slate-500 dark:text-slate-400">
              Statut
            </div>
            <div className="text-lg font-semibold text-slate-900 dark:text-white">
              {state.status === 'analyzing' ? 'En cours' : 'Terminé'}
            </div>
          </div>
        </div>
      </div>

      {state.status === 'complete' && (
        <button
          onClick={onComplete}
          className="w-full px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium transition-colors"
        >
          Terminer
        </button>
      )}
    </div>
  );
}

// Composant pour afficher les statistiques d'import
function ImportStats({ imports }: { imports: ImportedSong[] }) {
  // Calculer les statistiques
  const totalImports = imports.length;
  const readyImports = imports.filter((i) => i.status === 'ready').length;
  const processingImports = imports.filter(
    (i) => i.status === 'processing'
  ).length;
  const errorImports = imports.filter((i) => i.status === 'error').length;

  // Formats
  const midiCount = imports.filter((i) => i.format === 'midi').length;
  const musicXmlCount = imports.filter((i) => i.format === 'musicxml').length;
  const mp3Count = imports.filter((i) => i.format === 'mp3').length;
  const otherCount = imports.filter((i) => i.format === 'other').length;

  // Tailles
  const totalSize = imports.reduce((acc, song) => acc + song.fileSize, 0);

  // Répartition par genre
  const genres = imports.reduce((acc, song) => {
    if (song.genre) {
      acc[song.genre] = (acc[song.genre] || 0) + 1;
    }
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
      <div className="bg-white dark:bg-slate-800 rounded-xl p-4 border border-slate-200 dark:border-slate-700">
        <div className="flex items-center mb-1 text-indigo-500 dark:text-indigo-400">
          <IconListCheck size={18} className="mr-2" />
          <h3 className="text-sm font-medium text-slate-500 dark:text-slate-400">
            Total des imports
          </h3>
        </div>
        <div className="text-2xl font-bold text-slate-900 dark:text-white">
          {totalImports}
        </div>
        <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          {formatFileSize(totalSize)} au total
        </div>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-xl p-4 border border-slate-200 dark:border-slate-700">
        <div className="flex items-center mb-1 text-emerald-500 dark:text-emerald-400">
          <IconCheck size={18} className="mr-2" />
          <h3 className="text-sm font-medium text-slate-500 dark:text-slate-400">
            Prêts à jouer
          </h3>
        </div>
        <div className="text-2xl font-bold text-slate-900 dark:text-white">
          {readyImports}
        </div>
        <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          {Math.round((readyImports / totalImports) * 100)}% de vos imports
        </div>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-xl p-4 border border-slate-200 dark:border-slate-700">
        <div className="flex items-center mb-1 text-amber-500 dark:text-amber-400">
          <IconAnalyze size={18} className="mr-2" />
          <h3 className="text-sm font-medium text-slate-500 dark:text-slate-400">
            En cours d'analyse
          </h3>
        </div>
        <div className="text-2xl font-bold text-slate-900 dark:text-white">
          {processingImports}
        </div>
        <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Temps d'analyse estimé: {processingImports * 2} min
        </div>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-xl p-4 border border-slate-200 dark:border-slate-700">
        <div className="flex items-center mb-1 text-red-500 dark:text-red-400">
          <IconAlertTriangle size={18} className="mr-2" />
          <h3 className="text-sm font-medium text-slate-500 dark:text-slate-400">
            Erreurs
          </h3>
        </div>
        <div className="text-2xl font-bold text-slate-900 dark:text-white">
          {errorImports}
        </div>
        <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          {errorImports > 0 ? 'Vérifiez les problèmes' : 'Aucune erreur 👍'}
        </div>
      </div>
    </div>
  );
}

// Composant pour les conseils d'importation
function ImportTips() {
  const tips = [
    {
      title: 'Formats MIDI',
      description:
        "Les fichiers MIDI (.mid, .midi) sont les plus précis pour l'importation car ils contiennent directement les informations des notes.",
      icon: <IconFileMusic size={20} className="text-indigo-500" />,
    },
    {
      title: 'Fichiers audio',
      description:
        "L'analyse des fichiers audio (MP3, WAV) est expérimentale et pourrait ne pas détecter toutes les notes correctement.",
      icon: <IconFileMusic size={20} className="text-amber-500" />,
    },
    {
      title: 'Qualité des fichiers',
      description:
        'Pour de meilleurs résultats, utilisez des fichiers MIDI ou MusicXML sans altération ou provenant de sources fiables.',
      icon: <IconInfoCircle size={20} className="text-emerald-500" />,
    },
  ];

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl p-5 border border-slate-200 dark:border-slate-700">
      <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4 flex items-center">
        <IconInfoCircle size={20} className="mr-2 text-indigo-500" />
        Conseils pour l'importation
      </h3>

      <div className="space-y-4">
        {tips.map((tip, index) => (
          <div key={index} className="flex">
            <div className="p-2 rounded-lg bg-slate-100 dark:bg-slate-700 mr-3">
              {tip.icon}
            </div>
            <div>
              <h4 className="text-sm font-medium text-slate-900 dark:text-white">
                {tip.title}
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                {tip.description}
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 p-3 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg">
        <p className="text-sm text-indigo-700 dark:text-indigo-300">
          Virtuo Piano peut analyser la plupart des fichiers de musique
          standard, mais la qualité des résultats dépend de la qualité des
          fichiers source.
        </p>
      </div>
    </div>
  );
}

// Nouveau composant pour l'assistant d'importation IA
function AIImportAssistant() {
  const [isExpanded, setIsExpanded] = useState(false);
  const [aiResponse, setAiResponse] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [userQuery, setUserQuery] = useState('');

  const handleQuerySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userQuery.trim()) return;

    setIsLoading(true);

    // Simuler une réponse de l'IA
    setTimeout(() => {
      const responses = [
        "Pour les fichiers MIDI de piano, assurez-vous qu'ils sont en format Type 1 pour une meilleure compatibilité. Les formats Type 0 peuvent perdre l'information sur les canaux.",
        "Si votre fichier audio MP3 contient plusieurs instruments, l'analyse pourrait ne pas identifier correctement toutes les notes de piano. Essayez d'utiliser un outil d'extraction d'instrument avant l'importation.",
        'Les fichiers MusicXML offrent souvent la meilleure précision pour les partitions complexes avec des nuances et des articulations.',
        "Pour les débutants, je recommande de commencer avec des importations de niveau 1-2 comme 'Fur Elise' ou 'Clair de Lune' (version simplifiée).",
      ];

      setAiResponse(responses[Math.floor(Math.random() * responses.length)]);
      setIsLoading(false);
    }, 1500);
  };

  return (
    <div
      className={`bg-white dark:bg-slate-800 rounded-xl p-5 border border-slate-200 dark:border-slate-700 transition-all duration-300 ${
        isExpanded ? 'h-auto' : 'h-auto'
      }`}
    >
      <div
        className="flex items-center justify-between cursor-pointer"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <h3 className="text-lg font-semibold text-slate-900 dark:text-white flex items-center">
          <IconRobot size={20} className="mr-2 text-purple-500" />
          Assistant d'importation IA
        </h3>
        <button className="p-1 rounded-full bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400">
          {isExpanded ? (
            <IconChevronRight size={16} className="rotate-90" />
          ) : (
            <IconChevronRight size={16} />
          )}
        </button>
      </div>

      {isExpanded && (
        <div className="mt-4 space-y-4">
          <div className="p-4 bg-gradient-to-r from-purple-50 to-indigo-50 dark:from-purple-900/20 dark:to-indigo-900/20 rounded-lg text-sm text-slate-700 dark:text-slate-300">
            Je peux vous aider à optimiser vos importations et résoudre les
            problèmes courants. Que voulez-vous savoir?
          </div>

          <form onSubmit={handleQuerySubmit} className="mt-3">
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Posez une question sur l'importation..."
                className="flex-1 px-3 py-2 rounded-lg bg-slate-100 dark:bg-slate-700 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-600 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm"
                value={userQuery}
                onChange={(e) => setUserQuery(e.target.value)}
              />
              <button
                type="submit"
                className="px-3 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium transition-colors"
                disabled={isLoading}
              >
                {isLoading ? (
                  <IconSettings size={18} className="animate-spin" />
                ) : (
                  <IconWand size={18} />
                )}
              </button>
            </div>
          </form>

          {aiResponse && (
            <div className="p-4 bg-white dark:bg-slate-700 rounded-lg shadow-sm border border-slate-200 dark:border-slate-600 mt-3">
              <div className="flex items-start">
                <div className="p-2 rounded-full bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 mr-3">
                  <IconRobot size={16} />
                </div>
                <div className="text-sm text-slate-700 dark:text-slate-300">
                  {aiResponse}
                </div>
              </div>
            </div>
          )}

          <div className="flex flex-wrap gap-2 mt-3">
            <button className="px-3 py-1.5 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 rounded-full text-xs font-medium text-slate-700 dark:text-slate-300 transition-colors">
              Comment optimiser un MIDI?
            </button>
            <button className="px-3 py-1.5 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 rounded-full text-xs font-medium text-slate-700 dark:text-slate-300 transition-colors">
              Erreurs d'import MP3
            </button>
            <button className="px-3 py-1.5 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 rounded-full text-xs font-medium text-slate-700 dark:text-slate-300 transition-colors">
              Niveaux de difficulté
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// Nouveau composant pour le visualiseur de partition
function SheetMusicVisualizer() {
  // Simuler un rendu de partition avec des notes
  const renderSheetMusic = () => {
    return (
      <div className="p-4 bg-white dark:bg-slate-700 rounded-lg overflow-hidden">
        <div className="border-b-2 border-slate-300 dark:border-slate-600 mb-2">
          {/* Ligne de portée */}
          <div className="relative h-16 mb-4">
            {/* Lignes de la portée */}
            <div className="absolute top-0 w-full h-0.5 bg-slate-400 dark:bg-slate-500"></div>
            <div className="absolute top-1/4 w-full h-0.5 bg-slate-400 dark:bg-slate-500"></div>
            <div className="absolute top-2/4 w-full h-0.5 bg-slate-400 dark:bg-slate-500"></div>
            <div className="absolute top-3/4 w-full h-0.5 bg-slate-400 dark:bg-slate-500"></div>
            <div className="absolute bottom-0 w-full h-0.5 bg-slate-400 dark:bg-slate-500"></div>

            {/* Clé de sol (stylisée) */}
            <div className="absolute left-2 h-full flex items-center">
              <div className="text-2xl font-serif text-slate-700 dark:text-slate-300">
                𝄞
              </div>
            </div>

            {/* Notes (stylisées) */}
            <div className="absolute left-12 top-1/4 w-6 h-6">
              <div className="w-5 h-5 rounded-full bg-indigo-500 dark:bg-indigo-400"></div>
              <div className="absolute top-0 right-0 w-0.5 h-10 bg-slate-700 dark:bg-slate-400"></div>
            </div>

            <div className="absolute left-24 top-2/4 w-6 h-6">
              <div className="w-5 h-5 rounded-full bg-indigo-500 dark:bg-indigo-400"></div>
              <div className="absolute top-0 right-0 w-0.5 h-10 bg-slate-700 dark:bg-slate-400"></div>
            </div>

            <div className="absolute left-36 top-0 w-6 h-6">
              <div className="w-5 h-5 rounded-full bg-indigo-500 dark:bg-indigo-400"></div>
              <div className="absolute top-0 right-0 w-0.5 h-10 bg-slate-700 dark:bg-slate-400"></div>
            </div>

            <div className="absolute left-48 top-3/4 w-6 h-6">
              <div className="w-5 h-5 rounded-full bg-indigo-500 dark:bg-indigo-400"></div>
              <div className="absolute top-0 right-0 w-0.5 h-10 bg-slate-700 dark:bg-slate-400"></div>
            </div>

            <div className="absolute left-60 top-1/4 w-6 h-6">
              <div className="w-5 h-5 rounded-full bg-indigo-500 dark:bg-indigo-400"></div>
              <div className="absolute top-0 right-0 w-0.5 h-10 bg-slate-700 dark:bg-slate-400"></div>
            </div>

            {/* Barre de mesure */}
            <div className="absolute right-4 h-full w-0.5 bg-slate-700 dark:bg-slate-400"></div>
          </div>
        </div>

        <div className="flex justify-between items-center">
          <div className="text-xs text-slate-500 dark:text-slate-400">
            Extrait de partition visualisé
          </div>
          <button className="text-xs text-indigo-600 dark:text-indigo-400 font-medium flex items-center">
            Voir en plein écran
            <IconArrowNarrowRight size={12} className="ml-1" />
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl p-5 border border-slate-200 dark:border-slate-700">
      <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4 flex items-center">
        <IconMusic size={20} className="mr-2 text-indigo-500" />
        Aperçu de partition
      </h3>

      <div className="space-y-4">
        {renderSheetMusic()}

        <div className="flex justify-between gap-2 mt-2">
          <button className="flex-1 py-2 px-3 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 rounded-lg text-sm font-medium text-slate-700 dark:text-slate-300 transition-colors flex items-center justify-center">
            <IconPiano size={16} className="mr-1.5" />
            Jouer
          </button>
          <button className="flex-1 py-2 px-3 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 rounded-lg text-sm font-medium text-slate-700 dark:text-slate-300 transition-colors flex items-center justify-center">
            <IconEdit size={16} className="mr-1.5" />
            Éditer
          </button>
          <button className="flex-1 py-2 px-3 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 rounded-lg text-sm font-medium text-slate-700 dark:text-slate-300 transition-colors flex items-center justify-center">
            <IconDownload size={16} className="mr-1.5" />
            Exporter
          </button>
        </div>
      </div>
    </div>
  );
}

// Nouveau composant pour la comparaison avant/après
function BeforeAfterComparison() {
  const [sliderPosition, setSliderPosition] = useState(50);

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSliderPosition(Number(e.target.value));
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl p-5 border border-slate-200 dark:border-slate-700">
      <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4 flex items-center">
        <IconArrowsExchange size={20} className="mr-2 text-emerald-500" />
        Comparaison avant/après analyse
      </h3>

      <div className="relative w-full h-48 mb-4 rounded-lg overflow-hidden">
        {/* Image "avant" */}
        <div
          className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-red-500/20 to-amber-500/20 dark:from-red-900/30 dark:to-amber-900/30 flex items-center justify-center"
          style={{ clipPath: `inset(0 ${100 - sliderPosition}% 0 0)` }}
        >
          <div className="text-center">
            <IconWaveSine
              size={32}
              className="mx-auto mb-2 text-red-600 dark:text-red-400"
            />
            <div className="text-sm font-medium text-slate-700 dark:text-slate-300">
              Fichier brut
            </div>
            <div className="text-xs text-slate-500 dark:text-slate-400">
              Avant analyse
            </div>
          </div>
        </div>

        {/* Image "après" */}
        <div
          className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-emerald-500/20 to-blue-500/20 dark:from-emerald-900/30 dark:to-blue-900/30 flex items-center justify-center"
          style={{ clipPath: `inset(0 0 0 ${sliderPosition}%)` }}
        >
          <div className="text-center">
            <IconMusic
              size={32}
              className="mx-auto mb-2 text-emerald-600 dark:text-emerald-400"
            />
            <div className="text-sm font-medium text-slate-700 dark:text-slate-300">
              Partition optimisée
            </div>
            <div className="text-xs text-slate-500 dark:text-slate-400">
              Après analyse
            </div>
          </div>
        </div>

        {/* Curseur de glissement */}
        <div
          className="absolute top-0 bottom-0 w-1 bg-white dark:bg-slate-300 shadow-lg cursor-ew-resize z-10"
          style={{ left: `${sliderPosition}%` }}
        >
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-white dark:bg-slate-300 shadow-md flex items-center justify-center text-slate-700 dark:text-slate-800">
            <IconArrowsExchange size={12} />
          </div>
        </div>
      </div>

      <input
        type="range"
        min="0"
        max="100"
        value={sliderPosition}
        onChange={handleSliderChange}
        className="w-full accent-indigo-500"
      />

      <div className="grid grid-cols-2 mt-4 gap-3">
        <div className="p-3 bg-slate-50 dark:bg-slate-700/40 rounded-lg">
          <h4 className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
            Avant
          </h4>
          <ul className="text-xs text-slate-500 dark:text-slate-400 space-y-1 list-disc pl-4">
            <li>Données brutes non optimisées</li>
            <li>Erreurs possibles de notes</li>
            <li>Tempo incohérent</li>
          </ul>
        </div>

        <div className="p-3 bg-slate-50 dark:bg-slate-700/40 rounded-lg">
          <h4 className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
            Après
          </h4>
          <ul className="text-xs text-slate-500 dark:text-slate-400 space-y-1 list-disc pl-4">
            <li>Notes corrigées et alignées</li>
            <li>Tempo stabilisé à 120 BPM</li>
            <li>Structure de mesures clarifiée</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

// Nouveau composant pour les paramètres d'analyse avancés
function AdvancedAnalysisSettings() {
  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl p-5 border border-slate-200 dark:border-slate-700">
      <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4 flex items-center">
        <IconSettings2 size={20} className="mr-2 text-amber-500" />
        Paramètres d'analyse avancés
      </h3>

      <div className="space-y-4">
        <div>
          <label className="flex justify-between items-center mb-1">
            <span className="text-sm text-slate-700 dark:text-slate-300">
              Sensibilité de détection
            </span>
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
              75%
            </span>
          </label>
          <input
            type="range"
            min="0"
            max="100"
            defaultValue="75"
            className="w-full accent-indigo-500"
          />
        </div>

        <div>
          <label className="flex justify-between items-center mb-1">
            <span className="text-sm text-slate-700 dark:text-slate-300">
              Correction rythmique
            </span>
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
              60%
            </span>
          </label>
          <input
            type="range"
            min="0"
            max="100"
            defaultValue="60"
            className="w-full accent-indigo-500"
          />
        </div>

        <div>
          <label className="flex justify-between items-center mb-1">
            <span className="text-sm text-slate-700 dark:text-slate-300">
              Mode de traitement
            </span>
          </label>
          <div className="flex p-1 bg-slate-100 dark:bg-slate-700 rounded-lg">
            <button className="flex-1 py-2 text-center text-xs font-medium rounded-md bg-indigo-500 text-white">
              Précision
            </button>
            <button className="flex-1 py-2 text-center text-xs font-medium text-slate-700 dark:text-slate-300">
              Équilibré
            </button>
            <button className="flex-1 py-2 text-center text-xs font-medium text-slate-700 dark:text-slate-300">
              Performance
            </button>
          </div>
        </div>

        <div className="flex gap-2 mt-3">
          <div className="flex items-center">
            <input
              id="autoTranspose"
              type="checkbox"
              className="w-4 h-4 accent-indigo-500"
            />
            <label
              htmlFor="autoTranspose"
              className="ml-2 text-xs text-slate-700 dark:text-slate-300"
            >
              Transposition auto
            </label>
          </div>

          <div className="flex items-center">
            <input
              id="noteFilling"
              type="checkbox"
              className="w-4 h-4 accent-indigo-500"
              defaultChecked
            />
            <label
              htmlFor="noteFilling"
              className="ml-2 text-xs text-slate-700 dark:text-slate-300"
            >
              Remplissage manquant
            </label>
          </div>

          <div className="flex items-center">
            <input
              id="noiseReduction"
              type="checkbox"
              className="w-4 h-4 accent-indigo-500"
              defaultChecked
            />
            <label
              htmlFor="noiseReduction"
              className="ml-2 text-xs text-slate-700 dark:text-slate-300"
            >
              Réduction du bruit
            </label>
          </div>
        </div>

        <button className="w-full py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-sm font-medium transition-colors flex items-center justify-center">
          <IconBolt size={16} className="mr-1.5" />
          Appliquer les paramètres avancés
        </button>
      </div>
    </div>
  );
}

// Nouveau composant pour l'analyse émotionnelle de la musique
function EmotionalAnalysisChart() {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  const emotionData = [
    {
      name: 'Joie',
      value: 75,
      color: 'bg-yellow-500',
      icon: <IconMoodHappy size={14} />,
    },
    {
      name: 'Mélancolie',
      value: 45,
      color: 'bg-blue-500',
      icon: <IconMoodSad size={14} />,
    },
    {
      name: 'Sérénité',
      value: 60,
      color: 'bg-green-500',
      icon: <IconMoodSmile size={14} />,
    },
    {
      name: 'Intensité',
      value: 30,
      color: 'bg-red-500',
      icon: <IconRadar size={14} />,
    },
    {
      name: 'Ambiance',
      value: 55,
      color: 'bg-purple-500',
      icon: <IconMoodNeutral size={14} />,
    },
  ];

  // Simule l'analyse d'une musique importée
  const renderEmotionChart = () => {
    return (
      <div className="relative h-56 mb-4">
        {/* Cercle central */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-28 h-28 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center text-slate-600 dark:text-slate-300 font-medium text-sm">
            Analyse émotionnelle
          </div>
        </div>

        {/* Rayons émotionnels */}
        {emotionData.map((emotion, index) => {
          // Calculer la position autour du cercle
          const angle = (index / emotionData.length) * 2 * Math.PI;
          const radius = 110; // Distance du centre
          const x = Math.cos(angle) * radius + 130; // Centre x
          const y = Math.sin(angle) * radius + 110; // Centre y

          // Longueur basée sur la valeur émotionnelle
          const valueRadius = (emotion.value / 100) * radius * 0.8;

          return (
            <div key={index}>
              {/* Ligne de base */}
              <div
                className="absolute w-0.5 bg-slate-200 dark:bg-slate-700 origin-bottom"
                style={{
                  height: `${radius}px`,
                  transformOrigin: '50% 100%',
                  transform: `translate(${130}px, ${
                    110 - radius
                  }px) rotate(${angle}rad)`,
                }}
              ></div>

              {/* Indicateur de valeur émotionnelle */}
              <div
                className={`absolute rounded-full ${
                  selectedIndex === index
                    ? 'w-6 h-6 -ml-3 -mt-3 shadow-md border-2 border-white dark:border-slate-800'
                    : 'w-3 h-3 -ml-1.5 -mt-1.5'
                } cursor-pointer ${emotion.color} transition-all duration-150`}
                style={{
                  left: `${130 + Math.cos(angle) * valueRadius}px`,
                  top: `${110 + Math.sin(angle) * valueRadius}px`,
                }}
                onClick={() =>
                  setSelectedIndex(index === selectedIndex ? null : index)
                }
              ></div>

              {/* Étiquette */}
              <div
                className={`absolute px-2 py-1 rounded-md bg-white dark:bg-slate-700 shadow-sm text-xs font-medium transition-opacity duration-150 ${
                  selectedIndex === index ? 'opacity-100' : 'opacity-70'
                }`}
                style={{
                  left: `${x}px`,
                  top: `${y}px`,
                  transform: 'translate(-50%, -50%)',
                }}
              >
                <div className="flex items-center">
                  <span className="mr-1 text-slate-600 dark:text-slate-300">
                    {emotion.icon}
                  </span>
                  {emotion.name}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl p-5 border border-slate-200 dark:border-slate-700">
      <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4 flex items-center">
        <IconChartPie size={20} className="mr-2 text-indigo-500" />
        Analyse émotionnelle
      </h3>

      <div className="text-center">{renderEmotionChart()}</div>

      <div className="text-sm text-center text-slate-600 dark:text-slate-400 mb-4">
        {selectedIndex !== null ? (
          <>
            <span className="font-medium">
              {emotionData[selectedIndex].name}:{' '}
            </span>
            <span className="text-indigo-600 dark:text-indigo-400 font-medium">
              {emotionData[selectedIndex].value}%
            </span>
            <p className="mt-1 text-xs">
              {emotionData[selectedIndex].name === 'Joie' &&
                'Cette composition exprime une émotion vive et positive, avec des motifs enjoués et dynamiques.'}
              {emotionData[selectedIndex].name === 'Mélancolie' &&
                'Des passages méditatifs et introspectifs créent une atmosphère teintée de douce mélancolie.'}
              {emotionData[selectedIndex].name === 'Sérénité' &&
                "L'équilibre harmonique et le tempo modéré instaurent un sentiment de calme et de paix."}
              {emotionData[selectedIndex].name === 'Intensité' &&
                'Les contrastes dynamiques et les passages techniques révèlent une intensité modérée.'}
              {emotionData[selectedIndex].name === 'Ambiance' &&
                "L'articulation et les nuances subtiles contribuent à une ambiance contemplative."}
            </p>
          </>
        ) : (
          'Sélectionnez un point pour voir les détails émotionnels'
        )}
      </div>

      <div className="mt-4 p-3 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg">
        <div className="flex items-center">
          <div className="p-2 rounded-full bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 mr-3">
            <IconCpu size={18} />
          </div>
          <p className="text-xs text-indigo-700 dark:text-indigo-300">
            L'IA de Virtuo Piano analyse les caractéristiques musicales pour
            identifier les émotions dominantes dans chaque composition.
          </p>
        </div>
      </div>

      <div className="mt-4 flex justify-between">
        <button className="text-xs text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 font-medium flex items-center">
          <IconEye size={14} className="mr-1" />
          Voir l'analyse complète
        </button>

        <button className="text-xs text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 font-medium flex items-center">
          Essayer avec un autre morceau
          <IconChevronRight size={14} className="ml-1" />
        </button>
      </div>
    </div>
  );
}

// Nouveau composant pour l'historique d'importation avec timeline
function ImportHistoryTimeline() {
  const importHistory = [
    {
      date: '15 sept. 2023',
      items: [
        {
          title: 'Inventions BWV 772-786',
          status: 'success',
          format: 'midi',
          count: 15,
        },
      ],
    },
    {
      date: '10 sept. 2023',
      items: [
        {
          title: 'Suite bergamasque',
          status: 'success',
          format: 'musicxml',
          count: 4,
        },
      ],
    },
    {
      date: '28 août 2023',
      items: [
        {
          title: 'Impromptu Op.90',
          status: 'success',
          format: 'musicxml',
          count: 1,
        },
        {
          title: 'Enregistrement.mp3',
          status: 'failed',
          format: 'mp3',
          count: 1,
        },
      ],
    },
    {
      date: '15 août 2023',
      items: [
        {
          title: 'Collection Mozart',
          status: 'success',
          format: 'midi',
          count: 12,
        },
      ],
    },
  ];

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl p-5 border border-slate-200 dark:border-slate-700">
      <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4 flex items-center">
        <IconTimeline size={20} className="mr-2 text-blue-500" />
        Historique d'importation
      </h3>

      <div className="relative space-y-8 before:absolute before:inset-0 before:left-3.5 before:w-0.5 before:bg-slate-200 dark:before:bg-slate-700 before:ml-0.5">
        {importHistory.map((period, index) => (
          <div key={index} className="relative pl-8">
            <div className="flex items-center">
              <div className="absolute left-0 bg-blue-500 rounded-full h-7 w-7 flex items-center justify-center z-10">
                <IconCalendarTime size={16} className="text-white" />
              </div>
              <h4 className="font-medium text-slate-700 dark:text-slate-300">
                {period.date}
              </h4>
            </div>

            <div className="mt-3 space-y-3">
              {period.items.map((item, itemIndex) => (
                <div
                  key={itemIndex}
                  className={`p-3 rounded-lg ${
                    item.status === 'success'
                      ? 'bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800/30'
                      : 'bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-800/30'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      {item.format === 'midi' && (
                        <IconFileMusic
                          size={16}
                          className="text-blue-500 mr-2"
                        />
                      )}
                      {item.format === 'musicxml' && (
                        <IconFileMusic
                          size={16}
                          className="text-emerald-500 mr-2"
                        />
                      )}
                      {item.format === 'mp3' && (
                        <IconFileMusic
                          size={16}
                          className="text-amber-500 mr-2"
                        />
                      )}
                      <span className="text-sm font-medium text-slate-800 dark:text-slate-200">
                        {item.title}
                      </span>
                    </div>
                    <div className="flex items-center">
                      {item.count > 1 && (
                        <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 mr-2">
                          {item.count} fichiers
                        </span>
                      )}
                      {item.status === 'success' ? (
                        <IconCheck size={16} className="text-emerald-500" />
                      ) : (
                        <IconX size={16} className="text-red-500" />
                      )}
                    </div>
                  </div>

                  <div className="mt-1 flex justify-between items-center">
                    <span className="text-xs text-slate-500 dark:text-slate-400">
                      Format: {item.format.toUpperCase()}
                    </span>

                    {item.status === 'success' ? (
                      <button className="text-xs text-blue-600 dark:text-blue-400 hover:underline">
                        Voir les détails
                      </button>
                    ) : (
                      <button className="text-xs text-red-600 dark:text-red-400 hover:underline">
                        Voir l'erreur
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}

        <div className="relative pl-8">
          <div className="flex items-center">
            <div className="absolute left-0 bg-slate-300 dark:bg-slate-600 rounded-full h-7 w-7 flex items-center justify-center z-10">
              <IconPlus size={16} className="text-white" />
            </div>
            <button className="text-sm text-indigo-600 dark:text-indigo-400 font-medium hover:underline">
              Voir l'historique complet
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// Nouveau composant pour la bibliothèque de partitions recommandées
function RecommendedSheetLibrary() {
  const recommendations = [
    {
      id: 1,
      title: 'Prélude en C majeur',
      composer: 'Bach',
      level: 'Intermédiaire',
      matches: 92,
    },
    {
      id: 2,
      title: 'Turkish March',
      composer: 'Mozart',
      level: 'Intermédiaire',
      matches: 88,
    },
    {
      id: 3,
      title: 'Valse des fleurs',
      composer: 'Tchaikovsky',
      level: 'Intermédiaire avancé',
      matches: 85,
    },
    {
      id: 4,
      title: "Comptine d'un autre été",
      composer: 'Yann Tiersen',
      level: 'Intermédiaire',
      matches: 79,
    },
  ];

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl p-5 border border-slate-200 dark:border-slate-700">
      <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4 flex items-center">
        <IconLibrary size={20} className="mr-2 text-indigo-500" />
        Suggestions d'importation
      </h3>

      <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">
        Basées sur vos imports précédents et votre niveau de compétence
      </p>

      <div className="space-y-3 mb-4">
        {recommendations.map((rec) => (
          <div
            key={rec.id}
            className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-700/40 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700/60 transition-colors"
          >
            <div className="flex-1">
              <h4 className="text-sm font-medium text-slate-900 dark:text-white">
                {rec.title}
              </h4>
              <div className="flex items-center mt-1">
                <span className="text-xs text-slate-500 dark:text-slate-400 mr-3">
                  {rec.composer}
                </span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300">
                  {rec.level}
                </span>
              </div>
            </div>

            <div className="text-right">
              <div className="text-sm font-semibold text-indigo-600 dark:text-indigo-400">
                {rec.matches}%
              </div>
              <div className="text-xs text-slate-500 dark:text-slate-400">
                compatibilité
              </div>
            </div>

            <button className="ml-4 p-2 rounded-full bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-200 dark:hover:bg-indigo-900/50 transition-colors">
              <IconDownload size={16} />
            </button>
          </div>
        ))}
      </div>

      <div className="flex justify-between items-center">
        <button className="text-sm text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 font-medium flex items-center">
          <IconFilter size={14} className="mr-1" />
          Filtrer
        </button>

        <div className="flex space-x-1">
          <button className="w-7 h-7 flex items-center justify-center rounded bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400">
            <IconChevronLeft size={16} />
          </button>
          <div className="text-xs text-slate-600 dark:text-slate-400 flex items-center px-2">
            1/4
          </div>
          <button className="w-7 h-7 flex items-center justify-center rounded bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400">
            <IconChevronRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}

// Nouveau composant pour la génération de partitions par IA
function AISheetGenerator() {
  const [promptValue, setPromptValue] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationStage, setGenerationStage] = useState<string | null>(null);
  const [showPreview, setShowPreview] = useState(false);

  const generationStages = [
    "Analyse de l'intention musicale",
    'Génération de la structure mélodique',
    'Composition des harmonies',
    "Application des nuances et de l'expressivité",
    'Finalisation de la partition',
  ];

  const handleGenerate = () => {
    if (!promptValue.trim()) return;

    setIsGenerating(true);
    setGenerationStage(generationStages[0]);
    setShowPreview(false);

    // Simuler le processus de génération étape par étape
    let stageIndex = 0;
    const stageInterval = setInterval(() => {
      stageIndex++;

      if (stageIndex < generationStages.length) {
        setGenerationStage(generationStages[stageIndex]);
      } else {
        clearInterval(stageInterval);
        setIsGenerating(false);
        setGenerationStage(null);
        setShowPreview(true);
      }
    }, 1500);
  };

  const promptSuggestions = [
    'Mélodie légère en do majeur, style baroque',
    'Nocturne mélancolique inspiré de Chopin',
    "Jazz progressif avec changements d'accords complexes",
    'Valse romantique à 3/4 avec des motifs répétitifs',
  ];

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl p-5 border border-slate-200 dark:border-slate-700">
      <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4 flex items-center">
        <IconSparkles size={20} className="mr-2 text-purple-500" />
        Compositeur IA
      </h3>

      <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">
        Générez des partitions uniques en décrivant simplement ce que vous
        souhaitez
      </p>

      {!showPreview ? (
        <>
          <div className="relative mb-4">
            <textarea
              value={promptValue}
              onChange={(e) => setPromptValue(e.target.value)}
              placeholder="Décrivez la musique que vous souhaitez créer..."
              className="w-full px-4 py-3 border rounded-lg bg-slate-50 dark:bg-slate-700 border-slate-200 dark:border-slate-600 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none min-h-[100px]"
              disabled={isGenerating}
            />
            {isGenerating && (
              <div className="absolute inset-0 bg-slate-50/75 dark:bg-slate-700/75 flex flex-col items-center justify-center rounded-lg">
                <div className="flex items-center justify-center mb-3">
                  <IconSparkles
                    size={24}
                    className="text-purple-500 animate-pulse mr-2"
                  />
                  <span className="text-slate-700 dark:text-slate-300 font-medium">
                    {generationStage}
                  </span>
                </div>
                <div className="w-4/5 bg-slate-200 dark:bg-slate-600 rounded-full h-1.5 mt-1">
                  <div
                    className="bg-purple-500 h-1.5 rounded-full transition-all duration-300"
                    style={{
                      width: `${
                        (generationStages.indexOf(generationStage || '') + 1) *
                        (100 / generationStages.length)
                      }%`,
                    }}
                  ></div>
                </div>
              </div>
            )}
          </div>

          <div className="flex flex-wrap gap-2 mb-4">
            {promptSuggestions.map((suggestion, index) => (
              <button
                key={index}
                onClick={() => setPromptValue(suggestion)}
                className="px-3 py-1 text-xs bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300 rounded-full hover:bg-purple-100 dark:hover:bg-purple-900/40 transition-colors"
                disabled={isGenerating}
              >
                {suggestion}
              </button>
            ))}
          </div>

          <button
            onClick={handleGenerate}
            disabled={isGenerating || !promptValue.trim()}
            className={`w-full py-2 px-4 rounded-lg font-medium text-white transition-colors flex items-center justify-center ${
              isGenerating || !promptValue.trim()
                ? 'bg-slate-400 dark:bg-slate-600 cursor-not-allowed'
                : 'bg-purple-600 hover:bg-purple-700'
            }`}
          >
            {isGenerating ? (
              <>
                <IconSettings size={18} className="animate-spin mr-2" />
                Génération en cours...
              </>
            ) : (
              <>
                <IconSparkles size={18} className="mr-2" />
                Générer une partition
              </>
            )}
          </button>
        </>
      ) : (
        <div className="space-y-4">
          <div className="bg-slate-50 dark:bg-slate-700 rounded-lg p-3 text-sm text-slate-600 dark:text-slate-300 italic">
            "{promptValue}"
          </div>

          <div className="rounded-lg border border-slate-200 dark:border-slate-700 overflow-hidden">
            <div className="bg-slate-100 dark:bg-slate-700 p-2 text-xs font-medium text-slate-600 dark:text-slate-300 flex justify-between items-center">
              <span>Aperçu de la partition générée</span>
              <div className="flex space-x-1">
                <button className="p-1 rounded hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-500">
                  <IconEye size={14} />
                </button>
                <button className="p-1 rounded hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-500">
                  <IconEdit size={14} />
                </button>
                <button className="p-1 rounded hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-500">
                  <IconDownload size={14} />
                </button>
              </div>
            </div>
            <div className="p-4 bg-white dark:bg-slate-800">
              {/* Rendu stylisé d'une partition */}
              <div className="space-y-3">
                <div className="h-1 bg-slate-200 dark:bg-slate-700 rounded w-full"></div>
                <div className="h-1 bg-slate-200 dark:bg-slate-700 rounded w-full"></div>
                <div className="h-1 bg-slate-200 dark:bg-slate-700 rounded w-full"></div>
                <div className="h-1 bg-slate-200 dark:bg-slate-700 rounded w-full"></div>
                <div className="h-1 bg-slate-200 dark:bg-slate-700 rounded w-full"></div>

                {/* Notes stylisées */}
                <div className="relative h-4">
                  <div className="absolute left-[10%] top-0 w-4 h-4 rounded-full bg-purple-500"></div>
                  <div className="absolute left-[20%] top-2 w-4 h-4 rounded-full bg-purple-500"></div>
                  <div className="absolute left-[30%] top-1 w-4 h-4 rounded-full bg-purple-500"></div>
                  <div className="absolute left-[40%] top-3 w-4 h-4 rounded-full bg-purple-500"></div>
                  <div className="absolute left-[50%] top-2 w-4 h-4 rounded-full bg-purple-500"></div>
                  <div className="absolute left-[60%] top-0 w-4 h-4 rounded-full bg-purple-500"></div>
                  <div className="absolute left-[70%] top-1 w-4 h-4 rounded-full bg-purple-500"></div>
                  <div className="absolute left-[80%] top-2 w-4 h-4 rounded-full bg-purple-500"></div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex space-x-2">
            <button
              onClick={() => setShowPreview(false)}
              className="flex-1 py-2 px-3 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 rounded-lg text-sm font-medium text-slate-700 dark:text-slate-300 transition-colors flex items-center justify-center"
            >
              <IconArrowBackUp size={16} className="mr-1.5" />
              Modifier
            </button>
            <button className="flex-1 py-2 px-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-sm font-medium transition-colors flex items-center justify-center">
              <IconFileImport size={16} className="mr-1.5" />
              Importer
            </button>
          </div>

          <div className="mt-4 border-t border-slate-200 dark:border-slate-700 pt-4">
            <h4 className="text-sm font-medium text-slate-800 dark:text-slate-200 mb-2 flex items-center">
              <IconBrush size={16} className="mr-1 text-indigo-500" />
              Paramètres avancés
            </h4>
            <div className="flex flex-wrap gap-2">
              <button className="px-2 py-1 text-xs bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 rounded hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors">
                Modifier le tempo
              </button>
              <button className="px-2 py-1 text-xs bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 rounded hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors">
                Changer la tonalité
              </button>
              <button className="px-2 py-1 text-xs bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 rounded hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors">
                Ajouter des nuances
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Nouveau composant pour la collaboration sur les imports
function CollaborativeImport() {
  const collaborators = [
    {
      id: 1,
      name: 'Marie D.',
      avatar: '/avatars/user1.jpg',
      role: 'Professeur',
      online: true,
    },
    {
      id: 2,
      name: 'Thomas L.',
      avatar: '/avatars/user2.jpg',
      role: 'Élève',
      online: true,
    },
    {
      id: 3,
      name: 'Sophie M.',
      avatar: '/avatars/user3.jpg',
      role: 'Pianiste',
      online: false,
    },
  ];

  const recentActivity = [
    {
      user: 'Marie D.',
      action: 'a modifié le tempo',
      time: 'Il y a 5 min',
      target: 'Nocturne Op. 9',
    },
    {
      user: 'Thomas L.',
      action: 'a ajouté des annotations',
      time: 'Il y a 20 min',
      target: 'Nocturne Op. 9',
    },
    {
      user: 'Sophie M.',
      action: 'a importé',
      time: 'Hier',
      target: 'Valse de Chopin',
    },
  ];

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl p-5 border border-slate-200 dark:border-slate-700">
      <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4 flex items-center">
        <IconUsers size={20} className="mr-2 text-blue-500" />
        Collaboration
      </h3>

      <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">
        Travaillez ensemble sur vos partitions importées et partagez vos
        améliorations
      </p>

      <div className="mb-5">
        <h4 className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-3 flex items-center">
          <IconUsers size={16} className="mr-2 text-blue-500" />
          Collaborateurs
        </h4>

        <div className="space-y-3">
          {collaborators.map((user) => (
            <div
              key={user.id}
              className="flex items-center justify-between p-2 bg-slate-50 dark:bg-slate-700/40 rounded-lg"
            >
              <div className="flex items-center">
                <div className="relative mr-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-indigo-500"></div>
                  {user.online && (
                    <div className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 rounded-full border-2 border-white dark:border-slate-800"></div>
                  )}
                </div>
                <div>
                  <div className="text-sm font-medium text-slate-800 dark:text-slate-200">
                    {user.name}
                  </div>
                  <div className="text-xs text-slate-500 dark:text-slate-400">
                    {user.role}
                  </div>
                </div>
              </div>

              <div className="flex space-x-1">
                <button className="p-1.5 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded hover:bg-blue-200 dark:hover:bg-blue-900/50">
                  <IconMessageCircle size={16} />
                </button>
                <button className="p-1.5 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400 rounded hover:bg-slate-200 dark:hover:bg-slate-600">
                  <IconShare size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>

        <button className="mt-3 w-full py-1.5 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-lg text-sm hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors flex items-center justify-center">
          <IconPlus size={14} className="mr-1" />
          Inviter un collaborateur
        </button>
      </div>

      <div>
        <h4 className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-3 flex items-center">
          <IconHistory size={16} className="mr-2 text-blue-500" />
          Activité récente
        </h4>

        <div className="space-y-3">
          {recentActivity.map((activity, index) => (
            <div
              key={index}
              className="text-sm border-l-2 border-blue-200 dark:border-blue-800 pl-3 py-1"
            >
              <div className="font-medium text-slate-800 dark:text-slate-200">
                {activity.user}{' '}
                <span className="font-normal text-slate-600 dark:text-slate-400">
                  {activity.action}
                </span>
              </div>
              <div className="text-xs text-slate-500 dark:text-slate-400 mt-1 flex justify-between">
                <span>{activity.target}</span>
                <span>{activity.time}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-5 pt-4 border-t border-slate-200 dark:border-slate-700">
        <div className="flex space-x-2">
          <button className="flex-1 py-2 text-center text-xs font-medium rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors">
            Partager mon import
          </button>
          <button className="flex-1 py-2 text-center text-xs font-medium rounded-lg bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors">
            Session en direct
          </button>
        </div>
      </div>
    </div>
  );
}

// Nouveau composant pour la comparaison de versions
function VersionCompare() {
  const [selectedVersion, setSelectedVersion] = useState<number>(0);

  const versions = [
    {
      id: 1,
      name: 'Version originale',
      author: 'Téléchargement initial',
      date: '12 sept. 2023',
      changes: [],
    },
    {
      id: 2,
      name: 'Ajustement tempo',
      author: 'Vous',
      date: '15 sept. 2023',
      changes: ['Tempo ajusté à 105 BPM', 'Correction de 3 notes'],
    },
    {
      id: 3,
      name: 'Annotation complète',
      author: 'Marie D.',
      date: '18 sept. 2023',
      changes: [
        'Ajout de nuances',
        'Marquage des phrasés',
        "Notes pour l'interprétation",
      ],
    },
  ];

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl p-5 border border-slate-200 dark:border-slate-700">
      <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4 flex items-center">
        <IconVersions size={20} className="mr-2 text-emerald-500" />
        Historique des versions
      </h3>

      <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">
        Suivez l'évolution de votre partition et revenez à des versions
        antérieures si nécessaire
      </p>

      <div className="flex mb-5 overflow-x-auto pb-2 -mx-1 px-1">
        {versions.map((version, index) => (
          <div
            key={version.id}
            className={`flex-shrink-0 w-1/3 min-w-[150px] px-1.5 cursor-pointer`}
            onClick={() => setSelectedVersion(index)}
          >
            <div
              className={`rounded-lg p-3 transition-colors ${
                selectedVersion === index
                  ? 'bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-800/30 border'
                  : 'bg-slate-50 dark:bg-slate-700/40 hover:bg-slate-100 dark:hover:bg-slate-700/60 border border-transparent'
              }`}
            >
              <div className="flex items-center justify-between">
                <span
                  className={`text-xs px-1.5 py-0.5 rounded ${
                    index === 0
                      ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300'
                      : index === versions.length - 1
                      ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300'
                      : 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300'
                  }`}
                >
                  v{index + 1}
                </span>

                <div className="flex">
                  {index > 0 && (
                    <div className="w-2 h-2 rounded-full bg-emerald-500 ml-1"></div>
                  )}
                </div>
              </div>

              <div className="mt-1 text-sm font-medium text-slate-800 dark:text-slate-200 truncate">
                {version.name}
              </div>

              <div className="flex justify-between items-center mt-1">
                <span className="text-xs text-slate-500 dark:text-slate-400">
                  {version.author}
                </span>
                <span className="text-xs text-slate-500 dark:text-slate-400">
                  {version.date}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="p-4 rounded-lg bg-slate-50 dark:bg-slate-700/30 mb-4">
        <div className="flex items-center justify-between mb-3">
          <h4 className="text-sm font-medium text-slate-800 dark:text-slate-200">
            {versions[selectedVersion].name}{' '}
            <span className="text-xs text-slate-500 dark:text-slate-400">
              (v{selectedVersion + 1})
            </span>
          </h4>

          <div className="flex gap-1">
            <button className="p-1 rounded hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-600 dark:text-slate-400">
              <IconEye size={16} />
            </button>
            <button className="p-1 rounded hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-600 dark:text-slate-400">
              <IconDownload size={16} />
            </button>
          </div>
        </div>

        {selectedVersion > 0 ? (
          <div className="space-y-1.5">
            {versions[selectedVersion].changes.map((change, index) => (
              <div key={index} className="flex items-center text-xs">
                <span className="text-emerald-500 dark:text-emerald-400 mr-2">
                  +
                </span>
                <span className="text-slate-700 dark:text-slate-300">
                  {change}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-xs text-slate-600 dark:text-slate-400 italic">
            Version originale - aucune modification
          </div>
        )}
      </div>

      <div className="flex items-center justify-between bg-slate-100 dark:bg-slate-700 p-2 rounded-lg">
        <div className="flex gap-1">
          <button
            className="p-1.5 rounded hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-600 dark:text-slate-400 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={selectedVersion === 0}
          >
            <IconArrowBackUp size={16} />
          </button>
          <button
            className="p-1.5 rounded hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-600 dark:text-slate-400 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={selectedVersion === versions.length - 1}
          >
            <IconArrowForwardUp size={16} />
          </button>
        </div>

        <div className="flex gap-1">
          <button className="px-3 py-1 text-xs bg-emerald-600 hover:bg-emerald-700 text-white rounded">
            Restaurer cette version
          </button>
          <button className="px-3 py-1 text-xs bg-slate-200 dark:bg-slate-600 hover:bg-slate-300 dark:hover:bg-slate-500 text-slate-700 dark:text-slate-200 rounded">
            Comparer
          </button>
        </div>
      </div>

      <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-700">
        <div className="flex items-center text-xs text-slate-500 dark:text-slate-400 mb-2">
          <IconGitBranch size={14} className="mr-1.5" />
          Structure de branche
        </div>

        <div className="flex items-center">
          <div className="h-7 w-7 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 flex items-center justify-center mr-2">
            <IconGitCommit size={14} />
          </div>
          <div className="h-0.5 w-10 bg-emerald-200 dark:bg-emerald-800"></div>
          <div className="h-7 w-7 rounded-full bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 flex items-center justify-center mr-2">
            <IconGitCommit size={14} />
          </div>
          <div className="h-0.5 w-10 bg-emerald-200 dark:bg-emerald-800"></div>
          <div className="h-7 w-7 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
            <IconGitCommit size={14} />
          </div>
        </div>
      </div>
    </div>
  );
}

// Composant principal pour la page des imports
export function ImportsBento() {
  const [imports, setImports] = useState<ImportedSong[]>(demoImports);
  const [activeTab, setActiveTab] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [isImporting, setIsImporting] = useState(false);
  const [analysisState, setAnalysisState] = useState<AnalysisState>({
    notesDetected: 0,
    tempoDetected: null,
    keyDetected: null,
    progressPercent: 0,
    status: 'idle',
  });

  // Filtre les imports en fonction de l'onglet actif et du terme de recherche
  const filteredImports = imports.filter((song) => {
    // Filtre par onglet
    if (activeTab === 'ready' && song.status !== 'ready') return false;
    if (activeTab === 'processing' && song.status !== 'processing')
      return false;
    if (activeTab === 'error' && song.status !== 'error') return false;

    // Filtre par terme de recherche
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      const matchesTitle = song.title.toLowerCase().includes(term);
      const matchesComposer =
        song.composer?.toLowerCase().includes(term) || false;
      const matchesGenre = song.genre?.toLowerCase().includes(term) || false;

      return matchesTitle || matchesComposer || matchesGenre;
    }

    return true;
  });

  // Gestion de l'analyse pour les nouveaux imports
  const handleAnalysisUpdate = (state: AnalysisState) => {
    setAnalysisState(state);

    // Simuler la progression de l'analyse
    if (state.status === 'analyzing') {
      let progress = 0;
      let detectedNotes = 0;

      const interval = setInterval(() => {
        progress += 5;
        detectedNotes += Math.floor(Math.random() * 10);

        setAnalysisState((prev) => ({
          ...prev,
          progressPercent: progress,
          notesDetected: detectedNotes,
          tempoDetected: progress > 50 ? 120 : null,
          keyDetected: progress > 75 ? 'C Major' : null,
          status: progress >= 100 ? 'complete' : 'analyzing',
        }));

        if (progress >= 100) {
          clearInterval(interval);
        }
      }, 200);
    }
  };

  // Finaliser l'importation
  const completeImport = () => {
    // Ajouter le morceau importé à la liste
    const newSong: ImportedSong = {
      id: `import-${Date.now()}`,
      title: 'Nouveau morceau importé',
      duration_ms: 180000,
      tempo: 120,
      timeSignature: '4/4',
      level: 2,
      key: 'C Major',
      importedAt: "À l'instant",
      analyzed: true,
      status: 'ready',
      format: 'midi',
      fileSize: 45000,
    };

    setImports([newSong, ...imports]);
    setAnalysisState({
      notesDetected: 0,
      tempoDetected: null,
      keyDetected: null,
      progressPercent: 0,
      status: 'idle',
    });
    setIsImporting(false);
  };

  return (
    <div className="w-full p-4">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center">
          <IconFileImport size={24} className="mr-2 text-indigo-500" />
          Mes Partitions Importées
        </h1>
        <p className="text-slate-500 dark:text-slate-400 mt-1">
          Importez et gérez vos propres fichiers musicaux
        </p>
      </div>

      {/* Statistiques d'import */}
      <div className="mb-6">
        <ImportStats imports={imports} />
      </div>

      {/* Interface principale */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          {/* Interface d'importation et liste des imports */}
          <div className="bg-white dark:bg-slate-800 shadow-md rounded-2xl p-5 border border-slate-200 dark:border-slate-700">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
              <h2 className="text-lg font-semibold text-slate-900 dark:text-white flex items-center">
                <IconFileMusic size={20} className="mr-2 text-indigo-500" />
                Mes Imports ({imports.length})
              </h2>

              <button
                onClick={() => setIsImporting(true)}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium transition-colors flex items-center justify-center"
              >
                <IconUpload size={18} className="mr-2" />
                Importer
              </button>
            </div>

            {/* Dialogue d'importation */}
            <Dialog.Root open={isImporting} onOpenChange={setIsImporting}>
              <Dialog.Portal>
                <Dialog.Overlay className="fixed inset-0 bg-black/50 dark:bg-slate-900/80 z-40" />
                <Dialog.Content className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full max-w-xl bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-xl z-50 max-h-[90vh] overflow-auto">
                  <div className="flex justify-between items-center mb-4">
                    <Dialog.Title className="text-xl font-semibold text-slate-900 dark:text-white">
                      Importer de la musique
                    </Dialog.Title>
                    <Dialog.Close className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-500">
                      <IconX size={20} />
                    </Dialog.Close>
                  </div>

                  {analysisState.status === 'idle' ? (
                    <DropZone onAnalysis={handleAnalysisUpdate} />
                  ) : (
                    <AnalysisViewer
                      state={analysisState}
                      onComplete={completeImport}
                    />
                  )}
                </Dialog.Content>
              </Dialog.Portal>
            </Dialog.Root>

            {/* Barre de recherche et filtres */}
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <div className="relative flex-grow">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <IconSearch
                    size={18}
                    className="text-slate-400 dark:text-slate-500"
                  />
                </div>
                <input
                  type="text"
                  placeholder="Rechercher un morceau..."
                  className="w-full pl-10 pr-4 py-2 rounded-lg bg-slate-100 dark:bg-slate-700 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => setActiveTab('all')}
                  className={`px-3 py-2 rounded-lg text-sm font-medium ${
                    activeTab === 'all'
                      ? 'bg-indigo-100 text-indigo-600 dark:bg-indigo-900/40 dark:text-indigo-400'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-700 dark:text-slate-400 dark:hover:bg-slate-600'
                  }`}
                >
                  Tous
                </button>
                <button
                  onClick={() => setActiveTab('ready')}
                  className={`px-3 py-2 rounded-lg text-sm font-medium ${
                    activeTab === 'ready'
                      ? 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/40 dark:text-emerald-400'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-700 dark:text-slate-400 dark:hover:bg-slate-600'
                  }`}
                >
                  Prêts
                </button>
                <button
                  onClick={() => setActiveTab('processing')}
                  className={`px-3 py-2 rounded-lg text-sm font-medium ${
                    activeTab === 'processing'
                      ? 'bg-amber-100 text-amber-600 dark:bg-amber-900/40 dark:text-amber-400'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-700 dark:text-slate-400 dark:hover:bg-slate-600'
                  }`}
                >
                  En cours
                </button>
                <button
                  onClick={() => setActiveTab('error')}
                  className={`px-3 py-2 rounded-lg text-sm font-medium ${
                    activeTab === 'error'
                      ? 'bg-red-100 text-red-600 dark:bg-red-900/40 dark:text-red-400'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-700 dark:text-slate-400 dark:hover:bg-slate-600'
                  }`}
                >
                  Erreurs
                </button>
              </div>
            </div>

            {/* Liste des imports */}
            {filteredImports.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredImports.map((song) => (
                  <ImportCard key={song.id} song={song} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="flex justify-center mb-4">
                  <IconMusicOff
                    size={48}
                    className="text-slate-300 dark:text-slate-600"
                  />
                </div>
                <h3 className="text-lg font-semibold text-slate-700 dark:text-slate-300 mb-2">
                  Aucun import trouvé
                </h3>
                <p className="text-slate-500 dark:text-slate-400 mb-6 max-w-md mx-auto">
                  {searchTerm
                    ? "Aucun résultat ne correspond à votre recherche. Essayez d'autres termes."
                    : activeTab !== 'all'
                    ? `Vous n'avez pas encore d'imports avec le statut "${
                        activeTab === 'ready'
                          ? 'prêt'
                          : activeTab === 'processing'
                          ? 'en cours'
                          : 'erreur'
                      }".`
                    : "Vous n'avez pas encore importé de musique. Commencez dès maintenant!"}
                </p>
                <button
                  onClick={() => setIsImporting(true)}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium transition-colors inline-flex items-center"
                >
                  <IconUpload size={18} className="mr-2" />
                  Importer de la musique
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="md:col-span-1 space-y-6">
          {/* Conseils et astuces */}
          <ImportTips />

          {/* Nouvel assistant IA */}
          <AIImportAssistant />

          {/* Section "Saviez-vous?" */}
          <div className="bg-white dark:bg-slate-800 rounded-xl p-5 border border-slate-200 dark:border-slate-700">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4 flex items-center">
              <IconArrowsShuffle size={20} className="mr-2 text-purple-500" />
              Saviez-vous?
            </h3>

            <div className="p-4 bg-gradient-to-br from-purple-50 to-indigo-50 dark:from-purple-900/20 dark:to-indigo-900/20 rounded-lg">
              <p className="text-sm text-slate-700 dark:text-slate-300 mb-3">
                Vous pouvez convertir vos compositions originales en partitions
                et les partager avec d'autres utilisateurs de Virtuo Piano!
              </p>
              <button className="text-sm text-indigo-600 dark:text-indigo-400 font-medium hover:underline flex items-center">
                En savoir plus
                <IconChevronRight size={14} className="ml-1" />
              </button>
            </div>

            <div className="mt-4 p-4 bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 rounded-lg">
              <p className="text-sm text-slate-700 dark:text-slate-300 mb-3">
                Virtuo Piano peut analyser la difficulté de vos imports et vous
                suggérer des exercices adaptés pour améliorer votre technique.
              </p>
              <button className="text-sm text-amber-600 dark:text-amber-400 font-medium hover:underline flex items-center">
                Voir les suggestions
                <IconChevronRight size={14} className="ml-1" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Nouveaux composants créatifs (première rangée) */}
      <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-6">
        <SheetMusicVisualizer />
        <BeforeAfterComparison />
        <AdvancedAnalysisSettings />
      </div>

      {/* Nouveaux composants créatifs (deuxième rangée) */}
      <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
        <EmotionalAnalysisChart />
        <ImportHistoryTimeline />
        <RecommendedSheetLibrary />
      </div>

      {/* Nouvel assistant IA pour la génération de partitions */}
      <AISheetGenerator />

      {/* Nouveau composant pour la collaboration sur les imports */}
      <CollaborativeImport />

      {/* Nouveau composant pour la comparaison de versions */}
      <VersionCompare />
    </div>
  );
}

export default ImportsBento;
