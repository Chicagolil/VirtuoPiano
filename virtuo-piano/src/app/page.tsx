import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/authoption';

import LandingPage from './landingPage/page';
// vercel redeploy
export default async function Home() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect('/auth/register');
  }

  return <LandingPage />;
}
