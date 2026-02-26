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
  const rectRef = useRef<DOMRect | null>(null);
  const [opacity, setOpacity] = useState(0);

  const updateRect = () => {
    if (divRef.current) {
      rectRef.current = divRef.current.getBoundingClientRect();
    }
  };

  useEffect(() => {
    updateRect();

    // Invalidating cache on resize and scroll ensures correctness while maintaining performance
    const handleResize = () => updateRect();
    const handleScroll = () => updateRect();

    window.addEventListener("resize", handleResize);
    // Use capture: true to catch scroll events from any scrollable ancestor
    window.addEventListener("scroll", handleScroll, { capture: true, passive: true });

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("scroll", handleScroll, { capture: true } as EventListenerOptions);
    };
  }, []);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!divRef.current || !overlayRef.current) return;

    // ⚡ PERFORMANCE: Use cached rect to avoid layout thrashing during mouse movement
    if (!rectRef.current) updateRect();

    const rect = rectRef.current!;
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    overlayRef.current.style.background = `radial-gradient(600px circle at ${x}px ${y}px, ${fill}, transparent 40%)`;
  };

  const handleMouseEnter = (e: React.MouseEvent<HTMLDivElement>) => {
    updateRect(); // Ensure rect is fresh on interaction start
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
