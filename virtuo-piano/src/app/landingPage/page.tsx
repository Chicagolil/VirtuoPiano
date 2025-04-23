'use client';

import Card from '@/components/utils/Card';
import styles from './landingPage.module.css';

import { Star, Medal, ChartLine, FileMusic, FolderUp } from 'lucide-react';
import React from 'react';

import MusicNotes from '@/components/ui/MusicNotes';
import SignOutButton from '@/components/SignOutButton';

export default function LandingPage() {
  return (
    <div className={`${styles.container}`}>
      <MusicNotes />

      <div className={styles.cardsContainer}>
        <Card
          text="Librairie"
          activeColor="#e0f2fe"
          icon={<FileMusic size={45} />}
          href="/library"
          pixelProps={{
            colors: ['#e0f2fe', '#7dd3fc', '#0ea5e9', '#fef08a', '#fde047'],
            gap: 10,
            speed: 25,
          }}
        />
        <Card
          text="Classement"
          activeColor="#e0f2fe"
          icon={<Medal size={45} />}
          href="/leaderboard"
          pixelProps={{
            colors: ['#e0f2fe', '#7dd3fc', '#0ea5e9', '#fef08a', '#fde047'],
            gap: 10,
            speed: 25,
          }}
        />
        <Card
          text="Performances"
          activeColor="#e0f2fe"
          icon={<ChartLine size={45} />}
          href="/performances"
          pixelProps={{
            colors: ['#e0f2fe', '#7dd3fc', '#0ea5e9', '#fef08a', '#fde047'],
            gap: 10,
            speed: 25,
          }}
        />
        <Card
          text="Favoris"
          activeColor="#e0f2fe"
          icon={<Star size={45} />}
          href="/favorites"
          pixelProps={{
            colors: ['#e0f2fe', '#7dd3fc', '#0ea5e9', '#fef08a', '#fde047'],
            gap: 10,
            speed: 25,
          }}
        />
        <Card
          text="Mes Chansons"
          activeColor="#e0f2fe"
          icon={<FolderUp size={45} />}
          href="/imports"
          pixelProps={{
            colors: ['#e0f2fe', '#7dd3fc', '#0ea5e9', '#fef08a', '#fde047'],
            gap: 10,
            speed: 25,
          }}
        />

        <SignOutButton />
      </div>
    </div>
  );
}
