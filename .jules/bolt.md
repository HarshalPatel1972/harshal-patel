## 2026-04-28 - [Bot Detection Regex Optimization]
**Learning:** In highly trafficked API routes like '/api/visitor-count', iterating over a string array using `.some()` and `String.prototype.includes()` combined with `.toLowerCase()` per request is significantly slower (O(n * m)) than evaluating a pre-compiled regular expression.
**Action:** Always prefer pre-compiled RegExp with case-insensitive flags for static keyword matching in high-throughput environments instead of dynamic array iteration and string allocation.
