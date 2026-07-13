"use client";

import { useRef, useMemo } from "react";
import { motion, useInView } from "framer-motion";

const skillColors = [
  "#C44D1C", // C++ / Systems
  "#2C5270", // Go (Golang)
  "#905B20", // TypeScript / React
  "#385C46", // Rust / WASM
  "#6D3C8A", // Python / AI
  "#2B6B61", // SQL / Bash
];

// Helper to generate a highly realistic, chaotic paint splatter
const ChaoticSplat = ({ color, rotate, scaleModifier }: { color: string, rotate: number, scaleModifier: number }) => {
  // Use useMemo so the chaotic splat doesn't re-render its random paths on every cycle
  const elements = useMemo(() => {
    const blobs = [];
    const streaks = [];
    const droplets = [];

    // Central chaotic blobs
    for (let i = 0; i < 12; i++) {
      const cx = 50 + (Math.random() - 0.5) * 30;
      const cy = 50 + (Math.random() - 0.5) * 30;
      const r = 10 + Math.random() * 25;
      const rx = r * (0.8 + Math.random() * 0.4);
      const ry = r * (0.8 + Math.random() * 0.4);
      const rot = Math.random() * 360;
      blobs.push(
        <ellipse 
          key={`blob-${i}`} 
          cx={cx} cy={cy} rx={rx} ry={ry} 
          fill={color} 
          transform={`rotate(${rot} ${cx} ${cy})`} 
        />
      );
    }

    // High velocity streaks shooting out
    const numStreaks = 15 + Math.floor(Math.random() * 10);
    for (let i = 0; i < numStreaks; i++) {
      const angle = Math.random() * Math.PI * 2;
      const length = 40 + Math.random() * 60; // How far it shoots
      const width = 2 + Math.random() * 6; // Width at base
      
      const startX = 50 + Math.cos(angle) * 10;
      const startY = 50 + Math.sin(angle) * 10;
      const endX = 50 + Math.cos(angle) * length;
      const endY = 50 + Math.sin(angle) * length;
      
      const p1x = startX + Math.cos(angle + Math.PI/2) * width;
      const p1y = startY + Math.sin(angle + Math.PI/2) * width;
      const p2x = startX - Math.cos(angle + Math.PI/2) * width;
      const p2y = startY - Math.sin(angle + Math.PI/2) * width;

      streaks.push(
        <polygon 
          key={`streak-${i}`} 
          points={`${p1x},${p1y} ${p2x},${p2y} ${endX},${endY}`} 
          fill={color} 
        />
      );
    }

    // Chaotic droplets everywhere
    const numDrops = 40 + Math.floor(Math.random() * 40);
    for (let i = 0; i < numDrops; i++) {
      const angle = Math.random() * Math.PI * 2;
      // Exponential distribution so more drops are near the center
      const dist = 20 + Math.pow(Math.random(), 2) * 80;
      const cx = 50 + Math.cos(angle) * dist;
      const cy = 50 + Math.sin(angle) * dist;
      const r = 0.5 + Math.random() * 3.5;
      
      droplets.push(
        <circle key={`drop-${i}`} cx={cx} cy={cy} r={r} fill={color} />
      );
    }

    return { blobs, streaks, droplets };
  }, [color]);

  return (
    <svg 
      viewBox="-20 -20 140 140" 
      className="w-full h-full absolute inset-0"
      style={{ 
        transform: `rotate(${rotate}deg) scale(${scaleModifier})`, 
        overflow: 'visible',
        mixBlendMode: 'hard-light', // Makes overlaps look like wet paint mixing
        opacity: 0.95
      }}
    >
      <g>
        {elements.streaks}
        {elements.blobs}
        {elements.droplets}
      </g>
    </svg>
  );
};

// Distribute them safely within a shared container so they overlap nicely like a canvas
const getPosition = (index: number) => {
  const positions = [
    { top: "20%", left: "25%" },
    { top: "35%", left: "70%" },
    { top: "55%", left: "30%" },
    { top: "70%", left: "75%" },
    { top: "85%", left: "40%" },
    { top: "15%", left: "60%" },
  ];
  return positions[index % positions.length];
};

const SkillItem = ({ skill, index, inView }: { skill: any; index: number, inView: boolean }) => {
  const color = skillColors[index % skillColors.length];
  const position = getPosition(index);
  
  // Randomize exactly how each splat looks and rotates
  const rotate = useMemo(() => Math.floor(Math.random() * 360), []);
  // Random scale variance between 0.9 and 1.3 to make them organic
  const scaleMod = useMemo(() => 0.9 + Math.random() * 0.4, []);

  return (
    <div 
      className="absolute flex items-center justify-center transform -translate-x-1/2 -translate-y-1/2"
      style={{ top: position.top, left: position.left, width: '220px', height: '220px' }}
    >
      {/* The splat impact animation */}
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={inView ? { scale: 1, opacity: 1 } : { scale: 0, opacity: 0 }}
        transition={{ 
          type: "spring", 
          stiffness: 500, // Very stiff for high velocity impact
          damping: 15, 
          mass: 0.5,
          delay: index * 0.15 // Sequential splatting
        }}
        className="absolute inset-0 flex items-center justify-center pointer-events-none"
      >
        <ChaoticSplat color={color} rotate={rotate} scaleModifier={scaleMod} />
      </motion.div>
      
      {/* The text reveal */}
      <motion.div
        initial={{ scale: 0.5, opacity: 0 }}
        animate={inView ? { scale: 1, opacity: 1 } : { scale: 0.5, opacity: 0 }}
        transition={{ 
          delay: (index * 0.15) + 0.1, // Reveals almost immediately after splat
          duration: 0.3, 
          ease: "easeOut" 
        }}
        className="relative z-10 flex flex-col items-center pointer-events-none"
      >
        <span 
          className="text-white font-black tracking-widest uppercase text-center leading-none"
          style={{ 
            fontSize: "clamp(1.2rem, 2.5vw, 2rem)",
            fontFamily: "var(--font-big-shoulders), sans-serif", 
            textShadow: "0 2px 10px rgba(0,0,0,0.9), 0 0 2px rgba(0,0,0,0.8)" 
          }}
        >
          {skill.name}
        </span>
      </motion.div>
    </div>
  );
};

export function SkillImpacts({ skills }: { skills: any[] }) {
  const containerRef = useRef(null);
  // Trigger once when the container enters the viewport. No reverse on scroll back.
  const isInView = useInView(containerRef, { once: true, margin: "-10% 0px" });

  return (
    <div 
      ref={containerRef}
      className="w-full relative min-h-[500px] lg:min-h-[600px] overflow-visible my-4"
    >
      {skills.map((s, i) => (
        <SkillItem 
          key={s.name} 
          skill={s} 
          index={i} 
          inView={isInView} 
        />
      ))}
    </div>
  );
}
