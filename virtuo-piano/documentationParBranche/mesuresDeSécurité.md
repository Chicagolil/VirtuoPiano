### Mesures de sécurité mises en place

Ce document recense les mesures de sécurité techniques et organisationnelles identifiées dans la base de code de l’application Virtuo Piano, ainsi que des recommandations d’amélioration. Les extraits mentionnés renvoient aux fichiers du projet.

### Authentification, sessions et contrôle d’accès

- **NextAuth (web)**:

  - Configuration via `src/lib/authoption.ts` et route `src/app/api/auth/[...nextauth]/route.ts`.
  - **Stratégie de session**: JWT côté serveur, avec `maxAge` de 1h (réduction de surface en cas de compromission de token).
  - **Provider Credentials**: vérification des identifiants en base, puis mise à jour de `lastLoginAt` pour la traçabilité.
  - **Politique de consentement**: l’accès est refusé si `privacyConsent` est faux; l’utilisateur doit accepter la politique avant la connexion.
  - **Hachage des mots de passe**: `argon2id` avec paramètres renforcés (mémoire 64MB, timeCost 3, parallelism 4) lors de l’inscription (`src/app/api/auth/register/route.ts`).

- **Authentification Unity (API dédiée)**:

  - Route `src/app/api/auth/unity/route.ts` émet un JWT (7 jours d’expiration) signé avec `JWT_SECRET` pour usage côté client Unity.
  - Vérification de mot de passe via `bcrypt` (différent de `argon2` côté web). Recommandation: uniformiser sur `argon2id`.
  - Le middleware accepte également l’authentification par **`x-api-key`** (`UNITY_API_KEY`) pour certaines intégrations.

- **Middleware d’application**: `src/middleware.ts`
  - Protège les pages: redirige vers `/auth/login` si l’utilisateur n’est pas authentifié.
  - Protège les API (sauf `/api/auth` et `/api/contact`):
    - Vérifie le header `Referer` pour faire respecter le même site (anti-CSRF basique).
    - Accepte l’API key Unity (`x-api-key`) ou un `Authorization: Bearer <JWT>` valide.
    - À défaut, vérifie le token NextAuth (`getToken`) et renvoie 401 en absence.
  - Exclut `/api/admin/maintenance` (cron) du contrôle de Referer pour permettre l’exécution planifiée.

### Validation des entrées et intégrité des données

- **Zod** (`src/lib/validations/auth-schemas.ts`):
  - `registerSchema`: email valide, mot de passe robuste (longueur min 8 + complexité), `userName` restreint, consentement obligatoire.
  - `updatePrivacyConsentSchema`: renforce l’acceptation explicite avec vérification du mot de passe.
  - `rectificationSchema`: validations pour la mise à jour des données.
  - `contactSchema`: contraintes strictes sur nom/sujet/message.
- **API Register** (`src/app/api/auth/register/route.ts`):
  - Vérifie l’unicité de l’email, hachage `argon2id`, retour sans le champ `password`.
- **API Consentement** (`src/app/api/auth/update-privacy-consent/route.ts`):
  - Vérifie le mot de passe (`argon2.verify`) avant mise à jour de `privacyConsent` et `privacyConsentAt`.

### En-têtes de sécurité HTTP et CSP

- `next.config.ts` (en-têtes générés par Next.js):
  - **X-Frame-Options: DENY** (anti-clickjacking)
  - **X-Content-Type-Options: nosniff** (empêche le MIME-sniffing)
  - **Permissions-Policy**: camera/microphone/geolocation désactivés par défaut
  - **X-XSS-Protection: 1; mode=block** (héritage; utile sur navigateurs plus anciens)
  - **Referrer-Policy: strict-origin-when-cross-origin**
- `vercel.json` (en-têtes au niveau edge):
  - **Content-Security-Policy** stricte: `default-src 'self'`, `frame-ancestors 'none'`, `object-src 'none'`, `base-uri 'self'`, `form-action 'self'`, `upgrade-insecure-requests`, `block-all-mixed-content`. Sources autorisées minimales (images Cloudinary, `data:`/`blob:` pour images/fonts).
  - Même renforcement sur **X-Frame-Options**, **X-Content-Type-Options**, **Referrer-Policy** et **Permissions-Policy** (incluant `interest-cohort=()` pour désactiver FLoC).

