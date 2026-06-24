## 2024-06-18 - Compiled Regex for Bot Detection
**Learning:** For high-frequency API endpoints performing static keyword matching against headers (e.g., bot detection in `visitor-count`), compiling a single `RegExp` outside the request handler is more performant than using `Array.some` and `.toLowerCase()` inside the handler, because it avoids continuous string allocations and O(N) array iterations.
**Action:** Always pre-compile regular expressions for static, unchanging string matching tasks outside of execution-hot paths (like request handlers or render loops).
