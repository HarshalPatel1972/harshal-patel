import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import { Big_Shoulders, DM_Serif_Display, DM_Sans, JetBrains_Mono } from "next/font/google";

import "./globals.css";
import Cursor from "@/components/ui/Cursor";
import ImageGuard from "@/components/ui/ImageGuard";
import { VelocityWarp } from "@/components/ui/VelocityWarp";

import { Providers } from "@/components/Providers";
import { ErrorBoundary } from "@/components/shared/ErrorBoundary";

const cirka = localFont({
  src: [
    {
      path: "./fonts/cirka-light.woff2",
      weight: "300",
      style: "normal",
    },
    {
      path: "./fonts/cirka-bold.woff2",
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
      path: "./fonts/season-regular.woff2",
      weight: "400",
      style: "normal",
    },
  ],
  variable: "--font-season",
  display: 'swap',
});

const victor = localFont({
  src: [
    {
      path: "./fonts/victor-serif.woff2",
      weight: "700",
      style: "normal",
    },
  ],
  variable: "--font-victor",
  display: 'swap',
});

const bigShoulders = Big_Shoulders({
  subsets: ["latin"],
  weight: ["800", "900"],
  variable: "--font-big-shoulders",
  display: "swap",
});

const dmSerif = DM_Serif_Display({
  subsets: ["latin"],
  weight: ["400"],
  style: ["normal", "italic"],
  variable: "--font-dm-serif",
  display: "swap",
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  variable: "--font-dm-sans",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-jetbrains-mono",
  display: "swap",
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
        suppressHydrationWarning
        className={`${cirka.variable} ${season.variable} ${victor.variable} ${bigShoulders.variable} ${dmSerif.variable} ${dmSans.variable} ${jetbrainsMono.variable} font-sans antialiased bg-background text-foreground select-none`}
      >
        <Providers>
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
          <div className="halftone-glow" />
          <VelocityWarp />
          <ErrorBoundary>
            {children}
          </ErrorBoundary>
        </Providers>
      </body>
    </html>
  );
}