Remarque: la CSP autorise `script-src 'unsafe-inline' 'unsafe-eval'` et `style-src 'unsafe-inline'` pour des raisons de compatibilité. C’est un compromis; voir recommandations.

### RGPD, vie privée et rétention des données

- **Politique de confidentialité**: page dédiée `src/app/privacy-policy/page.tsx` détaillant les traitements, durées de conservation, droits des personnes.
- **Consentement**:
  - Requis à l’inscription et à la connexion (blocage si non consenti).
  - Mise à jour possible via l’API `update-privacy-consent` (vérification du mot de passe avant acceptation).
  - Retrait du consentement: `AccountServices.withdrawConsent` met `privacyConsent=false` et réinitialise la date.
- **Gestion des comptes inactifs**:
  - API `src/app/api/admin/maintenance/route.ts` protégée par `Authorization: Bearer <CRON_SECRET>`.
  - Actions: rapport des inactifs, avertissements, suppression définitive (avec transaction Prisma côté services) — voir `documentationParBranche/gestionComptesInactifs.md`.
  - Planification via **Vercel Cron** dans `vercel.json`.

### Schéma base de données et contraintes Prisma (`prisma/schema.prisma`)

- **Modèle `User`**: `email @unique`, champs `privacyConsent`/`privacyConsentAt`, `lastLoginAt`, timestamps `createdAt`/`updatedAt`.
- **Modèles**: plusieurs contraintes d’unicité et composites (`@@unique`) et relations avec suppression en cascade pour les entités Challenge/Level/Progress (intégrité référentielle).
- **Traçabilité**: mise à jour automatique `updatedAt`; champs date pour consentement et connexions.

### Services externes et secrets

- **Cloudinary** (`src/lib/cloudinary.ts`): configuration via variables d’environnement; transformations d’images (taille/qualité/format) pour limiter les risques de payloads lourds.
- **Email (Nodemailer)** (`src/lib/services/email-service.ts`): utilise `EMAIL_USER`/`EMAIL_PASSWORD` en variables d’environnement. Les contenus insérés (message utilisateur) sont intégrés dans des templates HTML d’email.
- **JWT**: `JWT_SECRET` requis pour signature des tokens Unity; NextAuth utilise `NEXTAUTH_SECRET`/`NEXTAUTH_URL`.
- **Cron**: `CRON_SECRET` pour sécuriser les exécutables planifiés.

### Observabilité et gestion des erreurs

- Journalisation d’erreurs serveur (console) dans les routes API et services pour diagnostic.
- Codes de statut HTTP cohérents (400 validation, 401/403 accès, 500 interne).

### Points d’attention et recommandations d’amélioration

- **CSP plus stricte**:
  - Réduire `script-src` en supprimant `'unsafe-inline'` et `'unsafe-eval'` si possible, et introduire des **nonces** ou **hashes** (ex: via `next-safe`/`@next/helmet` équivalent) pour les scripts/styles.
  - Maintenir une whitelist fine pour les images et polices.
- **CSRF**:
  - Le contrôle de `Referer` aide, mais il est préférable d’ajouter des **tokens anti-CSRF** pour les routes sensibles hors NextAuth (par ex. un middleware CSRF avec cookie SameSite=Lax/Strict + token synchronizer).
- **Rate limiting / anti-bruteforce**:
  - Ajouter un **rate limit** sur les endpoints d’authentification et Unity (`/api/auth/*`, `/api/auth/unity`) et de contact (ex: `lru-cache`/KV + 429). Envisager **compte verrouillé temporairement** après N échecs.
- **Unifier le hachage**:
  - Migrer l’auth Unity de `bcrypt` vers **`argon2id`** pour cohérence et robustesse accrues.
- **Cookies sécurisés**:
  - Vérifier en production l’activation de `secure`, `httpOnly`, `sameSite` sur les cookies de session NextAuth (NextAuth le gère généralement selon l’environnement et `NEXTAUTH_URL`).
- **HSTS**:
  - Ajouter l’en-tête **Strict-Transport-Security** (ex: `max-age=31536000; includeSubDomains; preload`) pour forcer HTTPS.
- **Sanitisation du contenu riche**:
  - Si du contenu utilisateur est un jour rendu côté web (ex: messages, descriptions), utiliser une bibliothèque de sanitisation (ex: DOMPurify server-side) avant rendu HTML. À ce stade, le message du formulaire de contact n’est pas ré-affiché côté web, mais reste à traiter prudemment.
