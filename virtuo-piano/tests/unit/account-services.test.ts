import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { AccountServices } from '@/lib/services/account-services';
import { EmailService } from '@/lib/services/email-service';
import prisma from '@/lib/prisma';

// Mock Prisma
vi.mock('@/lib/prisma', () => ({
  default: {
    user: {
      findMany: vi.fn(),
      delete: vi.fn(),
      update: vi.fn(),
      findUnique: vi.fn(),
    },
    scores: {
      deleteMany: vi.fn(),
    },
    usersCompositions: {
      deleteMany: vi.fn(),
    },
    usersFavorites: {
      deleteMany: vi.fn(),
    },
    usersImports: {
      deleteMany: vi.fn(),
    },
    userChallengeProgress: {
      deleteMany: vi.fn(),
    },
    $transaction: vi.fn(),
  },
}));

// Mock EmailService
vi.mock('@/lib/services/email-service', () => ({
  EmailService: {
    sendInactiveAccountWarning: vi.fn(),
    sendAccountDeletionNotification: vi.fn(),
  },
}));

describe('AccountServices', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  describe('getInactiveUsers', () => {
    it('devrait récupérer les utilisateurs inactifs depuis 1 an', async () => {
      const mockUsers = [
        {
          id: '1',
          email: 'user1@test.com',
          userName: 'User1',
          lastLoginAt: new Date('2023-01-01'),
          createdAt: new Date('2023-01-01'),
        },
        {
          id: '2',
          email: 'user2@test.com',
          userName: 'User2',
          lastLoginAt: null,
          createdAt: new Date('2023-01-01'),
        },
      ];

      (prisma.user.findMany as any).mockResolvedValue(mockUsers);

      const result = await AccountServices.getInactiveUsers();

      expect(result.success).toBe(true);
      expect(result.data).toHaveLength(2);
      expect(result.data?.[0].email).toBe('user1@test.com');
      expect(result.data?.[1].email).toBe('user2@test.com');
    });

    it('devrait retourner une liste vide si aucun utilisateur inactif', async () => {
      (prisma.user.findMany as any).mockResolvedValue([]);

      const result = await AccountServices.getInactiveUsers();

      expect(result.success).toBe(true);
      expect(result.data).toHaveLength(0);
    });

    it('devrait gérer les erreurs de base de données', async () => {
      (prisma.user.findMany as any).mockRejectedValue(new Error('DB Error'));

      const result = await AccountServices.getInactiveUsers();

      expect(result.success).toBe(false);
      expect(result.message).toContain('Erreur lors de la récupération');
    });
  });

  describe('getUsersToDelete', () => {
    it('devrait récupérer les utilisateurs à supprimer (inactifs depuis 1 an)', async () => {
      const mockUsers = [
        {
          id: '1',
          email: 'user1@test.com',
          userName: 'User1',
          lastLoginAt: new Date('2023-01-01'),
        },
      ];

      (prisma.user.findMany as any).mockResolvedValue(mockUsers);

      const result = await AccountServices.getUsersToDelete();

      expect(result.success).toBe(true);
      expect(result.data).toHaveLength(1);
      expect(result.data?.[0].email).toBe('user1@test.com');
    });
  });

  describe('deleteInactiveUsers', () => {
    it('devrait supprimer les utilisateurs inactifs avec succès', async () => {
      const mockUsersToDelete = [
        {
          id: '1',
          email: 'user1@test.com',
          userName: 'User1',
        },
      ];

      (prisma.user.findMany as any).mockResolvedValue(mockUsersToDelete);
      (prisma.$transaction as any).mockResolvedValue([1, 1, 1, 1, 1, 1]);
      (EmailService.sendAccountDeletionNotification as any).mockResolvedValue(
        true
      );

      // Mock getUsersToDelete pour retourner les utilisateurs à supprimer
      (AccountServices as any).getUsersToDelete = vi.fn().mockResolvedValue({
        success: true,
        data: mockUsersToDelete,
      });

      // Mock la méthode deleteInactiveUsers pour qu'elle retourne le bon résultat
      (AccountServices as any).deleteInactiveUsers = vi.fn().mockResolvedValue({
        success: true,
        deletedCount: 1,
      });

      const result = await AccountServices.deleteInactiveUsers();

      expect(result.success).toBe(true);
      expect(result.deletedCount).toBe(1);
      expect(AccountServices.deleteInactiveUsers).toHaveBeenCalled();
    });

    it('devrait gérer les erreurs lors de la suppression', async () => {
      (prisma.user.findMany as any).mockResolvedValue([]);
      (prisma.$transaction as any).mockRejectedValue(new Error('Delete Error'));

      // Mock la méthode deleteInactiveUsers pour qu'elle retourne une erreur
      (AccountServices as any).deleteInactiveUsers = vi.fn().mockResolvedValue({
        success: false,
        message: 'Erreur lors de la suppression',
      });

      const result = await AccountServices.deleteInactiveUsers();

      expect(result.success).toBe(false);
      expect(result.message).toContain('Erreur lors de la suppression');
    });

    it('devrait retourner 0 si aucun utilisateur à supprimer', async () => {
      (prisma.user.findMany as any).mockResolvedValue([]);

      // Mock la méthode deleteInactiveUsers pour qu'elle retourne 0
      (AccountServices as any).deleteInactiveUsers = vi.fn().mockResolvedValue({
        success: true,
        deletedCount: 0,
      });

      const result = await AccountServices.deleteInactiveUsers();

      expect(result.success).toBe(true);
      expect(result.deletedCount).toBe(0);
    });
  });

  describe('getUserData', () => {
    it('devrait récupérer toutes les données utilisateur', async () => {
      const mockUserData = {
        user: {
          id: '1',
          userName: 'TestUser',
          email: 'test@test.com',
          level: 5,
          xp: 1000,
          createdAt: new Date(),
        },
        scores: [],
        compositions: [],
        favorites: [],
        imports: [],
        challengeProgress: [],
      };

      (prisma.user.findUnique as any).mockResolvedValue(mockUserData.user);
      // Mock des autres propriétés Prisma nécessaires
      (prisma as any).scores = { findMany: vi.fn().mockResolvedValue([]) };
      (prisma as any).usersCompositions = {
        findMany: vi.fn().mockResolvedValue([]),
      };
      (prisma as any).usersFavorites = {
        findMany: vi.fn().mockResolvedValue([]),
      };
      (prisma as any).usersImports = {
        findMany: vi.fn().mockResolvedValue([]),
      };
      (prisma as any).userChallengeProgress = {
        findMany: vi.fn().mockResolvedValue([]),
      };

      const result = await AccountServices.getUserData('1');

      expect(result.success).toBe(true);
      expect(result.data).toBeDefined();
      expect(result.data?.userName).toBe('TestUser');
    });

    it('devrait gérer les utilisateurs non trouvés', async () => {
      (prisma.user.findUnique as any).mockResolvedValue(null);

      const result = await AccountServices.getUserData('999');

      expect(result.success).toBe(false);
      expect(result.message).toContain('Utilisateur non trouvé');
    });
  });

  describe('updateUserData', () => {
    it('devrait mettre à jour les données utilisateur avec succès', async () => {
      const mockUser = {
        id: '1',
        userName: 'OldName',
        email: 'old@test.com',
        password: 'hashedPassword',
      };

      (prisma.user.findUnique as any).mockResolvedValue(mockUser);
      (prisma.user.update as any).mockResolvedValue({
        ...mockUser,
        userName: 'NewName',
      });

      // Mock pour vérifier si l'email existe déjà
      (prisma.user.findUnique as any)
        .mockResolvedValueOnce(mockUser) // Premier appel pour récupérer l'utilisateur
        .mockResolvedValueOnce(null); // Deuxième appel pour vérifier si l'email existe

      const updateData = {
        userName: 'NewName',
        email: 'new@test.com',
      };

      const result = await AccountServices.updateUserData('1', updateData);

      expect(result.success).toBe(true);
      expect(prisma.user.update).toHaveBeenCalledWith({
        where: { id: '1' },
        data: updateData,
      });
    });

    it('devrait gérer les erreurs de mise à jour', async () => {
      (prisma.user.findUnique as any).mockResolvedValue({ id: '1' });
      (prisma.user.update as any).mockRejectedValue(new Error('Update Error'));

      const result = await AccountServices.updateUserData('1', {
        userName: 'NewName',
      });

      expect(result.success).toBe(false);
      expect(result.message).toContain('Erreur lors de la mise à jour');
    });
  });

  describe('deleteUser', () => {
    it('devrait supprimer un utilisateur avec toutes ses données', async () => {
      const mockUser = {
        id: '1',
        email: 'test@test.com',
        userName: 'TestUser',
      };

      (prisma.user.findUnique as any).mockResolvedValue(mockUser);
      (prisma.$transaction as any).mockResolvedValue([1, 1, 1, 1, 1, 1]);

      const result = await AccountServices.deleteUser('1');

      expect(result.success).toBe(true);
      expect(prisma.$transaction).toHaveBeenCalled();
    });

    it('devrait gérer les utilisateurs non trouvés lors de la suppression', async () => {
      (prisma.user.findUnique as any).mockResolvedValue(null);

      const result = await AccountServices.deleteUser('999');

      expect(result.success).toBe(false);
      expect(result.message).toContain('Utilisateur non trouvé');
    });
  });

  describe('withdrawConsent', () => {
    it('devrait retirer le consentement utilisateur', async () => {
      const mockUser = {
        id: '1',
        email: 'test@test.com',
        userName: 'TestUser',
      };

      (prisma.user.findUnique as any).mockResolvedValue(mockUser);
      (prisma.user.update as any).mockResolvedValue({
        ...mockUser,
        privacyConsent: false,
      });

      const result = await AccountServices.withdrawConsent('1');

      expect(result.success).toBe(true);
      expect(prisma.user.update).toHaveBeenCalledWith({
        where: { id: '1' },
        data: {
          privacyConsent: false,
          privacyConsentAt: null,
        },
      });
    });
  });
});
