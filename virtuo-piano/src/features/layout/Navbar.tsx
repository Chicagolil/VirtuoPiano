'use client';

import styles from './Navbar.module.css';
import { useRouter } from 'next/navigation';

export default function Navbar() {
  const router = useRouter();
  return (
    <nav className={styles.nav}>
      <div className={styles.container}>
        <div className={styles.logo} onClick={() => router.push('/')}>
          Logo
        </div>
        <ul className={styles.menu}>
          <li className={styles.menuItem}>Accueil</li>
          <li className={styles.menuItem}>Dashboard</li>
          <li className={styles.menuItem}>Paramètres</li>
        </ul>
      </div>
    </nav>
  );
}
