import { PrismaClient } from '@prisma/client';
import { faker } from '@faker-js/faker';
export const seedUsersFavorites = async (prisma: PrismaClient) => {
  const users = await prisma.user.findMany();
  const songs = await prisma.songs.findMany();

  if (users.length === 0 || songs.length === 0) {
    console.warn('Users ou Songs manquants');
    return;
  }

  const favoritesSet = new Set<string>();

  const favorites = [];

  for (let i = 0; i < 20; i++) {
    const user = faker.helpers.arrayElement(users);
    const song = faker.helpers.arrayElement(songs);

    const key = `${user.id}-${song.id}`;

    if (!favoritesSet.has(key)) {
      favoritesSet.add(key);
      favorites.push({ user_id: user.id, song_id: song.id });
    }
  }

  for (const favorite of favorites) {
    await prisma.usersFavorites.create({
      data: favorite,
    });
  }
};
