"use client";

import { useEffect, useState, useRef } from "react";
import Image from "next/image";
import { useLanguage, type Language } from "@/context/LanguageContext";
import { useDesignVersion } from "@/components/shared/DesignVersionContext";

type NavItem = {
  id: string;
  label: string;
};

const NAV_ITEMS: Record<Language, NavItem[]> = {
  en: [
    { id: "hero", label: "HOME" },
    { id: "projects", label: "WORK" },
    { id: "about", label: "ORIGIN" },
    { id: "contact", label: "CONTACT" },
  ],
  ja: [
    { id: "hero", label: "ホーム" },
    { id: "projects", label: "実績" },
    { id: "about", label: "生い立ち" },
    { id: "contact", label: "連絡先" },
  ],
  ko: [
    { id: "hero", label: "홈" },
    { id: "projects", label: "작업" },
    { id: "about", label: "기원" },
    { id: "contact", label: "연락처" },
  ],
  "zh-tw": [
    { id: "hero", label: "首頁" },
    { id: "projects", label: "作品" },
    { id: "about", label: "關於" },
    { id: "contact", label: "聯繫" },
  ],
  hi: [
    { id: "hero", label: "मुख्य" },
    { id: "projects", label: "कार्य" },
    { id: "about", label: "मूल" },
    { id: "contact", label: "संपर्क" },
  ],
  fr: [
    { id: "hero", label: "ACCUEIL" },
    { id: "projects", label: "PROJETS" },
    { id: "about", label: "ORIGINE" },
    { id: "contact", label: "CONTACT" },
  ],
  id: [
    { id: "hero", label: "BERANDA" },
    { id: "projects", label: "KARYA" },
    { id: "about", label: "ASAL" },
    { id: "contact", label: "KONTAK" },
  ],
  de: [
    { id: "hero", label: "START" },
    { id: "projects", label: "PROJEKTE" },
    { id: "about", label: "HERKUNFT" },
    { id: "contact", label: "KONTAKT" },
  ],
  it: [
    { id: "hero", label: "HOME" },
    { id: "projects", label: "LAVORO" },
    { id: "about", label: "ORIGINE" },
    { id: "contact", label: "CONTATTO" },
  ],
  "pt-br": [
    { id: "hero", label: "INÍCIO" },
    { id: "projects", label: "PROJETOS" },
    { id: "about", label: "SOBRE" },
    { id: "contact", label: "CONTATO" },
  ],
  "es-419": [
    { id: "hero", label: "INICIO" },
    { id: "projects", label: "PROYECTOS" },
    { id: "about", label: "ORIGEN" },
    { id: "contact", label: "CONTACTO" },
  ],
  es: [
    { id: "hero", label: "INICIO" },
    { id: "projects", label: "PROYECTOS" },
    { id: "about", label: "ORIGEN" },
    { id: "contact", label: "CONTACTO" },
  ],
  eridian: [
    { id: "hero", label: "WHO-IS" },
    { id: "projects", label: "MAKE-WORK" },
    { id: "about", label: "DATA-CORE" },
    { id: "contact", label: "SIGNAL-SEND" },
  ]
};

const LANGUAGES = [
  { code: 'de', short: 'DE', label: 'DEUTSCH' },
  { code: 'en', short: 'EN', label: 'ENGLISH' },
  { code: 'es', short: 'ES', label: 'ESPAÑOL' },
  { code: 'es-419', short: 'ES-419', label: 'ESPAÑOL (LA)' },
  { code: 'fr', short: 'FR', label: 'FRANÇAIS' },
  { code: 'hi', short: 'HI', label: 'हिन्दी' },
  { code: 'id', short: 'ID', label: 'INDONESIA' },
  { code: 'it', short: 'IT', label: 'ITALIANO' },
  { code: 'ja', short: 'JA', label: '日本語' },
  { code: 'ko', short: 'KO', label: '한국어' },
  { code: 'pt-br', short: 'PT', label: 'PORTUGUÊS' },
  { code: 'zh-tw', short: 'ZH', label: '繁體中文' }
] as const;

