'use client';

import React, { useEffect, useRef, useState } from 'react';

class Pixel {
  ctx: CanvasRenderingContext2D;
  x: number;
  y: number;
  color: string;
  size: number;
  maxSize: number;
  speed: number;
  lifeTime: number;
  opacity: number;
  alive: boolean;
  vx: number; // Vitesse horizontale
  vy: number; // Vitesse verticale

  constructor(
    context: CanvasRenderingContext2D,
    x: number,
    y: number,
    color: string,
    maxSize: number,
    speed: number,
    vx: number = 0,
    vy: number = 0
  ) {
    this.ctx = context;
    this.x = x + (Math.random() * 10 - 5); // Légère variation de position
    this.y = y + (Math.random() * 10 - 5);
    this.color = color;
    this.size = Math.random() * 1.5; // Taille initiale plus grande
    this.maxSize = maxSize;
    this.speed = speed;
    this.lifeTime = 150 + Math.random() * 100; // Durée de vie plus longue
    this.opacity = 0.8 + Math.random() * 0.2; // Opacité initiale plus élevée
    this.alive = true;
    this.vx = vx * 0.1 + (Math.random() * 2 - 1) * 0.3; // Vitesse avec composante aléatoire
    this.vy = vy * 0.1 + (Math.random() * 2 - 1) * 0.3;
  }

  update() {
    if (!this.alive) return false;

    // Déplacer le pixel selon sa vitesse (pour créer une traînée)
    this.x += this.vx;
    this.y += this.vy;

    // Réduire progressivement la vitesse
    this.vx *= 0.99;
    this.vy *= 0.99;

    // Augmenter la taille jusqu'à la taille maximale
    if (this.size < this.maxSize) {
      this.size += this.speed;
    }

    // Réduire l'opacité avec le temps mais plus lentement
    this.lifeTime -= 1;
    if (this.lifeTime <= 50) {
      this.opacity = (this.lifeTime / 50) * 0.8;
    }

    // Si la durée de vie est terminée, marquer comme mort
    if (this.lifeTime <= 0) {
      this.alive = false;
      return false;
    }

    return true;
  }

  draw() {
    if (!this.alive) return;

    this.ctx.globalAlpha = this.opacity;

    // Ajouter un effet de lueur pour une meilleure visibilité
    this.ctx.shadowColor = this.color;
    this.ctx.shadowBlur = 5;

    this.ctx.fillStyle = this.color;
    this.ctx.fillRect(
      this.x - this.size / 2,
      this.y - this.size / 2,
      this.size,
      this.size
    );

    this.ctx.shadowBlur = 0;
    this.ctx.globalAlpha = 1.0;
  }
}

interface CursorPixelCanvasProps {
  colors?: string[];
  pixelDensity?: number;
  maxPixels?: number;
  trailLength?: number; // Contrôle la longueur de la traînée
}

