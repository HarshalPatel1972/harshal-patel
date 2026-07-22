"use client";

import React, { useEffect, useRef, useState } from "react";

// 4 Brand Colors: TS Blue (#3178C6), Wasm Purple (#654FF0), Emerald Green (#10B981), Critical Red (#D91111)
const COLORS = [
  { r: 49, g: 120, b: 198 },  // #3178C6 (Blue)
  { r: 101, g: 79, b: 240 }, // #654FF0 (Purple)
  { r: 16, g: 185, b: 129 },  // #10B981 (Green)
  { r: 217, g: 17, b: 17 },   // #D91111 (Red)
];

const CELL_SIZE = 40;
const ARENA_RADIUS = 7; // 15x15 arena (-7 to +7)

type GameState = "AMBIENT" | "CHARGING" | "PLAY_BUTTON" | "TRANSITION_GAME" | "SNAKE_GAME";
type Direction = "UP" | "DOWN" | "LEFT" | "RIGHT";

interface Particle {
  x: number;
  y: number;
  targetX: number;
  targetY: number;
  color: { r: number; g: number; b: number };
  startTime: number;
  duration: number;
  maxAlpha: number;
  pinned?: boolean;
}

interface GridCell {
  col: number;
  row: number;
}

export function GridIlluminator() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [gameState, setGameState] = useState<GameState>("AMBIENT");
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);

  const gameStateRef = useRef<GameState>("AMBIENT");
  useEffect(() => {
    gameStateRef.current = gameState;
  }, [gameState]);

  // Snake Game State Refs (avoiding re-render latency)
  const snakeRef = useRef<GridCell[]>([
    { col: 0, row: 0 },
    { col: -1, row: 0 },
    { col: -2, row: 0 },
  ]);
  const dirRef = useRef<Direction>("RIGHT");
  const nextDirRef = useRef<Direction>("RIGHT");
  const foodRef = useRef<GridCell>({ col: 3, row: 0 });
  const scoreRef = useRef(0);
  const lastStepTimeRef = useRef(0);
  const gameOverRef = useRef(false);

  // Mouse Hold Tracker
  const isMouseDownRef = useRef(false);
  const holdStartRef = useRef(0);
  const mousePosRef = useRef({ x: 0, y: 0 });
  const chargeProgressRef = useRef(0); // 0 to 1

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    let width = 0;
    let height = 0;

    let activeParticles: Particle[] = [];

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
      ctx.scale(dpr, dpr);
    };

    resize();
    window.addEventListener("resize", resize);

    const getCols = () => Math.ceil(width / CELL_SIZE);
    const getRows = () => Math.ceil(height / CELL_SIZE);

    const getCenterCell = () => ({
      midCol: Math.floor(getCols() / 2),
      midRow: Math.floor(getRows() / 2),
    });

    // Play button cell pattern relative to center
    const PLAY_PATTERN = [
      { dc: -1, dr: -2 }, { dc: -1, dr: -1 }, { dc: -1, dr: 0 }, { dc: -1, dr: 1 }, { dc: -1, dr: 2 },
      { dc: 0, dr: -1 },  { dc: 0, dr: 0 },   { dc: 0, dr: 1 },
      { dc: 1, dr: 0 },
    ];

    // Arena wall perimeter cells relative to center
    const getWallPattern = (): GridCell[] => {
      const walls: GridCell[] = [];
      for (let dc = -ARENA_RADIUS; dc <= ARENA_RADIUS; dc++) {
        for (let dr = -ARENA_RADIUS; dr <= ARENA_RADIUS; dr++) {
          if (Math.abs(dc) === ARENA_RADIUS || Math.abs(dr) === ARENA_RADIUS) {
            walls.push({ col: dc, row: dr });
          }
        }
      }
      return walls;
    };

    const spawnAmbientParticle = (now: number) => {
      const maxCols = getCols();
      const maxRows = getRows();
      if (maxCols <= 0 || maxRows <= 0) return;

      const col = Math.floor(Math.random() * maxCols);
      const row = Math.floor(Math.random() * maxRows);

      const color = COLORS[Math.floor(Math.random() * COLORS.length)];
      const duration = 2500 + Math.random() * 2500;

      const x = col * CELL_SIZE;
      const y = row * CELL_SIZE;

      activeParticles.push({
        x,
        y,
        targetX: x,
        targetY: y,
        color,
        startTime: now,
        duration,
        maxAlpha: 0.10,
      });
    };

    const spawnFood = () => {
      const snake = snakeRef.current;
      let newCol = 0;
      let newRow = 0;
      let valid = false;
      let attempts = 0;

      while (!valid && attempts < 100) {
        newCol = Math.floor(Math.random() * (ARENA_RADIUS * 2 - 1)) - (ARENA_RADIUS - 1);
        newRow = Math.floor(Math.random() * (ARENA_RADIUS * 2 - 1)) - (ARENA_RADIUS - 1);
        valid = !snake.some((s) => s.col === newCol && s.row === newRow);
        attempts++;
      }
      foodRef.current = { col: newCol, row: newRow };
    };

    const startSnakeGame = () => {
      snakeRef.current = [
        { col: 0, row: 0 },
        { col: -1, row: 0 },
        { col: -2, row: 0 },
      ];
      dirRef.current = "RIGHT";
      nextDirRef.current = "RIGHT";
      scoreRef.current = 0;
      setScore(0);
      gameOverRef.current = false;
      setGameOver(false);
      spawnFood();

      // Form arena wall particles
      const { midCol, midRow } = getCenterCell();
      const wallCells = getWallPattern();
      activeParticles = wallCells.map((wc, i) => {
        const x = (midCol + wc.col) * CELL_SIZE;
        const y = (midRow + wc.row) * CELL_SIZE;
        return {
          x,
          y,
          targetX: x,
          targetY: y,
          color: COLORS[i % COLORS.length],
          startTime: performance.now(),
          duration: 99999999,
          maxAlpha: 0.12,
          pinned: true,
        };
      });

      setGameState("SNAKE_GAME");
    };

    const morphParticlesToTargets = (targetCells: { col: number; row: number }[]) => {
      const { midCol, midRow } = getCenterCell();
      const now = performance.now();

      targetCells.forEach((tc, i) => {
        const tx = (midCol + tc.col) * CELL_SIZE;
        const ty = (midRow + tc.row) * CELL_SIZE;

        if (i < activeParticles.length) {
          activeParticles[i].targetX = tx;
          activeParticles[i].targetY = ty;
          activeParticles[i].pinned = true;
          activeParticles[i].maxAlpha = 0.15;
          activeParticles[i].duration = 99999999;
        } else {
          activeParticles.push({
            x: tx,
            y: ty,
            targetX: tx,
            targetY: ty,
            color: COLORS[i % COLORS.length],
            startTime: now,
            duration: 99999999,
            maxAlpha: 0.15,
            pinned: true,
          });
        }
      });

      // Trim extra unneeded particles
      if (activeParticles.length > targetCells.length) {
        activeParticles = activeParticles.slice(0, targetCells.length);
      }
    };

    let lastSpawnTime = 0;

    // MAIN RENDER LOOP
    const render = (now: number) => {
      ctx.clearRect(0, 0, width, height);

      const state = gameStateRef.current;

      // Handle Charging Hold State
      if (isMouseDownRef.current && state === "AMBIENT") {
        const elapsed = now - holdStartRef.current;
        chargeProgressRef.current = Math.min(1, elapsed / 800);

        if (chargeProgressRef.current >= 1) {
          setGameState("PLAY_BUTTON");
          morphParticlesToTargets(PLAY_PATTERN.map((p) => ({ col: p.dc, row: p.dr })));
        }
      }

      // --- AMBIENT MODE ---
      if (state === "AMBIENT") {
        if (now - lastSpawnTime > 140 && activeParticles.length < 32) {
          if (Math.random() < 0.8) {
            spawnAmbientParticle(now);
            lastSpawnTime = now;
          }
        }
      }

      // --- PARTICLE PHYSICS & DRAWING ---
      activeParticles = activeParticles.filter((p) => {
        const elapsed = now - p.startTime;
        if (!p.pinned && elapsed >= p.duration) return false;

        // Smooth position interpolation (LERP)
        p.x += (p.targetX - p.x) * 0.12;
        p.y += (p.targetY - p.y) * 0.12;

        let alpha = p.maxAlpha;
        if (!p.pinned) {
          const progress = elapsed / p.duration;
          alpha = p.maxAlpha * Math.sin(progress * Math.PI);
        }

        // Draw flat cell background
        ctx.fillStyle = `rgba(${p.color.r}, ${p.color.g}, ${p.color.b}, ${alpha})`;
        ctx.fillRect(p.x + 1, p.y + 1, CELL_SIZE - 1, CELL_SIZE - 1);

        // Gentle pulse border for play button & walls
        if (state === "PLAY_BUTTON" || state === "SNAKE_GAME") {
          const pulse = Math.sin(now * 0.003 + p.x) * 0.05 + 0.10;
          ctx.strokeStyle = `rgba(${p.color.r}, ${p.color.g}, ${p.color.b}, ${pulse})`;
          ctx.lineWidth = 1;
          ctx.strokeRect(p.x + 0.5, p.y + 0.5, CELL_SIZE - 1, CELL_SIZE - 1);
        }

        return true;
      });

      // --- DRAW CHARGING CURSOR INDICATOR ---
      if (isMouseDownRef.current && chargeProgressRef.current > 0 && state === "AMBIENT") {
        const { x: mx, y: my } = mousePosRef.current;
        const colorIdx = Math.floor(now / 150) % COLORS.length;
        const col = COLORS[colorIdx];

        ctx.save();
        ctx.beginPath();
        ctx.arc(mx, my, 28, -Math.PI / 2, -Math.PI / 2 + chargeProgressRef.current * Math.PI * 2);
        ctx.strokeStyle = `rgba(${col.r}, ${col.g}, ${col.b}, 0.8)`;
        ctx.lineWidth = 3;
        ctx.stroke();
        ctx.restore();
      }

      // --- PLAY BUTTON OVERLAY TEXT & HOVER ---
      if (state === "PLAY_BUTTON") {
        const { midCol, midRow } = getCenterCell();
        const px = midCol * CELL_SIZE + CELL_SIZE / 2;
        const py = (midRow + 3.5) * CELL_SIZE;

        ctx.save();
        ctx.font = "bold 11px var(--font-jetbrains-mono), monospace";
        ctx.textAlign = "center";
        ctx.fillStyle = "rgba(255, 255, 255, 0.7)";
        ctx.fillText("▶ CLICK TO PLAY SNAKE [ESC TO EXIT]", px, py);
        ctx.restore();
      }

      // --- SNAKE GAME ENGINE & DRAWING ---
      if (state === "SNAKE_GAME") {
        const { midCol, midRow } = getCenterCell();

        // Game Update Step (Every 130ms)
        if (!gameOverRef.current && now - lastStepTimeRef.current > 130) {
          lastStepTimeRef.current = now;
          dirRef.current = nextDirRef.current;

          const head = { ...snakeRef.current[0] };
          if (dirRef.current === "UP") head.row -= 1;
          if (dirRef.current === "DOWN") head.row += 1;
          if (dirRef.current === "LEFT") head.col -= 1;
          if (dirRef.current === "RIGHT") head.col += 1;

          // Wall collision check
          if (Math.abs(head.col) >= ARENA_RADIUS || Math.abs(head.row) >= ARENA_RADIUS) {
            gameOverRef.current = true;
            setGameOver(true);
          }

          // Self collision check
          if (snakeRef.current.some((s) => s.col === head.col && s.row === head.row)) {
            gameOverRef.current = true;
            setGameOver(true);
          }

          if (!gameOverRef.current) {
            snakeRef.current.unshift(head);

            // Food collision check
            if (head.col === foodRef.current.col && head.row === foodRef.current.row) {
              scoreRef.current += 10;
              setScore(scoreRef.current);
              setHighScore((prev) => Math.max(prev, scoreRef.current + 10));
              spawnFood();
            } else {
              snakeRef.current.pop();
            }
          }
        }

        // --- DRAW FOOD ---
        // Centered 50% area square (20px in 40px cell)
        const foodCell = foodRef.current;
        const fx = (midCol + foodCell.col) * CELL_SIZE + 10;
        const fy = (midRow + foodCell.row) * CELL_SIZE + 10;

        ctx.save();
        const pulse = Math.sin(now * 0.008) * 0.15 + 0.40;
        ctx.fillStyle = `rgba(217, 17, 17, ${pulse})`; // Red Food
        ctx.fillRect(fx, fy, 20, 20);
        ctx.strokeStyle = `rgba(255, 255, 255, 0.6)`;
        ctx.lineWidth = 1;
        ctx.strokeRect(fx, fy, 20, 20);
        ctx.restore();

        // --- DRAW SNAKE ---
        // 50% area taken out of total size of square (20px width in 40px cell, centered with 10px offset)
        const snake = snakeRef.current;
        snake.forEach((seg, i) => {
          const sx = (midCol + seg.col) * CELL_SIZE + 10;
          const sy = (midRow + seg.row) * CELL_SIZE + 10;

          ctx.save();
          // Head vs Body opacity and color
          if (i === 0) {
            ctx.fillStyle = "rgba(16, 185, 129, 0.35)"; // Emerald Green head slightly brighter
          } else {
            ctx.fillStyle = "rgba(16, 185, 129, 0.20)"; // Exact 20% opacity as requested
          }
          ctx.fillRect(sx, sy, 20, 20);

          ctx.strokeStyle = "rgba(16, 185, 129, 0.40)";
          ctx.lineWidth = 1;
          ctx.strokeRect(sx, sy, 20, 20);
          ctx.restore();
        });

        // --- GAME OVER HUD ---
        if (gameOverRef.current) {
          const px = midCol * CELL_SIZE;
          const py = midRow * CELL_SIZE;
          ctx.save();
          ctx.font = "bold 14px var(--font-jetbrains-mono), monospace";
          ctx.textAlign = "center";
          ctx.fillStyle = "rgba(217, 17, 17, 0.9)";
          ctx.fillText("GAME OVER", px, py - 10);
          ctx.font = "10px var(--font-jetbrains-mono), monospace";
          ctx.fillStyle = "rgba(255, 255, 255, 0.8)";
          ctx.fillText("CLICK TO RETRY | PRESS ESC TO EXIT", px, py + 14);
          ctx.restore();
        }
      }

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);

    // --- EVENT LISTENERS ---
    const handleMouseDown = (e: MouseEvent) => {
      isMouseDownRef.current = true;
      holdStartRef.current = performance.now();
      mousePosRef.current = { x: e.clientX, y: e.clientY };

      const state = gameStateRef.current;

      // Click on Play Button to start game
      if (state === "PLAY_BUTTON") {
        const { midCol, midRow } = getCenterCell();
        const col = Math.floor(e.clientX / CELL_SIZE);
        const row = Math.floor(e.clientY / CELL_SIZE);

        const dCol = col - midCol;
        const dRow = row - midRow;

        // Play button area click check
        if (Math.abs(dCol) <= 2 && Math.abs(dRow) <= 3) {
          startSnakeGame();
        }
      } else if (state === "SNAKE_GAME" && gameOverRef.current) {
        startSnakeGame();
      }
    };

    const handleMouseUp = () => {
      isMouseDownRef.current = false;
      chargeProgressRef.current = 0;
    };

    const handleMouseMove = (e: MouseEvent) => {
      mousePosRef.current = { x: e.clientX, y: e.clientY };
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      const state = gameStateRef.current;

      if (e.key === "Escape") {
        setGameState("AMBIENT");
        activeParticles = [];
        return;
      }

      if (state === "SNAKE_GAME") {
        const curDir = dirRef.current;
        if ((e.key === "ArrowUp" || e.key === "w" || e.key === "W") && curDir !== "DOWN") {
          nextDirRef.current = "UP";
          e.preventDefault();
        } else if ((e.key === "ArrowDown" || e.key === "s" || e.key === "S") && curDir !== "UP") {
          nextDirRef.current = "DOWN";
          e.preventDefault();
        } else if ((e.key === "ArrowLeft" || e.key === "a" || e.key === "A") && curDir !== "RIGHT") {
          nextDirRef.current = "LEFT";
          e.preventDefault();
        } else if ((e.key === "ArrowRight" || e.key === "d" || e.key === "D") && curDir !== "LEFT") {
          nextDirRef.current = "RIGHT";
          e.preventDefault();
        }
      }
    };

    window.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("mouseup", handleMouseUp);
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mouseup", handleMouseUp);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("keydown", handleKeyDown);
      cancelAnimationFrame(animId);
    };
  }, []);

  return (
    <>
      <canvas
        ref={canvasRef}
        className={`absolute inset-0 z-0 ${
          gameState === "PLAY_BUTTON" ? "cursor-pointer pointer-events-auto" : "pointer-events-auto"
        }`}
        aria-hidden="true"
      />

      {/* SNAKE GAME HUD */}
      {gameState === "SNAKE_GAME" && (
        <div className="absolute top-6 left-1/2 -translate-x-1/2 z-20 flex items-center gap-6 px-4 py-2 bg-[var(--sumi-ink)]/90 border border-[var(--forge-orange)] text-white font-mono text-xs rounded-sm shadow-lg pointer-events-auto select-none">
          <span className="font-bold text-[var(--forge-orange)]">SNAKE ARENA</span>
          <span>SCORE: {score}</span>
          <span className="opacity-60">HIGH: {highScore}</span>
          <button
            onClick={() => setGameState("AMBIENT")}
            className="px-2 py-0.5 bg-red-600/80 hover:bg-red-600 text-white rounded text-[10px] uppercase font-bold tracking-wider cursor-pointer"
          >
            EXIT [ESC]
          </button>
        </div>
      )}
    </>
  );
}
