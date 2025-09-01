import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import prisma from '@/lib/prisma';
import { uploadImage } from '@/lib/cloudinary';
import { SourceType, SongType } from '@prisma/client';
import { convertMidiToSongFormat } from '@/common/utils/function';

// Schéma de validation pour les données Unity avec fichier MIDI
const unityRecordSongSchema = z.object({
  title: z.string().min(1, 'Le titre est requis'),
  composer: z.string().optional().nullable(),
  difficulty: z.number().int().min(1).max(10),
  genre: z.string().optional().nullable(),
  songType: z.enum(['song', 'scaleEx', 'chordEx', 'rythmEx', 'arpeggioEx']),
  keyName: z.string().min(1, 'La gamme est requise'),
  imageDataUrl: z.string().optional().nullable(), // Image en base64
  midiFile: z.string().min(1, 'Le fichier MIDI en base64 est requis'), // MIDI en base64
  userId: z.string().min(1, "L'ID utilisateur est requis"),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validation des données
    const validatedData = unityRecordSongSchema.parse(body);

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

    // Convertir le fichier MIDI en base64 en File
    let midiConversionResult;
    try {
      // Décoder le base64 en ArrayBuffer
      const base64Data = validatedData.midiFile.replace(
        /^data:audio\/midi;base64,/,
        ''
      );
      const binaryString = atob(base64Data);
      const bytes = new Uint8Array(binaryString.length);
      for (let i = 0; i < binaryString.length; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }

      // Créer un File à partir de l'ArrayBuffer
      const midiFile = new File([bytes], 'unity-song.mid', {
        type: 'audio/midi',
      });

      // Convertir le MIDI en format compatible
      midiConversionResult = await convertMidiToSongFormat(midiFile);
    } catch (error) {
      console.error('Erreur lors de la conversion MIDI:', error);
      return NextResponse.json(
        {
          success: false,
          error: 'Impossible de convertir le fichier MIDI',
          details:
            error instanceof Error ? error.message : 'Erreur de conversion',
        },
        { status: 400 }
      );
    }

    // Uploader l'image si fournie
    let imageUrl: string | undefined;
    if (validatedData.imageDataUrl) {
      try {
        imageUrl = await uploadImage(validatedData.imageDataUrl);
      } catch (error) {
        console.warn("Impossible d'uploader l'image:", error);
        // Continuer sans image
      }
    }

    // Trouver ou créer la Key
    const key = await prisma.key.upsert({
      where: { name: validatedData.keyName },
      update: {},
      create: { name: validatedData.keyName, notes: [] },
    });

    // Créer la chanson avec les données converties du MIDI
    const song = await prisma.songs.create({
      data: {
        imageUrl,
        title: validatedData.title,
        composer: validatedData.composer || null,
        genre: validatedData.genre || null,
        tempo: midiConversionResult.tempo,
        duration_ms: midiConversionResult.duration_ms,
        notes: midiConversionResult.notes as any,
        timeSignature: midiConversionResult.timeSignature,
        SourceType: 'import' as SourceType,
        Level: validatedData.difficulty,
        SongType: validatedData.songType as SongType,
        key_id: key.id,
      },
    });

    // Lier à l'utilisateur via UsersImports
    await prisma.usersImports.create({
      data: {
        user_id: validatedData.userId,
        song_id: song.id,
      },
    });

    return NextResponse.json({
      success: true,
      songId: song.id,
      message: 'Chanson enregistrée avec succès',
      song: {
        id: song.id,
        title: song.title,
        composer: song.composer,
        genre: song.genre,
        tempo: song.tempo,
        duration_ms: song.duration_ms,
        timeSignature: song.timeSignature,
        level: song.Level,
        songType: song.SongType,
        key: {
          id: key.id,
          name: key.name,
        },
        imageUrl: song.imageUrl,
        createdAt: song.createdAt.toISOString(),
      },
    });
  } catch (error) {
    console.error(
      "Erreur lors de l'enregistrement de la chanson Unity:",
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
        error: "Erreur lors de l'enregistrement de la chanson",
        details: error instanceof Error ? error.message : 'Erreur inconnue',
      },
      { status: 500 }
    );
  }
}

// Méthode GET pour récupérer les informations nécessaires (clés, types de chansons, etc.)
export async function GET() {
  try {
    // Récupérer toutes les clés disponibles
    const keys = await prisma.key.findMany({
      select: {
        id: true,
        name: true,
      },
      orderBy: {
        name: 'asc',
      },
    });

    // Types de chansons disponibles
    const songTypes = [
      { value: 'song', label: 'Chanson' },
      { value: 'scaleEx', label: 'Gammes' },
      { value: 'chordEx', label: 'Accords' },
      { value: 'rythmEx', label: 'Exercice rythmique' },
      { value: 'arpeggioEx', label: 'Arpèges' },
    ];

    return NextResponse.json({
      success: true,
      data: {
        keys,
        songTypes,
        maxDifficulty: 10,
        minDifficulty: 1,
      },
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des métadonnées:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Erreur lors de la récupération des métadonnées',
        details: error instanceof Error ? error.message : 'Erreur inconnue',
      },
      { status: 500 }
    );
  }
}
