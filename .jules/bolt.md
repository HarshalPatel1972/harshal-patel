## 2026-04-02 - Prevent Layout Thrashing in High-Frequency Listeners
**Learning:** Reading layout metrics like `offsetTop` or `offsetHeight` synchronously inside high-frequency event listeners (like `scroll` or `mousemove`) forces synchronous layout recalculations, causing severe layout thrashing (jank).
**Action:** Always cache these metrics during `resize` events and initialization. Additionally, batch direct DOM style updates using `requestAnimationFrame` with a `ticking` variable flag to prevent blocking the main thread, as observed in `Hero.tsx` scroll optimizations.
