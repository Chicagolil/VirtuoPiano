import { Spinner } from '@/components/ui/spinner';
import SongPerformances from '@/features/performances/SongPerformances';
import { getSongBasicDataAction } from '@/lib/actions/PerformanceSong-actions';
import { authOptions } from '@/lib/authoption';
import { getServerSession } from 'next-auth';
import { Suspense } from 'react';

async function LoadSong({ id }: { id: string }) {
  const song = await getSongBasicDataAction(id);

  if (!song.success) {
    return (
      <div>
        <h1>Chanson non trouvée</h1>
        <p>La chanson que vous recherchez n'existe pas ou a été supprimée.</p>
      </div>
    );
  }

  return <SongPerformances song={song.data} />;
}

export default async function SongPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const session = await getServerSession(authOptions);
  const userId = session?.user?.id;

  if (!userId) {
    return (
      <div>
        <h1>Vous devez être connecté pour accéder à cette page</h1>
      </div>
    );
  }

  return (
    <div>
      <Suspense
        fallback={
          <div className="flex justify-center items-center h-64">
            <div className="flex flex-col items-center">
              <p className="text-white">Chargement de la chanson...</p>
              <Spinner variant="bars" size={32} className="text-white" />
            </div>
          </div>
        }
      >
        <LoadSong id={id} />
      </Suspense>
    </div>
  );
}
