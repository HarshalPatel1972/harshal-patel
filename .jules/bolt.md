## 2024-06-20 - [Redis Pipelining Overhead in Abstractions]
**Learning:** The `kv` abstraction over Redis in `src/lib/kv.ts` does not support pipelining natively. Calling operations like `sadd`, `incr`, `scard`, and `get` sequentially creates unnecessary network round-trips for high-frequency operations, such as in the visitor tracking endpoint.
**Action:** Expose and use the underlying `redis` instance to enable `redis.pipeline()` when batching operations in critical paths to minimize API latency.
