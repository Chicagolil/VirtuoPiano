'use client';

import { useState } from 'react';
import ContactModal from '@/components/modals/ContactModal';

export default function PrivacyPolicyPage() {
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-black to-orange-600">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">
            Politique de Confidentialité
          </h1>
          <div className="flex items-center justify-center gap-4 text-gray-300">
            <span>Dernière mise à jour : Juillet 2025</span>
            <span>•</span>
            <span>Version : 1.0</span>
          </div>
        </div>

        {/* Contexte académique */}
        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 mb-8 border border-white/20">
          <h2 className="text-2xl font-semibold text-white mb-4">
            🎓 Contexte académique
          </h2>
          <p className="text-gray-300 leading-relaxed">
            Ce site web a été développé dans le cadre d'un{' '}
            <strong>Travail de Fin d'Études (TFE)</strong> à l'
            <strong>EPHEC</strong>. L'étudiant développeur s'engage à respecter
            les mêmes standards de protection des données qu'une application
            professionnelle, conformément au RGPD et à la législation belge
            applicable.
          </p>
          <p className="text-gray-300 leading-relaxed mt-4">
            Dans le cadre de ce TFE, les données collectées sont exclusivement
            utilisées à des fins pédagogiques et de démonstration technique.
            Elles ne font l'objet d'aucune exploitation commerciale.
          </p>
        </div>

        {/* Introduction */}
        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 mb-8 border border-white/20">
          <h2 className="text-2xl font-semibold text-white mb-4">
            1. Introduction
          </h2>
          <p className="text-gray-300 leading-relaxed">
            Virtuo Piano s'engage à protéger la vie privée de ses utilisateurs.
            Cette politique de confidentialité décrit,{' '}
            <strong>conformément à l'Article 13 du RGPD</strong>, comment nous
            collectons, utilisons, stockons et protégeons vos informations
            personnelles conformément au Règlement Général sur la Protection des
            Données (RGPD) et à la législation belge applicable.
          </p>
          <p className="text-gray-300 leading-relaxed mt-4">
            En utilisant Virtuo Piano, vous acceptez les pratiques décrites dans
            cette politique de confidentialité.
          </p>
        </div>

        {/* Responsable du traitement */}
        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 mb-8 border border-white/20">
          <h2 className="text-2xl font-semibold text-white mb-4">
            2. Responsable du traitement
          </h2>
          <div className="bg-white/5 rounded-lg p-4">
            <p className="text-white font-semibold mb-2">Virtuo Piano</p>
            <p className="text-gray-300">
              Développé par : Devroye Lilian - Étudiant EPHEC en technologies de
              l'informatique
            </p>
            <p className="text-gray-300">
              Email :{' '}
              <a
                href="mailto:virtuopiano1@gmail.com"
                className="text-orange-400 hover:text-orange-300 underline cursor-pointer"
              >
                virtuopiano1@gmail.com
              </a>
            </p>
            <p className="text-gray-300">
              Contexte : Travail de Fin d'Études (TFE) - EPHEC
            </p>
          </div>
        </div>

        {/* Données collectées */}
        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 mb-8 border border-white/20">
          <h2 className="text-2xl font-semibold text-white mb-4">
            3. Données personnelles collectées
          </h2>

          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-semibold text-white mb-3">
                3.1 Données collectées lors de l'inscription
              </h3>
              <ul className="space-y-2 text-gray-300">
                <li className="flex items-start gap-2">
                  <span className="text-purple-400 mt-1">•</span>
                  <span>
                    <strong>Nom d'utilisateur</strong> : Identifiant pour votre
                    compte
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-purple-400 mt-1">•</span>
                  <span>
                    <strong>Adresse email</strong> : Pour l'authentification et
                    la communication
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-purple-400 mt-1">•</span>
                  <span>
                    <strong>Mot de passe</strong> : Hashé de manière sécurisée
                    avec Argon2
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-purple-400 mt-1">•</span>
                  <span>
                    <strong>
                      Consentement à la politique de confidentialité
                    </strong>{' '}
                    : Horodaté
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-purple-400 mt-1">•</span>
                  <span>
                    <strong>Dernière date de connexion</strong> : utilisée pour
                    déterminer l'activité du compte
                  </span>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-white mb-3">
                3.2 Données collectées lors de l'utilisation
              </h3>
              <ul className="space-y-2 text-gray-300">
                <li className="flex items-start gap-2">
                  <span className="text-purple-400 mt-1">•</span>
                  <span>
                    <strong>Données de progression</strong> : Niveau, points
                    d'expérience (XP), scores
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-purple-400 mt-1">•</span>
                  <span>
                    <strong>Données de performance</strong> : Résultats des
                    exercices, temps de pratique
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-purple-400 mt-1">•</span>
                  <span>
                    <strong>Compositions personnelles</strong> : Morceaux créés
                    par l'utilisateur
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-purple-400 mt-1">•</span>
                  <span>
                    <strong>Favoris</strong> : Morceaux marqués comme favoris
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-purple-400 mt-1">•</span>
                  <span>
                    <strong>Imports</strong> : Fichiers MIDI et photos importés
                    par l'utilisateur
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-purple-400 mt-1">•</span>
                  <span>
                    <strong>Progression des défis</strong> : Avancement dans les
                    défis multi-niveaux
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-purple-400 mt-1">•</span>
                  <span>
                    <strong>Préférences</strong> : Paramètres personnalisés de
                    l'application
                  </span>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-white mb-3">
                3.3 Données techniques
              </h3>
              <ul className="space-y-2 text-gray-300">
                <li className="flex items-start gap-2">
                  <span className="text-purple-400 mt-1">•</span>
                  <span>
                    <strong>Cookies de session</strong> : Pour maintenir la
                    connexion (via NextAuth.js)
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-purple-400 mt-1">•</span>
                  <span>
                    <strong>Horodatage des connexions</strong> : Dernière date
                    de connexion stockée en base de données
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Finalités du traitement */}
        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 mb-8 border border-white/20">
          <h2 className="text-2xl font-semibold text-white mb-4">
            4. Finalités du traitement
          </h2>

          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-semibold text-white mb-3">
                4.1 Finalités principales
              </h3>
              <ul className="space-y-2 text-gray-300">
                <li className="flex items-start gap-2">
                  <span className="text-purple-400 mt-1">•</span>
                  <span>
                    <strong>Gestion du compte utilisateur</strong> : Création,
                    authentification, administration
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-purple-400 mt-1">•</span>
                  <span>
                    <strong>Fourniture du service</strong> : Accès à
                    l'application d'apprentissage du piano
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-purple-400 mt-1">•</span>
                  <span>
                    <strong>Suivi de progression</strong> : Analyse des
                    performances et recommandations
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-purple-400 mt-1">•</span>
                  <span>
                    <strong>Personnalisation</strong> : Adaptation de
                    l'expérience selon les préférences
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-purple-400 mt-1">•</span>
                  <span>
                    <strong>Support technique</strong> : Assistance et
                    résolution de problèmes
                  </span>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-white mb-3">
                4.2 Finalités secondaires
              </h3>
              <ul className="space-y-2 text-gray-300">
                <li className="flex items-start gap-2">
                  <span className="text-purple-400 mt-1">•</span>
                  <span>
                    <strong>Amélioration du service</strong> : Analyse
                    anonymisée des données d'usage
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-purple-400 mt-1">•</span>
                  <span>
                    <strong>Sécurité</strong> : Prévention des fraudes et
                    protection contre les abus
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-purple-400 mt-1">•</span>
                  <span>
                    <strong>Communication</strong> : Informations importantes
                    sur le service
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-purple-400 mt-1">•</span>
                  <span>
                    <strong>Conformité légale</strong> : Respect des obligations
                    réglementaires
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Base légale */}
        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 mb-8 border border-white/20">
          <h2 className="text-2xl font-semibold text-white mb-4">
            5. Base légale du traitement
          </h2>

          <div className="space-y-4">
            <div className="bg-white/5 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-white mb-2">
                5.1 Consentement (Art. 6.1.a RGPD)
              </h3>
              <ul className="space-y-1 text-gray-300">
                <li>• Collecte et traitement des données de progression</li>
                <li>• Utilisation des données pour la personnalisation</li>
                <li>• Communication marketing (si applicable)</li>
              </ul>
            </div>

            <div className="bg-white/5 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-white mb-2">
                5.2 Exécution du contrat (Art. 6.1.b RGPD)
              </h3>
              <ul className="space-y-1 text-gray-300">
                <li>• Gestion du compte utilisateur</li>
                <li>• Fourniture du service d'apprentissage</li>
                <li>• Support technique</li>
              </ul>
            </div>

            <div className="bg-white/5 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-white mb-2">
                5.3 Intérêt légitime (Art. 6.1.f RGPD)
              </h3>
              <ul className="space-y-1 text-gray-300">
                <li>• Amélioration du service</li>
                <li>• Sécurité et prévention des abus</li>
                <li>• Analyse anonymisée des performances</li>
              </ul>
            </div>

            <div className="bg-white/5 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-white mb-2">
                5.4 Obligation légale (Art. 6.1.c RGPD)
              </h3>
              <ul className="space-y-1 text-gray-300">
                <li>• Conservation des données pour des raisons fiscales</li>
                <li>• Réponse aux demandes des autorités compétentes</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Destinataires */}
        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 mb-8 border border-white/20">
          <h2 className="text-2xl font-semibold text-white mb-4">
            6. Destinataires des données
          </h2>

          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-semibold text-white mb-3">
                6.1 Destinataires internes
              </h3>
              <ul className="space-y-2 text-gray-300">
                <li className="flex items-start gap-2">
                  <span className="text-purple-400 mt-1">•</span>
                  <span>
                    <strong>Équipe de développement</strong> : Pour
                    l'amélioration du service
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-purple-400 mt-1">•</span>
                  <span>
                    <strong>Support technique</strong> : Pour l'assistance
                    utilisateur
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-purple-400 mt-1">•</span>
                  <span>
                    <strong>Équipe administrative</strong> : Pour la gestion des
                    comptes
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-purple-400 mt-1">•</span>
                  <span className="italic">
                    Les trois rôles sont joués par l'étudiant en charge du
                    projet
                  </span>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-white mb-3">
                6.2 Prestataires de services
              </h3>
              <ul className="space-y-2 text-gray-300">
                <li className="flex items-start gap-2">
                  <span className="text-purple-400 mt-1">•</span>
                  <span>
                    <strong>Hébergeur</strong> : Vercel
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-purple-400 mt-1">•</span>
                  <span>
                    <strong>Fournisseur de base de données</strong> : PostgreSQL
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-purple-400 mt-1">•</span>
                  <span>
                    <strong>Services d'authentification</strong> : NextAuth.js
                  </span>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-white mb-3">
                6.3 Destinataires externes
              </h3>
              <ul className="space-y-2 text-gray-300">
                <li className="flex items-start gap-2">
                  <span className="text-purple-400 mt-1">•</span>
                  <span>
                    <strong>Autorités compétentes</strong> : Sur demande légale
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-purple-400 mt-1">•</span>
                  <span>
                    <strong>Partenaires techniques</strong> : Dans le cadre de
                    l'amélioration du service
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-purple-400 mt-1">•</span>
                  <span>
                    <strong>Obligation académique</strong> : les données peuvent
                    être consultées par l'équipe pédagogique ou le jury
                    d'évaluation à des fins académiques
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Transferts de données */}
        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 mb-8 border border-white/20">
          <h2 className="text-2xl font-semibold text-white mb-4">
            7. Transferts de données
          </h2>
          <p className="text-gray-300 leading-relaxed">
            Tous les transferts de données sont effectués de manière sécurisée
            via des connexions chiffrées (HTTPS/TLS).
          </p>
        </div>

        {/* Durée de conservation */}
        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 mb-8 border border-white/20">
          <h2 className="text-2xl font-semibold text-white mb-4">
            8. Durée de conservation
          </h2>
          <div>
            <h3 className="text-xl font-semibold text-white mb-3">
              8.1 Données de compte
            </h3>
            <p className="text-gray-300 leading-relaxed">
              Conformément au principe de limitation de la conservation (article
              5.1.e RGPD) du RGPD et en accord avec des pratiques Green IT
              visant à réduire l'empreinte environnementale du stockage
              numérique.
            </p>
            <p className="text-gray-300 leading-relaxed mt-4">
              Les données sont conservées pendant la durée d'utilisation de
              l'Application et supprimées dans un délai maximum de 12 mois après
              la dernière utilisation, sauf obligation légale contraire.
            </p>
            <p className="text-gray-300 leading-relaxed mt-4">
              Vous serez notifié par mail 2 semaines avant la date prévue de
              suppression afin que vous puissiez, si vous le souhaitez,
              prolonger la conservation de votre compte en vous connectant avant
              leur effacement définitif.
            </p>
          </div>
        </div>

        {/* Sécurité */}
        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 mb-8 border border-white/20">
          <h2 className="text-2xl font-semibold text-white mb-4">
            9. Sécurité des données (Art. 32 RGPD)
          </h2>

          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-semibold text-white mb-3">
                9.1 Mesures techniques
              </h3>
              <ul className="space-y-2 text-gray-300">
                <li className="flex items-start gap-2">
                  <span className="text-green-400 mt-1">🔒</span>
                  <span>
                    <strong>Chiffrement</strong> : Données chiffrées en transit
                    (HTTPS) et au repos
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-400 mt-1">🔒</span>
                  <span>
                    <strong>Hachage des mots de passe</strong> : Algorithme
                    Argon2 sécurisé
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-400 mt-1">🔒</span>
                  <span>
                    <strong>Authentification</strong> : Sessions sécurisées avec
                    JWT
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-400 mt-1">🔒</span>
                  <span>
                    <strong>Accès restreint</strong> : Principe du moindre
                    privilège
                  </span>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-white mb-3">
                9.2 Headers de sécurité HTTP
              </h3>
              <p className="text-gray-300 mb-3">
                Nous mettons en place des headers de sécurité HTTP pour protéger
                vos données :
              </p>
              <ul className="space-y-2 text-gray-300">
                <li className="flex items-start gap-2">
                  <span className="text-blue-400 mt-1">🛡️</span>
                  <span>
                    <strong>Content-Security-Policy (CSP)</strong> : Empêche les
                    attaques XSS en contrôlant les ressources autorisées
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-400 mt-1">🛡️</span>
                  <span>
                    <strong>X-Frame-Options</strong> : Empêche le clickjacking
                    en interdisant l'intégration dans des iframes
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-400 mt-1">🛡️</span>
                  <span>
                    <strong>X-Content-Type-Options</strong> : Empêche le
                    MIME-sniffing pour éviter les attaques de type confusion
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-400 mt-1">🛡️</span>
                  <span>
                    <strong>Referrer-Policy</strong> : Contrôle les informations
                    de référence envoyées aux sites tiers
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-400 mt-1">🛡️</span>
                  <span>
                    <strong>Permissions-Policy</strong> : Limite l'accès aux
                    fonctionnalités sensibles du navigateur
                  </span>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-white mb-3">
                9.3 Middleware de sécurité
              </h3>
              <p className="text-gray-300 mb-3">
                Notre application utilise un middleware de sécurité qui :
              </p>
              <ul className="space-y-2 text-gray-300">
                <li className="flex items-start gap-2">
                  <span className="text-purple-400 mt-1">🔐</span>
                  <span>
                    <strong>Protection des routes</strong> : Vérifie
                    l'authentification pour toutes les pages et APIs protégées
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-purple-400 mt-1">🔐</span>
                  <span>
                    <strong>Validation des tokens</strong> : Vérifie la validité
                    des tokens JWT pour l'authentification
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-purple-400 mt-1">🔐</span>
                  <span>
                    <strong>Contrôle d'accès API</strong> : Valide les requêtes
                    API avec vérification du referer et des clés API
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-purple-400 mt-1">🔐</span>
                  <span>
                    <strong>Redirection sécurisée</strong> : Redirige
                    automatiquement vers la page de connexion si non authentifié
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-purple-400 mt-1">🔐</span>
                  <span>
                    <strong>Protection CSRF</strong> : Empêche les attaques
                    Cross-Site Request Forgery
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-purple-400 mt-1">🔐</span>
                  <span>
                    <strong>Gestion des sessions</strong> : Maintient des
                    sessions sécurisées avec NextAuth.js
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Droits RGPD */}
        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 mb-8 border border-white/20">
          <h2 className="text-2xl font-semibold text-white mb-4">
            10. Vos droits RGPD
          </h2>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-white/5 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-white mb-2">
                10.1 Droit d'accès (Art. 15 RGPD)
              </h3>
              <p className="text-gray-300 text-sm">
                Vous pouvez demander une copie de vos données personnelles et
                des informations sur leur traitement.
              </p>
            </div>

            <div className="bg-white/5 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-white mb-2">
                10.2 Droit de rectification (Art. 16 RGPD)
              </h3>
              <p className="text-gray-300 text-sm">
                Vous pouvez corriger ou compléter vos données personnelles
                inexactes ou incomplètes.
              </p>
            </div>

            <div className="bg-white/5 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-white mb-2">
                10.3 Droit à l'effacement (Art. 17 RGPD)
              </h3>
              <p className="text-gray-300 text-sm">
                Vous pouvez demander la suppression de vos données personnelles
                ("droit à l'oubli").
              </p>
            </div>

            <div className="bg-white/5 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-white mb-2">
                10.4 Droit à la portabilité (Art. 20 RGPD)
              </h3>
              <p className="text-gray-300 text-sm">
                Vous pouvez recevoir vos données dans un format structuré et les
                transférer à un autre responsable.
              </p>
            </div>

            <div className="bg-white/5 rounded-lg p-4 md:col-span-2">
              <h3 className="text-lg font-semibold text-white mb-2">
                10.5 Droit de retrait du consentement (Art. 7(3) RGPD)
              </h3>
              <p className="text-gray-300 text-sm">
                Vous pouvez retirer votre consentement à tout moment, sans
                affecter la licéité du traitement antérieur.
              </p>
            </div>
          </div>
        </div>

        {/* Exercice des droits */}
        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 mb-8 border border-white/20">
          <h2 className="text-2xl font-semibold text-white mb-4">
            11. Exercice de vos droits
          </h2>

          <div className="space-y-4">
            <div>
              <h3 className="text-xl font-semibold text-white mb-3">
                11.1 Contact principal
              </h3>
              <p className="text-gray-300">
                Pour exercer vos droits, rendez vous sur l'onglet "Mes données"
                via votre espace "Mon compte" dans l'application ou{' '}
                <button
                  onClick={() => setIsContactModalOpen(true)}
                  className="text-orange-400 hover:text-orange-300 underline cursor-pointer"
                >
                  prenez contact via ce formulaire
                </button>
                .
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-white/5 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-white mb-2">
                  11.2 Délais de réponse
                </h3>
                <p className="text-gray-300 text-sm">
                  Nous nous engageons à répondre à votre demande dans un délai
                  maximum de 30 jours.
                </p>
              </div>

              <div className="bg-white/5 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-white mb-2">
                  11.3 Gratuité
                </h3>
                <p className="text-gray-300 text-sm">
                  L'exercice de vos droits est gratuit, sauf en cas de demandes
                  manifestement infondées ou excessives.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Cookies */}
        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 mb-8 border border-white/20">
          <h2 className="text-2xl font-semibold text-white mb-4">
            12. Cookies et technologies similaires
          </h2>

          <div className="space-y-4">
            <div className="bg-white/5 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-white mb-2">
                12.1 Cookies de session
              </h3>
              <ul className="space-y-1 text-gray-300">
                <li>
                  • <strong>Finalité</strong> : Maintien de la session
                  utilisateur
                </li>
                <li>
                  • <strong>Durée</strong> : 1 heure maximum
                </li>
                <li>
                  • <strong>Désactivation</strong> : Possible via les paramètres
                  du navigateur
                </li>
              </ul>
            </div>

            <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-green-300 mb-2">
                12.2 Cookies analytiques ou publicitaires
              </h3>
              <p className="text-green-200 text-sm">
                <strong>Virtuo Piano n'utilise pas</strong> de cookies
                publicitaires ni de suivi marketing.
              </p>
            </div>
          </div>
        </div>

        {/* Modifications */}
        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 mb-8 border border-white/20">
          <h2 className="text-2xl font-semibold text-white mb-4">
            14. Modifications de la politique
          </h2>

          <div className="space-y-4">
            <div>
              <h3 className="text-xl font-semibold text-white mb-3">
                14.1 Notification des changements
              </h3>
              <p className="text-gray-300">
                Nous nous réservons le droit de modifier cette politique de
                confidentialité.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-white mb-3">
                14.2 Acceptation des modifications
              </h3>
              <p className="text-gray-300">
                La poursuite de l'utilisation du service après modification de
                la politique constitue une acceptation des nouvelles conditions.
              </p>
            </div>
          </div>
        </div>

        {/* Contact */}
        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 mb-8 border border-white/20">
          <h2 className="text-2xl font-semibold text-white mb-4">
            15. Contact et réclamations
          </h2>

          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-semibold text-white mb-3">
                15.1 Contact principal
              </h3>
              <div className="bg-white/5 rounded-lg p-4">
                <p className="text-white font-semibold mb-2">Virtuo Piano</p>
                <p className="text-gray-300">
                  Email :{' '}
                  <a
                    href="mailto:virtuoPiano1@gmail.com"
                    className="text-orange-400 hover:text-orange-300 underline cursor-pointer"
                  >
                    virtuopiano1@gmail.com
                  </a>
                </p>
                <p className="text-gray-300">
                  Adresse : 4 montée de la chapelle, Itzig
                </p>
              </div>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-white mb-3">
                15.2 Autorité de contrôle
              </h3>
              <p className="text-gray-300 mb-3">
                En cas de litige, vous pouvez déposer une plainte auprès de
                l'Autorité de protection des données belge :
              </p>
              <div className="bg-white/5 rounded-lg p-4">
                <p className="text-gray-300">
                  <strong>Adresse</strong> : Rue de la Presse 35, 1000 Bruxelles
                </p>
                <p className="text-gray-300">
                  <strong>Email</strong> :{' '}
                  <a
                    href="mailto:contact@apd-gba.be"
                    className="text-orange-400 hover:text-orange-300 underline cursor-pointer"
                  >
                    contact@apd-gba.be
                  </a>
                </p>
                <p className="text-gray-300">
                  <strong>Site web</strong> :{' '}
                  <a
                    href="https://www.autoriteprotectiondonnees.be"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-orange-400 hover:text-orange-300 underline cursor-pointer"
                  >
                    https://www.autoriteprotectiondonnees.be
                  </a>
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Dispositions finales */}
        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 mb-8 border border-white/20">
          <h2 className="text-2xl font-semibold text-white mb-4">
            16. Dispositions finales
          </h2>

          <div className="space-y-4">
            <div className="bg-white/5 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-white mb-2">
                16.1 Droit applicable
              </h3>
              <p className="text-gray-300 text-sm">
                Cette politique est régie par le droit belge et le RGPD.
              </p>
            </div>

            <div className="bg-white/5 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-white mb-2">
                16.2 Juridiction
              </h3>
              <p className="text-gray-300 text-sm">
                En cas de litige, les tribunaux belges sont seuls compétents.
              </p>
            </div>

            <div className="bg-white/5 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-white mb-2">
                16.3 Entrée en vigueur
              </h3>
              <p className="text-gray-300 text-sm">
                Cette politique de confidentialité entre en vigueur à compter de
                sa publication.
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center py-8">
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
            <p className="text-white font-semibold mb-2">Virtuo Piano</p>
            <p className="text-gray-300 text-sm">
              s'engage à respecter scrupuleusement cette politique de
              confidentialité et à protéger vos données personnelles avec le
              plus grand soin.
            </p>
          </div>
        </div>
      </div>

      {/* Modale de contact */}
      <ContactModal
        isOpen={isContactModalOpen}
        onClose={() => setIsContactModalOpen(false)}
      />
    </div>
  );
}
