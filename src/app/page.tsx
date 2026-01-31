import { Navbar } from "@/components/layout/Navbar";
import { Hero } from "@/components/sections/Hero";
import { About } from "@/components/sections/About";
import { Work } from "@/components/sections/Work";
import { Contact } from "@/components/sections/Contact";
import { DesktopDashboard } from "@/components/layout/DesktopDashboard";

export default function Home() {
  return (
    <>
      {/* 📱 MOBILE: Standard Vertical Scroll */}
      <div className="block md:hidden">
        <Navbar />
        <main>
          <Hero />
          <About />
          <Work />
          <Contact />
        </main>
      </div>

      {/* 🖥️ DESKTOP: No-Scroll Grid Dashboard */}
      <div className="hidden md:block">
        <DesktopDashboard />
      </div>
    </>
  );
}
