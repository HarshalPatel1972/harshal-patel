"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useHandoff } from "@/lib/handoff-context";

export default function RippleMask() {
  const { stage } = useHandoff();
  const [ripples, setRipples] = useState<{ id: number; x: number; y: number; r: number }[]>([]);
  const [viewport, setViewport] = useState({ w: 0, h: 0 });

  useEffect(() => {
    // 📏 CALC VIEWPORT & RADIUS
    const updateMetrics = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      setViewport({ w, h });
    };
    
    updateMetrics();
    window.addEventListener("resize", updateMetrics);
    return () => window.removeEventListener("resize", updateMetrics);
  }, []);

  // 💥 SPAWN RIPPLE CLUSTER ON STAGE CHANGE
  useEffect(() => {
    if (stage > 0 && stage <= 7 && viewport.w > 0) {
      
      const newRipples: { id: number; x: number; y: number; r: number }[] = [];
      const count = 5 + Math.floor(Math.random() * 4); // 5 to 8 ripples per stage

      for (let i = 0; i < count; i++) {
        // Area logic: Smaller circles since there are many
        // Total target area per stage: (W*H)/7. 
        // Per ripple: ((W*H)/7) / count.
        const totalArea = viewport.w * viewport.h;
        const stageArea = totalArea / 7;
        const rippleArea = stageArea / count;
        
        // Radius + Variance
        // 🌊 BOOST: 2.0x base multiplier to ensure better overlaps and faster clearing
        // Stage 7: "Tsunami Mode" - Massive ripples to clear everything
        const multiplier = stage === 7 ? 4.0 : 2.2; 
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
    <svg className="absolute w-full h-full pointer-events-none top-0 left-0">
      <defs>
        <mask id="ripple-mask">
          {/* Base: White = Visible Preloader (Black Overlay) */}
          <rect x="0" y="0" width="100%" height="100%" fill="white" />
          
          {/* Holes: Black = Transparent (Revealing Page) */}
          <AnimatePresence>
            {ripples.map((ripple) => (
              <motion.circle
                key={ripple.id}
                cx={ripple.x}
                cy={ripple.y}
                r={ripple.r}
                fill="black"
                initial={{ r: 0 }}
                animate={{ r: ripple.r }}
                transition={{ 
                  duration: 1.0, 
                  ease: "circOut" 
                }}
                style={{
                    filter: "blur(30px)" // 💧 Soften liquid edges even more
                }}
              />
            ))}
          </AnimatePresence>
        </mask>
      </defs>
    </svg>
  );
}
