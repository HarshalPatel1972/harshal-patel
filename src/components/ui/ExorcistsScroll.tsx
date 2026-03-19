import React, { useMemo, useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { OFUDA_FACTS } from '@/lib/ofudaFacts';
import { getNextFact } from '@/lib/ofudaMemory';
import { animate as anime, stagger, createTimeline } from 'animejs';
 
interface ActiveCard {
  id: number;
  fact: string;
  phase: 'summon' | 'active' | 'burning' | null;
  rect: DOMRect | null;
}
 
const CharacterInscription: React.FC<{ text: string }> = ({ text }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const words = useMemo(() => text.split(" "), [text]);
 
  useEffect(() => {
    if (!containerRef.current) return;
    anime(containerRef.current.querySelectorAll('.ofuda-char'), {
      opacity: [0, 1],
      translateY: [20, 0],
      filter: ['blur(10px)', 'blur(0px)'],
      duration: 600,
      delay: stagger(15),
      easing: 'easeOutQuart'
    });
  }, [text]);
 
  return (
    <div ref={containerRef} className="w-full h-full p-10 md:p-16 flex flex-col items-center justify-center text-center relative z-10">
      <div className="text-[#E8E8E6] font-hindi text-2xl md:text-3xl lg:text-4xl leading-[1.1] font-black tracking-tighter text-center uppercase" style={{ textShadow: '0 0 20px rgba(217,17,17,0.4)' }}>
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
  const cardRef = useRef<HTMLDivElement>(null);
  const shutterTopRef = useRef<HTMLDivElement>(null);
  const shutterBottomRef = useRef<HTMLDivElement>(null);
  const sunderLineRef = useRef<HTMLDivElement>(null);
 
  useEffect(() => {
    setMounted(true);
  }, []);
 
  // ORCHESTRATION ENGINE (The Sunder Sequence)
  useEffect(() => {
    if (activeCard?.phase === 'summon' && cardRef.current) {
      const rect = activeCard.rect!;
      const isMobile = window.innerWidth < 768;
      const targetW = isMobile ? window.innerWidth * 0.9 : 420;
      const targetH = isMobile ? window.innerHeight * 0.7 : 600;
      
      const scaleX = targetW / rect.width;
      const scaleY = targetH / rect.height;
      const targetX = (window.innerWidth - targetW) / 2;
      const targetY = (window.innerHeight - targetH) / 2;
 
      const tl = createTimeline({} as any);
 
      // Phase 1: Move & Scale to focus
      tl.add({
        targets: cardRef.current,
        translateX: [rect.left, targetX],
        translateY: [rect.top, targetY],
        scaleX: [1, scaleX],
        scaleY: [1, scaleY],
        duration: 600,
        easing: 'cubicBezier(0.19, 1, 0.22, 1)'
      } as any);
 
      // Phase 2: The Sunder Pulse
      tl.add({
        targets: sunderLineRef.current,
        opacity: [0, 1, 0],
        scaleX: [0, 1.2],
        duration: 400,
        easing: 'easeInOutQuad'
      } as any, "-=200");
 
      // Phase 3: The Mechanical Breach (Splitting Open)
      tl.add({
        targets: shutterTopRef.current,
        translateY: '-100%',
        duration: 800,
        easing: 'cubicBezier(0.19, 1, 0.22, 1)'
      } as any, "-=300");
 
      tl.add({
        targets: shutterBottomRef.current,
        translateY: '100%',
        duration: 800,
        easing: 'cubicBezier(0.19, 1, 0.22, 1)',
        complete: () => {
          setActiveCard(prev => prev ? { ...prev, phase: 'active' } : null);
        }
      } as any, "-=800");
    }
  }, [activeCard?.phase]);
 
  const handleCardClick = (id: number, e: React.MouseEvent<HTMLButtonElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const { fact } = getNextFact(OFUDA_FACTS);
    setActiveCard({ id, fact, phase: 'summon', rect });
  };
 
  const handleDismiss = () => {
    if (!activeCard || activeCard.phase === 'burning') return;
    setActiveCard(prev => prev ? { ...prev, phase: 'burning' } : null);
    
    anime(cardRef.current, {
      opacity: 0,
      scale: 1.05,
      translateY: '-=20px',
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
 
  const OfudaPattern = ({ hex, isLarge = false }: { hex: string, isLarge?: boolean }) => (
    <div className={`w-full h-full border-2 border-[var(--accent-blood)] bg-black flex flex-col items-center justify-between ${isLarge ? 'py-12' : 'py-4'}`}>
       <div className={`flex ${isLarge ? 'gap-4' : 'gap-1'}`}>
        {[1,2,3].map(j => (
          <div key={j} className={`${isLarge ? 'w-8 h-8 md:w-10 md:h-10 border-2' : 'w-2 h-2 md:w-3 md:h-3 border'} border-[var(--accent-blood)] rotate-45 flex items-center justify-center`}>
            <div className={`${isLarge ? 'w-2 h-2' : 'w-[1px] h-[1px]'} bg-[var(--accent-blood)]`} />
          </div>
        ))}
      </div>
      <div className="relative w-full flex items-center justify-center">
        <div className={`${isLarge ? 'w-16 h-16 md:w-24 md:h-24 border-4 p-[4px]' : 'w-4 h-4 md:w-6 md:h-6 border-2 p-[2px]'} border-[var(--accent-blood)] rounded-full flex items-center justify-center`}>
           <div className="w-full h-full bg-[var(--accent-blood)] rounded-full animate-pulse" />
        </div>
      </div>
      <span className={`${isLarge ? 'text-xl md:text-3xl' : 'text-[9px] md:text-[10px]'} font-mono font-black rotate-[-90deg] whitespace-nowrap text-[var(--accent-blood)] tracking-[0.2em] opacity-80 uppercase`}>
        {hex}
      </span>
    </div>
  );
 
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
              className="ofuda-talisman pointer-events-auto relative w-12 md:w-20 h-32 md:h-48 border-0 outline-none bg-transparent hover:shadow-[0_0_20px_rgba(217,17,17,0.3)] hover:scale-[1.05] transition-all duration-300 cursor-pointer"
            >
              <OfudaPattern hex={s.hex} />
            </button>
          </div>
        ))}
      </div>
 
      {/* ─── REVELATION PORTAL (THE SUNDER) ─── */}
      {mounted && activeCard && createPortal(
        <div className="fixed inset-0" style={{ zIndex: 9998, pointerEvents: 'auto' }}>
          <div 
            className={`fixed inset-0 transition-opacity duration-700 bg-[#020202] ${activeCard.phase !== 'summon' ? 'opacity-98' : 'opacity-0'}`}
            onClick={handleDismiss}
          />
 
          <div 
            ref={cardRef}
            className="fixed top-0 left-0 overflow-hidden"
            style={{
              width: `${activeCard.rect?.width}px`,
              height: `${activeCard.rect?.height}px`,
              transform: `translate3d(${activeCard.rect?.left}px, ${activeCard.rect?.top}px, 0)`,
              transformOrigin: '0 0',
              willChange: 'transform',
              boxShadow: activeCard.phase === 'summon' ? '0 0 20px rgba(217,17,17,0.4)' : 'none'
            }}
          >
            {/* 1. Underlying Truth Layer (Revealed when shuttes open) */}
            <div className="absolute inset-0 bg-[#050505] flex items-center justify-center overflow-hidden z-0">
               <div className="absolute inset-0 ritual-grid opacity-20" />
               <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(217,17,17,0.05)_0%,transparent_80%)]" />
               <div className="absolute inset-0 halftone-bg opacity-10 mix-blend-overlay" />
               {activeCard.phase === 'active' && <CharacterInscription text={activeCard.fact} />}
            </div>
 
            {/* 2. Top Shutter */}
            <div 
              ref={shutterTopRef}
              className="absolute top-0 left-0 w-full h-[50.5%] z-20 overflow-hidden"
              style={{ transformOrigin: 'top center' }}
            >
               <div className="w-full h-[200%] absolute top-0 left-0">
                 <OfudaPattern hex={activeCard.fact.slice(0, 4)} isLarge />
               </div>
            </div>
 
            {/* 3. Bottom Shutter */}
            <div 
              ref={shutterBottomRef}
              className="absolute bottom-0 left-0 w-full h-[50.5%] z-20 overflow-hidden"
              style={{ transformOrigin: 'bottom center' }}
            >
               <div className="w-full h-[200%] absolute bottom-0 left-0">
                 <OfudaPattern hex={activeCard.fact.slice(0, 4)} isLarge />
               </div>
            </div>
 
            {/* 4. The Sunder Laser Line */}
            <div 
              ref={sunderLineRef}
              className="absolute top-1/2 left-0 w-full h-[3px] bg-[#d91111] -translate-y-1/2 z-30 opacity-0 scale-x-0 shadow-[0_0_30px_#d91111]"
            />
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
