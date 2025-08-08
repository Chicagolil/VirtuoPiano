'use server';

import { authOptions } from '../authoption';
import { getServerSession } from 'next-auth';

export async function getAuthenticatedUser() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    throw new Error('Utilisateur non authentifié');
  }

  return session.user;
}
