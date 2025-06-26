import React from 'react';
import FavoritesBento from '@/features/BentoGrid/FavoritesBento';
import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { authOptions } from '@/lib/authoption';
import { getPracticeTimeComparison } from '@/lib/actions/generalStats-actions';
import { getRecentSessions } from '@/lib/actions/history-actions';

export default async function FavoritesPage() {
  const session = await getServerSession(authOptions);
  const res = await getRecentSessions(3);
  console.log(res);
  if (!session?.user?.id) {
    redirect('/auth/login');
  }
  return <div className="container mx-auto">{/* <FavoritesBento /> */}</div>;
}
