"use client";

import { createContext, useContext, useRef, RefObject } from "react";
import type { CursorHandle } from "@/components/ui/Cursor";

const CursorContext = createContext<RefObject<CursorHandle | null> | null>(null);

export function CursorProvider({ children }: { children: React.ReactNode }) {
  const cursorRef = useRef<CursorHandle | null>(null);
  return (
    <CursorContext.Provider value={cursorRef}>
      {children}
    </CursorContext.Provider>
  );
}

export function useCursor() {
  const ctx = useContext(CursorContext);
  if (!ctx) throw new Error("useCursor must be used within CursorProvider");
  return ctx;
}
