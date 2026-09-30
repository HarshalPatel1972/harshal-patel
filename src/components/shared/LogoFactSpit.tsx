"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";

export interface FactSpit {
  id: number; // changes on every click so a new fact replaces the old one
  fact: string;
  from: { x: number; y: number }; // centre of the logo, in viewport coordinates
}

interface Props {
  spit: FactSpit | null;
  variant: "old" | "new";
  language: string;
  onClose: () => void;
}

// Languages written without spaces get revealed character by character, the rest word by word
const NO_SPACES = new Set(["ja", "zh-tw"]);

/**
 * A fact card that springs out of the navbar logo. It's not an overlay: nothing is
 * dimmed or blocked, and it goes away by itself (or on click / Esc / the next logo click).
 */
export function LogoFactSpit({ spit, variant, language, onClose }: Props) {
  const reduce = useReducedMotion();
  const [hovered, setHovered] = useState(false);

  // Auto-dismiss after enough time to read it; hovering the card holds it open
  useEffect(() => {
    if (!spit || hovered) return;
    const ms = Math.min(15000, 4500 + spit.fact.length * 45);
    const t = setTimeout(onClose, ms);
    return () => clearTimeout(t);
  }, [spit, hovered, onClose]);

  useEffect(() => {
    if (!spit) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [spit, onClose]);

  const isNew = variant === "new";
  const units = spit ? (NO_SPACES.has(language) ? Array.from(spit.fact) : spit.fact.split(" ")) : [];
  const joiner = spit && NO_SPACES.has(language) ? "" : " ";

  return (
    <AnimatePresence mode="wait">
      {spit && (
        <div key={spit.id}>
          {/* The pop at the logo, as if something just left it */}
          {!reduce && (
            <motion.span
              aria-hidden="true"
              className="pointer-events-none fixed z-[110] rounded-full border-2"
              style={{
                left: spit.from.x - 22, top: spit.from.y - 22, width: 44, height: 44,
                borderColor: isNew ? "var(--forge-orange)" : "var(--accent-blood)",
              }}
              initial={{ scale: 0.6, opacity: 0.9 }}
              animate={{ scale: 2.6, opacity: 0 }}
              transition={{ duration: 0.55, ease: "easeOut" }}
            />
          )}

          <motion.div
            role="status"
            aria-live="polite"
            onClick={onClose}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            className={`fixed z-[110] top-[72px] right-[60px] md:right-[80px] w-[min(300px,calc(100vw-84px))] cursor-pointer select-none px-5 py-5 pr-7 ${
              isNew
                ? "bg-[var(--aged-paper)] border-[3px] border-[var(--sumi-ink)] text-[var(--sumi-ink)] shadow-[6px_6px_0_var(--forge-orange)]"
                : "bg-black border-2 border-[var(--accent-blood)] text-[#F5F5F0] shadow-[0_0_32px_rgba(var(--accent-blood-rgb),0.35)]"
            }`}
            style={{ transformOrigin: "100% 0%" }}
            initial={reduce ? { opacity: 0 } : { x: 90, y: -46, scale: 0.12, rotate: 24, opacity: 0 }}
            animate={
              reduce
                ? { opacity: 1 }
                : { x: 0, y: 0, scale: 1, rotate: isNew ? -2 : 1.5, opacity: 1,
                    transition: { type: "spring", stiffness: 340, damping: 15, mass: 0.85 } }
            }
            exit={reduce ? { opacity: 0 } : { x: 50, y: -24, scale: 0.15, rotate: 18, opacity: 0, transition: { duration: 0.24, ease: "easeIn" } }}
          >
            {/* Corner brackets on the old design, echoing the ofuda cards */}
            {!isNew && (
              <>
                <span className="absolute left-0 top-0 h-4 w-4 border-l-2 border-t-2 border-[var(--accent-blood)]" />
                <span className="absolute right-0 top-0 h-4 w-4 border-r-2 border-t-2 border-[var(--accent-blood)]" />
                <span className="absolute bottom-0 left-0 h-4 w-4 border-b-2 border-l-2 border-[var(--accent-blood)]" />
                <span className="absolute bottom-0 right-0 h-4 w-4 border-b-2 border-r-2 border-[var(--accent-blood)]" />
              </>
            )}

            <span aria-hidden="true" className={`absolute right-2.5 top-1.5 font-mono text-[11px] font-black opacity-50 ${
              isNew ? "text-[var(--forge-orange)]" : "text-[var(--accent-blood)]"
            }`}>✕</span>

            <p className={`text-[15px] font-bold leading-snug ${language === "hi" ? "font-hindi" : ""}`}>
              {units.map((u, i) => (
                <motion.span
                  key={i}
                  className="inline-block"
                  initial={reduce ? false : { opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: reduce ? 0 : 0.28 + Math.min(i, 60) * 0.022, duration: 0.3 }}
                >
                  {u}{i < units.length - 1 ? joiner : ""}
                </motion.span>
              ))}
            </p>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
