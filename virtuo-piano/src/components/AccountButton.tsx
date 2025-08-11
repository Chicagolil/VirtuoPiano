'use client';

import Link from 'next/link';
import styles from './AccountButton.module.css';
import { LottieIconHandle } from './ui/LottieIcon';
import { Size } from '@/common/constants/Size';
import { useRef } from 'react';

import dynamic from 'next/dynamic';

const LottieIcon = dynamic(() => import('@/components/ui/LottieIcon'), {
  ssr: false,
});

export default function AccountButton() {
  const iconSize = Size.S;
  const accountIconRef = useRef<LottieIconHandle>(null);
  return (
    <Link href="/account" className={styles.accountButton}>
      <button
        className={styles.button}
        onMouseEnter={() => accountIconRef.current?.play()}
        onMouseLeave={() => accountIconRef.current?.stop()}
      >
        <span className={styles.icon}>
          <LottieIcon
            ref={accountIconRef}
            src="/icons/Settings_Icon.json"
            loop={true}
            autoplay={false}
            width={iconSize}
            height={iconSize}
          />
        </span>
        <span className={styles.text}>Mon Compte</span>
      </button>
    </Link>
  );
}
