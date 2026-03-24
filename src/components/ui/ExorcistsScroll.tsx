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

const CharacterInscription: React.FC<{ text: string, isRead: boolean }> = ({ text, isRead }) => {
  const words = useMemo(() => text.split(" "), [text]);
  const [isVisible, setIsVisible] = useState(false);
  let charCount = 0;
  const shadowColor = isRead ? 'rgba(14,224,195,0.5)' : 'rgba(217,17,17,0.5)';

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 50);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="w-full h-full p-5 md:p-10 flex flex-col items-center justify-center text-center relative z-10 contain-layout">
      <div 
        className="text-[#F5F5F0] font-inter text-lg md:text-xl lg:text-3xl leading-[1.3] font-black tracking-tighter text-center uppercase" 
        style={{ textShadow: `0 0 10px ${shadowColor}` }}
      >
        {words.map((word, wi) => (
          <span key={wi} className="inline-block whitespace-nowrap mr-[0.34em]">
            {word.split("").map((char, ci) => {
              const delay = charCount++ * 15;
              return (
                <span 
                  key={ci} 
                  className={`inline-block transition-all duration-700 ease-out will-change-transform ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
                  style={{ transitionDelay: `${delay}ms` }}
                >
                  {char}
                </span>
              );
            })}
          </span>
        ))}
      </div>
    </div>
  );
};

const SystemNodes = ({ isRead }: { isRead: boolean }) => {
    const color = isRead ? '#0ee0c3' : '#D91111';
    return (
        <div className="absolute inset-0 pointer-events-none opacity-20 overflow-hidden">
            <div className="absolute top-4 left-4 w-4 h-4 border" style={{ borderColor: color }} />
            <div className="absolute bottom-4 right-4 w-4 h-4 border" style={{ borderColor: color }} />
            <div className="absolute top-1/2 left-4 w-[1px] h-32 -translate-y-1/2" style={{ backgroundColor: color }} />
            <div className="absolute top-1/2 right-4 w-[1px] h-32 -translate-y-1/2" style={{ backgroundColor: color }} />
        </div>
    );
};

const ExorcistsScroll: React.FC = () => {
  const { language } = useLanguage();
  const [activeCard, setActiveCard] = useState<ActiveCard | null>(null);
  const [mounted, setMounted] = useState(false);
  const [showShutters, setShowShutters] = useState(false);
  const [readIds, setReadIds] = useState<Set<number>>(new Set());

  useEffect(() => { 
    setMounted(true); 
    const cid = localStorage.getItem('visitor_soul_id');
    if (cid) {
       fetch(`/api/read-status?cid=${cid}`)
        .then(res => res.json())
        .then(data => {
           if (data.success && data.readIds) {
             setReadIds(new Set(data.readIds));
           }
        })
        .catch(() => {});
    }
  }, []);

  const handleCardClick = async (id: number, e: React.MouseEvent<HTMLButtonElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const currentFacts = OFUDA_FACTS[language] || OFUDA_FACTS['en'];
    const { fact } = getNextFact(currentFacts);
    setActiveCard({ id, fact, isAssembled: false, rect });
    
    // Commit to server memory
    const cid = localStorage.getItem('visitor_soul_id');
    if (cid) {
        fetch('/api/read-status', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ cid, factId: id })
        }).then(() => {
            setReadIds(prev => new Set(prev).add(id));
        }).catch(() => {});
    }

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
    return Array.from({ length: 30 }).map((_, i) => ({
      id: i,
      hex: ["0xINIT", "0xMEM", "0xSYS", "0xEXEC", "0xVOID", "0xCORE"][i % 6],
      delay: i * -0.5 
    }));
  }, []);

  return (
    <div className="absolute inset-0 flex items-center justify-center z-0 pointer-events-none overflow-hidden opacity-60">
      {/* ─── LAYER 1: THE ETERNAL PATH (RESTORED LAYOUT) ─── */}
      <div className="relative w-full h-[600px] flex items-center justify-center translate-y-[-10%]">
        {segments.map((s) => (
          <div 
             key={s.id} 
             className="absolute flex flex-col items-center justify-center"
             style={{
               animation: `scroll-flow 15s linear infinite`,
               animationDelay: `${s.delay}s`,
             }}
          >
            <button
               onClick={(e) => handleCardClick(s.id, e)}
               className={`relative w-12 md:w-20 h-32 md:h-48 transition-all duration-500 flex flex-col items-center justify-between py-4 transform-gpu hover:scale-110 active:scale-95 border-2 pointer-events-auto ${readIds.has(s.id) ? 'bg-[#0ee0c3]/10 border-[#0ee0c3]/40 hover:border-[#0ee0c3]/100' : 'bg-black/80 border-red-600/40 hover:border-red-600/100'}`}
               style={{ 
                  boxShadow: readIds.has(s.id) ? '0 0 20px rgba(14,224,195,0.2)' : '0 0 20px rgba(217,17,17,0.2)'
               }}
            >
               {/* Script logic */}
               <div className="flex flex-col gap-1 items-center opacity-70">
                  {[1,2,3].map(j => (
                    <div key={j} className="w-1 h-3 rounded-full" style={{ backgroundColor: readIds.has(s.id) ? '#0ee0c3' : '#D91111' }} />
                  ))}
               </div>

               {/* Hex Code */}
               <span className="font-mono text-[10px] md:text-xs font-black rotate-[-90deg] whitespace-nowrap brightness-125 transition-colors duration-500" style={{ color: readIds.has(s.id) ? '#0ee0c3' : '#D91111' }}>
                  {s.hex}
               </span>

               <div className="flex flex-col gap-1 items-center">
                  <div className="w-3 h-3 rounded-full border border-dashed animate-spin-slow" style={{ borderColor: readIds.has(s.id) ? '#0ee0c3' : '#D91111' }} />
                  <div className="w-[1px] h-8 bg-current opacity-30" style={{ color: readIds.has(s.id) ? '#0ee0c3' : '#D91111' }} />
               </div>
            </button>
          </div>
        ))}
      </div>

      {/* ─── LAYER 2: THE CLEANSING LIGHT (VIEWPORT CENTER) ─── */}
      <div className="absolute left-1/2 -translate-x-1/2 top-0 bottom-0 w-[300px] pointer-events-none">
         <div className="absolute inset-0 bg-white/[0.03] blur-[100px]" />
         <div className="absolute left-1/2 -translate-x-1/2 top-0 bottom-0 w-[2px] opacity-20" style={{ backgroundColor: '#D91111' }} />
      </div>

      {mounted && activeCard && createPortal(
        <div className="fixed inset-0" style={{ zIndex: 999999, pointerEvents: 'auto' }}>
          <div 
            className={`fixed inset-0 bg-black/90 transition-opacity duration-[1000ms] ${showShutters ? 'opacity-100' : 'opacity-0'}`}
            onClick={handleDismiss}
          />

          <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[85vw] md:w-[320px] h-[50vh] md:h-[460px] pointer-events-none" style={{ zIndex: 9999991 }}>
             <div 
               className={`absolute inset-0 bg-[#050505] border-2 flex items-center justify-center overflow-hidden transition-all duration-700 ${activeCard.isAssembled ? 'opacity-100 scale-100' : 'opacity-0 scale-102'}`} 
               style={{ 
                 contain: 'strict', 
                 borderColor: readIds.has(activeCard.id) ? '#0ee0c3' : '#D91111',
                 boxShadow: activeCard.isAssembled ? (readIds.has(activeCard.id) ? '0 0 40px rgba(14,224,195,0.4)' : '0 0 40px rgba(217,17,17,0.4)') : 'none'
               }}
             >
                <div className="absolute inset-4 border bg-gradient-to-br from-black via-black to-black" style={{ borderColor: readIds.has(activeCard.id) ? 'rgba(14,224,195,0.15)' : 'rgba(217,17,17,0.15)' }} />
                
                <div className={`absolute inset-0 opacity-10 ${readIds.has(activeCard.id) ? 'cyan-grid' : 'blood-grid'}`} />
                <div className={`absolute inset-0 opacity-5 ${readIds.has(activeCard.id) ? 'cyan-halftone' : 'red-halftone'}`} />
                
                <SystemNodes isRead={readIds.has(activeCard.id)} />
                
                {activeCard.isAssembled && <CharacterInscription text={activeCard.fact} isRead={readIds.has(activeCard.id)} />}
             </div>

             <div className="absolute inset-0 z-10 pointer-events-none overflow-hidden" 
                  style={{ visibility: activeCard.isAssembled ? 'hidden' : 'visible' }}>
                {[0,1,2,3].map(i => {
                   const fromAbove = i % 2 !== 0;
                   const color = readIds.has(activeCard.id) ? 'rgba(14,224,195,0.2)' : 'rgba(217,17,17,0.2)';
                   const lineCol = readIds.has(activeCard.id) ? 'rgba(14,224,195,0.4)' : 'rgba(217,17,17,0.4)';
                   return (
                      <div 
                        key={i}
                        className="absolute inset-y-0 w-[25.2%] overflow-hidden bg-black transition-all duration-[700ms] ease-[cubic-bezier(0.19,1,0.22,1)] flex flex-col items-center justify-center border-l border-r"
                        style={{
                           left: `${i * 25}%`,
                           borderColor: color,
                           transform: showShutters ? 'translateY(0%)' : `translateY(${fromAbove ? '-120%' : '120%'})`,
                           transitionDelay: showShutters ? `${i * 80}ms` : `${(3-i) * 50}ms`,
                           opacity: activeCard.isAssembled ? 0 : 1,
                        }}
                      >
                         <div className={`absolute inset-0 opacity-[0.03] ${readIds.has(activeCard.id) ? 'cyan-halftone' : 'red-halftone'}`} />
                         <div className="absolute top-0 left-0 right-0 h-[1px]" style={{ backgroundColor: lineCol }} />
                         <div className="absolute bottom-0 left-0 right-0 h-[1px]" style={{ backgroundColor: lineCol }} />
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
          0% { transform: translateX(100vw) translateY(15vh) rotateZ(15deg) scale(0.6); opacity: 0; filter: blur(4px) grayscale(1); }
          45%, 55% { opacity: 1; filter: blur(0px) grayscale(0); }
          50% { transform: translateX(0vw) translateY(0vh) rotateZ(0deg) scale(1.1); }
          100% { transform: translateX(-100vw) translateY(-15vh) rotateZ(-15deg) scale(0.6); opacity: 0; filter: blur(4px) grayscale(1); }
        }
        .blood-grid {
          background-image: linear-gradient(rgba(217, 17, 17, 0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(217, 17, 17, 0.03) 1px, transparent 1px);
          background-size: 60px 60px;
        }
        .cyan-grid {
          background-image: linear-gradient(rgba(14, 224, 195, 0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(14, 224, 195, 0.03) 1px, transparent 1px);
          background-size: 60px 60px;
        }
        .red-halftone {
          background-image: radial-gradient(#D91111 0.6px, transparent 0.6px);
          background-size: 8px 8px;
        }
        .cyan-halftone {
          background-image: radial-gradient(#0ee0c3 0.6px, transparent 0.6px);
          background-size: 8px 8px;
        }
      `}</style>
    </div>
  );
};

export default ExorcistsScroll;
