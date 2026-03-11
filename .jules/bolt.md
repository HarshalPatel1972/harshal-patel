
## 2024-05-15 - Synchronous Layout Thrashing in High-Frequency Events
**Learning:** In React components like `Cursor.tsx` that attach event listeners to high-frequency events such as `mouseover` or `mousemove`, using `window.getComputedStyle(target)` to read computed CSS properties forces the browser to calculate layout synchronously. This results in layout thrashing, severe performance degradation, and dropped frames, especially during rapid UI updates.
**Action:** Always prefer direct DOM properties (like `classList.contains()` or `closest()`) over style computations for logic checks inside frequent event handlers to maintain a 60fps frame rate and avoid layout recalculation bottlenecks.
