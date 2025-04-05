import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function cleanDatabase() {
  console.log('🧹 Nettoyage de la base de données...');
  try {
    // Suppression des tables de jonction
    await prisma.usersImports.deleteMany();
    console.log('✓ UsersImports supprimés');

    await prisma.usersFavorites.deleteMany();
    console.log('✓ UsersFavorites supprimés');

    await prisma.usersCompositions.deleteMany();
    console.log('✓ UsersCompositions supprimés');

    // Suppression des scores
    await prisma.scores.deleteMany();
    console.log('✓ Scores supprimés');

    // Suppression des chansons
    await prisma.songs.deleteMany();
    console.log('✓ Songs supprimés');

    // Suppression des utilisateurs
    await prisma.user.deleteMany();
    console.log('✓ Users supprimés');

    // Suppression des modes de jeu
    await prisma.gameMode.deleteMany();
    console.log('✓ GameModes supprimés');

    // Suppression des clés
    await prisma.key.deleteMany();
    console.log('✓ Keys supprimés');

    console.log('✅ Base de données nettoyée avec succès!');
  } catch (error) {
    console.error('❌ Erreur lors du nettoyage de la base de données:', error);
  } finally {
    await prisma.$disconnect();
  }
}

cleanDatabase();
