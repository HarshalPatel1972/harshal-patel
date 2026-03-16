"use client";

import { useEffect, useState, useRef } from "react";
import { useFlipTransition } from "@/context/FlipContext";

export function FlipTransition() {
  const { isActive, screenshotSrc, gridConfig, redirectUrl } = useFlipTransition();
  const { cols, rows } = gridConfig;
  const [flippedIndices, setFlippedIndices] = useState<Set<number>>(new Set());
  const [shouldRender, setShouldRender] = useState(false);

  const shuffleRef = useRef<number[]>([]);

  useEffect(() => {
    let timers: NodeJS.Timeout[] = [];
    let redirectTimeout: NodeJS.Timeout;

    if (isActive) {
      setShouldRender(true);
      setFlippedIndices(new Set());

      // 1. Generate Shuffle
      const totalSquares = cols * rows;
      const indices = Array.from({ length: totalSquares }, (_, i) => i);
      for (let i = indices.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [indices[i], indices[j]] = [indices[j], indices[i]];
      }
      shuffleRef.current = indices;

      // 2. Start Animation
      const staggerInterval = 1800 / totalSquares;
      shuffleRef.current.forEach((idx: number, i: number) => {
        const t = setTimeout(() => {
          setFlippedIndices(prev => {
            const next = new Set(prev);
            next.add(idx);
            return next;
          });
        }, i * staggerInterval);
        timers.push(t);
      });

      // 3. Handle Redirect
      const totalAnimationTime = 1800 + 450 + 600;
      redirectTimeout = setTimeout(() => {
        window.location.href = redirectUrl;
      }, totalAnimationTime);

      return () => {
        timers.forEach(t => clearTimeout(t));
        clearTimeout(redirectTimeout);
      };
    } else {
      setShouldRender(false);
      setFlippedIndices(new Set());
    }
  }, [isActive, redirectUrl, cols, rows]);

  if (!shouldRender || !isActive) return null;

  const isMobile = cols === 6; // Based on the context setting

  // Helper to render a square
  const renderSquare = (i: number, currentCols: number, currentRows: number, currentSrc: string) => {
    const colIndex = i % currentCols;
    const rowIndex = Math.floor(i / currentCols);
    const isFlipped = flippedIndices.has(i);

    return (
      <div 
        key={i} 
        className="relative w-full h-full" 
        style={{ 
          perspective: '2000px',
          WebkitPerspective: '2000px'
        }}
      >
        <div 
          className="w-full h-full transition-transform duration-[450ms] ease-[cubic-bezier(0.4,0,0.2,1)]"
          style={{
            transformStyle: 'preserve-3d',
            WebkitTransformStyle: 'preserve-3d',
            transform: isFlipped ? 'rotateY(180deg) translateZ(0)' : 'rotateY(0deg) translateZ(0)',
            WebkitTransform: isFlipped ? 'rotateY(180deg) translateZ(0)' : 'rotateY(0deg) translateZ(0)'
          }}
        >
          {/* Front Face - EXPLICITLY TRANSPARENT */}
          <div 
            className="absolute inset-0"
            style={{ 
              backgroundColor: 'transparent',
              backfaceVisibility: 'hidden',
              WebkitBackfaceVisibility: 'hidden',
              transform: 'translateZ(0)',
              WebkitTransform: 'translateZ(0)'
            }}
          />
          {/* Back Face - DYNAMIC SLICE */}
          <div 
            className="absolute inset-0 bg-[#111]"
            style={{ 
              backfaceVisibility: 'hidden',
              WebkitBackfaceVisibility: 'hidden',
              transform: 'rotateY(180deg) translateZ(1px)',
              WebkitTransform: 'rotateY(180deg) translateZ(1px)',
              backgroundImage: `url('${currentSrc}')`,
              backgroundSize: `${currentCols * 100}% ${currentRows * 100}%`,
              backgroundPosition: `${(colIndex / (currentCols - 1)) * 100}% ${(rowIndex / (currentRows - 1)) * 100}%`,
              backgroundRepeat: 'no-repeat'
            }}
          />
        </div>
      </div>
    );
  };

  return (
    <>
      {isMobile ? (
        /* MOBILE PATH: 6x10 Portrait Grid */
        <div 
          className="fixed inset-0 z-[10000] pointer-events-none"
          style={{
            display: 'grid',
            gridTemplateColumns: `repeat(6, minmax(0, 1fr))`,
            gridTemplateRows: `repeat(10, minmax(0, 1fr))`,
            width: '100vw',
            height: '100vh',
          }}
        >
          {Array.from({ length: 6 * 10 }).map((_, i) => renderSquare(i, 6, 10, screenshotSrc))}
        </div>
      ) : (
        /* DESKTOP PATH: 16x9 Landscape Grid */
        <div 
          className="fixed inset-0 z-[10000] pointer-events-none"
          style={{
            display: 'grid',
            gridTemplateColumns: `repeat(16, minmax(0, 1fr))`,
            gridTemplateRows: `repeat(9, minmax(0, 1fr))`,
            width: '100vw',
            height: '100vh',
          }}
        >
          {Array.from({ length: 16 * 9 }).map((_, i) => renderSquare(i, 16, 9, screenshotSrc))}
        </div>
      )}
    </>
  );
}
