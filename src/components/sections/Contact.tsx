"use client";

import { motion } from "framer-motion";
import { useState } from "react";

export function Contact() {
  const [status, setStatus] = useState<'idle' | 'transmitting' | 'sent'>('idle');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('transmitting');
    setTimeout(() => setStatus('sent'), 2000);
  };

  return (
    <section id="contact" className="py-32 px-6 relative overflow-hidden bg-black">
      <div className="max-w-3xl mx-auto">
        
        {/* HEADER */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="inline-block border border-white/20 px-4 py-1 mb-6 rounded-full bg-white/5 backdrop-blur-sm">
             <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                <span className="font-mono text-[10px] text-white/50 tracking-widest uppercase">
                  UPLINK_READY_
                </span>
             </div>
          </div>
          
          <h2 className="text-4xl md:text-6xl font-bold font-space tracking-tighter text-white mb-6">
            INITIATE_CONTACT<span className="text-green-500">_</span>
          </h2>
          <p className="text-white/50 font-mono text-sm max-w-lg mx-auto leading-relaxed">
            Secure channel open. Transmit project parameters or collaboration requests. 
            Response latency: &lt; 24hrs.
          </p>
        </motion.div>

        {/* TERMINAL FORM */}
        <motion.div
           initial={{ opacity: 0, y: 30 }}
           whileInView={{ opacity: 1, y: 0 }}
           viewport={{ once: true }}
           transition={{ delay: 0.2 }}
           className="bg-zinc-900/40 border border-white/10 p-8 rounded-sm backdrop-blur-md relative"
        >
          {/* Decorative HUD Elements */}
          <div className="absolute top-0 left-0 w-2 h-2 border-l border-t border-white/40" />
          <div className="absolute top-0 right-0 w-2 h-2 border-r border-t border-white/40" />
          <div className="absolute bottom-0 left-0 w-2 h-2 border-l border-b border-white/40" />
          <div className="absolute bottom-0 right-0 w-2 h-2 border-r border-b border-white/40" />

          <form onSubmit={handleSubmit} className="space-y-6">
             <div className="grid md:grid-cols-2 gap-6">
               <div className="space-y-2">
                 <label className="font-mono text-[10px] text-white/40 uppercase tracking-wider pl-1">
                   // IDENTITY_NAME
                 </label>
                 <input 
                   type="text" 
                   required
                   className="w-full bg-black/50 border border-white/10 p-4 text-white font-mono text-sm focus:border-cyan-400 focus:outline-none transition-colors"
                   placeholder="ENTER_ID"
                 />
               </div>
               <div className="space-y-2">
                 <label className="font-mono text-[10px] text-white/40 uppercase tracking-wider pl-1">
                   // COMM_CHANNEL (EMAIL)
                 </label>
                 <input 
                   type="email" 
                   required
                   className="w-full bg-black/50 border border-white/10 p-4 text-white font-mono text-sm focus:border-cyan-400 focus:outline-none transition-colors"
                   placeholder="ENTER_EMAIL"
                 />
               </div>
             </div>

             <div className="space-y-2">
                 <label className="font-mono text-[10px] text-white/40 uppercase tracking-wider pl-1">
                   // DATA_PACKET (MESSAGE)
                 </label>
                 <textarea 
                   rows={5}
                   required
                   className="w-full bg-black/50 border border-white/10 p-4 text-white font-mono text-sm focus:border-cyan-400 focus:outline-none transition-colors resize-none"
                   placeholder="INPUT_MESSAGE_DATA..."
                 />
             </div>

             <button 
               type="submit"
               disabled={status !== 'idle'}
               className="w-full bg-white/5 border border-white/10 py-5 hover:bg-white/10 transition-all group relative overflow-hidden disabled:opacity-50 disabled:cursor-not-allowed"
             >
               <span className="relative z-10 font-mono text-xs tracking-[0.2em] text-white group-hover:text-cyan-400 transition-colors uppercase">
                 {status === 'transmitting' ? 'TRANSMITTING...' : status === 'sent' ? 'PACKET_SENT' : 'TRANSMIT_DATA'}
               </span>
               {status === 'idle' && (
                 <div className="absolute inset-0 bg-white/5 translate-y-[100%] group-hover:translate-y-0 transition-transform duration-300" />
               )}
             </button>
          </form>

        </motion.div>

        {/* FOOTER METADATA */}
        <div className="mt-24 border-t border-white/5 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-[10px] font-mono text-white/30 uppercase tracking-widest">
           <div>© 2026 SYSTEM_ARCHITECT // HARSHAL_PATEL</div>
           <div className="flex gap-6">
             <a href="#" className="hover:text-white transition-colors">GITHUB_REF</a>
             <a href="#" className="hover:text-white transition-colors">LINKEDIN_REF</a>
             <a href="#" className="hover:text-white transition-colors">TWITTER_REF</a>
           </div>
        </div>

      </div>
    </section>
  );
}

// Separate Footer component (can be removed if integrated above, but kept for compatibility)
export function Footer() {
  return null; 
}
