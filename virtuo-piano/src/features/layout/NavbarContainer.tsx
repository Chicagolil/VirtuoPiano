'use client';

import { useState } from 'react';
import Navbar from './Navbar';
import MenuButton from './MenuButton';
import styles from './NavbarContainer.module.css';

export default function NavbarContainer() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <div className={`${styles.navbar} ${isOpen ? styles.open : ''}`}>
        <Navbar />
      </div>
      <MenuButton onToggle={setIsOpen} isOpen={isOpen} />
    </>
  );
}
