"use client";

import React, { useState, useEffect } from "react";
import { profile } from "@/data/profile";
import { useLanguage } from "@/context/LanguageContext";
import { useRouter } from "next/navigation";

export function Contact() {
  const { language } = useLanguage();
  const currentProfile = profile[language as keyof typeof profile] || profile.en;
  
  const [copied, setCopied] = useState(false);
  const [loopIdx, setLoopIdx] = useState(0);
  const [isGlitching, setIsGlitching] = useState(false);
  const router = useRouter();

  // Shifting feedback options in different languages
  const feedbackOptions = {
    en: ["SUBMIT REVIEW", "REPORT A BUG", "REQUEST FEATURE"],
    ja: ["感想を送る", "バグを報告", "機能リクエスト"],
    ko: ["의견 보내기", "버그 신고", "기능 요청"],
    "zh-tw": ["提供意見", "報告錯誤", "功能請求"],
    hi: ["प्रतिक्रिया दें", "बग रिपोर्ट करें", "सुविधा का अनुरोध"],
    eridian: ["SEND VIBRATIONS", "FIX FREQUENCY", "WANT MORE NOISE"]
  };

  const currentFeedbackOptions = feedbackOptions[language as keyof typeof feedbackOptions] || feedbackOptions.en;

  useEffect(() => {
    const interval = setInterval(() => {
      setIsGlitching(true);
      setTimeout(() => {
        setLoopIdx((prev) => (prev + 1) % 3);
        setIsGlitching(false);
      }, 300);
    }, 3500);
    return () => clearInterval(interval);
  }, []);

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(currentProfile.email);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleFeedbackClick = () => {
    const option = currentFeedbackOptions[loopIdx];
    router.push(`/feedback?type=${encodeURIComponent(option)}`);
  };

  const contactTitles = {
    en: {
      sub: "INITIATE TRANSMISSION",
      title: "Start a Connection",
      desc: "Reach out to discuss system architecture, Go/TypeScript optimizations, or collaborative opportunities.",
      emailLabel: "DIRECT MAIL",
      githubLabel: "CODE ARCHIVE",
      linkedinLabel: "PROFESSIONAL HUB",
      feedbackLabel: "FEEDBACK NODE"
    },
    ja: {
      sub: "通信を開始する",
      title: "接続を開始する",
      desc: "システムアーキテクチャ、Go/TypeScriptの最適化、またはコラボレーションの機会についてのディスカッションはお気軽にご連絡ください。",
      emailLabel: "メール送信",
      githubLabel: "コードアーカイブ",
      linkedinLabel: "ビジネスハブ",
      feedbackLabel: "フィードバックノード"
    },
    hi: {
      sub: "संपर्क स्थापित करें",
      title: "कनेक्शन शुरू करें",
      desc: "सिस्टम आर्किटेक्चर, Go/TypeScript अनुकूलन, या सहयोग के अवसरों पर चर्चा करने के लिए संपर्क करें।",
      emailLabel: "सीधा ईमेल",
      githubLabel: "कोड संग्रह",
      linkedinLabel: "प्रोफेशनल हब",
      feedbackLabel: "प्रतिक्रिया नोड"
    },
    eridian: {
      sub: "SIGNAL TRIGGER",
      title: "SEND VIBRATION TO HARSHAL",
      desc: "MAKE WAVES. DO NOT SILENCE.",
      emailLabel: "SEND SIGNAL",
      githubLabel: "BUG-STORE",
      linkedinLabel: "SUIT-PLACE",
      feedbackLabel: "NOISE-PORT"
    }
  };

  const t = contactTitles[language as keyof typeof contactTitles] || contactTitles.en;

  return (
    <section 
      id="contact" 
      className="relative py-24 px-6 md:px-16 lg:px-24 bg-neutral-950 text-white z-10 overflow-hidden"
    >
      {/* Glow backgrounds */}
      <div className="absolute top-1/2 left-1/3 w-[500px] h-[500px] bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-violet-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
          <h2 className="text-sm font-mono tracking-[0.2em] text-cyan-400 uppercase">
            {t.sub}
          </h2>
          <h3 className="text-3xl md:text-5xl font-black tracking-tight leading-none bg-gradient-to-r from-white to-neutral-400 bg-clip-text text-transparent">
            {t.title}
          </h3>
          <p className="text-neutral-400 text-sm md:text-base font-light leading-relaxed">
            {t.desc}
          </p>
        </div>

        {/* Dynamic Premium Interface Panel */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          
          {/* Card 1: Direct Mail / Email Copy */}
          <div 
            onClick={handleCopyEmail}
            className="group relative p-8 rounded-3xl bg-neutral-900/40 border border-white/[0.04] backdrop-blur-md hover:border-cyan-500/30 transition-all duration-300 hover:bg-neutral-900/60 cursor-pointer shadow-lg hover:shadow-[0_10px_30px_rgba(6,182,212,0.15)] flex flex-col justify-between h-[220px]"
          >
            <div className="space-y-2">
              <span className="text-[10px] font-mono text-cyan-400 tracking-wider uppercase">
                {t.emailLabel}
              </span>
              <h4 className="text-xl font-bold text-white group-hover:text-cyan-400 transition-colors">
                {copied 
                  ? (language === 'hi' ? "कॉपी हो गया!" : "Copied to Clipboard!") 
                  : currentProfile.email}
              </h4>
            </div>
            
            <div className="flex justify-between items-center mt-6">
              <span className="text-xs font-mono text-neutral-500 group-hover:text-cyan-300 transition-colors">
                {copied 
                  ? (language === 'hi' ? "ईमेल सहेज लिया गया" : "Ready to compose") 
                  : (language === 'hi' ? "क्लिक करके कॉपी करें" : "Click to Copy Address")}
              </span>
              <div className="h-10 w-10 rounded-full bg-white/5 flex items-center justify-center text-neutral-400 group-hover:bg-cyan-500 group-hover:text-black transition-all duration-300">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                </svg>
              </div>
            </div>
          </div>

          {/* Card 2: GitHub Portal */}
          <a 
            href={currentProfile.github} 
            target="_blank" 
            rel="noopener noreferrer"
            className="group relative p-8 rounded-3xl bg-neutral-900/40 border border-white/[0.04] backdrop-blur-md hover:border-violet-500/30 transition-all duration-300 hover:bg-neutral-900/60 cursor-pointer shadow-lg hover:shadow-[0_10px_30px_rgba(139,92,246,0.15)] flex flex-col justify-between h-[220px]"
          >
            <div className="space-y-2">
              <span className="text-[10px] font-mono text-violet-400 tracking-wider uppercase">
                {t.githubLabel}
              </span>
              <h4 className="text-xl font-bold text-white group-hover:text-violet-400 transition-colors">
                github.com/HarshalPatel1972
              </h4>
            </div>

            <div className="flex justify-between items-center mt-6">
              <span className="text-xs font-mono text-neutral-500 group-hover:text-violet-300 transition-colors">
                {language === 'hi' ? "कोड बेस देखें" : "Explore Source Repositories"}
              </span>
              <div className="h-10 w-10 rounded-full bg-white/5 flex items-center justify-center text-neutral-400 group-hover:bg-violet-500 group-hover:text-black transition-all duration-300">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </div>
            </div>
          </a>

          {/* Card 3: LinkedIn Hub */}
          <a 
            href={currentProfile.linkedin} 
            target="_blank" 
            rel="noopener noreferrer"
            className="group relative p-8 rounded-3xl bg-neutral-900/40 border border-white/[0.04] backdrop-blur-md hover:border-cyan-500/30 transition-all duration-300 hover:bg-neutral-900/60 cursor-pointer shadow-lg hover:shadow-[0_10px_30px_rgba(6,182,212,0.15)] flex flex-col justify-between h-[220px]"
          >
            <div className="space-y-2">
              <span className="text-[10px] font-mono text-cyan-400 tracking-wider uppercase">
                {t.linkedinLabel}
              </span>
              <h4 className="text-xl font-bold text-white group-hover:text-cyan-400 transition-colors">
                linkedin/in/harshal-patel
              </h4>
            </div>

            <div className="flex justify-between items-center mt-6">
              <span className="text-xs font-mono text-neutral-500 group-hover:text-cyan-300 transition-colors">
                {language === 'hi' ? "नेटवर्क से जुड़ें" : "Connect Professionally"}
              </span>
              <div className="h-10 w-10 rounded-full bg-white/5 flex items-center justify-center text-neutral-400 group-hover:bg-cyan-500 group-hover:text-black transition-all duration-300">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </div>
            </div>
          </a>

          {/* Card 4: Feedback Channel */}
          <div 
            onClick={handleFeedbackClick}
            className="group relative p-8 rounded-3xl bg-neutral-900/40 border border-white/[0.04] backdrop-blur-md hover:border-violet-500/30 transition-all duration-300 hover:bg-neutral-900/60 cursor-pointer shadow-lg hover:shadow-[0_10px_30px_rgba(139,92,246,0.15)] flex flex-col justify-between h-[220px]"
          >
            <div className="space-y-2">
              <span className="text-[10px] font-mono text-violet-400 tracking-wider uppercase">
                {t.feedbackLabel}
              </span>
              <h4 className={`text-xl font-bold text-white group-hover:text-violet-400 transition-colors ${isGlitching ? "animate-pulse opacity-50" : ""}`}>
                {currentFeedbackOptions[loopIdx]}
              </h4>
            </div>

            <div className="flex justify-between items-center mt-6">
              <span className="text-xs font-mono text-neutral-500 group-hover:text-violet-300 transition-colors">
                {language === 'hi' ? "रिव्यु या सुझाव सबमिट करें" : "Open Review & Bug Board"}
              </span>
              <div className="h-10 w-10 rounded-full bg-white/5 flex items-center justify-center text-neutral-400 group-hover:bg-violet-500 group-hover:text-black transition-all duration-300">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </div>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
