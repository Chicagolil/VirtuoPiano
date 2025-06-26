import { HEATMAP_DIMENSIONS } from '@/common/constants/heatmaps';
import { HEATMAP_COLORS } from '@/common/constants/heatmaps';

// Styles pour le conteneur principal
export const containerStyles = {
  main: {
    display: 'flex' as const,
    flexDirection: 'column' as const,
    alignItems: 'center' as const,
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    backdropFilter: 'blur(8px)',
    borderRadius: '1rem',
    overflow: 'hidden',
    border: '1px solid rgba(255, 255, 255, 0.05)',
    width: '100%',
    maxWidth: '1500px',
    margin: '2rem auto',
    boxShadow:
      '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
    position: 'relative' as const,
    isolation: 'isolate' as const,
    color: 'white',
    padding: '1.25rem',
  },
  glassEffect: {
    content: '',
    position: 'absolute' as const,
    inset: 0,
    background:
      'radial-gradient(circle at top right, transparent 55%, rgba(0, 0, 0, 0.1))',
    pointerEvents: 'none' as const,
    boxShadow: 'rgba(0, 0, 0, 0.1) 0.5rem 0.5rem 2.5rem inset',
    zIndex: -1,
    borderRadius: '1rem',
  },
  title: {
    marginBottom: 16,
    textAlign: 'center' as const,
    position: 'relative' as const,
    zIndex: 1,
  },
  titleText: {
    color: 'white',
    fontSize: '1.25rem',
    fontWeight: '700',
    margin: 0,
    marginBottom: '1rem',
  },
  heatmapContainer: {
    display: 'flex' as const,
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    position: 'relative' as const,
    zIndex: 1,
  },
  gridContainer: {
    display: 'flex' as const,
    flexDirection: 'column' as const,
    alignItems: 'flex-start' as const,
    position: 'relative' as const,
  },
  monthLabels: {
    display: 'flex' as const,
    flexDirection: 'row' as const,
    marginBottom: 8,
    position: 'relative' as const,
    height: '20px',
  },
  monthLabel: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 12,
    position: 'absolute' as const,
    top: '0px',
    fontWeight: '500',
  },
  grid: {
    display: 'flex' as const,
    flexDirection: 'row' as const,
    gap: HEATMAP_DIMENSIONS.cellGap,
    position: 'relative' as const,
  },
  week: {
    display: 'flex' as const,
    flexDirection: 'column' as const,
    gap: HEATMAP_DIMENSIONS.cellGap,
  },
  cell: (
    count: number | null,
    isSelected: boolean,
    loading: boolean,
    colorTheme: 'green' | 'orange'
  ) => ({
    width: HEATMAP_DIMENSIONS.cellSize,
    height: HEATMAP_DIMENSIONS.cellSize,
    background: count === null ? 'transparent' : getColor(count, colorTheme),
    borderRadius: HEATMAP_DIMENSIONS.cellBorderRadius,
    opacity: loading ? 0.3 : 1,
    cursor: count && count > 0 ? 'pointer' : 'default',
    border: isSelected ? '2px solid white' : 'none',
    transform: isSelected ? 'scale(1.1)' : 'scale(1)',
    transition: 'all 0.2s ease',
  }),
  legendContainer: {
    display: 'flex' as const,
    flexDirection: 'column' as const,
    alignItems: 'center' as const,
    marginLeft: 16,
  },
  legend: {
    display: 'flex' as const,
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
  },
  legendText: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 12,
  },
  legendColor: {
    width: HEATMAP_DIMENSIONS.cellSize,
    height: HEATMAP_DIMENSIONS.cellSize,
    borderRadius: HEATMAP_DIMENSIONS.cellBorderRadius,
    margin: '0 4px',
  },
  controls: {
    marginTop: 25,
    display: 'flex' as const,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
    marginBottom: 10,
  },
  yearSelect: {
    padding: '0.5rem 1rem',
    borderRadius: '0.5rem',
    border: '1px solid rgba(255, 255, 255, 0.05)',
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    color: 'white',
    backdropFilter: 'blur(4px)',
    fontWeight: 'bold',
    fontSize: 16,
    cursor: 'pointer',
  },
  colorButtons: {
    marginTop: 25,
    display: 'flex' as const,
    gap: 8,
  },
  colorButton: (isActive: boolean, theme: 'green' | 'orange') => ({
    padding: '0.5rem 1rem',
    borderRadius: '0.5rem',
    border: isActive
      ? `2px solid ${theme === 'green' ? '#60a5fa' : '#fb923c'}`
      : '1px solid rgba(255, 255, 255, 0.05)',
    backgroundColor: isActive
      ? theme === 'green'
        ? 'rgba(12, 45, 72, 0.3)'
        : 'rgba(124, 45, 18, 0.3)'
      : 'rgba(255, 255, 255, 0.03)',
    color: 'white',
    fontSize: 12,
    cursor: 'pointer',
    backdropFilter: 'blur(4px)',
    transition: 'all 0.3s ease',
  }),
  sessionsSection: {
    marginTop: '2rem',
    width: '100%',
    borderTop: '1px solid rgba(255, 255, 255, 0.05)',
    paddingTop: '1.5rem',
  },
  sessionsHeader: {
    display: 'flex' as const,
    justifyContent: 'space-between' as const,
    alignItems: 'center' as const,
    marginBottom: '1rem',
  },
  sessionsTitle: {
    color: 'white',
    fontSize: '1.125rem',
    fontWeight: '600',
    margin: 0,
  },
  closeButton: {
    background: 'rgba(255, 255, 255, 0.03)',
    border: '1px solid rgba(255, 255, 255, 0.05)',
    borderRadius: '0.5rem',
    padding: '0.5rem 1rem',
    color: 'white',
    cursor: 'pointer',
    fontSize: '0.875rem',
    transition: 'all 0.2s ease',
  },
  sessionsContent: {
    overflow: 'hidden',
    transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
  },
  sessionsList: {
    display: 'flex' as const,
    flexDirection: 'column' as const,
    gap: '1rem',
  },
  sessionItem: (
    isExpanded: boolean,
    isClosing: boolean,
    index: number,
    totalSessions: number
  ) => ({
    animation:
      isExpanded && !isClosing
        ? 'slideInUp 0.6s ease forwards'
        : isClosing
        ? 'slideOutDown 0.3s ease forwards'
        : 'none',
    animationDelay: isClosing
      ? `${(totalSessions - 1 - index) * 0.05}s`
      : `${index * 0.15}s`,
    opacity: isClosing ? 1 : 0,
    transform: isClosing ? 'translateY(0)' : 'translateY(20px)',
  }),
  noSessions: {
    textAlign: 'center' as const,
    padding: '2rem',
    color: 'rgba(255, 255, 255, 0.7)',
  },
  loadingSpinner: {
    display: 'flex' as const,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
    padding: '2rem',
  },
  loadingOverlay: (dataLength: number) => ({
    position: 'absolute' as const,
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    zIndex: 10,
    display: 'flex' as const,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
    width: `${
      dataLength * (HEATMAP_DIMENSIONS.cellSize + HEATMAP_DIMENSIONS.cellGap)
    }px`,
    height: `${HEATMAP_DIMENSIONS.weekHeight}px`,
  }),
};

// Fonction pour obtenir la couleur d'une cellule
const getColor = (count: number | null, colorTheme: 'green' | 'orange') => {
  if (count === null) return 'transparent';
  const colors = HEATMAP_COLORS[colorTheme];
  if (count === 0) return colors[0];
  if (count < 15) return colors[1];
  if (count < 30) return colors[2];
  if (count < 60) return colors[3];
  return colors[4];
};
