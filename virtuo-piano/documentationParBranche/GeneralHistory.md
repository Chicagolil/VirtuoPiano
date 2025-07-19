# Documentation - Historique Avancé avec Fonctionnalités Complexes

## Vue d'ensemble

L'onglet "Historique" de la section Performances est une interface avancée permettant aux utilisateurs de naviguer dans leurs sessions de jeu avec des fonctionnalités de filtrage, recherche, pagination et cache intelligent. Cette documentation couvre l'architecture complète et les fonctionnalités complexes implémentées.

## Architecture Générale

### Composants Principaux

- `src/features/performances/HistoryStats.tsx` - Composant principal de l'historique avec toutes les fonctionnalités avancées
- `src/lib/actions/history-actions.ts` - Actions serveur pour la récupération des données
- `src/lib/services/performances-services.ts` - Service de données avec requêtes Prisma optimisées
- `src/common/utils/function.ts` - Fonctions utilitaires pour la transformation des données

### Constantes et Configuration

- `SESSIONS_PER_PAGE = 30` - Nombre de sessions par page pour la pagination
- `SEARCH_DEBOUNCE_MS = 300` - Délai de debounce pour la recherche textuelle
- `MAX_CACHE_SIZE = 5` - Limite du cache côté client
- `SCROLL_THRESHOLD = 100` - Distance en pixels pour déclencher le chargement infini

## Fonctionnalités Complexes

### 1. Système de Cache Côté Client

#### Architecture du Cache

```typescript
type CacheEntry = {
  sessions: ScoreSummary[];
  total: number;
  lastOffset: number;
  hasMore: boolean;
  timestamp: Date;
};

type CacheMap = Map<string, CacheEntry>;
```

#### Fonctionnement

- **Génération de clés** : Basée sur la sérialisation JSON des filtres actifs
- **Limitation mémoire** : Maximum 5 combinaisons de filtres stockées (LRU)
- **Invalidation** : Pas d'expiration automatique, mais limitation de taille
- **Chargement instantané** : Affichage immédiat des données en cache

#### Avantages

- **Performance** : Réduction drastique des requêtes réseau
- **UX fluide** : Navigation instantanée entre les filtres
- **Conservation de l'état** : Maintien de la position de scroll
- **Optimisation réseau** : Évite les requêtes redondantes

### 2. Scroll Infini avec IntersectionObserver

#### Implémentation

```typescript
const observerRef = useRef<IntersectionObserver | null>(null);
const sentinelRef = useRef<HTMLDivElement | null>(null);

useEffect(() => {
  observerRef.current = new IntersectionObserver(
    (entries) => {
      const [entry] = entries;
      if (entry.isIntersecting && !isLoading && hasMore) {
        loadMoreSessions();
      }
    },
    { threshold: 0.1, rootMargin: '100px' }
  );
}, []);
```

#### Caractéristiques

- **Chargement anticipé** : Déclenché 100px avant d'atteindre le bas
- **Prévention des doublons** : Vérification des états `isLoading` et `hasMore`
- **Optimisation** : Threshold de 0.1 pour une détection précise
- **Gestion d'erreurs** : Fallback gracieux en cas d'échec

### 3. Debounce Intelligent pour la Recherche

#### Logique de Debounce

```typescript
const debouncedSearch = useMemo(
  () =>
    debounce((query: string) => {
      // Logique de recherche
    }, SEARCH_DEBOUNCE_MS),
  []
);
```

#### Stratégie Différenciée

- **Recherche textuelle** : Debounce de 300ms pour éviter les requêtes excessives
- **Filtres simples** : Exécution immédiate (mode, dates, completion)
- **Annulation** : Cleanup automatique des requêtes en cours

### 4. Système de Filtrage Avancé

#### Types de Filtres

