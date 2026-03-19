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
    <div ref={containerRef} className="w-full h-full p-10 md:p-16 flex flex-col items-center justify-center text-center relative z-10">
      <div className="text-[#E8E8E6] font-hindi text-2xl md:text-3xl lg:text-5xl leading-[1] font-black tracking-tight text-center uppercase" 
           style={{ textShadow: '0 0 30px rgba(217,17,17,0.6)' }}>
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
    // Phase 1: Reveal shutters again
    setActiveCard(prev => prev ? { ...prev, isAssembled: false } : null);
    
    // Phase 2: Slide shutters away
    setTimeout(() => {
       setShowShutters(false);
    }, 100);
 
    // Phase 3: Unmount
    setTimeout(() => { 
       setActiveCard(null); 
    }, 1200);
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
 
  const RitualSigils = () => (
    <>
      {[0,1,2,3].map(i => (
        <div key={i} className={`absolute w-12 h-12 border-t border-l border-[var(--accent-blood)] z-30 transition-opacity duration-1000 ${showShutters ? 'opacity-100' : 'opacity-0'}`}
             style={{ 
               top: i < 2 ? '0' : 'auto', 
               bottom: i >= 2 ? '0' : 'auto', 
               left: i % 2 === 0 ? '0' : 'auto', 
               right: i % 2 !== 0 ? '0' : 'auto',
               transform: `rotate(${i * 90}deg)`
             }} />
      ))}
    </>
  );
 
  // MOBILE-ONLY RESTRICTION
  if (mounted && window.innerWidth >= 1024) return null;
 
  return (
    <div className="absolute inset-0 flex items-center justify-center z-0 pointer-events-none overflow-hidden sm:flex md:hidden lg:hidden">
      {/* ─── FLOATING FLOW ─── */}
      <div className="relative w-full h-[600px] flex items-center justify-center translate-y-[-10%] pointer-events-none">
        {segments.map((s) => (
          <div 
            key={s.id}
            className="absolute flex flex-col items-center justify-center pointer-events-none"
            style={{ animation: `scroll-flow 15s linear infinite`, animationDelay: `${s.delay}s`, willChange: 'transform' }}
          >
            <button 
              onClick={(e) => { e.stopPropagation(); handleCardClick(s.id, e); }}
              data-cursor="play"
              disabled={activeCard !== null}
              className="ofuda-talisman pointer-events-auto relative w-12 md:w-20 h-32 md:h-48 border border-[var(--accent-blood)] bg-black flex flex-col items-center justify-between py-4 hover:scale-[1.1] transition-all duration-300"
            >
               <div className="w-2 h-2 border border-[var(--accent-blood)] rotate-45 opacity-60" />
               <div className="w-5 h-5 border border-[var(--accent-blood)] rounded-full animate-pulse" />
               <span className="text-[10px] font-mono font-black rotate-[-90deg] text-[var(--accent-blood)] tracking-widest opacity-80">{s.hex}</span>
            </button>
          </div>
        ))}
      </div>
 
      {/* ─── MAPPA CINEMATIC PORTAL ─── */}
      {mounted && activeCard && createPortal(
        <div className="fixed inset-0" style={{ zIndex: 999999, pointerEvents: 'auto' }}>
          <div 
            className={`fixed inset-0 bg-[#020202] transition-opacity duration-[1200ms] ${showShutters ? 'opacity-98' : 'opacity-0'}`}
            onClick={handleDismiss}
          />
 
          <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[92vw] md:w-[460px] h-[75vh] md:h-[640px] pointer-events-none" style={{ zIndex: 9999991 }}>
             {/* 1. Underlying Truth Layer */}
             <div className={`absolute inset-0 bg-[#030303] flex items-center justify-center overflow-hidden transition-all duration-1000 ${activeCard.isAssembled ? 'opacity-100 scale-100' : 'opacity-0 scale-105'}`}>
                <div className="absolute inset-0 border-2 border-[var(--accent-blood)] shadow-[inset_0_0_80px_rgba(217,17,17,0.3),0_0_40px_rgba(217,17,17,0.2)]" />
                <div className="absolute inset-0 ritual-grid opacity-15" />
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(217,17,17,0.1)_0%,transparent_90%)]" />
                <div className="absolute inset-0 halftone-bg opacity-20 mix-blend-screen animate-pulse" style={{ animationDuration: '0.1s' }} />
                <RitualSigils />
                {activeCard.isAssembled && <CharacterInscription text={activeCard.fact} />}
             </div>
 
              <div className="absolute inset-0 z-10 pointer-events-none overflow-hidden" style={{ visibility: activeCard.isAssembled ? 'hidden' : 'visible' }}>
                 {[0,1,2,3].map(i => {
                   const fromAbove = i % 2 !== 0;
                   return (
                      <div 
                        key={i}
                        className="absolute inset-y-0 w-[25.2%] overflow-hidden bg-black transition-all duration-[900ms] cubic-bezier(0.19, 1, 0.22, 1)"
                        style={{
                           left: `${i * 25}%`,
                           transform: showShutters ? 'translateY(0%)' : `translateY(${fromAbove ? '-125%' : '125%'})`,
                           transitionDelay: showShutters ? `${i * 80}ms` : `${(3-i) * 50}ms`,
                           opacity: activeCard.isAssembled ? 0 : 1,
                        }}
                      >
                         <div className="absolute inset-0 flex flex-col items-center justify-center">
                            <div className="w-16 h-16 border border-[var(--accent-blood)] rotate-45 opacity-20 blur-[1px]" />
                         </div>
                      </div>
                   );
                })}
             </div>
          </div>
        </div>,
        document.body
      )}
 
      <style>{`
        @keyframes scroll-flow {
          0% { transform: translate3d(100vw, 20vh, 0) rotateZ(15deg) scale(0.6); opacity: 0; }
          45%, 55% { opacity: 1; }
          50% { transform: translate3d(0vw, 5vh, 0) rotateZ(0deg) scale(1.1); }
          100% { transform: translate3d(-100vw, -20vh, 0) rotateZ(-15deg) scale(0.6); opacity: 0; }
        }
        .ritual-grid {
          background-image: linear-gradient(rgba(217, 17, 17, 0.12) 1px, transparent 1px), linear-gradient(90deg, rgba(217, 17, 17, 0.12) 1px, transparent 1px);
          background-size: 50px 50px;
        }
        .halftone-bg {
          background-image: radial-gradient(rgba(217,17,17,0.3) 1px, transparent 1px);
          background-size: 5px 5px;
        }
      `}</style>
    </div>
  );
};
 
export default ExorcistsScroll;
