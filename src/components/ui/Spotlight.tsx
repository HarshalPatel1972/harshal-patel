import React, { useRef } from "react";
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
  const requestRef = useRef<number>();

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!divRef.current || !overlayRef.current) return;

    // ⚡ OPTIMIZATION: Use requestAnimationFrame to batch DOM reads and writes
    // This prevents layout thrashing and ensures smooth 60FPS tracking
    if (requestRef.current) {
      cancelAnimationFrame(requestRef.current);
    }

    const { clientX, clientY } = e;

    requestRef.current = requestAnimationFrame(() => {
      if (!divRef.current || !overlayRef.current) return;
      const rect = divRef.current.getBoundingClientRect();
      const x = clientX - rect.left;
      const y = clientY - rect.top;

      overlayRef.current.style.background = `radial-gradient(600px circle at ${x}px ${y}px, ${fill}, transparent 40%)`;
    });
  };

  const handleMouseEnter = (e: React.MouseEvent<HTMLDivElement>) => {
    // ⚡ OPTIMIZATION: Direct DOM manipulation for opacity instead of useState
    // This completely eliminates React re-renders on hover state changes
    if (overlayRef.current) {
      overlayRef.current.style.opacity = "1";
    }
    handleMouseMove(e);
  };

  const handleMouseLeave = () => {
    if (overlayRef.current) {
      overlayRef.current.style.opacity = "0";
    }
    if (requestRef.current) {
      cancelAnimationFrame(requestRef.current);
    }
  };

  // ⚡ OPTIMIZATION: Ensure we don't leak animation frames if the component unmounts
  React.useEffect(() => {
    return () => {
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
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
          background: `radial-gradient(600px circle at 0px 0px, ${fill}, transparent 40%)`,
        }}
      />
      {children}
    </div>
  );
}
