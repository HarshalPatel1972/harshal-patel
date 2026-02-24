"use client";

<<<<<<< HEAD
import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
=======
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
>>>>>>> origin/main
import { useHandoff } from "@/lib/handoff-context";
import { BLOB_PATHS } from "@/components/effects/BlobAssets";

export default function BubbleMask() {
  const { stage } = useHandoff();
  const [bubbles, setBubbles] = useState<{ id: string; path: string; x: number; y: number; scale: number; rotate: number }[]>([]);

  // 🛡️ PREVENT DUPLICATE SPAWNS
  const processedStages = useRef<Set<number>>(new Set());

  // 💥 SPAWN BUBBLES ON STAGE CHANGE
  useEffect(() => {
    // Check if stage is valid and not already processed
    if (stage > 0 && stage <= 7 && !processedStages.current.has(stage)) {
      processedStages.current.add(stage);

      const newBubble = {
        id: crypto.randomUUID(),      // Unique ID
        path: BLOB_PATHS[stage - 1],  // Pick unique shape
        x: Math.random() * 80 + 10,   // Random X (10-90%)
        y: Math.random() * 80 + 10,   // Random Y (10-90%)
        scale: 0.1,                   // Start tiny
        rotate: Math.random() * 360,
      };
      setBubbles((prev) => [...prev, newBubble]);
    }
  }, [stage]);

  return (
    <svg className="absolute w-0 h-0 pointer-events-none">
      <defs>
        <mask id="reveal-mask">
          {/* Base: White = Visible Preloader */}
          <rect x="0" y="0" width="100%" height="100%" fill="white" />
          
          {/* Holes: Black = Hidden Preloader (Revealing page below) */}
          {bubbles.map((b) => (
            <motion.path
              key={b.id}
              d={b.path}
              fill="black"
              initial={{ scale: 0, opacity: 0 }}
              animate={{
                scale: stage >= 7 ? 50 : 3.0,
                opacity: 1,
                x: `${b.x}%`,
                y: `${b.y}%`
              }}
              transition={{
                duration: stage >= 7 ? 1.5 : 2.5,
                ease: "circIn"
              }}
              style={{
                originX: "50%",
                originY: "50%",
                translateX: "-50%",
                translateY: "-50%",
              }}
              transform={`translate(${b.x}vw, ${b.y}vh) rotate(${b.rotate}deg)`}
            />
          ))}
        </mask>
      </defs>
    </svg>
  );
}
