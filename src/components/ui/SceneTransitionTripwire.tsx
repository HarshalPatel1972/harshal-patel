"use client";

import { useEffect, useRef } from "react";

export function SceneTransitionTripwire({ id }: { id?: string }) {
  const tripwireRef = useRef<HTMLDivElement>(null);
  
  // Track last trigger to avoid machine-gun flashing
  const lastTriggerTime = useRef(0);

  useEffect(() => {
    const el = tripwireRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const now = Date.now();
            if (now - lastTriggerTime.current > 1000) {
              lastTriggerTime.current = now;
              
              // Trigger Global Impact Frame using CSS class
              document.body.classList.remove("impact-flash-active");
              void document.body.offsetWidth; // force reflow
              document.body.classList.add("impact-flash-active");
              
              // Remove the class after the animation finishes (0.5s from globals.css)
              setTimeout(() => {
                document.body.classList.remove("impact-flash-active");
              }, 500);
            }
          }
        });
      },
      {
        // Trigger precisely when it hits 50% of the viewport (the dead center "cut" line)
        rootMargin: "-50% 0px -50% 0px",
        threshold: 0
      }
    );

    observer.observe(el);

    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <div 
      id={id}
      ref={tripwireRef} 
      className="w-full h-px opacity-0 pointer-events-none select-none relative z-50 bg-transparent"
    />
  );
}
