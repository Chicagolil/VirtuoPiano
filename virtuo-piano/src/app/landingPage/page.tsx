'use client';

import SignOutButton from '@/components/SignOutButton';
import Card from '@/components/card/Card';
import { FaBook, FaVideo, FaUsers } from 'react-icons/fa';
import styles from './landingPage.module.css';
import { BsMusicPlayer } from 'react-icons/bs';
import { LuKeyboardMusic } from 'react-icons/lu';
import { Star } from 'lucide-react';

import CardHoverDemo from '@/components/card/CardHoverDemo';

export default function LandingPage() {
  return (
    <div className={`pixel-background ${styles.container}`}>
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
