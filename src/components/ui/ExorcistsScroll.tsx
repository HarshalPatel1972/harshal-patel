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

const OfudaSigil: React.FC<{ size?: number; color?: string }> = ({ size = 100, color = "#00fff7" }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" className="filter drop-shadow-[0_0_8px_rgba(0,255,247,0.4)] transition-all duration-500 animate-pulse-glitch">
    <circle cx="50" cy="50" r="48" stroke={color} strokeWidth="0.2" strokeDasharray="1 2" />
    <circle cx="50" cy="50" r="44" stroke="var(--accent-blood)" strokeWidth="0.5" opacity="0.6" />
    <path d="M50 2 L50 98 M2 50 L98 50" stroke="var(--accent-blood)" strokeWidth="0.2" opacity="0.3" />
    <rect x="25" y="25" width="50" height="50" stroke={color} strokeWidth="0.8" transform="rotate(45 50 50)" opacity="0.8" />
    <rect x="30" y="30" width="40" height="40" stroke="var(--accent-blood)" strokeWidth="0.5" transform="rotate(15 50 50)" />
    <path d="M20 20 L80 80 M80 20 L20 80" stroke="var(--accent-blood)" strokeWidth="0.2" opacity="0.4" />
    <g className={`stroke-[${color}]`} strokeWidth="1.5" strokeLinecap="square">
      <path d="M42 42 L58 42 M42 50 L58 50 M42 58 L58 58" />
      <path d="M50 38 L50 62" strokeWidth="0.5" />
    </g>
    {[0, 90, 180, 270].map(rot => (
      <path 
        key={rot}
        d="M50 5 L48 10 L52 10 Z" 
        fill={color} 
        transform={`rotate(${rot} 50 50)`} 
      />
    ))}
  </svg>
);

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
    <div className="w-full h-full p-8 flex flex-col items-start justify-center text-left relative overflow-hidden">
      {/* Decorative Brackets */}
      <div className="absolute top-2 left-2 w-4 h-4 border-t border-l border-[#00fff7]/60" />
      <div className="absolute top-2 right-2 w-4 h-4 border-t border-r border-[#00fff7]/60" />
      <div className="absolute bottom-2 left-2 w-4 h-4 border-b border-l border-[#00fff7]/60" />
      <div className="absolute bottom-2 right-2 w-4 h-4 border-b border-r border-[#00fff7]/60" />

      <div className="text-white font-mono text-base md:text-lg leading-[1.8] font-normal tracking-normal text-left chromatic-aberration" style={{ color: '#ffffff !important', opacity: '1 !important' }}>
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
                disabled={activeCard !== null}
                className="ofuda-talisman pointer-events-auto relative w-12 md:w-20 h-32 md:h-48 border-2 flex flex-col items-center justify-center p-2 shadow-2xl transition-all duration-300 outline-none bg-black/80 border-[var(--accent-blood)] hover:border-[#00fff7] hover:shadow-[0_0_12px_rgba(0,255,247,0.3)] hover:scale-[1.05] cursor-pointer"
                style={{ borderRadius: '0px' }}
              >
                <div className="absolute inset-0 halftone-bg opacity-10" />
                <OfudaSigil size={60} color="var(--accent-blood)" />
              </button>
              <div className="w-[1px] h-32 bg-[var(--accent-blood)] opacity-20" />
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
                className="absolute inset-0 bg-black border-2 border-[#00fff7] flex items-center justify-center p-4 shadow-[0_0_30px_rgba(0,255,247,0.6)]"
                style={{ backfaceVisibility: 'hidden', borderRadius: '0px', zIndex: 2 }}
              >
                <div className="absolute inset-0 halftone-bg opacity-10" />
                <OfudaSigil size={180} color="#00fff7" />
              </div>

              {/* Back Face (Revelation) */}
              <div 
                className={`absolute inset-0 bg-[#0a0a0a] border-2 border-[#00fff7] flex items-center justify-center shadow-[0_0_40px_rgba(0,255,247,0.4),inset_0_0_20px_rgba(0,255,247,0.05)] overflow-hidden
                  ${activeCard.phase === 'burning' ? 'animate-ofuda-burn' : ''}`}
                style={{ 
                  backfaceVisibility: 'hidden', 
                  transform: 'rotateY(180deg)',
                  borderRadius: '0px',
                  zIndex: 1
                }}
              >
                {/* Background Texture & Depth */}
                <div className="absolute inset-0 halftone-bg opacity-15 pointer-events-none" />
                <div className="absolute inset-0 bg-radial-gradient from-cyan-500/10 to-transparent pointer-events-none" />
                
                {activeCard.phase === 'flipped' && (
                  <div className="relative z-10 w-full h-full">
                    <CharacterInscription text={activeCard.fact} />
                  </div>
                )}

                {/* Burn Particles */}
                {activeCard.phase === 'burning' && (
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

        .chromatic-aberration {
          text-shadow: 1px 0 0 rgba(255,0,0,0.3), -1px 0 0 rgba(0,255,255,0.3);
          animation: glitch-subtle 4s infinite;
        }

        @keyframes glitch-subtle {
          0%, 100% { transform: translate(0); }
          33% { transform: translate(0.5px, -0.5px); }
          66% { transform: translate(-0.5px, 0.5px); }
        }

        @keyframes pulse-glitch {
          0%, 100% { opacity: 0.6; transform: scale(1); }
          50% { opacity: 0.8; transform: scale(1.02); filter: hue-rotate(15deg); }
          51% { opacity: 0.4; filter: contrast(1.5); }
        }

        .animate-pulse-glitch {
          animation: pulse-glitch 3s infinite;
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