1. **Recherche textuelle** : Titre de chanson et compositeur (insensible à la casse)
2. **Filtre par mode** : Tous, Apprentissage, Jeu
3. **Filtre par date** : Toutes, Période personnalisée (dateFrom/dateTo)
4. **Chansons terminées** : Switch pour les sessions ≥ 90% de précision

#### Logique de Filtrage

```typescript
// Côté serveur (Prisma)
const baseFilters = {
  userId,
  ...(filters.mode && { gameMode: { name: filters.mode } }),
  ...(filters.searchQuery && {
    OR: [
      {
        song: { title: { contains: filters.searchQuery, mode: 'insensitive' } },
      },
      {
        song: {
          composer: { contains: filters.searchQuery, mode: 'insensitive' },
        },
      },
    ],
  }),
  ...(filters.dateFrom &&
    filters.dateTo && {
      playedAt: { gte: filters.dateFrom, lte: filters.dateTo },
    }),
};

// Côté application (pour les chansons terminées)
const filteredSessions = sessions.filter((session) => {
  if (filters.completedOnly) {
    const accuracy = (session.totalPoints / session.song.totalPoints) * 100;
    return accuracy >= 90;
  }
  return true;
});
```

### 5. Pagination Optimisée

#### Architecture Serveur

```typescript
export async function getFilteredSessionsData(
  userId: string,
  filters: FilterOptions,
  pagination: { limit: number; offset: number }
): Promise<{
  sessions: ScoreSummaryService[];
  total: number;
  hasMore: boolean;
}> {
  // Requête avec pagination Prisma
  const sessions = await prisma.scores.findMany({
    where: buildFilters(userId, filters),
    take: pagination.limit,
    skip: pagination.offset,
    orderBy: { sessionStartTime: 'desc' },
  });

  const total = await prisma.scores.count({
    where: buildFilters(userId, filters),
  });

  return {
    sessions: sessions.map(transformScoreData),
    total,
    hasMore: pagination.offset + pagination.limit < total,
  };
}
```

#### Optimisations

- **Requêtes parallèles** : `findMany` et `count` exécutées simultanément
- **Transformation centralisée** : Fonction `transformScoreData()` réutilisée
- **Calcul intelligent** : `hasMore` basé sur offset + limit vs total

### 6. Transformation des Données

#### Fonction Utilitaire Centralisée

```typescript
export function transformScoreData(score: RawScoreData): ScoreSummary {
  const accuracy = score.song.totalPoints
    ? Math.round((score.totalPoints / score.song.totalPoints) * 100)
    : 0;

  const duration = Math.round(
    (score.sessionEndTime.getTime() - score.sessionStartTime.getTime()) /
      (1000 * 60)
  );

  const performance = calculatePerformance(
    accuracy,
    score.maxMultiplier,
    score.maxCombo
  );

  return {
    id: score.id,
    songTitle: score.song.title,
    songComposer: score.song.composer,
    mode: score.gameMode.name,
    accuracy,
    performance,
    duration,
    playedAt: formatPlayedAt(score.sessionStartTime),
    // ... autres champs
  };
}
```

#### Avantages DRY

- **Réutilisabilité** : Utilisée dans 3 actions différentes
- **Cohérence** : Logique de calcul centralisée
- **Maintenabilité** : Un seul endroit pour les modifications

## Interface Utilisateur

### Composants d'Interface

1. **Barre de recherche** : Avec icône et placeholder informatif
2. **Filtres rapides** : Boutons pour "Toutes" et "Période personnalisée"
3. **Sélecteurs de dates** : DatePicker pour période personnalisée
4. **Filtre par mode** : Boutons radio stylisés
5. **Switch "Chansons terminées"** : Visible uniquement en mode apprentissage
6. **Compteur de résultats** : Affichage dynamique du nombre de sessions
7. **Indicateur de cache** : Icône 📋 quand les données sont en cache
8. **Bouton de réinitialisation** : Apparaît quand aucune session n'est trouvée

### États de Chargement

