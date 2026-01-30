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
 * PIXAR-Style 3D Block Letters Preloader
 * Chunky 3D letters with thick visible depth, ground plane, and heavy bounce
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
  const dropDuration = 0.5;
  const groupDelay = 0.15;
  const totalAnimTime = (totalGroups * groupDelay) + dropDuration + 2.5;

  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimationComplete(true);
      setTimeout(() => {
        setShouldExit(true);
        setComplete();
      }, 600);
    }, totalAnimTime * 1000);
    return () => clearTimeout(timer);
  }, [totalAnimTime, setComplete]);

  return (
    <AnimatePresence>
      {!shouldExit && (
        <motion.div
          className="fixed inset-0 z-50 flex flex-col items-center justify-center overflow-hidden"
          style={{
            background: "linear-gradient(180deg, #1a1a2e 0%, #0f0f1a 100%)",
          }}
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Spotlight from above */}
          <div 
            className="absolute inset-0 pointer-events-none"
            style={{
              background: "radial-gradient(ellipse 80% 40% at 50% 20%, rgba(255,255,255,0.1) 0%, transparent 70%)",
            }}
          />

          {/* 3D Scene with perspective */}
          <div 
            className="relative flex items-end justify-center"
            style={{
              transform: "perspective(1000px) rotateX(5deg)",
              transformStyle: "preserve-3d",
            }}
          >
            {/* Letters */}
            <div className="flex items-end justify-center gap-[0.3vw]">
              {letters.map((letter, i) => (
                <PixarLetter
                  key={i}
                  letter={letter}
                  dropDuration={dropDuration}
                  groupDelay={groupDelay}
                  isComplete={animationComplete}
                />
              ))}
            </div>
          </div>

          {/* Ground plane */}
          <div 
            className="absolute left-0 right-0 h-20 pointer-events-none"
            style={{
              bottom: "calc(50% - 6rem)",
              background: "linear-gradient(180deg, rgba(15,15,30,0.8) 0%, transparent 100%)",
            }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}

interface PixarLetterProps {
  letter: LetterData;
  dropDuration: number;
  groupDelay: number;
  isComplete: boolean;
}

function PixarLetter({ letter, dropDuration, groupDelay, isComplete }: PixarLetterProps) {
  if (letter.isSpace) {
    return <div style={{ width: "clamp(0.8rem, 2.5vw, 2rem)" }} />;
  }

  const delay = letter.dropOrder * groupDelay;
  const [hasLanded, setHasLanded] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setHasLanded(true);
    }, (delay + dropDuration) * 1000);
    return () => clearTimeout(timer);
  }, [delay, dropDuration]);

  // Thick depth settings
  const depthLayers = 20;
  const depthOffset = 1.5; // px per layer

  return (
    <motion.div
      className="relative"
      style={{
        fontSize: "clamp(2rem, 9vw, 6rem)",
        fontFamily: "var(--font-geist-sans), system-ui, sans-serif",
        fontWeight: 900,
        lineHeight: 0.9,
        transformStyle: "preserve-3d",
      }}
      initial={{
        y: "-100vh",
        scale: 1.2,
        rotateX: -20,
      }}
      animate={{
        y: 0,
        scale: hasLanded ? (isComplete ? [1, 0.95, 1] : 1) : 1,
        rotateX: 0,
      }}
      transition={{
        y: {
          delay,
          duration: dropDuration,
          ease: [0.36, 0, 0.66, -0.56], // Heavy drop
        },
        scale: {
          delay: hasLanded ? (isComplete ? delay + dropDuration + 1 : delay + dropDuration) : delay,
          duration: 0.15,
          ease: "easeOut",
        },
        rotateX: {
          delay,
          duration: dropDuration,
          ease: "easeOut",
        },
      }}
    >
      {/* Side depth layers (the thick extrusion) */}
      {Array.from({ length: depthLayers }).map((_, i) => {
        const brightness = 25 + (i / depthLayers) * 15; // 25% to 40%
        return (
          <span
            key={i}
            className="absolute top-0 left-0 select-none"
            style={{
              color: `hsl(230, 20%, ${brightness}%)`,
              transform: `translate(${(depthLayers - i) * depthOffset * 0.7}px, ${(depthLayers - i) * depthOffset}px)`,
              WebkitTextStroke: "0.5px rgba(0,0,0,0.3)",
            }}
            aria-hidden="true"
          >
            {letter.char}
          </span>
        );
      })}

      {/* Front face - bright and clean */}
      <motion.span
        className="relative select-none"
        style={{
          color: "#f0f0f0",
          textShadow: "0 -1px 0 #ffffff, 0 1px 2px rgba(0,0,0,0.3)",
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: delay + dropDuration * 0.3, duration: 0.2 }}
      >
        {letter.char}
      </motion.span>

      {/* Impact squish animation */}
      {hasLanded && (
        <motion.div
          className="absolute inset-0"
          initial={{ scaleY: 1, scaleX: 1 }}
          animate={{ 
            scaleY: [0.7, 1.1, 0.95, 1],
            scaleX: [1.3, 0.9, 1.05, 1],
          }}
          transition={{
            duration: 0.3,
            ease: "easeOut",
          }}
          style={{ transformOrigin: "bottom center" }}
        />
      )}

      {/* Ground shadow */}
      <motion.div
        className="absolute left-1/2 pointer-events-none"
        style={{
          bottom: "-8px",
          width: "130%",
          height: "16px",
          background: "radial-gradient(ellipse at center, rgba(0,0,0,0.7) 0%, transparent 70%)",
          filter: "blur(6px)",
          transform: "translateX(-50%) scaleY(0.4)",
        }}
        initial={{ opacity: 0, scaleX: 0.3 }}
        animate={{ 
          opacity: hasLanded ? 1 : 0, 
          scaleX: hasLanded ? 1.2 : 0.3,
        }}
        transition={{ 
          delay: delay + dropDuration * 0.8, 
          duration: 0.2,
          ease: "easeOut",
        }}
      />

      {/* Impact dust particles */}
      {hasLanded && (
        <>
          <motion.div
            className="absolute pointer-events-none"
            style={{
              bottom: "0",
              left: "-20%",
              width: "8px",
              height: "8px",
              background: "rgba(150,150,180,0.6)",
              borderRadius: "50%",
            }}
            initial={{ opacity: 1, y: 0, x: 0 }}
            animate={{ opacity: 0, y: -30, x: -20 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
          />
          <motion.div
            className="absolute pointer-events-none"
            style={{
              bottom: "0",
              right: "-20%",
              width: "6px",
              height: "6px",
              background: "rgba(150,150,180,0.5)",
              borderRadius: "50%",
            }}
            initial={{ opacity: 1, y: 0, x: 0 }}
            animate={{ opacity: 0, y: -25, x: 15 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
          />
        </>
      )}
    </motion.div>
  );
}
