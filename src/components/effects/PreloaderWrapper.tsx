import { ReactNode } from "react";
import { PreloaderProvider } from "@/lib/preloader-context";
import { Preloader } from "@/components/effects/Preloader";

interface PreloaderWrapperProps {
  children: ReactNode;
}

export function PreloaderWrapper({ children }: PreloaderWrapperProps) {
  return (
    <PreloaderProvider>
      <div className="bg-void min-h-screen relative">
         <Preloader />
         {children}
      </div>
    </PreloaderProvider>
  );
}
