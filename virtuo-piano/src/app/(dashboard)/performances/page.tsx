import { PerformanceBento } from '@/features/BentoGrid/PerformanceBento';
import { authOptions } from '@/lib/authoption';
import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';

export default async function PerformancesPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    redirect('/auth/login');
  }

  return <div>{<PerformanceBento />}</div>;
}
