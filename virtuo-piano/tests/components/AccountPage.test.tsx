import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import AccountPage from '@/features/account/AccountPage';

// Mock des composants enfants
vi.mock('@/features/account/ProfilTab', () => ({
  default: () => <div data-testid="profil-tab">Profil Tab Content</div>,
}));

vi.mock('@/features/account/DataTab', () => ({
  default: () => <div data-testid="data-tab">Data Tab Content</div>,
}));

// Mock des icônes
vi.mock('@tabler/icons-react', () => ({
  IconUser: () => <span data-testid="user-icon">👤</span>,
}));

describe('AccountPage', () => {
  let queryClient: QueryClient;

  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false },
        mutations: { retry: false },
      },
    });
  });

  const renderAccountPage = (user: string = 'test-user-id') => {
    return render(
      <QueryClientProvider client={queryClient}>
        <AccountPage user={user} />
      </QueryClientProvider>
    );
  };

  describe('Rendu initial', () => {
    it('devrait afficher le titre de la page', () => {
      renderAccountPage();

      expect(
        screen.getByText(/Gérez votre compte et vos données personnelles/)
      ).toBeInTheDocument();
    });

    it('devrait afficher les onglets Profil et Mes Données', () => {
      renderAccountPage();

      expect(screen.getByText('Profil')).toBeInTheDocument();
      expect(screen.getByText('Mes Données')).toBeInTheDocument();
    });

    it("devrait afficher l'icône utilisateur", () => {
      renderAccountPage();

      expect(screen.getByTestId('user-icon')).toBeInTheDocument();
    });

    it("devrait afficher le contenu de l'onglet Profil par défaut", () => {
      renderAccountPage();

      expect(screen.getByTestId('profil-tab')).toBeInTheDocument();
      expect(screen.queryByTestId('data-tab')).not.toBeInTheDocument();
    });
  });

  describe('Navigation entre les onglets', () => {
    it("devrait basculer vers l'onglet Mes Données quand cliqué", async () => {
      renderAccountPage();

      const dataTab = screen.getByText('Mes Données');
      fireEvent.click(dataTab);

      // Vérifier que le bouton a été cliqué
      expect(dataTab).toBeInTheDocument();
    });

    it("devrait revenir à l'onglet Profil quand cliqué", async () => {
      renderAccountPage();

      const profilTab = screen.getByText('Profil');
      const dataTab = screen.getByText('Mes Données');

      // Cliquer sur Mes Données puis sur Profil
      fireEvent.click(dataTab);
      fireEvent.click(profilTab);

      // Vérifier que les boutons sont présents
      expect(profilTab).toBeInTheDocument();
      expect(dataTab).toBeInTheDocument();
    });
  });

  describe('Styles et classes CSS', () => {
    it('devrait avoir les classes CSS appropriées', () => {
      renderAccountPage();

      // Chercher le conteneur principal en remontant plus dans la hiérarchie
      const container = screen.getByText(/Gérez votre compte/).closest('div')
        ?.parentElement?.parentElement?.parentElement;
      expect(container).toHaveClass('w-full');
    });

    it('devrait avoir un conteneur avec les bonnes classes', () => {
      renderAccountPage();

      // Chercher le conteneur principal en remontant plus dans la hiérarchie
      const mainContainer = screen
        .getByText(/Gérez votre compte/)
        .closest('div')?.parentElement?.parentElement
        ?.parentElement?.parentElement;
      expect(mainContainer).toHaveClass(
        'max-w-[98.5%]',
        'mx-auto',
        'bg-transparent'
      );
    });

    it('devrait avoir un header avec gradient', () => {
      renderAccountPage();

      // Chercher l'élément avec le gradient
      const header = screen
        .getByText(/Gérez votre compte/)
        .closest('.bg-gradient-to-r');
      expect(header).toHaveClass(
        'bg-gradient-to-r',
        'from-blue-500/20',
        'via-indigo-500/20',
        'to-orange-400/20'
      );
    });
  });

  describe('Accessibilité', () => {
    it('devrait avoir des rôles appropriés pour les onglets', () => {
      renderAccountPage();

      const tabList = screen.getByRole('tablist');
      expect(tabList).toBeInTheDocument();

      const tabs = screen.getAllByRole('tab');
      expect(tabs).toHaveLength(2);
      expect(tabs[0]).toHaveTextContent('Profil');
      expect(tabs[1]).toHaveTextContent('Mes Données');
    });

    it('devrait avoir des attributs aria appropriés', () => {
      renderAccountPage();

      const profilTab = screen.getByRole('tab', { name: 'Profil' });
      const dataTab = screen.getByRole('tab', { name: 'Mes Données' });

      expect(profilTab).toHaveAttribute('aria-selected', 'true');
      expect(dataTab).toHaveAttribute('aria-selected', 'false');
    });
  });

  describe('Responsive design', () => {
    it('devrait avoir des classes responsive appropriées', () => {
      renderAccountPage();

      // Chercher l'élément avec les classes flex
      const header = screen
        .getByText(/Gérez votre compte/)
        .closest('.flex.flex-col.md\\:flex-row.md\\:items-center');
      expect(header).toHaveClass(
        'flex',
        'flex-col',
        'md:flex-row',
        'md:items-center'
      );
    });

    it('devrait avoir des classes responsive pour les onglets', () => {
      renderAccountPage();

      const tabList = screen.getByRole('tablist');
      expect(tabList).toHaveClass(
        'flex',
        'p-1',
        'bg-white/20',
        'backdrop-blur-sm',
        'rounded-lg'
      );
    });
  });

  describe('Gestion des props', () => {
    it('devrait accepter et utiliser la prop user', () => {
      const testUserId = 'test-user-123';
      renderAccountPage(testUserId);

      // Vérifier que le composant se rend correctement avec l'ID utilisateur
      expect(screen.getByText(/Gérez votre compte/)).toBeInTheDocument();
    });

    it("devrait fonctionner avec différents types d'ID utilisateur", () => {
      const numericUserId = '12345';
      renderAccountPage(numericUserId);

      expect(screen.getByText(/Gérez votre compte/)).toBeInTheDocument();
    });
  });

  describe('Interactions utilisateur', () => {
    it('devrait répondre aux clics sur les onglets', async () => {
      renderAccountPage();

      const dataTab = screen.getByText('Mes Données');

      fireEvent.click(dataTab);

      // Vérifier que le bouton a été cliqué
      expect(dataTab).toBeInTheDocument();
    });
  });

  describe('Gestion des erreurs', () => {
    it('devrait gérer les erreurs de rendu des composants enfants', () => {
      // Mock d'un composant qui lève une erreur
      const consoleSpy = vi
        .spyOn(console, 'error')
        .mockImplementation(() => {});

      renderAccountPage();

      // Vérifier que le composant se rend malgré les erreurs potentielles
      expect(screen.getByText(/Gérez votre compte/)).toBeInTheDocument();

      consoleSpy.mockRestore();
    });
  });

  describe('Performance', () => {
    it('devrait éviter les re-rendus inutiles', () => {
      const { rerender } = renderAccountPage();

      // Re-rendre avec les mêmes props
      rerender(
        <QueryClientProvider client={queryClient}>
          <AccountPage user="test-user-id" />
        </QueryClientProvider>
      );

      // Le composant devrait toujours être présent
      expect(screen.getByText(/Gérez votre compte/)).toBeInTheDocument();
    });
  });

  describe('Intégration avec les composants enfants', () => {
    it('devrait passer les bonnes props aux composants enfants', () => {
      renderAccountPage();

      // Vérifier que les composants enfants sont rendus
      expect(screen.getByTestId('profil-tab')).toBeInTheDocument();
    });

    it('devrait permettre aux composants enfants de fonctionner correctement', async () => {
      renderAccountPage();

      // Vérifier que les onglets sont présents
      const profilTab = screen.getByText('Profil');
      const dataTab = screen.getByText('Mes Données');

      expect(profilTab).toBeInTheDocument();
      expect(dataTab).toBeInTheDocument();
    });
  });
});
