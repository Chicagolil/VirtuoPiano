import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import prisma from '@/lib/prisma';

// Schéma de validation pour le mode JEU
const unityGameScoreSchema = z.object({
  userId: z.string().min(1, "L'ID utilisateur est requis"),
  songId: z.string().min(1, "L'ID de la chanson est requis"),
  totalPoints: z
    .number()
    .int()
    .min(0, 'Les points totaux doivent être positifs'),
  maxMultiplier: z
    .number()
    .int()
    .min(1, 'Le multiplicateur maximum doit être positif'),
  maxCombo: z.number().int().min(0, 'Le combo maximum doit être positif'),
  sessionStartTime: z.string().datetime('Format de date invalide'),
  sessionEndTime: z.string().datetime('Format de date invalide'),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validation des données
    const validatedData = unityGameScoreSchema.parse(body);

    // Vérifier que l'utilisateur existe
    const user = await prisma.user.findUnique({
      where: { id: validatedData.userId },
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

    // Vérifier que la chanson existe
    const song = await prisma.songs.findUnique({
      where: { id: validatedData.songId },
    });

    if (!song) {
      return NextResponse.json(
        {
          success: false,
          error: 'Chanson non trouvée',
        },
        { status: 404 }
      );
    }

    // Trouver ou créer le mode Jeu
    const gameMode = await prisma.gameMode.upsert({
      where: { name: 'Jeu' },
      update: {},
      create: {
        name: 'Jeu',
        description: 'Jeu mode',
      },
    });

    // Convertir les dates
    const sessionStartTime = new Date(validatedData.sessionStartTime);
    const sessionEndTime = new Date(validatedData.sessionEndTime);

    // Vérifier que la session a une durée positive
    if (sessionEndTime <= sessionStartTime) {
      return NextResponse.json(
        {
          success: false,
          error: 'La fin de session doit être après le début',
        },
        { status: 400 }
      );
    }

    // Créer le score pour le mode jeu
    const score = await prisma.scores.create({
      data: {
        totalPoints: validatedData.totalPoints,
        maxMultiplier: validatedData.maxMultiplier,
        maxCombo: validatedData.maxCombo,
        // Champs d'apprentissage à null pour le mode jeu
        correctNotes: null,
        missedNotes: null,
        wrongNotes: null,
        hands: null,
        selectedTempo: null,
        sessionStartTime,
        sessionEndTime,
        user_id: validatedData.userId,
        song_id: validatedData.songId,
        mode_id: gameMode.id,
      },
      include: {
        song: {
          select: {
            id: true,
            title: true,
            composer: true,
          },
        },
        mode: {
          select: {
            id: true,
            name: true,
          },
        },
        user: {
          select: {
            id: true,
            userName: true,
          },
        },
      },
    });

    return NextResponse.json({
      success: true,
      scoreId: score.id,
      message: 'Score de jeu enregistré avec succès',
      score: {
        id: score.id,
        totalPoints: score.totalPoints,
        maxMultiplier: score.maxMultiplier,
        maxCombo: score.maxCombo,
        sessionStartTime: score.sessionStartTime.toISOString(),
        sessionEndTime: score.sessionEndTime.toISOString(),
        duration: Math.round(
          (sessionEndTime.getTime() - sessionStartTime.getTime()) / 1000
        ), // en secondes
        song: {
          id: score.song.id,
          title: score.song.title,
          composer: score.song.composer,
        },
        mode: {
          id: score.mode.id,
          name: score.mode.name,
        },
        modeType: 'Jeu',
        user: {
          id: score.user.id,
          userName: score.user.userName,
        },
      },
    });
  } catch (error) {
    console.error(
      "Erreur lors de l'enregistrement du score de jeu Unity:",
      error
    );

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          success: false,
          error: 'Données invalides',
          details: error.errors.map((err) => ({
            field: err.path.join('.'),
            message: err.message,
          })),
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        success: false,
        error: "Erreur lors de l'enregistrement du score de jeu",
        details: error instanceof Error ? error.message : 'Erreur inconnue',
      },
      { status: 500 }
    );
  }
}
