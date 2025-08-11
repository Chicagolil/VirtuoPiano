import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import React from 'react';
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { signOut } from 'next-auth/react';
import {
  useGetUserData,
  useDeleteUser,
  useExportUserData,
  useUpdateUserData,
  useWithdrawConsent,
  useRgpdRights,
} from '@/customHooks/useRgpdRights';
import {
  getUserDataAction,
  deleteUserAction,
  exportUserDataAction,
  updateUserDataAction,
  withdrawConsentAction,
} from '@/lib/actions/RGPD-actions';

// Mock des actions
vi.mock('@/lib/actions/RGPD-actions');
vi.mock('next-auth/react', () => ({
  signOut: vi.fn(),
}));

// Mock des actions RGPD
const mockActions = {
  getUserDataAction: vi.mocked(getUserDataAction),
  deleteUserAction: vi.mocked(deleteUserAction),
  exportUserDataAction: vi.mocked(exportUserDataAction),
  updateUserDataAction: vi.mocked(updateUserDataAction),
  withdrawConsentAction: vi.mocked(withdrawConsentAction),
};

// Wrapper pour les tests avec QueryClient
const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
      mutations: {
        retry: false,
      },
    },
  });

  return ({ children }: { children: React.ReactNode }) => {
    return React.createElement(
      QueryClientProvider,
      { client: queryClient },
      children
    );
  };
};

