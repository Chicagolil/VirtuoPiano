import { Suspense } from 'react';
import Songs from '@/features/library/Songs';
import { getSongs } from '@/lib/services/songs';
import { Spinner } from '@/components/ui/spinner';
import SongsList from '@/features/BentoGrid/SongsList';
import BentoShadcnExample from '@/features/BentoGrid/BentoShadcnExample';
import FavoritesBento from '@/features/BentoGrid/FavoritesBento';
import LeaderboardBento from '@/features/BentoGrid/LeaderboardBento';

export default async function LibraryPage() {
  const songs = await getSongs();
  return (
    <div>
      <Suspense
        fallback={
          <div className="flex justify-center items-center h-64">
            <div className="flex flex-col items-center">
              <p className="text-white">Chargement des chansons...</p>
              <Spinner variant="bars" size={32} className="text-white" />
            </div>
          </div>
        }
      >
        <SongsList songs={songs} />
        <Songs />;
        <BentoShadcnExample />
      </Suspense>
    </div>
  );
}
