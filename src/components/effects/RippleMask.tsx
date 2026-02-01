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

  // 💥 SPAWN RIPPLE ON STAGE CHANGE
  useEffect(() => {
    if (stage > 0 && stage <= 7 && viewport.w > 0) {
      
      // AREA CALCULATION:
      // We want to reveal ~1/7th of the screen per ripple.
      // Area = PI * r^2
      // TargetArea = (W * H) / 7
      // r = sqrt(TargetArea / PI)
      // * 1.2 Multiplier to account for some overlap and ensuring full coverage by end
      const totalArea = viewport.w * viewport.h;
      const targetArea = totalArea / 7;
      const calculatedRadius = Math.sqrt(targetArea / Math.PI) * 1.3; 

      const newRipple = {
        id: stage,
        // Random Position (Keep away from extreme edges to ensure meaningful reveal)
        x: Math.random() * (viewport.w * 0.8) + (viewport.w * 0.1), 
        y: Math.random() * (viewport.h * 0.8) + (viewport.h * 0.1),
        r: calculatedRadius 
      };

      setRipples((prev) => [...prev, newRipple]);
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
                animate={{ 
                  r: stage === 7 ? Math.max(viewport.w, viewport.h) * 1.5 : ripple.r // Stage 7: Total Washout
                }}
                transition={{ 
                  duration: stage === 7 ? 1.5 : 0.8, // Snappy tension break
                  ease: "circOut" 
                }}
                style={{
                    filter: "blur(20px)" // Liquid edges
                }}
              />
            ))}
          </AnimatePresence>
        </mask>
      </defs>
    </svg>
  );
}
