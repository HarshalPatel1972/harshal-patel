"use client";

import { motion } from "framer-motion";

export function Contact() {
  return (
    <section id="contact" className="py-24 px-6 md:px-12 bg-zinc-950">
      <div className="max-w-4xl mx-auto text-center">
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
            Let's Work Together<span className="text-indigo-400">.</span>
          </h2>
          
          <p className="text-white/60 text-lg mb-8 max-w-xl mx-auto">
            Have a project in mind? I'd love to hear about it. 
            Let's create something amazing together.
          </p>

          <motion.a
            href="mailto:hello@harshalpatel.dev"
            className="inline-block px-8 py-4 bg-indigo-600 text-white font-medium rounded-full hover:bg-indigo-500 transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Get In Touch
          </motion.a>

          {/* Social Links */}
          <div className="flex justify-center gap-6 mt-12">
            {["GitHub", "LinkedIn", "Twitter"].map((social) => (
              <a
                key={social}
                href="#"
                className="text-white/50 hover:text-white text-sm transition-colors"
              >
                {social}
              </a>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}

export function Footer() {
  return (
    <footer className="py-8 px-6 bg-black border-t border-zinc-900">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        <p className="text-white/50 text-sm">
          © 2026 Harshal Patel. All rights reserved.
        </p>
        <p className="text-white/30 text-sm">
          Crafted with passion
        </p>
      </div>
    </footer>
  );
}
