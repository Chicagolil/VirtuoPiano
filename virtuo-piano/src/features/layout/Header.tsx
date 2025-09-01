'use client';

import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import styles from './Header.module.css';
import { getPageName } from '@/common/utils/function';
import { useSong } from '@/contexts/SongContext';

export default function Header() {
  const pathname = usePathname();
  const { currentSong } = useSong();
  const [isLoadingSong, setIsLoadingSong] = useState(false);

  // Détecter si nous sommes sur une page de chanson
  const isSongPage =
    pathname.startsWith('/library/') && pathname !== '/library';
  const isPerformancePage = pathname.startsWith('/performances/');
  const isPerformanceSessionPage = pathname.startsWith('/performances/session');

  useEffect(() => {
    // Sur la page de session, pas de titre de chanson à charger
    if (isPerformanceSessionPage) {
      setIsLoadingSong(false);
      return;
    }
    if (isSongPage || isPerformancePage) {
      // Si nous sommes sur une page nécessitant une chanson mais qu'aucune n'est chargée
      if (!currentSong) {
        setIsLoadingSong(true);
      } else {
        setIsLoadingSong(false);
      }
    } else {
      setIsLoadingSong(false);
    }
  }, [currentSong, isSongPage, isPerformancePage, isPerformanceSessionPage]);

  // Déterminer le titre à afficher
  const getDisplayTitle = () => {
    if (isPerformanceSessionPage) {
      return 'Session';
    }
    if ((isSongPage || isPerformancePage) && isLoadingSong) {
      return 'Chargement...';
    }
    return currentSong ? currentSong.title : getPageName(pathname);
  };

  // Afficher le compositeur si disponible
  const composer = currentSong?.composer || '';

  return (
    <div className={styles.header}>
      <h1 className={styles.pageTitle}>
        {getDisplayTitle()}
        {composer && !isLoadingSong && (
          <span className={styles.composer}> {composer}</span>
        )}
      </h1>
    </div>
  );
}
