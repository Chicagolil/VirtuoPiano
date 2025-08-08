import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Heatmap } from '@/features/performances/heatmap';
import { useHeatmap } from '@/customHooks/useHeatmap';

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

describe('Heatmap Component', () => {
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
  });

  it('should render heatmap with correct title', () => {
    render(<Heatmap />);

    // Le composant utilise formatDuration pour afficher le titre
    expect(screen.getByText(/de pratique en 2024/)).toBeInTheDocument();
  });

  it('should show loading state correctly', () => {
    mockUseHeatmap.mockReturnValue({
      ...defaultMockData,
      loading: true,
      totalContributions: 0,
    });

    render(<Heatmap />);

    expect(screen.getByText('Chargement des données...')).toBeInTheDocument();
    expect(screen.getByTestId('spinner')).toBeInTheDocument();
  });

  it('should render year selector with correct options', () => {
    render(<Heatmap />);

    const yearSelect = screen.getByRole('combobox');
    expect(yearSelect).toBeInTheDocument();
    expect(yearSelect).toHaveValue('2024');

    expect(screen.getByText('2023')).toBeInTheDocument();
    expect(screen.getByText('2024')).toBeInTheDocument();
    expect(screen.getByText('2025')).toBeInTheDocument();
  });

  it('should render color theme buttons', () => {
    render(<Heatmap />);

    expect(screen.getByText('Bleu')).toBeInTheDocument();
    expect(screen.getByText('Orange')).toBeInTheDocument();
  });

  it('should handle year selection', () => {
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

  it('should handle color theme change', () => {
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

  it('should render month labels correctly', () => {
    render(<Heatmap />);

    expect(screen.getByText('Jan')).toBeInTheDocument();
    expect(screen.getByText('Fév')).toBeInTheDocument();
    expect(screen.getByText('Mar')).toBeInTheDocument();
  });

  it('should render grid cells', () => {
    render(<Heatmap />);

    // Vérifier que les cellules de la grille sont rendues
    const cells = screen.getAllByTestId('tippy');
    expect(cells.length).toBeGreaterThan(0);

    // Vérifier qu'il y a des cellules (au moins quelques-unes)
    expect(cells.length).toBeGreaterThan(50); // Au moins 50 cellules
  });

  it('should handle cell click when not loading', async () => {
    const mockHandleCellClick = vi.fn();
    mockUseHeatmap.mockReturnValue({
      ...defaultMockData,
      loading: false,
      handleCellClick: mockHandleCellClick,
    });

    render(<Heatmap />);

    // Simuler un clic sur une cellule avec des données
    const cells = screen.getAllByTestId('tippy');
    if (cells.length > 0) {
      // Cliquer sur le div à l'intérieur du Tippy (qui a le onClick)
      const cellDiv = cells[0].querySelector('div');
      if (cellDiv) {
        fireEvent.click(cellDiv);
        await waitFor(() => {
          expect(mockHandleCellClick).toHaveBeenCalled();
        });
      }
    }
  });

  it('should not handle cell click when loading', () => {
    const mockHandleCellClick = vi.fn();
    mockUseHeatmap.mockReturnValue({
      ...defaultMockData,
      loading: true,
      handleCellClick: mockHandleCellClick,
    });

    render(<Heatmap />);

    const cells = screen.getAllByTestId('tippy');
    if (cells.length > 0) {
      // Cliquer sur le div à l'intérieur du Tippy
      const cellDiv = cells[0].querySelector('div');
      if (cellDiv) {
        fireEvent.click(cellDiv);
        expect(mockHandleCellClick).not.toHaveBeenCalled();
      }
    }
  });

  it('should render sessions section when date is selected', () => {
    const mockSessions = [
      {
        id: '1',
        songTitle: 'Test Song',
        songComposer: 'Test Composer',
        correctNotes: 10,
        missedNotes: 2,
        wrongNotes: 1,
        totalPoints: 100,
        maxMultiplier: 2,
        maxCombo: 5,
        sessionStartTime: new Date('2024-01-15T10:00:00'),
        sessionEndTime: new Date('2024-01-15T10:30:00'),
        modeName: 'Apprentissage',
        durationInMinutes: 30,
        accuracy: 85,
        performance: 90,
      },
    ];

    mockUseHeatmap.mockReturnValue({
      ...defaultMockData,
      selectedDate: '2024-01-15',
      sessions: mockSessions,
      isExpanded: true,
    });

    render(<Heatmap />);

    expect(
      screen.getByText('Sessions du lundi 15 janvier 2024')
    ).toBeInTheDocument();
    expect(screen.getByText('Test Song')).toBeInTheDocument();
    expect(screen.getByText('Fermer')).toBeInTheDocument();
  });

  it('should handle close sessions button', () => {
    const mockCloseSessions = vi.fn();
    mockUseHeatmap.mockReturnValue({
      ...defaultMockData,
      selectedDate: '2024-01-15',
      sessions: [],
      closeSessions: mockCloseSessions,
    });

    render(<Heatmap />);

    const closeButton = screen.getByText('Fermer');
    fireEvent.click(closeButton);

    expect(mockCloseSessions).toHaveBeenCalled();
  });

  it('should show no sessions message when no sessions found', () => {
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

  it('should show sessions loading spinner', () => {
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

  it('should inject animation styles on mount', () => {
    render(<Heatmap />);

    // Vérifier que les styles d'animation sont injectés
    const styleElements = document.querySelectorAll('style');
    expect(styleElements.length).toBeGreaterThan(0);
  });
});
