"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

export type DesignVersion = "old" | "new";

interface DesignVersionContextType {
  designVersion: DesignVersion;
  setDesignVersion: (version: DesignVersion) => void;
  isMounted: boolean;
}

const DesignVersionContext = createContext<DesignVersionContextType | undefined>(undefined);

export function DesignVersionProvider({ children }: { children: React.ReactNode }) {
  const [designVersion, setDesignVersionState] = useState<DesignVersion>("old");
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("designVersion") as DesignVersion;
    if (saved === "old" || saved === "new") {
      setDesignVersionState(saved);
    } else {
      // Default to "old" (V1 is the production design)
      localStorage.setItem("designVersion", "old");
    }
    setIsMounted(true);
  }, []);

  const setDesignVersion = (version: DesignVersion) => {
    setDesignVersionState(version);
    localStorage.setItem("designVersion", version);
  };

  return (
    <DesignVersionContext.Provider value={{ designVersion, setDesignVersion, isMounted }}>
      {children}
    </DesignVersionContext.Provider>
  );
}

export function useDesignVersion() {
  const context = useContext(DesignVersionContext);
  if (context === undefined) {
    throw new Error("useDesignVersion must be used within a DesignVersionProvider");
  }
  return context;
}
