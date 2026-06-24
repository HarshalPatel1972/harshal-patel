
## 2024-05-27 - Supabase Insert Select Optimization
**Learning:** In Next.js API routes with Supabase, executing an `.insert()` followed by a distinct `.select()` on the newly inserted ID or timestamp requires two separate database round trips.
**Action:** Append `.select().single()` directly to the `.insert()` to optimize the insertion and retrieval of the newly created data into a single round trip, reducing latency and simplifying code.
