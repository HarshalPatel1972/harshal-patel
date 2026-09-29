"use client";

import { useEffect, useRef, useState } from "react";
import {
  advance, fallSpeed, levelFor, maxWords, newGame, pickWord, pressKey, releaseLock,
  spawnInterval, START_LIVES, type GameState,
} from "@/lib/typeKill";

/**
 * Hidden mini-game for the V1 hero, activated the same way as V2's Snake:
 * cells blink in the background, hold the mouse (or a finger) down for 1.5s,
 * the cells morph into a play button, click it. Esc leaves.
 */

const CELL = 40;
const HOLD_MS = 1500;
const BEST_KEY = "typekill_best";
const MONO = 'ui-monospace, "SFMono-Regular", Menlo, Consolas, "Courier New", monospace';

const RED = { r: 217, g: 17, b: 17 };
const BONE = { r: 232, g: 232, b: 228 };

type Phase = "AMBIENT" | "PLAY_BUTTON" | "PLAYING" | "GAME_OVER";
type Rgb = { r: number; g: number; b: number };

interface Particle {
  x: number; y: number; targetX: number; targetY: number;
  color: Rgb; startTime: number; duration: number; maxAlpha: number; pinned?: boolean;
}
interface Spark { x: number; y: number; vx: number; vy: number; life: number; max: number; color: Rgb }

// A right-pointing triangle, 5 cells wide. dc/dr are offsets from the centre cell.
const PLAY_CELLS: { dc: number; dr: number }[] = [];
for (let c = -2; c <= 2; c++) {
  const half = 4 - (c + 2);
  for (let r = -half; r <= half; r++) PLAY_CELLS.push({ dc: c + 1, dr: r }); // +1 centres it optically
}

const rgba = (c: Rgb, a: number) => `rgba(${c.r}, ${c.g}, ${c.b}, ${a})`;

const readBest = () => {
  try { return Number(localStorage.getItem(BEST_KEY)) || 0; } catch { return 0; }
};
const writeBest = (n: number) => {
  try { localStorage.setItem(BEST_KEY, String(n)); } catch { /* private mode */ }
};

