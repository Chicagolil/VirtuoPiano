import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { SessionCard } from '@/features/performances/SessionCard';
import { SessionDetail } from '@/lib/services/performances-services';

describe('SessionCard Component', () => {
  const mockSession: SessionDetail = {
    id: '1',
    songTitle: 'Sonate au clair de lune',
    songComposer: 'Beethoven',
    correctNotes: 85,
    missedNotes: 5,
    wrongNotes: 10,
    totalPoints: 1250,
    maxMultiplier: 3,
    maxCombo: 15,
    sessionStartTime: new Date('2024-01-15T10:00:00'),
    sessionEndTime: new Date('2024-01-15T10:30:00'),
    modeName: 'Apprentissage',
    durationInMinutes: 30,
    accuracy: 85,
    performance: 90,
  };

  it('should render session title and composer', () => {
    render(<SessionCard session={mockSession} />);

    expect(screen.getByText('Sonate au clair de lune')).toBeInTheDocument();
    expect(screen.getByText('Beethoven')).toBeInTheDocument();
  });

  it('should render mode badge with correct styling for learning mode', () => {
    render(<SessionCard session={mockSession} />);

    const modeBadge = screen.getByText('Apprentissage');
    expect(modeBadge).toBeInTheDocument();
  });

  it('should render mode badge with correct styling for practice mode', () => {
    const practiceSession = {
      ...mockSession,
      modeName: 'Pratique',
    };

    render(<SessionCard session={practiceSession} />);

    const modeBadge = screen.getByText('Pratique');
    expect(modeBadge).toBeInTheDocument();
  });

  it('should render time information correctly', () => {
    render(<SessionCard session={mockSession} />);

    expect(screen.getByText('10:00 - 10:30')).toBeInTheDocument();
    expect(screen.getByText('30 minutes')).toBeInTheDocument();
  });

  it('should render total points when available', () => {
    render(<SessionCard session={mockSession} />);

    expect(screen.getByText('1250 pts')).toBeInTheDocument();
  });

  it('should not render total points when null', () => {
    const sessionWithoutPoints = {
      ...mockSession,
      totalPoints: null,
    };

    render(<SessionCard session={sessionWithoutPoints} />);

    expect(screen.queryByText(/pts/)).not.toBeInTheDocument();
  });

  it('should render max combo when available', () => {
    render(<SessionCard session={mockSession} />);

    expect(screen.getByText('Combo Maximal:')).toBeInTheDocument();
    expect(screen.getByText('x15')).toBeInTheDocument();
  });

  it('should not render max combo when null', () => {
    const sessionWithoutCombo = {
      ...mockSession,
      maxCombo: null,
    };

    render(<SessionCard session={sessionWithoutCombo} />);

    expect(screen.queryByText('Combo Maximal:')).not.toBeInTheDocument();
  });

  it('should render max multiplier when available', () => {
    render(<SessionCard session={mockSession} />);

    expect(screen.getByText('Multiplicateur Maximal:')).toBeInTheDocument();
    expect(screen.getByText('x3')).toBeInTheDocument();
  });

  it('should not render max multiplier when null', () => {
    const sessionWithoutMultiplier = {
      ...mockSession,
      maxMultiplier: null,
    };

    render(<SessionCard session={sessionWithoutMultiplier} />);

    expect(
      screen.queryByText('Multiplicateur Maximal:')
    ).not.toBeInTheDocument();
  });

  it('should render accuracy when available', () => {
    render(<SessionCard session={mockSession} />);

    expect(screen.getByText('Précision:')).toBeInTheDocument();
    expect(screen.getByText('85%')).toBeInTheDocument();
  });

  it('should not render accuracy when null', () => {
    const sessionWithoutAccuracy = {
      ...mockSession,
      accuracy: 0,
    };

    render(<SessionCard session={sessionWithoutAccuracy} />);

    expect(screen.queryByText('Précision:')).not.toBeInTheDocument();
  });

  it('should render performance when available', () => {
    render(<SessionCard session={mockSession} />);

    expect(screen.getByText('Performance:')).toBeInTheDocument();
    expect(screen.getByText('90%')).toBeInTheDocument();
  });

  it('should not render performance when null', () => {
    const sessionWithoutPerformance = {
      ...mockSession,
      performance: 0,
    };

    render(<SessionCard session={sessionWithoutPerformance} />);

    expect(screen.queryByText('Performance:')).not.toBeInTheDocument();
  });

  it('should handle session without composer', () => {
    const sessionWithoutComposer = {
      ...mockSession,
      songComposer: null,
    };

    render(<SessionCard session={sessionWithoutComposer} />);

    expect(screen.getByText('Sonate au clair de lune')).toBeInTheDocument();
    expect(screen.queryByText('Beethoven')).not.toBeInTheDocument();
  });

  it('should format duration correctly for different values', () => {
    const shortSession = {
      ...mockSession,
      durationInMinutes: 5,
    };

    render(<SessionCard session={shortSession} />);

    expect(screen.getByText('5 minutes')).toBeInTheDocument();
  });

  it('should format duration correctly for hours', () => {
    const longSession = {
      ...mockSession,
      durationInMinutes: 90,
    };

    render(<SessionCard session={longSession} />);

    expect(screen.getByText('1 heure 30 minutes')).toBeInTheDocument();
  });

  it('should handle edge case with zero duration', () => {
    const zeroSession = {
      ...mockSession,
      durationInMinutes: 0,
    };

    render(<SessionCard session={zeroSession} />);

    expect(screen.getByText('0 minutes')).toBeInTheDocument();
  });

  it('should render all stats when all values are available', () => {
    render(<SessionCard session={mockSession} />);

    // Vérifier que tous les éléments sont présents
    expect(screen.getByText('Sonate au clair de lune')).toBeInTheDocument();
    expect(screen.getByText('Beethoven')).toBeInTheDocument();
    expect(screen.getByText('Apprentissage')).toBeInTheDocument();
    expect(screen.getByText('10:00 - 10:30')).toBeInTheDocument();
    expect(screen.getByText('30 minutes')).toBeInTheDocument();
    expect(screen.getByText('1250 pts')).toBeInTheDocument();
    expect(screen.getByText('Combo Maximal:')).toBeInTheDocument();
    expect(screen.getByText('x15')).toBeInTheDocument();
    expect(screen.getByText('Multiplicateur Maximal:')).toBeInTheDocument();
    expect(screen.getByText('x3')).toBeInTheDocument();
    expect(screen.getByText('Précision:')).toBeInTheDocument();
    expect(screen.getByText('85%')).toBeInTheDocument();
    expect(screen.getByText('Performance:')).toBeInTheDocument();
    expect(screen.getByText('90%')).toBeInTheDocument();
  });

  it('should handle session with minimal data', () => {
    const minimalSession: SessionDetail = {
      id: '2',
      songTitle: 'Minimal Song',
      songComposer: null,
      correctNotes: null,
      missedNotes: null,
      wrongNotes: null,
      totalPoints: null,
      maxMultiplier: null,
      maxCombo: null,
      sessionStartTime: new Date('2024-01-15T10:00:00'),
      sessionEndTime: new Date('2024-01-15T10:15:00'),
      modeName: 'Pratique',
      durationInMinutes: 15,
      accuracy: 0,
      performance: 0,
    };

    render(<SessionCard session={minimalSession} />);

    expect(screen.getByText('Minimal Song')).toBeInTheDocument();
    expect(screen.getByText('Pratique')).toBeInTheDocument();
    expect(screen.getByText('10:00 - 10:15')).toBeInTheDocument();
    expect(screen.getByText('15 minutes')).toBeInTheDocument();

    // Vérifier que les stats optionnelles ne sont pas affichées
    expect(screen.queryByText(/pts/)).not.toBeInTheDocument();
    expect(screen.queryByText('Combo Maximal:')).not.toBeInTheDocument();
    expect(
      screen.queryByText('Multiplicateur Maximal:')
    ).not.toBeInTheDocument();
    expect(screen.queryByText('Précision:')).not.toBeInTheDocument();
    expect(screen.queryByText('Performance:')).not.toBeInTheDocument();
  });
});
