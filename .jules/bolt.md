
## 2025-02-28 - [Event Listener Optimization]
**Learning:** High-frequency event listeners (e.g., `scroll`, `mousemove`) executing synchronous DOM reads like `getBoundingClientRect`, `offsetTop`, or `offsetHeight` can cause severe layout thrashing and block the main thread.
**Action:** Always wrap these high-frequency reads and subsequent style/state updates in a `requestAnimationFrame` block combined with a `ticking` boolean flag to batch them with the browser's render cycle.

## 2025-02-28 - [Event Listener Optimization Gotchas]
**Learning:** While batching event listeners with `requestAnimationFrame` prevents layout thrashing, two critical anti-patterns must be avoided:
1. **Stale Closure State:** Never close over the event object (`e.clientX`) directly in the rAF. High-frequency events will be dropped while `ticking` is true, and the rAF will read the *oldest* event in that batch, causing visual desync. Always store the latest coordinates in a mutable outer variable before the rAF check.
2. **Race Conditions on Reset:** If a reset handler (e.g., `mouseleave`) fires while a rAF is pending, the rAF callback will execute *after* the reset, overwriting the reset style and causing elements to get permanently stuck. Always call `cancelAnimationFrame(rafId)` inside reset/teardown handlers.
