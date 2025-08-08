import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import RecordsTimeline from '@/components/timeline/RecordsTimeline';
import { IconTrophy, IconTarget, IconFlame } from '@tabler/icons-react';

// Mock des utilitaires
vi.mock('@/features/performances/utils/chartUtils', () => ({
  getBubbleBorderColor: vi.fn(() => 'border-blue-300'),
  getBubbleColor: vi.fn(() => 'from-blue-500 to-blue-600'),
  getIcon: vi.fn(() => <IconTrophy data-testid="record-icon" />),
  getPopupIcon: vi.fn(() => <IconTarget data-testid="popup-icon" />),
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

describe('RecordsTimeline', () => {
  const mockRecords = [
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

  const defaultProps = {
    records: mockRecords,
    isLoading: false,
    error: null,
  };

  it('devrait rendre la timeline avec les records', async () => {
    render(<RecordsTimeline {...defaultProps} />);

    // Cliquer sur les bulles pour afficher les popups
    const bubbles = screen.getAllByRole('button');
    fireEvent.click(bubbles[0]);

    await waitFor(() => {
      expect(
        screen.getByText('Meilleure précision main droite')
      ).toBeInTheDocument();
    });

    fireEvent.click(bubbles[1]);
    await waitFor(() => {
      expect(
        screen.getByText('Meilleure performance deux mains')
      ).toBeInTheDocument();
    });

    fireEvent.click(bubbles[2]);
    await waitFor(() => {
      expect(screen.getByText('Meilleur score')).toBeInTheDocument();
    });
  });

  it('devrait afficher les dates formatées', () => {
    render(<RecordsTimeline {...defaultProps} />);

    expect(screen.getByText('1 janv.')).toBeInTheDocument();
    expect(screen.getByText('2 janv.')).toBeInTheDocument();
    expect(screen.getByText('3 janv.')).toBeInTheDocument();
  });

  it('devrait afficher les bulles cliquables', () => {
    render(<RecordsTimeline {...defaultProps} />);

    const bubbles = screen.getAllByRole('button');
    expect(bubbles).toHaveLength(3);
  });

  it('devrait ouvrir le popup lors du clic sur une bulle', async () => {
    render(<RecordsTimeline {...defaultProps} />);

    const firstBubble = screen.getAllByRole('button')[0];
    fireEvent.click(firstBubble);

    await waitFor(() => {
      expect(
        screen.getByText('Meilleure précision main droite')
      ).toBeInTheDocument();
      expect(
        screen.getByText(
          'Vous avez atteint 90% de précision avec votre main droite.'
        )
      ).toBeInTheDocument();
    });
  });

  it('devrait fermer le popup lors du clic sur le bouton de fermeture', async () => {
    render(<RecordsTimeline {...defaultProps} />);

    const firstBubble = screen.getAllByRole('button')[0];
    fireEvent.click(firstBubble);

    await waitFor(() => {
      expect(
        screen.getByText('Meilleure précision main droite')
      ).toBeInTheDocument();
    });

    const closeButton = screen.getByText('×');
    fireEvent.click(closeButton);

    await waitFor(() => {
      expect(
        screen.queryByText('Meilleure précision main droite')
      ).not.toBeInTheDocument();
    });
  });

  it('devrait fermer le popup lors du clic sur la même bulle', async () => {
    render(<RecordsTimeline {...defaultProps} />);

    const firstBubble = screen.getAllByRole('button')[0];
    fireEvent.click(firstBubble);

    await waitFor(() => {
      expect(
        screen.getByText('Meilleure précision main droite')
      ).toBeInTheDocument();
    });

    fireEvent.click(firstBubble);

    await waitFor(() => {
      expect(
        screen.queryByText('Meilleure précision main droite')
      ).not.toBeInTheDocument();
    });
  });

  it("devrait afficher l'indicateur de sélection sur la bulle sélectionnée", async () => {
    render(<RecordsTimeline {...defaultProps} />);

    const firstBubble = screen.getAllByRole('button')[0];
    fireEvent.click(firstBubble);

    await waitFor(() => {
      const selectedIndicator = screen.getByTestId('selected-indicator');
      expect(selectedIndicator).toBeInTheDocument();
    });
  });

  it('devrait afficher le spinner pendant le chargement', () => {
    render(<RecordsTimeline {...defaultProps} isLoading={true} />);

    expect(screen.getByTestId('spinner')).toBeInTheDocument();
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  it("devrait afficher un message d'erreur", () => {
    const error = new Error('Erreur de chargement');
    render(<RecordsTimeline {...defaultProps} error={error} />);

    expect(screen.getByText('Erreur de chargement')).toBeInTheDocument();
  });

  it('devrait afficher les détails complets dans le popup', async () => {
    render(<RecordsTimeline {...defaultProps} />);

    const firstBubble = screen.getAllByRole('button')[0];
    fireEvent.click(firstBubble);

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

  it('devrait afficher la date complète dans le popup', async () => {
    render(<RecordsTimeline {...defaultProps} />);

    const firstBubble = screen.getAllByRole('button')[0];
    fireEvent.click(firstBubble);

    await waitFor(() => {
      expect(screen.getByText(/lundi 1 janvier 2024/)).toBeInTheDocument();
    });
  });

  it('devrait positionner le popup correctement pour le premier record', async () => {
    render(<RecordsTimeline {...defaultProps} />);

    const firstBubble = screen.getAllByRole('button')[0];
    fireEvent.click(firstBubble);

    await waitFor(() => {
      const popup = screen
        .getByText('Meilleure précision main droite')
        .closest('div');
      // Le popup du premier record utilise 'left-0 transform translate-x-0'
      // Chercher l'élément avec la classe 'absolute z-20 bottom-16'
      const popupContainer = popup?.closest(
        '[class*="absolute z-20 bottom-16"]'
      );
      expect(popupContainer).toHaveClass('left-0');
    });
  });

  it('devrait positionner le popup correctement pour le dernier record', async () => {
    render(<RecordsTimeline {...defaultProps} />);

    const lastBubble = screen.getAllByRole('button')[2];
    fireEvent.click(lastBubble);

    await waitFor(() => {
      const popup = screen.getByText('Meilleur score').closest('div');
      // Le popup du dernier record utilise 'right-0 transform translate-x-0'
      const popupContainer = popup?.closest(
        '[class*="absolute z-20 bottom-16"]'
      );
      expect(popupContainer).toHaveClass('right-0');
    });
  });

  it('devrait positionner le popup correctement pour les records du milieu', async () => {
    render(<RecordsTimeline {...defaultProps} />);

    const middleBubble = screen.getAllByRole('button')[1];
    fireEvent.click(middleBubble);

    await waitFor(() => {
      const popup = screen
        .getByText('Meilleure performance deux mains')
        .closest('div');
      // Le popup du milieu utilise 'left-1/2 transform -translate-x-1/2'
      const popupContainer = popup?.closest(
        '[class*="absolute z-20 bottom-16"]'
      );
      expect(popupContainer).toHaveClass('left-1/2');
    });
  });

  it('devrait animer les bulles lors du chargement', async () => {
    render(<RecordsTimeline {...defaultProps} />);

    const bubbleContainers = screen
      .getAllByRole('button')
      .map((button) => button.parentElement);
    bubbleContainers.forEach((container, index) => {
      expect(container).toHaveClass('animate-timeline-bubble');
    });
  });

  it("devrait gérer le cas où il n'y a pas de records", () => {
    render(<RecordsTimeline records={[]} isLoading={false} error={null} />);

    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });

  it('devrait gérer les différents types de records', async () => {
    const recordsWithDifferentTypes = [
      {
        id: 1,
        date: '2024-01-01T10:00:00Z',
        score: 90,
        type: 'accuracy_right',
        description: 'Précision main droite',
        details: 'Test précision',
      },
      {
        id: 2,
        date: '2024-01-02T10:00:00Z',
        score: 10000,
        type: 'score',
        description: 'Meilleur score',
        details: 'Test score',
      },
      {
        id: 3,
        date: '2024-01-03T10:00:00Z',
        score: 50,
        type: 'combo',
        description: 'Meilleur combo',
        details: 'Test combo',
      },
    ];

    render(
      <RecordsTimeline
        records={recordsWithDifferentTypes}
        isLoading={false}
        error={null}
      />
    );

    // Cliquer sur chaque bulle pour afficher les popups
    const bubbles = screen.getAllByRole('button');

    // Premier record
    fireEvent.click(bubbles[0]);
    await waitFor(() => {
      expect(screen.getByText('Précision main droite')).toBeInTheDocument();
    });

    // Deuxième record
    fireEvent.click(bubbles[1]);
    await waitFor(() => {
      expect(screen.getByText('Meilleur score')).toBeInTheDocument();
    });

    // Troisième record
    fireEvent.click(bubbles[2]);
    await waitFor(() => {
      expect(screen.getByText('Meilleur combo')).toBeInTheDocument();
    });
  });
});
