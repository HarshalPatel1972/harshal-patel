"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, useMemo } from "react";
import { usePreloader } from "@/lib/preloader-context";

// Letter data with position and alphabetical order
interface LetterData {
  char: string;
  index: number; // position in final name
  dropOrder: number; // when to drop (based on alphabetical order)
  isSpace?: boolean;
}

/**
 * 3D Falling Letters Preloader
 * Letters drop in alphabetical order, then settle to spell "HARSHAL PATEL"
 */
export function Preloader() {
  const { setComplete } = usePreloader();
  const [shouldExit, setShouldExit] = useState(false);
  const [animationComplete, setAnimationComplete] = useState(false);

  const name = "HARSHAL PATEL";

  // Calculate letter data with drop order
  const letters = useMemo(() => {
    const chars = name.split("");
    
    // Get unique sorted letters (excluding space)
    const uniqueSorted = [...new Set(chars.filter(c => c !== " "))].sort();
    
    // Create letter data with drop order
    return chars.map((char, index): LetterData => {
      if (char === " ") {
        return { char, index, dropOrder: -1, isSpace: true };
      }
      const dropOrder = uniqueSorted.indexOf(char);
      return { char, index, dropOrder };
    });
  }, []);

  // Total animation time
  const totalGroups = [...new Set(letters.filter(l => !l.isSpace).map(l => l.dropOrder))].length;
  const dropDuration = 0.6;
  const groupDelay = 0.3;
  const totalAnimTime = (totalGroups * groupDelay) + dropDuration + 1.5; // +1.5s wait after settle

  // Trigger exit after animation completes
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
          className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden bg-black"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        >
          {/* Subtle gradient background */}
          <div 
            className="absolute inset-0"
            style={{
              background: "radial-gradient(ellipse at 50% 50%, #0a0a0a 0%, #000000 100%)",
            }}
          />

          {/* 3D Perspective Container */}
          <div 
            className="relative flex items-center justify-center"
            style={{ perspective: "1000px" }}
          >
            {/* Letters */}
            <div className="flex items-center justify-center gap-1 xs:gap-2 sm:gap-3">
              {letters.map((letter, i) => (
                <FallingLetter
                  key={i}
                  letter={letter}
                  dropDuration={dropDuration}
                  groupDelay={groupDelay}
                  isComplete={animationComplete}
                />
              ))}
            </div>
          </div>

          {/* Subtle floor reflection */}
          <motion.div
            className="absolute bottom-0 left-0 right-0 h-1/3 pointer-events-none"
            style={{
              background: "linear-gradient(to top, rgba(255,255,255,0.02) 0%, transparent 100%)",
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: totalAnimTime - 1.5, duration: 0.5 }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}

interface FallingLetterProps {
  letter: LetterData;
  dropDuration: number;
  groupDelay: number;
  isComplete: boolean;
}

function FallingLetter({ letter, dropDuration, groupDelay, isComplete }: FallingLetterProps) {
  if (letter.isSpace) {
    return <div className="w-3 xs:w-4 sm:w-6" />;
  }

  const delay = letter.dropOrder * groupDelay;

  return (
    <motion.span
      className="relative inline-block font-bold text-white select-none"
      style={{
        fontSize: "clamp(2rem, 8vw, 6rem)",
        fontFamily: "var(--font-geist-sans), system-ui, sans-serif",
        textShadow: "0 0 40px rgba(255,255,255,0.1)",
        transformStyle: "preserve-3d",
      }}
      initial={{
        y: "-100vh",
        rotateX: -90,
        rotateY: Math.random() * 40 - 20,
        rotateZ: Math.random() * 30 - 15,
        opacity: 0,
        scale: 0.5,
      }}
      animate={{
        y: 0,
        rotateX: 0,
        rotateY: 0,
        rotateZ: 0,
        opacity: 1,
        scale: isComplete ? [1, 1.1, 1] : 1,
      }}
      transition={{
        y: {
          delay,
          duration: dropDuration,
          ease: [0.34, 1.56, 0.64, 1], // Bouncy ease
        },
        rotateX: {
          delay,
          duration: dropDuration * 1.2,
          ease: [0.22, 1, 0.36, 1],
        },
        rotateY: {
          delay,
          duration: dropDuration * 1.2,
          ease: [0.22, 1, 0.36, 1],
        },
        rotateZ: {
          delay,
          duration: dropDuration * 1.2,
          ease: [0.22, 1, 0.36, 1],
        },
        opacity: {
          delay,
          duration: dropDuration * 0.3,
        },
        scale: {
          delay: delay + dropDuration,
          duration: 0.3,
        },
      }}
    >
      {/* Main letter */}
      <span className="relative z-10">{letter.char}</span>
      
      {/* 3D depth shadow */}
      <motion.span
        className="absolute inset-0 text-black/20 -z-10"
        style={{
          transform: "translateZ(-20px) translateY(4px)",
          filter: "blur(2px)",
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.3 }}
        transition={{ delay: delay + dropDuration * 0.5 }}
      >
        {letter.char}
      </motion.span>
    </motion.span>
  );
}
