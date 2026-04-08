"use client";

import React, { useState, useEffect, Suspense, useRef, useMemo } from "react";
import { motion, AnimatePresence, useScroll, useTransform, useSpring, useMotionValue, useAnimationFrame } from "framer-motion";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";

/* ─── EXACT TALKY.IO STYLE NAME GENERATOR constants ─── */
const PREPOSITIONS = ["against", "along", "across", "beside", "within", "beyond", "under", "above", "through", "around", "behind", "below"];
const ADJECTIVES = [
  "autumn", "silent", "vivid", "hidden", "atomic", "crimson", "emerald", "sapphire", 
  "lunar", "solar", "arctic", "golden", "silver", "neon", "ancient", "modern"
];
const NOUNS = [
  "wave", "river", "mountain", "forest", "star", "moon", "pulse", "echo", "nova", 
  "falcon", "tiger", "lion", "apex", "zenith", "shadow", "aura", "luna"
];

const RANDOM_ID = () => {
  const prep = PREPOSITIONS[Math.floor(Math.random() * PREPOSITIONS.length)];
  const adj = ADJECTIVES[Math.floor(Math.random() * ADJECTIVES.length)];
  const noun = NOUNS[Math.floor(Math.random() * NOUNS.length)];
  const vowels = ["a", "e", "i", "o", "u"];
  const article = vowels.includes(adj[0].toLowerCase()) ? "an" : "a";
  return `${prep}-${article}-${adj}-${noun}`;
};

/* ─── PREMIUM DESIGNER PALETTE ─── */
const PALETTE = [
  "#1A1A1A", "#0984E3", "#D63031", "#00B894", "#6C5CE7", "#E17055", "#B33771", "#1B1464"
];

const GLOBAL_VOICES = [
  { id: "v1", userName: "against-an-autumn-wave", message: "The transitions are incredibly smooth. Feels premium.", type: "SUBMIT REVIEW" },
  { id: "v2", userName: "beyond-a-silent-star", message: "Found a minor alignment issue on mobile tablets.", type: "REPORT A BUG", status: "RESOLVED" },
  { id: "v3", userName: "across-the-vivid-nova", message: "Would love to see more interactive hover states on projects.", type: "REQUEST FEATURE", status: "IN PROGRESS" },
  { id: "v4", userName: "within-the-hidden-forest", message: "Absolutely loving the brutalist aesthetic. Bold choice.", type: "SUBMIT REVIEW" },
  { id: "v5", userName: "along-a-silver-river", message: "The language toggle is lightning fast.", type: "SUBMIT REVIEW" },
  { id: "v6", userName: "under-the-lunar-arctic", message: "Can we get a dark mode toggle for the text-heavy sections?", type: "REQUEST FEATURE", status: "CONSIDERING" },
  { id: "v7", userName: "around-a-golden-moon", message: "Brilliant work on the portfolio navigation.", type: "SUBMIT REVIEW" },
  { id: "v8", userName: "through-the-ancient-zenith", message: "The contrast between fonts is very professional.", type: "SUBMIT REVIEW" },
];

interface FeedbackEntry {
  id: string;
  timestamp: number;
  type: string;
  message: string;
  userName: string;
  color?: string;
  status?: string;
  // Position hints for the cloud layout
  pos?: { top: string, left: string };
}

