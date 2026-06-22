## 2026-06-04 - [Redis Pipelining Parsing Fallacy]
**Learning:** Next.js Serverless Redis abstractions (like @vercel/kv or Upstash) directly return the data as an array on pipeline execution (e.g. `[result1, result2]`), rather than an array of `[error, result]` tuples as found in raw `ioredis`.
**Action:** When implementing Redis pipelining in Serverless functions, verify the underlying client being used and expect direct result arrays for Serverless providers instead of index-based tuple parsing to avoid `undefined` primitive extraction.
