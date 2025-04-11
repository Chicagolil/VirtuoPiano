import styles from './Header.module.css';

export default function Header() {
  return (
    <div className={styles.header}>
      <div className={styles.title}>Virtuo Piano</div>
      <div className={styles.navItems}>
        {/* Ajoutez ici les éléments du header (profil, notifications, etc.) */}
        <div>Notifications</div>
        <div>Profil</div>
      </div>
    </div>
  );
}
