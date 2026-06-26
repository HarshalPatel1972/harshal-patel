## 2024-05-18 - [API Route Regex Compilation]
**Learning:** For high-frequency Next.js API endpoints performing static keyword matching against headers (like bot detection matching User-Agents in `visitor-count/route.ts`), relying on `Array.some()` combined with `.toLowerCase()` causes unnecessary and measurable CPU overhead and garbage collection per request.
**Action:** When implementing static text filters, compile a single case-insensitive `RegExp` outside the API handler and use `.test()`, eliminating per-request string lowercasing and array iteration.
