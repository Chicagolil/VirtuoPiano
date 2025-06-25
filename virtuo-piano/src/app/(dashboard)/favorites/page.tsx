import React from 'react';
import FavoritesBento from '@/features/BentoGrid/FavoritesBento';
import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { authOptions } from '@/lib/authoption';
import { getPracticeTimeComparison } from '@/lib/actions/generalStats-actions';

export default async function FavoritesPage() {
  const session = await getServerSession(authOptions);
  const res = await getPracticeTimeComparison('month');
  console.log(res);
  if (!session?.user?.id) {
    redirect('/auth/login');
  }
  return <div className="container mx-auto">{/* <FavoritesBento /> */}</div>;
}
