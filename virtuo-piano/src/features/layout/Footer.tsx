import styles from './Footer.module.css';

export default function Footer() {
  return (
    <div className={styles.footer}>
      <div className={styles.copyright}>
        © 2024 Virtuo Piano. Tous droits réservés.
      </div>
    </div>
  );
}
