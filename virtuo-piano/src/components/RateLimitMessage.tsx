'use client';

import { useState, useEffect } from 'react';

interface RateLimitMessageProps {
  error: string;
  onReset?: () => void;
}

export default function RateLimitMessage({
  error,
  onReset,
}: RateLimitMessageProps) {
  const [timeRemaining, setTimeRemaining] = useState<number | null>(null);

  useEffect(() => {
    // Extraire le temps restant du message d'erreur
    const timeMatch = error.match(/Réessayez dans (\d+) minute/);
    if (timeMatch) {
      const minutes = parseInt(timeMatch[1]);
      setTimeRemaining(minutes * 60); // Convertir en secondes
    }
  }, [error]);

  useEffect(() => {
    if (timeRemaining && timeRemaining > 0) {
      const timer = setInterval(() => {
        setTimeRemaining((prev) => {
          if (prev && prev > 0) {
            return prev - 1;
          } else {
            if (onReset) {
              onReset();
            }
            return 0;
          }
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [timeRemaining, onReset]);

  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  if (!error.includes('Trop de tentatives échouées')) {
    return null;
  }

  return (
    <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 mb-4">
      <div className="flex items-center space-x-3">
        <div className="flex-shrink-0">
          <svg
            className="w-5 h-5 text-red-500"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
              clipRule="evenodd"
            />
          </svg>
        </div>
        <div className="flex-1">
          <h3 className="text-sm font-medium text-red-500">
            Trop de tentatives échouées
          </h3>
          <p className="text-sm text-red-400 mt-1">{error}</p>
          {timeRemaining && timeRemaining > 0 && (
            <div className="mt-2">
              <div className="flex items-center space-x-2">
                <div className="text-xs text-red-400">
                  Temps restant avant déblocage :
                </div>
                <div className="text-sm font-mono text-red-500 bg-red-500/10 px-2 py-1 rounded">
                  {formatTime(timeRemaining)}
                </div>
              </div>
              <div className="mt-2 w-full bg-red-500/20 rounded-full h-1">
                <div
                  className="bg-red-500 h-1 rounded-full transition-all duration-1000"
                  style={{
                    width: `${(timeRemaining / (30 * 60)) * 100}%`,
                  }}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
