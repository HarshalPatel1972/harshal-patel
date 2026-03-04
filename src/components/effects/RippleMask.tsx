"use client";

import React, { useState, useEffect } from "react";
import { animate as anime } from "animejs";
import { useHandoff } from "@/lib/handoff-context";
import { useRef } from "react";

function Ripple({ ripple }: { ripple: any }) {
  const ref = useRef<SVGCircleElement>(null);
  
  useEffect(() => {
    if (ref.current) {
      anime(ref.current, {
        r: [0, ripple.r],
        duration: 1000,
        easing: 'easeOutCirc'
      });
    }
  }, [ripple.r]);

  return (
    <circle
      ref={ref}
      cx={ripple.x}
      cy={ripple.y}
      r={0}
      fill="black"
      style={{
          filter: "blur(30px)"
      }}
    />
  );
}

export default function RippleMask() {
  const { stage } = useHandoff();
  const [ripples, setRipples] = useState<{ id: number; x: number; y: number; r: number }[]>([]);
  const [viewport, setViewport] = useState({ w: 0, h: 0 });

  // 🛡️ PREVENT DUPLICATE SPAWNS ON RESIZE
  const processedRef = React.useRef<Set<number>>(new Set());
  
  // 📏 CALC VIEWPORT & RADIUS (DEBOUNCED)
  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    
    const updateMetrics = () => {
      setViewport({ w: window.innerWidth, h: window.innerHeight });
    };
    
    const debouncedUpdate = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(updateMetrics, 100);
    };
    
    updateMetrics(); // Init
    window.addEventListener("resize", debouncedUpdate);
    return () => {
      window.removeEventListener("resize", debouncedUpdate);
      clearTimeout(timeoutId);
    };
  }, []);

  // 💥 SPAWN RIPPLE CLUSTER ON STAGE CHANGE
  useEffect(() => {
    // Only spawn if valid stage AND not already processed for this stage
    if (stage > 0 && stage <= 7 && viewport.w > 0 && !processedRef.current.has(stage)) {
      
      processedRef.current.add(stage); // 🔒 Mark as processed

      const newRipples: { id: number; x: number; y: number; r: number }[] = [];
      const count = 5 + Math.floor(Math.random() * 4); // 5 to 8 ripples per stage

      for (let i = 0; i < count; i++) {
        const totalArea = viewport.w * viewport.h;
        const stageArea = totalArea / 7;
        const rippleArea = stageArea / count;
        
        const isMobileWidth = viewport.w < 768;
        const baseMult = isMobileWidth ? 1.5 : 2.5; 
        
        const multiplier = stage === 7 ? 4.0 : baseMult; 
        const baseRadius = Math.sqrt(rippleArea / Math.PI) * multiplier; 
        const variance = Math.random() * 0.6 + 0.8; 

        newRipples.push({
          id: Date.now() + i, 
          x: Math.random() * viewport.w,
          y: Math.random() * viewport.h,
          r: baseRadius * variance
        });
      }

      setRipples((prev) => [...prev, ...newRipples]);
    }
  }, [stage, viewport]);

  return (
    <div className="absolute inset-0 pointer-events-none z-0">
      <svg className="absolute w-full h-full top-0 left-0">
        <defs>
          <mask id="ripple-mask">
            {/* Base: White = Visible Preloader (Black Overlay) */}
            <rect x="0" y="0" width="100%" height="100%" fill="white" />
            
            {/* Holes: Black = Transparent (Revealing Page) */}
            {ripples.map((ripple) => (
              <Ripple key={ripple.id} ripple={ripple} />
            ))}
          </mask>
        </defs>
      </svg>
    </div>
  );
}
