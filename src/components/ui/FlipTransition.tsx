"use client";
 
import { useEffect, useRef } from "react";
import { useFlipTransition } from "@/context/FlipContext";
import { animate as anime, createTimeline, stagger } from "animejs";
 
export function FlipTransition() {
  const { isActive, screenshotSrc, gridConfig, redirectUrl, setPreloading } = useFlipTransition();
  const { cols, rows } = gridConfig;
  const totalSquares = cols * rows;
  
  const squaresRef = useRef<(HTMLDivElement | null)[]>([]);
 
  useEffect(() => {
    if (isActive) {
      // Micro-delay to ensure React has painted the portal and populated squaresRef
      const animationInit = requestAnimationFrame(() => {
        const indices = Array.from({ length: totalSquares }, (_, i) => i);
        
        // Randomize
        for (let i = indices.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [indices[i], indices[j]] = [indices[j], indices[i]];
        }
 
        // Initial Reset
        squaresRef.current.forEach(sq => {
          if (sq) {
            sq.style.transform = 'rotateY(0deg)';
            sq.style.opacity = '1';
            sq.style.filter = 'none';
          }
        });
 
        const targetNodes = indices.map(idx => squaresRef.current[idx]).filter(Boolean);
        if (targetNodes.length === 0) return;
 
        const tl = createTimeline({} as any);
 
        // FLIP PHASE
        tl.add({
          targets: targetNodes,
          rotateY: 180,
          duration: 700,
          delay: stagger(15), 
          easing: 'cubicBezier(0.19, 1, 0.22, 1)'
        } as any);
 
        // SMOKE PHASE
        tl.add({
          targets: targetNodes,
          opacity: 0,
          filter: 'blur(30px)',
          duration: 1000,
          delay: stagger(12, { start: 1600 }), 
          easing: 'easeInSine',
          complete: () => {
            setTimeout(() => { window.location.href = redirectUrl; }, 400);
          }
        } as any);
      });
 
      // Parallel Preload
      const img = new Image();
      img.src = screenshotSrc;
      img.onload = () => setPreloading(false, null);
      img.onerror = () => setPreloading(false, null);
 
      return () => cancelAnimationFrame(animationInit);
    }
  }, [isActive, totalSquares, screenshotSrc, redirectUrl, setPreloading]);
 
  if (!isActive) return null;
 
  return (
    <div 
      className="fixed inset-0 pointer-events-auto"
      style={{
        zIndex: 9999999,
        display: 'grid',
        gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`,
        gridTemplateRows: `repeat(${rows}, minmax(0, 1fr))`,
        width: '100vw',
        height: '100vh',
        backgroundColor: 'transparent'
      }}
    >
      {Array.from({ length: totalSquares }).map((_, i) => {
        const colIndex = i % cols;
        const rowIndex = Math.floor(i / cols);
 
        return (
          <div 
            key={i} 
            className="relative w-full h-full overflow-visible" 
            style={{ perspective: '1200px' }}
          >
            <div 
              ref={el => { squaresRef.current[i] = el; }}
              className="w-full h-full will-change-transform"
              style={{
                transformStyle: 'preserve-3d',
                transform: 'rotateY(0deg)',
              }}
            >
              {/* Front Face */}
              <div 
                className="absolute inset-0 z-10"
                style={{ 
                  backgroundColor: 'transparent',
                  backfaceVisibility: 'hidden',
                  WebkitBackfaceVisibility: 'hidden'
                }}
              />
              
              {/* Back Face */}
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
