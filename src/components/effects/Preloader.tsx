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
 * Each letter is a true 3D object with visible front, top, and side faces
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
  const dropDuration = 0.8;
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
          className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden"
          style={{
            background: "linear-gradient(135deg, #0c0c0c 0%, #1a1a2e 50%, #0f0f1a 100%)",
          }}
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.1 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          {/* Ambient light from above */}
          <div 
            className="absolute inset-0 pointer-events-none"
            style={{
              background: "radial-gradient(ellipse 100% 60% at 50% 0%, rgba(100,120,255,0.08) 0%, transparent 60%)",
            }}
          />

          {/* 3D Scene Container */}
          <div 
            className="relative"
            style={{ 
              perspective: "1200px",
              perspectiveOrigin: "50% 40%",
            }}
          >
            <div 
              className="flex items-end justify-center"
              style={{ 
                gap: "clamp(0.2rem, 1.5vw, 0.8rem)",
                transformStyle: "preserve-3d",
                transform: "rotateX(10deg)",
              }}
            >
              {letters.map((letter, i) => (
                <BlockLetter3D
                  key={i}
                  letter={letter}
                  dropDuration={dropDuration}
                  groupDelay={groupDelay}
                  isComplete={animationComplete}
                />
              ))}
            </div>
          </div>

          {/* Ground plane reflection */}
          <div 
            className="absolute bottom-0 left-0 right-0 h-1/2 pointer-events-none"
            style={{
              background: "linear-gradient(to top, rgba(30,30,50,0.4) 0%, transparent 50%)",
            }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}

interface BlockLetter3DProps {
  letter: LetterData;
  dropDuration: number;
  groupDelay: number;
  isComplete: boolean;
}

function BlockLetter3D({ letter, dropDuration, groupDelay, isComplete }: BlockLetter3DProps) {
  if (letter.isSpace) {
    return <div style={{ width: "clamp(1rem, 4vw, 3rem)" }} />;
  }

  const delay = letter.dropOrder * groupDelay;
  const depth = 20; // Depth of the 3D block in pixels
  const fontSize = "clamp(3rem, 12vw, 8rem)";

  return (
    <motion.div
      className="relative"
      style={{
        fontSize,
        fontFamily: "var(--font-geist-sans), system-ui, sans-serif",
        fontWeight: 900,
        transformStyle: "preserve-3d",
        lineHeight: 1,
      }}
      initial={{
        y: "-150vh",
        rotateX: -180,
        rotateY: Math.random() * 90 - 45,
        rotateZ: Math.random() * 60 - 30,
      }}
      animate={{
        y: 0,
        rotateX: 0,
        rotateY: isComplete ? [0, -5, 0] : 0,
        rotateZ: 0,
      }}
      transition={{
        y: {
          delay,
          duration: dropDuration,
          ease: [0.22, 1.4, 0.36, 1], // Heavy bounce
        },
        rotateX: {
          delay,
          duration: dropDuration * 1.2,
          ease: [0.22, 1, 0.36, 1],
        },
        rotateY: {
          delay: isComplete ? delay + dropDuration + 0.5 : delay,
          duration: isComplete ? 0.6 : dropDuration * 1.2,
          ease: [0.22, 1, 0.36, 1],
        },
        rotateZ: {
          delay,
          duration: dropDuration * 1.2,
          ease: [0.22, 1, 0.36, 1],
        },
      }}
    >
      {/* FRONT FACE - Main visible face */}
      <span
        className="relative block select-none"
        style={{
          color: "#ffffff",
          transform: `translateZ(${depth / 2}px)`,
          textShadow: "0 2px 10px rgba(0,0,0,0.3)",
        }}
      >
        {letter.char}
      </span>

      {/* TOP FACE - Visible when looking down */}
      <span
        className="absolute top-0 left-0 block select-none origin-bottom"
        style={{
          color: "#e0e0e0",
          transform: `rotateX(-90deg) translateZ(${depth / 2}px)`,
          background: "linear-gradient(to bottom, #d0d0d0, #a0a0a0)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          backgroundClip: "text",
        }}
        aria-hidden="true"
      >
        {letter.char}
      </span>

      {/* RIGHT FACE - Side depth */}
      <span
        className="absolute top-0 left-0 block select-none origin-left"
        style={{
          color: "#888888",
          transform: `rotateY(90deg) translateZ(0px) translateX(${depth / 2}px)`,
          width: `${depth}px`,
          overflow: "hidden",
          background: "linear-gradient(to right, #707070, #505050)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          backgroundClip: "text",
        }}
        aria-hidden="true"
      >
        {letter.char}
      </span>

      {/* BOTTOM FACE - Creates depth illusion */}
      <span
        className="absolute top-0 left-0 block select-none origin-top"
        style={{
          color: "#404040",
          transform: `rotateX(90deg) translateZ(-${depth / 2}px) translateY(-${depth}px)`,
          background: "linear-gradient(to top, #303030, #202020)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          backgroundClip: "text",
        }}
        aria-hidden="true"
      >
        {letter.char}
      </span>

      {/* BACK FACE - For complete 3D box */}
      <span
        className="absolute top-0 left-0 block select-none"
        style={{
          color: "#1a1a1a",
          transform: `translateZ(-${depth / 2}px) rotateY(180deg)`,
        }}
        aria-hidden="true"
      >
        {letter.char}
      </span>

      {/* Drop shadow on ground */}
      <motion.div
        className="absolute left-1/2 -translate-x-1/2 rounded-full pointer-events-none"
        style={{
          bottom: `-${depth * 2}px`,
          width: "80%",
          height: "10px",
          background: "radial-gradient(ellipse, rgba(0,0,0,0.5) 0%, transparent 70%)",
          filter: "blur(8px)",
        }}
        initial={{ opacity: 0, scaleX: 0.5 }}
        animate={{ opacity: 0.7, scaleX: 1 }}
        transition={{ delay: delay + dropDuration * 0.7, duration: 0.3 }}
      />
    </motion.div>
  );
}
