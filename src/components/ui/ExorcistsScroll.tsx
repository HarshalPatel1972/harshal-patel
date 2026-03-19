import React, { useMemo, useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { OFUDA_FACTS } from '@/lib/ofudaFacts';
import { getNextFact } from '@/lib/ofudaMemory';
import { animate as anime, stagger } from 'animejs';
 
interface ActiveCard {
  id: number;
  fact: string;
  isAssembled: boolean;
  rect: DOMRect | null;
}
 
const CharacterInscription: React.FC<{ text: string }> = ({ text }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const words = useMemo(() => text.split(" "), [text]);
 
  useEffect(() => {
    if (!containerRef.current) return;
    anime(containerRef.current.querySelectorAll('.ofuda-char'), {
      opacity: [0, 1],
      translateY: [15, 0],
      filter: ['blur(12px)', 'blur(0px)'],
      duration: 1200,
      delay: stagger(25),
      easing: 'easeOutQuart'
    });
  }, [text]);
 
  return (
    <div ref={containerRef} className="w-full h-full p-6 md:p-10 flex flex-col items-center justify-center text-center relative z-10">
      <div className="text-white font-inter text-lg md:text-xl lg:text-3xl leading-[1.3] font-black tracking-tighter text-center uppercase" 
           style={{ 
             textShadow: '0 0 20px rgba(217,17,17,0.8)' 
           }}>
        {words.map((word, wi) => (
          <span key={wi} className="inline-block whitespace-nowrap mr-[0.3em]">
            {word.split("").map((char, ci) => (
              <span key={ci} className="ofuda-char inline-block opacity-0 will-change-transform">{char}</span>
            ))}
          </span>
        ))}
      </div>
    </div>
  );
};
 
const ExorcistsScroll: React.FC = () => {
  const [activeCard, setActiveCard] = useState<ActiveCard | null>(null);
  const [mounted, setMounted] = useState(false);
  const [showShutters, setShowShutters] = useState(false);
 
  useEffect(() => { setMounted(true); }, []);
 
  const handleCardClick = (id: number, e: React.MouseEvent<HTMLButtonElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const { fact } = getNextFact(OFUDA_FACTS);
    setActiveCard({ id, fact, isAssembled: false, rect });
    setTimeout(() => setShowShutters(true), 50);
    setTimeout(() => {
      setActiveCard(prev => prev ? { ...prev, isAssembled: true } : null);
    }, 1100); 
  };
 
  const handleDismiss = () => {
    setActiveCard(prev => prev ? { ...prev, isAssembled: false } : null);
    setTimeout(() => { setShowShutters(false); }, 100);
    setTimeout(() => { setActiveCard(null); }, 1200);
  };
 
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => { if (e.key === 'Escape') handleDismiss(); };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [activeCard]);
 
  const segments = useMemo(() => {
    return Array.from({ length: 12 }).map((_, i) => ({
      id: i,
      hex: ["0xINIT", "0xMEM", "0xSYS", "0xEXEC", "0xVOID", "0xCORE"][i % 6],
      delay: i * -1.25
    }));
  }, []);
 
  const SystemNodes = () => {
    return (
      <>
        <div className="absolute top-0 left-0 w-12 h-12 border-t-2 border-l-2 border-red-600/80 z-30" />
        <div className="absolute top-0 right-0 w-12 h-12 border-t-2 border-r-2 border-red-600/80 z-30" />
        <div className="absolute bottom-0 left-0 w-12 h-12 border-b-2 border-l-2 border-red-600/80 z-30" />
        <div className="absolute bottom-0 right-0 w-12 h-12 border-b-2 border-r-2 border-red-600/80 z-30" />
      </>
    );
  };
 
  // MOBILE-ONLY RESTRICTION
  if (mounted && window.innerWidth >= 1024) return null;
 
  return (
    <div className="absolute inset-0 flex items-center justify-center z-0 pointer-events-none overflow-hidden sm:flex md:hidden lg:hidden">
      {/* ─── LEGACY 97ca6550 DESIGN FLOATING FLOW ─── */}
      <div className="relative w-full h-[600px] flex items-center justify-center translate-y-[-10%] pointer-events-none">
        {segments.map((s) => (
          <div 
            key={s.id}
            className="absolute flex flex-col items-center justify-center pointer-events-none will-change-transform"
            style={{ animation: `scroll-flow 20s linear infinite`, animationDelay: `${s.delay}s` }}
          >
            <button 
              onClick={(e) => { e.stopPropagation(); handleCardClick(s.id, e); }}
              data-cursor="play"
              disabled={activeCard !== null}
              className="group ofuda-talisman pointer-events-auto relative w-12 md:w-20 h-32 md:h-48 border-2 border-red-600/60 bg-black flex flex-col items-center justify-between py-4 shadow-2xl transition-all duration-300 hover:border-red-500 hover:shadow-[0_0_12px_rgba(217,17,17,0.3)] hover:scale-[1.05] cursor-pointer"
            >
               {/* 1. Ritual Seals (Top Squares from Legacy Art) */}
               <div className="flex gap-1 opacity-80">
                  {[1,2,3].map(j => (
                    <div key={j} className="w-2 md:w-3 h-2 md:h-3 border border-red-600 rotate-45 flex items-center justify-center">
                      <div className="w-[1px] h-[1px] bg-red-600" />
                    </div>
                  ))}
               </div>
 
               {/* 2. The Central "Eye" Pulse (Legacy Architecture) */}
               <div className="relative w-full flex items-center justify-center py-2">
                  <div className="absolute inset-0 bg-red-600/5 blur-xl rounded-full" />
                  <div className="relative">
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1px] h-12 md:h-16 bg-red-600/40" />
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 md:w-16 h-[1px] bg-red-600/40" />
                    <div className="w-4 h-4 md:w-6 md:h-6 border-2 border-red-600/80 rounded-full flex items-center justify-center p-[2px]">
                      <div className="w-full h-full bg-red-600 rounded-full animate-pulse" />
                    </div>
                  </div>
               </div>
 
               {/* 3. Legacy Hex Inscription */}
               <span className="font-mono text-[9px] md:text-[10px] font-black rotate-[-90deg] whitespace-nowrap text-red-600/90 tracking-[0.2em] group-hover:text-red-500 transition-colors">
                  {s.hex}
               </span>
 
               {/* 4. Bottom Ritual Anchor */}
               <div className="flex flex-col gap-1 items-center opacity-80">
                  <div className="w-1 md:w-1.5 h-1 md:h-1.5 border border-red-600 rotate-45" />
               </div>
            </button>
          </div>
        ))}
      </div>
 
      {/* ─── PORTAL REMAINS IN LATEST COMPACT STATE ─── */}
      {mounted && activeCard && createPortal(
        <div className="fixed inset-0" style={{ zIndex: 999999, pointerEvents: 'auto' }}>
          <div 
            className={`fixed inset-0 bg-black/95 transition-opacity duration-[1200ms] ${showShutters ? 'opacity-98' : 'opacity-0'}`}
            onClick={handleDismiss}
          />
 
          <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[75vw] md:w-[320px] h-[50vh] md:h-[460px] pointer-events-none" style={{ zIndex: 9999991 }}>
             <div className={`absolute inset-0 bg-black border border-red-600/30 flex items-center justify-center overflow-hidden transition-all duration-1000 ${activeCard.isAssembled ? 'opacity-100 scale-100' : 'opacity-0 scale-102'}`}>
                <div className="absolute inset-0 blood-grid opacity-10" />
                <div className="absolute inset-0 red-halftone opacity-5" />
                <div className="absolute inset-x-0 bottom-0 h-[100px] bg-gradient-to-t from-red-600/10 to-transparent pointer-events-none" />
                <SystemNodes />
                {activeCard.isAssembled && <CharacterInscription text={activeCard.fact} />}
             </div>
 
             <div className="absolute inset-0 z-10 pointer-events-none overflow-hidden" 
                  style={{ visibility: activeCard.isAssembled ? 'hidden' : 'visible' }}>
                {[0,1,2,3].map(i => {
                   const fromAbove = i % 2 !== 0;
                   return (
                      <div 
                        key={i}
                        className="absolute inset-y-0 w-[25.2%] overflow-hidden bg-black transition-all duration-[900ms] cubic-bezier(0.19, 1, 0.22, 1)"
                        style={{
                           left: `${i * 25}%`,
                           transform: showShutters ? 'translateY(0%)' : `translateY(${fromAbove ? '-130%' : '130%'})`,
                           transitionDelay: showShutters ? `${i * 100}ms` : `${(3-i) * 60}ms`,
                           opacity: activeCard.isAssembled ? 0 : 1,
                        }}
                      />
                   );
                })}
             </div>
          </div>
        </div>,
        document.body
      )}
 
      <style>{`
        @keyframes scroll-flow {
          0% { transform: translate3d(100vw, 20vh, 0) rotateZ(8deg) scale(0.6); opacity: 0; }
          45%, 55% { opacity: 1; }
          50% { transform: translate3d(0vw, 5vh, 0) rotateZ(0deg) scale(1.1); }
          100% { transform: translate3d(-100vw, -20vh, 0) rotateZ(-8deg) scale(0.6); opacity: 0; }
        }
        .blood-grid {
          background-image: linear-gradient(rgba(217, 17, 17, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(217, 17, 17, 0.1) 1px, transparent 1px);
          background-size: 80px 80px;
        }
        .red-halftone {
          background-image: radial-gradient(#D91111 1.2px, transparent 1.2px);
          background-size: 10px 10px;
        }
      `}</style>
    </div>
  );
};
 
export default ExorcistsScroll;
