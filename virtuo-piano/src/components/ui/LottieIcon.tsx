'use client';

import { useRef, useEffect, forwardRef, useImperativeHandle } from 'react';
import lottie from 'lottie-web';

export interface LottieIconHandle {
  play: () => void;
  playReverse: () => void;
  stop: () => void;
  replay: () => void;
}

interface LottieIconProps {
  src: string | any;
  width?: number;
  height?: number;
  loop?: boolean;
  autoplay?: boolean;
}

const LottieIcon = forwardRef<LottieIconHandle, LottieIconProps>(
  ({ src, width = 40, height = 40, loop = false, autoplay = false }, ref) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const animationRef = useRef<any>(null);

    useImperativeHandle(ref, () => ({
      play: () => {
        try {
          animationRef.current?.setDirection(1);
          animationRef.current?.play();
        } catch (error) {
          console.error('Error playing Lottie animation:', error);
        }
      },
      playReverse: () => {
        try {
          animationRef.current?.setDirection(-1);
          animationRef.current?.play();
        } catch (error) {
          console.error('Error playing reverse Lottie animation:', error);
        }
      },
      replay: () => {
        try {
          animationRef.current?.goToAndPlay(0, true);
        } catch (error) {
          console.error('Error replaying Lottie animation:', error);
        }
      },
      stop: () => {
        try {
          animationRef.current?.stop();
        } catch (error) {
          console.error('Error stopping Lottie animation:', error);
        }
      },
    }));

    useEffect(() => {
      if (containerRef.current) {
        try {
          animationRef.current = lottie.loadAnimation({
            container: containerRef.current,
            renderer: 'svg',
            loop,
            autoplay,
            path: src,
          });

          animationRef.current.addEventListener('error', (error: any) => {
            console.error('Lottie animation error:', error);
          });

          return () => {
            try {
              animationRef.current?.destroy();
            } catch (error) {
              console.error('Error destroying Lottie animation:', error);
            }
          };
        } catch (error) {
          console.error('Error loading Lottie animation:', error);
        }
      }
    }, [src, loop, autoplay]);

    return <div ref={containerRef} style={{ width, height }} />;
  }
);

export default LottieIcon;
