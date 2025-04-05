import { PrismaClient } from '@prisma/client';
import { faker } from '@faker-js/faker';

export const seedKeys = async (prisma: PrismaClient) => {
  const notes = ['C', 'D', 'E', 'F', 'G', 'A', 'B'];
  const keyNames = [
    'C major',
    'D major',
    'E major',
    'F major',
    'G major',
    'A major',
    'B major',
  ];
  const keys = [];
  for (let i = 0; i < 7; i++) {
    keys.push({
      name: faker.helpers.arrayElement(keyNames),
      notes: faker.helpers.shuffle(notes),
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
