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
    <div ref={containerRef} className="w-full h-full p-10 md:p-16 flex flex-col items-center justify-center text-center relative z-20">
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
  const innerRef = useRef<HTMLDivElement>(null);
 
  useEffect(() => {
    setMounted(true);
  }, []);
 
  // ORCHESTRATION ENGINE
  useEffect(() => {
    if (activeCard?.phase === 'summon' && cardRef.current && innerRef.current) {
      const rect = activeCard.rect!;
      const isMobile = window.innerWidth < 768;
      const targetW = isMobile ? window.innerWidth * 0.9 : 420;
      const targetH = isMobile ? window.innerHeight * 0.7 : 600;
      
      const scaleX = targetW / rect.width;
      const scaleY = targetH / rect.height;
      const targetX = (window.innerWidth - targetW) / 2;
      const targetY = (window.innerHeight - targetH) / 2;
 
      const tl = createTimeline({
        easing: 'easeOutQuint'
      } as any);
 
      // 1. Move & Scale to center
      tl.add({
        targets: cardRef.current,
        translateX: [rect.left, targetX],
        translateY: [rect.top, targetY],
        scaleX: [1, scaleX],
        scaleY: [1, scaleY],
        duration: 700,
        easing: 'cubicBezier(0.19, 1, 0.22, 1)'
      } as any);
 
      // 2. Flip and activate
      tl.add({
        targets: innerRef.current,
        rotateY: [0, 180],
        duration: 800,
        easing: 'cubicBezier(0.19, 1, 0.22, 1)',
        complete: () => {
          setActiveCard(prev => prev ? { ...prev, phase: 'active' } : null);
        }
      } as any, "-=500");
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
    
    anime({
      targets: cardRef.current,
      opacity: 0,
      scale: 1.05,
      translateY: '-=20px',
      filter: 'blur(30px)',
      duration: 800,
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
 
  return (
    <div className="absolute inset-0 flex items-center justify-center z-0 pointer-events-none overflow-hidden">
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
              onClick={(e) => { e.stopPropagation(); handleCardClick(s.id, e); }}
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
                <div className="animation-pulse w-4 h-4 md:w-6 md:h-6 border-2 border-[var(--accent-blood)] rounded-full flex items-center justify-center p-[2px]">
                   <div className="w-full h-full bg-[var(--accent-blood)] rounded-full animate-pulse" />
                </div>
              </div>
              <span className="font-mono text-[9px] md:text-[10px] font-black rotate-[-90deg] whitespace-nowrap text-[var(--accent-blood)] tracking-[0.2em] opacity-80">
                {s.hex}
              </span>
            </button>
          </div>
        ))}
      </div>
 
      {mounted && activeCard && createPortal(
        <div className="fixed inset-0" style={{ zIndex: 9998, pointerEvents: 'auto' }}>
          <div 
            className={`fixed inset-0 transition-opacity duration-500 bg-black ${activeCard.phase !== 'summon' ? 'opacity-95' : 'opacity-0'}`}
            onClick={handleDismiss}
          />
 
          <div 
            ref={cardRef}
            className="fixed top-0 left-0"
            style={{
              width: `${activeCard.rect?.width}px`,
              height: `${activeCard.rect?.height}px`,
              transform: `translate3d(${activeCard.rect?.left}px, ${activeCard.rect?.top}px, 0)`,
              perspective: '1200px',
              transformOrigin: '0 0',
              willChange: 'transform'
            }}
          >
            <div 
              ref={innerRef}
              className="relative w-full h-full"
              style={{ transformStyle: 'preserve-3d', willChange: 'transform' }}
            >
              {/* Front Face */}
              <div className="absolute inset-0 bg-black border-2 border-[var(--accent-blood)] flex flex-col items-center justify-between py-12" style={{ backfaceVisibility: 'hidden', zIndex: 2 }}>
                <div className="flex gap-4">
                  {[1,2,3].map(j => (
                    <div key={j} className="w-8 h-8 md:w-10 md:h-10 border-2 border-[var(--accent-blood)] rotate-45 flex items-center justify-center">
                      <div className="w-2 h-2 bg-[var(--accent-blood)]" />
                    </div>
                  ))}
                </div>
                <div className="relative w-full flex items-center justify-center py-8">
                   <div className="w-16 h-16 md:w-24 md:h-24 border-4 border-[var(--accent-blood)] rounded-full flex items-center justify-center p-[4px]">
                      <div className="w-full h-full bg-[var(--accent-blood)] rounded-full animate-pulse" />
                    </div>
                </div>
                <span className="font-mono text-xl md:text-3xl font-black rotate-[-90deg] whitespace-nowrap text-[var(--accent-blood)] tracking-[0.4em] opacity-80 mb-8">
                  {segments.find(s => s.id === activeCard.id)?.hex}
                </span>
              </div>
 
              {/* Back Face */}
              <div className="absolute inset-0 bg-[#050505] border-2 border-[var(--accent-blood)] flex items-center justify-center overflow-hidden" style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)', zIndex: 1 }}>
                <div className="absolute inset-0 ritual-grid opacity-30" />
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.85)_100%)]" />
                {activeCard.phase === 'active' && <CharacterInscription text={activeCard.fact} />}
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
