'use client';

import ConnexionForm from '@/features/auth/ConnexionForm';

export default function SignUp() {
  return (
    <main className="min-h-screen flex items-center justify-center p-4">
      <div className="max-w-sm w-full bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
        <h1 className="text-xl font-bold mb-4 text-center">Inscription</h1>
        <ConnexionForm isRegistered={false} />
      </div>
    </main>
  );
}
