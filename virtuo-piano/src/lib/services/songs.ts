import prisma from '@/lib/prisma';
import { SongType, SourceType } from '@prisma/client';
import { JsonValue } from '@prisma/client/runtime/library';

export type SongList = {
  id: string;
  title: string;
  composer: string | null;
  genre: string | null;
  tempo: number;
  duration_ms: number;
  timeSignature: string;
  SourceType: SourceType;
  notes: JsonValue;
  Level: number;
  imageUrl: string | null;
  SongType: SongType;
  isFavorite: boolean;
  lastPlayed: string;
};

export async function getListSongs(userId?: string): Promise<SongList[]> {
  const songs = await prisma.songs.findMany({
    where: {
      SourceType: 'library',
    },
    include: {
      key: true,
      userFavorites: userId
        ? {
            where: {
              user_id: userId,
            },
          }
        : false,
      scores: userId
        ? {
            where: {
              user_id: userId,
            },
            orderBy: {
              played_at: 'desc',
            },
            take: 1,
          }
        : false,
    },
  });

  const songsNewAttributes = songs.map((song) => ({
    ...song,
    isFavorite: userId ? song.userFavorites.length > 0 : false,
    lastPlayed:
      userId && song.scores.length > 0
        ? song.scores[0].played_at.toISOString()
        : '',
  }));

  return songsNewAttributes;
}
