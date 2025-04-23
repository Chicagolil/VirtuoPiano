import ImportsBento from '@/features/BentoGrid/ImportsBento';
import { authOptions } from '@/lib/authoption';
import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';

export default async function ImportsPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    redirect('/auth/login');
  }
  return <div className="container mx-auto px-4">{/* <ImportsBento /> */}</div>;
}
