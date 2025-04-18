'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import styles from './Navbar.module.css';
import { LottieIconHandle } from '@/components/ui/LottieIcon';
import { useRef } from 'react';
import SignOutButton from '@/components/SignOutButton';
import { Size } from '@/common/constants/Size';

import dynamic from 'next/dynamic';

const LottieIcon = dynamic(() => import('@/components/ui/LottieIcon'), {
  ssr: false,
});

export default function Navbar() {
  const pathname = usePathname();
  const favoritesIconRef = useRef<LottieIconHandle>(null);
  const performancesIconRef = useRef<LottieIconHandle>(null);
  const importsIconRef = useRef<LottieIconHandle>(null);
  const libraryIconRef = useRef<LottieIconHandle>(null);
  const leaderboardIconRef = useRef<LottieIconHandle>(null);
  const iconSize = Size.M;

  return (
    <nav className={styles.nav}>
      <div className={styles.container}>
        <div className={styles.logo}>
          <Link href="/">Virtuo Piano</Link>
        </div>

        <ul className={styles.menu}>
          <li
            className={pathname === '/library' ? styles.active : ''}
            onMouseEnter={() => libraryIconRef.current?.replay()}
          >
            <Link href="/library">
              <span
                className={`${styles.menuItem} ${styles.menuItemWithIcon} ${
                  pathname === '/library' ? styles.active : ''
                }`}
              >
                <LottieIcon
                  ref={libraryIconRef}
                  src="/icons/Library.json"
                  loop={false}
                  autoplay={false}
                  width={iconSize}
                  height={iconSize}
                />
                Librairie
              </span>
            </Link>
          </li>

          <li
            className={pathname === '/favorites' ? styles.active : ''}
            onMouseEnter={() => favoritesIconRef.current?.play()}
            onMouseLeave={() => favoritesIconRef.current?.playReverse()}
          >
            <Link href="/favorites">
              <span
                className={`${styles.menuItem} ${styles.menuItemWithIcon} ${
                  pathname === '/favorites' ? styles.active : ''
                }`}
              >
                <LottieIcon
                  ref={favoritesIconRef}
                  src="/icons/favorites.json"
                  loop={false}
                  autoplay={false}
                  width={iconSize}
                  height={iconSize}
                />
                Favoris
              </span>
            </Link>
          </li>
          <li
            className={pathname === '/performances' ? styles.active : ''}
            onMouseEnter={() => performancesIconRef.current?.play()}
            onMouseLeave={() => performancesIconRef.current?.playReverse()}
          >
            <Link href="/performances">
              <span
                className={`${styles.menuItem} ${styles.menuItemWithIcon} ${
                  pathname === '/performances' ? styles.active : ''
                }`}
              >
                <LottieIcon
                  ref={performancesIconRef}
                  src="/icons/performances.json"
                  loop={false}
                  autoplay={false}
                  width={iconSize}
                  height={iconSize}
                />
                Performances
              </span>
            </Link>
          </li>
          <li
            className={pathname === '/leaderboard' ? styles.active : ''}
            onMouseEnter={() => leaderboardIconRef.current?.replay()}
          >
            <Link href="/leaderboard">
              <span
                className={`${styles.menuItem} ${styles.menuItemWithIcon} ${
                  pathname === '/leaderboard' ? styles.active : ''
                }`}
              >
                <LottieIcon
                  ref={leaderboardIconRef}
                  src="/icons/leaderBoard2.json"
                  loop={false}
                  autoplay={false}
                  width={iconSize}
                  height={iconSize}
                />
                Classement
              </span>
            </Link>
          </li>
          <li
            className={pathname === '/imports' ? styles.active : ''}
            onMouseEnter={() => importsIconRef.current?.play()}
            onMouseLeave={() => importsIconRef.current?.playReverse()}
          >
            <Link href="/imports">
              <span
                className={`${styles.menuItem} ${styles.menuItemWithIcon} ${
                  pathname === '/imports' ? styles.active : ''
                }`}
              >
                <LottieIcon
                  ref={importsIconRef}
                  src="/icons/mesChansons.json"
                  loop={false}
                  autoplay={false}
                  width={iconSize}
                  height={iconSize}
                />
                Mes Chansons
              </span>
            </Link>
          </li>
          <li className={pathname === '/pageTest' ? styles.active : ''}>
            <Link href="/pageTest">
              <span
                className={`${styles.menuItem} ${styles.menuItemWithIcon} ${
                  pathname === '/pageTest' ? styles.active : ''
                }`}
              >
                Page Test
              </span>
            </Link>
          </li>
        </ul>
      </div>
      <SignOutButton />
    </nav>
  );
}
