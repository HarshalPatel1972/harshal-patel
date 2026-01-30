"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useRef, useEffect } from "react";
import { usePreloader } from "@/lib/preloader-context";

/**
 * Cinematic video preloader with CSS glass shatter effect
 */
export function Preloader() {
  const { setComplete } = usePreloader();
  const [isShattered, setIsShattered] = useState(false);
  const [showShards, setShowShards] = useState(false);
  const [shouldUnmount, setShouldUnmount] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Trigger glass break at finger touch (~3.0s)
  const handleTimeUpdate = () => {
    const video = videoRef.current;
    if (video && video.currentTime > 3.0 && !isShattered) {
      setIsShattered(true);
      setShowShards(true);
    }
  };

  const handleVideoEnd = () => {
    if (!isShattered) {
      setIsShattered(true);
      setShowShards(true);
    }
  };

  // Unmount after shatter animation
  useEffect(() => {
    if (isShattered) {
      const timer = setTimeout(() => {
        setShouldUnmount(true);
        setComplete();
      }, 1200);
      return () => clearTimeout(timer);
    }
  }, [isShattered, setComplete]);

  return (
    <AnimatePresence>
      {!shouldUnmount && (
        <motion.div
          className="fixed inset-0 z-50 overflow-hidden bg-black"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          {/* Video Layer */}
          <video
            ref={videoRef}
            className="absolute inset-0 h-full w-full object-cover"
            style={{ filter: "brightness(0.7) contrast(1.1)" }}
            src="/assets/test-0.mp4"
            muted
            playsInline
            autoPlay
            onTimeUpdate={handleTimeUpdate}
            onEnded={handleVideoEnd}
          />

          {/* Glass Shatter Effect */}
          {showShards && <GlassShatter />}

          {/* Vignette */}
          <div
            className="pointer-events-none absolute inset-0"
            style={{
              background: "radial-gradient(ellipse at 50% 50%, transparent 30%, rgba(0,0,0,0.5) 100%)",
            }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/**
 * CSS Glass Shatter Animation - shards flying outward
 */
function GlassShatter() {
  // Generate random glass shards
  const shards = Array.from({ length: 30 }, (_, i) => ({
    id: i,
    size: 20 + Math.random() * 80,
    startX: 45 + Math.random() * 10, // Center area %
    startY: 45 + Math.random() * 10,
    endX: (Math.random() - 0.5) * 200, // Random direction
    endY: (Math.random() - 0.5) * 200,
    rotation: Math.random() * 720 - 360,
    delay: Math.random() * 0.15,
    duration: 0.6 + Math.random() * 0.4,
  }));

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {/* Impact flash */}
      <motion.div
        className="absolute inset-0 bg-white"
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 0.8, 0] }}
        transition={{ duration: 0.2, ease: "easeOut" }}
      />

      {/* Crack lines from center */}
      <motion.svg
        className="absolute inset-0 w-full h-full"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 1, 0] }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        {Array.from({ length: 12 }).map((_, i) => {
          const angle = (i / 12) * 360;
          const length = 30 + Math.random() * 20;
          const endX = 50 + Math.cos((angle * Math.PI) / 180) * length;
          const endY = 50 + Math.sin((angle * Math.PI) / 180) * length;
          return (
            <motion.line
              key={i}
              x1="50"
              y1="50"
              x2={endX}
              y2={endY}
              stroke="rgba(255,255,255,0.8)"
              strokeWidth="0.3"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 0.2, delay: i * 0.02 }}
            />
          );
        })}
      </motion.svg>

      {/* Flying glass shards */}
      {shards.map((shard) => (
        <motion.div
          key={shard.id}
          className="absolute"
          style={{
            left: `${shard.startX}%`,
            top: `${shard.startY}%`,
            width: shard.size,
            height: shard.size,
          }}
          initial={{
            x: 0,
            y: 0,
            rotate: 0,
            opacity: 1,
            scale: 1,
          }}
          animate={{
            x: shard.endX + "vw",
            y: shard.endY + "vh",
            rotate: shard.rotation,
            opacity: 0,
            scale: 0.3,
          }}
          transition={{
            duration: shard.duration,
            delay: shard.delay,
            ease: [0.22, 1, 0.36, 1],
          }}
        >
          {/* Glass shard shape */}
          <svg
            viewBox="0 0 100 100"
            className="w-full h-full"
            style={{
              filter: "drop-shadow(0 0 10px rgba(255,255,255,0.3))",
            }}
          >
            <polygon
              points={generateShardPoints()}
              fill="rgba(200, 220, 255, 0.4)"
              stroke="rgba(255,255,255,0.6)"
              strokeWidth="2"
            />
          </svg>
        </motion.div>
      ))}
    </div>
  );
}

// Generate random polygon points for glass shard shape
function generateShardPoints(): string {
  const points = [];
  const numPoints = 4 + Math.floor(Math.random() * 3);
  for (let i = 0; i < numPoints; i++) {
    const angle = (i / numPoints) * 360;
    const radius = 30 + Math.random() * 20;
    const x = 50 + Math.cos((angle * Math.PI) / 180) * radius;
    const y = 50 + Math.sin((angle * Math.PI) / 180) * radius;
    points.push(`${x},${y}`);
  }
  return points.join(" ");
}
