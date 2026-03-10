## 2024-05-24 - [Avoid `useState` in high-frequency scroll listeners]
**Learning:** Storing rapidly changing scroll properties (`scrollY`, `progress`, `speed`) in `useState` triggers massive render thrashing (e.g., ~60 re-renders per second in the `Navbar` component).
**Action:** When creating high-frequency scroll trackers or interactive UI elements that depend on scrolling/mouse movement, store the changing values in `useRef` and perform direct DOM style mutations inside `requestAnimationFrame` loops to entirely bypass the React render cycle.
