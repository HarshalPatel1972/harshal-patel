import { profile } from "@/data/profile";

export function Footer() {
  return (
    <footer className="relative bg-[#050505] border-t-8 border-[var(--text-bone)] px-4 py-8 md:px-8">
      {/* Halftone / Grain Texture Base */}
      <div className="absolute inset-0 halftone-bg z-0 opacity-10 pointer-events-none" />

      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 relative z-10">
        <div className="text-xl md:text-3xl font-black font-display uppercase tracking-widest text-[var(--text-bone)]">
          {profile.name} <span className="text-[var(--accent-blood)]">© {new Date().getFullYear()}</span>
        </div>
        
        <div className="flex items-center gap-4 border-2 border-[var(--text-bone)] px-4 py-2">
           <span className="text-[10px] md:text-xs font-mono font-bold text-[var(--text-bone)] uppercase tracking-[0.2em]">
             End of Record
           </span>
           <div className="w-2 h-2 bg-[var(--accent-blood)]" />
        </div>
      </div>
    </footer>
  );
}
