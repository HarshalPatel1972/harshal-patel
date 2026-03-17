import React, { useMemo, useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { OFUDA_FACTS } from '@/lib/ofudaFacts';
import { getNextFact } from '@/lib/ofudaMemory';

interface ActiveCard {
  id: number;
  fact: string;
  phase: 'summon' | 'flying' | 'flipped' | 'burning' | 'done' | null;
  rect: DOMRect | null;
}

const CharacterInscription: React.FC<{ text: string }> = ({ text }) => {
  const [visibleCount, setVisibleCount] = useState(0);
  const words = useMemo(() => text.split(" "), [text]);
  const totalChars = text.length;

  useEffect(() => {
    let current = 0;
    const interval = setInterval(() => {
      if (current < totalChars) {
        current++;
        setVisibleCount(current);
      } else {
        clearInterval(interval);
      }
    }, 20);
    return () => clearInterval(interval);
  }, [totalChars]);

  let charIndexCounter = 0;

  return (
    <div className="w-full h-full p-8 md:p-14 flex flex-col items-center justify-center text-center">
      <div className="text-[#E8E8E6] font-hindi text-3xl md:text-5xl lg:text-7xl leading-[1.1] font-black tracking-tighter text-center uppercase" style={{ textShadow: '0 0 20px rgba(217,17,17,0.4)' }}>
        {words.map((word, wi) => (
          <span key={wi} className="inline-block whitespace-nowrap mr-[0.25em]">
            {word.split("").map((char, ci) => {
              const isVisible = charIndexCounter++ < visibleCount;
              return (
                <span
                  key={ci}
                  className="inline-block transition-all duration-700 ease-out"
                  style={{ 
                    opacity: isVisible ? 1 : 0,
                    transform: isVisible ? 'translateY(0)' : 'translateY(50px)',
                    filter: isVisible ? 'blur(0px)' : 'blur(20px)',
                  }}
                >
                  {char}
                </span>
              );
            })}
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
    return () => setMounted(false);
  }, []);

  const handleCardClick = (id: number, e: React.MouseEvent<HTMLButtonElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const { fact } = getNextFact(OFUDA_FACTS);
    
    // START SEQUENCE
    setActiveCard({ id, fact, phase: 'summon', rect });
    
    setTimeout(() => {
      setActiveCard(prev => prev ? { ...prev, phase: 'flying' } : null);
    }, 100);

    setTimeout(() => {
      setActiveCard(prev => prev ? { ...prev, phase: 'flipped' } : null);
    }, 800); 
  };

  const handleDismiss = () => {
    if (!activeCard || activeCard.phase === 'burning' || activeCard.phase === 'done') return;
    
    // Clear any pending flipping if dismissed early
    setActiveCard(prev => prev ? { ...prev, phase: 'burning' } : null);
    
    setTimeout(() => {
      setActiveCard(null);
    }, 800); // Sync with smoke-dissolve duration
  };

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') handleDismiss();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [activeCard]);

  const segments = useMemo(() => {
    return Array.from({ length: 30 }).map((_, i) => ({
      id: i,
      hex: ["0xINIT", "0xMEM", "0xSYS", "0xEXEC", "0xVOID", "0xCORE"][i % 6],
      delay: i * -0.5
    }));
  }, []);

  return (
    <div ref={containerRef} className="absolute inset-0 flex items-center justify-center z-0 pointer-events-none overflow-hidden opacity-100">
      
      {/* ─── SCROLL PATH ─── */}
      <div className="relative w-full h-[600px] flex items-center justify-center translate-y-[-10%] pointer-events-none">
        {segments.map((s) => {
          const isSummoned = activeCard?.id === s.id;
          return (
            <div 
              key={s.id}
              className="absolute flex flex-col items-center justify-center pointer-events-none opacity-60"
              style={{
                animation: `scroll-flow 15s linear infinite`,
                animationDelay: `${s.delay}s`,
                visibility: 'visible'
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
                style={{ borderRadius: '0px' }}
              >
                {/* 1. Ritual Seals (Top Squares from Art) */}
                <div className="flex gap-1">
                  {[1,2,3].map(j => (
                    <div key={j} className="w-2 h-2 md:w-3 md:h-3 border border-[var(--accent-blood)] rotate-45 flex items-center justify-center">
                      <div className="w-[1px] h-[1px] bg-[var(--accent-blood)]" />
                    </div>
                  ))}
                </div>

                {/* 2. The Central "Eye" Sigil */}
                <div className="relative w-full flex items-center justify-center py-2">
                  <div className="absolute inset-0 bg-[var(--accent-blood)] opacity-5 blur-xl rounded-full" />
                  <div className="relative">
                    {/* The Star/Cross shape */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1px] h-12 md:h-16 bg-[var(--accent-blood)] opacity-40" />
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 md:w-16 h-[1px] bg-[var(--accent-blood)] opacity-40" />
                    {/* The Eye */}
                    <div className="w-4 h-4 md:w-6 md:h-6 border-2 border-[var(--accent-blood)] rounded-full flex items-center justify-center p-[2px]">
                      <div className="w-full h-full bg-[var(--accent-blood)] rounded-full animate-pulse" />
                    </div>
                  </div>
                </div>

                <span className="font-mono text-[9px] md:text-[10px] font-black rotate-[-90deg] whitespace-nowrap text-[var(--accent-blood)] tracking-[0.2em] opacity-80">
                  {s.hex}
                </span>

                {/* 3. Bottom Ritual Point */}
                <div className="flex flex-col gap-1 items-center">
                   <div className="w-1 md:w-1.5 h-1 md:h-1.5 border border-[var(--accent-blood)] rotate-45" />
                </div>
              </button>
            </div>
          );
        })}
      </div>

      {/* ─── REVELATION PORTAL (Escapes Hero Stacking Context) ─── */}
      {mounted && activeCard && createPortal(
        <div 
          className="fixed inset-0" 
          style={{ zIndex: 9998, pointerEvents: 'auto' }}
        >
          {/* Overlay */}
          <div 
            className={`fixed inset-0 transition-opacity duration-300 cursor-default
              ${activeCard.phase !== 'summon' && activeCard.phase !== 'done' ? 'opacity-92' : 'opacity-0'}`}
            style={{ backgroundColor: '#000000', zIndex: 9998 }}
            onClick={handleDismiss}
          />

          {/* Active Card Container */}
          <div 
            className="fixed"
            style={{
              zIndex: 9999,
              top: activeCard.phase === 'summon' ? `${activeCard.rect?.top}px` : '50%',
              left: activeCard.phase === 'summon' ? `${activeCard.rect?.left}px` : '50%',
              width: activeCard.phase === 'summon' ? `${activeCard.rect?.width}px` : (window.innerWidth < 768 ? '90vw' : '420px'),
              height: activeCard.phase === 'summon' ? `${activeCard.rect?.height}px` : (window.innerWidth < 768 ? '70vh' : '600px'),
              transform: activeCard.phase === 'summon' ? 'none' : 'translate(-50%, -50%)',
              transition: 'all 0.7s ease-in-out',
              perspective: '1200px',
              pointerEvents: 'auto'
            }}
          >
            <div 
              className="relative w-full h-full"
              style={{
                transformStyle: 'preserve-3d',
                transform: (activeCard.phase === 'flipped' || activeCard.phase === 'burning') ? 'rotateY(180deg)' : 'rotateY(0deg)',
                transition: 'transform 0.7s ease-in-out'
              }}
            >
              {/* Front Face (Ofuda) */}
              <div 
                className="absolute inset-0 bg-black border-2 border-[var(--accent-blood)] flex flex-col items-center justify-between py-4 shadow-[0_0_30px_rgba(217,17,17,0.6)]"
                style={{ backfaceVisibility: 'hidden', borderRadius: '0px', zIndex: 2 }}
              >
                <div className="flex flex-col gap-1">
                  {[1,2,3].map(j => <div key={j} className="w-1 h-3 bg-[var(--accent-blood)]" />)}
                </div>
                <span className="font-mono text-[10px] md:text-xs font-black rotate-[-90deg] whitespace-nowrap text-[var(--accent-blood)]">
                  {segments.find(s => s.id === activeCard.id)?.hex}
                </span>
                <div className="flex flex-col gap-1 items-center">
                  <div className="w-2 h-2 rounded-full border border-[var(--accent-blood)]" />
                  <div className="w-[1px] h-8 bg-[var(--accent-blood)]" />
                </div>
              </div>

              {/* Back Face (Revelation) */}
              <div 
                className={`absolute inset-0 bg-[#000000] border-2 border-[var(--accent-blood)] flex items-center justify-center transition-colors duration-300 shadow-[0_0_50px_rgba(217,17,17,0.6)] overflow-hidden
                  ${activeCard.phase === 'burning' ? 'animate-ofuda-burn' : ''}`}
                style={{ 
                  backfaceVisibility: 'hidden', 
                  transform: 'rotateY(180deg)',
                  borderRadius: '0px',
                  backgroundColor: '#050505',
                  zIndex: 1
                }}
              >
                {/* 1. Atmospheric Textures & Grid */}
                <div className="absolute inset-0 ritual-grid opacity-30 pointer-events-none" />
                <div className="absolute inset-x-12 inset-y-0 pointer-events-none opacity-10 flex justify-between z-0">
                  <div className="w-[1px] h-full bg-[var(--accent-blood)]" />
                  <div className="w-[1px] h-full bg-[var(--accent-blood)]" />
                  <div className="w-[1px] h-full bg-[var(--accent-blood)]" />
                </div>
                <div className="absolute inset-0 halftone-bg opacity-[0.25] mix-blend-overlay pointer-events-none" />
                <div className="absolute inset-0 grain-bg opacity-[0.1] pointer-events-none" />
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.85)_100%)] pointer-events-none" />
                
                {/* 2. Ink Splatters (Brutalist marks from Art) */}
                <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-30">
                  <div className="absolute top-[10%] left-[5%] w-32 h-32 bg-[var(--accent-blood)] blur-3xl opacity-20 rounded-full" />
                  <div className="absolute bottom-[20%] right-[10%] w-48 h-48 bg-[var(--accent-blood)] blur-3xl opacity-20 rounded-full" />
                  {/* Jagged strokes */}
                  <div className="absolute top-0 right-0 w-[2px] h-full bg-[var(--accent-blood)] opacity-10 rotate-12 origin-top" />
                  <div className="absolute top-0 left-0 w-[1px] h-full bg-[var(--accent-blood)] opacity-10 -rotate-6 origin-top" />
                </div>

                {/* 3. The Grand Sigil (All-Seeing Eye from Art) */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full pointer-events-none opacity-[0.05] flex items-center justify-center">
                   <div className="relative w-[300px] h-[300px] border border-[var(--accent-blood)] rounded-full flex items-center justify-center">
                      <div className="absolute inset-0 border-2 border-[var(--accent-blood)] scale-[0.85] rounded-full rotate-45" />
                      <div className="w-12 h-12 bg-[var(--accent-blood)] rounded-full blur-[2px]" />
                   </div>
                </div>

                {/* 4. Cursed Scanlines */}
                <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-20">
                  <div className="absolute inset-0 bg-[linear-gradient(transparent_50%,rgba(217,17,17,0.1)_50%)] bg-[length:100%_4px] animate-scanline" />
                </div>

                {/* 5. Ritual Brackets */}
                <div className="absolute top-6 left-6 w-10 h-10 border-t-2 border-l-2 border-[var(--accent-blood)] opacity-40" />
                <div className="absolute top-6 right-6 w-10 h-10 border-t-2 border-r-2 border-[var(--accent-blood)] opacity-40" />
                <div className="absolute bottom-6 left-6 w-10 h-10 border-b-2 border-l-2 border-[var(--accent-blood)] opacity-40" />
                <div className="absolute bottom-6 right-6 w-10 h-10 border-b-2 border-r-2 border-[var(--accent-blood)] opacity-40" />

                {/* 6. Symbolic Verification Marks (Top of the art) */}
                <div className="absolute top-8 left-1/2 -translate-x-1/2 flex gap-4 opacity-40">
                   {[1,2,3].map(k => (
                     <div key={k} className="w-4 h-4 border border-[var(--accent-blood)] rotate-45 flex items-center justify-center">
                        <div className="w-[2px] h-[2px] bg-[var(--accent-blood)]" />
                     </div>
                   ))}
                </div>

                <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-4 opacity-30">
                  <div className="w-16 h-[1px] bg-[var(--accent-blood)]" />
                  <div className="w-16 h-[1px] bg-[var(--accent-blood)]" />
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
          0% { transform: translateX(100vw) translateY(15vh) rotateZ(15deg) scale(0.6); opacity: 0; filter: blur(4px) grayscale(1); }
          45%, 55% { opacity: 1; filter: blur(0px) grayscale(0); }
          50% { transform: translateX(0vw) translateY(0vh) rotateZ(0deg) scale(1.1); }
          100% { transform: translateX(-100vw) translateY(-15vh) rotateZ(-15deg) scale(0.6); opacity: 0; filter: blur(4px) grayscale(1); }
        }

        .animate-ofuda-burn {
          animation: smoke-dissolve 0.8s forwards cubic-bezier(0.19, 1, 0.22, 1);
        }

        @keyframes smoke-dissolve {
          0% { 
            opacity: 1; 
            filter: blur(0px) brightness(1);
            transform: rotateY(180deg) scale(1);
          }
          100% { 
            opacity: 0; 
            filter: blur(30px) brightness(1.2);
            transform: rotateY(180deg) scale(1.05) translateY(-20px);
          }
        }

        @keyframes scanline {
          0% { transform: translateY(0); }
          100% { transform: translateY(100%); }
        }

        .animate-scanline {
          animation: scanline 8s linear infinite;
        }

        .ritual-grid {
          background-image: 
            linear-gradient(rgba(217, 17, 17, 0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(217, 17, 17, 0.1) 1px, transparent 1px);
          background-size: 30px 30px;
          mask-image: radial-gradient(circle at center, black, transparent 80%);
        }
      `}</style>
      
      <div className="absolute inset-0 halftone-bg opacity-10 pointer-events-none" />
    </div>
  );
};

export default ExorcistsScroll;
