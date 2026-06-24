## 2024-05-23 - Pre-compiled RegExp for Static List Matching
**Learning:** For high-performance string matching against static keyword lists (e.g., bot detection User-Agents), using a pre-compiled `RegExp` with the `i` (case-insensitive) flag defined outside the request handler is significantly faster than iteratively using `Array.prototype.some` combined with `String.prototype.includes`.
**Action:** Replace iterative array-based string matching logic with a single pre-compiled `RegExp` where possible to reduce CPU cycles and avoid redundant operations like `.toLowerCase()`.
