"use client";

import { motion } from "framer-motion";
import { usePreloader } from "@/lib/preloader-context";

export function About() {
  const { isComplete } = usePreloader();

  return (
    <section id="about" className="py-24 px-6 md:px-12 bg-zinc-950">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-8">
            About<span className="text-indigo-400">.</span>
          </h2>
          
          <div className="grid md:grid-cols-2 gap-12">
            <div className="text-white/70 space-y-4">
              <p>
                I'm a creative developer passionate about building beautiful, 
                functional, and user-centered digital experiences.
              </p>
              <p>
                With expertise in modern web technologies, I bring ideas to life 
                through clean code and thoughtful design.
              </p>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              {["React", "Next.js", "TypeScript", "Tailwind"].map((skill, i) => (
                <motion.div
                  key={skill}
                  className="p-4 bg-zinc-900 rounded-lg border border-zinc-800"
                  initial={{ y: 20, opacity: 0 }}
                  whileInView={{ y: 0, opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                >
                  <span className="text-white font-medium">{skill}</span>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
