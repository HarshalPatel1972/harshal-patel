"use client";

import React, { useState, useEffect, useRef } from "react";
import { useHandoff } from "@/lib/handoff-context";
import { BLOB_PATHS } from "@/components/effects/BlobAssets";
import { animate as anime } from "animejs";

interface BubbleProps {
  bubble: { id: string; path: string; x: number; y: number; rotate: number };
  stage: number;
}

function Bubble({ bubble, stage }: BubbleProps) {
  const pathRef = useRef<SVGPathElement>(null);

  useEffect(() => {
    if (pathRef.current) {
      anime(pathRef.current, {
        scale: stage >= 7 ? 50 : 3.0,
        opacity: [0, 1],
        duration: stage >= 7 ? 1500 : 2500,
        easing: 'inCirc'
      });
    }
  }, [stage]);

  return (
    <path
      ref={pathRef}
      d={bubble.path}
      fill="black"
      style={{
        transformBox: 'fill-box',
        transformOrigin: 'center',
        transform: `translate(${bubble.x}vw, ${bubble.y}vh) rotate(${bubble.rotate}deg) scale(0)`,
      }}
    />
  );
}

export default function BubbleMask() {
  const { stage } = useHandoff();
  const [bubbles, setBubbles] = useState<{ id: string; path: string; x: number; y: number; rotate: number }[]>([]);

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
            <Bubble key={b.id} bubble={b} stage={stage} />
          ))}
        </mask>
      </defs>
    </svg>
  );
}
