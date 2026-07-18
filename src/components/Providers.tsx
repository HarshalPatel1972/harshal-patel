"use client";

import { LanguageProvider } from "@/context/LanguageContext";
import { SignalProvider } from "@/context/SignalContext";
import { FlipProvider } from "@/context/FlipContext";
import { DesignVersionProvider } from "@/components/shared/DesignVersionContext";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <DesignVersionProvider>
      <LanguageProvider>
        <SignalProvider>
          <FlipProvider>
            {children}
          </FlipProvider>
        </SignalProvider>
      </LanguageProvider>
    </DesignVersionProvider>
  );
}

