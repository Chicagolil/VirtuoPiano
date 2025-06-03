import { PrismaClient, SourceType, SongType } from '@prisma/client';
import { faker } from '@faker-js/faker';
import { uploadImage } from '../../../src/lib/cloudinary';
import path from 'path';

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
  const noteNames = ['C', 'D', 'E', 'F', 'G', 'A', 'B'];
  const octaves = [3, 4, 5];

  const generateNotes = (count: number) => {
    const notes = [];
    let currentStart = 0;

    for (let i = 0; i < count; i++) {
      const duration = faker.number.int({ min: 100, max: 1000 });
      notes.push({
        note: `${faker.helpers.arrayElement(
          noteNames
        )}${faker.helpers.arrayElement(octaves)}`,
        duration,
        start: currentStart,
        finger: faker.helpers.arrayElement(fingers),
        hand: faker.helpers.arrayElement(hands),
      });
      currentStart += duration;
    }
    return notes;
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
      duration: 1000,
      start: 0,
      finger: 1,
      hand: 'right',
    },
    {
      note: 'D4',
      duration: 1000,
      start: 1000,
      finger: 2,
      hand: 'right',
    },
    {
      note: 'E4',
      duration: 1000,
      start: 2000,
      finger: 3,
      hand: 'right',
    },
    {
      note: 'F4',
      duration: 1000,
      start: 3000,
      finger: 1,
      hand: 'right',
    },
    {
      note: 'G4',
      duration: 1000,
      start: 4000,
      finger: 2,
      hand: 'right',
    },
    {
      note: 'A4',
      duration: 1000,
      start: 5000,
      finger: 3,
      hand: 'right',
    },
    {
      note: 'B4',
      duration: 1000,
      start: 6000,
      finger: 4,
      hand: 'right',
    },
    {
      note: 'C5',
      duration: 1000,
      start: 7000,
      finger: 5,
      hand: 'right',
    },
  ];

  const mySong = {
    title: 'La seule Vraie Chanson',
    composer: 'Chicagolil',
    genre: 'C majeur',
    tempo: 120,
    duration_ms: myNotes.reduce((acc, note) => acc + note.duration, 0),
    SongType: SongType.scaleEx,
    SourceType: SourceType.library,
    timeSignature: '4/4',
    Level: 1,
    key_id: keys[0].id,
    notes: myNotes,
    imageUrl: defaultImageUrl,
  };

  for (let i = 0; i < 100; i++) {
    const key = faker.helpers.arrayElement(keys);

    songs.push({
      title: faker.lorem.word(),
      composer: faker.person.fullName(),
      genre: faker.helpers.arrayElement(genres),
      tempo: faker.number.int({ min: 40, max: 200 }),
      duration_ms: faker.number.int({ min: 30000, max: 280000 }),
      SongType: faker.helpers.arrayElement(Object.values(SongType)),
      SourceType: faker.helpers.arrayElement(Object.values(SourceType)),
      timeSignature: faker.helpers.arrayElement(['4/4', '3/4', '6/8']),
      Level: faker.number.int({ min: 1, max: 10 }),
      key_id: key.id,
      notes: generateNotes(faker.number.int({ min: 10, max: 30 })),
      imageUrl: defaultImageUrl,
    });
  }
  songs.push(mySong);

  for (const song of songs) {
    await prisma.songs.create({
      data: song,
    });
  }
};
