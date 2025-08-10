export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-orange-400">
          Politique de Confidentialité
        </h1>

        <div className="space-y-6 text-gray-300">
          <section>
            <h2 className="text-xl font-semibold mb-4 text-white">
              1. Collecte des données
            </h2>
            <p className="mb-4">
              Virtuo Piano collecte les informations suivantes lors de votre
              inscription :
            </p>
            <ul className="list-disc ml-6 space-y-2">
              <li>Adresse email</li>
              <li>Nom d'utilisateur</li>
              <li>Mot de passe (hashé de manière sécurisée)</li>
              <li>Données de progression (scores, niveaux, XP)</li>
              <li>Préférences et paramètres</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-4 text-white">
              2. Utilisation des données
            </h2>
            <p className="mb-4">Vos données sont utilisées pour :</p>
            <ul className="list-disc ml-6 space-y-2">
              <li>Gérer votre compte et authentification</li>
              <li>Suivre votre progression d'apprentissage</li>
              <li>Personnaliser votre expérience</li>
              <li>Améliorer nos services</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-4 text-white">
              3. Vos droits RGPD
            </h2>
            <p className="mb-4">
              Conformément au RGPD, vous disposez des droits suivants :
            </p>
            <ul className="list-disc ml-6 space-y-2">
              <li>
                <strong>Droit d'accès :</strong> Consulter vos données
                personnelles
              </li>
              <li>
                <strong>Droit de rectification :</strong> Corriger vos
                informations
              </li>
              <li>
                <strong>Droit d'effacement :</strong> Supprimer votre compte
              </li>
              <li>
                <strong>Droit d'opposition :</strong> Retirer votre consentement
              </li>
              <li>
                <strong>Droit à la portabilité :</strong> Exporter vos données
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-4 text-white">
              4. Sécurité
            </h2>
            <p>
              Nous mettons en œuvre des mesures de sécurité appropriées pour
              protéger vos données :
            </p>
            <ul className="list-disc ml-6 space-y-2 mt-4">
              <li>Chiffrement des mots de passe avec Argon2</li>
              <li>Accès sécurisé aux données</li>
              <li>Surveillance continue de la sécurité</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-4 text-white">
              5. Contact
            </h2>
            <p>
              Pour toute question concernant cette politique de confidentialité
              ou l'exercice de vos droits RGPD, vous pouvez nous contacter via
              votre espace "Mon compte".
            </p>
          </section>

          <div className="bg-orange-500/10 border border-orange-500/30 rounded-lg p-4 mt-8">
            <p className="text-orange-300 text-sm">
              <strong>Note :</strong> Cette politique de confidentialité est en
              cours de développement. Une version complète sera bientôt
              disponible.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
