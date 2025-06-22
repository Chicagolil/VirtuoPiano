import { PerformanceBento } from '@/features/BentoGrid/PerformanceBento';
import { authOptions } from '@/lib/authoption';
import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { Heatmap } from '@/features/performances/heatmap';
import { Suspense } from 'react';
import { Spinner } from '@/components/ui/spinner';
import { BentoShadcnExample } from '@/features/BentoGrid/BentoShadcnExample';

export default async function PerformancesPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    redirect('/auth/login');
  }

  async function LoadPerformances() {
    return (
      <div>
        <Heatmap />
      </div>
    );
  }
  return (
    <div>
      <div>
        <Suspense
          fallback={
            <div className="flex justify-center items-center h-64">
              <div className="flex flex-col items-center">
                <p className="text-white">Chargement des performances...</p>
                <Spinner variant="bars" size={32} className="text-white" />
              </div>
            </div>
          }
        >
          <LoadPerformances />
          <PerformanceBento />
          <BentoShadcnExample />
        </Suspense>
      </div>
    </div>
  );
}
