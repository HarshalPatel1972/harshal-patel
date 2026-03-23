# Harshal Patel Portfolio

![Next.js](https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=next.js&logoColor=white) 
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white) 
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white) 
![Upstash](https://img.shields.io/badge/Upstash-00EAD3?style=for-the-badge&logo=upstash&logoColor=black)

A high-performance personal portfolio engineered with **Cinematic Brutalism**, optimized for thermal stability and responsive interactivity.

---

## 📑 Table of Contents
- [Overview](#overview)
- [Key Features](#key-features)
- [Performance & Thermal Optimization](#performance--thermal-optimization)
- [Technical Stack](#technical-stack)
- [Project Architecture](#project-architecture)
- [Getting Started](#getting-started)
- [Environment Configuration](#environment-configuration)
- [Deployment](#deployment)

---

## 🏗️ Overview
This portfolio is a technical demonstration of modern web engineering. It utilizes a monochromatic design system inspired by **Cinematic Brutalism**—prioritizing high-contrast typography, analog film grain textures, and intentional motion design while maintaining a lightweight footprint for all devices.

## 🚀 Key Features
- **Adaptive HUD:** Responsive navigation system with a velocity-decaying scroll indicator.
- **Bot-Proof Analytics:** POST-based visitor tracking with a 3-second human-verification delay.
- **Global Localization:** Integrated support for over 10 languages (English, Japanese, Hindi, etc.).
- **Cinematic Interactions:** Magnetic cursor elements and staggered text reveals.

## ❄️ Performance & Thermal Optimization
To prevent device heating and high GPU load, several advanced optimizations were implemented:
- **Throttled Listeners:** All scroll and mouse event listeners are throttled via `requestAnimationFrame` and passive event cycles.
- **Hardware Acceleration:** Animations are offloaded to the GPU using `translate3d` to reduce CPU-side paint calculations.
- **Reactive Hooks:** Components enter "Sleep Mode" when off-screen using the `IntersectionObserver API`.

## 🛠️ Technical Stack
- **Framework:** Next.js 15+ (App Router)
- **Animation:** Framer Motion, Anime.js
- **Styling:** Tailwind CSS (Custom Design Tokens)
- **Database:** Upstash Redis (Serverless KV)
- **Hosting:** Vercel

## 📂 Project Architecture
```text
src/
├── app/ api/            # Serverless visitor tracking routes
├── components/          # Modular & Optimized UI components
│   ├── ui/              # Atom-level layout elements
│   └── AnimationKit     # Throttled performance-safe animation hooks
├── context/             # Global Language and Theme providers
├── data/                # Content definitions (Profile, Projects, Quotes)
└── lib/                 # Shared utilities and Redis configuration
```

## ⚙️ Getting Started

### Prerequisites
- Node.js 18.0+
- Upstash Account (For Redis Access)

### Installation
```bash
# Clone the repository
git clone https://github.com/HarshalPatel1972/harshal-patel.git

# Install dependencies
npm install

# Start development server
npm run dev
```

## 🔒 Environment Configuration
To enable visitor tracking and persistent analytics, create a `.env.local` file:
```env
KV_REST_API_URL=your_upstash_url
KV_REST_API_TOKEN=your_upstash_token
APP_SECRET=a_stable_random_string_for_hashing
```

---
**© 2026 Harshal Patel**  
**[Visual Excellence // Technical Precision]**
