"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useRef, useEffect, useMemo } from "react";
import { usePreloader } from "@/lib/preloader-context";

/**
 * Realistic Glass Breaking Preloader
 * 
 * 1. Video shows hand approaching
 * 2. At touch: cracks spread from impact point
 * 3. Glass pieces fall off progressively  
 * 4. Website visible THROUGH the gaps where glass fell
 */
export function Preloader() {
  const { setComplete } = usePreloader();
  const [phase, setPhase] = useState<"video" | "cracking" | "done">("video");
  const videoRef = useRef<HTMLVideoElement>(null);

  // Stop video at touch moment
  const handleTimeUpdate = () => {
    const video = videoRef.current;
    if (video && video.currentTime > 3.0 && phase === "video") {
      video.pause();
      setPhase("cracking");
    }
  };

  const handleVideoEnd = () => {
    if (phase === "video") setPhase("cracking");
  };

  // Mark complete when all glass has fallen
  const handleGlassComplete = () => {
    setPhase("done");
    setComplete();
  };

  if (phase === "done") return null;

  return (
    <div className="fixed inset-0 z-50">
      {/* Phase 1: Video with hand approaching */}
      <AnimatePresence>
        {phase === "video" && (
          <motion.div
            className="absolute inset-0 bg-black"
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <video
              ref={videoRef}
              className="absolute inset-0 h-full w-full object-cover"
              style={{ filter: "brightness(0.8)" }}
              src="/assets/test-0.mp4"
              muted
              playsInline
              autoPlay
              onTimeUpdate={handleTimeUpdate}
              onEnded={handleVideoEnd}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Phase 2: Glass layer that breaks apart piece by piece */}
      {phase === "cracking" && (
        <GlassBreakingLayer onComplete={handleGlassComplete} />
      )}
    </div>
  );
}

interface GlassBreakingLayerProps {
  onComplete: () => void;
}

/**
 * Glass layer covering the screen.
 * Each piece falls off at staggered times, revealing website behind.
 */
function GlassBreakingLayer({ onComplete }: GlassBreakingLayerProps) {
  // Create grid of glass pieces
  const pieces = useMemo(() => {
    const cols = 8;
    const rows = 6;
    const result = [];
    const centerX = cols / 2;
    const centerY = rows / 2;

    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        // Distance from center determines when piece falls
        const distFromCenter = Math.sqrt(
          Math.pow(col - centerX, 2) + Math.pow(row - centerY, 2)
        );
        
        result.push({
          id: `${row}-${col}`,
          col,
          row,
          // Pieces near center fall first, edges fall last
          fallDelay: distFromCenter * 0.12,
          // Random fall direction
          fallX: (col - centerX) * 30 + (Math.random() - 0.5) * 50,
          fallY: 100 + Math.random() * 50,
          rotation: (Math.random() - 0.5) * 180,
        });
      }
    }
    return result;
  }, []);

  // Trigger complete after all pieces have fallen
  useEffect(() => {
    const maxDelay = Math.max(...pieces.map(p => p.fallDelay)) + 1.2;
    const timer = setTimeout(onComplete, maxDelay * 1000);
    return () => clearTimeout(timer);
  }, [pieces, onComplete]);

  return (
    <>
      {/* Impact flash */}
      <motion.div
        className="absolute inset-0 bg-white pointer-events-none z-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 0.5, 0] }}
        transition={{ duration: 0.15 }}
      />

      {/* Crack lines spreading from center */}
      <CrackOverlay />

      {/* Glass pieces - each falls independently */}
      {pieces.map((piece) => (
        <GlassPiece
          key={piece.id}
          piece={piece}
          totalCols={8}
          totalRows={6}
        />
      ))}
    </>
  );
}

interface GlassPieceProps {
  piece: {
    id: string;
    col: number;
    row: number;
    fallDelay: number;
    fallX: number;
    fallY: number;
    rotation: number;
  };
  totalCols: number;
  totalRows: number;
}

/**
 * Individual glass piece that covers part of the screen.
 * Falls away after delay, revealing website behind.
 */
