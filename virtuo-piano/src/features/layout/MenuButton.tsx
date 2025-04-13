'use client';

import { Menu } from 'lucide-react';
import styles from './MenuButton.module.css';

interface MenuButtonProps {
  onToggle: (isOpen: boolean) => void;
  isOpen: boolean;
}

function MenuIcon() {
  return <Menu />;
}

export default function MenuButton({ onToggle, isOpen }: MenuButtonProps) {
  return (
    <button
      className={`${styles.menuButton} ${isOpen ? styles.open : ''}`}
      onClick={() => onToggle(!isOpen)}
      aria-label="Toggle menu"
    >
      <MenuIcon />
    </button>
  );
}
