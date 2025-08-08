# Documentation - Nouvelles Fonctionnalités SongPerformances (PR #35)

## Vue d'ensemble

La PR #35 introduit un système complet d'analyse de performances individuelles par chanson dans l'application VirtuoPiano. Cette fonctionnalité majeure permet aux utilisateurs de consulter des statistiques détaillées, des graphiques avancés et des analyses temporelles pour chaque chanson qu'ils ont jouée, avec une séparation claire entre les modes d'apprentissage et de jeu.

## Architecture Générale

### Composants Principaux

#### Page principale

- `src/features/performances/SongPerformances.tsx` - Interface principale avec onglets apprentissage/jeu et gestion des favoris

#### Composants spécialisés (nouveaux)

- `src/features/performances/components/GeneralTiles.tsx` - Tuiles de statistiques générales (streak, score moyen, sessions)
- `src/features/performances/components/LearningTiles.tsx` - Tuiles spécifiques au mode apprentissage
- `src/features/performances/components/GamingTiles.tsx` - Tuiles spécifiques au mode jeu
- `src/features/performances/components/PracticeGraph.tsx` - Graphique de navigation temporelle des sessions de pratique
- `src/features/performances/components/PrecisionChart.tsx` - Graphique en ligne de l'évolution de la précision
- `src/features/performances/components/PerformanceChart.tsx` - Graphique en ligne de l'évolution des performances
- `src/features/performances/components/PerformancePrecisionBarChart.tsx` - Graphique en barres comparant précision et performance
- `src/features/performances/components/GamingLineChart.tsx` - Graphique en ligne pour les données de jeu
- `src/features/performances/components/GamingBarChart.tsx` - Graphique en barres pour les données de jeu
- `src/features/performances/components/LearningTimeline.tsx` - Timeline des records en mode apprentissage
- `src/features/performances/components/GamingTimeline.tsx` - Timeline des records en mode jeu
- `src/features/performances/components/RecentSessionsByMode.tsx` - Liste des sessions récentes par mode

#### Services et actions

- `src/lib/actions/songPerformances-actions.ts` - Actions serveur pour toutes les données de performance par chanson
- `src/lib/services/performances-services.ts` - Services étendus avec nouvelles méthodes de calcul
- `src/customHooks/useSongPerformances.ts` - Hooks React Query pour la gestion des données et du cache

#### Utilitaires

- `src/features/performances/utils/chartUtils.tsx` - Utilitaires partagés pour les graphiques

## Fonctionnalités Complexes

### 1. Système d'Onglets Dynamiques

#### Architecture des onglets

- **Mode Apprentissage** : Analyse détaillée des sessions d'entraînement avec focus sur la progression
- **Mode Jeu** : Analyse des performances en mode compétition avec scores et combos

#### Navigation fluide

- Animations de transition entre onglets
- État persistant des données lors du changement d'onglet
- Chargement intelligent des données par mode

### 2. Système de Cache Intelligent avec React Query

#### Gestion du cache multi-niveaux

```typescript
// Cache par chanson et paramètres
queryKey: ['songPracticeData', songId, interval, index];
queryKey: ['songLearningPrecisionData', songId, interval, index];
queryKey: ['songPerformanceGeneralTiles', songId];
```

#### Préchargement anticipé

- Préchargement des intervalles adjacents pour navigation fluide
- Cache des données de tuiles pour affichage instantané
- Gestion intelligente de l'invalidation du cache

#### Optimisations

- `staleTime` configuré par type de données (2-5 minutes)
- `placeholderData` pour éviter les états de chargement
- Invalidation sélective par type de données

### 3. Navigation Temporelle Avancée

#### Système d'intervalles configurables

- **Intervalles disponibles** : 7, 15, 30, 90 jours
- **Navigation bidirectionnelle** : Données plus récentes/anciennes
- **Persistence d'état** : Mémorisation de l'intervalle sélectionné

#### Calcul intelligent des plages de dates

```typescript
// Calcul des intervalles avec index
const startDate = new Date(
  today.getTime() - interval * (index + 1) * 24 * 60 * 60 * 1000
);
const endDate = new Date(
  today.getTime() - interval * index * 24 * 60 * 60 * 1000
);
```

### 4. Système de Métriques Avancées

#### Calculs de streak

- Streak actuel par mode de jeu
- Streak le plus long historique
- Gestion des interruptions de séquence

#### Moyennes intelligentes

- Moyennes pondérées par durée de session
- Séparation main droite/gauche/deux mains
- Exclusion automatique des valeurs aberrantes

