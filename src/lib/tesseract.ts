// A tesseract (4D hypercube) as 16 vertices and 32 edges, rotated in 4D and
// projected down to 2D. Pure maths so it can be tested without a canvas.

export type Vec4 = [number, number, number, number];

export const VERTS: Vec4[] = Array.from({ length: 16 }, (_, i) => [
  i & 1 ? 1 : -1,
  i & 2 ? 1 : -1,
  i & 4 ? 1 : -1,
  i & 8 ? 1 : -1,
]);

// Two vertices share an edge when their indices differ in exactly one bit
export const EDGES: [number, number][] = (() => {
  const out: [number, number][] = [];
  for (let i = 0; i < 16; i++) {
    for (let b = 0; b < 4; b++) {
      const j = i ^ (1 << b);
      if (i < j) out.push([i, j]);
    }
  }
  return out;
})();

// The 24 square faces: pick two axes to span the square, fix the other two coordinates (4 ways), 6 pairs of axes.
// Vertices are listed around the square so they can be filled as a polygon.
export const FACES: [number, number, number, number][] = (() => {
  const out: [number, number, number, number][] = [];
  for (let a = 0; a < 4; a++) {
    for (let b = a + 1; b < 4; b++) {
      for (let base = 0; base < 16; base++) {
        if (base & (1 << a) || base & (1 << b)) continue; // base has both spanning bits cleared
        out.push([base, base | (1 << a), base | (1 << a) | (1 << b), base | (1 << b)]);
      }
    }
  }
  return out;
})();

export interface Projected {
  x: number; // roughly -1..1, multiply by the on-screen size
  y: number;
  depth: number; // 0 (far) .. 1 (near), handy for fading edges
}

const rot = (a: number, b: number, theta: number): [number, number] => {
  const c = Math.cos(theta);
  const s = Math.sin(theta);
  return [a * c - b * s, a * s + b * c];
};

/** Rotate one vertex in the XW and ZW planes (the "inside-out" 4D turn) plus a slow 3D spin. */
export function rotate4(v: Vec4, t: number): Vec4 {
  let [x, y, z, w] = v;
  [x, w] = rot(x, w, t * 0.9);
  [z, w] = rot(z, w, t * 0.6);
  [x, z] = rot(x, z, t * 0.35);
  [y, z] = rot(y, z, t * 0.25);
  return [x, y, z, w];
}

/** Perspective-project 4D → 3D → 2D. `t` is time in seconds. */
export function project(t: number): Projected[] {
  const W_DIST = 3; // camera distance along w
  const Z_DIST = 4.2; // camera distance along z
  return VERTS.map((v) => {
    const [x, y, z, w] = rotate4(v, t);
    const k4 = 1 / (W_DIST - w);
    const x3 = x * k4 * W_DIST;
    const y3 = y * k4 * W_DIST;
    const z3 = z * k4 * W_DIST;
    const k3 = 1 / (Z_DIST - z3);
    return {
      x: (x3 * k3 * Z_DIST) / 2.2,
      y: (y3 * k3 * Z_DIST) / 2.2,
      depth: Math.min(1, Math.max(0, (z3 + 2) / 4)),
    };
  });
}
