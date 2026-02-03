"use client";

import { createContext, useContext, useState, ReactNode } from "react";

interface PreloaderContextType {
  isComplete: boolean;
  setComplete: () => void;
}

const PreloaderContext = createContext<PreloaderContextType | null>(null);

export function PreloaderProvider({ children }: { children: ReactNode }) {
  const [isComplete, setIsComplete] = useState(true);

  const setComplete = () => setIsComplete(true);

  return (
    <PreloaderContext.Provider value={{ isComplete, setComplete }}>
      {children}
    </PreloaderContext.Provider>
  );
}

/**
 * Hook to access preloader state.
 * Use `isComplete` to trigger entrance animations AFTER the glass breaks.
 */
export function usePreloader() {
  const context = useContext(PreloaderContext);
  if (!context) {
    throw new Error("usePreloader must be used within PreloaderProvider");
  }
  return context;
}
