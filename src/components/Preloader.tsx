"use client";

import { useEffect, useState, useRef } from "react";
import { animate as anime } from "animejs";

export function Preloader() {
  const [complete, setComplete] = useState(false);
  const [mounted, setMounted] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const slashRef = useRef<HTMLDivElement>(null);
  const textContainerRef = useRef<HTMLDivElement>(null);
  const textInnerRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted || complete) return;

    // Prevent scrolling while loading
    document.body.style.overflow = "hidden";

    // Step 2: Red Slash cuts across
    if (slashRef.current) {
      anime(slashRef.current, {
        scaleX: [0, 1],
        opacity: [1, 1],
        duration: 600,
        easing: "easeOutExpo",
        delay: 500,
      });
    }

    // Step 3: Text Slams In
    if (textContainerRef.current) {
      anime(textContainerRef.current, {
        opacity: [0, 1],
        scale: [1.2, 1],
        duration: 500,
        easing: "easeOutCubic",
        delay: 1000,
      });
    }

    // Step 4: Chromatic aberration shudder
    if (textInnerRef.current) {
      anime(textInnerRef.current, {
        translateX: [
          { value: 10, duration: 50 },
          { value: -10, duration: 50 },
          { value: 10, duration: 50 },
          { value: 0, duration: 50 }
        ],
        easing: "easeInOutSine",
        delay: 1500,
      });
    }

    // Step 5: Shatter / Reveal
    if (containerRef.current) {
      anime(containerRef.current, {
        opacity: [1, 0],
        scale: [1, 1.1],
        duration: 600,
        easing: "easeInExpo",
        delay: 2000,
        complete: () => {
          setComplete(true);
          document.body.style.overflow = ""; // reset overflow
          
          // Global Impact frame on reveal
          document.body.classList.remove("impact-flash-active");
          void document.body.offsetWidth;
          document.body.classList.add("impact-flash-active");
          setTimeout(() => document.body.classList.remove("impact-flash-active"), 500);
        }
      });
    }

    return () => {
      document.body.style.overflow = ""; // ensure it's reset on unmount
    };
  }, [mounted, complete]);

  if (!mounted || complete) return null;

  return (
    <div ref={containerRef} className="preloader-container fixed inset-0 z-[99999] bg-[var(--bg-ink)] flex items-center justify-center overflow-hidden pointer-events-none">
      {/* Halftone / Grain Texture Base */}
      <div className="absolute inset-0 halftone-bg z-0 opacity-10 pointer-events-none" />

      {/* The Red Slash */}
      <div ref={slashRef} className="preloader-slash absolute top-1/2 left-[-10vw] right-[-10vw] h-8 bg-[var(--accent-blood)] -translate-y-1/2 origin-left scale-x-0 opacity-0 z-10 rotate-[-5deg]" />

      <div ref={textContainerRef} className="preloader-text opacity-0 relative z-20 flex flex-col items-center mt-[-20px]">
         <span className="font-mono text-xs md:text-sm text-[var(--accent-blood)] bg-black px-4 py-1 tracking-[0.4em] mb-4 border border-[var(--accent-blood)]">
           SYSTEM_INIT //
         </span>
         <h1 ref={textInnerRef} className="preloader-text-inner text-6xl md:text-[10rem] font-black font-display text-[var(--text-bone)] uppercase tracking-tighter leading-none chromatic-aberration brutal-shadow">
           HARSHAL.
         </h1>
      </div>
    </div>
  );
}
