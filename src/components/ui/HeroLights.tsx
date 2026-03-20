"use client";
import { useEffect, useRef, useState } from "react";
import { animate } from "animejs";

// ─── Types ────────────────────────────────────────────────────────────────────
type Direction = 'left' | 'right' | 'up' | 'down';
interface TurnState {
  isTurning: boolean; progress: number;
  fromDir: Direction; toDir: Direction;
  originX: number; originY: number; side: 'left' | 'right';
}
interface LightLine {
  id: number; x: number; y: number; direction: Direction; speed: number;
  turnTimer: number; turnInterval: number; turn: TurnState;
  trail: { x: number; y: number }[];
  alpha: number; absorbed: boolean; linePhase: 'idle' | 'seeking' | 'absorbed';
}
interface SampledChar {
  x: number; points: { x: number; y: number }[];
  lit: boolean[]; glow: Float32Array;
}
interface BurnFront {
  charIdx: number; pointIdx: number; direction: 1 | -1; speed: number; done: boolean;
}
interface Ripple { x: number; y: number; radius: number; alpha: number; }
type Phase = 'idle' | 'absorption' | 'release' | 'letterFill' | 'resetting';
interface HeroLightsProps { chargeLevel: React.MutableRefObject<number>; }

// ─── Constants ────────────────────────────────────────────────────────────────
const LINE_COUNT = 13;
const TRAIL_MAX = 80;
const LOOK_AHEAD = 28;
const TURN_R = 25;
const DISSOLVE_MS = 180;
const BURST_PER_WAVE = 4;
const BURST_MS = 75;
const FACTS = [
  "Most people think I am quiet. I am just architecting something you have not seen yet.",
  "I have rewritten this portfolio more times than I have shipped a side project.",
  "My debugging process: 10% logic. 90% staring until it fears me.",
  "I treat every new framework like a personality trait. Currently in my Go era.",
  "I know exactly how I want it to look. I just need 47 tries to get there.",
];
const DIRS: Direction[] = ['right', 'down', 'left', 'up'];
const DX: Record<Direction, number> = { right: 1, down: 0, left: -1, up: 0 };
const DY: Record<Direction, number> = { right: 0, down: 1, left: 0, up: -1 };

// ─── Pure helpers ─────────────────────────────────────────────────────────────
function turnCW(d: Direction): Direction { return DIRS[(DIRS.indexOf(d) + 1) % 4]; }
function turnCCW(d: Direction): Direction { return DIRS[(DIRS.indexOf(d) + 3) % 4]; }
function applyTurn(d: Direction, side: 'left' | 'right'): Direction { return side === 'right' ? turnCW(d) : turnCCW(d); }
function bzr(t: number, p0: number, p1: number, p2: number): number { return (1-t)*(1-t)*p0 + 2*(1-t)*t*p1 + t*t*p2; }
function getTurnPts(t: TurnState) {
  const p1x = t.originX + DX[t.fromDir] * TURN_R, p1y = t.originY + DY[t.fromDir] * TURN_R;
  const p2x = p1x + DX[t.toDir] * TURN_R, p2y = p1y + DY[t.toDir] * TURN_R;
  return { x: bzr(t.progress, t.originX, p1x, p2x), y: bzr(t.progress, t.originY, p1y, p2y), p2x, p2y };
}
function rndInterval(): number { return 400 + Math.random() * 1800; }

// ─── Offscreen pixel sampling ─────────────────────────────────────────────────
function greedyOrder(pts: { x: number; y: number }[]): { x: number; y: number }[] {
  if (!pts.length) return [];
  const rem = [...pts];
  let curr = rem.reduce((a, b) => a.y < b.y ? a : a.y === b.y && a.x < b.x ? a : b);
  const res = [curr]; rem.splice(rem.indexOf(curr), 1);
  while (rem.length) {
    const c = res[res.length - 1];
    let bi = 0, bd = Infinity;
    for (let i = 0; i < rem.length; i++) {
      const d = (rem[i].x - c.x) ** 2 + (rem[i].y - c.y) ** 2;
      if (d < bd) { bd = d; bi = i; }
    }
    res.push(rem[bi]); rem.splice(bi, 1);
  }
  return res;
}

