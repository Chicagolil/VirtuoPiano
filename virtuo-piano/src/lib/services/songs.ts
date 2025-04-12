import prisma from '@/lib/prisma';
import type { Songs } from '@prisma/client';

export async function getSongs(): Promise<Songs[]> {
  const songs = await prisma.songs.findMany();
  return songs;
}
