"use client";

import { useEffect, useState, useRef } from "react";
import { useFlipTransition } from "@/context/FlipContext";
import { animate as anime } from "animejs";

export function FlipTransition() {
  const { isActive, screenshotSrc, gridConfig, redirectUrl, setPreloading } = useFlipTransition();
  const { cols, rows } = gridConfig;
  
  // High-performance state tracking
  const [flippedIndices, setFlippedIndices] = useState<Set<number>>(new Set());
  const [smokedIndices, setSmokedIndices] = useState<Set<number>>(new Set());
  
  const flippedRef = useRef<Set<number>>(new Set());
  const smokedRef = useRef<Set<number>>(new Set());

  useEffect(() => {
    if (isActive) {
      // 1. Reset
      flippedRef.current = new Set();
      smokedRef.current = new Set();
      setFlippedIndices(new Set());
      setSmokedIndices(new Set());
      
      const totalSquares = cols * rows;
      const indices = Array.from({ length: totalSquares }, (_, i) => i);
      
      // Randomize reveal order
      for (let i = indices.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [indices[i], indices[j]] = [indices[j], indices[i]];
      }

      // 2. Parallel Preload (Doesn't block animation)
      const img = new Image();
      img.src = screenshotSrc;
      img.onload = () => setPreloading(false, null);
      img.onerror = () => setPreloading(false, null);

      // 3. Animation Phase Control
      const animationState = { flipProgress: 0, smokeProgress: 0 };
      
      // FLIP TRACK
      const flipAnim = anime(animationState, {
        flipProgress: totalSquares,
        duration: 2000,
        easing: 'linear',
        update: () => {
          const count = Math.floor(animationState.flipProgress);
          let changed = false;
          for (let i = 0; i < count; i++) {
            const idx = indices[i];
            if (!flippedRef.current.has(idx)) {
              flippedRef.current.add(idx);
              changed = true;
            }
          }
          if (changed) setFlippedIndices(new Set(flippedRef.current));
        }
      });

      // SMOKE TRACK (Starts after flips are well underway)
      const smokeAnim = anime(animationState, {
        smokeProgress: totalSquares,
        duration: 1500,
        delay: 2400,
        easing: 'linear',
        update: () => {
          const count = Math.floor(animationState.smokeProgress);
          let changed = false;
          for (let i = 0; i < count; i++) {
            const idx = indices[i];
            if (!smokedRef.current.has(idx)) {
              smokedRef.current.add(idx);
              changed = true;
            }
          }
          if (changed) setSmokedIndices(new Set(smokedRef.current));
        },
        complete: () => {
          // Final Sync'd Redirect
          setTimeout(() => {
            window.location.href = redirectUrl;
          }, 600);
        }
      });

      return () => {
        flipAnim.pause();
        smokeAnim.pause();
        // Anime instances are automatically cleaned up if scope is lost, 
        // but we ensure the redirect doesn't fire if unmounted during transition
      };
    }
  }, [isActive, cols, rows, screenshotSrc, redirectUrl, setPreloading]);

  if (!isActive) return null;

  return (
    <div 
      className="fixed inset-0 pointer-events-auto"
      style={{
        zIndex: 9999999, // Absolute top
        display: 'grid',
        gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`,
        gridTemplateRows: `repeat(${rows}, minmax(0, 1fr))`,
        width: '100vw',
        height: '100vh',
        backgroundColor: 'transparent'
      }}
    >
      {Array.from({ length: cols * rows }).map((_, i) => {
        const colIndex = i % cols;
        const rowIndex = Math.floor(i / cols);
        const isFlipped = flippedIndices.has(i);
        const isSmoking = smokedIndices.has(i);

        return (
          <div 
            key={i} 
            className="relative w-full h-full overflow-visible" 
            style={{ perspective: '1200px' }}
          >
            <div 
              className="w-full h-full"
              style={{
                transformStyle: 'preserve-3d',
                transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
                opacity: isSmoking ? 0 : 1,
                filter: isSmoking ? 'blur(24px)' : 'none',
                // We use CSS transition for the rotation and smoke so it's GPU accelerated
                transition: 'transform 600ms cubic-bezier(0.23, 1, 0.32, 1), opacity 1000ms ease, filter 1000ms ease'
              }}
            >
              {/* Front Face (Transparent) */}
              <div 
                className="absolute inset-0 z-10"
                style={{ 
                  backgroundColor: 'transparent',
                  backfaceVisibility: 'hidden',
                  WebkitBackfaceVisibility: 'hidden'
                }}
              />
              
              {/* Back Face (Screenshot Slice) */}
              <div 
                className="absolute inset-0 bg-[#0a0a0a]"
                style={{ 
                  backgroundImage: `url('${screenshotSrc}')`,
                  backgroundSize: `${cols * 100}% ${rows * 100}%`,
                  backgroundPosition: `${cols > 1 ? (colIndex / (cols - 1)) * 100 : 0}% ${rows > 1 ? (rowIndex / (rows - 1)) * 100 : 0}%`,
                  backfaceVisibility: 'hidden',
                  WebkitBackfaceVisibility: 'hidden',
                  transform: 'rotateY(180deg)',
                  backgroundRepeat: 'no-repeat'
                }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}
