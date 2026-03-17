import React, { useMemo, useState, useEffect, useRef } from 'react';
import { OFUDA_FACTS } from '@/lib/ofudaFacts';
import { getNextFact } from '@/lib/ofudaMemory';

interface ActiveCard {
  id: number;
  fact: string;
  phase: 'summon' | 'flying' | 'flipped' | 'burning' | 'done' | null;
  rect: DOMRect | null;
}

const CharacterInscription: React.FC<{ text: string }> = ({ text }) => {
  const [chars, setChars] = useState<{ char: string; visible: boolean }[]>([]);

  useEffect(() => {
    const charArray = text.split("").map((c) => ({ char: c, visible: false }));
    setChars(charArray);

    charArray.forEach((_, i) => {
      setTimeout(() => {
        setChars((prev) => {
          const next = [...prev];
          if (next[i]) next[i].visible = true;
          return next;
        });
      }, i * 35 + Math.random() * 20);
    });
  }, [text]);

  return (
    <div className="w-full h-full p-8 flex flex-col items-start justify-start text-left">
      <div className="text-[#ff1111] text-[0.65rem] font-mono tracking-[0.3em] mb-6 uppercase">
        // REVELATION
      </div>
      <div className="text-white font-mono text-base leading-[1.8] font-normal tracking-normal text-left">
        {chars.map((item, i) => (
          <span
            key={i}
            className="transition-opacity duration-300"
            style={{ opacity: item.visible ? 1 : 0 }}
          >
            {item.char}
          </span>
        ))}
      </div>
    </div>
  );
};

