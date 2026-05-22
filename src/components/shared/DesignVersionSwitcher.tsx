"use client";

import { useDesignVersion } from "./DesignVersionContext";
import { useLanguage } from "@/context/LanguageContext";

export function DesignVersionSwitcher() {
  const { designVersion, setDesignVersion, isMounted } = useDesignVersion();
  const { language } = useLanguage();

  if (!isMounted || designVersion === "new") return null;

  const handleToggle = () => {
    setDesignVersion(designVersion === "old" ? "new" : "old");
  };

  const isOld = designVersion === "old";

  return (
    <div className="fixed bottom-6 left-6 z-[99999] pointer-events-auto">
      <button
        onClick={handleToggle}
        className="group relative flex items-center gap-3 px-4 py-2.5 bg-neutral-950/80 hover:bg-neutral-900 border-2 border-white/10 hover:border-white/30 rounded-full text-white text-xs font-mono tracking-wider uppercase transition-all duration-300 shadow-[0_4px_20px_rgba(0,0,0,0.5)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.7)] backdrop-blur-md active:scale-95"
      >
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
          <span className={`relative inline-flex rounded-full h-2 w-2 ${isOld ? 'bg-amber-500' : 'bg-cyan-500'}`}></span>
        </span>
        <span className="opacity-80 group-hover:opacity-100 transition-opacity">
          {language === "hi" 
            ? `डिज़ाइन: ${isOld ? "क्लासिक" : "मॉडर्न"}` 
            : `Design: ${isOld ? "Legacy" : "Premium"}`}
        </span>
        <div className="h-4 w-[1px] bg-white/20"></div>
        <span className="text-[10px] font-bold text-cyan-400 group-hover:text-cyan-300 transition-colors">
          {isOld ? "SWITCH TO NEW" : "SWITCH TO OLD"}
        </span>
      </button>
    </div>
  );
}
