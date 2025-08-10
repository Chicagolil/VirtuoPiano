import nodemailer from 'nodemailer';
import { ContactData } from '@/lib/validations/auth-schemas';

export interface EmailResponse {
  success: boolean;
  message: string;
}

export class EmailService {
  private static transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER || 'virtuopiano1@gmail.com',
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  static async sendContactEmail(
    contactData: ContactData
  ): Promise<EmailResponse> {
    try {
      // Email pour l'équipe Virtuo Piano
      const teamEmail = {
        from: process.env.EMAIL_USER || 'virtuopiano1@gmail.com',
        to: 'virtuopiano1@gmail.com',
        subject: `Nouveau message de contact - ${contactData.subject}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #f97316;">Nouveau message de contact - Virtuo Piano</h2>
            <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3 style="color: #333; margin-top: 0;">Détails du contact :</h3>
              <p><strong>Nom :</strong> ${contactData.name}</p>
              <p><strong>Email :</strong> ${contactData.email}</p>
              <p><strong>Sujet :</strong> ${contactData.subject}</p>
              <p><strong>Message :</strong></p>
              <div style="background-color: white; padding: 15px; border-radius: 5px; border-left: 4px solid #f97316;">
                ${contactData.message.replace(/\n/g, '<br>')}
              </div>
            </div>
            <p style="color: #666; font-size: 14px;">
              Ce message a été envoyé depuis le formulaire de contact de Virtuo Piano.
            </p>
          </div>
        `,
      };

      // Email de confirmation pour l'utilisateur
      const confirmationEmail = {
        from: process.env.EMAIL_USER || 'virtuopiano1@gmail.com',
        to: contactData.email,
        subject: 'Confirmation de votre message - Virtuo Piano',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #f97316;">Confirmation de réception - Virtuo Piano</h2>
            <p>Bonjour ${contactData.name},</p>
            <p>Nous avons bien reçu votre message et nous vous en remercions.</p>
            <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3 style="color: #333; margin-top: 0;">Récapitulatif de votre message :</h3>
              <p><strong>Sujet :</strong> ${contactData.subject}</p>
              <p><strong>Message :</strong></p>
              <div style="background-color: white; padding: 15px; border-radius: 5px; border-left: 4px solid #f97316;">
                ${contactData.message.replace(/\n/g, '<br>')}
              </div>
            </div>
            <p>Notre équipe va examiner votre demande et vous répondre dans les meilleurs délais.</p>
            <p>En attendant, n'hésitez pas à consulter notre <a href="${
              process.env.NEXTAUTH_URL || 'http://localhost:3000'
            }/privacy-policy" style="color: #f97316;">politique de confidentialité</a> ou à explorer notre application.</p>
            <p>Cordialement,<br><strong>L'équipe Virtuo Piano</strong></p>
            <hr style="margin: 30px 0; border: none; border-top: 1px solid #eee;">
            <p style="color: #666; font-size: 12px;">
              Cet email a été envoyé automatiquement. Merci de ne pas y répondre directement.
            </p>
          </div>
        `,
      };

      // Envoyer les deux emails
      await this.transporter.sendMail(teamEmail);
      await this.transporter.sendMail(confirmationEmail);

      return {
        success: true,
        message:
          'Message envoyé avec succès. Vous recevrez une confirmation par email.',
      };
    } catch (error) {
      console.error("Erreur lors de l'envoi de l'email:", error);
      return {
        success: false,
        message:
          "Erreur lors de l'envoi du message. Veuillez réessayer plus tard.",
      };
    }
  }

  static async sendInactiveAccountWarning(
    email: string,
    userName: string,
    lastLoginDate: Date | null
  ): Promise<boolean> {
    try {
      const lastLoginText = lastLoginDate
        ? lastLoginDate.toLocaleDateString('fr-FR', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          })
        : 'jamais';

      const warningEmailHtml = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #e74c3c;">⚠️ Attention : Votre compte sera supprimé</h2>
          
          <p>Bonjour ${userName},</p>
          
          <p>Nous avons remarqué que vous n'avez pas utilisé votre compte Virtuo Piano depuis longtemps.</p>
          
          <p><strong>Dernière connexion :</strong> ${lastLoginText}</p>
          
          <div style="background-color: #fff3cd; border: 1px solid #ffeaa7; padding: 15px; border-radius: 5px; margin: 20px 0;">
            <h3 style="color: #856404; margin-top: 0;">⚠️ Action requise</h3>
            <p style="color: #856404; margin-bottom: 0;">
              <strong>Dans 2 semaines, votre compte et toutes vos données seront définitivement supprimés</strong> 
              conformément à notre politique de rétention des données.
            </p>
          </div>
          
          <p>Pour conserver votre compte, il vous suffit de vous connecter à Virtuo Piano dans les 14 prochains jours.</p>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${
              process.env.NEXTAUTH_URL || 'http://localhost:3000'
            }/auth/login" 
               style="background-color: #3b82f6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block;">
              Se connecter maintenant
            </a>
          </div>
          
          <p><strong>Que se passe-t-il si vous ne vous connectez pas ?</strong></p>
          <ul>
            <li>Votre compte sera supprimé définitivement</li>
            <li>Toutes vos données (scores, compositions, favoris) seront perdues</li>
            <li>Vous devrez créer un nouveau compte si vous souhaitez utiliser Virtuo Piano à l'avenir</li>
          </ul>
          
          <p>Si vous avez des questions ou souhaitez conserver votre compte, n'hésitez pas à nous contacter.</p>
          
          <p>Cordialement,<br>
          L'équipe Virtuo Piano</p>
          
          <hr style="margin: 30px 0; border: none; border-top: 1px solid #eee;">
          <p style="font-size: 12px; color: #666;">
            Ce message est envoyé automatiquement. Veuillez ne pas répondre à cet email.
          </p>
        </div>
      `;

      await this.transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: email,
        subject: '⚠️ Votre compte Virtuo Piano sera supprimé dans 2 semaines',
        html: warningEmailHtml,
      });

