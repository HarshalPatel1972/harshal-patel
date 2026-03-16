"use client";

import React, { createContext, useContext, useState, useCallback } from "react";

interface FlipContextType {
  isActive: boolean;
  screenshotSrc: string;
  gridConfig: { cols: number; rows: number };
  redirectUrl: string;
  triggerTransition: (slug: string, redirectUrl: string) => void;
  resetTransition: () => void;
}

const FlipContext = createContext<FlipContextType | undefined>(undefined);

export function FlipProvider({ children }: { children: React.ReactNode }) {
  const [isActive, setIsActive] = useState(false);
  const [screenshotSrc, setScreenshotSrc] = useState("");
  const [gridConfig, setGridConfig] = useState({ cols: 16, rows: 9 });
  const [redirectUrl, setRedirectUrl] = useState("");

  const resetTransition = useCallback(() => {
    setIsActive(false);
    setScreenshotSrc("");
    setGridConfig({ cols: 16, rows: 9 });
    setRedirectUrl("");
  }, []);

  const triggerTransition = useCallback((slug: string, url: string) => {
    // Detect screen size at the moment of click
    const isMobile = window.innerWidth < 768;
    
    // Normalize slug to lowercase just in case
    const normalizedSlug = slug.toLowerCase();

    // Resolve paths and grid dimensions
    const resolvedSrc = isMobile 
      ? `/screenshots_phone/${normalizedSlug}.jpg` 
      : `/screenshots/${normalizedSlug}.webp`;
    
    const resolvedCols = isMobile ? 6 : 16;
    const resolvedRows = isMobile ? 10 : 9;

    setScreenshotSrc(resolvedSrc);
    setGridConfig({ cols: resolvedCols, rows: resolvedRows });
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
    <FlipContext.Provider value={{ isActive, screenshotSrc, gridConfig, redirectUrl, triggerTransition, resetTransition }}>
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
