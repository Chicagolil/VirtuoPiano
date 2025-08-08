import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import BarChartWithNavigation from '@/components/charts/BarChartWithNavigation';
import { IconChartBar } from '@tabler/icons-react';

// Mock Recharts
vi.mock('recharts', () => ({
  BarChart: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="bar-chart">{children}</div>
  ),
  Bar: ({ dataKey }: { dataKey: string }) => (
    <div data-testid={`bar-${dataKey}`}>{dataKey}</div>
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

describe('BarChartWithNavigation', () => {
  const defaultProps = {
    title: 'Test Chart',
    icon: <IconChartBar />,
    intervals: [
      {
        label: 'Jan 2024 - Jun 2024',
        data: [
          { mois: 'Jan 2024', precision: 85, performance: 80 },
          { mois: 'Feb 2024', precision: 88, performance: 83 },
        ],
      },
    ],
    bars: [
      { dataKey: 'precision', color: '#3b82f6', name: 'Précision' },
      { dataKey: 'performance', color: '#10b981', name: 'Performance' },
    ],
    index: 0,
    onIndexChange: vi.fn(),
    themeColor: 'text-blue-500',
  };

  it("devrait rendre le composant avec le titre et l'icône", () => {
    render(<BarChartWithNavigation {...defaultProps} />);

    expect(screen.getByText('Test Chart')).toBeInTheDocument();
    // L'icône est présente mais n'a pas de data-testid
    expect(screen.getByRole('heading', { level: 3 })).toBeInTheDocument();
  });

  it('devrait afficher les boutons de navigation', () => {
    render(<BarChartWithNavigation {...defaultProps} />);

    expect(screen.getByLabelText('Période plus ancienne')).toBeInTheDocument();
    expect(screen.getByLabelText('Période plus récente')).toBeInTheDocument();
  });

  it("devrait afficher le label de l'intervalle", () => {
    render(<BarChartWithNavigation {...defaultProps} />);

    expect(screen.getByText('Jan 2024 - Jun 2024')).toBeInTheDocument();
  });

  it('devrait appeler onIndexChange lors du clic sur les boutons de navigation', () => {
    const onIndexChange = vi.fn();

    // Test avec index 1 pour permettre la navigation dans les deux sens
    const propsWithIndex1 = {
      ...defaultProps,
      onIndexChange,
      index: 1,
      intervals: [
        { data: [], label: 'Période 1' },
        { data: [], label: 'Période 2' },
        { data: [], label: 'Période 3' },
      ],
    };

    render(<BarChartWithNavigation {...propsWithIndex1} />);

    const prevButton = screen.getByLabelText('Période plus ancienne');
    const nextButton = screen.getByLabelText('Période plus récente');

    fireEvent.click(prevButton);
    expect(onIndexChange).toHaveBeenCalledWith(0);

    fireEvent.click(nextButton);
    expect(onIndexChange).toHaveBeenCalledWith(2);
  });

  it('devrait désactiver le bouton précédent quand index est 0', () => {
    render(<BarChartWithNavigation {...defaultProps} index={0} />);

    const prevButton = screen.getByLabelText('Période plus ancienne');
    expect(prevButton).toBeDisabled();
  });

  it('devrait désactiver le bouton suivant quand index est au maximum', () => {
    render(
      <BarChartWithNavigation {...defaultProps} index={1} maxIntervals={2} />
    );

    const nextButton = screen.getByLabelText('Période plus récente');
    expect(nextButton).toBeDisabled();
  });

  it('devrait afficher le spinner pendant le chargement', () => {
    render(<BarChartWithNavigation {...defaultProps} isLoading={true} />);

    expect(screen.getByTestId('spinner')).toBeInTheDocument();
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  it("devrait afficher un message d'erreur", () => {
    const error = new Error('Erreur de chargement');
    render(<BarChartWithNavigation {...defaultProps} error={error} />);

    expect(screen.getByText('Erreur de chargement')).toBeInTheDocument();
  });

  it('devrait rendre le graphique avec les données', () => {
    render(<BarChartWithNavigation {...defaultProps} />);

    expect(screen.getByTestId('responsive-container')).toBeInTheDocument();
    expect(screen.getByTestId('bar-chart')).toBeInTheDocument();
    expect(screen.getByTestId('x-axis')).toBeInTheDocument();
    expect(screen.getByTestId('y-axis')).toBeInTheDocument();
    expect(screen.getByTestId('cartesian-grid')).toBeInTheDocument();
    expect(screen.getByTestId('tooltip')).toBeInTheDocument();
  });

  it('devrait rendre les barres avec les bonnes données', () => {
    render(<BarChartWithNavigation {...defaultProps} />);

    expect(screen.getByTestId('bar-precision')).toBeInTheDocument();
    expect(screen.getByTestId('bar-performance')).toBeInTheDocument();
  });

  it('devrait afficher la légende avec les couleurs', () => {
    render(<BarChartWithNavigation {...defaultProps} />);

    expect(screen.getByText('Précision')).toBeInTheDocument();
    expect(screen.getByText('Performance')).toBeInTheDocument();
  });

  it('devrait gérer le mode multi-axes', () => {
    const multiAxisProps = {
      ...defaultProps,
      multiAxis: true,
      bars: [
        { dataKey: 'score', color: '#3b82f6', name: 'Score', yAxisId: 'score' },
        { dataKey: 'combo', color: '#f59e0b', name: 'Combo', yAxisId: 'combo' },
        {
          dataKey: 'multi',
          color: '#10b981',
          name: 'Multiplicateur',
          yAxisId: 'multi',
        },
      ],
    };

    render(<BarChartWithNavigation {...multiAxisProps} />);

    expect(screen.getByTestId('bar-score')).toBeInTheDocument();
    expect(screen.getByTestId('bar-combo')).toBeInTheDocument();
    expect(screen.getByTestId('bar-multi')).toBeInTheDocument();
  });

  it('devrait utiliser la hauteur personnalisée', () => {
    render(<BarChartWithNavigation {...defaultProps} height={400} />);

    const container = screen.getByTestId('responsive-container');
    expect(container).toBeInTheDocument();
  });

  it("devrait gérer le cas où il n'y a pas d'intervalles", () => {
    const propsWithoutIntervals = {
      ...defaultProps,
      intervals: [],
    };

    render(<BarChartWithNavigation {...propsWithoutIntervals} />);

    expect(screen.getByText('Intervalle 1')).toBeInTheDocument();
  });
});
