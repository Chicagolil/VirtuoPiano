'use client';

import React from 'react';
import Image from 'next/image';
import {
  IconMusic,
  IconMicrophone,
  IconStar,
  IconUser,
  IconSettings,
  IconPlayerPlay,
  IconChartBar,
  IconLogout,
  IconTrendingUp,
  IconClock,
  IconDeviceGamepad2,
  IconBook,
} from '@tabler/icons-react';
import * as Progress from '@radix-ui/react-progress';
import * as Separator from '@radix-ui/react-separator';
import * as Avatar from '@radix-ui/react-avatar';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
} from 'recharts';

// Composant InfoTile pour afficher des informations clés en haut de la page
interface InfoTileProps {
  title: string;
  value: string;
  description: string;
  icon: React.ReactNode;
  trend?: {
    value: string;
    isPositive: boolean;
  };
  className?: string;
}

function InfoTile({
  title,
  value,
  description,
  icon,
  trend,
  className,
}: InfoTileProps) {
  return (
    <div
      className={`bg-white dark:bg-slate-800 shadow-md rounded-xl p-5 border border-slate-200 dark:border-slate-700 ${className}`}
    >
      <div className="flex justify-between items-start">
        <div>
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
            {title}
          </p>
          <h3 className="text-2xl font-bold text-slate-900 dark:text-white mt-1">
            {value}
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            {description}
          </p>

          {trend && (
            <div className="flex items-center mt-3">
              <span
                className={`text-xs font-medium ${
                  trend.isPositive
                    ? 'text-emerald-600 dark:text-emerald-400'
                    : 'text-rose-600 dark:text-rose-400'
                } flex items-center`}
              >
                <span
                  className={`mr-1 ${
                    trend.isPositive ? 'rotate-0' : 'rotate-180'
                  }`}
                >
                  <IconTrendingUp size={14} />
                </span>
                {trend.value}
              </span>
              <span className="text-xs text-slate-500 dark:text-slate-400 ml-1.5">
                depuis la semaine dernière
              </span>
            </div>
          )}
        </div>
        <div className="bg-indigo-100 dark:bg-indigo-900/30 p-3 rounded-lg text-indigo-600 dark:text-indigo-400">
          {icon}
        </div>
      </div>
    </div>
  );
}

// Données de démo pour les graphiques
const practiceData = [
  { name: 'Lun', minutes: 25 },
  { name: 'Mar', minutes: 40 },
  { name: 'Mer', minutes: 30 },
  { name: 'Jeu', minutes: 45 },
  { name: 'Ven', minutes: 20 },
  { name: 'Sam', minutes: 60 },
  { name: 'Dim', minutes: 35 },
];

const songCategoryData = [
  { name: 'Classique', value: 40 },
  { name: 'Jazz', value: 25 },
  { name: 'Pop', value: 20 },
  { name: 'Rock', value: 15 },
];

const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff8042'];

// Composant Progress avancé
function ProgressBar({
  value,
  max,
  className,
}: {
  value: number;
  max: number;
  className?: string;
}) {
  const percentage = (value / max) * 100;

  return (
    <Progress.Root
      className={`relative overflow-hidden bg-slate-200 dark:bg-slate-800 rounded-full w-full h-2.5 ${className}`}
      value={percentage}
    >
      <Progress.Indicator
        className="bg-indigo-500 w-full h-full transition-transform duration-500 ease-in-out"
        style={{ transform: `translateX(-${100 - percentage}%)` }}
      />
    </Progress.Root>
  );
}

// Composant Avatar personnalisé
function UserAvatar({ name, image }: { name: string; image?: string }) {
  return (
    <Avatar.Root className="inline-flex items-center justify-center align-middle overflow-hidden w-10 h-10 rounded-full bg-slate-200">
      <Avatar.Image
        className="h-full w-full object-cover"
        src={image || ''}
        alt={name}
      />
      <Avatar.Fallback className="w-full h-full flex items-center justify-center bg-indigo-500 text-white text-sm font-medium">
        {name
          .split(' ')
          .map((n) => n[0])
          .join('')}
      </Avatar.Fallback>
    </Avatar.Root>
  );
}