function FloatingCard({ entry, idx, mousePos }: { entry: FeedbackEntry, idx: number, mousePos: { x: number, y: number } }) {
  const cardColor = entry.color || PALETTE[idx % PALETTE.length];
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotate = useMotionValue(0);
  const repelX = useSpring(0, { stiffness: 100, damping: 20 });
  const repelY = useSpring(0, { stiffness: 100, damping: 20 });
  const cardRef = useRef<HTMLDivElement>(null);

  const seeds = useMemo(() => ({
    xOffset: Math.random() * 1000,
    yOffset: Math.random() * 1000,
    rotateOffset: Math.random() * 1000,
    xSpeed: 0.0005 + Math.random() * 0.0005,
    ySpeed: 0.0005 + Math.random() * 0.0005,
    rotateSpeed: 0.0002 + Math.random() * 0.0003,
    amplitudeX: 15 + Math.random() * 20,
    amplitudeY: 15 + Math.random() * 20,
    zDepth: 0.7 + Math.random() * 0.5,
  }), []);

  useAnimationFrame((time) => {
    x.set(Math.sin(time * seeds.xSpeed + seeds.xOffset) * seeds.amplitudeX);
    y.set(Math.cos(time * seeds.ySpeed + seeds.yOffset) * seeds.amplitudeY);
    rotate.set(Math.sin(time * seeds.rotateSpeed + seeds.rotateOffset) * 2);

    if (cardRef.current) {
      const rect = cardRef.current.getBoundingClientRect();
      const dx = (rect.left + rect.width / 2) - ((mousePos.x / 20 + 0.5) * window.innerWidth);
      const dy = (rect.top + rect.height / 2) - ((mousePos.y / 20 + 0.5) * window.innerHeight);
      const distance = Math.sqrt(dx * dx + dy * dy);
      const threshold = 250;
      if (distance < threshold) {
        const force = (threshold - distance) / threshold;
        repelX.set(dx * force * 0.4);
        repelY.set(dy * force * 0.4);
      } else {
        repelX.set(0);
        repelY.set(0);
      }
    }
  });

  const parallaxIntensity = seeds.zDepth * 1.2;

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, scale: 0.5 }}
      animate={{ opacity: 1, scale: seeds.zDepth }}
      whileHover={{ scale: seeds.zDepth * 1.05, rotateX: 10, rotateY: 10, zIndex: 1000 }}
      style={{ 
        x, y, rotate,
        translateX: (mousePos.x * parallaxIntensity * (idx % 2 === 0 ? 1 : -1)) + repelX.get(),
        translateY: (mousePos.y * parallaxIntensity * (idx % 3 === 0 ? 1 : -1)) + repelY.get(),
        borderLeftColor: cardColor,
        zIndex: Math.floor(seeds.zDepth * 100),
        perspective: "1000px",
        transformStyle: "preserve-3d"
      }}
      className={`relative group w-full md:w-[calc(33.333%-3rem)] min-w-[320px] max-w-[400px] bg-white border-4 border-black p-8 shadow-[12px_12px_0px_#000] rotate-[-1deg] hover:rotate-0 transition-transform duration-300 isolate border-l-[12px] h-fit cursor-pointer`}
    >
      <div className="absolute top-0 left-0 right-0 h-1 z-20" style={{ backgroundColor: cardColor }} />
      <div className="relative z-10">
        <div className="flex justify-between items-start gap-2 mb-4">
          <div className="flex gap-2">
            <div className="px-2 py-0.5 text-[8px] font-black uppercase tracking-[0.2em] text-white" style={{ backgroundColor: cardColor }}>{entry.type}</div>
            {entry.status && <div className="px-2 py-0.5 text-[8px] font-black uppercase tracking-[0.2em] border-2 border-black" style={{ color: cardColor, borderColor: cardColor }}>{entry.status}</div>}
          </div>
        </div>
        <h3 className="text-xl font-black uppercase tracking-tight mb-2 text-black truncate">{entry.userName}</h3>
        <p className="text-[13px] font-medium leading-tight text-black/80 group-hover:text-black transition-colors line-clamp-4">{entry.message}</p>
      </div>
    </motion.div>
  );
}

