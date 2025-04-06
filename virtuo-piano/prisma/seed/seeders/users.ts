import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import { faker } from '@faker-js/faker';

export const seedUsers = async (prisma: PrismaClient) => {
  const users = [];

  for (let i = 0; i < 10; i++) {
    users.push({
      userName: faker.internet.username(),
      email: faker.internet.email(),
      password: await bcrypt.hash('user123', 10),
      level: faker.number.int({ min: 1, max: 20 }),
      preferences: JSON.stringify({
        theme: faker.helpers.arrayElement(['light', 'dark', 'auto']),
        notifications: faker.datatype.boolean(),
        soundEffects: faker.datatype.boolean(),
      }),
    });
  }

  for (const user of users) {
    await prisma.user.upsert({
      where: { email: user.email },
      update: {},
      create: user,
    });
  }
};
