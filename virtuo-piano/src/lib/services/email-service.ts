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
              process.env.NEXT_PUBLIC_APP_URL
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
}