function sampleSentence(sentence: string, fontSize: number, sx: number, sy: number, W: number, H: number): SampledChar[] {
  const off = document.createElement('canvas');
  off.width = W; off.height = H;
  const o = off.getContext('2d')!;
  o.font = `900 ${fontSize}px var(--font-cirka), serif`;
  const chars: SampledChar[] = [];
  let cx = sx;
  for (const ch of sentence) {
    if (ch === ' ') { cx += o.measureText(' ').width; continue; }
    const cw = o.measureText(ch).width;
    o.clearRect(0, 0, W, H);
    o.fillStyle = '#fff'; o.fillText(ch, cx, sy);
    const x0 = Math.max(0, Math.floor(cx) - 2), y0 = Math.max(0, Math.floor(sy - fontSize * 1.05));
    const rw = Math.min(W - x0, Math.ceil(cw) + 6), rh = Math.min(H - y0, Math.ceil(fontSize * 1.3));
    if (rw <= 0 || rh <= 0) { cx += cw; continue; }
    const id = o.getImageData(x0, y0, rw, rh);
    const raw: { x: number; y: number }[] = [];
    for (let py = 0; py < rh; py += 4) for (let px = 0; px < rw; px += 4)
      if (id.data[(py * rw + px) * 4 + 3] > 80) raw.push({ x: x0 + px, y: y0 + py });
    if (raw.length) {
      const pts = greedyOrder(raw);
      chars.push({ x: cx, points: pts, lit: new Array(pts.length).fill(false), glow: new Float32Array(pts.length) });
    }
    cx += cw;
  }
  return chars;
}

