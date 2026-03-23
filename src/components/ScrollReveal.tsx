"use client";

import React, { useEffect, useRef, useState } from "react";
import { animate as anime } from "animejs";

interface ScrollRevealProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  duration?: number;
  direction?: "up" | "down" | "left" | "right" | "fade";
  distance?: number;
  threshold?: number;
  once?: boolean;
}

export function ScrollReveal({
  children,
  className = "",
  delay = 0,
  duration = 900,
  direction = "up",
  distance = 40,
  threshold = 0.15,
  once = true,
}: ScrollRevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [hasAnimated, setHasAnimated] = useState(false);

  useEffect(() => {
    if (!ref.current) return;

    // Set initial state
    const el = ref.current;
    const initial: Record<string, number> = { opacity: 0 };
    
    if (direction === "up") initial.translateY = distance;
    else if (direction === "down") initial.translateY = -distance;
    else if (direction === "left") initial.translateX = distance;
    else if (direction === "right") initial.translateX = -distance;

    Object.assign(el.style, {
      opacity: "0",
      transform: `translate(${initial.translateX || 0}px, ${initial.translateY || 0}px)`,
    });

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && (!once || !hasAnimated)) {
          setHasAnimated(true);

          const animateProps: Record<string, any> = {
            targets: el,
            opacity: [0, 1],
            duration,
            delay,
            easing: "outQuart",
          };

          if (direction === "up" || direction === "down") {
            animateProps.translateY = [initial.translateY, 0];
          } else if (direction === "left" || direction === "right") {
            animateProps.translateX = [initial.translateX, 0];
          }

          anime(animateProps);

          if (once) observer.unobserve(el);
        }
      },
      { threshold }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [delay, direction, distance, duration, hasAnimated, once, threshold]);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