export default function TypeKill() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [phase, setPhaseState] = useState<Phase>("AMBIENT");
  const phaseRef = useRef<Phase>("AMBIENT");

  useEffect(() => {
    const canvas = canvasRef.current;
    const input = inputRef.current;
    if (!canvas || !input) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let width = 0;
    let height = 0;
    let raf = 0;
    let running = false;
    let last = performance.now();

    let particles: Particle[] = [];
    let sparks: Spark[] = [];
    let lastSpawn = 0;
    let holding = false;
    let holdStart = 0;
    let playButtonSince = 0;

    let game: GameState = newGame();
    let spawnTimer = 0;
    let playTime = 0;
    let dim = 0;
    let shake = 0;
    let flash = 0;
    let best = readBest();
    let newBest = false;

    let prevOverflow: string | null = null;
    const lockScroll = () => {
      if (prevOverflow === null) prevOverflow = document.body.style.overflow;
      document.body.style.overflow = "hidden";
    };
    const unlockScroll = () => {
      if (prevOverflow !== null) document.body.style.overflow = prevOverflow;
      prevOverflow = null;
    };

    const setPhase = (p: Phase) => {
      phaseRef.current = p;
      setPhaseState(p);
    };

    const resize = () => {
      const parent = canvas.parentElement;
      if (!parent) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = parent.clientWidth;
      height = parent.clientHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();

    const cols = () => Math.ceil(width / CELL);
    const rows = () => Math.ceil(height / CELL);
    const center = () => ({ midCol: Math.floor(cols() / 2), midRow: Math.floor(rows() / 2) });
    const nearTop = (fraction: number) => window.scrollY < window.innerHeight * fraction;

    // ---------- ambient grid ----------
    const spawnAmbient = (now: number) => {
      const col = Math.floor(Math.random() * cols());
      const row = Math.floor(Math.random() * rows());
      const isRed = Math.random() < 0.55;
      particles.push({
        x: col * CELL, y: row * CELL, targetX: col * CELL, targetY: row * CELL,
        color: isRed ? RED : BONE, startTime: now, duration: 2500 + Math.random() * 2500,
        maxAlpha: isRed ? 0.13 : 0.08,
      });
    };

    const toPlayButton = () => {
      const { midCol, midRow } = center();
      const now = performance.now();
      particles = PLAY_CELLS.map((p, i) => {
        const tx = (midCol + p.dc) * CELL;
        const ty = (midRow + p.dr) * CELL;
        const from = particles[i];
        return {
          x: from ? from.x : tx, y: from ? from.y : ty, targetX: tx, targetY: ty,
          color: RED, startTime: now, duration: 1e9, maxAlpha: 0.38, pinned: true,
        };
      });
      playButtonSince = now;
      setPhase("PLAY_BUTTON");
    };

    const insidePlayButton = (clientX: number, clientY: number) => {
      const rect = canvas.getBoundingClientRect();
      const { midCol, midRow } = center();
      const col = Math.floor((clientX - rect.left) / CELL);
      const row = Math.floor((clientY - rect.top) / CELL);
      return col >= midCol - 1 && col <= midCol + 3 && row >= midRow - 4 && row <= midRow + 4;
    };

    // ---------- game flow ----------
    const startGame = () => {
      game = newGame();
      spawnTimer = 99; // first word straight away
      playTime = 0;
      newBest = false;
      particles = [];
      sparks = [];
      flash = 0;
      shake = 0;
      lockScroll();
      setPhase("PLAYING");
      input.value = "";
      input.focus({ preventScroll: true });
    };

    const exitGame = () => {
      particles = [];
      sparks = [];
      holding = false;
      dim = 0;
      unlockScroll();
      input.blur();
      setPhase("AMBIENT");
      start();
    };

    const endGame = () => {
      if (game.score > best) {
        best = game.score;
        newBest = game.score > 0;
        writeBest(best);
      }
      game.words = []; // clear the board so the result reads cleanly
      game.lockedId = null;
      input.blur();
      setPhase("GAME_OVER");
    };

    const burst = (x: number, y: number, color: Rgb) => {
      if (reduceMotion) return;
      for (let i = 0; i < 14; i++) {
        const a = Math.random() * Math.PI * 2;
        const v = 60 + Math.random() * 180;
        sparks.push({ x, y, vx: Math.cos(a) * v, vy: Math.sin(a) * v - 40, life: 0, max: 0.45 + Math.random() * 0.3, color });
      }
    };

    const type = (chars: string) => {
      if (phaseRef.current !== "PLAYING") return;
      for (const ch of chars) {
        const res = pressKey(game, ch);
        if (res.type === "kill") {
          burst(res.word.x + 20, res.word.y + 14, res.word.kind === "bug" ? RED : BONE);
        } else if (res.type === "miss") {
          flash = Math.max(flash, 0.35);
        }
      }
    };

    // ---------- drawing ----------
    const drawAmbient = (now: number, state: Phase) => {
      particles = particles.filter((p) => {
        const elapsed = now - p.startTime;
        if (!p.pinned && elapsed >= p.duration) return false;
        p.x += (p.targetX - p.x) * 0.12;
        p.y += (p.targetY - p.y) * 0.12;
        const alpha = p.pinned ? p.maxAlpha : p.maxAlpha * Math.sin((elapsed / p.duration) * Math.PI);
        ctx.fillStyle = rgba(p.color, alpha);
        ctx.fillRect(p.x + 1, p.y + 1, CELL - 1, CELL - 1);
        if (state === "PLAY_BUTTON") {
          const pulse = Math.sin(now * 0.004 + p.x) * 0.15 + 0.55;
          ctx.strokeStyle = rgba(BONE, pulse);
          ctx.lineWidth = 1;
          ctx.strokeRect(p.x + 0.5, p.y + 0.5, CELL - 1, CELL - 1);
        }
        return true;
      });
    };

    const fontSize = () => Math.round(Math.max(15, Math.min(24, width / 55)));
    const floorLimit = () => {
      const vv = window.visualViewport;
      const visible = Math.min(height, vv ? vv.height : height);
      return visible - 8;
    };

    const drawWord = (w: GameState["words"][number], fs: number, locked: boolean, typed: number, now: number) => {
      const bug = w.kind === "bug";
      const base = bug ? RED : BONE;
      const hi = bug ? BONE : RED;
      const tw = ctx.measureText(w.text).width;
      const padX = fs * 0.7;
      const boxW = tw + padX * 2;
      const boxH = fs * 2;
      const nearFloor = w.y > floorLimit() - boxH * 4;

      ctx.save();
      if (locked) { ctx.shadowColor = rgba(RED, 0.9); ctx.shadowBlur = 16; }
      ctx.fillStyle = "rgba(0, 0, 0, 0.88)";
      ctx.fillRect(w.x, w.y, boxW, boxH);
      const pulse = nearFloor ? 0.55 + 0.4 * Math.sin(now * 0.012) : 0;
      ctx.strokeStyle = locked ? rgba(RED, 1) : rgba(base, bug ? 0.55 : 0.3 + pulse * 0.3);
      ctx.lineWidth = locked ? 2 : 1;
      ctx.strokeRect(w.x + 0.5, w.y + 0.5, boxW - 1, boxH - 1);
      ctx.restore();

      // corner tick, a small brutalist detail
      ctx.fillStyle = rgba(bug ? RED : BONE, 0.9);
      ctx.fillRect(w.x, w.y, 3, boxH);

      ctx.textBaseline = "middle";
      const head = w.text.slice(0, locked ? typed : 0);
      const tail = w.text.slice(head.length);
      ctx.fillStyle = rgba(hi, 1);
      ctx.fillText(head, w.x + padX, w.y + boxH / 2 + 1);
      ctx.fillStyle = rgba(base, 1);
      ctx.fillText(tail, w.x + padX + ctx.measureText(head).width, w.y + boxH / 2 + 1);
    };

    const drawHud = (fs: number) => {
      ctx.textBaseline = "top";
      ctx.font = `700 ${fs}px ${MONO}`;
      ctx.textAlign = "center";
      ctx.fillStyle = rgba(BONE, 0.9);
      ctx.fillText(`SCORE ${String(game.score).padStart(4, "0")}`, width / 2, 20);
      const level = levelFor(game.killed);
      ctx.fillStyle = rgba(BONE, 0.45);
      ctx.font = `700 ${Math.round(fs * 0.7)}px ${MONO}`;
      ctx.fillText(`LV ${level}${game.combo >= 3 ? `   COMBO ${game.combo}` : ""}`, width / 2, 20 + fs * 1.5);
      ctx.textAlign = "left";

      // lives, drawn as blocks at the top right
      const size = Math.round(fs * 0.8);
      for (let i = 0; i < START_LIVES; i++) {
        const x = width - 20 - (START_LIVES - i) * (size + 6);
        if (i < game.lives) {
          ctx.fillStyle = rgba(RED, 0.95);
          ctx.fillRect(x, 22, size, size);
        } else {
          ctx.strokeStyle = rgba(RED, 0.45);
          ctx.lineWidth = 1;
          ctx.strokeRect(x + 0.5, 22.5, size - 1, size - 1);
        }
      }

      if (playTime < 5) {
        ctx.textAlign = "center";
        ctx.fillStyle = rgba(BONE, Math.max(0, Math.min(1, (5 - playTime) / 1.5)) * 0.6);
        ctx.font = `700 ${Math.round(fs * 0.75)}px ${MONO}`;
        ctx.fillText("TYPE TO KILL   ·   BACKSPACE TO RESET   ·   ESC TO EXIT", width / 2, floorLimit() - fs * 3);
        ctx.textAlign = "left";
      }
    };

    const drawGame = (now: number, dt: number, state: Phase) => {
      const fs = fontSize();
      const floorY = floorLimit();
      dim += ((state === "GAME_OVER" ? 0.9 : 0.8) - dim) * Math.min(1, dt * 6);

      ctx.save();
      if (shake > 0 && !reduceMotion) ctx.translate((Math.random() - 0.5) * 10 * shake * 4, (Math.random() - 0.5) * 6 * shake * 4);

      ctx.fillStyle = `rgba(0, 0, 0, ${dim})`;
      ctx.fillRect(-20, -20, width + 40, height + 40);

      // the floor: where words hurt
      const grad = ctx.createLinearGradient(0, floorY - 40, 0, floorY);
      grad.addColorStop(0, "rgba(217, 17, 17, 0)");
      grad.addColorStop(1, "rgba(217, 17, 17, 0.22)");
      ctx.fillStyle = grad;
      ctx.fillRect(0, floorY - 40, width, 40);
      ctx.fillStyle = rgba(RED, 0.85);
      ctx.fillRect(0, floorY, width, 2);

      ctx.font = `700 ${fs}px ${MONO}`;
      ctx.textAlign = "left";

      if (state === "PLAYING") {
        playTime += dt;
        const level = levelFor(game.killed);
        spawnTimer += dt;
        if (spawnTimer >= spawnInterval(level) && game.words.length < maxWords(level)) {
          spawnTimer = 0;
          const pick = pickWord(game.words);
          const boxW = ctx.measureText(pick.text).width + fs * 1.4;
          const room = Math.max(0, width - boxW - 24);
          game.words.push({
            id: game.nextId++, text: pick.text, kind: pick.kind,
            x: 12 + Math.random() * room, y: -fs * 2,
          });
        }

        const leaked = advance(game, dt, fallSpeed(level) * (height / 800), floorY - fs * 2);
        if (leaked > 0) {
          shake = 0.25;
          flash = 0.6;
          if (game.lives <= 0) endGame();
        }
      }

      for (const w of game.words) drawWord(w, fs, w.id === game.lockedId, game.typed, now);

      sparks = sparks.filter((s) => {
        s.life += dt;
        if (s.life >= s.max) return false;
        s.x += s.vx * dt;
        s.y += s.vy * dt;
        s.vy += 320 * dt;
        ctx.fillStyle = rgba(s.color, 1 - s.life / s.max);
        ctx.fillRect(s.x, s.y, 5, 5);
        return true;
      });

      drawHud(fs);

      if (state === "GAME_OVER") {
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillStyle = rgba(RED, 1);
        ctx.font = `900 ${fs * 3}px ${MONO}`;
        ctx.fillText("GAME OVER", width / 2, height / 2 - fs * 3);
        ctx.fillStyle = rgba(BONE, 1);
        ctx.font = `700 ${fs * 1.6}px ${MONO}`;
        ctx.fillText(`SCORE ${game.score}`, width / 2, height / 2);
        ctx.fillStyle = rgba(newBest ? RED : BONE, newBest ? 1 : 0.55);
        ctx.font = `700 ${fs}px ${MONO}`;
        ctx.fillText(newBest ? "NEW BEST!" : `BEST ${best}`, width / 2, height / 2 + fs * 2);
        ctx.fillStyle = rgba(BONE, 0.5 + 0.3 * Math.sin(now * 0.005));
        ctx.font = `700 ${Math.round(fs * 0.75)}px ${MONO}`;
        ctx.fillText("CLICK OR TAP TO RETRY   ·   ESC TO EXIT", width / 2, height / 2 + fs * 4);
        ctx.textAlign = "left";
      }

      ctx.restore();

      shake = Math.max(0, shake - dt);
      if (flash > 0) {
        ctx.fillStyle = `rgba(217, 17, 17, ${flash * 0.25})`;
        ctx.fillRect(0, 0, width, height);
        flash = Math.max(0, flash - dt * 2.5);
      }
    };

    // ---------- loop ----------
    const render = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      const state = phaseRef.current;
      ctx.clearRect(0, 0, width, height);

      // Scrolled away from the hero: stop drawing until we're back
      const inGame = state === "PLAYING" || state === "GAME_OVER";
      if (!inGame && !nearTop(0.6)) {
        if (state === "PLAY_BUTTON") { particles = []; setPhase("AMBIENT"); }
        running = false;
        return;
      }

      if (inGame) {
        drawGame(now, dt, state);
      } else {
        if (holding && state === "AMBIENT") {
          const progress = Math.min(1, (now - holdStart) / HOLD_MS);
          if (progress >= 1) {
            holding = false;
            toPlayButton();
          } else {
            // The grid wakes up while you hold, so there's a hint something is happening
            const gap = 140 - 110 * progress;
            if (now - lastSpawn > gap && particles.length < 90) { spawnAmbient(now); lastSpawn = now; }
          }
        } else if (state === "AMBIENT" && !reduceMotion) {
          if (now - lastSpawn > 140 && particles.length < 32 && Math.random() < 0.8) { spawnAmbient(now); lastSpawn = now; }
        }
        if (state === "PLAY_BUTTON" && now - playButtonSince > 12000) {
          particles = [];
          setPhase("AMBIENT");
        }
        drawAmbient(now, phaseRef.current);
      }

      raf = requestAnimationFrame(render);
    };

    function start() {
      if (running) return;
      running = true;
      last = performance.now();
      raf = requestAnimationFrame(render);
    }
    start();

    // ---------- input ----------
    const isInteractive = (t: EventTarget | null) =>
      t instanceof Element && !!t.closest('a, button, input, textarea, select, label, [role="button"]');

    const onPointerDown = (e: PointerEvent) => {
      const state = phaseRef.current;
      if (state === "PLAYING" || state === "GAME_OVER") return;
      if (e.pointerType === "mouse" && e.button !== 0) return;

      if (state === "PLAY_BUTTON") {
        if (insidePlayButton(e.clientX, e.clientY)) {
          e.preventDefault(); // otherwise the mousedown that follows steals focus from the input
          startGame();
        }
        return;
      }
      if (!nearTop(0.4) || isInteractive(e.target)) return;
      holding = true;
      holdStart = performance.now();
    };
    const onPointerUp = () => { holding = false; };

    const onCanvasDown = (e: PointerEvent) => {
      e.preventDefault();
      if (phaseRef.current === "GAME_OVER") startGame();
      else input.focus({ preventScroll: true });
    };

    const onInput = () => {
      const v = input.value;
      input.value = "";
      type(v);
    };

    const onInputKey = (e: KeyboardEvent) => {
      e.stopPropagation(); // keep the Navbar's 1-4 shortcuts out of it
      if (e.key === "Escape") { e.preventDefault(); exitGame(); }
      else if (e.key === "Backspace") { e.preventDefault(); releaseLock(game); }
      else if (e.key === " " || e.key === "Enter") e.preventDefault();
    };

    const onWindowKey = (e: KeyboardEvent) => {
      const state = phaseRef.current;
      if (e.key === "Escape" && state !== "AMBIENT") { exitGame(); return; }
      // Focus can slip away (a click elsewhere); keep the game playable from the keyboard
      if (state === "PLAYING" && document.activeElement !== input && !e.ctrlKey && !e.metaKey && !e.altKey) {
        if (e.key === "Backspace") { e.preventDefault(); releaseLock(game); }
        else if (e.key.length === 1) { e.preventDefault(); e.stopPropagation(); type(e.key); }
      }
    };

    const onScroll = () => {
      if (!running && nearTop(0.6)) start();
      if (phaseRef.current === "PLAY_BUTTON" && !nearTop(0.6)) { particles = []; setPhase("AMBIENT"); }
    };

    const onResize = () => resize();

    window.addEventListener("pointerdown", onPointerDown);
    window.addEventListener("pointerup", onPointerUp);
    window.addEventListener("pointercancel", onPointerUp);
    window.addEventListener("keydown", onWindowKey, true);
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize);
    canvas.addEventListener("pointerdown", onCanvasDown);
    input.addEventListener("input", onInput);
    input.addEventListener("keydown", onInputKey);

    return () => {
      cancelAnimationFrame(raf);
      running = false;
      unlockScroll();
      window.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener("pointerup", onPointerUp);
      window.removeEventListener("pointercancel", onPointerUp);
      window.removeEventListener("keydown", onWindowKey, true);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
      canvas.removeEventListener("pointerdown", onCanvasDown);
      input.removeEventListener("input", onInput);
      input.removeEventListener("keydown", onInputKey);
    };
  }, []);

  const playing = phase === "PLAYING" || phase === "GAME_OVER";
  // The play button sits above the hero text so it isn't hidden behind the big title
  const canvasClass = playing
    ? "absolute inset-0 z-[60] cursor-crosshair touch-none"
    : phase === "PLAY_BUTTON"
      ? "absolute inset-0 z-[45] pointer-events-none"
      : "absolute inset-0 z-0 pointer-events-none";

  return (
    <>
      <canvas
        ref={canvasRef}
        aria-hidden="true"
        className={canvasClass}
      />
      {/* Real text field so phones show a keyboard; kept invisible */}
      <input
        ref={inputRef}
        aria-hidden="true"
        tabIndex={-1}
        autoCapitalize="off"
        autoCorrect="off"
        autoComplete="off"
        spellCheck={false}
        className="absolute left-0 top-0 z-[61] h-px w-px opacity-0"
        style={{ fontSize: 16 }}
      />
    </>
  );
}