const CursorPixelCanvas: React.FC<CursorPixelCanvasProps> = ({
  colors = ['#e0f2fe', '#7dd3fc', '#0ea5e9'],
  pixelDensity = 5,
  maxPixels = 500, // Augmenter le nombre maximum de pixels
  trailLength = 5, // Facteur pour la longueur de la traînée
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [ctx, setCtx] = useState<CanvasRenderingContext2D | null>(null);
  const pixelsRef = useRef<Pixel[]>([]);
  const animationFrameRef = useRef<number | null>(null);
  const mousePositionRef = useRef({ x: 0, y: 0 });
  const lastMousePositionRef = useRef({ x: 0, y: 0 });
  const mouseDeltaRef = useRef({ x: 0, y: 0 });
  const isMouseMovingRef = useRef(false);
  const trailPointsRef = useRef<
    Array<{ x: number; y: number; vx: number; vy: number }>
  >([]);
  const lastGenerationTimeRef = useRef(0);

  // Initialisation du canvas
  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const context = canvas.getContext('2d', { alpha: true });
    if (context) {
      setCtx(context);
    }

    const handleResize = () => {
      if (canvas) {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
      }
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  // Gestion du mouvement de la souris - améliorée pour détecter même les mouvements lents
  useEffect(() => {
    if (!canvasRef.current) return;

    // Initialiser les positions
    lastMousePositionRef.current = {
      x: window.innerWidth / 2,
      y: window.innerHeight / 2,
    };
    mousePositionRef.current = {
      x: window.innerWidth / 2,
      y: window.innerHeight / 2,
    };

    const handleMouseMove = (e: MouseEvent) => {
      // Calculer le déplacement par rapport à la position précédente
      const dx = e.clientX - lastMousePositionRef.current.x;
      const dy = e.clientY - lastMousePositionRef.current.y;

      // Enregistrer la vitesse du mouvement
      mouseDeltaRef.current = { x: dx, y: dy };

      // Mettre à jour les positions
      lastMousePositionRef.current = {
        x: mousePositionRef.current.x,
        y: mousePositionRef.current.y,
      };
      mousePositionRef.current = { x: e.clientX, y: e.clientY };

      // Gérer le mouvement lent vs rapide différemment
      const distance = Math.sqrt(dx * dx + dy * dy);
      const now = performance.now();
      const timeSinceLastGeneration = now - lastGenerationTimeRef.current;

      // Pour les mouvements rapides: créer une traînée de points
      if (distance > 5) {
        // Seulement pour les mouvements significatifs
        const steps = Math.min(Math.ceil(distance / 5), 10);

        for (let i = 1; i <= steps; i++) {
          const ratio = i / steps;
          const x = e.clientX - dx * ratio;
          const y = e.clientY - dy * ratio;

          // Ajouter un point avec la vitesse actuelle
          trailPointsRef.current.push({
            x,
            y,
            vx: dx / 10, // Facteur d'échelle pour la vitesse
            vy: dy / 10,
          });
        }

        lastGenerationTimeRef.current = now;
      }
      // Pour les mouvements lents: générer des pixels périodiquement
      else if (timeSinceLastGeneration > 50) {
        // Générer des pixels toutes les 50ms pour les mouvements lents
        trailPointsRef.current.push({
          x: e.clientX,
          y: e.clientY,
          vx: dx / 10,
          vy: dy / 10,
        });

        lastGenerationTimeRef.current = now;
      }

      isMouseMovingRef.current = true;
    };

    // Générer périodiquement des pixels même si la souris est immobile mais présente
    const handleStaticCursor = () => {
      const intervalId = setInterval(() => {
        if (mousePositionRef.current.x > 0 && mousePositionRef.current.y > 0) {
          const now = performance.now();
          if (now - lastGenerationTimeRef.current > 100) {
            // Plus espacé que pour le mouvement lent
            trailPointsRef.current.push({
              x: mousePositionRef.current.x + (Math.random() * 10 - 5),
              y: mousePositionRef.current.y + (Math.random() * 10 - 5),
              vx: (Math.random() * 2 - 1) * 0.2,
              vy: (Math.random() * 2 - 1) * 0.2,
            });
            lastGenerationTimeRef.current = now;
          }
        }
      }, 100);

      return () => clearInterval(intervalId);
    };

    window.addEventListener('mousemove', handleMouseMove);
    const cleanupStatic = handleStaticCursor();

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      cleanupStatic();
    };
  }, []);

  // Animation et création des pixels - améliorer pour les mouvements rapides
  useEffect(() => {
    if (!ctx) return;

    const createPixels = () => {
      // Traiter tous les points de la traînée
      while (trailPointsRef.current.length > 0) {
        const pointCount = Math.min(trailLength, trailPointsRef.current.length);

        for (let i = 0; i < pointCount; i++) {
          const point = trailPointsRef.current.shift();
          if (!point) continue;

          // Créer plusieurs pixels à chaque point de la traînée
          const pixelsToCreate = Math.max(1, pixelDensity - i); // Plus de pixels au point le plus récent

          for (let j = 0; j < pixelsToCreate; j++) {
            const color = colors[Math.floor(Math.random() * colors.length)];
            const maxSize = 2 + Math.random() * 3;
            const speed = 0.1 + Math.random() * 0.3;

            // Créer un pixel avec la vitesse du mouvement
            const pixel = new Pixel(
              ctx,
              point.x + (Math.random() * 10 - 5),
              point.y + (Math.random() * 10 - 5),
              color,
              maxSize,
              speed,
              point.vx,
              point.vy
            );

            pixelsRef.current.push(pixel);

            // Limiter le nombre de pixels pour les performances
            while (pixelsRef.current.length > maxPixels) {
              pixelsRef.current.shift();
            }
          }
        }
      }
    };

    const animate = () => {
      if (!canvasRef.current) return;

      ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);

      createPixels();

      // Mettre à jour et dessiner les pixels existants
      pixelsRef.current = pixelsRef.current.filter((pixel) => {
        const isAlive = pixel.update();
        if (isAlive) {
          pixel.draw();
        }
        return isAlive;
      });

      animationFrameRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [ctx, colors, pixelDensity, maxPixels, trailLength]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 10,
      }}
    />
  );
};

export default CursorPixelCanvas;
