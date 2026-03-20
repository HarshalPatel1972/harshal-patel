"use client";

import {
  useEffect,
  useRef,
  useState,
  forwardRef,
  useImperativeHandle,
  useCallback,
} from "react";
import { animate, stagger, createTimeline } from "animejs";

// ─── Types ───────────────────────────────────────────────────────────────────
export interface Gap {
  x: number;
  y: number;
  id: number;
}

export interface HeroLightsHandle {
  gaps: Gap[];
  triggerDisperse: (
    spherePositions: { x: number; y: number }[],
    onAllLanded: () => void
  ) => void;
  resetScene: () => void;
  isDisperseComplete: () => boolean;
}

interface LightLine {
  x: number;
  y: number;
  angle: number;
  speed: number;
  length: number;
  brightness: number;
  tailFade: number;
  frozen: boolean;
}

// ─── Facts ───────────────────────────────────────────────────────────────────
const FACTS = [
  "Most people think I'm quiet, but I'm just thinking about a project I haven't started yet.",
  "The build log is the closest thing I have to a diary.",
  "My commit history says more about me than my resume ever could.",
  "I once debugged for six hours only to find a missing semicolon I put there myself.",
  "Every side project starts as a weekend thing and ends as a life philosophy.",
];

// ─── Constants ────────────────────────────────────────────────────────────────
const LINE_COUNT = 18;
const GAP_COUNT = 20;
const GAP_RADIUS = 14;
const TAIL_LENGTH = 120;
const RIPPLE_DURATION = 700;

function makeGaps(w: number, h: number): Gap[] {
  return Array.from({ length: GAP_COUNT }, (_, i) => ({
    id: i,
    x: GAP_RADIUS + Math.random() * (w - GAP_RADIUS * 2),
    y: GAP_RADIUS + Math.random() * (h - GAP_RADIUS * 2),
  }));
}

function makeLine(w: number, h: number): LightLine {
  return {
    x: Math.random() * w,
    y: Math.random() * h,
    angle: Math.random() * Math.PI * 2,
    speed: 1.2 + Math.random() * 2.4,
    length: TAIL_LENGTH + Math.random() * 80,
    brightness: 0.7 + Math.random() * 0.3,
    tailFade: 0.008 + Math.random() * 0.006,
    frozen: false,
  };
}

