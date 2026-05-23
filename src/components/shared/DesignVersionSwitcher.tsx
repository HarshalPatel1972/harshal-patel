"use client";

import { useDesignVersion } from "./DesignVersionContext";
import { useLanguage } from "@/context/LanguageContext";
import { useState } from "react";

export function DesignVersionSwitcher() {
  const { designVersion, setDesignVersion, isMounted } = useDesignVersion();
  const { language } = useLanguage();
  const [showTooltip, setShowTooltip] = useState(false);

  if (!isMounted) return null;

  const isV2 = designVersion === "new";

  const handleToggle = () => {
    setDesignVersion(isV2 ? "old" : "new");
  };

  return (
    <div className="fixed bottom-6 left-6 z-[99999] pointer-events-auto flex flex-col items-start gap-2.5 select-none">

      {/* V2 "In Development" notice — only shown when V2 is active */}
      {isV2 && (
        <div
          className="flex items-center gap-2 px-3 py-1.5 text-[9px] font-mono tracking-widest uppercase border border-[var(--sumi-ink)]/20 border-l-[3.5px] border-l-[var(--forge-orange)] bg-[var(--aged-paper)] text-[var(--sumi-ink)] animate-pulse"
        >
          <span className="relative flex h-1.5 w-1.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[var(--forge-orange)] opacity-75" />
            <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-[var(--forge-orange)]" />
          </span>
          {language === "hi" ? "V2 — विकास में है" : "V2 — In Development"}
        </div>
      )}

      {/* Toggle button container */}
      <div className="relative group">
        {/* Backdrop Shadow Layer */}
        <div
          className="absolute inset-0 transition-transform duration-200 translate-x-[3px] translate-y-[3px] group-hover:translate-x-[4.5px] group-hover:translate-y-[4.5px] group-active:translate-x-[1px] group-active:translate-y-[1px]"
          style={{
            background: isV2 ? "var(--sumi-ink)" : "var(--accent-blood)",
          }}
        />

        {/* Toggle button */}
        <button
          onClick={handleToggle}
          onMouseEnter={() => setShowTooltip(true)}
          onMouseLeave={() => setShowTooltip(false)}
          className="relative z-10 flex items-center gap-3.5 px-4 py-2.5 border text-xs font-mono tracking-wider uppercase transition-all duration-200 cursor-pointer group-hover:translate-x-[-1px] group-hover:translate-y-[-1px] group-active:translate-x-[1px] group-active:translate-y-[1px]"
          style={{
            background: isV2 ? "var(--aged-paper)" : "var(--bg-ink)",
            borderColor: isV2 ? "var(--sumi-ink)" : "var(--text-bone)",
            color: isV2 ? "var(--sumi-ink)" : "var(--text-bone)",
            borderWidth: isV2 ? "2px" : "1px",
          }}
        >
          {/* Status dot */}
          <span className="relative flex h-1.5 w-1.5">
            <span
              className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75"
              style={{ background: isV2 ? "var(--forge-orange)" : "var(--accent-blood)" }}
            />
            <span
              className="relative inline-flex rounded-full h-1.5 w-1.5"
              style={{ background: isV2 ? "var(--forge-orange)" : "var(--accent-blood)" }}
            />
          </span>

          {/* Label */}
          <span className="font-bold opacity-90 group-hover:opacity-100 transition-opacity">
            {isV2
              ? (language === "hi" ? "V2 देख रहे हैं" : "Viewing V2")
              : (language === "hi" ? "V1 — क्लासिक" : "V1 — Classic")}
          </span>

          <div
            className="h-3 w-[1px] opacity-20"
            style={{
              background: isV2 ? "var(--sumi-ink)" : "var(--text-bone)",
            }}
          />

          {/* Action hint */}
          <span
            className="text-[10px] font-black transition-colors"
            style={{ color: isV2 ? "var(--forge-orange)" : "var(--accent-blood)" }}
          >
            {isV2
              ? (language === "hi" ? "V1 पर वापस" : "← Back to V1")
              : (language === "hi" ? "V2 आज़माएं" : "Try V2 →")}
          </span>
        </button>
      </div>

      {/* Tooltip on hover when on V1 */}
      {!isV2 && showTooltip && (
        <div
          className="absolute bottom-full left-0 mb-3 px-3 py-2 text-[9px] font-mono leading-relaxed border pointer-events-none whitespace-nowrap"
          style={{
            background: "var(--bg-darker)",
            borderColor: "var(--text-bone)",
            color: "var(--text-bone)",
          }}
        >
          V2 is a work-in-progress preview
        </div>
      )}
    </div>
  );
}
