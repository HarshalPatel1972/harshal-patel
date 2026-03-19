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
    <div ref={containerRef} className="w-full h-full p-8 md:p-12 flex flex-col items-center justify-center text-center relative z-10">
      <div className="text-white font-inter text-xl md:text-2xl lg:text-4xl leading-[1.2] font-black tracking-tighter text-center uppercase" 
           style={{ 
             textShadow: '0 0 20px rgba(217,17,17,0.7)' 
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
      delay: i * -1.25
    }));
  }, []);
 
  const SystemNodes = () => {
    const corners = [
      "top-0 left-0 border-t-2 border-l-2",
      "top-0 right-0 border-t-2 border-r-2",
      "bottom-0 left-0 border-b-2 border-l-2",
      "bottom-0 right-0 border-b-2 border-r-2"
    ];
    return (
      <>
        {corners.map((c, i) => (
          <div key={i} className={`absolute w-14 h-14 z-30 transition-all duration-1000 ${showShutters ? 'opacity-100 scale-100' : 'opacity-0 scale-120'}`}>
             <div className={`w-full h-full border-red-600/60 ${c}`} />
          </div>
        ))}
      </>
    );
  };
 
  // MOBILE-ONLY RESTRICTION
  if (mounted && window.innerWidth >= 1024) return null;
 
  return (
    <div className="absolute inset-0 flex items-center justify-center z-0 pointer-events-none overflow-hidden sm:flex md:hidden lg:hidden">
      {/* ─── FLOATING FLOW (Performance Optimized) ─── */}
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
              className="group ofuda-talisman pointer-events-auto relative w-14 md:w-16 h-36 md:h-48 border border-red-600/20 bg-[#080000] flex flex-col items-center justify-between pb-6 pt-6 px-1 hover:scale-[1.12] hover:border-red-600 transition-all duration-200 shadow-xl overflow-hidden"
            >
               {/* Simplified Surface Design */}
               <div className="w-1.5 h-1.5 bg-red-600 rounded-full shadow-[0_0_8px_#D91111] z-10" />
               
               <div className="flex flex-col items-center justify-center w-full gap-4 z-10">
                  <div className="w-[1px] h-12 bg-red-600/30 group-hover:h-16 transition-all duration-300" />
                  <div className="w-full h-[0.5px] bg-red-600/20 group-hover:bg-red-600 transition-all duration-300 mx-2" />
                  <div className="w-[1px] h-12 bg-red-600/30 group-hover:h-16 transition-all duration-300" />
               </div>
 
               <div className="w-full flex flex-col items-center gap-1 opacity-20 group-hover:opacity-40 transition-opacity z-10">
                  <div className="w-full h-[4px] bg-red-600/50" />
               </div>
            </button>
          </div>
        ))}
      </div>
 
      {/* ─── PRODUCTION PORTAL (Performance Optimized) ─── */}
      {mounted && activeCard && createPortal(
        <div className="fixed inset-0" style={{ zIndex: 999999, pointerEvents: 'auto' }}>
          <div 
            className={`fixed inset-0 bg-black/95 transition-opacity duration-[1200ms] ${showShutters ? 'opacity-98' : 'opacity-0'}`}
            onClick={handleDismiss}
          />
 
          <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[85vw] md:w-[400px] h-[65vh] md:h-[580px] pointer-events-none" style={{ zIndex: 9999991 }}>
             <div className={`absolute inset-0 bg-black border border-red-600/20 flex items-center justify-center overflow-hidden transition-all duration-1000 ${activeCard.isAssembled ? 'opacity-100 scale-100' : 'opacity-0 scale-102'}`}>
                
                {/* Surface Inscriptions (Performance Cache) */}
                <div className="absolute inset-0 blood-grid opacity-10" />
                <div className="absolute inset-0 red-halftone opacity-5" />
                
                {/* Vertical Tracers */}
                <div className="absolute inset-y-0 left-12 w-[0.5px] bg-red-600/5" />
                <div className="absolute inset-y-0 right-12 w-[0.5px] bg-red-600/5" />
                
                {/* Bloom Highlight */}
                <div className="absolute inset-0 shadow-[inset_0_0_100px_rgba(217,17,17,0.1)]" />
                
                <SystemNodes />
                {activeCard.isAssembled && <CharacterInscription text={activeCard.fact} />}
             </div>
 
             {/* Vertical Assembly Shutters */}
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
                      >
                         <div className="w-[1px] h-full bg-red-600/10 mx-auto" />
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
          0% { transform: translate3d(100vw, 20vh, 0) rotateZ(10deg) scale(0.6); opacity: 0; }
          45%, 55% { opacity: 1; }
          50% { transform: translate3d(0vw, 5vh, 0) rotateZ(0deg) scale(1.1); }
          100% { transform: translate3d(-100vw, -20vh, 0) rotateZ(-10deg) scale(0.6); opacity: 0; }
        }
        .blood-grid {
          background-image: linear-gradient(rgba(217, 17, 17, 0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(217, 17, 17, 0.05) 1px, transparent 1px);
          background-size: 80px 80px;
        }
        .red-halftone {
          background-image: radial-gradient(#D91111 0.8px, transparent 0.8px);
          background-size: 10px 10px;
        }
      `}</style>
    </div>
  );
};
 
export default ExorcistsScroll;
