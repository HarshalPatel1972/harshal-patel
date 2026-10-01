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
// `hold` is how long the info card stays readable, on purpose generous
export const INTRO_MS = { fly: 1100, hold: 6000, back: 900 } as const;
export const EXIT_MS = 750;

// Spin of the tesseract: a quick burst at launch that dies away, then a very slow drift so the
// info card can be read without the cube pulling the eye. Angle is in radians of the base rotation.
export const SPIN = { idle: 0.2, burst: 4, tauMs: 330 } as const;
export const spinAngle = (ms: number) => (ms / 1000) * SPIN.idle + SPIN.burst * (1 - Math.exp(-ms / SPIN.tauMs));
