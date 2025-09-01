import React from 'react';
import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { authOptions } from '@/lib/authoption';
import { Heart, Music } from 'lucide-react';
import FavoritesList from '@/features/favorites/FavoritesList';

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
                <Heart size={28} className="mr-2 text-orange-300" />
                Retrouvez vos morceaux favoris
              </h1>
            </div>
          </div>
        </div>
        <div className="space-y-6">
          <div className="flex items-center space-x-3 mb-4">
            <Music size={20} className="text-blue-300" />
            <h3 className="text-lg font-semibold text-white">
              Mes chansons favorites
            </h3>
          </div>
          <FavoritesList />
        </div>
      </div>
    </div>
  );
}
