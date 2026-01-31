"use client";

import { ReactNode } from "react";
import { PreloaderProvider } from "@/lib/preloader-context";

interface PreloaderWrapperProps {
  children: ReactNode;
}

export function PreloaderWrapper({ children }: PreloaderWrapperProps) {
  return (
    <PreloaderProvider>
      <div className="bg-black min-h-screen relative">
         {/* Preloader Temporarily Disabled for Build Stability */}
         {children}
      </div>
    </PreloaderProvider>
  );
}
