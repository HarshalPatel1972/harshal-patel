"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useLanguage, type Language } from "@/context/LanguageContext";
import { LanguageSelector } from "@/components/LanguageSelector";

type NavItem = {
  id: string;
  label: string;
};

const NAV_ITEMS: Record<Language, NavItem[]> = {
  en: [
    { id: "hero", label: "Home" },
    { id: "projects", label: "Work" },
    { id: "about", label: "Origin" },
    { id: "contact", label: "Contact" },
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
    { id: "hero", label: "Accueil" },
    { id: "projects", label: "Projets" },
    { id: "about", label: "Origine" },
    { id: "contact", label: "Contact" },
  ],
  id: [
    { id: "hero", label: "Beranda" },
    { id: "projects", label: "Karya" },
    { id: "about", label: "Asal" },
    { id: "contact", label: "Kontak" },
  ],
  de: [
    { id: "hero", label: "Start" },
    { id: "projects", label: "Projekte" },
    { id: "about", label: "Über mich" },
    { id: "contact", label: "Kontakt" },
  ],
  it: [
    { id: "hero", label: "Home" },
    { id: "projects", label: "Progetti" },
    { id: "about", label: "Origine" },
    { id: "contact", label: "Contatti" },
  ],
  "pt-br": [
    { id: "hero", label: "Início" },
    { id: "projects", label: "Projetos" },
    { id: "about", label: "Sobre" },
    { id: "contact", label: "Contato" },
  ],
  "es-419": [
    { id: "hero", label: "Inicio" },
    { id: "projects", label: "Proyectos" },
    { id: "about", label: "Origen" },
    { id: "contact", label: "Contacto" },
  ],
  es: [
    { id: "hero", label: "Inicio" },
    { id: "projects", label: "Proyectos" },
    { id: "about", label: "Origen" },
    { id: "contact", label: "Contacto" },
  ],
  eridian: [
    { id: "hero", label: "WHO-IS" },
    { id: "projects", label: "MAKE-WORK" },
    { id: "about", label: "DATA-CORE" },
    { id: "contact", label: "SIGNAL-SEND" },
  ]
};

export function Navbar() {
  const { language } = useLanguage();
  const currentNavItems = NAV_ITEMS[language as keyof typeof NAV_ITEMS] || NAV_ITEMS.en;
  const [activeSection, setActiveSection] = useState("hero");
  const [isScrolled, setIsScrolled] = useState(false);

  // Monitor Scroll for Glass background opacity and section highlighting
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40);

      // Section tracking
      const scrollPosition = window.scrollY + 200;
      const sectionElements = currentNavItems.map(item => document.getElementById(item.id));
      
      for (let i = sectionElements.length - 1; i >= 0; i--) {
        const el = sectionElements[i];
        if (el && scrollPosition >= el.offsetTop) {
          setActiveSection(currentNavItems[i].id);
          break;
        }
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [currentNavItems]);

  const handleLinkClick = (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    const el = id === "hero" ? null : document.getElementById(id);
    if (id === "hero") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <header 
      className={`fixed top-4 left-1/2 -translate-x-1/2 z-[9999] w-[92%] max-w-4xl transition-all duration-500`}
    >
      <div 
        className={`flex items-center justify-between px-4 py-3 md:px-6 md:py-3.5 rounded-full border transition-all duration-500
          ${isScrolled 
            ? "bg-neutral-950/75 border-white/[0.08] backdrop-blur-xl shadow-[0_10px_30px_rgba(0,0,0,0.5)]" 
            : "bg-neutral-950/30 border-white/[0.04] backdrop-blur-md"}`}
      >
        
        {/* Brand / HP Logo */}
        <div className="flex items-center gap-2">
          <a 
            href="#" 
            onClick={(e) => handleLinkClick(e, "hero")}
            className="flex items-center gap-2 group active:scale-95 transition-transform"
          >
            <div className="h-8 w-8 relative rounded-full overflow-hidden border border-white/20 bg-neutral-900 flex items-center justify-center p-0.5">
              <Image 
                src="/icon.png" 
                alt="HP Logo" 
                width={28} 
                height={28} 
                className="object-contain group-hover:scale-110 transition-transform duration-300"
              />
            </div>
            <span className="text-white font-mono text-sm font-semibold tracking-wider group-hover:text-cyan-400 transition-colors hidden sm:inline-block">
              {language === 'eridian' ? "HARSHAL" : "Harshal Patel"}
            </span>
          </a>
        </div>

        {/* Central Nav Links */}
        <nav className="flex items-center gap-1 bg-white/[0.02] border border-white/[0.04] p-1 rounded-full">
          {currentNavItems.map((item) => {
            const isActive = activeSection === item.id;
            return (
              <a
                key={item.id}
                href={`#${item.id}`}
                onClick={(e) => handleLinkClick(e, item.id)}
                className={`relative px-3.5 py-1.5 rounded-full text-xs font-medium tracking-wide uppercase transition-all duration-300
                  ${isActive 
                    ? "text-black bg-cyan-400 font-semibold shadow-[0_2px_10px_rgba(34,211,238,0.2)]" 
                    : "text-neutral-400 hover:text-white"}`}
              >
                {item.label}
              </a>
            );
          })}
        </nav>

        {/* Utility Controls: Language Selector */}
        <div className="flex items-center gap-2">
          <div className="scale-90 origin-right">
            <LanguageSelector />
          </div>
        </div>

      </div>
    </header>
  );
}
