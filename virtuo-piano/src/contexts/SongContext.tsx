'use client';

import { Songs } from '@prisma/client';
import React, { createContext, useContext, useState, ReactNode } from 'react';

type SongContextType = {
  currentSong: Songs | null;
  setCurrentSong: (song: Songs | null) => void;
};

const SongContext = createContext<SongContextType | undefined>(undefined);

export function SongProvider({ children }: { children: ReactNode }) {
  const [currentSong, setCurrentSong] = useState<Songs | null>(null);

  return (
    <SongContext.Provider value={{ currentSong, setCurrentSong }}>
      {children}
    </SongContext.Provider>
  );
}

export function useSong() {
  const context = useContext(SongContext);
  if (context === undefined) {
    throw new Error('useSong must be used within a SongProvider');
  }
  return context;
}
