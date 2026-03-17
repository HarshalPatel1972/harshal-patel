import React, { useMemo, useState, useEffect, useRef } from 'react';
import { OFUDA_FACTS } from '@/lib/ofudaFacts';
import { getNextFact, markCardBurned, getBurnedCards } from '@/lib/ofudaMemory';

interface ActiveCard {
  id: number;
  fact: string;
  phase: 'summon' | 'flying' | 'flipped' | 'burning' | null;
  rect: DOMRect | null;
}

const CharacterInscription: React.FC<{ text: string }> = ({ text }) => {
  const [displayedText, setDisplayedText] = useState("");
  const [flickerWord, setFlickerWord] = useState<number | null>(null);

  useEffect(() => {
    let currentIdx = 0;
    let timer: NodeJS.Timeout;

    const words = text.split(" ");
    let wordCharIndices: number[] = [];
    let cumulative = 0;
    words.forEach(w => {
      wordCharIndices.push(cumulative);
      cumulative += w.length + 1;
    });

    const addChar = () => {
      if (currentIdx < text.length) {
        setDisplayedText(text.slice(0, currentIdx + 1));
        
        // Random flicker near word starts
        if (wordCharIndices.includes(currentIdx)) {
          setFlickerWord(wordCharIndices.indexOf(currentIdx));
          setTimeout(() => setFlickerWord(null), 100);
        }

        currentIdx++;
        timer = setTimeout(addChar, Math.random() * 7 + 8); // 8-15ms
      }
    };

    addChar();
    return () => clearTimeout(timer);
  }, [text]);

  return (
    <div className="relative p-6 text-center">
      <div className="text-[var(--accent-blood)] opacity-50 text-[10px] font-mono tracking-[0.3em] mb-4 uppercase">
        // REVELATION
      </div>
      <div className="text-white font-mono text-sm md:text-lg leading-relaxed tracking-tight">
        {displayedText.split(" ").map((word, i) => (
          <span 
            key={i} 
            className={`inline-block mr-1.5 transition-all duration-100 ${flickerWord === i ? 'text-[#00fff7] scale-105 brightness-150' : ''}`}
          >
            {word}
          </span>
        ))}
      </div>
    </div>
  );
};

