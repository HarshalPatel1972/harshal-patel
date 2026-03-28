# Harshal Patel — Software Engineer Portfolio
> **Cinematic Brutalism & High-Performance Web Engineering.**

![Next.js](https://img.shields.io/badge/Next.js-14.x-black?style=for-the-badge&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue?style=for-the-badge&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-38B2AC?style=for-the-badge&logo=tailwind-css)
![Framer Motion](https://img.shields.io/badge/Framer_Motion-11.x-black?style=for-the-badge&logo=framer)
![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)

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

### 4. Industrial SSR Hardening
Every component that touches the `window`, `document`, or `navigator` has been structurally guarded with React `useEffect` hydration boundaries and `typeof window !== 'undefined'` sanity checks. The project rigorously passes Vercel's Static Generation (`next build`) without leaking into the Node.js server.

---

## 🛠️ Technology Stack

* **Framework**: [Next.js 14](https://nextjs.org/) (App Directory Architecture)
* **Language**: [TypeScript](https://www.typescriptlang.org/) (Strict Mode)
* **Styling**: [Tailwind CSS](https://tailwindcss.com/) + Custom Vanilla CSS Variables (`globals.css`)
* **Animation**: [Framer Motion](https://www.framer.com/motion/) & [Anime.js](https://animejs.com/)
* **Rendering**: Canvas API / `requestAnimationFrame` Loops
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
This project is open-source and available under the [MIT License](LICENSE).

<p align="center">
  <b>Architected by Harshal Patel.</b><br>
  <i>Building High-Performance Systems.</i>
</p>