#### Analyse temporelle

- Comparaisons période actuelle vs précédente
- Tendances d'évolution (progression/régression)
- Détection des records personnels

### 5. Gestion des Données Multi-Mains

#### Séparation des métriques

- **Main droite uniquement** : Précision et performance isolées
- **Main gauche uniquement** : Analyse spécialisée
- **Deux mains** : Coordination et synchronisation

#### Algorithme de détection d'activité

```typescript
function hasHandActivity(
  hand: string,
  rightHand: boolean,
  leftHand: boolean
): boolean {
  if (hand === 'right') return rightHand;
  if (hand === 'left') return leftHand;
  if (hand === 'both') return rightHand && leftHand;
  return false;
}
```

## Nouveaux Services et Méthodes

### Services étendus (`performances-services.ts`)

#### Nouvelles méthodes principales

1. **`getSongPerformanceGeneralTilesData`** - Statistiques générales par chanson
2. **`getSongLearningModeTilesData`** - Métriques spécifiques apprentissage
3. **`getSongPlayModeTilesData`** - Métriques spécifiques jeu
4. **`getSongPracticeData`** - Données de pratique avec navigation temporelle
5. **`getSongLearningPrecisionData`** - Évolution précision mode apprentissage
6. **`getSongLearningPerformanceData`** - Évolution performance mode apprentissage
7. **`getSongPerformancePrecisionBarChartData`** - Données graphique barres précision/performance
8. **`getSongGamingLineChartData`** - Données graphique ligne mode jeu
9. **`getSongGamingBarChartData`** - Données graphique barres mode jeu
10. **`getSongTimelineRecordsData`** - Timeline des records par mode

#### Méthodes utilitaires privées

- **`calculateCurrentStreak`** - Calcul du streak actuel
- **`calculateLongestStreak`** - Calcul du streak le plus long
- **`getSessionsInDateRange`** - Filtrage par plage de dates
- **`calculateAverageMetrics`** - Moyennes pondérées

## Types de Données

### Nouvelles interfaces TypeScript

```typescript
interface SongPerformanceGeneralTiles {
  currentStreak: number;
  longestStreak: number;
  averageScore: number;
  totalSessions: number;
  totalPlayTime: number;
  longestSession: number;
}

interface SongPracticeData {
  data: PracticeDataPoint[];
  totalPratique: number;
  totalModeApprentissage: number;
  totalModeJeu: number;
}

interface PrecisionDataPoint {
  date: string;
  precisionRightHand: number | null;
  precisionLeftHand: number | null;
  precisionBothHands: number | null;
}
```

## Gestion des Favoris

### Intégration temps réel

- **Action optimiste** : Mise à jour immédiate de l'UI
- **Rollback automatique** : Restauration en cas d'erreur
- **Notifications toast** : Feedback utilisateur instantané
- **Synchronisation** : Persistance côté serveur

## Nouveaux Fichiers de Tests

### Tests Unitaires

#### `tests/unit/useSongPerformances.test.ts`

**Objectif** : Tester tous les hooks React Query personnalisés pour SongPerformances

- **Tests hooks de données** : `useSongPerformanceGeneralTiles`, `useSongLearningModeTiles`, `useSongPlayModeTiles`
- **Tests hooks de graphiques** : `useSongPracticeData`, `useSongLearningPrecisionData`, `useSongLearningPerformanceData`
- **Tests hooks de cache** : `useInvalidatePracticeCache`, `usePrefetchAdjacentData`
- **Tests hooks gaming** : `useSongGamingLineChartData`, `useSongGamingBarChartData`
- **Tests timeline** : `useSongTimelineRecordsData`

#### `tests/unit/songPerformances-actions.test.ts`

**Objectif** : Tester toutes les actions serveur pour SongPerformances

- **Tests actions tuiles** : `getSongPerformanceGeneralTilesAction`, `getSongLearningModeTilesAction`, `getSongPlayModeTilesAction`
- **Tests actions graphiques** : `getSongPracticeDataAction`, `getSongLearningPrecisionDataAction`, `getSongLearningPerformanceDataAction`
- **Tests actions barres/lignes** : `getSongPerformancePrecisionBarChartDataAction`, `getSongGamingLineChartDataAction`, `getSongGamingBarChartDataAction`
- **Tests timeline** : `getSongTimelineRecordsDataAction`
- **Tests gestion erreurs** : Authentification, validation, erreurs réseau

