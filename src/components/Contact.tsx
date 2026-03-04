"use client";

import { profile } from "@/data/profile";
import { ScrollReveal } from "./ScrollReveal";
import { useMagnetic, useTilt, TextReveal } from "./AnimationKit";
import { useState, useRef, useEffect } from "react";
import { animate as anime } from "animejs";

/* ─── Contact Card with 3D tilt + magnetic pull ─── */
function ContactCard({
  icon,
  label,
  value,
  href,
  color,
  delay,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  href: string;
  color: string;
  delay: number;
}) {
  const tiltRef = useTilt(12);

  return (
    <ScrollReveal delay={delay}>
      <a
        ref={tiltRef as any}
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="group glass-card p-6 block relative overflow-hidden hover:border-white/15 transition-colors duration-500 cursor-pointer"
        style={{ transformStyle: "preserve-3d" }}
      >
        {/* Accent glow on hover */}
        <div
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"
          style={{ background: `radial-gradient(300px circle at 50% 100%, ${color}20, transparent 70%)` }}
        />
        {/* Bottom accent line */}
        <div
          className="absolute bottom-0 left-0 right-0 h-[2px] scale-x-0 group-hover:scale-x-100 transition-transform duration-700 origin-center"
          style={{ background: `linear-gradient(90deg, transparent, ${color}, transparent)` }}
        />

        <div className="relative z-10" style={{ transform: "translateZ(15px)" }}>
          {/* Icon */}
          <div
            className="w-12 h-12 rounded-xl flex items-center justify-center mb-4 transition-colors duration-300"
            style={{ background: `${color}15`, border: `1px solid ${color}30` }}
          >
            <div style={{ color }} className="group-hover:scale-110 transition-transform duration-300">
              {icon}
            </div>
          </div>

          <div className="text-[10px] font-mono uppercase tracking-widest text-white/30 mb-1">
            {label}
          </div>
          <div className="text-white/80 text-sm font-medium group-hover:text-white transition-colors">
            {value}
          </div>
        </div>

        {/* Arrow */}
        <div className="absolute top-5 right-5 opacity-0 group-hover:opacity-100 transition-all duration-300 -translate-y-1 group-hover:translate-y-0">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2">
            <path d="M7 17L17 7M17 7H7M17 7V17" />
          </svg>
        </div>
      </a>
    </ScrollReveal>
  );
}

/* ─── Copy Email Button with satisfying feedback ─── */
function CopyEmailButton() {
  const [copied, setCopied] = useState(false);
  const btnRef = useMagnetic(0.2);
  const rippleRef = useRef<HTMLDivElement>(null);

  const handleCopy = () => {
    navigator.clipboard.writeText(profile.email);
    setCopied(true);

    // Ripple burst animation
    if (rippleRef.current) {
      anime(rippleRef.current, {
        scale: [0, 2.5],
        opacity: [0.6, 0],
        duration: 600,
        easing: "outQuart",
      });
    }

    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <button
      ref={btnRef as any}
      onClick={handleCopy}
      className="group relative magnetic-btn px-6 py-3 rounded-full border border-white/10 hover:border-violet-500/30 transition-colors overflow-hidden"
    >
      {/* Ripple */}
      <div
        ref={rippleRef}
        className="absolute inset-0 rounded-full pointer-events-none"
        style={{ background: "radial-gradient(circle, rgba(139,92,246,0.4), transparent)", transform: "scale(0)" }}
      />

      <div className="relative z-10 flex items-center gap-2">
        {copied ? (
          <>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2.5">
              <path d="M20 6L9 17l-5-5" />
            </svg>
            <span className="text-emerald-400 text-sm font-medium">Copied!</span>
          </>
        ) : (
          <>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-white/50 group-hover:text-violet-400 transition-colors">
              <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
              <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" />
            </svg>
            <span className="text-white/60 text-sm group-hover:text-white transition-colors">{profile.email}</span>
          </>
        )}
      </div>
    </button>
  );
}

/* ─── Availability Beacon ─── */
function AvailabilityBeacon() {
  const ringRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ringRef.current) return;
    // Pulsating ring
    const loop = () => {
      if (ringRef.current) {
        anime(ringRef.current, {
          scale: [1, 2.2],
          opacity: [0.5, 0],
          duration: 2000,
          easing: "outQuart",
          onComplete: loop,
        });
      }
    };
    loop();
  }, []);

  return (
    <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full glass-card">
      <div className="relative">
        <div className="w-2.5 h-2.5 bg-emerald-400 rounded-full" />
        <div
          ref={ringRef}
          className="absolute inset-0 w-2.5 h-2.5 bg-emerald-400 rounded-full"
        />
      </div>
      <span className="text-sm text-white/60 font-mono">
        Open to opportunities
      </span>
    </div>
  );
}

/* ─── Main Contact Section ─── */
export function Contact() {
  return (
    <section id="contact" className="relative py-32 px-6">
      {/* Background blobs */}
      <div
        className="gradient-blob w-[600px] h-[600px] bottom-[10%] left-[20%]"
        style={{ background: "radial-gradient(circle, rgba(139,92,246,0.12) 0%, transparent 70%)" }}
      />
      <div
        className="gradient-blob w-[400px] h-[400px] top-[20%] right-[10%]"
        style={{ background: "radial-gradient(circle, rgba(244,63,94,0.1) 0%, transparent 70%)" }}
      />

      <div className="max-w-5xl mx-auto relative z-10">
        {/* Header */}
        <div className="text-center mb-20">
          <ScrollReveal>
            <AvailabilityBeacon />
          </ScrollReveal>

          <div className="mt-8 mb-6">
            <TextReveal
              text="Let's Build"
              as="h2"
              className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight leading-[1.1]"
              stagger={40}
              delay={100}
            />
            <br />
            <TextReveal
              text="Something Great"
              as="h2"
              className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight leading-[1.1]"
              stagger={40}
              delay={500}
              charStyle={{
                background: "linear-gradient(135deg, #8b5cf6, #f43f5e, #f59e0b)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            />
          </div>

          <ScrollReveal delay={300}>
            <p className="text-white/40 text-lg max-w-lg mx-auto mb-8">
              Got a project, an idea, or just want to say hi? I&apos;m always excited to connect.
            </p>
          </ScrollReveal>

          <ScrollReveal delay={400}>
            <CopyEmailButton />
          </ScrollReveal>
        </div>

        {/* Contact Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <ContactCard
            icon={<svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/></svg>}
            label="GitHub"
            value="@HarshalPatel1972"
            href={profile.github}
            color="#8b5cf6"
            delay={100}
          />
          <ContactCard
            icon={<svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>}
            label="LinkedIn"
            value="Harshal Patel"
            href={profile.linkedin}
            color="#3b82f6"
            delay={200}
          />
          <ContactCard
            icon={<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75"/></svg>}
            label="Email"
            value={profile.email}
            href={`mailto:${profile.email}`}
            color="#f43f5e"
            delay={300}
          />
          <ContactCard
            icon={<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z"/><path d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z"/></svg>}
            label="Location"
            value={profile.location}
            href={`https://maps.google.com/?q=${encodeURIComponent(profile.location)}`}
            color="#10b981"
            delay={400}
          />
        </div>
      </div>
    </section>
  );
}
