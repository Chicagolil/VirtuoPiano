import React, { useState, useEffect, useRef } from 'react';
import styles from './Card.module.css';
import PixelCanvas from '../effects/PixelCanvas';
import { useRouter } from 'next/navigation';

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

// Définir l'interface pour le handle PixelCanvas
interface PixelCanvasHandle {
  handleAppear: () => void;
  handleDisappear: () => void;
}

const Card: React.FC<CardProps> = ({
  color,
  text,
  icon,
  pixelProps,
  activeColor,
  href,
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const pixelCanvasRef = useRef<PixelCanvasHandle>(null);
  const router = useRouter();
  const defaultColor = color || 'transparent';
  const pixelColors = pixelProps?.colors || [
    defaultColor !== 'transparent' ? defaultColor : '#ffffff',
  ];

  // Fonction pour gérer le hover
  const handleMouseEnter = () => {
    setIsHovered(true);
    if (pixelCanvasRef.current) {
      pixelCanvasRef.current.handleAppear();
    }
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    if (pixelCanvasRef.current) {
      pixelCanvasRef.current.handleDisappear();
    }
  };

  const handleClick = () => {
    if (href) {
      router.push(href);
    }
  };

  useEffect(() => {
    // Force animation state on isHovered change
    if (isHovered && pixelCanvasRef.current) {
      pixelCanvasRef.current.handleAppear();
    } else if (!isHovered && pixelCanvasRef.current) {
      pixelCanvasRef.current.handleDisappear();
    }
  }, [isHovered]);

  return (
    <div
      className={styles.card}
      style={{
        backgroundColor: 'transparent',
        ...(activeColor &&
          ({ '--active-color': activeColor } as { '--active-color': string })),
        cursor: href ? 'pointer' : 'default',
      }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={handleClick}
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
};

export default Card;
