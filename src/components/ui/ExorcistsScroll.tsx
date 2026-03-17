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

const OfudaSigil: React.FC<{ size?: number; color?: string; opacity?: number }> = ({ size = 100, color = "#00fff7", opacity = 1 }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" className="filter drop-shadow-[0_0_12px_rgba(0,255,247,0.5)] transition-all duration-700 select-none animate-pulse-glitch" style={{ opacity }}>
    {/* Geometric Architecture */}
    <path d="M50 0 L100 50 L50 100 L0 50 Z" fill="none" stroke={color} strokeWidth="0.1" strokeDasharray="2 2" className="opacity-20" />
    <path d="M0 0 L100 100 M100 0 L0 100" stroke={color} strokeWidth="0.05" className="opacity-10" />
    
    {/* Cursed Containment Circles */}
    <circle cx="50" cy="50" r="48" fill="none" stroke={color} strokeWidth="0.5" strokeDasharray="8 4" className="opacity-40" />
    <circle cx="50" cy="50" r="40" fill="none" stroke="var(--accent-blood)" strokeWidth="1" className="opacity-30" />
    
    {/* Central Occult Glyph - Hand Crafted Minimalist Abstract */}
    <g transform="translate(30, 30) scale(0.4)" stroke={color} strokeWidth="2.5" fill="none" strokeLinecap="square">
      <path d="M10 10 L40 10 M10 40 L40 40 M10 25 L35 25" />
      <path d="M25 5 L25 45 M50 10 L50 90" strokeWidth="1" stroke="var(--accent-blood)" />
      <path d="M10 60 L90 60 L50 85 Z" strokeWidth="2" stroke={color} />
      <rect x="0" y="0" width="100" height="100" strokeWidth="0.5" strokeDasharray="2 1" className="opacity-20" />
    </g>

    {/* Corner Resonance Tags */}
    {[
      "M2,2 L10,2 M2,2 L2,10", 
      "M98,2 L90,2 M98,2 L98,10", 
      "M2,98 L10,98 M2,98 L2,90", 
      "M98,98 L90,98 M98,98 L98,90"
    ].map((d, i) => (
      <path key={i} d={d} stroke={color} strokeWidth="1.5" className="opacity-80" />
    ))}

    {/* Peripheral Kanji-like Fractals */}
    <g className="fill-[var(--accent-blood)]" opacity="0.6">
      <text x="50" y="15" textAnchor="middle" fontSize="6" fontFamily="serif" transform="rotate(0 50 50)">呪</text>
      <text x="85" y="50" textAnchor="middle" fontSize="6" fontFamily="serif" transform="rotate(90 50 50)">封</text>
      <text x="50" y="85" textAnchor="middle" fontSize="6" fontFamily="serif" transform="rotate(180 50 50)">厄</text>
      <text x="15" y="50" textAnchor="middle" fontSize="6" fontFamily="serif" transform="rotate(270 50 50)">滅</text>
    </g>
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
      {/* Structural Brackets (Cinematic Brutalist) */}
      <div className="absolute inset-4 border border-white/5 pointer-events-none" />
      <div className="absolute top-4 left-4 w-8 h-[1px] bg-[#00fff7]/40" />
      <div className="absolute top-4 left-4 w-[1px] h-8 bg-[#00fff7]/40" />
      <div className="absolute bottom-4 right-4 w-8 h-[1px] bg-[#00fff7]/40" />
      <div className="absolute bottom-4 right-4 w-[1px] h-8 bg-[#00fff7]/40" />

      {/* Background Vertical Text Accent */}
      <div className="absolute right-6 top-1/2 -translate-y-1/2 rotate-90 origin-center pointer-events-none opacity-10">
        <span className="text-[var(--accent-blood)] font-mono text-[80px] font-black tracking-tighter uppercase whitespace-nowrap select-none">
          REVEAL_DATA_PULSE
        </span>
      </div>

      <div className="text-white font-mono text-base md:text-xl leading-[1.8] font-normal tracking-tight text-left chromatic-aberration relative z-10" style={{ color: '#ffffff !important', opacity: '1 !important' }}>
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
    setActiveCard({ id, fact, phase: 'summon', rect });
    
    setTimeout(() => setActiveCard(prev => prev ? { ...prev, phase: 'flying' } : null), 100);
    setTimeout(() => setActiveCard(prev => prev ? { ...prev, phase: 'flipped' } : null), 800); 
  };

  const handleDismiss = () => {
    if (!activeCard || activeCard.phase === 'burning' || activeCard.phase === 'done') return;
    setActiveCard(prev => prev ? { ...prev, phase: 'burning' } : null);
    setTimeout(() => setActiveCard(prev => prev ? { ...prev, phase: 'done' } : null), 1000);
    setTimeout(() => setActiveCard(null), 1200);
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
    <div ref={containerRef} className="absolute inset-0 flex items-center justify-center z-0 pointer-events-none overflow-hidden opacity-100">
      
      {/* ─── SCROLL PATH ─── */}
      <div className="relative w-full h-[600px] flex items-center justify-center translate-y-[-10%] pointer-events-none">
        {segments.map((s) => {
          const isSummoned = activeCard?.id === s.id;
          return (
            <div 
              key={s.id}
              className="absolute flex flex-col items-center justify-center pointer-events-none opacity-40 grayscale-[0.5] hover:opacity-80 hover:grayscale-0 transition-all duration-700"
              style={{
                animation: `scroll-flow 18s linear infinite`,
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
                className="ofuda-talisman pointer-events-auto relative w-12 md:w-20 h-32 md:h-52 border-[1px] flex flex-col items-center justify-center p-2 shadow-2xl transition-all duration-300 outline-none bg-black border-[var(--accent-blood)] hover:border-[#00fff7] hover:shadow-[0_0_20px_rgba(0,255,247,0.4)] cursor-pointer overflow-hidden"
              >
                {/* Vintage Paper Texture Overlay */}
                <div className="absolute inset-0 halftone-bg opacity-10 pointer-events-none" />
                <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent opacity-20 pointer-events-none" />
                
                {/* Minimalist Occult Pattern */}
                <div className="w-full h-full border border-white/5 flex flex-col items-center justify-between py-6">
                  <div className="w-[1px] h-8 bg-[var(--accent-blood)] opacity-40 shrink-0" />
                  <OfudaSigil size={50} color="var(--accent-blood)" opacity={0.7} />
                  <div className="w-[1px] h-8 bg-[var(--accent-blood)] opacity-40 shrink-0" />
                </div>
              </button>
              <div className="w-[0.5px] h-32 bg-[var(--accent-blood)] opacity-10" />
            </div>
          );
        })}
      </div>

      {/* ─── REVELATION PORTAL ─── */}
      {mounted && activeCard && createPortal(
        <div className="fixed inset-0" style={{ zIndex: 9998, pointerEvents: 'auto' }}>
          {/* Overlay */}
          <div 
            className={`fixed inset-0 transition-opacity duration-500 cursor-default
              ${activeCard.phase !== 'summon' && activeCard.phase !== 'done' ? 'opacity-95' : 'opacity-0'}`}
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
              height: activeCard.phase === 'summon' ? `${activeCard.rect?.height}px` : '500px',
              transform: activeCard.phase === 'summon' ? 'none' : 'translate(-50%, -50%)',
              transition: 'all 0.8s cubic-bezier(0.16, 1, 0.3, 1)',
              perspective: '2000px'
            }}
          >
            <div 
              className="relative w-full h-full"
              style={{
                transformStyle: 'preserve-3d',
                transform: (activeCard.phase === 'flipped' || activeCard.phase === 'burning') ? 'rotateY(180deg)' : 'rotateY(0deg)',
                transition: 'transform 0.8s cubic-bezier(0.4, 0, 0.2, 1)'
              }}
            >
              {/* Front Face (Ofuda) */}
              <div 
                className="absolute inset-0 bg-black border-2 border-[#00fff7] flex flex-col items-center justify-center p-8 shadow-[0_0_60px_rgba(0,255,247,0.3)] overflow-hidden"
                style={{ backfaceVisibility: 'hidden', zIndex: 2 }}
              >
                <div className="absolute inset-0 halftone-bg opacity-20" />
                
                {/* Cinematic Sigil Presentation */}
                <div className="relative flex flex-col items-center gap-12">
                   <div className="w-[1px] h-12 bg-[#00fff7] opacity-40" />
                   <OfudaSigil size={200} color="#00fff7" />
                   <div className="w-[1px] h-12 bg-[#00fff7] opacity-40" />
                </div>

                {/* HUD Metadata Overlay */}
                <div className="absolute top-4 left-6 font-mono text-[8px] tracking-[0.4em] text-[#00fff7]/40 uppercase select-none">
                  // EXORCISM_VOID_PROTOCOL
                </div>
              </div>

              {/* Back Face (Revelation) */}
              <div 
                className={`absolute inset-0 bg-[#070707] border-2 border-[#00fff7] shadow-[0_0_80px_rgba(0,255,247,0.2),inset_0_0_40px_rgba(0,255,247,0.05)] overflow-hidden
                  ${activeCard.phase === 'burning' ? 'animate-ofuda-burn' : ''}`}
                style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)', zIndex: 1 }}
              >
                <div className="absolute inset-0 halftone-bg opacity-15" />
                <div className="absolute inset-0 bg-radial-gradient from-cyan-900/10 to-transparent" />
                
                {activeCard.phase === 'flipped' && (
                  <div className="relative z-10 w-full h-full flex items-center justify-center">
                    <CharacterInscription text={activeCard.fact} />
                  </div>
                )}

                {/* Burn Sequence Particles */}
                {activeCard.phase === 'burning' && (
                  <div className="absolute inset-0 pointer-events-none">
                    {Array.from({ length: 15 }).map((_, i) => (
                      <div key={i} className="absolute w-1 h-1 particle" style={{ 
                        backgroundColor: i % 2 === 0 ? '#00fff7' : '#ffffff',
                        left: '50%', top: '50%',
                        '--tx': `${(Math.random() - 0.5) * 400}px`,
                        '--ty': `${(Math.random() - 0.5) * 400}px`,
                        '--rot': `${Math.random() * 360}deg`
                      } as any} />
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
          0% { transform: translateX(110vw) translateY(5vh) rotateZ(5deg) scale(0.7); opacity: 0; }
          15% { opacity: 0.4; }
          50% { transform: translateX(0vw) translateY(0vh) rotateZ(0deg) scale(1.1); opacity: 0.6; }
          85% { opacity: 0.4; }
          100% { transform: translateX(-110vw) translateY(-5vh) rotateZ(-5deg) scale(0.7); opacity: 0; }
        }

        @keyframes pulse-glitch {
          0%, 100% { opacity: 0.7; transform: scale(1); filter: contrast(1); }
          48% { opacity: 0.8; transform: scale(1.03); filter: contrast(1.2) brightness(1.2); }
          50% { opacity: 0.4; transform: scale(0.98); filter: hue-rotate(90deg) invert(0.1); }
          52% { opacity: 0.9; transform: scale(1.05); filter: contrast(1.5) brightness(1.5); }
        }

        .animate-pulse-glitch {
          animation: pulse-glitch 5s infinite;
        }

        .animate-ofuda-burn {
          animation: final-flicker 0.1s step-end 6, burn-up 0.5s forwards cubic-bezier(0.4, 0, 0.2, 1);
          animation-delay: 0s, 0.4s;
        }

        @keyframes final-flicker {
          0%, 100% { border-color: #00fff7; box-shadow: 0 0 60px rgba(0,255,247,0.4); }
          50% { border-color: white; box-shadow: 0 0 100px white; filter: brightness(2); }
        }

        @keyframes burn-up {
          0% { clip-path: inset(0% 0% 0% 0%); filter: grayscale(0) brightness(1); }
          100% { clip-path: inset(0% 0% 100% 0%); filter: grayscale(1) brightness(0); }
        }

        .chromatic-aberration {
          text-shadow: 2px 0 0 rgba(255,0,0,0.4), -2px 0 0 rgba(0,255,255,0.4);
          animation: glitch-subtle 6s infinite;
        }

        @keyframes glitch-subtle {
          0%, 95%, 100% { transform: translate(0); text-shadow: 1px 0 0 rgba(255,0,0,0.3), -1px 0 0 rgba(0,255,255,0.3); }
          96% { transform: translate(-2px, 1px); text-shadow: 3px 0 0 rgba(255,0,0,0.5), -3px 0 0 rgba(0,255,255,0.5); }
          97% { transform: translate(2px, -1px); }
          98% { transform: translate(-1px, -1px); filter: contrast(1.5); }
        }

        .particle {
          animation: particle-scatter 0.8s forwards ease-out;
        }

        @keyframes particle-scatter {
          0% { transform: translate(-50%, -50%) rotate(0); opacity: 1; scale: 2; }
          100% { transform: translate(calc(-50% + var(--tx)), calc(-50% + var(--ty))) rotate(var(--rot)); opacity: 0; scale: 0; }
        }
      `}</style>
    </div>
  );
};

export default ExorcistsScroll;
