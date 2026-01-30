"use client";

import { ReactNode, useEffect } from "react";
import { Preloader } from "@/components/effects/Preloader";
import { PreloaderProvider, usePreloader } from "@/lib/preloader-context";

interface PreloaderWrapperProps {
  children: ReactNode;
}

/**
 * Preloader Wrapper
 * - Places the website BEHIND the preloader
 * - Preloader handles the glass fracture overlay
 * - When shards fall, they become transparent, revealing the website on z-index 0
 */
function PreloaderContent({ children }: PreloaderWrapperProps) {
  const { isComplete } = usePreloader();

  // Lock scroll only while preloader active
  useEffect(() => {
    if (!isComplete) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [isComplete]);

  return (
    <div className="relative min-h-screen">
      {/* 1. Real Website Layer (Z-0) */}
      <div 
        className="relative z-0"
        style={{ 
          // Optional: Slight blur initially? No, user wants REAL look immediately through cracks
          opacity: 1 
        }}
      >
        {children}
      </div>

      {/* 2. Preloader Layer (Z-50) */}
      {/* Contains: Video -> Black Glass Layer -> Fracturing Shards */}
      {!isComplete && <Preloader />}
    </div>
  );
}

export function PreloaderWrapper({ children }: PreloaderWrapperProps) {
  return (
    <PreloaderProvider>
      <PreloaderContent>{children}</PreloaderContent>
    </PreloaderProvider>
  );
}
