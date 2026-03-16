import React from 'react';

const SystemExorcismSeal: React.FC = () => {
  return (
    <div className="absolute inset-0 flex items-center justify-center z-0 pointer-events-none opacity-45 overflow-hidden">
      <svg 
        viewBox="0 0 1000 1000" 
        className="w-[150%] h-[150%] md:w-[100%] md:h-[100%] animate-pulse-slow"
        style={{ filter: 'drop-shadow(0 0 30px rgba(217,17,17,0.4))' }}
      >
        <defs>
          <linearGradient id="sealGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="var(--accent-blood)" stopOpacity="0.8" />
            <stop offset="50%" stopColor="var(--accent-blood)" stopOpacity="0.4" />
            <stop offset="100%" stopColor="var(--accent-blood)" stopOpacity="0.8" />
          </linearGradient>
          
          <mask id="sealMask">
            <rect width="1000" height="1000" fill="white" />
            <circle cx="500" cy="500" r="150" fill="black" />
          </mask>
        </defs>

        <g className="origin-center animate-[spin_60s_linear_infinite]">
          {/* Outer Concentric Hexagons (Structure) */}
          {[1, 2, 3].map((i) => (
            <polygon
              key={`hex-${i}`}
              points="500,50 890,275 890,725 500,950 110,725 110,275"
              fill="none"
              stroke="var(--accent-blood)"
              strokeWidth={4 / i}
              strokeDasharray={i === 2 ? "10,20" : "none"}
              className="origin-center"
              style={{ transform: `scale(${0.3 + i * 0.22}) rotate(${i * 15}deg)` }}
            />
          ))}

          {/* Data Flow Rings (Technical Debt Exorcism) */}
          <circle cx="500" cy="500" r="420" fill="none" stroke="var(--accent-blood)" strokeWidth="1.5" strokeDasharray="1,15" />
          <circle cx="500" cy="500" r="410" fill="none" stroke="var(--accent-blood)" strokeWidth="4" strokeDasharray="100,50" />
          
          {/* Binary/Hex Bits orbiting the seal */}
          <g className="font-mono text-[10px] fill-[var(--accent-blood)] font-bold opacity-80">
            {Array.from({ length: 12 }).map((_, i) => {
              const angle = (i / 12) * Math.PI * 2;
              const x = 500 + Math.cos(angle) * 380;
              const y = 500 + Math.sin(angle) * 380;
              const hex = ['0xDEBT', '0xNULL', '0xMEM', '0xVOID', '0xSYS', '0xINIT'][i % 6];
              return (
                <text 
                  key={i} 
                  x={x} 
                  y={y} 
                  textAnchor="middle" 
                  transform={`rotate(${(angle * 180) / Math.PI + 90}, ${x}, ${y})`}
                >
                  {hex}
                </text>
              );
            })}
          </g>
        </g>

        {/* Counter-rotating inner seal (The Core Engine) */}
        <g className="origin-center animate-[spin_40s_linear_infinite_reverse]">
          <circle cx="500" cy="500" r="280" fill="none" stroke="var(--accent-blood)" strokeWidth="2" />
          <path 
            d="M500,220 L742,360 L742,640 L500,780 L258,640 L258,360 Z" 
            fill="none" 
            stroke="var(--accent-blood)" 
            strokeWidth="6" 
            strokeDasharray="5,10"
          />
          
          {/* The Inner "Logic" Grid */}
          <g opacity="0.5">
            {Array.from({ length: 10 }).map((_, i) => (
              <line 
                key={`v-${i}`} 
                x1={350 + i * 30} y1="350" x2={350 + i * 30} y2="650" 
                stroke="var(--accent-blood)" strokeWidth="1" 
              />
            ))}
            {Array.from({ length: 10 }).map((_, i) => (
              <line 
                key={`h-${i}`} 
                x1="350" y1={350 + i * 30} x2="650" y2={350 + i * 30} 
                stroke="var(--accent-blood)" strokeWidth="1" 
              />
            ))}
          </g>
        </g>

        {/* Static Central Totem (The Architect's Mark) */}
        <g stroke="var(--accent-blood)" strokeWidth="3" fill="none">
          <circle cx="500" cy="500" r="40" strokeWidth="6" />
          <path d="M500,430 L500,570 M430,500 L570,500" />
          <rect x="470" y="470" width="60" height="60" transform="rotate(45 500 500)" />
        </g>
      </svg>

      {/* Extreme background noise overlay to give it "ancient tech" texture */}
      <div className="absolute inset-0 halftone-bg opacity-20 mix-blend-overlay" />
    </div>
  );
};

export default SystemExorcismSeal;
