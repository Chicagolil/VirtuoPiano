'use client';

import type { Songs } from '@prisma/client';
import SongsList from '../BentoGrid/SongsList';

interface SongsProps {
  songs: Songs[];
}
export default function Songs({ songs }: SongsProps) {
  return <SongsList />;
}