// ─── Component ───────────────────────────────────────────────────────────────
const HeroLights = forwardRef<HeroLightsHandle, { factIndex?: number }>(
  ({ factIndex = 0 }, ref) => {
    const [isTouch, setIsTouch] = useState(false);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const rippleContainerRef = useRef<HTMLDivElement>(null);
    const svgOverlayRef = useRef<HTMLDivElement>(null);
    const rafRef = useRef<number>(0);

    // Mutable state via refs (avoids re-renders in rAF loop)
    const linesRef = useRef<LightLine[]>([]);
    const gapsRef = useRef<Gap[]>([]);
    const disperseComplete = useRef(false);
    const linesAreFrozen = useRef(false);
    const currentFact = useRef(FACTS[factIndex % FACTS.length]);

    // Expose handle to parent
    useImperativeHandle(ref, () => ({
      get gaps() { return gapsRef.current; },
      triggerDisperse,
      resetScene,
      isDisperseComplete: () => disperseComplete.current,
    }));

    // ─── Ripple Effect ───────────────────────────────────────────────────────
    const spawnRipple = useCallback((x: number, y: number) => {
      if (!rippleContainerRef.current) return;
      const el = document.createElement("div");
      el.style.cssText = `
        position: absolute;
        left: ${x}px; top: ${y}px;
        width: 0; height: 0;
        border-radius: 50%;
        background: transparent;
        border: 1.5px solid rgba(217,17,17,0.8);
        transform: translate(-50%, -50%);
        pointer-events: none;
      `;
      rippleContainerRef.current.appendChild(el);
      animate(el, {
        width: [0, 56],
        height: [0, 56],
        opacity: [0.8, 0],
        duration: RIPPLE_DURATION,
        easing: "easeOutQuart",
        onComplete: () => el.remove(),
      });
    }, []);

    // ─── SVG Letter Fill ────────────────────────────────────────────────────
    const triggerLetterFill = useCallback(() => {
      if (!svgOverlayRef.current) return;
      const fact = currentFact.current;
      const el = svgOverlayRef.current;
      el.innerHTML = "";

      const W = window.innerWidth;
      const H = window.innerHeight;

      const svgNS = "http://www.w3.org/2000/svg";
      const svg = document.createElementNS(svgNS, "svg");
      svg.setAttribute("width", String(W));
      svg.setAttribute("height", String(H));
      svg.setAttribute("viewBox", `0 0 ${W} ${H}`);
      svg.style.cssText = "position:absolute;inset:0;z-index:5;pointer-events:none";

      const defs = document.createElementNS(svgNS, "defs");

      // Render text off-screen to measure, then build paths per letter
      const fontSize = Math.max(18, Math.min(28, W / 28));
      const lineH = fontSize * 1.6;
      const maxW = W * 0.72;

      // Word-wrap
      const words = fact.split(" ");
      const lines: string[] = [];
      let cur = "";
      const measurer = document.createElement("canvas").getContext("2d")!;
      measurer.font = `900 ${fontSize}px 'DM Mono', monospace`;
      words.forEach((w) => {
        const test = cur ? `${cur} ${w}` : w;
        if (measurer.measureText(test).width > maxW && cur) {
          lines.push(cur);
          cur = w;
        } else {
          cur = test;
        }
      });
      if (cur) lines.push(cur);

      const totalH = lines.length * lineH;
      const startY = H / 2 - totalH / 2 + fontSize;

      let letterIndex = 0;
      const rectTargets: SVGRectElement[] = [];

      lines.forEach((line, li) => {
        const lineW = measurer.measureText(line).width;
        let curX = W / 2 - lineW / 2;
        const lineY = startY + li * lineH;

        [...line].forEach((char) => {
          if (char === " ") {
            curX += measurer.measureText(" ").width;
            return;
          }

          const cw = measurer.measureText(char).width;
          const id = `hl-clip-${letterIndex}`;

          const clipPath = document.createElementNS(svgNS, "clipPath");
          clipPath.setAttribute("id", id);

          const clipRect = document.createElementNS(svgNS, "rect");
          clipRect.setAttribute("x", String(curX - 2));
          clipRect.setAttribute("y", String(lineY - fontSize));
          clipRect.setAttribute("width", String(cw + 4));
          clipRect.setAttribute("height", String(fontSize * 1.3));
          clipRect.setAttribute("transform", `translate(0, ${fontSize * 1.3})`);
          clipPath.appendChild(clipRect);
          defs.appendChild(clipPath);

          const text = document.createElementNS(svgNS, "text");
          text.setAttribute("x", String(curX));
          text.setAttribute("y", String(lineY));
          text.setAttribute("font-size", String(fontSize));
          text.setAttribute("font-weight", "900");
          text.setAttribute("font-family", "'DM Mono', monospace");
          text.setAttribute("fill", "#D91111");
          text.setAttribute("clip-path", `url(#${id})`);
          text.setAttribute("letter-spacing", "0.06em");
          text.textContent = char;

          svg.appendChild(text);
          rectTargets.push(clipRect);
          letterIndex++;
          curX += cw;
        });
      });

      svg.insertBefore(defs, svg.firstChild);
      el.appendChild(svg);

      // Staggered flood-fill animation
      animate(rectTargets, {
        translateY: [fontSize * 1.3, 0],
        duration: 600,
        delay: stagger(80),
        easing: "easeInOutQuart",
      });
    }, []);

    // ─── Disperse Spheres to Gaps ────────────────────────────────────────────
    const triggerDisperse = useCallback(
      (
        spherePositions: { x: number; y: number }[],
        onAllLanded: () => void
      ) => {
        linesAreFrozen.current = true;
        disperseComplete.current = false;
        let landedCount = 0;

        spherePositions.forEach((pos, i) => {
          const gap = gapsRef.current[i % gapsRef.current.length];
          if (!gap) return;
          const delay = i * 45;

          setTimeout(() => {
            const dummy = { x: pos.x, y: pos.y };
            animate(dummy, {
              x: gap.x,
              y: gap.y,
              duration: 700,
              easing: "easeOutExpo",
              onComplete: () => {
                spawnRipple(gap.x, gap.y);
                landedCount++;
                if (landedCount >= spherePositions.length) {
                  disperseComplete.current = true;
                  triggerLetterFill();
                  onAllLanded();
                }
              },
            });
          }, delay);
        });
      },
      [spawnRipple, triggerLetterFill]
    );

    // ─── Reset ───────────────────────────────────────────────────────────────
    const resetScene = useCallback(() => {
      if (!canvasRef.current) return;
      const w = canvasRef.current.width;
      const h = canvasRef.current.height;
      linesAreFrozen.current = false;
      disperseComplete.current = false;
      gapsRef.current = makeGaps(w, h);
      linesRef.current = Array.from({ length: LINE_COUNT }, () => makeLine(w, h));
      if (svgOverlayRef.current) svgOverlayRef.current.innerHTML = "";
      if (rippleContainerRef.current) rippleContainerRef.current.innerHTML = "";
      currentFact.current = FACTS[(FACTS.indexOf(currentFact.current) + 1) % FACTS.length];
    }, []);

    // ─── Canvas rAF Loop ─────────────────────────────────────────────────────
    useEffect(() => {
      const touchDevice = "ontouchstart" in window || navigator.maxTouchPoints > 0;
      setIsTouch(touchDevice);
      if (touchDevice) return;

      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext("2d")!;

      const resize = () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        gapsRef.current = makeGaps(canvas.width, canvas.height);
        linesRef.current = Array.from({ length: LINE_COUNT }, () =>
          makeLine(canvas.width, canvas.height)
        );
      };
      resize();
      window.addEventListener("resize", resize);

      const draw = () => {
        const w = canvas.width;
        const h = canvas.height;
        ctx.clearRect(0, 0, w, h);

        // Draw gaps (dead zones)
        gapsRef.current.forEach((gap) => {
          ctx.beginPath();
          ctx.arc(gap.x, gap.y, GAP_RADIUS, 0, Math.PI * 2);
          ctx.strokeStyle = "rgba(217,17,17,0.12)";
          ctx.lineWidth = 0.8;
          ctx.stroke();
          // Crosshair
          ctx.strokeStyle = "rgba(217,17,17,0.08)";
          ctx.lineWidth = 0.5;
          ctx.beginPath();
          ctx.moveTo(gap.x - GAP_RADIUS * 0.6, gap.y);
          ctx.lineTo(gap.x + GAP_RADIUS * 0.6, gap.y);
          ctx.moveTo(gap.x, gap.y - GAP_RADIUS * 0.6);
          ctx.lineTo(gap.x, gap.y + GAP_RADIUS * 0.6);
          ctx.stroke();
        });

        if (!linesAreFrozen.current) {
          linesRef.current.forEach((line) => {
            if (line.frozen) return;

            // Check if inside a gap (dead zone)
            const inGap = gapsRef.current.some(
              (g) =>
                Math.hypot(line.x - g.x, line.y - g.y) < GAP_RADIUS
            );

            if (!inGap) {
              // Draw bright head
              ctx.beginPath();
              ctx.arc(line.x, line.y, 1.5, 0, Math.PI * 2);
              ctx.fillStyle = `rgba(255,255,255,${line.brightness})`;
              ctx.fill();

              // Draw fading tail
              const tailSteps = 40;
              for (let t = 0; t < tailSteps; t++) {
                const frac = t / tailSteps;
                const tx =
                  line.x -
                  Math.cos(line.angle) * line.length * frac;
                const ty =
                  line.y -
                  Math.sin(line.angle) * line.length * frac;
                const alpha = (1 - frac) * 0.18 * line.brightness;
                ctx.beginPath();
                ctx.arc(tx, ty, 0.8, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(255,255,255,${alpha})`;
                ctx.fill();
              }
            }

            // Advance line
            line.x += Math.cos(line.angle) * line.speed;
            line.y += Math.sin(line.angle) * line.speed;

            // Wrap around canvas
            if (line.x > w + line.length) line.x = -line.length;
            else if (line.x < -line.length) line.x = w + line.length;
            if (line.y > h + line.length) line.y = -line.length;
            else if (line.y < -line.length) line.y = h + line.length;
          });
        }

        rafRef.current = requestAnimationFrame(draw);
      };

      rafRef.current = requestAnimationFrame(draw);

      return () => {
        cancelAnimationFrame(rafRef.current);
        window.removeEventListener("resize", resize);
      };
    }, [isTouch]);

    if (isTouch) return null;

    return (
      <div className="absolute inset-0 z-[10] pointer-events-none overflow-hidden">
        <canvas
          ref={canvasRef}
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            pointerEvents: "none",
          }}
        />
        <div
          ref={rippleContainerRef}
          style={{
            position: "absolute",
            inset: 0,
            pointerEvents: "none",
          }}
        />
        <div
          ref={svgOverlayRef}
          style={{
            position: "absolute",
            inset: 0,
            pointerEvents: "none",
          }}
        />
      </div>
    );
  }
);

HeroLights.displayName = "HeroLights";
export default HeroLights;
