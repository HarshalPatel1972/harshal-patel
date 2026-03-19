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
      filter: ['blur(10px)', 'blur(0px)'],
      duration: 800,
      delay: stagger(20),
      easing: 'easeOutQuart'
    });
  }, [text]);
 
  return (
    <div ref={containerRef} className="w-full h-full p-10 md:p-16 flex flex-col items-center justify-center text-center relative z-10">
      <div className="text-[#E8E8E6] font-hindi text-2xl md:text-3xl lg:text-4xl leading-[1.1] font-black tracking-tight text-center uppercase" style={{ textShadow: '0 0 20px rgba(217,17,17,0.4)' }}>
        {words.map((word, wi) => (
          <span key={wi} className="inline-block whitespace-nowrap mr-[0.25em]">
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
    
    // Trigger assembly sequence
    setTimeout(() => setShowShutters(true), 50);
    setTimeout(() => {
      setActiveCard(prev => prev ? { ...prev, isAssembled: true } : null);
    }, 1200); // Wait for shutters to meet
  };
 
  const handleDismiss = () => {
    setShowShutters(false);
    setTimeout(() => {
      setActiveCard(null);
    }, 500);
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
 
  return (
    <div className="absolute inset-0 flex items-center justify-center z-0 pointer-events-none overflow-hidden">
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
              className="ofuda-talisman pointer-events-auto relative w-12 md:w-20 h-32 md:h-48 border border-[var(--accent-blood)] bg-black/80 flex flex-col items-center justify-between py-4 hover:scale-[1.1] transition-all duration-300 shadow-[0_0_15px_rgba(217,17,17,0.1)] outline-none"
            >
               <div className="w-2 h-2 border border-[var(--accent-blood)] rotate-45 opacity-60" />
               <div className="w-5 h-5 border border-[var(--accent-blood)] rounded-full animate-pulse" />
               <span className="text-[10px] font-mono font-black rotate-[-90deg] text-[var(--accent-blood)] tracking-widest opacity-80">{s.hex}</span>
            </button>
          </div>
        ))}
      </div>
 
      {/* ─── REVELATION PORTAL ─── */}
      {mounted && activeCard && createPortal(
        <div className="fixed inset-0" style={{ zIndex: 999999, pointerEvents: 'auto' }}>
          <div 
            className={`fixed inset-0 bg-black transition-opacity duration-1000 ${showShutters ? 'opacity-98' : 'opacity-0'}`}
            onClick={handleDismiss}
          />
 
          <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90vw] md:w-[420px] h-[70vh] md:h-[600px] pointer-events-none" style={{ zIndex: 9999991 }}>
             {/* 1. Underlying Truth Layer */}
             <div className="absolute inset-x-0 top-0 bottom-0 bg-[#050505] border border-[var(--accent-blood)] flex items-center justify-center overflow-hidden z-0">
                <div className="absolute inset-0 ritual-grid opacity-20" />
                {activeCard.isAssembled && <CharacterInscription text={activeCard.fact} />}
             </div>
 
             {/* 2. Shutter Pieces (4-Piece Vertical Weave) */}
             <div className="absolute inset-0 z-10 pointer-events-none overflow-hidden">
                {[0,1,2,3].map(i => {
                   const fromAbove = i % 2 === 0;
                   return (
                      <div 
                        key={i}
                        className="absolute inset-x-0 h-[25.2%] overflow-hidden bg-black border-x border-[var(--accent-blood)] transition-all duration-[800ms] cubic-bezier(0.19, 1, 0.22, 1)"
                        style={{
                           top: `${i * 25}%`,
                           transform: showShutters ? 'translateY(0%)' : `translateY(${fromAbove ? '-120%' : '120%'})`,
                           transitionDelay: `${i * 100}ms`,
                           opacity: activeCard.isAssembled ? 0 : 1,
                        }}
                      >
                         {/* Card Slice Content */}
                         <div className="absolute inset-x-0 w-full h-[600px] flex flex-col items-center justify-between py-12"
                              style={{ top: `-${i * 25}%`, height: '400%' }}>
                            <div className="flex gap-4">
                               {[1,2,3].map(j => (
                                 <div key={j} className="w-10 h-10 border border-[var(--accent-blood)] rotate-45 opacity-40" />
                               ))}
                            </div>
                            <div className="w-24 h-24 border-2 border-[var(--accent-blood)] rounded-full animate-pulse opacity-30" />
                            <span className="text-4xl font-mono font-black rotate-[-90deg] text-[var(--accent-blood)] tracking-[0.4em] opacity-40 uppercase">
                               READY
                            </span>
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
          background-image: linear-gradient(rgba(217, 17, 17, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(217, 17, 17, 0.1) 1px, transparent 1px);
          background-size: 40px 40px;
        }
      `}</style>
    </div>
  );
};
 
export default ExorcistsScroll;