const ExorcistsScroll: React.FC = () => {
  const [burnedCards, setBurnedCards] = useState<Set<number>>(new Set());
  const [activeCard, setActiveCard] = useState<ActiveCard | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const burned = getBurnedCards();
    setBurnedCards(new Set(burned));
  }, []);

  const handleCardClick = (id: number, e: React.MouseEvent<HTMLButtonElement>) => {
    if (burnedCards.has(id)) return;
    
    const rect = e.currentTarget.getBoundingClientRect();
    const { fact } = getNextFact(OFUDA_FACTS);
    
    setActiveCard({ id, fact, phase: 'summon', rect });
    
    // Phase A -> B
    setTimeout(() => {
      setActiveCard(prev => prev ? { ...prev, phase: 'flying' } : null);
    }, 300);

    // Phase B -> C
    setTimeout(() => {
      setActiveCard(prev => prev ? { ...prev, phase: 'flipped' } : null);
    }, 800);
  };

  const handleDismiss = () => {
    if (!activeCard || activeCard.phase === 'burning') return;
    
    setActiveCard(prev => prev ? { ...prev, phase: 'burning' } : null);
    markCardBurned(activeCard.id);
    setBurnedCards(prev => new Set(prev).add(activeCard.id));

    setTimeout(() => {
      setActiveCard(null);
    }, 1000);
  };

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') handleDismiss();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [activeCard]);

  // Generate segments of the "Eternal Scroll"
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
    <div ref={containerRef} className="absolute inset-0 flex items-center justify-center z-20 pointer-events-none overflow-hidden opacity-60">
      {/* ─── OVERLAY LAYER (Phases B-D) ─── */}
      <div 
        className={`fixed inset-0 z-[50] transition-opacity duration-500 pointer-events-auto cursor-zoom-out
          ${activeCard && activeCard.phase !== 'summon' ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        style={{ 
          background: 'rgba(0,0,0,0.85)',
          backgroundImage: 'radial-gradient(circle at center, transparent 0%, rgba(217,17,17,0.05) 100%)'
        }}
        onClick={handleDismiss}
      />

      {/* ─── LAYER 1: THE ETERNAL PATH ─── */}
      <div className="relative w-full h-[600px] flex items-center justify-center translate-y-[-10%] pointer-events-none">
        {segments.map((s) => {
          const isBurned = burnedCards.has(s.id);
          const isSummoned = activeCard?.id === s.id;
          
          return (
            <div 
              key={s.id}
              className={`absolute flex flex-col items-center justify-center pointer-events-none transition-opacity duration-500
                ${activeCard && !isSummoned ? 'opacity-10' : 'opacity-100'}`}
              style={{
                animation: isSummoned ? 'none' : `scroll-flow 15s linear infinite`,
                animationDelay: `${s.delay}s`,
                zIndex: isSummoned ? 51 : 1,
                transform: isSummoned && activeCard.phase !== 'summon' ? calculateCenterTranslate(activeCard.rect) : undefined,
                transition: isSummoned && (activeCard.phase === 'flying' || activeCard.phase === 'flipped') ? 'transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)' : undefined
              }}
            >
              <div 
                className="relative" 
                style={{ 
                  perspective: '1200px',
                  transform: isSummoned 
                    ? `scale(${activeCard.phase === 'summon' ? 1.3 : activeCard.phase === 'burning' ? 1 : 2.2})` 
                    : 'scale(1)',
                  transition: 'transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)'
                }}
              >
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    handleCardClick(s.id, e);
                  }}
                  disabled={isBurned || (activeCard !== null)}
                  className={`ofuda-talisman pointer-events-auto relative w-12 md:w-20 h-32 md:h-48 border-2 flex flex-col items-center justify-between shadow-2xl transition-all duration-300 outline-none
                    ${isBurned 
                      ? 'bg-zinc-900 border-[rgba(217,17,17,0.15)] cursor-default' 
                      : isSummoned
                        ? (activeCard.phase === 'summon' || activeCard.phase === 'flying' ? 'border-[#00fff7] bg-black shadow-[0_0_30px_rgba(0,255,247,0.6)]' : 'border-[#00fff7] bg-black shadow-[0_0_40px_rgba(0,255,247,0.4)]')
                        : 'border-[var(--accent-blood)] bg-black/80 hover:border-[#00fff7] hover:shadow-[0_0_12px_rgba(0,255,247,0.3)] hover:scale-[1.05] cursor-pointer'
                    }
                    ${isSummoned && activeCard.phase === 'burning' ? 'animate-burn' : ''}
                  `}
                  style={{
                    transformStyle: 'preserve-3d',
                    transform: isSummoned && (activeCard.phase === 'flipped' || activeCard.phase === 'burning') ? 'rotateY(180deg)' : 'rotateY(0deg)',
                    transition: isSummoned ? 'transform 0.6s cubic-bezier(0.4, 0, 0.2, 1), border-color 0.3s ease, background-color 0.3s ease, box-shadow 0.3s ease' : 'all 0.3s ease'
                  }}
                >
                  {/* FRONT FACE (The Talisman) */}
                  <div className="absolute inset-0 flex flex-col items-center justify-between py-4 bg-black" style={{ backfaceVisibility: 'hidden', zIndex: 2 }}>
                    <div className="flex flex-col gap-1">
                      {[1,2,3].map(j => <div key={j} className={`w-1 h-3 transition-colors ${isSummoned ? 'bg-[#00fff7]' : 'bg-[var(--accent-blood)] opacity-50'}`} />)}
                    </div>
                    <span className={`font-mono text-[10px] md:text-xs font-black rotate-[-90deg] whitespace-nowrap transition-colors
                      ${isBurned ? 'text-black/15' : isSummoned ? 'text-[#00fff7]' : 'text-[var(--accent-blood)] brightness-125'}`}>
                      {s.hex}
                    </span>
                    <div className="flex flex-col gap-1 items-center relative">
                      <div className={`w-2 h-2 rounded-full border transition-colors ${isSummoned ? 'border-[#00fff7]' : 'border-[var(--accent-blood)]'}`} />
                      <div className={`w-[1px] h-8 transition-colors ${isSummoned ? 'bg-[#00fff7]' : 'bg-[var(--accent-blood)] opacity-30'}`} />
                      {isBurned && (
                        <div className="absolute bottom-0 w-0.5 h-0.5 rounded-full bg-[#00fff7] shadow-[0_0_4px_rgba(0,255,247,0.5)]" />
                      )}
                    </div>
                  </div>

                  {/* BACK FACE (The Data) */}
                  <div 
                    className="absolute inset-0 bg-black border-2 border-[#00fff7] overflow-hidden" 
                    style={{ 
                      backfaceVisibility: 'hidden', 
                      transform: 'rotateY(180deg)',
                      zIndex: 1
                    }}
                  >
                    {/* Interior glow for depth */}
                    <div className="absolute inset-0 bg-radial-gradient from-cyan-500/10 to-transparent pointer-events-none" />
                    
                    {isSummoned && activeCard.phase === 'flipped' && (
                      <div className="relative h-full w-full flex flex-col items-center justify-center">
                        <CharacterInscription text={activeCard.fact} />
                      </div>
                    )}
                  </div>

                  {/* Burn Particles */}
                  {isSummoned && activeCard.phase === 'burning' && (
                    <div className="absolute inset-0 pointer-events-none" style={{ transform: 'translateZ(10px)' }}>
                      {Array.from({ length: 12 }).map((_, i) => (
                        <div key={i} className="absolute particle w-1 h-1 bg-[#00fff7]" style={{ 
                          '--tx': `${(Math.random() - 0.5) * 200}px`, 
                          '--ty': `${(Math.random() - 0.5) * 200}px`,
                          '--rot': `${Math.random() * 360}deg`
                        } as any} />
                      ))}
                    </div>
                  )}
                </button>
              </div>
              
              {/* Connection String */}
              {!isBurned && !isSummoned && <div className="w-[1px] h-32 bg-[var(--accent-blood)] opacity-20" />}
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

        @keyframes burn-flicker {
          0%, 100% { border-color: #00fff7; }
          50% { border-color: white; }
        }

        .animate-burn {
          animation: burn-flicker 0.1s infinite;
          clip-path: inset(0%);
          animation: burn-consume 1s forwards;
        }

        @keyframes burn-consume {
          0% { clip-path: inset(0%); opacity: 1; }
          60% { clip-path: inset(30%); opacity: 1; }
          100% { clip-path: inset(50%); opacity: 0; }
        }

        .particle {
          animation: particle-fly 0.8s forwards ease-out;
        }

        @keyframes particle-fly {
          0% { transform: translate(0, 0) rotate(0); opacity: 1; }
          100% { transform: translate(var(--tx), var(--ty)) rotate(var(--rot)); opacity: 0; }
        }
      `}</style>
      
      {/* Background Japanese Texture (Grain) */}
      <div className="absolute inset-0 halftone-bg opacity-10 pointer-events-none" />
    </div>
  );
};

export default ExorcistsScroll;
