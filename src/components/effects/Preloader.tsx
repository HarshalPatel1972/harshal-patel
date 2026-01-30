"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useRef, useEffect } from "react";
import { usePreloader } from "@/lib/preloader-context";

/**
 * Cinematic video preloader with "falling through the screen" effect.
 * 
 * ASSET REQUIREMENT:
 * Place your video at: /public/assets/test-0.mp4
 */
export function Preloader() {
  const { setComplete } = usePreloader();
  const [isShattered, setIsShattered] = useState(false);
  const [shouldUnmount, setShouldUnmount] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Detect when the shatter moment occurs (~3.8s)
  const handleTimeUpdate = () => {
    const video = videoRef.current;
    if (video && video.currentTime > 3.8 && !isShattered) {
      setIsShattered(true);
    }
  };

  // Handle video end as fallback
  const handleVideoEnd = () => {
    if (!isShattered) {
      setIsShattered(true);
    }
  };

  // Unmount after exit animation completes
  useEffect(() => {
    if (isShattered) {
      const timer = setTimeout(() => {
        setShouldUnmount(true);
        setComplete();
      }, 800);
      return () => clearTimeout(timer);
    }
  }, [isShattered, setComplete]);

  return (
    <AnimatePresence>
      {!shouldUnmount && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden bg-black"
          initial={{ opacity: 1 }}
          animate={{ opacity: isShattered ? 0 : 1 }}
          transition={{
            duration: 0.8,
            ease: [0.87, 0, 0.13, 1],
          }}
        >
          {/* Video Layer - darkened for cinematic effect */}
          <video
            ref={videoRef}
            className="absolute inset-0 h-full w-full object-cover"
            style={{
              filter: "brightness(0.6) contrast(1.2)",
            }}
            src="/assets/test-0.mp4"
            muted
            playsInline
            autoPlay
            onTimeUpdate={handleTimeUpdate}
            onEnded={handleVideoEnd}
          />

          {/* Dark vignette overlay - hand emerges from darkness */}
          <div
            className="pointer-events-none absolute inset-0"
            style={{
              background: `
                radial-gradient(ellipse 80% 80% at 50% 50%, transparent 20%, rgba(0,0,0,0.7) 80%),
                linear-gradient(to bottom, rgba(0,0,0,0.5) 0%, transparent 30%, transparent 70%, rgba(0,0,0,0.6) 100%)
              `,
            }}
          />

          {/* Top and bottom fog strips */}
          <motion.div
            className="pointer-events-none absolute inset-x-0 top-0 h-32"
            style={{
              background: "linear-gradient(to bottom, black 0%, transparent 100%)",
            }}
            initial={{ opacity: 0.8 }}
            animate={{ opacity: [0.8, 1, 0.8] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
          <motion.div
            className="pointer-events-none absolute inset-x-0 bottom-0 h-32"
            style={{
              background: "linear-gradient(to top, black 0%, transparent 100%)",
            }}
            initial={{ opacity: 0.8 }}
            animate={{ opacity: [0.8, 1, 0.8] }}
            transition={{ duration: 2, repeat: Infinity, delay: 1 }}
          />

          {/* Subtle noise grain overlay */}
          <div
            className="pointer-events-none absolute inset-0 opacity-[0.08]"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
            }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
