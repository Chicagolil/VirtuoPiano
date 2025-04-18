import { PrismaClient, SourceType, SongType } from '@prisma/client';
import { faker } from '@faker-js/faker';
export const seedSongs = async (prisma: PrismaClient) => {
  const keys = await prisma.key.findMany();
  if (!keys) {
    throw new Error('Aucune gamme trouvée');
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

  for (let i = 0; i < 100; i++) {
    const key = faker.helpers.arrayElement(keys);

    songs.push({
      title: faker.lorem.word(),
      composer: faker.person.fullName(),
      genre: faker.music.genre(),
      tempo: faker.number.int({ min: 40, max: 200 }),
      duration_ms: faker.number.int({ min: 30000, max: 280000 }),
      SongType: faker.helpers.arrayElement(Object.values(SongType)),
      SourceType: faker.helpers.arrayElement(Object.values(SourceType)),
      timeSignature: faker.helpers.arrayElement(['4/4', '3/4', '6/8']),
      Level: faker.number.int({ min: 1, max: 10 }),
      key_id: key.id,
      notes: generateNotes(faker.number.int({ min: 10, max: 30 })),
    });
  }

  for (const song of songs) {
    await prisma.songs.create({
      data: song,
    });
  }
};
