# Gestion des Comptes Inactifs - Virtuo Piano

## 📋 Vue d'ensemble

Ce système automatise la gestion des comptes utilisateurs inactifs depuis plus d'un an, conformément aux exigences RGPD de minimisation des données et de limitation de la durée de conservation.

## 🎯 Objectifs

- **Conformité RGPD** : Respecter le principe de limitation de la durée de conservation
- **Nettoyage automatique** : Supprimer les données inutiles
- **Transparence** : Informer les utilisateurs avant suppression
- **Sécurité** : Suppression complète et sécurisée des données

## ⏰ Chronologie

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Inactivité    │    │   Avertissement │    │   Suppression   │
│   11 mois       │───▶│   2 semaines    │───▶│   Définitive    │
│                 │    │    avant        │    │                 │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## 🔧 Fonctionnalités

### 1. Détection des comptes inactifs

**Critères d'inactivité :**

- Dernière connexion > 1 an OU
- Compte créé > 1 an ET jamais connecté

**Champ utilisé :** `lastLoginAt` (ajouté au modèle User)

### 2. Notification par email

**Email d'avertissement envoyé 2 semaines avant suppression :**

- Informations sur la dernière connexion
- Délai de 14 jours pour se reconnecter
- Lien direct vers la page de connexion
- Explications des conséquences

**Email de confirmation après suppression :**

- Notification de suppression effective
- Liste des données supprimées
- Possibilité de créer un nouveau compte

### 3. Suppression sécurisée

**Processus de suppression :**

1. Suppression des scores utilisateur
2. Suppression des compositions
3. Suppression des favoris
4. Suppression des imports
5. Suppression de la progression des défis
6. Suppression du compte utilisateur

**Transaction Prisma** pour garantir l'intégrité des données

## 🛠️ Implémentation technique

### Services

**`AccountServices`** (`src/lib/services/account-services.ts`) :

- `getInactiveUsers()` : Récupère les utilisateurs inactifs
- `getUsersToDelete()` : Récupère les utilisateurs à supprimer
- `deleteInactiveUsers()` : Supprime les utilisateurs inactifs

**`EmailService`** (`src/lib/services/email-service.ts`) :

- `sendInactiveAccountWarning()` : Email d'avertissement
- `sendAccountDeletionNotification()` : Email de confirmation

### Actions serveur

**`RGPD-actions.ts`** :

- `getInactiveUsersAction()` : API pour récupérer les inactifs
- `sendInactiveAccountWarningsAction()` : Envoi des avertissements
- `deleteInactiveUsersAction()` : Suppression des comptes

### Script de maintenance

**`maintenance.ts`** (`src/scripts/maintenance.ts`) :

- Script CLI pour automatisation
- Commandes : `warn`, `delete`, `report`, `full`
- Logs détaillés et gestion d'erreurs

## 📊 Utilisation

### Via l'API Vercel

**API REST** (`/api/admin/maintenance`) :

```bash
# Rapport des utilisateurs inactifs
GET https://your-domain.vercel.app/api/admin/maintenance?action=report

# Envoyer les avertissements
POST https://your-domain.vercel.app/api/admin/maintenance
{
  "action": "warn"
}

# Supprimer les comptes inactifs
POST https://your-domain.vercel.app/api/admin/maintenance
{
  "action": "delete"
}
```

**Cron Jobs automatiques :**

- **Avertissements** : `GET https://your-domain.vercel.app/api/admin/maintenance?action=warn`
- **Suppressions** : `GET https://your-domain.vercel.app/api/admin/maintenance?action=delete`

### Via la ligne de commande

**Script de maintenance** :

```bash
# Générer un rapport
npm run maintenance report

# Envoyer les avertissements
npm run maintenance warn

# Supprimer les comptes inactifs
npm run maintenance delete

# Processus complet
npm run maintenance full
```

## 🔄 Automatisation avec Vercel

### Configuration automatique

Le système utilise les **Vercel Cron Jobs** pour automatiser la maintenance :

**Configuration dans `vercel.json` :**

```json
{
  "crons": [
    {
      "path": "/api/admin/maintenance?action=warn",
      "schedule": "0 9 * * *"
    },
    {
      "path": "/api/admin/maintenance?action=delete",
      "schedule": "0 9 1 * *"
    }
  ]
}
```

### Planification

- **Avertissements** : Tous les lundis à 9h00 UTC
- **Suppressions** : Le 1er de chaque mois à 9h00 UTC

### Variables d'environnement Vercel

```env
# Base de données
DATABASE_URL=your_database_url

# Configuration email
EMAIL_USER=virtuopiano1@gmail.com
EMAIL_PASSWORD=your_app_password

# NextAuth
NEXTAUTH_URL=https://your-domain.vercel.app
NEXTAUTH_SECRET=your_secret
```

## 📧 Templates d'emails

### Email d'avertissement

- **Sujet** : "⚠️ Votre compte Virtuo Piano sera supprimé dans 2 semaines"
- **Contenu** : Informations sur l'inactivité, délai, conséquences
- **Action** : Bouton "Se connecter maintenant"

### Email de confirmation

- **Sujet** : "🗑️ Votre compte Virtuo Piano a été supprimé"
- **Contenu** : Confirmation de suppression, données supprimées
- **Action** : Bouton "Créer un nouveau compte"

## 🔒 Sécurité

### Authentification

- Toutes les actions nécessitent une authentification
- Vérification des permissions administrateur

### Validation

- Vérification des données avant suppression
- Gestion des erreurs et rollback en cas d'échec
