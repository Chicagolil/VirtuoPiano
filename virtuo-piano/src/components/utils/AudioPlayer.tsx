'use client';

import {
  IconPlayerPause,
  IconPlayerPlay,
  IconVolume,
} from '@tabler/icons-react';

import { IconVolumeOff } from '@tabler/icons-react';
import React, { useState } from 'react';

import styles from './AudioPlayer.module.css';
// Composant de lecteur audio
const AudioPlayer = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState('0:00');
  const [duration, setDuration] = useState('0:00');
  const [volume, setVolume] = useState(0.8);
  const [isMuted, setIsMuted] = useState(false);
  const audioRef = React.useRef<HTMLAudioElement>(null);

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      const current = audioRef.current.currentTime;
      const total = audioRef.current.duration;
      const progressPercent = (current / total) * 100;
      setProgress(progressPercent);

      // Format current time
      const minutes = Math.floor(current / 60);
      const seconds = Math.floor(current % 60);
      setCurrentTime(`${minutes}:${seconds < 10 ? '0' : ''}${seconds}`);
    }
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      const total = audioRef.current.duration;
      // Format duration time
      const minutes = Math.floor(total / 60);
      const seconds = Math.floor(total % 60);
      setDuration(`${minutes}:${seconds < 10 ? '0' : ''}${seconds}`);
    }
  };

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (audioRef.current) {
      const progressBar = e.currentTarget;
      const rect = progressBar.getBoundingClientRect();
      const clickPosition = (e.clientX - rect.left) / rect.width;
      audioRef.current.currentTime = clickPosition * audioRef.current.duration;
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    if (audioRef.current) {
      audioRef.current.volume = newVolume;
    }
    if (newVolume === 0) {
      setIsMuted(true);
    } else {
      setIsMuted(false);
    }
  };

  const toggleMute = () => {
    if (audioRef.current) {
      if (isMuted) {
        audioRef.current.volume = volume;
        setIsMuted(false);
      } else {
        audioRef.current.volume = 0;
        setIsMuted(true);
      }
    }
  };

  // Format de la source audio - utilise une URL d'exemple car preview_url n'existe pas dans le type Songs
  const audioSource = `https://sample-music.com/preview_sample.mp3`;

  return (
    <div className={`${styles.audioPlayer} `}>
      <audio
        ref={audioRef}
        src={audioSource}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={() => setIsPlaying(false)}
      />

      <div className={styles.audioPlayerControls}>
        <button onClick={togglePlay} className={styles.playButton}>
          {isPlaying ? (
            <IconPlayerPause size={28} />
          ) : (
            <IconPlayerPlay size={28} />
          )}
        </button>

        <div className="w-full mb-4">
          <div className={`${styles.timeDisplay} `}>
            <span>{currentTime}</span>
            <span>{duration}</span>
          </div>
          <div
            className={`${styles.progressBar} `}
            onClick={handleProgressClick}
          >
            <div
              className={styles.progressIndicator}
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>

        <div className={styles.volumeControls}>
          <button onClick={toggleMute} className={`${styles.volumeButton} `}>
            {isMuted ? <IconVolumeOff size={22} /> : <IconVolume size={22} />}
          </button>
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={volume}
            onChange={handleVolumeChange}
            className={`${styles.volumeSlider} `}
          />
        </div>
      </div>
    </div>
  );
};
