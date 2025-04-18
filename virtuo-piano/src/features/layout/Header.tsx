'use client';

import { usePathname } from 'next/navigation';
import styles from './Header.module.css';
import { getPageName } from '@/common/utils/function';

export default function Header() {
  const pathname = usePathname();

  return (
    <div className={styles.header}>
      <h1 className={styles.pageTitle}>{getPageName(pathname)}</h1>
    </div>
  );
}
