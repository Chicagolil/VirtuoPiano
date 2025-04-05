import { PrismaClient } from '@prisma/client';
import { seedKeys } from './seeders/keys';
import { seedUsers } from './seeders/users';
import { seedGameModes } from './seeders/gameModes';
import { seedSongs } from './seeders/songs';
import { seedScores } from './seeders/scores';
import { seedUsersFavorites } from './seeders/usersFavorites';
import { seedUsersCompositions } from './seeders/usersCompositions';
import { seedUsersImports } from './seeders/usersImports';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding keys...');
  await seedKeys(prisma);

  console.log('🌱 Seeding users...');
  await seedUsers(prisma);

  console.log('🌱 Seeding game modes...');
  await seedGameModes(prisma);

  console.log('🌱 Seeding songs...');
  await seedSongs(prisma);

  console.log('🌱 Seeding scores...');
  await seedScores(prisma);

  console.log('🌱 Seeding user favorites...');
  await seedUsersFavorites(prisma);

  console.log('🌱 Seeding user compositions...');
  await seedUsersCompositions(prisma);

  console.log('🌱 Seeding user imports...');
  await seedUsersImports(prisma);
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    console.log('🌱🌱🌱🌱 Fini youpiii 🌱🌱🌱🌱');
  });
