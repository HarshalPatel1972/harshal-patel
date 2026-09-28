import type { NextConfig } from "next";

// Dev needs 'unsafe-eval' (React refresh / Turbopack); a production build doesn't.
const isDev = process.env.NODE_ENV !== "production";

const csp = [
  "default-src 'self'",
  `script-src 'self' ${isDev ? "'unsafe-eval' " : ""}'unsafe-inline' https://vercel.live`,
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob: https://raw.githubusercontent.com https://raw.githack.com",
  "font-src 'self' data:",
  "connect-src 'self' https://raw.githubusercontent.com https://raw.githack.com https://vercel.live",
  "worker-src 'self' blob:",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
  "frame-src https://vercel.live",
  "upgrade-insecure-requests",
].join("; ");

const nextConfig: NextConfig = {
  experimental: {
    // Inline the (small) CSS into the HTML instead of two render-blocking stylesheet requests
    inlineCss: true,
  },
  images: {
    formats: ['image/avif', 'image/webp'],
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on'
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload'
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN'
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin'
          },
          {
            key: 'Permissions-Policy',
            value: "camera=(), microphone=(), geolocation=(), interest-cohort=()"
          },
          {
            key: 'Content-Security-Policy',
            value: csp
          }
        ]
      }
    ];
  },
};

// Only pull in the analyzer (a devDependency) when ANALYZE=true, so production installs don't need it
export default process.env.ANALYZE === "true"
  ? require("@next/bundle-analyzer")({ enabled: true })(nextConfig)
  : nextConfig;
