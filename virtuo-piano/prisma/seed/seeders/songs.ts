import { PrismaClient, SourceType, SongType } from '@prisma/client';
import { faker } from '@faker-js/faker';
import { uploadImage } from '../../../src/lib/cloudinary';
import path from 'path';
import { Note } from '@/common/types/songs';

export const seedSongs = async (prisma: PrismaClient) => {
  const keys = await prisma.key.findMany();
  if (!keys) {
    throw new Error('Aucune gamme trouvée');
  }

  // Upload de l'image par défaut vers Cloudinary
  const defaultImagePath = path.join(
    process.cwd(),
    'public',
    'songDefault',
    'generated-9258201_1280.png'
  );
  let defaultImageUrl: string;

  try {
    defaultImageUrl = await uploadImage(defaultImagePath);
    console.log('✅ Image par défaut uploadée avec succès vers Cloudinary');
  } catch (error) {
    console.error("❌ Erreur lors de l'upload de l'image par défaut:", error);
    throw error;
  }

  const hands = ['left', 'right'];
  const fingers = [1, 2, 3, 4, 5];
  const noteNames = [
    'C',
    'C#',
    'D',
    'D#',
    'E',
    'F',
    'F#',
    'G',
    'G#',
    'A',
    'A#',
    'B',
  ];
  const octaves = [0, 1, 2, 3, 4, 5, 6, 7, 8];
  const possibleDurations = [0.5, 1, 1.5, 2, 4];
  const generateNotes = (count: number) => {
    const notes = [];
    let currentStartBeat = 0;

    for (let i = 0; i < count; i++) {
      const durationInBeats = faker.helpers.arrayElement(possibleDurations);
      notes.push({
        note: `${faker.helpers.arrayElement(
          noteNames
        )}${faker.helpers.arrayElement(octaves)}`,
        durationInBeats,
        startBeat: currentStartBeat,
        finger: faker.helpers.arrayElement(fingers),
        hand: faker.helpers.arrayElement(hands),
      });
      currentStartBeat += durationInBeats;
    }
    return notes;
  };

  const computeDuration = (notes: Note[], tempo: number) => {
    const totalBeats = notes.reduce(
      (acc, note) => acc + note.durationInBeats,
      0
    );
    const durationInMs = (totalBeats * 60000) / tempo;
    return durationInMs;
  };

  const songs = [];
  const genres = [
    'Classique',
    'Jazz',
    'Blues',
    'Rock',
    'Pop',
    'Folk',
    'Country',
    'R&B',
    'Soul',
    'Funk',
  ];

  const myNotes = [
    {
      note: 'C4',
      durationInBeats: 1.0,
      startBeat: 0.0,
      finger: 1,
      hand: 'right',
    },
    {
      note: 'D4',
      durationInBeats: 1.0,
      startBeat: 1.0,
      finger: 2,
      hand: 'right',
    },
    {
      note: 'E4',
      durationInBeats: 1.0,
      startBeat: 2.0,
      finger: 3,
      hand: 'right',
    },
    {
      note: 'F4',
      durationInBeats: 1.0,
      startBeat: 3.0,
      finger: 1,
      hand: 'right',
    },
    {
      note: 'G4',
      durationInBeats: 1.0,
      startBeat: 4.0,
      finger: 2,
      hand: 'right',
    },
    {
      note: 'A4',
      durationInBeats: 1.0,
      startBeat: 5.0,
      finger: 3,
      hand: 'left',
    },
    {
      note: 'B4',
      durationInBeats: 1.0,
      startBeat: 6.0,
      finger: 4,
      hand: 'left',
    },
    {
      note: 'C5',
      durationInBeats: 1.0,
      startBeat: 7.0,
      finger: 5,
      hand: 'left',
    },
  ];

  const mySong = {
    title: 'La seule Vraie Chanson',
    composer: 'Chicagolil',
    genre: 'C majeur',
    tempo: 120,
    duration_ms: computeDuration(myNotes, 120),
    SongType: SongType.scaleEx,
    SourceType: SourceType.library,
    timeSignature: '4/4',
    Level: 1,
    key_id: keys[0].id,
    notes: myNotes,
    imageUrl: defaultImageUrl,
    releaseDate: faker.date.past({ years: 50 }),
  };

  for (let i = 0; i < 100; i++) {
    const key = faker.helpers.arrayElement(keys);
    const generatedNotes = generateNotes(
      faker.number.int({ min: 10, max: 30 })
    );

    songs.push({
      title: faker.lorem.word(),
      composer: faker.person.fullName(),
      genre: faker.helpers.arrayElement(genres),
      tempo: faker.number.int({ min: 40, max: 200 }),
      duration_ms: computeDuration(
        generatedNotes,
        faker.number.int({ min: 40, max: 200 })
      ),
      SongType: faker.helpers.arrayElement(Object.values(SongType)),
      SourceType: faker.helpers.arrayElement(Object.values(SourceType)),
      timeSignature: faker.helpers.arrayElement(['4/4', '3/4', '6/8']),
      Level: faker.number.int({ min: 1, max: 10 }),
      key_id: key.id,
      notes: generatedNotes,
      imageUrl: defaultImageUrl,
      releaseDate: faker.date.past({ years: 50 }),
    });
  }
  songs.push(mySong);

  for (const song of songs) {
    await prisma.songs.create({
      data: song,
    });
  }
};
