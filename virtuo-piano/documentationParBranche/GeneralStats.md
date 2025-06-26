### Composants GeneralStats

#### Fichiers de constantes

- `src/common/constants/generalStats.ts` - Constantes pour les couleurs, seuils et configurations des statistiques
- `src/common/utils/function.ts` - Fonctions utilitaires centralisées (formatage, calculs de scores)

#### Server Actions

- `src/lib/actions/generalStats-actions.ts` - Actions serveur pour les statistiques de répertoire et comparaisons temporelles
- `src/lib/actions/history-actions.ts` - Actions serveur pour l'historique des sessions récentes

#### Services

- `src/lib/services/performances-services.ts` - Service pour les interactions avec la base de données des performances

#### Composants UI

- `src/components/badge/AccuracyBadge.tsx` - Badge pour afficher la précision avec couleurs dynamiques
- `src/components/badge/ModeBadge.tsx` - Badge pour afficher le mode de jeu (apprentissage/performance)
- `src/components/badge/UserAvatar.tsx` - Avatar utilisateur avec fallback sur initiales
- `src/components/ProgressBar.tsx` - Barre de progression avec animations et ARIA
- `src/components/cards/AchievementsCard.tsx` - Carte d'affichage des achievements avec barres de progression
- `src/components/cards/PieChartCard.tsx` - Carte avec graphique en secteurs pour les statistiques
- `src/components/cards/ScoreCard.tsx` - Carte d'affichage des scores de session
- `src/components/tiles/Infotile.tsx` - Tuile d'information avec sélecteur d'intervalle et tendances

### Fonctionnalités des Statistiques Générales

- Statistiques de répertoire (genres, compositeurs, difficultés) avec calculs de pourcentages
- Comparaisons temporelles (semaine, mois, trimestre) avec tendances
- Historique des sessions récentes avec formatage intelligent des dates
- Badges dynamiques avec couleurs basées sur les performances
- Barres de progression animées avec support d'accessibilité
- Graphiques en secteurs pour visualiser les distributions
- Tuiles d'information avec sélecteurs d'intervalles

## Tests

Suite de tests complète pour les statistiques générales :

### Tests Unitaires

- `tests/unit/generalStats.test.ts` - Tests des constantes et fonctions utilitaires

### Tests de Composants

- `tests/components/AccuracyBadge.test.tsx` - Tests du badge de précision
- `tests/components/ModeBadge.test.tsx` - Tests du badge de mode
- `tests/components/UserAvatar.test.tsx` - Tests de l'avatar utilisateur
- `tests/components/ProgressBar.test.tsx` - Tests de la barre de progression
- `tests/components/AchievementsCard.test.tsx` - Tests de la carte d'achievements
- `tests/components/InfoTile.test.tsx` - Tests de la tuile d'information

### Tests d'Intégration

- `tests/integration/generalStats-actions.test.tsx` - Tests des server actions avec mocks complets
- `tests/integration/history-actions.test.tsx` - Tests des actions d'historique
- `tests/integration/performance-components-integration.test.tsx` - Tests d'intégration des composants
- `tests/integration/server-actions-integration.test.tsx` - Tests d'intégration workflow complet
- `tests/unit/performances-services.test.ts` - Tests du service de performances avec mocks Prisma

### Détail des Tests

#### Tests des Constantes (`generalStats.test.ts`)

**ACCURACY_COLORS :**

- `should contain all required accuracy color ranges`
- `should have valid hex color codes`
- `should maintain color order from low to high accuracy`
- `should be immutable`

**PERFORMANCE_COLORS :**

- `should contain all required performance color ranges`
- `should have consistent structure with accuracy colors`
- `should provide distinct colors for different performance levels`

#### Tests du Service Performances (`performances-services.test.ts`)

**getPracticeDataForHeatmap :**

- `should return practice data grouped by date`
- `should handle empty scores array`
- `should handle single session`
- `should aggregate multiple sessions on the same day correctly`

**getSessionsByDate :**

- `should return sessions for a specific date`
- `should handle null values gracefully`
- `should calculate duration and performance metrics correctly`
- `should call getLearnScores with correct parameters`

**getSongsRepertory :**

- `should return repertory data with filtered null values`
- `should handle empty scores array`
- `should map difficulty levels correctly using getDifficultyRange`

**Méthodes d'intervalles temporels :**

