"use client";

import { ReactLenis } from "lenis/react";
import { ReactNode } from "react";

interface SmoothScrollProps {
  children: ReactNode;
}

/**
 * Smooth scroll wrapper using Lenis.
 * Configured for performant mobile experience with touch-friendly settings.
 * Does not interfere with native browser gestures.
 */
export function SmoothScroll({ children }: SmoothScrollProps) {
  return (
    <ReactLenis
      root
      options={{
        lerp: 0.1,
        duration: 1.2,
        smoothWheel: true,
        touchMultiplier: 2,
        infinite: false,
        orientation: "vertical",
        gestureOrientation: "vertical",
        syncTouch: false,
        syncTouchLerp: 0.075,
        touchInertiaExponent: 35,
      }}
    >
      {children}
    </ReactLenis>
  );
}
