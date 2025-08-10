'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { TextShimmer } from '@/components/ui/text-shimmer';
import { Spinner } from '@/components/ui/spinner';
import { toast } from 'react-hot-toast';

export default function ConnexionForm({
  isRegistered,
}: {
  isRegistered: boolean;
}) {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [isRegisteredState, setIsRegistered] = useState(isRegistered);
  const [privacyConsent, setPrivacyConsent] = useState(false);
  const [showPrivacyConsent, setShowPrivacyConsent] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const res = await signIn('credentials', {
      email,
      password,
      redirect: false,
    });

    if (res?.error) {
      if (res.error === 'PRIVACY_CONSENT_REQUIRED') {
        setShowPrivacyConsent(true);
        setError(
          'Vous devez accepter la politique de confidentialité pour vous connecter.'
        );
      } else {
        setError('Identifiants invalides');
      }
    } else {
      router.push('/');
    }
    setLoading(false);
  };

  const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Vérifier le consentement à la politique de confidentialité
    if (!privacyConsent) {
      setError(
        'Vous devez accepter la politique de confidentialité pour continuer'
      );
      setLoading(false);
      return;
    }

    const formData = new FormData(e.currentTarget);
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;
    const userName = formData.get('userName') as string;

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          password,
          userName,
          privacyConsent: true,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || 'Une erreur est survenue');
      }

      setIsRegistered(true);
      toast.success('Compte créé avec succès');
    } catch (error) {
      setError(
        error instanceof Error ? error.message : 'Une erreur est survenue'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleUpdatePrivacyConsent = async () => {
    if (!privacyConsent) {
      setError(
        'Vous devez accepter la politique de confidentialité pour continuer'
      );
      return;
    }

    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/auth/update-privacy-consent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          password,
          privacyConsent: true,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || 'Une erreur est survenue');
      }

      setShowPrivacyConsent(false);
      setPrivacyConsent(false);
      toast.success('Politique de confidentialité acceptée avec succès');

      // Rediriger vers la page d'accueil
      router.push('/');
    } catch (error) {
      setError(
        error instanceof Error ? error.message : 'Une erreur est survenue'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-black/30 backdrop-blur-sm p-8 rounded-lg shadow-xl max-w-md mx-auto">
      <div className="flex justify-center gap-4 mb-6">
        <button
          onClick={() => setIsRegistered(true)}
          className={`px-4 py-2 rounded-md transition-all duration-300 cursor-pointer ${
            isRegisteredState
              ? 'bg-orange-600 hover:bg-orange-700 transform -translate-y-1 shadow-[-1px_1px_rgb(206,115,23)] shadow-lg'
              : 'bg-black/50 hover:bg-black/70'
          } text-white`}
        >
          Connexion
        </button>
        <button
          onClick={() => setIsRegistered(false)}
          className={`px-4 py-2 rounded-md transition-all duration-300 cursor-pointer ${
            !isRegisteredState
              ? 'bg-orange-600 hover:bg-orange-700 transform -translate-y-1 shadow-[-1px_1px_rgb(206,115,23)] shadow-lg'
              : 'bg-black/50 hover:bg-black/70'
          } text-white`}
        >
          Inscription
        </button>
      </div>
      {isRegisteredState ? (
        <form onSubmit={handleLogin} className="space-y-4">
          <h2 className="text-2xl font-bold text-white mb-6 text-center">
            Connexion
          </h2>
          <input
            id="email"
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-3 border border-gray-600 rounded bg-black/50 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
          <input
            id="password"
            type="password"
            placeholder="Mot de passe"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-3 border border-gray-600 rounded bg-black/50 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500"
          />

          {/* Checkbox pour le consentement à la politique de confidentialité (affichée seulement si nécessaire) */}
          {showPrivacyConsent && (
            <div className="flex items-start gap-3 p-3 border border-orange-500/50 rounded bg-orange-500/10">
              <input
                id="privacyConsentLogin"
                type="checkbox"
                checked={privacyConsent}
                onChange={(e) => setPrivacyConsent(e.target.checked)}
                className="mt-1 w-4 h-4 text-orange-600 bg-black/50 border border-gray-600 rounded focus:ring-orange-500 focus:ring-2 cursor-pointer"
                required
              />
              <label
                htmlFor="privacyConsentLogin"
                className="text-white/90 text-sm cursor-pointer"
              >
                J'accepte la{' '}
                <a
                  href="/privacy-policy"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-orange-400 hover:text-orange-300 underline"
                >
                  politique de confidentialité
                </a>{' '}
                et j'autorise le traitement de mes données personnelles
                conformément au RGPD.
              </label>
            </div>
          )}

          <button
            type={showPrivacyConsent ? 'button' : 'submit'}
            onClick={
              showPrivacyConsent ? handleUpdatePrivacyConsent : undefined
            }
            disabled={loading}
            className={`w-full p-3 rounded font-medium transition-colors ${
              loading
                ? 'bg-orange-700 cursor-not-allowed'
                : 'bg-orange-600 hover:bg-orange-700'
            } text-white`}
          >
            {loading ? (
              <div className="flex items-center justify-center gap-2">
                <Spinner
                  variant="bars"
                  size={20}
                  className="text-orange-300 [animation-duration:1.2s]"
                />
                <TextShimmer
                  duration={0.75}
                  className="font-medium [--base-color:theme(colors.orange.500)] [--base-gradient-color:theme(colors.orange.300)] dark:[--base-color:theme(colors.orange.600)] dark:[--base-gradient-color:theme(colors.orange.400)]"
                >
                  {showPrivacyConsent
                    ? 'Mise à jour en cours...'
                    : 'Connexion en cours...'}
                </TextShimmer>
              </div>
            ) : showPrivacyConsent ? (
              'Accepter et se connecter'
            ) : (
              'Se connecter'
            )}
          </button>
          {error && <p className="text-red-400 text-sm">{error}</p>}
        </form>
      ) : (
        <>
          <div>
            <h2 className="text-2xl font-bold text-white mb-6 text-center">
              Créer un compte
            </h2>
          </div>
          <form className="space-y-4" onSubmit={handleRegister}>
            <div className="space-y-4">
              <input
                id="userName"
                name="userName"
                type="text"
                required
                className="w-full p-3 border border-gray-600 rounded bg-black/50 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500"
                placeholder="Nom d'utilisateur"
              />
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="w-full p-3 border border-gray-600 rounded bg-black/50 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500"
                placeholder="Adresse email"
              />
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="new-password"
                required
                className="w-full p-3 border border-gray-600 rounded bg-black/50 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500"
                placeholder="Mot de passe"
              />
            </div>

            {/* Checkbox pour le consentement à la politique de confidentialité */}
            <div className="flex items-start gap-3 p-3 border border-gray-600 rounded bg-black/30">
              <input
                id="privacyConsent"
                type="checkbox"
                checked={privacyConsent}
                onChange={(e) => setPrivacyConsent(e.target.checked)}
                className="mt-1 w-4 h-4 text-orange-600 bg-black/50 border border-gray-600 rounded focus:ring-orange-500 focus:ring-2 cursor-pointer"
                required
              />
              <label
                htmlFor="privacyConsent"
                className="text-white/80 text-sm cursor-pointer"
              >
                J'accepte la{' '}
                <a
                  href="/privacy-policy"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-orange-400 hover:text-orange-300 underline"
                >
                  politique de confidentialité
                </a>{' '}
                et j'autorise le traitement de mes données personnelles
                conformément au RGPD.
              </label>
            </div>

            {error && <p className="text-red-400 text-sm">{error}</p>}

            <button
              type="submit"
              disabled={loading}
              className={`w-full p-3 rounded font-medium transition-colors ${
                loading
                  ? 'bg-orange-700 cursor-not-allowed'
                  : 'bg-orange-600 hover:bg-orange-700'
              } text-white`}
            >
              {loading ? (
                <div className="flex items-center justify-center gap-2">
                  <Spinner
                    variant="bars"
                    size={20}
                    className="text-orange-300 [animation-duration:1.2s]"
                  />
                  <TextShimmer
                    duration={0.75}
                    className="font-medium [--base-color:theme(colors.orange.500)] [--base-gradient-color:theme(colors.orange.300)] dark:[--base-color:theme(colors.orange.600)] dark:[--base-gradient-color:theme(colors.orange.400)]"
                  >
                    Création en cours...
                  </TextShimmer>
                </div>
              ) : (
                'Créer un compte'
              )}
            </button>
          </form>
        </>
      )}
    </div>
  );
}
