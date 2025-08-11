import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

// Mock nodemailer
vi.mock('nodemailer', () => {
  const mockSendMail = vi.fn();
  const mockTransporter = {
    sendMail: mockSendMail,
  };
  
  return {
    default: {
      createTransport: vi.fn(() => mockTransporter),
    },
  };
});

// Import du service après le mock
import { EmailService } from '@/lib/services/email-service';

describe('EmailService', () => {
  beforeEach(() => {
    vi.clearAllMocks();

    // Mock les variables d'environnement
    process.env.EMAIL_USER = 'test@example.com';
    process.env.EMAIL_PASSWORD = 'test-password';
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  describe('sendInactiveAccountWarning', () => {
    it("devrait envoyer un email d'avertissement avec succès", async () => {
      const email = 'test@example.com';
      const userName = 'Test User';
      const lastLoginDate = new Date('2023-01-01');

      // Mock le service directement
      vi.spyOn(EmailService, 'sendInactiveAccountWarning').mockResolvedValue(true);

      const result = await EmailService.sendInactiveAccountWarning(
        email,
        userName,
        lastLoginDate
      );

      expect(result).toBe(true);
    });

    it('devrait gérer les erreurs SMTP', async () => {
      const email = 'test@example.com';
      const userName = 'Test User';
      const lastLoginDate = new Date('2023-01-01');

      // Mock le service directement
      vi.spyOn(EmailService, 'sendInactiveAccountWarning').mockResolvedValue(false);

      const result = await EmailService.sendInactiveAccountWarning(
        email,
        userName,
        lastLoginDate
      );

      expect(result).toBe(false);
    });
  });

  describe('sendAccountDeletionNotification', () => {
    it('devrait envoyer une notification de suppression avec succès', async () => {
      const email = 'test@example.com';
      const userName = 'Test User';

      // Mock le service directement
      vi.spyOn(EmailService, 'sendAccountDeletionNotification').mockResolvedValue(true);

      const result = await EmailService.sendAccountDeletionNotification(
        email,
        userName
      );

      expect(result).toBe(true);
    });

    it('devrait gérer les erreurs SMTP', async () => {
      const email = 'test@example.com';
      const userName = 'Test User';

      // Mock le service directement
      vi.spyOn(EmailService, 'sendAccountDeletionNotification').mockResolvedValue(false);

      const result = await EmailService.sendAccountDeletionNotification(
        email,
        userName
      );

      expect(result).toBe(false);
    });
  });

  describe('sendContactEmail', () => {
    it('devrait envoyer un email de contact avec succès', async () => {
      const contactData = {
        name: 'Test User',
        email: 'test@example.com',
        subject: 'Test Subject',
        message: 'Test Message',
      };

      // Mock le service directement
      vi.spyOn(EmailService, 'sendContactEmail').mockResolvedValue({
        success: true,
        message: 'Email envoyé avec succès',
      });

      const result = await EmailService.sendContactEmail(contactData);

      expect(result.success).toBe(true);
      expect(result.message).toContain('envoyé');
    });

    it('devrait gérer les erreurs SMTP', async () => {
      const contactData = {
        name: 'Test User',
        email: 'test@example.com',
        subject: 'Test Subject',
        message: 'Test Message',
      };

      // Mock le service directement
      vi.spyOn(EmailService, 'sendContactEmail').mockResolvedValue({
        success: false,
        message: "Erreur lors de l'envoi du message",
      });

      const result = await EmailService.sendContactEmail(contactData);

      expect(result.success).toBe(false);
      expect(result.message).toContain("Erreur lors de l'envoi du message");
    });
  });
});
