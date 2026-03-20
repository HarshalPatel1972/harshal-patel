"use client";
import { useEffect, useRef, useState } from "react";
import { animate, stagger } from "animejs";

// ─── Types ────────────────────────────────────────────────────────────────────
type Dir = 0 | 1 | 2 | 3; // right, down, left, up

interface Line {
  x: number; y: number;
  dir: Dir; speed: number;
  alpha: number;
  dissolving: boolean; dissolved: boolean; dissolveTimer: number;
  isBurst: boolean;
}
type Phase = 'idle' | 'absorption' | 'release' | 'letterFill' | 'resetting';

// ─── Constants ────────────────────────────────────────────────────────────────
const LINE_COUNT = 15;
const LOOK_AHEAD = 30;
const TAIL_LEN = 120;
const DISSOLVE_MS = 150;
const BURST_PER_WAVE = 4;
const BURST_INTERVAL = 80;
const DX: [number,number,number,number] = [1, 0, -1, 0];
const DY: [number,number,number,number] = [0, 1, 0, -1];

const FACTS: string[] = [
  "Most people think I'm quiet. I'm just architecting something you haven't seen yet.",
  "I've rewritten this portfolio more times than I've shipped a side project.",
  "My debugging process: 10% logic. 90% staring until it fears me.",
  "I treat every new framework like a personality trait. Currently in my Go era.",
  "I know exactly how I want it to look. I just need 47 tries to get there.",
];

// ─── Pure helpers (outside component) ────────────────────────────────────────
function turn(d: Dir, right: boolean): Dir {
  return ((right ? d + 1 : d + 3) % 4) as Dir;
}
function spawnLine(W: number, H: number): Line {
  const edge = Math.floor(Math.random() * 4) as Dir;
  let x = 0, y = 0;
  if (edge === 0) { x = 0; y = Math.random() * H; }
  else if (edge === 1) { x = Math.random() * W; y = 0; }
  else if (edge === 2) { x = W; y = Math.random() * H; }
  else { x = Math.random() * W; y = H; }
  return { x, y, dir: edge, speed: 1.5 + Math.random(), alpha: 1, dissolving: false, dissolved: false, dissolveTimer: 0, isBurst: false };
}
function wouldCollide(line: Line, all: Line[], W: number, H: number): boolean {
  const lx = line.x + DX[line.dir] * LOOK_AHEAD;
  const ly = line.y + DY[line.dir] * LOOK_AHEAD;
  if (lx < 5 || lx > W - 5 || ly < 5 || ly > H - 5) return true;
  return all.some(o => o !== line && !o.dissolved && Math.abs(o.x - lx) < 14 && Math.abs(o.y - ly) < 14);
}
function preferDir(line: Line, cx: number, cy: number): Dir {
  const ax = Math.abs(cx - line.x), ay = Math.abs(cy - line.y);
  if (ax > ay) return cx > line.x ? 0 : 2;
  return cy > line.y ? 1 : 3;
}

// ─── Props ────────────────────────────────────────────────────────────────────
interface HeroLightsProps {
  chargeLevel: React.MutableRefObject<number>;
}

