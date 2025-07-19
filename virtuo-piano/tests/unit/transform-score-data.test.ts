import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { ScoreSummaryService } from '@/lib/services/performances-services';
import { ScoreSummary } from '@/components/cards/ScoreCard';
import { getLearnScores } from '@/common/utils/function';

// Mock de getLearnScores
vi.mock('@/common/utils/function', () => ({
  getLearnScores: vi.fn(
    (wrongNotes: number, correctNotes: number, missedNotes: number) => ({
      performance:
        Math.floor(
          (correctNotes / (wrongNotes + correctNotes + missedNotes)) * 100
        ) || 0,
      accuracy:
        Math.floor((correctNotes / (correctNotes + wrongNotes)) * 100) || 0,
    })
  ),
}));

// Fonction transformScoreData extraite pour les tests
function transformScoreData(score: ScoreSummaryService): ScoreSummary {
  const durationMs =
    score.sessionEndTime.getTime() - score.sessionStartTime.getTime();
  const durationInMinutes = Math.round(durationMs / (1000 * 60));

  // Utiliser la fonction mockée
  const { performance, accuracy } = getLearnScores(
    score.wrongNotes || 0,
    score.correctNotes || 0,
    score.missedNotes || 0
  );

  // Formater la date
  const now = new Date();
  const sessionDate = score.sessionStartTime;
  const diffTime = Math.abs(now.getTime() - sessionDate.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  let playedAt: string;
  if (diffDays === 1) {
    playedAt = "Aujourd'hui";
  } else if (diffDays === 2) {
    playedAt = 'Hier';
  } else if (diffDays <= 7) {
    playedAt = `Il y a ${diffDays - 1} jours`;
  } else if (diffDays <= 30) {
    const weeks = Math.floor((diffDays - 1) / 7);
    playedAt = `Il y a ${weeks} semaine${weeks > 1 ? 's' : ''}`;
  } else {
    playedAt = sessionDate.toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
    });
  }

  // Ajouter l'heure si c'est aujourd'hui ou hier
  if (diffDays <= 2) {
    playedAt += `, ${sessionDate.toLocaleTimeString('fr-FR', {
      hour: '2-digit',
      minute: '2-digit',
    })}`;
  }

  // Formater la durée
  const hours = Math.floor(durationInMinutes / 60);
  const minutes = durationInMinutes % 60;
  const duration =
    hours > 0
      ? `${hours}:${minutes.toString().padStart(2, '0')}`
      : `${minutes}:00`;

  return {
    id: score.id,
    songTitle: score.songTitle,
    songComposer: score.songComposer || undefined,
    totalPoints: score.totalPoints || 0,
    maxMultiplier: score.maxMultiplier || 0,
    maxCombo: score.maxCombo || 0,
    playedAt,
    mode: score.modeName === 'Apprentissage' ? 'learning' : 'game',
    accuracy,
    duration,
    imageUrl: score.imageUrl || undefined,
    performance,
  };
}

