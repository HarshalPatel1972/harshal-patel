"use client";

import React, { useEffect, useState } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { useDesignVersion } from '@/components/shared/DesignVersionContext';

const TRANSLATIONS: Record<string, { visitors: string; views: string; since: string }> = {
  en: { visitors: 'Visitors', views: 'Views', since: 'since your last visit' },
  ja: { visitors: '訪問者', views: 'ビュー', since: '前回の訪問から' },
  ko: { visitors: '방문자', views: '조회수', since: '지난 방문 이후' },
  'zh-tw': { visitors: '訪客', views: '瀏覽', since: '自上次造訪' },
  hi: { visitors: 'आगंतुक', views: 'दृश्य', since: 'आपकी पिछली यात्रा के बाद' },
  fr: { visitors: 'Visiteurs', views: 'Vues', since: 'depuis votre dernière visite' },
  id: { visitors: 'Pengunjung', views: 'Tayangan', since: 'sejak kunjungan terakhir' },
  de: { visitors: 'Besucher', views: 'Aufrufe', since: 'seit Ihrem letzten Besuch' },
  it: { visitors: 'Visitatori', views: 'Visualizzazioni', since: 'dalla tua ultima visita' },
  'pt-br': { visitors: 'Visitantes', views: 'Visualizações', since: 'desde sua última visita' },
  'es-419': { visitors: 'Visitantes', views: 'Vistas', since: 'desde tu última visita' },
  es: { visitors: 'Visitantes', views: 'Vistas', since: 'desde tu última visita' },
  eridian: { visitors: 'VISIT-HUMANS', views: 'LOOK-THINGS', since: 'SINCE-YOU-LAST-COME' },
};

const LAST_COUNT_KEY = 'visitor_last_count';
const DIGIT_HEIGHT = 1.15; // em

/** A row of rolling digits, like a mechanical odometer. Rolls from its previous value whenever `value` changes. */
function Odometer({ value, pad = 4 }: { value: number; pad?: number }) {
  const digits = String(Math.max(0, Math.floor(value))).padStart(pad, '0').split('');
  return (
    <span
      aria-hidden="true"
      className="inline-flex font-mono font-black tabular-nums"
      style={{ height: `${DIGIT_HEIGHT}em`, lineHeight: `${DIGIT_HEIGHT}em` }}
    >
      {digits.map((d, i) => (
        <span key={digits.length - i} className="relative block overflow-hidden" style={{ width: '0.62em', height: `${DIGIT_HEIGHT}em` }}>
          <span
            className="absolute left-0 top-0 flex w-full flex-col items-center odometer-reel"
            style={{
              transform: `translateY(-${Number(d) * DIGIT_HEIGHT}em)`,
              transitionDelay: `${(digits.length - 1 - i) * 90}ms`,
            }}
          >
            {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((n) => (
              <span key={n} className="block" style={{ height: `${DIGIT_HEIGHT}em` }}>{n}</span>
            ))}
          </span>
        </span>
      ))}
    </span>
  );
}

