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
             textShadow: '0 0 10px rgba(217,17,17,0.5), 0 0 30px rgba(255,255,255,0.2)' 
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
    return (
      <>
        {[0,1,2,3].map(i => (
          <div key={i} className={`absolute w-12 h-12 z-30 transition-all duration-1000 ${showShutters ? 'opacity-80 scale-100' : 'opacity-0 scale-110'}`}
               style={{ 
                 top: i < 2 ? '0' : 'auto', 
                 bottom: i >= 2 ? '0' : 'auto', 
                 left: i % 2 === 0 ? '0' : 'auto', 
                 right: i % 2 !== 0 ? '0' : 'auto',
               }}>
             <div className="w-full h-full border-t border-l border-red-600/40 shadow-[0_0_8px_rgba(217,17,17,0.2)]" />
          </div>
        ))}
      </>
    );
  };
 
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
              className="group ofuda-talisman pointer-events-auto relative w-12 md:w-16 h-36 md:h-48 border border-red-600/20 bg-black flex flex-col items-center justify-between pb-6 pt-6 px-2 hover:scale-[1.15] hover:border-red-600 transition-all duration-300 shadow-[0_40px_80px_rgba(0,0,0,0.8)] overflow-hidden"
            >
               {/* Surface Internal Grid */}
               <div className="absolute inset-0 system-grid opacity-10 group-hover:opacity-20 pointer-events-none" style={{ backgroundSize: '8px 8px' }} />
               
               {/* TOP: System Status */}
               <div className="w-2 h-2 bg-red-600 shadow-[0_0_12px_#D91111] animate-pulse z-10" />
               
               {/* MIDDLE: Blood-Red Frequency Stack */}
               <div className="flex flex-col items-center justify-center w-full gap-4 z-10">
                  <div className="w-[1px] h-10 bg-gradient-to-b from-transparent via-red-600/60 to-transparent group-hover:h-12 transition-all duration-500" />
                  <div className="w-6 h-[0.5px] bg-red-600/40 group-hover:bg-red-600 group-hover:w-full transition-all duration-500" />
                  <div className="w-3 h-3 flex items-center justify-center">
                     <div className="w-1.5 h-1.5 bg-white group-hover:animate-ping" />
                  </div>
                  <div className="w-6 h-[0.5px] bg-red-600/40 group-hover:bg-red-600 group-hover:w-full transition-all duration-500" />
                  <div className="w-[1px] h-10 bg-gradient-to-b from-transparent via-red-600/60 to-transparent group-hover:h-12 transition-all duration-500" />
               </div>
 
               {/* BOTTOM: Block Barcode */}
               <div className="w-full flex flex-col items-center gap-1 opacity-20 group-hover:opacity-60 transition-opacity z-10">
                  <div className="w-full h-[8px] flex gap-[1px]">
                     {[...Array(10)].map((_, i) => (
                        <div key={i} className="flex-1 bg-red-600" style={{ height: `${20 + Math.random() * 80}%` }} />
                     ))}
                  </div>
               </div>
            </button>
          </div>
        ))}
      </div>
 
      {/* ─── BLOOD-RED COMPACT PORTAL ─── */}
      {mounted && activeCard && createPortal(
        <div className="fixed inset-0" style={{ zIndex: 999999, pointerEvents: 'auto' }}>
          <div 
            className={`fixed inset-0 bg-[#000000]/98 transition-opacity duration-[1200ms] ${showShutters ? 'opacity-98' : 'opacity-0'}`}
            onClick={handleDismiss}
          />
 
          <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[85vw] md:w-[400px] h-[65vh] md:h-[580px] pointer-events-none" style={{ zIndex: 9999991 }}>
             <div className={`absolute inset-0 bg-[#000000] border border-red-600/20 flex items-center justify-center overflow-hidden transition-all duration-1000 ${activeCard.isAssembled ? 'opacity-100 scale-100' : 'opacity-0 scale-102'}`}>
                
                {/* Surface Inscriptions (Pure Red Halftone) */}
                <div className="absolute inset-0 blood-grid opacity-15" />
                <div className="absolute inset-0 red-halftone opacity-10" />
                
                {/* High-Mass Emittance */}
                <div className="absolute inset-0 shadow-[inset_0_0_120px_rgba(217,17,17,0.1),0_0_80px_rgba(217,17,17,0.05)]" />
                <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-red-600/40 to-transparent animate-pulse" />
                
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
                      >
                         <div className="absolute inset-y-0 w-full h-full flex flex-col items-center justify-center opacity-10">
                            <div className="w-[1px] h-32 bg-red-600/40" />
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
        .blood-grid {
          background-image: linear-gradient(rgba(217, 17, 17, 0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(217, 17, 17, 0.08) 1px, transparent 1px);
          background-size: 80px 80px;
        }
        .red-halftone {
          background-image: radial-gradient(#D91111 1px, transparent 1px);
          background-size: 8px 8px;
        }
      `}</style>
    </div>
  );
};
 
export default ExorcistsScroll;