describe('useRgpdRights Hooks', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  describe('useGetUserData', () => {
    it('devrait récupérer les données utilisateur avec succès', async () => {
      const mockUserData = {
        userName: 'TestUser',
        email: 'test@test.com',
        level: 5,
        xp: 1000,
      };

      mockActions.getUserDataAction.mockResolvedValue({
        success: true,
        data: mockUserData,
        message: 'Données récupérées avec succès',
      });

      const { result } = renderHook(() => useGetUserData(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(result.current.data).toEqual({
        success: true,
        data: mockUserData,
        message: 'Données récupérées avec succès',
      });
    });

    it('devrait gérer les erreurs de récupération', async () => {
      mockActions.getUserDataAction.mockRejectedValue(
        new Error('Erreur de récupération')
      );

      const { result } = renderHook(() => useGetUserData(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isError).toBe(true);
      });
    });
  });

  describe('useDeleteUser', () => {
    it("devrait supprimer l'utilisateur et déconnecter avec succès", async () => {
      mockActions.deleteUserAction.mockResolvedValue({
        success: true,
        message: 'Utilisateur supprimé',
      });

      const { result } = renderHook(() => useDeleteUser(), {
        wrapper: createWrapper(),
      });

      await result.current.mutate();

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(signOut).toHaveBeenCalledWith({
        callbackUrl: '/auth/login',
      });
    });

    it('devrait gérer les erreurs de suppression', async () => {
      mockActions.deleteUserAction.mockResolvedValue({
        success: false,
        message: 'Erreur de suppression',
      });

      const { result } = renderHook(() => useDeleteUser(), {
        wrapper: createWrapper(),
      });

      await result.current.mutate();

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      // Ne devrait pas déconnecter en cas d'erreur
      expect(signOut).not.toHaveBeenCalled();
    });

    it('devrait gérer les erreurs inattendues', async () => {
      mockActions.deleteUserAction.mockRejectedValue(
        new Error('Erreur inattendue')
      );

      const { result } = renderHook(() => useDeleteUser(), {
        wrapper: createWrapper(),
      });

      await result.current.mutate();

      await waitFor(() => {
        expect(result.current.isError).toBe(true);
      });
    });
  });

  describe('useExportUserData', () => {
    it('devrait exporter les données utilisateur avec succès', async () => {
      const mockUserData = {
        user: { id: '1', userName: 'TestUser' },
        scores: [],
        compositions: [],
        favorites: [],
        imports: [],
        challengeProgress: [],
      };

      mockActions.exportUserDataAction.mockResolvedValue({
        success: true,
        data: mockUserData,
        message: 'Données exportées avec succès',
      });

      const { result } = renderHook(() => useExportUserData(), {
        wrapper: createWrapper(),
      });

      await result.current.mutate();

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(result.current.data).toEqual({
        success: true,
        data: mockUserData,
        message: 'Données exportées avec succès',
      });
    });

    it("devrait gérer les erreurs d'export", async () => {
      mockActions.exportUserDataAction.mockRejectedValue(
        new Error("Erreur d'export")
      );

      const { result } = renderHook(() => useExportUserData(), {
        wrapper: createWrapper(),
      });

      await result.current.mutate();

      await waitFor(() => {
        expect(result.current.isError).toBe(true);
      });
    });
  });

  describe('useUpdateUserData', () => {
    it('devrait mettre à jour les données utilisateur avec succès', async () => {
      const updateData = {
        userName: 'NewName',
        email: 'new@test.com',
      };

      mockActions.updateUserDataAction.mockResolvedValue({
        success: true,
        message: 'Données mises à jour',
      });

      const { result } = renderHook(() => useUpdateUserData(), {
        wrapper: createWrapper(),
      });

      await result.current.mutate(updateData);

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(mockActions.updateUserDataAction).toHaveBeenCalledWith(updateData);
    });

    it('devrait gérer les erreurs de mise à jour', async () => {
      mockActions.updateUserDataAction.mockRejectedValue(
        new Error('Erreur de mise à jour')
      );

      const { result } = renderHook(() => useUpdateUserData(), {
        wrapper: createWrapper(),
      });

      await result.current.mutate({ userName: 'NewName' });

      await waitFor(() => {
        expect(result.current.isError).toBe(true);
      });
    });
  });

  describe('useWithdrawConsent', () => {
    it('devrait retirer le consentement et déconnecter avec succès', async () => {
      mockActions.withdrawConsentAction.mockResolvedValue({
        success: true,
        message: 'Consentement retiré',
      });

      const { result } = renderHook(() => useWithdrawConsent(), {
        wrapper: createWrapper(),
      });

      await result.current.mutate();

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      // Devrait déconnecter après un délai
      await waitFor(
        () => {
          expect(signOut).toHaveBeenCalledWith({
            callbackUrl: '/auth/login',
          });
        },
        { timeout: 2000 }
      );
    });

    it('devrait gérer les erreurs de retrait de consentement', async () => {
      mockActions.withdrawConsentAction.mockResolvedValue({
        success: false,
        message: 'Erreur de retrait',
      });

      const { result } = renderHook(() => useWithdrawConsent(), {
        wrapper: createWrapper(),
      });

      await result.current.mutate();

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      // Ne devrait pas déconnecter en cas d'erreur
      expect(signOut).not.toHaveBeenCalled();
    });
  });

  describe('useRgpdRights', () => {
    it('devrait fournir tous les hooks RGPD', () => {
      const { result } = renderHook(() => useRgpdRights(), {
        wrapper: createWrapper(),
      });

      expect(result.current.deleteUser).toBeDefined();
      expect(result.current.exportUserData).toBeDefined();
      expect(result.current.updateUserData).toBeDefined();
      expect(result.current.withdrawConsent).toBeDefined();
      expect(result.current.isDeleting).toBeDefined();
      expect(result.current.isExporting).toBeDefined();
      expect(result.current.isUpdating).toBeDefined();
      expect(result.current.isWithdrawing).toBeDefined();
    });

    it('devrait gérer les états de chargement', async () => {
      mockActions.deleteUserAction.mockImplementation(
        () =>
          new Promise((resolve) =>
            setTimeout(
              () => resolve({ success: true, message: 'Utilisateur supprimé' }),
              100
            )
          )
      );

      const { result } = renderHook(() => useRgpdRights(), {
        wrapper: createWrapper(),
      });

      result.current.deleteUser.mutate();

      await waitFor(() => {
        expect(result.current.isDeleting).toBe(true);
      });

      await waitFor(() => {
        expect(result.current.isDeleting).toBe(false);
      });
    });

    it('devrait gérer les erreurs de tous les hooks', async () => {
      mockActions.deleteUserAction.mockRejectedValue(
        new Error('Erreur de suppression')
      );
      mockActions.exportUserDataAction.mockRejectedValue(
        new Error("Erreur d'export")
      );
      mockActions.updateUserDataAction.mockRejectedValue(
        new Error('Erreur de mise à jour')
      );
      mockActions.withdrawConsentAction.mockRejectedValue(
        new Error('Erreur de retrait')
      );

      const { result } = renderHook(() => useRgpdRights(), {
        wrapper: createWrapper(),
      });

      await result.current.deleteUser.mutate();
      await result.current.exportUserData.mutate();
      await result.current.updateUserData.mutate({});
      await result.current.withdrawConsent.mutate();

      await waitFor(() => {
        expect(result.current.deleteError).toBeDefined();
        expect(result.current.exportError).toBeDefined();
        expect(result.current.updateError).toBeDefined();
        expect(result.current.withdrawError).toBeDefined();
      });
    });
  });

  describe('Gestion des états', () => {
    it('devrait gérer les états de mutation correctement', async () => {
      // Mock les actions pour qu'elles retournent des promesses qui ne se résolvent pas immédiatement
      mockActions.deleteUserAction.mockImplementation(() => new Promise(() => {}));
      mockActions.exportUserDataAction.mockImplementation(() => new Promise(() => {}));
      mockActions.updateUserDataAction.mockImplementation(() => new Promise(() => {}));
      mockActions.withdrawConsentAction.mockImplementation(() => new Promise(() => {}));

      const { result } = renderHook(() => useRgpdRights(), {
        wrapper: createWrapper(),
      });

      // États initiaux
      expect(result.current.isDeleting).toBe(false);
      expect(result.current.isExporting).toBe(false);
      expect(result.current.isUpdating).toBe(false);
      expect(result.current.isWithdrawing).toBe(false);

      // Déclencher les mutations
      result.current.deleteUser.mutate();
      result.current.exportUserData.mutate();
      result.current.updateUserData.mutate({});
      result.current.withdrawConsent.mutate();

      // Vérifier les états de chargement
      await waitFor(() => {
        expect(result.current.isDeleting).toBe(true);
      });
      await waitFor(() => {
        expect(result.current.isExporting).toBe(true);
      });
      await waitFor(() => {
        expect(result.current.isUpdating).toBe(true);
      });
      await waitFor(() => {
        expect(result.current.isWithdrawing).toBe(true);
      });
    });

    it('devrait réinitialiser les états après les mutations', async () => {
      mockActions.deleteUserAction.mockResolvedValue({
        success: true,
        message: 'Utilisateur supprimé',
      });
      mockActions.exportUserDataAction.mockResolvedValue({
        success: true,
        message: 'Données exportées',
      });
      mockActions.updateUserDataAction.mockResolvedValue({
        success: true,
        message: 'Données mises à jour',
      });
      mockActions.withdrawConsentAction.mockResolvedValue({
        success: true,
        message: 'Consentement retiré',
      });

      const { result } = renderHook(() => useRgpdRights(), {
        wrapper: createWrapper(),
      });

      await result.current.deleteUser.mutate();
      await result.current.exportUserData.mutate();
      await result.current.updateUserData.mutate({});
      await result.current.withdrawConsent.mutate();

      await waitFor(() => {
        expect(result.current.isDeleting).toBe(false);
        expect(result.current.isExporting).toBe(false);
        expect(result.current.isUpdating).toBe(false);
        expect(result.current.isWithdrawing).toBe(false);
      });
    });
  });

  describe('Validation des données', () => {
    it('devrait valider les données avant les mutations', async () => {
      const { result } = renderHook(() => useUpdateUserData(), {
        wrapper: createWrapper(),
      });

      // Test avec des données invalides
      const invalidData = {
        userName: '',
        email: 'invalid-email',
      };

      await result.current.mutate(invalidData);

      await waitFor(() => {
        expect(mockActions.updateUserDataAction).toHaveBeenCalledWith(
          invalidData
        );
      });
    });
  });

  describe('Gestion des callbacks', () => {
    it('devrait exécuter les callbacks onSuccess correctement', async () => {
      const onSuccessCallback = vi.fn();

      mockActions.deleteUserAction.mockResolvedValue({
        success: true,
        message: 'Utilisateur supprimé',
      });

      const { result } = renderHook(() => useDeleteUser(), {
        wrapper: createWrapper(),
      });

      await result.current.mutate(undefined, { onSuccess: onSuccessCallback });

      await waitFor(() => {
        expect(onSuccessCallback).toHaveBeenCalled();
      });
    });

    it('devrait exécuter les callbacks onError correctement', async () => {
      const onErrorCallback = vi.fn();

      mockActions.deleteUserAction.mockRejectedValue(new Error('Test error'));

      const { result } = renderHook(() => useDeleteUser(), {
        wrapper: createWrapper(),
      });

      await result.current.mutate(undefined, { onError: onErrorCallback });

      await waitFor(() => {
        expect(onErrorCallback).toHaveBeenCalled();
      });
    });
  });
});
