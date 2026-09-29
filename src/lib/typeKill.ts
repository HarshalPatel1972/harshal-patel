/**
 * Type-Kill game rules, kept free of canvas and React so they can be tested.
 * Words fall, you type them to kill them, and one that reaches the floor costs a life.
 */

export type WordKind = "stack" | "bug";

export interface FallingWord {
  id: number;
  text: string; // upper case
  kind: WordKind;
  x: number;
  y: number;
}

export interface GameState {
  words: FallingWord[];
  lockedId: number | null; // the word you're currently typing
  typed: number; // letters matched so far on the locked word
  score: number;
  combo: number;
  lives: number;
  killed: number;
  nextId: number;
}

// Letters only: digits would collide with the site's 1-4 navigation shortcuts.
export const STACK_WORDS = [
  "GO", "RUST", "REACT", "NEXT", "TAURI", "WAILS", "WASM", "PYTHON", "DOCKER", "REDIS",
  "SOCKET", "TAILWIND", "SUPABASE", "VERCEL", "GITHUB", "TYPESCRIPT", "WEBASSEMBLY",
  "GOLANG", "LINUX", "NODE", "VITE", "CRYPTO", "MERKLE", "VITEST", "ANIME", "WIN",
];

export const BUG_WORDS = [
  "SEGFAULT", "NULL", "PANIC", "LEAK", "RACE", "DEADLOCK", "TIMEOUT", "OVERFLOW",
  "UNDEFINED", "OOM", "CRASH", "FLAKY", "REGRESSION", "LAG", "STALE", "HANG",
];

export const START_LIVES = 5;

export function newGame(): GameState {
  return { words: [], lockedId: null, typed: 0, score: 0, combo: 0, lives: START_LIVES, killed: 0, nextId: 1 };
}

export const levelFor = (killed: number) => 1 + Math.floor(killed / 8);
/** Pixels per second at a 800px-tall play field; scale by height / 800. */
export const fallSpeed = (level: number) => Math.min(150, 42 + 9 * (level - 1));
export const spawnInterval = (level: number) => Math.max(0.85, 2.4 - 0.18 * (level - 1));
export const maxWords = (level: number) => 4 + Math.min(level, 4);

/**
 * Picks a word whose first letter isn't already on screen, so the first key you
 * press is never ambiguous. Falls back to any word if every letter is taken.
 */
export function pickWord(
  onScreen: readonly FallingWord[],
  rand: () => number = Math.random
): { text: string; kind: WordKind } {
  const taken = new Set(onScreen.map((w) => w.text[0]));
  const pool = [
    ...STACK_WORDS.map((text) => ({ text, kind: "stack" as const })),
    ...BUG_WORDS.map((text) => ({ text, kind: "bug" as const })),
  ];
  const free = pool.filter((w) => !taken.has(w.text[0]) && !onScreen.some((o) => o.text === w.text));
  const from = free.length ? free : pool;
  return from[Math.floor(rand() * from.length)];
}

export type KeyResult =
  | { type: "none" }
  | { type: "hit" } // right letter, word still alive
  | { type: "miss" } // wrong letter
  | { type: "kill"; word: FallingWord; points: number };

/** Handles one typed letter. Mutates the state. */
export function pressKey(s: GameState, raw: string): KeyResult {
  if (raw.length !== 1 || !/[a-z]/i.test(raw)) return { type: "none" };
  const ch = raw.toUpperCase();

  let target = s.lockedId === null ? undefined : s.words.find((w) => w.id === s.lockedId);
  if (!target) {
    // Lock onto the lowest word (closest to the floor) that starts with this letter
    s.lockedId = null;
    s.typed = 0;
    target = s.words
      .filter((w) => w.text[0] === ch)
      .sort((a, b) => b.y - a.y)[0];
    if (!target) {
      s.combo = 0;
      return { type: "miss" };
    }
    s.lockedId = target.id;
  }

  if (target.text[s.typed] !== ch) {
    s.combo = 0;
    return { type: "miss" };
  }

  s.typed += 1;
  if (s.typed < target.text.length) return { type: "hit" };

  s.combo += 1;
  const multiplier = 1 + Math.floor(s.combo / 5);
  const points = target.text.length * multiplier * (target.kind === "bug" ? 2 : 1);
  s.score += points;
  s.killed += 1;
  s.words = s.words.filter((w) => w.id !== target!.id);
  s.lockedId = null;
  s.typed = 0;
  return { type: "kill", word: target, points };
}

/** Backspace: drop the current lock and start over. */
export function releaseLock(s: GameState) {
  s.lockedId = null;
  s.typed = 0;
}

/**
 * Moves every word down and removes the ones that reach the floor.
 * Returns how many got through (each costs a life).
 */
export function advance(s: GameState, dt: number, speed: number, floorY: number): number {
  let leaked = 0;
  for (const w of s.words) w.y += speed * dt;
  const survivors: FallingWord[] = [];
  for (const w of s.words) {
    if (w.y >= floorY) {
      leaked += 1;
      if (w.id === s.lockedId) releaseLock(s);
    } else {
      survivors.push(w);
    }
  }
  s.words = survivors;
  if (leaked > 0) {
    s.lives = Math.max(0, s.lives - leaked);
    s.combo = 0;
  }
  return leaked;
}