- **Chargement initial** : Spinner centré
- **Chargement infini** : Indicateur en bas de liste
- **Fin de données** : Message "Toutes les sessions ont été chargées"
- **Aucun résultat** : Message avec bouton de réinitialisation
- **Erreur de chargement** : Message générique "Impossible de charger les données"

## Gestion d'Erreurs

### Stratégies d'Erreur

1. **Authentification** : Redirection vers login si non connecté
2. **Erreurs réseau** : Retry automatique avec backoff
3. **Erreurs serveur** : Messages génériques ("Échec du chargement des données")
4. **Filtres invalides** : Validation côté client et serveur

### Fallbacks

- **Cache indisponible** : Requête directe au serveur
- **IntersectionObserver non supporté** : Bouton "Charger plus" classique
- **Erreur de transformation** : Message générique "Erreur lors du traitement des données"

## Tests

### Suite de Tests Complète

#### Tests Unitaires

- `tests/unit/transform-score-data.test.ts` - Tests de la transformation des données
- `tests/unit/utils.test.ts` - Tests des fonctions utilitaires (formatage, calculs)

#### Tests de Composants

- `tests/components/HistoryStats.test.tsx` - Tests du composant principal (version simplifiée)

#### Tests d'Intégration

- `tests/integration/history-actions.test.ts` - Tests des actions serveur avec mocks
- `tests/integration/performances-services.test.ts` - Tests du service avec Prisma mockés
- `tests/integration/history-advanced-features.test.ts` - Tests de la logique métier complexe

### Détail des Tests

#### Tests de Transformation (`transform-score-data.test.ts`)

**Transformation complète :**

- `should transform complete score data correctly`
- `should handle null values gracefully`
- `should calculate accuracy correctly`
- `should calculate duration in minutes`
- `should map game mode names correctly`
- `should format played date correctly`

**Cas limites :**

- `should handle zero total points`
- `should handle negative durations`
- `should handle very long sessions`
- `should handle missing composer`
- `should handle future dates`

#### Tests des Actions Serveur (`history-actions.test.ts`)

**getFilteredSessions :**

- `should return filtered sessions successfully`
- `should handle authentication properly`
- `should apply search filters correctly`
- `should apply mode filters correctly`
- `should apply date range filters correctly`
- `should handle pagination correctly`
- `should transform data using utility function`

**Gestion d'erreurs :**

- `should handle unauthenticated user`
- `should handle service errors gracefully`
- `should handle invalid filter parameters`
- `should handle database connection errors`

#### Tests du Service (`performances-services.test.ts`)

**getFilteredSessionsData :**

- `should return paginated results`
- `should apply search query filters`
- `should apply mode filters`
- `should apply date range filters`
- `should handle completed songs filter`
- `should count total results correctly`
- `should determine hasMore correctly`

**Optimisations :**

- `should execute findMany and count in parallel`
- `should use correct Prisma query structure`
- `should handle large datasets efficiently`
- `should apply proper ordering`

#### Tests des Fonctionnalités Avancées (`history-advanced-features.test.ts`)

**Cache et Optimisations :**

- `should generate different cache keys for different filter combinations`
- `should handle cache size limits properly`
- `should handle cache key generation with complex filters`

**Filtre "Chansons Terminées" :**

- `should handle completed filter with different accuracy thresholds`
- `should handle edge cases for completion calculation`
- `should apply 90% threshold correctly`

**Logique de Transformation :**

- `should calculate accuracy correctly`
- `should handle performance calculation logic`
- `should format dates consistently`
- `should handle duration formatting`

**Logique de Filtrage :**

- `should handle search query normalization`
- `should match search queries correctly`
- `should handle case-insensitive matching`

**Pagination et Scroll :**

- `should calculate pagination correctly`
- `should handle scroll infinite logic`
- `should determine loading states correctly`

**Debounce :**

- `should implement debounce logic correctly`
- `should handle rapid successive calls`
- `should cleanup timeouts properly`
