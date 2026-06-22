## 2024-04-08 - Redis Pipeline Batching
**Learning:** Sequential Redis calls (like `sadd`, `incr`, `scard`, `get`) executed independently create unnecessary network latency and block event loops for longer than necessary. In a high-traffic endpoint like `visitor-count`, this adds up significantly.
**Action:** When making multiple Redis operations sequentially inside an API route, use `@vercel/kv`'s `.pipeline()` method to batch operations and reduce network round-trips. Keep in mind that unlike standard `ioredis`, `@vercel/kv` pipeline `.exec()` returns a flat array of results.
