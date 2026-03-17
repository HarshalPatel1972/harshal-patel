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

const OfudaSigil: React.FC<{ size?: number; color?: string; alternate?: boolean; opacity?: number }> = ({ size = 100, color = "#00fff7", alternate = false, opacity = 1 }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" className="filter drop-shadow-[0_0_15px_rgba(0,255,247,0.6)] animate-cursed-flow shrink-0" style={{ opacity }}>
    <defs>
      <radialGradient id="sigil-glow" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stopColor={color} stopOpacity="0.4" />
        <stop offset="100%" stopColor={color} stopOpacity="0" />
      </radialGradient>
    </defs>
    <circle cx="50" cy="50" r="45" fill="url(#sigil-glow)" className="animate-pulse" />
    
    {/* Geometric Outer Seal */}
    <rect x="15" y="15" width="70" height="70" stroke={color} strokeWidth="1" fill="none" transform="rotate(45 50 50)" />
    <rect x="20" y="20" width="60" height="60" stroke="var(--accent-blood)" strokeWidth="0.5" fill="none" transform="rotate(15 50 50)" />
    
    {/* Central Occult Character - Abstract JJK Style */}
    {alternate ? (
      <path d="M30 40 L70 40 M50 20 L50 80 M35 60 L65 60 M40 75 L60 75" stroke={color} strokeWidth="4" strokeLinecap="square" fill="none" />
    ) : (
      <g stroke={color} strokeWidth="3" strokeLinecap="round" fill="none">
        <path d="M40 30 L60 30 M50 30 L50 70 M35 70 L65 70" />
        <path d="M45 45 L55 55 M55 45 L45 55" stroke="var(--accent-blood)" strokeWidth="1.5" />
      </g>
    )}
    
    {/* Peripheral Void Marks */}
    <g className="opacity-80">
      <path d="M50 5 L50 15 M50 85 L50 95 M5 50 L15 50 M85 50 L95 50" stroke={color} strokeWidth="2" />
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
      }, i * 30 + Math.random() * 20);
    });
  }, [text]);

  return (
    <div className="w-full h-full p-10 flex flex-col items-start justify-center text-left relative overflow-hidden bg-black">
      {/* MAPPA CINEMATIC LAYERING */}
      <div className="absolute inset-0 halftone-bg opacity-20 pointer-events-none" />
      <div className="absolute top-0 right-0 w-[200%] h-[1px] bg-gradient-to-r from-transparent via-[#00fff7]/20 to-transparent rotate-[-45deg] translate-y-[200px]" />
      
      {/* HUD Label */}
      <div className="absolute top-6 left-10 flex items-center gap-3">
        <div className="w-1 h-3 bg-[var(--accent-blood)]" />
        <span className="font-mono text-[9px] tracking-[0.4em] text-white/40 uppercase">EXORCISM_LOG_PROTOCOL_06</span>
      </div>

      <div className="text-white font-mono text-lg md:text-2xl leading-[1.6] font-normal tracking-tight text-left chromatic-aberration relative z-10" style={{ color: '#ffffff !important' }}>
        {chars.map((item, i) => (
          <span key={i} className="transition-opacity duration-300" style={{ opacity: item.visible ? 1 : 0 }}>
            {item.char}
          </span>
        ))}
      </div>
      
      {/* Bottom Aesthetic Accent */}
      <div className="absolute bottom-6 right-10 opacity-30">
        <div className="flex flex-col items-end gap-1">
          <div className="w-12 h-[1px] bg-[#00fff7]" />
          <div className="w-6 h-[1px] bg-[#00fff7]" />
        </div>
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
    
    setTimeout(() => setActiveCard(prev => prev ? { ...prev, phase: 'flying' } : null), 50);
    setTimeout(() => setActiveCard(prev => prev ? { ...prev, phase: 'flipped' } : null), 600); 
  };

  const handleDismiss = () => {
    if (!activeCard || activeCard.phase === 'burning' || activeCard.phase === 'done') return;
    setActiveCard(prev => prev ? { ...prev, phase: 'burning' } : null);
    setTimeout(() => setActiveCard(prev => prev ? { ...prev, phase: 'done' } : null), 800);
    setTimeout(() => setActiveCard(null), 1000);
  };

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') handleDismiss();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [activeCard]);

  const segments = useMemo(() => {
    return Array.from({ length: 28 }).map((_, i) => ({
      id: i,
      delay: i * -0.6
    }));
  }, []);

  return (
    <div ref={containerRef} className="absolute inset-0 flex items-center justify-center z-0 pointer-events-none overflow-hidden opacity-100">
      
      {/* ─── SCROLL PATH ─── */}
      <div className="relative w-full h-[600px] flex items-center justify-center translate-y-[-5%] pointer-events-none">
        {segments.map((s) => {
          return (
            <div 
              key={s.id}
              className="absolute flex flex-col items-center justify-center pointer-events-none group"
              style={{
                animation: `scroll-flow 20s linear infinite`,
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
                className="ofuda-talisman pointer-events-auto relative w-12 md:w-24 h-36 md:h-56 border-2 flex flex-col items-center justify-center transition-all duration-500 outline-none bg-black border-[var(--accent-blood)] hover:border-[#00fff7] shadow-[0_0_15px_rgba(185,28,28,0.2)] hover:shadow-[0_0_30px_rgba(0,255,247,0.5)] cursor-pointer group-hover:scale-110 active:scale-95 overflow-hidden"
              >
                {/* HIGH VISIBILITY ACCENTS */}
                <div className="absolute inset-0 bg-gradient-to-t from-[var(--accent-blood)]/10 to-transparent pointer-events-none" />
                <div className="absolute inset-0 border-[1px] border-white/5 m-1 pointer-events-none" />
                
                {/* SIGIL */}
                <OfudaSigil size={60} color="var(--accent-blood)" opacity={0.9} />
                
                {/* STAMP AESTHETIC */}
                <div className="absolute bottom-2 right-2 w-4 h-4 border border-[var(--accent-blood)]/30 flex items-center justify-center">
                  <div className="w-1.5 h-1.5 bg-[var(--accent-blood)]/20" />
                </div>
              </button>
              
              {/* String / Connection */}
              <div className="w-[2px] h-32 bg-gradient-to-b from-[var(--accent-blood)] to-transparent opacity-20" />
            </div>
          );
        })}
      </div>

      {/* ─── REVELATION PORTAL ─── */}
      {mounted && activeCard && createPortal(
        <div className="fixed inset-0" style={{ zIndex: 9998, pointerEvents: 'auto' }}>
          {/* Overlay - Deeper and more clinical */}
          <div 
            className={`fixed inset-0 transition-opacity duration-700 cursor-default
              ${activeCard.phase !== 'summon' && activeCard.phase !== 'done' ? 'opacity-98' : 'opacity-0'}`}
            style={{ backgroundColor: '#000000', zIndex: 9998 }}
            onClick={handleDismiss}
          />

          <div 
            className="fixed"
            style={{
              zIndex: 9999,
              top: activeCard.phase === 'summon' ? `${activeCard.rect?.top}px` : '50%',
              left: activeCard.phase === 'summon' ? `${activeCard.rect?.left}px` : '50%',
              width: activeCard.phase === 'summon' ? `${activeCard.rect?.width}px` : '360px',
              height: activeCard.phase === 'summon' ? `${activeCard.rect?.height}px` : '540px',
              transform: activeCard.phase === 'summon' ? 'none' : 'translate(-50%, -50%)',
              transition: 'all 0.8s cubic-bezier(0.2, 1, 0.2, 1)',
              perspective: '2000px'
            }}
          >
            <div 
              className="relative w-full h-full"
              style={{
                transformStyle: 'preserve-3d',
                transform: (activeCard.phase === 'flipped' || activeCard.phase === 'burning') ? 'rotateY(180deg)' : 'rotateY(0deg)',
                transition: 'transform 0.8s cubic-bezier(0.6, 0.05, 0.2, 1)'
              }}
            >
              {/* Front Face (Talisman) */}
              <div 
                className="absolute inset-0 bg-black border-[3px] border-[#00fff7] flex flex-col items-center justify-center p-8 shadow-[0_0_100px_rgba(0,255,247,0.4)] overflow-hidden"
                style={{ backfaceVisibility: 'hidden', zIndex: 2 }}
              >
                <div className="absolute inset-0 halftone-bg opacity-30" />
                <div className="absolute inset-0 bg-gradient-to-b from-cyan-500/5 to-transparent" />
                
                <div className="relative flex flex-col items-center gap-16">
                   <div className="w-[2px] h-16 bg-[#00fff7] opacity-60 shadow-[0_0_15px_#00fff7]" />
                   <OfudaSigil size={240} color="#00fff7" alternate />
                   <div className="w-[2px] h-16 bg-[#00fff7] opacity-60 shadow-[0_0_15px_#00fff7]" />
                </div>
              </div>

              {/* Back Face (Revelation) */}
              <div 
                className={`absolute inset-0 bg-black border-[3px] border-[#00fff7] shadow-[0_0_120px_rgba(0,255,247,0.3),inset_0_0_50px_rgba(0,255,247,0.1)] overflow-hidden
                  ${activeCard.phase === 'burning' ? 'animate-ofuda-burn' : ''}`}
                style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)', zIndex: 1 }}
              >
                {activeCard.phase === 'flipped' && (
                  <CharacterInscription text={activeCard.fact} />
                )}

                {/* VISCERAL PARTICLE SYSTEM */}
                {activeCard.phase === 'burning' && (
                  <div className="absolute inset-0 pointer-events-none">
                    {Array.from({ length: 24 }).map((_, i) => (
                      <div key={i} className="absolute w-1.5 h-1.5 particle-cinematic" style={{ 
                        backgroundColor: i % 3 === 0 ? '#00fff7' : i % 3 === 1 ? 'var(--accent-blood)' : '#ffffff',
                        left: '50%', top: '50%',
                        '--tx': `${(Math.random() - 0.5) * 500}px`,
                        '--ty': `${(Math.random() - 0.5) * 500}px`,
                        '--rot': `${Math.random() * 720}deg`,
                        '--scale': Math.random() * 2 + 1
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
          0% { transform: translateX(110vw) translateY(5vh) rotateZ(8deg) scale(0.8); opacity: 0; filter: blur(4px); }
          15% { opacity: 0.9; filter: blur(0px); }
          50% { transform: translateX(0vw) translateY(0vh) rotateZ(0deg) scale(1.15); opacity: 1; filter: drop-shadow(0 0 15px rgba(217,17,17,0.3)); }
          85% { opacity: 0.9; filter: blur(0px); }
          100% { transform: translateX(-110vw) translateY(-5vh) rotateZ(-8deg) scale(0.8); opacity: 0; filter: blur(4px); }
        }

        @keyframes cursed-flow {
          0%, 100% { filter: drop-shadow(0 0 10px rgba(0,255,247,0.4)) contrast(1); }
          50% { filter: drop-shadow(0 0 25px rgba(0,255,247,0.8)) contrast(1.4); transform: scale(1.02); }
        }

        .animate-cursed-flow {
          animation: cursed-flow 4s ease-in-out infinite;
        }

        .animate-ofuda-burn {
          animation: hyper-flicker 0.15s step-end 4, cinematic-dissolve 0.6s forwards ease-out;
          animation-delay: 0s, 0.4s;
        }

        @keyframes hyper-flicker {
          0%, 100% { border-color: #00fff7; opacity: 1; filter: brightness(1) drop-shadow(0 0 50px #00fff7); }
          50% { border-color: white; opacity: 0.5; filter: brightness(3) drop-shadow(0 0 100px white); }
        }

        @keyframes cinematic-dissolve {
          0% { clip-path: polygon(0 0, 100% 0, 100% 100%, 0 100%); opacity: 1; transform: scale(1) rotateY(180deg); }
          100% { clip-path: polygon(10% 20%, 90% 10%, 80% 90%, 20% 80%); opacity: 0; transform: scale(0.8) translateY(-50px) rotateY(200deg); filter: blur(20px); }
        }

        .chromatic-aberration {
          text-shadow: 2px 1px 0 rgba(255,0,0,0.5), -2px -1px 0 rgba(0,255,255,0.5);
          animation: jjk-glitch 8s infinite;
        }

        @keyframes jjk-glitch {
          0%, 94%, 98%, 100% { transform: translate(0); filter: blur(0); }
          95% { transform: translate(-3px, 2px); filter: contrast(2) brightness(1.5); }
          96% { transform: translate(3px, -2px); filter: blur(1px); }
          97% { transform: translate(-1px, 1px); }
        }

        .particle-cinematic {
          animation: scatter-vibrant 1s forwards cubic-bezier(0.19, 1, 0.22, 1);
        }

        @keyframes scatter-vibrant {
          0% { transform: translate(-50%, -50%) rotate(0) scale(var(--scale)); opacity: 1; filter: brightness(2) blur(0px); }
          100% { transform: translate(calc(-50% + var(--tx)), calc(-50% + var(--ty))) rotate(var(--rot)) scale(0); opacity: 0; filter: blur(8px); }
        }
      `}</style>
    </div>
  );
};

export default ExorcistsScroll;
