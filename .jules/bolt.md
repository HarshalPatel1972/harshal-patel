
## 2024-05-18 - [Optimizing High-Frequency Interactive Components]
**Learning:** Found that `Spotlight.tsx` was using React `useState` for hover opacity and updating coordinates synchronously during `onMouseMove`. This causes layout thrashing and unnecessary React render cycles for high-frequency DOM manipulation.
**Action:** When creating high-frequency interactive components that just update visual styling (like position, gradients, or opacity based on mouse movements), use `useRef` combined with `requestAnimationFrame` for writing the changes and directly mutate `ref.current.style`. This effectively bypasses the React render loop and ensures stable 60FPS animations.
