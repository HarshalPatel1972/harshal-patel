"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { useDesignVersion } from "@/components/shared/DesignVersionContext";
import { BackToTop } from "@/components/shared/BackToTop";

// SHARED DECOR & TRANSITIONS
const OldPreloader = dynamic(() => import("@/components/old/Preloader"), { ssr: false });
const NewPreloader = dynamic(() => import("@/components/Preloader"), { ssr: false });
const Cursor = dynamic(() => import("@/components/ui/Cursor"), { ssr: false });
const FlipTransition = dynamic(() => import("@/components/ui/FlipTransition").then(mod => mod.FlipTransition), { ssr: false });
const SpaceWarpTransition = dynamic(() => import("@/components/ui/SpaceWarpTransition").then(mod => mod.SpaceWarpTransition), { ssr: false });

import { useFlipTransition } from "@/context/FlipContext";

// The two designs are big and a visitor only ever sees one, so each is its own chunk.
const OldDesign = dynamic(() => import("@/components/designs/OldDesign"), { ssr: false });
const NewDesign = dynamic(() => import("@/components/designs/NewDesign"), { ssr: false });

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
      if (hash && hash.length > 1) {
        const targetId = hash.substring(1);
        const timer = setTimeout(() => {
          const section = document.getElementById(targetId);
          if (section) {
            section.scrollIntoView({ behavior: "auto" });
          }
        }, 150);
        return () => clearTimeout(timer);
      }
    }
  }, [showContent]);

  const isOldDesign = designVersion === "old";
  const layerProps = {
    showContent,
    isNoticeVisible,
    onDismissNotice: () => setIsNoticeVisible(false),
    containerTop,
    stickyTarget,
  };

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
      {showContent && <BackToTop />}

      {/* RENDER PRESENTATION LAYER */}
      {isMounted && (
        isOldDesign ? <OldDesign {...layerProps} /> : <NewDesign {...layerProps} />
      )}
    </main>
  );
}

export default function Home() {
  return (
    <HomeContent />
  );
}
