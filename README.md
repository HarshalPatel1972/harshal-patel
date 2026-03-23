# Harshal Patel Portfolio

A high-performance, cinematic brutalist portfolio focused on aesthetic precision and thermal efficiency.

---

## Overview
This Next.js-based portfolio serves as a technical showcase. The design philosophy emphasizes **Cinematic Brutalism**, utilizing monochromatic tones, analog film grain, and hardware-accelerated animations to create a premium user experience without high resource consumption.

## Key Features
- **Thermal Optimization:** All JavaScript animation loops are throttled via `requestAnimationFrame` and passive event listeners to prevent device heating.
- **Human-only Analytics:** A robust visitor counter that uses POST signals, bot-filtering, and 3-second human-pulse delays to ignore crawlers and health-pings.
- **Adaptive HUD:** A responsive navigation system with a velocity-decaying scroll indicator for precise visual feedback.
- **Multilingual Support:** Dynamic language switching across 10+ languages (English, Japanese, Hindi, etc.).
- **Interactive Elements:** Magnetic CTA buttons, staggered text reveals, and parallax layers.

## Technical Stack
- **Framework:** [Next.js 15+](https://nextjs.org/) (App Router)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/)
- **Animation:** [Framer Motion](https://www.framer.com/motion/) & [Anime.js](https://animejs.com/)
- **Persistence:** [Upstash Redis](https://upstash.com/) (Serverless KV)
- **Deployment:** [Vercel](https://vercel.com/)

## Architecture Highlights
- `src/components/AnimationKit.tsx`: Centralized, throttled animation hooks for site-wide consistency.
- `src/app/api/visitor-count/route.ts`: A secure, bot-filtered API for identity-persistent visitor tracking.
- `src/context/LanguageContext.tsx`: Client-side state for global localization.

## Getting Started

### Prerequisites
- Node.js 18+
- An Upstash Redis account (for visitor tracking)

### Environment Variables
Create a `.env.local` file with the following keys:
```env
KV_REST_API_URL=your_upstash_url
KV_REST_API_TOKEN=your_upstash_token
APP_SECRET=a_stable_random_string_for_hashing
```

### Installation
```bash
# 1. Clone the repository
git clone https://github.com/HarshalPatel1972/harshal-patel.git

# 2. Install dependencies
npm install

# 3. Start development
npm run dev
```

## Deployment
The project is optimized for Vercel. All environment variables must be replicated in the Vercel Dashboard to enable the live visitor counter.

---
**© 2026 Harshal Patel**
