import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
export function getAccuracyComment(accuracy: number, hand: string): string {
  if (accuracy >= 95) {
    return `Précision exceptionnelle ! Votre ${hand} est devenue experte.`;
  } else if (accuracy >= 85) {
    return `Excellente précision ! Votre ${hand} maîtrise parfaitement le morceau.`;
  } else if (accuracy >= 75) {
    return `Bonne précision ! Votre ${hand} progresse bien.`;
  } else {
    return `Précision correcte. Continuez à pratiquer pour vous améliorer.`;
  }
}

export function getPerformanceComment(
  performance: number,
  hand: string
): string {
  if (performance >= 95) {
    return `Performance exceptionnelle ! Votre ${hand} est au niveau expert.`;
  } else if (performance >= 85) {
    return `Excellente performance ! Votre ${hand} maîtrise parfaitement le rythme.`;
  } else if (performance >= 75) {
    return `Bonne performance ! Votre ${hand} progresse bien.`;
  } else {
    return `Performance correcte. Continuez à pratiquer pour vous améliorer.`;
  }
}

export function getBothHandsAccuracyComment(accuracy: number): string {
  if (accuracy >= 95) {
    return 'Synchronisation parfaite ! Vos deux mains travaillent en harmonie parfaite.';
  } else if (accuracy >= 85) {
    return 'Excellente coordination ! Vos deux mains sont parfaitement synchronisées.';
  } else if (accuracy >= 75) {
    return 'Bonne coordination ! Vos deux mains commencent à bien travailler ensemble.';
  } else {
    return 'Coordination en cours. Continuez à pratiquer pour améliorer la synchronisation.';
  }
}

export function getBothHandsPerformanceComment(performance: number): string {
  if (performance >= 85) {
    return 'Excellente coordination ! Vos deux mains sont parfaitement synchronisées.';
  } else if (performance >= 75) {
    return 'Bonne coordination ! Vos deux mains commencent à bien travailler ensemble.';
  } else {
    return 'Coordination en cours. Continuez à pratiquer pour améliorer la synchronisation.';
  }
}

export function getFinishedComment(performance: number): string {
  if (performance >= 98) {
    return 'Performance parfaite ! Vous êtes un virtuose !';
  } else if (performance >= 95) {
    return 'Performance exceptionnelle ! Vous maîtrisez parfaitement ce morceau.';
  } else {
    return "Performance excellente ! Vous avez terminé l'apprentissage avec brio.";
  }
}

export function getSessionComment(durationMinutes: number): string {
  if (durationMinutes >= 120) {
    return 'Session marathon impressionnante ! Votre endurance est remarquable.';
  } else if (durationMinutes >= 90) {
    return 'Session très longue ! Votre concentration est exceptionnelle.';
  } else if (durationMinutes >= 60) {
    return 'Session longue ! Votre persévérance est admirable.';
  } else if (durationMinutes >= 30) {
    return 'Bonne session ! Vous maintenez bien votre concentration.';
  } else {
    return 'Session correcte. Continuez à pratiquer régulièrement.';
  }
}

export function getMarathonComment(durationMinutes: number): string {
  if (durationMinutes >= 180) {
    return 'Session ultra-marathon ! Vous êtes un vrai marathonien du piano !';
  } else if (durationMinutes >= 120) {
    return 'Session marathon exceptionnelle ! Votre endurance est incroyable.';
  } else if (durationMinutes >= 90) {
    return 'Session marathon impressionnante ! Votre concentration est remarquable.';
  } else {
    return 'Session marathon ! Votre persévérance est admirable.';
  }
}

export function getScoreComment(score: number): string {
  if (score >= 10000) {
    return 'Score légendaire ! Vous êtes un virtuose du jeu !';
  } else if (score >= 8000) {
    return 'Score exceptionnel ! Votre performance est remarquable.';
  } else if (score >= 6000) {
    return 'Excellent score ! Vous maîtrisez parfaitement le jeu.';
  } else if (score >= 4000) {
    return 'Très bon score ! Vous progressez bien.';
  } else if (score >= 2000) {
    return 'Bon score ! Continuez à vous améliorer.';
  } else {
    return 'Score correct. Pratiquez pour vous améliorer.';
  }
}

