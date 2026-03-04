"use client";

import { profile } from "@/data/profile";
import { ScrollReveal } from "./ScrollReveal";
import { useState } from "react";

export function Contact() {
  const [status, setStatus] = useState<"idle" | "sending" | "sent">("idle");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("sending");
    setTimeout(() => setStatus("sent"), 2000);
  };

  return (
    <section id="contact" className="relative py-32 px-6">
      {/* Background accent */}
      <div
        className="gradient-blob w-[600px] h-[600px] bottom-[10%] left-[30%]"
        style={{
          background: "radial-gradient(circle, rgba(244,63,94,0.12) 0%, rgba(139,92,246,0.08) 50%, transparent 70%)",
        }}
      />

      <div className="max-w-2xl mx-auto relative z-10">
        <ScrollReveal className="text-center mb-16">
          <span className="text-sm font-mono text-rose-400 tracking-widest uppercase mb-4 block">
            Contact
          </span>
          <h2 className="text-4xl md:text-6xl font-bold tracking-tight mb-6" style={{ fontFamily: "var(--font-display)" }}>
            Let&apos;s
            <span className="bg-gradient-to-r from-rose-400 to-violet-400 bg-clip-text text-transparent"> Connect</span>
          </h2>
          <p className="text-white/40 text-base max-w-md mx-auto">
            Have a project in mind or just want to chat? I&apos;d love to hear from you.
          </p>
        </ScrollReveal>

        <ScrollReveal delay={200}>
          <form onSubmit={handleSubmit} className="glass-card p-8 space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="text-[11px] font-mono text-white/30 uppercase tracking-wider block mb-2">
                  Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="Your name"
                  className="w-full bg-white/[0.03] border border-white/10 rounded-lg px-4 py-3 text-white text-sm placeholder:text-white/20 focus:outline-none transition-shadow"
                />
              </div>
              <div>
                <label className="text-[11px] font-mono text-white/30 uppercase tracking-wider block mb-2">
                  Email
                </label>
                <input
                  type="email"
                  required
                  placeholder="you@email.com"
                  className="w-full bg-white/[0.03] border border-white/10 rounded-lg px-4 py-3 text-white text-sm placeholder:text-white/20 focus:outline-none transition-shadow"
                />
              </div>
            </div>

            <div>
              <label className="text-[11px] font-mono text-white/30 uppercase tracking-wider block mb-2">
                Message
              </label>
              <textarea
                rows={5}
                required
                placeholder="Tell me about your project..."
                className="w-full bg-white/[0.03] border border-white/10 rounded-lg px-4 py-3 text-white text-sm placeholder:text-white/20 focus:outline-none resize-none transition-shadow"
              />
            </div>

            <button
              type="submit"
              disabled={status !== "idle"}
              className="w-full py-3.5 rounded-lg bg-gradient-to-r from-violet-600 to-rose-600 text-white font-semibold text-sm tracking-wide hover:shadow-lg hover:shadow-violet-500/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {status === "idle" && "Send Message"}
              {status === "sending" && (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Sending...
                </span>
              )}
              {status === "sent" && "✓ Message Sent!"}
            </button>
          </form>
        </ScrollReveal>

        {/* Social links */}
        <ScrollReveal delay={400} className="mt-12">
          <div className="flex items-center justify-center gap-6">
            {[
              { label: "GitHub", href: profile.github, icon: "M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" },
              { label: "LinkedIn", href: profile.linkedin, icon: "M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" },
              { label: "Email", href: `mailto:${profile.email}`, icon: "M1.5 8.67v8.58a3 3 0 003 3h15a3 3 0 003-3V8.67l-8.928 5.493a3 3 0 01-3.144 0L1.5 8.67z M22.5 6.908V6.75a3 3 0 00-3-3h-15a3 3 0 00-3 3v.158l9.714 5.978a1.5 1.5 0 001.572 0L22.5 6.908z" },
            ].map((social) => (
              <a
                key={social.label}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                className="w-11 h-11 rounded-full border border-white/10 flex items-center justify-center text-white/40 hover:text-white hover:border-white/25 hover:bg-white/5 transition-all"
                aria-label={social.label}
              >
                <svg className="w-[18px] h-[18px]" fill="currentColor" viewBox="0 0 24 24">
                  <path d={social.icon} />
                </svg>
              </a>
            ))}
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
