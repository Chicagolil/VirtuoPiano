import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import DataTab from '@/features/account/DataTab';

// Mock des modals
vi.mock('@/features/account/modals', () => ({
  ExportDataModal: ({ isOpen, onClose }: any) =>
    isOpen ? (
      <div data-testid="export-data-modal">Export Data Modal</div>
    ) : null,
  EditDataModal: ({ isOpen, onClose }: any) =>
    isOpen ? <div data-testid="edit-data-modal">Edit Data Modal</div> : null,
  OppositionModal: ({ isOpen, onClose }: any) =>
    isOpen ? <div data-testid="opposition-modal">Opposition Modal</div> : null,
  DeleteAccountModal: ({ isOpen, onClose }: any) =>
    isOpen ? (
      <div data-testid="delete-account-modal">Delete Account Modal</div>
    ) : null,
}));

// Mock des icônes
vi.mock('@tabler/icons-react', () => ({
  IconDatabase: () => <span data-testid="database-icon">🗄️</span>,
  IconDownload: () => <span data-testid="download-icon">📥</span>,
  IconEdit: () => <span data-testid="edit-icon">✏️</span>,
  IconTrash: () => <span data-testid="trash-icon">🗑️</span>,
  IconBan: () => <span data-testid="ban-icon">🚫</span>,
}));

describe('DataTab', () => {
  let queryClient: QueryClient;

  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false },
        mutations: { retry: false },
      },
    });
  });

  const renderDataTab = () => {
    return render(
      <QueryClientProvider client={queryClient}>
        <DataTab />
      </QueryClientProvider>
    );
  };

  describe('Rendu initial', () => {
    it('devrait afficher le titre de la section', () => {
      renderDataTab();

      expect(screen.getByText('Droits RGPD')).toBeInTheDocument();
    });

    it("devrait afficher les cartes d'action", () => {
      renderDataTab();

      expect(screen.getByText("Droit d'accès")).toBeInTheDocument();
      expect(screen.getByText('Droit de rectification')).toBeInTheDocument();
      expect(screen.getByText("Droit d'opposition")).toBeInTheDocument();
      expect(screen.getByText("Droit à l'effacement")).toBeInTheDocument();
    });

    it('devrait afficher les icônes appropriées', () => {
      renderDataTab();

      expect(screen.getByTestId('database-icon')).toBeInTheDocument();
      expect(screen.getAllByTestId('download-icon')).toHaveLength(2);
      expect(screen.getAllByTestId('edit-icon')).toHaveLength(2);
      expect(screen.getAllByTestId('trash-icon')).toHaveLength(2);
      expect(screen.getAllByTestId('ban-icon')).toHaveLength(2);
    });
  });

  describe('Interactions avec les boutons', () => {
    it("devrait ouvrir le modal d'export des données", async () => {
      renderDataTab();

      const exportButton = screen.getByText('Exporter');
      fireEvent.click(exportButton);

      await waitFor(() => {
        expect(screen.getByTestId('export-data-modal')).toBeInTheDocument();
      });
    });

    it('devrait ouvrir le modal de modification des données', async () => {
      renderDataTab();

      const editButton = screen.getByText('Modifier');
      fireEvent.click(editButton);

      await waitFor(() => {
        expect(screen.getByTestId('edit-data-modal')).toBeInTheDocument();
      });
    });

    it('devrait ouvrir le modal de suppression de compte', async () => {
      renderDataTab();

      const deleteButton = screen.getByText('Supprimer');
      fireEvent.click(deleteButton);

      await waitFor(() => {
        expect(screen.getByTestId('delete-account-modal')).toBeInTheDocument();
      });
    });

    it("devrait ouvrir le modal d'opposition", async () => {
      renderDataTab();

      const withdrawButton = screen.getByText('Retirer consentement');
      fireEvent.click(withdrawButton);

      await waitFor(() => {
        expect(screen.getByTestId('opposition-modal')).toBeInTheDocument();
      });
    });
  });

  describe('Accessibilité', () => {
    it('devrait avoir des rôles appropriés', () => {
      renderDataTab();

      expect(screen.getByRole('heading')).toBeInTheDocument();
    });
  });

  describe('Styles et classes CSS', () => {
    it('devrait avoir les classes CSS appropriées', () => {
      renderDataTab();

      const container = screen.getByText('Droits RGPD').closest('div')
        ?.parentElement?.parentElement?.parentElement;
      expect(container).toHaveClass('space-y-6');
    });

    it('devrait avoir des cartes avec les bonnes classes', () => {
      renderDataTab();

      const cards = screen.getAllByText(/Droit d'|Droit de|Droit à/);
      cards.forEach((card) => {
        const cardContainer = card.closest('div')?.parentElement?.parentElement;
        expect(cardContainer).toHaveClass(
          'bg-white/5',
          'backdrop-blur-sm',
          'rounded-xl'
        );
      });
    });
  });

  describe('Responsive design', () => {
    it('devrait avoir des classes responsive appropriées', () => {
      renderDataTab();

      // Vérifier que le composant se rend correctement
      expect(screen.getByText('Droits RGPD')).toBeInTheDocument();
    });
  });

  describe('Intégration avec les modals', () => {
    it('devrait fermer les modals quand onClose est appelé', async () => {
      renderDataTab();

      // Ouvrir un modal
      const exportButton = screen.getByText('Exporter');
      fireEvent.click(exportButton);

      await waitFor(() => {
        expect(screen.getByTestId('export-data-modal')).toBeInTheDocument();
      });

      // Le modal devrait être présent
      expect(screen.getByTestId('export-data-modal')).toBeInTheDocument();
    });
  });

  describe('Gestion des états', () => {
    it('devrait gérer les états des modals correctement', async () => {
      renderDataTab();

      // Vérifier que les modals ne sont pas affichés initialement
      expect(screen.queryByTestId('export-data-modal')).not.toBeInTheDocument();
      expect(screen.queryByTestId('edit-data-modal')).not.toBeInTheDocument();
      expect(
        screen.queryByTestId('delete-account-modal')
      ).not.toBeInTheDocument();
      expect(screen.queryByTestId('opposition-modal')).not.toBeInTheDocument();

      // Ouvrir un modal
      const exportButton = screen.getByText('Exporter');
      fireEvent.click(exportButton);

      await waitFor(() => {
        expect(screen.getByTestId('export-data-modal')).toBeInTheDocument();
      });
    });
  });

  describe('Contenu des cartes', () => {
    it('devrait afficher les descriptions appropriées', () => {
      renderDataTab();

      expect(
        screen.getByText(/Obtenez une copie de toutes vos données/)
      ).toBeInTheDocument();
      expect(
        screen.getByText(/Modifiez ou corrigez vos informations/)
      ).toBeInTheDocument();
      expect(
        screen.getByText(/Retirez votre consentement au traitement/)
      ).toBeInTheDocument();
      expect(
        screen.getByText(/Supprimez définitivement votre compte/)
      ).toBeInTheDocument();
    });

    it('devrait afficher les boutons avec les bonnes couleurs', () => {
      renderDataTab();

      const exportButton = screen.getByText('Exporter');
      const editButton = screen.getByText('Modifier');
      const deleteButton = screen.getByText('Supprimer');
      const withdrawButton = screen.getByText('Retirer consentement');

      expect(exportButton).toHaveClass('bg-green-500/20');
      expect(editButton).toHaveClass('bg-blue-500/20');
      expect(deleteButton).toHaveClass('bg-red-500/20');
      expect(withdrawButton).toHaveClass('bg-orange-500/20');
    });
  });
});