function FloatingGallery({ entries, onAddMore }: { entries: FeedbackEntry[], onAddMore: () => void }) {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  useEffect(() => {
    const handleMove = (e: MouseEvent) => setMousePos({ x: (e.clientX / window.innerWidth - 0.5) * 40, y: (e.clientY / window.innerHeight - 0.5) * 40 });
    window.addEventListener("mousemove", handleMove);
    return () => window.removeEventListener("mousemove", handleMove);
  }, []);

  return (
    <div className="relative w-full min-h-screen bg-white overflow-y-auto overflow-x-hidden p-4 md:p-8 cursor-default custom-scrollbar">
      <div className="fixed inset-0 halftone-bg opacity-[0.05] pointer-events-none" />
      <div className="fixed top-6 left-8 z-[100] flex gap-8 items-center"><Link href="/" className="font-black text-xs uppercase tracking-[0.3em] hover:opacity-50 transition-opacity text-black">← Back</Link></div>
      <div className="fixed top-6 right-8 z-[100]"><button onClick={onAddMore} className="bg-black text-white px-6 py-3 font-black text-xs uppercase tracking-[0.2em] shadow-[6px_6px_0px_#D63031] hover:shadow-[2px_2px_0px_#D63031] hover:translate-x-[4px] hover:translate-y-[4px] transition-all active:translate-x-0 active:translate-y-0 active:shadow-none">Add More</button></div>
      
      <div className="relative z-10 w-full min-h-screen pt-4">
        <h1 className="fixed bottom-12 left-8 md:bottom-20 md:left-20 text-[12vw] font-black uppercase leading-[0.8] tracking-tighter opacity-5 select-none pointer-events-none z-0 text-black">Message<br/>Gallery</h1>
        
        <div className="relative z-10 flex flex-wrap items-center justify-center gap-x-12 gap-y-32 pt-10 pb-40 px-4 md:px-20 max-w-[1400px] mx-auto">
          <div className="w-full flex justify-center mb-6 pointer-events-none">
             <div className="flex items-center gap-4">
              <div className="h-[2px] w-12 bg-black opacity-10" />
              <h2 className="text-[12px] font-black uppercase tracking-[0.5em] whitespace-nowrap text-black">Message Gallery</h2>
              <div className="h-[2px] w-12 bg-black opacity-10" />
            </div>
          </div>
          {entries.map((entry, idx) => <FloatingCard key={entry.id} entry={entry} idx={idx} mousePos={mousePos} />)}
        </div>
      </div>
    </div>
  );
}

