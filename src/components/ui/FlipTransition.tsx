"use client";

import { useEffect, useState, useRef } from "react";
import { useFlipTransition } from "@/context/FlipContext";

export function FlipTransition() {
  const { isActive, screenshotSrc, gridConfig, redirectUrl, setPreloading } = useFlipTransition();
  const { cols, rows } = gridConfig;
  const [flippedIndices, setFlippedIndices] = useState<Set<number>>(new Set());
  const [shouldAnimate, setShouldAnimate] = useState(false);

  const shuffleRef = useRef<number[]>([]);

  useEffect(() => {
    let timers: NodeJS.Timeout[] = [];
    let redirectTimeout: NodeJS.Timeout;

    if (isActive) {
      // 1. Preload Image
      setShouldAnimate(false);
      setFlippedIndices(new Set());
      setPreloading(true, null); // Signal we are loading (slug is handled by Projects.tsx)

      const img = new Image();
      img.src = screenshotSrc;

      img.onload = () => {
        setPreloading(false, null);
        setShouldAnimate(true);
        
        // 2. Generate Shuffle
        const totalSquares = cols * rows;
        const indices = Array.from({ length: totalSquares }, (_, i) => i);
        for (let i = indices.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [indices[i], indices[j]] = [indices[j], indices[i]];
        }
        shuffleRef.current = indices;

        // 3. Start Animation Stagger
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

        // 4. Handle Redirect (CALCULATED SYNC)
        const lastSquareStart = (totalSquares - 1) * staggerInterval;
        const totalAnimationTime = lastSquareStart + 450 + 200;
        
        redirectTimeout = setTimeout(() => {
          window.location.href = redirectUrl;
        }, totalAnimationTime);
      };

      img.onerror = () => {
        console.error("Failed to load screenshot:", screenshotSrc);
        setPreloading(false, null);
        window.location.href = redirectUrl;
      };

      return () => {
        timers.forEach(t => clearTimeout(t));
        clearTimeout(redirectTimeout);
      };
    } else {
      setShouldAnimate(false);
      setFlippedIndices(new Set());
    }
  }, [isActive, screenshotSrc, redirectUrl, cols, rows, setPreloading]);

  if (!isActive || !shouldAnimate) return null;

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
          WebkitPerspective: '2000px',
          overflow: 'visible'
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
          <div 
            className="absolute inset-0"
            style={{ 
              background: 'transparent',
              backfaceVisibility: 'hidden',
              WebkitBackfaceVisibility: 'hidden',
              position: 'absolute',
              inset: '0',
              transform: 'translateZ(0)',
              WebkitTransform: 'translateZ(0)'
            }}
          />
          <div 
            className="absolute inset-0 bg-[#111]"
            style={{ 
              backgroundImage: `url('${currentSrc}')`,
              backgroundSize: `${currentCols * 100}% ${currentRows * 100}%`,
              backgroundPosition: `${colIndex === 0 ? 0 : (colIndex / (currentCols - 1)) * 100}% ${rowIndex === 0 ? 0 : (rowIndex / (currentRows - 1)) * 100}%`,
              backfaceVisibility: 'hidden',
              WebkitBackfaceVisibility: 'hidden',
              position: 'absolute',
              inset: '0',
              transform: 'rotateY(180deg) translateZ(1px)',
              WebkitTransform: 'rotateY(180deg) translateZ(1px)',
              backgroundRepeat: 'no-repeat'
            }}
          />
        </div>
      </div>
    );
  };

  return (
    <div 
      className="fixed inset-0 z-[10000] pointer-events-none"
      style={{
        display: 'grid',
        gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`,
        gridTemplateRows: `repeat(${rows}, minmax(0, 1fr))`,
        width: '100vw',
        height: '100vh',
        backgroundColor: 'transparent'
      }}
    >
      {Array.from({ length: cols * rows }).map((_, i) => renderSquare(i, cols, rows, screenshotSrc))}
    </div>
  );
}
