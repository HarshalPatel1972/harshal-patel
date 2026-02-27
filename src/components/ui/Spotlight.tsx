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

  // ⚡ PERFORMANCE: Track mouse position with refs to avoid re-renders
  const positionRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const frameRef = useRef<number>(0);

  const updateSpotlight = () => {
    if (!divRef.current || !overlayRef.current) return;

    const rect = divRef.current.getBoundingClientRect();
    const x = positionRef.current.x - rect.left;
    const y = positionRef.current.y - rect.top;

    overlayRef.current.style.background = `radial-gradient(600px circle at ${x}px ${y}px, ${fill}, transparent 40%)`;

    frameRef.current = 0;
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    // Store latest coordinates
    positionRef.current = { x: e.clientX, y: e.clientY };

    // Schedule update if not already pending
    if (frameRef.current === 0) {
      frameRef.current = requestAnimationFrame(updateSpotlight);
    }
  };

  const handleMouseEnter = (e: React.MouseEvent<HTMLDivElement>) => {
    setOpacity(1);
    handleMouseMove(e);
  };

  const handleMouseLeave = () => {
    setOpacity(0);
    if (frameRef.current) {
        cancelAnimationFrame(frameRef.current);
        frameRef.current = 0;
    }
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
        if (frameRef.current) {
            cancelAnimationFrame(frameRef.current);
        }
    };
  }, []);

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
