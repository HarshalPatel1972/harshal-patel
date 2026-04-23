## 2024-03-30 - Hero Component Scroll Listener Throttling
**Learning:** Found an unthrottled scroll listener reading offsetTop and offsetHeight directly on every tick, causing major layout thrashing.
**Action:** Cache these dimension values outside the scroll event, update them on window.resize, and wrap state mutations inside requestAnimationFrame with a ticking boolean flag to prevent multi-trigger pileups.
