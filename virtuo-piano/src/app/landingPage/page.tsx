'use client';

import Card from '@/components/utils/Card';
import styles from './landingPage.module.css';

import { Star, Medal, ChartLine, FileMusic } from 'lucide-react';
import React from 'react';

import MusicNotes from '@/features/musicNotes/MusicNotes';

export default function LandingPage() {
  return (
    <div className={`${styles.container}`}>
      <MusicNotes />

      <div className={styles.cardsContainer}>
        <Card
          text="Librairie"
          activeColor="#e0f2fe"
          icon={<FileMusic size={45} />}
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
          pixelProps={{
            colors: ['#e0f2fe', '#7dd3fc', '#0ea5e9', '#fef08a', '#fde047'],
            gap: 10,
            speed: 25,
          }}
        />
      </div>
    </div>
  );
}
