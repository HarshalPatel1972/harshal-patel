"use client";

import { ReactNode, useEffect } from "react";
import { motion } from "framer-motion";
import { Preloader } from "@/components/effects/Preloader";
import { PreloaderProvider, usePreloader } from "@/lib/preloader-context";

interface PreloaderWrapperProps {
  children: ReactNode;
}

/**
 * Client-side wrapper that shows the real website BEHIND the preloader.
 * When glass breaks, the website is revealed through the cracks.
 */
function PreloaderContent({ children }: PreloaderWrapperProps) {
  const { isComplete } = usePreloader();

  // Lock scrolling during preloader
  useEffect(() => {
    if (!isComplete) {
      document.body.classList.add("preloader-active");
      document.documentElement.classList.add("preloader-active");
    } else {
      document.body.classList.remove("preloader-active");
      document.documentElement.classList.remove("preloader-active");
    }
    return () => {
      document.body.classList.remove("preloader-active");
      document.documentElement.classList.remove("preloader-active");
    };
  }, [isComplete]);

  return (
    <>
      {/* REAL WEBSITE - Always rendered, behind preloader */}
      <div className="relative">
        {children}
      </div>

      {/* PRELOADER - On top, glass breaks to reveal website behind */}
      <Preloader />
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
