import { Suspense } from 'react';
import { getListSongs } from '@/lib/services/songs';
import { Spinner } from '@/components/ui/spinner';
import SongsList from '@/features/library/SongsList';
import BentoShadcnExample from '@/features/BentoGrid/BentoShadcnExample';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/authoption';
import { redirect } from 'next/navigation';

// Nouveau composant pour charger les chansons de manière asynchrone
async function LoadSongs({ userId }: { userId: string }) {
  const songs = await getListSongs(userId);
  return <SongsList songs={songs} />;
}

export default async function LibraryPage() {
  const session = await getServerSession(authOptions);
  const userId = session?.user?.id;

  if (!userId) {
    redirect('/auth/login');
  }

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
        {/* Utilisation du nouveau composant à l'intérieur de Suspense */}
        <LoadSongs userId={userId} />
        {/* <BentoShadcnExample /> */}
      </Suspense>
    </div>
  );
}