export default function HeroLights({ chargeLevel }: HeroLightsProps) {
  const [isTouch, setIsTouch] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const phaseRef = useRef<Phase>('idle');
  const linesRef = useRef<LightLine[]>([]);
  const burstRef = useRef<LightLine[]>([]);
  const sentRef = useRef<SampledChar[]>([]);
  const frontsRef = useRef<BurnFront[]>([]);
  const ripplesRef = useRef<Ripple[]>([]);
  const curPosRef = useRef({ x: -9999, y: -9999 });
  const factIdxRef = useRef(0);
  const rafRef = useRef<number>(0);
  const burstTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const prevTimeRef = useRef(0);
  const allLitRef = useRef(false);
  const burstIdRef = useRef(1000);

  useEffect(() => {
    const touch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    setIsTouch(touch); if (touch) return;
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext('2d')!;

    function fs(): number { return Math.max(48, Math.min(72, window.innerWidth * 0.045)); }

    function makeDefaultTurn(dir: Direction, x: number, y: number): TurnState {
      return { isTurning: false, progress: 0, fromDir: dir, toDir: dir, originX: x, originY: y, side: 'left' };
    }

    function initLines(W: number, H: number): LightLine[] {
      return Array.from({ length: LINE_COUNT }, (_, id) => {
        const edge = DIRS[Math.floor(Math.random() * 4)];
        let x = 0, y = 0;
        if (edge === 'right') { x = 0; y = 20 + Math.random() * (H - 40); }
        else if (edge === 'left') { x = W; y = 20 + Math.random() * (H - 40); }
        else if (edge === 'down') { x = 20 + Math.random() * (W - 40); y = 0; }
        else { x = 20 + Math.random() * (W - 40); y = H; }
        const iv = rndInterval();
        return { id, x, y, direction: edge, speed: 1.2 + Math.random() * 1.6, turnTimer: Math.random() * iv, turnInterval: iv, turn: makeDefaultTurn(edge, x, y), trail: [], alpha: 1, absorbed: false, linePhase: 'idle' };
      });
    }

    function computeGeo(W: number, H: number) {
      sentRef.current = sampleSentence(FACTS[factIdxRef.current % FACTS.length], fs(), 60, 120, W, H);
    }

    function resize() {
      canvas.width = window.innerWidth; canvas.height = window.innerHeight;
      if (phaseRef.current === 'idle' || phaseRef.current === 'absorption') {
        linesRef.current = initLines(canvas.width, canvas.height);
        computeGeo(canvas.width, canvas.height);
      }
    }
    resize();
    window.addEventListener('resize', resize);
    linesRef.current = initLines(canvas.width, canvas.height);
    computeGeo(canvas.width, canvas.height);

    // ── Turn helpers ─────────────────────────────────────────────────────────
    function wouldHit(x: number, y: number, dir: Direction, W: number, H: number, self: number): boolean {
      const lx = x + DX[dir] * LOOK_AHEAD, ly = y + DY[dir] * LOOK_AHEAD;
      if (lx < 8 || lx > W - 8 || ly < 8 || ly > H - 8) return true;
      for (const o of linesRef.current)
        if (o.id !== self && !o.absorbed && Math.abs(o.x - lx) < 14 && Math.abs(o.y - ly) < 14) return true;
      return false;
    }

    function doTurn(line: LightLine, side: 'left' | 'right') {
      if (line.turn.isTurning) return;
      line.turn = { isTurning: true, progress: 0, fromDir: line.direction, toDir: applyTurn(line.direction, side), originX: line.x, originY: line.y, side };
      line.turnInterval = rndInterval(); line.turnTimer = line.turnInterval;
    }

    function preferSide(line: LightLine): 'left' | 'right' {
      const { x: cx, y: cy } = curPosRef.current;
      const ax = Math.abs(cx - line.x), ay = Math.abs(cy - line.y);
      const preferred: Direction = ax > ay ? (cx > line.x ? 'right' : 'left') : (cy > line.y ? 'down' : 'up');
      if (preferred === line.direction) return Math.random() > 0.5 ? 'left' : 'right';
      return turnCW(line.direction) === preferred ? 'right' : 'left';
    }

    function ignite(ci: number, pi: number) {
      frontsRef.current.push({ charIdx: ci, pointIdx: pi, direction: 1, speed: 2.5 + Math.random() * 1.5, done: false });
      frontsRef.current.push({ charIdx: ci, pointIdx: pi, direction: -1, speed: 2.5 + Math.random() * 1.5, done: false });
    }

    // ── Reset ────────────────────────────────────────────────────────────────
    function doReset() {
      phaseRef.current = 'resetting'; setShowHint(false); allLitRef.current = false;
      frontsRef.current = []; burstRef.current = [];
      let t0 = 0;
      const fade = (now: number) => {
        if (!t0) t0 = now;
        const p = Math.min(1, (now - t0) / 600);
        ctx.globalAlpha = 1 - p;
        if (p < 1) { requestAnimationFrame(fade); return; }
        ctx.globalAlpha = 1; ctx.clearRect(0, 0, canvas.width, canvas.height);
        chargeLevel.current = 0; factIdxRef.current = (factIdxRef.current + 1) % FACTS.length;
        for (const s of sentRef.current) { s.lit.fill(false); s.glow.fill(0); }
        linesRef.current = initLines(canvas.width, canvas.height);
        computeGeo(canvas.width, canvas.height); phaseRef.current = 'idle';
        const hc = document.getElementById('hero-content-fadeout');
        if (hc) animate(hc, { opacity: [0, 1], translateY: [-20, 0], duration: 400, delay: 200, easing: 'easeInQuad' });
      };
      requestAnimationFrame(fade);
    }

    // ── Release ──────────────────────────────────────────────────────────────
    function doRelease(bx: number, by: number) {
      phaseRef.current = 'release'; setShowHint(false); burstRef.current = [];
      const hc = document.getElementById('hero-content-fadeout');
      if (hc) animate(hc, { opacity: [1, 0], duration: 280, easing: 'easeOutQuad' });
      let wavesSent = 0;
      const totalWaves = Math.ceil(LINE_COUNT / BURST_PER_WAVE);
      const wave = () => {
        if (wavesSent >= totalWaves) { if (burstTimerRef.current) clearInterval(burstTimerRef.current); return; }
        const cnt = Math.min(BURST_PER_WAVE, LINE_COUNT - wavesSent * BURST_PER_WAVE);
        const bd = DIRS[Math.floor(Math.random() * 4)];
        const perpY = bd === 'right' || bd === 'left';
        for (let i = 0; i < cnt; i++) {
          const off = (i - (cnt - 1) / 2) * 7;
          burstRef.current.push({ id: burstIdRef.current++, x: bx + (perpY ? 0 : off), y: by + (perpY ? off : 0), direction: bd, speed: 4.5, turnTimer: 9999, turnInterval: 9999, turn: makeDefaultTurn(bd, bx, by), trail: [], alpha: 1, absorbed: false, linePhase: 'idle' });
        }
        wavesSent++;
      };
      wave(); burstTimerRef.current = setInterval(wave, BURST_MS);
    }

    // ── Main rAF ─────────────────────────────────────────────────────────────
    function draw(now: number) {
      const dt = Math.min(now - prevTimeRef.current, 50); prevTimeRef.current = now;
      const W = canvas.width, H = canvas.height, phase = phaseRef.current;
      ctx.clearRect(0, 0, W, H);
      if (phase === 'resetting') { rafRef.current = requestAnimationFrame(draw); return; }

      // ── LETTER FILL ──────────────────────────────────────────────────────
      if (phase === 'letterFill') {
        let allDone = frontsRef.current.length > 0;
        for (const f of frontsRef.current) {
          if (f.done) continue; allDone = false;
          f.pointIdx += f.speed * f.direction;
          const sc = sentRef.current[f.charIdx];
          if (!sc) { f.done = true; continue; }
          const len = sc.points.length;
          const fi = Math.max(0, Math.min(len - 1, Math.floor(f.pointIdx)));
          sc.lit[fi] = true; sc.glow[fi] = 1.0;
          if (f.pointIdx >= len || f.pointIdx < 0) {
            f.done = true;
            const nx = f.charIdx + f.direction;
            if (nx >= 0 && nx < sentRef.current.length) {
              const nsc = sentRef.current[nx];
              const ep = sc.points[f.direction === 1 ? len - 1 : 0];
              const sp = nsc.points[f.direction === 1 ? 0 : nsc.points.length - 1];
              if (Math.hypot(sp.x - ep.x, sp.y - ep.y) < 50 && !frontsRef.current.some(x => x.charIdx === nx && !x.done)) {
                ignite(nx, f.direction === 1 ? 0 : nsc.points.length - 1);
              }
            }
          }
        }
        for (let ci = 0; ci < sentRef.current.length; ci++) {
          const sc = sentRef.current[ci];
          for (let i = 0; i < sc.points.length; i++) {
            if (!sc.lit[i]) continue;
            sc.glow[i] = Math.max(0.35, sc.glow[i] * 0.97);
            const pt = sc.points[i], glow = sc.glow[i];
            const front = frontsRef.current.some(f => f.charIdx === ci && !f.done && Math.abs(Math.floor(f.pointIdx) - i) < 2);
            ctx.save();
            if (front) {
              ctx.beginPath(); ctx.arc(pt.x, pt.y, 3.5, 0, Math.PI * 2);
              ctx.fillStyle = `rgba(255,220,200,${glow})`; ctx.shadowBlur = 25; ctx.shadowColor = '#fff'; ctx.fill();
            } else {
              ctx.beginPath(); ctx.arc(pt.x, pt.y, 2, 0, Math.PI * 2);
              ctx.fillStyle = `rgba(217,17,17,${glow * 0.85})`; ctx.shadowBlur = 8; ctx.shadowColor = '#d91111'; ctx.fill();
            }
            ctx.restore();
          }
        }
        if (allDone && !allLitRef.current) allLitRef.current = true;
        rafRef.current = requestAnimationFrame(draw); return;
      }

      // ── RIPPLES ──────────────────────────────────────────────────────────
      ripplesRef.current = ripplesRef.current.filter(r => r.alpha > 0.01);
      for (const r of ripplesRef.current) {
        ctx.save(); ctx.beginPath(); ctx.arc(r.x, r.y, r.radius, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(255,100,100,${r.alpha})`; ctx.lineWidth = 2; ctx.stroke(); ctx.restore();
        r.radius += 1.2; r.alpha *= 0.88;
      }

      // Helper: draw and move a line
      const drawLine = (line: LightLine) => {
        if (line.absorbed) return;
        if (line.trail.length > 1) {
          ctx.save(); ctx.beginPath();
          ctx.moveTo(line.trail[0].x, line.trail[0].y);
          for (let i = 1; i < line.trail.length; i++) ctx.lineTo(line.trail[i].x, line.trail[i].y);
          const t0 = line.trail[0], tE = line.trail[line.trail.length - 1];
          const g = ctx.createLinearGradient(t0.x, t0.y, tE.x, tE.y);
          g.addColorStop(0, `rgba(217,17,17,${line.alpha})`);
          g.addColorStop(0.3, `rgba(217,17,17,${line.alpha * 0.6})`);
          g.addColorStop(1, 'rgba(217,17,17,0)');
          ctx.strokeStyle = g; ctx.lineWidth = 3.5; ctx.shadowBlur = 10; ctx.shadowColor = '#d91111'; ctx.lineCap = 'round'; ctx.stroke(); ctx.restore();
        }
        ctx.save(); ctx.beginPath(); ctx.arc(line.x, line.y, 2.5, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,100,100,${line.alpha})`; ctx.shadowBlur = 18; ctx.shadowColor = '#ff4444'; ctx.fill(); ctx.restore();
      };

      // ── BURST LINES ──────────────────────────────────────────────────────
      for (const bl of burstRef.current) {
        if (bl.absorbed) continue;
        if (bl.linePhase === 'absorbed') { bl.alpha -= dt / 100; if (bl.alpha <= 0) { bl.absorbed = true; ripplesRef.current.push({ x: bl.x, y: bl.y, radius: 0, alpha: 0.8 }); } }
        drawLine(bl);
        if (bl.linePhase === 'absorbed') continue;
        bl.trail.unshift({ x: bl.x, y: bl.y }); if (bl.trail.length > TRAIL_MAX) bl.trail.pop();
        bl.x += DX[bl.direction] * bl.speed; bl.y += DY[bl.direction] * bl.speed;
        if (bl.x < -60 || bl.x > W + 60 || bl.y < -60 || bl.y > H + 60) { bl.absorbed = true; continue; }
        for (let ci = 0; ci < sentRef.current.length; ci++) {
          const sc = sentRef.current[ci];
          let hit = false;
          for (let pi = 0; pi < sc.points.length; pi++) {
            if (Math.hypot(sc.points[pi].x - bl.x, sc.points[pi].y - bl.y) < 6) {
              ignite(ci, pi); bl.linePhase = 'absorbed'; hit = true; break;
            }
          }
          if (hit) break;
        }
      }
      if (phase === 'release' && !burstRef.current.some(b => !b.absorbed) && frontsRef.current.length > 0)
        phaseRef.current = 'letterFill';

      // ── MAIN LINES ───────────────────────────────────────────────────────
      for (const line of linesRef.current) {
        if (line.absorbed) continue;
        if (line.linePhase === 'absorbed') {
          line.alpha -= dt / DISSOLVE_MS;
          if (line.alpha <= 0) { line.absorbed = true; ripplesRef.current.push({ x: line.x, y: line.y, radius: 0, alpha: 0.8 }); }
          drawLine(line); continue;
        }
        drawLine(line);
        if (line.turn.isTurning) {
          line.turn.progress += line.speed / TURN_R;
          const { x, y, p2x, p2y } = getTurnPts(line.turn);
          if (line.turn.progress >= 1) { line.x = p2x; line.y = p2y; line.direction = line.turn.toDir; line.turn.isTurning = false; }
          else { line.x = x; line.y = y; }
          line.trail.unshift({ x: line.x, y: line.y }); if (line.trail.length > TRAIL_MAX) line.trail.pop();
          continue;
        }
        line.turnTimer -= dt;
        const col = wouldHit(line.x, line.y, line.direction, W, H, line.id);
        if (col || line.turnTimer <= 0) {
          if (col) {
            const ls = !wouldHit(line.x, line.y, turnCCW(line.direction), W, H, line.id) ? 'left' : 'right';
            doTurn(line, ls);
          } else {
            doTurn(line, line.linePhase === 'seeking' ? preferSide(line) : (Math.random() > 0.5 ? 'left' : 'right'));
          }
        }
        if (line.linePhase === 'seeking') {
          line.speed = 3.5;
          if (Math.hypot(line.x - curPosRef.current.x, line.y - curPosRef.current.y) < 10) {
            line.linePhase = 'absorbed';
            chargeLevel.current = Math.min(LINE_COUNT, chargeLevel.current + 1);
            if (chargeLevel.current >= LINE_COUNT) setShowHint(true);
          }
        }
        line.x += DX[line.direction] * line.speed; line.y += DY[line.direction] * line.speed;
        const P = TRAIL_MAX;
        if (line.x > W + P) { line.x = -P; line.trail = []; } else if (line.x < -P) { line.x = W + P; line.trail = []; }
        if (line.y > H + P) { line.y = -P; line.trail = []; } else if (line.y < -P) { line.y = H + P; line.trail = []; }
        line.trail.unshift({ x: line.x, y: line.y }); if (line.trail.length > TRAIL_MAX) line.trail.pop();
      }

      rafRef.current = requestAnimationFrame(draw);
    }
    prevTimeRef.current = performance.now();
    rafRef.current = requestAnimationFrame(draw);

    // ── Events ───────────────────────────────────────────────────────────────
    const onMove = (e: MouseEvent) => {
      curPosRef.current = { x: e.clientX, y: e.clientY };
      if (phaseRef.current === 'idle') { phaseRef.current = 'absorption'; for (const l of linesRef.current) l.linePhase = 'seeking'; }
    };
    const onClick = (e: MouseEvent) => {
      if (phaseRef.current === 'absorption' && chargeLevel.current >= LINE_COUNT) doRelease(e.clientX, e.clientY);
      else if (phaseRef.current === 'letterFill' && allLitRef.current) doReset();
    };
    window.addEventListener('mousemove', onMove);
    window.addEventListener('click', onClick);
    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('click', onClick);
      if (burstTimerRef.current) clearInterval(burstTimerRef.current);
    };
  }, [chargeLevel]);

  if (isTouch) return null;
  return (
    <>
      <canvas ref={canvasRef} style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', zIndex: 10, pointerEvents: 'none' }} />
      {showHint && (
        <div style={{ position: 'fixed', bottom: '5rem', left: '50%', transform: 'translateX(-50%)', zIndex: 20, pointerEvents: 'none' }}>
          <span className="font-mono text-[10px] text-red-500 tracking-[0.3em] uppercase animate-pulse">BREACH READY — CLICK TO RELEASE</span>
        </div>
      )}
    </>
  );
}
