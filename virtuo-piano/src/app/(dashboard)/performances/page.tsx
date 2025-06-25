'use client';

import React, { useState, Suspense, lazy } from 'react';
import { Spinner } from '@/components/ui/spinner';
import * as Tabs from '@radix-ui/react-tabs';
import { IconChartBar } from '@tabler/icons-react';

const Heatmap = lazy(() => import('@/features/performances/heatmap'));
const GeneralStats = lazy(() => import('@/features/performances/GeneralStats'));
const HistoryStats = lazy(() => import('@/features/performances/HistoryStats'));
const PlayedSongs = lazy(() => import('@/features/performances/PlayedSongs'));

export default function PerformancesPage() {
  const [activeTab, setActiveTab] = useState('overview');

  return (
    <div className="w-full p-4">
      <Tabs.Root
        className="w-full"
        defaultValue="overview"
        onValueChange={setActiveTab}
      >
        <div className="flex  flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
          <div>
            <h1 className="text-xl text-white font-bold text-slate-900  flex items-center">
              <IconChartBar size={28} className="mr-2 text-indigo-500" />
              Suivez votre progression et vos performances
            </h1>
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
            <GeneralStats />
          </Suspense>
        </Tabs.Content>

        <Tabs.Content value="history" className="focus:outline-none">
          <Suspense
            fallback={
              <div className="flex justify-center items-center h-64">
                <Spinner variant="bars" size={32} className="text-white" />
              </div>
            }
          >
            <HistoryStats />
          </Suspense>
        </Tabs.Content>

        <Tabs.Content value="playedSongs" className="focus:outline-none">
          <Suspense
            fallback={
              <div className="flex justify-center items-center h-64">
                <Spinner variant="bars" size={32} className="text-white" />
              </div>
            }
          >
            <PlayedSongs />
          </Suspense>
        </Tabs.Content>
      </Tabs.Root>
    </div>
  );
}