- **Journalisation et alerte**:
  - Centraliser les logs et configurer des alertes (ex: 401/403 anormaux, pics de 5xx) et des corrélations par IP/compte.
- **Permissions fines**:
  - Si des rôles apparaissent (admin, etc.), ajouter des contrôles RBAC explicites sur les routes sensibles et auditer leur usage.

### Rate Limiting et Protection Anti-Brute Force

#### Architecture et Implémentation

- **Service principal** (`src/lib/services/login-attempts-service.ts`):
  - **Classe `LoginAttemptsService`** : Service statique encapsulant toute la logique de rate limiting.
  - **Méthode `recordAttempt()`** : Enregistre chaque tentative (réussie/échouée) avec IP, User-Agent, email et timestamp.
  - **Méthode `isIPBlockedForEmail()`** : Vérifie si une IP est bloquée pour un email spécifique avec calcul du temps restant.
  - **Méthode `getClientIP()`** : Extraction robuste de l'IP client (Cloudflare, X-Real-IP, X-Forwarded-For, IP directe).
  - **Méthode `cleanupOldAttempts()`** : Suppression automatique des tentatives >24h pour optimiser les performances.
  - **Méthode `getUserLoginStats()`** : Statistiques de connexion par utilisateur (taux de réussite, nombre de tentatives).

#### Configuration et Paramètres

- **Limites de sécurité** :
  - **Seuil de blocage** : 5 tentatives échouées par combinaison IP/email
  - **Fenêtre de temps** : 15 minutes pour le comptage des tentatives
  - **Durée de blocage** : 30 minutes après dépassement du seuil
  - **Rétention des données** : 24 heures pour les tentatives (nettoyage automatique)

#### Modèle de Données

- **Table `LoginAttempt`** (`prisma/schema.prisma`) :
  ```prisma
  model LoginAttempt {
    id        String   @id @default(uuid())
    email     String   // Email utilisé pour la tentative
    ipAddress String   // Adresse IP de la tentative
    userAgent String?  // User-Agent du navigateur
    success   Boolean  @default(false) // Si la tentative a réussi
    createdAt DateTime @default(now())

    // Relation optionnelle avec l'utilisateur (si l'email existe)
    userId    String?
    user      User?    @relation(fields: [userId], references: [id], onDelete: SetNull)

    @@index([email, createdAt])
    @@index([ipAddress, createdAt])
    @@index([createdAt])
  }
  ```

#### Intégration NextAuth

- **Modification de `src/lib/authoption.ts`** :
  - **Fonction `authorize()`** : Vérification du blocage avant traitement des identifiants
  - **Extraction IP** : Utilisation de `LoginAttemptsService.getClientIP()` pour identifier le client
  - **Enregistrement des tentatives** : Appel de `recordAttempt()` pour chaque tentative (réussie/échouée)
  - **Messages d'erreur** : Messages spécifiques avec temps restant en cas de blocage
  - **Mise à jour `lastLoginAt`** : Traçabilité des connexions réussies

#### Interface Utilisateur

- **Composant `RateLimitMessage`** (`src/components/RateLimitMessage.tsx`) :
  - **Détection automatique** : Reconnaissance des messages de rate limiting via regex
  - **Compte à rebours** : Timer en temps réel avec formatage MM:SS
  - **Barre de progression** : Indication visuelle du temps restant
  - **Auto-réinitialisation** : Effacement automatique du message après expiration
  - **Design responsive** : Interface adaptée avec icônes et couleurs d'alerte

#### API d'Administration

- **Route `/api/admin/login-attempts`** (`src/app/api/admin/login-attempts/route.ts`) :
  - **Authentification** : Vérification du niveau admin (level >= 10)
  - **Filtres** : Par période (jours), email, adresse IP
  - **Statistiques** : Taux de réussite, tentatives par IP/email, IPs suspectes
  - **Données récentes** : 50 dernières tentatives avec détails complets
  - **Sécurité** : Protection par session NextAuth et vérification des permissions

#### Script de Maintenance

- **Intégration dans `prisma/scripts/maintenance.ts`** :
  - **Fonction `cleanupLoginAttempts()`** : Nettoyage des anciennes tentatives
  - **Commande `cleanup-login`** : Exécution manuelle du nettoyage
  - **Commande `full`** : Intégration dans le processus de maintenance complet
  - **Logs détaillés** : Suivi des opérations de nettoyage

