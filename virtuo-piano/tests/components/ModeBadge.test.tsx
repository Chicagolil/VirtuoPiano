import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import ModeBadge from '@/components/badge/ModeBadge';

describe('ModeBadge Component', () => {
  describe('Learning mode', () => {
    it('should render learning mode with correct text', () => {
      render(<ModeBadge mode="learning" />);

      expect(screen.getByText('Apprentissage')).toBeInTheDocument();
    });

    it('should render brain icon for learning mode', () => {
      const { container } = render(<ModeBadge mode="learning" />);

      // Vérifier que l'icône est présente (Tabler icons utilisent des SVG)
      const svgIcon = container.querySelector('svg');
      expect(svgIcon).toBeInTheDocument();
    });

    it('should apply indigo colors for learning mode', () => {
      const { container } = render(<ModeBadge mode="learning" />);
      const badge = container.firstChild as HTMLElement;

      expect(badge).toHaveClass('bg-indigo-100');
      expect(badge).toHaveClass('text-indigo-700');
      expect(badge).toHaveClass('dark:bg-indigo-900/30');
      expect(badge).toHaveClass('dark:text-indigo-300');
    });
  });

  describe('Game mode', () => {
    it('should render game mode with correct text', () => {
      render(<ModeBadge mode="game" />);

      expect(screen.getByText('Jeu')).toBeInTheDocument();
    });

    it('should render gamepad icon for game mode', () => {
      const { container } = render(<ModeBadge mode="game" />);

      // Vérifier que l'icône est présente (Tabler icons utilisent des SVG)
      const svgIcon = container.querySelector('svg');
      expect(svgIcon).toBeInTheDocument();
    });

    it('should apply purple colors for game mode', () => {
      const { container } = render(<ModeBadge mode="game" />);
      const badge = container.firstChild as HTMLElement;

      expect(badge).toHaveClass('bg-purple-100');
      expect(badge).toHaveClass('text-purple-700');
      expect(badge).toHaveClass('dark:bg-purple-900/30');
      expect(badge).toHaveClass('dark:text-purple-300');
    });
  });

  describe('Common styling', () => {
    it('should have correct base classes for learning mode', () => {
      const { container } = render(<ModeBadge mode="learning" />);
      const badge = container.firstChild as HTMLElement;

      expect(badge).toHaveClass('inline-flex');
      expect(badge).toHaveClass('items-center');
      expect(badge).toHaveClass('px-2');
      expect(badge).toHaveClass('py-1');
      expect(badge).toHaveClass('rounded-full');
      expect(badge).toHaveClass('text-xs');
      expect(badge).toHaveClass('font-medium');
    });

    it('should have correct base classes for game mode', () => {
      const { container } = render(<ModeBadge mode="game" />);
      const badge = container.firstChild as HTMLElement;

      expect(badge).toHaveClass('inline-flex');
      expect(badge).toHaveClass('items-center');
      expect(badge).toHaveClass('px-2');
      expect(badge).toHaveClass('py-1');
      expect(badge).toHaveClass('rounded-full');
      expect(badge).toHaveClass('text-xs');
      expect(badge).toHaveClass('font-medium');
    });

    it('should contain icon with correct margin for both modes', () => {
      const { container: learningContainer } = render(
        <ModeBadge mode="learning" />
      );
      const { container: gameContainer } = render(<ModeBadge mode="game" />);

      const learningIcon = learningContainer.querySelector('svg');
      const gameIcon = gameContainer.querySelector('svg');

      expect(learningIcon).toHaveClass('mr-1');
      expect(gameIcon).toHaveClass('mr-1');
    });
  });

  describe('Icon size', () => {
    it('should render icons with size 14 for both modes', () => {
      const { container: learningContainer } = render(
        <ModeBadge mode="learning" />
      );
      const { container: gameContainer } = render(<ModeBadge mode="game" />);

      const learningIcon = learningContainer.querySelector('svg');
      const gameIcon = gameContainer.querySelector('svg');

      // Vérifier que les icônes ont la bonne taille (14px)
      expect(learningIcon).toHaveAttribute('width', '14');
      expect(learningIcon).toHaveAttribute('height', '14');
      expect(gameIcon).toHaveAttribute('width', '14');
      expect(gameIcon).toHaveAttribute('height', '14');
    });
  });

  describe('Accessibility', () => {
    it('should be accessible with proper text content for learning mode', () => {
      render(<ModeBadge mode="learning" />);

      const badge = screen.getByText('Apprentissage');
      expect(badge).toBeVisible();
    });

    it('should be accessible with proper text content for game mode', () => {
      render(<ModeBadge mode="game" />);

      const badge = screen.getByText('Jeu');
      expect(badge).toBeVisible();
    });
  });
});
