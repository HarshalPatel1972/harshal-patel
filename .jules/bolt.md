## 2024-06-25 - Prevent IntersectionObserver Re-renders via useRef
**Learning:** In `ScrollReveal.tsx`, tracking one-time visibility state (`hasAnimated`) with `useState` triggered an unnecessary component re-render every time an element entered the viewport and the intersection observer fired.
**Action:** Replace `useState` with `useRef` for tracking boolean animation flags within `IntersectionObserver` callbacks to prevent cascading re-renders across scroll-heavy pages.
