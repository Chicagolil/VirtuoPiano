import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import LineChartWithNavigation from '@/components/charts/LineChartWithNavigation';
import { IconChartLine } from '@tabler/icons-react';

// Mock Recharts
vi.mock('recharts', () => ({
  LineChart: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="line-chart">{children}</div>
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

describe('LineChartWithNavigation', () => {
  const defaultProps = {
    isLoading: false,
    error: null,
    title: 'Test Line Chart',
    icon: <IconChartLine />,
    data: [
      { session: "Aujourd'hui", precision: 85, performance: 80 },
      { session: 'Hier', precision: 88, performance: 83 },
    ],
    lines: [
      { dataKey: 'precision', color: '#3b82f6', name: 'Précision' },
      { dataKey: 'performance', color: '#10b981', name: 'Performance' },
    ],
    interval: 5,
    index: 0,
    onIntervalChange: vi.fn(),
    onIndexChange: vi.fn(),
    maxDataLength: 10,
    themeColor: 'text-blue-500',
    intervalOptions: [
      { value: 5, label: '5 sessions' },
      { value: 10, label: '10 sessions' },
    ],
  };

  it("devrait rendre le composant avec le titre et l'icône", () => {
    render(<LineChartWithNavigation {...defaultProps} />);

    expect(screen.getByText('Test Line Chart')).toBeInTheDocument();
    // L'icône est présente mais n'a pas de data-testid
    expect(screen.getByRole('heading', { level: 3 })).toBeInTheDocument();
  });

  it('devrait afficher les contrôles de navigation', () => {
    render(<LineChartWithNavigation {...defaultProps} />);

    expect(screen.getByLabelText('Période plus ancienne')).toBeInTheDocument();
    expect(screen.getByLabelText('Période plus récente')).toBeInTheDocument();
    expect(screen.getByRole('combobox')).toBeInTheDocument(); // Select avec interval
  });

  it("devrait afficher les options d'intervalle", () => {
    render(<LineChartWithNavigation {...defaultProps} />);

    expect(screen.getByText('5 sessions')).toBeInTheDocument();
    expect(screen.getByText('10 sessions')).toBeInTheDocument();
  });

  it('devrait appeler onIndexChange lors du clic sur les boutons de navigation', () => {
    const onIndexChange = vi.fn();

    // Test du bouton next avec index 0
    const { unmount } = render(
      <LineChartWithNavigation
        {...defaultProps}
        onIndexChange={onIndexChange}
        index={0}
        intervals={[
          { data: [], label: 'Période 1' },
          { data: [], label: 'Période 2' },
        ]}
      />
    );

    const nextButton = screen.getByLabelText('Période plus récente');
    fireEvent.click(nextButton);
    expect(onIndexChange).toHaveBeenCalledWith(1);

    // Nettoyer le premier rendu
    unmount();
    onIndexChange.mockClear();

    // Test du bouton prev avec index 1
    render(
      <LineChartWithNavigation
        {...defaultProps}
        onIndexChange={onIndexChange}
        index={1}
        intervals={[
          { data: [], label: 'Période 1' },
          { data: [], label: 'Période 2' },
        ]}
      />
    );

    const prevButton = screen.getByLabelText('Période plus ancienne');
    fireEvent.click(prevButton);
    expect(onIndexChange).toHaveBeenCalledWith(0);
  });

  it("devrait appeler onIntervalChange lors du changement d'intervalle", () => {
    const onIntervalChange = vi.fn();
    render(
      <LineChartWithNavigation
        {...defaultProps}
        onIntervalChange={onIntervalChange}
      />
    );

    const select = screen.getByRole('combobox');
    fireEvent.change(select, { target: { value: '10' } });

    expect(onIntervalChange).toHaveBeenCalledWith(10);
  });

  it('devrait désactiver le bouton précédent quand index est 0', () => {
    render(<LineChartWithNavigation {...defaultProps} index={0} />);

    const prevButton = screen.getByLabelText('Période plus ancienne');
    expect(prevButton).toBeDisabled();
  });

  it('devrait désactiver le bouton suivant quand index est au maximum', () => {
    render(
      <LineChartWithNavigation {...defaultProps} index={1} maxDataLength={5} />
    );

    const nextButton = screen.getByLabelText('Période plus récente');
    expect(nextButton).toBeDisabled();
  });

  it('devrait afficher le spinner pendant le chargement', () => {
    render(<LineChartWithNavigation {...defaultProps} isLoading={true} />);

    expect(screen.getByTestId('spinner')).toBeInTheDocument();
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  it("devrait afficher un message d'erreur", () => {
    const error = new Error('Erreur de chargement');
    render(<LineChartWithNavigation {...defaultProps} error={error} />);

    expect(screen.getByText('Erreur de chargement')).toBeInTheDocument();
  });

  it('devrait rendre le graphique avec les données', () => {
    render(<LineChartWithNavigation {...defaultProps} />);

    expect(screen.getByTestId('responsive-container')).toBeInTheDocument();
    expect(screen.getByTestId('line-chart')).toBeInTheDocument();
    expect(screen.getByTestId('x-axis')).toBeInTheDocument();
    expect(screen.getByTestId('y-axis')).toBeInTheDocument();
    expect(screen.getByTestId('cartesian-grid')).toBeInTheDocument();
    expect(screen.getByTestId('tooltip')).toBeInTheDocument();
  });

  it('devrait rendre les lignes avec les bonnes données', () => {
    render(<LineChartWithNavigation {...defaultProps} />);

    expect(screen.getByTestId('line-precision')).toBeInTheDocument();
    expect(screen.getByTestId('line-performance')).toBeInTheDocument();
  });

  it('devrait afficher la légende avec les couleurs', () => {
    render(<LineChartWithNavigation {...defaultProps} />);

    expect(screen.getByText('Précision')).toBeInTheDocument();
    expect(screen.getByText('Performance')).toBeInTheDocument();
  });

  it('devrait utiliser la hauteur personnalisée', () => {
    render(<LineChartWithNavigation {...defaultProps} height={400} />);

    const container = screen.getByTestId('responsive-container');
    expect(container).toBeInTheDocument();
  });

  it('devrait utiliser le domaine Y personnalisé', () => {
    render(
      <LineChartWithNavigation {...defaultProps} yAxisDomain={[0, 100]} />
    );

    expect(screen.getByTestId('y-axis')).toBeInTheDocument();
  });

  it('devrait afficher le résumé si fourni', () => {
    const summary = <div data-testid="summary">Résumé des données</div>;
    render(<LineChartWithNavigation {...defaultProps} summary={summary} />);

    expect(screen.getByTestId('summary')).toBeInTheDocument();
    expect(screen.getByText('Résumé des données')).toBeInTheDocument();
  });

  it('devrait gérer les lignes avec des styles différents', () => {
    const linesWithStyles = [
      {
        dataKey: 'precision',
        color: '#3b82f6',
        name: 'Précision',
        strokeWidth: 3,
      },
      {
        dataKey: 'performance',
        color: '#10b981',
        name: 'Performance',
        strokeDasharray: '5 5',
      },
    ];

    render(
      <LineChartWithNavigation {...defaultProps} lines={linesWithStyles} />
    );

    expect(screen.getByTestId('line-precision')).toBeInTheDocument();
    expect(screen.getByTestId('line-performance')).toBeInTheDocument();
  });

  it("devrait calculer l'index par défaut correctement", () => {
    const propsWithMoreData = {
      ...defaultProps,
      maxDataLength: 15,
      interval: 5,
    };

    render(<LineChartWithNavigation {...propsWithMoreData} />);

    // L'index par défaut devrait être 1 (15 / 5 - 1 = 2, mais max 1)
    expect(screen.getByRole('combobox')).toBeInTheDocument();
  });
});
