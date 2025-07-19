import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  getPlayedSongsAction,
  getAllPlayedSongsAction,
  PlayedSongsResult,
} from '@/lib/actions/playedSongs-actions';
import {
  PerformancesServices,
  PlayedSong,
} from '@/lib/services/performances-services';
import { SourceType, SongType } from '@prisma/client';

// Mock next-auth
vi.mock('next-auth', () => ({
  getServerSession: vi.fn(),
}));

// Mock le service
vi.mock('@/lib/services/performances-services', () => ({
  PerformancesServices: {
    getPlayedSongs: vi.fn(),
  },
}));

// Mock authOptions
vi.mock('@/lib/authoption', () => ({
  authOptions: {},
}));

const { getServerSession } = await import('next-auth');
const mockGetServerSession = vi.mocked(getServerSession);
const mockPerformancesServices = vi.mocked(PerformancesServices);

describe('PlayedSongs Actions', () => {
  const mockUser = { id: 'user123' };
  const mockSession = { user: mockUser };

  const mockPlayedSong: PlayedSong = {
    id: 'song1',
    title: 'Test Song',
    composer: 'Test Composer',
    genre: 'Classical',
    tempo: 120,
    duration_ms: 180000,
    timeSignature: '4/4',
    SourceType: SourceType.library,
    notes: [],
    Level: 1,
    imageUrl: 'https://example.com/image.jpg',
    SongType: SongType.song,
    isFavorite: false,
    lastPlayed: '2024-01-15T10:00:00.000Z',
  };

  beforeEach(() => {
    vi.clearAllMocks();
    mockGetServerSession.mockResolvedValue(mockSession);
  });

  describe('getPlayedSongsAction', () => {
    const createMockResult = (
      songs: PlayedSong[] = [mockPlayedSong],
      page: number = 1,
      totalPages: number = 1,
      totalSongs: number = 1
    ) => ({
      songs,
      pagination: {
        currentPage: page,
        totalPages,
        totalSongs,
        hasNextPage: page < totalPages,
        hasPreviousPage: page > 1,
      },
    });

    it('devrait retourner des chansons avec pagination par défaut', async () => {
      const mockResult = createMockResult();
      mockPerformancesServices.getPlayedSongs.mockResolvedValue(mockResult);

      const result = await getPlayedSongsAction();

      expect(result.songs).toEqual([mockPlayedSong]);
      expect(result.pagination).toEqual({
        currentPage: 1,
        totalPages: 1,
        totalSongs: 1,
        hasNextPage: false,
        hasPreviousPage: false,
      });

      expect(mockPerformancesServices.getPlayedSongs).toHaveBeenCalledWith(
        'user123',
        {
          page: 1,
          limit: 20,
        },
        {
          searchQuery: undefined,
          genreFilter: undefined,
          favoritesOnly: undefined,
          sortBy: undefined,
          sortOrder: undefined,
        }
      );
    });

    it('devrait gérer tous les paramètres de filtrage et tri', async () => {
      const mockResult = createMockResult([mockPlayedSong], 2, 1, 5);
      mockPerformancesServices.getPlayedSongs.mockResolvedValue(mockResult);

      const result = await getPlayedSongsAction(
        2,
        'beethoven',
        'Classical',
        true,
        'title',
        'asc'
      );

      expect(result.songs).toEqual([mockPlayedSong]);
      expect(result.pagination).toEqual({
        currentPage: 2,
        totalPages: 1,
        totalSongs: 5,
        hasNextPage: false,
        hasPreviousPage: true,
      });

      expect(mockPerformancesServices.getPlayedSongs).toHaveBeenCalledWith(
        'user123',
        {
          page: 2,
          limit: 20,
        },
        {
          searchQuery: 'beethoven',
          genreFilter: 'Classical',
          favoritesOnly: true,
          sortBy: 'title',
          sortOrder: 'asc',
        }
      );
    });

    it('devrait calculer correctement la pagination avec plusieurs pages', async () => {
      const mockSongs = Array(20)
        .fill(null)
        .map((_, i) => ({
          ...mockPlayedSong,
          id: `song${i + 1}`,
        }));
      const mockResult = createMockResult(mockSongs, 2, 3, 45);
      mockPerformancesServices.getPlayedSongs.mockResolvedValue(mockResult);

      const result = await getPlayedSongsAction(2);

      expect(result.pagination).toEqual({
        currentPage: 2,
        totalPages: 3,
        totalSongs: 45,
        hasNextPage: true,
        hasPreviousPage: true,
      });
    });

    it('devrait gérer le cas de la première page', async () => {
      const mockSongs = Array(20)
        .fill(null)
        .map((_, i) => ({
          ...mockPlayedSong,
          id: `song${i + 1}`,
        }));
      const mockResult = createMockResult(mockSongs, 1, 2, 25);
      mockPerformancesServices.getPlayedSongs.mockResolvedValue(mockResult);

      const result = await getPlayedSongsAction(1);

      expect(result.pagination).toEqual({
        currentPage: 1,
        totalPages: 2,
        totalSongs: 25,
        hasNextPage: true,
        hasPreviousPage: false,
      });
    });

    it('devrait gérer le cas de la dernière page', async () => {
      const mockSongs = Array(5)
        .fill(null)
        .map((_, i) => ({
          ...mockPlayedSong,
          id: `song${i + 1}`,
        }));
      const mockResult = createMockResult(mockSongs, 2, 2, 25);
      mockPerformancesServices.getPlayedSongs.mockResolvedValue(mockResult);

      const result = await getPlayedSongsAction(2);

      expect(result.pagination).toEqual({
        currentPage: 2,
        totalPages: 2,
        totalSongs: 25,
        hasNextPage: false,
        hasPreviousPage: true,
      });
    });

    it('devrait gérer les différents types de tri', async () => {
      const sortOptions: Array<{
        sortBy:
          | 'title'
          | 'composer'
          | 'lastPlayed'
          | 'genre'
          | 'duration'
          | 'difficulty';
        sortOrder: 'asc' | 'desc';
      }> = [
        { sortBy: 'title', sortOrder: 'asc' },
        { sortBy: 'composer', sortOrder: 'desc' },
        { sortBy: 'lastPlayed', sortOrder: 'asc' },
        { sortBy: 'genre', sortOrder: 'desc' },
        { sortBy: 'duration', sortOrder: 'asc' },
        { sortBy: 'difficulty', sortOrder: 'desc' },
      ];

      for (const { sortBy, sortOrder } of sortOptions) {
        mockPerformancesServices.getPlayedSongs.mockClear();
        const mockResult = createMockResult();
        mockPerformancesServices.getPlayedSongs.mockResolvedValue(mockResult);

        await getPlayedSongsAction(
          1,
          undefined,
          undefined,
          undefined,
          sortBy,
          sortOrder
        );

        expect(mockPerformancesServices.getPlayedSongs).toHaveBeenCalledWith(
          'user123',
          {
            page: 1,
            limit: 20,
          },
          {
            searchQuery: undefined,
            genreFilter: undefined,
            favoritesOnly: undefined,
            sortBy,
            sortOrder,
          }
        );
      }
    });

    it('devrait filtrer par favoris correctement', async () => {
      const favoriteSong = { ...mockPlayedSong, isFavorite: true };
      const mockResult = createMockResult([favoriteSong]);
      mockPerformancesServices.getPlayedSongs.mockResolvedValue(mockResult);

      await getPlayedSongsAction(1, undefined, undefined, true);

      expect(mockPerformancesServices.getPlayedSongs).toHaveBeenCalledWith(
        'user123',
        {
          page: 1,
          limit: 20,
        },
        {
          searchQuery: undefined,
          genreFilter: undefined,
          favoritesOnly: true,
          sortBy: undefined,
          sortOrder: undefined,
        }
      );
    });

    it('devrait filtrer par genre correctement', async () => {
      const jazzSong = { ...mockPlayedSong, genre: 'Jazz' };
      const mockResult = createMockResult([jazzSong]);
      mockPerformancesServices.getPlayedSongs.mockResolvedValue(mockResult);

      await getPlayedSongsAction(1, undefined, 'Jazz');

      expect(mockPerformancesServices.getPlayedSongs).toHaveBeenCalledWith(
        'user123',
        {
          page: 1,
          limit: 20,
        },
        {
          searchQuery: undefined,
          genreFilter: 'Jazz',
          favoritesOnly: undefined,
          sortBy: undefined,
          sortOrder: undefined,
        }
      );
    });

    it('devrait filtrer par recherche textuelle correctement', async () => {
      const mockResult = createMockResult();
      mockPerformancesServices.getPlayedSongs.mockResolvedValue(mockResult);

      await getPlayedSongsAction(1, 'beethoven');

      expect(mockPerformancesServices.getPlayedSongs).toHaveBeenCalledWith(
        'user123',
        {
          page: 1,
          limit: 20,
        },
        {
          searchQuery: 'beethoven',
          genreFilter: undefined,
          favoritesOnly: undefined,
          sortBy: undefined,
          sortOrder: undefined,
        }
      );
    });

    it('devrait retourner un résultat vide quand aucune chanson trouvée', async () => {
      const mockResult = createMockResult([], 1, 0, 0);
      mockPerformancesServices.getPlayedSongs.mockResolvedValue(mockResult);

      const result = await getPlayedSongsAction();

      expect(result.songs).toEqual([]);
      expect(result.pagination).toEqual({
        currentPage: 1,
        totalPages: 0,
        totalSongs: 0,
        hasNextPage: false,
        hasPreviousPage: false,
      });
    });

    it('devrait propager les erreurs du service', async () => {
      const mockError = new Error('Database error');
      mockPerformancesServices.getPlayedSongs.mockRejectedValue(mockError);

      await expect(getPlayedSongsAction()).rejects.toThrow(
        'Impossible de récupérer les chansons jouées'
      );
    });

    it('devrait rejeter si aucune session utilisateur', async () => {
      mockGetServerSession.mockResolvedValue(null);

      await expect(getPlayedSongsAction()).rejects.toThrow(
        'Impossible de récupérer les chansons jouées'
      );
    });
  });

  describe('getAllPlayedSongsAction', () => {
    it('devrait retourner toutes les chansons jouées sans pagination', async () => {
      const mockSongs = [mockPlayedSong];
      const mockResult = {
        songs: mockSongs,
        pagination: {
          currentPage: 1,
          totalPages: 1,
          totalSongs: 1,
          hasNextPage: false,
          hasPreviousPage: false,
        },
      };
      mockPerformancesServices.getPlayedSongs.mockResolvedValue(mockResult);

      const result = await getAllPlayedSongsAction();

      expect(result).toEqual(mockSongs);
      expect(mockPerformancesServices.getPlayedSongs).toHaveBeenCalledWith(
        'user123',
        {
          page: 1,
          limit: 999999,
        }
      );
    });

    it('devrait propager les erreurs du service', async () => {
      const mockError = new Error('Service error');
      mockPerformancesServices.getPlayedSongs.mockRejectedValue(mockError);

      await expect(getAllPlayedSongsAction()).rejects.toThrow(
        'Impossible de récupérer les chansons jouées'
      );
    });

    it('devrait rejeter si aucune session utilisateur', async () => {
      mockGetServerSession.mockResolvedValue(null);

      await expect(getAllPlayedSongsAction()).rejects.toThrow(
        'Impossible de récupérer les chansons jouées'
      );
    });
  });

  describe('Types et validation', () => {
    it('devrait respecter le type PlayedSong', async () => {
      const mockResult = {
        songs: [mockPlayedSong],
        pagination: {
          currentPage: 1,
          totalPages: 1,
          totalSongs: 1,
          hasNextPage: false,
          hasPreviousPage: false,
        },
      };
      mockPerformancesServices.getPlayedSongs.mockResolvedValue(mockResult);

      const result = await getPlayedSongsAction();
      const song = result.songs[0];

      // Vérifier les types des propriétés
      expect(typeof song.id).toBe('string');
      expect(typeof song.title).toBe('string');
      expect(typeof song.composer).toBe('string');
      expect(typeof song.Level).toBe('number');
      expect(typeof song.SongType).toBe('string');
      expect(typeof song.duration_ms).toBe('number');
      expect(typeof song.tempo).toBe('number');
      expect(typeof song.isFavorite).toBe('boolean');
      expect(typeof song.lastPlayed).toBe('string');
    });

    it('devrait respecter le type PlayedSongsResult', async () => {
      const mockResult = {
        songs: [mockPlayedSong],
        pagination: {
          currentPage: 1,
          totalPages: 1,
          totalSongs: 1,
          hasNextPage: false,
          hasPreviousPage: false,
        },
      };
      mockPerformancesServices.getPlayedSongs.mockResolvedValue(mockResult);

      const result = await getPlayedSongsAction();

      // Vérifier la structure du résultat
      expect(Array.isArray(result.songs)).toBe(true);
      expect(typeof result.pagination).toBe('object');
      expect(typeof result.pagination.currentPage).toBe('number');
      expect(typeof result.pagination.totalPages).toBe('number');
      expect(typeof result.pagination.totalSongs).toBe('number');
      expect(typeof result.pagination.hasNextPage).toBe('boolean');
      expect(typeof result.pagination.hasPreviousPage).toBe('boolean');
    });
  });

  describe('Cas limites et edge cases', () => {
    it('devrait gérer les pages très élevées', async () => {
      const mockResult = {
        songs: [mockPlayedSong],
        pagination: {
          currentPage: 999,
          totalPages: 1,
          totalSongs: 1,
          hasNextPage: false,
          hasPreviousPage: true,
        },
      };
      mockPerformancesServices.getPlayedSongs.mockResolvedValue(mockResult);

      const result = await getPlayedSongsAction(999);

      expect(result.pagination.currentPage).toBe(999);
      expect(result.pagination.totalPages).toBe(1);
      expect(result.pagination.hasNextPage).toBe(false);
    });

    it('devrait gérer les chaînes de recherche vides', async () => {
      const mockResult = {
        songs: [mockPlayedSong],
        pagination: {
          currentPage: 1,
          totalPages: 1,
          totalSongs: 1,
          hasNextPage: false,
          hasPreviousPage: false,
        },
      };
      mockPerformancesServices.getPlayedSongs.mockResolvedValue(mockResult);

      await getPlayedSongsAction(1, '');

      expect(mockPerformancesServices.getPlayedSongs).toHaveBeenCalledWith(
        'user123',
        {
          page: 1,
          limit: 20,
        },
        {
          searchQuery: '',
          genreFilter: undefined,
          favoritesOnly: undefined,
          sortBy: undefined,
          sortOrder: undefined,
        }
      );
    });

    it('devrait gérer les caractères spéciaux dans la recherche', async () => {
      const specialChars = '!@#$%^&*()[]{}|;\':",./<>?';
      const mockResult = {
        songs: [],
        pagination: {
          currentPage: 1,
          totalPages: 0,
          totalSongs: 0,
          hasNextPage: false,
          hasPreviousPage: false,
        },
      };
      mockPerformancesServices.getPlayedSongs.mockResolvedValue(mockResult);

      await getPlayedSongsAction(1, specialChars);

      expect(mockPerformancesServices.getPlayedSongs).toHaveBeenCalledWith(
        'user123',
        {
          page: 1,
          limit: 20,
        },
        {
          searchQuery: specialChars,
          genreFilter: undefined,
          favoritesOnly: undefined,
          sortBy: undefined,
          sortOrder: undefined,
        }
      );
    });

    it('devrait gérer les très longues chaînes de recherche', async () => {
      const longSearch = 'a'.repeat(1000);
      const mockResult = {
        songs: [],
        pagination: {
          currentPage: 1,
          totalPages: 0,
          totalSongs: 0,
          hasNextPage: false,
          hasPreviousPage: false,
        },
      };
      mockPerformancesServices.getPlayedSongs.mockResolvedValue(mockResult);

      await getPlayedSongsAction(1, longSearch);

      expect(mockPerformancesServices.getPlayedSongs).toHaveBeenCalledWith(
        'user123',
        {
          page: 1,
          limit: 20,
        },
        {
          searchQuery: longSearch,
          genreFilter: undefined,
          favoritesOnly: undefined,
          sortBy: undefined,
          sortOrder: undefined,
        }
      );
    });
  });
});
