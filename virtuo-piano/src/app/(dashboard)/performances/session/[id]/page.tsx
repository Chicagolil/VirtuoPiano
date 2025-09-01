import React from 'react';
import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { authOptions } from '@/lib/authoption';
import { IconMusic } from '@tabler/icons-react';

export default async function FavoritesPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    redirect('/auth/login');
  }
  return (
    <div className="w-full p-4 pt-7">
      <div className="max-w-[98.5%] mx-auto bg-transparent shadow-md rounded-2xl p-6 border border-slate-200/20 dark:border-slate-700/20">
        <div className="bg-gradient-to-r from-blue-500/20 via-indigo-500/20 to-orange-400/20 rounded-t-xl p-6 mb-6 -mx-6 -mt-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-xl font-bold text-white flex items-center">
                <IconMusic size={28} className="mr-2 text-orange-300" />
                Détails de la session
              </h1>
            </div>
          </div>
        </div>
        <div className="space-y-6">
          <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
            <h2 className="text-white font-semibold mb-2">Page en travaux</h2>
            <p className="text-white/70 text-sm">
              Cette page affichera les détails pour chaque session de jeu.
            </p>
            <p className="text-white/70 text-sm mt-2">
              Vous pourrez voir les détails comme la distribution des notes, les
              notes obtenues, les erreurs commises, la durée de la session, etc.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
