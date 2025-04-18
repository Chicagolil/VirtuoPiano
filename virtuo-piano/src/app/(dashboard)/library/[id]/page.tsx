import Song from '@/features/library/Song';
import { getSongById } from '@/lib/actions/songs';

export default async function SongPage({ params }: { params: { id: string } }) {
  const { id } = await params;
  const song = await getSongById(id);

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
      <Song song={song} />
    </div>
  );
}
