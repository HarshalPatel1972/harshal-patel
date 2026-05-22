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
    <div className="fixed bottom-6 left-6 z-[99999] pointer-events-auto flex flex-col items-start gap-2">

      {/* V2 "In Development" notice — only shown when V2 is active */}
      {isV2 && (
        <div
          className="flex items-center gap-2 px-3 py-1.5 text-[10px] font-mono tracking-wider uppercase rounded-full border animate-pulse"
          style={{
            background: "rgba(234, 179, 8, 0.12)",
            borderColor: "rgba(234, 179, 8, 0.4)",
            color: "rgb(234, 179, 8)",
            backdropFilter: "blur(8px)",
          }}
        >
          <span className="relative flex h-1.5 w-1.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-yellow-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-yellow-400" />
          </span>
          {language === "hi" ? "V2 — विकास में है" : "V2 — In Development"}
        </div>
      )}

      {/* Toggle button */}
      <button
        onClick={handleToggle}
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        className="group relative flex items-center gap-3 px-4 py-2.5 border-2 rounded-full text-white text-xs font-mono tracking-wider uppercase transition-all duration-300 shadow-[0_4px_20px_rgba(0,0,0,0.5)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.7)] active:scale-95"
        style={{
          background: isV2
            ? "rgba(15,15,15,0.85)"
            : "rgba(8,8,8,0.85)",
          borderColor: isV2
            ? "rgba(234, 179, 8, 0.35)"
            : "rgba(255,255,255,0.12)",
          backdropFilter: "blur(12px)",
        }}
      >
        {/* Status dot */}
        <span className="relative flex h-2 w-2">
          <span
            className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75"
            style={{ background: isV2 ? "rgb(234,179,8)" : "rgb(99,255,180)" }}
          />
          <span
            className="relative inline-flex rounded-full h-2 w-2"
            style={{ background: isV2 ? "rgb(234,179,8)" : "rgb(74,222,128)" }}
          />
        </span>

        {/* Label */}
        <span className="opacity-80 group-hover:opacity-100 transition-opacity">
          {isV2
            ? (language === "hi" ? "V2 देख रहे हैं" : "Viewing V2")
            : (language === "hi" ? "V1 — क्लासिक" : "V1 — Classic")}
        </span>

        <div className="h-4 w-[1px] bg-white/20" />

        {/* Action hint */}
        <span
          className="text-[10px] font-bold transition-colors group-hover:opacity-100 opacity-70"
          style={{ color: isV2 ? "rgb(234,179,8)" : "rgb(129,236,193)" }}
        >
          {isV2
            ? (language === "hi" ? "V1 पर वापस" : "← Back to V1")
            : (language === "hi" ? "V2 आज़माएं" : "Try V2 →")}
        </span>
      </button>

      {/* Tooltip on hover when on V1 */}
      {!isV2 && showTooltip && (
        <div
          className="absolute bottom-full left-0 mb-2 px-3 py-2 text-[10px] font-mono leading-relaxed rounded-lg border pointer-events-none whitespace-nowrap"
          style={{
            background: "rgba(10,10,10,0.92)",
            borderColor: "rgba(255,255,255,0.1)",
            color: "rgba(255,255,255,0.7)",
            backdropFilter: "blur(8px)",
          }}
        >
          V2 is a work-in-progress preview
        </div>
      )}
    </div>
  );
}
