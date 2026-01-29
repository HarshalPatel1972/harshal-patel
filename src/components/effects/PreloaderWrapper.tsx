"use client";

import { ReactNode } from "react";
import { motion } from "framer-motion";
import { Preloader } from "@/components/effects/Preloader";
import { PreloaderProvider, usePreloader } from "@/lib/preloader-context";

interface PreloaderWrapperProps {
  children: ReactNode;
}

/**
 * Client-side wrapper that manages preloader state and entrance animations.
 * Children animate with a "falling through" effect when preloader completes.
 */
function PreloaderContent({ children }: PreloaderWrapperProps) {
  const { isComplete } = usePreloader();

  return (
    <>
      <Preloader />
      
      {/* Main content with "fall-through" entrance animation */}
      <motion.div
        initial={{ opacity: 0, scale: 1.1 }}
        animate={{
          opacity: isComplete ? 1 : 0,
          scale: isComplete ? 1 : 1.1,
        }}
        transition={{
          duration: 0.6,
          ease: [0.22, 1, 0.36, 1], // easeOutQuint
          delay: isComplete ? 0 : 0,
        }}
        style={{
          pointerEvents: isComplete ? "auto" : "none",
        }}
      >
        {children}
      </motion.div>
    </>
  );
}

export function PreloaderWrapper({ children }: PreloaderWrapperProps) {
  return (
    <PreloaderProvider>
      <PreloaderContent>{children}</PreloaderContent>
    </PreloaderProvider>
  );
}