#### `tests/unit/songPerformances-services.test.ts`

**Objectif** : Tester la logique métier complexe des services SongPerformances

- **Tests méthodes tuiles** : Calculs de streak, moyennes, totaux
- **Tests méthodes graphiques** : Génération de données temporelles, formatage
- **Tests calculs avancés** : Précision par main, performances pondérées
- **Tests plages de dates** : Navigation temporelle, intervalles
- **Tests cas limites** : Données vides, sessions invalides, erreurs Prisma

### Tests de Composants

#### `tests/components/SongPerformances.test.tsx`

**Objectif** : Tester le composant principal SongPerformances

- **Tests rendu initial** : Affichage titre, compositeur, durée, difficulté
- **Tests navigation onglets** : Basculement apprentissage/jeu, contenu dynamique
- **Tests gestion favoris** : Bouton favori, états optimistes, gestion erreurs
- **Tests intégration** : Hooks de données, affichage conditionnel
- **Tests interactions** : Navigation retour, liens externes

### Tests d'Intégration

#### `tests/integration/songPerformances-integration.test.tsx`

**Objectif** : Tester l'intégration complète du système SongPerformances

- **Tests flux complets** : Chargement données → Affichage → Interactions
- **Tests cache React Query** : Préchargement, invalidation, persistance
- **Tests navigation temporelle** : Changement d'intervalle, navigation bidirectionnelle
- **Tests gestion d'état** : Synchronisation entre composants, état global
- **Tests performance** : Temps de chargement, optimisations

#### `tests/integration/react-query-integration.test.tsx`

**Objectif** : Tester spécifiquement l'intégration React Query

- **Tests configuration cache** : Stratégies de cache, invalidation
- **Tests préchargement** : Anticipation des données, performance
- **Tests erreurs réseau** : Retry automatique, fallbacks
- **Tests synchronisation** : Cohérence entre hooks, état partagé

#### `tests/integration/chart-navigation-integration.test.tsx`

**Objectif** : Tester la navigation et interaction des graphiques

- **Tests navigation temporelle** : Boutons précédent/suivant, intervalle
- **Tests affichage données** : Formatage, légendes, tooltips
- **Tests responsive** : Adaptation mobile, redimensionnement
- **Tests performance** : Rendu fluide, animations

## Détail des Tests

### Tests Unitaires

#### `useSongPerformances.test.ts` - Hooks React Query SongPerformances

- **useSongPerformanceGeneralTiles** : Test hook tuiles générales
- **useSongLearningModeTiles** : Test hook tuiles apprentissage
- **useSongPlayModeTiles** : Test hook tuiles jeu
- **useSongPracticeData** : Test hook données pratique avec navigation
- **useSongLearningPrecisionData** : Test hook données précision apprentissage
- **useSongLearningPerformanceData** : Test hook données performance apprentissage
- **useSongPerformancePrecisionBarChartData** : Test hook graphique barres précision/performance
- **useSongGamingLineChartData** : Test hook graphique ligne mode jeu
- **useSongGamingBarChartData** : Test hook graphique barres mode jeu
- **useSongTimelineRecordsData** : Test hook timeline des records
- **useInvalidatePracticeCache - invalidateCache** : Test invalidation cache complète
- **useInvalidatePracticeCache - invalidatePracticeDataOnly** : Test invalidation données pratique
- **useInvalidatePracticeCache - invalidatePrecisionDataOnly** : Test invalidation données précision
- **useInvalidatePracticeCache - invalidatePerformanceDataOnly** : Test invalidation données performance
- **usePrefetchAdjacentData** : Test préchargement données adjacentes
- **usePrefetchLearningPrecisionData** : Test préchargement précision apprentissage
- **usePrefetchLearningPerformanceData** : Test préchargement performance apprentissage

#### `songPerformances-actions.test.ts` - Actions Serveur SongPerformances

