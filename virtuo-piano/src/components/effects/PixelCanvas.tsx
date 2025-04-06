import React, {
  useEffect,
  useRef,
  useState,
  forwardRef,
  useImperativeHandle,
} from 'react';

class Pixel {
  width: number;
  height: number;
  ctx: CanvasRenderingContext2D;
  x: number;
  y: number;
  color: string;
  speed: number;
  size: number;
  sizeStep: number;
  minSize: number;
  maxSizeInteger: number;
  maxSize: number;
  delay: number;
  counter: number;
  counterStep: number;
  isIdle: boolean;
  isReverse: boolean;
  isShimmer: boolean;
  distanceToCenter: number;

  constructor(
    canvas: HTMLCanvasElement,
    context: CanvasRenderingContext2D,
    x: number,
    y: number,
    color: string,
    speed: number,
    delay: number,
    distanceToCenter: number
  ) {
    this.width = canvas.width;
    this.height = canvas.height;
    this.ctx = context;
    this.x = x;
    this.y = y;
    this.color = color;
    this.speed = this.getRandomValue(0.1, 0.9) * speed;
    this.size = 0;
    this.sizeStep = Math.random() * 0.8;
    this.minSize = 0.5;
    this.maxSizeInteger = 3;
    this.maxSize = this.getRandomValue(this.minSize, this.maxSizeInteger);
    this.delay = delay;
    this.counter = 0;
    this.counterStep = Math.random() * 4 + (this.width + this.height) * 0.01;
    this.isIdle = false;
    this.isReverse = false;
    this.isShimmer = false;
    this.distanceToCenter = distanceToCenter;
  }

  getRandomValue(min: number, max: number) {
    return Math.random() * (max - min) + min;
  }

  draw() {
    const centerOffset = this.maxSizeInteger * 0.5 - this.size * 0.5;

    // Suppression du code d'opacité basé sur la distance au centre
    this.ctx.globalAlpha = 1.0;
    this.ctx.shadowColor = this.color;
    this.ctx.shadowBlur = 2;

    this.ctx.fillStyle = this.color;
    this.ctx.fillRect(
      this.x + centerOffset,
      this.y + centerOffset,
      this.size,
      this.size
    );

    this.ctx.globalAlpha = 1.0;
    this.ctx.shadowBlur = 0;
  }

  appear() {
    this.isIdle = false;

    if (this.counter <= this.delay) {
      this.counter += this.counterStep;
      return;
    }

    if (this.size >= this.maxSize) {
      this.isShimmer = true;
    }

    if (this.isShimmer) {
      this.shimmer();
    } else {
      this.size += this.sizeStep;
    }

    this.draw();
  }

  disappear() {
    this.isShimmer = false;
    this.counter = 0;

    if (this.size <= 0) {
      this.isIdle = true;
      return;
    } else {
      this.size -= 0.1;
    }

    this.draw();
  }

  shimmer() {
    if (this.size >= this.maxSize) {
      this.isReverse = true;
    } else if (this.size <= this.minSize) {
      this.isReverse = false;
    }

    if (this.isReverse) {
      this.size -= this.speed;
    } else {
      this.size += this.speed;
    }
  }
}

interface PixelCanvasProps {
  colors: string[];
  gap?: number;
  speed?: number;
  noFocus?: boolean;
  isHovered?: boolean;
}

interface PixelCanvasHandle {
  handleAppear: () => void;
  handleDisappear: () => void;
}

