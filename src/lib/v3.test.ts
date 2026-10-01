import { describe, expect, it } from "vitest";
import { EDGES, FACES, VERTS, project, rotate4 } from "./tesseract";
import { INTRO_MS, LOGO_PHASE_MS, V3_PHASE_MS, nextPhase, phaseDuration } from "./v3";

describe("tesseract", () => {
  it("has 16 vertices and 32 edges, each joining vertices one step apart", () => {
    expect(VERTS).toHaveLength(16);
    expect(EDGES).toHaveLength(32);
    for (const [i, j] of EDGES) {
      const diff = VERTS[i].filter((c, k) => c !== VERTS[j][k]).length;
      expect(diff).toBe(1);
    }
  });

  it("has 24 square faces whose sides are all real edges", () => {
    expect(FACES).toHaveLength(24);
    const has = (a: number, b: number) => EDGES.some(([i, j]) => (i === a && j === b) || (i === b && j === a));
    for (const f of FACES) {
      expect(new Set(f).size).toBe(4);
      for (let k = 0; k < 4; k++) expect(has(f[k], f[(k + 1) % 4])).toBe(true);
    }
  });

  it("keeps vertices on the same 4D sphere while rotating", () => {
    for (const t of [0, 1.3, 7.9]) {
      for (const v of VERTS) {
        const r = rotate4(v, t);
        expect(Math.hypot(...r)).toBeCloseTo(2, 6);
      }
    }
  });

  it("projects to finite points", () => {
    for (const p of project(3.2)) {
      expect(Number.isFinite(p.x) && Number.isFinite(p.y)).toBe(true);
      expect(p.depth).toBeGreaterThanOrEqual(0);
      expect(p.depth).toBeLessThanOrEqual(1);
    }
  });
});

describe("logo phases", () => {
  it("alternates v3 and logo", () => {
    expect(nextPhase("v3")).toBe("logo");
    expect(nextPhase("logo")).toBe("v3");
  });

  it("keeps each phase inside its window", () => {
    expect(phaseDuration("v3", () => 0)).toBe(V3_PHASE_MS[0]);
    expect(phaseDuration("v3", () => 1)).toBe(V3_PHASE_MS[1]);
    expect(phaseDuration("logo", () => 0)).toBe(LOGO_PHASE_MS[0]);
    expect(phaseDuration("logo", () => 1)).toBe(LOGO_PHASE_MS[1]);
  });

  it("leaves the intro card up for 5-7 seconds", () => {
    expect(INTRO_MS.hold).toBeGreaterThanOrEqual(5000);
    expect(INTRO_MS.hold).toBeLessThanOrEqual(7000);
  });

  it("shows V3 for longer than the plain logo", () => {
    expect(V3_PHASE_MS[0]).toBeGreaterThan(LOGO_PHASE_MS[1]);
  });
});
