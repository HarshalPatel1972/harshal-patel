import React, { useMemo, useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { OFUDA_FACTS } from '@/lib/ofudaFacts';
import { getNextFact } from '@/lib/ofudaMemory';
import { animate as anime, stagger, createTimeline } from 'animejs';
 
interface ActiveCard {
  id: number;
  fact: string;
  phase: 'summon' | 'flying' | 'flipped' | 'burning' | 'done' | null;
  rect: DOMRect | null;
}
 
const CharacterInscription: React.FC<{ text: string }> = ({ text }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const words = useMemo(() => text.split(" "), [text]);
 
  useEffect(() => {
    if (!containerRef.current) return;
    
    // Animate characters using direct DOM targets
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
    <div ref={containerRef} className="w-full h-full p-10 md:p-16 flex flex-col items-center justify-center text-center">
      <div className="text-[#E8E8E6] font-hindi text-2xl md:text-3xl lg:text-4xl leading-[1.1] font-black tracking-tighter text-center uppercase" style={{ textShadow: '0 0 20px rgba(217,17,17,0.4)' }}>
        {words.map((word, wi) => (
          <span key={wi} className="inline-block whitespace-nowrap mr-[0.25em]">
            {word.split("").map((char, ci) => (
              <span
                key={ci}
                className="ofuda-char inline-block opacity-0 will-change-transform"
              >
                {char}
              </span>
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
  const containerRef = useRef<HTMLDivElement>(null);
 
  useEffect(() => {
    setMounted(true);
  }, []);
 
  const handleCardClick = (id: number, e: React.MouseEvent<HTMLButtonElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const { fact } = getNextFact(OFUDA_FACTS);
    
    setActiveCard({ id, fact, phase: 'summon', rect });
    
    setTimeout(() => {
      setActiveCard(prev => prev ? { ...prev, phase: 'flying' } : null);
    }, 50);
 
    setTimeout(() => {
      setActiveCard(prev => prev ? { ...prev, phase: 'flipped' } : null);
    }, 750); 
  };
 
  const handleDismiss = () => {
    if (!activeCard || activeCard.phase === 'burning' || activeCard.phase === 'done') return;
    setActiveCard(prev => prev ? { ...prev, phase: 'burning' } : null);
    setTimeout(() => setActiveCard(null), 800);
  };
 
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') handleDismiss();
    };
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
 
  // Calculate transform for the summon animation to use ONLY hardware-accelerated properties
  const getCardPositionStyle = () => {
    if (!activeCard || !activeCard.rect) return {};
    
    if (activeCard.phase === 'summon') {
      const { top, left, width, height } = activeCard.rect;
      return {
        position: 'fixed' as const,
        top: 0,
        left: 0,
        width: `${width}px`,
        height: `${height}px`,
        transform: `translate3d(${left}px, ${top}px, 0)`,
        transition: 'none'
      };
    }
 
    // Target dimensions
    const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
    const targetW = isMobile ? window.innerWidth * 0.9 : 420;
    const targetH = isMobile ? window.innerHeight * 0.7 : 600;
    
    // Scale factors
    const scaleX = targetW / activeCard.rect.width;
    const scaleY = targetH / activeCard.rect.height;
    
    // Translation to center
    const targetX = (window.innerWidth - targetW) / 2;
    const targetY = (window.innerHeight - targetH) / 2;
 
    return {
      position: 'fixed' as const,
      top: 0,
      left: 0,
      width: `${activeCard.rect.width}px`,
      height: `${activeCard.rect.height}px`,
      transform: `translate3d(${targetX}px, ${targetY}px, 0) scale(${scaleX}, ${scaleY})`,
      transformOrigin: '0 0',
      transition: 'transform 0.7s cubic-bezier(0.19, 1, 0.22, 1)',
      willChange: 'transform'
    };
  };
 
  return (
    <div ref={containerRef} className="absolute inset-0 flex items-center justify-center z-0 pointer-events-none overflow-hidden opacity-100">
      
      {/* ─── SCROLL PATH ─── */}
      <div className="relative w-full h-[600px] flex items-center justify-center translate-y-[-10%] pointer-events-none">
        {segments.map((s) => (
          <div 
            key={s.id}
            className="absolute flex flex-col items-center justify-center pointer-events-none opacity-60"
            style={{
              animation: `scroll-flow 15s linear infinite`,
              animationDelay: `${s.delay}s`,
              willChange: 'transform, opacity'
            }}
          >
            <button 
              onClick={(e) => {
                e.stopPropagation();
                handleCardClick(s.id, e);
              }}
              data-cursor="play"
              disabled={activeCard !== null}
              className="ofuda-talisman pointer-events-auto relative w-12 md:w-20 h-32 md:h-48 border-2 flex flex-col items-center justify-between py-4 shadow-2xl transition-all duration-300 outline-none bg-black/80 border-[var(--accent-blood)] hover:border-[var(--accent-blood)] hover:shadow-[0_0_12px_rgba(217,17,17,0.3)] hover:scale-[1.05] cursor-pointer"
            >
               <div className="flex gap-1">
                {[1,2,3].map(j => (
                  <div key={j} className="w-2 h-2 md:w-3 md:h-3 border border-[var(--accent-blood)] rotate-45 flex items-center justify-center">
                    <div className="w-[1px] h-[1px] bg-[var(--accent-blood)]" />
                  </div>
                ))}
              </div>
              <div className="relative w-full flex items-center justify-center py-2">
                <div className="absolute inset-0 bg-[var(--accent-blood)] opacity-5 blur-xl rounded-full" />
                <div className="relative">
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1px] h-12 md:h-16 bg-[var(--accent-blood)] opacity-40" />
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 md:w-16 h-[1px] bg-[var(--accent-blood)] opacity-40" />
                  <div className="w-4 h-4 md:w-6 md:h-6 border-2 border-[var(--accent-blood)] rounded-full flex items-center justify-center p-[2px]">
                    <div className="w-full h-full bg-[var(--accent-blood)] rounded-full animate-pulse" />
                  </div>
                </div>
              </div>
              <span className="font-mono text-[9px] md:text-[10px] font-black rotate-[-90deg] whitespace-nowrap text-[var(--accent-blood)] tracking-[0.2em] opacity-80">
                {s.hex}
              </span>
              <div className="flex flex-col gap-1 items-center">
                 <div className="w-1 md:w-1.5 h-1 md:h-1.5 border border-[var(--accent-blood)] rotate-45" />
              </div>
            </button>
          </div>
        ))}
      </div>
 
      {/* ─── REVELATION PORTAL ─── */}
      {mounted && activeCard && createPortal(
        <div className="fixed inset-0" style={{ zIndex: 9998, pointerEvents: 'auto' }}>
          <div 
            className={`fixed inset-0 transition-opacity duration-300 cursor-default
              ${activeCard.phase !== 'summon' && activeCard.phase !== 'done' ? 'opacity-92' : 'opacity-0'}`}
            style={{ backgroundColor: '#000000', zIndex: 9998 }}
            onClick={handleDismiss}
          />
 
          <div 
            className="z-[9999]"
            style={{
              ...getCardPositionStyle(),
              perspective: '1200px',
              pointerEvents: 'auto'
            }}
          >
            <div 
              className="relative w-full h-full"
              style={{
                transformStyle: 'preserve-3d',
                transform: (activeCard.phase === 'flipped' || activeCard.phase === 'burning') ? 'rotateY(180deg)' : 'rotateY(0deg)',
                transition: 'transform 0.7s cubic-bezier(0.19, 1, 0.22, 1)',
                willChange: 'transform'
              }}
            >
              {/* Front Face (Ofuda) */}
              <div 
                className="absolute inset-0 bg-black border-2 border-[var(--accent-blood)] flex flex-col items-center justify-between py-12"
                style={{ 
                  backfaceVisibility: 'hidden', 
                  zIndex: 2,
                  boxShadow: activeCard.phase === 'flipped' ? 'none' : '0 0 20px rgba(217,17,17,0.4)'
                }}
              >
                <div className="flex gap-4">
                  {[1,2,3].map(j => (
                    <div key={j} className="w-8 h-8 md:w-10 md:h-10 border-2 border-[var(--accent-blood)] rotate-45 flex items-center justify-center">
                      <div className="w-2 h-2 bg-[var(--accent-blood)]" />
                    </div>
                  ))}
                </div>
                <div className="relative w-full flex items-center justify-center py-8">
                  <div className="absolute inset-0 bg-[var(--accent-blood)] opacity-5 blur-3xl rounded-full" />
                  <div className="relative">
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[2px] h-48 md:h-64 bg-[var(--accent-blood)] opacity-40" />
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 md:w-64 h-[2px] bg-[var(--accent-blood)] opacity-40" />
                    <div className="w-16 h-16 md:w-24 md:h-24 border-4 border-[var(--accent-blood)] rounded-full flex items-center justify-center p-[4px]">
                      <div className="w-full h-full bg-[var(--accent-blood)] rounded-full animate-pulse blur-[1px]" />
                    </div>
                  </div>
                </div>
                <span className="font-mono text-xl md:text-3xl font-black rotate-[-90deg] whitespace-nowrap text-[var(--accent-blood)] tracking-[0.4em] opacity-80 mb-8">
                  {segments.find(s => s.id === activeCard.id)?.hex}
                </span>
                <div className="flex flex-col gap-2 items-center">
                   <div className="w-4 md:w-6 h-4 md:h-6 border-2 border-[var(--accent-blood)] rotate-45" />
                </div>
              </div>
 
              {/* Back Face (Revelation) */}
              <div 
                className={`absolute inset-0 bg-[#000000] border-2 border-[var(--accent-blood)] flex items-center justify-center transition-all duration-300 shadow-[0_0_40px_rgba(217,17,17,0.4)] overflow-hidden
                  ${activeCard.phase === 'burning' ? 'animate-ofuda-burn' : ''}`}
                style={{ 
                  backfaceVisibility: 'hidden', 
                  transform: 'rotateY(180deg)',
                  backgroundColor: '#050505',
                  zIndex: 1,
                  opacity: (activeCard.phase === 'flipped' || activeCard.phase === 'burning') ? 1 : 0
                }}
              >
                <div className="absolute inset-0 ritual-grid opacity-30" />
                <div className="absolute inset-x-12 inset-y-0 opacity-10 flex justify-between">
                  <div className="w-[1px] h-full bg-[var(--accent-blood)]" />
                  <div className="w-[1px] h-full bg-[var(--accent-blood)]" />
                </div>
                <div className="absolute inset-0 halftone-bg opacity-[0.2] mix-blend-overlay" />
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.85)_100%)]" />
                <div className="absolute inset-0 opacity-30 overflow-hidden">
                  <div className="absolute top-[10%] left-[5%] w-32 h-32 bg-[var(--accent-blood)] blur-3xl opacity-20 rounded-full" />
                  <div className="absolute bottom-[20%] right-[10%] w-48 h-48 bg-[var(--accent-blood)] blur-3xl opacity-20 rounded-full" />
                </div>
                {activeCard.phase !== 'summon' && (
                  <CharacterInscription text={activeCard.fact} />
                )}
              </div>
            </div>
          </div>
        </div>,
        document.body
      )}
 
      <style>{`
        @keyframes scroll-flow {
          0% { transform: translate3d(100vw, 15vh, 0) rotateZ(15deg) scale(0.6); opacity: 0; }
          45%, 55% { opacity: 1; }
          50% { transform: translate3d(0vw, 0vh, 0) rotateZ(0deg) scale(1.1); }
          100% { transform: translate3d(-100vw, -15vh, 0) rotateZ(-15deg) scale(0.6); opacity: 0; }
        }
        .animate-ofuda-burn { animation: smoke-dissolve 0.8s forwards; }
        @keyframes smoke-dissolve {
          0% { opacity: 1; filter: blur(0px); transform: rotateY(180deg) scale(1); }
          100% { opacity: 0; filter: blur(30px); transform: rotateY(180deg) scale(1.05) translateY(-20px); }
        }
        .ritual-grid {
          background-image: linear-gradient(rgba(217, 17, 17, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(217, 17, 17, 0.1) 1px, transparent 1px);
          background-size: 30px 30px;
          mask-image: radial-gradient(circle at center, black, transparent 80%);
        }
      `}</style>
    </div>
  );
};
 
export default ExorcistsScroll;
