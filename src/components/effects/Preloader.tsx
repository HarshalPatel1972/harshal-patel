"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useRef, useEffect } from "react";
import { usePreloader } from "@/lib/preloader-context";

/**
 * Preloader with glass breaking effect.
 * - Shows hand video approaching (stops before glass breaks in video)
 * - At touch moment: CSS glass shatters
 * - Real website is visible BEHIND through the breaking glass
 */
export function Preloader() {
  const { setComplete } = usePreloader();
  const [phase, setPhase] = useState<"video" | "shatter" | "done">("video");
  const videoRef = useRef<HTMLVideoElement>(null);

  // Stop video before glass breaks (~3.0s) and trigger CSS shatter
  const handleTimeUpdate = () => {
    const video = videoRef.current;
    if (video && video.currentTime > 3.0 && phase === "video") {
      video.pause();
      setPhase("shatter");
    }
  };

  // Fallback if video ends
  const handleVideoEnd = () => {
    if (phase === "video") {
      setPhase("shatter");
    }
  };

  // After shatter animation, mark complete
  useEffect(() => {
    if (phase === "shatter") {
      const timer = setTimeout(() => {
        setPhase("done");
        setComplete();
      }, 1500); // Shatter animation duration
      return () => clearTimeout(timer);
    }
  }, [phase, setComplete]);

  if (phase === "done") return null;

  return (
    <div className="fixed inset-0 z-50 pointer-events-none">
      <AnimatePresence>
        {phase === "video" && (
          <motion.div
            className="absolute inset-0 bg-black"
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            {/* Video: Only hand approaching, no glass break */}
            <video
              ref={videoRef}
              className="absolute inset-0 h-full w-full object-cover"
              style={{ filter: "brightness(0.8) contrast(1.1)" }}
              src="/assets/test-0.mp4"
              muted
              playsInline
              autoPlay
              onTimeUpdate={handleTimeUpdate}
              onEnded={handleVideoEnd}
            />

            {/* Light vignette */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                background: "radial-gradient(ellipse at 50% 50%, transparent 40%, rgba(0,0,0,0.4) 100%)",
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Glass Shatter - Website visible behind through cracks */}
      {phase === "shatter" && <GlassShatter />}
    </div>
  );
}

/**
 * Glass Shatter Animation
 * Glass panel on top breaks into shards, revealing website behind
 */
function GlassShatter() {
  // Create glass shards that fly outward
  const shards = Array.from({ length: 40 }, (_, i) => {
    const angle = Math.random() * 360;
    const distance = 50 + Math.random() * 100;
    return {
      id: i,
      // Starting position - distributed across screen
      startX: 10 + Math.random() * 80,
      startY: 10 + Math.random() * 80,
      // Movement direction
      endX: Math.cos((angle * Math.PI) / 180) * distance,
      endY: Math.sin((angle * Math.PI) / 180) * distance,
      // Rotation
      rotation: Math.random() * 720 - 360,
      // Size
      width: 50 + Math.random() * 150,
      height: 50 + Math.random() * 150,
      // Timing
      delay: Math.random() * 0.2,
      duration: 0.8 + Math.random() * 0.4,
    };
  });

  return (
    <div className="absolute inset-0 overflow-hidden">
      {/* Impact flash */}
      <motion.div
        className="absolute inset-0 bg-white"
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 0.6, 0] }}
        transition={{ duration: 0.15, ease: "easeOut" }}
      />

      {/* Glass shards - each reveals part of website behind */}
      {shards.map((shard) => (
        <motion.div
          key={shard.id}
          className="absolute"
          style={{
            left: `${shard.startX}%`,
            top: `${shard.startY}%`,
            width: shard.width,
            height: shard.height,
            // Glass appearance
            background: "linear-gradient(135deg, rgba(255,255,255,0.3) 0%, rgba(200,220,255,0.15) 50%, rgba(255,255,255,0.2) 100%)",
            backdropFilter: "blur(2px)",
            border: "1px solid rgba(255,255,255,0.4)",
            boxShadow: "0 0 20px rgba(255,255,255,0.2), inset 0 0 20px rgba(255,255,255,0.1)",
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
            scale: 0.5,
          }}
          transition={{
            duration: shard.duration,
            delay: shard.delay,
            ease: [0.22, 1, 0.36, 1],
          }}
        >
          {/* Crack pattern on shard */}
          <svg className="absolute inset-0 w-full h-full opacity-50" viewBox="0 0 100 100">
            <line x1="0" y1="0" x2="100" y2="100" stroke="rgba(255,255,255,0.5)" strokeWidth="1" />
            <line x1="100" y1="0" x2="0" y2="100" stroke="rgba(255,255,255,0.3)" strokeWidth="0.5" />
            <line x1="50" y1="0" x2="50" y2="100" stroke="rgba(255,255,255,0.2)" strokeWidth="0.5" />
          </svg>
        </motion.div>
      ))}

      {/* Center impact point with cracks */}
      <motion.svg
        className="absolute inset-0 w-full h-full"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        initial={{ opacity: 1 }}
        animate={{ opacity: 0 }}
        transition={{ duration: 0.8, delay: 0.3 }}
      >
        {/* Radial cracks from center */}
        {Array.from({ length: 16 }).map((_, i) => {
          const angle = (i / 16) * 360;
          const length = 40 + Math.random() * 20;
          const endX = 50 + Math.cos((angle * Math.PI) / 180) * length;
          const endY = 50 + Math.sin((angle * Math.PI) / 180) * length;
          return (
            <motion.line
              key={i}
              x1="50"
              y1="50"
              x2={endX}
              y2={endY}
              stroke="rgba(255,255,255,0.7)"
              strokeWidth="0.2"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 0.15, delay: i * 0.01 }}
            />
          );
        })}
        {/* Impact point */}
        <motion.circle
          cx="50"
          cy="50"
          r="2"
          fill="white"
          initial={{ scale: 0, opacity: 1 }}
          animate={{ scale: [0, 3, 0], opacity: [1, 1, 0] }}
          transition={{ duration: 0.3 }}
        />
      </motion.svg>
    </div>
  );
}
