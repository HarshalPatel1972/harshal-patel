## 2024-07-02 - Optimize Static Keyword Matching in API Endpoints
**Learning:** For high-frequency Next.js API routes performing static keyword matching against headers (like bot detection in `visitor-count`), compiling a single `RegExp` outside the request handler is more performant than using `Array.some` combined with `.toLowerCase()` inside the handler. This avoids `O(N)` iteration and repeated string allocations on every single request.
**Action:** When implementing blocklists or keyword filters on hot paths, always use a pre-compiled regex instead of arrays of strings.
