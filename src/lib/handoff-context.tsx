"use client";

import { createContext, useContext, useState, ReactNode } from "react";

interface HandoffContextType {
  stage: number;           // 0 to 7 (0=Hidden, 1-7=Progressive Reveal)
  nextStage: () => void;   // Call this when a pillar vanishes
  resetStage: () => void;  // Reset for restarts
}

const HandoffContext = createContext<HandoffContextType | null>(null);

export function HandoffProvider({ children }: { children: ReactNode }) {
  const [stage, setStage] = useState(0);

  const nextStage = () => setStage(prev => Math.min(prev + 1, 7));
  const resetStage = () => setStage(0);

  return (
    <HandoffContext.Provider value={{ stage, nextStage, resetStage }}>
      {children}
    </HandoffContext.Provider>
  );
}

export function useHandoff() {
  const context = useContext(HandoffContext);
  if (!context) {
    throw new Error("useHandoff must be used within HandoffProvider");
  }
  return context;
}