function FeedbackWritingRoom({ onSend, onViewGallery, initialType }: { onSend: (name: string, msg: string, cat: string) => void, onViewGallery: () => void, initialType: string }) {
  const [userName, setUserName] = useState("");
  const [type, setType] = useState(initialType);
  const [message, setMessage] = useState("");
  const [isSending, setIsSending] = useState(false);
  useEffect(() => { const saved = localStorage.getItem("mappa-username"); if (saved) setUserName(saved); }, []);
  const handleSubmit = () => { if (!message.trim()) return; setIsSending(true); setTimeout(() => { onSend(userName, message, type); setIsSending(false); }, 1200); };
  
  return (
    <div className="min-h-screen h-[100dvh] bg-white text-black font-display p-4 md:p-10 flex items-center justify-center relative overflow-hidden">
      <div className="fixed inset-0 halftone-bg opacity-[0.03] pointer-events-none" />
      
      {/* Massive Background Typography - Matching Contact.tsx Style */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full flex justify-center pointer-events-none overflow-hidden z-0 opacity-5 select-none rotate-[-5deg]">
         <h2 className="text-[5rem] md:text-[22rem] font-black whitespace-nowrap leading-none tracking-tighter text-black uppercase">
            FEEDBACK
         </h2>
      </div>

      <div className="absolute top-6 left-8 z-10 flex gap-6 items-center"><Link href="/" className="font-black text-xs uppercase tracking-[0.3em] hover:opacity-50 transition-opacity">← Cancel</Link><div className="w-[1px] h-4 bg-black/20" /><button onClick={onViewGallery} className="font-black text-xs uppercase tracking-[0.3em] hover:opacity-50 transition-opacity whitespace-nowrap">Gallery →</button></div>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-2xl relative z-10 px-2">
        <h1 className="text-4xl sm:text-6xl md:text-7xl font-black uppercase leading-[0.85] tracking-tighter mb-6 md:mb-10 text-center">Write Your<br /><span className="bg-black text-white px-3 md:px-4 inline-block mt-2 text-3xl sm:text-5xl">Message</span></h1>
        <div className="space-y-4 md:space-y-8">
          <div><label className="block text-[10px] md:text-[11px] font-black uppercase tracking-[0.2em] mb-2 md:mb-3 opacity-40">Your Name:</label><div className="relative"><input type="text" value={userName} onChange={(e) => setUserName(e.target.value)} placeholder="Anonymous" className="w-full p-4 md:p-5 pr-32 md:pr-40 border-2 border-black font-mono text-xs md:text-sm focus:outline-none focus:ring-0 bg-white transition-all focus:shadow-[8px_8px_0px_#000]" /><button onClick={() => setUserName(RANDOM_ID())} className="absolute right-2 md:right-3 top-1/2 -translate-y-1/2 px-3 md:px-4 py-1.5 md:py-2 bg-black text-white font-black text-[9px] md:text-[10px] uppercase tracking-widest hover:bg-[#D63031] transition-colors">RANDOMIZE</button></div></div>
          <div><label className="block text-[10px] md:text-[11px] font-black uppercase tracking-[0.2em] mb-2 md:mb-3 opacity-40">Category:</label><div className="flex flex-wrap gap-2 md:gap-3">{["SUBMIT REVIEW", "REPORT A BUG", "REQUEST FEATURE"].map((o) => (<button key={o} onClick={() => setType(o)} className={`px-3 md:px-5 py-2 md:py-3 text-[8px] md:text-[10px] font-black border-2 border-black transition-all ${type === o ? "bg-black text-white shadow-[4px_4px_0px_#34C759]" : "bg-transparent hover:bg-black/5"}`}>{o}</button>))}</div></div>
          <div><label className="block text-[10px] md:text-[11px] font-black uppercase tracking-[0.2em] mb-2 md:mb-3 opacity-40">Words:</label><textarea value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Type here..." className="w-full h-32 md:h-48 p-5 md:p-7 border-2 border-black font-mono text-xs md:text-sm focus:outline-none focus:ring-0 resize-none bg-white transition-all focus:shadow-[8px_8px_0px_#000]" /></div>
          <button onClick={handleSubmit} disabled={isSending || !message.trim()} className={`w-full py-5 md:py-7 font-black tracking-[0.3em] md:tracking-[0.4em] text-md md:text-lg transition-all border-2 border-black relative ${isSending || !message.trim() ? "bg-black/10 text-black/30 opacity-50" : "bg-black text-white hover:bg-white hover:text-black hover:shadow-[10px_10px_0px_#000]"}`}>{isSending ? "SENDING..." : "LAUNCH SIGNAL"}</button>
        </div>
      </motion.div>
    </div>
  );
}

export function FeedbackContents() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialType = searchParams.get("type") || "SUBMIT REVIEW";
  const [view, setView] = useState<"writing" | "gallery">("writing");
  const [submissions, setSubmissions] = useState<FeedbackEntry[]>([]);

  useEffect(() => { if (searchParams.toString()) router.replace("/feedback"); }, [searchParams, router]);
  useEffect(() => {
    const saved = localStorage.getItem("mappa-signals");
    let userSubmissions: FeedbackEntry[] = [];
    if (saved) { try { userSubmissions = JSON.parse(saved); } catch (e) {} }
    
    // Distribute messages across the viewport in a scattered pattern
    const combined = [...userSubmissions, ...GLOBAL_VOICES].map((v, i) => ({ 
      ...v, 
      timestamp: Date.now(),
      pos: {
        left: `${10 + (i * 27) % 75}%`,
        top: `${15 + (i * 19) % 70}%`
      }
    }));
    setSubmissions(combined);
  }, []);

  const handleNewSend = (name: string, msg: string, cat: string) => {
    const newEntry: FeedbackEntry = { 
      id: Math.random().toString(36).substring(2, 9), 
      timestamp: Date.now(), 
      type: cat, 
      message: msg.trim(), 
      userName: name.trim() || RANDOM_ID(), 
      color: PALETTE[Math.floor(Math.random() * PALETTE.length)], 
      status: (cat === "REPORT A BUG" || cat === "REQUEST FEATURE") ? "PENDING" : undefined,
      pos: {
        left: `${20 + Math.random() * 60}%`,
        top: `${20 + Math.random() * 60}%`
      }
    };
    setSubmissions([newEntry, ...submissions]);
    const saved = localStorage.getItem("mappa-signals");
    let currentHistory = [];
    if (saved) { try { currentHistory = JSON.parse(saved); } catch(e) {} }
    localStorage.setItem("mappa-signals", JSON.stringify([newEntry, ...currentHistory]));
    if (name.trim()) localStorage.setItem("mappa-username", name.trim());
    setView("gallery");
  };

  return (
    <AnimatePresence mode="wait">
      {view === "writing" ? (
         <motion.div key="writing" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 1.05, filter: "blur(10px)" }} transition={{ duration: 0.6, ease: [0.85, 0, 0.15, 1] }}>
           <FeedbackWritingRoom onSend={handleNewSend} onViewGallery={() => setView("gallery")} initialType={initialType} />
         </motion.div>
      ) : (
        <motion.div key="gallery" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 1 }}>
           <FloatingGallery entries={submissions} onAddMore={() => setView("writing")} />
         </motion.div>
      )}
    </AnimatePresence>
  );
}
