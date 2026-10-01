// Where the V3 portfolio lives, and how long the navbar logo shows each face.
export const V3_URL = "https://portfolio-harshal-patel.vercel.app/";

export type LogoPhase = "idle" | "logo" | "v3";

// The V3 face stays up longer than the normal logo so it's hard to miss
export const V3_PHASE_MS: [number, number] = [30_000, 40_000];
export const LOGO_PHASE_MS: [number, number] = [10_000, 25_000];

/** How long to stay in `phase` before flipping. `rand` is injectable for tests. */
export function phaseDuration(phase: "logo" | "v3", rand: () => number = Math.random): number {
  const [min, max] = phase === "v3" ? V3_PHASE_MS : LOGO_PHASE_MS;
  return Math.round(min + rand() * (max - min));
}

export const nextPhase = (phase: "logo" | "v3"): "logo" | "v3" => (phase === "v3" ? "logo" : "v3");

// Intro timeline for the tesseract that flies out of the logo
export const INTRO_MS = { fly: 950, hold: 1900, back: 800 } as const;
export const EXIT_MS = 750;
