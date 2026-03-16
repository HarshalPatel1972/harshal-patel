"use client";

import React, { createContext, useContext, useState, useCallback } from "react";

interface FlipContextType {
  isActive: boolean;
  desktopScreenshotSrc: string;
  mobileScreenshotSrc: string;
  redirectUrl: string;
  triggerTransition: (desktopSrc: string, mobileSrc: string, redirectUrl: string) => void;
  resetTransition: () => void;
}

const FlipContext = createContext<FlipContextType | undefined>(undefined);

export function FlipProvider({ children }: { children: React.ReactNode }) {
  const [isActive, setIsActive] = useState(false);
  const [desktopScreenshotSrc, setDesktopScreenshotSrc] = useState("");
  const [mobileScreenshotSrc, setMobileScreenshotSrc] = useState("");
  const [redirectUrl, setRedirectUrl] = useState("");

  const resetTransition = useCallback(() => {
    setIsActive(false);
    setDesktopScreenshotSrc("");
    setMobileScreenshotSrc("");
    setRedirectUrl("");
  }, []);

  const triggerTransition = useCallback((desktopSrc: string, mobileSrc: string, url: string) => {
    setDesktopScreenshotSrc(desktopSrc);
    setMobileScreenshotSrc(mobileSrc);
    setRedirectUrl(url);
    setIsActive(true);
  }, []);

  // Listen for back-navigation (pageshow event) to reset the transition
  React.useEffect(() => {
    const handlePageShow = (event: any) => {
      if (event.persisted || (window.performance && window.performance.navigation.type === 2)) {
        resetTransition();
      }
    };

    window.addEventListener("pageshow", handlePageShow);
    return () => window.removeEventListener("pageshow", handlePageShow);
  }, [resetTransition]);

  return (
    <FlipContext.Provider value={{ isActive, desktopScreenshotSrc, mobileScreenshotSrc, redirectUrl, triggerTransition, resetTransition }}>
      {children}
    </FlipContext.Provider>
  );
}

export function useFlipTransition() {
  const context = useContext(FlipContext);
  if (context === undefined) {
    throw new Error("useFlipTransition must be used within a FlipProvider");
  }
  return context;
}
