import React, { useMemo, useState } from 'react';

const FACTS = [
  "SOLVED 300+ ALGORITHMS",
  "SYSTEMS ARCHITECT",
  "GO / RUST ENTHUSIAST",
  "DEBT EXORCIST",
  "SUB-200MS OPTIMIZER",
  "AIML SPECIALIST",
  "CINEMATIC CODER",
  "BRUTALIST DESIGNER",
  "CHANDIGARH UNIV ALUMNI",
  "OPEN SOURCE LOVER",
  "LATENCY KILLER",
  "MEMORY SAFE",
  "GOJO FAN (STRENGTH)",
  "VOID CONSTRUCTER",
  "DATA BREATHING"
];

const ExorcistsScroll: React.FC = () => {
  const [activeFactId, setActiveFactId] = useState<number | null>(null);

  // Generate segments of the "Eternal Scroll"
  const segments = useMemo(() => {
    return Array.from({ length: 30 }).map((_, i) => ({
      id: i,
      hex: ["0xINIT", "0xMEM", "0xSYS", "0xEXEC", "0xVOID", "0xCORE"][i % 6],
      delay: i * -0.5,
      fact: FACTS[i % FACTS.length]
    }));
  }, []);

  return (
    <div className="absolute inset-0 flex items-center justify-center z-10 overflow-hidden opacity-60">
      {/* ─── LAYER 1: THE ETERNAL PATH (3D RIBBON EFFECT) ─── */}
      <div className="relative w-full h-[600px] flex items-center justify-center translate-y-[-10%]">
        {segments.map((s) => {
          const isActive = activeFactId === s.id;
          return (
            <div 
              key={s.id}
              className={`absolute flex flex-col items-center justify-center transition-opacity duration-300 ${activeFactId !== null && !isActive ? 'opacity-20' : 'opacity-100'}`}
              style={{
                animation: isActive ? 'none' : `scroll-flow 15s linear infinite`,
                animationDelay: `${s.delay}s`,
                zIndex: isActive ? 100 : 1
              }}
            >
              {/* The "Ofuda" (Talisman) Style Script */}
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  setActiveFactId(isActive ? null : s.id);
                }}
                className={`ofuda-talisman relative group w-14 md:w-20 h-40 md:h-56 border-2 flex flex-col items-center justify-between py-4 shadow-2xl transition-all duration-500 cursor-pointer outline-none
                  ${isActive 
                    ? 'scale-150 border-white bg-[var(--accent-blood)] shadow-[0_0_30px_rgba(255,255,255,0.4)]' 
                    : 'border-[var(--accent-blood)] bg-black/80 hover:border-white/40'}`}
              >
                 {/* Ancient logic script (represented by vertical bars/dots) */}
                 <div className="flex flex-col gap-1">
                   {[1,2,3].map(j => <div key={j} className={`w-1 h-3 transition-colors ${isActive ? 'bg-white' : 'bg-[var(--accent-blood)] opacity-50'}`} />)}
                 </div>
                 
                 {/* The Hex Code Seal or Fact */}
                 <div className={`transition-all duration-500 flex items-center justify-center ${isActive ? 'scale-110' : ''}`}>
                   <span className={`font-mono font-black rotate-[-90deg] whitespace-nowrap uppercase tracking-tighter
                     ${isActive 
                       ? 'text-[10px] md:text-[11px] text-white leading-none' 
                       : 'text-[9px] md:text-xs text-[var(--accent-blood)] brightness-125'}`}
                   >
                     {isActive ? s.fact : s.hex}
                   </span>
                 </div>
                 
                 <div className="flex flex-col gap-1 items-center">
                   <div className={`w-2 h-2 rounded-full border transition-colors ${isActive ? 'border-white' : 'border-[var(--accent-blood)]'}`} />
                   <div className={`w-[1px] h-8 transition-colors ${isActive ? 'bg-white' : 'bg-[var(--accent-blood)] opacity-30'}`} />
                 </div>

                 {/* "Purification" Flare (Center interaction) */}
                 <div className={`purify-flash absolute inset-0 bg-white transition-opacity duration-300 ${isActive ? 'opacity-10' : 'opacity-0'}`} />
              </button>
              
              {/* Connection String */}
              {!isActive && <div className="w-[1px] h-32 bg-[var(--accent-blood)] opacity-20" />}
            </div>
          );
        })}
      </div>

      {/* Close trigger to reset state when clicking background */}
      {activeFactId !== null && (
        <div 
          className="absolute inset-0 z-[50] cursor-zoom-out" 
          onClick={() => setActiveFactId(null)}
        />
      )}

      {/* ─── LAYER 2: THE CLEANSING LIGHT (VIEWPORT CENTER) ─── */}
      <div className="absolute left-1/2 -translate-x-1/2 top-0 bottom-0 w-[300px] pointer-events-none">
         {/* Vertical light beam that "white-outs" the scroll as it passes */}
         <div className="absolute inset-0 bg-white/[0.03] blur-[100px]" />
         <div className="absolute left-1/2 -translate-x-1/2 top-0 bottom-0 w-[2px] bg-[var(--accent-blood)] opacity-20" />
      </div>

      <style>{`
        @keyframes scroll-flow {
          0% {
            transform: translateX(100vw) translateY(15vh) rotateZ(15deg) scale(0.6);
            opacity: 0;
            filter: blur(4px) grayscale(1);
          }
          45%, 55% {
            opacity: 1;
            filter: blur(0px) grayscale(0);
          }
          50% {
            transform: translateX(0vw) translateY(0vh) rotateZ(0deg) scale(1.1);
          }
          100% {
            transform: translateX(-100vw) translateY(-15vh) rotateZ(-15deg) scale(0.6);
            opacity: 0;
            filter: blur(4px) grayscale(1);
          }
        }

        .ofuda-talisman {
          transition: all 0.5s cubic-bezier(0.23, 1, 0.32, 1);
        }
      `}</style>
      
      {/* Background Japanese Texture (Grain) */}
      <div className="absolute inset-0 halftone-bg opacity-10 pointer-events-none" />
    </div>
  );
};

export default ExorcistsScroll;
