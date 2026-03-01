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

  // ⚡ PERFORMANCE: Track animation frame to avoid layout thrashing
  const requestRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (requestRef.current !== null) {
        cancelAnimationFrame(requestRef.current);
      }
    };
  }, []);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!divRef.current || !overlayRef.current) return;

    const clientX = e.clientX;
    const clientY = e.clientY;

    if (requestRef.current !== null) {
      cancelAnimationFrame(requestRef.current);
    }

    // ⚡ PERFORMANCE: Batch DOM reads (getBoundingClientRect) and writes (style updates)
    // into a single frame to prevent layout thrashing on rapid mouse movement.
    requestRef.current = requestAnimationFrame(() => {
      if (!divRef.current || !overlayRef.current) return;

      const rect = divRef.current.getBoundingClientRect();
      const x = clientX - rect.left;
      const y = clientY - rect.top;

      overlayRef.current.style.background = `radial-gradient(600px circle at ${x}px ${y}px, ${fill}, transparent 40%)`;
    });
  };

  const handleMouseEnter = (e: React.MouseEvent<HTMLDivElement>) => {
    setOpacity(1);
    handleMouseMove(e);
  };

  const handleMouseLeave = () => {
    setOpacity(0);
    if (requestRef.current !== null) {
      cancelAnimationFrame(requestRef.current);
    }
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
