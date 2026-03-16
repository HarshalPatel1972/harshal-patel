"use client";

import { useEffect, useState, useMemo, useRef } from "react";
import { useFlipTransition } from "@/context/FlipContext";

const COLS = 16;
const ROWS = 9;

export function FlipTransition() {
  const { isActive, desktopScreenshotSrc, mobileScreenshotSrc, redirectUrl } = useFlipTransition();
  const [flippedIndices, setFlippedIndices] = useState<Set<number>>(new Set());
  const [shouldRender, setShouldRender] = useState(false);
  const [screenshotSrc, setScreenshotSrc] = useState("");

  const shuffleRef = useRef<number[]>([]);

  useEffect(() => {
    let timers: NodeJS.Timeout[] = [];
    let redirectTimeout: NodeJS.Timeout;

    if (isActive) {
      // 1. Setup
      const isMobile = window.innerWidth < 768;
      setScreenshotSrc(isMobile ? mobileScreenshotSrc : desktopScreenshotSrc);
      setShouldRender(true);
      setFlippedIndices(new Set());

      // 2. Generate Shuffle once and store in ref
      const indices = Array.from({ length: COLS * ROWS }, (_, i) => i);
      for (let i = indices.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [indices[i], indices[j]] = [indices[j], indices[i]];
      }
      shuffleRef.current = indices;

      // 3. Start Animation
      const staggerInterval = 1800 / (COLS * ROWS);
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

      // 4. Handle Redirect
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
  }, [isActive, redirectUrl, desktopScreenshotSrc, mobileScreenshotSrc]);

  if (!shouldRender) return null;

  return (
    <>
      {/* Grid Overlay Layer */}
      <div 
        className="fixed inset-0 z-[10000] pointer-events-none"
        style={{
          display: 'grid',
          gridTemplateColumns: `repeat(${COLS}, minmax(0, 1fr))`,
          gridTemplateRows: `repeat(${ROWS}, minmax(0, 1fr))`,
          width: '100vw',
          height: '100vh',
        }}
      >
        {Array.from({ length: COLS * ROWS }).map((_, i) => {
          const col = i % COLS;
          const row = Math.floor(i / COLS);
          
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
                  transform: flippedIndices.has(i) ? 'rotateY(180deg) translateZ(0)' : 'rotateY(0deg) translateZ(0)',
                  WebkitTransform: flippedIndices.has(i) ? 'rotateY(180deg) translateZ(0)' : 'rotateY(0deg) translateZ(0)'
                }}
              >
                {/* Front Face */}
                <div 
                  className="absolute inset-0 bg-transparent"
                  style={{ 
                    backfaceVisibility: 'hidden',
                    WebkitBackfaceVisibility: 'hidden',
                    transform: 'translateZ(0)',
                    WebkitTransform: 'translateZ(0)'
                  }}
                />
                {/* Back Face */}
                <div 
                  className="absolute inset-0 bg-[#111]"
                  style={{ 
                    backfaceVisibility: 'hidden',
                    WebkitBackfaceVisibility: 'hidden',
                    transform: 'rotateY(180deg) translateZ(1px)',
                    WebkitTransform: 'rotateY(180deg) translateZ(1px)',
                    backgroundImage: `url('${screenshotSrc}')`,
                    backgroundSize: '1600% 900%',
                    backgroundPosition: `${(col / (COLS - 1)) * 100}% ${(row / (ROWS - 1)) * 100}%`,
                    backgroundRepeat: 'no-repeat'
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}
