"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, useMemo } from "react";
import { usePreloader } from "@/lib/preloader-context";

interface LetterData {
  char: string;
  index: number;
  dropOrder: number;
  isSpace?: boolean;
}

/**
 * 3D Block Letters Preloader
 * Clean extruded 3D letters using stacked layers
 */
export function Preloader() {
  const { setComplete } = usePreloader();
  const [shouldExit, setShouldExit] = useState(false);
  const [animationComplete, setAnimationComplete] = useState(false);

  const name = "HARSHAL PATEL";

  const letters = useMemo(() => {
    const chars = name.split("");
    const uniqueSorted = [...new Set(chars.filter(c => c !== " "))].sort();
    
    return chars.map((char, index): LetterData => {
      if (char === " ") {
        return { char, index, dropOrder: -1, isSpace: true };
      }
      const dropOrder = uniqueSorted.indexOf(char);
      return { char, index, dropOrder };
    });
  }, []);

  const totalGroups = [...new Set(letters.filter(l => !l.isSpace).map(l => l.dropOrder))].length;
  const dropDuration = 0.7;
  const groupDelay = 0.2;
  const totalAnimTime = (totalGroups * groupDelay) + dropDuration + 2;

  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimationComplete(true);
      setTimeout(() => {
        setShouldExit(true);
        setComplete();
      }, 800);
    }, totalAnimTime * 1000);
    return () => clearTimeout(timer);
  }, [totalAnimTime, setComplete]);

  return (
    <AnimatePresence>
      {!shouldExit && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden bg-[#0a0a0f]"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          {/* Subtle gradient */}
          <div 
            className="absolute inset-0"
            style={{
              background: "radial-gradient(circle at 50% 30%, #15152a 0%, #0a0a0f 70%)",
            }}
          />

          {/* Letters container */}
          <div className="relative flex items-center justify-center gap-[0.5vw]">
            {letters.map((letter, i) => (
              <ExtrudedLetter
                key={i}
                letter={letter}
                dropDuration={dropDuration}
                groupDelay={groupDelay}
                isComplete={animationComplete}
              />
            ))}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

interface ExtrudedLetterProps {
  letter: LetterData;
  dropDuration: number;
  groupDelay: number;
  isComplete: boolean;
}

function ExtrudedLetter({ letter, dropDuration, groupDelay, isComplete }: ExtrudedLetterProps) {
  if (letter.isSpace) {
    return <div style={{ width: "clamp(0.8rem, 3vw, 2rem)" }} />;
  }

  const delay = letter.dropOrder * groupDelay;
  
  // 3D extrusion settings
  const depth = 8; // layers
  const offsetX = 2; // px per layer
  const offsetY = 2; // px per layer

  // Create extrusion layers
  const layers = Array.from({ length: depth }, (_, i) => ({
    index: i,
    x: (depth - i) * offsetX,
    y: (depth - i) * offsetY,
    // Gradient from dark (back) to light (front)
    color: `hsl(230, 15%, ${15 + i * 3}%)`,
  }));

  return (
    <motion.div
      className="relative"
      style={{
        fontSize: "clamp(2.5rem, 10vw, 7rem)",
        fontFamily: "var(--font-geist-sans), system-ui, sans-serif",
        fontWeight: 800,
        lineHeight: 1,
      }}
      initial={{
        y: "-120vh",
        rotateZ: Math.random() * 30 - 15,
        scale: 0.8,
      }}
      animate={{
        y: 0,
        rotateZ: 0,
        scale: isComplete ? [1, 1.05, 1] : 1,
      }}
      transition={{
        y: {
          delay,
          duration: dropDuration,
          ease: [0.22, 1.3, 0.36, 1], // Bounce
        },
        rotateZ: {
          delay,
          duration: dropDuration * 0.8,
          ease: [0.22, 1, 0.36, 1],
        },
        scale: {
          delay: delay + dropDuration + 0.3,
          duration: 0.4,
          ease: [0.22, 1, 0.36, 1],
        },
      }}
    >
      {/* Extrusion layers (back to front) */}
      {layers.map((layer) => (
        <span
          key={layer.index}
          className="absolute top-0 left-0 select-none pointer-events-none"
          style={{
            color: layer.color,
            transform: `translate(${layer.x}px, ${layer.y}px)`,
          }}
          aria-hidden="true"
        >
          {letter.char}
        </span>
      ))}

      {/* Front face - main letter */}
      <motion.span
        className="relative select-none"
        style={{
          color: "#ffffff",
          textShadow: "0 0 20px rgba(100, 130, 255, 0.3)",
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: delay + 0.15, duration: 0.2 }}
      >
        {letter.char}
      </motion.span>

      {/* Ground shadow */}
      <motion.div
        className="absolute left-1/2 bottom-0 -translate-x-1/2 pointer-events-none"
        style={{
          width: "120%",
          height: "20px",
          background: "radial-gradient(ellipse at center, rgba(0,0,0,0.6) 0%, transparent 70%)",
          filter: "blur(8px)",
          transform: "translateY(100%) translateX(-50%) scaleY(0.3)",
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.8 }}
        transition={{ delay: delay + dropDuration * 0.6, duration: 0.3 }}
      />
    </motion.div>
  );
}
