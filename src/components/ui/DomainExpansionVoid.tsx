import React, { useMemo } from 'react';

const DomainExpansionVoid: React.FC = () => {
  // Generate random shards for the "shattered reality" effect
  const shards = useMemo(() => {
    return Array.from({ length: 40 }).map((_, i) => {
      const angle = (i / 40) * Math.PI * 2;
      const x1 = 500 + Math.cos(angle) * 200;
      const y1 = 500 + Math.sin(angle) * 200;
      const x2 = 500 + Math.cos(angle + 0.3) * 600;
      const y2 = 500 + Math.sin(angle + 0.3) * 600;
      const x3 = 500 + Math.cos(angle - 0.3) * 600;
      const y3 = 500 + Math.sin(angle - 0.3) * 600;
      
      return { 
        points: `${x1},${y1} ${x2},${y2} ${x3},${y3}`,
        delay: Math.random() * 5,
        duration: 3 + Math.random() * 4
      };
    });
  }, []);

  return (
    <div className="absolute inset-0 flex items-center justify-center z-0 pointer-events-none overflow-hidden">
      {/* ─── LAYER 1: THE CHAOTIC EXTERIOR (TECHNICAL DEBT) ─── */}
      <div className="absolute inset-0 bg-[var(--color-bg)]">
        <div className="absolute inset-0 opacity-20 flex flex-wrap gap-4 p-8 overflow-hidden font-mono text-[10px] text-[var(--accent-blood)] select-none">
          {Array.from({ length: 100 }).map((_, i) => (
            <span key={i} className="animate-pulse" style={{ animationDelay: `${Math.random() * 2}s` }}>
              {["0xDEBT", "FATAL_ERR", "NULL_PTR", "MEM_LEAK", "DEPRECATED"][i % 5]}
            </span>
          ))}
        </div>
      </div>

      {/* ─── LAYER 2: THE SHATTERED GLASS (REALITY BREAKING) ─── */}
      <svg viewBox="0 0 1000 1000" className="absolute inset-0 w-full h-full">
        <g mask="url(#domainMask)">
           {/* Dark Shards */}
           {shards.map((s, i) => (
             <polygon
               key={i}
               points={s.points}
               fill="var(--color-bg)"
               stroke="#1a1a1a"
               strokeWidth="0.5"
             >
               <animate
                 attributeName="opacity"
                 values="0.8;0.9;0.8"
                 dur={`${s.duration}s`}
                 repeatCount="indefinite"
               />
             </polygon>
           ))}
        </g>

        <defs>
          <radialGradient id="eyeGlow" cx="500" cy="500" r="500" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#E8E8E6" stopOpacity="0.15" />
            <stop offset="60%" stopColor="#E8E8E6" stopOpacity="0.05" />
            <stop offset="100%" stopColor="var(--color-bg)" stopOpacity="0" />
          </radialGradient>

          <mask id="domainMask">
            <rect width="1000" height="1000" fill="white" />
            <circle cx="500" cy="500" r="280" fill="black" />
          </mask>
        </defs>

        {/* ─── LAYER 3: THE DOMAIN (PERFECT ARCHITECTURE) ─── */}
        <g>
          {/* Outer Domain Boundary (Cursed Energy Ring) */}
          <circle 
            cx="500" cy="500" r="280" 
            fill="none" 
            stroke="var(--text-bone)" 
            strokeWidth="2" 
            className="opacity-60"
          >
            <animate attributeName="r" values="278;282;278" dur="4s" repeatCount="indefinite" />
          </circle>
          
          <circle 
            cx="500" cy="500" r="285" 
            fill="none" 
            stroke="var(--text-bone)" 
            strokeWidth="0.5" 
            strokeDasharray="4,8"
            className="opacity-30 animate-spin-slow" 
          />

          {/* Central Eye / Lens of Clarity */}
          <circle cx="500" cy="500" r="280" fill="url(#eyeGlow)" />
          
          {/* Architectural Blueprint (Inside Domain) */}
          <g clipPath="url(#domainCircleClip)">
            <g className="opacity-20">
              {Array.from({ length: 20 }).map((_, i) => (
                <React.Fragment key={i}>
                  <line x1={220 + i * 30} y1="0" x2={220 + i * 30} y2="1000" stroke="white" strokeWidth="0.5" />
                  <line x1="0" y1={220 + i * 30} x2="1000" y2={220 + i * 30} stroke="white" strokeWidth="0.5" />
                </React.Fragment>
              ))}
            </g>
            
            {/* The Totem of High-Performance */}
            <g transform="translate(500, 500) scale(1.2)" className="opacity-80">
              <rect x="-40" y="-40" width="80" height="80" fill="none" stroke="white" strokeWidth="4" />
              <rect x="-30" y="-30" width="60" height="60" fill="none" stroke="white" strokeWidth="1" transform="rotate(45)" />
              <circle cx="0" cy="0" r="10" fill="var(--accent-blood)" className="animate-pulse" />
              
              {/* Spinning Logic Rings */}
              <circle cx="0" cy="0" r="60" fill="none" stroke="white" strokeWidth="0.5" strokeDasharray="10,20" className="animate-[spin_10s_linear_infinite]" />
              <circle cx="0" cy="0" r="75" fill="none" stroke="white" strokeWidth="0.5" strokeDasharray="2,5" className="animate-[spin_15s_linear_infinite_reverse]" />
            </g>
          </g>

          <defs>
            <clipPath id="domainCircleClip">
              <circle cx="500" cy="500" r="280" />
            </clipPath>
          </defs>
        </g>
      </svg>

      {/* Cinematic Fog / Mappa Smoke */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 w-full h-1/3 bg-gradient-to-b from-[var(--color-bg)] to-transparent opacity-90" />
        <div className="absolute bottom-0 w-full h-1/3 bg-gradient-to-t from-[var(--color-bg)] to-transparent opacity-90" />
      </div>

      {/* Lens Flare effect for the Eye */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-white/[0.03] blur-[120px]" />
    </div>
  );
};

export default DomainExpansionVoid;
