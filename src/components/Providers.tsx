"use client";

import { LanguageProvider } from "@/context/LanguageContext";
import { SignalProvider } from "@/context/SignalContext";
import { FlipProvider } from "@/context/FlipContext";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <LanguageProvider>
      <SignalProvider>
        <FlipProvider>
          {children}
        </FlipProvider>
      </SignalProvider>
    </LanguageProvider>
  );
}
