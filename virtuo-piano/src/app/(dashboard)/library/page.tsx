import { Suspense } from 'react';
import { getListSongs } from '@/lib/services/songs';
import { Spinner } from '@/components/ui/spinner';
import SongsList from '@/features/library/SongsList';
import BentoShadcnExample from '@/features/BentoGrid/BentoShadcnExample';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/authoption';
import { redirect } from 'next/navigation';

export default async function LibraryPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    redirect('/auth/login');
  }
  console.log(session?.user?.id);
  const songs = await getListSongs(session?.user?.id);
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
        <BentoShadcnExample />
      </Suspense>
    </div>
  );
}
