import React, { useMemo, useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { useLanguage } from '@/context/LanguageContext';
import { OFUDA_FACTS } from '@/lib/ofudaFacts';
import { getNextFact } from '@/lib/ofudaMemory';

interface ActiveCard {
  id: number;
  fact: string;
  isAssembled: boolean;
  rect: DOMRect | null;
}

const CharacterInscription: React.FC<{ text: string, language: string }> = ({ text, language }) => {
  const wordsWithChars = useMemo(() => {
    return text.split(" ").map(word => ({
      word,
      chars: word.split("")
    }));
  }, [text]);
  const [isVisible, setIsVisible] = useState(false);
  const isHindi = language === 'hi';

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 50);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="w-full h-full p-5 md:p-10 flex flex-col items-center justify-center text-center relative z-10 contain-layout">
      <div 
        className={`text-[#F5F5F0] ${isHindi ? 'font-hindi' : 'font-inter'} text-lg md:text-xl lg:text-3xl leading-[1.3] font-black tracking-tighter text-center uppercase`} 
        style={{ textShadow: `0 0 10px rgba(var(--accent-blood-rgb), 0.5)` }}
      >
        {wordsWithChars.map((item, wi) => {
          const delay = wi * 45; // Stagger by word for Hindi, or by cumulative chars for others
          
          if (isHindi) {
            return (
              <span 
                key={wi} 
                className={`inline-block whitespace-nowrap mr-[0.34em] transition-all duration-700 ease-out will-change-transform ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
                style={{ transitionDelay: `${delay}ms` }}
              >
                {item.word}
              </span>
            );
          }

          // Non-Hindi character splitting logic
          return (
            <span key={wi} className="inline-block whitespace-nowrap mr-[0.34em]">
              {item.chars.map((char, ci) => (
                <span 
                  key={ci} 
                  className={`inline-block transition-all duration-700 ease-out will-change-transform ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
                  style={{ transitionDelay: `${(wi * 5 + ci) * 15}ms` }}
                >
                  {char}
                </span>
              ))}
            </span>
          );
        })}
      </div>
    </div>
  );
};