#### Gestion des Erreurs et Robustesse

- **Gestion d'erreurs** :
  - **Try-catch** : Protection contre les échecs de base de données
  - **Fallback** : En cas d'erreur, autorisation de la requête pour éviter le blocage
  - **Logs** : Journalisation des erreurs pour diagnostic
  - **Performance** : Indexation des champs critiques pour les requêtes rapides

#### Sécurité et Confidentialité

- **Protection des données** :
  - **Anonymisation** : Pas de stockage de mots de passe ou données sensibles
  - **Rétention limitée** : Suppression automatique après 24h
  - **Accès restreint** : API admin protégée par authentification et niveau d'accès
  - **Conformité RGPD** : Traitement minimal des données personnelles

#### Monitoring et Alertes

- **Surveillance** :
  - **IPs suspectes** : Détection automatique des IPs avec >5 tentatives échouées
  - **Taux d'échec** : Calcul du pourcentage de tentatives échouées par IP/email
  - **Tendances** : Analyse des patterns de tentatives sur différentes périodes
  - **Alertes** : Possibilité d'intégration avec des systèmes de monitoring externes

#### Fichiers et Dépendances

- **Fichiers créés/modifiés** :

  - `src/lib/services/login-attempts-service.ts` : Service principal (nouveau)
  - `src/components/RateLimitMessage.tsx` : Composant UI (nouveau)
  - `src/app/api/admin/login-attempts/route.ts` : API admin (nouveau)
  - `prisma/schema.prisma` : Modèle LoginAttempt (modifié)
  - `src/lib/authoption.ts` : Intégration NextAuth (modifié)
  - `src/features/auth/ConnexionForm.tsx` : Interface utilisateur (modifié)
  - `prisma/scripts/maintenance.ts` : Script de maintenance (modifié)

- **Migration Prisma** :

  - `20250115123456_add_login_attempts_table` : Création de la table LoginAttempt
  - Indexation optimisée pour les requêtes de rate limiting
  - Relations avec le modèle User pour la traçabilité

- **Dépendances utilisées** :
  - `rate-limiter-flexible` : Bibliothèque de rate limiting (déjà présente)
  - `prisma` : ORM pour la persistance des données
  - `next-auth` : Framework d'authentification
  - `react` : Framework UI pour le composant de message

#### Flux de Fonctionnement

1. **Tentative de connexion** : L'utilisateur soumet ses identifiants
2. **Vérification du blocage** : `isIPBlockedForEmail()` vérifie si l'IP/email est bloqué
3. **Traitement des identifiants** : Si non bloqué, vérification des credentials
4. **Enregistrement de la tentative** : `recordAttempt()` sauvegarde le résultat
5. **Réponse à l'utilisateur** : Message d'erreur avec temps restant si bloqué
6. **Interface utilisateur** : Affichage du compte à rebours si applicable

#### Cas d'Usage et Scénarios

- **Attaque brute force** : Blocage automatique après 5 échecs
- **Utilisateur légitime** : Déblocage automatique après 30 minutes
- **Tentatives multiples** : Comptage par combinaison IP/email
- **Changement d'IP** : Nouveau compteur pour chaque IP
- **Changement d'email** : Nouveau compteur pour chaque email
- **Connexion réussie** : Réinitialisation du compteur d'échecs

### Synthèse rapide

- Auth web robuste via NextAuth + `argon2id`, consentement RGPD obligatoire, sessions JWT courtes.
- **Rate limiting anti-brute force** : 5 tentatives/15min par IP/email, blocage 30min, traçabilité complète.
- Middleware protège pages et APIs, avec contrôle de Referer et support JWT/API-Key pour Unity.
- En-têtes de sécurité et CSP déployés au niveau edge et Next.
- Validations Zod systématiques pour formulaires critiques; schéma DB contraint et traçable.
- Cron de maintenance sécurisé par `CRON_SECRET` pour gestion de rétention/suppression.
- Améliorations clés: CSP sans unsafe, CSRF tokens, HSTS, unification hachage, sanitisation défensive.

---

**Note de mise à jour** : Le système de rate limiting anti-brute force a été implémenté avec succès. La section "Rate Limiting et Protection Anti-Brute Force" ci-dessus détaille les fonctionnalités ajoutées. La recommandation précédente concernant le rate limiting est maintenant **IMPLÉMENTÉE** pour le formulaire de connexion NextAuth.
