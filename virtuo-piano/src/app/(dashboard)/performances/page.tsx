'use client';

import React, { useState, Suspense, lazy } from 'react';
import { Spinner } from '@/components/ui/spinner';
import * as Tabs from '@radix-ui/react-tabs';
import { IconChartBar } from '@tabler/icons-react';

const Heatmap = lazy(() => import('@/features/performances/heatmap'));
const BentoShadcnExample = lazy(
  () => import('@/features/performances/generalStats')
);

export default function PerformancesPage() {
  const [activeTab, setActiveTab] = useState('overview');

  return (
    <div className="w-full p-4">
      <Tabs.Root
        className="w-full"
        defaultValue="overview"
        onValueChange={setActiveTab}
      >
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center">
              <IconChartBar size={24} className="mr-2 text-indigo-500" />
              Performances
            </h1>
            <p className="text-slate-500 dark:text-slate-400 mt-1">
              Suivez votre progression et vos performances
            </p>
          </div>

          <Tabs.List className="flex p-1 bg-slate-100 dark:bg-slate-800 rounded-lg">
            <Tabs.Trigger
              className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                activeTab === 'overview'
                  ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
              value="overview"
            >
              Vue d'ensemble
            </Tabs.Trigger>
            <Tabs.Trigger
              className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                activeTab === 'history'
                  ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
              value="history"
            >
              Historique
            </Tabs.Trigger>
            <Tabs.Trigger
              className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                activeTab === 'playedSongs'
                  ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
              value="playedSongs"
            >
              Chansons Jouées
            </Tabs.Trigger>
          </Tabs.List>
        </div>

        <Tabs.Content value="overview" className="focus:outline-none">
          <Suspense
            fallback={
              <div className="flex justify-center items-center h-64">
                <Spinner variant="bars" size={32} className="text-white" />
              </div>
            }
          >
            <Heatmap />
            <BentoShadcnExample />
          </Suspense>
        </Tabs.Content>

        <Tabs.Content value="history" className="focus:outline-none">
          <div className="text-center p-8 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
              Historique des sessions
            </h3>
            <p className="text-slate-500 dark:text-slate-400 mt-2">
              Cette section affichera l'historique complet de vos sessions de
              jeu.
            </p>
          </div>
        </Tabs.Content>

        <Tabs.Content value="playedSongs" className="focus:outline-none">
          <div className="text-center p-8 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
              Chansons Jouées
            </h3>
            <p className="text-slate-500 dark:text-slate-400 mt-2">
              Cette section listera toutes les chansons que vous avez jouées,
              avec vos statistiques pour chacune.
            </p>
          </div>
        </Tabs.Content>
      </Tabs.Root>
    </div>
  );
}
