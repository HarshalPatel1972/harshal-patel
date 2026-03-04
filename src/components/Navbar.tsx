"use client";

import { useState, useEffect } from "react";
import { animate as anime } from "animejs";

const NAV_ITEMS = [
  { id: "hero", label: "Home" },
  { id: "projects", label: "Work" },
  { id: "about", label: "About" },
  { id: "contact", label: "Contact" },
];

export function Navbar() {
  const [active, setActive] = useState("hero");
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);

      // Determine active section
      const sections = NAV_ITEMS.map((item) => ({
        id: item.id,
        el: document.getElementById(item.id),
      }));

      for (let i = sections.length - 1; i >= 0; i--) {
        const el = sections[i].el;
        if (el && el.getBoundingClientRect().top <= 200) {
          setActive(sections[i].id);
          break;
        }
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleClick = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-[var(--bg-ink)]/95 border-b-2 border-black"
          : "bg-transparent"
      }`}
    >
      <div className="flex items-center justify-end md:justify-center p-4">
        {NAV_ITEMS.map((item) => (
          <button
            key={item.id}
            onClick={() => handleClick(item.id)}
            onMouseEnter={(e) => {
              if (active !== item.id) {
                anime(e.currentTarget, {
                  scale: 1.05,
                  duration: 300,
                  easing: "outQuart",
                });
              }
            }}
            onMouseLeave={(e) => {
              anime(e.currentTarget, {
                scale: 1,
                duration: 300,
                easing: "outQuart",
              });
            }}
            className={`relative px-4 py-2 text-xs md:text-sm font-bold font-mono uppercase tracking-widest transition-all duration-300 ${
              active === item.id
                ? "text-[var(--text-bone)] bg-black"
                : "text-[var(--text-muted)] hover:text-black hover:bg-[var(--text-bone)]"
            } ${scrolled ? 'border border-transparent' : 'border-2 border-transparent'}`}
          >
            <span className="relative z-10">{item.label}</span>
          </button>
        ))}
      </div>
    </nav>
  );
}
