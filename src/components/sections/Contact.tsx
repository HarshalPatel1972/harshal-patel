"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { contact } from "@/config/contact";

export function Contact() {
  const [status, setStatus] = useState<'idle' | 'transmitting' | 'sent'>('idle');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('transmitting');
    setTimeout(() => setStatus('sent'), 2000);
  };

  return (
    <section id="contact" className="py-4 md:py-6 px-4 md:px-12 lg:px-24 relative overflow-hidden bg-transparent">
      <div className="max-w-3xl mx-auto">
        
        {/* HEADER */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="text-center mb-4 md:mb-6"
        >
          <div className="inline-block border border-white/20 px-3 py-0.5 mb-4 rounded-full bg-white/5 backdrop-blur-sm">
             <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                <span className="font-mono text-[9px] text-white/50 tracking-widest uppercase">
                  UPLINK_READY_
                </span>
             </div>
          </div>
          
          <h2 className="text-3xl md:text-5xl font-bold font-space tracking-tighter text-white mb-3">
            INITIATE_CONTACT<span className="text-green-500">_</span>
          </h2>
          <p className="text-white/50 font-mono text-[10px] md:text-xs max-w-lg mx-auto leading-relaxed">
            Secure channel open. Transmit project parameters or collaboration requests. 
          </p>
        </motion.div>
 
        {/* TERMINAL FORM */}
        <motion.div
           initial={{ opacity: 0, y: 30 }}
           whileInView={{ opacity: 1, y: 0 }}
           viewport={{ once: true }}
           transition={{ delay: 0.2 }}
           className="bg-zinc-900/40 border border-white/10 p-4 md:p-6 rounded-sm backdrop-blur-md relative"
        >
          {/* Decorative HUD Elements */}
          <div className="absolute top-0 left-0 w-2 h-2 border-l border-t border-white/40" />
          <div className="absolute top-0 right-0 w-2 h-2 border-r border-t border-white/40" />
          <div className="absolute bottom-0 left-0 w-2 h-2 border-l border-b border-white/40" />
          <div className="absolute bottom-0 right-0 w-2 h-2 border-r border-b border-white/40" />
 
          <form onSubmit={handleSubmit} className="space-y-4">
             <div className="grid md:grid-cols-2 gap-4">
               <div className="space-y-1">
                 <label className="font-mono text-[9px] text-white/40 uppercase tracking-wider pl-1">
                    // IDENTITY_NAME
                 </label>
                 <input 
                   type="text" 
                   required
                   className="w-full bg-black/50 border border-white/10 p-3 text-white font-mono text-xs focus:border-cyan-400 focus:outline-none transition-colors"
                   placeholder="ENTER_ID"
                 />
               </div>
               <div className="space-y-1">
                 <label className="font-mono text-[9px] text-white/40 uppercase tracking-wider pl-1">
                    // COMM_CHANNEL (EMAIL)
                 </label>
                 <input 
                   type="email" 
                   required
                   className="w-full bg-black/50 border border-white/10 p-3 text-white font-mono text-xs focus:border-cyan-400 focus:outline-none transition-colors"
                   placeholder="ENTER_EMAIL"
                 />
               </div>
             </div>
 
             <div className="space-y-1">
                 <label className="font-mono text-[9px] text-white/40 uppercase tracking-wider pl-1">
                    // DATA_PACKET (MESSAGE)
                 </label>
                 <textarea 
                   rows={3}
                   required
                   className="w-full bg-black/50 border border-white/10 p-3 text-white font-mono text-xs focus:border-cyan-400 focus:outline-none transition-colors resize-none"
                   placeholder="INPUT_MESSAGE_DATA..."
                 />
             </div>
 
             <button 
               type="submit"
               disabled={status !== 'idle'}
               className="w-full bg-white/5 border border-white/10 py-3 hover:bg-white/10 transition-all group relative overflow-hidden disabled:opacity-50 disabled:cursor-not-allowed"
             >
               <div className="absolute inset-0 bg-green-500/10 translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
               <span className="font-mono text-[10px] font-bold text-white tracking-[0.2em] group-hover:text-green-400 transition-colors relative z-10">
                 {status === 'idle' ? '[ TRANSMIT_DATA ]' : (status === 'transmitting' ? 'TRANSMITTING...' : 'TRANSMISSION_COMPLETE')}
               </span>
             </button>
          </form>
 
           {/* DIRECT CONTACT DATA */}
           <div className="mt-4 pt-4 border-t border-white/10 grid grid-cols-2 gap-x-4 gap-y-2">
              <div>
                  <div className="text-[9px] font-mono text-white/30 mb-0.5">// DIRECT_LINE</div>
                  <div className="text-white font-mono text-[10px]">{contact.phone}</div>
              </div>
              <div>
                  <div className="text-[9px] font-mono text-white/30 mb-0.5">// NEURAL_MAIL</div>
                  <div className="text-white font-mono text-[10px]">{contact.email}</div>
              </div>
              <div>
                  <div className="text-[9px] font-mono text-white/30 mb-0.5">// GITHUB_REPO</div>
                  <div className="text-white font-mono text-[10px]">{contact.github}</div>
              </div>
              <div>
                  <div className="text-[9px] font-mono text-white/30 mb-0.5">// LINKEDIN_PROFILE</div>
                  <a href={contact.linkedin} target="_blank" rel="noopener noreferrer" className="text-white font-mono text-[10px] hover:text-cyan-400 transition-colors">{contact.name}</a>
              </div>
           </div>
        </motion.div>
 
        {/* FOOTER METADATA */}
        <div className="mt-6 border-t border-white/5 pt-4 flex flex-col md:flex-row justify-center md:justify-between items-center gap-2 text-[9px] font-mono text-white/30 uppercase tracking-widest text-center md:text-left">
           <div>© 2026 All right and wrongs reserved</div>
           <div className="flex gap-4">
             <a href="#" className="hover:text-white transition-colors">GITHUB_REF</a>
             <a href="#" className="hover:text-white transition-colors">LINKEDIN_REF</a>
           </div>
        </div>

      </div>
    </section>
  );
}
