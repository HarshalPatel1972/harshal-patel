import React, { useMemo } from 'react';

const ExorcistsScroll: React.FC = () => {
  // Generate segments of the "Eternal Scroll"
  const segments = useMemo(() => {
    return Array.from({ length: 30 }).map((_, i) => ({
      id: i,
      hex: ["0xINIT", "0xMEM", "0xSYS", "0xEXEC", "0xVOID", "0xCORE"][i % 6],
      delay: i * -0.5
    }));
  }, []);

  return (
    <div className="absolute inset-0 flex items-center justify-center z-0 pointer-events-none overflow-hidden opacity-60">
      {/* ─── LAYER 1: THE ETERNAL PATH (3D RIBBON EFFECT) ─── */}
      <div className="relative w-full h-[600px] flex items-center justify-center translate-y-[-10%]">
        {segments.map((s) => (
          <div 
            key={s.id}
            className="absolute flex flex-col items-center justify-center"
            style={{
              animation: `scroll-flow 15s linear infinite`,
              animationDelay: `${s.delay}s`,
            }}
          >
            {/* The "Ofuda" (Talisman) Style Script */}
            <div className="ofuda-talisman relative w-12 md:w-20 h-32 md:h-48 border-2 border-[var(--accent-blood)] bg-black/80 flex flex-col items-center justify-between py-4 shadow-[0_0_15px_rgba(217,17,17,0.3)]">
               {/* Ancient logic script (represented by vertical bars/dots) */}
               <div className="flex flex-col gap-1">
                 {[1,2,3].map(j => <div key={j} className="w-1 h-3 bg-[var(--accent-blood)] opacity-50" />)}
               </div>
               
               {/* The Hex Code Seal */}
               <span className="font-mono text-[10px] md:text-xs font-black rotate-[-90deg] whitespace-nowrap text-[var(--accent-blood)] brightness-125">
                 {s.hex}
               </span>
               
               <div className="flex flex-col gap-1 items-center">
                 <div className="w-2 h-2 rounded-full border border-[var(--accent-blood)]" />
                 <div className="w-[1px] h-8 bg-[var(--accent-blood)] opacity-30" />
               </div>

               {/* "Purification" Flare (Center interaction) */}
               <div className="purify-flash absolute inset-0 bg-white opacity-0" />
            </div>
            
            {/* Connection String */}
            <div className="w-[1px] h-32 bg-[var(--accent-blood)] opacity-20" />
          </div>
        ))}
      </div>

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
            /* Center of the screen - The "Purified" State */
          }
          100% {
            transform: translateX(-100vw) translateY(-15vh) rotateZ(-15deg) scale(0.6);
            opacity: 0;
            filter: blur(4px) grayscale(1);
          }
        }

        /* Specific interaction when in the center - handled via CSS for performance */
        .ofuda-talisman {
          transition: all 0.5s ease;
        }
        
        /* The path makes it hard to use :hover or JS intersection cleanly at 60fps, 
           so we use the keyframes to define the "narrative" space. */
      `}</style>
      
      {/* Background Japanese Texture (Grain) */}
      <div className="absolute inset-0 halftone-bg opacity-10 pointer-events-none" />
    </div>
  );
};

export default ExorcistsScroll;
