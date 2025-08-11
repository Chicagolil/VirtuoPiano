import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import BarChartWithNavigation from '@/components/charts/BarChartWithNavigation';
import LineChartWithNavigation from '@/components/charts/LineChartWithNavigation';
import RecordsTimeline from '@/components/timeline/RecordsTimeline';
import { IconChartBar, IconChartLine, IconTrophy } from '@tabler/icons-react';

// Mock Recharts
vi.mock('recharts', () => ({
  BarChart: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="bar-chart">{children}</div>
  ),
  LineChart: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="line-chart">{children}</div>
  ),
  Bar: ({ dataKey }: { dataKey: string }) => (
    <div data-testid={`bar-${dataKey}`}>{dataKey}</div>
  ),
  Line: ({ dataKey }: { dataKey: string }) => (
    <div data-testid={`line-${dataKey}`}>{dataKey}</div>
  ),
  XAxis: () => <div data-testid="x-axis" />,
  YAxis: () => <div data-testid="y-axis" />,
  CartesianGrid: () => <div data-testid="cartesian-grid" />,
  Tooltip: () => <div data-testid="tooltip" />,
  ResponsiveContainer: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="responsive-container">{children}</div>
  ),
}));

// Mock des utilitaires
vi.mock('@/features/performances/utils/chartUtils', () => ({
  getBubbleBorderColor: vi.fn(() => 'border-blue-300'),
  getBubbleColor: vi.fn(() => 'from-blue-500 to-blue-600'),
  getIcon: vi.fn(() => <IconTrophy data-testid="record-icon" />),
  getPopupIcon: vi.fn(() => <IconTrophy data-testid="popup-icon" />),
  getValueDisplay: vi.fn(() => '90%'),
}));

// Mock des composants UI
vi.mock('@/components/ui/spinner', () => ({
  Spinner: ({
    variant,
    size,
    className,
  }: {
    variant: string;
    size: number;
    className: string;
  }) => (
    <div
      data-testid="spinner"
      data-variant={variant}
      data-size={size}
      className={className}
    >
      Loading...
    </div>
  ),
}));

// Wrapper pour les tests React Query
const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

