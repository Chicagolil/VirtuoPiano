import { PerformanceBento } from '@/features/BentoGrid/PerformanceBento';
import { authOptions } from '@/lib/authoption';
import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import Heatmap from '@/components/ui/heatmap';
import { Suspense } from 'react';
import { Spinner } from '@/components/ui/spinner';
import { getHeatmapData } from '@/lib/actions/heatmap-actions';

export default async function PerformancesPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    redirect('/auth/login');
  }
  const { data, error } = await getHeatmapData(session.user.id, 2025);
  console.log(data);
  console.log(error);
  async function LoadPerformances({ userId }: { userId: string }) {
    // const performances = await getListPerformances(userId);
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
          <LoadPerformances userId={session.user.id} />
        </Suspense>
      </div>
    </div>
  );
}
