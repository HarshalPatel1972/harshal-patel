"use client";

import { profile } from "@/data/profile";
import { useLanguage } from "@/context/LanguageContext";
import { useDesignVersion } from "../shared/DesignVersionContext";

export function Footer() {
  const { language } = useLanguage();
  const currentProfile = profile[language as keyof typeof profile] || profile.en;
  const { designVersion, setDesignVersion, isMounted } = useDesignVersion();

  const handleVersionToggle = () => {
    setDesignVersion(designVersion === "old" ? "new" : "old");
  };

  const menuItems = (() => {
    switch (language) {
      case "ja":
        return [
          { id: "hero", label: "ホーム" },
          { id: "projects", label: "実績" },
          { id: "about", label: "生い立ち" },
          { id: "contact", label: "連絡先" },
        ];
      case "ko":
        return [
          { id: "hero", label: "홈" },
          { id: "projects", label: "작업" },
          { id: "about", label: "기원" },
          { id: "contact", label: "연락처" },
        ];
      case "zh-tw":
        return [
          { id: "hero", label: "首頁" },
          { id: "projects", label: "作品" },
          { id: "about", label: "關於" },
          { id: "contact", label: "聯繫" },
        ];
      case "hi":
        return [
          { id: "hero", label: "मुख्य" },
          { id: "projects", label: "कार्य" },
          { id: "about", label: "मूल" },
          { id: "contact", label: "संपर्क" },
        ];
      case "eridian":
        return [
          { id: "hero", label: "WHO-IS" },
          { id: "projects", label: "MAKE-WORK" },
          { id: "about", label: "DATA-CORE" },
          { id: "contact", label: "SIGNAL-SEND" },
        ];
      default:
        return [
          { id: "hero", label: "HOME" },
          { id: "projects", label: "WORK" },
          { id: "about", label: "ORIGIN" },
          { id: "contact", label: "CONTACT" },
        ];
    }
  })();

  const handleLinkClick = (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    const el = id === "hero" ? null : document.getElementById(id);
    if (id === "hero") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  const enjoyText = (() => {
    switch (language) {
      case "ja": return "デザインは気に入りましたか？";
      case "ko": return "디자인이 마음에 드시나요?";
      case "zh-tw": return "喜歡我的設計嗎？";
      case "hi": return "काम पसंद आया?";
      case "eridian": return "ENJOYED STATIC NOISE?";
      default: return "ENJOY MY DESIGNS?";
    }
  })();

  if (!isMounted) return null;

  return (
    <footer className="relative bg-[#0F0D0A] text-[#F0EDE8] px-6 py-12 md:px-16 lg:px-24 overflow-hidden z-10">
      
      {/* Decorative top border line */}
      <div className="absolute top-0 left-0 right-0 h-[1px] bg-white/10 pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* LAYER 1 — Top of footer (padding-top: 60px) */}
        <div className="pt-[60px] flex flex-col md:flex-row items-start justify-between relative min-h-[140px] gap-8">
          {/* Left: Large display text */}
          <div className="flex flex-col select-none">
            <span 
              className="text-[48px] font-black uppercase tracking-tight leading-none text-[#8A7F72]/40"
              style={{ fontFamily: "var(--font-big-shoulders), sans-serif" }}
            >
              BUILT WITH
            </span>
            <span 
              className="text-[48px] font-black uppercase tracking-tight leading-none text-[#E8703A]"
              style={{ fontFamily: "var(--font-big-shoulders), sans-serif" }}
            >
              OBSESSION.
            </span>
          </div>

          {/* Right: The anime character (dim, saturate filter, height 200px, bleeding upward) */}
          <div className="absolute right-0 bottom-0 pointer-events-none z-0 hidden md:block">
            <img
              src="/TOJI FUSHIGURO.png"
              alt="Toji Fushiguro in the studio"
              className="h-[200px] w-auto object-contain filter saturate-[0.4] brightness-[0.8] transform translate-y-[24px]"
            />
          </div>
        </div>

        {/* LAYER 2 — Middle (margin-top: 40px, padding-top: 24px, border-top: 1px solid rgba(255,255,255,0.06)) */}
        <div className="mt-10 pt-6 border-t border-white/6 grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-4 relative z-10">
          
          {/* Left Column: Author info */}
          <div className="flex flex-col gap-1 items-start justify-start">
            <span 
              className="text-xs font-bold uppercase tracking-[0.3em] text-[#F0EDE8]"
              style={{ fontFamily: "var(--font-jetbrains-mono), monospace" }}
            >
              {currentProfile.name.toUpperCase()}
            </span>
            <span 
              className="text-[10px] text-[#8A7F72]"
              style={{ fontFamily: "var(--font-jetbrains-mono), monospace" }}
            >
              © {new Date().getFullYear()} — Varanasi, India
            </span>
          </div>

          {/* Center Column: stacked HOME/WORK/ORIGIN/CONTACT */}
          <div className="flex flex-col gap-2 items-start md:items-center justify-start">
            <div className="flex flex-col gap-2 items-start">
              {menuItems.map((item) => (
                <a
                  key={item.id}
                  href={`#${item.id}`}
                  onClick={(e) => handleLinkClick(e, item.id)}
                  className="text-xs text-[#8A7F72] hover:text-[#E8703A] transition-colors uppercase font-medium"
                  style={{ fontFamily: "var(--font-dm-sans), sans-serif" }}
                >
                  {item.label}
                </a>
              ))}
            </div>
          </div>

          {/* Right Column: Version switcher toggle & coffee pill */}
          <div className="flex flex-col gap-6 items-start md:items-end justify-start">
            
            {/* Version switcher */}
            <div className="flex flex-col items-start md:items-end gap-1.5">
              <span 
                className="text-[#8A7F72]/60 text-[8px] font-mono tracking-widest select-none"
              >
                // VER
              </span>
              <button
                onClick={handleVersionToggle}
                className="flex flex-col items-start gap-1 cursor-pointer group"
              >
                <div className="flex items-center gap-1.5">
                  <div className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${designVersion === "old" ? "bg-[#E8703A] scale-110" : "bg-transparent"}`} />
                  <span 
                    className={`text-[11px] font-mono leading-none transition-colors ${
                      designVersion === "old" ? "text-[#E8703A] font-bold" : "text-[#8A7F72] group-hover:text-white"
                    }`}
                  >
                    V1
                  </span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${designVersion === "new" ? "bg-[#E8703A] scale-110" : "bg-transparent"}`} />
                  <span 
                    className={`text-[11px] font-mono leading-none transition-colors ${
                      designVersion === "new" ? "text-[#E8703A] font-bold" : "text-[#8A7F72] group-hover:text-white"
                    }`}
                  >
                    V2
                  </span>
                </div>
              </button>
            </div>

            {/* Coffee Pill Button */}
            <a 
              href="https://www.chai4.me/harshalpatel" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-block bg-[#E8703A] text-[#0F0D0A] font-semibold text-xs rounded-full px-6 py-2.5 hover:bg-white hover:text-[#0F0D0A] transition-all uppercase tracking-wider text-center"
              style={{ fontFamily: "var(--font-dm-sans), sans-serif" }}
            >
              {enjoyText}
            </a>

          </div>

        </div>

        {/* LAYER 3 — Bottom strip */}
        <div className="mt-12 pt-4 border-t border-white/4 flex items-center justify-center relative z-10">
          <span 
            className="text-[9px] text-[#8A7F72]/50 tracking-[0.15em] uppercase text-center"
            style={{ fontFamily: "var(--font-jetbrains-mono), monospace" }}
          >
            // STUDIO_ACTIVE — SIGNAL_BROADCASTING — HARSHAL_PATEL_2026
          </span>
        </div>

      </div>
    </footer>
  );
}

