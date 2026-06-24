## 2024-05-24 - Pre-compiled RegEx vs Array.some for Bot Detection
**Learning:** In hot API routes (like visitor counting), iterating over an array of keywords with `.some()` and calling `.includes()` on a user agent string that was first transformed with `.toLowerCase()` takes `O(N * M)` time and does unnecessary string allocations per request.
**Action:** Always prefer a pre-compiled `RegExp` with the `/i` flag for static keyword matching against strings like User-Agents to achieve better performance and eliminate redundant memory allocations.
