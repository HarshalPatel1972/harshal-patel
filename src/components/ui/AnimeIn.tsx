"use client";

import React, { useEffect, useRef, useState } from "react";
import { animate as anime, set } from "animejs";

interface AnimeInProps {
  children?: React.ReactNode;
  initial?: anime.AnimeParams;
  animate?: anime.AnimeParams;
  duration?: number;
  delay?: number;
  easing?: string;
  threshold?: number;
  className?: string;
  style?: React.CSSProperties;
  onComplete?: () => void;
}

export function AnimeIn({
  children,
  initial,
  animate,
  duration = 800,
  delay = 0,
  easing = "easeOutExpo",
  threshold = 0.1,
  className = "",
  style,
  onComplete,
}: AnimeInProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [hasAnimated, setHasAnimated] = useState(false);

  useEffect(() => {
    if (!containerRef.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated && containerRef.current) {
          setHasAnimated(true);
          
          const params: any = {
            ...animate,
            duration,
            delay,
            easing,
            onComplete,
          };

          // In animejs v4, targets is the first argument
          anime(containerRef.current, params);
          
          observer.unobserve(containerRef.current!);
        }
      },
      { threshold }
    );

    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, [animate, duration, delay, easing, threshold, hasAnimated, onComplete]);

  // Apply initial styles immediately
  useEffect(() => {
    if (containerRef.current && initial && !hasAnimated) {
      set(containerRef.current, initial as any);
    }
  }, [initial, hasAnimated]);

  return (
    <div ref={containerRef} className={className} style={style}>
      {children}
    </div>
  );
}
