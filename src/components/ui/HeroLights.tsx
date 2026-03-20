"use client";
import { useEffect, useRef, useState } from "react";

// ─── Types ────────────────────────────────────────────────────────────────────
type LineDir = 'right' | 'down' | 'left' | 'up';

interface Line {
  x: number; y: number;
  direction: LineDir;
  speed: number;
  // Autonomous turn system
  turnTimer: number;       // ms countdown until next turn
  turnInterval: number;    // re-randomised each turn: 400–2000ms
  isTurning: boolean;
  turnProgress: number;    // 0→1 during bend arc
  turnChoice: 'left' | 'right';
  turnOriginX: number;
  turnOriginY: number;
  newDirection: LineDir;
  // Appearance
  alpha: number;
  dissolving: boolean; dissolved: boolean; dissolveTimer: number;
  isBurst: boolean;
}

type Phase = 'idle' | 'absorption' | 'release' | 'letterFill' | 'resetting';

interface LetterInfo {
  char: string; x: number; y: number; width: number; startTime: number;
}

const FACTS: string[] = [
  "Most people think I'm quiet. I'm just architecting something you haven't seen yet.",
  "I've rewritten this portfolio more times than I've shipped a side project.",
  "My debugging process: 10% logic. 90% staring until it fears me.",
  "I treat every new framework like a personality trait. Currently in my Go era.",
  "I know exactly how I want it to look. I just need 47 tries to get there.",
];

// ─── Constants ────────────────────────────────────────────────────────────────
const LINE_COUNT = 15;
const LOOK_AHEAD = 30;
const TAIL_LEN = 120;
const DISSOLVE_MS = 150;
const BURST_PER_WAVE = 4;
const BURST_INTERVAL = 80;
const TURN_RADIUS = 25;
const LETTER_REVEAL_MS = 350;
const LETTER_STAGGER = 100;

// ─── Direction maps ───────────────────────────────────────────────────────────
const DIR_DX: Record<LineDir, number> = { right: 1, down: 0, left: -1, up: 0 };
const DIR_DY: Record<LineDir, number> = { right: 0, down: 1, left: 0, up: -1 };
const DIRS: LineDir[] = ['right', 'down', 'left', 'up'];

function turnDir(current: LineDir, choice: 'left' | 'right'): LineDir {
  const i = DIRS.indexOf(current);
  return choice === 'right' ? DIRS[(i + 1) % 4] : DIRS[(i + 3) % 4];
}

function randomTurnInterval(): number {
  return 400 + Math.random() * 1600;
}

function spawnLine(W: number, H: number): Line {
  const edge = DIRS[Math.floor(Math.random() * 4)];
  let x = 0, y = 0;
  if (edge === 'right') { x = 0; y = Math.random() * H; }
  else if (edge === 'down') { x = Math.random() * W; y = 0; }
  else if (edge === 'left') { x = W; y = Math.random() * H; }
  else { x = Math.random() * W; y = H; }
  const interval = randomTurnInterval();
  return {
    x, y, direction: edge, speed: 1.5 + Math.random(),
    turnTimer: interval, turnInterval: interval,
    isTurning: false, turnProgress: 0, turnChoice: 'left',
    turnOriginX: x, turnOriginY: y, newDirection: edge,
    alpha: 1, dissolving: false, dissolved: false, dissolveTimer: 0, isBurst: false,
  };
}

function wouldCollide(x: number, y: number, dir: LineDir, all: Line[], W: number, H: number): boolean {
  const lx = x + DIR_DX[dir] * LOOK_AHEAD;
  const ly = y + DIR_DY[dir] * LOOK_AHEAD;
  if (lx < 5 || lx > W - 5 || ly < 5 || ly > H - 5) return true;
  return all.some(o => !o.dissolved && Math.abs(o.x - lx) < 14 && Math.abs(o.y - ly) < 14);
}

function preferDir(x: number, y: number, cx: number, cy: number): LineDir {
  const ax = Math.abs(cx - x), ay = Math.abs(cy - y);
  if (ax > ay) return cx > x ? 'right' : 'left';
  return cy > y ? 'down' : 'up';
}

// ─── Props ────────────────────────────────────────────────────────────────────
interface HeroLightsProps {
  chargeLevel: React.MutableRefObject<number>;
}

