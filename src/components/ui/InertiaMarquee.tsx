"use client";

import { useEffect, useRef } from "react";

interface InertiaMarqueeProps {
  text: string;
  baseVelocity?: number;
  className?: string;
  fillContainer?: boolean;
}

export default function InertiaMarquee({ text, baseVelocity = 1, className = "", fillContainer = false }: InertiaMarqueeProps) {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const positionRef = useRef(0);
  const scrollYRef = useRef(0);
  const velocityRef = useRef(baseVelocity);
  
  useEffect(() => {
    scrollYRef.current = window.scrollY;

    const onScroll = () => {
      const currentScrollY = window.scrollY;
      const delta = currentScrollY - scrollYRef.current;
      scrollYRef.current = currentScrollY;

      // Add scroll velocity to base velocity
      // If scrolling down, move left faster, if scrolling up, move right (or just slow down/reverse)
      // Usually, we just want it to speed up in either direction, but let's make it directional
      velocityRef.current = baseVelocity + delta * 0.1;
    };

    window.addEventListener("scroll", onScroll, { passive: true });

    let animationFrameId: number;
    const render = () => {
      // Return to base velocity
      velocityRef.current += (baseVelocity - velocityRef.current) * 0.1;
      
      positionRef.current += velocityRef.current;
      
      // Reset position when it scrolls too far to create seamless loop
      // Assuming each text block is wide enough. We duplicate the text multiple times in the render.
      if (positionRef.current > 0) {
        positionRef.current = -50; // Depending on percentage or exact pixels. Let's use percentage.
      } else if (positionRef.current < -50) {
        positionRef.current = 0;
      }

      if (scrollerRef.current) {
         // Using percentage for seamless infinite scroll (assuming two identical blocks)
         scrollerRef.current.style.transform = `translate3d(${positionRef.current}%, 0, 0)`;
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(animationFrameId);
    };
  }, [baseVelocity]);

  // Duplicate text to fill space for seamless scrolling
  const repeatCount = fillContainer ? 6 : 4;
  const content = (
    <div className="flex whitespace-nowrap">
      {Array.from({ length: repeatCount }).map((_, i) => (
        <span key={i} className="px-8">
          {text}
        </span>
      ))}
    </div>
  );

  return (
    <div className={`overflow-hidden flex w-full select-none pointer-events-none ${className}`}>
      <div 
        ref={scrollerRef} 
        className="flex whitespace-nowrap will-change-transform"
        style={{ width: '200%' }} // Two identical sets
      >
        <div className="w-1/2 flex justify-around">
          {content}
        </div>
        <div className="w-1/2 flex justify-around">
          {content}
        </div>
      </div>
    </div>
  );
}
