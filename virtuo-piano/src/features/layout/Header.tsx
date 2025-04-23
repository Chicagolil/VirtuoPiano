'use client';

import { usePathname } from 'next/navigation';
import styles from './Header.module.css';
import { getPageName } from '@/common/utils/function';
import { useSong } from '@/contexts/SongContext';

export default function Header() {
  const pathname = usePathname();
  const { currentSong } = useSong();

  // Utiliser le titre de la chanson si disponible, sinon utiliser le nom de la page
  const pageTitle = currentSong ? currentSong.title : getPageName(pathname);

  // Afficher le compositeur si disponible
  const composer = currentSong?.composer || '';

  return (
    <div className={styles.header}>
      <h1 className={styles.pageTitle}>
        {pageTitle}
        {composer && <span className={styles.composer}> {composer}</span>}
      </h1>
    </div>
  );
}
