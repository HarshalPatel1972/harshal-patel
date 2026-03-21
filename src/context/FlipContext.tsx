"use client";

import React, { createContext, useContext, useState, useCallback } from "react";

interface FlipContextType {
  isActive: boolean;
  isPreloading: boolean;
  loadingSlug: string | null;
  screenshotSrc: string;
  gridConfig: { cols: number; rows: number };
  redirectUrl: string;
  type: 'FLIP' | 'WARP';
  triggerTransition: (slug: string, redirectUrl: string, type?: 'FLIP' | 'WARP') => void;
  resetTransition: () => void;
  setPreloading: (loading: boolean, slug: string | null) => void;
}

const FlipContext = createContext<FlipContextType | undefined>(undefined);

export function FlipProvider({ children }: { children: React.ReactNode }) {
  const [isActive, setIsActive] = useState(false);
  const [isPreloading, setIsPreloading] = useState(false);
  const [loadingSlug, setLoadingSlug] = useState<string | null>(null);
  const [screenshotSrc, setScreenshotSrc] = useState("");
  const [gridConfig, setGridConfig] = useState({ cols: 16, rows: 9 });
  const [redirectUrl, setRedirectUrl] = useState("");
  const [type, setType] = useState<'FLIP' | 'WARP'>('FLIP');

  const resetTransition = useCallback(() => {
    setIsActive(false);
    setIsPreloading(false);
    setLoadingSlug(null);
    setScreenshotSrc("");
    setGridConfig({ cols: 16, rows: 9 });
    setRedirectUrl("");
    setType('FLIP');
  }, []);

  const setPreloading = useCallback((loading: boolean, slug: string | null) => {
    setIsPreloading(loading);
    setLoadingSlug(slug);
  }, []);

  const triggerTransition = useCallback((slug: string, url: string, transitionType: 'FLIP' | 'WARP' = 'FLIP') => {
    const isMobile = window.innerWidth < 768;
    const normalizedSlug = slug.toLowerCase();

    const resolvedSrc = isMobile 
      ? `/screenshots/${normalizedSlug}.jpg` 
      : `/screenshots/${normalizedSlug}.webp`;
    
    const resolvedCols = isMobile ? 6 : 16;
    const resolvedRows = isMobile ? 10 : 9;

    setScreenshotSrc(resolvedSrc);
    setGridConfig({ cols: resolvedCols, rows: resolvedRows });
    setRedirectUrl(url);
    setType(transitionType);
    setIsActive(true);
  }, []);

  // Listen for back-navigation
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
    <FlipContext.Provider value={{ 
      isActive, 
      isPreloading, 
      loadingSlug, 
      screenshotSrc, 
      gridConfig, 
      redirectUrl, 
      type,
      triggerTransition, 
      resetTransition,
      setPreloading 
    }}>
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
