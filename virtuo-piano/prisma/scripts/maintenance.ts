#!/usr/bin/env node

import { AccountServices } from '../../src/lib/services/account-services';
import { EmailService } from '../../src/lib/services/email-service';
import prisma from '../../src/lib/prisma';

/**
 * Script de maintenance pour gérer les comptes inactifs
 *
 * Ce script peut être exécuté manuellement ou via un cron job
 * pour automatiser la gestion des comptes inactifs.
 */

async function sendWarningEmails() {
  console.log("🔔 Envoi des emails d'avertissement...");

  try {
    // Récupérer les utilisateurs qui seront supprimés dans 2 semaines
    // (donc inactifs depuis 11 mois et 2 semaines)
    const elevenMonthsTwoWeeksAgo = new Date();
    elevenMonthsTwoWeeksAgo.setMonth(elevenMonthsTwoWeeksAgo.getMonth() - 11);
    elevenMonthsTwoWeeksAgo.setDate(elevenMonthsTwoWeeksAgo.getDate() - 14);

    const usersToWarn = await prisma.user.findMany({
      where: {
        OR: [
          {
            lastLoginAt: {
              lt: elevenMonthsTwoWeeksAgo,
            },
          },
          {
            lastLoginAt: null,
            createdAt: {
              lt: elevenMonthsTwoWeeksAgo,
            },
          },
        ],
      },
      select: {
        id: true,
        email: true,
        userName: true,
        lastLoginAt: true,
      },
    });

    console.log(`📧 ${usersToWarn.length} utilisateurs à avertir`);

    let sentCount = 0;
    let errorCount = 0;

    for (const user of usersToWarn) {
      try {
        const emailSent = await EmailService.sendInactiveAccountWarning(
          user.email,
          user.userName,
          user.lastLoginAt
        );

        if (emailSent) {
          console.log(`✅ Email d'avertissement envoyé à ${user.email}`);
          sentCount++;
        } else {
          console.log(`❌ Échec de l'envoi à ${user.email}`);
          errorCount++;
        }
      } catch (error) {
        console.error(`❌ Erreur lors de l'envoi à ${user.email}:`, error);
        errorCount++;
      }
    }

    console.log(
      `📊 Résumé: ${sentCount} emails envoyés, ${errorCount} erreurs`
    );
    return { sentCount, errorCount, totalUsers: usersToWarn.length };
  } catch (error) {
    console.error(
      "❌ Erreur lors de l'envoi des emails d'avertissement:",
      error
    );
    throw error;
  }
}

async function deleteInactiveAccounts() {
  console.log('🗑️ Suppression des comptes inactifs...');

  try {
    // Récupérer les utilisateurs à supprimer AVANT de les supprimer
    const usersToDelete = await AccountServices.getUsersToDelete();

    if (
      !usersToDelete.success ||
      !usersToDelete.data ||
      usersToDelete.data.length === 0
    ) {
      console.log('✅ Aucun utilisateur inactif à supprimer');
      return { success: true, deletedCount: 0 };
    }

    // Supprimer les utilisateurs
    const result = await AccountServices.deleteInactiveUsers();

    if (result.success) {
      console.log(`✅ ${result.deletedCount} comptes supprimés avec succès`);

      // Envoyer des emails de notification de suppression
      let notificationSentCount = 0;

      for (const userData of usersToDelete.data) {
        try {
          await EmailService.sendAccountDeletionNotification(
            userData.email,
            userData.userName
          );
          console.log(`📧 Email de suppression envoyé à ${userData.email}`);
          notificationSentCount++;
        } catch (error) {
          console.error(
            `❌ Erreur lors de l'envoi de l'email de suppression à ${userData.email}:`,
            error
          );
        }
      }

      console.log(`📊 ${notificationSentCount} emails de notification envoyés`);
    } else {
      console.log(`❌ Erreur lors de la suppression: ${result.message}`);
    }

    return result;
  } catch (error) {
    console.error(
      '❌ Erreur lors de la suppression des comptes inactifs:',
      error
    );
    throw error;
  }
}

async function generateInactiveUsersReport() {
  console.log('📊 Génération du rapport des utilisateurs inactifs...');

  try {
    const result = await AccountServices.getInactiveUsers();

    if (result.success && result.data) {
      console.log(`📈 ${result.data.length} utilisateurs inactifs trouvés`);

      // Afficher les détails
      result.data.forEach((user, index) => {
        const lastLogin = user.lastLoginAt
          ? user.lastLoginAt.toLocaleDateString('fr-FR')
          : 'Jamais connecté';

        console.log(
          `${index + 1}. ${user.userName} (${
            user.email
          }) - Dernière connexion: ${lastLogin}`
        );
      });
    } else {
      console.log('❌ Erreur lors de la génération du rapport');
    }

    return result;
  } catch (error) {
    console.error('❌ Erreur lors de la génération du rapport:', error);
    throw error;
  }
}

async function main() {
  const command = process.argv[2];

  console.log('🔧 Script de maintenance Virtuo Piano');
  console.log('=====================================');

  try {
    switch (command) {
      case 'warn':
        await sendWarningEmails();
        break;

      case 'delete':
        await deleteInactiveAccounts();
        break;

      case 'report':
        await generateInactiveUsersReport();
        break;

      case 'full':
        console.log('🔄 Exécution complète du processus de maintenance...');
        await sendWarningEmails();
        await deleteInactiveAccounts();
        break;

      default:
        console.log(`
Usage: npm run maintenance <command>

Commandes disponibles:
  warn    - Envoyer les emails d'avertissement aux utilisateurs inactifs
  delete  - Supprimer les comptes inactifs depuis 1 an
  report  - Générer un rapport des utilisateurs inactifs
  full    - Exécuter le processus complet (warn + delete)

Exemples:
  npm run maintenance warn
  npm run maintenance delete
  npm run maintenance report
  npm run maintenance full
        `);
        break;
    }
  } catch (error) {
    console.error('❌ Erreur fatale:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
    console.log('✅ Script terminé');
  }
}

// Exécuter le script
main();

export {
  sendWarningEmails,
  deleteInactiveAccounts,
  generateInactiveUsersReport,
};
