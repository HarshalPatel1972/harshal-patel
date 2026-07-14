## 2024-05-24 - Static Header Matching Anti-Pattern
**Learning:** For high-frequency API endpoints like `visitor-count` in this Next.js app, doing static keyword matching against headers using `Array.some` and `.toLowerCase()` inside the handler is a performance bottleneck. It causes unnecessary allocations and CPU overhead on every hit.
**Action:** Pre-compile a single `RegExp` with the `i` flag outside the request handler to make the static matching O(1) in allocation and significantly faster per-request execution.
