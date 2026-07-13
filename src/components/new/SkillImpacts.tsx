"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";

const skillColors = [
  "#C44D1C", // C++ / Systems
  "#2C5270", // Go (Golang)
  "#905B20", // TypeScript / React
  "#385C46", // Rust / WASM
  "#6D3C8A", // Python / AI
  "#2B6B61", // SQL / Bash
];

// Composed SVG to look like an organic, aggressive paint splat
const SplatterShape = ({ color, sizeLevel, index }: { color: string; sizeLevel: number, index: number }) => {
  // Base scale + extra scale based on expertise level (0-100)
  const scale = 0.6 + (sizeLevel / 100) * 1.4;
  // Rotate each splat randomly based on index to look organic
  const rotate = (index * 137.5) % 360;
  
  return (
    <div 
      className="w-full h-full relative flex items-center justify-center" 
      style={{ transform: `scale(${scale}) rotate(${rotate}deg)` }}
    >
      <svg viewBox="0 0 200 200" width="100%" height="100%" className="absolute inset-0">
        <g fill={color}>
          {/* Core blobs */}
          <circle cx="100" cy="100" r="45" />
          <circle cx="80" cy="70" r="30" />
          <circle cx="130" cy="90" r="35" />
          <circle cx="110" cy="130" r="30" />
          <circle cx="70" cy="110" r="25" />
          <circle cx="95" cy="135" r="22" />
          <circle cx="135" cy="115" r="28" />
          
          {/* Spikes / Splat rays */}
          <path d="M100 55 Q 110 20 120 15 Q 115 30 115 65 Z" />
          <path d="M140 90 Q 180 80 185 90 Q 160 105 140 100 Z" />
          <path d="M110 140 Q 130 180 120 190 Q 100 160 95 140 Z" />
          <path d="M65 110 Q 20 120 15 110 Q 30 90 60 95 Z" />
          <path d="M70 70 Q 40 40 50 30 Q 60 50 85 65 Z" />
          <path d="M130 65 Q 160 30 170 40 Q 150 60 125 80 Z" />
          <path d="M90 140 Q 60 170 50 160 Q 70 130 80 125 Z" />
          
          {/* Droplets */}
          <circle cx="130" cy="20" r="6" />
          <circle cx="185" cy="70" r="4" />
          <circle cx="170" cy="110" r="8" />
          <circle cx="140" cy="170" r="5" />
          <circle cx="90" cy="185" r="7" />
          <circle cx="30" cy="130" r="4" />
          <circle cx="20" cy="80" r="6" />
          <circle cx="50" cy="30" r="5" />
          <circle cx="150" cy="150" r="9" />
          <circle cx="60" cy="160" r="4" />
          <circle cx="35" cy="50" r="7" />
          <circle cx="160" cy="35" r="5" />
        </g>
      </svg>
    </div>
  );
};

const SkillItem = ({ skill, index }: { skill: any; index: number }) => {
  const ref = useRef(null);
  // once: true ensures it never reverses when scrolling back up
  const isInView = useInView(ref, { once: true, margin: "-15% 0px" });
  const color = skillColors[index % skillColors.length];
  
  return (
    <div ref={ref} className="relative w-full h-[220px] flex items-center justify-center">
      {/* The splat impact animation */}
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={isInView ? { scale: 1, opacity: 0.9 } : { scale: 0, opacity: 0 }}
        transition={{ 
          type: "spring", 
          stiffness: 400, 
          damping: 20, 
          mass: 0.8 
        }}
        className="absolute inset-0 flex items-center justify-center"
        style={{ filter: "drop-shadow(0px 10px 20px rgba(0,0,0,0.15))" }}
      >
        <div className="w-[180px] h-[180px]">
          <SplatterShape color={color} sizeLevel={skill.level} index={index} />
        </div>
      </motion.div>
      
      {/* The text reveal */}
      <motion.div
        initial={{ scale: 0.5, opacity: 0 }}
        animate={isInView ? { scale: 1, opacity: 1 } : { scale: 0.5, opacity: 0 }}
        transition={{ delay: 0.15, duration: 0.4, ease: "easeOut" }}
        className="relative z-10 flex flex-col items-center pointer-events-none"
      >
        <span 
          className="text-white font-black tracking-widest text-2xl uppercase text-center px-4"
          style={{ fontFamily: "var(--font-big-shoulders), sans-serif", textShadow: "0 2px 10px rgba(0,0,0,0.5)" }}
        >
          {skill.name}
        </span>
        <span 
          className="text-white/90 font-bold text-xs tracking-widest mt-1"
          style={{ fontFamily: "var(--font-jetbrains-mono), monospace" }}
        >
          LVL {skill.level}
        </span>
      </motion.div>
    </div>
  );
};

export function SkillImpacts({ skills }: { skills: any[] }) {
  return (
    <div className="w-full flex flex-col gap-12 py-10 items-center overflow-x-hidden">
      {skills.map((s, i) => (
        <SkillItem key={s.name} skill={s} index={i} />
      ))}
    </div>
  );
}
