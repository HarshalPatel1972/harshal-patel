import React, { useRef, useState } from "react";
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

  // ⚡ PERFORMANCE: Track animation frame to avoid layout thrashing during high-frequency mouse events
  const rafRef = useRef<number | null>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!divRef.current || !overlayRef.current) return;

    // Cache the event coordinates
    const clientX = e.clientX;
    const clientY = e.clientY;

    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current);
    }

    rafRef.current = requestAnimationFrame(() => {
      if (!divRef.current || !overlayRef.current) return;

      // DOM Read: getBoundingClientRect triggers layout if styles changed
      const rect = divRef.current.getBoundingClientRect();
      const x = clientX - rect.left;
      const y = clientY - rect.top;

      // DOM Write
      overlayRef.current.style.background = `radial-gradient(600px circle at ${x}px ${y}px, ${fill}, transparent 40%)`;
    });
  };

  const handleMouseEnter = (e: React.MouseEvent<HTMLDivElement>) => {
    setOpacity(1);
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
