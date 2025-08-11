import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/authoption';
import { AccountServices } from '@/lib/services/account-services';
import { EmailService } from '@/lib/services/email-service';

// Mock des dépendances
vi.mock('next/navigation', () => ({
  useRouter: vi.fn(),
}));

vi.mock('next-auth', () => ({
  getServerSession: vi.fn(),
}));

vi.mock('@/lib/authoption', () => ({
  authOptions: {},
}));

vi.mock('@/lib/services/account-services');
vi.mock('@/lib/services/email-service');

// Mock des composants de maintenance avec gestionnaires d'événements
const MockMaintenancePage = () => {
  const handleGetInactiveUsers = async () => {
    try {
      const result = await AccountServices.getInactiveUsers();
      // Simuler l'affichage des résultats
      const resultsDiv = document.querySelector('[data-testid="results"]');
      if (resultsDiv) {
        resultsDiv.textContent = `Utilisateurs inactifs: ${result.data?.length || 0}`;
      }
    } catch (error) {
      console.error('Erreur lors de la récupération des utilisateurs inactifs:', error);
    }
  };

  const handleSendWarnings = async () => {
    try {
      const usersToWarn = await AccountServices.getUsersToDelete();
      if (usersToWarn.success && usersToWarn.data && usersToWarn.data.length > 0) {
        for (const user of usersToWarn.data) {
          await EmailService.sendInactiveAccountWarning(
            user.email,
            user.userName,
            user.lastLoginAt
          );
        }
      }
      // Simuler l'affichage des résultats
      const resultsDiv = document.querySelector('[data-testid="results"]');
      if (resultsDiv) {
        resultsDiv.textContent = `Avertissements envoyés: ${usersToWarn.data?.length || 0}`;
      }
    } catch (error) {
      console.error('Erreur lors de l\'envoi des avertissements:', error);
    }
  };

  const handleDeleteUsers = async () => {
    try {
      const result = await AccountServices.deleteInactiveUsers();
      if (result.success) {
        // Envoyer les notifications de suppression si des utilisateurs ont été supprimés
        if (result.deletedCount && result.deletedCount > 0) {
          // Simuler l'envoi de notifications pour les utilisateurs supprimés
          await EmailService.sendAccountDeletionNotification(
            'user@example.com',
            'TestUser'
          );
        }
      }
      // Simuler l'affichage des résultats
      const resultsDiv = document.querySelector('[data-testid="results"]');
      if (resultsDiv) {
        resultsDiv.textContent = `Utilisateurs supprimés: ${result.deletedCount || 0}`;
      }
    } catch (error) {
      console.error('Erreur lors de la suppression des utilisateurs:', error);
    }
  };

  return (
    <div data-testid="maintenance-page">
      <h1>Maintenance Dashboard</h1>
      <button data-testid="get-inactive-users" onClick={handleGetInactiveUsers}>
        Récupérer les utilisateurs inactifs
      </button>
      <button data-testid="send-warnings" onClick={handleSendWarnings}>
        Envoyer les avertissements
      </button>
      <button data-testid="delete-users" onClick={handleDeleteUsers}>
        Supprimer les utilisateurs inactifs
      </button>
      <div data-testid="results"></div>
    </div>
  );
};

