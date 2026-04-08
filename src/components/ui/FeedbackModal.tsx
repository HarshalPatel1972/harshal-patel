"use client";

import React, { useState, useEffect, useRef } from "react";
import { animate as anime } from "animejs";
import { useLanguage } from "@/context/LanguageContext";

/* ─── RANDOM NAME GENERATORS (TALKY STYLE) ─── */
const ADJECTIVES = ["Swift", "Quiet", "Bright", "Brave", "Calm", "Neon", "Solid", "Kind", "Bold", "Clear"];
const NOUNS = ["Echo", "Solar", "Pulse", "Wave", "Star", "Wolf", "Hawk", "Shadow", "Aura", "Luna"];

interface Signal {
  id: string;
  timestamp: number;
  type: string;
  message: string;
  userName: string;
}

interface FeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialType?: string;
}

export function FeedbackModal({ isOpen, onClose, initialType = "SUBMIT REVIEW" }: FeedbackModalProps) {
  const { language } = useLanguage();
  const [userName, setUserName] = useState("");
  const [type, setType] = useState(initialType);
  const [message, setMessage] = useState("");
  const [history, setHistory] = useState<Signal[]>([]);
  const [isSending, setIsSending] = useState(false);
  
  const modalRef = useRef<HTMLDivElement>(null);
  const backdropRef = useRef<HTMLDivElement>(null);

  // Load User Data & History
  useEffect(() => {
    const savedName = localStorage.getItem("mappa-username");
    if (savedName) setUserName(savedName);

    const savedHistory = localStorage.getItem("mappa-signals");
    if (savedHistory) {
      try {
        setHistory(JSON.parse(savedHistory));
      } catch (e) {
        console.error("Failed to load history");
      }
    }
  }, []);

  // 2. ANIMATIONS
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      if (backdropRef.current && modalRef.current) {
        anime(backdropRef.current, {
          opacity: [0, 1],
          duration: 400,
          easing: "easeOutSine"
        });
        anime(modalRef.current, {
          translateY: [60, 40],
          opacity: [0, 1],
          scale: [0.98, 1],
          duration: 600,
          delay: 100,
          easing: "easeOutExpo"
        });
      }
    } else {
      document.body.style.overflow = "";
    }
  }, [isOpen]);

  const handleSend = () => {
    if (!message.trim()) return;

    setIsSending(true);
    
    // Save current name
    if (userName.trim()) {
      localStorage.setItem("mappa-username", userName.trim());
    }

    // Final Name Check (Talky Style Fallback)
    const finalName = userName.trim() || 
      `${ADJECTIVES[Math.floor(Math.random() * ADJECTIVES.length)]}-${NOUNS[Math.floor(Math.random() * NOUNS.length)]}`;

    setTimeout(() => {
      const newEntry: Signal = {
        id: Math.random().toString(36).substring(2, 9),
        timestamp: Date.now(),
        type,
        message: message.trim(),
        userName: finalName
      };

      const updatedHistory = [newEntry, ...history];
      setHistory(updatedHistory);
      localStorage.setItem("mappa-signals", JSON.stringify(updatedHistory));
      
      setMessage("");
      setIsSending(false);
      
      const btn = document.getElementById("send-btn");
      if (btn) {
        anime(btn, {
          backgroundColor: ["#000", "#fff", "#000"],
          duration: 400,
          easing: "linear"
        });
      }
    }, 1000);
  };

  if (!isOpen) return null;

  return (
    <div 
      ref={backdropRef}
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/40 backdrop-blur-md isolate"
      onClick={(e) => e.target === backdropRef.current && onClose()}
    >
      <div 
        ref={modalRef}
        className="relative w-[95vw] md:w-[600px] h-[80vh] bg-white border-4 border-black shadow-[12px_12px_0px_#000] overflow-hidden flex flex-col transition-colors duration-500 eridian-modal translate-y-[40px] isolate"
      >
        {/* Header Bar */}
        <div className="bg-black text-white px-4 py-2 flex justify-between items-center">
          <span className="font-mono text-[10px] tracking-[4px] font-bold uppercase">Get In Touch</span>
          <button 
            onClick={onClose}
            className="hover:scale-125 transition-transform font-bold p-1 leading-none"
          >
            ✕
          </button>
        </div>

        <div className="p-6 md:p-8 overflow-y-auto custom-scrollbar text-black">
          
          <div className="space-y-8">
            
            {/* Name Input */}
            <div>
              <label className="block text-[11px] font-black uppercase tracking-[0.2em] mb-4 text-black">Name (Optional):</label>
              <input
                type="text"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                placeholder="Leave empty for a random name..."
                className="w-full p-4 border-4 border-black font-mono text-sm focus:outline-none focus:ring-0 bg-black/[0.03] text-black"
              />
            </div>

            <div>
              <label className="block text-[11px] font-black uppercase tracking-[0.2em] mb-4 text-black">Category:</label>
              <div className="flex flex-wrap gap-2">
                {["SUBMIT REVIEW", "REPORT A BUG", "REQUEST FEATURE"].map((option) => (
                  <button
                    key={option}
                    onClick={() => setType(option)}
                    className={`px-3 py-1 text-[10px] font-bold border-2 border-black transition-all ${
                      type === option ? "bg-black text-white" : "bg-transparent text-black hover:bg-black/5"
                    }`}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-black uppercase tracking-[0.2em] mb-4 text-black">Message:</label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Write your message here..."
                className="w-full h-40 p-5 border-4 border-black font-mono text-sm focus:outline-none focus:ring-0 resize-none bg-black/[0.03] placeholder:text-black/20 text-black"
              />
            </div>

            <button
              id="send-btn"
              disabled={isSending || !message.trim()}
              onClick={handleSend}
              className={`w-full py-5 font-black tracking-[0.3em] text-sm transition-all border-4 border-black relative overflow-hidden ${
                isSending || !message.trim() 
                  ? "bg-black/10 text-black/30 cursor-not-allowed" 
                  : "bg-black text-white hover:bg-white hover:text-black hover:shadow-[10px_10px_0px_var(--accent-blood)] hover:-translate-x-2 hover:-translate-y-2 active:translate-x-0 active:translate-y-0"
              }`}
            >
              {isSending ? "SENDING..." : "SEND"}
            </button>

          </div>

          {/* History Section */}
          {history.length > 0 && (
            <div className="mt-12">
              <div className="text-[11px] font-black uppercase tracking-[0.2em] text-black mb-6 border-t-2 border-black pt-8">Previous Messages</div>
              <div className="space-y-4">
                {history.map((sig: Signal) => (
                  <div key={sig.id} className="p-4 border-2 border-black bg-black/[0.03] font-mono text-[11px] text-black">
                    <div className="flex justify-between mb-2 font-bold opacity-60">
                      <span>{sig.userName} // {sig.type}</span>
                      <span>{new Date(sig.timestamp).toLocaleDateString()}</span>
                    </div>
                    <div className="opacity-90 leading-relaxed">{sig.message}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
      </div>
      
      {/* Global CSS Overrides for Eridian Theme inside Modal */}
      <style jsx global>{`
        .is-eridian .eridian-modal {
          background-color: var(--theme-yellow) !important;
          border-color: #000 !important;
        }
        .is-eridian .eridian-label {
          color: var(--theme-blue) !important;
        }
        .is-eridian textarea {
          background-color: rgba(0, 50, 255, 0.05) !important;
        }
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(0,0,0,0.2);
        }
      `}</style>
    </div>
  );
}
