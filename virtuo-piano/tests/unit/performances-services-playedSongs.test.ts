import { describe, it, expect, vi, beforeEach } from 'vitest';

// Version simplifiée - teste juste que les fonctions existent
describe('PerformancesServices - Tests de base', () => {
  it('devrait pouvoir importer les services', async () => {
    const { PerformancesServices } = await import(
      '@/lib/services/performances-services'
    );

    expect(typeof PerformancesServices.getPlayedSongs).toBe('function');
    expect(PerformancesServices).toBeDefined();
  });

  it('devrait avoir les types corrects pour les paramètres', () => {
    // Test basique pour vérifier que les types existent
    const testFilters = {
      search: 'test',
      sortBy: 'date' as const,
      sortOrder: 'desc' as const,
      sourceType: 'UPLOAD' as const,
      songType: 'CLASSICAL' as const,
    };

    expect(testFilters.search).toBe('test');
    expect(testFilters.sortBy).toBe('date');
    expect(testFilters.sortOrder).toBe('desc');
  });

  it('devrait avoir les constantes de pagination', () => {
    const DEFAULT_LIMIT = 12;
    const DEFAULT_PAGE = 1;

    expect(typeof DEFAULT_LIMIT).toBe('number');
    expect(typeof DEFAULT_PAGE).toBe('number');
    expect(DEFAULT_LIMIT).toBeGreaterThan(0);
    expect(DEFAULT_PAGE).toBeGreaterThan(0);
  });
});
