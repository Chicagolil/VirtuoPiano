'use client';

import React, { useState, Suspense, lazy } from 'react';
import { Spinner } from '@/components/ui/spinner';
import * as Tabs from '@radix-ui/react-tabs';
import { IconChartBar } from '@tabler/icons-react';

const Heatmap = lazy(() => import('@/features/performances/heatmap'));
const GeneralStats = lazy(() => import('@/features/performances/generalStats'));
const HistoryStats = lazy(() => import('@/features/performances/HistoryStats'));
const PlayedSongs = lazy(() => import('@/features/performances/PlayedSongs'));

export default function PerformancesPage() {
  const [activeTab, setActiveTab] = useState('overview');

  return (
    <div className="w-full p-4 pt-7">
      <div className="max-w-[98.5%] mx-auto bg-transparent shadow-md rounded-2xl p-6 border border-slate-200/20 dark:border-slate-700/20">
        <Tabs.Root
          className="w-full"
          value={activeTab}
          onValueChange={setActiveTab}
        >
          <div className="bg-gradient-to-r from-blue-500/20 via-indigo-500/20 to-orange-400/20 rounded-t-xl p-6 mb-6 -mx-6 -mt-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h1 className="text-xl font-bold text-white flex items-center">
                  <IconChartBar size={28} className="mr-2 text-orange-300" />
                  Suivez votre progression et vos performances
                </h1>
              </div>

              <Tabs.List className="flex p-1 bg-white/20 backdrop-blur-sm rounded-lg">
                <Tabs.Trigger
                  className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                    activeTab === 'overview'
                      ? 'bg-white/90 text-indigo-600 shadow-sm'
                      : 'text-white/80 hover:text-white hover:bg-white/10'
                  }`}
                  value="overview"
                >
                  Vue d'ensemble
                </Tabs.Trigger>
                <Tabs.Trigger
                  className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                    activeTab === 'history'
                      ? 'bg-white/90 text-indigo-600 shadow-sm'
                      : 'text-white/80 hover:text-white hover:bg-white/10'
                  }`}
                  value="history"
                >
                  Historique
                </Tabs.Trigger>
                <Tabs.Trigger
                  className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                    activeTab === 'playedSongs'
                      ? 'bg-white/90 text-indigo-600 shadow-sm'
                      : 'text-white/80 hover:text-white hover:bg-white/10'
                  }`}
                  value="playedSongs"
                >
                  Chansons Jouées
                </Tabs.Trigger>
              </Tabs.List>
            </div>
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

              <GeneralStats onTabChange={setActiveTab} />
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
    </div>
  );
}
