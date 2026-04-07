# Harshal Patel — Software Engineer Portfolio
> **Cinematic Brutalism & High-Performance Web Engineering.**

![Next.js](https://img.shields.io/badge/Next.js-16.x-black?style=for-the-badge&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue?style=for-the-badge&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.0-38B2AC?style=for-the-badge&logo=tailwind-css)
![Anime.js](https://img.shields.io/badge/Anime.js-4.3-black?style=for-the-badge)
![License](https://img.shields.io/badge/License-HPCL_v1.0-red?style=for-the-badge)

## 🌐 Overview
Welcome to the source code of my digital portfolio. This project isn't just a static resume—it is a deeply engineered **Kinetic System** built to demonstrate advanced proficiency in performance optimization, WebGL/Canvas rendering, and complex state management within the React ecosystem.

The aesthetic direction follows a strict philosophy of **Cinematic Brutalism**. By discarding traditional soft UI patterns (glassmorphism, subtle drop-shadows) in favor of stark contrast, heavy-weight typography, raw film grain, and 60fps physics-driven interactions, the portfolio acts as an immersive, tactile experience. 

It also highlights my core engineering proficiencies: **Go (Golang)**, **TypeScript**, and **WebAssembly**.

---

## ⚡ Core Features

### 1. The Kinetic Engine (Zero-Lag Canvas Renderers)
Standard DOM manipulation is notoriously slow for continuous physics interactions. To maintain a strict 60fps experience, this project uses bare-metal HTML5 `<canvas>` layers for high-frequency animations:
* **Molecular Cursor (`Cursor.tsx`)**: A custom 20-node physics trail algorithm that physically replaces the native cursor. It calculates velocity, friction, and boundary collisions natively via `requestAnimationFrame`.
* **Velocity Warp (`VelocityWarp.tsx`)**: An event-driven directional speed-line system. It dynamically intercepts massive navigation jumps across the DOM and strictly masks the viewport, executing a high-speed travel simulation before a flawless 1.5-second deceleration reveal.

### 2. Deep Localization (Global Context Provider)
The portfolio dynamically translates the localized interfaces into over 10 distinct regions (`en`, `ja`, `ko`, `zh-tw`, `hi`, `fr`, `de`, `it`, `es`, etc.). The structure seamlessly handles character slicing, font-weight shifting (supporting CJK languages seamlessly), and layout restructuring without triggering hydration errors.

### 3. Cinematic Transition Orchestration (`FlipContext.tsx`)
A completely custom global transition router:
* Built a state machine capable of hijacking hard navigation events.
* Smoothly transitions the application state to trigger pre-loading mechanisms, execute WebGL-like 3D card flips (`FlipTransition.tsx`), or spatial warps before firing a sanitized redirect.

### 4. Performance Engineering (Heap Memory Management)
This portfolio has been rigorously optimized to maintain a low memory footprint (Targeting <100MB Heap usage in Chrome):
* **Lifecycle-Aware Animators**: All `animejs` and Canvas loops in components like `VelocityWarp.tsx` and `BinaryVeil.tsx` are bound to `IntersectionObserver` logic and explicit cleanup handlers (`anime.remove`). They cease all processing when out of view, preventing memory leaks and CPU spikes.
* **Aggressive Code Splitting**: Utilizing `next/dynamic` for heavy sections (`About`, `Projects`, `Contact`) to minimize initial JS payload and prevent unnecessary script execution on entry.
* **Resource Throttling**: Video and high-res asset preloading is state-managed (e.g., `preload="metadata"`) to prevent unneeded multi-megabyte downloads during initial hydration.

### 5. Unified Kinetic Motion (`LanguageSelector.tsx`)
A custom-built "Shutter Unroll" materialization system that replaces standard CSS transforms with a synchronized, physics-driven staggered reveal. By orchestrating individual item materialization with the container's clip-path unroll, the UI feels alive and responsive to user intent.

---

## 🛠️ Technology Stack

* **Framework**: [Next.js 16](https://nextjs.org/) (Turbopack Powered)
* **Language**: [TypeScript](https://www.typescriptlang.org/) (Strict Mode)
* **Styling**: [Tailwind CSS 4.0](https://tailwindcss.com/)
* **Animation**: [Anime.js 4](https://animejs.com/) & [Framer Motion](https://www.framer.com/motion/)
* **Rendering**: Native Canvas API / IntersectionObserver
* **Typography**: Local-hosted custom fonts (Cirka, Season, Victor, Luna) to enforce absolute zero-latency layout shifts.

---

## 🚀 Getting Started

If you'd like to clone this repository to explore the codebase, test the kinetic cursor, or experiment with the cinematic transitions locally:

### Prerequisites
* Node.js (v18 or higher)
* npm, yarn, or pnpm

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/HarshalPatel1972/harshal-patel.git
   cd harshal-patel
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Run the development server:**
   ```bash
   npm run dev
   ```

4. **Experience the build:**
   Open [http://localhost:3000](http://localhost:3000) with your browser.

---

## 🔒 Security & Performance Constraints
This repository uses `next/dynamic` to selectively disable Server-Side Rendering (`ssr: false`) on physics-heavy client-side components to eliminate content flashing. High-intensity interactive elements (such as `ImageGuard.tsx`) aggressively prevent outside ghosting, dragging, and unwanted context menus to enforce the application-like feel. 

All CSS animations conform to user preference media queries (`@media (prefers-reduced-motion: reduce)`).

---

## 📝 License
This project is proprietary and governed by the [HARSHAL PATEL CREATIVE LICENSE (HPCL v1.0)](LICENSE). 

By accessing this repository, you agree to the terms:
* **Personal/Educational Use Only**: You may copy and study the Work for learning.
* **Non-Commercial**: You may NOT use the design, code, or kinetic systems for commercial projects or revenue generation.
* **Attribution Required**: Clear, prominent credit to Harshal Patel must be provided on any use or study of the Work.

<p align="center">
  <b>Architected by Harshal Patel.</b><br>
  <i>Building High-Performance Systems.</i>
</p>
