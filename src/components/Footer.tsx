import { profile } from "@/data/profile";

export function Footer() {
  return (
    <footer className="relative py-12 px-6 border-t border-white/[0.04]">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="text-sm text-white/30 font-mono">
          © {new Date().getFullYear()} {profile.name}
        </div>
        <div className="text-[11px] text-white/20 font-mono tracking-wider">
          Designed & Built with ♥
        </div>
      </div>
    </footer>
  );
}
