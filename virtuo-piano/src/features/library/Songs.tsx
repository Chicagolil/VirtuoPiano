'use client';

import type { Songs } from '@prisma/client';
import BentoGrid from '../BentoGrid/grid';

interface SongsProps {
  songs: Songs[];
}
export default function Songs({ songs }: SongsProps) {
  return (
    <div>
      <h1>Songs</h1>
      <ul>
        {songs.map((song) => (
          <li key={song.id}>{song.title}</li>
        ))}
      </ul>
      <BentoGrid />
    </div>
  );
}
