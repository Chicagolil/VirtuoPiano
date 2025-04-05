'use client';

import SignOutButton from '@/components/SignOutButton';
import prisma from '@/lib/prisma';
import { User } from '@/common/types';
import Image from 'next/image';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';

export default function LandingPage() {
  return (
    <div className="pixel-background">
      <h1>Hello</h1>
    </div>
  );
}
