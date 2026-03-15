"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

type Language = "en" | "ja" | "ko" | "zh-tw";

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  isTransitioning: boolean;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>("en");
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("mappa-lang") as Language;
    if (saved === "ja" || saved === "en" || saved === "ko" || saved === "zh-tw") {
      setLanguageState(saved);
    }
  }, []);

  const setLanguage = (lang: Language) => {
    if (lang === language) return;
    
    // Trigger transition out (fade to 0 opacity over 1200ms for smooth drift)
    setIsTransitioning(true);
    localStorage.setItem("mappa-lang", lang);
    
    // Switch the text directly after the smoke has fully covered it
    setTimeout(() => {
      setLanguageState(lang);
      // Remove transitioning class, starting the very slow, smooth fade back in
      setIsTransitioning(false);
    }, 1200); 
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, isTransitioning }}>
      {children}
    </LanguageContext.Provider>
  );
}

// Transition wrapper — use this ONLY around content that should blur during transitions
// NOT around position:fixed elements like nav or preloader
export function LanguageTransitionWrapper({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  const { isTransitioning, language } = useLanguage();
  return (
    <div 
      className={`language-transition-root ${isTransitioning ? 'is-smoking' : ''} ${language === 'ja' ? 'font-japanese' : ''} ${language === 'ko' ? 'font-korean' : ''} ${language === 'zh-tw' ? 'font-chinese' : ''} ${className}`}
    >
      {children}
    </div>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}
