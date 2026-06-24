## 2024-06-25 - React Component String Splitting Optimization
**Learning:** In components subject to high-frequency updates (e.g. scroll events), performing string split/manipulation within the render method (such as `name.split(" ").slice(1).join(" ").split("")`) causes redundant object allocation on every frame, which can lead to GC pauses and stuttering during animations.
**Action:** Pre-calculate complex string splits using `useMemo` or hoist them outside the render logic so the arrays are created only when the underlying data changes, not on every render cycle.
