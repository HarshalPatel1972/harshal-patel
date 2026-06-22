## 2024-03-24 - Vercel KV Pipeline Optimization
**Learning:** Sequential calls to `@vercel/kv` (e.g., `kv.sadd` followed by `kv.incr` followed by `kv.scard`) each require a full network round-trip, which significantly degrades API performance and increases latency in hot paths like visitor tracking.
**Action:** Always batch sequential Redis operations using `kv.pipeline()` followed by `await pipe.exec()` to consolidate network requests into a single round-trip, significantly improving response times.
