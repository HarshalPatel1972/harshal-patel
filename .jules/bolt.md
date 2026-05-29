## 2024-05-29 - Redis Pipeline Tuple Parsing
**Learning:** When using `ioredis` pipeline via `exec()`, it always returns an array of tuples `[[error, result1], [error, result2]]`. Generic array index access (like `results?.[0]?.[1]`) or naive `Array.isArray` checks fail silently or break downstream logic.
**Action:** Extract pipelined results explicitly using a strict tuple-checking helper or mapped destructuring, checking both the presence of the nested tuple array and indexing position `[1]` to access the value correctly.
