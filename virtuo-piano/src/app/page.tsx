import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/authoption';
import prisma from '@/lib/prisma';

import LandingPage from './landingPage/page';
import { User } from '@/common/types';

export default async function Home() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect('/auth/register');
  }

  return <LandingPage />;
}
