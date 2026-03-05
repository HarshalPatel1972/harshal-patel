"use client";

import { useEffect, useState, useRef, useMemo } from "react";
import { animate, createTimeline, stagger } from "animejs";
import { mappaQuotes } from "@/data/quotes";

export default function Preloader({ onComplete }: { onComplete?: () => void }) {
  const [complete, setComplete] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const quoteRef = useRef<HTMLHeadingElement>(null);
  const sourceRef = useRef<HTMLDivElement>(null);
  const topBarRef = useRef<HTMLDivElement>(null);
  const bottomBarRef = useRef<HTMLDivElement>(null);
  const slashRef = useRef<HTMLDivElement>(null);

  const { quote, source, readTime } = useMemo(() => {
    const q = mappaQuotes[Math.floor(Math.random() * mappaQuotes.length)];
    const words = q.text.split(" ").length;
    // Longer read time for complete cinematic immersion
    const time = Math.max(5500, 4000 + (words * 320)); 
    return { quote: q.text, source: q.source, readTime: time };
  }, []);

  useEffect(() => {
    if (complete) return;
    document.body.style.overflow = "hidden";

    // Surgical Character Wrapping for pinpoint animation control
    if (quoteRef.current) {
      quoteRef.current.innerHTML = quoteRef.current.textContent?.split("").map(char => 
        `<span class='p-char inline-block opacity-0 translate-y-8 filter blur-lg will-change-transform'>${char === " " ? "&nbsp;" : char}</span>`
      ).join("") || "";
    }

    const tl = createTimeline({
      easing: 'easeOutQuint'
    });

    // Step 1: The 'Cinematic Aperture' Opening
    tl.add({
      targets: [topBarRef.current, bottomBarRef.current],
      translateY: (el: HTMLElement) => el.dataset.dir === 'top' ? '-100%' : '100%',
      duration: 1600,
      easing: 'easeInOutQuint'
    }, 200)
    // Step 2: The Red Sunder (Visual Pulse)
    .add({
      targets: slashRef.current,
      scaleX: [0, 1.2],
      opacity: [0, 1, 0],
      duration: 1000,
      easing: 'easeInOutSine'
    }, 600)
    // Step 3: Precision character reveal
    .add({
      targets: '.p-char',
      opacity: [0, 1],
      translateY: [40, 0],
      filter: ['blur(20px)', 'blur(0px)'],
      duration: 1000,
      delay: stagger(15),
      easing: 'easeOutQuart'
    }, 1000)
    // Step 4: Elevated Source Presentation
    .add({
      targets: sourceRef.current,
      opacity: [0, 1],
      translateY: [20, 0],
      duration: 1200,
      easing: 'easeOutCubic'
    }, 1800);

    const exitTimeout = setTimeout(() => {
      const exitTl = createTimeline({
        easing: 'easeInQuint',
        onComplete: () => {
          setComplete(true);
          onComplete?.();
          document.body.style.overflow = "";
          
          // Tactical Entry Flash
          document.body.classList.remove("impact-flash-active");
          void document.body.offsetWidth; 
          document.body.classList.add("impact-flash-active");
          setTimeout(() => document.body.classList.remove("impact-flash-active"), 700);
        }
      });

      exitTl.add({
        targets: '.p-char',
        opacity: 0,
        translateY: -60,
        filter: 'blur(30px)',
        delay: stagger(10, { from: 'center' }),
        duration: 1000
      })
      .add({
        targets: sourceRef.current,
        opacity: 0,
        duration: 800
      }, 200)
      .add({
        targets: [topBarRef.current, bottomBarRef.current],
        translateY: 0,
        duration: 1500,
        easing: 'easeInExpo'
      }, 600);
    }, readTime);

    // Subtle Perspective Breath
    let frame = 0;
    const interval = setInterval(() => {
      if (containerRef.current) {
        frame++;
        const drift = Math.sin(frame / 60) * 0.4;
        containerRef.current.style.transform = `perspective(1200px) rotateX(${drift}deg) rotateY(${drift * 0.5}deg)`;
      }
    }, 16);

    return () => {
      clearTimeout(exitTimeout);
      clearInterval(interval);
      document.body.style.overflow = "";
    };
  }, [complete, onComplete, quote, readTime]);

  if (complete) return null;

  return (
    <div 
      ref={containerRef} 
      className="fixed inset-0 z-[999999] bg-[#050505] flex items-center justify-center overflow-hidden px-12 md:px-44"
    >
      {/* Cinematic Shutter System */}
      <div data-dir="top" ref={topBarRef} className="absolute top-0 left-0 right-0 h-1/2 bg-[#020202] z-40 border-b border-[#E8E8E6]/5 will-change-transform" />
      <div data-dir="bottom" ref={bottomBarRef} className="absolute bottom-0 left-0 right-0 h-1/2 bg-[#020202] z-40 border-t border-[#E8E8E6]/5 will-change-transform" />

      {/* Atmospheric Layers */}
      <div className="absolute inset-0 bg-[#050505]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(217,17,17,0.03)_0%,transparent_85%)] opacity-60" />
      <div className="absolute inset-0 halftone-bg opacity-[0.05] mix-blend-overlay pointer-events-none" />
      
      {/* The Sunder Flash */}
      <div 
        ref={slashRef} 
        className="absolute top-1/2 left-0 right-0 h-[2px] bg-[#d91111] -translate-y-1/2 z-30 shadow-[0_0_50px_rgba(217,17,17,0.9)] opacity-0 will-change-transform" 
      />

      <div className="relative z-20 flex flex-col items-center max-w-7xl w-full">
         <h1 
          ref={quoteRef} 
          className="text-4xl md:text-7xl lg:text-[8rem] font-black font-display text-[#E8E8E6] uppercase tracking-[-0.05em] leading-[0.75] text-center mb-28 italic will-change-transform drop-shadow-[0_0_15px_rgba(255,255,255,0.05)]"
         >
           {quote}
         </h1>
         
         <div 
          ref={sourceRef}
          className="flex items-center gap-14 md:gap-24 opacity-0 will-change-transform"
         >
            <div className="w-24 md:w-48 h-[1px] bg-[#d91111]/40 shadow-[0_4px_30px_rgba(217,17,17,0.5)]" />
            <div className="relative group px-14 py-7 border border-[#E8E8E6]/10 backdrop-blur-sm">
              <span className="font-mono text-xs md:text-3xl text-[#d91111] tracking-[1.1em] uppercase font-black italic">
                {source}
              </span>
              <div className="absolute top-0 left-0 w-[5px] h-full bg-[#d91111] shadow-[0_0_20px_rgba(217,17,17,0.8)]" />
            </div>
            <div className="w-24 md:w-48 h-[1px] bg-[#d91111]/40 shadow-[0_4px_30px_rgba(217,17,17,0.5)]" />
         </div>
      </div>

      {/* Cinematic Texture Overlays */}
      <div className="absolute inset-0 pointer-events-none z-50 opacity-[0.08] grain-bg mix-blend-overlay" />
      <div className="absolute inset-0 pointer-events-none z-50 bg-[radial-gradient(circle_at_center,transparent_40%,rgba(0,0,0,0.7)_100%)] opacity-80" />
    </div>
  );
}

