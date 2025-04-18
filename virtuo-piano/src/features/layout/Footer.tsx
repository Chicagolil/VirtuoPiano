import styles from './Footer.module.css';

export default function Footer() {
  return (
    <div className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.copyright}>
          © 2024 Virtuo Piano. Tous droits réservés.
        </div>
        <div className={styles.linkContainer}>
          <a href="#" className={styles.link}>
            À propos
          </a>
          <a href="#" className={styles.link}>
            Aide
          </a>
          <a href="#" className={styles.link}>
            Contact
          </a>
        </div>
      </div>
    </div>
  );
}
