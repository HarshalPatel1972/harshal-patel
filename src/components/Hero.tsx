"use client";

import { useEffect, useRef, useState } from "react";
import { animate as anime } from "animejs";
import { profile } from "@/data/profile";
import Image from "next/image";

const ROLES = [
  "Software Engineer",
  "Systems Programmer",
  "Full-Stack Developer",
  "Open Source Contributor",
];

export function Hero() {
  const [roleIndex, setRoleIndex] = useState(0);
  const [displayText, setDisplayText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const blobRef = useRef<HTMLDivElement>(null);

  // Typewriter effect
  useEffect(() => {
    const currentRole = ROLES[roleIndex];
    let timeout: NodeJS.Timeout;

    if (!isDeleting && displayText === currentRole) {
      timeout = setTimeout(() => setIsDeleting(true), 2000);
    } else if (isDeleting && displayText === "") {
      setIsDeleting(false);
      setRoleIndex((prev) => (prev + 1) % ROLES.length);
    } else {
      timeout = setTimeout(
        () => {
          setDisplayText(
            isDeleting
              ? currentRole.slice(0, displayText.length - 1)
              : currentRole.slice(0, displayText.length + 1)
          );
        },
        isDeleting ? 40 : 80
      );
    }

    return () => clearTimeout(timeout);
  }, [displayText, isDeleting, roleIndex]);

  // Gradient blob follows mouse
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (blobRef.current) {
        anime(blobRef.current, {
          translateX: e.clientX - 300,
          translateY: e.clientY - 300,
          duration: 2000,
          easing: "outQuart",
        });
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  // Entrance animation
  const heroRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!heroRef.current) return;

    const elements = heroRef.current.querySelectorAll("[data-animate]");
    elements.forEach((el, i) => {
      anime(el as HTMLElement, {
        opacity: [0, 1],
        translateY: [30, 0],
        duration: 1000,
        delay: 200 + i * 150,
        easing: "outQuart",
      });
    });
  }, []);

  return (
    <section
      id="hero"
      ref={heroRef}
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
    >
      {/* Gradient blob */}
      <div
        ref={blobRef}
        className="gradient-blob w-[600px] h-[600px] top-0 left-0"
        style={{
          background:
            "radial-gradient(circle, rgba(139,92,246,0.4) 0%, rgba(59,130,246,0.2) 50%, transparent 70%)",
        }}
      />

      {/* Static ambient blobs */}
      <div
        className="gradient-blob w-[400px] h-[400px] bottom-[10%] right-[10%]"
        style={{
          background:
            "radial-gradient(circle, rgba(244,63,94,0.2) 0%, transparent 70%)",
        }}
      />

      <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
        {/* Greeting */}
        <div
          data-animate
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card mb-8"
          style={{ opacity: 0 }}
        >
          <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
          <span className="text-sm text-white/60 font-mono">
            Available for opportunities
          </span>
        </div>

        {/* Name */}
        <h1
          data-animate
          className="text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-bold tracking-tight leading-[0.9] mb-6"
          style={{
            opacity: 0,
            fontFamily: "var(--font-display)",
            background: "linear-gradient(135deg, #f0f0f5 0%, #8b5cf6 50%, #3b82f6 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}
        >
          {profile.name.split(" ")[0]}
          <br />
          <span style={{
            background: "linear-gradient(135deg, #8b5cf6 0%, #f43f5e 50%, #f59e0b 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}>
            {profile.name.split(" ")[1]}
          </span>
        </h1>

        {/* Typewriter */}
        <div
          data-animate
          className="text-xl md:text-2xl text-white/60 font-light mb-4 h-8"
          style={{ opacity: 0 }}
        >
          {displayText}
          <span className="animate-pulse text-violet-400">|</span>
        </div>

        {/* Tagline */}
        <p
          data-animate
          className="text-base md:text-lg text-white/40 max-w-xl mx-auto mb-12 leading-relaxed"
          style={{ opacity: 0 }}
        >
          {profile.tagline}
        </p>

        {/* CTA Buttons */}
        <div
          data-animate
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
          style={{ opacity: 0 }}
        >
          <a
            href="#projects"
            className="magnetic-btn px-8 py-3.5 rounded-full bg-gradient-to-r from-violet-600 to-blue-600 text-white font-semibold text-sm tracking-wide hover:shadow-lg hover:shadow-violet-500/25 transition-shadow"
          >
            View My Work
          </a>
          <a
            href="#contact"
            className="magnetic-btn px-8 py-3.5 rounded-full border border-white/10 text-white/70 hover:text-white font-medium text-sm tracking-wide hover:bg-white/5 transition-colors"
          >
            Get In Touch
          </a>
        </div>

        {/* Scroll indicator */}
        <div
          data-animate
          className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
          style={{ opacity: 0 }}
        >
          <span className="text-[10px] text-white/30 font-mono tracking-widest uppercase">
            Scroll
          </span>
          <div className="w-5 h-8 border border-white/20 rounded-full flex justify-center pt-1.5">
            <div className="w-1 h-2 bg-white/40 rounded-full animate-bounce" />
          </div>
        </div>
      </div>
    </section>
  );
}
