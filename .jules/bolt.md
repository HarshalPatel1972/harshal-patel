
## 2024-05-18 - Redis Pipeline Optimization Insights
**Learning:** The project's custom `src/lib/kv.ts` wraps `ioredis` in a `kv` object for backwards compatibility. The pipeline results from `ioredis` return tuples of `[error, result]`.
**Action:** When migrating from `kv` to raw `ioredis` pipeline, import the underlying `redis` object explicitly (which I did correctly). Ensure `extract()` handles the `[error, result]` tuple safely.
