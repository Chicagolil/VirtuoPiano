'use client';

import ConnexionForm from '@/features/auth/ConnexionForm';

export default function SignUp() {
  return (
    <main className="min-h-screen flex items-center justify-center p-4">
      <ConnexionForm isRegistered={false} />
    </main>
  );
}
