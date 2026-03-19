import React, { useMemo, useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { OFUDA_FACTS } from '@/lib/ofudaFacts';
import { getNextFact } from '@/lib/ofudaMemory';
import { animate as anime, stagger, createTimeline } from 'animejs';
 
interface ActiveCard {
  id: number;
  fact: string;
  phase: 'assembling' | 'active' | 'burning' | null;
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
      delay: stagger(18),
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
  const slicesRef = useRef<(HTMLDivElement | null)[]>([]);
 
  useEffect(() => { setMounted(true); }, []);
 
  // THE ASSEMBLY RITUAL ENGINE
  useEffect(() => {
    if (activeCard?.phase === 'assembling') {
      requestAnimationFrame(() => {
        const targetNodes = slicesRef.current.filter(Boolean);
        if (targetNodes.length < 4) return;
 
        const tl = createTimeline({} as any);
 
        // 4-Piece Sequential Weave (Top, Bottom, Top, Bottom)
        targetNodes.forEach((node, i) => {
           const fromAbove = i % 2 === 0;
           tl.add({
             targets: node,
             translateY: [fromAbove ? '-150%' : '150%', '0%'],
             opacity: [0, 1],
             duration: 700,
             easing: 'cubicBezier(0.19, 1, 0.22, 1)'
           } as any, i * 150);
        });
 
        // Activation
        tl.add({
           targets: {}, // Dummy
           duration: 100,
           complete: () => {
              setActiveCard(prev => prev ? { ...prev, phase: 'active' } : null);
           }
        } as any);
      });
    }
  }, [activeCard?.phase]);
 
  const handleCardClick = (id: number, e: React.MouseEvent<HTMLButtonElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const { fact } = getNextFact(OFUDA_FACTS);
    setActiveCard({ id, fact, phase: 'assembling', rect });
  };
 
  const handleDismiss = () => {
    if (!activeCard || activeCard.phase === 'burning') return;
    setActiveCard(prev => prev ? { ...prev, phase: 'burning' } : null);
    
    anime(slicesRef.current.filter(Boolean), {
      opacity: 0,
      scale: 0.95,
      filter: 'blur(30px)',
      duration: 600,
      easing: 'easeOutQuint',
      complete: () => setActiveCard(null)
    });
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
 
  const CardSliceContent = ({ hex, index, total }: { hex: string, index: number, total: number }) => {
    const heightPercent = 100 / total;
    const topOffset = index * heightPercent;
    
    return (
      <div className="absolute inset-x-0 w-full h-[600px] bg-[#050505] border-x-2 border-[var(--accent-blood)] overflow-hidden" 
           style={{ top: `-${topOffset}%`, height: `${total * 100}%` }}>
         {/* Border caps for whole card */}
         {index === 0 && <div className="absolute top-0 inset-x-0 h-1 bg-[var(--accent-blood)] z-30" />}
         {index === total - 1 && <div className="absolute bottom-0 inset-x-0 h-1 bg-[var(--accent-blood)] z-30" />}
         
         <div className="absolute inset-0 ritual-grid opacity-20" />
         <div className="w-full h-full flex flex-col items-center justify-between py-12">
            <div className="flex gap-4">
               {[1,2,3].map(j => (
                 <div key={j} className="w-8 h-8 md:w-10 md:h-10 border-2 border-[var(--accent-blood)] rotate-45 flex items-center justify-center">
                    <div className="w-2 h-2 bg-[var(--accent-blood)]" />
                 </div>
               ))}
            </div>
            <div className="w-16 h-16 md:w-24 md:h-24 border-4 border-[var(--accent-blood)] rounded-full flex items-center justify-center p-[4px]">
               <div className="w-full h-full bg-[var(--accent-blood)] rounded-full animate-pulse shadow-[0_0_20px_rgba(217,17,17,0.4)]" />
            </div>
            <span className="text-2xl md:text-3xl font-mono font-black rotate-[-90deg] whitespace-nowrap text-[var(--accent-blood)] tracking-[0.3em] opacity-90">
               {hex}
            </span>
         </div>
      </div>
    );
  };
 
  return (
    <div className="absolute inset-0 flex items-center justify-center z-0 pointer-events-none overflow-hidden">
      {/* ─── FLOATING FLOW ─── */}
      <div className="relative w-full h-[600px] flex items-center justify-center translate-y-[-10%] pointer-events-none">
        {segments.map((s) => (
          <div 
            key={s.id}
            className="absolute flex flex-col items-center justify-center pointer-events-none opacity-60"
            style={{ animation: `scroll-flow 15s linear infinite`, animationDelay: `${s.delay}s`, willChange: 'transform' }}
          >
            <button 
              onClick={(e) => { e.stopPropagation(); handleCardClick(s.id, e); }}
              data-cursor="play"
              disabled={activeCard !== null}
              className="ofuda-talisman pointer-events-auto relative w-12 md:w-20 h-32 md:h-48 border-2 border-[var(--accent-blood)] bg-black/80 flex flex-col items-center justify-between py-4 hover:scale-[1.15] transition-all duration-300 cursor-pointer"
            >
               <div className="flex gap-1">
                 {[1,2,3].map(j => <div key={j} className="w-2 h-2 border border-[var(--accent-blood)] rotate-45" />)}
               </div>
               <div className="w-4 h-4 md:w-6 md:h-6 border-2 border-[var(--accent-blood)] rounded-full flex items-center justify-center">
                  <div className="w-full h-full bg-[var(--accent-blood)] rounded-full animate-pulse" />
               </div>
               <span className="text-[10px] font-mono font-black rotate-[-90deg] text-[var(--accent-blood)] tracking-widest">{s.hex}</span>
            </button>
          </div>
        ))}
      </div>
 
      {/* ─── ASSEMBLY PORTAL ─── */}
      {mounted && activeCard && createPortal(
        <div className="fixed inset-0" style={{ zIndex: 999999, pointerEvents: 'auto' }}>
          <div 
            className={`fixed inset-0 bg-[#020202] transition-opacity duration-1000 ${activeCard.phase !== 'assembling' ? 'opacity-98' : 'opacity-0'}`}
            onClick={handleDismiss}
          />
 
          <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90vw] md:w-[420px] h-[70vh] md:h-[600px]" style={{ zIndex: 9999991 }}>
             {/* The Revelation Text (Underneath) */}
             <div className="absolute inset-0 bg-[#050505] border-2 border-[var(--accent-blood)] flex items-center justify-center overflow-hidden z-0">
                <div className="absolute inset-0 ritual-grid opacity-30" />
                {activeCard.phase === 'active' && <CharacterInscription text={activeCard.fact} />}
             </div>
 
             {/* The Mechanical Shutters (Above) */}
             <div className="absolute inset-0 z-10 pointer-events-none">
                {[0,1,2,3].map(i => (
                   <div 
                     key={i}
                     ref={el => { slicesRef.current[i] = el; }}
                     className="absolute inset-x-0 overflow-hidden will-change-transform"
                     style={{
                        top: `${i * 25}%`,
                        height: '25.5%', // Tiny overlap to hide seams
                        opacity: activeCard.phase === 'active' ? 0 : 1,
                        transition: activeCard.phase === 'active' ? 'opacity 0.5s ease-out' : 'none'
                     }}
                   >
                     <CardSliceContent hex={segments.find(s => s.id === activeCard.id)?.hex || "0xNULL"} index={i} total={4} />
                   </div>
                ))}
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
          background-size: 30px 30px;
        }
      `}</style>
    </div>
  );
};
 
export default ExorcistsScroll;
