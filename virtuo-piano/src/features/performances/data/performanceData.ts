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
