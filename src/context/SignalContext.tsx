"use client";

import React, { createContext, useContext, useState, useRef, useEffect } from "react";
import { animate as anime, utils, createTimeline } from "animejs";

type SignalType = "PRESSURE" | "PRESSURE PRESSURE PRESSURE" | null;

interface SignalContextType {
  triggerSignal: (type: SignalType) => void;
}

const SignalContext = createContext<SignalContextType | undefined>(undefined);

export function SignalProvider({ children }: { children: React.ReactNode }) {
  const [signal, setSignal] = useState<SignalType>(null);
  const signalRef = useRef<HTMLDivElement>(null);

  const triggerSignal = (type: SignalType) => {
    if (!type) return;
    setSignal(type);
  };

  useEffect(() => {
    if (signal) {
      const el = signalRef.current;
      if (!el) return;

      const tl = createTimeline({
        onComplete: () => setSignal(null)
      });

      tl.add(el, {
        opacity: [0, 1],
        scale: [0.8, 1.3],
        rotate: [-5, 5],
        duration: 300,
        ease: 'easeOutExpo'
      });

      tl.add(el, {
        translateX: () => utils.random(-20, 20),
        translateY: () => utils.random(-20, 20),
        duration: 80,
        loop: 8,
        direction: 'alternate',
        ease: 'linear'
      });

      tl.add(el, {
        opacity: 0,
        scale: 3,
        duration: 500,
        ease: 'easeInExpo'
      }, "+=800");
    }
  }, [signal]);

  return (
    <SignalContext.Provider value={{ triggerSignal }}>
      {children}
      {signal && (
        <div 
          ref={signalRef}
          className="fixed inset-0 z-[200000] flex items-center justify-center pointer-events-none select-none"
        >
          <div className="bg-[var(--accent-blood)] text-white font-black font-display px-6 py-4 md:px-10 md:py-8 text-4xl md:text-9xl tracking-tighter italic border-4 md:border-8 border-black shadow-[10px_10px_0px_rgba(0,0,0,1)] md:shadow-[20px_20px_0px_rgba(0,0,0,1)] rotate-[-3deg] text-center flex flex-col items-center leading-[0.8]">
            {signal === "PRESSURE PRESSURE PRESSURE" ? (
              <>
                <span className="block md:hidden">PRESSURE!</span>
                <span className="block md:hidden">PRESSURE!</span>
                <span className="block md:hidden text-5xl">PRESSURE!!</span>
                <span className="hidden md:block">PRESSURE PRESSURE PRESSURE</span>
              </>
            ) : (
              <span>{signal}!</span>
            )}
          </div>
        </div>
      )}
    </SignalContext.Provider>
  );
}

export function useSignals() {
  const context = useContext(SignalContext);
  if (context === undefined) {
    throw new Error("useSignals must be used within a SignalProvider");
  }
  return context;
}
