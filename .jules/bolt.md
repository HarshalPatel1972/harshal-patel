## 2026-03-04 - Mobile Dashboard Background Grid React.memo Optimization
**Learning:** High-frequency UI updates or state changes (like navigating views) cause large inline React subtrees (e.g., arrays of 100+ DOM nodes) to re-render needlessly if not memoized.
**Action:** Extract large, static node arrays into components wrapped in `React.memo` to halt deep re-render cycles.
