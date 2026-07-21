"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { useDesignVersion } from "@/components/shared/DesignVersionContext";
import { DesignVersionSwitcher } from "@/components/shared/DesignVersionSwitcher";
import { LanguageTransitionWrapper } from "@/context/LanguageContext";

// SHARED DECOR & TRANSITIONS
const OldPreloader = dynamic(() => import("@/components/old/Preloader"), { ssr: false });
const NewPreloader = dynamic(() => import("@/components/Preloader"), { ssr: false });
const ScrollLine = dynamic(() => import("@/components/AnimationKit").then(mod => mod.ScrollLine), { ssr: false });
const Cursor = dynamic(() => import("@/components/ui/Cursor"), { ssr: false });
const FlipTransition = dynamic(() => import("@/components/ui/FlipTransition").then(mod => mod.FlipTransition), { ssr: false });
const SpaceWarpTransition = dynamic(() => import("@/components/ui/SpaceWarpTransition").then(mod => mod.SpaceWarpTransition), { ssr: false });

import { useFlipTransition } from "@/context/FlipContext";

// LEGACY (OLD) PRESENTATION LAYER COMPONENTS
import { Navbar as OldNavbar } from "@/components/old/Navbar";
import { SystemBanner as OldSystemBanner } from "@/components/old/SystemBanner";
import { Hero as OldHero } from "@/components/old/Hero";
import { Projects as OldProjects } from "@/components/old/Projects";
import { About as OldAbout } from "@/components/old/About";
import { Contact as OldContact } from "@/components/old/Contact";
import { Footer as OldFooter } from "@/components/old/Footer";
import { VisitorCounter } from "@/components/VisitorCounter";
import { LanguageSelector } from "@/components/LanguageSelector";

// FUTURISTIC (NEW) PRESENTATION LAYER COMPONENTS
import { Navbar as NewNavbar } from "@/components/new/Navbar";
import { SystemBanner as NewSystemBanner } from "@/components/new/SystemBanner";
import { Hero as NewHero } from "@/components/new/Hero";
import { Manifesto as NewManifesto } from "@/components/new/Manifesto";
import { Projects as NewProjects } from "@/components/new/Projects";
import { About as NewAbout } from "@/components/new/About";
import { Contact as NewContact } from "@/components/new/Contact";
import { Footer as NewFooter } from "@/components/new/Footer";

function HomeContent() {
  const [showContent, setShowContent] = useState(false);
  const [isNoticeVisible, setIsNoticeVisible] = useState(true);
  const { type } = useFlipTransition();
  const { designVersion, isMounted } = useDesignVersion();

  // Top offsets based on notice visibility (Legacy only)
  const containerTop = isNoticeVisible ? '50px' : '20px';
  const stickyTarget = isNoticeVisible ? '50px' : '20px';

  // Safe Landing Bridge: Precision navigation after preloader
  useEffect(() => {
    if (showContent && typeof window !== "undefined") {
      const hash = window.location.hash;
      if (hash === "#contact") {
        const timer = setTimeout(() => {
          const section = document.getElementById("contact");
          if (section) {
            section.scrollIntoView({ behavior: "auto" });
          }
        }, 150);
        return () => clearTimeout(timer);
      }
    }
  }, [showContent]);

  const isOldDesign = isMounted && designVersion === "old";

  return (
    <main className="relative bg-neutral-950 min-h-screen">
      {type === 'FLIP' ? <FlipTransition /> : <SpaceWarpTransition />}
      {!showContent && isMounted && (
        designVersion === "old" ? (
          <OldPreloader onComplete={() => setShowContent(true)} />
        ) : (
          <NewPreloader onComplete={() => setShowContent(true)} />
        )
      )}
      
      {showContent && <Cursor />}

      {/* RENDER PRESENTATION LAYER */}
      {isOldDesign ? (
        /* ================= LEGACY DESIGN LAYER ================= */
        <>
          <div className={`${showContent ? "opacity-100" : "opacity-0 pointer-events-none"}`}>
            <OldNavbar />
            <ScrollLine isVisible={showContent} />
            
            {/* Zero-Lag Utility Container - Full height track */}
            <div 
              className="absolute left-4 bottom-0 z-[100] flex flex-col items-start pointer-events-none"
              style={{ top: containerTop }}
            >
              <div className="pointer-events-auto">
                <VisitorCounter />
              </div>
              <div className="h-[10px]" />
              <div 
                className="sticky transition-all duration-700 pointer-events-auto flex items-center gap-2"
                style={{ top: stickyTarget }}
              >
                <LanguageSelector />
                <DesignVersionSwitcher />
              </div>
            </div>
          </div>

          <LanguageTransitionWrapper className={`transition-opacity duration-700 mr-12 md:mr-16 overflow-clip ${showContent ? "opacity-100" : "opacity-0"}`}>
            <OldSystemBanner isVisible={isNoticeVisible} onDismiss={() => setIsNoticeVisible(false)} />
            <OldHero />
            <OldProjects />
            <OldAbout />
            <OldContact />
            <OldFooter />
          </LanguageTransitionWrapper>
        </>
      ) : (
        /* ================= FUTURISTIC PREMIUM DESIGN LAYER ================= */
        <>
          <div className={`${showContent ? "opacity-100" : "opacity-0 pointer-events-none"}`}>
            <NewNavbar />
            <ScrollLine isVisible={showContent} theme="new" />
            
            {/* Zero-Lag Utility Container - Full height track */}
            <div 
              className="absolute left-4 bottom-0 z-[100] flex flex-col items-start pointer-events-none"
              style={{ top: containerTop }}
            >
              <div className="pointer-events-auto">
                <VisitorCounter />
              </div>
              <div className="h-[10px]" />
              <div 
                className="sticky transition-all duration-700 pointer-events-auto flex items-center gap-2"
                style={{ top: stickyTarget }}
              >
                <LanguageSelector />
                <DesignVersionSwitcher />
              </div>
            </div>
          </div>

          <LanguageTransitionWrapper className={`transition-opacity duration-700 mr-12 md:mr-16 overflow-clip ${showContent ? "opacity-100" : "opacity-0"}`}>
            <NewSystemBanner isVisible={isNoticeVisible} onDismiss={() => setIsNoticeVisible(false)} />
            
            <NewHero />
            <NewManifesto />
            <NewProjects />
            <NewAbout />
            <NewContact />
            <NewFooter />
          </LanguageTransitionWrapper>
        </>
      )}
    </main>
  );
}

export default function Home() {
  return (
    <HomeContent />
  );
}
