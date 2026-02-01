import { Navbar } from "@/components/layout/Navbar";
import { Hero } from "@/components/sections/Hero";
import { About } from "@/components/sections/About";
import { Work } from "@/components/sections/Work";
import { Contact } from "@/components/sections/Contact";
import { DesktopDashboard } from "@/components/layout/DesktopDashboard";
import { MobileDashboard } from "@/components/layout/MobileDashboard";

export default function Home() {
  return (
    <>
      {/* 📱 MOBILE: OS Dashboard */}
      <div className="block md:hidden">
        <MobileDashboard />
      </div>

      {/* 🖥️ DESKTOP: No-Scroll Grid Dashboard */}
      <div className="hidden md:block">
        <DesktopDashboard />
      </div>
    </>
  );
}
