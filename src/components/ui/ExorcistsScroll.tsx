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
    }, 25);
    return () => clearInterval(interval);
  }, [totalChars]);

  let charIndexCounter = 0;

  return (
    <div className="w-full h-full p-10 flex flex-col items-center justify-center text-center">
      <div className="text-[#E8E8E6] font-mono text-lg md:text-xl leading-[1.6] font-medium tracking-tight text-center" style={{ textShadow: '0 0 15px rgba(255,255,255,0.1)' }}>
        {words.map((word, wi) => (
          <span key={wi} className="inline-block whitespace-nowrap mr-[0.25em]">
            {word.split("").map((char, ci) => {
              const isVisible = charIndexCounter++ < visibleCount;
              return (
                <span
                  key={ci}
                  className="inline-block transition-all duration-800 ease-out"
                  style={{ 
                    opacity: isVisible ? 1 : 0,
                    transform: isVisible ? 'translateY(0)' : 'translateY(40px)',
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
    
    setActiveCard(prev => prev ? { ...prev, phase: 'burning' } : null);
    
    setTimeout(() => {
      setActiveCard(prev => prev ? { ...prev, phase: 'done' } : null);
    }, 1000);

    setTimeout(() => {
      setActiveCard(null);
    }, 1200);
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
                className="ofuda-talisman pointer-events-auto relative w-12 md:w-20 h-32 md:h-48 border-2 flex flex-col items-center justify-between py-4 shadow-2xl transition-all duration-300 outline-none bg-black/80 border-[var(--accent-blood)] hover:border-[#00fff7] hover:shadow-[0_0_12px_rgba(0,255,247,0.3)] hover:scale-[1.05] cursor-pointer"
                style={{ borderRadius: '0px' }}
              >
                <div className="flex flex-col gap-1">
                  {[1,2,3].map(j => <div key={j} className="w-1 h-3 bg-[var(--accent-blood)] opacity-50" />)}
                </div>
                <span className="font-mono text-[10px] md:text-xs font-black rotate-[-90deg] whitespace-nowrap text-[var(--accent-blood)] brightness-125">
                  {s.hex}
                </span>
                <div className="flex flex-col gap-1 items-center">
                  <div className="w-2 h-2 rounded-full border border-[var(--accent-blood)]" />
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
              width: activeCard.phase === 'summon' ? `${activeCard.rect?.width}px` : '320px',
              height: activeCard.phase === 'summon' ? `${activeCard.rect?.height}px` : '480px',
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
                className="absolute inset-0 bg-black border-2 border-[#00fff7] flex flex-col items-center justify-between py-4 shadow-[0_0_30px_rgba(0,255,247,0.6)]"
                style={{ backfaceVisibility: 'hidden', borderRadius: '0px', zIndex: 2 }}
              >
                <div className="flex flex-col gap-1">
                  {[1,2,3].map(j => <div key={j} className="w-1 h-3 bg-[#00fff7]" />)}
                </div>
                <span className="font-mono text-[10px] md:text-xs font-black rotate-[-90deg] whitespace-nowrap text-[#00fff7]">
                  {segments.find(s => s.id === activeCard.id)?.hex}
                </span>
                <div className="flex flex-col gap-1 items-center">
                  <div className="w-2 h-2 rounded-full border border-[#00fff7]" />
                  <div className="w-[1px] h-8 bg-[#00fff7]" />
                </div>
              </div>

              {/* Back Face (Revelation) */}
              <div 
                className={`absolute inset-0 bg-[#000000] border-2 border-[#00fff7] flex items-center justify-center shadow-[0_0_40px_rgba(0,255,247,0.4),inset_0_0_20px_rgba(0,255,247,0.05)]
                  ${activeCard.phase === 'burning' ? 'animate-ofuda-burn' : ''}`}
                style={{ 
                  backfaceVisibility: 'hidden', 
                  transform: 'rotateY(180deg)',
                  borderRadius: '0px',
                  backgroundColor: '#000000 !important',
                  zIndex: 1
                }}
              >
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
      `}</style>
      
      <div className="absolute inset-0 halftone-bg opacity-10 pointer-events-none" />
    </div>
  );
};

export default ExorcistsScroll;
