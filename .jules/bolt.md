## 2024-06-30 - High-Frequency Route CPU Profiling
**Learning:** For high-frequency API endpoints performing static keyword matching against headers (e.g., bot detection in `visitor-count`), compiling a single `RegExp` outside the request handler is significantly more performant than dynamically allocating `.toLowerCase()` strings and using `Array.prototype.some` inside the handler for every request.
**Action:** Always pre-compile regular expressions at the module scope for static matching lists in Next.js API routes rather than relying on runtime array iteration and string mutation.
