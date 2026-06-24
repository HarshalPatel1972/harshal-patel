## 2024-06-01 - Avoid Layout Thrashing in High-Frequency Scroll Events
**Learning:** Reading layout dimensions like `offsetTop`, `offsetHeight`, or `window.innerHeight` synchronously within a `requestAnimationFrame` loop during scroll events can trigger forced synchronous layouts (layout thrashing), causing degraded scroll performance.
**Action:** Always cache these static layout dimensions during `window.resize` events or component initialization, and reference the cached variables instead within the hot path of high-frequency event handlers like scrolling.
