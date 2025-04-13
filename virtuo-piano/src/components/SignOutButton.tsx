'use client';

import { signOut } from 'next-auth/react';
import styles from './SignOutButton.module.css';
import { LottieIconHandle } from './ui/LottieIcon';
import { Size } from '@/common/constants/Size';
import { useRef } from 'react';

import dynamic from 'next/dynamic';

const LottieIcon = dynamic(() => import('@/components/ui/LottieIcon'), {
  ssr: false,
});

export default function SignOutButton() {
  const iconSize = Size.S;
  const signOutIconRef = useRef<LottieIconHandle>(null);
  return (
    <button
      onClick={() => signOut({ callbackUrl: '/auth/login' })}
      className={styles.signOutButton}
      onMouseEnter={() => signOutIconRef.current?.play()}
      onMouseLeave={() => signOutIconRef.current?.stop()}
    >
      <span className={styles.icon}>
        <LottieIcon
          ref={signOutIconRef}
          src="/icons/logOut.json"
          loop={true}
          autoplay={false}
          width={iconSize}
          height={iconSize}
        />
      </span>
      <span className={styles.text}>Se Déconnecter</span>
    </button>
  );
}
