"use client";

import React, { useEffect, useRef } from "react";
import { animate as anime, utils } from "animejs";

/**
 * 🧲 Magnetic Cursor — Optimized Throttled Hooks
 */
export function useMagnetic<T extends HTMLElement = HTMLElement>(strength: number = 0.3) {
  const ref = useRef<T>(null);
  const rafId = useRef<number | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const handleMove = (e: MouseEvent) => {
      if (rafId.current) return;
      
      rafId.current = requestAnimationFrame(() => {
        const rect = el.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;

        // Use 2-arg syntax for TypeScript compatibility
        anime(el, {
          translateX: x * strength,
          translateY: y * strength,
          duration: 600,
          easing: "outQuart",
        });
        rafId.current = null;
      });
    };

    const handleLeave = () => {
      if (rafId.current) cancelAnimationFrame(rafId.current);
      rafId.current = null;
      anime(el, {
        translateX: 0,
        translateY: 0,
        duration: 800,
        easing: "outElastic(1, 0.4)",
      });
    };

    el.addEventListener("mousemove", handleMove);
    el.addEventListener("mouseleave", handleLeave);
    return () => {
      el.removeEventListener("mousemove", handleMove);
      el.removeEventListener("mouseleave", handleLeave);
      if (rafId.current) cancelAnimationFrame(rafId.current);
    };
  }, [strength]);

  return ref;
}

/**
 * 🔢 Animated Counter — Counts up from 0 to target when visible
 */
export function useCounter(target: number, duration: number = 2000) {
  const ref = useRef<HTMLElement>(null);
  const animated = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !animated.current) {
          animated.current = true;
          
          let startTime: number | null = null;
          const startValue = 0;

          const step = (timestamp: number) => {
            if (!startTime) startTime = timestamp;
            const progress = Math.min((timestamp - startTime) / duration, 1);
            
            // Native easing logic to keep it smooth
            const easedProgress = 1 - Math.pow(1 - progress, 4); // OutQuart
            const currentCount = Math.floor(easedProgress * (target - startValue) + startValue);
            
            if (el) el.textContent = currentCount.toString();
            
            if (progress < 1) {
              requestAnimationFrame(step);
            }
          };
          
          requestAnimationFrame(step);
        }
      },
      { threshold: 0.05 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [target, duration]);

  return ref;
}

/**
 * ✨ Staggered Text Reveal
 */
export function TextReveal({
  text,
  className = "",
  charStyle,
  delay = 0,
  stagger = 30,
  as: Tag = "span",
}: {
  text: string;
  className?: string;
  charStyle?: React.CSSProperties;
  delay?: number;
  stagger?: number;
  as?: "span" | "h1" | "h2" | "h3" | "p" | "div";
}) {
  const containerRef = useRef<HTMLElement>(null);
  const animated = useRef(false);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !animated.current) {
          animated.current = true;
          const chars = el.querySelectorAll(".char");
          anime(chars as any, {
            opacity: [0, 1],
            translateY: [20, 0],
            rotateX: [40, 0],
            duration: 800,
            delay: utils.stagger(stagger, { start: delay }),
            easing: "outQuart",
          });
          observer.unobserve(el);
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [delay, stagger]);

  return (
    <Tag
      ref={containerRef as any}
      className={className}
      style={{ perspective: "600px" }}
    >
      {text.split("").map((char, i) => (
        <span
          key={i}
          className="char inline-block"
          style={{
            opacity: 0,
            transformStyle: "preserve-3d",
            whiteSpace: char === " " ? "pre" : undefined,
            ...charStyle,
          }}
        >
          {char === " " ? "\u00A0" : char}
        </span>
      ))}
    </Tag>
  );
}

/**
 * 🎴 3D Tilt Card — Perspective tilt on mouse hover
 */
export function useTilt(intensity: number = 10) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const handleMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width;
      const y = (e.clientY - rect.top) / rect.height;
      const rotateX = (0.5 - y) * intensity;
      const rotateY = (x - 0.5) * intensity;

      el.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
      el.style.transition = "transform 0.1s ease-out";
    };

    const handleLeave = () => {
      el.style.transform = "perspective(800px) rotateX(0) rotateY(0) scale3d(1,1,1)";
      el.style.transition = "transform 0.6s cubic-bezier(0.23, 1, 0.32, 1)";
    };

    el.addEventListener("mousemove", handleMove);
    el.addEventListener("mouseleave", handleLeave);
    return () => {
      el.removeEventListener("mousemove", handleMove);
      el.removeEventListener("mouseleave", handleLeave);
    };
  }, [intensity]);

  return ref;
}

/**
 * 📜 Parallax Scroll — Highly Optimized
 */
export function useParallax(speed: number = 0.3) {
  const ref = useRef<HTMLElement>(null);
  const ticking = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const handleScroll = () => {
      if (!ticking.current) {
        requestAnimationFrame(() => {
          if (!ref.current) return;
          const scrollY = window.scrollY;
          ref.current.style.transform = `translate3d(0, ${scrollY * speed}px, 0)`;
          ticking.current = false;
        });
        ticking.current = true;
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [speed]);

  return ref;
}

/**
 * 🎞️ Manga Reading Progress — Massive fixed percentage reading with color inversion
 */
export function ScrollLine({ isVisible = true }: { isVisible?: boolean }) {
  const textRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let ticking = false;

    const updateScrollOptions = () => {
      if (!textRef.current) return;
      const scrollY = window.scrollY;
      const totalH = document.documentElement.scrollHeight - window.innerHeight;
      let p = Math.round((scrollY / totalH) * 100);
      if (isNaN(p)) p = 0;
      if (p < 0) p = 0;
      if (p > 100) p = 100;
      
      textRef.current.innerText = String(p).padStart(3, '0');
      ticking = false;
    };

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(updateScrollOptions);
        ticking = true;
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    updateScrollOptions(); // init
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className={`fixed bottom-[1px] right-[64px] md:bottom-[17px] md:right-[97px] z-[50] pointer-events-none mix-blend-difference text-white flex flex-col items-end leading-none select-none transition-opacity duration-700 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
       <div className="relative flex flex-col items-end">
          <img 
            src="/Lying Down.png" 
            alt="Resting on the scroll" 
            className="w-[208px] md:w-[606px] -mb-[8px] md:-mb-[32px] mr-[5px] md:mr-[20px] translate-x-[32px] translate-y-[38px] md:translate-x-[87px] md:translate-y-[111px] z-20 pointer-events-none select-none"
          />
          <div ref={textRef} 
               className="relative z-10 font-victor font-black text-[3.4rem] md:text-[11.8rem] tracking-[-0.1em] leading-[0.8] flex items-end w-[4.5rem] md:w-[16rem] justify-end"
               style={{ WebkitTextStroke: '2.5px currentColor', fontWeight: 900 }}
          >
            000
          </div>
       </div>
    </div>
  );
}
