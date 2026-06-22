## 2024-04-15 - Pre-compiled RegExp for Static String Matching\n**Learning:** Iterative `Array.prototype.some` combined with `String.prototype.includes` and `.toLowerCase()` inside a high-traffic request handler creates unnecessary CPU overhead and object allocations per request.\n**Action:** Use a pre-compiled `RegExp` with the `i` flag defined outside the request handler for high-performance static keyword matching.

## 2024-04-15 - Optimize Redis Operations via Pipelining
**Learning:** Sequential await calls to Redis functions (e.g. `sadd`, `incr`, `scard`, `get`) introduce significant network roundtrip overhead latency per API call.
**Action:** Use `redis.pipeline()` to batch multiple asynchronous Redis commands into a single roundtrip to maximize latency performance.
