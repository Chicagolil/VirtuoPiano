import { TimelineRecord } from '../components/RecordsTimeline';

// --- TIMELINE RECORDS ---
export const learningRecords: TimelineRecord[] = [
  {
    id: 1,
    date: '2023-12-15',
    score: 0,
    type: 'start',
    description: "Début de l'apprentissage",
    details:
      "Première session d'apprentissage de ce morceau. Le voyage commence !",
  },
  {
    id: 2,
    date: '2023-12-15',
    score: 60,
    type: 'session',
    description: 'Session marathon',
    details: 'Session de 60 minutes non-stop, endurance remarquable !',
  },
  {
    id: 3,
    date: '2023-12-20',
    score: 85,
    type: 'accuracy_right',
    description: 'Précision main droite',
    details:
      '85% de précision atteinte avec la main droite. Progression remarquable !',
  },
  {
    id: 4,
    date: '2023-12-25',
    score: 78,
    type: 'accuracy_left',
    description: 'Précision main gauche',
    details:
      "78% de précision avec la main gauche. La coordination s'améliore !",
  },
  {
    id: 9,
    date: '2024-01-10',
    score: 95,
    type: 'accuracy_both',
    description: 'Précision parfaite',
    details: '95% de précision avec les deux mains. Synchronisation parfaite !',
  },
  {
    id: 6,
    date: '2024-01-02',
    score: 92,
    type: 'performance_right',
    description: 'Performance main droite',
    details: '92% de performance globale avec la main droite. Niveau expert !',
  },
  {
    id: 8,
    date: '2024-01-08',
    score: 88,
    type: 'performance_left',
    description: 'Performance main gauche',
    details: '88% de performance avec la main gauche. Équilibre parfait !',
  },
  {
    id: 10.1,
    date: '2024-01-11',
    score: 89,
    type: 'performance_both',
    description: 'Performance deux mains',
    details:
      '89% de performance globale avec les deux mains. La maîtrise approche !',
  },
  {
    id: 10,
    date: '2024-01-12',
    score: 94,
    type: 'finished',
    description: 'Musique terminée !',
    details:
      "Plus de 90% de performance globale atteinte avec les deux mains. Félicitations, vous avez terminé l'apprentissage de ce morceau !",
  },
];

export const gameRecords: TimelineRecord[] = [
  {
    id: 100,
    date: '2023-12-16',
    score: 0,
    type: 'start_game',
    description: 'Première session en mode Jeu',
    details:
      'Vous avez joué ce morceau pour la première fois en mode Jeu. Bonne chance pour battre des records !',
  },
  {
    id: 5,
    date: '2023-12-28',
    score: 4.2,
    type: 'multiplier',
    description: 'Multiplicateur maximal',
    details: 'Multiplicateur x4.2 atteint, performance exceptionnelle !',
  },
  {
    id: 7,
    date: '2024-01-05',
    score: 847,
    type: 'combo',
    description: 'Combo record établi',
    details:
      '847 notes jouées consécutivement sans erreur, un combo historique !',
  },
  {
    id: 11,
    date: '2024-01-15',
    score: 8750,
    type: 'score',
    description: 'Nouveau record de score !',
    details:
      'Score exceptionnel de 8750 points atteint après 3 semaines de pratique intensive.',
  },
];

// --- BAR CHART INTERVALS DATA ---
export const learningBarIntervals = [
  {
    label: 'Jan - Juin 2024',
    data: [
      { mois: 'Jan', precision: 87, performance: 84 },
      { mois: 'Fév', precision: 89, performance: 86 },
      { mois: 'Mar', precision: 91, performance: 88 },
      { mois: 'Avr', precision: 92, performance: 90 },
      { mois: 'Mai', precision: 93, performance: 91 },
      { mois: 'Juin', precision: 94, performance: 92 },
    ],
  },
  {
    label: 'Juil - Déc 2024',
    data: [
      { mois: 'Juil', precision: 95, performance: 93 },
      { mois: 'Août', precision: 96, performance: 94 },
      { mois: 'Sept', precision: 97, performance: 95 },
      { mois: 'Oct', precision: 98, performance: 96 },
      { mois: 'Nov', precision: 99, performance: 97 },
      { mois: 'Déc', precision: 99, performance: 98 },
    ],
  },
];

export const gameBarIntervals = [
  {
    label: 'Jan - Juin 2024',
    data: [
      { mois: 'Jan', score: 8200, combo: 320, multi: 3.2 },
      { mois: 'Fév', score: 8450, combo: 350, multi: 3.5 },
      { mois: 'Mar', score: 8700, combo: 370, multi: 3.8 },
      { mois: 'Avr', score: 8900, combo: 400, multi: 4.0 },
      { mois: 'Mai', score: 9100, combo: 420, multi: 4.1 },
      { mois: 'Juin', score: 9300, combo: 450, multi: 4.2 },
    ],
  },
  {
    label: 'Juil - Déc 2024',
    data: [
      { mois: 'Juil', score: 9350, combo: 470, multi: 4.3 },
      { mois: 'Août', score: 9400, combo: 480, multi: 4.4 },
      { mois: 'Sept', score: 9450, combo: 490, multi: 4.5 },
      { mois: 'Oct', score: 9500, combo: 500, multi: 4.6 },
      { mois: 'Nov', score: 9550, combo: 510, multi: 4.7 },
      { mois: 'Déc', score: 9600, combo: 520, multi: 4.8 },
    ],
  },
];
