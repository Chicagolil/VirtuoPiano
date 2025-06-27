import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import ProgressBar from '@/components/ProgressBar';

describe('ProgressBar Component', () => {
  describe('Basic rendering', () => {
    it('should render with default props', () => {
      const { container } = render(<ProgressBar value={50} max={100} />);

      const progressRoot = container.querySelector('[role="progressbar"]');
      expect(progressRoot).toBeInTheDocument();
    });

    it('should render with correct value attribute', () => {
      const { container } = render(<ProgressBar value={75} max={100} />);

      const progressRoot = container.querySelector('[role="progressbar"]');
      expect(progressRoot).toHaveAttribute('aria-valuenow', '75');
    });

    it('should render with correct max attribute', () => {
      const { container } = render(<ProgressBar value={30} max={50} />);

      const progressRoot = container.querySelector('[role="progressbar"]');
      expect(progressRoot).toHaveAttribute('aria-valuemax', '50');
    });
  });

  describe('Progress indicator styling', () => {
    it('should apply correct transform based on progress percentage', () => {
      const { container } = render(<ProgressBar value={25} max={100} />);

      const indicator = container.querySelector('[role="progressbar"] > div');
      expect(indicator).toHaveStyle({ transform: 'translateX(-75%)' });
    });

    it('should apply correct transform for 100% progress', () => {
      const { container } = render(<ProgressBar value={100} max={100} />);

      const indicator = container.querySelector('[role="progressbar"] > div');
      expect(indicator).toHaveStyle({ transform: 'translateX(-0%)' });
    });

    it('should apply correct transform for 0% progress', () => {
      const { container } = render(<ProgressBar value={0} max={100} />);

      const indicator = container.querySelector('[role="progressbar"] > div');
      expect(indicator).toHaveStyle({ transform: 'translateX(-100%)' });
    });
  });

  describe('CSS classes and styling', () => {
    it('should apply progressComplete class when value equals max', () => {
      const { container } = render(<ProgressBar value={100} max={100} />);

      const indicator = container.querySelector('[role="progressbar"] > div');
      // Les classes CSS modules sont hashées, on vérifie avec une regex
      expect(indicator?.className).toMatch(/progressComplete/);
    });

    it('should apply progressHigh class when value > 50% of max', () => {
      const { container } = render(<ProgressBar value={60} max={100} />);

      const indicator = container.querySelector('[role="progressbar"] > div');
      // Les classes CSS modules sont hashées, on vérifie avec une regex
      expect(indicator?.className).toMatch(/progressHigh/);
    });

    it('should apply progressLow class when value <= 50% of max', () => {
      const { container } = render(<ProgressBar value={30} max={100} />);

      const indicator = container.querySelector('[role="progressbar"] > div');
      // Les classes CSS modules sont hashées, on vérifie avec une regex
      expect(indicator?.className).toMatch(/progressLow/);
    });

    it('should apply custom className to root', () => {
      const { container } = render(
        <ProgressBar value={50} max={100} className="custom-class" />
      );

      const progressRoot = container.querySelector('[role="progressbar"]');
      expect(progressRoot).toHaveClass('custom-class');
    });

    it('should apply custom colorClass to indicator', () => {
      const { container } = render(
        <ProgressBar value={50} max={100} colorClass="bg-blue-500" />
      );

      const indicator = container.querySelector('[role="progressbar"] > div');
      expect(indicator).toHaveClass('bg-blue-500');
    });
  });

  describe('Different max values', () => {
    it('should handle non-100 max values correctly', () => {
      const { container } = render(<ProgressBar value={25} max={50} />);

      const progressRoot = container.querySelector('[role="progressbar"]');
      expect(progressRoot).toHaveAttribute('aria-valuenow', '25');
      expect(progressRoot).toHaveAttribute('aria-valuemax', '50');

      // 25/50 = 50%, donc translateX(-50%)
      const indicator = container.querySelector('[role="progressbar"] > div');
      expect(indicator).toHaveStyle({ transform: 'translateX(-50%)' });
    });

    it('should handle decimal values', () => {
      const { container } = render(<ProgressBar value={33.5} max={100} />);

      const indicator = container.querySelector('[role="progressbar"] > div');
      expect(indicator).toHaveStyle({ transform: 'translateX(-66.5%)' });
    });
  });

  describe('Edge cases', () => {
    it('should handle value of 0', () => {
      const { container } = render(<ProgressBar value={0} max={100} />);

      const progressRoot = container.querySelector('[role="progressbar"]');
      expect(progressRoot).toHaveAttribute('aria-valuenow', '0');

      const indicator = container.querySelector('[role="progressbar"] > div');
      // Les classes CSS modules sont hashées, on vérifie avec une regex
      expect(indicator?.className).toMatch(/progressLow/);
    });

    it('should handle value equal to max', () => {
      const { container } = render(<ProgressBar value={100} max={100} />);

      const indicator = container.querySelector('[role="progressbar"] > div');
      // Les classes CSS modules sont hashées, on vérifie avec une regex
      expect(indicator?.className).toMatch(/progressComplete/);
    });

    it('should handle value greater than max', () => {
      const { container } = render(<ProgressBar value={150} max={100} />);

      const progressRoot = container.querySelector('[role="progressbar"]');
      // Radix UI clampe la valeur au max
      expect(progressRoot).toHaveAttribute('aria-valuenow', '100');

      // La barre sera à 100% même si la valeur dépasse
      const indicator = container.querySelector('[role="progressbar"] > div');
      expect(indicator).toHaveStyle({ transform: 'translateX(-0%)' });
    });
  });

  describe('CSS modules integration', () => {
    it('should apply progressRoot class from CSS modules', () => {
      const { container } = render(<ProgressBar value={50} max={100} />);

      const progressRoot = container.querySelector('[role="progressbar"]');
      expect(progressRoot).toHaveClass(/progress/);
    });

    it('should apply progressIndicator class from CSS modules', () => {
      const { container } = render(<ProgressBar value={50} max={100} />);

      const indicator = container.querySelector('[role="progressbar"] > div');
      expect(indicator).toHaveClass(/progress/);
    });
  });

  describe('Accessibility', () => {
    it('should have proper ARIA attributes', () => {
      const { container } = render(<ProgressBar value={75} max={100} />);

      const progressRoot = container.querySelector('[role="progressbar"]');
      expect(progressRoot).toHaveAttribute('role', 'progressbar');
      expect(progressRoot).toHaveAttribute('aria-valuenow', '75');
      expect(progressRoot).toHaveAttribute('aria-valuemax', '100');
    });

    it('should have proper ARIA attributes with custom max', () => {
      const { container } = render(<ProgressBar value={15} max={20} />);

      const progressRoot = container.querySelector('[role="progressbar"]');
      expect(progressRoot).toHaveAttribute('aria-valuenow', '15');
      expect(progressRoot).toHaveAttribute('aria-valuemax', '20');
    });
  });
});
