import React, { useRef, useState, useEffect } from "react";
import { cn } from "@/lib/utils";

interface SpotlightProps {
  children: React.ReactNode;
  className?: string;
  fill?: string;
}

export function Spotlight({ 
  children, 
  className = "", 
  fill = "rgba(255, 255, 255, 0.1)" 
}: SpotlightProps) {
  const divRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const [opacity, setOpacity] = useState(0);

  // ⚡ PERFORMANCE: Cache DOMRect to avoid expensive getBoundingClientRect on every mouse move
  const rectRef = useRef<DOMRect | null>(null);

  // Invalidate cache on resize AND scroll (capture) to ensure accuracy if layout changes
  // Using capture=true for scroll to detect scrolling in any parent container
  useEffect(() => {
      const clearCache = () => {
          rectRef.current = null;
      };

      window.addEventListener('resize', clearCache);
      // 'scroll' event does not bubble, so use capture phase to detect any scroll in the document
      window.addEventListener('scroll', clearCache, { capture: true, passive: true });

      return () => {
          window.removeEventListener('resize', clearCache);
          window.removeEventListener('scroll', clearCache, { capture: true });
      };
  }, []);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!divRef.current || !overlayRef.current) return;

    // Use cached rect if available, otherwise calculate it
    if (!rectRef.current) {
        rectRef.current = divRef.current.getBoundingClientRect();
    }
    const rect = rectRef.current;

    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    overlayRef.current.style.background = `radial-gradient(600px circle at ${x}px ${y}px, ${fill}, transparent 40%)`;
  };

  const handleMouseEnter = (e: React.MouseEvent<HTMLDivElement>) => {
    setOpacity(1);

    // Refresh cache on enter to ensure we have the latest position
    if (divRef.current) {
        rectRef.current = divRef.current.getBoundingClientRect();
    }

    handleMouseMove(e);
  };

  const handleMouseLeave = () => {
    setOpacity(0);
  };

  return (
    <div
      ref={divRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={cn("relative overflow-hidden", className)}
    >
      <div
        ref={overlayRef}
        className="pointer-events-none absolute -inset-px opacity-0 transition duration-300"
        style={{
          opacity,
          background: `radial-gradient(600px circle at 0px 0px, ${fill}, transparent 40%)`,
        }}
      />
      {children}
    </div>
  );
}
