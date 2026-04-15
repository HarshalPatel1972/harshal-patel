import React, { useMemo, useState, useEffect } from 'react';

const SystemHeartbeat: React.FC = () => {
  const [isOverlayActive, setIsOverlayActive] = useState(false);

  useEffect(() => {
    const checkOverlay = () => {
      setIsOverlayActive(document.documentElement.classList.contains('is-overlay-active'));
    };
    
    // Initial check
    checkOverlay();

    // Observe class changes on root
    const observer = new MutationObserver(checkOverlay);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    
    return () => observer.disconnect();
  }, []);

  // Generate background "Nerve Network" lines
  const nerves = useMemo(() => {
    return Array.from({ length: 15 }).map((_, i) => ({
      x1: Math.random() * 1000,
      y1: Math.random() * 1000,
      x2: Math.random() * 1000,
      y2: Math.random() * 1000,
      duration: 5 + Math.random() * 5,
      delay: Math.random() * -5
    }));
  }, []);

  return (
    <div className="absolute inset-0 flex items-center justify-center z-0 pointer-events-none overflow-hidden">
      {/* ─── LAYER 1: THE NERVE NETWORK (BIO-TECH CHAOS) ─── */}
      <svg viewBox="0 0 1000 1000" className="absolute inset-0 w-full h-full opacity-30">
        <defs>
          <filter id="nerveGlow">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>
        
        {/* Chaotic background nerves (Red) */}
        {nerves.map((n, i) => (
          <path
            key={i}
            d={`M${n.x1},${n.y1} Q${(n.x1+n.x2)/2 + 50},${(n.y1+n.y2)/2 - 50} ${n.x2},${n.y2}`}
            fill="none"
            stroke="var(--accent-blood)"
            strokeWidth="1"
            filter="url(#nerveGlow)"
            className="opacity-40"
          >
            {!isOverlayActive && (
              <animate attributeName="stroke-dasharray" values="0,1000;1000,0;0,1000" dur={`${n.duration}s`} repeatCount="indefinite" begin={`${n.delay}s`} />
            )}
          </path>
        ))}

        {/* The Underlying Blueprint Grid (White - only visible during pulse) */}
        <g className="opacity-10">
          {Array.from({ length: 20 }).map((_, i) => (
            <React.Fragment key={i}>
              <line x1={i * 50} y1="0" x2={i * 50} y2="1000" stroke="white" strokeWidth="0.5" />
              <line x1="0" y1={i * 50} x2="1000" y2={i * 50} stroke="white" strokeWidth="0.5" />
            </React.Fragment>
          ))}
        </g>
      </svg>

      {/* ─── LAYER 2: THE HEARTBEAT RIPPLE (PURIFICATION WAVE) ─── */}
      <div className="absolute inset-0 flex items-center justify-center">
        {/* Three concentric shockwaves */}
        {!isOverlayActive && [0, 1, 2].map((i) => (
          <div 
            key={i}
            className="absolute border-[4px] border-white rounded-full opacity-0"
            style={{
              animation: `heartbeat-ripple 3s cubic-bezier(0, 0, 0.2, 1) infinite`,
              animationDelay: `${i * 0.8}s`
            }}
          />
        ))}
      </div>

      {/* ─── LAYER 3: THE CPU CORE (VITAL ORGAN) ─── */}
      <div className="relative group">
        <div className="absolute inset-0 bg-[var(--accent-blood)] blur-[40px] opacity-40 animate-pulse" />
        
        {/* Brutalist Central Core */}
        <div className="relative w-32 h-32 md:w-48 md:h-48 flex items-center justify-center animate-[heartbeat_2s_ease-in-out_infinite]">
          {/* Main Block */}
          <div className="absolute inset-0 border-4 border-white bg-black transform rotate-45 flex items-center justify-center overflow-hidden">
             <div className="w-full h-full halftone-bg opacity-30" />
             {/* Core "Data" lines */}
             <div className="absolute w-[200%] h-[1px] bg-white opacity-40 rotate-45 translate-y-4" />
             <div className="absolute w-[200%] h-[1px] bg-white opacity-40 rotate-45 -translate-y-8" />
          </div>
          
          {/* Small satellite blocks */}
          <div className="absolute top-[-20px] left-[-20px] w-6 h-6 border-2 border-[var(--accent-blood)] bg-black rotate-12" />
          <div className="absolute bottom-[-15px] right-[-15px] w-8 h-8 border-2 border-white bg-black -rotate-12" />
          
          {/* The Inner Pulse */}
          <div className="w-4 h-4 rounded-full bg-[var(--accent-blood)] shadow-[0_0_20px_var(--accent-blood)]" />
        </div>
      </div>

      <style>{`
        @keyframes heartbeat {
          0%, 100% { transform: scale(1); filter: brightness(1); }
          5% { transform: scale(1.15); filter: brightness(1.5); }
          15% { transform: scale(1); filter: brightness(1.2); }
          20% { transform: scale(1.1); filter: brightness(1.4); }
          35% { transform: scale(1); filter: brightness(1); }
        }

        @keyframes heartbeat-ripple {
          0% { width: 0; height: 0; opacity: 0.8; border-width: 8px; }
          10% { opacity: 0.6; }
          100% { width: 250%; height: 250%; opacity: 0; border-width: 1px; }
        }
      `}</style>
    </div>
  );
};

export default SystemHeartbeat;