const ExorcistsScroll: React.FC = () => {
  const { language } = useLanguage();
  const [activeCard, setActiveCard] = useState<ActiveCard | null>(null);
  const [mounted, setMounted] = useState(false);
  const [showShutters, setShowShutters] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // GLOBAL SLEEP MODE SIGNALING 💤
  useEffect(() => {
    if (activeCard) {
      document.documentElement.classList.add('is-overlay-active');
    } else {
      document.documentElement.classList.remove('is-overlay-active');
    }
    return () => document.documentElement.classList.remove('is-overlay-active');
  }, [activeCard]);

  const handleCardClick = (id: number, e: React.MouseEvent<HTMLButtonElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const currentFacts = OFUDA_FACTS[language] || OFUDA_FACTS['en'];
    const { fact } = getNextFact(currentFacts);
    setActiveCard({ id, fact, isAssembled: false, rect });
    
    requestAnimationFrame(() => {
      setShowShutters(true);
      setTimeout(() => {
        setActiveCard(prev => prev ? { ...prev, isAssembled: true } : null);
      }, 1000);
    });
  };

  const handleDismiss = () => {
    setActiveCard(prev => prev ? { ...prev, isAssembled: false } : null);
    setTimeout(() => { setShowShutters(false); }, 100);
    setTimeout(() => { setActiveCard(null); }, 1100);
  };

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => { if (e.key === 'Escape') handleDismiss(); };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [activeCard]);

  useEffect(() => {
    document.body.style.overflow = activeCard ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [activeCard]);

  const segments = useMemo(() => {
    return Array.from({ length: 12 }).map((_, i) => ({
      id: i,
      hex: language === 'eridian' 
        ? ["♩ROCKY", "♫JAZZ", "♩AMAZE", "♫SIGNAL", "♩P.H.M.", "♫LIGHT"][i % 6]
        : ["0xINIT", "0xMEM", "0xSYS", "0xEXEC", "0xVOID", "0xCORE"][i % 6],
      delay: i * -1.25 
    }));
  }, []);

  const SystemNodes = () => (
    <>
      <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-[var(--accent-blood)] z-30 opacity-80" />
      <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-[var(--accent-blood)] z-30 opacity-80" />
      <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-[var(--accent-blood)] z-30 opacity-80" />
      <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-[var(--accent-blood)] z-30 opacity-80" />
    </>
  );

  const [isInView, setIsInView] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      setIsInView(entry.isIntersecting);
    }, { threshold: 0.1 });
    
    if (containerRef.current) observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div 
      ref={containerRef}
      className={`absolute inset-0 flex items-center justify-center z-0 pointer-events-none overflow-hidden contain-strict`}
      style={{
        animationPlayState: isInView ? 'running' : 'paused'
      }}
    >
      <div className="relative w-full h-[600px] flex items-center justify-center translate-y-[-10%] pointer-events-none">
        {segments.map((s) => (
          <div 
            key={s.id}
            className="absolute flex flex-col items-center justify-center pointer-events-none"
            style={{ 
              animation: `scroll-flow 15s linear infinite`, 
              animationDelay: `${s.delay}s`,
              backfaceVisibility: 'hidden',
              animationPlayState: isInView ? 'running' : 'paused'
            }}
          >
            <button 
              onClick={(e) => { e.stopPropagation(); handleCardClick(s.id, e); }}
              data-cursor="play"
              disabled={activeCard !== null}
              className="group ofuda-talisman pointer-events-auto relative w-12 h-32 border-2 border-[var(--accent-blood)]/40 bg-black flex flex-col items-center justify-between py-4 shadow-[0_0_8px_rgba(var(--accent-blood-rgb),0.15)] transition-all duration-300 hover:border-[var(--accent-blood)] hover:shadow-[0_0_15px_rgba(var(--accent-blood-rgb),0.3)] hover:scale-[1.05] cursor-pointer"
              style={{ contain: 'content' }}
            >
               <div className="flex gap-1 opacity-60">
                  {[1,2,3].map(j => (
                    <div key={j} className="w-2 h-2 border border-[var(--accent-blood)] rotate-45 flex items-center justify-center">
                      <div className="w-[1px] h-[1px] bg-[var(--accent-blood)]" />
                    </div>
                  ))}
               </div>

               <div className="relative w-full flex items-center justify-center py-2">
                  <div className="absolute inset-0 bg-[var(--accent-blood)]/5 blur-lg rounded-full" />
                  <div className="relative">
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1px] h-12 bg-[var(--accent-blood)]/40" />
                    <span className="font-mono text-[9px] text-[var(--accent-blood)] font-bold tracking-widest" style={{ writingMode: 'vertical-rl' }}>
                       {s.hex}
                    </span>
                  </div>
               </div>

               <div className="flex flex-col gap-1 items-center opacity-60">
                  <div className="w-1 h-1 border border-[var(--accent-blood)] rotate-45" />
               </div>
            </button>
          </div>
        ))}
      </div>

      {mounted && activeCard && createPortal(
        <div className="fixed inset-0" style={{ zIndex: 999999, pointerEvents: 'auto', isolation: 'isolate', willChange: 'transform' }}>
          <div 
            className={`fixed inset-0 bg-black/90 transition-opacity duration-[1000ms] ${showShutters ? 'opacity-100' : 'opacity-0'}`}
            onClick={handleDismiss}
          />

          <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[85vw] md:w-[320px] h-[50vh] md:h-[460px] pointer-events-none" style={{ zIndex: 9999991 }}>
             <div className={`absolute inset-0 bg-[#050505] border-2 border-[var(--accent-blood)] flex items-center justify-center overflow-hidden transition-all duration-700 ${activeCard.isAssembled ? 'opacity-100 scale-100 shadow-[0_0_40px_rgba(var(--accent-blood-rgb),0.4)]' : 'opacity-0 scale-102'}`} style={{ contain: 'strict', willChange: 'transform, opacity' }}>
                <div className="absolute inset-4 border border-[var(--accent-blood)]/15 bg-gradient-to-br from-[var(--accent-blood)]/5 via-black to-black" />
                
                <div className="absolute inset-0 blood-grid opacity-10" />
                <div className="absolute inset-0 red-halftone opacity-5" />
                
                <SystemNodes />
                
                {activeCard.isAssembled && <CharacterInscription text={activeCard.fact} language={language} />}
             </div>

             <div className="absolute inset-0 z-10 pointer-events-none overflow-hidden" 
                  style={{ visibility: activeCard.isAssembled ? 'hidden' : 'visible' }}>
                {[0,1,2,3].map(i => {
                   const fromAbove = i % 2 !== 0;
                   return (
                       <div 
                        key={i}
                        className="absolute inset-y-0 w-[25.2%] overflow-hidden bg-black transition-all duration-[700ms] ease-[cubic-bezier(0.19,1,0.22,1)] flex flex-col items-center justify-center border-l border-r border-[var(--accent-blood)]/20"
                        style={{
                           left: `${i * 25}%`,
                           transform: showShutters ? 'translateY(0%)' : `translateY(${fromAbove ? '-120%' : '120%'})`,
                           transitionDelay: showShutters ? `${i * 80}ms` : `${(3-i) * 50}ms`,
                           opacity: activeCard.isAssembled ? 0 : 1,
                        }}
                      >
                         <div className="absolute inset-0 red-halftone opacity-[0.03]" />
                         <div className="absolute top-0 left-0 right-0 h-[1px] bg-[var(--accent-blood)]/40" />
                         <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-[var(--accent-blood)]/40" />
                      </div>
                   );
                })}
             </div>
          </div>
        </div>,
        document.body
      )}

      <style>{`
        @keyframes scroll-flow {
          0% { transform: translate3d(80vw, 20vh, 0) rotateZ(10deg) scale(0.7); opacity: 0; }
          45%, 55% { opacity: 1; }
          50% { transform: translate3d(0vw, 5vh, 0) rotateZ(0deg) scale(1.05); }
          100% { transform: translate3d(-80vw, -20vh, 0) rotateZ(-10deg) scale(0.7); opacity: 0; }
        }
        .blood-grid {
          background-image: linear-gradient(var(--accent-blood-alpha) 1px, transparent 1px), linear-gradient(90deg, var(--accent-blood-alpha) 1px, transparent 1px);
          background-size: 60px 60px;
        }
        .red-halftone {
          background-image: radial-gradient(var(--accent-blood) 0.6px, transparent 0.6px);
          background-size: 8px 8px;
        }
      `}</style>
    </div>
  );
};

export default ExorcistsScroll;
