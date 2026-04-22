## 2026-04-22 - Optimize Hero Scroll Engine
**Learning:** Caching static layout dimensions ( and ) during initialization and `window.resize` events rather than recalculating them synchronously on every scroll event inside `Hero.tsx` prevents layout thrashing.
**Action:** Always use `requestAnimationFrame` combined with a `ticking` boolean state and cached dimensions when binding expensive DOM manipulations to high-frequency events like scroll.
## 2026-04-22 - Optimize Hero Scroll Engine
**Learning:** Caching static layout dimensions (`offsetTop` and `offsetHeight`) during initialization and window.resize events rather than recalculating them synchronously on every scroll event inside Hero.tsx prevents layout thrashing.
**Action:** Always use requestAnimationFrame combined with a ticking boolean state and cached dimensions when binding expensive DOM manipulations to high-frequency events like scroll.
