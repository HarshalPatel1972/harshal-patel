
## 2024-07-13 - [Pre-compiling Regex in Next.js Serverless Routes]
**Learning:** In Next.js App Router API routes, statically defined arrays used for keyword filtering (like `BOT_KEYWORDS`) trigger an O(N) linear scan and a new `.toLowerCase()` string allocation per incoming request if processed directly in the handler. Converting this to a pre-compiled `RegExp` initialized in the module scope (outside the exported handler) creates an O(1) matching mechanism and eliminates per-request memory allocations for string transformations.
**Action:** When implementing static text-filtering logic in high-traffic Next.js API routes, hoist the static lists into pre-compiled case-insensitive Regular Expressions at the module level rather than evaluating array iterations inside the request cycle.
