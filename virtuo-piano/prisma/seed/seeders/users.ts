import { PrismaClient } from '@prisma/client';
import argon2 from 'argon2';
import { faker } from '@faker-js/faker';

export const seedUsers = async (prisma: PrismaClient) => {
  const users = [];

  // Configuration Argon2id
  const argon2Config = {
    type: argon2.argon2id,
    memoryCost: 65536, // 64MB
    timeCost: 3,
    parallelism: 4,
  };

  // Ajouter l'utilisateur spécifique
  users.push({
    userName: 'Chicagolil',
    email: 'ldevroye@gmail.com',
    password: await argon2.hash('Lilian123', argon2Config),
    level: 1,
    preferences: JSON.stringify({
      theme: 'auto',
      notifications: true,
      soundEffects: true,
    }),
  });

  // Générer les autres utilisateurs aléatoires
  for (let i = 0; i < 10; i++) {
    users.push({
      userName: faker.internet.username(),
      email: faker.internet.email(),
      password: await argon2.hash('user123', argon2Config),
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
