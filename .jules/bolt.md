## 2026-03-01 - Optimizing Mouse Tracking to Prevent Layout Thrashing
**Learning:** Components that track mouse movement (like `Spotlight`) and use `getBoundingClientRect()` synchronously inside the `onMouseMove` event can cause severe layout thrashing because the DOM is forced to recalculate layout for every pixel moved.
**Action:** Always wrap high-frequency DOM reads (like `getBoundingClientRect()`) and style updates in `requestAnimationFrame` and cancel previous frames to decouple DOM read/write cycles from the rapid event emission.
