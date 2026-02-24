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
