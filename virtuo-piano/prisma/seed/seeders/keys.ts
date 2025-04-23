import { PrismaClient } from '@prisma/client';
import { faker } from '@faker-js/faker';

export const seedKeys = async (prisma: PrismaClient) => {
  const notes = [
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
  const keyNames = [
    'C major',
    'D major',
    'E major',
    'F major',
    'G major',
    'A major',
    'B major',
    'C minor',
    'D minor',
    'E minor',
    'F minor',
    'G minor',
    'A minor',
  ];
  const keys = [];
  for (let i = 0; i < 7; i++) {
    keys.push({
      name: faker.helpers.arrayElement(keyNames),
      notes: faker.helpers.shuffle(notes).slice(0, 7),
    });
  }

  for (const key of keys) {
    await prisma.key.upsert({
      where: { name: key.name },
      update: {},
      create: key,
    });
  }
};
