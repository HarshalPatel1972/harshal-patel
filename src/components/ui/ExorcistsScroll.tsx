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
           style={{ textShadow: '0 0 30px rgba(217,17,17,0.8)' }}>
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
 
  const RitualSigils = () => (
    <>
      {[0,1,2,3].map(i => (
        <div key={i} className={`absolute w-16 h-16 opacity-60 z-30 transition-all duration-1000 ${showShutters ? 'p-1 opacity-100 scale-100' : 'p-0 opacity-0 scale-120'}`}
             style={{ 
               top: i < 2 ? '0' : 'auto', 
               bottom: i >= 2 ? '0' : 'auto', 
               left: i % 2 === 0 ? '0' : 'auto', 
               right: i % 2 !== 0 ? '0' : 'auto',
               transform: `rotate(${i * 90}deg)`
             }}>
           <div className="w-full h-full border-t-4 border-l-4 border-[var(--accent-blood)] animate-pulse" />
           <div className="absolute top-0 left-0 w-2 h-2 bg-[var(--accent-blood)]" />
        </div>
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
              className="ofuda-talisman pointer-events-auto relative w-12 md:w-20 h-32 md:h-48 border border-[var(--accent-blood)] bg-black/80 flex flex-col items-center justify-between py-4 hover:scale-[1.1] transition-all duration-300"
            >
               <div className="w-2 h-2 border border-[var(--accent-blood)] rotate-45 opacity-60" />
               <div className="w-5 h-5 border border-[var(--accent-blood)] rounded-full animate-pulse" />
            </button>
          </div>
        ))}
      </div>
 
      {/* ─── MAPPA ART PRODUCTION PORTAL ─── */}
      {mounted && activeCard && createPortal(
        <div className="fixed inset-0" style={{ zIndex: 999999, pointerEvents: 'auto' }}>
          <div 
            className={`fixed inset-0 bg-[#020202] transition-opacity duration-[1200ms] ${showShutters ? 'opacity-98' : 'opacity-0'}`}
            onClick={handleDismiss}
          />
 
          <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[92vw] md:w-[460px] h-[75vh] md:h-[640px] pointer-events-none" style={{ zIndex: 9999991 }}>
             {/* 1. Underlying Truth Layer (Anime Art Standard) */}
             <div className={`absolute inset-0 bg-[#030303] flex items-center justify-center overflow-hidden transition-all duration-1000 ${activeCard.isAssembled ? 'opacity-100 scale-100' : 'opacity-0 scale-105'}`}>
                {/* Ritual Sea Texture (The Cursed Core) */}
                <div className="absolute inset-x-0 bottom-0 top-0 opacity-40 mix-blend-screen overflow-hidden group">
                   <img 
                      src="/mappa_ritual_seal_texture_1773944825802.png" 
                      alt="Cursed Energy Texture" 
                      className="w-full h-full object-cover scale-110 group-hover:scale-100 transition-transform duration-[4000ms] filter hue-rotate-[15deg] brightness-75"
                   />
                </div>
 
                {/* Glowing Emittance Border (Volumetric) */}
                <div className="absolute inset-0 border-[3px] border-[var(--accent-blood)] shadow-[inset_0_0_120px_rgba(217,17,17,0.4),0_0_60px_rgba(217,17,17,0.3)] animate-pulse" />
                
                {/* Advanced Ritual Elements */}
                <div className="absolute inset-0 ritual-grid opacity-20" />
                <div className="absolute inset-0 halftone-bg opacity-30" />
                
                {/* Ink Wash Vignette */}
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.8)_100%)] opacity-80" />
                
                <RitualSigils />
                {activeCard.isAssembled && <CharacterInscription text={activeCard.fact} />}
             </div>
 
             {/* 2. Vertical Assembly Pillars (Shutters) */}
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
                           transform: showShutters ? 'translateY(0%)' : `translateY(${fromAbove ? '-125%' : '125%'})`,
                           transitionDelay: showShutters ? `${i * 80}ms` : `${(3-i) * 50}ms`,
                           opacity: activeCard.isAssembled ? 0 : 1,
                        }}
                      >
                         <div className="absolute inset-0 flex flex-col items-center justify-center">
                            {/* Brush-stroke Sigil Placeholders */}
                            <div className="w-20 h-20 border-2 border-[var(--accent-blood)] rotate-45 opacity-20 blur-[2px] animate-spin" style={{ animationDuration: '4s' }} />
                            <div className="w-8 h-32 bg-[var(--accent-blood)] opacity-10 absolute -rotate-12 blur-[10px]" />
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
          background-image: linear-gradient(rgba(217, 17, 17, 0.15) 1px, transparent 1px), linear-gradient(90deg, rgba(217, 17, 17, 0.15) 1px, transparent 1px);
          background-size: 60px 60px;
        }
        .halftone-bg {
          background-image: radial-gradient(rgba(217,17,17,0.4) 1px, transparent 1px);
          background-size: 6px 6px;
        }
      `}</style>
    </div>
  );
};
 
export default ExorcistsScroll;
