import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import AccuracyBadge from '@/components/badge/AccuracyBadge';

describe('AccuracyBadge Component', () => {
  it('should render with accuracy percentage', () => {
    render(<AccuracyBadge accuracy={85} />);

    expect(screen.getByText('85% précision')).toBeInTheDocument();
  });

  it('should render target icon', () => {
    const { container } = render(<AccuracyBadge accuracy={90} />);

    // Vérifier que l'icône est présente (Tabler icons utilisent des SVG)
    const svgIcon = container.querySelector('svg');
    expect(svgIcon).toBeInTheDocument();
  });

  describe('Color classes based on accuracy levels', () => {
    it('should apply emerald color for accuracy >= 95%', () => {
      const { container } = render(<AccuracyBadge accuracy={98} />);
      const badge = container.firstChild as HTMLElement;

      expect(badge).toHaveClass('bg-emerald-100');
      expect(badge).toHaveClass('text-emerald-700');
    });

    it('should apply green color for accuracy >= 85% and < 95%', () => {
      const { container } = render(<AccuracyBadge accuracy={90} />);
      const badge = container.firstChild as HTMLElement;

      expect(badge).toHaveClass('bg-green-100');
      expect(badge).toHaveClass('text-green-700');
    });

    it('should apply amber color for accuracy >= 75% and < 85%', () => {
      const { container } = render(<AccuracyBadge accuracy={80} />);
      const badge = container.firstChild as HTMLElement;

      expect(badge).toHaveClass('bg-amber-100');
      expect(badge).toHaveClass('text-amber-700');
    });

    it('should apply orange color for accuracy >= 60% and < 75%', () => {
      const { container } = render(<AccuracyBadge accuracy={65} />);
      const badge = container.firstChild as HTMLElement;

      expect(badge).toHaveClass('bg-orange-100');
      expect(badge).toHaveClass('text-orange-700');
    });

    it('should apply red color for accuracy < 60%', () => {
      const { container } = render(<AccuracyBadge accuracy={45} />);
      const badge = container.firstChild as HTMLElement;

      expect(badge).toHaveClass('bg-red-100');
      expect(badge).toHaveClass('text-red-700');
    });
  });

  describe('Edge cases', () => {
    it('should handle 0% accuracy', () => {
      render(<AccuracyBadge accuracy={0} />);

      expect(screen.getByText('0% précision')).toBeInTheDocument();
    });

    it('should handle 100% accuracy', () => {
      render(<AccuracyBadge accuracy={100} />);

      expect(screen.getByText('100% précision')).toBeInTheDocument();
    });

    it('should handle decimal accuracy values', () => {
      render(<AccuracyBadge accuracy={87.5} />);

      expect(screen.getByText('87.5% précision')).toBeInTheDocument();
    });
  });

  describe('Styling and structure', () => {
    it('should have correct base classes', () => {
      const { container } = render(<AccuracyBadge accuracy={85} />);
      const badge = container.firstChild as HTMLElement;

      expect(badge).toHaveClass('inline-flex');
      expect(badge).toHaveClass('items-center');
      expect(badge).toHaveClass('px-2');
      expect(badge).toHaveClass('py-1');
      expect(badge).toHaveClass('rounded-full');
      expect(badge).toHaveClass('text-xs');
      expect(badge).toHaveClass('font-medium');
    });

    it('should contain icon with correct margin', () => {
      const { container } = render(<AccuracyBadge accuracy={85} />);
      const svgIcon = container.querySelector('svg');

      expect(svgIcon).toHaveClass('mr-1');
    });
  });

  describe('Dark mode classes', () => {
    it('should include dark mode classes for high accuracy', () => {
      const { container } = render(<AccuracyBadge accuracy={96} />);
      const badge = container.firstChild as HTMLElement;

      expect(badge).toHaveClass('dark:bg-emerald-900/30');
      expect(badge).toHaveClass('dark:text-emerald-300');
    });

    it('should include dark mode classes for medium accuracy', () => {
      const { container } = render(<AccuracyBadge accuracy={80} />);
      const badge = container.firstChild as HTMLElement;

      expect(badge).toHaveClass('dark:bg-amber-900/30');
      expect(badge).toHaveClass('dark:text-amber-300');
    });

    it('should include dark mode classes for low accuracy', () => {
      const { container } = render(<AccuracyBadge accuracy={50} />);
      const badge = container.firstChild as HTMLElement;

      expect(badge).toHaveClass('dark:bg-red-900/30');
      expect(badge).toHaveClass('dark:text-red-300');
    });
  });
});