const PixelCanvas = forwardRef<PixelCanvasHandle, PixelCanvasProps>(
  (
    {
      colors = ['#f8fafc', '#f1f5f9', '#cbd5e1'],
      gap = 5,
      speed = 35,
      noFocus = false,
      isHovered = false,
    },
    ref
  ) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const pixelsRef = useRef<Pixel[]>([]);
    const animationRef = useRef<number | null>(null);
    const [ctx, setCtx] = useState<CanvasRenderingContext2D | null>(null);
    const timeIntervalRef = useRef(1000 / 60);
    const timePreviousRef = useRef(performance.now());
    const reducedMotionRef = useRef(
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    );

    // Expose les méthodes au parent via la ref
    useImperativeHandle(ref, () => ({
      handleAppear: () => handleAnimation('appear'),
      handleDisappear: () => handleAnimation('disappear'),
    }));

    const handleResize = () => {
      if (!canvasRef.current || !containerRef.current || !ctx) return;

      const rect = containerRef.current.getBoundingClientRect();
      const width = Math.floor(rect.width);
      const height = Math.floor(rect.height);

      canvasRef.current.width = width;
      canvasRef.current.height = height;
      canvasRef.current.style.width = `${width}px`;
      canvasRef.current.style.height = `${height}px`;

      pixelsRef.current = [];
      createPixels();
    };

    const getDistanceToCanvasCenter = (x: number, y: number) => {
      if (!canvasRef.current) return 0;

      const dx = x - canvasRef.current.width / 2;
      const dy = y - canvasRef.current.height / 2;
      return Math.sqrt(dx * dx + dy * dy);
    };

    const createPixels = () => {
      if (!canvasRef.current || !ctx) return;

      const canvas = canvasRef.current;
      const actualGap = Math.max(4, Math.min(50, gap));
      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;

      for (let x = 0; x < canvas.width; x += actualGap) {
        for (let y = 0; y < canvas.height; y += actualGap) {
          const color = colors[Math.floor(Math.random() * colors.length)];
          const distanceToCenter = Math.sqrt(
            Math.pow(x - centerX, 2) + Math.pow(y - centerY, 2)
          );
          const delay = reducedMotionRef.current ? 0 : distanceToCenter * 0.5;
          const actualSpeed = Math.max(0, Math.min(100, speed)) * 0.002;

          const pixel = new Pixel(
            canvas,
            ctx,
            x,
            y,
            color,
            actualSpeed,
            delay,
            distanceToCenter
          );
          pixel.size = 0.2;
          pixelsRef.current.push(pixel);
        }
      }

      // Ne pas déclencher l'animation appear au chargement initial
      // handleAnimation('appear');
    };

    const animate = (fnName: 'appear' | 'disappear') => {
      if (!ctx || !canvasRef.current) return;

      animationRef.current = requestAnimationFrame(() => animate(fnName));

      const timeNow = performance.now();
      const timePassed = timeNow - timePreviousRef.current;

      if (timePassed < timeIntervalRef.current) return;

      timePreviousRef.current =
        timeNow - (timePassed % timeIntervalRef.current);

      ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);

      let allIdle = true;
      for (let i = 0; i < pixelsRef.current.length; i++) {
        pixelsRef.current[i][fnName]();
        if (!pixelsRef.current[i].isIdle) {
          allIdle = false;
        }
      }

      if (allIdle && animationRef.current) {
        cancelAnimationFrame(animationRef.current);
        animationRef.current = null;
      }
    };

    const handleAnimation = (name: 'appear' | 'disappear') => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
        animationRef.current = null;
      }
      animate(name);
    };

    const handleMouseEnter = () => {
      handleAnimation('appear');
    };

    const handleMouseLeave = () => {
      handleAnimation('disappear');
    };

    const handleFocusIn = (e: React.FocusEvent) => {
      if (e.currentTarget.contains(e.relatedTarget as Node)) return;
      handleAnimation('appear');
    };

    const handleFocusOut = (e: React.FocusEvent) => {
      if (e.currentTarget.contains(e.relatedTarget as Node)) return;
      handleAnimation('disappear');
    };

    useEffect(() => {
      if (!canvasRef.current) return;

      const context = canvasRef.current.getContext('2d');
      if (context) {
        setCtx(context);
      }
    }, []);

    useEffect(() => {
      if (!ctx || !containerRef.current) return;

      handleResize();

      const resizeObserver = new ResizeObserver(handleResize);
      resizeObserver.observe(containerRef.current);

      // Supprimer l'appel d'animation automatique
      // setTimeout(() => {
      //   handleAnimation('appear');
      // }, 100);

      return () => {
        if (animationRef.current) {
          cancelAnimationFrame(animationRef.current);
        }
        resizeObserver.disconnect();
      };
    }, [ctx]);

    useEffect(() => {
      if (!containerRef.current) return;

      containerRef.current.addEventListener('mouseenter', handleMouseEnter);
      containerRef.current.addEventListener('mouseleave', handleMouseLeave);

      if (!noFocus) {
        containerRef.current.addEventListener('focusin', handleFocusIn as any);
        containerRef.current.addEventListener(
          'focusout',
          handleFocusOut as any
        );
      }

      return () => {
        if (containerRef.current) {
          containerRef.current.removeEventListener(
            'mouseenter',
            handleMouseEnter
          );
          containerRef.current.removeEventListener(
            'mouseleave',
            handleMouseLeave
          );

          if (!noFocus) {
            containerRef.current.removeEventListener(
              'focusin',
              handleFocusIn as any
            );
            containerRef.current.removeEventListener(
              'focusout',
              handleFocusOut as any
            );
          }
        }
      };
    }, [noFocus]);

    // Réagir aux changements de isHovered
    useEffect(() => {
      if (isHovered) {
        handleAnimation('appear');
      } else {
        handleAnimation('disappear');
      }
    }, [isHovered]);

    const styles: React.CSSProperties = {
      display: 'grid',
      inlineSize: '100%',
      blockSize: '100%',
      overflow: 'hidden',
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      zIndex: 0,
      pointerEvents: 'none',
    };

    const canvasStyles: React.CSSProperties = {
      width: '100%',
      height: '100%',
      position: 'absolute',
      top: 0,
      left: 0,
    };

    return (
      <div ref={containerRef} style={styles}>
        <canvas ref={canvasRef} style={canvasStyles} />
      </div>
    );
  }
);

export default PixelCanvas;
