
## 2024-05-24 - Layout Thrashing in Scroll Handlers
**Learning:** Reading layout properties synchronously (`offsetTop`, `offsetHeight`) inside high-frequency scroll event listeners causes severe layout thrashing, as the browser is forced to recalculate styles repeatedly, blocking the main thread.
**Action:** Always cache static layout dimensions during initialization and window `resize` events. For the scroll handler, use the cached values and wrap style mutations inside `requestAnimationFrame` protected by a `ticking` boolean flag to ensure batching.
