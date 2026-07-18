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
