// Constantes pour les couleurs de la heatmap
export const HEATMAP_COLORS = {
  green: ['#161b22', '#0c2d48', '#1e3a8a', '#3b82f6', '#60a5fa'],
  orange: ['#161b22', '#7c2d12', '#ea580c', '#fb923c', '#fed7aa'],
} as const;

// Constantes pour les animations
export const ANIMATION_STYLES = `
  @keyframes slideInUp {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
  
  @keyframes slideOutDown {
    from {
      opacity: 1;
      transform: translateY(0);
    }
    to {
      opacity: 0;
      transform: translateY(20px);
    }
  }
`;

// Constantes pour les années disponibles
export const HEATMAP_YEARS = [2023, 2024, 2025] as const;

// Constantes pour les dimensions
export const HEATMAP_DIMENSIONS = {
  cellSize: 18,
  cellGap: 5,
  cellBorderRadius: 5,
  weekHeight: 126, // 7 * 18px + 6 * 5px (gap)
} as const;

export const MONTH_NAMES = [
  'Jan',
  'Fév',
  'Mar',
  'Avr',
  'Mai',
  'Jun',
  'Jul',
  'Aoû',
  'Sep',
  'Oct',
  'Nov',
  'Déc',
];
