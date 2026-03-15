"use client";

import React, { createContext, useContext, useState, useCallback } from "react";

interface FlipContextType {
  isActive: boolean;
  screenshotSrc: string;
  redirectUrl: string;
  triggerTransition: (screenshotSrc: string, redirectUrl: string) => void;
}

const FlipContext = createContext<FlipContextType | undefined>(undefined);

export function FlipProvider({ children }: { children: React.ReactNode }) {
  const [isActive, setIsActive] = useState(false);
  const [screenshotSrc, setScreenshotSrc] = useState("");
  const [redirectUrl, setRedirectUrl] = useState("");

  const triggerTransition = useCallback((src: string, url: string) => {
    setScreenshotSrc(src);
    setRedirectUrl(url);
    setIsActive(true);
  }, []);

  return (
    <FlipContext.Provider value={{ isActive, screenshotSrc, redirectUrl, triggerTransition }}>
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