export default function HeroLights({ chargeLevel }: HeroLightsProps) {
  const [isTouch, setIsTouch] = useState(false);
  const [showHint, setShowHint] = useState(false);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const phaseRef = useRef<Phase>('idle');
  const linesRef = useRef<Line[]>([]);
  const cursorRef = useRef({ x: -9999, y: -9999 });
  const factIdxRef = useRef(0);
  const rafRef = useRef<number>(0);
  const burstTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lettersRef = useRef<LetterInfo[]>([]);
  const letterStartRef = useRef(0);

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

    // ── Bezier helpers ────────────────────────────────────────────────────────
    function bezier(t: number, p0: number, p1: number, p2: number): number {
      return (1 - t) * (1 - t) * p0 + 2 * (1 - t) * t * p1 + t * t * p2;
    }
    function bezierPoint(t: number, line: Line): { x: number; y: number } {
      const odx = DIR_DX[line.direction], ody = DIR_DY[line.direction];
      const ndx = DIR_DX[line.newDirection], ndy = DIR_DY[line.newDirection];
      const P1x = line.turnOriginX + odx * TURN_RADIUS;
      const P1y = line.turnOriginY + ody * TURN_RADIUS;
      const P2x = P1x + ndx * TURN_RADIUS;
      const P2y = P1y + ndy * TURN_RADIUS;
      return {
        x: bezier(t, line.turnOriginX, P1x, P2x),
        y: bezier(t, line.turnOriginY, P1y, P2y),
      };
    }

    // ── Canvas letter reveal ──────────────────────────────────────────────────
    doLetterFillRef.current = () => {
      phaseRef.current = 'letterFill';
      const fact = FACTS[factIdxRef.current % FACTS.length];
      const W = canvas.width, H = canvas.height;
      const fontSize = Math.max(48, Math.min(72, W * 0.05));
      const lineH = fontSize * 1.6;
      const maxW = W - 120;
      const padX = 60, padY = 80 + fontSize;

      ctx.font = `900 ${fontSize}px var(--font-cirka), serif`;
      const words = fact.split(' ');
      const textLines: string[] = [];
      let cur = '';
      words.forEach(w => {
        const test = cur ? `${cur} ${w}` : w;
        if (ctx.measureText(test).width > maxW && cur) { textLines.push(cur); cur = w; }
        else cur = test;
      });
      if (cur) textLines.push(cur);

      const letters: LetterInfo[] = [];
      let globalIdx = 0;
      textLines.forEach((tl, li) => {
        let cx = padX;
        const cy = padY + li * lineH;
        [...tl].forEach(char => {
          if (char === ' ') { cx += ctx.measureText(' ').width; return; }
          const cw = ctx.measureText(char).width;
          letters.push({ char, x: cx, y: cy, width: cw, startTime: globalIdx * LETTER_STAGGER });
          globalIdx++;
          cx += cw;
        });
      });

      lettersRef.current = letters;
      letterStartRef.current = performance.now();
    };

    // ── Reset ─────────────────────────────────────────────────────────────────
    doResetRef.current = () => {
      phaseRef.current = 'resetting';
      setShowHint(false);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      chargeLevel.current = 0;
      factIdxRef.current = (factIdxRef.current + 1) % FACTS.length;
      lettersRef.current = [];
      linesRef.current = Array.from({ length: LINE_COUNT }, () => spawnLine(canvas.width, canvas.height));
      const hc = document.getElementById('hero-content-fadeout');
      if (hc) { hc.style.transition = 'opacity 0.4s, transform 0.4s'; hc.style.opacity = '1'; hc.style.transform = 'translateY(0)'; }
      phaseRef.current = 'idle';
    };

    // ── Release phase ─────────────────────────────────────────────────────────
    doReleaseRef.current = (cx: number, cy: number) => {
      phaseRef.current = 'release';
      setShowHint(false);
      linesRef.current = [];
      const hc = document.getElementById('hero-content-fadeout');
      if (hc) { hc.style.transition = 'opacity 0.3s, transform 0.3s'; hc.style.opacity = '0'; hc.style.transform = 'translateY(-20px)'; }

      const bDir = DIRS[Math.floor(Math.random() * 4)];
      const perpY = bDir === 'right' || bDir === 'left';
      let wave = 0;
      const totalWaves = Math.ceil(LINE_COUNT / BURST_PER_WAVE);

      const burstWave = () => {
        if (wave >= totalWaves) { setTimeout(() => doLetterFillRef.current(), 800); return; }
        const count = Math.min(BURST_PER_WAVE, LINE_COUNT - wave * BURST_PER_WAVE);
        for (let i = 0; i < count; i++) {
          const offset = (i - (count - 1) / 2) * 8;
          const interval = randomTurnInterval();
          linesRef.current.push({
            x: cx + (perpY ? 0 : offset), y: cy + (perpY ? offset : 0),
            direction: bDir, speed: 2.5 + Math.random() * 0.5, alpha: 1,
            turnTimer: interval, turnInterval: interval, isTurning: false,
            turnProgress: 0, turnChoice: 'right', turnOriginX: cx, turnOriginY: cy,
            newDirection: bDir, dissolving: false, dissolved: false, dissolveTimer: 0, isBurst: true,
          });
        }
        wave++;
        burstTimerRef.current = setTimeout(burstWave, BURST_INTERVAL);
      };
      burstWave();
    };

    // ── MAIN rAF loop ─────────────────────────────────────────────────────────
    let prevTime = performance.now();

    function draw(now: number) {
      const dt = Math.min(now - prevTime, 50);
      prevTime = now;
      const W = canvas.width, H = canvas.height;
      const phase = phaseRef.current;
      ctx.clearRect(0, 0, W, H);

      // ── LETTER FILL phase: pure canvas reveal ─────────────────────────────
      if (phase === 'letterFill') {
        const elapsed = now - letterStartRef.current;
        const fontSize = Math.max(48, Math.min(72, W * 0.05));
        ctx.save();
        ctx.font = `900 ${fontSize}px var(--font-cirka), serif`;
        ctx.fillStyle = '#d91111';
        ctx.shadowBlur = 15;
        ctx.shadowColor = '#d91111';

        lettersRef.current.forEach(letter => {
          const t = Math.max(0, Math.min(1, (elapsed - letter.startTime) / LETTER_REVEAL_MS));
          if (t <= 0) return;
          const fullH = fontSize * 1.2;
          const bottomY = letter.y + fontSize * 0.18;
          const topY = letter.y - fontSize;
          const clipY = bottomY - t * fullH;
          const clipH = bottomY - clipY + 2;
          ctx.save();
          ctx.beginPath();
          ctx.rect(letter.x - 2, clipY, letter.width + 6, clipH);
          ctx.clip();
          ctx.fillText(letter.char, letter.x, letter.y);
          ctx.restore();
        });
        ctx.restore();
        rafRef.current = requestAnimationFrame(draw);
        return;
      }

      if (phase === 'resetting') { rafRef.current = requestAnimationFrame(draw); return; }

      // ── LINE drawing & movement ───────────────────────────────────────────
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

        // ── Draw tail + head ─────────────────────────────────────────────────
        if (!line.dissolved) {
          ctx.save();
          ctx.shadowBlur = 12; ctx.shadowColor = '#d91111';
          ctx.globalAlpha = line.alpha;
          ctx.lineWidth = 4; ctx.lineCap = 'round';

          if (line.isTurning) {
            // Draw the bezier arc from origin to current position
            const odx = DIR_DX[line.direction], ody = DIR_DY[line.direction];
            const ndx = DIR_DX[line.newDirection], ndy = DIR_DY[line.newDirection];
            const P1x = line.turnOriginX + odx * TURN_RADIUS;
            const P1y = line.turnOriginY + ody * TURN_RADIUS;
            const P2x = P1x + ndx * TURN_RADIUS;
            const P2y = P1y + ndy * TURN_RADIUS;

            // Gradient from P2 back to P0
            const tailX = line.turnOriginX - odx * (TAIL_LEN - TURN_RADIUS);
            const tailY = line.turnOriginY - ody * (TAIL_LEN - TURN_RADIUS);
            const g = ctx.createLinearGradient(line.x, line.y, tailX, tailY);
            g.addColorStop(0, `rgba(217,17,17,${0.8 * line.alpha})`);
            g.addColorStop(1, 'rgba(217,17,17,0)');

            ctx.beginPath();
            ctx.moveTo(tailX, tailY);
            ctx.lineTo(line.turnOriginX, line.turnOriginY);
            ctx.quadraticCurveTo(P1x, P1y, P2x, P2y);
            ctx.strokeStyle = g;
            ctx.stroke();
          } else {
            const dx = DIR_DX[line.direction], dy = DIR_DY[line.direction];
            const tailX = line.x - dx * TAIL_LEN;
            const tailY = line.y - dy * TAIL_LEN;
            const g = ctx.createLinearGradient(line.x, line.y, tailX, tailY);
            g.addColorStop(0, `rgba(217,17,17,${0.8 * line.alpha})`);
            g.addColorStop(1, 'rgba(217,17,17,0)');
            ctx.beginPath();
            ctx.moveTo(line.x, line.y); ctx.lineTo(tailX, tailY);
            ctx.strokeStyle = g; ctx.stroke();
          }

          // Bright head
          ctx.beginPath(); ctx.arc(line.x, line.y, 3, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(255,100,100,${line.alpha})`; ctx.fill();
          ctx.restore();
        }

        if (line.dissolving) return;

        // ── MOVEMENT ─────────────────────────────────────────────────────────
        if (phase === 'release') {
          line.x += DIR_DX[line.direction] * line.speed;
          line.y += DIR_DY[line.direction] * line.speed;
          if (line.x < -TAIL_LEN || line.x > W + TAIL_LEN || line.y < -TAIL_LEN || line.y > H + TAIL_LEN) line.dissolved = true;
          return;
        }

        // ── TURNING logic ─────────────────────────────────────────────────────
        if (line.isTurning) {
          line.turnProgress += line.speed / TURN_RADIUS;
          if (line.turnProgress >= 1) {
            line.isTurning = false;
            const ep = bezierPoint(1, line);
            line.x = ep.x; line.y = ep.y;
            line.direction = line.newDirection;
          } else {
            const ep = bezierPoint(line.turnProgress, line);
            line.x = ep.x; line.y = ep.y;
          }
          return;
        }

        // ── Decrement turn timer ──────────────────────────────────────────────
        line.turnTimer -= dt;
        const collisionAhead = wouldCollide(line.x, line.y, line.direction, linesRef.current, W, H);

        if (line.turnTimer <= 0 || collisionAhead) {
          // Pick turn direction — if collision, pick the side that avoids it
          let choice: 'left' | 'right';
          if (collisionAhead) {
            const left = turnDir(line.direction, 'left');
            const right = turnDir(line.direction, 'right');
            const leftClear = !wouldCollide(line.x, line.y, left, linesRef.current, W, H);
            choice = leftClear ? 'left' : 'right';
          } else {
            choice = Math.random() > 0.5 ? 'left' : 'right';
          }

          // Special: absorption mode — prefer direction toward cursor
          if (phase === 'absorption') {
            const preferred = preferDir(line.x, line.y, cursorRef.current.x, cursorRef.current.y);
            if (preferred !== line.direction) {
              const toLeft = turnDir(line.direction, 'left');
              choice = toLeft === preferred ? 'left' : 'right';
            }
          }

          line.turnChoice = choice;
          line.newDirection = turnDir(line.direction, choice);
          line.turnOriginX = line.x;
          line.turnOriginY = line.y;
          line.isTurning = true;
          line.turnProgress = 0;
          line.turnInterval = randomTurnInterval();
          line.turnTimer = line.turnInterval;
        }

        // ── Check dissolution (absorption) ────────────────────────────────────
        if (phase === 'absorption') {
          const dist = Math.hypot(line.x - cursorRef.current.x, line.y - cursorRef.current.y);
          if (dist < 12 && !line.dissolving) { line.dissolving = true; return; }
        }

        // ── Advance position ──────────────────────────────────────────────────
        line.x += DIR_DX[line.direction] * line.speed;
        line.y += DIR_DY[line.direction] * line.speed;

        // Wrap around canvas
        const pad = TAIL_LEN;
        if (line.x > W + pad) line.x = -pad;
        else if (line.x < -pad) line.x = W + pad;
        if (line.y > H + pad) line.y = -pad;
        else if (line.y < -pad) line.y = H + pad;
      });

      rafRef.current = requestAnimationFrame(draw);
    }
    rafRef.current = requestAnimationFrame(draw);

    // ── Event listeners ───────────────────────────────────────────────────────
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
      <canvas
        ref={canvasRef}
        style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', zIndex: 10, pointerEvents: 'none' }}
      />
      {showHint && (
        <div style={{ position: 'fixed', bottom: '5rem', left: '50%', transform: 'translateX(-50%)', zIndex: 20, pointerEvents: 'none' }}>
          <span className="font-mono text-[10px] text-red-500 tracking-[0.3em] uppercase animate-pulse">
            BREACH READY — CLICK TO RELEASE
          </span>
        </div>
      )}
    </>
  );
}
