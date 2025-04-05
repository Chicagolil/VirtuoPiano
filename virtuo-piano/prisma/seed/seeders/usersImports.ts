import { PrismaClient } from '@prisma/client';
import { faker } from '@faker-js/faker';
export const seedUsersImports = async (prisma: PrismaClient) => {
  const users = await prisma.user.findMany();
  const songs = await prisma.songs.findMany();

  if (users.length === 0 || songs.length === 0) {
    console.warn('Users ou Songs manquants');
    return;
  }

  const importsSet = new Set<string>();

  const imports = [];

  for (let i = 0; i < 20; i++) {
    const user = faker.helpers.arrayElement(users);
    const song = faker.helpers.arrayElement(songs);

    const key = `${user.id}-${song.id}`;

    if (!importsSet.has(key)) {
      importsSet.add(key);
      imports.push({ user_id: user.id, song_id: song.id });
    }
  }

  for (const item of imports) {
    await prisma.usersImports.create({
      data: item,
    });
  }
};
