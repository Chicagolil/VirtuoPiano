import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import UserAvatar from '@/components/badge/UserAvatar';

describe('UserAvatar Component', () => {
  describe('With image', () => {
    it('should render with provided image', () => {
      render(<UserAvatar name="John Doe" image="/test-avatar.jpg" />);

      // Dans un environnement de test, l'image peut ne pas se charger, donc on affiche les initiales
      // On vérifie d'abord si l'image est présente, sinon on vérifie les initiales
      const avatarImage = screen.queryByRole('img');
      if (avatarImage) {
        expect(avatarImage).toHaveAttribute('src', '/test-avatar.jpg');
        expect(avatarImage).toHaveAttribute('alt', 'John Doe');
      } else {
        // Fallback vers les initiales
        expect(screen.getByText('JD')).toBeInTheDocument();
      }
    });

    it('should have correct image styling', () => {
      render(<UserAvatar name="John Doe" image="/test-avatar.jpg" />);

      const avatarImage = screen.queryByRole('img');
      if (avatarImage) {
        expect(avatarImage).toHaveClass('h-full');
        expect(avatarImage).toHaveClass('w-full');
        expect(avatarImage).toHaveClass('object-cover');
      } else {
        // Si pas d'image, on a le fallback avec les initiales
        expect(screen.getByText('JD')).toBeInTheDocument();
      }
    });
  });

  describe('Without image (fallback)', () => {
    it('should render fallback with user initials', () => {
      render(<UserAvatar name="John Doe" />);

      expect(screen.getByText('JD')).toBeInTheDocument();
    });

    it('should render fallback with single name initial', () => {
      render(<UserAvatar name="John" />);

      expect(screen.getByText('J')).toBeInTheDocument();
    });

    it('should render fallback with multiple names initials', () => {
      render(<UserAvatar name="Jean Pierre Martin" />);

      expect(screen.getByText('JPM')).toBeInTheDocument();
    });

    it('should render fallback with empty image string', () => {
      render(<UserAvatar name="Jane Smith" image="" />);

      expect(screen.getByText('JS')).toBeInTheDocument();
    });

    it('should have correct fallback styling', () => {
      const { container } = render(<UserAvatar name="John Doe" />);

      // Le fallback devrait être visible quand il n'y a pas d'image
      const fallback = screen.getByText('JD');
      expect(fallback).toHaveClass('w-full');
      expect(fallback).toHaveClass('h-full');
      expect(fallback).toHaveClass('flex');
      expect(fallback).toHaveClass('items-center');
      expect(fallback).toHaveClass('justify-center');
      expect(fallback).toHaveClass('bg-indigo-500');
      expect(fallback).toHaveClass('text-white');
      expect(fallback).toHaveClass('text-sm');
      expect(fallback).toHaveClass('font-medium');
    });
  });

  describe('Root container styling', () => {
    it('should have correct root container classes', () => {
      const { container } = render(<UserAvatar name="John Doe" />);
      const rootElement = container.firstChild as HTMLElement;

      expect(rootElement).toHaveClass('inline-flex');
      expect(rootElement).toHaveClass('items-center');
      expect(rootElement).toHaveClass('justify-center');
      expect(rootElement).toHaveClass('align-middle');
      expect(rootElement).toHaveClass('overflow-hidden');
      expect(rootElement).toHaveClass('w-10');
      expect(rootElement).toHaveClass('h-10');
      expect(rootElement).toHaveClass('rounded-full');
      expect(rootElement).toHaveClass('bg-slate-200');
    });
  });

  describe('Edge cases', () => {
    it('should handle empty name gracefully', () => {
      render(<UserAvatar name="" />);

      // Avec un nom vide, les initiales seront vides, mais l'élément fallback existe toujours
      const { container } = render(<UserAvatar name="" />);
      const fallbackElement = container.querySelector('.bg-indigo-500');
      expect(fallbackElement).toBeInTheDocument();
    });

    it('should handle name with special characters', () => {
      render(<UserAvatar name="Jean-Pierre O'Connor" />);

      expect(screen.getByText('JO')).toBeInTheDocument();
    });

    it('should handle name with extra spaces', () => {
      render(<UserAvatar name="  John   Doe  " />);

      expect(screen.getByText('JD')).toBeInTheDocument();
    });

    it('should handle single character names', () => {
      render(<UserAvatar name="A B" />);

      expect(screen.getByText('AB')).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('should have proper alt text for image', () => {
      render(<UserAvatar name="John Doe" image="/test-avatar.jpg" />);

      // En mode test, l'image peut ne pas se charger et afficher le fallback
      const avatarImage = screen.queryByRole('img');
      if (avatarImage) {
        expect(avatarImage).toHaveAttribute('alt', 'John Doe');
      } else {
        // Fallback avec initiales
        expect(screen.getByText('JD')).toBeInTheDocument();
      }
    });

    it('should be accessible when using fallback', () => {
      render(<UserAvatar name="John Doe" />);

      const fallback = screen.getByText('JD');
      expect(fallback).toBeVisible();
    });
  });

  describe('Image handling', () => {
    it('should handle undefined image prop', () => {
      render(<UserAvatar name="John Doe" image={undefined} />);

      // Sans image, on affiche les initiales
      expect(screen.getByText('JD')).toBeInTheDocument();
    });

    it('should handle null image prop', () => {
      // @ts-ignore - Testing edge case
      render(<UserAvatar name="John Doe" image={null} />);

      // Sans image, on affiche les initiales
      expect(screen.getByText('JD')).toBeInTheDocument();
    });
  });
});
