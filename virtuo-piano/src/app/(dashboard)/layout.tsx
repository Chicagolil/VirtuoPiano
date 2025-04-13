'use client';

import Header from '@/features/layout/Header';
import NavbarContainer from '@/features/layout/NavbarContainer';
import Footer from '@/features/layout/Footer';
import styles from './layout.module.css';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className={styles.container}>
      <NavbarContainer />
      <div className={styles.mainContent}>
        <header className={styles.header}>
          <Header />
        </header>
        <main className={styles.main}>{children}</main>
        <footer className={styles.footer}>
          <Footer />
        </footer>
      </div>
    </div>
  );
}
