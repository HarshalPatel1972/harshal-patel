"use client";

import React, { useEffect, useRef } from "react";
import { animate as anime } from "animejs";

/**
 * 🧲 Magnetic Cursor — Elements gently pull toward the mouse on hover
 */
export function useMagnetic(strength: number = 0.3) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const handleMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;

      anime(el, {
        translateX: x * strength,
        translateY: y * strength,
        duration: 600,
        easing: "outQuart",
      });
    };

    const handleLeave = () => {
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
          const obj = { val: 0 };
          anime(obj as any, {
            val: target,
            duration,
            easing: "outQuart",
            onUpdate: () => {
              el.textContent = Math.round(obj.val).toString();
            },
          } as any);
        }
      },
      { threshold: 0.5 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [target, duration]);

  return ref;
}

/**
 * ✨ Staggered Text Reveal — Each character cascades in
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

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          const chars = el.querySelectorAll(".char");
          anime(chars as any, {
            opacity: [0, 1],
            translateY: [20, 0],
            rotateX: [40, 0],
            duration: 800,
            delay: ((_el: any, i: number) => delay + i * stagger) as any,
            easing: "outQuart",
          } as any);
          observer.unobserve(el);
        }
      },
      { threshold: 0.2 }
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
 * 📜 Parallax Scroll — Element moves at a different rate than scroll
 */
export function useParallax(speed: number = 0.3) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const handleScroll = () => {
      const rect = el.getBoundingClientRect();
      const center = rect.top + rect.height / 2;
      const viewCenter = window.innerHeight / 2;
      const offset = (center - viewCenter) * speed;
      el.style.transform = `translateY(${offset}px)`;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, [speed]);

  return ref;
}

/**
 * 🌊 Horizontal Scroll Line — Draws across as user scrolls  
 */
export function ScrollLine({ color = "rgba(139,92,246,0.4)" }: { color?: string }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (!ref.current) return;
      const scrollPercent = window.scrollY / (document.documentElement.scrollHeight - window.innerHeight);
      ref.current.style.transform = `scaleX(${scrollPercent})`;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="fixed top-0 left-0 right-0 z-[100] h-[2px]">
      <div
        ref={ref}
        className="h-full w-full origin-left"
        style={{
          background: `linear-gradient(90deg, ${color}, transparent)`,
          transform: "scaleX(0)",
          transition: "transform 0.1s linear",
        }}
      />
    </div>
  );
}
