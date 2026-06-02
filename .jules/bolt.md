## 2024-06-02 - Regex compilation vs Array.some for bot detection
**Learning:** For high-frequency API endpoints that perform string matching against a static list of keywords (like bot detection in `visitor-count`), compiling a single `RegExp` with the `i` flag outside the request handler is more efficient than calling `.toLowerCase()` on the input and iterating through an array with `.some()` and `.includes()`.
**Action:** Replace `Array.some` bot keyword checks with a pre-compiled Regex.
