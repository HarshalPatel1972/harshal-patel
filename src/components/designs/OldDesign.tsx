"use client";

import dynamic from "next/dynamic";
import { DesignVersionSwitcher } from "@/components/shared/DesignVersionSwitcher";
import { LanguageTransitionWrapper } from "@/context/LanguageContext";
import { VisitorCounter } from "@/components/VisitorCounter";
import { LanguageSelector } from "@/components/LanguageSelector";
import { Navbar } from "@/components/old/Navbar";
import { Hero } from "@/components/old/Hero";
import { Projects } from "@/components/old/Projects";
import { About } from "@/components/old/About";
import { Contact } from "@/components/old/Contact";
import { Footer } from "@/components/old/Footer";
import type { DesignLayerProps } from "./types";

// Offset of the visitor counter / language selector track from the top of the page
const UTILITY_TOP = "20px";

const ScrollLine = dynamic(() => import("@/components/AnimationKit").then(mod => mod.ScrollLine), { ssr: false });

/** The legacy (V1) presentation layer. Loaded on demand from page.tsx. */
export default function OldDesign({ showContent }: DesignLayerProps) {
  return (
    <>
      <div className={`${showContent ? "opacity-100" : "opacity-0 pointer-events-none"}`}>
        <Navbar ready={showContent} />
        <ScrollLine isVisible={showContent} />

        {/* Zero-Lag Utility Container - Full height track */}
        <div
          className={`absolute left-4 bottom-0 z-[100] flex flex-col items-start ${showContent ? "pointer-events-none" : "!pointer-events-none"}`}
          style={{ top: UTILITY_TOP }}
        >
          <div className={showContent ? "pointer-events-auto" : "pointer-events-none"}>
            <VisitorCounter />
          </div>
          <div className="h-[10px]" />
          <div
            className={`sticky transition-all duration-700 flex items-center gap-2 ${showContent ? "pointer-events-auto" : "pointer-events-none"}`}
            style={{ top: UTILITY_TOP }}
          >
            <LanguageSelector />
            <DesignVersionSwitcher />
          </div>
        </div>
      </div>

      <LanguageTransitionWrapper className={`transition-opacity duration-700 mr-12 md:mr-16 overflow-clip ${showContent ? "opacity-100" : "opacity-0 !pointer-events-none"}`}>
        <Hero />
        <Projects />
        <About />
        <Contact />
        <Footer />
      </LanguageTransitionWrapper>
    </>
  );
}
