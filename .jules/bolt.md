## 2024-05-28 - Compile regex for bot detection
**Learning:** For high-frequency API endpoints performing static keyword matching against headers (e.g., bot detection in `visitor-count`), compiling a single `RegExp` outside the request handler is more performant than using `Array.some` and `.toLowerCase()` inside the handler.
**Action:** Replace `Array.some()` and `.toLowerCase()` inside handlers with a precompiled `RegExp` for static keyword checking.
