"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useRef, useEffect } from "react";
import { usePreloader } from "@/lib/preloader-context";

/**
 * Cinematic preloader with hand-breaking-glass effect.
 * 
 * ASSET REQUIREMENTS:
 * - Place video at: /public/assets/hand-touch.webm (with alpha channel)
 * - Video should be ~4 seconds, hand touches screen at ~70% (2.8s)
 */
export function Preloader() {
  const { setComplete } = usePreloader();
  const [showCracks, setShowCracks] = useState(false);
  const [shouldExit, setShouldExit] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Sync crack appearance with video timestamp
  const handleTimeUpdate = () => {
    const video = videoRef.current;
    if (video && video.duration) {
      const progress = video.currentTime / video.duration;
      // Trigger cracks at 70% of video duration
      if (progress >= 0.7 && !showCracks) {
        setShowCracks(true);
      }
    }
  };

  // Trigger exit after video ends
  const handleVideoEnd = () => {
    setTimeout(() => {
      setShouldExit(true);
    }, 500); // Brief pause to let cracks settle
  };

  // Signal completion after exit animation
  useEffect(() => {
    if (shouldExit) {
      const timer = setTimeout(() => {
        setComplete();
      }, 800); // Match exit animation duration
      return () => clearTimeout(timer);
    }
  }, [shouldExit, setComplete]);

  return (
    <AnimatePresence>
      {!shouldExit && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden bg-black"
          initial={{ opacity: 1 }}
          exit={{
            opacity: 0,
            scale: 1.5,
            transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] },
          }}
        >
          {/* State A: Misty/Foggy Background */}
          <div className="absolute inset-0 overflow-hidden">
            <MistyBackground />
          </div>

          {/* State B: Hand Video Layer */}
          <video
            ref={videoRef}
            className="absolute inset-0 h-full w-full object-cover"
            src="/assets/hand-touch.webm"
            muted
            playsInline
            autoPlay
            onTimeUpdate={handleTimeUpdate}
            onEnded={handleVideoEnd}
          />

          {/* State C & D: Crack Overlay */}
          <CrackOverlay visible={showCracks} />

          {/* Fallback text for loading state */}
          <motion.div
            className="absolute bottom-8 left-1/2 -translate-x-1/2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <span className="font-mono text-xs uppercase tracking-widest text-white/40">
              Loading experience...
            </span>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/**
 * Animated misty/foggy background with CSS noise and gradient animation.
 */
function MistyBackground() {
  return (
    <>
      {/* Gradient layer */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-b from-zinc-900 via-black to-zinc-950"
        animate={{
          background: [
            "linear-gradient(to bottom, #18181b, #000000, #09090b)",
            "linear-gradient(to bottom, #09090b, #18181b, #000000)",
            "linear-gradient(to bottom, #000000, #09090b, #18181b)",
          ],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          repeatType: "reverse",
          ease: "easeInOut",
        }}
      />

      {/* Noise overlay */}
      <div
        className="absolute inset-0 opacity-[0.15]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        }}
      />

      {/* Fog particles */}
      <motion.div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at 50% 50%, rgba(255,255,255,0.03) 0%, transparent 70%)",
        }}
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
    </>
  );
}

/**
 * Cracked glass SVG overlay.
 * Appears at the moment of impact, then shatters.
 */
function CrackOverlay({ visible }: { visible: boolean }) {
  return (
    <motion.div
      className="pointer-events-none absolute inset-0 flex items-center justify-center"
      initial={{ opacity: 0 }}
      animate={visible ? { opacity: 1 } : { opacity: 0 }}
      transition={{ duration: 0.1 }}
    >
      <svg
        viewBox="0 0 800 800"
        className="h-full w-full"
        style={{ filter: "drop-shadow(0 0 10px rgba(255,255,255,0.3))" }}
      >
        {/* Impact point */}
        <motion.circle
          cx="400"
          cy="400"
          r="5"
          fill="white"
          initial={{ scale: 0, opacity: 0 }}
          animate={visible ? { scale: [0, 3, 1], opacity: [0, 1, 0.8] } : {}}
          transition={{ duration: 0.2 }}
        />

        {/* Main cracks radiating from center */}
        <motion.g
          stroke="white"
          strokeWidth="2"
          fill="none"
          strokeLinecap="round"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={visible ? { pathLength: 1, opacity: 0.9 } : {}}
          transition={{ duration: 0.4, delay: 0.05 }}
        >
          {/* Primary cracks */}
          <motion.path d="M400,400 L320,280 L280,180" />
          <motion.path d="M400,400 L520,300 L600,220" />
          <motion.path d="M400,400 L280,450 L150,480" />
          <motion.path d="M400,400 L480,520 L550,650" />
          <motion.path d="M400,400 L350,550 L300,700" />
          <motion.path d="M400,400 L550,420 L700,400" />
          <motion.path d="M400,400 L450,280 L480,150" />
          <motion.path d="M400,400 L250,350 L100,320" />
        </motion.g>

        {/* Secondary cracks */}
        <motion.g
          stroke="white"
          strokeWidth="1"
          fill="none"
          strokeLinecap="round"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={visible ? { pathLength: 1, opacity: 0.6 } : {}}
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          <motion.path d="M320,280 L250,320 L180,350" />
          <motion.path d="M520,300 L580,350 L650,380" />
          <motion.path d="M480,520 L520,580 L580,620" />
          <motion.path d="M350,550 L380,620 L420,700" />
          <motion.path d="M450,280 L500,250 L560,220" />
          <motion.path d="M280,450 L250,520 L200,600" />
          <motion.path d="M550,420 L600,480 L680,530" />
          <motion.path d="M320,280 L360,220 L380,140" />
        </motion.g>

        {/* Tertiary fine cracks */}
        <motion.g
          stroke="rgba(255,255,255,0.5)"
          strokeWidth="0.5"
          fill="none"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={visible ? { pathLength: 1, opacity: 0.4 } : {}}
          transition={{ duration: 0.25, delay: 0.35 }}
        >
          <motion.path d="M250,320 L220,380 L160,420" />
          <motion.path d="M580,350 L620,400 L700,450" />
          <motion.path d="M520,580 L560,640 L590,720" />
          <motion.path d="M380,620 L350,680 L320,760" />
          <motion.path d="M500,250 L530,200 L580,130" />
          <motion.path d="M250,520 L200,560 L130,620" />
          <motion.path d="M360,220 L320,170 L260,100" />
          <motion.path d="M600,480 L650,520 L730,580" />
        </motion.g>
      </svg>

      {/* Shatter effect - glass shards flying out */}
      {visible && (
        <motion.div
          className="absolute inset-0 bg-white/5"
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 0.3, 0] }}
          transition={{ duration: 0.3, delay: 0.4 }}
        />
      )}
    </motion.div>
  );
}
