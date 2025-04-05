'use client';

import { signOut } from 'next-auth/react';

export default function SignOutButton() {
  return (
    <button
      onClick={() => signOut({ callbackUrl: '/auth/login' })}
      className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md transition-colors"
    >
      Se déconnecter
    </button>
  );
}
