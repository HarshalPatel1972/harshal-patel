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
      className={`fixed top-6 left-1/2 -translate-x-1/2 z-50 transition-all duration-500 ${
        scrolled
          ? "bg-[#0a0a0f]/80 backdrop-blur-xl border border-white/[0.08] shadow-2xl shadow-violet-500/5"
          : "bg-transparent border border-transparent"
      } rounded-full px-2 py-2`}
    >
      <div className="flex items-center gap-1">
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
            className={`relative px-5 py-2 rounded-full text-sm font-medium transition-colors duration-300 ${
              active === item.id
                ? "text-white"
                : "text-white/50 hover:text-white/80"
            }`}
          >
            {active === item.id && (
              <span className="absolute inset-0 bg-white/[0.08] rounded-full" />
            )}
            <span className="relative z-10">{item.label}</span>
          </button>
        ))}
      </div>
    </nav>
  );
}
