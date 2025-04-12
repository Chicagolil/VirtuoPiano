'use client';

import Link from 'next/link';
import styles from './Navbar.module.css';

export default function Navbar() {
  return (
    <nav className={styles.nav}>
      <div className={styles.container}>
        <div className={styles.logo}>
          <Link href="/">Logo</Link>
        </div>

        <ul className={styles.menu}>
          <ul className={styles.menu}>
            <Link href="/library">
              <li className={styles.menuItem}>Librairie</li>
            </Link>
            <Link href="/favorites">
              <li className={styles.menuItem}>Favoris</li>
            </Link>
            <Link href="/performances">
              <li className={styles.menuItem}>Performances</li>
            </Link>
            <Link href="/leaderboard">
              <li className={styles.menuItem}>Classement</li>
            </Link>
            <Link href="/imports">
              <li className={styles.menuItem}>Mes Chansons</li>
            </Link>
          </ul>
        </ul>
      </div>
    </nav>
  );
}
