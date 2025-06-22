### Composants Heatmap

La heatmap a été restructurée pour une meilleure maintenabilité et réutilisabilité :

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

#### Avantages de cette structure

- **Séparation des responsabilités** : UI, logique, styles et constantes sont séparés
- **Réutilisabilité** : Les composants et hooks peuvent être réutilisés ailleurs
- **Maintenabilité** : Code plus facile à maintenir et à tester
- **Performance** : Optimisations possibles grâce à la séparation des préoccupations
- **Lisibilité** : Code plus clair et organisé

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

Le projet inclut une suite de tests complète pour la heatmap :

### Tests Unitaires

- `tests/unit/heatmap-functions.test.ts` - Tests des fonctions utilitaires
- `tests/unit/useHeatmap.test.ts` - Tests du hook personnalisé

### Tests de Composants

- `tests/components/Heatmap.test.tsx` - Tests du composant principal
- `tests/components/SessionCard.test.tsx` - Tests du composant de session

### Tests d'Intégration

- `tests/integration/heatmap-integration.test.tsx` - Tests d'intégration complète

### Couverture des Tests

#### Fonctions Utilitaires

- ✅ Génération des données d'année
- ✅ Génération de grille vide
- ✅ Génération des labels de mois
- ✅ Formatage de durée
- ✅ Gestion des années bissextiles
- ✅ Agrégation des sessions multiples

#### Hook useHeatmap

- ✅ Initialisation avec valeurs par défaut
- ✅ Chargement des données au montage
- ✅ Changement d'année
- ✅ Changement de thème de couleur
- ✅ Clic sur cellule et chargement des sessions
- ✅ Fermeture des sessions avec animation
- ✅ Gestion des erreurs (API et réseau)
- ✅ Validation des années
- ✅ Cohérence de l'état

#### Composant Heatmap

- ✅ Rendu avec titre correct
- ✅ États de chargement
- ✅ Sélecteur d'année
- ✅ Boutons de thème de couleur
- ✅ Labels des mois
- ✅ Grille de cellules
- ✅ Clics sur cellules (avec/sans chargement)
- ✅ Section des sessions
- ✅ Bouton de fermeture
- ✅ Messages d'erreur
- ✅ Injection des styles d'animation

#### Composant SessionCard

- ✅ Rendu du titre et compositeur
- ✅ Badge de mode (Apprentissage/Pratique)
- ✅ Informations temporelles
- ✅ Points totaux
- ✅ Statistiques (combo, multiplicateur, précision, performance)
- ✅ Gestion des valeurs nulles
- ✅ Formatage de durée
- ✅ Sessions avec données minimales

#### Tests d'Intégration

- ✅ Chargement et affichage des données
- ✅ Changement d'année et rechargement
- ✅ Changement de thème de couleur
- ✅ Affichage des sessions au clic
- ✅ Fermeture des sessions
- ✅ États de chargement
- ✅ Gestion des erreurs
- ✅ Cohérence de l'état
