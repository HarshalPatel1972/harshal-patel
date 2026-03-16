import React, { useMemo } from 'react';

const DefragmentingCore: React.FC = () => {
  // Generate 80 chaotic shards
  const shards = useMemo(() => {
    return Array.from({ length: 80 }).map((_, i) => {
      const angle = Math.random() * Math.PI * 2;
      const distance = 350 + Math.random() * 250;
      const size = 5 + Math.random() * 20;
      const duration = 3 + Math.random() * 5;
      const delay = Math.random() * -10;
      
      // Random jagged triangle points
      const p1 = `${Math.random() * 100},${Math.random() * 100}`;
      const p2 = `${Math.random() * 100},${Math.random() * 100}`;
      const p3 = `${Math.random() * 100},${Math.random() * 100}`;
      
      return { angle, distance, size, duration, delay, points: `${p1} ${p2} ${p3}`, id: i };
    });
  }, []);

  return (
    <div className="absolute inset-0 flex items-center justify-center z-0 pointer-events-none overflow-hidden opacity-60">
      <svg viewBox="0 0 1000 1000" className="w-[120%] h-[120%] md:w-full md:h-full">
        <defs>
          <filter id="coreGlow">
            <feGaussianBlur stdDeviation="15" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
          
          <linearGradient id="shardGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="var(--accent-blood)" />
            <stop offset="100%" stopColor="#ff4d4d" />
          </linearGradient>
        </defs>

        {/* The Central High-Performance Core */}
        <g className="origin-center animate-[pulse_4s_ease-in-out_infinite]">
          {/* Outer Ring */}
          <rect 
            x="400" y="400" width="200" height="200" 
            fill="none" 
            stroke="var(--text-bone)" 
            strokeWidth="2" 
            className="opacity-20"
            transform="rotate(45 500 500)"
          />
          
          {/* Main Core Box */}
          <rect 
            x="425" y="425" width="150" height="150" 
            fill="none" 
            stroke="var(--text-bone)" 
            strokeWidth="8" 
            filter="url(#coreGlow)"
          >
            <animate attributeName="stroke-width" values="6;10;6" dur="3s" repeatCount="indefinite" />
          </rect>

          {/* Inner Grid (Perfect Alignment) */}
          <g className="opacity-40">
            {Array.from({ length: 6 }).map((_, i) => (
              <React.Fragment key={i}>
                <line x1={425 + i * 30} y1="425" x2={425 + i * 30} y2="575" stroke="var(--text-bone)" strokeWidth="1" />
                <line x1="425" y1={425 + i * 30} x2="575" y2={425 + i * 30} stroke="var(--text-bone)" strokeWidth="1" />
              </React.Fragment>
            ))}
          </g>
        </g>

        {/* Chaotic Technical Debt Shards being pulled in */}
        <g>
          {shards.map((s) => (
            <g key={s.id} className="origin-center">
              <polygon
                points={s.points}
                fill="url(#shardGradient)"
                className="opacity-0"
              >
                <animateTransform
                  attributeName="transform"
                  type="translate"
                  from={`${500 + Math.cos(s.angle) * s.distance} ${500 + Math.sin(s.angle) * s.distance}`}
                  to="500 500"
                  dur={`${s.duration}s`}
                  begin={`${s.delay}s`}
                  repeatCount="indefinite"
                />
                <animateTransform
                  attributeName="transform"
                  type="scale"
                  from="1"
                  to="0.1"
                  dur={`${s.duration}s`}
                  begin={`${s.delay}s`}
                  repeatCount="indefinite"
                  additive="sum"
                />
                <animateTransform
                  attributeName="transform"
                  type="rotate"
                  from="0"
                  to="360"
                  dur={`${s.duration}s`}
                  begin={`${s.delay}s`}
                  repeatCount="indefinite"
                  additive="sum"
                />
                <animate
                  attributeName="opacity"
                  values="0;0.8;0"
                  dur={`${s.duration}s`}
                  begin={`${s.delay}s`}
                  repeatCount="indefinite"
                />
              </polygon>
            </g>
          ))}
        </g>

        {/* Convergence Lines (Structural Grid) */}
        <g stroke="var(--text-bone)" strokeWidth="0.5" opacity="0.1">
          {Array.from({ length: 12 }).map((_, i) => {
            const angle = (i / 12) * Math.PI * 2;
            return (
              <line 
                key={i}
                x1={500 + Math.cos(angle) * 150} 
                y1={500 + Math.sin(angle) * 150} 
                x2={500 + Math.cos(angle) * 800} 
                y2={500 + Math.sin(angle) * 800} 
              />
            );
          })}
        </g>
      </svg>

      {/* Distortion / Heat haze center */}
      <div className="absolute w-[300px] h-[300px] rounded-full bg-white/5 blur-[80px]" />
    </div>
  );
};

export default DefragmentingCore;