describe('transformScoreData', () => {
  let mockScore: ScoreSummaryService;

  beforeEach(() => {
    // Reset date to a fixed point for consistent testing
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2024-01-15T10:00:00Z'));

    mockScore = {
      id: 'test-score-id',
      songTitle: 'Test Song',
      songComposer: 'Test Composer',
      totalPoints: 1000,
      maxMultiplier: 5,
      imageUrl: 'http://example.com/image.jpg',
      wrongNotes: 10,
      correctNotes: 90,
      missedNotes: 5,
      maxCombo: 50,
      sessionStartTime: new Date('2024-01-14T09:00:00Z'), // Hier
      sessionEndTime: new Date('2024-01-14T09:30:00Z'), // 30 minutes de session
      modeName: 'Apprentissage',
    };
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should transform basic score data correctly', () => {
    const result = transformScoreData(mockScore);

    expect(result.id).toBe('test-score-id');
    expect(result.songTitle).toBe('Test Song');
    expect(result.songComposer).toBe('Test Composer');
    expect(result.totalPoints).toBe(1000);
    expect(result.maxMultiplier).toBe(5);
    expect(result.maxCombo).toBe(50);
    expect(result.imageUrl).toBe('http://example.com/image.jpg');
  });

  it('should calculate duration correctly', () => {
    const result = transformScoreData(mockScore);
    expect(result.duration).toBe('30:00'); // 30 minutes
  });

  it('should calculate duration with hours correctly', () => {
    mockScore.sessionEndTime = new Date('2024-01-14T10:30:00Z'); // 1h30
    const result = transformScoreData(mockScore);
    expect(result.duration).toBe('1:30'); // 1 hour 30 minutes
  });

  it('should map mode correctly', () => {
    // Test learning mode
    mockScore.modeName = 'Apprentissage';
    let result = transformScoreData(mockScore);
    expect(result.mode).toBe('learning');

    // Test game mode
    mockScore.modeName = 'Jeu';
    result = transformScoreData(mockScore);
    expect(result.mode).toBe('game');
  });

  it('should handle null values correctly', () => {
    mockScore.songComposer = null;
    mockScore.totalPoints = null;
    mockScore.maxMultiplier = null;
    mockScore.maxCombo = null;
    mockScore.wrongNotes = null;
    mockScore.correctNotes = null;
    mockScore.missedNotes = null;
    mockScore.imageUrl = null;

    const result = transformScoreData(mockScore);

    expect(result.songComposer).toBeUndefined();
    expect(result.totalPoints).toBe(0);
    expect(result.maxMultiplier).toBe(0);
    expect(result.maxCombo).toBe(0);
    expect(result.imageUrl).toBeUndefined();
  });

  describe('date formatting', () => {
    it('should format "Aujourd\'hui" correctly', () => {
      mockScore.sessionStartTime = new Date('2024-01-15T09:00:00Z'); // Today
      const result = transformScoreData(mockScore);
      expect(result.playedAt).toMatch(/Aujourd'hui, \d{2}:\d{2}/);
    });

    it('should format "Hier" correctly', () => {
      mockScore.sessionStartTime = new Date('2024-01-14T09:00:00Z'); // Yesterday
      const result = transformScoreData(mockScore);
      expect(result.playedAt).toMatch(/Hier, \d{2}:\d{2}/);
    });

    it('should format days ago correctly', () => {
      mockScore.sessionStartTime = new Date('2024-01-12T09:00:00Z'); // 3 days ago
      const result = transformScoreData(mockScore);
      expect(result.playedAt).toBe('Il y a 3 jours');
    });

    it('should format weeks ago correctly', () => {
      mockScore.sessionStartTime = new Date('2024-01-01T09:00:00Z'); // 14 days ago
      const result = transformScoreData(mockScore);
      expect(result.playedAt).toBe('Il y a 2 semaines');
    });

    it('should format single week correctly', () => {
      mockScore.sessionStartTime = new Date('2024-01-08T09:00:00Z'); // 7 days ago
      const result = transformScoreData(mockScore);
      expect(result.playedAt).toBe('Il y a 1 semaine');
    });

    it('should format long time ago with date', () => {
      mockScore.sessionStartTime = new Date('2023-12-01T09:00:00Z'); // More than 30 days ago
      const result = transformScoreData(mockScore);
      expect(result.playedAt).toMatch(/\d{1,2} \w+/); // Should contain day and month
    });
  });

  it('should call getLearnScores with correct parameters', () => {
    transformScoreData(mockScore);

    expect(getLearnScores).toHaveBeenCalledWith(10, 90, 5);
  });

  it('should handle edge case with zero duration', () => {
    mockScore.sessionStartTime = new Date('2024-01-14T09:00:00Z');
    mockScore.sessionEndTime = new Date('2024-01-14T09:00:00Z'); // Same time

    const result = transformScoreData(mockScore);
    expect(result.duration).toBe('0:00');
  });
});
