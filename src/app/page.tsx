"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { Projects } from "@/components/Projects";
import { About } from "@/components/About";
import { Contact } from "@/components/Contact";
import { Footer } from "@/components/Footer";
import { ScrollLine } from "@/components/AnimationKit";
import { SceneTransitionTripwire } from "@/components/ui/SceneTransitionTripwire";

const Preloader = dynamic(() => import("@/components/Preloader"), {
  ssr: true, // Allow initial black screen in SSR
});

export default function Home() {
  const [showContent, setShowContent] = useState(false);

  return (
    <main className="relative">
      <Preloader onComplete={() => setShowContent(true)} />
      
      <div className={`transition-opacity duration-700 mr-12 md:mr-16 ${showContent ? "opacity-100" : "opacity-0"}`}>
        <ScrollLine />
        <Navbar />
        <Hero />
        
        {/* Cinematic Scene Cut Tripwire */}
        <SceneTransitionTripwire id="hero-to-projects-cut" />
        
        <Projects />
        
        {/* Cinematic Scene Cut Tripwire */}
        <SceneTransitionTripwire id="projects-to-about-cut" />

        <About />

        {/* Cinematic Scene Cut Tripwire */}
        <SceneTransitionTripwire id="about-to-contact-cut" />

        <Contact />
        <Footer />
      </div>
    </main>
  );
}
