'use client';

import { useState } from 'react';
import styles from './Footer.module.css';
import ContactModal from '@/components/ContactModal';

export default function Footer() {
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);

  return (
    <>
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
            <button
              onClick={() => setIsContactModalOpen(true)}
              className={styles.link}
            >
              Contact
            </button>
          </div>
        </div>
      </div>

      <ContactModal
        isOpen={isContactModalOpen}
        onClose={() => setIsContactModalOpen(false)}
      />
    </>
  );
}
