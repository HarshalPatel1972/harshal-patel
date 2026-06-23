## 2024-06-23 - RegExp vs Array.some for Bot Detection
**Learning:** For high-frequency API endpoints performing static keyword matching against headers, using `Array.some` combined with `.toLowerCase()` on every request is an anti-pattern. Creating new string copies and iterating through an array is slower than compiling a single static `RegExp` outside the request handler.
**Action:** Use a pre-compiled RegExp with the `i` (case-insensitive) flag for static keyword matching against headers to reduce CPU overhead and garbage collection.
