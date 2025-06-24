### Composants Heatmap

#### Fichiers de constantes

- `src/common/constants/heatmaps.ts` - Constantes pour les couleurs, animations, années et dimensions
- `src/common/utils/function.ts` - Fonctions utilitaires centralisées (formatage, génération de données)

#### Styles extraits

- `src/components/ui/heatmap.styles.ts` - Styles pour le composant heatmap principal
- `src/components/ui/SessionCard.styles.ts` - Styles pour les cartes de session

#### Composants séparés

- `src/components/ui/heatmap.tsx` - Composant principal de la heatmap (UI uniquement)
- `src/components/ui/SessionCard.tsx` - Composant pour afficher les détails d'une session

#### Logique métier

- `src/customHooks/useHeatmap.ts` - Hook personnalisé pour toute la logique de la heatmap

### Fonctionnalités de la Heatmap

- Grille 7x52 (semaines x jours) style GitHub contributions
- Animations d'expansion/fermeture pour les sessions
- Sélecteur d'année (2023, 2024, 2025)
- Choix de thème de couleurs (bleu/orange)
- Tooltips informatifs
- Labels de mois
- Effet glassmorphism
- Responsive design

## Tests

Suite de tests complète pour la heatmap :

### Tests Unitaires

- `tests/unit/heatmap-functions.test.ts` - Tests des fonctions utilitaires
- `tests/unit/useHeatmap.test.ts` - Tests du hook personnalisé

### Tests de Composants

- `tests/components/Heatmap.test.tsx` - Tests du composant principal
- `tests/components/SessionCard.test.tsx` - Tests du composant de session

### Tests d'Intégration

- `tests/integration/heatmap-integration.test.tsx` - Tests d'intégration complète

### Détail des Tests

#### Tests des Fonctions Utilitaires (`heatmap-functions.test.ts`)

**generateYearData :**

- `should generate correct grid structure for a leap year`
- `should handle empty data correctly`
- `should aggregate multiple sessions on the same day`
- `should handle null cells for days outside the year`

**generateEmptyGrid :**

- `should generate grid with correct dimensions`
- `should fill all valid days with 0`
- `should handle different years correctly`

**generateMonthLabels :**

- `should generate correct month labels`
- `should handle empty weeks array`
- `should calculate correct positions for month labels`

**formatDuration :**

- `should format minutes correctly`
- `should format hours correctly`
- `should handle edge cases`
- `should handle plural forms correctly`

#### Tests du Hook useHeatmap (`useHeatmap.test.ts`)

**Initialisation et chargement :**

- `should initialize with default values`
- `should load heatmap data on mount`
- `should handle year change`
- `should handle color theme change`

**Interactions utilisateur :**

- `should handle cell click and load sessions`
- `should not handle cell click when count is 0`
- `should handle close sessions`

**Gestion d'erreurs :**

- `should handle heatmap data loading error`
- `should handle sessions loading error`
- `should handle network error during heatmap data loading`
- `should handle network error during sessions loading`

**Validation et cohérence :**

- `should calculate total contributions correctly`
- `should handle empty heatmap data`
- `should validate year selection`
- `should handle multiple rapid year changes`
- `should maintain state consistency during interactions`

#### Tests du Composant Heatmap (`Heatmap.test.tsx`)

**Rendu et affichage :**

- `should render heatmap with correct title`
- `should show loading state correctly`
- `should render year selector with correct options`
- `should render color theme buttons`
- `should render month labels correctly`
- `should render grid cells`

**Interactions :**

- `should handle year selection`
- `should handle color theme change`
- `should handle cell click when not loading`
- `should not handle cell click when loading`

**Sessions :**

- `should render sessions section when date is selected`
- `should handle close sessions button`
- `should show no sessions message when no sessions found`
- `should show sessions loading spinner`

**Styles et animations :**

- `should inject animation styles on mount`

#### Tests du Composant SessionCard (`SessionCard.test.tsx`)

**Informations de base :**

- `should render session title and composer`
- `should handle session without composer`

**Badges et modes :**

- `should render mode badge with correct styling for learning mode`
- `should render mode badge with correct styling for practice mode`

**Informations temporelles :**

- `should render time information correctly`
- `should format duration correctly for different values`
- `should format duration correctly for hours`
- `should handle edge case with zero duration`

**Points et statistiques :**

- `should render total points when available`
- `should not render total points when null`
- `should render max combo when available`
- `should not render max combo when null`
- `should render max multiplier when available`
- `should not render max multiplier when null`
- `should render accuracy when available`
- `should not render accuracy when null`
- `should render performance when available`
- `should not render performance when null`

**Cas complets :**

- `should render all stats when all values are available`
- `should handle session with minimal data`

#### Tests d'Intégration (`heatmap-integration.test.tsx`)

**Chargement et affichage :**

- `should load and display heatmap data correctly`
- `should display month labels correctly`
- `should render legend with correct colors`

**Interactions utilisateur :**

- `should handle year change and reload data`
- `should handle color theme change`
- `should display sessions when a cell is clicked`
- `should handle close sessions functionality`
- `should handle cell clicks when not loading`
- `should prevent cell clicks during loading`

**États de chargement :**

- `should show loading state during data fetch`
- `should show sessions loading state`

**Gestion des données :**

- `should handle empty sessions gracefully`
- `should display correct total contributions`
- `should handle zero contributions`

**Styles et cohérence :**

- `should handle animation styles injection`
- `should maintain state consistency across interactions`
