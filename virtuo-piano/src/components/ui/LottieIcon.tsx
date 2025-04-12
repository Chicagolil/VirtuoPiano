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
  src: string;
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
        animationRef.current?.setDirection(1);
        animationRef.current?.play();
      },
      playReverse: () => {
        animationRef.current?.setDirection(-1);
        animationRef.current?.play();
      },
      replay: () => animationRef.current?.goToAndPlay(0, true),

      stop: () => animationRef.current?.stop(),
    }));

    useEffect(() => {
      if (containerRef.current) {
        animationRef.current = lottie.loadAnimation({
          container: containerRef.current,
          renderer: 'svg',
          loop,
          autoplay,
          path: src,
        });
      }

      return () => {
        animationRef.current?.destroy();
      };
    }, [src, loop, autoplay]);

    return <div ref={containerRef} style={{ width, height }} />;
  }
);

export default LottieIcon;