export function VisitorCounter() {
  const { language } = useLanguage();
  const { designVersion } = useDesignVersion();
  const isV2 = designVersion === 'new';
  const [data, setData] = useState<{ uniqueCount: number; totalHits: number } | null>(null);
  const [newSince, setNewSince] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const t = TRANSLATIONS[language] || TRANSLATIONS.en;

  useEffect(() => {
    let cid = typeof window !== 'undefined' ? localStorage.getItem('visitor_soul_id') : null;
    if (!cid && typeof window !== 'undefined') {
       cid = Math.random().toString(36).substring(2, 15);
       localStorage.setItem('visitor_soul_id', cid);
    }

    let firstFetch = true;
    const fetchStats = async () => {
      try {
        const res = await fetch('/api/visitor-count');
        const json = await res.json();
        if (json.success) {
          setData({ uniqueCount: json.uniqueCount, totalHits: json.totalHits });
          if (firstFetch) {
            firstFetch = false;
            // How many new visitors since this browser last looked (first visit shows nothing)
            try {
              const last = Number(localStorage.getItem(LAST_COUNT_KEY));
              if (last > 0 && json.uniqueCount > last) setNewSince(json.uniqueCount - last);
              localStorage.setItem(LAST_COUNT_KEY, String(json.uniqueCount));
            } catch {}
          }
        }
      } catch {}
    };

    const incrementStats = async () => {
      try {
        await fetch('/api/visitor-count', {
           method: 'POST',
           headers: { 'Content-Type': 'application/json' },
           body: JSON.stringify({ cid })
        });
        fetchStats();
      } catch {}
    };

    fetchStats();
    const humanCheck = setTimeout(incrementStats, 3000);
    const interval = setInterval(fetchStats, 60000);
    return () => {
      clearTimeout(humanCheck);
      clearInterval(interval);
    };
  }, []);

  const ink = isV2 ? "text-[var(--sumi-ink)]" : "text-white";
  const accent = isV2 ? "text-[var(--forge-orange)]" : "text-[var(--accent-blood)]";
  const accentBg = isV2 ? "bg-[var(--forge-orange)]" : "bg-[var(--accent-blood)]";
  const label = isV2 ? "text-[var(--muted-label)]" : "text-white/40";
  const divider = isV2 ? "border-[var(--sumi-ink)]/15" : "border-white/10";

  const unique = data?.uniqueCount ?? 0;
  const views = data?.totalHits ?? 0;

  return (
    <div className="relative flex items-center pointer-events-auto select-none h-10">
      {/* Rolling digits transition; skipped for reduced motion */}
      <style>{`
        .odometer-reel { transition: transform 1400ms cubic-bezier(0.16, 1, 0.3, 1); }
        @media (prefers-reduced-motion: reduce) { .odometer-reel { transition: none !important; } }
      `}</style>

      <button
        type="button"
        onMouseEnter={() => setIsOpen(true)}
        onMouseLeave={() => setIsOpen(false)}
        onClick={() => setIsOpen((o) => !o)}
        aria-expanded={isOpen}
        aria-label={data ? `${unique.toLocaleString()} ${t.visitors}, ${views.toLocaleString()} ${t.views}` : t.visitors}
        className={`group/counter relative flex items-stretch h-10 overflow-hidden transition-colors duration-500 cursor-pointer ${
          isV2
            ? "bg-[var(--aged-paper)] border border-[var(--sumi-ink)]/20 hover:border-[var(--forge-orange)]"
            : "bg-black border-2 border-white hover:border-[var(--accent-blood)]"
        }`}
      >
        {/* Live pulse: a thin accent rail on the left edge */}
        <span className={`w-[3px] shrink-0 ${accentBg}`} />

        {/* Eye + unique visitors (always visible) */}
        <span className={`flex items-center gap-3 px-3.5 ${ink}`}>
          <span className="relative flex h-4 w-4 items-center justify-center">
            <span className={`absolute inline-flex h-full w-full rounded-full opacity-40 motion-safe:animate-ping ${accentBg}`} />
            <svg viewBox="0 0 24 24" className={`relative h-4 w-4 ${accent}`} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12z" />
              <circle cx="12" cy="12" r="3" fill="currentColor" />
            </svg>
          </span>
          <span className="flex flex-col items-start justify-center gap-[3px]">
            <span className="text-[13px] leading-none"><Odometer value={unique} pad={4} /></span>
            <span className={`text-[8px] font-black uppercase tracking-[0.25em] leading-none ${label}`}>{t.visitors}</span>
          </span>
        </span>

        {/* Views + what's new since you were last here, revealed on hover or tap */}
        <span
          className={`flex items-center overflow-hidden whitespace-nowrap border-l transition-all duration-500 ease-out ${divider} ${
            isV2 ? "bg-[var(--forge-orange)]/5" : "bg-white/5"
          } ${isOpen ? "max-w-[260px] px-4 opacity-100" : "max-w-0 px-0 opacity-0 border-l-0"}`}
        >
          <span className="flex flex-col items-start justify-center gap-[3px]">
            <span className={`text-[13px] leading-none ${accent}`}><Odometer value={views} pad={1} /></span>
            <span className={`text-[8px] font-black uppercase tracking-[0.25em] leading-none ${label}`}>{t.views}</span>
          </span>
          {newSince > 0 && (
            <span className={`ml-4 flex flex-col items-start justify-center gap-[3px] border-l pl-4 ${divider}`}>
              <span className={`font-mono text-[11px] font-black leading-none ${ink}`}>+{newSince.toLocaleString()}</span>
              <span className={`text-[8px] font-black uppercase tracking-[0.15em] leading-none ${label}`}>{t.since}</span>
            </span>
          )}
        </span>
      </button>
    </div>
  );
}
