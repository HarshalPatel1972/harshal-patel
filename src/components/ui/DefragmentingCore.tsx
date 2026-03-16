import React, { useMemo } from 'react';

const DefragmentingCore: React.FC = () => {
  // Generate 150 chaotic shards for more density
  const shards = useMemo(() => {
    return Array.from({ length: 150 }).map((_, i) => {
      const angle = Math.random() * Math.PI * 2;
      // Increased distance to cover much larger area of the viewport
      const distance = 150 + Math.random() * 850;
      const size = 6 + Math.random() * 24;
      const duration = 4 + Math.random() * 6;
      const delay = Math.random() * -12;
      
      // Random jagged triangle points
      const p1 = `${Math.random() * 100},${Math.random() * 100}`;
      const p2 = `${Math.random() * 100},${Math.random() * 100}`;
      const p3 = `${Math.random() * 100},${Math.random() * 100}`;
      
      return { angle, distance, size, duration, delay, points: `${p1} ${p2} ${p3}`, id: i };
    });
  }, []);

  return (
    <div className="absolute inset-0 flex items-center justify-center z-0 pointer-events-none overflow-hidden opacity-75">
      <svg viewBox="0 0 1000 1000" className="w-[140%] h-[140%] md:w-[120%] md:h-[120%]">
        <defs>
          <linearGradient id="shardGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="var(--accent-blood)" />
            <stop offset="100%" stopColor="#ff1a1a" />
          </linearGradient>
        </defs>

        {/* Chaotic Technical Debt Shards ONLY */}
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
                  from="1.2"
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
                  to="720"
                  dur={`${s.duration}s`}
                  begin={`${s.delay}s`}
                  repeatCount="indefinite"
                  additive="sum"
                />
                <animate
                  attributeName="opacity"
                  values="0;0.9;0"
                  dur={`${s.duration}s`}
                  begin={`${s.delay}s`}
                  repeatCount="indefinite"
                />
              </polygon>
            </g>
          ))}
        </g>
      </svg>
    </div>
  );
};

export default DefragmentingCore;
