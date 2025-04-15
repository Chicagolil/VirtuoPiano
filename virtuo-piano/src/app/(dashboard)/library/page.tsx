import { Suspense } from 'react';
import Songs from '@/features/library/Songs';
import { getSongs } from '@/lib/services/songs';
import { Spinner } from '@/components/ui/spinner';
import SongsList from '@/features/BentoGrid/SongsList';
import BentoShadcnExample from '@/features/BentoGrid/BentoShadcnExample';
import FavoritesBento from '@/features/BentoGrid/FavoritesBento';
import LeaderboardBento from '@/features/BentoGrid/LeaderboardBento';

export default async function LibraryPage() {
  return (
    <div>
      <Suspense
        fallback={
          <div className="flex justify-center items-center h-64">
            <Spinner variant="bars" size={32} className="text-white" />
          </div>
        }
      >
        <SongsLoader />

        <BentoShadcnExample />
        <FavoritesBento />
        <LeaderboardBento />
      </Suspense>
    </div>
  );
}

// Ce composant n'est plus utilisé car nous affichons directement SongsList
async function SongsLoader() {
  const songs = await getSongs();
  return <Songs songs={songs} />;
}
