import React from 'react';
import LeaderboardBento from '@/features/BentoGrid/LeaderboardBento';
import { authOptions } from '@/lib/authoption';
import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';

export default async function LeaderboardPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    redirect('/auth/login');
  }

  return <div className="container mx-auto">{/* <LeaderboardBento /> */}</div>;
}