// Composant de grille amélioré avec shadcn/ui
export function BentoShadcnExample() {
  return (
    <div className="w-full p-4">
      {/* InfoTiles - Ligne d'informations clés */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <InfoTile
          title="Temps total de pratique"
          value="18h 45min"
          description="Temps cumulé pour ce mois-ci"
          icon={<IconClock size={24} />}
          trend={{ value: '+12%', isPositive: true }}
        />
        <InfoTile
          title="Morceaux dans la bibliothèque"
          value="128"
          description="32 morceaux commencés"
          icon={<IconBook size={24} />}
          trend={{ value: '+3', isPositive: true }}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4 auto-rows-auto">
        {/* Carte principale avec graphique */}
        <div className="bg-white dark:bg-slate-800 shadow-md rounded-2xl overflow-hidden col-span-1 md:col-span-2 lg:col-span-3 row-span-2 border border-slate-200 dark:border-slate-700">
          <div className="p-6 h-full flex flex-col">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                Statistiques de pratique
              </h2>
              <span className="bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 text-xs font-medium px-2.5 py-1 rounded-full">
                Cette semaine
              </span>
            </div>

            <div className="flex-grow">
              <ResponsiveContainer width="100%" height={200}>
                <LineChart
                  data={practiceData}
                  margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
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
                    formatter={(value) => [`${value} min`, 'Temps de pratique']}
                  />
                  <Line
                    type="monotone"
                    dataKey="minutes"
                    stroke="#6366f1"
                    strokeWidth={2}
                    dot={{ r: 4, fill: '#6366f1', strokeWidth: 0 }}
                    activeDot={{ r: 6, fill: '#818cf8', strokeWidth: 0 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>

            <Separator.Root className="h-px bg-slate-200 dark:bg-slate-700 my-4" />

            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Temps total
                </p>
                <p className="text-2xl font-bold text-slate-900 dark:text-white">
                  4h 15min
                </p>
              </div>
              <button className="bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium py-2 px-4 rounded-lg transition-colors">
                Voir détails
              </button>
            </div>
          </div>
        </div>

        {/* Carte avec Avatar et progression */}
        <div className="bg-white dark:bg-slate-800 shadow-md rounded-2xl p-5 col-span-1 lg:col-span-2 border border-slate-200 dark:border-slate-700">
          <div className="flex items-start space-x-3">
            <UserAvatar name="Jean Dupont" />
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                Jean Dupont
              </h3>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Niveau intermédiaire
              </p>
            </div>
          </div>

          <div className="mt-4 space-y-3">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-slate-500 dark:text-slate-400">
                  Progression niveau
                </span>
                <span className="text-slate-700 dark:text-slate-300 font-medium">
                  68%
                </span>
              </div>
              <ProgressBar value={68} max={100} />
            </div>

            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-slate-500 dark:text-slate-400">
                  Objectif hebdomadaire
                </span>
                <span className="text-slate-700 dark:text-slate-300 font-medium">
                  5h / 7h
                </span>
              </div>
              <ProgressBar value={5} max={7} className="h-2.5" />
            </div>
          </div>

          <Separator.Root className="h-px bg-slate-200 dark:bg-slate-700 my-4" />

          <div className="flex justify-between items-center">
            <span className="text-sm text-slate-500 dark:text-slate-400">
              4 jours consécutifs
            </span>
            <button className="text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300 text-sm font-medium">
              Profil complet
            </button>
          </div>
        </div>

        {/* Carte avec graphique circulaire */}
        <div className="bg-white dark:bg-slate-800 shadow-md rounded-2xl p-5 col-span-1 lg:col-span-1 border border-slate-200 dark:border-slate-700 flex flex-col">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
            Répertoire
          </h3>

          <div className="flex-grow flex items-center justify-center">
            <ResponsiveContainer width="100%" height={120}>
              <PieChart>
                <Pie
                  data={songCategoryData}
                  cx="50%"
                  cy="50%"
                  innerRadius={30}
                  outerRadius={45}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {songCategoryData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value) => [`${value}%`, 'Proportion']}
                  contentStyle={{
                    backgroundColor: '#1e293b',
                    border: 'none',
                    borderRadius: '8px',
                    fontSize: '12px',
                  }}
                  itemStyle={{ color: '#e2e8f0' }}
                  labelStyle={{ color: '#e2e8f0', fontWeight: 'bold' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="mt-2 grid grid-cols-2 gap-1">
            {songCategoryData.map((category, index) => (
              <div key={index} className="flex items-center space-x-1.5">
                <div
                  className="w-2.5 h-2.5 rounded-full"
                  style={{ backgroundColor: COLORS[index % COLORS.length] }}
                ></div>
                <span className="text-xs text-slate-500 dark:text-slate-400">
                  {category.name}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Carte avec liste de morceaux récents */}
        <div className="bg-white dark:bg-slate-800 shadow-md rounded-2xl p-5 col-span-1 lg:col-span-3 border border-slate-200 dark:border-slate-700">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
              Morceaux récents
            </h3>
            <button className="text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300 text-sm font-medium">
              Voir tous
            </button>
          </div>

          <div className="space-y-3">
            {[
              {
                title: 'Nocturne Op. 9 No. 2',
                composer: 'F. Chopin',
                progress: 85,
              },
              { title: 'Clair de Lune', composer: 'C. Debussy', progress: 62 },
              {
                title: 'Moonlight Sonata',
                composer: 'L. van Beethoven',
                progress: 24,
              },
            ].map((song, index) => (
              <div key={index} className="flex items-center space-x-3">
                <div className="bg-indigo-100 dark:bg-indigo-900/30 w-10 h-10 rounded-lg flex items-center justify-center">
                  <IconMusic
                    size={20}
                    className="text-indigo-600 dark:text-indigo-400"
                  />
                </div>
                <div className="flex-1">
                  <h4 className="text-sm font-medium text-slate-900 dark:text-white">
                    {song.title}
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {song.composer}
                  </p>
                </div>
                <div className="w-16">
                  <ProgressBar value={song.progress} max={100} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Carte avec statistiques */}
        <div className="bg-white dark:bg-slate-800 shadow-md rounded-2xl overflow-hidden col-span-1 lg:col-span-3 border border-slate-200 dark:border-slate-700">
          <div className="p-5">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
              Performance
            </h3>

            <div className="flex-grow">
              <ResponsiveContainer width="100%" height={120}>
                <BarChart
                  data={practiceData}
                  margin={{ top: 0, right: 0, left: -20, bottom: 0 }}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    vertical={false}
                    opacity={0.1}
                  />
                  <XAxis
                    dataKey="name"
                    tick={{ fontSize: 10, fill: '#94a3b8' }}
                  />
                  <YAxis tick={{ fontSize: 10, fill: '#94a3b8' }} />
                  <Tooltip
                    formatter={(value) => [`${value} min`, 'Temps de pratique']}
                    contentStyle={{
                      backgroundColor: '#1e293b',
                      border: 'none',
                      borderRadius: '8px',
                      fontSize: '12px',
                    }}
                    itemStyle={{ color: '#e2e8f0' }}
                    labelStyle={{ color: '#e2e8f0', fontWeight: 'bold' }}
                  />
                  <Bar dataKey="minutes" fill="#6366f1" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="mt-2 grid grid-cols-3 gap-4 text-center">
              <div>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Précision
                </p>
                <p className="text-lg font-bold text-slate-900 dark:text-white">
                  92%
                </p>
              </div>
              <div>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Tempo
                </p>
                <p className="text-lg font-bold text-slate-900 dark:text-white">
                  87%
                </p>
              </div>
              <div>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Régularité
                </p>
                <p className="text-lg font-bold text-slate-900 dark:text-white">
                  78%
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Nouvelle carte pour combler l'espace */}
        <div className="bg-white dark:bg-slate-800 shadow-md rounded-2xl overflow-hidden col-span-1 lg:col-span-3 border border-slate-200 dark:border-slate-700">
          <div className="p-5 h-full flex flex-col">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-3">
              Recommandations
            </h3>

            <div className="space-y-3 flex-grow">
              <div className="flex items-center p-2 rounded-lg bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-100 dark:border-indigo-800/30">
                <div className="bg-indigo-100 dark:bg-indigo-800/30 w-8 h-8 rounded-full flex items-center justify-center mr-3">
                  <IconMicrophone
                    size={16}
                    className="text-indigo-600 dark:text-indigo-400"
                  />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-slate-900 dark:text-white">
                    Exercices de rythme
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Pour améliorer votre régularité
                  </p>
                </div>
              </div>

              <div className="flex items-center p-2 rounded-lg bg-amber-50 dark:bg-amber-900/20 border border-amber-100 dark:border-amber-800/30">
                <div className="bg-amber-100 dark:bg-amber-800/30 w-8 h-8 rounded-full flex items-center justify-center mr-3">
                  <IconMusic
                    size={16}
                    className="text-amber-600 dark:text-amber-400"
                  />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-slate-900 dark:text-white">
                    Playlist personnalisée
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    5 morceaux adaptés à votre niveau
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-4">
              <button className="w-full bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800/30 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 py-2 px-4 rounded-lg text-sm font-medium transition-colors">
                Voir toutes les recommandations
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Section de cartes interactives supplémentaires */}
      <div className="mt-6 mb-6">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4">
          Améliorez votre expérience
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Carte piano virtuel */}
          <div className="bg-white dark:bg-slate-800 shadow-md rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-700">
            <div className="p-5">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                  Piano Virtuel
                </h3>
                <span className="bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 text-xs px-2 py-1 rounded-full font-medium">
                  Nouveau
                </span>
              </div>

              <div className="relative h-28 mb-4 overflow-hidden rounded-lg">
                {/* Touches de piano */}
                <div className="flex h-full">
                  {[
                    'w',
                    'b',
                    'w',
                    'b',
                    'w',
                    'w',
                    'b',
                    'w',
                    'b',
                    'w',
                    'b',
                    'w',
                  ].map((key, i) => (
                    <div
                      key={i}
                      className={`${
                        key === 'w'
                          ? 'bg-white dark:bg-slate-200 border-r border-slate-200 dark:border-slate-400 relative z-0 flex-1'
                          : 'bg-slate-900 absolute h-3/5 w-[10%] -ml-[5%] z-10'
                      }`}
                      style={key === 'b' ? { left: `${i * 8.33}%` } : {}}
                    />
                  ))}
                </div>

                {/* Overlay avec effet de pulsation */}
                <div className="absolute inset-0 bg-indigo-500/5 flex items-center justify-center">
                  <div className="w-12 h-12 bg-indigo-500/10 dark:bg-indigo-400/20 rounded-full flex items-center justify-center animate-pulse">
                    <IconPlayerPlay
                      size={20}
                      className="text-indigo-600 dark:text-indigo-400"
                    />
                  </div>
                </div>
              </div>

              <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">
                Pratiquez n'importe où avec notre piano virtuel interactif.
              </p>

              <button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 rounded-lg text-sm font-medium transition-colors">
                Essayer maintenant
              </button>
            </div>
          </div>

          {/* Carte communauté */}
          <div className="bg-white dark:bg-slate-800 shadow-md rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-700">
            <div className="p-5">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
                Communauté
              </h3>

              <div className="flex -space-x-2 mb-4">
                {['Jane', 'Mike', 'Sarah', 'John', 'Alex', '+12'].map(
                  (name, i) =>
                    i < 5 ? (
                      <UserAvatar key={i} name={name} />
                    ) : (
                      <div
                        key={i}
                        className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 text-xs font-medium"
                      >
                        {name}
                      </div>
                    )
                )}
              </div>

              <div className="space-y-3 mb-4">
                <div className="flex items-center p-2 rounded-lg bg-slate-50 dark:bg-slate-700/30">
                  <div className="flex-shrink-0 mr-3">
                    <UserAvatar name="Marie C." />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-slate-900 dark:text-white">
                      <span className="font-medium">Marie C.</span> a partagé
                      une interprétation de{' '}
                      <span className="font-medium">Nocturne Op. 9</span>
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                      Il y a 2 heures
                    </p>
                  </div>
                </div>
              </div>

              <button className="w-full bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800/30 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 py-2 px-4 rounded-lg text-sm font-medium transition-colors">
                Rejoindre la communauté
              </button>
            </div>
          </div>

          {/* Carte AI Coach */}
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-slate-800 dark:to-indigo-950/30 shadow-md rounded-2xl overflow-hidden border border-indigo-100 dark:border-indigo-900/30">
            <div className="p-5">
              <div className="flex justify-between items-start mb-3">
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                  AI Coach
                </h3>
                <span className="bg-indigo-100 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300 text-xs px-2 py-1 rounded-full font-medium">
                  Premium
                </span>
              </div>

              <div className="mb-4 p-3 rounded-lg bg-white/80 dark:bg-slate-800/50 border border-indigo-100 dark:border-indigo-900/20">
                <div className="flex items-start">
                  <div className="w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-900/50 flex items-center justify-center flex-shrink-0 mr-3">
                    <IconSettings
                      size={16}
                      className="text-indigo-600 dark:text-indigo-400"
                    />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-slate-700 dark:text-slate-300">
                      J'ai remarqué que votre régularité pourrait être
                      améliorée. Voulez-vous essayer un exercice spécifique?
                    </p>
                    <p className="text-xs text-indigo-600 dark:text-indigo-400 mt-2 font-medium">
                      Virtuo AI Assistant
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex space-x-2 mb-4">
                <button className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 rounded-lg text-sm font-medium transition-colors">
                  Voir suggestion
                </button>
                <button className="flex-shrink-0 bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-600 p-2 rounded-lg transition-colors">
                  <IconPlayerPlay size={18} />
                </button>
              </div>

              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-500 dark:text-slate-400">
                  3 suggestions disponibles
                </span>
                <span className="text-indigo-600 dark:text-indigo-400 font-medium cursor-pointer hover:underline">
                  Voir toutes
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Carte de défis avec animation */}
      <div className="mb-6 bg-gradient-to-r from-violet-500/10 to-purple-500/10 dark:from-violet-900/20 dark:to-purple-900/20 rounded-2xl overflow-hidden border border-purple-200 dark:border-purple-900/30 shadow-md relative">
        <div className="absolute top-0 right-0 w-64 h-64 bg-purple-300/20 dark:bg-purple-500/10 rounded-full -mt-20 -mr-20 blur-2xl"></div>
        <div className="absolute bottom-0 left-0 w-40 h-40 bg-indigo-300/20 dark:bg-indigo-500/10 rounded-full -mb-10 -ml-10 blur-xl"></div>

        <div className="p-6 relative z-10">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                Défi hebdomadaire
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-300 mt-1">
                Pratiquez 30 minutes par jour pendant 7 jours consécutifs
              </p>
            </div>
            <div className="flex items-center justify-center w-16 h-16 rounded-full bg-white/80 dark:bg-slate-800/80 border-4 border-purple-100 dark:border-purple-900/40">
              <div className="text-center">
                <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                  5
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400 -mt-1">
                  jours
                </p>
              </div>
            </div>
          </div>

          <div className="mt-4">
            <div className="w-full h-3 bg-white/50 dark:bg-slate-700/50 rounded-full overflow-hidden mb-2">
              <div
                className="h-full bg-gradient-to-r from-violet-500 to-purple-500 rounded-full"
                style={{ width: '70%' }}
              ></div>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-slate-600 dark:text-slate-400">
                Progression: 70%
              </span>
              <span className="text-purple-600 dark:text-purple-400 font-medium">
                5/7 jours
              </span>
            </div>
          </div>

          <div className="mt-4 flex items-center">
            <div className="flex items-center text-amber-600 dark:text-amber-400 mr-3">
              <IconStar size={18} className="mr-1" />
              <span className="text-sm font-medium">+150 points</span>
            </div>
            <div className="flex items-center text-emerald-600 dark:text-emerald-400">
              <IconTrendingUp size={18} className="mr-1" />
              <span className="text-sm font-medium">+3 niveau</span>
            </div>
            <div className="ml-auto">
              <button className="bg-white dark:bg-slate-700 text-purple-600 dark:text-purple-400 border border-purple-200 dark:border-purple-800/30 hover:bg-purple-50 dark:hover:bg-purple-900/20 py-2 px-4 rounded-lg text-sm font-medium transition-colors">
                Voir tous les défis
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="mt-6 mb-6 backdrop-blur-md bg-gradient-to-r from-blue-500/10 to-orange-500/10 dark:from-blue-900/20 dark:to-orange-900/20 rounded-2xl overflow-hidden border border-blue-200/30 dark:border-blue-900/30 shadow-lg relative">
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-300/20 dark:bg-blue-500/10 rounded-full -mt-20 -mr-20 blur-2xl"></div>
        <div className="absolute bottom-0 left-0 w-40 h-40 bg-orange-300/20 dark:bg-orange-500/10 rounded-full -mb-10 -ml-10 blur-xl"></div>

        <div className="p-6 relative z-10">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                Défi hebdomadaire
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-300 mt-1">
                Pratiquez 30 minutes par jour pendant 7 jours consécutifs
              </p>
            </div>
            <div className="flex items-center justify-center w-16 h-16 rounded-full bg-white/80 dark:bg-slate-800/80 border-4 border-blue-100 dark:border-blue-900/40">
              <div className="text-center">
                <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                  5
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400 -mt-1">
                  jours
                </p>
              </div>
            </div>
          </div>

          <div className="mt-4">
            <div className="w-full h-3 bg-white/50 dark:bg-slate-700/50 rounded-full overflow-hidden mb-2">
              <div
                className="h-full bg-gradient-to-r from-blue-500 to-orange-500 rounded-full"
                style={{ width: '70%' }}
              ></div>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-slate-600 dark:text-slate-400">
                Progression: 70%
              </span>
              <span className="text-blue-600 dark:text-blue-400 font-medium">
                5/7 jours
              </span>
            </div>
          </div>

          <div className="mt-4 flex items-center">
            <div className="flex items-center text-orange-600 dark:text-orange-400 mr-3">
              <IconStar size={18} className="mr-1" />
              <span className="text-sm font-medium">+150 points</span>
            </div>
            <div className="flex items-center text-emerald-600 dark:text-emerald-400">
              <IconTrendingUp size={18} className="mr-1" />
              <span className="text-sm font-medium">+3 niveau</span>
            </div>
            <div className="ml-auto">
              <button className="bg-white/80 dark:bg-slate-700/80 text-blue-600 dark:text-blue-400 border border-blue-200/30 dark:border-blue-800/30 hover:bg-blue-50/80 dark:hover:bg-blue-900/20 py-2 px-4 rounded-lg text-sm font-medium transition-colors">
                Voir tous les défis
              </button>
            </div>
          </div>
        </div>
      </div>
      {/* Calendrier de pratique */}
      <div className="mb-6 bg-white dark:bg-slate-800 shadow-md rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-700">
        <div className="p-5">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
              Calendrier de pratique
            </h3>
            <div className="flex space-x-1">
              <button className="p-1 rounded-md bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-600">
                <IconChartBar size={18} />
              </button>
              <button className="p-1 rounded-md bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400">
                <IconClock size={18} />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-7 gap-1 mb-2 text-center">
            {['L', 'M', 'M', 'J', 'V', 'S', 'D'].map((day, i) => (
              <div
                key={i}
                className="text-xs font-medium text-slate-500 dark:text-slate-400"
              >
                {day}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-1 mb-4">
            {Array.from({ length: 28 }).map((_, i) => {
              const intensity = [0, 2, 5, 8, 13, 18, 21, 24, 27].includes(i)
                ? 0
                : [1, 3, 9, 15, 20, 23].includes(i)
                ? 1
                : [4, 10, 11, 17, 22, 25].includes(i)
                ? 2
                : [6, 7, 12, 14, 16, 19, 26].includes(i)
                ? 3
                : 0;

              return (
                <div
                  key={i}
                  className={`h-8 rounded-md flex items-center justify-center text-xs ${
                    intensity === 0
                      ? 'bg-slate-100 dark:bg-slate-700/50 text-slate-400 dark:text-slate-500'
                      : intensity === 1
                      ? 'bg-indigo-100 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400'
                      : intensity === 2
                      ? 'bg-indigo-200 dark:bg-indigo-800/30 text-indigo-700 dark:text-indigo-300'
                      : 'bg-indigo-300 dark:bg-indigo-700/40 text-indigo-800 dark:text-indigo-200'
                  }`}
                >
                  {i + 1}
                </div>
              );
            })}
          </div>

          <div className="flex items-center justify-between">
            <div className="flex space-x-2 items-center">
              <div className="flex space-x-1">
                {[1, 2, 3].map((level) => (
                  <div
                    key={level}
                    className={`w-3 h-3 rounded-sm ${
                      level === 1
                        ? 'bg-indigo-100 dark:bg-indigo-900/20'
                        : level === 2
                        ? 'bg-indigo-200 dark:bg-indigo-800/30'
                        : 'bg-indigo-300 dark:bg-indigo-700/40'
                    }`}
                  />
                ))}
              </div>
              <span className="text-xs text-slate-500 dark:text-slate-400">
                Intensité de pratique
              </span>
            </div>
            <button className="text-indigo-600 dark:text-indigo-400 text-sm font-medium hover:underline">
              Voir rapports détaillés
            </button>
          </div>
        </div>
      </div>

      {/* Tuile d'information supplémentaire en bas de la page */}
      <div className="mt-6">
        <InfoTile
          title="Prochain concert virtuel"
          value="23 Mai 2023 - 19h00"
          description="Rejoignez 48 autres musiciens pour un concert virtuel collaboratif"
          icon={<IconDeviceGamepad2 size={24} />}
          trend={{ value: '12 participants de plus', isPositive: true }}
          className="bg-gradient-to-r from-indigo-500/10 to-purple-500/10 hover:from-indigo-500/20 hover:to-purple-500/20 transition-colors"
        />
      </div>
    </div>
  );
}

export default BentoShadcnExample;
