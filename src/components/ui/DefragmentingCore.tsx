import React, { useMemo } from 'react';

const getSeededRandom = (seed: number) => {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
};

const DefragmentingCore: React.FC = () => {
  // Generate 150 chaotic shards for more density
  // ⚡ Bolt: Retained inside component using useMemo to preserve fresh random layouts
  // upon remount, which is intended visual behavior. Hoisting to module scope would
  // break this by freezing the randomness for the entire application lifecycle.
  // ⚡ Bolt: Moved array generation to useState initializers to satisfy React Hook
  // purity rules (avoiding Math.random inside render/useMemo) while maintaining
  // fresh random layouts upon remount.
  const [shards] = React.useState(() => {
    return Array.from({ length: 150 }).map((_, i) => {
      const r1 = getSeededRandom(i * 7 + 1);
      const r2 = getSeededRandom(i * 13 + 2);
      const r3 = getSeededRandom(i * 19 + 3);
      const r4 = getSeededRandom(i * 23 + 4);
      const r5 = getSeededRandom(i * 29 + 5);
      const r6 = getSeededRandom(i * 31 + 6);
      const r7 = getSeededRandom(i * 37 + 7);
      const r8 = getSeededRandom(i * 41 + 8);
      const r9 = getSeededRandom(i * 43 + 9);
      const r10 = getSeededRandom(i * 47 + 10);
      const r11 = getSeededRandom(i * 53 + 11);

      const angle = r1 * Math.PI * 2;
      const distance = 150 + r2 * 850;
      const size = 6 + r3 * 24;
      const duration = 4 + r4 * 6;
      const delay = r5 * -12;
      
      // Random jagged triangle points
      const p1 = `${r6 * 100},${r7 * 100}`;
      const p2 = `${r8 * 100},${r9 * 100}`;
      const p3 = `${r10 * 100},${r11 * 100}`;
      
      return { angle, distance, size, duration, delay, points: `${p1} ${p2} ${p3}`, id: i };
    });
  });

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
