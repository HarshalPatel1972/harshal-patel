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
const OldNavbar = dynamic(() => import("@/components/old/Navbar").then(mod => mod.Navbar), { ssr: false });
const OldSystemBanner = dynamic(() => import("@/components/old/SystemBanner").then(mod => mod.SystemBanner), { ssr: false });
const OldHero = dynamic(() => import("@/components/old/Hero").then(mod => mod.Hero), { ssr: false });
const OldProjects = dynamic(() => import("@/components/old/Projects").then(mod => mod.Projects), { ssr: false });
const OldAbout = dynamic(() => import("@/components/old/About").then(mod => mod.About), { ssr: false });
const OldContact = dynamic(() => import("@/components/old/Contact").then(mod => mod.Contact), { ssr: false });
const OldFooter = dynamic(() => import("@/components/old/Footer").then(mod => mod.Footer), { ssr: false });
const VisitorCounter = dynamic(() => import("@/components/VisitorCounter").then(mod => mod.VisitorCounter), { ssr: false });
const LanguageSelector = dynamic(() => import("@/components/LanguageSelector").then(mod => mod.LanguageSelector), { ssr: false });

// FUTURISTIC (NEW) PRESENTATION LAYER COMPONENTS
const NewNavbar = dynamic(() => import("@/components/new/Navbar").then(mod => mod.Navbar), { ssr: false });
const NewSystemBanner = dynamic(() => import("@/components/new/SystemBanner").then(mod => mod.SystemBanner), { ssr: false });
const NewHero = dynamic(() => import("@/components/new/Hero").then(mod => mod.Hero), { ssr: false });
const NewManifesto = dynamic(() => import("@/components/new/Manifesto").then(mod => mod.Manifesto), { ssr: false });
const NewProjects = dynamic(() => import("@/components/new/Projects").then(mod => mod.Projects), { ssr: false });
const NewAbout = dynamic(() => import("@/components/new/About").then(mod => mod.About), { ssr: false });
const NewContact = dynamic(() => import("@/components/new/Contact").then(mod => mod.Contact), { ssr: false });
const NewFooter = dynamic(() => import("@/components/new/Footer").then(mod => mod.Footer), { ssr: false });

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
    <main className="relative bg-neutral-950 min-h-screen overflow-x-hidden">
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

          <LanguageTransitionWrapper className={`transition-opacity duration-700 mr-12 md:mr-16 overflow-hidden ${showContent ? "opacity-100" : "opacity-0"}`}>
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

          <LanguageTransitionWrapper className={`transition-opacity duration-700 mr-12 md:mr-16 overflow-hidden ${showContent ? "opacity-100" : "opacity-0"}`}>
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
