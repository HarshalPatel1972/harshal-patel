
## 2024-05-30 - [Array Search in High-Frequency Edge Route]
**Learning:** Found a micro-bottleneck in `src/app/api/visitor-count/route.ts` where string manipulation (`.toLowerCase()`) and array scanning (`.some()`) occurred directly inside the request handler. For endpoints taking thousands of hits (visitor tracking), avoiding per-request string instantiation and leveraging the V8 regex engine via a pre-compiled `RegExp` pattern is highly effective.
**Action:** Always extract static array-based search constraints into pre-compiled `RegExp` objects defined outside edge/API request handlers to avoid per-request memory allocation overhead.
