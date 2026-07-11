"use client";

import { useEffect, useState, useRef, useMemo, useCallback } from "react";
import { createTimeline, stagger } from "animejs";
import { mappaQuotesList, characterRegistry } from "@/data/quotes";
import { useLanguage } from "@/context/LanguageContext";
import { Fraunces, Outfit } from "next/font/google";

const fraunces = Fraunces({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400"],
  variable: "--font-fraunces",
  display: "swap",
});

const outfit = Outfit({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400"],
  variable: "--font-outfit",
  display: "swap",
});

export default function Preloader({ onComplete }: { onComplete?: () => void }) {
  const [complete, setComplete] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [exiting, setExiting] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const sourceRef = useRef<HTMLDivElement>(null);
  const sourceOutlineRef = useRef<HTMLDivElement>(null);

  const timelineRef = useRef<any>(null);
  const exitTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // WebAudio Drone Refs
  const audioCtxRef = useRef<AudioContext | null>(null);
  const osc1Ref = useRef<OscillatorNode | null>(null);
  const osc2Ref = useRef<OscillatorNode | null>(null);
  const droneGainRef = useRef<GainNode | null>(null);

  const { language } = useLanguage();

  useEffect(() => {
    setMounted(true);
  }, []);

  // Pick a random quote ONCE - using lazy initialization
  const [selectedQuote] = useState(() => {
    const lastQuoteId = typeof window !== 'undefined' ? sessionStorage.getItem('last_quote_id') : null;
    let filtered = mappaQuotesList.filter(q => q.charId !== 'ROCKY');
    
    if (filtered.length > 1 && lastQuoteId) {
      const deduplicated = filtered.filter(q => `${q.charId}-${q.en.slice(0, 10)}` !== lastQuoteId);
      if (deduplicated.length > 0) filtered = deduplicated;
    }
    
    const picked = filtered[Math.floor(Math.random() * filtered.length)];
    if (typeof window !== 'undefined' && picked) {
      sessionStorage.setItem('last_quote_id', `${picked.charId}-${picked.en.slice(0, 10)}`);
    }
    return picked;
  });

  const rockyQuote = mappaQuotesList.find(q => q.charId === 'ROCKY');
  const activeQuote = language === 'eridian' ? (rockyQuote ?? selectedQuote) : selectedQuote;
  
  const quoteData = useMemo(() => {
    if (!activeQuote) return null;
    const character = characterRegistry[activeQuote.charId];
    
    return {
      text: language === 'eridian' ? (activeQuote.eridian || activeQuote.en) :
            language === 'ja' ? activeQuote.ja : 
            language === 'ko' ? activeQuote.ko : 
            language === 'zh-tw' ? activeQuote["zh-tw"] : 
            language === 'hi' ? (activeQuote.hi || activeQuote.en) :
            language === 'fr' ? activeQuote.fr :
            language === 'id' ? activeQuote.id :
            language === 'de' ? activeQuote.de :
            language === 'it' ? activeQuote.it :
            language === 'pt-br' ? activeQuote["pt-br"] :
            language === 'es-419' ? activeQuote["es-419"] :
            language === 'es' ? activeQuote.es :
            activeQuote.en,
      author: language === 'eridian' ? character.en.name :
              language === 'ja' ? character.ja.name : 
              language === 'ko' ? character.ko.name : 
              language === 'zh-tw' ? character["zh-tw"].name : 
              language === 'hi' ? (character.hi?.name || character.en.name) :
              language === 'fr' ? character.fr.name :
              language === 'id' ? character.id.name :
              language === 'de' ? character.de.name :
              language === 'it' ? character.it.name :
              language === 'pt-br' ? character["pt-br"].name :
              language === 'es-419' ? character["es-419"].name :
              language === 'es' ? character.es.name :
              character.en.name,
      image: character.image,
    };
  }, [language, activeQuote]);

  const { text: quote = "", author: source = "", image: bgImage = "" } = quoteData || {};

  // Timing Mapping: Match V1 dynamic readTime logic exactly
  const wordCount = useMemo(() => {
    return quote ? quote.split(/\s+/).filter(w => w.length > 0).length : 0;
  }, [quote]);

  const readTime = useMemo(() => {
    return Math.max(5500, 4000 + wordCount * 320);
  }, [wordCount]);

  const quoteLines = useMemo(() => {
    if (!quote) return [];
    const isCJK = language === 'ja' || language === 'ko' || language === 'zh-tw';
    if (isCJK) {
      const lines: string[] = [];
      for (let i = 0; i < quote.length; i += 18) {
        lines.push(quote.slice(i, i + 18));
      }
      return lines;
    }
    const words = quote.split(/\s+/);
    const lines: string[] = [];
    let currentLine = "";
    
    words.forEach(word => {
      if ((currentLine + " " + word).trim().length > 38) {
        lines.push(currentLine.trim());
        currentLine = word;
      } else {
        currentLine = (currentLine + " " + word).trim();
      }
    });
    if (currentLine) {
      lines.push(currentLine.trim());
    }
    return lines;
  }, [quote, language]);

  // Dynamic Font Size Class to prevent leaving the viewport on big strings
  const quoteFontSizeClass = useMemo(() => {
    const len = quote.length;
    const isCJK = language === 'ja' || language === 'ko' || language === 'zh-tw';
    const isHindi = language === 'hi';
    
    if (isCJK || isHindi) {
      if (len > 80) return "text-lg sm:text-xl md:text-2xl lg:text-[2.6rem]";
      if (len > 60) return "text-xl sm:text-2xl md:text-3xl lg:text-[3.2rem]";
      if (len > 40) return "text-2xl sm:text-3xl md:text-4xl lg:text-[3.8rem]";
      if (len > 25) return "text-3xl sm:text-4xl md:text-5xl lg:text-[4.4rem]";
      return "text-4xl sm:text-5xl md:text-[3.8rem] lg:text-[5rem]";
    } else {
      if (len > 120) return "text-lg sm:text-xl md:text-2xl lg:text-[2.6rem]";
      if (len > 100) return "text-xl sm:text-2xl md:text-3xl lg:text-[3.2rem]";
      if (len > 80) return "text-2xl sm:text-3xl md:text-4xl lg:text-[3.8rem]";
      if (len > 65) return "text-3xl sm:text-4xl md:text-5xl lg:text-[4.5rem]";
      if (len > 45) return "text-4xl sm:text-5xl md:text-[3.5rem] lg:text-[5.0rem]";
      return "text-4xl sm:text-5xl md:text-[4.2rem] lg:text-[5.6rem]";
    }
  }, [quote, language]);

  const getWrappedLines = useCallback((charClass: string) => {
    const isCJK = language === 'ja' || language === 'ko' || language === 'zh-tw';
    const isHindi = language === 'hi';

    const charStyle = {
      opacity: 0,
      transform: 'translateY(40px)',
      filter: 'blur(20px)',
    };

    return quoteLines.map((line, lineIdx) => {
      if (isHindi) {
        return (
          <span key={lineIdx} className="block leading-relaxed">
            {line.split(" ").map((word, wi) => (
              <span key={wi} className={`${charClass} inline-block will-change-transform mr-[0.25em]`} style={charStyle}>
                {word}
              </span>
            ))}
          </span>
        );
      }
      
      if (isCJK) {
        return (
          <span key={lineIdx} className="block leading-relaxed">
            {line.split("").map((char, ci) => (
              <span key={ci} className={`${charClass} inline-block will-change-transform`} style={charStyle}>
                {char === ' ' || char === '　' ? '\u00A0' : char}
              </span>
            ))}
          </span>
        );
      }

      // Latin split
      const wordList = line.split(" ");
      return (
        <span key={lineIdx} className="block leading-relaxed">
          {wordList.map((word, wi) => {
            const charElements = word.split("").map((char, ci) => (
              <span key={ci} className={`${charClass} inline-block will-change-transform`} style={charStyle}>
                {char}
              </span>
            ));
            return (
              <span key={wi} className="inline-block whitespace-nowrap mr-[0.25em]">
                {charElements}
              </span>
            );
          })}
        </span>
      );
    });
  }, [quoteLines, language]);

  const wrappedLinesBase = useMemo(() => getWrappedLines('p-char'), [getWrappedLines]);
  const wrappedLinesOutline = useMemo(() => getWrappedLines('p-char-outline'), [getWrappedLines]);

  // Image load detector to fade in the multiply overlay and faint background
  useEffect(() => {
    if (!bgImage || !mounted) return;
    const img = new window.Image();
    img.onload = () => {
      const overlay = document.getElementById("image-overlay");
      const bgOverlay = document.getElementById("bg-image-overlay");
      if (overlay) {
        overlay.style.backgroundImage = `url("${bgImage}")`;
        overlay.style.opacity = '1';
      }
      if (bgOverlay) {
        bgOverlay.style.backgroundImage = `url("${bgImage}")`;
        bgOverlay.style.opacity = '0.15';
      }
    };
    img.src = bgImage;
  }, [bgImage, mounted]);

  const initAudio = () => {
    if (audioCtxRef.current) return;
    try {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioContextClass) return;
      const audioCtx = new AudioContextClass();
      audioCtxRef.current = audioCtx;
      
      const osc1 = audioCtx.createOscillator();
      const osc2 = audioCtx.createOscillator();
      const filter = audioCtx.createBiquadFilter();
      const gainNode = audioCtx.createGain();
      
      osc1.type = 'sawtooth';
      osc1.frequency.setValueAtTime(55, audioCtx.currentTime);
      
      osc2.type = 'square';
      osc2.frequency.setValueAtTime(55.4, audioCtx.currentTime);
      
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(140, audioCtx.currentTime);
      
      gainNode.gain.setValueAtTime(0.0, audioCtx.currentTime);
      gainNode.gain.linearRampToValueAtTime(0.07, audioCtx.currentTime + 3.0);
      
      osc1.connect(filter);
      osc2.connect(filter);
      filter.connect(gainNode);
      gainNode.connect(audioCtx.destination);
      
      osc1.start();
      osc2.start();

      osc1Ref.current = osc1;
      osc2Ref.current = osc2;
      droneGainRef.current = gainNode;
    } catch(e) {
      console.warn("Audio Context failed to initialize:", e);
    }
  };

  const fadeOutAudio = () => {
    if (audioCtxRef.current && droneGainRef.current) {
      try {
        const currTime = audioCtxRef.current.currentTime;
        droneGainRef.current.gain.setValueAtTime(droneGainRef.current.gain.value, currTime);
        droneGainRef.current.gain.exponentialRampToValueAtTime(0.0001, currTime + 1.2);
        
        setTimeout(() => {
          osc1Ref.current?.stop();
          osc2Ref.current?.stop();
          audioCtxRef.current?.close();
        }, 1300);
      } catch(e) {
        console.warn("Audio Context clean up error:", e);
      }
    }
  };

  const dismiss = useCallback(() => {
    if (exiting) return;
    setExiting(true);
    fadeOutAudio();
    
    const exitTl = createTimeline({
      defaults: {
        ease: 'easeInQuad'
      },
      onComplete: () => {
        setComplete(true);
        onComplete?.();
        document.body.style.overflow = "";
      }
    });

    const pChars = document.querySelectorAll('.p-char');
    if (pChars.length > 0) {
      exitTl.add('.p-char', {
        opacity: 0,
        translateY: -60,
        filter: 'blur(30px)',
        delay: stagger(10, { from: 'center' }),
        duration: 1000
      }, 0);
      exitTl.add('.p-char-outline', {
        opacity: 0,
        translateY: -60,
        filter: 'blur(30px)',
        delay: stagger(10, { from: 'center' }),
        duration: 1000
      }, 0);
    }

    if (sourceRef.current) {
      exitTl.add(sourceRef.current, {
        opacity: 0,
        duration: 800
      }, 0);
    }
    if (sourceOutlineRef.current) {
      exitTl.add(sourceOutlineRef.current, {
        opacity: 0,
        duration: 800
      }, 0);
    }

    exitTl.add('.skip-btn', {
      opacity: 0,
      translateY: -20,
      duration: 600,
      ease: 'easeInCubic'
    }, 0);
  }, [exiting, onComplete]);

  const dismissRef = useRef(dismiss);
  useEffect(() => {
    dismissRef.current = dismiss;
  }, [dismiss]);

  useEffect(() => {
    if (complete || !mounted) return;
    document.body.style.overflow = "hidden";

    const handleUserInteraction = () => {
      initAudio();
      if (audioCtxRef.current && audioCtxRef.current.state === "suspended") {
        audioCtxRef.current.resume();
      }
    };
    window.addEventListener("click", handleUserInteraction);
    window.addEventListener("touchmove", handleUserInteraction);

    // Stagger character reveal animations like V1
    const tl = createTimeline({
      defaults: {
        ease: 'easeOutQuint'
      }
    });
    timelineRef.current = tl;

    const pChars = document.querySelectorAll('.p-char');
    if (pChars.length > 0) {
      tl.add('.p-char', {
        opacity: [0, 1],
        translateY: [40, 0],
        filter: ['blur(20px)', 'blur(0px)'],
        duration: 800,
        delay: stagger(15),
        ease: 'easeOutQuart'
      }, 400);

      tl.add('.p-char-outline', {
        opacity: [0, 1],
        translateY: [40, 0],
        filter: ['blur(20px)', 'blur(0px)'],
        duration: 800,
        delay: stagger(15),
        ease: 'easeOutQuart'
      }, 400);
    }

    if (sourceRef.current) {
      tl.add(sourceRef.current, {
        opacity: [0, 1],
        translateY: [20, 0],
        duration: 1200,
        ease: 'easeOutCubic'
      }, 1000);
    }
    if (sourceOutlineRef.current) {
      tl.add(sourceOutlineRef.current, {
        opacity: [0, 1],
        translateY: [20, 0],
        duration: 1200,
        ease: 'easeOutCubic'
      }, 1000);
    }

    exitTimeoutRef.current = setTimeout(() => dismissRef.current(), readTime);

    return () => {
      window.removeEventListener("click", handleUserInteraction);
      window.removeEventListener("touchmove", handleUserInteraction);
      if (exitTimeoutRef.current) clearTimeout(exitTimeoutRef.current);
      if (timelineRef.current) timelineRef.current.pause();
    };
  }, [complete, mounted, readTime]);

  if (complete || !quoteData) return null;

  return (
    <div 
      ref={containerRef} 
      onClick={() => dismiss()}
      className={`fixed inset-0 z-[999999] bg-[#030305] flex flex-col items-center justify-center overflow-hidden px-8 md:px-24 cursor-pointer select-none ${fraunces.variable} ${outfit.variable}`}
    >
      {/* Central Typographic Block */}
      <div className="relative z-20 w-full max-w-6xl flex flex-col items-center justify-center text-center gap-12">
        
        {/* Quote lines with background-clip: text (1.4x dynamic font scale, non-italic) */}
        <div 
          id="quote-wrapper"
          className={`relative z-10 font-serif font-bold tracking-wide select-none w-full text-center ${quoteFontSizeClass}`}
          style={{ color: '#EDE4D3' }}
        >
          {wrappedLinesBase}
        </div>

        {/* Attribution & thin Forge-Orange separator line */}
        <div 
          ref={sourceRef}
          className="attribution flex flex-col items-center gap-3 opacity-0"
        >
          <div className="w-[60px] h-[2px] bg-[var(--forge-orange)]" />
          <div className="font-mono text-[13px] md:text-[15px] uppercase tracking-[0.4em] text-[var(--muted-label)]">
            {source}
          </div>
        </div>

      </div>

      {/* Skip button corner indicator */}
      <button 
        onClick={(e) => { e.stopPropagation(); dismiss(); }}
        className="skip-btn absolute bottom-8 right-8 z-30 pointer-events-auto font-mono text-[9px] font-bold tracking-[0.25em] uppercase text-[var(--muted-label)] hover:text-[#EDE4D3] transition-colors duration-300 bg-transparent border-none outline-none cursor-pointer"
      >
        skip ↗
      </button>

      {/* Progress bar line at the very bottom mapped dynamically to readTime */}
      <div className="progress-container absolute bottom-0 left-0 w-full h-[2px] bg-white/5 z-20">
        <div 
          className="progress-fill h-full bg-[var(--forge-orange)]" 
          style={{ animationDuration: `${readTime}ms` }}
        />
      </div>

      {/* BACKGROUND IMAGE OVERLAY (Faint 15% opacity) */}
      <div 
        id="bg-image-overlay"
        className="absolute inset-0 pointer-events-none z-[10]"
        style={{
          opacity: 0,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          transition: 'opacity 1s ease-in-out'
        }}
      />

      {/* FULL SCREEN IMAGE OVERLAY WITH MULTIPLY */}
      <div 
        id="image-overlay"
        className="absolute inset-0 pointer-events-none mix-blend-multiply z-[40]"
        style={{
          opacity: 0,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          transition: 'opacity 1s ease-in-out'
        }}
      />

      {/* STROKE OVERLAY FOR READABILITY (z-[50]) */}
      <div className="absolute inset-0 pointer-events-none z-[50] flex flex-col items-center justify-center px-8 md:px-24">
        <div className="relative w-full max-w-6xl flex flex-col items-center justify-center text-center gap-12">
          
          <div 
            className={`font-serif font-bold tracking-wide select-none w-full text-center ${quoteFontSizeClass}`}
            style={{ 
              color: 'transparent',
              WebkitTextStroke: '0.5px rgba(255, 255, 255, 0.7)'
            }}
          >
            {wrappedLinesOutline}
          </div>

          <div 
            ref={sourceOutlineRef}
            className="attribution flex flex-col items-center gap-3 opacity-0"
          >
            {/* Transparent line to match layout gap */}
            <div className="w-[60px] h-[2px] bg-transparent" />
            <div 
              className="font-mono text-[13px] md:text-[15px] uppercase tracking-[0.4em]"
              style={{ 
                color: 'transparent',
                WebkitTextStroke: '0.5px rgba(255, 255, 255, 0.7)'
              }}
            >
              {source}
            </div>
          </div>

        </div>
      </div>

      {/* Texture Overlays */}
      <div className="absolute inset-0 pointer-events-none z-50 opacity-[0.08] grain-overlay mix-blend-overlay" />

      <style jsx global>{`
        .grain-overlay {
          position: fixed;
          inset: 0;
          width: 100%;
          height: 100%;
          z-index: 50;
          pointer-events: none;
          opacity: 0.015;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E");
        }



        .progress-fill {
          width: 0%;
          animation: progressFill linear forwards;
        }

        @keyframes progressFill {
          to { width: 100%; }
        }
      `}</style>
    </div>
  );
}
