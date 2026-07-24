## 2026-03-04 - Mobile Dashboard Background Grid React.memo Optimization
**Learning:** High-frequency UI updates or state changes (like navigating views) cause large inline React subtrees (e.g., arrays of 100+ DOM nodes) to re-render needlessly if not memoized.
**Action:** Extract large, static node arrays into components wrapped in `React.memo` to halt deep re-render cycles.

## 2024-05-24 - [Avoid `useState` in high-frequency scroll listeners]
**Learning:** Storing rapidly changing scroll properties (`scrollY`, `progress`, `speed`) in `useState` triggers massive render thrashing (e.g., ~60 re-renders per second in the `Navbar` component).
**Action:** When creating high-frequency scroll trackers or interactive UI elements that depend on scrolling/mouse movement, store the changing values in `useRef` and perform direct DOM style mutations inside `requestAnimationFrame` loops to entirely bypass the React render cycle.

## 2024-05-18 - [Batching DOM reads and writes in high-frequency events]
**Learning:** When batching high-frequency events (like `mousemove`) with `requestAnimationFrame`, you must store the latest event coordinates in a mutable outer variable (e.g., `useRef`) rather than closing over the event object directly. Otherwise, the asynchronous frame callback will capture stale data or the event object will be garbage-collected, leading to visual desyncs.
**Action:** Always capture `e.clientX` / `e.clientY` in a `useRef` object synchronously in the event handler before queuing the `requestAnimationFrame` containing `getBoundingClientRect()` and style updates.

## 2024-06-25 - React Hooks Purity and Math.random()

**Learning:** When generating configuration arrays or complex state structures inside functional components, using `Math.random()` triggers ESLint errors (`react-hooks/purity`) because it violates the rule that components and their hooks must be pure and idempotent. `Math.random()` produces unstable results that update unpredictably when the component re-renders.
**Action:** To resolve these purity errors while maintaining the intended visual randomness per component mount, the array generation should be moved out of the `useMemo` block and executed *once* either inside a `useState` initializer or wrapped in a `useRef`. For static arrays that do *not* require unique randomness per mount (e.g. standard grid lines), hoist them entirely outside the component body.

## 2025-02-13 - Preventing Layout Thrashing in Scroll Listeners
**Learning:** Synchronously reading layout properties like `offsetTop` or `offsetHeight` within high-frequency event listeners (such as scroll) triggers forced synchronous layouts (layout thrashing). This blocks the main thread and hurts animation performance significantly. The specific anti-pattern observed here was dynamically recalculating `trackRef.current.offsetTop` inside the `handleScroll` event.
**Action:** Extract these synchronous DOM reads out of the event listener's callback. Cache layout properties on component mount and update them via a `window.addEventListener('resize', ...)` callback. The high-frequency `scroll` listener can then calculate metrics using the cached static values and rely only on `window.scrollY` without forcing a reflow.

## 2024-03-24 - Memoizing Complex String Splits in Render Loops
**Learning:** For React components performing complex string manipulations (e.g., splitting a name into parts and character arrays for animations), un-memoized `split()` operations inside the render loop cause redundant object and array allocations on every render cycle. This is especially problematic in components like Hero that might be updated by high-frequency events or simply re-render frequently.
**Action:** Utilize `useMemo` to pre-calculate these values. This eliminates the redundant allocations and computations, improving performance without sacrificing readability.

## 2024-07-04 - Supabase Insert Select Round-Trips
**Learning:** In PostgREST/Supabase, chaining `.select()` directly after `.insert()` returns the inserted row immediately. Separating them into two distinct calls (`.insert()` followed by `.select()`) pointlessly doubles network overhead and latency.
**Action:** Always chain `.select()` on Supabase insert/update operations when the newly created database-generated values (like IDs or default timestamps) are needed by the client.

## 2024-07-12 - Redis Pipelining for API Route Optimization
**Learning:** Sequential Redis operations (like `sadd`, `incr`, `scard`, and `get`) can introduce significant network latency when performed individually due to multiple network round-trips. Using `redis.pipeline()` in ioredis batches these operations into a single round-trip, significantly reducing API latency. When extracting results from `exec()`, `ioredis` returns an array of tuples `[error, result][]`, which can be reliably accessed with a strictly typed helper like `(res: [Error | null, any]) => res[1]`.
**Action:** Always look for sequential Redis operations that don't depend on intermediate results and batch them using pipelining.

## 2024-07-15 - Pre-compile Regex for Bot Detection API
**Learning:** For high-frequency API endpoints performing static keyword matching against headers (e.g., bot detection in `visitor-count`), using `Array.some` and `.toLowerCase()` inside the request handler is an anti-pattern. It forces per-request string allocation and array iteration, which can block the Node.js event loop under heavy load.
**Action:** Compile a single `RegExp` outside the request handler. This gives O(1) matching performance and avoids per-request overhead.

## 2026-07-16 - Optimize state update for high-frequency mousemove events
**Learning:** Found a performance bottleneck in `src/app/feedback/FeedbackContents.tsx` where a high-frequency `mousemove` event listener updates state (`mousePos`) synchronously. This can trigger excessive React re-renders and block the main thread.
**Action:** Use a `useRef` for mutable coordinate values or batch state updates using `requestAnimationFrame` along with a ticking flag to prevent synchronous cascading re-renders on every `mousemove` event.

## 2024-05-18 - Replacing continuous state updates with Mutable Refs in RequestAnimationFrame Loops
**Learning:** In the `Projects.tsx` component, the `DossierCard` updated its local `mouse` React state continuously via `onMouseMove`. This passed a new `mouseX` and `mouseY` to `ResonanceCanvas`, which included them in the dependency array of a `useEffect` containing a `requestAnimationFrame` loop. This created a dual performance bottleneck: constant cascading React re-renders in the parent card on every mouse move, and the constant teardown/restart of the Canvas animation loop due to changing dependencies.
**Action:** When connecting a high-frequency DOM event (like `mousemove`) to a Canvas `requestAnimationFrame` loop, store the changing coordinates in a `useRef` rather than `useState`. Pass the mutable ref object to the Canvas component and read directly from `.current` inside the `draw` function. Keep the ref out of the dependency arrays, preventing both React re-renders and loop resets.

## 2026-07-21 - Refactored mousePos state to ref in Feedback Gallery
**Learning:** High-frequency events like `mousemove` should not trigger React state updates, even when batched with `requestAnimationFrame`, as this still causes cascading re-renders across all child components (e.g., all `FloatingCard` instances in a gallery).
**Action:** Store the rapidly changing event coordinates in a `useRef`. Pass this ref to child components, which can read from it inside their own animation loops (e.g., Framer Motion's `useAnimationFrame`) and update native DOM styles using MotionValues, entirely bypassing the React render cycle.

## 2024-07-24 - Layout Thrashing in React Animation Loops
**Learning:** Calling `document.documentElement.style.setProperty` unconditionally inside a `requestAnimationFrame` loop on every frame causes significant global layout thrashing, even if the values being set are identical to the previous frame. Browsers invalidate styles when CSS custom properties on the root element are written to.
**Action:** Always implement a caching mechanism (e.g., using `lastX` / `lastY` local variables inside the effect scope) to conditionally wrap CSS property updates in animation loops so they only execute when the underlying values actually change.
