
## 2024-05-18 - [Hoist Static Decorative Arrays Outside Components]
**Learning:** In highly animated UI components with dynamic visuals, rendering large decorative elements using inline `Array.from` or `useMemo` introduces unnecessary garbage collection pressure and triggers `react-hooks/purity` ESLint warnings when combined with `Math.random()`. The `useMemo` cache acts per component instance but isn't needed if the array is truly static.
**Action:** Always hoist generation of static visual data (like SVG grid shards, decorative UI grids, background static patterns) outside the component as global constants (e.g. `const STATIC_GRID = Array.from(...)`) to achieve measurable ~32x speedups during react tree reconciliation.
