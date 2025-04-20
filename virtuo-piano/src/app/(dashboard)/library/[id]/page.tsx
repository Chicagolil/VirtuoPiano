import Song from '@/features/library/Song';
import { getSongById, SongById } from '@/lib/actions/songs';
import { authOptions } from '@/lib/authoption';
import { getServerSession } from 'next-auth';

export default async function SongPage({ params }: { params: { id: string } }) {
  const { id } = await params;
  const song = await getSongById(id);
  const session = await getServerSession(authOptions);
  const userId = session?.user?.id;

  if (!userId) {
    return (
      <div>
        <h1>Vous devez être connecté pour accéder à cette page</h1>
      </div>
    );
  }

  if (!song) {
    return (
      <div>
        <h1>Chanson non trouvée</h1>
        <p>La chanson que vous recherchez n'existe pas ou a été supprimée.</p>
      </div>
    );
  }

  return (
    <div>
      <Song song={song as SongById} userId={userId} />
    </div>
  );
}