describe('Chart Navigation Integration Tests', () => {
  const mockBarChartData = [
    {
      label: 'Jan 2024 - Jun 2024',
      data: [
        { mois: 'Jan 2024', precision: 85, performance: 80 },
        { mois: 'Feb 2024', precision: 88, performance: 83 },
        { mois: 'Mar 2024', precision: 90, performance: 85 },
        { mois: 'Apr 2024', precision: 87, performance: 82 },
        { mois: 'May 2024', precision: 92, performance: 88 },
        { mois: 'Jun 2024', precision: 89, performance: 86 },
      ],
    },
    {
      label: 'Jul 2024 - Dec 2024',
      data: [
        { mois: 'Jul 2024', precision: 91, performance: 87 },
        { mois: 'Aug 2024', precision: 93, performance: 89 },
        { mois: 'Sep 2024', precision: 88, performance: 84 },
        { mois: 'Oct 2024', precision: 90, performance: 86 },
        { mois: 'Nov 2024', precision: 92, performance: 88 },
        { mois: 'Dec 2024', precision: 94, performance: 90 },
      ],
    },
  ];

  const mockLineChartData = [
    { session: "Aujourd'hui", precision: 85, performance: 80 },
    { session: 'Hier', precision: 88, performance: 83 },
    { session: 'Il y a 2 jours', precision: 90, performance: 85 },
    { session: 'Il y a 3 jours', precision: 87, performance: 82 },
    { session: 'Il y a 4 jours', precision: 92, performance: 88 },
  ];

  const mockTimelineRecords = [
    {
      id: 1,
      date: '2024-01-01T10:00:00Z',
      score: 90,
      type: 'accuracy_right',
      description: 'Meilleure précision main droite',
      details: 'Vous avez atteint 90% de précision avec votre main droite.',
    },
    {
      id: 2,
      date: '2024-01-02T10:00:00Z',
      score: 95,
      type: 'performance_both',
      description: 'Meilleure performance deux mains',
      details: 'Vous avez atteint 95% de performance avec les deux mains.',
    },
    {
      id: 3,
      date: '2024-01-03T10:00:00Z',
      score: 10000,
      type: 'score',
      description: 'Meilleur score',
      details: 'Vous avez obtenu 10,000 points.',
    },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('BarChartWithNavigation Integration', () => {
    it('devrait naviguer entre les intervalles de données', () => {
      const onIndexChange = vi.fn();

      render(
        <BarChartWithNavigation
          title="Test Bar Chart"
          icon={<IconChartBar />}
          intervals={mockBarChartData}
          bars={[
            { dataKey: 'precision', color: '#3b82f6', name: 'Précision' },
            { dataKey: 'performance', color: '#10b981', name: 'Performance' },
          ]}
          index={0}
          onIndexChange={onIndexChange}
          themeColor="text-blue-500"
          maxIntervals={2}
        />
      );

      // Vérifier que le premier intervalle est affiché
      expect(screen.getByText('Jan 2024 - Jun 2024')).toBeInTheDocument();

      // Naviguer vers l'intervalle suivant
      // Selon la logique du composant : "Période plus récente" diminue l'index (index - 1)
      // Mais avec index=0, on ne peut pas aller plus récent, donc le bouton devrait être désactivé
      // Utilisons plutôt "Période plus ancienne" qui augmente l'index (index + 1)
      const prevButton = screen.getByLabelText('Période plus ancienne');
      fireEvent.click(prevButton);

      expect(onIndexChange).toHaveBeenCalledWith(1);
    });

    it('devrait désactiver les boutons aux extrémités', () => {
      const onIndexChange = vi.fn();

      render(
        <BarChartWithNavigation
          title="Test Bar Chart"
          icon={<IconChartBar />}
          intervals={mockBarChartData}
          bars={[
            { dataKey: 'precision', color: '#3b82f6', name: 'Précision' },
            { dataKey: 'performance', color: '#10b981', name: 'Performance' },
          ]}
          index={0}
          onIndexChange={onIndexChange}
          themeColor="text-blue-500"
          maxIntervals={2}
        />
      );

      // Au premier intervalle (index=0) :
      // - Le bouton "Période plus récente" devrait être désactivé (ne peut pas aller plus récent que 0)
      // - Le bouton "Période plus ancienne" devrait être activé (peut aller vers index 1)
      const nextButton = screen.getByLabelText('Période plus récente');
      expect(nextButton).toBeDisabled();

      const prevButton = screen.getByLabelText('Période plus ancienne');
      expect(prevButton).not.toBeDisabled();
    });

    it('devrait gérer le mode multi-axes', () => {
      const onIndexChange = vi.fn();

      render(
        <BarChartWithNavigation
          title="Test Multi-Axis Chart"
          icon={<IconChartBar />}
          intervals={mockBarChartData}
          bars={[
            {
              dataKey: 'score',
              color: '#3b82f6',
              name: 'Score',
              yAxisId: 'score',
            },
            {
              dataKey: 'combo',
              color: '#f59e0b',
              name: 'Combo',
              yAxisId: 'combo',
            },
            {
              dataKey: 'multi',
              color: '#10b981',
              name: 'Multiplicateur',
              yAxisId: 'multi',
            },
          ]}
          index={0}
          onIndexChange={onIndexChange}
          themeColor="text-blue-500"
          multiAxis={true}
        />
      );

      expect(screen.getByTestId('bar-score')).toBeInTheDocument();
      expect(screen.getByTestId('bar-combo')).toBeInTheDocument();
      expect(screen.getByTestId('bar-multi')).toBeInTheDocument();
    });

    it("devrait afficher les états de chargement et d'erreur", () => {
      const onIndexChange = vi.fn();

      // Test de chargement
      const { rerender } = render(
        <BarChartWithNavigation
          title="Test Bar Chart"
          icon={<IconChartBar />}
          intervals={mockBarChartData}
          bars={[
            { dataKey: 'precision', color: '#3b82f6', name: 'Précision' },
            { dataKey: 'performance', color: '#10b981', name: 'Performance' },
          ]}
          index={0}
          onIndexChange={onIndexChange}
          themeColor="text-blue-500"
          isLoading={true}
        />
      );

      expect(screen.getByTestId('spinner')).toBeInTheDocument();

      // Test d'erreur
      rerender(
        <BarChartWithNavigation
          title="Test Bar Chart"
          icon={<IconChartBar />}
          intervals={mockBarChartData}
          bars={[
            { dataKey: 'precision', color: '#3b82f6', name: 'Précision' },
            { dataKey: 'performance', color: '#10b981', name: 'Performance' },
          ]}
          index={0}
          onIndexChange={onIndexChange}
          themeColor="text-blue-500"
          error={new Error('Erreur de chargement')}
          isLoading={false}
        />
      );

      expect(screen.getByText('Erreur de chargement')).toBeInTheDocument();
    });
  });

  describe('LineChartWithNavigation Integration', () => {
    it('devrait naviguer entre les intervalles de données', () => {
      const onIndexChange = vi.fn();
      const onIntervalChange = vi.fn();

      render(
        <LineChartWithNavigation
          title="Test Line Chart"
          icon={<IconChartLine />}
          data={mockLineChartData}
          lines={[
            { dataKey: 'precision', color: '#3b82f6', name: 'Précision' },
            { dataKey: 'performance', color: '#10b981', name: 'Performance' },
          ]}
          interval={5}
          index={0}
          onIntervalChange={onIntervalChange}
          onIndexChange={onIndexChange}
          maxDataLength={10}
          themeColor="text-blue-500"
          intervalOptions={[
            { value: 5, label: '5 sessions' },
            { value: 10, label: '10 sessions' },
          ]}
          isLoading={false}
          error={null}
        />
      );

      // Vérifier que les contrôles de navigation sont présents
      const buttons = screen.getAllByRole('button');
      expect(buttons).toHaveLength(2); // Deux boutons de navigation
      const select = screen.getByRole('combobox');
      expect(select).toBeInTheDocument();

      // Changer l'intervalle
      fireEvent.change(select, { target: { value: '10' } });

      expect(onIntervalChange).toHaveBeenCalledWith(10);
    });

    it('devrait afficher le résumé des données', () => {
      const onIndexChange = vi.fn();
      const onIntervalChange = vi.fn();

      const summary = (
        <div data-testid="summary">
          <div>Moyenne précision: 88%</div>
          <div>Moyenne performance: 83%</div>
        </div>
      );

      render(
        <LineChartWithNavigation
          title="Test Line Chart"
          icon={<IconChartLine />}
          data={mockLineChartData}
          lines={[
            { dataKey: 'precision', color: '#3b82f6', name: 'Précision' },
            { dataKey: 'performance', color: '#10b981', name: 'Performance' },
          ]}
          interval={5}
          index={0}
          onIntervalChange={onIntervalChange}
          onIndexChange={onIndexChange}
          maxDataLength={10}
          themeColor="text-blue-500"
          intervalOptions={[
            { value: 5, label: '5 sessions' },
            { value: 10, label: '10 sessions' },
          ]}
          summary={summary}
          isLoading={false}
          error={null}
        />
      );

      expect(screen.getByTestId('summary')).toBeInTheDocument();
      expect(screen.getByText('Moyenne précision: 88%')).toBeInTheDocument();
      expect(screen.getByText('Moyenne performance: 83%')).toBeInTheDocument();
    });

    it("devrait gérer les états de chargement et d'erreur", () => {
      const onIndexChange = vi.fn();
      const onIntervalChange = vi.fn();

      // Test de chargement
      const { rerender } = render(
        <LineChartWithNavigation
          title="Test Line Chart"
          icon={<IconChartLine />}
          data={mockLineChartData}
          lines={[
            { dataKey: 'precision', color: '#3b82f6', name: 'Précision' },
            { dataKey: 'performance', color: '#10b981', name: 'Performance' },
          ]}
          interval={5}
          index={0}
          onIntervalChange={onIntervalChange}
          onIndexChange={onIndexChange}
          maxDataLength={10}
          themeColor="text-blue-500"
          intervalOptions={[
            { value: 5, label: '5 sessions' },
            { value: 10, label: '10 sessions' },
          ]}
          isLoading={true}
          error={null}
        />
      );

      expect(screen.getByTestId('spinner')).toBeInTheDocument();

      // Test d'erreur
      rerender(
        <LineChartWithNavigation
          title="Test Line Chart"
          icon={<IconChartLine />}
          data={mockLineChartData}
          lines={[
            { dataKey: 'precision', color: '#3b82f6', name: 'Précision' },
            { dataKey: 'performance', color: '#10b981', name: 'Performance' },
          ]}
          interval={5}
          index={0}
          onIntervalChange={onIntervalChange}
          onIndexChange={onIndexChange}
          maxDataLength={10}
          themeColor="text-blue-500"
          intervalOptions={[
            { value: 5, label: '5 sessions' },
            { value: 10, label: '10 sessions' },
          ]}
          error={new Error('Erreur de chargement')}
          isLoading={false}
        />
      );

      expect(screen.getByText('Erreur de chargement')).toBeInTheDocument();
    });
  });

  describe('RecordsTimeline Integration', () => {
    it('devrait afficher et naviguer dans les records', async () => {
      render(
        <RecordsTimeline
          records={mockTimelineRecords}
          isLoading={false}
          error={null}
        />
      );

      // Vérifier que les bulles sont présentes
      const bubbles = screen.getAllByRole('button');
      expect(bubbles).toHaveLength(3);

      // Cliquer sur la première bulle pour afficher sa description
      fireEvent.click(bubbles[0]);

      await waitFor(() => {
        expect(
          screen.getByText('Meilleure précision main droite')
        ).toBeInTheDocument();
        expect(
          screen.getByText(
            'Vous avez atteint 90% de précision avec votre main droite.'
          )
        ).toBeInTheDocument();
        expect(screen.getByText('90%')).toBeInTheDocument();
        expect(screen.getByText('Nouveau record !')).toBeInTheDocument();
      });
    });

    it("devrait gérer les états de chargement et d'erreur", () => {
      // Test de chargement
      const { rerender } = render(
        <RecordsTimeline
          records={mockTimelineRecords}
          isLoading={true}
          error={null}
        />
      );

      expect(screen.getByTestId('spinner')).toBeInTheDocument();

      // Test d'erreur
      rerender(
        <RecordsTimeline
          records={mockTimelineRecords}
          isLoading={false}
          error={new Error('Erreur de chargement')}
        />
      );

      expect(screen.getByText('Erreur de chargement')).toBeInTheDocument();
    });

    it('devrait gérer les records vides', () => {
      render(<RecordsTimeline records={[]} isLoading={false} error={null} />);

      expect(screen.queryByRole('button')).not.toBeInTheDocument();
    });

    it('devrait positionner correctement les popups', async () => {
      render(
        <RecordsTimeline
          records={mockTimelineRecords}
          isLoading={false}
          error={null}
        />
      );

      const bubbles = screen.getAllByRole('button');

      // Cliquer sur la première bulle (premier record)
      fireEvent.click(bubbles[0]);
      await waitFor(() => {
        const popup = screen
          .getByText('Meilleure précision main droite')
          .closest('div');
        // Le premier record utilise 'left-0 transform translate-x-0'
        expect(popup?.parentElement?.parentElement?.parentElement).toHaveClass(
          'left-0'
        );
      });

      // Cliquer sur la dernière bulle (dernier record)
      fireEvent.click(bubbles[2]);
      await waitFor(() => {
        const popup = screen.getByText('Meilleur score').closest('div');
        // Le dernier record utilise 'right-0 transform translate-x-0'
        expect(popup?.parentElement?.parentElement?.parentElement).toHaveClass(
          'right-0'
        );
      });

      // Cliquer sur la bulle du milieu
      fireEvent.click(bubbles[1]);
      await waitFor(() => {
        const popup = screen
          .getByText('Meilleure performance deux mains')
          .closest('div');
        // Le record du milieu utilise 'left-1/2 transform -translate-x-1/2'
        expect(popup?.parentElement?.parentElement?.parentElement).toHaveClass(
          'left-1/2'
        );
      });
    });
  });

  describe('Integration entre composants', () => {
    it('devrait gérer la navigation entre différents types de graphiques', () => {
      const onBarIndexChange = vi.fn();
      const onLineIndexChange = vi.fn();

      render(
        <div>
          <BarChartWithNavigation
            title="Bar Chart"
            icon={<IconChartBar />}
            intervals={mockBarChartData}
            bars={[
              { dataKey: 'precision', color: '#3b82f6', name: 'Précision' },
              { dataKey: 'performance', color: '#10b981', name: 'Performance' },
            ]}
            index={0}
            onIndexChange={onBarIndexChange}
            themeColor="text-blue-500"
            maxIntervals={2}
          />
          <LineChartWithNavigation
            title="Line Chart"
            icon={<IconChartLine />}
            data={mockLineChartData}
            lines={[
              { dataKey: 'precision', color: '#3b82f6', name: 'Précision' },
              { dataKey: 'performance', color: '#10b981', name: 'Performance' },
            ]}
            interval={5}
            index={0}
            onIntervalChange={vi.fn()}
            onIndexChange={onLineIndexChange}
            maxDataLength={10}
            themeColor="text-blue-500"
            intervalOptions={[
              { value: 5, label: '5 sessions' },
              { value: 10, label: '10 sessions' },
            ]}
            isLoading={false}
            error={null}
          />
        </div>
      );

      // Naviguer dans le bar chart - utiliser "Période plus ancienne" pour index + 1
      const barPrevButtons = screen.getAllByLabelText('Période plus ancienne');
      const barPrevButton = barPrevButtons[0]; // Le premier bouton (du bar chart)
      fireEvent.click(barPrevButton);
      expect(onBarIndexChange).toHaveBeenCalledWith(1);

      // Naviguer dans le line chart - utiliser "Période plus récente" pour index + 1 (logique différente)
      const lineNextButtons = screen.getAllByLabelText('Période plus récente');
      const lineNextButton = lineNextButtons[1]; // Le deuxième bouton (du line chart)
      fireEvent.click(lineNextButton);
      expect(onLineIndexChange).toHaveBeenCalledWith(1);
    });
  });
});
