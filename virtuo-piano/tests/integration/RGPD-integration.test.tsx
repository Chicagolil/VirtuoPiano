import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import DataTab from '@/features/account/DataTab';
import React from 'react';

// Mock des composants enfants
vi.mock('@/features/account/modals', () => ({
  DataPreviewModal: ({ isOpen, onClose, data }: any) =>
    isOpen ? (
      <div data-testid="data-preview-modal">Data Preview Modal</div>
    ) : null,
  EditDataModal: ({ isOpen, onClose }: any) =>
    isOpen ? <div data-testid="edit-data-modal">Edit Data Modal</div> : null,
  DeleteAccountModal: ({ isOpen, onClose }: any) =>
    isOpen ? (
      <div data-testid="delete-account-modal">Delete Account Modal</div>
    ) : null,
  ExportDataModal: ({ isOpen, onClose, data }: any) =>
    isOpen ? (
      <div data-testid="export-data-modal">Export Data Modal</div>
    ) : null,
  OppositionModal: ({ isOpen, onClose }: any) =>
    isOpen ? <div data-testid="opposition-modal">Opposition Modal</div> : null,
}));

describe('RGPD Integration Tests', () => {
  let queryClient: QueryClient;

  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false },
        mutations: { retry: false },
      },
    });
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

  describe('Interface utilisateur RGPD', () => {
    it("devrait afficher l'interface des droits RGPD", async () => {
      renderWithProviders(<DataTab />);

      // Vérifier que l'interface RGPD est affichée
      expect(screen.getByText('Droits RGPD')).toBeInTheDocument();
      expect(screen.getByText("Droit d'accès")).toBeInTheDocument();
      expect(screen.getByText('Droit de rectification')).toBeInTheDocument();
      expect(screen.getByText("Droit d'opposition")).toBeInTheDocument();
      expect(screen.getByText("Droit à l'effacement")).toBeInTheDocument();
    });

    it("devrait afficher les boutons d'action RGPD", async () => {
      renderWithProviders(<DataTab />);

      // Vérifier que les boutons sont présents
      expect(screen.getByText('Exporter')).toBeInTheDocument();
      expect(screen.getByText('Modifier')).toBeInTheDocument();
      expect(screen.getByText('Retirer consentement')).toBeInTheDocument();
      expect(screen.getByText('Supprimer')).toBeInTheDocument();
    });

    it('devrait afficher les descriptions des droits RGPD', async () => {
      renderWithProviders(<DataTab />);

      // Vérifier que les descriptions sont présentes
      expect(
        screen.getByText(/Obtenez une copie de toutes vos données personnelles/)
      ).toBeInTheDocument();
      expect(
        screen.getByText(/Modifiez ou corrigez vos informations personnelles/)
      ).toBeInTheDocument();
      expect(
        screen.getByText(/Retirez votre consentement au traitement/)
      ).toBeInTheDocument();
      expect(
        screen.getByText(/Supprimez définitivement votre compte/)
      ).toBeInTheDocument();
    });
  });

  describe('Navigation et interaction', () => {
    it('devrait permettre la navigation entre les sections RGPD', async () => {
      renderWithProviders(<DataTab />);

      // Vérifier que toutes les sections sont accessibles
      const sections = [
        "Droit d'accès",
        'Droit de rectification',
        "Droit d'opposition",
        "Droit à l'effacement",
      ];

      sections.forEach((section) => {
        expect(screen.getByText(section)).toBeInTheDocument();
      });
    });

    it('devrait avoir une interface utilisateur cohérente', async () => {
      renderWithProviders(<DataTab />);

      // Vérifier la structure de l'interface
      expect(screen.getByText('Droits RGPD')).toBeInTheDocument();
      expect(
        screen.getByText(
          /Conformément au Règlement Général sur la Protection des Données/
        )
      ).toBeInTheDocument();
    });
  });
});
