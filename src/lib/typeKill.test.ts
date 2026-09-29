import { describe, expect, it } from "vitest";
import {
  advance, BUG_WORDS, newGame, pickWord, pressKey, releaseLock, STACK_WORDS, START_LIVES,
  type FallingWord, type GameState,
} from "./typeKill";

const word = (id: number, text: string, y = 0, kind: "stack" | "bug" = "stack"): FallingWord => ({ id, text, kind, x: 0, y });
const withWords = (...w: FallingWord[]): GameState => ({ ...newGame(), words: w, nextId: 100 });
const type = (s: GameState, text: string) => text.split("").map((c) => pressKey(s, c));

describe("word list", () => {
  it("is letters only, so it can't trigger the 1-4 nav shortcuts", () => {
    for (const w of [...STACK_WORDS, ...BUG_WORDS]) expect(w).toMatch(/^[A-Z]+$/);
  });
});

describe("pickWord", () => {
  it("avoids first letters that are already on screen", () => {
    const onScreen = [word(1, "GO"), word(2, "RUST"), word(3, "NULL")];
    for (let i = 0; i < 200; i++) {
      const w = pickWord(onScreen);
      expect(["G", "R", "N"]).not.toContain(w.text[0]);
    }
  });
  it("still returns something when every letter is taken", () => {
    const all = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("").map((c, i) => word(i, c + "X"));
    expect(pickWord(all).text.length).toBeGreaterThan(0);
  });
});

describe("pressKey", () => {
  it("kills a word typed correctly, case-insensitively, and scores by length", () => {
    const s = withWords(word(1, "RUST"));
    const r = type(s, "rust");
    expect(r.slice(0, 3).every((x) => x.type === "hit")).toBe(true);
    expect(r[3]).toMatchObject({ type: "kill", points: 4 });
    expect(s.words).toHaveLength(0);
    expect(s.score).toBe(4);
    expect(s.lockedId).toBeNull();
  });

  it("locks onto the lowest matching word", () => {
    const s = withWords(word(1, "GO", 50), word(2, "GOLANG", 300));
    pressKey(s, "g");
    expect(s.lockedId).toBe(2);
  });

  it("counts a wrong letter as a miss and resets the combo", () => {
    const s = withWords(word(1, "REACT"));
    s.combo = 4;
    pressKey(s, "r");
    expect(pressKey(s, "x").type).toBe("miss");
    expect(s.combo).toBe(0);
    expect(s.typed).toBe(1); // progress kept
  });

  it("misses when nothing starts with that letter", () => {
    const s = withWords(word(1, "GO"));
    expect(pressKey(s, "z").type).toBe("miss");
    expect(s.lockedId).toBeNull();
  });

  it("doubles bug words and grows the multiplier every 5 kills in a row", () => {
    const s = withWords(word(1, "LAG", 0, "bug"));
    expect(type(s, "lag")[2]).toMatchObject({ type: "kill", points: 6 });
    s.combo = 4; // the next kill is the 5th
    s.words = [word(2, "GO")];
    expect(type(s, "go")[1]).toMatchObject({ type: "kill", points: 4 }); // 2 letters x2
  });

  it("ignores digits, punctuation and multi-character input", () => {
    const s = withWords(word(1, "GO"));
    expect(pressKey(s, "3").type).toBe("none");
    expect(pressKey(s, "Enter").type).toBe("none");
    expect(s.combo).toBe(0);
  });

  it("releaseLock lets you start a different word", () => {
    const s = withWords(word(1, "GO"), word(2, "RUST"));
    pressKey(s, "g");
    releaseLock(s);
    pressKey(s, "r");
    expect(s.lockedId).toBe(2);
  });
});

describe("advance", () => {
  it("moves words down by speed x dt", () => {
    const s = withWords(word(1, "GO", 10));
    expect(advance(s, 0.5, 100, 1000)).toBe(0);
    expect(s.words[0].y).toBe(60);
  });

  it("removes words at the floor, costs a life each, and breaks the combo", () => {
    const s = withWords(word(1, "GO", 995), word(2, "RUST", 0));
    s.combo = 7;
    expect(advance(s, 0.1, 100, 1000)).toBe(1);
    expect(s.lives).toBe(START_LIVES - 1);
    expect(s.combo).toBe(0);
    expect(s.words.map((w) => w.id)).toEqual([2]);
  });

  it("drops the lock when the locked word leaks", () => {
    const s = withWords(word(1, "GO", 995));
    pressKey(s, "g");
    advance(s, 0.1, 100, 1000);
    expect(s.lockedId).toBeNull();
    expect(s.typed).toBe(0);
  });

  it("never takes lives below zero", () => {
    const s = withWords(word(1, "A", 999), word(2, "B", 999));
    s.lives = 1;
    advance(s, 1, 100, 1000);
    expect(s.lives).toBe(0);
  });
});