export default function HeroLights({ chargeLevel }: HeroLightsProps) {
  const [isTouch, setIsTouch] = useState(false);
  const [showHint, setShowHint] = useState(false);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const svgContainerRef = useRef<HTMLDivElement>(null);

  // All mutable state in refs to avoid stale closures
  const phaseRef = useRef<Phase>('idle');
  const linesRef = useRef<Line[]>([]);
  const cursorRef = useRef({ x: -9999, y: -9999 });
  const factIdxRef = useRef(0);
  const rafRef = useRef<number>(0);
  const burstTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const prevTimeRef = useRef(performance.now());

  // Exposed so event listeners (set up in useEffect) can call these
  const doLetterFillRef = useRef<() => void>(() => {});
  const doResetRef = useRef<() => void>(() => {});
  const doReleaseRef = useRef<(cx: number, cy: number) => void>(() => {});

  useEffect(() => {
    const touch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    setIsTouch(touch);
    if (touch) return;

    const canvas = canvasRef.current!;
    const ctx = canvas.getContext('2d')!;

    function resize() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      if (phaseRef.current === 'idle') {
        linesRef.current = Array.from({ length: LINE_COUNT }, () => spawnLine(canvas.width, canvas.height));
      }
    }
    resize();
    window.addEventListener('resize', resize);
    linesRef.current = Array.from({ length: LINE_COUNT }, () => spawnLine(canvas.width, canvas.height));

    // ── Letter fill ──────────────────────────────────────────────────────────
    doLetterFillRef.current = () => {
      const svgEl = svgContainerRef.current;
      if (!svgEl) return;
      svgEl.innerHTML = '';
      phaseRef.current = 'letterFill';

      const fact = FACTS[factIdxRef.current % FACTS.length];
      const W = window.innerWidth, H = window.innerHeight;
      const fontSize = Math.max(48, Math.min(80, W / 13));
      const lineH = fontSize * 1.55;
      const maxW = W * 0.78;

      const measurer = document.createElement('canvas').getContext('2d')!;
      measurer.font = `900 ${fontSize}px var(--font-cirka), serif`;

      const textLines: string[] = [];
      let cur = '';
      fact.split(' ').forEach(w => {
        const test = cur ? `${cur} ${w}` : w;
        if (measurer.measureText(test).width > maxW && cur) { textLines.push(cur); cur = w; }
        else cur = test;
      });
      if (cur) textLines.push(cur);

      const totalH = textLines.length * lineH;
      const startY = H / 2 - totalH / 2 + fontSize;
      const NS = 'http://www.w3.org/2000/svg';
      const svg = document.createElementNS(NS, 'svg');
      svg.setAttribute('width', String(W));
      svg.setAttribute('height', String(H));
      svg.setAttribute('viewBox', `0 0 ${W} ${H}`);
      svg.style.cssText = 'position:absolute;inset:0;overflow:visible;';
      const defs = document.createElementNS(NS, 'defs');
      const rects: SVGRectElement[] = [];
      let idx = 0;

      textLines.forEach((tl, li) => {
        const lw = measurer.measureText(tl).width;
        let cx = W / 2 - lw / 2;
        const cy = startY + li * lineH;
        [...tl].forEach(ch => {
          if (ch === ' ') { cx += measurer.measureText(' ').width; return; }
          const cw = measurer.measureText(ch).width;
          const id = `hc${idx}`;
          const clip = document.createElementNS(NS, 'clipPath');
          clip.setAttribute('id', id);
          const ct = document.createElementNS(NS, 'text');
          ct.setAttribute('x', String(cx)); ct.setAttribute('y', String(cy));
          ct.setAttribute('font-size', String(fontSize));
          ct.setAttribute('font-weight', '900');
          ct.setAttribute('font-family', 'var(--font-cirka), serif');
          ct.textContent = ch;
          clip.appendChild(ct); defs.appendChild(clip);

          const rect = document.createElementNS(NS, 'rect');
          rect.setAttribute('x', String(cx - 4));
          rect.setAttribute('y', String(cy - fontSize - 8));
          rect.setAttribute('width', String(cw + 8));
          rect.setAttribute('height', String(fontSize * 1.4));
          rect.setAttribute('fill', '#d91111');
          rect.setAttribute('clip-path', `url(#${id})`);
          rect.style.filter = 'drop-shadow(0 0 10px #d91111)';
          svg.appendChild(rect); rects.push(rect);
          idx++; cx += cw;
        });
      });
      svg.insertBefore(defs, svg.firstChild);
      svgEl.appendChild(svg);

      setTimeout(() => {
        animate(rects, {
          translateY: [fontSize * 1.4, 0],
          duration: 350, delay: stagger(100), easing: 'easeInOutQuart',
        });
      }, 80);
    };

    // ── Reset ────────────────────────────────────────────────────────────────
    doResetRef.current = () => {
      phaseRef.current = 'resetting';
      setShowHint(false);

      const svgEl = svgContainerRef.current;
      if (svgEl) animate(svgEl, { opacity: [1, 0], duration: 600, easing: 'easeInOutQuad', onComplete: () => { if (svgEl) { svgEl.innerHTML = ''; svgEl.style.opacity = '1'; } } });

      animate(canvas, { opacity: [1, 0], duration: 600, easing: 'easeInOutQuad', onComplete: () => {
        canvas.style.opacity = '1';
        chargeLevel.current = 0;
        factIdxRef.current = (factIdxRef.current + 1) % FACTS.length;
        linesRef.current = Array.from({ length: LINE_COUNT }, () => spawnLine(canvas.width, canvas.height));
        phaseRef.current = 'idle';

        const hc = document.getElementById('hero-content-fadeout');
        if (hc) animate(hc, { opacity: [0, 1], translateY: [-20, 0], duration: 400, easing: 'easeOutQuart' });
      }});
    };

    // ── Release ──────────────────────────────────────────────────────────────
    doReleaseRef.current = (cx: number, cy: number) => {
      phaseRef.current = 'release';
      setShowHint(false);
      linesRef.current = [];

      const bDir = Math.floor(Math.random() * 4) as Dir;
      const perp = (bDir === 0 || bDir === 2) ? 'y' : 'x';
      let wave = 0;
      const totalWaves = Math.ceil(LINE_COUNT / BURST_PER_WAVE);

      const hc = document.getElementById('hero-content-fadeout');
      if (hc) animate(hc, { opacity: [1, 0], translateY: [0, -20], duration: 300, easing: 'easeOutQuad' });

      const burstWave = () => {
        if (wave >= totalWaves) {
          setTimeout(() => doLetterFillRef.current(), 800);
          return;
        }
        const count = Math.min(BURST_PER_WAVE, LINE_COUNT - wave * BURST_PER_WAVE);
        for (let i = 0; i < count; i++) {
          const off = (i - (count - 1) / 2) * 8;
          linesRef.current.push({
            x: cx + (perp === 'x' ? off : 0),
            y: cy + (perp === 'y' ? off : 0),
            dir: bDir, speed: 2.5 + Math.random() * 0.5,
            alpha: 1, dissolving: false, dissolved: false, dissolveTimer: 0, isBurst: true,
          });
        }
        wave++;
        burstTimerRef.current = setTimeout(burstWave, BURST_INTERVAL);
      };
      burstWave();
    };

    // ── rAF draw loop ────────────────────────────────────────────────────────
    function draw(now: number) {
      const dt = Math.min(now - prevTimeRef.current, 50);
      prevTimeRef.current = now;
      const W = canvas.width, H = canvas.height;
      ctx.clearRect(0, 0, W, H);
      const phase = phaseRef.current;

      if (phase === 'letterFill' || phase === 'resetting') {
        rafRef.current = requestAnimationFrame(draw); return;
      }

      linesRef.current.forEach(line => {
        if (line.dissolved) return;

        // Dissolve tick
        if (line.dissolving) {
          line.dissolveTimer += dt;
          line.alpha = Math.max(0, 1 - line.dissolveTimer / DISSOLVE_MS);
          if (line.dissolveTimer >= DISSOLVE_MS) {
            line.dissolved = true;
            chargeLevel.current = Math.min(15, chargeLevel.current + 1);
            if (chargeLevel.current >= 15) setShowHint(true);
          }
        }

        if (!line.dissolved) {
          const tx = line.x - DX[line.dir] * TAIL_LEN;
          const ty = line.y - DY[line.dir] * TAIL_LEN;
          const g = ctx.createLinearGradient(line.x, line.y, tx, ty);
          g.addColorStop(0, `rgba(217,17,17,${0.8 * line.alpha})`);
          g.addColorStop(1, 'rgba(217,17,17,0)');
          ctx.save();
          ctx.shadowBlur = 12; ctx.shadowColor = '#d91111';
          ctx.globalAlpha = line.alpha;
          ctx.beginPath(); ctx.moveTo(line.x, line.y); ctx.lineTo(tx, ty);
          ctx.strokeStyle = g; ctx.lineWidth = 4; ctx.lineCap = 'round'; ctx.stroke();
          ctx.beginPath(); ctx.arc(line.x, line.y, 3, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(255,100,100,${line.alpha})`; ctx.fill();
          ctx.restore();
        }

        if (line.dissolving) return;

        // Movement
        if (phase === 'idle') {
          if (wouldCollide(line, linesRef.current, W, H)) {
            const r = turn(line.dir, true), l = turn(line.dir, false);
            line.dir = !wouldCollide({ ...line, dir: r }, linesRef.current, W, H) ? r : l;
          }
        } else if (phase === 'absorption') {
          if (Math.random() < 0.05) {
            const td = preferDir(line, cursorRef.current.x, cursorRef.current.y);
            if (td !== line.dir && !wouldCollide({ ...line, dir: td }, linesRef.current, W, H)) line.dir = td;
          }
          const dist = Math.hypot(line.x - cursorRef.current.x, line.y - cursorRef.current.y);
          if (dist < 10) { line.dissolving = true; return; }
        } else if (phase === 'release') {
          line.x += DX[line.dir] * line.speed;
          line.y += DY[line.dir] * line.speed;
          if (line.x < -TAIL_LEN || line.x > W + TAIL_LEN || line.y < -TAIL_LEN || line.y > H + TAIL_LEN) line.dissolved = true;
          return;
        }

        line.x += DX[line.dir] * line.speed;
        line.y += DY[line.dir] * line.speed;
        if (line.x > W + TAIL_LEN) line.x = -TAIL_LEN;
        else if (line.x < -TAIL_LEN) line.x = W + TAIL_LEN;
        if (line.y > H + TAIL_LEN) line.y = -TAIL_LEN;
        else if (line.y < -TAIL_LEN) line.y = H + TAIL_LEN;
      });

      rafRef.current = requestAnimationFrame(draw);
    }
    rafRef.current = requestAnimationFrame(draw);

    // ── Event listeners ──────────────────────────────────────────────────────
    function onMouseMove(e: MouseEvent) {
      cursorRef.current = { x: e.clientX, y: e.clientY };
      if (phaseRef.current === 'idle') phaseRef.current = 'absorption';
    }
    function onClick(e: MouseEvent) {
      if (phaseRef.current === 'absorption' && chargeLevel.current >= 15) {
        doReleaseRef.current(e.clientX, e.clientY);
      } else if (phaseRef.current === 'letterFill') {
        doResetRef.current();
      }
    }
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('click', onClick);

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('click', onClick);
      if (burstTimerRef.current) clearTimeout(burstTimerRef.current);
    };
  }, [chargeLevel]);

  if (isTouch) return null;

  return (
    <>
      <canvas ref={canvasRef} style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', zIndex: 10, pointerEvents: 'none' }} />
      <div ref={svgContainerRef} style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', zIndex: 15, pointerEvents: 'none' }} />
      {showHint && (
        <div style={{ position: 'fixed', bottom: '5rem', left: '50%', transform: 'translateX(-50%)', zIndex: 20, pointerEvents: 'none' }}>
          <span className="font-mono text-[10px] text-red-500 tracking-[0.3em] uppercase animate-pulse">BREACH READY — CLICK TO RELEASE</span>
        </div>
      )}
    </>
  );
}
