// Canvas drawing for the V3 tesseract: filled faces, glowing edges, bloom on the vertices,
// plus a small spark system and orbiting dust. Kept apart from the React bits.
import { EDGES, FACES, project } from "@/lib/tesseract";

export interface Look {
  color: string; // #rrggbb, edges and glow
  core: string; // the "hot" end of each edge
  additive: boolean; // glow adds light on the dark design, but would wash out on paper
}

export const LOOKS: Record<"old" | "new", Look> = {
  old: { color: "#ff2b2b", core: "#ffe3dc", additive: true },
  new: { color: "#C44D1C", core: "#0F0D0A", additive: false },
};

export function drawTesseract(
  ctx: CanvasRenderingContext2D,
  o: { cx: number; cy: number; size: number; alpha: number; rot: number; look: Look },
) {
  const { cx, cy, size, alpha, rot, look } = o;
  if (size < 1 || alpha <= 0) return;
  const pts = project(rot).map((p) => ({ x: cx + p.x * size, y: cy + p.y * size, d: p.depth }));

  ctx.save();
  ctx.lineJoin = "round";
  ctx.lineCap = "round";

  // Faces, back to front, so the cube reads as a solid made of glass instead of a wire
  const faces = FACES.map((f) => ({ f, d: (pts[f[0]].d + pts[f[1]].d + pts[f[2]].d + pts[f[3]].d) / 4 })).sort((a, b) => a.d - b.d);
  ctx.fillStyle = look.color;
  for (const { f, d } of faces) {
    ctx.globalAlpha = alpha * (0.022 + 0.06 * d);
    ctx.beginPath();
    ctx.moveTo(pts[f[0]].x, pts[f[0]].y);
    for (let k = 1; k < 4; k++) ctx.lineTo(pts[f[k]].x, pts[f[k]].y);
    ctx.closePath();
    ctx.fill();
  }

  const base = Math.max(1, Math.min(2.6, size * 0.011));

  // Soft wide pass first (the glow), then a crisp core
  if (look.additive) ctx.globalCompositeOperation = "lighter";
  ctx.strokeStyle = look.color;
  ctx.lineWidth = base * 6;
  for (const [i, j] of EDGES) {
    const avg = (pts[i].d + pts[j].d) / 2;
    ctx.globalAlpha = alpha * (look.additive ? 0.07 : 0.05) * (0.4 + avg);
    ctx.beginPath(); ctx.moveTo(pts[i].x, pts[i].y); ctx.lineTo(pts[j].x, pts[j].y); ctx.stroke();
  }
  for (const [i, j] of EDGES) {
    const a = pts[i], b = pts[j];
    const [near, far] = a.d > b.d ? [a, b] : [b, a];
    const avg = (a.d + b.d) / 2;
    const g = ctx.createLinearGradient(far.x, far.y, near.x, near.y);
    g.addColorStop(0, look.color);
    g.addColorStop(1, look.core);
    ctx.strokeStyle = g;
    ctx.lineWidth = base * (0.7 + 0.9 * avg);
    ctx.globalAlpha = alpha * (0.35 + 0.65 * avg);
    ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke();
  }

  // Bloom on each vertex
  for (const p of pts) {
    const r = Math.max(3, size * 0.052 * (0.6 + 0.7 * p.d));
    const g = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, r);
    g.addColorStop(0, look.core);
    g.addColorStop(0.3, look.color);
    g.addColorStop(1, look.color + "00");
    ctx.globalAlpha = alpha * (0.55 + 0.45 * p.d);
    ctx.fillStyle = g;
    ctx.beginPath(); ctx.arc(p.x, p.y, r, 0, Math.PI * 2); ctx.fill();
  }
  ctx.restore();
}

interface Spark { x: number; y: number; vx: number; vy: number; life: number; max: number; r: number }

export class Sparks {
  private list: Spark[] = [];

  burst(x: number, y: number, n: number, speed: [number, number] = [120, 420], life: [number, number] = [0.5, 1.1]) {
    for (let i = 0; i < n && this.list.length < 260; i++) {
      const a = Math.random() * Math.PI * 2;
      const v = speed[0] + Math.random() * (speed[1] - speed[0]);
      const max = life[0] + Math.random() * (life[1] - life[0]);
      this.list.push({ x, y, vx: Math.cos(a) * v, vy: Math.sin(a) * v, life: max, max, r: 0.8 + Math.random() * 1.8 });
    }
  }

  /** A few slow sparks left behind a moving point */
  emit(x: number, y: number, n: number) {
    this.burst(x, y, n, [10, 70], [0.35, 0.8]);
  }

  step(dt: number) {
    for (const s of this.list) {
      s.life -= dt;
      s.x += s.vx * dt; s.y += s.vy * dt;
      const drag = Math.pow(0.05, dt); // loses most of its speed in a second
      s.vx *= drag; s.vy *= drag;
    }
    this.list = this.list.filter((s) => s.life > 0);
  }

  draw(ctx: CanvasRenderingContext2D, look: Look) {
    ctx.save();
    if (look.additive) ctx.globalCompositeOperation = "lighter";
    ctx.fillStyle = look.color;
    for (const s of this.list) {
      ctx.globalAlpha = Math.max(0, s.life / s.max) * 0.9;
      ctx.beginPath(); ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2); ctx.fill();
    }
    ctx.restore();
  }
}

/** Dust circling the cube on tilted ellipses */
export function drawOrbit(
  ctx: CanvasRenderingContext2D,
  o: { cx: number; cy: number; size: number; e: number; alpha: number; look: Look },
) {
  const { cx, cy, size, e, alpha, look } = o;
  if (alpha <= 0.01) return;
  ctx.save();
  if (look.additive) ctx.globalCompositeOperation = "lighter";
  ctx.fillStyle = look.color;
  for (let i = 0; i < 22; i++) {
    const ang = i * 2.39996 + (e / 1000) * (0.35 + (i % 5) * 0.11);
    const rx = size * (1.18 + 0.07 * ((i * 7) % 5));
    const ry = rx * 0.4;
    const tilt = i * 0.7 + e / 5200;
    const x = Math.cos(ang) * rx, y = Math.sin(ang) * ry;
    const px = cx + x * Math.cos(tilt) - y * Math.sin(tilt);
    const py = cy + x * Math.sin(tilt) + y * Math.cos(tilt);
    ctx.globalAlpha = alpha * (0.35 + 0.5 * ((Math.sin(ang) + 1) / 2));
    ctx.beginPath(); ctx.arc(px, py, 1 + ((i * 3) % 3) * 0.6, 0, Math.PI * 2); ctx.fill();
  }
  ctx.restore();
}
