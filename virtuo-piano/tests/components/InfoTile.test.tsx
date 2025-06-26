import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { IconMusic, IconTrendingUp } from '@tabler/icons-react';
import InfoTile from '@/components/tiles/Infotile';

const mockProps = {
  title: 'Temps de pratique',
  value: '2h 30min',
  description: 'Cette semaine',
  icon: <IconMusic size={20} />,
};

describe('InfoTile Component', () => {
  describe('Basic rendering', () => {
    it('should render title, value, and description', () => {
      render(<InfoTile {...mockProps} />);

      expect(screen.getByText('Temps de pratique')).toBeInTheDocument();
      expect(screen.getByText('2h 30min')).toBeInTheDocument();
      expect(screen.getByText('Cette semaine')).toBeInTheDocument();
    });

    it('should render the provided icon', () => {
      const { container } = render(<InfoTile {...mockProps} />);

      const svgIcon = container.querySelector('svg');
      expect(svgIcon).toBeInTheDocument();
    });

    it('should apply custom className', () => {
      const { container } = render(
        <InfoTile {...mockProps} className="custom-class" />
      );

      const tileContainer = container.firstChild as HTMLElement;
      expect(tileContainer).toHaveClass('custom-class');
    });
  });

  describe('Loading state', () => {
    it('should show spinner when loading', () => {
      render(<InfoTile {...mockProps} loading={true} />);

      // Le spinner est un SVG avec le title "Loading..."
      const spinner = screen.getByTitle('Loading...');
      expect(spinner).toBeInTheDocument();

      // Les valeurs ne devraient pas être visibles
      expect(screen.queryByText('2h 30min')).not.toBeInTheDocument();
    });

    it('should not show trend when loading', () => {
      const propsWithTrend = {
        ...mockProps,
        trend: { value: '+15%', isPositive: true },
        loading: true,
      };

      render(<InfoTile {...propsWithTrend} />);

      expect(screen.queryByText('+15%')).not.toBeInTheDocument();
    });
  });

  describe('Error state', () => {
    it('should show error message when error is provided', () => {
      render(<InfoTile {...mockProps} error="Erreur de chargement" />);

      expect(screen.getByText('Erreur de chargement')).toBeInTheDocument();
      expect(screen.queryByText('2h 30min')).not.toBeInTheDocument();
    });

    it('should show error with red styling', () => {
      render(<InfoTile {...mockProps} error="Erreur de chargement" />);

      const errorText = screen.getByText('Erreur de chargement');
      expect(errorText).toHaveClass('text-red-400');
    });
  });

  describe('Trend display', () => {
    it('should render positive trend correctly', () => {
      const propsWithPositiveTrend = {
        ...mockProps,
        trend: { value: '+15%', isPositive: true },
      };

      render(<InfoTile {...propsWithPositiveTrend} />);

      expect(screen.getByText('+15%')).toBeInTheDocument();

      const trendElement = screen.getByText('+15%');
      expect(trendElement).toHaveClass('text-emerald-400');
    });

    it('should render negative trend correctly', () => {
      const propsWithNegativeTrend = {
        ...mockProps,
        trend: { value: '-8%', isPositive: false },
      };

      render(<InfoTile {...propsWithNegativeTrend} />);

      expect(screen.getByText('-8%')).toBeInTheDocument();

      const trendElement = screen.getByText('-8%');
      expect(trendElement).toHaveClass('text-rose-400');
    });

    it('should show correct trend description for different intervals', () => {
      const propsWithTrend = {
        ...mockProps,
        trend: { value: '+10%', isPositive: true },
        selectedInterval: 'week' as const,
      };

      render(<InfoTile {...propsWithTrend} />);

      expect(
        screen.getByText(/depuis la semaine précédente/)
      ).toBeInTheDocument();
    });

    it('should show correct trend description for month interval', () => {
      const propsWithTrend = {
        ...mockProps,
        trend: { value: '+10%', isPositive: true },
        selectedInterval: 'month' as const,
      };

      render(<InfoTile {...propsWithTrend} />);

      expect(screen.getByText(/depuis le mois précédent/)).toBeInTheDocument();
    });

    it('should show correct trend description for quarter interval', () => {
      const propsWithTrend = {
        ...mockProps,
        trend: { value: '+10%', isPositive: true },
        selectedInterval: 'quarter' as const,
      };

      render(<InfoTile {...propsWithTrend} />);

      expect(
        screen.getByText(/depuis le trimestre précédent/)
      ).toBeInTheDocument();
    });

    it('should apply correct rotation for trend icon', () => {
      const { container: positiveContainer } = render(
        <InfoTile {...mockProps} trend={{ value: '+10%', isPositive: true }} />
      );

      const { container: negativeContainer } = render(
        <InfoTile {...mockProps} trend={{ value: '-10%', isPositive: false }} />
      );

      const positiveTrendIcon = positiveContainer.querySelector('.rotate-0');
      const negativeTrendIcon = negativeContainer.querySelector('.rotate-180');

      expect(positiveTrendIcon).toBeInTheDocument();
      expect(negativeTrendIcon).toBeInTheDocument();
    });
  });

  describe('Interval selector', () => {
    it('should render interval selector when showIntervalSelector is true', () => {
      const mockOnIntervalChange = vi.fn();

      render(
        <InfoTile
          {...mockProps}
          showIntervalSelector={true}
          onIntervalChange={mockOnIntervalChange}
        />
      );

      expect(screen.getByText('Semaine')).toBeInTheDocument();
      expect(screen.getByText('Mois')).toBeInTheDocument();
      expect(screen.getByText('Trimestre')).toBeInTheDocument();
    });

    it('should not render interval selector by default', () => {
      render(<InfoTile {...mockProps} />);

      expect(screen.queryByText('Semaine')).not.toBeInTheDocument();
      expect(screen.queryByText('Mois')).not.toBeInTheDocument();
      expect(screen.queryByText('Trimestre')).not.toBeInTheDocument();
    });

    it('should highlight selected interval', () => {
      const mockOnIntervalChange = vi.fn();

      render(
        <InfoTile
          {...mockProps}
          showIntervalSelector={true}
          selectedInterval="month"
          onIntervalChange={mockOnIntervalChange}
        />
      );

      const monthButton = screen.getByText('Mois');
      expect(monthButton).toHaveClass('bg-indigo-500/30');
      expect(monthButton).toHaveClass('text-indigo-300');
    });

    it('should call onIntervalChange when interval button is clicked', () => {
      const mockOnIntervalChange = vi.fn();

      render(
        <InfoTile
          {...mockProps}
          showIntervalSelector={true}
          onIntervalChange={mockOnIntervalChange}
        />
      );

      const weekButton = screen.getByText('Semaine');
      fireEvent.click(weekButton);

      expect(mockOnIntervalChange).toHaveBeenCalledWith('week');
    });

    it('should not render interval selector without onIntervalChange', () => {
      render(
        <InfoTile
          {...mockProps}
          showIntervalSelector={true}
          // onIntervalChange non fourni
        />
      );

      expect(screen.queryByText('Semaine')).not.toBeInTheDocument();
    });
  });

  describe('Styling', () => {
    it('should have correct container classes', () => {
      const { container } = render(<InfoTile {...mockProps} />);
      const tileContainer = container.firstChild as HTMLElement;

      expect(tileContainer).toHaveClass('bg-white/3');
      expect(tileContainer).toHaveClass('shadow-md');
      expect(tileContainer).toHaveClass('rounded-xl');
      expect(tileContainer).toHaveClass('p-5');
      expect(tileContainer).toHaveClass('border');
    });

    it('should have correct title styling', () => {
      render(<InfoTile {...mockProps} />);

      const title = screen.getByText('Temps de pratique');
      expect(title).toHaveClass('text-sm');
      expect(title).toHaveClass('font-medium');
      expect(title).toHaveClass('text-white/70');
    });

    it('should have correct value styling', () => {
      render(<InfoTile {...mockProps} />);

      const value = screen.getByText('2h 30min');
      expect(value).toHaveClass('text-2xl');
      expect(value).toHaveClass('font-bold');
      expect(value).toHaveClass('text-white');
    });

    it('should have correct icon container styling', () => {
      const { container } = render(<InfoTile {...mockProps} />);

      const iconContainer = container.querySelector('.bg-indigo-500\\/20');
      expect(iconContainer).toBeInTheDocument();
      expect(iconContainer).toHaveClass('p-3');
      expect(iconContainer).toHaveClass('rounded-lg');
      expect(iconContainer).toHaveClass('text-indigo-400');
    });
  });

  describe('Default props', () => {
    it('should use default selectedInterval', () => {
      const propsWithTrend = {
        ...mockProps,
        trend: { value: '+10%', isPositive: true },
      };

      render(<InfoTile {...propsWithTrend} />);

      // Par défaut, selectedInterval est 'month'
      expect(screen.getByText(/depuis le mois précédent/)).toBeInTheDocument();
    });

    it('should handle missing optional props gracefully', () => {
      const minimalProps = {
        title: 'Test Title',
        value: 'Test Value',
        description: 'Test Description',
        icon: <IconMusic size={20} />,
      };

      render(<InfoTile {...minimalProps} />);

      expect(screen.getByText('Test Title')).toBeInTheDocument();
      expect(screen.getByText('Test Value')).toBeInTheDocument();
      expect(screen.getByText('Test Description')).toBeInTheDocument();
    });
  });
});
