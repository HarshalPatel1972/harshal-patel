import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import "./globals.css";
import Cursor from "@/components/ui/Cursor";
import ImageGuard from "@/components/ui/ImageGuard";

const cirka = localFont({
  src: [
    {
      path: "./fonts/cirka-light.otf",
      weight: "300",
      style: "normal",
    },
    {
      path: "./fonts/cirka-bold.otf",
      weight: "700",
      style: "normal",
    },
  ],
  variable: "--font-cirka",
  display: 'swap',
});

const season = localFont({
  src: [
    {
      path: "./fonts/season-light.otf",
      weight: "300",
      style: "normal",
    },
    {
      path: "./fonts/season-regular.otf",
      weight: "400",
      style: "normal",
    },
    {
      path: "./fonts/season-medium.otf",
      weight: "500",
      style: "normal",
    },
    {
      path: "./fonts/season-bold.otf",
      weight: "700",
      style: "normal",
    },
  ],
  variable: "--font-season",
  display: 'swap',
});

const victor = localFont({
  src: [
    {
      path: "./fonts/victor-regular.otf",
      weight: "400",
      style: "normal",
    },
    {
      path: "./fonts/victor-serif.otf",
      weight: "700",
      style: "normal",
    },
  ],
  variable: "--font-victor",
  display: 'swap',
});

const luna = localFont({
  src: [
    {
      path: "./fonts/luna-heavy.otf",
      weight: "900",
      style: "normal",
    },
    {
      path: "./fonts/luna-light.otf",
      weight: "300",
      style: "normal",
    },
  ],
  variable: "--font-luna",
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    default: "Harshal Patel | Software Engineer Portfolio",
    template: "%s | Harshal Patel"
  },
  description: "Software Engineer specializing in Go, TypeScript, and WebAssembly. Explore the portfolio of Harshal Patel, focused on high-performance systems and cinematic brutalist design.",
  keywords: [
    "Harshal Patel", "Harshal Patel Portfolio", "Software Engineer", 
    "Go Developer Varanasi", "TypeScript Specialist India", "WebAssembly Engineer",
    "Chandigarh University Portfolio", "Mappa Brutalist Web Design", 
    "High-Performance Systems", "Full Stack Developer", "Backend Engineer India"
  ],
  authors: [{ name: "Harshal Patel", url: "https://github.com/HarshalPatel1972" }],
  creator: "Harshal Patel",
  publisher: "Harshal Patel",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL("https://harshal-patel-chi.vercel.app"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Harshal Patel | Software Engineer Portfolio",
    description: "Constructing High-Performance Systems with Go & WebAssembly. Explore my work.",
    url: "https://harshal-patel-chi.vercel.app",
    siteName: "Harshal Patel Portfolio",
    images: [
      {
        url: "/harshal-0.png",
        width: 1200,
        height: 630,
        alt: "Harshal Patel Portfolio Preview",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Harshal Patel | Software Engineer Portfolio",
    description: "Constructing High-Performance Systems with Go & WebAssembly.",
    creator: "@HarshalPatel",
    images: ["/harshal-0.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: [
      { url: "/favicon.png", sizes: "32x32", type: "image/png" },
      { url: "/icon.png", sizes: "192x192", type: "image/png" },
    ],
    shortcut: "/favicon.png",
    apple: "/favicon.png",
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Harshal Patel",
  },
  category: "technology",
};

export const viewport: Viewport = {
  themeColor: "#050505",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${cirka.variable} ${season.variable} ${victor.variable} ${luna.variable} font-sans antialiased bg-background text-foreground`}
        suppressHydrationWarning
      >
        <ImageGuard />
        {/* JSON-LD Structured Data for Google Search */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify([
              {
                "@context": "https://schema.org",
                "@type": "WebSite",
                "name": "Harshal Patel",
                "alternateName": ["Harshal Patel Portfolio", "Harshal Patel Engineer"],
                "url": "https://harshal-patel-chi.vercel.app"
              },
              {
                "@context": "https://schema.org",
                "@type": "Person",
                "name": "Harshal Patel",
                "url": "https://harshal-patel-chi.vercel.app",
                "jobTitle": "Software Engineer",
                "alumniOf": {
                  "@type": "CollegeOrUniversity",
                  "name": "Chandigarh University"
                },
                "description": "Software Engineer specializing in Go, TypeScript, and WebAssembly.",
                "sameAs": [
                  "https://github.com/HarshalPatel1972",
                  "https://www.linkedin.com/in/harshal-patel-59b9a5278/"
                ]
              }
            ])
          }}
        />
        <div className="cinematic-grain" />
        <div className="cursed-scanlines" />
        <div className="distorted-vignette" />
        <div className="halftone-glow" />
        {children}
      </body>
    </html>
  );
}
