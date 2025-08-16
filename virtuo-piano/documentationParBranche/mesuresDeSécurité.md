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

### Synthèse rapide

- Auth web robuste via NextAuth + `argon2id`, consentement RGPD obligatoire, sessions JWT courtes.
- Middleware protège pages et APIs, avec contrôle de Referer et support JWT/API-Key pour Unity.
- En-têtes de sécurité et CSP déployés au niveau edge et Next.
- Validations Zod systématiques pour formulaires critiques; schéma DB contraint et traçable.
- Cron de maintenance sécurisé par `CRON_SECRET` pour gestion de rétention/suppression.
- Améliorations clés: CSP sans unsafe, CSRF tokens, rate limiting/lockout, HSTS, unification hachage, sanitisation défensive.
