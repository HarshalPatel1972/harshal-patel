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
      <div className="text-white font-inter text-xl md:text-2xl lg:text-4xl leading-[1.2] font-black tracking-tight text-center uppercase" 
           style={{ 
             textShadow: '2px 0 12px rgba(0,255,255,0.5), -2px 0 12px rgba(217,17,17,0.5), 0 0 40px rgba(255,255,255,0.4)' 
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
    const rotations = [0, 90, 270, 180];
    return (
      <>
        {[0,1,2,3].map(i => (
          <div key={i} className={`absolute w-12 h-12 z-30 transition-all duration-1000 ${showShutters ? 'opacity-80 scale-100' : 'opacity-0 scale-120'}`}
               style={{ 
                 top: i < 2 ? '0' : 'auto', 
                 bottom: i >= 2 ? '0' : 'auto', 
                 left: i % 2 === 0 ? '0' : 'auto', 
                 right: i % 2 !== 0 ? '0' : 'auto',
                 transform: `rotate(${rotations[i]}deg)`
               }}>
             <div className="w-full h-full border-t-2 border-l-2 border-cyan-400/60" />
             <div className="absolute top-0 left-0 w-2 h-2 bg-red-600 shadow-[0_0_10px_#D91111]" />
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
              className="group ofuda-talisman pointer-events-auto relative w-12 md:w-16 h-32 md:h-44 border border-white/20 bg-black flex flex-col items-center justify-between py-5 hover:scale-[1.15] hover:border-cyan-400/60 transition-all duration-300 shadow-[0_0_30px_rgba(0,0,0,0.5)] overflow-hidden"
            >
               {/* Surface Grit */}
               <div className="absolute inset-0 cyan-halftone opacity-5 group-hover:opacity-10 transition-opacity duration-300" />
               
               {/* Technical Markers */}
               <div className="w-1.5 h-1.5 bg-red-600 rounded-full shadow-[0_0_8px_#D91111] animate-pulse z-10" />
               
               <div className="flex flex-col items-center gap-2 z-10">
                  <div className="w-6 h-[0.5px] bg-cyan-400 opacity-40 group-hover:opacity-100 group-hover:w-full transition-all duration-500" />
                  <div className="w-4 h-4 border border-white/40 rotate-45 flex items-center justify-center group-hover:border-cyan-400 group-hover:rotate-[225deg] transition-all duration-700">
                     <div className="w-1 h-1 bg-white group-hover:bg-cyan-400" />
                  </div>
                  <div className="w-6 h-[0.5px] bg-cyan-400 opacity-40 group-hover:opacity-100 group-hover:w-full transition-all duration-500" />
               </div>
 
               <div className="w-2 h-2 border-b border-r border-white/40 group-hover:border-red-600 transition-colors duration-300 z-10" />
 
               {/* Interaction Glow */}
               <div className="absolute bottom-0 inset-x-0 h-1 bg-gradient-to-r from-transparent via-cyan-400/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </button>
          </div>
        ))}
      </div>
 
      {/* ─── PORTAL REMAINS COMPACT ─── */}
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
