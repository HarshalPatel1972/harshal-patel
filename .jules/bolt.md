## 2024-05-18 - Optimize ResonanceCanvas Animation

**Learning:** Storing continuous interactive coordinates (like mouse position during `mousemove` events) in React state for canvas animations causes cascading re-renders and loop recreation. The `ResonanceCanvas` in `Projects.tsx` was destroying and recreating its `requestAnimationFrame` loop on every single pixel of mouse movement because `mouseX` and `mouseY` were state variables triggering the `useEffect` dependencies.

**Action:** When bridging React events with continuous HTML Canvas animations (`requestAnimationFrame`), use a mutable `useRef` to store coordinate state instead of `useState`. Pass the ref to the canvas component so the animation loop can read the latest coordinates directly without triggering the React render lifecycle.