- `should calculate total practice time for week interval`
- `should calculate practice time for previous interval`
- `should count unique songs started in interval`
- `should count unique songs started in previous interval`
- `should return 0 for empty datasets`

**getTotalSongsInLibrary :**

- `should count total songs from all sources (library + compositions + imports)`
- `should handle zero counts`

**getRecentSessionsData :**

- `should return recent sessions with song and mode data`
- `should use default limit when not specified`
- `should handle empty results`
- `should order by sessionStartTime desc`

**Calculs de dates :**

- `should calculate correct date ranges for different intervals`
- `should handle week, month, and quarter intervals correctly`

#### Tests du Composant AccuracyBadge (`AccuracyBadge.test.tsx`)

**Rendu et couleurs :**

- `should render with correct accuracy value`
- `should apply red color for very low accuracy (0-40%)`
- `should apply orange color for low accuracy (41-60%)`
- `should apply yellow color for medium accuracy (61-75%)`
- `should apply light green color for good accuracy (76-85%)`
- `should apply green color for high accuracy (86-95%)`
- `should apply dark green color for excellent accuracy (96-100%)`

**Cas limites :**

- `should handle 0% accuracy`
- `should handle 100% accuracy`
- `should handle decimal accuracy values`
- `should handle negative accuracy gracefully`
- `should handle accuracy over 100%`

**Styling et accessibilité :**

- `should have correct CSS classes`
- `should be accessible with proper ARIA attributes`
- `should maintain consistent styling across different accuracies`

#### Tests du Composant ModeBadge (`ModeBadge.test.tsx`)

**Modes de jeu :**

- `should render learning mode with correct styling`
- `should render game mode with correct styling`
- `should display correct icons for each mode`

**Couleurs et styling :**

- `should apply blue theme for learning mode`
- `should apply orange theme for game mode`
- `should have correct CSS classes`

**Validation :**

- `should handle invalid mode gracefully`
- `should maintain consistent styling`
- `should render mode text correctly`

#### Tests du Composant UserAvatar (`UserAvatar.test.tsx`)

**Affichage avec image :**

- `should render with image when imageUrl is provided`
- `should handle image loading errors with fallback`
- `should apply correct alt text`

**Fallback sur initiales :**

- `should show initials when no image is provided`
- `should generate initials from first and last name`
- `should handle single name gracefully`
- `should handle empty name`

**Cas limites :**

- `should handle very long names`
- `should handle names with special characters`
- `should handle null/undefined values`
- `should maintain consistent size`

**Styling :**

- `should apply correct CSS classes`
- `should have proper border radius`
- `should handle different sizes if implemented`

#### Tests du Composant ProgressBar (`ProgressBar.test.tsx`)

**Valeurs et affichage :**

- `should render with correct progress value`
- `should handle 0% progress`
- `should handle 100% progress`
- `should clamp values between 0 and 100`

**Transformations CSS :**

- `should apply correct transform style for progress`
- `should calculate scaleX correctly`
- `should handle decimal values`

**Accessibilité ARIA :**

- `should have correct ARIA attributes`
- `should include aria-valuenow`
- `should include aria-valuemin and aria-valuemax`
- `should have proper role attribute`

**Animations :**

- `should have animation classes`
- `should handle smooth transitions`

**Cas limites :**

- `should handle negative values`
- `should handle values over 100`
- `should handle NaN values`
- `should maintain visual consistency`

#### Tests du Composant AchievementsCard (`AchievementsCard.test.tsx`)

**Rendu des achievements :**

- `should render achievement title and description`
- `should display current and target values`
- `should show progress percentage`

**Barres de progression :**

- `should render progress bar with correct value`
- `should calculate progress percentage correctly`
- `should handle completed achievements`
- `should handle zero progress`

**États d'achèvement :**

- `should mark achievement as completed when target is reached`
- `should show different styling for completed achievements`
- `should handle achievements with different progress levels`

**Validation des données :**

- `should handle missing achievement data`
- `should validate achievement structure`
- `should handle invalid progress values`

#### Tests du Composant InfoTile (`InfoTile.test.tsx`)

**États de chargement :**

- `should show loading state correctly`
- `should hide content during loading`
- `should display loading spinner`

**États d'erreur :**

- `should show error state when error occurs`
- `should display error message`
- `should hide normal content on error`

**Affichage des tendances :**

- `should display increase trend with correct styling`
- `should display decrease trend with correct styling`
- `should display stable trend`
- `should show trend percentages`

**Sélecteur d'intervalles :**

