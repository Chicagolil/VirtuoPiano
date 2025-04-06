'use client';

import SignOutButton from '@/components/SignOutButton';
import Card from '@/components/utils/Card';
import { FaBook, FaVideo, FaUsers } from 'react-icons/fa';
import styles from './landingPage.module.css';
import { BsMusicPlayer } from 'react-icons/bs';
import { LuKeyboardMusic } from 'react-icons/lu';
import { Star, Sparkles } from 'lucide-react';
import { useEffect, useState } from 'react';
import React from 'react';

import CardHoverDemo from '@/components/utils/CardHoverDemo';

// Composant pour les notes de musique flottantes
const MusicNotes = () => {
  const [notes, setNotes] = useState<React.ReactNode[]>([]);

  useEffect(() => {
    // Créer 15 notes de musique avec des positions aléatoires
    const musicSymbols = ['♪', '♫', '♬', '♩', '♭', '♮', '♯'];
    const newNotes = Array.from({ length: 15 }, (_, i) => {
      const symbol =
        musicSymbols[Math.floor(Math.random() * musicSymbols.length)];
      const left = `${Math.random() * 100}%`;
      const delay = `${Math.random() * 15}s`;
      const duration = `${10 + Math.random() * 10}s`;

      return (
        <div
          key={i}
          className="music-note"
          style={{
            left,
            animationDelay: delay,
            animationDuration: duration,
          }}
        >
          {symbol}
        </div>
      );
    });

    setNotes(newNotes);
  }, []);

  return <div className="music-notes">{notes}</div>;
};

export default function LandingPage() {
  return (
    <div className={`${styles.container}`}>
      <MusicNotes />
      <h1 className={styles.title}>Virtuo Piano</h1>

      <div className={styles.cardsContainer}>
        <Card
          text="Librairie"
          icon={<BsMusicPlayer className={styles.icon} />}
        />

        <Card text="Leaderboard" icon={<FaBook className={styles.icon} />} />
        <Card
          text="Performances"
          icon={<LuKeyboardMusic className={styles.icon} />}
        />
        <Card text="Favoris" icon={<Star className={styles.icon} />} />

        <CardHoverDemo />
      </div>

      <div className={styles.signOutContainer}>
        <SignOutButton />
      </div>
    </div>
  );
}