export function getComboComment(combo: number): string {
  if (combo >= 1000) {
    return 'Combo légendaire ! Vous êtes un maître de la précision !';
  } else if (combo >= 500) {
    return 'Combo exceptionnel ! Votre précision est remarquable.';
  } else if (combo >= 200) {
    return 'Excellent combo ! Vous maîtrisez parfaitement la précision.';
  } else if (combo >= 100) {
    return 'Très bon combo ! Vous progressez bien.';
  } else if (combo >= 50) {
    return 'Bon combo ! Continuez à vous améliorer.';
  } else {
    return 'Combo correct. Pratiquez pour vous améliorer.';
  }
}

export function getMultiplierComment(multiplier: number): string {
  if (multiplier >= 8) {
    return 'Multiplicateur légendaire ! Vous êtes un maître du timing !';
  } else if (multiplier >= 6) {
    return 'Multiplicateur exceptionnel ! Votre timing est remarquable.';
  } else if (multiplier >= 4) {
    return 'Excellent multiplicateur ! Vous maîtrisez parfaitement le timing.';
  } else if (multiplier >= 3) {
    return 'Très bon multiplicateur ! Vous progressez bien.';
  } else if (multiplier >= 2) {
    return 'Bon multiplicateur ! Continuez à vous améliorer.';
  } else {
    return 'Multiplicateur correct. Pratiquez pour vous améliorer.';
  }
}

// Méthodes utilitaires privées pour calculer les intervalles
export function getCurrentIntervalDates(
  interval: 'week' | 'month' | 'quarter'
): { startDate: Date; endDate: Date } {
  const now = new Date();
  let startDate: Date;
  let endDate: Date;

  switch (interval) {
    case 'week':
      // 7 derniers jours
      startDate = new Date(now);
      startDate.setDate(now.getDate() - 6);
      startDate.setHours(0, 0, 0, 0);
      endDate = new Date(now);
      endDate.setHours(23, 59, 59, 999);
      break;

    case 'month':
      // 31 derniers jours
      startDate = new Date(now);
      startDate.setDate(now.getDate() - 30);
      startDate.setHours(0, 0, 0, 0);
      endDate = new Date(now);
      endDate.setHours(23, 59, 59, 999);
      break;

    case 'quarter':
      // 90 derniers jours
      startDate = new Date(now);
      startDate.setDate(now.getDate() - 89);
      startDate.setHours(0, 0, 0, 0);
      endDate = new Date(now);
      endDate.setHours(23, 59, 59, 999);
      break;

    default:
      throw new Error('Paramètre invalide');
  }

  return { startDate, endDate };
}
export function getPreviousIntervalDates(
  interval: 'week' | 'month' | 'quarter'
): { startDate: Date; endDate: Date } {
  const now = new Date();
  let startDate: Date;
  let endDate: Date;

  switch (interval) {
    case 'week':
      // 7 jours précédents (jours 8 à 14)
      startDate = new Date(now);
      startDate.setDate(now.getDate() - 13);
      startDate.setHours(0, 0, 0, 0);
      endDate = new Date(now);
      endDate.setDate(now.getDate() - 7);
      endDate.setHours(23, 59, 59, 999);
      break;

    case 'month':
      // 31 jours précédents (jours 32 à 62)
      startDate = new Date(now);
      startDate.setDate(now.getDate() - 61);
      startDate.setHours(0, 0, 0, 0);
      endDate = new Date(now);
      endDate.setDate(now.getDate() - 31);
      endDate.setHours(23, 59, 59, 999);
      break;

    case 'quarter':
      // 90 jours précédents (jours 91 à 180)
      startDate = new Date(now);
      startDate.setDate(now.getDate() - 179);
      startDate.setHours(0, 0, 0, 0);
      endDate = new Date(now);
      endDate.setDate(now.getDate() - 90);
      endDate.setHours(23, 59, 59, 999);
      break;

    default:
      throw new Error('Paramètre invalide');
  }

  return { startDate, endDate };
}

export function calculateTotalTimeInMinutes(sessions: any[]): number {
  return sessions.reduce((sum, session) => {
    const durationMs =
      session.sessionEndTime.getTime() - session.sessionStartTime.getTime();
    return sum + Math.round(durationMs / (1000 * 60));
  }, 0);
}

export function calculateLongestSessionInMinutes(sessions: any[]): number {
  return sessions.reduce((max, session) => {
    const durationMs =
      session.sessionEndTime.getTime() - session.sessionStartTime.getTime();
    return Math.max(max, Math.round(durationMs / (1000 * 60)));
  }, 0);
}

export function hasHandActivity(session: any): boolean {
  return (
    (session.correctNotes || 0) +
      (session.missedNotes || 0) +
      (session.wrongNotes || 0) >
    0
  );
}