- `should render interval selector with options`
- `should handle interval change`
- `should highlight selected interval`
- `should call onChange when interval is selected`

**Contenu et valeurs :**

- `should display title and main value`
- `should format values correctly`
- `should handle different data types`
- `should show secondary information when available`

**Cas limites :**

- `should handle missing data gracefully`
- `should validate interval options`
- `should handle rapid interval changes`

### Tests d'Intégration

#### Tests des Server Actions (`generalStats-actions.test.tsx`)

**getSongsPropertyRepertory :**

- `should return processed repertory data successfully`
- `should calculate percentages correctly for genre, composer, difficulty`
- `should handle empty data gracefully`
- `should handle unauthenticated user`
- `should handle service errors`
- `should calculate percentages correctly with single items`

**getPracticeTimeComparison :**

- `should return practice time comparison with increase trend`
- `should return practice time comparison with decrease trend`
- `should return stable trend when times are equal`
- `should handle zero previous time`
- `should format time correctly (minutes to "Xh Ym" format)`
- `should handle unauthenticated user`
- `should handle service errors`

**getStartedSongsComparison :**

- `should return started songs comparison with increase trend`
- `should return started songs comparison with decrease trend`
- `should return stable trend when numbers are equal`
- `should handle zero values`
- `should count total songs from all sources`
- `should handle unauthenticated user`
- `should handle service errors`

**Validation des entrées :**

- `should handle different interval types for practice time`
- `should handle different interval types for started songs`
- `should validate interval parameters (week, month, quarter)`

#### Tests des Actions d'Historique (`history-actions.test.tsx`)

**getRecentSessions :**

- `should return recent sessions with default limit`
- `should return recent sessions with custom limit`
- `should handle sessions without composer`
- `should format duration correctly for different time spans`

**Formatage des dates :**

- `should format playedAt correctly for different time periods`
- `should show "Aujourd'hui, HH:MM" for today's sessions`
- `should show "Hier, HH:MM" for yesterday's sessions`
- `should show "Il y a X jours" for recent sessions`
- `should show "Il y a X semaines" for older sessions`
- `should show date format for very old sessions`

**Mapping des modes :**

- `should map mode names correctly (Apprentissage → learning, Performance → game)`

**Gestion des valeurs nulles :**

- `should handle null values gracefully`
- `should call getLearnScores with 0 for null values`
- `should set default values for missing data`

**Gestion d'erreurs :**

- `should handle unauthenticated user`
- `should handle service errors`
- `should handle empty sessions array`

**Appels de fonctions :**

- `should call getLearnScores with correct parameters`
- `should use PerformancesServices.getRecentSessionsData correctly`

#### Tests d'Intégration des Composants (`performance-components-integration.test.tsx`)

**Intégration des composants :**

- `should render AccuracyBadge and ModeBadge together correctly`
- `should integrate UserAvatar with other profile components`
- `should combine ProgressBar with AchievementsCard`
- `should integrate InfoTile with data loading states`

**Cohérence thématique :**

- `should maintain consistent color themes across components`
- `should apply consistent spacing and layout`
- `should handle theme changes uniformly`

**Responsive design :**

- `should adapt to different screen sizes`
- `should maintain functionality on mobile devices`
- `should handle container size changes`

**Flux de données :**

- `should pass data correctly between parent and child components`
- `should handle data updates and re-renders`
- `should maintain state consistency across component interactions`

#### Tests d'Intégration Workflow Complet (`server-actions-integration.test.tsx`)

**Workflow complet :**

- `should handle complete user statistics workflow`
- `should execute multiple actions in parallel correctly`
- `should maintain data consistency across all actions`
- `should calculate complex statistics accurately`

**Gestion d'erreurs globale :**

- `should handle errors gracefully across all actions`
- `should provide consistent error responses`
- `should maintain application stability during failures`

**Authentification :**

- `should handle unauthenticated user across all actions`
- `should validate user sessions consistently`

**Cohérence des données :**

- `should maintain data consistency between different time intervals`
- `should handle edge cases with zero data`
- `should validate date range calculations`

**Performance et efficacité :**

- `should handle large datasets efficiently`
- `should maintain reasonable execution times`
- `should optimize database queries`
- `should handle concurrent requests properly`

**Scénarios réalistes :**

- `should simulate real user interaction patterns`
- `should handle typical data volumes`
- `should validate business logic end-to-end`
- `should ensure data accuracy across the entire pipeline`
