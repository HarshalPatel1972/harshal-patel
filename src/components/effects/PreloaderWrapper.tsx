"use client";

import { ReactNode, useState, useEffect } from "react";
import { Preloader } from "@/components/effects/Preloader";
import { PreloaderProvider, usePreloader } from "@/lib/preloader-context";

interface PreloaderWrapperProps {
  children: ReactNode;
}

/**
 * Client-side wrapper that manages preloader state and entrance animations.
 * Children will receive entrance animations AFTER preloader completes.
 */
function PreloaderContent({ children }: PreloaderWrapperProps) {
  const { isComplete } = usePreloader();
  const [showPreloader, setShowPreloader] = useState(true);

  useEffect(() => {
    if (isComplete) {
      // Small delay before unmounting preloader for smooth transition
      const timer = setTimeout(() => {
        setShowPreloader(false);
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [isComplete]);

  return (
    <>
      {showPreloader && <Preloader />}
      <div
        style={{
          opacity: isComplete ? 1 : 0,
          transition: "opacity 0.5s ease-out",
        }}
      >
        {children}
      </div>
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
