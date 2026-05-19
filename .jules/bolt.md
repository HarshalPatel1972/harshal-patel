
## 2024-05-19 - Extracted static arrays outside components
**Learning:** In Next.js/React, generating static arrays via `Array.from()` inside the component causes them to be re-created on every render, adding overhead and memory allocations. We saw this with SVGs and background animations in components like `DefragmentingCore.tsx`, `DomainExpansionVoid.tsx`, and `SystemHeartbeat.tsx`. Micro-benchmarks indicate hoisting them outside the component is significantly faster.
**Action:** When a component has arrays of static data (not dependent on state or props) used for rendering repeated elements like SVG shapes or random background points, always define them as constants outside the component body.
