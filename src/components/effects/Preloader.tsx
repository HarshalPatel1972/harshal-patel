"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useRef, useEffect } from "react";
import { usePreloader } from "@/lib/preloader-context";

/**
 * Cinematic video preloader with "falling through the screen" effect.
 * 
 * ASSET REQUIREMENT:
 * Place your video at: /public/assets/intro.mp4
 * - The video should contain the shattering effect
 * - Shatter moment should be around 3.8-4.0 seconds
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
      }, 800); // Match exit animation duration
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
            ease: [0.87, 0, 0.13, 1], // circIn
          }}
        >
          {/* Video Layer */}
          <video
            ref={videoRef}
            className="absolute inset-0 h-full w-full object-cover"
            src="/assets/test-0.mp4"
            muted
            playsInline
            autoPlay
            onTimeUpdate={handleTimeUpdate}
            onEnded={handleVideoEnd}
          />

          {/* Loading indicator (only visible before video loads) */}
          <motion.div
            className="absolute bottom-8 left-1/2 -translate-x-1/2"
            initial={{ opacity: 1 }}
            animate={{ opacity: 0 }}
            transition={{ delay: 0.5, duration: 0.3 }}
          >
            <span className="font-mono text-xs uppercase tracking-widest text-white/40">
              Loading...
            </span>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
