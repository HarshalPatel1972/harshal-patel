import type { Metadata } from "next";
import { Inter, Oswald, JetBrains_Mono, Playfair_Display, Noto_Sans_KR, Noto_Sans_TC, Teko } from "next/font/google";
import "./globals.css";
import Cursor from "@/components/ui/Cursor";
import ImageGuard from "@/components/ui/ImageGuard";


const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const oswald = Oswald({
  variable: "--font-oswald",
  subsets: ["latin"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  style: ["normal", "italic"],
  weight: ["400", "500", "600", "700", "800", "900"]
});

const notoSansKR = Noto_Sans_KR({
  variable: "--font-noto-sans-kr",
  subsets: ["latin"],
  weight: ["400", "500", "700", "900"],
});

const notoSansTC = Noto_Sans_TC({
  variable: "--font-noto-sans-tc",
  subsets: ["latin"],
  weight: ["400", "500", "700", "900"],
});

const teko = Teko({
  variable: "--font-teko",
  subsets: ["latin", "devanagari"],
  weight: ["300", "400", "500", "600", "700"],
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
    icon: "/favicon.png",
    apple: "/favicon.png",
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${inter.variable} ${oswald.variable} ${jetbrainsMono.variable} ${playfair.variable} ${notoSansKR.variable} ${notoSansTC.variable} ${teko.variable} font-sans antialiased bg-background text-foreground`}
        suppressHydrationWarning
      >
        <ImageGuard />
        {/* JSON-LD Structured Data for Google Search */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
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
                "https://www.linkedin.com/in/harshal-patel"
              ]
            })
          }}
        />
        {children}
      </body>
    </html>
  );
}
