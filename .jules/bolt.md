
## 2024-03-24 - Layout Thrashing in AnimationKit
**Learning:** High-frequency event listeners (`mousemove`, `scroll`) in `src/components/AnimationKit.tsx` (`useMagnetic`, `useTilt`, `useParallax`) were performing synchronous DOM reads (`getBoundingClientRect`) and writes without batching, causing potential layout thrashing and performance bottlenecks specific to how these hooks are heavily used across components.
**Action:** When implementing interactive element-tracking hooks, always use a `ticking` boolean and `requestAnimationFrame` pattern. Store the latest event coordinates in outer mutable variables, dispatching a single rAF to read the DOM and apply the transforms, cancelling the pending frame upon unmount or `mouseleave`.
