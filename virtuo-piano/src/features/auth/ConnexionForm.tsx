'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { TextShimmer } from '@/components/ui/text-shimmer';
import { Spinner } from '@/components/ui/spinner';

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
      setError('Identifiants invalides');
    } else {
      router.push('/');
    }
    setLoading(false);
  };

  const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setLoading(true);

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
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || 'Une erreur est survenue');
      }

      router.push('/auth/login?registered=true');
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
      {isRegistered ? (
        <form onSubmit={handleLogin} className="space-y-4">
          <h2 className="text-2xl font-bold text-white mb-6 text-center">
            Connexion
          </h2>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-3 border border-gray-600 rounded bg-black/50 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
          <input
            type="password"
            placeholder="Mot de passe"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-3 border border-gray-600 rounded bg-black/50 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
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
                  variant="infinite"
                  size={20}
                  className="text-orange-300 [animation-duration:1.2s]"
                />
                <TextShimmer
                  duration={0.75}
                  className="font-medium [--base-color:theme(colors.orange.500)] [--base-gradient-color:theme(colors.orange.300)] dark:[--base-color:theme(colors.orange.600)] dark:[--base-gradient-color:theme(colors.orange.400)]"
                >
                  Connexion en cours...
                </TextShimmer>
              </div>
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
          <form className="space-y-6" onSubmit={handleRegister}>
            <div className="rounded-md shadow-sm space-y-4">
              <div>
                <label htmlFor="userName" className="sr-only">
                  Nom Utilisateur
                </label>
                <input
                  id="userName"
                  name="userName"
                  type="text"
                  required
                  className="appearance-none relative block w-full px-3 py-3 border border-gray-600 placeholder-gray-400 text-white bg-black/50 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent sm:text-sm"
                  placeholder="Nom d'utilisateur"
                />
              </div>
              <div>
                <label htmlFor="email" className="sr-only">
                  Adresse email
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className="appearance-none relative block w-full px-3 py-3 border border-gray-600 placeholder-gray-400 text-white bg-black/50 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent sm:text-sm"
                  placeholder="Adresse email"
                />
              </div>
              <div>
                <label htmlFor="password" className="sr-only">
                  Mot de passe
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="new-password"
                  required
                  className="appearance-none relative block w-full px-3 py-3 border border-gray-600 placeholder-gray-400 text-white bg-black/50 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent sm:text-sm"
                  placeholder="Mot de passe"
                />
              </div>
            </div>

            {error && (
              <div className="text-red-400 text-sm text-center">{error}</div>
            )}

            <div>
              <button
                type="submit"
                disabled={loading}
                className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 disabled:opacity-50 transition-colors"
              >
                {loading ? 'Création en cours...' : 'Créer un compte'}
              </button>
            </div>
          </form>
        </>
      )}
    </div>
  );
}
