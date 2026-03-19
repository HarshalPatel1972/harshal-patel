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
             textShadow: '1px 0 10px rgba(0,255,255,0.4), -1px 0 10px rgba(217,17,17,0.4), 0 0 40px rgba(255,255,255,0.2)' 
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
    const metas = ["CORE.INIT", "SYS.BOOT", "MEM.PURGE", "LOAD.EXEC", "NULL.VOID", "ARCH.DNA"];
    return Array.from({ length: 12 }).map((_, i) => ({
      id: i,
      metadata: metas[i % 6],
      delay: i * -1.25,
      idCode: `EXO-${1000 + i}`
    }));
  }, []);
 
  const SystemNodes = () => {
    const rotations = [0, 90, 270, 180];
    return (
      <>
        {[0,1,2,3].map(i => (
          <div key={i} className={`absolute w-12 h-12 z-30 transition-all duration-1000 ${showShutters ? 'opacity-80' : 'opacity-0'}`}
               style={{ 
                 top: i < 2 ? '0' : 'auto', 
                 bottom: i >= 2 ? '0' : 'auto', 
                 left: i % 2 === 0 ? '0' : 'auto', 
                 right: i % 2 !== 0 ? '0' : 'auto',
                 transform: `rotate(${rotations[i]}deg)`
               }}>
             <div className="w-full h-full border-t-2 border-l-2 border-cyan-400/40" />
          </div>
        ))}
      </>
    );
  };
 
  // MOBILE-ONLY RESTRICTION
  if (mounted && window.innerWidth >= 1024) return null;
 
  return (
    <div className="absolute inset-0 flex items-center justify-center z-0 pointer-events-none overflow-hidden sm:flex md:hidden lg:hidden">
      {/* ─── FLOATING TALISMAN FLOW ─── */}
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
              className="group ofuda-talisman pointer-events-auto relative w-12 md:w-16 h-36 md:h-48 border border-white/10 bg-black flex flex-col items-center justify-between pb-4 pt-5 px-1.5 hover:scale-[1.15] hover:border-cyan-400/60 transition-all duration-300 shadow-[0_40px_80px_rgba(0,0,0,0.8)] overflow-hidden"
              style={{ clipPath: 'polygon(12% 0, 88% 0, 100% 6%, 100% 94%, 88% 100%, 12% 100%, 0 94%, 0 6%)' }}
            >
               {/* Surface Internal Grid */}
               <div className="absolute inset-0 system-grid opacity-10 group-hover:opacity-20 pointer-events-none" style={{ backgroundSize: '8px 8px' }} />
               
               {/* TOP: System Pulse */}
               <div className="w-1.5 h-1.5 bg-red-600 rounded-full animate-pulse shadow-[0_0_10px_#D91111] z-10" />
               
               {/* MIDDLE: Pure Frequency Architecture */}
               <div className="flex flex-col items-center justify-center w-full gap-5 z-10">
                  <div className="w-[1px] h-12 bg-gradient-to-b from-transparent via-cyan-400/80 to-transparent group-hover:h-16 transition-all duration-500" />
                  <div className="w-5 h-5 border border-white/30 rotate-45 flex items-center justify-center group-hover:border-cyan-400 group-hover:rotate-[225deg] transition-all duration-700">
                     <div className="w-1.5 h-1.5 bg-red-600 group-hover:bg-cyan-400" />
                  </div>
                  <div className="w-[1px] h-12 bg-gradient-to-b from-transparent via-cyan-400/80 to-transparent group-hover:h-16 transition-all duration-500" />
               </div>
 
               {/* BOTTOM: Holographic Geometric Barcode */}
               <div className="w-full flex flex-col items-center gap-1 opacity-10 group-hover:opacity-60 transition-opacity z-10">
                  <div className="w-full h-[6px] flex gap-[1.5px]">
                     {[...Array(10)].map((_, i) => (
                        <div key={i} className={`flex-1 ${i % 3 === 0 ? 'bg-red-600' : 'bg-cyan-400'}`} style={{ height: `${30 + Math.random() * 70}%` }} />
                     ))}
                  </div>
               </div>
            </button>
          </div>
        ))}
      </div>
 
      {/* ─── CYAN-HALO COMPACT PORTAL ─── */}
      {mounted && activeCard && createPortal(
        <div className="fixed inset-0" style={{ zIndex: 999999, pointerEvents: 'auto' }}>
          <div 
            className={`fixed inset-0 bg-[#000000]/98 transition-opacity duration-[1200ms] ${showShutters ? 'opacity-98' : 'opacity-0'}`}
            onClick={handleDismiss}
          />
 
          <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[85vw] md:w-[400px] h-[65vh] md:h-[580px] pointer-events-none" style={{ zIndex: 9999991 }}>
             <div className={`absolute inset-0 bg-[#000000] border border-white/10 flex items-center justify-center overflow-hidden transition-all duration-1000 ${activeCard.isAssembled ? 'opacity-100 scale-100' : 'opacity-0 scale-102'}`}>
                <div className="absolute inset-0 system-grid opacity-20" />
                <div className="absolute inset-0 cyan-halftone opacity-10" />
                <div className="absolute inset-0 border border-cyan-400/10 shadow-[inset_0_0_100px_rgba(0,255,255,0.05)]" />
                <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-red-600/30 to-transparent animate-pulse" />
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.06)_0%,transparent_85%)]" />
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
                            <div className="w-[1px] h-32 bg-cyan-400/40" />
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
        .system-grid {
          background-image: linear-gradient(rgba(0, 255, 255, 0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(0, 255, 255, 0.05) 1px, transparent 1px);
          background-size: 80px 80px;
        }
        .cyan-halftone {
          background-image: radial-gradient(#00FFFF 1px, transparent 1px);
          background-size: 8px 8px;
        }
      `}</style>
    </div>
  );
};
 
export default ExorcistsScroll;
