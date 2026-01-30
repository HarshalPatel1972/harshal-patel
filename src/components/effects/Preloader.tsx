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
 * Clean 3D Block Letters with Floor Reflection
 * Vertical extrusion with mirror effect - PIXAR style
 */
export function Preloader() {
  const { setComplete } = usePreloader();
  const [shouldExit, setShouldExit] = useState(false);

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
  const dropDuration = 0.5;
  const groupDelay = 0.12;
  const totalAnimTime = (totalGroups * groupDelay) + dropDuration + 2;

  useEffect(() => {
    const timer = setTimeout(() => {
      setShouldExit(true);
      setComplete();
    }, totalAnimTime * 1000);
    return () => clearTimeout(timer);
  }, [totalAnimTime, setComplete]);

  return (
    <AnimatePresence>
      {!shouldExit && (
        <motion.div
          className="fixed inset-0 z-50 flex flex-col items-center justify-center overflow-hidden"
          style={{
            background: "linear-gradient(180deg, #2a2a3e 0%, #1a1a2a 50%, #12121a 100%)",
          }}
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6, ease: "easeInOut" }}
        >
          {/* Main letters */}
          <div className="relative flex items-center justify-center">
            <div className="flex items-end justify-center" style={{ gap: "clamp(0.1rem, 0.8vw, 0.5rem)" }}>
              {letters.map((letter, i) => (
                <CleanLetter3D
                  key={i}
                  letter={letter}
                  dropDuration={dropDuration}
                  groupDelay={groupDelay}
                />
              ))}
            </div>
          </div>

          {/* Floor reflection */}
          <div 
            className="relative flex items-start justify-center mt-1"
            style={{
              transform: "scaleY(-1)",
              maskImage: "linear-gradient(to bottom, rgba(0,0,0,0.4) 0%, transparent 60%)",
              WebkitMaskImage: "linear-gradient(to bottom, rgba(0,0,0,0.4) 0%, transparent 60%)",
            }}
          >
            <div className="flex items-end justify-center" style={{ gap: "clamp(0.1rem, 0.8vw, 0.5rem)" }}>
              {letters.map((letter, i) => (
                <CleanLetter3D
                  key={`reflection-${i}`}
                  letter={letter}
                  dropDuration={dropDuration}
                  groupDelay={groupDelay}
                  isReflection
                />
              ))}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

interface CleanLetter3DProps {
  letter: LetterData;
  dropDuration: number;
  groupDelay: number;
  isReflection?: boolean;
}

function CleanLetter3D({ letter, dropDuration, groupDelay, isReflection = false }: CleanLetter3DProps) {
  if (letter.isSpace) {
    return <div style={{ width: "clamp(0.5rem, 2vw, 1.5rem)" }} />;
  }

  const delay = letter.dropOrder * groupDelay;
  
  // Vertical extrusion - straight down
  const depthLayers = 25;

  return (
    <motion.div
      className="relative"
      style={{
        fontSize: "clamp(2rem, 8vw, 5.5rem)",
        fontFamily: "var(--font-geist-sans), system-ui, sans-serif",
        fontWeight: 900,
        lineHeight: 1,
        letterSpacing: "-0.02em",
      }}
      initial={{
        y: isReflection ? "100vh" : "-100vh",
        opacity: 0,
      }}
      animate={{
        y: 0,
        opacity: 1,
      }}
      transition={{
        y: {
          delay,
          duration: dropDuration,
          ease: [0.22, 1, 0.36, 1],
        },
        opacity: {
          delay,
          duration: dropDuration * 0.5,
        },
      }}
    >
      {/* Vertical depth extrusion (straight down) */}
      {Array.from({ length: depthLayers }).map((_, i) => {
        // Gradient: lighter at top, darker at bottom
        const progress = i / depthLayers;
        const lightness = 50 - (progress * 40); // 50% to 10%
        
        return (
          <span
            key={i}
            className="absolute top-0 left-0 select-none"
            style={{
              color: `hsl(230, 15%, ${lightness}%)`,
              transform: `translateY(${(i + 1) * 1.2}px)`,
              zIndex: depthLayers - i,
            }}
            aria-hidden="true"
          >
            {letter.char}
          </span>
        );
      })}

      {/* Front face - clean white */}
      <span
        className="relative select-none"
        style={{
          color: isReflection ? "#c0c0d0" : "#f8f8fc",
          zIndex: depthLayers + 1,
        }}
      >
        {letter.char}
      </span>
    </motion.div>
  );
}
