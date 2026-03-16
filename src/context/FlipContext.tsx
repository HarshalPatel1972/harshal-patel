"use client";

import React, { createContext, useContext, useState, useCallback } from "react";

interface FlipContextType {
  isActive: boolean;
  screenshotSrc: string;
  redirectUrl: string;
  triggerTransition: (screenshotSrc: string, redirectUrl: string) => void;
  resetTransition: () => void;
}

const FlipContext = createContext<FlipContextType | undefined>(undefined);

export function FlipProvider({ children }: { children: React.ReactNode }) {
  const [isActive, setIsActive] = useState(false);
  const [screenshotSrc, setScreenshotSrc] = useState("");
  const [redirectUrl, setRedirectUrl] = useState("");

  const resetTransition = useCallback(() => {
    setIsActive(false);
    setScreenshotSrc("");
    setRedirectUrl("");
  }, []);

  const triggerTransition = useCallback((src: string, url: string) => {
    setScreenshotSrc(src);
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
    <FlipContext.Provider value={{ isActive, screenshotSrc, redirectUrl, triggerTransition, resetTransition }}>
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
