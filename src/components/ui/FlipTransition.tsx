"use client";

import { useEffect, useState, useMemo } from "react";
import { useFlipTransition } from "@/context/FlipContext";

const COLS = 16;
const ROWS = 9;

export function FlipTransition() {
  const { isActive, desktopScreenshotSrc, mobileScreenshotSrc, redirectUrl } = useFlipTransition();
  const [flippedIndices, setFlippedIndices] = useState<Set<number>>(new Set());
  const [shouldRender, setShouldRender] = useState(false);
  const [screenshotSrc, setScreenshotSrc] = useState("");

  useEffect(() => {
    if (isActive) {
      // Determine which screenshot to use based on viewport
      const isMobile = window.innerWidth < 768;
      setScreenshotSrc(isMobile ? mobileScreenshotSrc : desktopScreenshotSrc);
    }
  }, [isActive, desktopScreenshotSrc, mobileScreenshotSrc]);

  // Shuffle logic for random flip order
  const shuffledIndices = useMemo(() => {
    const indices = Array.from({ length: COLS * ROWS }, (_, i) => i);
    for (let i = indices.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [indices[i], indices[j]] = [indices[j], indices[i]];
    }
    return indices;
  }, [shouldRender]);

  useEffect(() => {
    if (isActive) {
      setShouldRender(true);
      setFlippedIndices(new Set());

      const staggerInterval = 1800 / (COLS * ROWS);
      const timers: NodeJS.Timeout[] = [];
      
      // Start flipping one by one
      shuffledIndices.forEach((idx, i) => {
        const t = setTimeout(() => {
          setFlippedIndices(prev => new Set(prev).add(idx));
        }, i * staggerInterval);
        timers.push(t);
      });

      // Handle redirect
      const totalAnimationTime = 1800 + 450 + 600; // Total stagger + individual duration + wait
      const redirectTimeout = setTimeout(() => {
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
  }, [isActive, redirectUrl, shuffledIndices]);

  if (!shouldRender) return null;

  return (
    <>
      {/* Grid Overlay Layer */}
      <div className="fixed inset-0 z-[9999] grid grid-cols-16 grid-rows-9 pointer-events-none">
        {Array.from({ length: COLS * ROWS }).map((_, i) => {
          const col = i % COLS;
          const row = Math.floor(i / COLS);
          
          return (
            <div key={i} className="relative w-full h-full" style={{ perspective: '1000px' }}>
              <div 
                className={`w-full h-full transition-transform duration-[450ms] ease-[cubic-bezier(0.4,0,0.2,1)]`}
                style={{
                  transformStyle: 'preserve-3d',
                  transform: flippedIndices.has(i) ? 'rotateY(180deg)' : 'rotateY(0deg)'
                }}
              >
                {/* Front Face (Transparent - Shows Portfolio Page) */}
                <div 
                  className="absolute inset-0 bg-transparent"
                  style={{ backfaceVisibility: 'hidden' }}
                />
                {/* Back Face (Shows Screenshot Slice) */}
                <div 
                  className="absolute inset-0"
                  style={{ 
                    backfaceVisibility: 'hidden',
                    transform: 'rotateY(180deg)',
                    backgroundImage: `url('${screenshotSrc}')`,
                    backgroundSize: `${COLS * 100}% ${ROWS * 100}%`,
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