export function Navbar() {
  const { language, setLanguage } = useLanguage();
  const { designVersion, setDesignVersion, isMounted } = useDesignVersion();
  const currentNavItems = NAV_ITEMS[language as keyof typeof NAV_ITEMS] || NAV_ITEMS.en;
  
  const [activeSection, setActiveSection] = useState("hero");
  const [visitorStats, setVisitorStats] = useState<{ uniqueCount: number; totalHits: number } | null>(null);
  
  const [langOpen, setLangOpen] = useState(false);
  const langContainerRef = useRef<HTMLDivElement>(null);
  
  const [indicatorTop, setIndicatorTop] = useState(0);
  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);
  const clickTimesRef = useRef<number[]>([]);

  // Section Tracking using IntersectionObserver
  useEffect(() => {
    const sectionIds = currentNavItems.map(item => item.id);
    const observerOptions = {
      root: null,
      rootMargin: '-30% 0px -60% 0px',
      threshold: 0
    };
    
    const handleIntersect = (entries: IntersectionObserverEntry[]) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id);
        }
      });
    };
    
    const observer = new IntersectionObserver(handleIntersect, observerOptions);
    sectionIds.forEach(id => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    
    return () => observer.disconnect();
  }, [currentNavItems]);

  // Handle active indicator line alignment
  useEffect(() => {
    const activeIndex = currentNavItems.findIndex(item => item.id === activeSection);
    if (activeIndex !== -1 && itemRefs.current[activeIndex]) {
      const activeEl = itemRefs.current[activeIndex];
      if (activeEl) {
        // center position of active label element relative to its container
        const topPos = activeEl.offsetTop + activeEl.offsetHeight / 2;
        setIndicatorTop(topPos);
      }
    }
  }, [activeSection, currentNavItems]);

  // Click outside language selector
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (langContainerRef.current && !langContainerRef.current.contains(event.target as Node)) {
        setLangOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Fetch unique visitor counts
  useEffect(() => {
    let cid = typeof window !== 'undefined' ? localStorage.getItem('visitor_soul_id') : null;
    if (!cid && typeof window !== 'undefined') {
       cid = Math.random().toString(36).substring(2, 15);
       localStorage.setItem('visitor_soul_id', cid);
    }

    const fetchStats = async () => {
      try {
        const res = await fetch('/api/visitor-count');
        const json = await res.json();
        if (json.success) setVisitorStats({ uniqueCount: json.uniqueCount, totalHits: json.totalHits });
      } catch (e) {}
    };

    const incrementStats = async () => {
      try {
        await fetch('/api/visitor-count', {
           method: 'POST',
           headers: { 'Content-Type': 'application/json' },
           body: JSON.stringify({ cid })
        });
        fetchStats();
      } catch (e) {}
    };

    fetchStats();
    const humanCheck = setTimeout(incrementStats, 3000);
    const interval = setInterval(fetchStats, 60000);
    return () => {
      clearTimeout(humanCheck);
      clearInterval(interval);
    };
  }, []);

  const handleLinkClick = (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    const el = id === "hero" ? null : document.getElementById(id);
    if (id === "hero") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleLangClick = () => {
    const now = Date.now();
    const recentClicks = [...clickTimesRef.current.filter(t => now - t < 2000), now];
    clickTimesRef.current = recentClicks;

    if (recentClicks.length >= 5) {
      clickTimesRef.current = [];
      if (language !== 'eridian') {
        setLanguage('eridian');
        setLangOpen(false);
        return;
      }
    }
    setLangOpen(!langOpen);
  };

  const handleVersionToggle = () => {
    setDesignVersion(designVersion === "old" ? "new" : "old");
  };

  if (!isMounted) return null;

  const activeLang = language === 'eridian' 
    ? { code: 'eridian', short: '♩', label: 'ERIDIAN' }
    : (LANGUAGES.find(l => l.code === language) || { code: 'en', short: 'EN', label: 'ENGLISH' });

  const uniqueString = (visitorStats?.uniqueCount ?? 0).toString().padStart(4, '0');
  const digits = uniqueString.split('');

  return (
    <>
      {/* 1. Brand / HP Avatar Logo in top-right */}
      <div className="fixed top-6 right-6 z-[100] flex items-center">
        <div className="relative group flex items-center justify-end">
          <div className="absolute right-14 bg-[#050505] border border-[#8A7F72]/30 px-3 py-1.5 rounded text-[10px] font-mono text-[#E8703A] tracking-wider whitespace-nowrap opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto group-hover:translate-x-0 translate-x-2 transition-all duration-300 shadow-[0_4px_20px_rgba(0,0,0,0.8)]">
            HARSHAL PATEL // STUDIO
          </div>
          <a
            href="#"
            onClick={(e) => handleLinkClick(e, "hero")}
            className="w-11 h-11 rounded-lg border border-[#E8703A] overflow-hidden bg-[#050505] flex items-center justify-center p-0.5 active:scale-95 transition-all duration-300 shadow-[0_2px_12px_rgba(232,112,58,0.15)]"
          >
            <Image
              src="/icon.png"
              alt="HP Logo"
              width={40}
              height={40}
              priority
              className="w-full h-full object-contain rounded"
            />
          </a>
        </div>
      </div>

      {/* 2. Right-side vertical navigation strip */}
      <div 
        className="fixed right-0 top-1/2 -translate-y-1/2 z-[100] w-12 flex flex-col items-center py-6 pointer-events-none"
      >
        <div className="flex flex-col items-center gap-8 pointer-events-auto w-full">
          
          {/* Language Selector (JetBrains Mono) */}
          <div ref={langContainerRef} className="relative flex flex-col items-center">
            <button
              onClick={handleLangClick}
              className={`font-mono text-[9px] font-bold tracking-wider px-2 py-1 border transition-colors select-none cursor-pointer ${
                langOpen 
                  ? "text-[#E8703A] border-[#E8703A] bg-black/80" 
                  : "text-[#8A7F72] border-[#8A7F72]/20 hover:text-white hover:border-[#8A7F72]/60"
              }`}
            >
              {activeLang.short}
            </button>
            
            {langOpen && (
              <div 
                className="absolute right-10 top-0 flex flex-col bg-[#050505] border border-[#8A7F72]/30 max-h-[240px] overflow-y-auto w-36 shadow-[0_10px_30px_rgba(0,0,0,0.8)] z-50 select-none"
                style={{ scrollbarWidth: 'none' }}
              >
                {/* Eridian selection */}
                {language === 'eridian' && (
                  <button
                    onClick={() => { setLanguage('en'); setLangOpen(false); }}
                    className="font-mono text-[9px] text-left px-3 py-2 border-b border-[#8A7F72]/15 text-[#E8703A] hover:bg-[#E8703A]/10 w-full"
                  >
                    ♩ EN
                  </button>
                )}
                {LANGUAGES.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => { setLanguage(lang.code); setLangOpen(false); }}
                    className={`font-mono text-[9px] text-left px-3 py-2 border-b border-[#8A7F72]/10 transition-colors w-full ${
                      language === lang.code 
                        ? 'text-[#E8703A] bg-[#E8703A]/5 font-bold' 
                        : 'text-[#8A7F72] hover:bg-neutral-900 hover:text-white'
                    }`}
                  >
                    {lang.label}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Ruler spine + section labels */}
          <div className="relative flex flex-col items-center py-6 w-full">
            {/* Spine Line */}
            <div className="absolute top-0 bottom-0 left-[24px] w-[1px] bg-[#8A7F72]/30" />
            
            {/* Active section indicator */}
            <div
              className="absolute left-[16px] text-[#E8703A] text-[7px] leading-none transition-all duration-400 ease-[cubic-bezier(0.22,1,0.36,1)] select-none pointer-events-none"
              style={{
                top: `${indicatorTop}px`,
                transform: 'translateY(-50%)'
              }}
            >
              ◄
            </div>

            {/* Labels in vertical flex stack with 48px gap */}
            <div className="flex flex-col gap-12 relative w-full items-center">
              {currentNavItems.map((item, idx) => {
                const isActive = activeSection === item.id;
                return (
                  <div
                    key={item.id}
                    ref={(el) => {
                      itemRefs.current[idx] = el;
                    }}
                    className="relative py-1 flex items-center justify-center w-full group cursor-pointer"
                    onClick={(e) => handleLinkClick(e, item.id)}
                  >
                    {/* Spine cross tick mark */}
                    <div className="absolute left-[21px] w-[7px] h-[1px] bg-[#8A7F72]/40 pointer-events-none" />
                    
                    <span
                      className={`font-mono text-[9px] uppercase tracking-[0.2em] transition-colors duration-300 select-none ${
                        isActive ? "text-[#E8703A] font-bold" : "text-[#8A7F72] group-hover:text-white"
                      }`}
                      style={{ writingMode: "vertical-rl", textOrientation: "mixed" }}
                    >
                      {item.label}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* V1 / V2 control switcher */}
          <div className="flex flex-col items-center gap-1.5 mt-2">
            <span className="text-[#8A7F72]/60 font-mono text-[7px] select-none">// VER</span>
            <button
              onClick={handleVersionToggle}
              className="flex flex-col items-start gap-1 cursor-pointer group"
            >
              <div className="flex items-center gap-1">
                <div className={`w-1 h-1 rounded-full transition-all duration-300 ${designVersion === "old" ? "bg-[#E8703A] scale-110" : "bg-transparent"}`} />
                <span className={`font-mono text-[8px] leading-none transition-colors ${designVersion === "old" ? "text-[#E8703A] font-bold" : "text-[#8A7F72] group-hover:text-white"}`}>V1</span>
              </div>
              <div className="flex items-center gap-1">
                <div className={`w-1 h-1 rounded-full transition-all duration-300 ${designVersion === "new" ? "bg-[#E8703A] scale-110" : "bg-transparent"}`} />
                <span className={`font-mono text-[8px] leading-none transition-colors ${designVersion === "new" ? "text-[#E8703A] font-bold" : "text-[#8A7F72] group-hover:text-white"}`}>V2</span>
              </div>
            </button>
          </div>

          {/* Flip-style Visits counter */}
          <div className="flex flex-col items-center">
            <span className="text-[#8A7F72]/60 font-mono text-[7px] tracking-wider mb-1.5 select-none">// VISITS</span>
            <div className="flex gap-0.5 font-mono text-[10px] text-[#E8703A]">
              {digits.map((digit, idx) => (
                <div 
                  key={idx} 
                  className="bg-black/80 border border-[#8A7F72]/20 px-0.5 py-0.5 rounded-sm min-w-[12px] h-[16px] flex items-center justify-center font-bold shadow-inner"
                >
                  {digit}
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </>
  );
}