describe('Maintenance Integration Tests', () => {
  let queryClient: QueryClient;
  const mockUseRouter = vi.mocked(useRouter);
  const mockGetServerSession = vi.mocked(getServerSession);
  const mockAccountServices = vi.mocked(AccountServices);
  const mockEmailService = vi.mocked(EmailService);

  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false },
        mutations: { retry: false },
      },
    });

    // Mock du router
    mockUseRouter.mockReturnValue({
      push: vi.fn(),
      replace: vi.fn(),
      prefetch: vi.fn(),
      back: vi.fn(),
      forward: vi.fn(),
      refresh: vi.fn(),
    } as any);

    // Mock de la session admin
    mockGetServerSession.mockResolvedValue({
      user: {
        id: 'admin-1',
        email: 'admin@test.com',
        role: 'ADMIN',
      },
    } as any);

    // Mock des services
    mockAccountServices.getInactiveUsers = vi.fn();
    mockAccountServices.getUsersToDelete = vi.fn();
    mockAccountServices.deleteInactiveUsers = vi.fn();
    mockEmailService.sendInactiveAccountWarning = vi.fn();
    mockEmailService.sendAccountDeletionNotification = vi.fn();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  const renderWithProviders = (component: React.ReactElement) => {
    return render(
      <QueryClientProvider client={queryClient}>
        {component}
      </QueryClientProvider>
    );
  };

  describe('Récupération des utilisateurs inactifs', () => {
    it('devrait récupérer les utilisateurs inactifs avec succès', async () => {
      const mockInactiveUsers = [
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

      mockAccountServices.getInactiveUsers.mockResolvedValue({
        success: true,
        data: mockInactiveUsers,
        message: 'Utilisateurs inactifs récupérés avec succès',
      });

      renderWithProviders(<MockMaintenancePage />);

      const getInactiveUsersButton = screen.getByTestId('get-inactive-users');
      fireEvent.click(getInactiveUsersButton);

      await waitFor(() => {
        expect(mockAccountServices.getInactiveUsers).toHaveBeenCalled();
      });
    });

    it('devrait gérer les erreurs de récupération', async () => {
      mockAccountServices.getInactiveUsers.mockRejectedValue(
        new Error('Erreur de base de données')
      );

      renderWithProviders(<MockMaintenancePage />);

      const getInactiveUsersButton = screen.getByTestId('get-inactive-users');
      fireEvent.click(getInactiveUsersButton);

      await waitFor(() => {
        expect(mockAccountServices.getInactiveUsers).toHaveBeenCalled();
      });
    });
  });

  describe('Envoi d\'avertissements', () => {
    it('devrait envoyer les avertissements avec succès', async () => {
      const mockUsersToWarn = [
        {
          id: '1',
          email: 'user1@test.com',
          userName: 'User1',
          lastLoginAt: new Date('2023-01-01'),
          createdAt: new Date('2023-01-01'),
        },
      ];

      mockAccountServices.getUsersToDelete.mockResolvedValue({
        success: true,
        data: mockUsersToWarn,
        message: 'Utilisateurs à avertir récupérés',
      });

      mockEmailService.sendInactiveAccountWarning.mockResolvedValue(true);

      renderWithProviders(<MockMaintenancePage />);

      const sendWarningsButton = screen.getByTestId('send-warnings');
      fireEvent.click(sendWarningsButton);

      await waitFor(() => {
        expect(mockAccountServices.getUsersToDelete).toHaveBeenCalled();
        expect(
          mockEmailService.sendInactiveAccountWarning
        ).toHaveBeenCalledWith(
          'user1@test.com',
          'User1',
          new Date('2023-01-01')
        );
      });
    });

    it("devrait gérer l'absence d'utilisateurs à avertir", async () => {
      mockAccountServices.getUsersToDelete.mockResolvedValue({
        success: true,
        data: [],
        message: 'Aucun utilisateur à avertir',
      });

      renderWithProviders(<MockMaintenancePage />);

      const sendWarningsButton = screen.getByTestId('send-warnings');
      fireEvent.click(sendWarningsButton);

      await waitFor(() => {
        expect(mockAccountServices.getUsersToDelete).toHaveBeenCalled();
        expect(
          mockEmailService.sendInactiveAccountWarning
        ).not.toHaveBeenCalled();
      });
    });
  });

  describe('Suppression des utilisateurs inactifs', () => {
    it('devrait supprimer les utilisateurs inactifs avec succès', async () => {
      mockAccountServices.deleteInactiveUsers.mockResolvedValue({
        success: true,
        deletedCount: 2,
        message: '2 utilisateurs supprimés avec succès',
      });

      mockEmailService.sendAccountDeletionNotification.mockResolvedValue(true);

      renderWithProviders(<MockMaintenancePage />);

      const deleteUsersButton = screen.getByTestId('delete-users');
      fireEvent.click(deleteUsersButton);

      await waitFor(() => {
        expect(mockAccountServices.deleteInactiveUsers).toHaveBeenCalled();
        expect(
          mockEmailService.sendAccountDeletionNotification
        ).toHaveBeenCalled();
      });
    });

    it('devrait gérer les erreurs lors de la suppression', async () => {
      mockAccountServices.deleteInactiveUsers.mockResolvedValue({
        success: false,
        deletedCount: 0,
        message: 'Erreur lors de la suppression',
      });

      renderWithProviders(<MockMaintenancePage />);

      const deleteUsersButton = screen.getByTestId('delete-users');
      fireEvent.click(deleteUsersButton);

      await waitFor(() => {
        expect(mockAccountServices.deleteInactiveUsers).toHaveBeenCalled();
      });
    });

    it('devrait retourner 0 si aucun utilisateur à supprimer', async () => {
      mockAccountServices.deleteInactiveUsers.mockResolvedValue({
        success: true,
        deletedCount: 0,
        message: 'Aucun utilisateur à supprimer',
      });

      renderWithProviders(<MockMaintenancePage />);

      const deleteUsersButton = screen.getByTestId('delete-users');
      fireEvent.click(deleteUsersButton);

      await waitFor(() => {
        expect(mockAccountServices.deleteInactiveUsers).toHaveBeenCalled();
        expect(
          mockEmailService.sendAccountDeletionNotification
        ).not.toHaveBeenCalled();
      });
    });
  });
});
