import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
  getInactiveUsersAction,
  sendInactiveAccountWarningsAction,
  deleteInactiveUsersAction,
  getUserDataAction,
  updateUserDataAction,
  deleteUserAction,
  exportUserDataAction,
  withdrawConsentAction,
} from '@/lib/actions/RGPD-actions';
import { AccountServices } from '@/lib/services/account-services';
import { getAuthenticatedUser } from '@/lib/auth/get-authenticated-user';
import { EmailService } from '@/lib/services/email-service';

// Mock des services
vi.mock('@/lib/services/account-services');
vi.mock('@/lib/auth/get-authenticated-user');
vi.mock('@/lib/services/email-service');

describe('RGPD Actions', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  describe('getInactiveUsersAction', () => {
    it('devrait récupérer les utilisateurs inactifs avec succès', async () => {
      const mockUser = { id: '1' };
      (getAuthenticatedUser as any).mockResolvedValue(mockUser);

      const mockUsers = [
        {
          id: '1',
          email: 'user1@test.com',
          userName: 'User1',
          lastLoginAt: new Date('2023-01-01'),
        },
      ];

      (AccountServices.getInactiveUsers as any).mockResolvedValue({
        success: true,
        data: mockUsers,
      });

      const result = await getInactiveUsersAction();

      expect(result.success).toBe(true);
      expect(result.data).toEqual(mockUsers);
      expect(AccountServices.getInactiveUsers).toHaveBeenCalled();
    });

    it('devrait gérer les erreurs du service', async () => {
      const mockUser = { id: '1' };
      (getAuthenticatedUser as any).mockResolvedValue(mockUser);

      (AccountServices.getInactiveUsers as any).mockResolvedValue({
        success: false,
        message: 'Erreur de service',
      });

      const result = await getInactiveUsersAction();

      expect(result.success).toBe(false);
      expect(result.message).toBe('Erreur de service');
    });

    it('devrait gérer les utilisateurs non authentifiés', async () => {
      (getAuthenticatedUser as any).mockResolvedValue(null);

      const result = await getInactiveUsersAction();

      expect(result.success).toBe(false);
      expect(result.message).toBe('Non autorisé');
    });
  });

  describe('deleteInactiveUsersAction', () => {
    it('devrait supprimer les utilisateurs inactifs avec succès', async () => {
      const mockUser = { id: '1' };
      (getAuthenticatedUser as any).mockResolvedValue(mockUser);

      (AccountServices.getUsersToDelete as any).mockResolvedValue({
        success: true,
        data: [
          { id: '1', email: 'user1@test.com', userName: 'User1' },
          { id: '2', email: 'user2@test.com', userName: 'User2' },
        ],
      });

      (AccountServices.deleteInactiveUsers as any).mockResolvedValue({
        success: true,
        deletedCount: 2,
      });

      (EmailService.sendAccountDeletionNotification as any).mockResolvedValue(
        true
      );

      const result = await deleteInactiveUsersAction();

      expect(result.success).toBe(true);
      expect(result.deletedCount).toBe(2);
      expect(AccountServices.deleteInactiveUsers).toHaveBeenCalled();
    });

    it('devrait gérer les erreurs de suppression', async () => {
      const mockUser = { id: '1' };
      (getAuthenticatedUser as any).mockResolvedValue(mockUser);

      (AccountServices.getUsersToDelete as any).mockResolvedValue({
        success: true,
        data: [{ id: '1', email: 'user1@test.com', userName: 'User1' }],
      });

      (AccountServices.deleteInactiveUsers as any).mockResolvedValue({
        success: false,
        message: 'Erreur lors de la suppression des utilisateurs inactifs',
      });

      (EmailService.sendAccountDeletionNotification as any).mockResolvedValue(
        true
      );

      const result = await deleteInactiveUsersAction();

      expect(result.success).toBe(false);
      expect(result.message).toBe(
        'Erreur lors de la suppression des utilisateurs inactifs'
      );
    });

    it("devrait gérer l'absence d'utilisateurs à supprimer", async () => {
      (AccountServices.getUsersToDelete as any).mockResolvedValue({
        success: true,
        data: [],
      });

      const result = await deleteInactiveUsersAction();

      expect(result.success).toBe(true);
      expect(result.message).toBe('Aucun utilisateur inactif à supprimer');
    });
  });

  describe('getUserDataAction', () => {
    it('devrait récupérer les données utilisateur avec succès', async () => {
      const mockUser = {
        id: '1',
        userName: 'TestUser',
        email: 'test@test.com',
      };

      (getAuthenticatedUser as any).mockResolvedValue(mockUser);

      const mockUserData = {
        userName: 'TestUser',
        email: 'test@test.com',
        level: 5,
        xp: 1000,
      };

      (AccountServices.getUserData as any).mockResolvedValue({
        success: true,
        data: mockUserData,
      });

      const result = await getUserDataAction();

      expect(result.success).toBe(true);
      expect(result.data).toEqual(mockUserData);
      expect(AccountServices.getUserData).toHaveBeenCalledWith('1');
    });

    it('devrait gérer les utilisateurs non authentifiés', async () => {
      (getAuthenticatedUser as any).mockResolvedValue(null);

      const result = await getUserDataAction();

      expect(result.success).toBe(false);
      expect(result.message).toContain('non authentifié');
    });

    it('devrait gérer les erreurs de récupération', async () => {
      const mockUser = { id: '1' };
      (getAuthenticatedUser as any).mockResolvedValue(mockUser);

      (AccountServices.getUserData as any).mockResolvedValue({
        success: false,
        message: 'Erreur de récupération',
      });

      const result = await getUserDataAction();

      expect(result.success).toBe(false);
      expect(result.message).toBe('Erreur de récupération');
    });
  });

  describe('updateUserDataAction', () => {
    it('devrait mettre à jour les données utilisateur avec succès', async () => {
      const mockUser = {
        id: '1',
        userName: 'OldName',
        email: 'old@test.com',
      };

      (getAuthenticatedUser as any).mockResolvedValue(mockUser);

      const updateData = {
        userName: 'NewName',
        email: 'new@test.com',
      };

      (AccountServices.updateUserData as any).mockResolvedValue({
        success: true,
        message: 'Données mises à jour',
      });

      const result = await updateUserDataAction(updateData);

      expect(result.success).toBe(true);
      expect(AccountServices.updateUserData).toHaveBeenCalledWith(
        '1',
        updateData
      );
    });

    it('devrait gérer les utilisateurs non authentifiés', async () => {
      (getAuthenticatedUser as any).mockResolvedValue(null);

      const result = await updateUserDataAction({ userName: 'NewName' });

      expect(result.success).toBe(false);
      expect(result.message).toContain('non authentifié');
    });

    it('devrait valider les données de mise à jour', async () => {
      const mockUser = { id: '1' };
      (getAuthenticatedUser as any).mockResolvedValue(mockUser);

      const invalidData = {
        userName: '',
        email: 'invalid-email',
      };

      const result = await updateUserDataAction(invalidData);

      expect(result.success).toBe(false);
      expect(result.message).toContain('validation');
    });
  });

  describe('deleteUserAction', () => {
    it("devrait supprimer l'utilisateur avec succès", async () => {
      const mockUser = {
        id: '1',
        userName: 'TestUser',
        email: 'test@test.com',
      };

      (getAuthenticatedUser as any).mockResolvedValue(mockUser);

      (AccountServices.deleteUser as any).mockResolvedValue({
        success: true,
        message: 'Utilisateur supprimé',
      });

      const result = await deleteUserAction();

      expect(result.success).toBe(true);
      expect(AccountServices.deleteUser).toHaveBeenCalledWith('1');
    });

    it('devrait gérer les utilisateurs non authentifiés', async () => {
      (getAuthenticatedUser as any).mockResolvedValue(null);

      const result = await deleteUserAction();

      expect(result.success).toBe(false);
      expect(result.message).toContain('non authentifié');
    });

    it('devrait gérer les erreurs de suppression', async () => {
      const mockUser = { id: '1' };
      (getAuthenticatedUser as any).mockResolvedValue(mockUser);

      (AccountServices.deleteUser as any).mockResolvedValue({
        success: false,
        message: 'Erreur de suppression',
      });

      const result = await deleteUserAction();

      expect(result.success).toBe(false);
      expect(result.message).toBe('Erreur de suppression');
    });
  });

  describe('exportUserDataAction', () => {
    it('devrait exporter les données utilisateur avec succès', async () => {
      const mockUser = { id: '1' };
      (getAuthenticatedUser as any).mockResolvedValue(mockUser);

      const mockUserData = {
        user: { id: '1', userName: 'TestUser' },
        scores: [],
        compositions: [],
        favorites: [],
        imports: [],
        challengeProgress: [],
      };

      (AccountServices.exportUserData as any).mockResolvedValue({
        success: true,
        data: mockUserData,
      });

      const result = await exportUserDataAction();

      expect(result.success).toBe(true);
      expect(result.data).toEqual(mockUserData);
    });

    it("devrait gérer les erreurs d'export", async () => {
      const mockUser = { id: '1' };
      (getAuthenticatedUser as any).mockResolvedValue(mockUser);

      (AccountServices.exportUserData as any).mockResolvedValue({
        success: false,
        message: "Erreur d'export",
      });

      const result = await exportUserDataAction();

      expect(result.success).toBe(false);
      expect(result.message).toBe("Erreur d'export");
    });
  });

  describe('withdrawConsentAction', () => {
    it('devrait retirer le consentement avec succès', async () => {
      const mockUser = { id: '1' };
      (getAuthenticatedUser as any).mockResolvedValue(mockUser);

      (AccountServices.withdrawConsent as any).mockResolvedValue({
        success: true,
        message: 'Consentement retiré',
      });

      const result = await withdrawConsentAction();

      expect(result.success).toBe(true);
      expect(AccountServices.withdrawConsent).toHaveBeenCalledWith('1');
    });

    it('devrait gérer les erreurs de retrait de consentement', async () => {
      const mockUser = { id: '1' };
      (getAuthenticatedUser as any).mockResolvedValue(mockUser);

      (AccountServices.withdrawConsent as any).mockResolvedValue({
        success: false,
        message: 'Erreur de retrait',
      });

      const result = await withdrawConsentAction();

      expect(result.success).toBe(false);
      expect(result.message).toBe('Erreur de retrait');
    });
  });

  describe('Validation des données', () => {
    it('devrait valider les données de mise à jour utilisateur', async () => {
      const mockUser = { id: '1' };
      (getAuthenticatedUser as any).mockResolvedValue(mockUser);

      // Test avec des données invalides
      const invalidData = {
        userName: '',
        email: 'invalid-email',
        newPassword: 'short',
      };

      const result = await updateUserDataAction(invalidData);

      expect(result.success).toBe(false);
      expect(result.message).toContain('validation');
    });

    it('devrait accepter des données valides', async () => {
      const mockUser = { id: '1' };
      (getAuthenticatedUser as any).mockResolvedValue(mockUser);

      (AccountServices.updateUserData as any).mockResolvedValue({
        success: true,
        message: 'Données mises à jour',
      });

      const validData = {
        userName: 'ValidName',
        email: 'valid@email.com',
        newPassword: 'validPassword123',
      };

      const result = await updateUserDataAction(validData);

      expect(result.success).toBe(true);
    });
  });

  describe('Gestion des erreurs', () => {
    it('devrait gérer les erreurs de service inattendues', async () => {
      const mockUser = { id: '1' };
      (getAuthenticatedUser as any).mockResolvedValue(mockUser);

      (AccountServices.getUserData as any).mockRejectedValue(
        new Error('Erreur inattendue')
      );

      const result = await getUserDataAction();

      expect(result.success).toBe(false);
      expect(result.message).toContain(
        'Erreur lors de la récupération des données utilisateur'
      );
    });

    it("devrait gérer les erreurs d'authentification", async () => {
      (getAuthenticatedUser as any).mockRejectedValue(
        new Error("Erreur d'authentification")
      );

      const result = await getUserDataAction();

      expect(result.success).toBe(false);
      expect(result.message).toContain(
        'Erreur lors de la récupération des données utilisateur'
      );
    });
  });
});
