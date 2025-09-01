import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import prisma from '@/lib/prisma';
import { Hands } from '@prisma/client';

// Schéma de validation pour le mode APPRENTISSAGE
const unityLearningScoreSchema = z.object({
  userId: z.string().min(1, "L'ID utilisateur est requis"),
  songId: z.string().min(1, "L'ID de la chanson est requis"),
  correctNotes: z
    .number()
    .int()
    .min(0, 'Le nombre de notes correctes doit être positif'),
  missedNotes: z
    .number()
    .int()
    .min(0, 'Le nombre de notes manquées doit être positif'),
  wrongNotes: z
    .number()
    .int()
    .min(0, 'Le nombre de notes incorrectes doit être positif'),
  hands: z.enum(['right', 'left', 'both']).optional(),
  selectedTempo: z.number().int().min(1).optional(),
  sessionStartTime: z.string().datetime('Format de date invalide'),
  sessionEndTime: z.string().datetime('Format de date invalide'),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validation des données
    const validatedData = unityLearningScoreSchema.parse(body);

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

    // Trouver ou créer le mode Apprentissage
    const gameMode = await prisma.gameMode.upsert({
      where: { name: 'Apprentissage' },
      update: {},
      create: {
        name: 'Apprentissage',
        description: 'Mode apprentissage',
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

    // Créer le score pour le mode apprentissage
    const score = await prisma.scores.create({
      data: {
        correctNotes: validatedData.correctNotes,
        missedNotes: validatedData.missedNotes,
        wrongNotes: validatedData.wrongNotes,
        hands: validatedData.hands as Hands,
        selectedTempo: validatedData.selectedTempo,
        // Champs de jeu à null pour le mode apprentissage
        totalPoints: null,
        maxMultiplier: null,
        maxCombo: null,
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

    // Calculer les statistiques de performance
    const totalNotes =
      validatedData.correctNotes +
      validatedData.missedNotes +
      validatedData.wrongNotes;
    const accuracy =
      totalNotes > 0
        ? Math.round((validatedData.correctNotes / totalNotes) * 100)
        : 0;
    const performance =
      totalNotes > 0
        ? Math.round(
            (validatedData.correctNotes /
              (validatedData.correctNotes + validatedData.wrongNotes)) *
              100
          )
        : 0;

    return NextResponse.json({
      success: true,
      scoreId: score.id,
      message: "Score d'apprentissage enregistré avec succès",
      score: {
        id: score.id,
        correctNotes: score.correctNotes,
        missedNotes: score.missedNotes,
        wrongNotes: score.wrongNotes,
        hands: score.hands,
        selectedTempo: score.selectedTempo,
        sessionStartTime: score.sessionStartTime.toISOString(),
        sessionEndTime: score.sessionEndTime.toISOString(),
        duration: Math.round(
          (sessionEndTime.getTime() - sessionStartTime.getTime()) / 1000
        ), // en secondes
        accuracy,
        performance,
        song: {
          id: score.song.id,
          title: score.song.title,
          composer: score.song.composer,
        },
        mode: {
          id: score.mode.id,
          name: score.mode.name,
        },
        modeType: 'Apprentissage',
        user: {
          id: score.user.id,
          userName: score.user.userName,
        },
      },
    });
  } catch (error) {
    console.error(
      "Erreur lors de l'enregistrement du score d'apprentissage Unity:",
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
        error: "Erreur lors de l'enregistrement du score d'apprentissage",
        details: error instanceof Error ? error.message : 'Erreur inconnue',
      },
      { status: 500 }
    );
  }
}

