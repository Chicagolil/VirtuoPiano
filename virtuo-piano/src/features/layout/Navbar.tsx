'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import styles from './Navbar.module.css';
import LordIcon, { FavoriteHeart } from '../../components/LordIcon';

// Dans votre composant :

export default function Navbar() {
  const pathname = usePathname();

  return (
    <nav className={styles.nav}>
      <div className={styles.container}>
        <div className={styles.logo}>
          <Link href="/">Virtuo Piano</Link>
        </div>

        <ul className={styles.menu}>
          <li className={pathname === '/library' ? styles.active : ''}>
            <Link href="/library">
              <span
                className={`${styles.menuItem} ${
                  pathname === '/library' ? styles.active : ''
                }`}
              >
                Librairie
              </span>
            </Link>
          </li>

          <li className={pathname === '/favorites' ? styles.active : ''}>
            <Link href="/favorites">
              <span
                className={`${styles.menuItem} ${
                  pathname === '/favorites' ? styles.active : ''
                }`}
              >
                Favoris
              </span>
            </Link>
          </li>
          <li className={pathname === '/performances' ? styles.active : ''}>
            <Link href="/performances">
              <span
                className={`${styles.menuItem} ${
                  pathname === '/performances' ? styles.active : ''
                }`}
              >
                Performances
              </span>
            </Link>
          </li>
          <li className={pathname === '/leaderboard' ? styles.active : ''}>
            <Link href="/leaderboard">
              <span
                className={`${styles.menuItem} ${
                  pathname === '/leaderboard' ? styles.active : ''
                }`}
              >
                Classement
              </span>
            </Link>
          </li>
          <li className={pathname === '/imports' ? styles.active : ''}>
            <Link href="/imports">
              <span
                className={`${styles.menuItem} ${
                  pathname === '/imports' ? styles.active : ''
                }`}
              >
                Mes Chansons
              </span>
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
}
