import { FolderUp } from 'lucide-react';
import { authOptions } from '@/lib/authoption';
import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import SongImports from '@/features/imports/SongImports';

export default async function ImportsPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    redirect('/auth/login');
  }

  return (
    <div className="w-full p-4 pt-7">
      <SongImports />
    </div>
  );
}
