
## 2024-07-11 - Pre-compiled RegExp over Array.some()
**Learning:** For high-frequency API endpoints performing static keyword matching against headers (e.g., bot detection in `visitor-count`), compiling a single `RegExp` outside the request handler is roughly 6x faster than using `Array.some` and `.toLowerCase()` inside the handler, because it avoids repeatedly converting the string to lowercase and iterating through multiple substring checks on every request.
**Action:** Use pre-compiled `RegExp` for static keyword filtering in route handlers or middleware instead of `Array.some` or `.filter` with string operations.
