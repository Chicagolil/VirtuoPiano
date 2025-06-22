import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Heatmap } from '@/components/ui/heatmap';
import { useHeatmap } from '@/customHooks/useHeatmap';
import {
  getHeatmapData,
  getSessionsByDate,
} from '@/lib/actions/heatmap-actions';

// Mock des actions
vi.mock('@/lib/actions/heatmap-actions');
const mockGetHeatmapData = vi.mocked(getHeatmapData);
const mockGetSessionsByDate = vi.mocked(getSessionsByDate);

// Mock du hook useHeatmap
vi.mock('@/customHooks/useHeatmap');
const mockUseHeatmap = vi.mocked(useHeatmap);

// Mock de Tippy
vi.mock('@tippyjs/react', () => ({
  default: ({ children, content }: any) => (
    <div data-testid="tippy" data-content={content}>
      {children}
    </div>
  ),
}));

// Mock du composant Spinner
vi.mock('@/components/ui/spinner', () => ({
  Spinner: ({ variant, size, className }: any) => (
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

// Mock du composant SessionCard
vi.mock('@/components/ui/SessionCard', () => ({
  SessionCard: ({ session }: any) => (
    <div data-testid="session-card" data-session-id={session.id}>
      {session.songTitle}
    </div>
  ),
}));

describe('Heatmap Integration Tests', () => {
  const mockSessionData = [
    {
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
    },
    {
      id: '2',
      songTitle: 'Für Elise',
      songComposer: 'Beethoven',
      correctNotes: 70,
      missedNotes: 3,
      wrongNotes: 7,
      totalPoints: 1000,
      maxMultiplier: 2,
      maxCombo: 10,
      sessionStartTime: new Date('2024-01-15T14:00:00'),
      sessionEndTime: new Date('2024-01-15T14:45:00'),
      modeName: 'Pratique',
      durationInMinutes: 45,
      accuracy: 80,
      performance: 85,
    },
  ];

  const defaultMockData = {
    data: Array(53)
      .fill(null)
      .map(() => Array(7).fill(0)),
    loading: false,
    selectedYear: 2024,
    selectedDate: '',
    sessions: [],
    sessionsLoading: false,
    isExpanded: false,
    isClosing: false,
    colorTheme: 'green' as const,
    monthLabels: [
      { month: 'Jan', position: 0 },
      { month: 'Fév', position: 4 },
      { month: 'Mar', position: 8 },
    ],
    totalContributions: 120,
    setSelectedYear: vi.fn(),
    setColorTheme: vi.fn(),
    handleCellClick: vi.fn(),
    closeSessions: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
    mockUseHeatmap.mockReturnValue(defaultMockData);
    mockGetHeatmapData.mockResolvedValue({
      success: true,
      data: [
        { date: new Date('2024-01-15'), durationInMinutes: 75 },
        { date: new Date('2024-01-16'), durationInMinutes: 45 },
      ],
    });
    mockGetSessionsByDate.mockResolvedValue({
      success: true,
      data: mockSessionData,
    });
  });

  it('should load and display heatmap data correctly', async () => {
    render(<Heatmap />);

    // Vérifier que le titre s'affiche
    expect(
      screen.getByText('2 heures de pratique en 2024')
    ).toBeInTheDocument();

    // Vérifier que la grille est rendue
    expect(screen.getByRole('grid', { hidden: true })).toBeInTheDocument();

    // Vérifier que les contrôles sont présents
    expect(screen.getByRole('combobox')).toBeInTheDocument();
    expect(screen.getByText('Bleu')).toBeInTheDocument();
    expect(screen.getByText('Orange')).toBeInTheDocument();
  });

  it('should handle year change and reload data', async () => {
    const mockSetSelectedYear = vi.fn();
    mockUseHeatmap.mockReturnValue({
      ...defaultMockData,
      setSelectedYear: mockSetSelectedYear,
    });

    render(<Heatmap />);

    const yearSelect = screen.getByRole('combobox');
    fireEvent.change(yearSelect, { target: { value: '2025' } });

    expect(mockSetSelectedYear).toHaveBeenCalledWith(2025);
  });

  it('should handle color theme change', async () => {
    const mockSetColorTheme = vi.fn();
    mockUseHeatmap.mockReturnValue({
      ...defaultMockData,
      setColorTheme: mockSetColorTheme,
    });

    render(<Heatmap />);

    const orangeButton = screen.getByText('Orange');
    fireEvent.click(orangeButton);

    expect(mockSetColorTheme).toHaveBeenCalledWith('orange');
  });

  it('should display sessions when a cell is clicked', async () => {
    const mockHandleCellClick = vi.fn();
    mockUseHeatmap.mockReturnValue({
      ...defaultMockData,
      selectedDate: '2024-01-15',
      sessions: mockSessionData,
      isExpanded: true,
      handleCellClick: mockHandleCellClick,
    });

    render(<Heatmap />);

    // Vérifier que la section des sessions s'affiche
    expect(
      screen.getByText('Sessions du lundi 15 janvier 2024')
    ).toBeInTheDocument();

    // Vérifier que les sessions sont affichées
    expect(screen.getByText('Sonate au clair de lune')).toBeInTheDocument();
    expect(screen.getByText('Für Elise')).toBeInTheDocument();

    // Vérifier que le bouton fermer est présent
    expect(screen.getByText('Fermer')).toBeInTheDocument();
  });

  it('should handle close sessions functionality', async () => {
    const mockCloseSessions = vi.fn();
    mockUseHeatmap.mockReturnValue({
      ...defaultMockData,
      selectedDate: '2024-01-15',
      sessions: mockSessionData,
      isExpanded: true,
      closeSessions: mockCloseSessions,
    });

    render(<Heatmap />);

    const closeButton = screen.getByText('Fermer');
    fireEvent.click(closeButton);

    expect(mockCloseSessions).toHaveBeenCalled();
  });

  it('should show loading state during data fetch', async () => {
    mockUseHeatmap.mockReturnValue({
      ...defaultMockData,
      loading: true,
      totalContributions: 0,
    });

    render(<Heatmap />);

    expect(screen.getByText('Chargement des données...')).toBeInTheDocument();
    expect(screen.getByTestId('spinner')).toBeInTheDocument();
  });

  it('should show sessions loading state', async () => {
    mockUseHeatmap.mockReturnValue({
      ...defaultMockData,
      selectedDate: '2024-01-15',
      sessionsLoading: true,
      isExpanded: true,
    });

    render(<Heatmap />);

    const spinners = screen.getAllByTestId('spinner');
    expect(spinners.length).toBeGreaterThan(0);
  });

  it('should display month labels correctly', async () => {
    render(<Heatmap />);

    expect(screen.getByText('Jan')).toBeInTheDocument();
    expect(screen.getByText('Fév')).toBeInTheDocument();
    expect(screen.getByText('Mar')).toBeInTheDocument();
  });

  it('should handle empty sessions gracefully', async () => {
    mockUseHeatmap.mockReturnValue({
      ...defaultMockData,
      selectedDate: '2024-01-15',
      sessions: [],
      isExpanded: true,
    });

    render(<Heatmap />);

    expect(
      screen.getByText('Aucune session trouvée pour cette date.')
    ).toBeInTheDocument();
  });

  it('should handle cell clicks when not loading', async () => {
    const mockHandleCellClick = vi.fn();
    mockUseHeatmap.mockReturnValue({
      ...defaultMockData,
      loading: false,
      handleCellClick: mockHandleCellClick,
    });

    render(<Heatmap />);

    const cells = screen.getAllByTestId('tippy');
    if (cells.length > 0) {
      fireEvent.click(cells[0]);
      await waitFor(() => {
        expect(mockHandleCellClick).toHaveBeenCalled();
      });
    }
  });

  it('should prevent cell clicks during loading', async () => {
    const mockHandleCellClick = vi.fn();
    mockUseHeatmap.mockReturnValue({
      ...defaultMockData,
      loading: true,
      handleCellClick: mockHandleCellClick,
    });

    render(<Heatmap />);

    const cells = screen.getAllByTestId('tippy');
    if (cells.length > 0) {
      fireEvent.click(cells[0]);
      expect(mockHandleCellClick).not.toHaveBeenCalled();
    }
  });

  it('should display correct total contributions', async () => {
    mockUseHeatmap.mockReturnValue({
      ...defaultMockData,
      totalContributions: 180, // 3 heures
    });

    render(<Heatmap />);

    expect(
      screen.getByText('3 heures de pratique en 2024')
    ).toBeInTheDocument();
  });

  it('should handle zero contributions', async () => {
    mockUseHeatmap.mockReturnValue({
      ...defaultMockData,
      totalContributions: 0,
    });

    render(<Heatmap />);

    expect(
      screen.getByText('0 minutes de pratique en 2024')
    ).toBeInTheDocument();
  });

  it('should render legend with correct colors', async () => {
    render(<Heatmap />);

    expect(screen.getByText('Moins')).toBeInTheDocument();
    expect(screen.getByText('Plus')).toBeInTheDocument();
  });

  it('should handle animation styles injection', async () => {
    render(<Heatmap />);

    // Vérifier que les styles d'animation sont injectés
    const styleElements = document.querySelectorAll('style');
    expect(styleElements.length).toBeGreaterThan(0);
  });

  it('should maintain state consistency across interactions', async () => {
    const mockSetSelectedYear = vi.fn();
    const mockSetColorTheme = vi.fn();
    const mockHandleCellClick = vi.fn();
    const mockCloseSessions = vi.fn();

    mockUseHeatmap.mockReturnValue({
      ...defaultMockData,
      setSelectedYear: mockSetSelectedYear,
      setColorTheme: mockSetColorTheme,
      handleCellClick: mockHandleCellClick,
      closeSessions: mockCloseSessions,
    });

    render(<Heatmap />);

    // Tester plusieurs interactions
    const yearSelect = screen.getByRole('combobox');
    fireEvent.change(yearSelect, { target: { value: '2025' } });

    const orangeButton = screen.getByText('Orange');
    fireEvent.click(orangeButton);

    // Vérifier que toutes les fonctions ont été appelées
    expect(mockSetSelectedYear).toHaveBeenCalledWith(2025);
    expect(mockSetColorTheme).toHaveBeenCalledWith('orange');
  });
});