const ExorcistsScroll: React.FC = () => {
  const [activeCard, setActiveCard] = useState<ActiveCard | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

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

  const calculateCenterTranslate = (rect: DOMRect | null) => {
    if (!rect) return 'translate(0, 0)';
    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight / 2;
    const cardX = rect.left + rect.width / 2;
    const cardY = rect.top + rect.height / 2;
    return `translate(${centerX - cardX}px, ${centerY - cardY}px)`;
  };

  return (
    <div ref={containerRef} className="absolute inset-0 flex items-center justify-center z-20 pointer-events-none overflow-hidden opacity-100">
      
      {/* ─── OVERLAY ─── */}
      <div 
        className={`fixed inset-0 z-[50] transition-opacity duration-300 pointer-events-auto cursor-default
          ${activeCard && activeCard.phase !== 'summon' && activeCard.phase !== 'done' ? 'opacity-92' : 'opacity-0 pointer-events-none'}`}
        style={{ backgroundColor: '#000000' }}
        onClick={handleDismiss}
      />

      {/* ─── SCROLL PATH ─── */}
      <div className="relative w-full h-[600px] flex items-center justify-center translate-y-[-10%] pointer-events-none">
        {segments.map((s) => {
          const isSummoned = activeCard?.id === s.id;
          const isFlippedOrDone = isSummoned && (activeCard.phase === 'flipped' || activeCard.phase === 'burning');

          return (
            <div 
              key={s.id}
              className={`absolute flex flex-col items-center justify-center pointer-events-none transition-opacity duration-500
                ${activeCard && !isSummoned ? 'opacity-10' : 'opacity-60'}`}
              style={{
                animation: isSummoned ? 'none' : `scroll-flow 15s linear infinite`,
                animationDelay: `${s.delay}s`,
                zIndex: isSummoned ? 51 : 1,
                transform: isSummoned && activeCard.phase !== 'summon' ? calculateCenterTranslate(activeCard.rect) : 'none',
                transition: isSummoned ? 'transform 0.7s ease-in-out' : 'none'
              }}
            >
              <div 
                className="relative"
                style={{
                  perspective: '1200px',
                  width: isSummoned && activeCard.phase !== 'summon' ? '320px' : 'auto',
                  height: isSummoned && activeCard.phase !== 'summon' ? '480px' : 'auto',
                  transition: 'all 0.7s ease-in-out'
                }}
              >
                <div 
                  className={`relative ${isSummoned && activeCard.phase !== 'summon' ? 'w-[320px] h-[480px]' : 'w-12 md:w-20 h-32 md:h-48'}`}
                  style={{
                    transformStyle: 'preserve-3d',
                    transform: isFlippedOrDone ? 'rotateY(180deg)' : 'rotateY(0deg)',
                    transition: 'transform 0.7s ease-in-out'
                  }}
                >
                  {/* FRONT FACE (OFUDA) */}
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      handleCardClick(s.id, e);
                    }}
                    disabled={activeCard !== null}
                    className="absolute inset-0 flex flex-col items-center justify-between py-4 border shadow-2xl transition-all duration-300 outline-none bg-black/80 border-[var(--accent-blood)] hover:border-[#00fff7] hover:shadow-[0_0_12px_rgba(0,255,247,0.3)] hover:scale-[1.05] cursor-pointer pointer-events-auto"
                    style={{ backfaceVisibility: 'hidden', borderRadius: '0px' }}
                  >
                    <div className="flex flex-col gap-1 opacity-100">
                      {[1,2,3].map(j => <div key={j} className="w-1 h-3 bg-[var(--accent-blood)] opacity-50" />)}
                    </div>
                    <span className="font-mono text-[10px] md:text-xs font-black rotate-[-90deg] whitespace-nowrap text-[var(--accent-blood)] brightness-125 transition-colors">
                      {s.hex}
                    </span>
                    <div className="flex flex-col gap-1 items-center relative">
                      <div className="w-2 h-2 rounded-full border border-[var(--accent-blood)]" />
                      <div className="w-[1px] h-8 bg-[var(--accent-blood)] opacity-30" />
                    </div>
                  </button>

                  {/* BACK FACE (REVELATION) */}
                  <div 
                    className={`absolute inset-0 bg-[#000000] border-2 border-[#00fff7] flex items-center justify-center shadow-[0_0_40px_rgba(0,255,247,0.4),inset_0_0_20px_rgba(0,255,247,0.05)]
                      ${isSummoned && activeCard.phase === 'burning' ? 'animate-ofuda-burn' : ''}`}
                    style={{ 
                      backfaceVisibility: 'hidden', 
                      transform: 'rotateY(180deg)',
                      borderRadius: '0px'
                    }}
                  >
                    {isSummoned && activeCard.phase === 'flipped' && (
                      <CharacterInscription text={activeCard.fact} />
                    )}

                    {/* BURN PARTICLES */}
                    {isSummoned && activeCard.phase === 'burning' && (
                      <div className="absolute inset-0 pointer-events-none">
                        {Array.from({ length: 10 }).map((_, i) => (
                          <div 
                            key={i} 
                            className="absolute w-1 h-1 particle" 
                            style={{ 
                              backgroundColor: i % 2 === 0 ? '#00fff7' : '#ffffff',
                              left: '50%',
                              top: '50%',
                              '--tx': `${(Math.random() - 0.5) * 300}px`,
                              '--ty': `${(Math.random() - 0.5) * 300}px`,
                              '--rot': `${Math.random() * 360}deg`
                            } as any}
                          />
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
              
              {!isSummoned && <div className="w-[1px] h-32 bg-[var(--accent-blood)] opacity-20" />}
            </div>
          );
        })}
      </div>

      <style>{`
        @keyframes scroll-flow {
          0% { transform: translateX(100vw) translateY(15vh) rotateZ(15deg) scale(0.6); opacity: 0; filter: blur(4px) grayscale(1); }
          45%, 55% { opacity: 1; filter: blur(0px) grayscale(0); }
          50% { transform: translateX(0vw) translateY(0vh) rotateZ(0deg) scale(1.1); }
          100% { transform: translateX(-100vw) translateY(-15vh) rotateZ(-15deg) scale(0.6); opacity: 0; filter: blur(4px) grayscale(1); }
        }

        .animate-ofuda-burn {
          animation: final-flicker 0.24s step-end 3, burn-up 0.4s forwards ease-in;
          animation-delay: 0s, 0.3s;
        }

        @keyframes final-flicker {
          0%, 100% { border-color: #00fff7; }
          50% { border-color: #ffffff; }
        }

        @keyframes burn-up {
          0% { clip-path: inset(0% 0% 0% 0%); }
          100% { clip-path: inset(0% 0% 100% 0%); }
        }

        .particle {
          animation: particle-scatter 0.8s forwards ease-out;
        }

        @keyframes particle-scatter {
          0% { transform: translate(-50%, -50%) rotate(0); opacity: 1; }
          100% { transform: translate(calc(-50% + var(--tx)), calc(-50% + var(--ty))) rotate(var(--rot)); opacity: 0; }
        }
      `}</style>
      
      <div className="absolute inset-0 halftone-bg opacity-10 pointer-events-none" />
    </div>
  );
};

export default ExorcistsScroll;
