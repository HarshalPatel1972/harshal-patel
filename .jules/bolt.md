## 2026-07-16 - Optimize state update for high-frequency mousemove events
**Learning:** Found a performance bottleneck in `src/app/feedback/FeedbackContents.tsx` where a high-frequency `mousemove` event listener updates state (`mousePos`) synchronously. This can trigger excessive React re-renders and block the main thread.
**Action:** Use a `useRef` for mutable coordinate values or batch state updates using `requestAnimationFrame` along with a ticking flag to prevent synchronous cascading re-renders on every `mousemove` event.
