// Styles pour le composant SessionCard (version originale)
export const sessionCardStyles = {
  card: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: '0.75rem',
    padding: '1rem',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    marginBottom: '0.75rem',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '0.5rem',
  },
  title: {
    color: 'white',
    fontSize: '1rem',
    fontWeight: '600',
    margin: 0,
    marginBottom: '0.25rem',
  },
  composer: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: '0.875rem',
    margin: 0,
  },
  modeBadge: (isLearning: boolean) => ({
    backgroundColor: isLearning
      ? 'rgba(99, 102, 241, 0.2)'
      : 'rgba(147, 51, 234, 0.2)',
    color: isLearning ? '#a5b4fc' : '#c4b5fd',
    padding: '0.25rem 0.5rem',
    borderRadius: '0.375rem',
    fontSize: '0.75rem',
    fontWeight: '500',
  }),
  timeInfo: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '0.5rem',
  },
  timeDetails: {
    display: 'flex',
    gap: '1rem',
    fontSize: '0.875rem',
  },
  timeText: {
    color: 'rgba(255, 255, 255, 0.7)',
  },
  points: {
    color: 'white',
    fontWeight: '600',
  },
  stats: {
    display: 'flex',
    gap: '1rem',
    fontSize: '0.875rem',
  },
  statLabel: {
    color: 'rgba(255, 255, 255, 0.7)',
  },
  statValue: {
    color: 'white',
    fontWeight: '500',
  },
};
