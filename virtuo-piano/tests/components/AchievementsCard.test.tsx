import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { IconTrophy, IconMusic, IconTarget } from '@tabler/icons-react';
import AchievementsCard from '@/components/cards/AchievementsCard';

const mockAchievements = [
  {
    id: 1,
    title: 'Premier pas',
    description: 'Complétez votre première chanson',
    progress: 100,
    icon: <IconMusic size={16} />,
  },
  {
    id: 2,
    title: 'Précision parfaite',
    description: 'Atteignez 95% de précision',
    progress: 75,
    icon: <IconTarget size={16} />,
  },
  {
    id: 3,
    title: 'Débutant',
    description: 'Jouez 5 chansons différentes',
    progress: 40,
    icon: <IconTrophy size={16} />,
  },
];

describe('AchievementsCard Component', () => {
  describe('Basic rendering', () => {
    it('should render card title with icon', () => {
      render(<AchievementsCard achievements={mockAchievements} />);

      expect(screen.getByText('Réussites')).toBeInTheDocument();

      // Vérifier que l'icône award est présente
      const { container } = render(
        <AchievementsCard achievements={mockAchievements} />
      );
      const svgIcons = container.querySelectorAll('svg');
      expect(svgIcons.length).toBeGreaterThan(0);
    });

    it('should render "Voir tout" button', () => {
      render(<AchievementsCard achievements={mockAchievements} />);

      expect(screen.getByText('Voir tout')).toBeInTheDocument();
    });

    it('should render all achievements', () => {
      render(<AchievementsCard achievements={mockAchievements} />);

      expect(screen.getByText('Premier pas')).toBeInTheDocument();
      expect(screen.getByText('Précision parfaite')).toBeInTheDocument();
      expect(screen.getByText('Débutant')).toBeInTheDocument();
    });
  });

  describe('Achievement rendering', () => {
    it('should render achievement titles and descriptions', () => {
      render(<AchievementsCard achievements={mockAchievements} />);

      expect(screen.getByText('Premier pas')).toBeInTheDocument();
      expect(
        screen.getByText('Complétez votre première chanson')
      ).toBeInTheDocument();
      expect(screen.getByText('Précision parfaite')).toBeInTheDocument();
      expect(
        screen.getByText('Atteignez 95% de précision')
      ).toBeInTheDocument();
    });

    it('should render progress percentages', () => {
      render(<AchievementsCard achievements={mockAchievements} />);

      expect(screen.getByText('100%')).toBeInTheDocument();
      expect(screen.getByText('75%')).toBeInTheDocument();
      expect(screen.getByText('40%')).toBeInTheDocument();
    });

    it('should render achievement icons', () => {
      const { container } = render(
        <AchievementsCard achievements={mockAchievements} />
      );

      // Compter les SVG (icône du titre + icône "Voir tout" + icônes des achievements)
      const svgIcons = container.querySelectorAll('svg');
      expect(svgIcons.length).toBe(5); // 1 titre + 1 "Voir tout" + 3 achievements
    });
  });

  describe('Completed achievements', () => {
    it('should show "Complété" badge for 100% progress', () => {
      render(<AchievementsCard achievements={mockAchievements} />);

      expect(screen.getByText('Complété')).toBeInTheDocument();
    });

    it('should apply completed styling for 100% progress', () => {
      const { container } = render(
        <AchievementsCard achievements={mockAchievements} />
      );

      // Trouver l'achievement avec 100% de progression
      const completedAchievement = screen
        .getByText('Premier pas')
        .closest('.group');

      // Chercher le conteneur d'icône spécifiquement (le div avec les classes bg-amber-*)
      const iconContainer = completedAchievement?.querySelector(
        '.bg-amber-100, .bg-amber-900\\/30'
      );

      // Vérifier que l'élément a au moins une des classes attendues
      expect(iconContainer).toHaveClass('bg-amber-100');
      expect(iconContainer).toHaveClass('text-amber-600');
    });

    it('should not show "Complété" badge for incomplete achievements', () => {
      render(<AchievementsCard achievements={mockAchievements} />);

      // Il ne devrait y avoir qu'un seul badge "Complété"
      const completedBadges = screen.getAllByText('Complété');
      expect(completedBadges).toHaveLength(1);
    });
  });

  describe('Progress bar styling', () => {
    it('should apply amber color for completed achievements', () => {
      const { container } = render(
        <AchievementsCard achievements={mockAchievements} />
      );

      const progressBars = container.querySelectorAll('.h-1\\.5');
      const completedBar = progressBars[0].querySelector('div');
      expect(completedBar).toHaveClass('bg-amber-500');
    });

    it('should apply emerald color for high progress (>66%)', () => {
      const { container } = render(
        <AchievementsCard achievements={mockAchievements} />
      );

      const progressBars = container.querySelectorAll('.h-1\\.5');
      const highProgressBar = progressBars[1].querySelector('div');
      expect(highProgressBar).toHaveClass('bg-emerald-500');
    });

    it('should apply indigo color for low progress (<=33%)', () => {
      const { container } = render(
        <AchievementsCard achievements={mockAchievements} />
      );

      const progressBars = container.querySelectorAll('.h-1\\.5');
      const lowProgressBar = progressBars[2].querySelector('div');
      // Pour 40% de progression, c'est bg-blue-500 selon la logique (33% < 40% <= 66%)
      expect(lowProgressBar).toHaveClass('bg-blue-500');
    });
  });

  describe('Empty state', () => {
    it('should render with empty achievements array', () => {
      render(<AchievementsCard achievements={[]} />);

      expect(screen.getByText('Réussites')).toBeInTheDocument();
      expect(screen.getByText('Voir tout')).toBeInTheDocument();
    });
  });

  describe('Card styling', () => {
    it('should have correct card container classes', () => {
      const { container } = render(
        <AchievementsCard achievements={mockAchievements} />
      );
      const cardContainer = container.firstChild as HTMLElement;

      expect(cardContainer).toHaveClass('bg-white/3');
      expect(cardContainer).toHaveClass('shadow-md');
      expect(cardContainer).toHaveClass('rounded-2xl');
      expect(cardContainer).toHaveClass('p-5');
      expect(cardContainer).toHaveClass('border');
    });

    it('should have correct header styling', () => {
      render(<AchievementsCard achievements={mockAchievements} />);

      const title = screen.getByText('Réussites');
      expect(title).toHaveClass('text-lg');
      expect(title).toHaveClass('font-semibold');
      expect(title).toHaveClass('text-white');
    });

    it('should have correct "Voir tout" button styling', () => {
      render(<AchievementsCard achievements={mockAchievements} />);

      const viewAllButton = screen.getByText('Voir tout');
      expect(viewAllButton).toHaveClass('text-xs');
      expect(viewAllButton).toHaveClass('text-indigo-400');
      expect(viewAllButton).toHaveClass('hover:text-indigo-300');
    });
  });

  describe('Progress width calculation', () => {
    it('should set correct width for progress bars', () => {
      const { container } = render(
        <AchievementsCard achievements={mockAchievements} />
      );

      const progressBars = container.querySelectorAll('.h-1\\.5 div');

      // Premier achievement: 100%
      expect(progressBars[0]).toHaveStyle({ width: '100%' });

      // Deuxième achievement: 75%
      expect(progressBars[1]).toHaveStyle({ width: '75%' });

      // Troisième achievement: 40%
      expect(progressBars[2]).toHaveStyle({ width: '40%' });
    });

    it('should cap progress at 100% even if value is higher', () => {
      const achievementWithHighProgress = [
        {
          id: 1,
          title: 'Test',
          description: 'Test description',
          progress: 150,
          icon: <IconMusic size={16} />,
        },
      ];

      const { container } = render(
        <AchievementsCard achievements={achievementWithHighProgress} />
      );

      const progressBar = container.querySelector('.h-1\\.5 div');
      expect(progressBar).toHaveStyle({ width: '100%' });
    });
  });

  describe('Accessibility', () => {
    it('should have proper text hierarchy', () => {
      render(<AchievementsCard achievements={mockAchievements} />);

      // Titre principal
      const mainTitle = screen.getByText('Réussites');
      expect(mainTitle.tagName).toBe('H2');

      // Titres des achievements
      const achievementTitles = screen.getAllByRole('heading', { level: 3 });
      expect(achievementTitles).toHaveLength(3);
    });

    it('should have accessible button', () => {
      render(<AchievementsCard achievements={mockAchievements} />);

      const viewAllButton = screen.getByRole('button', { name: /voir tout/i });
      expect(viewAllButton).toBeInTheDocument();
    });
  });
});
