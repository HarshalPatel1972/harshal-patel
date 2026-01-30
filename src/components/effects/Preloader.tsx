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
 * 3D Falling Letters Preloader
 * True 3D extruded letters that drop in alphabetical order
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
  const groupDelay = 0.25;
  const totalAnimTime = (totalGroups * groupDelay) + dropDuration + 1.8;

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
          {/* Gradient background */}
          <div 
            className="absolute inset-0"
            style={{
              background: "radial-gradient(ellipse at 50% 30%, #1a1a2e 0%, #0a0a0a 50%, #000000 100%)",
            }}
          />

          {/* Spotlight effect */}
          <div 
            className="absolute inset-0 pointer-events-none"
            style={{
              background: "radial-gradient(ellipse 80% 50% at 50% 60%, rgba(255,255,255,0.03) 0%, transparent 70%)",
            }}
          />

          {/* 3D Perspective Container */}
          <div 
            className="relative"
            style={{ 
              perspective: "800px",
              perspectiveOrigin: "50% 50%",
            }}
          >
            {/* Letters */}
            <div 
              className="flex items-center justify-center"
              style={{ 
                gap: "clamp(0.1rem, 1vw, 0.5rem)",
                transformStyle: "preserve-3d",
              }}
            >
              {letters.map((letter, i) => (
                <Letter3D
                  key={i}
                  letter={letter}
                  dropDuration={dropDuration}
                  groupDelay={groupDelay}
                  isComplete={animationComplete}
                />
              ))}
            </div>
          </div>

          {/* Floor gradient */}
          <motion.div
            className="absolute bottom-0 left-0 right-0 h-1/3 pointer-events-none"
            style={{
              background: "linear-gradient(to top, rgba(20,20,40,0.3) 0%, transparent 100%)",
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 1 }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}

interface Letter3DProps {
  letter: LetterData;
  dropDuration: number;
  groupDelay: number;
  isComplete: boolean;
}

function Letter3D({ letter, dropDuration, groupDelay, isComplete }: Letter3DProps) {
  if (letter.isSpace) {
    return <div style={{ width: "clamp(0.5rem, 3vw, 2rem)" }} />;
  }

  const delay = letter.dropOrder * groupDelay;
  
  // Generate extrusion layers for 3D effect
  const extrusionDepth = 12;
  const layers = Array.from({ length: extrusionDepth }, (_, i) => i);

  return (
    <motion.div
      className="relative inline-block"
      style={{
        fontSize: "clamp(2.5rem, 10vw, 7rem)",
        fontFamily: "var(--font-geist-sans), system-ui, sans-serif",
        fontWeight: 900,
        transformStyle: "preserve-3d",
      }}
      initial={{
        y: "-120vh",
        rotateX: -45,
        rotateY: Math.random() * 60 - 30,
        rotateZ: Math.random() * 40 - 20,
        scale: 0.6,
      }}
      animate={{
        y: 0,
        rotateX: isComplete ? 5 : 0,
        rotateY: 0,
        rotateZ: 0,
        scale: 1,
      }}
      transition={{
        y: {
          delay,
          duration: dropDuration,
          ease: [0.34, 1.56, 0.64, 1], // Bouncy
        },
        rotateX: {
          delay,
          duration: dropDuration * 1.3,
          ease: [0.22, 1, 0.36, 1],
        },
        rotateY: {
          delay,
          duration: dropDuration * 1.3,
          ease: [0.22, 1, 0.36, 1],
        },
        rotateZ: {
          delay,
          duration: dropDuration * 1.3,
          ease: [0.22, 1, 0.36, 1],
        },
        scale: {
          delay,
          duration: dropDuration,
          ease: [0.22, 1, 0.36, 1],
        },
      }}
    >
      {/* 3D Extrusion layers (back to front) */}
      {layers.map((layerIndex) => (
        <span
          key={layerIndex}
          className="absolute inset-0 select-none"
          style={{
            color: `hsl(240, 10%, ${Math.max(5, 15 - layerIndex)}%)`,
            transform: `translateZ(${-layerIndex * 2}px)`,
            textShadow: "none",
          }}
          aria-hidden="true"
        >
          {letter.char}
        </span>
      ))}
      
      {/* Front face - main visible letter */}
      <motion.span
        className="relative select-none"
        style={{
          color: "#ffffff",
          transform: "translateZ(0px)",
          textShadow: `
            0 1px 0 #cccccc,
            0 2px 0 #bbbbbb,
            0 3px 0 #aaaaaa,
            0 4px 0 #999999,
            0 5px 0 #888888,
            0 6px 1px rgba(0,0,0,.1),
            0 0 5px rgba(0,0,0,.1),
            0 1px 3px rgba(0,0,0,.3),
            0 3px 5px rgba(0,0,0,.2),
            0 5px 10px rgba(0,0,0,.25),
            0 10px 10px rgba(0,0,0,.2),
            0 20px 20px rgba(0,0,0,.15)
          `,
        }}
        initial={{ opacity: 0 }}
        animate={{ 
          opacity: 1,
          textShadow: isComplete ? `
            0 1px 0 #cccccc,
            0 2px 0 #bbbbbb,
            0 3px 0 #aaaaaa,
            0 4px 0 #999999,
            0 5px 0 #888888,
            0 6px 1px rgba(0,0,0,.1),
            0 0 20px rgba(100,150,255,.3),
            0 1px 3px rgba(0,0,0,.3),
            0 3px 5px rgba(0,0,0,.2),
            0 5px 10px rgba(0,0,0,.25),
            0 10px 10px rgba(0,0,0,.2),
            0 20px 20px rgba(0,0,0,.15)
          ` : undefined,
        }}
        transition={{ 
          delay: delay + 0.1, 
          duration: 0.3,
          textShadow: { delay: delay + dropDuration + 0.5, duration: 0.5 }
        }}
      >
        {letter.char}
      </motion.span>

      {/* Bottom shadow on floor */}
      <motion.span
        className="absolute select-none pointer-events-none"
        style={{
          color: "transparent",
          transform: "translateZ(-30px) rotateX(90deg) translateY(30px) scale(1, 0.3)",
          textShadow: "0 0 30px rgba(0,0,0,0.8), 0 0 60px rgba(0,0,0,0.4)",
          filter: "blur(8px)",
          opacity: 0.6,
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.6 }}
        transition={{ delay: delay + dropDuration * 0.8 }}
        aria-hidden="true"
      >
        {letter.char}
      </motion.span>
    </motion.div>
  );
}
