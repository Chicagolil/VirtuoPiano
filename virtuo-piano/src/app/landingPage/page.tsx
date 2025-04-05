'use client';

import SignOutButton from '@/components/SignOutButton';
import prisma from '@/lib/prisma';
import { User } from '@/common/types';
import Image from 'next/image';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import PixelCanvas from '@/components/PixelCanvas';

export default function LandingPage() {
  return (
    <div className="pixel-background">
      <PixelCanvas
        gap={8}
        speed={40}
        colors="#f8fafc, #f1f5f9, #cbd5e1, #94a3b8"
      />
    </div>
  );
}
