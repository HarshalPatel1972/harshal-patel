## 2024-07-04 - Supabase Insert Select Round-Trips
**Learning:** In PostgREST/Supabase, chaining `.select()` directly after `.insert()` returns the inserted row immediately. Separating them into two distinct calls (`.insert()` followed by `.select()`) pointlessly doubles network overhead and latency.
**Action:** Always chain `.select()` on Supabase insert/update operations when the newly created database-generated values (like IDs or default timestamps) are needed by the client.
