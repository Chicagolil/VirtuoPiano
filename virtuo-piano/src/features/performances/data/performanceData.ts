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

// --- TILES DATA ---
interface TileData {
  label: string;
  value: string | number;
  iconName: string;
  iconColor: string;
}

export const learningTiles: TileData[] = [
  {
    label: 'Sessions',
    value: 18,
    iconName: 'IconClock',
    iconColor: 'text-blue-500',
  },
  {
    label: 'Précision moyenne',
    value: '87%',
    iconName: 'IconTarget',
    iconColor: 'text-green-500',
  },
  {
    label: 'Performance moyenne',
    value: '84%',
    iconName: 'IconStar',
    iconColor: 'text-pink-500',
  },
  {
    label: 'Temps total',
    value: '5h 20min',
    iconName: 'IconClock',
    iconColor: 'text-purple-500',
  },
  {
    label: 'Plus longue session',
    value: '52min',
    iconName: 'IconFlame',
    iconColor: 'text-orange-500',
  },
  {
    label: 'Streak',
    value: '7 jours',
    iconName: 'IconFire',
    iconColor: 'text-red-500',
  },
];

export const gameTiles: TileData[] = [
  {
    label: 'Sessions',
    value: 14,
    iconName: 'IconClock',
    iconColor: 'text-blue-500',
  },
  {
    label: 'Score moyen',
    value: '7,850',
    iconName: 'IconChartBar',
    iconColor: 'text-green-500',
  },
  {
    label: 'Meilleur score',
    value: '8,950',
    iconName: 'IconTrophy',
    iconColor: 'text-yellow-500',
  },
  {
    label: 'Temps total',
    value: '3h 40min',
    iconName: 'IconClock',
    iconColor: 'text-purple-500',
  },
  {
    label: 'Plus longue session',
    value: '38min',
    iconName: 'IconFlame',
    iconColor: 'text-orange-500',
  },
  {
    label: 'Streak',
    value: '4 jours',
    iconName: 'IconFire',
    iconColor: 'text-red-500',
  },
];

// --- CHART DATA ---
export const learningPrecisionData = [
  { session: 1, droite: 82, gauche: 75, deux: 80 },
  { session: 2, droite: 85, gauche: 78, deux: 82 },
  { session: 3, droite: 88, gauche: 80, deux: 85 },
  { session: 4, droite: 90, gauche: 82, deux: 87 },
  { session: 5, droite: 92, gauche: 85, deux: 89 },
  { session: 6, droite: 91, gauche: 86, deux: 90 },
  { session: 7, droite: 93, gauche: 88, deux: 92 },
];

export const learningPerformanceData = [
  { session: 1, droite: 78, gauche: 70, deux: 75 },
  { session: 2, droite: 80, gauche: 72, deux: 77 },
  { session: 3, droite: 83, gauche: 74, deux: 80 },
  { session: 4, droite: 85, gauche: 76, deux: 82 },
  { session: 5, droite: 87, gauche: 78, deux: 84 },
  { session: 6, droite: 89, gauche: 80, deux: 86 },
  { session: 7, droite: 91, gauche: 82, deux: 88 },
];

