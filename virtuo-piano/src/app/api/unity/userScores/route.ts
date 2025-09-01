import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const songId = searchParams.get('songId');
    const modeName = searchParams.get('modeName');
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

    if (songId) {
      whereClause.song_id = songId;
    }

    if (modeName) {
      whereClause.mode = {
        name: modeName,
      };
    }

    // Récupérer les scores
    const scores = await prisma.scores.findMany({
      where: whereClause,
      include: {
        song: {
          select: {
            id: true,
            title: true,
            composer: true,
            imageUrl: true,
            Level: true,
            SongType: true,
          },
        },
        mode: {
          select: {
            id: true,
            name: true,
            description: true,
          },
        },
      },
      orderBy: {
        sessionStartTime: 'desc',
      },
      take: limit,
      skip: offset,
    });

    // Formater les données pour Unity
    const formattedScores = scores.map((score) => {
      const totalNotes =
        (score.correctNotes || 0) +
        (score.missedNotes || 0) +
        (score.wrongNotes || 0);
      const accuracy =
        totalNotes > 0
          ? Math.round(((score.correctNotes || 0) / totalNotes) * 100)
          : 0;
      const performance =
        totalNotes > 0
          ? Math.round(
              ((score.correctNotes || 0) /
                ((score.correctNotes || 0) + (score.wrongNotes || 0))) *
                100
            )
          : 0;
      const duration = Math.round(
        (score.sessionEndTime.getTime() - score.sessionStartTime.getTime()) /
          1000
      );

      return {
        id: score.id,
        correctNotes: score.correctNotes || 0,
        missedNotes: score.missedNotes || 0,
        wrongNotes: score.wrongNotes || 0,
        hands: score.hands,
        selectedTempo: score.selectedTempo,
        totalPoints: score.totalPoints || 0,
        maxMultiplier: score.maxMultiplier || 0,
        maxCombo: score.maxCombo || 0,
        sessionStartTime: score.sessionStartTime.toISOString(),
        sessionEndTime: score.sessionEndTime.toISOString(),
        duration, // en secondes
        accuracy,
        performance,
        song: {
          id: score.song.id,
          title: score.song.title,
          composer: score.song.composer,
          imageUrl: score.song.imageUrl,
          level: score.song.Level,
          songType: score.song.SongType,
        },
        mode: {
          id: score.mode.id,
          name: score.mode.name,
          description: score.mode.description,
        },
      };
    });

    // Compter le total pour la pagination
    const totalCount = await prisma.scores.count({
      where: whereClause,
    });

    return NextResponse.json({
      success: true,
      data: formattedScores,
      pagination: {
        currentPage: Math.floor(offset / limit) + 1,
        totalPages: Math.ceil(totalCount / limit),
        totalScores: totalCount,
        hasNextPage: offset + limit < totalCount,
        hasPreviousPage: offset > 0,
        limit,
        offset,
      },
    });
  } catch (error) {
    console.error(
      'Erreur lors de la récupération des scores utilisateur:',
      error
    );
    return NextResponse.json(
      {
        success: false,
        error: 'Erreur lors de la récupération des scores',
        details: error instanceof Error ? error.message : 'Erreur inconnue',
      },
      { status: 500 }
    );
  }
}

