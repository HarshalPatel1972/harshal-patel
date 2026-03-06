"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

type Language = "en" | "ja";

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  isTransitioning: boolean;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("mappa-lang") as Language;
      if (saved === "ja" || saved === "en") {
        return saved;
      }
    }
    return "en";
  });
  const [isTransitioning, setIsTransitioning] = useState(false);

  const setLanguage = (lang: Language) => {
    if (lang === language) return;
    
    // Trigger transition out (fade to 0 opacity over 400ms)
    setIsTransitioning(true);
    localStorage.setItem("mappa-lang", lang);
    
    // Switch the text directly when opacity is exactly 0
    setTimeout(() => {
      setLanguageState(lang);
      // Remove transitioning class, starting the fade back in (400ms)
      setIsTransitioning(false);
    }, 400); 
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, isTransitioning }}>
      {/* 
        This wrapper is responsible for the calming ink effect during transitions.
        When isTransitioning is true, all text/layout blurs out and fades smoothly to 0 opacity.
      */}
      <div 
        className={`transition-all duration-[400ms] ease-in-out w-full h-full ${
          isTransitioning ? "blur-[12px] opacity-0 grayscale" : "blur-0 opacity-100 grayscale-0"
        } ${language === 'ja' ? 'font-japanese' : ''}`}
      >
        {children}
      </div>
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}
