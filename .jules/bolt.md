## 2024-05-18 - String Manipulation Bottleneck in React High-Frequency Renders
**Learning:** Performing `string.split("")` inside JSX `.map` functions or on every render cycle causes significant memory churn and garbage collection thrashing in high-frequency interactive components (like animation libraries or custom scroll interactions).
**Action:** Always pre-calculate derived string arrays (like character arrays) using `useMemo` at the top level of the component so that references remain stable across re-renders and the expensive string parsing is done exactly once.
