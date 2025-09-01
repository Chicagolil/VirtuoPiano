import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const songType = searchParams.get('songType');
    const genre = searchParams.get('genre');
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = parseInt(searchParams.get('offset') || '0');

    if (!userId) {
      return NextResponse.json(
        {
          success: false,
          error: 'userId est requis',
        },
        { status: 400 }
      );
    }

    // Vérifier que l'utilisateur existe
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          error: 'Utilisateur non trouvé',
        },
        { status: 404 }
      );
    }

    // Construire les filtres
    const whereClause: any = {
      user_id: userId,
    };

    // Récupérer les chansons importées par l'utilisateur
    const userImports = await prisma.usersImports.findMany({
      where: whereClause,
      include: {
        song: {
          include: {
            key: {
              select: {
                id: true,
                name: true,
                notes: true,
              },
            },
          },
        },
      },
      orderBy: {
        song: {
          createdAt: 'desc',
        },
      },
    });

    // Récupérer toutes les chansons de la librairie
    const allLibrarySongs = await prisma.songs.findMany({
      where: {
        SourceType: 'library',
      },
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

    // Combiner les chansons importées et de la librairie
    const importedSongs = userImports.map((ui) => ({
      ...ui.song,
      source: 'import' as const,
    }));

    const librarySongs = allLibrarySongs.map((song) => ({
      ...song,
      source: 'library' as const,
    }));

    // Dédupliquer les chansons (priorité aux imports)
    const songMap = new Map();

    // Ajouter d'abord les imports
    importedSongs.forEach((song) => {
      songMap.set(song.id, song);
    });

    // Ajouter les chansons de la librairie si pas déjà présentes
    librarySongs.forEach((song) => {
      if (!songMap.has(song.id)) {
        songMap.set(song.id, song);
      }
    });

    let filteredSongs = Array.from(songMap.values());

    if (songType) {
      filteredSongs = filteredSongs.filter(
        (song) => song.SongType === songType
      );
    }

    if (genre) {
      filteredSongs = filteredSongs.filter((song) => song.genre === genre);
    }

    // Appliquer la pagination
    const paginatedSongs = filteredSongs.slice(offset, offset + limit);

    // Formater les données pour Unity
    const formattedSongs = paginatedSongs.map((song) => ({
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
      source: song.source, // 'import' ou 'library'
    }));

    // Compter le total pour la pagination (imports + librairie)
    const totalImports = await prisma.usersImports.count({
      where: whereClause,
    });

    // Compter toutes les chansons de la librairie
    const totalLibrarySongs = await prisma.songs.count({
      where: {
        SourceType: 'library',
      },
    });

    // Calculer le total réel après déduplication
    const totalCount = filteredSongs.length;

    return NextResponse.json({
      success: true,
      data: formattedSongs,
      pagination: {
        currentPage: Math.floor(offset / limit) + 1,
        totalPages: Math.ceil(totalCount / limit),
        totalSongs: totalCount,
        hasNextPage: offset + limit < totalCount,
        hasPreviousPage: offset > 0,
        limit,
        offset,
      },
    });
  } catch (error) {
    console.error(
      'Erreur lors de la récupération des chansons utilisateur:',
      error
    );
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
