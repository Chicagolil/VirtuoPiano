import { useEffect, useState } from 'react';

export default function MusicNotes() {
  const [notes, setNotes] = useState<React.ReactNode[]>([]);

  useEffect(() => {
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
}