      return true;
    } catch (error) {
      console.error(
        "Erreur lors de l'envoi de l'email d'avertissement:",
        error
      );
      return false;
    }
  }

  static async sendAccountDeletionNotification(
    email: string,
    userName: string
  ): Promise<boolean> {
    try {
      const deletionEmailHtml = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #e74c3c;">🗑️ Votre compte a été supprimé</h2>
          
          <p>Bonjour ${userName},</p>
          
          <p>Conformément à notre politique de rétention des données et après 1 an d'inactivité, 
          votre compte Virtuo Piano a été définitivement supprimé.</p>
          
          <div style="background-color: #f8d7da; border: 1px solid #f5c6cb; padding: 15px; border-radius: 5px; margin: 20px 0;">
            <h3 style="color: #721c24; margin-top: 0;">📋 Données supprimées</h3>
            <ul style="color: #721c24; margin-bottom: 0;">
              <li>Votre profil utilisateur</li>
              <li>Tous vos scores et performances</li>
              <li>Vos compositions personnelles</li>
              <li>Vos favoris et imports</li>
              <li>Votre progression dans les défis</li>
            </ul>
          </div>
          
          <p><strong>Vous souhaitez recommencer ?</strong></p>
          <p>Vous pouvez créer un nouveau compte à tout moment en vous rendant sur notre site.</p>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${
              process.env.NEXTAUTH_URL || 'http://localhost:3000'
            }/auth/register" 
               style="background-color: #28a745; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block;">
              Créer un nouveau compte
            </a>
          </div>
          
          <p>Merci d'avoir utilisé Virtuo Piano !</p>
          
          <p>Cordialement,<br>
          L'équipe Virtuo Piano</p>
          
          <hr style="margin: 30px 0; border: none; border-top: 1px solid #eee;">
          <p style="font-size: 12px; color: #666;">
            Ce message est envoyé automatiquement. Veuillez ne pas répondre à cet email.
          </p>
        </div>
      `;

      await this.transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: email,
        subject: '🗑️ Votre compte Virtuo Piano a été supprimé',
        html: deletionEmailHtml,
      });

      return true;
    } catch (error) {
      console.error("Erreur lors de l'envoi de l'email de suppression:", error);
      return false;
    }
  }
}