function GlassPiece({ piece, totalCols, totalRows }: GlassPieceProps) {
  const [hasFallen, setHasFallen] = useState(false);

  // Trigger fall after delay
  useEffect(() => {
    const timer = setTimeout(() => {
      setHasFallen(true);
    }, piece.fallDelay * 1000);
    return () => clearTimeout(timer);
  }, [piece.fallDelay]);

  const width = 100 / totalCols;
  const height = 100 / totalRows;

  return (
    <motion.div
      className="absolute"
      style={{
        left: `${piece.col * width}%`,
        top: `${piece.row * height}%`,
        width: `${width + 0.5}%`, // Slight overlap to prevent gaps
        height: `${height + 0.5}%`,
        // Glass appearance - covers website until it falls
        background: hasFallen 
          ? "transparent" 
          : "linear-gradient(135deg, rgba(230,235,255,0.95) 0%, rgba(200,210,230,0.9) 50%, rgba(220,225,240,0.95) 100%)",
        boxShadow: hasFallen ? "none" : "inset 0 0 30px rgba(255,255,255,0.3)",
        borderRight: hasFallen ? "none" : "1px solid rgba(255,255,255,0.2)",
        borderBottom: hasFallen ? "none" : "1px solid rgba(255,255,255,0.2)",
      }}
      initial={false}
      animate={hasFallen ? {
        x: piece.fallX,
        y: piece.fallY + "vh",
        rotate: piece.rotation,
        opacity: 0,
        scale: 0.8,
      } : {}}
      transition={{
        duration: 0.8,
        ease: [0.45, 0.05, 0.55, 0.95],
      }}
    />
  );
}

/**
 * Crack lines that spread from impact point
 */
function CrackOverlay() {
  return (
    <motion.svg
      className="absolute inset-0 w-full h-full pointer-events-none z-20"
      viewBox="0 0 100 100"
      preserveAspectRatio="none"
      initial={{ opacity: 0 }}
      animate={{ opacity: [0, 1, 1, 0] }}
      transition={{ duration: 1.5, times: [0, 0.1, 0.7, 1] }}
    >
      {/* Main cracks radiating from center */}
      {Array.from({ length: 12 }).map((_, i) => {
        const angle = (i / 12) * 360;
        const length = 45 + Math.random() * 10;
        const endX = 50 + Math.cos((angle * Math.PI) / 180) * length;
        const endY = 50 + Math.sin((angle * Math.PI) / 180) * length;
        
        // Create jagged crack path
        const midX = 50 + Math.cos((angle * Math.PI) / 180) * (length * 0.4) + (Math.random() - 0.5) * 5;
        const midY = 50 + Math.sin((angle * Math.PI) / 180) * (length * 0.4) + (Math.random() - 0.5) * 5;
        
        return (
          <motion.path
            key={i}
            d={`M 50 50 L ${midX} ${midY} L ${endX} ${endY}`}
            stroke="rgba(255,255,255,0.9)"
            strokeWidth="0.15"
            fill="none"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 0.3, delay: i * 0.02 }}
          />
        );
      })}
      
      {/* Secondary cracks */}
      {Array.from({ length: 8 }).map((_, i) => {
        const angle = (i / 8) * 360 + 22.5;
        const startDist = 15 + Math.random() * 10;
        const startX = 50 + Math.cos((angle * Math.PI) / 180) * startDist;
        const startY = 50 + Math.sin((angle * Math.PI) / 180) * startDist;
        const branchAngle = angle + (Math.random() - 0.5) * 60;
        const length = 20 + Math.random() * 15;
        const endX = startX + Math.cos((branchAngle * Math.PI) / 180) * length;
        const endY = startY + Math.sin((branchAngle * Math.PI) / 180) * length;
        
        return (
          <motion.line
            key={`branch-${i}`}
            x1={startX}
            y1={startY}
            x2={endX}
            y2={endY}
            stroke="rgba(255,255,255,0.6)"
            strokeWidth="0.1"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 0.2, delay: 0.15 + i * 0.03 }}
          />
        );
      })}
      
      {/* Impact point */}
      <motion.circle
        cx="50"
        cy="50"
        r="1.5"
        fill="none"
        stroke="white"
        strokeWidth="0.3"
        initial={{ scale: 0 }}
        animate={{ scale: [0, 1.5, 1] }}
        transition={{ duration: 0.2 }}
      />
    </motion.svg>
  );
}
