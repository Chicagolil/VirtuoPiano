'use client';

import { useState } from 'react';
import styles from './Footer.module.css';
import ContactModal from '@/components/modals/ContactModal';
import AboutModal from '@/components/modals/AboutModal';
import HelpModal from '@/components/modals/HelpModal';

export default function Footer() {
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [isAboutModalOpen, setIsAboutModalOpen] = useState(false);
  const [isHelpModalOpen, setIsHelpModalOpen] = useState(false);

  return (
    <>
      <div className={styles.footer}>
        <div className={styles.container}>
          <div className={styles.copyright}>
            © 2024 Virtuo Piano. Tous droits réservés.
          </div>
          <div className={styles.linkContainer}>
            <button
              onClick={() => setIsAboutModalOpen(true)}
              className={styles.link}
            >
              À propos
            </button>
            <button
              onClick={() => setIsHelpModalOpen(true)}
              className={styles.link}
            >
              Aide
            </button>
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

      <AboutModal
        isOpen={isAboutModalOpen}
        onClose={() => setIsAboutModalOpen(false)}
      />

      <HelpModal
        isOpen={isHelpModalOpen}
        onClose={() => setIsHelpModalOpen(false)}
      />
    </>
  );
}
