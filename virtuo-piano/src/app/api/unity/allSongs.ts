import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    const songs = await prisma.songs.findMany({
      include: {
        key: {
          select: {
            id: true,
            name: true,
            notes: true,
          },
        },
      },
      orderBy: {
        title: 'asc',
      },
    });

    // Formatage des données pour Unity
    const formattedSongs = songs.map((song) => ({
      id: song.id,
      title: song.title,
      composer: song.composer || '',
      genre: song.genre || '',
      tempo: song.tempo,
      duration_ms: song.duration_ms,
      notes: song.notes,
      timeSignature: song.timeSignature,
      sourceType: song.SourceType,
      level: song.Level,
      songType: song.SongType,
      key: {
        id: song.key.id,
        name: song.key.name,
        notes: song.key.notes,
      },
      imageUrl: song.imageUrl || '',
      createdAt: song.createdAt.toISOString(),
      releaseDate: song.releaseDate?.toISOString() || null,
    }));

    return NextResponse.json({
      success: true,
      data: formattedSongs,
      count: formattedSongs.length,
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des chansons:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Erreur lors de la récupération des chansons',
        details: error instanceof Error ? error.message : 'Erreur inconnue',
      },
      { status: 500 }
    );
  }
}
