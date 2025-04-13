import { Suspense } from 'react';
import Songs from '@/features/library/Songs';
import { getSongs } from '@/lib/services/songs';
import { Spinner } from '@/components/ui/spinner';

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
      </Suspense>
    </div>
  );
}

async function SongsLoader() {
  const songs = await getSongs();
  return <Songs songs={songs} />;
}
