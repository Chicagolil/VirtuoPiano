'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import styles from './Card.module.css';
import PixelCanvas from '../effects/PixelCanvas';

interface CardProps {
  color?: string;
  text: string;
  icon: React.ReactNode;
  pixelProps?: {
    colors?: string[];
    gap?: number;
    speed?: number;
    noFocus?: boolean;
  };
  activeColor?: string;
  href?: string;
}

interface PixelCanvasHandle {
  handleAppear: () => void;
  handleDisappear: () => void;
}

export default function Card({
  color,
  text,
  icon,
  pixelProps,
  activeColor,
  href,
}: CardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const pixelCanvasRef = useRef<PixelCanvasHandle>(null);

  const defaultColor = color || 'transparent';
  const pixelColors = pixelProps?.colors || [
    defaultColor !== 'transparent' ? defaultColor : '#ffffff',
  ];

  const handleMouseEnter = () => {
    setIsHovered(true);
    pixelCanvasRef.current?.handleAppear();
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    pixelCanvasRef.current?.handleDisappear();
  };

  useEffect(() => {
    if (isHovered) {
      pixelCanvasRef.current?.handleAppear();
    } else {
      pixelCanvasRef.current?.handleDisappear();
    }
  }, [isHovered]);

  const CardContent = (
    <div
      className={styles.card}
      style={{
        backgroundColor: 'transparent',
        ...(activeColor &&
          ({
            '--active-color': activeColor,
          } as React.CSSProperties)),
        cursor: href ? 'pointer' : 'default',
      }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {pixelProps && (
        <div className={styles.pixelCanvas} style={{ zIndex: 0 }}>
          <PixelCanvas
            ref={pixelCanvasRef}
            colors={pixelColors}
            gap={pixelProps.gap}
            speed={pixelProps.speed}
            noFocus={pixelProps.noFocus}
            isHovered={isHovered}
          />
        </div>
      )}

      <div className={styles.icon} style={{ zIndex: 2 }}>
        {icon}
      </div>
      <p className={styles.text} style={{ zIndex: 2 }}>
        {text}
      </p>
    </div>
  );

  // 👉 Si href existe, on wrappe dans <Link>, sinon on retourne juste la card
  return href ? (
    <Link href={href} className={styles.cardWrapper}>
      {CardContent}
    </Link>
  ) : (
    <div className={styles.cardWrapper}>{CardContent}</div>
  );
}
