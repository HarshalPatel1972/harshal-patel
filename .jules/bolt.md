## 2024-05-24 - [Title]
**Learning:** [Insight]
**Action:** [How to apply next time]

## 2024-06-11 - Synchronous Layout Thrashing in Tilted Components
**Learning:** Calling `getBoundingClientRect()` synchronously on high-frequency events like `mousemove` forces the browser to calculate layout immediately. In complex components, this is highly expensive and leads to layout thrashing, which stutters animations.
**Action:** Always batch layout reads and DOM writes inside a `requestAnimationFrame` loop, tracked by a `useRef` variable, for high-frequency interactive events in React components.