export const gameScoreLineData = [
  { session: 1, score: 8200, combo: 320, multi: 3.2 },
  { session: 2, score: 8450, combo: 350, multi: 3.5 },
  { session: 3, score: 8700, combo: 370, multi: 3.8 },
  { session: 4, score: 8900, combo: 400, multi: 4.0 },
  { session: 5, score: 9100, combo: 420, multi: 4.1 },
  { session: 6, score: 9300, combo: 450, multi: 4.2 },
  { session: 7, score: 9500, combo: 470, multi: 4.3 },
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

// --- EXTENDED DATA ---
export const generateExtendedPrecisionData = () => {
  return [
    ...learningPrecisionData,
    // Sessions 8-14
    { session: 8, droite: 94, gauche: 89, deux: 93 },
    { session: 9, droite: 95, gauche: 90, deux: 94 },
    { session: 10, droite: 93, gauche: 91, deux: 93 },
    { session: 11, droite: 96, gauche: 92, deux: 95 },
    { session: 12, droite: 97, gauche: 93, deux: 96 },
    { session: 13, droite: 95, gauche: 94, deux: 95 },
    { session: 14, droite: 98, gauche: 95, deux: 97 },
    // Sessions 15-21
    { session: 15, droite: 96, gauche: 93, deux: 95 },
    { session: 16, droite: 97, gauche: 94, deux: 96 },
    { session: 17, droite: 98, gauche: 95, deux: 97 },
    { session: 18, droite: 99, gauche: 96, deux: 98 },
    { session: 19, droite: 97, gauche: 97, deux: 97 },
    { session: 20, droite: 98, gauche: 98, deux: 98 },
    { session: 21, droite: 99, gauche: 99, deux: 99 },
  ];
};

export const generateExtendedPerformanceData = () => {
  return [
    ...learningPerformanceData,
    // Sessions 8-14
    { session: 8, droite: 92, gauche: 83, deux: 89 },
    { session: 9, droite: 93, gauche: 84, deux: 90 },
    { session: 10, droite: 91, gauche: 85, deux: 89 },
    { session: 11, droite: 94, gauche: 86, deux: 91 },
    { session: 12, droite: 95, gauche: 87, deux: 92 },
    { session: 13, droite: 93, gauche: 88, deux: 91 },
    { session: 14, droite: 96, gauche: 89, deux: 93 },
    // Sessions 15-21
    { session: 15, droite: 94, gauche: 87, deux: 91 },
    { session: 16, droite: 95, gauche: 88, deux: 92 },
    { session: 17, droite: 96, gauche: 89, deux: 93 },
    { session: 18, droite: 97, gauche: 90, deux: 94 },
    { session: 19, droite: 95, gauche: 91, deux: 93 },
    { session: 20, droite: 96, gauche: 92, deux: 94 },
    { session: 21, droite: 97, gauche: 93, deux: 95 },
  ];
};

export const generateExtendedScoreData = () => {
  return [
    ...gameScoreLineData,
    // Sessions 8-14
    { session: 8, score: 9600, combo: 480, multi: 4.4 },
    { session: 9, score: 9700, combo: 490, multi: 4.5 },
    { session: 10, score: 9550, combo: 485, multi: 4.3 },
    { session: 11, score: 9800, combo: 500, multi: 4.6 },
    { session: 12, score: 9900, combo: 510, multi: 4.7 },
    { session: 13, score: 9750, combo: 495, multi: 4.4 },
    { session: 14, score: 10000, combo: 520, multi: 4.8 },
    // Sessions 15-21
    { session: 15, score: 9850, combo: 505, multi: 4.5 },
    { session: 16, score: 9950, combo: 515, multi: 4.6 },
    { session: 17, score: 10100, combo: 525, multi: 4.9 },
    { session: 18, score: 10200, combo: 535, multi: 5.0 },
    { session: 19, score: 10050, combo: 530, multi: 4.8 },
    { session: 20, score: 10150, combo: 540, multi: 4.9 },
    { session: 21, score: 10300, combo: 550, multi: 5.1 },
  ];
};

export const generateExtendedPracticeData = () => {
  const today = new Date();
  const data = [];

  // Générer 30 jours de données (du plus ancien au plus récent)
  for (let i = 29; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(today.getDate() - i);

    // Formater la date
    let displayName;
    if (i === 0) {
      displayName = "Aujourd'hui";
    } else {
      // Format DD/MM pour les autres jours
      const day = String(date.getDate()).padStart(2, '0');
      const month = String(date.getMonth() + 1).padStart(2, '0');
      displayName = `${day}/${month}`;
    }

    // Générer des données factices (on peut les remplacer plus tard par de vraies données)
    const pratique = Math.floor(Math.random() * 40) + 30; // 30-70 minutes
    const modeJeu = Math.floor(pratique * (0.3 + Math.random() * 0.4)); // 30-70% du total
    const modeApprentissage = pratique - modeJeu;

    data.push({
      name: displayName,
      pratique,
      modeJeu,
      modeApprentissage,
    });
  }

  return data;
};
