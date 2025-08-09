'use client';

import { useState } from 'react';
import * as Tabs from '@radix-ui/react-tabs';
import { IconUser } from '@tabler/icons-react';

import ProfilTab from './ProfilTab';
import PrivacyTab from './PrivacyTab';
import DataTab from './DataTab';

interface AccountPageProps {
  //   user: User;
  user: string;
}

export default function AccountPage({ user }: AccountPageProps) {
  const [activeTab, setActiveTab] = useState<string>('profile');

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
                  <IconUser size={28} className="mr-2 text-orange-300" />
                  Gérez votre compte et vos données personnelles
                </h1>
              </div>

              <Tabs.List className="flex p-1 bg-white/20 backdrop-blur-sm rounded-lg">
                <Tabs.Trigger
                  className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                    activeTab === 'profile'
                      ? 'bg-white/90 text-indigo-600 shadow-sm'
                      : 'text-white/80 hover:text-white hover:bg-white/10'
                  }`}
                  value="profile"
                >
                  Profil
                </Tabs.Trigger>
                <Tabs.Trigger
                  className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                    activeTab === 'privacy'
                      ? 'bg-white/90 text-indigo-600 shadow-sm'
                      : 'text-white/80 hover:text-white hover:bg-white/10'
                  }`}
                  value="privacy"
                >
                  Confidentialité
                </Tabs.Trigger>
                <Tabs.Trigger
                  className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                    activeTab === 'data'
                      ? 'bg-white/90 text-indigo-600 shadow-sm'
                      : 'text-white/80 hover:text-white hover:bg-white/10'
                  }`}
                  value="data"
                >
                  Mes Données
                </Tabs.Trigger>
              </Tabs.List>
            </div>
          </div>
          <Tabs.Content value="profile" className="focus:outline-none">
            <ProfilTab />
          </Tabs.Content>

          <Tabs.Content value="privacy" className="focus:outline-none">
            <PrivacyTab />
          </Tabs.Content>

          <Tabs.Content value="data" className="focus:outline-none">
            <DataTab />
          </Tabs.Content>
        </Tabs.Root>
      </div>
    </div>
  );
}