- **getSongPerformanceGeneralTilesAction - devrait retourner les tuiles générales** : Test récupération tuiles générales
- **getSongPerformanceGeneralTilesAction - devrait gérer les erreurs** : Test gestion erreurs tuiles générales
- **getSongLearningModeTilesAction - devrait retourner les tuiles d'apprentissage** : Test récupération tuiles apprentissage
- **getSongLearningModeTilesAction - devrait gérer les erreurs** : Test gestion erreurs tuiles apprentissage
- **getSongPlayModeTilesAction - devrait retourner les tuiles de jeu** : Test récupération tuiles jeu
- **getSongPlayModeTilesAction - devrait gérer les erreurs** : Test gestion erreurs tuiles jeu
- **getSongPracticeDataAction - devrait retourner les données de pratique** : Test récupération données pratique
- **getSongPracticeDataAction - devrait gérer les erreurs** : Test gestion erreurs données pratique
- **getSongLearningPrecisionDataAction - devrait retourner les données de précision** : Test récupération données précision
- **getSongLearningPrecisionDataAction - devrait gérer les erreurs** : Test gestion erreurs données précision
- **getSongTimelineRecordsDataAction - devrait retourner les données timeline** : Test récupération timeline
- **getSongTimelineRecordsDataAction - devrait gérer les erreurs** : Test gestion erreurs timeline

#### `songPerformances-services.test.ts` - Services SongPerformances

- **getSongPerformanceGeneralTilesData - devrait retourner les données générales pour une chanson** : Test calculs tuiles générales
- **getSongPerformanceGeneralTilesData - devrait gérer le cas où aucune session de jeu existe** : Test cas sans données
- **getSongLearningModeTilesData - devrait retourner les données d'apprentissage pour une chanson** : Test calculs tuiles apprentissage
- **getSongLearningModeTilesData - devrait retourner des valeurs par défaut si aucune session** : Test valeurs par défaut
- **getSongPlayModeTilesData - devrait retourner les données de jeu pour une chanson** : Test calculs tuiles jeu
- **getSongPracticeData - devrait retourner les données de pratique avec navigation** : Test données pratique temporelles
- **getSongLearningPrecisionData - devrait retourner les données de précision d'apprentissage** : Test données précision
- **getSongTimelineRecordsData - devrait retourner les records timeline pour le mode apprentissage** : Test timeline apprentissage
- **getSongTimelineRecordsData - devrait retourner les records timeline pour le mode jeu** : Test timeline jeu

### Tests de Composants

#### `SongPerformances.test.tsx` - Composant Principal SongPerformances

- **devrait afficher les informations de base de la chanson** : Test affichage titre, compositeur, durée
- **devrait afficher le badge de difficulté** : Test affichage badge difficulté
- **devrait afficher l'icône de musique** : Test affichage icône musicale
- **devrait gérer le bouton favori** : Test interaction bouton favori
- **devrait basculer entre les onglets apprentissage et jeu** : Test navigation onglets
- **devrait afficher le contenu de l'onglet apprentissage par défaut** : Test contenu onglet apprentissage
- **devrait afficher le contenu de l'onglet jeu lors du basculement** : Test contenu onglet jeu
- **devrait naviguer vers la page des chansons jouées** : Test navigation retour

### Tests d'Intégration

#### `songPerformances-integration.test.tsx` - Intégration Complète SongPerformances

- **devrait charger et afficher les données de performance d'une chanson** : Test chargement données complètes
- **devrait gérer les erreurs de réseau** : Test gestion erreurs réseau
- **devrait gérer les données vides** : Test gestion absence de données
- **devrait permettre la navigation entre les onglets** : Test navigation onglets avec données
- **devrait gérer l'ajout/suppression des favoris** : Test gestion favoris temps réel
- **devrait précharger les données adjacentes** : Test préchargement intelligent
- **devrait invalider le cache lors de mises à jour** : Test invalidation cache
- **devrait afficher les états de chargement appropriés** : Test états de chargement

#### `react-query-integration.test.tsx` - Intégration React Query

- **devrait configurer correctement le cache React Query** : Test configuration cache
- **devrait gérer les stratégies de cache par type de données** : Test stratégies cache
- **devrait précharger les données adjacentes automatiquement** : Test préchargement automatique
- **devrait invalider sélectivement le cache** : Test invalidation sélective
- **devrait gérer les états d'erreur et de retry** : Test gestion erreurs et retry
- **devrait synchroniser l'état entre plusieurs hooks** : Test synchronisation hooks

#### `chart-navigation-integration.test.tsx` - Navigation Graphiques

- **devrait naviguer entre les périodes dans les graphiques** : Test navigation temporelle
- **devrait mettre à jour les données lors du changement d'intervalle** : Test changement intervalle
- **devrait afficher les états de chargement lors de la navigation** : Test états chargement navigation
- **devrait préserver l'état lors du changement d'onglet** : Test persistance état
- **devrait gérer les erreurs de navigation** : Test gestion erreurs navigation
- **devrait afficher les tooltips et légendes correctement** : Test affichage métadonnées graphiques

---
