"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

export function HeroGrid() {
  const [dimensions, setDimensions] = useState({ cols: 16, rows: 9 });
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    
    const calculateGrid = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      
      // Target square size - roughly 120-160px looks good for "large squares"
      // User wanted "initial size" which was ~120px.
      // Let's optimize for 16:9 screens to be exact squares.
      // 1920 / 120 = 16 cols.
      // 1080 / 120 = 9 rows.
      // GCD approach-ish.
      
      const targetSize = 120; 
      
      const cols = Math.round(width / targetSize);
      const rows = Math.round(height / targetSize);
      
      setDimensions({ cols, rows });
    };

    calculateGrid();
    window.addEventListener("resize", calculateGrid);
    return () => window.removeEventListener("resize", calculateGrid);
  }, []);

  if (!mounted) return null;

  return (
    <div 
      className="absolute inset-0 z-0 pointer-events-none opacity-[0.05]"
      style={{
        display: "grid",
        gridTemplateColumns: `repeat(${dimensions.cols}, 1fr)`,
        gridTemplateRows: `repeat(${dimensions.rows}, 1fr)`,
      }}
    >
      {Array.from({ length: dimensions.cols * dimensions.rows }).map((_, i) => (
        <div 
          key={i} 
          className="border-[0.5px] border-white/20"
        />
      ))}
    </div>
  );
}
