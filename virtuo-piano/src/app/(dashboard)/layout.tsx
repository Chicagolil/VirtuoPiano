import Header from '@/features/layout/Header';
import Navbar from '@/features/layout/Navbar';
import Footer from '@/features/layout/Footer';
import styles from './layout.module.css';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className={styles.container}>
      <div className={styles.navbar}>
        <Navbar />
      </div>

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
